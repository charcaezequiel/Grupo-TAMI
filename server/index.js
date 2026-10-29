require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const { verificarConexion } = require("./db");
const {
  encabezadosSeguridad,
  crearLimitador,
  origenPermitido
} = require("./middlewares/seguridad");
const usuariosRoutes = require("./routes/usuarios");
const cursosRoutes = require("./routes/cursos");
const alertasRoutes = require("./routes/alertas");
const progresoRoutes = require("./routes/progreso");
const adminRoutes = require("./routes/admin");
const ayudaRoutes = require("./routes/ayuda");
const feedbackRoutes = require("./routes/feedback");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const RAIZ = path.join(__dirname, "..");

// ============================================
// ENDURECIMIENTO BÁSICO DEL SERVIDOR
// ============================================

// No exponer la tecnología del backend
app.disable("x-powered-by");

// Si algún día corre detrás de un proxy/balanceador, activar TRUST_PROXY=true
// para que req.ip refleje la IP real (necesario para los límites por IP).
if (String(process.env.TRUST_PROXY || "").toLowerCase() === "true") {
  app.set("trust proxy", 1);
}

// Cabeceras de seguridad en todas las respuestas
app.use(encabezadosSeguridad);

// CORS restringido: solo orígenes locales o los declarados en CORS_ORIGINS
app.use(
  cors({
    origin: origenPermitido,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"]
  })
);

// ============================================
// LÍMITES DE SOLICITUDES (rate limiting)
// ============================================

const limiteGlobal = crearLimitador({
  etiqueta: "global",
  maximo: Number(process.env.LIMITE_GLOBAL) || 300,
  ventanaMs: 60 * 1000
});

const limiteAuth = crearLimitador({
  etiqueta: "auth",
  maximo: Number(process.env.LIMITE_AUTH) || 30,
  ventanaMs: 60 * 1000
});

app.use("/api", limiteGlobal);
app.use("/api/usuarios/login", limiteAuth);
app.use("/api/usuarios/registrar", limiteAuth);

// Cuerpo JSON acotado: evita que envíen payloads gigantes
app.use(express.json({ limit: "100kb" }));

// ============================================
// RUTAS
// ============================================

// El frontend se sirve desde el mismo servidor: así la API queda en el
// mismo origen y no hace falta configurar CORS en producción.
app.use(express.static(path.join(RAIZ, "code")));
app.use("/img", express.static(path.join(RAIZ, "img")));

app.get("/", (req, res) => {
  res.sendFile(path.join(RAIZ, "code", "index.html"));
});

app.get("/api/salud", async (req, res) => {
  const baseDeDatos = await verificarConexion();
  res.status(baseDeDatos ? 200 : 503).json({
    estado: baseDeDatos ? "ok" : "degradado",
    baseDeDatos: baseDeDatos ? "ok" : "sin conexión",
    hora: new Date().toISOString()
  });
});

app.get("/api", (req, res) => {
  res.json({ nombre: "TAMI API", estado: "ok", version: "1.1.0", autenticacion: "JWT Bearer" });
});

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/alertas", alertasRoutes);
app.use("/api/progreso", progresoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ayuda", ayudaRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejador de errores: NUNCA devuelve el detalle interno ni el stack
app.use((err, req, res, next) => {
  console.error("[API] Error no controlado:", err.message);
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "El contenido enviado es demasiado grande" });
  }
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "El cuerpo de la solicitud no es JSON válido" });
  }
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor TAMI escuchando en http://localhost:${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}/  ·  Panel: http://localhost:${PORT}/admin.html`);
  if (String(process.env.JWT_SECRET || "").trim().length < 32) {
    console.warn("[Seguridad] JWT_SECRET no configurado o demasiado corto: los inicios de sesión fallarán.");
  }
  verificarConexion();
});
