/*
 * Smoke test de TAMI (solo lectura).
 * Uso: npm run smoke
 * Variable opcional: SMOKE_URL (por defecto http://localhost:3000)
 */
const BASE = String(process.env.SMOKE_URL || "http://localhost:3000").replace(/\/$/, "");

const pruebas = [
  {
    nombre: "Salud de la API y base de datos",
    pedido: () => fetch(BASE + "/api/salud"),
    validar: async (res) => {
      const datos = await res.json();
      return res.status === 200 && datos.estado === "ok" && datos.baseDeDatos === "ok";
    }
  },
  {
    nombre: "Frontend servido en /",
    pedido: () => fetch(BASE + "/"),
    validar: async (res) => {
      const texto = await res.text();
      return res.status === 200 && texto.includes("TAMI");
    }
  },
  {
    nombre: "Manifest PWA",
    pedido: () => fetch(BASE + "/manifest.json"),
    validar: async (res) => {
      const datos = await res.json();
      return res.status === 200 && datos.name && datos.start_url;
    }
  },
  {
    nombre: "Service worker",
    pedido: () => fetch(BASE + "/sw.js"),
    validar: async (res) => {
      const texto = await res.text();
      return res.status === 200 && texto.includes("VERSION");
    }
  },
  {
    nombre: "Catálogo de 5 cursos",
    pedido: () => fetch(BASE + "/api/cursos"),
    validar: async (res) => {
      const datos = await res.json();
      return res.status === 200 && Array.isArray(datos) && datos.length === 5;
    }
  },
  {
    nombre: "Panel admin protegido sin token",
    pedido: () => fetch(BASE + "/api/admin/dashboard"),
    validar: (res) => res.status === 401
  },
  {
    nombre: "Solicitudes de ayuda protegidas sin token",
    pedido: () => fetch(BASE + "/api/ayuda"),
    validar: (res) => res.status === 401
  },
  {
    nombre: "Login inválido devuelve mensaje genérico",
    pedido: () =>
      fetch(BASE + "/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "smoke-no-existe@tami.test",
          password: "clave-invalida-smoke"
        })
      }),
    validar: (res) => res.status === 401
  },
  {
    nombre: "Feedback exige sesión",
    pedido: () =>
      fetch(BASE + "/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pantalla: "smoke", puntaje: 5 })
      }),
    validar: (res) => res.status === 401
  }
];

(async () => {
  console.log("Smoke test TAMI → " + BASE + "\n");
  let fallas = 0;

  for (const prueba of pruebas) {
    try {
      const respuesta = await prueba.pedido();
      const correcta = await prueba.validar(respuesta);
      console.log((correcta ? "OK   " : "FALLA") + " · " + prueba.nombre);
      if (!correcta) {
        fallas += 1;
        console.log("       status recibido: " + respuesta.status);
      }
    } catch (error) {
      fallas += 1;
      console.log("FALLA · " + prueba.nombre + " → " + error.message);
    }
  }

  console.log("\n" + (pruebas.length - fallas) + "/" + pruebas.length + " verificaciones correctas.");
  process.exit(fallas === 0 ? 0 : 1);
})();
