const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const pool = require("../db");
const { crearLimitador } = require("../middlewares/seguridad");
const {
  smtpConfigurado,
  enviarCorreoRecuperacion
} = require("../services/email");

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

// Valores admitidos para las preferencias de lectura y color
const TAMANOS_FUENTE = ["normal", "grande", "xl"];
const TEMAS = ["proteccion", "bosque", "calido"];
const NIVELES_PERFIL = ["principiante", "intermedio", "avanzado", "protegido"];

// Limite especifico de la pantalla de Configuracion: frena los intentos de
// adivinar la contrasena actual desde los formularios de la cuenta.
const limiteCambiosCuenta = crearLimitador({
  etiqueta: "cambios-cuenta",
  maximo: Number(process.env.LIMITE_CAMBIOS_CUENTA) || 20,
  ventanaMs: 60 * 1000
});

// La recuperación de contraseña se limita con más fuerza que el resto de la
// API: un atacante no debe poder generar enlaces masivamente ni probar tokens.
const limiteSolicitudRecuperacion = crearLimitador({
  etiqueta: "solicitud-recuperacion",
  maximo: Number(process.env.LIMITE_RECUPERACION) || 5,
  ventanaMs: 15 * 60 * 1000
});

const limiteRestablecerPassword = crearLimitador({
  etiqueta: "restablecer-password",
  maximo: Number(process.env.LIMITE_RESTABLECER) || 10,
  ventanaMs: 15 * 60 * 1000
});

// Minutos de vigencia del enlace. Se acota entre 5 y 120 minutos.
const MINUTOS_RECUPERACION = Math.min(
  120,
  Math.max(5, Number(process.env.RESET_TOKEN_MINUTOS) || 30)
);

const MENSAJE_RECUPERACION =
  "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña. Revisá también la carpeta de spam.";
const MENSAJE_TOKEN_INVALIDO =
  "El enlace no es válido o venció. Pedí uno nuevo desde '¿Olvidaste tu contraseña?'.";

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

