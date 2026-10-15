const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();

// Se define el costo del hash bcrypt (12 rondas).
// Se eligio 12 para equilibrar seguridad y rendimiento en hardware estandar.
const COSTO_BCRYPT = 12;

// Expresion regular para validar formato de email.
// Se valida que no contenga espacios y que tenga la estructura basica@dominio.ext
const EXPRESION_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Limites de validacion (evitan datos basura y abusos)
const LONGITUD_MINIMA_PASSWORD = 6;
const LONGITUD_MAXIMA_PASSWORD = 72; // bcrypt solo usa los primeros 72 bytes
const LONGITUD_MAXIMA_NOMBRE = 100;
const LONGITUD_MAXIMA_EMAIL = 254;

// Proteccion contra fuerza bruta (por correo)
const MAX_INTENTOS_FALLIDOS = Number(process.env.MAX_INTENTOS_LOGIN) || 5;
const VENTANA_BLOQUEO_MINUTOS = Number(process.env.VENTANA_BLOQUEO_LOGIN) || 15;

// Mensaje unico de credenciales: NO revela si el correo existe o no
// (evita la enumeracion de cuentas).
const MENSAJE_CREDENCIALES = "El correo o la contrasena es incorrecta";

// ============================================
// UTILIDADES DE SEGURIDAD
// ============================================

function ipDe(req) {
  return req.ip || (req.socket && req.socket.remoteAddress) || null;
}

function esEnteroPositivo(valor) {
  return /^\d+$/.test(String(valor)) && Number(valor) > 0;
}

// Comparacion de claves en tiempo constante (evita timing attacks)
function clavesIguales(a, b) {
  const hashA = crypto.createHash("sha256").update(String(a)).digest();
  const hashB = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

// Indica si la solicitud trae la clave de administracion valida.
// Si ADMIN_KEY no esta configurada, no se considera administrador.
function esAdministrador(req) {
  const claveConfigurada = process.env.ADMIN_KEY;
  if (!claveConfigurada) return false;
  const enviada = req.get("x-api-key");
  if (!enviada) return false;
  return clavesIguales(enviada, claveConfigurada);
}

// Hash de relleno: se compara cuando el correo no existe para que el tiempo de
// respuesta sea parecido al de una cuenta real (evita enumeracion por timing).
let hashRelleno = null;
async function obtenerHashRelleno() {
  if (!hashRelleno) {
    hashRelleno = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), COSTO_BCRYPT);
  }
  return hashRelleno;
}

// Registra un evento en la auditoria de seguridad. Nunca interrumpe el flujo
// del usuario (si la tabla no existe, solo avisa por consola).
async function auditar(accion, usuarioId, detalle, req) {
  try {
    await pool.query(
      "INSERT INTO auditoria_seguridad (usuario_id, accion, detalle, ip) VALUES ($1, $2, $3, $4)",
      [usuarioId || null, accion, detalle || null, ipDe(req)]
    );
  } catch (error) {
    console.warn("[Auditoria] No se pudo registrar el evento:", error.message);
  }
}

// Cantidad de intentos fallidos recientes para un correo
async function contarIntentosFallidos(email) {
  try {
    const { rows } = await pool.query(
      `SELECT count(*)::int AS total
         FROM intentos_login
        WHERE exito = FALSE
          AND creado_en > NOW() - ($1 || ' minutes')::interval
          AND lower(btrim(email)) = lower(btrim($2))`,
      [String(VENTANA_BLOQUEO_MINUTOS), email]
    );
    return rows[0].total;
  } catch (error) {
    console.warn("[Seguridad] No se pudo consultar intentos_login:", error.message);
    return 0;
  }
}

// Guarda un intento de acceso y limpia los registros muy antiguos
async function registrarIntento(email, req, exito, motivo) {
  try {
    await pool.query(
      `WITH limpieza AS (
         DELETE FROM intentos_login WHERE creado_en < NOW() - INTERVAL '30 days'
       )
       INSERT INTO intentos_login (email, ip, exito, motivo) VALUES ($1, $2, $3, $4)`,
      [email, ipDe(req), exito, motivo || null]
    );
  } catch (error) {
    console.warn("[Seguridad] No se pudo registrar el intento:", error.message);
  }
}

// Al iniciar sesion correctamente se descartan los fallos previos
async function limpiarIntentosFallidos(email) {
  try {
    await pool.query(
      "DELETE FROM intentos_login WHERE exito = FALSE AND lower(btrim(email)) = lower(btrim($1))",
      [email]
    );
  } catch (error) {
    console.warn("[Seguridad] No se pudieron limpiar los intentos:", error.message);
  }
}

// ============================================
// GET /api/usuarios
// Lista usuarios. Sin clave de administracion NO expone los correos.
// ============================================

