require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  const sqlPath = path.join(__dirname, "rbac_seed.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  const client = await pool.connect();
  try {
    console.log("Aplicando seed RBAC...");
    await client.query(sql);
    console.log("RBAC aplicado correctamente.");
  } catch (error) {
    console.error("Error al aplicar RBAC:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
