const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, nombre, email, telefono, nivel_digital, creado_en FROM usuarios ORDER BY id"
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, nombre, email, telefono, nivel_digital, creado_en FROM usuarios WHERE id = $1",
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

router.post("/", async (req, res) => {
  const { nombre, email, telefono, nivel_digital } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ error: "nombre y email son obligatorios" });
  }
  try {
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, email, telefono, nivel_digital)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, telefono, nivel_digital`,
      [nombre, email, telefono, nivel_digital || "principiante"]
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

module.exports = router;
