/**
 * Solicitudes de ayuda - TAMI
 * --------------------------------
 * Formulario público de contacto y bandeja de entrada para el equipo.
 * Cualquier persona puede escribir, tenga o no una cuenta.
 */
const express = require("express");
const pool = require("../db");
const { crearLimitador } = require("../middlewares/seguridad");
const {
  requireAuth,
  requireRole,
  autenticacionOpcional
} = require("../middlewares/rbac");

const router = express.Router();

const CATEGORIAS = ["general", "cuenta", "curso", "accesibilidad", "seguridad"];
const ESTADOS = ["pendiente", "en_proceso", "resuelto"];
const EXPRESION_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const limiteAyuda = crearLimitador({
  etiqueta: "solicitudes-ayuda",
  maximo: Number(process.env.LIMITE_AYUDA) || 10,
  ventanaMs: 15 * 60 * 1000
});

function ipDe(req) {
  return req.ip || (req.socket && req.socket.remoteAddress) || null;
}

// POST /api/ayuda
router.post("/", limiteAyuda, autenticacionOpcional(), async (req, res) => {
  const { nombre, email, mensaje, categoria } = req.body || {};

  if (typeof nombre !== "string" || typeof email !== "string" || typeof mensaje !== "string") {
    return res.status(400).json({ error: "Nombre, correo y mensaje son obligatorios." });
  }

  const nombreLimpio = nombre.trim();
  const emailLimpio = email.trim().toLowerCase();
  const mensajeLimpio = mensaje.trim();
  const categoriaLimpia = CATEGORIAS.includes(String(categoria || "").toLowerCase())
    ? String(categoria).toLowerCase()
    : "general";

  if (nombreLimpio.length < 2 || nombreLimpio.length > 100) {
    return res.status(400).json({ error: "El nombre debe tener entre 2 y 100 caracteres." });
  }
  if (emailLimpio.length > 254 || !EXPRESION_EMAIL.test(emailLimpio)) {
    return res.status(400).json({ error: "El correo electrónico no es válido." });
  }
  if (mensajeLimpio.length < 5) {
    return res.status(400).json({ error: "Contanos un poco más: el mensaje es muy corto." });
  }
  if (mensajeLimpio.length > 2000) {
    return res.status(400).json({ error: "El mensaje no puede superar los 2000 caracteres." });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO solicitudes_ayuda (usuario_id, nombre, email, categoria, mensaje)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, creado_en`,
      [req.usuario ? req.usuario.id : null, nombreLimpio, emailLimpio, categoriaLimpia, mensajeLimpio]
    );

    try {
      await pool.query(
        "INSERT INTO auditoria_seguridad (usuario_id, accion, detalle, ip) VALUES ($1, $2, $3, $4)",
        [req.usuario ? req.usuario.id : null, "ayuda_solicitada", "Solicitud #" + rows[0].id, ipDe(req)]
      );
    } catch (errorAuditoria) {
      console.warn("[Ayuda] No se pudo auditar:", errorAuditoria.message);
    }

    res.status(201).json({
      mensaje:
        "Recibimos tu mensaje. Te vamos a responder al correo que nos dejaste. Gracias por escribirnos."
    });
  } catch (error) {
    console.error("Error al guardar la solicitud de ayuda:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/ayuda?estado=pendiente
router.get("/", requireAuth(), requireRole(["superadmin", "moderador", "analista"]), async (req, res) => {
  const estado = String(req.query.estado || "").toLowerCase();
  const filtro = ESTADOS.includes(estado) ? estado : null;

  try {
    const { rows } = await pool.query(
      `SELECT s.id, s.usuario_id, s.nombre, s.email, s.categoria, s.mensaje,
              s.estado, s.creado_en, s.atendido_en,
              u.nombre AS usuario_nombre
         FROM solicitudes_ayuda s
         LEFT JOIN usuarios u ON u.id = s.usuario_id
        WHERE ($1::text IS NULL OR lower(s.estado) = $1)
        ORDER BY s.creado_en DESC
        LIMIT 200`,
      [filtro]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar solicitudes de ayuda:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /api/ayuda/:id/estado
router.put(
  "/:id/estado",
  requireAuth(),
  requireRole(["superadmin", "moderador"]),
  async (req, res) => {
    const id = Number(req.params.id);
    const estado = String((req.body || {}).estado || "").toLowerCase();

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    try {
      const { rows } = await pool.query(
        `UPDATE solicitudes_ayuda
            SET estado = $1,
                atendido_en = CASE WHEN $1 = 'resuelto' THEN NOW() ELSE atendido_en END
          WHERE id = $2
          RETURNING id, estado, atendido_en`,
        [estado, id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: "Solicitud no encontrada" });
      }
      res.json({ mensaje: "Estado actualizado", solicitud: rows[0] });
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

module.exports = router;
