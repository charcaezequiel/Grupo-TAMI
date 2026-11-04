const test = require("node:test");
const assert = require("node:assert/strict");

process.env.CORS_ORIGINS = "https://tami.example";

const {
  encabezadosSeguridad,
  crearLimitador,
  origenPermitido
} = require("../middlewares/seguridad");

function respuestaFalsa() {
  return {
    cabeceras: {},
    estado: 200,
    cuerpo: null,
    setHeader(nombre, valor) {
      this.cabeceras[String(nombre).toLowerCase()] = valor;
    },
    status(codigo) {
      this.estado = codigo;
      return this;
    },
    json(datos) {
      this.cuerpo = datos;
      return this;
    }
  };
}

test("las cabeceras incluyen CSP estricta y protecciones del navegador", () => {
  const res = respuestaFalsa();
  let siguiente = false;

  encabezadosSeguridad({ path: "/api/salud" }, res, () => {
    siguiente = true;
  });

  const csp = res.cabeceras["content-security-policy"];
  assert.equal(siguiente, true);
  assert.match(csp, /script-src 'self'/);
  assert.doesNotMatch(csp, /script-src[^;]*unsafe-inline/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.equal(res.cabeceras["x-frame-options"], "DENY");
  assert.equal(res.cabeceras["x-content-type-options"], "nosniff");
  assert.equal(res.cabeceras["x-permitted-cross-domain-policies"], "none");
  assert.equal(res.cabeceras["cache-control"], "no-store, no-cache, must-revalidate, private");
});

test("el HTML y los assets se revalidan sin bloquear la caché del navegador", () => {
  const res = respuestaFalsa();

  encabezadosSeguridad({ path: "/index.html" }, res, () => {});

  assert.equal(res.cabeceras["cache-control"], "no-cache");
  assert.equal(res.cabeceras.pragma, undefined);
});

test("el limitador permite el cupo y bloquea el excedente con Retry-After", () => {
  const limitador = crearLimitador({ etiqueta: "prueba", maximo: 2, ventanaMs: 60000 });
  const req = { method: "GET", ip: "10.0.0.7", socket: { remoteAddress: "10.0.0.7" } };
  let pasos = 0;

  for (let i = 0; i < 2; i += 1) {
    const res = respuestaFalsa();
    limitador(req, res, () => {
      pasos += 1;
    });
    assert.equal(res.estado, 200);
  }

  const bloqueada = respuestaFalsa();
  limitador(req, bloqueada, () => {
    pasos += 1;
  });

  assert.equal(pasos, 2);
  assert.equal(bloqueada.estado, 429);
  assert.ok(bloqueada.cabeceras["retry-after"]);
  assert.match(bloqueada.cuerpo.error, /Demasiadas solicitudes/);
});

test("las peticiones OPTIONS no consumen cupo", () => {
  const limitador = crearLimitador({ etiqueta: "preflight", maximo: 1, ventanaMs: 60000 });
  const req = { method: "OPTIONS", ip: "10.0.0.8", socket: { remoteAddress: "10.0.0.8" } };
  let pasos = 0;

  for (let i = 0; i < 5; i += 1) {
    limitador(req, respuestaFalsa(), () => {
      pasos += 1;
    });
  }

  assert.equal(pasos, 5);
});

test("CORS acepta orígenes locales y configurados, y rechaza el resto", () => {
  const resultados = [];
  origenPermitido("http://localhost:3000", (error, permitido) => resultados.push(permitido));
  origenPermitido("https://tami.example", (error, permitido) => resultados.push(permitido));
  origenPermitido("https://malicioso.example", (error, permitido) => resultados.push(permitido));
  origenPermitido(null, (error, permitido) => resultados.push(permitido));

  assert.deepEqual(resultados, [true, true, false, true]);
});
