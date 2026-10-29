/**
 * Middlewares RBAC - TAMI
 * --------------------------------
 * Autenticación y autorización basada en roles/permisos.
 * - requireAuth: exige un token JWT válido en `Authorization: Bearer`.
 * - requireRole: verifica que el usuario tenga uno de los roles permitidos.
 * - requirePermission: verifica permisos granulares por código.
 * - requirePropioOAdmin: permite acceder solo a los datos de la propia cuenta
 *   (o a cualquier cuenta si el rol es superadmin).
 *
 * La identidad sale SIEMPRE del token firmado: no se acepta `x-usuario-id`
 * ni un id enviado por el cliente.
 */

const pool = require("../db");
const { extraerToken, verificarToken } = require("./auth");

const ROLES_ADMINISTRADORES = ["superadmin"];

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

async function cargarUsuarioDesdeToken(req) {
  const token = extraerToken(req);
  if (!token) {
    return { error: "No autenticado. Iniciá sesión para continuar.", status: 401 };
  }
  const datos = verificarToken(token);
  if (!datos || !datos.sub) {
    return { error: "La sesión venció o no es válida. Volvé a iniciar sesión.", status: 401 };
  }
  const usuario = await cargarUsuarioConRol(datos.sub);
  if (!usuario) {
    return { error: "La cuenta ya no existe. Volvé a iniciar sesión.", status: 401 };
  }
  if (usuario.is_active === false) {
    return { error: "Cuenta desactivada. Contactá al administrador.", status: 403 };
  }
  return { usuario };
}

function requireAuth() {
  return async function (req, res, next) {
    try {
      const resultado = await cargarUsuarioDesdeToken(req);
      if (resultado.error) {
        return res.status(resultado.status).json({ error: resultado.error });
      }
      req.usuario = resultado.usuario;
      req.user = resultado.usuario;
      next();
    } catch (error) {
      console.error("[RBAC] Error en requireAuth:", error.message);
      res.status(500).json({ error: "Error interno de autorización." });
    }
  };
}

// Adjunta el usuario si viene un token válido, pero no bloquea el pedido.
// Se usa en formularios públicos (ayuda, opiniones) que también aceptan
// personas que todavía no tienen cuenta.
function autenticacionOpcional() {
  return async function (req, res, next) {
    try {
      const resultado = await cargarUsuarioDesdeToken(req);
      if (!resultado.error) {
        req.usuario = resultado.usuario;
        req.user = resultado.usuario;
      }
    } catch (error) {
      console.warn("[RBAC] Token opcional inválido:", error.message);
    }
    next();
  };
}

function requireRole(rolesPermitidos = []) {
  const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];
  const rolesLower = roles.filter(Boolean).map((r) => String(r).toLowerCase());
  return async function (req, res, next) {
    try {
      if (!req.usuario) {
        const resultado = await cargarUsuarioDesdeToken(req);
        if (resultado.error) {
          return res.status(resultado.status).json({ error: resultado.error });
        }
        req.usuario = resultado.usuario;
        req.user = resultado.usuario;
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
        const resultado = await cargarUsuarioDesdeToken(req);
        if (resultado.error) {
          return res.status(resultado.status).json({ error: resultado.error });
        }
        req.usuario = resultado.usuario;
        req.user = resultado.usuario;
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

// Permite el acceso cuando el id de la ruta es el del usuario autenticado.
// Los superadmins pueden consultar cualquier cuenta (soporte y auditoría).
function requirePropioOAdmin(parametro = "id") {
  return function (req, res, next) {
    const objetivo = Number(req.params[parametro]);
    if (!Number.isInteger(objetivo) || objetivo <= 0) {
      return res.status(400).json({ error: "El id debe ser un número entero positivo" });
    }
    if (!req.usuario) {
      return res.status(401).json({ error: "No autenticado. Iniciá sesión para continuar." });
    }
    const propio = Number(req.usuario.id);
    if (objetivo === propio) return next();
    const rol = req.usuario.role_name ? String(req.usuario.role_name).toLowerCase() : "";
    if (ROLES_ADMINISTRADORES.includes(rol)) return next();
    return res.status(403).json({ error: "No podés acceder a los datos de otra cuenta." });
  };
}

module.exports = {
  requireAuth,
  requireRole,
  requirePermission,
  requirePropioOAdmin,
  autenticacionOpcional,
  cargarUsuarioConRol,
  ROLES_ADMINISTRADORES
};
