/**
 * Middlewares RBAC - TAMI
 * --------------------------------
 * Autenticación y autorización basada en roles/permisos.
 * - requireAuth: verifica que el usuario esté autenticado (por ahora basado en cabecera o sesión futura).
 * - requireRole: verifica que el usuario tenga uno de los roles permitidos.
 * - requirePermission: verifica permisos granulares por código.
 */

const pool = require("../db");

function obtenerUsuarioId(req) {
  // Soporta múltiples formas para facilitar la transición
  if (req.usuario && (req.usuario.id || req.usuario.usuario_id)) {
    return req.usuario.id || req.usuario.usuario_id;
  }
  if (req.user && (req.user.id || req.user.usuario_id)) {
    return req.user.id || req.user.usuario_id;
  }
  if (req.headers["x-usuario-id"]) {
    return req.headers["x-usuario-id"];
  }
  if (req.query && req.query.usuarioId) {
    return req.query.usuarioId;
  }
  return null;
}

async function cargarUsuarioConRol(usuarioId) {
  const { rows } = await pool.query(
    `SELECT u.id, u.nombre, u.email, u.is_active, u.role_id, r.name AS role_name
       FROM usuarios u
       LEFT JOIN roles r ON r.id = u.role_id
      WHERE u.id = $1`,
    [usuarioId]
  );
  return rows[0] || null;
}

function requireAuth() {
  return async function (req, res, next) {
    try {
      const usuarioId = obtenerUsuarioId(req);
      if (!usuarioId) {
        return res.status(401).json({ error: "No autenticado. Se requiere iniciar sesión." });
      }
      const usuario = await cargarUsuarioConRol(usuarioId);
      if (!usuario) {
        return res.status(401).json({ error: "Usuario no encontrado o sesión inválida." });
      }
      if (usuario.is_active === false) {
        return res.status(403).json({ error: "Cuenta desactivada. Contactá al administrador." });
      }
      req.usuario = usuario;
      req.user = usuario;
      next();
    } catch (error) {
      console.error("[RBAC] Error en requireAuth:", error.message);
      res.status(500).json({ error: "Error interno de autorización." });
    }
  };
}

function requireRole(rolesPermitidos = []) {
  const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];
  const rolesLower = roles.filter(Boolean).map((r) => String(r).toLowerCase());
  return async function (req, res, next) {
    try {
      if (!req.usuario) {
        const usuarioId = obtenerUsuarioId(req);
        if (!usuarioId) {
          return res.status(401).json({ error: "No autenticado. Se requiere iniciar sesión." });
        }
        const usuario = await cargarUsuarioConRol(usuarioId);
        if (!usuario) {
          return res.status(401).json({ error: "Usuario no encontrado o sesión inválida." });
        }
        if (usuario.is_active === false) {
          return res.status(403).json({ error: "Cuenta desactivada. Contactá al administrador." });
        }
        req.usuario = usuario;
        req.user = usuario;
      }
      const rolUsuario = req.usuario.role_name ? String(req.usuario.role_name).toLowerCase() : null;
      if (!rolUsuario || !rolesLower.includes(rolUsuario)) {
        return res.status(403).json({ error: "Acceso denegado. No tenés permisos para esta sección." });
      }
      next();
    } catch (error) {
      console.error("[RBAC] Error en requireRole:", error.message);
      res.status(500).json({ error: "Error interno de autorización." });
    }
  };
}

function requirePermission(codigosPermitidos = []) {
  const codigos = Array.isArray(codigosPermitidos) ? codigosPermitidos : [codigosPermitidos];
  return async function (req, res, next) {
    try {
      if (!req.usuario) {
        const usuarioId = obtenerUsuarioId(req);
        if (!usuarioId) {
          return res.status(401).json({ error: "No autenticado. Se requiere iniciar sesión." });
        }
        const usuario = await cargarUsuarioConRol(usuarioId);
        if (!usuario) {
          return res.status(401).json({ error: "Usuario no encontrado o sesión inválida." });
        }
        if (usuario.is_active === false) {
          return res.status(403).json({ error: "Cuenta desactivada. Contactá al administrador." });
        }
        req.usuario = usuario;
        req.user = usuario;
      }
      if (!req.usuario.role_id) {
        return res.status(403).json({ error: "Acceso denegado. No tenés permisos para esta acción." });
      }
      if (codigos.length === 0) return next();
      const { rows } = await pool.query(
        `SELECT 1
           FROM role_permissions rp
           JOIN permissions p ON p.id = rp.permission_id
          WHERE rp.role_id = $1 AND p.code = ANY($2)
          LIMIT 1`,
        [req.usuario.role_id, codigos]
      );
      if (rows.length === 0) {
        return res.status(403).json({ error: "Acceso denegado. No tenés el permiso requerido." });
      }
      next();
    } catch (error) {
      console.error("[RBAC] Error en requirePermission:", error.message);
      res.status(500).json({ error: "Error interno de autorización." });
    }
  };
}

module.exports = {
  requireAuth,
  requireRole,
  requirePermission,
  cargarUsuarioConRol,
  obtenerUsuarioId
};
