/**
 * Middlewares de seguridad HTTP - TAMI
 * --------------------------------
 * - Cabeceras de protección del navegador.
 * - Limitador de solicitudes por IP (sin dependencias externas).
 * - Origen permitido para CORS (solo locales + lista configurable).
 *
 * El frontend nunca habla con la base de datos: todo pasa por esta API.
 */

// ============================================
// CABECERAS DE SEGURIDAD
// ============================================

function encabezadosSeguridad(req, res, next) {
  // Que el navegador no mimea tipos de contenido (evita XSS por sniffing)
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Impide que el sitio se cargue dentro de un iframe (clickjacking)
  res.setHeader("X-Frame-Options", "DENY");
  // No enviar el referrer a sitios externos
  res.setHeader("Referrer-Policy", "no-referrer");
  // Sin permisos innecesarios: cámara, micrófono, geolocalización, etc.
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  // Los datos de la API no deben guardarse en caché (contienen datos personales)
  res.setHeader("Cache-Control", "no-store");
  // Solo aplica si en el futuro se publica por HTTPS (en HTTP los navegadores lo ignoran)
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
}

// ============================================
// LIMITADOR DE SOLICITUDES POR IP
// Ventana deslizante simple, en memoria.
// No es definitivo contra ataques distribuidos, pero frena la fuerza bruta básica.
// ============================================

function crearLimitador({ etiqueta, maximo, ventanaMs }) {
  const ventanas = new Map(); // ip -> { inicio, total }
  let ultimaLimpieza = Date.now();

  function limpiar(ahora) {
    if (ahora - ultimaLimpieza < ventanaMs * 2) return;
    ultimaLimpieza = ahora;
    ventanas.forEach(function (dato, ip) {
      if (ahora - dato.inicio > ventanaMs) ventanas.delete(ip);
    });
  }

  return function limitador(req, res, next) {
    // Los preflight de CORS no consumen cupo
    if (req.method === "OPTIONS") return next();

    const ahora = Date.now();
    limpiar(ahora);

    const ip = req.ip || (req.socket && req.socket.remoteAddress) || "desconocida";
    let dato = ventanas.get(ip);

    if (!dato || ahora - dato.inicio > ventanaMs) {
      dato = { inicio: ahora, total: 0 };
      ventanas.set(ip, dato);
    }

    dato.total += 1;

    if (dato.total > maximo) {
      const restante = Math.max(1, Math.ceil((ventanaMs - (ahora - dato.inicio)) / 1000));
      res.setHeader("Retry-After", String(restante));
      return res.status(429).json({
        error:
          "Demasiadas solicitudes desde esta conexión. Esperá " +
          restante +
          " segundos y volvé a intentar."
      });
    }

    next();
  };
}

// ============================================
// CORS RESTRINGIDO
// Solo se aceptan orígenes locales y los listados en CORS_ORIGINS.
// Así un sitio ajeno no puede consumir la API desde el navegador del usuario.
// ============================================

const ORIGENES_CONFIGURADOS = String(process.env.CORS_ORIGINS || "")
  .split(",")
  .map(function (o) {
    return o.trim();
  })
  .filter(Boolean);

function esOrigenLocal(origen) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/.test(origen);
}

function origenPermitido(origen, callback) {
  // Sin origen (curl, PostgREST, mismo host): se permite
  if (!origen) return callback(null, true);
  // "null" viene de file:// (cuando se abre index.html directamente)
  if (origen === "null") return callback(null, true);

  const permitido = esOrigenLocal(origen) || ORIGENES_CONFIGURADOS.includes(origen);

  if (!permitido) {
    console.warn("[CORS] Origen rechazado:", origen);
  }
  callback(null, permitido);
}

module.exports = {
  encabezadosSeguridad,
  crearLimitador,
  origenPermitido
};
