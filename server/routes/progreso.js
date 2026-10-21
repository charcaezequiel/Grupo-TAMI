const express = require("express");
const pool = require("../db");

const router = express.Router();

// Niveles digitales aceptados en la base (evita enviar valores arbitrarios)
const NIVELES_VALIDOS = ["principiante", "intermedio", "avanzado", "protegido"];

// Niveles admitidos en los mini trabajos practicos
const NIVELES_MINI_TRABAJO = ["principiante", "intermedio", "avanzado"];

// ============================================
// VALIDACIONES
// ============================================

function esEnteroPositivo(valor) {
  return /^\d+$/.test(String(valor)) && Number(valor) > 0;
}

function esEnteroNoNegativo(valor) {
  return Number.isInteger(Number(valor)) && Number(valor) >= 0 && String(valor).trim() !== "";
}

// Responde 404 cuando el usuario referenciado no existe (error de clave foranea)
function esUsuarioInexistente(error) {
  return error.code === "23503";
}

// Obtiene los mini trabajos del usuario. Si la tabla todavia no existe
// (base sin migrar) devuelve una lista vacia en lugar de romper la pantalla.
async function obtenerMiniTrabajos(usuarioId) {
  try {
    const resultado = await pool.query(
      `SELECT modulo_id, nivel, completado, actualizado_en
         FROM mini_trabajos
        WHERE usuario_id = $1
        ORDER BY modulo_id, nivel`,
      [usuarioId]
    );
    return resultado.rows;
  } catch (error) {
    console.warn("[Progreso] No se pudieron leer los mini trabajos:", error.message);
    return [];
  }
}

// ============================================
// POST /api/progreso/test
// Guarda el resultado del test de nivelación
// ============================================

router.post("/test", async (req, res) => {
  const { usuarioId, respuestas, nivel, puntaje, totalPreguntas } = req.body;

  if (!usuarioId || !respuestas || !nivel || puntaje === undefined || !totalPreguntas) {
    return res.status(400).json({ error: "Faltan campos obligatorios: usuarioId, respuestas, nivel, puntaje, totalPreguntas" });
  }
  if (!esEnteroPositivo(usuarioId)) {
    return res.status(400).json({ error: "usuarioId debe ser un numero entero positivo" });
  }
  if (!Array.isArray(respuestas)) {
    return res.status(400).json({ error: "respuestas debe ser una lista" });
  }
  if (typeof nivel !== "string" || !NIVELES_VALIDOS.includes(nivel.trim().toLowerCase())) {
    return res.status(400).json({ error: "El nivel enviado no es valido" });
  }
  if (!esEnteroNoNegativo(puntaje) || !esEnteroPositivo(totalPreguntas)) {
    return res.status(400).json({ error: "puntaje y totalPreguntas deben ser numeros validos" });
  }

  try {
    // Guarda el test
    const resultado = await pool.query(
      `INSERT INTO test_nivelacion (usuario_id, respuestas, nivel, puntaje, total_preguntas)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nivel, puntaje, total_preguntas, creado_en`,
      [usuarioId, JSON.stringify(respuestas), nivel.trim(), Number(puntaje), Number(totalPreguntas)]
    );

    // Actualiza el nivel del usuario
    await pool.query(
      "UPDATE usuarios SET nivel_digital = $1 WHERE id = $2",
      [nivel.trim().toLowerCase(), usuarioId]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (esUsuarioInexistente(error)) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
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
  if (!esEnteroPositivo(usuarioId)) {
    return res.status(400).json({ error: "usuarioId debe ser un numero entero positivo" });
  }
  if (moduloId !== undefined && moduloId !== null && !esEnteroPositivo(moduloId)) {
    return res.status(400).json({ error: "moduloId debe ser un numero entero positivo" });
  }
  if (!Array.isArray(respuestas)) {
    return res.status(400).json({ error: "respuestas debe ser una lista" });
  }
  if (!esEnteroNoNegativo(puntaje) || !esEnteroPositivo(totalPreguntas)) {
    return res.status(400).json({ error: "puntaje y totalPreguntas deben ser numeros validos" });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO examenes (usuario_id, modulo_id, respuestas, puntaje, total_preguntas)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, puntaje, total_preguntas, modulo_id, creado_en`,
      [usuarioId, moduloId || null, JSON.stringify(respuestas), Number(puntaje), Number(totalPreguntas)]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (esUsuarioInexistente(error)) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
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

  if (!usuarioId || !moduloId) {
    return res.status(400).json({ error: "Faltan campos obligatorios: usuarioId, moduloId" });
  }
  if (!esEnteroPositivo(usuarioId) || !esEnteroPositivo(moduloId)) {
    return res.status(400).json({ error: "usuarioId y moduloId deben ser numeros enteros positivos" });
  }
  if (pasoActual !== undefined && !esEnteroNoNegativo(pasoActual)) {
    return res.status(400).json({ error: "pasoActual debe ser un numero entero no negativo" });
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
      [usuarioId, moduloId, Number(pasoActual) || 0, Boolean(completado)]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (esUsuarioInexistente(error)) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    console.error("Error al guardar progreso del módulo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// POST /api/progreso/mini-trabajo
// Guarda (o actualiza) el estado de un mini trabajo practico
// de un modulo segun el nivel del usuario.
// ============================================

router.post("/mini-trabajo", async (req, res) => {
  const { usuarioId, moduloId, nivel, completado } = req.body;

  if (!usuarioId || !moduloId || !nivel) {
    return res.status(400).json({ error: "Faltan campos obligatorios: usuarioId, moduloId, nivel" });
  }
  if (!esEnteroPositivo(usuarioId) || !esEnteroPositivo(moduloId)) {
    return res.status(400).json({ error: "usuarioId y moduloId deben ser numeros enteros positivos" });
  }
  if (typeof nivel !== "string" || !NIVELES_MINI_TRABAJO.includes(nivel.trim().toLowerCase())) {
    return res.status(400).json({ error: "El nivel enviado no es valido" });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO mini_trabajos (usuario_id, modulo_id, nivel, completado, actualizado_en)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (usuario_id, modulo_id, nivel)
       DO UPDATE SET
         completado = EXCLUDED.completado,
         actualizado_en = NOW()
       RETURNING id, modulo_id, nivel, completado, actualizado_en`,
      [usuarioId, moduloId, nivel.trim().toLowerCase(), Boolean(completado)]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (esUsuarioInexistente(error)) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    console.error("Error al guardar el mini trabajo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ============================================
// GET /api/progreso/:usuarioId
// Obtiene todo el progreso de un usuario
// ============================================

router.get("/:usuarioId", async (req, res) => {
  const usuarioId = req.params.usuarioId;

  if (!esEnteroPositivo(usuarioId)) {
    return res.status(400).json({ error: "El id debe ser un numero entero positivo" });
  }

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
      modulos: modulosResult.rows,
      miniTrabajos: await obtenerMiniTrabajos(usuarioId)
    });
  } catch (error) {
    console.error("Error al obtener progreso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
