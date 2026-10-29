/**
 * Promover una cuenta a superadministrador
 * --------------------------------
 * Uso:
 *   npm run admin:promover -- correo@ejemplo.com
 *   npm run admin:promover -- --listar
 *
 * Solo asigna el rol "superadmin" si el rol existe en la tabla roles.
 * No cambia contraseñas ni otros datos.
 */
const pool = require("../db");

async function listar() {
  const { rows } = await pool.query(
    `SELECT u.id, u.nombre, u.email, u.is_active, r.name AS rol
       FROM usuarios u LEFT JOIN roles r ON r.id = u.role_id
      ORDER BY u.id`
  );
  console.table(rows);
}

async function promover(email) {
  const correo = String(email || "").trim().toLowerCase();
  if (!correo) {
    console.error("[Admin] Indicá el correo: npm run admin:promover -- correo@ejemplo.com");
    process.exitCode = 1;
    return;
  }

  const rol = await pool.query("SELECT id FROM roles WHERE lower(name) = 'superadmin' LIMIT 1");
  if (rol.rows.length === 0) {
    console.error("[Admin] No existe el rol superadmin. Ejecutá primero: npm run db:rbac");
    process.exitCode = 1;
    return;
  }

  const { rows } = await pool.query(
    `UPDATE usuarios SET role_id = $1
      WHERE lower(btrim(email)) = lower(btrim($2))
      RETURNING id, nombre, email`,
    [rol.rows[0].id, correo]
  );

  if (rows.length === 0) {
    console.error("[Admin] No se encontró una cuenta con ese correo.");
    process.exitCode = 1;
    return;
  }

  console.log(`[Admin] ${rows[0].nombre} (${rows[0].email}) ahora es superadministrador.`);
}

async function main() {
  const argumento = process.argv[2];
  if (!argumento || argumento === "--listar") {
    await listar();
    return;
  }
  await promover(argumento);
}

main()
  .catch((error) => {
    console.error("[Admin] Error:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
