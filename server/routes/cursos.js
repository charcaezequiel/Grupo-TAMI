const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, titulo, descripcion, nivel, duracion_min, activo FROM cursos WHERE activo = TRUE ORDER BY id"
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al listar cursos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, titulo, descripcion, nivel, duracion_min, activo FROM cursos WHERE id = $1",
      [req.params.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al obtener curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
