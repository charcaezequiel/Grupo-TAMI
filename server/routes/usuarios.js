const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();

// Se define el costo del hash bcrypt (12 rondas).
// Se eligió 12 para equilibrar seguridad y rendimiento en hardware estándar.
const COSTO_BCRYPT = 12;

// Expresión regular para validar formato de email.
// Se valida que no contenga espacios y que tenga la estructura basica@dominio.ext
const EXPRESION_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Longitud minima de contraseña exigida por la US-001
const LONGITUD_MINIMA_PASSWORD = 6;

// ============================================
// GET /api/usuarios
// Retorna todos los usuarios sin exponer datos sensibles
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
// Retorna un usuario especifico por su ID
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
// Registra un nuevo usuario con hashing irreversible (bcrypt)
//
// Se reemplazó SHA-256 por bcrypt porque:
// 1. SHA-256 es un hash rapido, vulnerable a rainbow tables
// 2. bcrypt aplica salt automatico y es resistente a fuerza bruta
// 3. El costo configurable (costoBcrypt) ajusta el tiempo de hash
// ============================================

router.post("/registrar", async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validacion: campos obligatorios
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "nombre, email y password son obligatorios" });
  }

  // Validacion: nombre con longitud razonable
  const nombreLimpio = nombre.trim();
  if (nombreLimpio.length < 2) {
    return res.status(400).json({ error: "El nombre debe tener al menos 2 caracteres" });
  }

  // Validacion: formato de email
  if (!EXPRESION_EMAIL.test(email)) {
    return res.status(400).json({ error: "El correo electronico no es valido" });
  }

  // Validacion: longitud minima de contrasena
  if (password.length < LONGITUD_MINIMA_PASSWORD) {
    return res.status(400).json({ error: "La contrasena debe tener al menos 6 caracteres" });
  }

  try {
    // Se hashea la contrasena con bcrypt antes de almacenarla.
    // Nunca se guarda la contrasena en texto plano.
    const passwordHash = await bcrypt.hash(password, COSTO_BCRYPT);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, nivel_digital)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, nivel_digital, creado_en`,
      [nombreLimpio, email.trim().toLowerCase(), passwordHash, "principiante"]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    // Codigo 23505 = violacion de constraint UNIQUE en PostgreSQL
    if (error.code === "23505") {
      return res.status(409).json({ error: "El email ya esta registrado" });
    }
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// POST /api/usuarios/login
// Verifica credenciales usando comparacion segura de bcrypt
//
// bcrypt.compare() aplica el mismo salt del hash almacenado
// y verifica si la contrasena ingresada coincide.
// No hay timing attack posible porque bcrypt es constante en tiempo.
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
      return res.status(401).json({ error: "No se encontro una cuenta con ese correo" });
    }

    const usuario = resultado.rows[0];

    // Compara la contrasena ingresada con el hash almacenado.
    // bcrypt extrae el salt del hash y lo reutiliza para la comparacion.
    const contrasenaValida = await bcrypt.compare(password, usuario.password_hash);

    if (!contrasenaValida) {
      return res.status(401).json({ error: "La contrasena es incorrecta" });
    }

    // Se omite password_hash en la respuesta por seguridad
    const { password_hash, ...usuarioSinPassword } = usuario;
    res.json(usuarioSinPassword);
  } catch (error) {
    console.error("Error al iniciar sesion:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// GET /api/usuarios/:id/progreso
// Retorna el progreso completo del usuario:
// test inicial, examen y modulos completados
// ============================================

router.get("/:id/progreso", async (req, res) => {
  const usuarioId = req.params.id;

  try {
    const testResult = await pool.query(
      `SELECT nivel, puntaje, total_preguntas, creado_en
       FROM test_nivelacion
       WHERE usuario_id = $1
       ORDER BY creado_en DESC LIMIT 1`,
      [usuarioId]
    );

    const examenResult = await pool.query(
      `SELECT puntaje, total_preguntas, modulo_id, creado_en
       FROM examenes
       WHERE usuario_id = $1
       ORDER BY creado_en DESC LIMIT 1`,
      [usuarioId]
    );

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
