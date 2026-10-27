const express = require("express");
const pool = require("../db");
const { requireAuth, requireRole } = require("../middlewares/rbac");

const router = express.Router();

// Solo SuperAdmin accede al panel administrativo
router.use(requireAuth(), requireRole(["superadmin"]));

// GET /api/admin/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const [usuarios, cursos, alertas, test, examenes, auditoria] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS total FROM usuarios"),
      pool.query("SELECT COUNT(*)::int AS total FROM cursos"),
      pool.query("SELECT COUNT(*)::int AS total FROM alertas_fraude"),
      pool.query("SELECT COUNT(*)::int AS total FROM test_nivelacion"),
      pool.query("SELECT COUNT(*)::int AS total FROM examenes"),
      pool.query("SELECT COUNT(*)::int AS total FROM auditoria_seguridad WHERE creado_en > NOW() - INTERVAL '24 hours'")
    ]);
    res.json({
      resumen: {
        usuarios: usuarios.rows[0].total,
        cursos: cursos.rows[0].total,
        alertas: alertas.rows[0].total,
        test_nivelacion: test.rows[0].total,
        examenes: examenes.rows[0].total,
        auditoria_24h: auditoria.rows[0].total
      },
      usuario: req.usuario
    });
  } catch (error) {
    console.error("Error en dashboard admin:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/admin/usuarios
router.get("/usuarios", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.nivel_digital, u.is_active, u.role_id, u.twofa_enabled,
              u.last_login_at, u.creado_en, r.name AS role_name
         FROM usuarios u
         LEFT JOIN roles r ON r.id = u.role_id
        ORDER BY u.id`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar usuarios admin:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /api/admin/usuarios/:id/rol
router.put("/usuarios/:id/rol", async (req, res) => {
  const usuarioId = req.params.id;
  const { role_id } = req.body || {};
  if (!/^\d+$/.test(String(usuarioId)) || !/^\d+$/.test(String(role_id))) {
    return res.status(400).json({ error: "role_id debe ser un número entero válido" });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE usuarios SET role_id = $1 WHERE id = $2
       RETURNING id, nombre, email, role_id`,
      [role_id, usuarioId]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ mensaje: "Rol actualizado correctamente", usuario: rows[0] });
  } catch (error) {
    console.error("Error al asignar rol:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /api/admin/usuarios/:id/estado
router.put("/usuarios/:id/estado", async (req, res) => {
  const usuarioId = req.params.id;
  const { is_active } = req.body || {};
  if (!/^\d+$/.test(String(usuarioId))) {
    return res.status(400).json({ error: "ID inválido" });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE usuarios SET is_active = $1 WHERE id = $2
       RETURNING id, nombre, email, is_active`,
      [Boolean(is_active), usuarioId]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ mensaje: "Estado actualizado correctamente", usuario: rows[0] });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/admin/roles
router.get("/roles", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM roles ORDER BY id");
    res.json(rows);
  } catch (error) {
    console.error("Error al listar roles:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/admin/auditoria
router.get("/auditoria", async (req, res) => {
  try {
    const limite = Math.min(200, Math.max(10, Number(req.query.limite) || 50));
    const { rows } = await pool.query(
      `SELECT a.id, a.usuario_id, u.nombre, u.email, a.accion, a.detalle, a.ip, a.user_agent, a.creado_en
         FROM auditoria_seguridad a
         LEFT JOIN usuarios u ON u.id = a.usuario_id
        ORDER BY a.creado_en DESC
        LIMIT $1`,
      [limite]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar auditoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
