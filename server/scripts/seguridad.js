/**
 * Endurecimiento de la base de datos - TAMI
 * --------------------------------
 * Aplica, de forma idempotente, una capa de seguridad sobre Supabase:
 *
 *  1. Revoca el acceso de los roles públicos de Supabase (`anon` y
 *     `authenticated`) al esquema `public`, a las tablas y a las secuencias.
 *     El frontend NUNCA habla con la base: todo pasa por la API. Así, aunque
 *     alguien obtenga la `anon key`, no puede leer ni escribir datos.
 *  2. Habilita RLS (Row Level Security) en todas las tablas y crea una política
 *     que solo autoriza al rol de la aplicación.
 *  3. Exige un correo único ignorando mayúsculas/minúsculas
 *     (`UNIQUE (lower(btrim(email)))`) para impedir cuentas duplicadas.
 *  4. Agrega CHECK constraints de integridad (validando antes los datos
 *     existentes para no romper filas antiguas).
 *  5. Crea las tablas de seguridad `intentos_login` (fuerza bruta) y
 *     `auditoria_seguridad` (registro de eventos). La tabla
 *     `recuperacion_password` se crea con `db:migrate` y también queda
 *     protegida por RLS.
 *  6. Crea el trigger que mantiene `progreso_modulos.actualizado_en`.
 *
 * Uso:  npm run db:seguridad
 *
 * Es seguro ejecutarlo varias veces: verifica antes de crear y no borra datos.
 */
const pool = require("../db");

const resumen = [];
function registrar(estado, mensaje) {
  const icono = estado === "ok" ? "✅" : estado === "aviso" ? "⚠️ " : "ℹ️ ";
  resumen.push(`${icono} ${mensaje}`);
  console.log(`[Seguridad] ${icono} ${mensaje}`);
}

