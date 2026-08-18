require("dotenv").config();
const express = require("express");
const cors = require("cors");

const usuariosRoutes = require("./routes/usuarios");
const cursosRoutes = require("./routes/cursos");
const alertasRoutes = require("./routes/alertas");
const progresoRoutes = require("./routes/progreso");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ nombre: "TAMI API", estado: "ok", version: "1.0.0" });
});

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/alertas", alertasRoutes);
app.use("/api/progreso", progresoRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor TAMI escuchando en http://localhost:${PORT}`);
});
