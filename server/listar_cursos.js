require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query("SELECT * FROM cursos ORDER BY id").then(r=>{
  console.log(JSON.stringify(r.rows, null, 2));
  process.exit(0);
}).catch(e=>{
  console.error(e.message);
  process.exit(1);
});