// Cita un identificador de PostgreSQL de forma segura ("tabla", "rol", ...)
function citar(nombre) {
  return '"' + String(nombre).replace(/"/g, '""') + '"';
}

async function existeRol(nombre) {
  const { rows } = await pool.query("SELECT 1 FROM pg_roles WHERE rolname = $1", [nombre]);
  return rows.length > 0;
}

async function tablasPublicas() {
  const { rows } = await pool.query(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
  );
  return rows.map((r) => r.tablename);
}

// Agrega una CHECK constraint solo si no existe y si ningún dato actual la viola.
async function agregarCheck(tabla, nombre, condicion) {
  const existeTabla = (await pool.query("SELECT to_regclass($1) AS t", [`public.${tabla}`])).rows[0].t;
  if (!existeTabla) return;

  const ya = await pool.query(
    `SELECT 1 FROM pg_constraint WHERE conname = $1 AND conrelid = $2::regclass`,
    [nombre, `public.${tabla}`]
  );
  if (ya.rows.length > 0) return;

  // Una CHECK falla cuando la expresión da FALSE (NULL = pasa).
  const viola = await pool.query(
    `SELECT count(*)::int AS c FROM public.${citar(tabla)} WHERE (${condicion}) IS FALSE`
  );
  if (viola.rows[0].c > 0) {
    registrar("aviso", `${tabla}.${nombre} no se aplicó: ${viola.rows[0].c} fila(s) existentes la violan`);
    return;
  }

  await pool.query(
    `ALTER TABLE public.${citar(tabla)} ADD CONSTRAINT ${citar(nombre)} CHECK (${condicion})`
  );
  registrar("ok", `${tabla}.${nombre}`);
}

async function main() {
  const conectado = await pool.verificarConexion();
  if (!conectado) {
    process.exitCode = 1;
    return;
  }

  // ---------------------------------------------------------------
  // 0) Identidad y aislamiento del rol conectado
  // ---------------------------------------------------------------
  const ident = (
    await pool.query(`
      SELECT current_user AS rol,
             current_database() AS base,
             (SELECT rolsuper    FROM pg_roles WHERE rolname = current_user) AS es_super,
             (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user) AS bypasa
    `)
  ).rows[0];
  console.log(
    `[Seguridad] Conectado como "${ident.rol}" (base "${ident.base}") · ` +
      `superusuario=${ident.es_super} · BYPASSRLS=${ident.bypasa}`
  );

  // ---------------------------------------------------------------
  // 1) Revocar acceso de los roles públicos de Supabase
  // ---------------------------------------------------------------
  for (const rolPublico of ["anon", "authenticated"]) {
    if (!(await existeRol(rolPublico))) {
      registrar("info", `El rol "${rolPublico}" no existe, se omite`);
      continue;
    }
    await pool.query(`REVOKE ALL ON SCHEMA public FROM ${citar(rolPublico)}`);
    await pool.query(`REVOKE ALL ON ALL TABLES IN SCHEMA public FROM ${citar(rolPublico)}`);
    await pool.query(`REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM ${citar(rolPublico)}`);
    registrar("ok", `Acceso revocado al rol "${rolPublico}" (esquema, tablas y secuencias)`);
  }

  await pool.query("REVOKE CREATE ON SCHEMA public FROM PUBLIC");
  registrar("ok", "Revocado CREATE sobre el esquema public a PUBLIC");

  // Que las tablas FUTURAS creadas por este rol tampoco queden abiertas.
  try {
    await pool.query(
      "ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated"
    );
    await pool.query(
      "ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated"
    );
    registrar("ok", "Privilegios por defecto revocados (tablas/secuencias futuras)");
  } catch (error) {
    registrar("aviso", `No se pudieron revocar privilegios por defecto: ${error.message}`);
  }

  // ---------------------------------------------------------------
  // 2) Tablas de seguridad (fuerza bruta + auditoría)
  // ---------------------------------------------------------------
  await pool.query(`
    CREATE TABLE IF NOT EXISTS intentos_login (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      ip TEXT,
      exito BOOLEAN NOT NULL DEFAULT FALSE,
      motivo TEXT,
      creado_en TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(
    "CREATE INDEX IF NOT EXISTS idx_intentos_email ON intentos_login (lower(btrim(email)), creado_en DESC)"
  );
  await pool.query("CREATE INDEX IF NOT EXISTS idx_intentos_ip ON intentos_login (ip, creado_en DESC)");
  registrar("ok", "Tabla intentos_login lista");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS auditoria_seguridad (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
      accion TEXT NOT NULL,
      detalle TEXT,
      ip TEXT,
      creado_en TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(
    "CREATE INDEX IF NOT EXISTS idx_auditoria_accion ON auditoria_seguridad (accion, creado_en DESC)"
  );
  await pool.query(
    "CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria_seguridad (usuario_id, creado_en DESC)"
  );
  registrar("ok", "Tabla auditoria_seguridad lista");

  // ---------------------------------------------------------------
  // 3) RLS + política solo para el rol de la aplicación
  // ---------------------------------------------------------------
  const tablas = await tablasPublicas();
  for (const tabla of tablas) {
    try {
      await pool.query(`ALTER TABLE public.${citar(tabla)} ENABLE ROW LEVEL SECURITY`);
      await pool.query(`DROP POLICY IF EXISTS politica_tami ON public.${citar(tabla)}`);
      await pool.query(
        `CREATE POLICY politica_tami ON public.${citar(tabla)} TO ${citar(ident.rol)} ` +
          `USING (true) WITH CHECK (true)`
      );
    } catch (error) {
      registrar("aviso", `RLS en "${tabla}" no se pudo aplicar: ${error.message}`);
    }
  }
  registrar("ok", `RLS habilitado con política para "${ident.rol}" en ${tablas.length} tablas`);

  // ---------------------------------------------------------------
  // 4) Correo único ignorando mayúsculas/minúsculas
  // ---------------------------------------------------------------
  if (tablas.includes("usuarios")) {
    const dup = await pool.query(`
      SELECT lower(btrim(email)) AS email, count(*)::int AS veces
      FROM usuarios GROUP BY 1 HAVING count(*) > 1
    `);
    if (dup.rows.length > 0) {
      registrar("aviso", `Índice único de email NO aplicado: ${dup.rows.length} correo(s) duplicados`);
      dup.rows.forEach((f) => console.log(`           - "${f.email}" x${f.veces}`));
    } else {
      await pool.query(
        "CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_email_normalizado ON usuarios (lower(btrim(email)))"
      );
      registrar("ok", "UNIQUE(lower(btrim(email))) en usuarios (evita cuentas duplicadas)");
    }
  }

  // ---------------------------------------------------------------
  // 5) CHECK constraints de integridad
  // ---------------------------------------------------------------
  await agregarCheck("usuarios", "ck_usuarios_nombre_min", "char_length(btrim(nombre)) >= 2");
  await agregarCheck("usuarios", "ck_usuarios_email_len", "char_length(btrim(email)) <= 254");
  await agregarCheck(
    "usuarios",
    "ck_usuarios_email_formato",
    "btrim(email) ~ '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'"
  );
  await agregarCheck(
    "usuarios",
    "ck_usuarios_nivel",
    "lower(nivel_digital) IN ('principiante','intermedio','avanzado','protegido')"
  );
  await agregarCheck("usuarios", "ck_usuarios_hash_len", "char_length(password_hash) >= 20");
  await agregarCheck("cursos", "ck_cursos_nivel", "lower(nivel) IN ('principiante','intermedio','avanzado')");
  await agregarCheck("cursos", "ck_cursos_duracion", "duracion_min IS NULL OR duracion_min > 0");
  await agregarCheck("alertas_fraude", "ck_alertas_severidad", "lower(severidad) IN ('baja','media','alta')");
  await agregarCheck("alertas_fraude", "ck_alertas_titulo_len", "char_length(btrim(titulo)) >= 1");
  await agregarCheck("test_nivelacion", "ck_test_puntaje", "puntaje >= 0");
  await agregarCheck("test_nivelacion", "ck_test_total", "total_preguntas > 0");
  await agregarCheck("test_nivelacion", "ck_test_puntaje_max", "puntaje <= total_preguntas * 2");
  await agregarCheck("examenes", "ck_examenes_puntaje", "puntaje >= 0");
  await agregarCheck("examenes", "ck_examenes_total", "total_preguntas > 0");
  await agregarCheck("examenes", "ck_examenes_puntaje_max", "puntaje <= total_preguntas");
  await agregarCheck("progreso_modulos", "ck_progreso_paso", "paso_actual >= 0");
  await agregarCheck("intentos_login", "ck_intentos_email_len", "char_length(btrim(email)) BETWEEN 1 AND 254");
  await agregarCheck("recuperacion_password", "ck_recuperacion_token_len", "char_length(token_hash) = 64");

  // ---------------------------------------------------------------
  // 6) Trigger para actualizado_en
  // ---------------------------------------------------------------
  if (tablas.includes("progreso_modulos")) {
    await pool.query(`
      CREATE OR REPLACE FUNCTION actualizar_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.actualizado_en = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger
          WHERE tgname = 'trg_progreso_modulos_update'
            AND tgrelid = 'public.progreso_modulos'::regclass
        ) THEN
          CREATE TRIGGER trg_progreso_modulos_update
          BEFORE UPDATE ON public.progreso_modulos
          FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
        END IF;
      END;
      $$ LANGUAGE plpgsql
    `);
    registrar("ok", "Trigger de actualizado_en en progreso_modulos");
  }

  // ---------------------------------------------------------------
  // 7) Verificación final: la aplicación sigue teniendo acceso
  // ---------------------------------------------------------------
  try {
    const prueba = await pool.query(`
      SELECT (SELECT count(*) FROM usuarios)        AS usuarios,
             (SELECT count(*) FROM cursos)          AS cursos,
             (SELECT count(*) FROM alertas_fraude)  AS alertas
    `);
    registrar(
      "ok",
      `Acceso de la aplicación verificado → usuarios: ${prueba.rows[0].usuarios}, ` +
        `cursos: ${prueba.rows[0].cursos}, alertas: ${prueba.rows[0].alertas}`
    );
  } catch (error) {
    registrar("aviso", `No se pudo verificar el acceso de la aplicación: ${error.message}`);
  }

  const rls = await pool.query(`
    SELECT count(*)::int AS con_rls
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relrowsecurity
  `);
  console.log(`[Seguridad] RLS activo en ${rls.rows[0].con_rls} tabla(s).`);
  console.log("[Seguridad] ✅ Endurecimiento completado. Revisá el estado con: npm run db:estado");
}

main()
  .catch((error) => {
    console.error("[Seguridad] Error:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
