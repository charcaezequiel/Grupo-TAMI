/**
 * Estado de la base de datos
 * --------------------------------
 * Informe de solo lectura: rol conectado, tablas, cantidad de filas,
 * duplicados de contenido y estado de RLS (Row Level Security).
 *
 * Uso:  npm run db:estado
 *
 * No modifica nada: es una consulta informativa.
 */
const pool = require("../db");

async function main() {
  const conectado = await pool.verificarConexion();
  if (!conectado) {
    process.exitCode = 1;
    return;
  }

  // 1) Rol conectado y permisos de seguridad a nivel de rol
  const rol = await pool.query(`
    SELECT current_user AS rol,
           current_database() AS base,
           (SELECT rolsuper    FROM pg_roles WHERE rolname = current_user) AS es_super,
           (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user) AS bypasa_rls
  `);
  const r = rol.rows[0];
  console.log(
    `[Estado] rol=${r.rol} base=${r.base} superusuario=${r.es_super} BYPASSRLS=${r.bypasa_rls}`
  );

  // 2) Tablas del esquema public
  const tablas = await pool.query(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
  );
  if (tablas.rows.length === 0) {
    console.log("[Estado] No hay tablas creadas todavía. Ejecutá: npm run db:migrate");
    await pool.end();
    return;
  }
  console.log(`[Estado] Tablas (${tablas.rows.length}): ${tablas.rows.map((t) => t.tablename).join(", ")}`);

  // 3) Conteo de filas por tabla principal
  const conteo = await pool.query(`
    SELECT (SELECT count(*) FROM usuarios)             AS usuarios,
           (SELECT count(*) FROM cursos)               AS cursos,
           (SELECT count(*) FROM alertas_fraude)       AS alertas,
           (SELECT count(*) FROM inscripciones)        AS inscripciones,
           (SELECT count(*) FROM test_nivelacion)      AS tests,
           (SELECT count(*) FROM examenes)             AS examenes,
           (SELECT count(*) FROM progreso_modulos)     AS progreso
  `);
  console.log("[Estado] Filas:", JSON.stringify(conteo.rows[0]));

  // 4) Duplicados de contenido sembrado (consecuencia de migraciones repetidas)
  const cursosDup = await pool.query(`
    SELECT titulo, count(*) AS veces FROM cursos GROUP BY titulo HAVING count(*) > 1
  `);
  const alertasDup = await pool.query(`
    SELECT titulo, count(*) AS veces FROM alertas_fraude GROUP BY titulo HAVING count(*) > 1
  `);
  if (cursosDup.rows.length || alertasDup.rows.length) {
    console.log("[Estado] ⚠ Contenido duplicado (por migraciones repetidas):");
    cursosDup.rows.forEach((f) => console.log(`   - cursos: "${f.titulo}" x${f.veces}`));
    alertasDup.rows.forEach((f) => console.log(`   - alerta: "${f.titulo}" x${f.veces}`));
  } else {
    console.log("[Estado] Sin contenido duplicado. ✅");
  }

  // 5) Emails repetidos ignorando mayúsculas/minúsculas
  const emailsDup = await pool.query(`
    SELECT lower(btrim(email)) AS email, count(*) AS veces
    FROM usuarios GROUP BY 1 HAVING count(*) > 1
  `);
  if (emailsDup.rows.length) {
    console.log("[Estado] ⚠ Emails duplicados (diferencias de mayúsculas):");
    emailsDup.rows.forEach((f) => console.log(`   - "${f.email}" x${f.veces}`));
  }

  // 6) RLS activo por tabla
  const rls = await pool.query(`
    SELECT c.relname AS tabla, c.relrowsecurity AS rls
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
    ORDER BY c.relname
  `);
  const conRls = rls.rows.filter((t) => t.rls).length;
  console.log(`[Estado] RLS activo en ${conRls} de ${rls.rows.length} tablas`);
  if (conRls < rls.rows.length) {
    const falta = rls.rows.filter((t) => !t.rls).map((t) => t.tabla);
    console.log(`         Sin RLS: ${falta.join(", ")} → aplicá: npm run db:seguridad`);
  }

  // 7) Tablas de seguridad
  const seguridad = await pool.query(`
    SELECT to_regclass('public.intentos_login')   AS intentos,
           to_regclass('public.auditoria_seguridad') AS auditoria
  `);
  const s = seguridad.rows[0];
  console.log(
    `[Estado] Tablas de seguridad → intentos_login: ${s.intentos ? "sí" : "NO"}, ` +
      `auditoria_seguridad: ${s.auditoria ? "sí" : "NO"}`
  );
}

main()
  .catch((err) => {
    console.error("[Estado] Error:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
