const express = require("express");
const pool = require("../db");

const router = express.Router();

// ============================================
// POST /api/progreso/test
// Guarda el resultado del test de nivelación
// ============================================

router.post("/test", async (req, res) => {
  const { usuarioId, respuestas, nivel, puntaje, totalPreguntas } = req.body;

  if (!usuarioId || !respuestas || !nivel || puntaje === undefined || !totalPreguntas) {
    return res.status(400).json({ error: "Faltan campos obligatorios: usuarioId, respuestas, nivel, puntaje, totalPreguntas" });
  }

  try {
    // Guarda el test
    const resultado = await pool.query(
      `INSERT INTO test_nivelacion (usuario_id, respuestas, nivel, puntaje, total_preguntas)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nivel, puntaje, total_preguntas, creado_en`,
      [usuarioId, JSON.stringify(respuestas), nivel, puntaje, totalPreguntas]
    );

    // Actualiza el nivel del usuario
    await pool.query(
      "UPDATE usuarios SET nivel_digital = $1 WHERE id = $2",
      [nivel.toLowerCase(), usuarioId]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al guardar test:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// POST /api/progreso/examen
// Guarda el resultado de un examen post-lección
// ============================================

router.post("/examen", async (req, res) => {
  const { usuarioId, moduloId, respuestas, puntaje, totalPreguntas } = req.body;

  if (!usuarioId || !respuestas || puntaje === undefined || !totalPreguntas) {
    return res.status(400).json({ error: "Faltan campos obligatorios: usuarioId, respuestas, puntaje, totalPreguntas" });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO examenes (usuario_id, modulo_id, respuestas, puntaje, total_preguntas)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, puntaje, total_preguntas, modulo_id, creado_en`,
      [usuarioId, moduloId || null, JSON.stringify(respuestas), puntaje, totalPreguntas]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al guardar examen:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// POST /api/progreso/modulo
// Guarda o actualiza el progreso en un módulo
// ============================================

router.post("/modulo", async (req, res) => {
  const { usuarioId, moduloId, pasoActual, completado } = req.body;

  if (!usuarioId || moduloId === undefined) {
    return res.status(400).json({ error: "Faltan campos obligatorios: usuarioId, moduloId" });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO progreso_modulos (usuario_id, modulo_id, paso_actual, completado, actualizado_en)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (usuario_id, modulo_id)
       DO UPDATE SET
         paso_actual = EXCLUDED.paso_actual,
         completado = EXCLUDED.completado,
         actualizado_en = NOW()
       RETURNING id, modulo_id, paso_actual, completado, actualizado_en`,
      [usuarioId, moduloId, pasoActual || 0, completado || false]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al guardar progreso del módulo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// GET /api/progreso/:usuarioId
// Obtiene todo el progreso de un usuario
// ============================================

router.get("/:usuarioId", async (req, res) => {
  const usuarioId = req.params.usuarioId;

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
