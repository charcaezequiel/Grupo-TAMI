/**
 * Migración a Supabase
 * --------------------------------
 * Ejecuta `schema.sql` (tablas + datos iniciales) contra la base de
 * Supabase configurada en `.env`.
 *
 * Uso:  npm run db:migrate
 *
 * Es idempotente: usa CREATE TABLE IF NOT EXISTS e INSERT ... ON CONFLICT,
 * por lo que se puede correr más de una vez sin duplicar nada.
 */
const fs = require("fs");
const path = require("path");
const pool = require("../db");

async function main() {
  const conectado = await pool.verificarConexion();
  if (!conectado) {
    process.exitCode = 1;
    return;
  }

  const archivoSql = path.join(__dirname, "..", "schema.sql");
  const sql = fs.readFileSync(archivoSql, "utf8");

  console.log("[DB] Aplicando schema.sql ...");
  await pool.query(sql);

  const { rows } = await pool.query(
    `SELECT (SELECT count(*) FROM cursos)          AS cursos,
            (SELECT count(*) FROM alertas_fraude)  AS alertas,
            (SELECT count(*) FROM usuarios)        AS usuarios`
  );
  console.log(
    `[DB] Esquema listo → cursos: ${rows[0].cursos}, alertas: ${rows[0].alertas}, usuarios: ${rows[0].usuarios}`
  );
}

main()
  .catch((err) => {
    console.error("[DB] Error en la migración:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
