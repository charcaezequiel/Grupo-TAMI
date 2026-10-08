const { Pool } = require("pg");
require("dotenv").config();

// Supabase exige conexiones cifradas (SSL). En el pooler de Supabase el
// certificado no está en el almacén de confianzas de Node, por eso se
// acepta sin validar el emisor (`rejectUnauthorized: false`).
const sslHabilitado = String(process.env.DB_SSL || "true").toLowerCase() !== "false";

const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: sslHabilitado ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "postgres",
      ssl: sslHabilitado ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool(config);

// Falla rápido y con un mensaje claro si la base no responde
pool.on("error", (err) => {
  console.error("[DB] Error inesperado en el pool de conexiones:", err.message);
});

async function verificarConexion() {
  try {
    const { rows } = await pool.query(
      "SELECT current_database() AS db, current_user AS usuario, version() AS version"
    );
    console.log(
      `[DB] Conectado a Supabase → ${rows[0].db} @ ${rows[0].usuario}`
    );
    return true;
  } catch (err) {
    console.error("[DB] No se pudo conectar a Supabase:", err.message);
    return false;
  }
}

module.exports = pool;
module.exports.verificarConexion = verificarConexion;
