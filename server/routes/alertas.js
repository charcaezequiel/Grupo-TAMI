const express = require("express");
const pool = require("../db");

const router = express.Router();

// ============================================
// GET /api/alertas
// Lista todas las alertas de fraude
// ============================================

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, titulo, descripcion, que_hacer, severidad, icono, creado_en FROM alertas_fraude ORDER BY creado_en DESC"
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al listar alertas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
