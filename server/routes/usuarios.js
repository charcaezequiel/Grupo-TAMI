const express = require("express");
const crypto = require("crypto");
const pool = require("../db");

const router = express.Router();

// ============================================
// UTILIDADES DE HASHING
// Se usa un hash SHA-256 para no guardar
// contraseñas en texto plano en la base de datos.
// En producción se usaría bcrypt o argon2.
// ============================================

function simularHash(texto) {
  return crypto.createHash("sha256").update(texto).digest("hex");
}

// ============================================
// GET /api/usuarios
// Lista todos los usuarios (sin passwords)
// ============================================

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, nombre, email, nivel_digital, creado_en FROM usuarios ORDER BY id"
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// GET /api/usuarios/:id
// Obtiene un usuario por ID
// ============================================

router.get("/:id", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, nombre, email, nivel_digital, creado_en FROM usuarios WHERE id = $1",
      [req.params.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// POST /api/usuarios/registrar
// Registra un nuevo usuario con password hasheado
// ============================================

router.post("/registrar", async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "nombre, email y password son obligatorios" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "El correo electrónico no es válido" });
  }

  try {
    const passwordHash = simularHash(password);
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, nivel_digital)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, nivel_digital, creado_en`,
      [nombre.trim(), email.trim().toLowerCase(), passwordHash, "principiante"]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "El email ya está registrado" });
    }
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// POST /api/usuarios/login
// Inicia sesión verificando email y password
// ============================================

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email y password son obligatorios" });
  }

  try {
    const resultado = await pool.query(
      "SELECT id, nombre, email, password_hash, nivel_digital, creado_en FROM usuarios WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: "No se encontró una cuenta con ese correo" });
    }

    const usuario = resultado.rows[0];
    const hashIngresado = simularHash(password);

    if (hashIngresado !== usuario.password_hash) {
      return res.status(401).json({ error: "La contraseña es incorrecta" });
    }

    // No envía el password_hash al cliente
    const { password_hash, ...usuarioSinPassword } = usuario;
    res.json(usuarioSinPassword);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// GET /api/usuarios/:id/progreso
// Obtiene el progreso completo de un usuario:
// test inicial, examen, módulos completados
// ============================================

router.get("/:id/progreso", async (req, res) => {
  const usuarioId = req.params.id;

  try {
    // Test de nivelación más reciente
    const testResult = await pool.query(
      `SELECT nivel, puntaje, total_preguntas, creado_en
       FROM test_nivelacion
       WHERE usuario_id = $1
       ORDER BY creado_en DESC LIMIT 1`,
      [usuarioId]
    );

    // Examen más reciente
    const examenResult = await pool.query(
      `SELECT puntaje, total_preguntas, modulo_id, creado_en
       FROM examenes
       WHERE usuario_id = $1
       ORDER BY creado_en DESC LIMIT 1`,
      [usuarioId]
    );

    // Módulos completados
    const modulosResult = await pool.query(
      `SELECT modulo_id, paso_actual, completado, actualizado_en
       FROM progreso_modulos
       WHERE usuario_id = $1
       ORDER BY modulo_id`,
      [usuarioId]
    );

    res.json({
      testInicial: testResult.rows[0] || null,
      examen: examenResult.rows[0] || null,
      modulos: modulosResult.rows
    });
  } catch (error) {
    console.error("Error al obtener progreso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