// El token que recibe la persona por correo nunca se guarda en la base:
// solo se almacena su hash SHA-256. Así, una lectura de la tabla no permite
// usar los enlaces de recuperación.
function hashTokenRecuperacion(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function construirEnlaceRecuperacion(token) {
  const porDefecto = "http://localhost:5500/code/index.html";
  const configurada = String(process.env.FRONTEND_URL || "").trim();
  let base;

  try {
    base = new URL(configurada || porDefecto);
    if (base.protocol !== "http:" && base.protocol !== "https:") {
      throw new Error("Protocolo no permitido");
    }
  } catch (error) {
    console.warn("[Recuperacion] FRONTEND_URL inválida; se usa el valor local por defecto.");
    base = new URL(porDefecto);
  }

  base.searchParams.set("reset", token);
  return base.toString();
}

// En desarrollo se puede mostrar el enlace en la respuesta para probar el
// circuito sin configurar un servidor de correo. Nunca se habilita en
// producción, aunque la variable esté puesta en true por error.
function enlaceDebugHabilitado() {
  return (
    String(process.env.RESET_DEBUG_LINK || "").toLowerCase() === "true" &&
    String(process.env.NODE_ENV || "").toLowerCase() !== "production"
  );
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
      ? "id, nombre, email, nivel_digital, tamano_fuente, tema_preferido, creado_en"
      : "id, nombre, nivel_digital, tamano_fuente, tema_preferido, creado_en";

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
      ? "id, nombre, email, nivel_digital, tamano_fuente, tema_preferido, creado_en"
      : "id, nombre, nivel_digital, tamano_fuente, tema_preferido, creado_en";

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
// POST /api/usuarios/recuperar-password
// Genera un enlace de recuperación de un solo uso.
//
// Seguridad:
// - Responde siempre lo mismo exista o no el correo (evita enumeración).
// - El token es aleatorio (32 bytes) y se guarda únicamente su hash.
// - Vence en MINUTOS_RECUPERACION y se invalida al usarse.
// - El envío por correo es opcional en desarrollo: si no hay SMTP, el enlace
//   solo se expone con RESET_DEBUG_LINK=true (nunca en producción).
// ============================================

router.post("/recuperar-password", limiteSolicitudRecuperacion, async (req, res) => {
  const { email } = req.body || {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "El correo electrónico es obligatorio" });
  }

  const emailLimpio = email.trim().toLowerCase();
  if (emailLimpio.length > LONGITUD_MAXIMA_EMAIL) {
    return res.status(400).json({ error: "El correo electrónico es demasiado largo" });
  }
  if (!EXPRESION_EMAIL.test(emailLimpio)) {
    return res.status(400).json({ error: "El correo electrónico no es válido" });
  }

  try {
    const resultado = await pool.query(
      `SELECT id, nombre, email
         FROM usuarios
        WHERE lower(btrim(email)) = lower(btrim($1))
        LIMIT 1`,
      [emailLimpio]
    );

    const usuario = resultado.rows[0];

    // Misma respuesta para un correo inexistente: no se revela si la cuenta
    // existe. La auditoría interna sí deja constancia del intento.
    if (!usuario) {
      await auditar("recuperacion_solicitada", null, "Correo no registrado", req);
      return res.status(202).json({ mensaje: MENSAJE_RECUPERACION });
    }

    const token = crypto.randomBytes(32).toString("base64url");
    const tokenHash = hashTokenRecuperacion(token);
    const enlace = construirEnlaceRecuperacion(token);

    // Un pedido nuevo invalida los enlaces anteriores de esa cuenta.
    await pool.query("DELETE FROM recuperacion_password WHERE expira_en < NOW()");
    await pool.query("DELETE FROM recuperacion_password WHERE usuario_id = $1", [usuario.id]);
    await pool.query(
      `INSERT INTO recuperacion_password (usuario_id, token_hash, expira_en, ip)
       VALUES ($1, $2, NOW() + ($3 || ' minutes')::interval, $4)`,
      [usuario.id, tokenHash, String(MINUTOS_RECUPERACION), ipDe(req)]
    );

    let enviado = false;
    if (smtpConfigurado()) {
      try {
        await enviarCorreoRecuperacion({
          destinatario: usuario.email,
          nombre: usuario.nombre,
          enlace: enlace,
          minutos: MINUTOS_RECUPERACION
        });
        enviado = true;
      } catch (errorEnvio) {
        console.error("[Recuperacion] No se pudo enviar el correo:", errorEnvio.message);
      }
    } else {
      console.warn(
        "[Recuperacion] SMTP no configurado. Configurá SMTP_* en .env o usá RESET_DEBUG_LINK=true en desarrollo."
      );
    }

    await auditar(
      "recuperacion_solicitada",
      usuario.id,
      enviado ? "Enlace enviado por correo" : "Enlace generado sin envío de correo",
      req
    );

    const respuesta = { mensaje: MENSAJE_RECUPERACION };
    if (enlaceDebugHabilitado()) {
      respuesta.resetUrl = enlace;
      respuesta.debug =
        "Enlace visible porque RESET_DEBUG_LINK=true. No usar esta opción en producción.";
    }
    res.status(202).json(respuesta);
  } catch (error) {
    console.error("Error al solicitar la recuperación de contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// POST /api/usuarios/restablecer-password
// Cambia la contraseña usando un token válido de un solo uso.
// No pide la contraseña anterior porque el enlace ya demuestra el acceso
// al correo de la cuenta.
// ============================================

router.post("/restablecer-password", limiteRestablecerPassword, async (req, res) => {
  const { token, passwordNueva } = req.body || {};

  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{40,100}$/.test(token)) {
    await auditar("recuperacion_fallida", null, "Token con formato inválido", req);
    return res.status(400).json({ error: MENSAJE_TOKEN_INVALIDO });
  }
  if (!passwordNueva || typeof passwordNueva !== "string") {
    return res.status(400).json({ error: "La nueva contraseña es obligatoria" });
  }
  if (passwordNueva.length < LONGITUD_MINIMA_PASSWORD) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }
  if (passwordNueva.length > LONGITUD_MAXIMA_PASSWORD) {
    return res.status(400).json({ error: "La contraseña no puede superar los 72 caracteres" });
  }

  const tokenHash = hashTokenRecuperacion(token);
  let cliente = null;

  try {
    cliente = await pool.connect();
    await cliente.query("BEGIN");

    // UPDATE atómico: solo el primero que use el token puede cambiarlo.
    const encontrado = await cliente.query(
      `UPDATE recuperacion_password
          SET usado_en = NOW()
        WHERE token_hash = $1
          AND usado_en IS NULL
          AND expira_en > NOW()
        RETURNING usuario_id`,
      [tokenHash]
    );

    if (encontrado.rows.length === 0) {
      await cliente.query("ROLLBACK");
      await auditar("recuperacion_fallida", null, "Token inválido, usado o vencido", req);
      return res.status(400).json({ error: MENSAJE_TOKEN_INVALIDO });
    }

    const usuarioId = encontrado.rows[0].usuario_id;
    const usuario = await cliente.query(
      "SELECT email FROM usuarios WHERE id = $1",
      [usuarioId]
    );

    if (usuario.rows.length === 0) {
      await cliente.query("ROLLBACK");
      return res.status(400).json({ error: MENSAJE_TOKEN_INVALIDO });
    }

    const nuevoHash = await bcrypt.hash(passwordNueva, COSTO_BCRYPT);
    await cliente.query(
      "UPDATE usuarios SET password_hash = $1 WHERE id = $2",
      [nuevoHash, usuarioId]
    );

    // El token ya se usó: se eliminan todos los enlaces pendientes de la cuenta.
    await cliente.query("DELETE FROM recuperacion_password WHERE usuario_id = $1", [
      usuarioId
    ]);
    // Un cambio de contraseña exitoso también limpia bloqueos por intentos fallidos.
    await cliente.query(
      "DELETE FROM intentos_login WHERE lower(btrim(email)) = lower(btrim($1))",
      [usuario.rows[0].email]
    );

    await cliente.query("COMMIT");
    await auditar(
      "recuperacion_completada",
      usuarioId,
      "Contraseña restablecida con token de un solo uso",
      req
    );

    res.json({
      mensaje: "Tu contraseña se actualizó correctamente. Ya podés iniciar sesión."
    });
  } catch (error) {
    if (cliente) {
      try {
        await cliente.query("ROLLBACK");
      } catch (errorRollback) {
        console.error("[Recuperacion] No se pudo revertir la transacción:", errorRollback.message);
      }
    }
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (cliente) cliente.release();
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

    // Mini trabajos practicos (si la tabla todavia no existe, se omiten)
    let miniTrabajos = [];
    try {
      const miniTrabajosResult = await pool.query(
        `SELECT modulo_id, nivel, completado, actualizado_en
         FROM mini_trabajos
         WHERE usuario_id = $1
         ORDER BY modulo_id, nivel`,
        [usuarioId]
      );
      miniTrabajos = miniTrabajosResult.rows;
    } catch (errorMini) {
      console.warn("[Progreso] No se pudieron leer los mini trabajos:", errorMini.message);
    }

    res.json({
      testInicial: testResult.rows[0] || null,
      examen: examenResult.rows[0] || null,
      modulos: modulosResult.rows,
      miniTrabajos: miniTrabajos
    });
  } catch (error) {
    console.error("Error al obtener progreso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// CONFIGURACION DEL USUARIO
// La pantalla de Configuracion permite cambiar el nombre de usuario,
// el correo electronico y la contrasena.
//
// Regla de seguridad: los cambios que identifican a la persona (nombre,
// correo y contrasena) exigen confirmar la contrasena actual. Asi, que
// alguien conozca el id de un usuario no alcanza para modificar su cuenta.
// ============================================

// Verifica la contrasena actual de un usuario.
// Devuelve { existe, valida } para poder distinguir errores sin filtrar datos.
async function verificarContrasenaActual(usuarioId, password) {
  if (typeof password !== "string" || password.length === 0) {
    return { existe: true, valida: false };
  }

  const resultado = await pool.query(
    "SELECT password_hash FROM usuarios WHERE id = $1",
    [usuarioId]
  );
  if (resultado.rows.length === 0) {
    return { existe: false, valida: false };
  }

  try {
    const valida = await bcrypt.compare(password, resultado.rows[0].password_hash);
    return { existe: true, valida: valida };
  } catch (error) {
    return { existe: true, valida: false };
  }
}

// Proyecta la fila de un usuario sin exponer el hash de la contrasena.
function usuarioPublico(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    email: fila.email,
    nivel_digital: fila.nivel_digital,
    tamano_fuente: fila.tamano_fuente,
    tema_preferido: fila.tema_preferido,
    creado_en: fila.creado_en
  };
}

// ============================================
// PUT /api/usuarios/:id/perfil
// Actualiza el nombre de usuario, el nivel de aprendizaje y las
// preferencias de lectura (tamaño de letra y tema de color).
// ============================================

router.put("/:id/perfil", limiteCambiosCuenta, async (req, res) => {
  const usuarioId = req.params.id;

  if (!esEnteroPositivo(usuarioId)) {
    return res.status(400).json({ error: "El id debe ser un numero entero positivo" });
  }

  const { nombre, nivel, tamanoFuente, tema, passwordActual } = req.body || {};

  if (nombre === undefined && nivel === undefined && tamanoFuente === undefined && tema === undefined) {
    return res.status(400).json({ error: "No se envio ningun dato para actualizar" });
  }

  // --- Validacion del nombre de usuario ---
  let nombreLimpio = null;
  if (nombre !== undefined) {
    if (typeof nombre !== "string") {
      return res.status(400).json({ error: "El nombre debe ser texto" });
    }
    nombreLimpio = nombre.trim();
    if (nombreLimpio.length < 2) {
      return res.status(400).json({ error: "El nombre debe tener al menos 2 caracteres" });
    }
    if (nombreLimpio.length > LONGITUD_MAXIMA_NOMBRE) {
      return res.status(400).json({ error: "El nombre no puede superar los 100 caracteres" });
    }
  }

  // --- Validacion del nivel de aprendizaje ---
  let nivelLimpio = null;
  if (nivel !== undefined && nivel !== null && nivel !== "") {
    if (typeof nivel !== "string" || !NIVELES_PERFIL.includes(nivel.trim().toLowerCase())) {
      return res.status(400).json({ error: "El nivel no es valido" });
    }
    nivelLimpio = nivel.trim().toLowerCase();
  }

  // --- Validacion de las preferencias de lectura ---
  let tamanoLimpio = null;
  if (tamanoFuente !== undefined && tamanoFuente !== null && tamanoFuente !== "") {
    if (typeof tamanoFuente !== "string" || !TAMANOS_FUENTE.includes(tamanoFuente.trim().toLowerCase())) {
      return res.status(400).json({ error: "El tamaño de letra no es valido" });
    }
    tamanoLimpio = tamanoFuente.trim().toLowerCase();
  }

  let temaLimpio = null;
  if (tema !== undefined && tema !== null && tema !== "") {
    if (typeof tema !== "string" || !TEMAS.includes(tema.trim().toLowerCase())) {
      return res.status(400).json({ error: "El tema no es valido" });
    }
    temaLimpio = tema.trim().toLowerCase();
  }

  try {
    const actual = await pool.query(
      "SELECT id, nombre, email, nivel_digital, tamano_fuente, tema_preferido, creado_en FROM usuarios WHERE id = $1",
      [usuarioId]
    );
    if (actual.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = actual.rows[0];

    // Cambiar el nombre identifica a la persona: se confirma la contrasena.
    if (nombreLimpio !== null && nombreLimpio !== usuario.nombre) {
      const verificacion = await verificarContrasenaActual(usuarioId, passwordActual);
      if (!verificacion.existe) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      if (!verificacion.valida) {
        await auditar("perfil_denegado", usuarioId, "Contrasena actual incorrecta", req);
        return res.status(401).json({ error: "La contrasena actual no es correcta" });
      }
    }

    const resultado = await pool.query(
      `UPDATE usuarios
          SET nombre = COALESCE($1, nombre),
              nivel_digital = COALESCE($2, nivel_digital),
              tamano_fuente = COALESCE($3, tamano_fuente),
              tema_preferido = COALESCE($4, tema_preferido)
        WHERE id = $5
        RETURNING id, nombre, email, nivel_digital, tamano_fuente, tema_preferido, creado_en`,
      [nombreLimpio, nivelLimpio, tamanoLimpio, temaLimpio, usuarioId]
    );

    await auditar("perfil_actualizado", usuarioId, "Datos y preferencias actualizados", req);
    res.json(usuarioPublico(resultado.rows[0]));
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// PUT /api/usuarios/:id/email
// Cambia el correo electronico de la cuenta.
// ============================================

router.put("/:id/email", limiteCambiosCuenta, async (req, res) => {
  const usuarioId = req.params.id;
  const { email, passwordActual } = req.body || {};

  if (!esEnteroPositivo(usuarioId)) {
    return res.status(400).json({ error: "El id debe ser un numero entero positivo" });
  }
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "El correo electronico es obligatorio" });
  }
  if (typeof passwordActual !== "string" || passwordActual.length === 0) {
    return res.status(400).json({ error: "Debes confirmar tu contrasena actual" });
  }

  const emailLimpio = email.trim().toLowerCase();
  if (emailLimpio.length > LONGITUD_MAXIMA_EMAIL) {
    return res.status(400).json({ error: "El correo electronico es demasiado largo" });
  }
  if (!EXPRESION_EMAIL.test(emailLimpio)) {
    return res.status(400).json({ error: "El correo electronico no es valido" });
  }

  try {
    const actual = await pool.query(
      "SELECT email FROM usuarios WHERE id = $1",
      [usuarioId]
    );
    if (actual.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (actual.rows[0].email === emailLimpio) {
      return res.status(400).json({ error: "El correo electronico es el mismo que ya usas" });
    }

    const verificacion = await verificarContrasenaActual(usuarioId, passwordActual);
    if (!verificacion.existe) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (!verificacion.valida) {
      await auditar("email_denegado", usuarioId, "Contrasena actual incorrecta", req);
      return res.status(401).json({ error: "La contrasena actual no es correcta" });
    }

    const resultado = await pool.query(
      `UPDATE usuarios SET email = $1 WHERE id = $2
       RETURNING id, nombre, email, nivel_digital, tamano_fuente, tema_preferido, creado_en`,
      [emailLimpio, usuarioId]
    );

    await auditar("email_actualizado", usuarioId, "Correo electronico actualizado", req);
    res.json(usuarioPublico(resultado.rows[0]));
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Ese correo electronico ya esta registrado" });
    }
    console.error("Error al actualizar el correo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// PUT /api/usuarios/:id/password
// Cambia la contrasena de la cuenta.
// ============================================

router.put("/:id/password", limiteCambiosCuenta, async (req, res) => {
  const usuarioId = req.params.id;
  const { passwordActual, passwordNueva } = req.body || {};

  if (!esEnteroPositivo(usuarioId)) {
    return res.status(400).json({ error: "El id debe ser un numero entero positivo" });
  }
  if (typeof passwordActual !== "string" || passwordActual.length === 0) {
    return res.status(400).json({ error: "Debes confirmar tu contrasena actual" });
  }
  if (!passwordNueva || typeof passwordNueva !== "string") {
    return res.status(400).json({ error: "La nueva contrasena es obligatoria" });
  }
  if (passwordNueva.length < LONGITUD_MINIMA_PASSWORD) {
    return res.status(400).json({ error: "La contrasena debe tener al menos 6 caracteres" });
  }
  if (passwordNueva.length > LONGITUD_MAXIMA_PASSWORD) {
    return res.status(400).json({ error: "La contrasena no puede superar los 72 caracteres" });
  }

  try {
    const verificacion = await verificarContrasenaActual(usuarioId, passwordActual);
    if (!verificacion.existe) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (!verificacion.valida) {
      await auditar("password_denegado", usuarioId, "Contrasena actual incorrecta", req);
      return res.status(401).json({ error: "La contrasena actual no es correcta" });
    }

    const nuevoHash = await bcrypt.hash(passwordNueva, COSTO_BCRYPT);
    const resultado = await pool.query(
      `UPDATE usuarios SET password_hash = $1 WHERE id = $2
       RETURNING id, nombre, email, nivel_digital, tamano_fuente, tema_preferido, creado_en`,
      [nuevoHash, usuarioId]
    );

    await auditar("password_actualizado", usuarioId, "Contrasena actualizada", req);
    res.json(usuarioPublico(resultado.rows[0]));
  } catch (error) {
    console.error("Error al actualizar la contrasena:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;