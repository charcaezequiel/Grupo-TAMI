/**
 * Tokens de sesión (JWT) - TAMI
 * --------------------------------
 * La API ya no confía en un encabezado con el id del usuario: la identidad
 * viaja firmada en un token Bearer. Así nadie puede hacerse pasar por otra
 * persona cambiando una cabecera desde el navegador.
 *
 * Variables de entorno:
 *   JWT_SECRET            clave de firma (mínimo 32 caracteres)
 *   JWT_DURACION_MINUTOS  vigencia del token (por defecto 12 horas)
 */
const jwt = require("jsonwebtoken");

const EMISOR = "tami";
const DURACION_MINUTOS = Math.min(
  7 * 24 * 60,
  Math.max(5, Number(process.env.JWT_DURACION_MINUTOS) || 720)
);

function claveDeFirma() {
  const clave = String(process.env.JWT_SECRET || "").trim();
  return clave.length >= 32 ? clave : null;
}

function firmarToken(usuario) {
  const clave = claveDeFirma();
  if (!clave) {
    throw new Error("JWT_SECRET no configurado (mínimo 32 caracteres)");
  }
  return jwt.sign(
    {
      rol: usuario.role_name || null,
      nombre: usuario.nombre || null
    },
    clave,
    {
      subject: String(usuario.id),
      issuer: EMISOR,
      expiresIn: DURACION_MINUTOS * 60
    }
  );
}

function extraerToken(req) {
  const cabecera = String(req.get("authorization") || "");
  const partes = cabecera.split(" ");
  if (partes.length === 2 && /^Bearer$/i.test(partes[0])) {
    return partes[1].trim() || null;
  }
  return null;
}

function verificarToken(token) {
  const clave = claveDeFirma();
  if (!clave || !token) return null;
  try {
    return jwt.verify(token, clave, { issuer: EMISOR });
  } catch (error) {
    return null;
  }
}

module.exports = {
  firmarToken,
  extraerToken,
  verificarToken,
  DURACION_MINUTOS
};
