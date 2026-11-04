/*
 * Respaldo de la base de TAMI con pg_dump.
 *
 * Uso:
 *   npm run db:respaldo            → respaldo completo en backups/
 *   npm run db:respaldo:esquema    → solo estructura, sin datos
 *
 * Requiere que pg_dump esté instalado y que DATABASE_URL esté en server/.env.
 * No imprime credenciales: solo la ruta del archivo generado.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const soloEsquema = process.argv.includes("--esquema");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Falta DATABASE_URL en server/.env. No se puede respaldar.");
  process.exit(1);
}

let conexion;
try {
  conexion = new URL(databaseUrl);
} catch (error) {
  console.error("DATABASE_URL no tiene un formato válido.");
  process.exit(1);
}

const carpeta = path.join(__dirname, "..", "backups");
fs.mkdirSync(carpeta, { recursive: true });

const sello = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\..+$/, "")
  .replace("T", "-");
const nombre = "tami-" + sello + (soloEsquema ? "-esquema" : "") + ".sql";
const destino = path.join(carpeta, nombre);

const argumentos = [
  "--host=" + conexion.hostname,
  "--port=" + (conexion.port || "5432"),
  "--username=" + decodeURIComponent(conexion.username),
  "--dbname=" + decodeURIComponent(conexion.pathname.replace(/^\//, "")),
  "--no-owner",
  "--no-privileges",
  "--format=plain",
  "--file=" + destino
];

if (soloEsquema) argumentos.push("--schema-only");

const resultado = spawnSync("pg_dump", argumentos, {
  stdio: "inherit",
  env: Object.assign({}, process.env, {
    PGPASSWORD: decodeURIComponent(conexion.password || ""),
    PGSSLMODE: process.env.PGSSLMODE || "require"
  })
});

if (resultado.error) {
  console.error("No se pudo ejecutar pg_dump:", resultado.error.message);
  console.error("Instalá las herramientas de PostgreSQL y volvé a intentar.");
  process.exit(1);
}

if (resultado.status !== 0) {
  console.error("pg_dump terminó con código", resultado.status);
  process.exit(resultado.status || 1);
}

const tamano = fs.statSync(destino).size;
console.log("Respaldo creado:", destino, "(" + Math.round(tamano / 1024) + " KB)");
