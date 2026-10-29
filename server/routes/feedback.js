/**
 * Opiniones de la experiencia - TAMI
 * --------------------------------
 * Permite calificar una pantalla (1 a 5) y dejar un comentario opcional.
 * El equipo usa estos datos para mejorar la claridad del sitio.
 */
const express = require("express");
const pool = require("../db");
const { crearLimitador } = require("../middlewares/seguridad");
const { requireAuth, requireRole } = require("../middlewares/rbac");

const router = express.Router();

const limiteFeedback = crearLimitador({
  etiqueta: "feedback",
  maximo: Number(process.env.LIMITE_FEEDBACK) || 20,
  ventanaMs: 15 * 60 * 1000
});

// POST /api/feedback
router.post("/", limiteFeedback, requireAuth(), async (req, res) => {
  const { pantalla, puntaje, comentario } = req.body || {};
  const valor = Number(puntaje);

  if (!Number.isInteger(valor) || valor < 1 || valor > 5) {
    return res.status(400).json({ error: "Elegí una puntuación de 1 a 5." });
  }

  const comentarioLimpio =
    typeof comentario === "string" ? comentario.trim().slice(0, 1000) : null;
  const pantallaLimpia =
    typeof pantalla === "string" ? pantalla.trim().slice(0, 60) : null;

  try {
    const { rows } = await pool.query(
      `INSERT INTO feedback_experiencia (usuario_id, pantalla, puntaje, comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING id, creado_en`,
      [req.usuario.id, pantallaLimpia, valor, comentarioLimpio || null]
    );
    res.status(201).json({
      mensaje: "¡Gracias por tu opinión! Nos ayuda a mejorar.",
      feedback: rows[0]
    });
  } catch (error) {
    console.error("Error al guardar la opinión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/feedback
router.get("/", requireAuth(), requireRole(["superadmin", "analista", "moderador"]), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT f.id, f.usuario_id, f.pantalla, f.puntaje, f.comentario, f.creado_en,
              u.nombre AS usuario_nombre
         FROM feedback_experiencia f
         LEFT JOIN usuarios u ON u.id = f.usuario_id
        ORDER BY f.creado_en DESC
        LIMIT 200`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar opiniones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