router.get("/", async (req, res) => {
  try {
    const admin = esAdministrador(req);
    const campos = admin
      ? "id, nombre, email, nivel_digital, creado_en"
      : "id, nombre, nivel_digital, creado_en";

    const resultado = await pool.query(`SELECT ${campos} FROM usuarios ORDER BY id`);
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// GET /api/usuarios/:id
// Retorna un usuario especifico (sin correo salvo administrador).
// ============================================

router.get("/:id", async (req, res) => {
  if (!esEnteroPositivo(req.params.id)) {
    return res.status(400).json({ error: "El id debe ser un numero entero positivo" });
  }

  try {
    const admin = esAdministrador(req);
    const campos = admin
      ? "id, nombre, email, nivel_digital, creado_en"
      : "id, nombre, nivel_digital, creado_en";

    const resultado = await pool.query(
      `SELECT ${campos} FROM usuarios WHERE id = $1`,
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
// Se reemplazo SHA-256 por bcrypt porque:
// 1. SHA-256 es un hash rapido, vulnerable a rainbow tables
// 2. bcrypt aplica salt automatico y es resistente a fuerza bruta
// 3. El costo configurable (COSTO_BCRYPT) ajusta el tiempo de hash
// ============================================

router.post("/registrar", async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validacion: campos obligatorios y de tipo texto
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "nombre, email y password son obligatorios" });
  }
  if (typeof nombre !== "string" || typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "nombre, email y password deben ser texto" });
  }

  const nombreLimpio = nombre.trim();
  const emailLimpio = email.trim().toLowerCase();

  // Validacion: nombre con longitud razonable
  if (nombreLimpio.length < 2) {
    return res.status(400).json({ error: "El nombre debe tener al menos 2 caracteres" });
  }
  if (nombreLimpio.length > LONGITUD_MAXIMA_NOMBRE) {
    return res.status(400).json({ error: "El nombre no puede superar los 100 caracteres" });
  }

  // Validacion: formato y longitud de email
  if (emailLimpio.length > LONGITUD_MAXIMA_EMAIL) {
    return res.status(400).json({ error: "El correo electronico es demasiado largo" });
  }
  if (!EXPRESION_EMAIL.test(emailLimpio)) {
    return res.status(400).json({ error: "El correo electronico no es valido" });
  }

  // Validacion: longitud de contrasena (bcrypt usa hasta 72 bytes)
  if (password.length < LONGITUD_MINIMA_PASSWORD) {
    return res.status(400).json({ error: "La contrasena debe tener al menos 6 caracteres" });
  }
  if (password.length > LONGITUD_MAXIMA_PASSWORD) {
    return res.status(400).json({ error: "La contrasena no puede superar los 72 caracteres" });
  }

  try {
    // Se hashea la contrasena con bcrypt antes de almacenarla.
    // Nunca se guarda la contrasena en texto plano.
    const passwordHash = await bcrypt.hash(password, COSTO_BCRYPT);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, nivel_digital)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, nivel_digital, creado_en`,
      [nombreLimpio, emailLimpio, passwordHash, "principiante"]
    );

    await auditar("registro", resultado.rows[0].id, "Nuevo usuario registrado", req);
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
// Verifica credenciales usando comparacion segura de bcrypt.
//
// Medidas de seguridad:
// - Bloqueo temporal tras varios intentos fallidos (fuerza bruta).
// - Mensaje unico de error (no revela si el correo existe).
// - Comparacion de relleno cuando el correo no existe (evita timing).
// - Auditoria de cada intento.
// ============================================

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email y password son obligatorios" });
  }
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "email y password deben ser texto" });
  }

  const emailLimpio = email.trim().toLowerCase();

  // Verificacion de bloqueo por intentos fallidos
  const intentosFallidos = await contarIntentosFallidos(emailLimpio);
  if (intentosFallidos >= MAX_INTENTOS_FALLIDOS) {
    await auditar("acceso_denegado", null, "Bloqueo temporal por intentos fallidos", req);
    return res.status(429).json({
      error:
        "Demasiados intentos fallidos. Espera " +
        VENTANA_BLOQUEO_MINUTOS +
        " minutos y volve a intentar."
    });
  }

  try {
    const resultado = await pool.query(
      "SELECT id, nombre, email, password_hash, nivel_digital, creado_en FROM usuarios WHERE email = $1",
      [emailLimpio]
    );

    const usuario = resultado.rows[0];

    // Cuenta inexistente: se compara igual contra un hash de relleno para que
    // el tiempo de respuesta no delate si el correo esta registrado.
    if (!usuario) {
      await bcrypt.compare(password, await obtenerHashRelleno());
      await registrarIntento(emailLimpio, req, false, "correo_inexistente");
      await auditar("login_fallido", null, "Correo inexistente", req);
      return res.status(401).json({ error: MENSAJE_CREDENCIALES });
    }

    // Compara la contrasena ingresada con el hash almacenado.
    // bcrypt extrae el salt del hash y lo reutiliza para la comparacion.
    let contrasenaValida = false;
    try {
      contrasenaValida = await bcrypt.compare(password, usuario.password_hash);
    } catch (error) {
      await auditar("password_hash_error", usuario.id, "Hash invalido almacenado", req);
      return res.status(401).json({ error: MENSAJE_CREDENCIALES });
    }

    if (!contrasenaValida) {
      await registrarIntento(emailLimpio, req, false, "contrasena_incorrecta");
      await auditar("login_fallido", usuario.id, "Contrasena incorrecta", req);
      return res.status(401).json({ error: MENSAJE_CREDENCIALES });
    }

    // Ingreso correcto: se descartan los fallos previos y se audita el acceso.
    await limpiarIntentosFallidos(emailLimpio);
    await registrarIntento(emailLimpio, req, true, null);
    await auditar("login_exitoso", usuario.id, "Inicio de sesion correcto", req);

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

  if (!esEnteroPositivo(usuarioId)) {
    return res.status(400).json({ error: "El id debe ser un numero entero positivo" });
  }

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
