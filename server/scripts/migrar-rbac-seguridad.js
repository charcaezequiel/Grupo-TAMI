require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  const schemaPath = path.join(__dirname, "..", "schema.sql");
  const rbacPath = path.join(__dirname, "rbac_seed.sql");
  
  const schema = fs.readFileSync(schemaPath, "utf8");
  const rbac = fs.readFileSync(rbacPath, "utf8");
  
  const client = await pool.connect();
  try {
    console.log("Aplicando esquema actualizado (seguridad + RBAC)...");
    await client.query(schema);
    console.log("Esquema aplicado correctamente.");
    
    console.log("Aplicando seed RBAC...");
    await client.query(rbac);
    console.log("RBAC aplicado correctamente.");
    
    console.log("\n¡Migración completada con éxito!");
  } catch (error) {
    console.error("Error en migración:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
