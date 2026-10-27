-- ============================================
-- Esquema de base de datos - TAMI (solo DDL)
-- PostgreSQL
--
-- IMPORTANTE: este archivo NO inserta contenido.
-- Los datos de catálogo (cursos y alertas) se cargan con:
--     npm run db:seed
-- El endurecimiento de seguridad se aplica con:
--     npm run db:seguridad
-- ============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  nivel_digital TEXT NOT NULL DEFAULT 'principiante',
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  -- Preferencias de lectura y color (pantalla de Configuración del usuario).
  -- Son opcionales: siempre tienen un valor por defecto válido.
  tamano_fuente TEXT NOT NULL DEFAULT 'normal',
  tema_preferido TEXT NOT NULL DEFAULT 'proteccion',
  CONSTRAINT usuarios_nivel_ck CHECK (
    lower(nivel_digital) IN ('principiante','intermedio','avanzado','protegido')
  ),
  CONSTRAINT usuarios_nombre_min_ck CHECK (char_length(btrim(nombre)) >= 2),
  CONSTRAINT usuarios_email_formato_ck CHECK (
    btrim(email) ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

-- Preferencias agregadas después del primer despliegue (migración idempotente).
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS tamano_fuente TEXT NOT NULL DEFAULT 'normal';
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS tema_preferido TEXT NOT NULL DEFAULT 'proteccion';

-- Las restricciones de las preferencias se crean solo si no existen
-- (PostgreSQL no admite "ADD CONSTRAINT IF NOT EXISTS").
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_tamano_fuente_ck') THEN
    ALTER TABLE usuarios ADD CONSTRAINT usuarios_tamano_fuente_ck
      CHECK (lower(tamano_fuente) IN ('normal','grande','xl'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_tema_preferido_ck') THEN
    ALTER TABLE usuarios ADD CONSTRAINT usuarios_tema_preferido_ck
      CHECK (lower(tema_preferido) IN ('proteccion','bosque','calido'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_usuarios_email_lower ON usuarios (lower(btrim(email)));
CREATE INDEX IF NOT EXISTS idx_usuarios_creado_en ON usuarios (creado_en);
-- Correo unico ignorando mayusculas/minusculas (evita cuentas duplicadas).
-- Se define como indice (no como constraint) porque PostgreSQL no permite
-- expresiones dentro de UNIQUE (...). Ver tambien scripts/seguridad.js.
CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_email_normalizado ON usuarios (lower(btrim(email)));

-- Tabla de cursos / módulos
CREATE TABLE IF NOT EXISTS cursos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  nivel TEXT NOT NULL,
  duracion_min INTEGER,
  tema TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT cursos_nivel_ck CHECK (lower(nivel) IN ('principiante','intermedio','avanzado')),
  CONSTRAINT cursos_duracion_pos_ck CHECK (duracion_min IS NULL OR duracion_min >= 0)
);
CREATE INDEX IF NOT EXISTS idx_cursos_activo ON cursos (activo);
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS tema TEXT;

-- Tabla de alertas de fraude
CREATE TABLE IF NOT EXISTS alertas_fraude (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  que_hacer TEXT,
  severidad TEXT NOT NULL DEFAULT 'media',
  icono TEXT DEFAULT '⚠️',
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT alertas_severidad_ck CHECK (lower(severidad) IN ('baja','media','alta'))
);
CREATE INDEX IF NOT EXISTS idx_alertas_creado_en ON alertas_fraude (creado_en);
CREATE INDEX IF NOT EXISTS idx_alertas_severidad ON alertas_fraude (lower(severidad));

-- Tabla de inscripciones a cursos
CREATE TABLE IF NOT EXISTS inscripciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  inscrito_en TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, curso_id)
);
CREATE INDEX IF NOT EXISTS idx_inscripciones_usuario ON inscripciones (usuario_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_curso ON inscripciones (curso_id);

-- Tabla de test de nivelación inicial
CREATE TABLE IF NOT EXISTS test_nivelacion (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  respuestas JSONB NOT NULL,
  nivel TEXT NOT NULL,
  puntaje INTEGER NOT NULL,
  total_preguntas INTEGER NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT test_nivel_ck CHECK (lower(nivel) IN ('principiante','intermedio','avanzado','protegido')),
  CONSTRAINT test_puntaje_no_neg_ck CHECK (puntaje >= 0),
  CONSTRAINT test_total_pos_ck CHECK (total_preguntas > 0),
  CONSTRAINT test_puntaje_max_ck CHECK (puntaje <= total_preguntas * 2)
);
CREATE INDEX IF NOT EXISTS idx_test_usuario ON test_nivelacion (usuario_id);
CREATE INDEX IF NOT EXISTS idx_test_creado_en ON test_nivelacion (creado_en);

-- Tabla de exámenes post-lección
CREATE TABLE IF NOT EXISTS examenes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  modulo_id INTEGER,
  respuestas JSONB NOT NULL,
  puntaje INTEGER NOT NULL,
  total_preguntas INTEGER NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT examen_puntaje_no_neg_ck CHECK (puntaje >= 0),
  CONSTRAINT examen_total_pos_ck CHECK (total_preguntas > 0),
  CONSTRAINT examen_puntaje_max_ck CHECK (puntaje <= total_preguntas)
);
CREATE INDEX IF NOT EXISTS idx_examenes_usuario ON examenes (usuario_id);
CREATE INDEX IF NOT EXISTS idx_examenes_modulo ON examenes (modulo_id);
CREATE INDEX IF NOT EXISTS idx_examenes_creado_en ON examenes (creado_en);

-- Tabla de progreso en módulos
CREATE TABLE IF NOT EXISTS progreso_modulos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  modulo_id INTEGER NOT NULL,
  paso_actual INTEGER NOT NULL DEFAULT 0,
  completado BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, modulo_id),
  CONSTRAINT progreso_paso_no_neg_ck CHECK (paso_actual >= 0)
);
CREATE INDEX IF NOT EXISTS idx_progreso_usuario ON progreso_modulos (usuario_id);
CREATE INDEX IF NOT EXISTS idx_progreso_modulo ON progreso_modulos (modulo_id);
CREATE INDEX IF NOT EXISTS idx_progreso_completado ON progreso_modulos (completado);

-- Mini trabajos prácticos (tareas) de cada módulo, según el nivel del usuario.
-- Un registro por combinación usuario + módulo + nivel: permite retomar la
-- tarea y guardar si ya fue completada.
CREATE TABLE IF NOT EXISTS mini_trabajos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  modulo_id INTEGER NOT NULL,
  nivel TEXT NOT NULL,
  completado BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, modulo_id, nivel),
  CONSTRAINT mini_trabajo_nivel_ck CHECK (lower(nivel) IN ('principiante','intermedio','avanzado'))
);
CREATE INDEX IF NOT EXISTS idx_mini_trabajos_usuario ON mini_trabajos (usuario_id);
CREATE INDEX IF NOT EXISTS idx_mini_trabajos_modulo ON mini_trabajos (modulo_id);

-- ============================================
-- Tablas de seguridad
-- ============================================

-- Intentos de inicio de sesión: permite detectar y frenar la fuerza bruta
-- (máximo de intentos fallidos por correo en una ventana de tiempo).
CREATE TABLE IF NOT EXISTS intentos_login (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  ip TEXT,
  exito BOOLEAN NOT NULL DEFAULT FALSE,
  motivo TEXT,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_intentos_email_len CHECK (char_length(btrim(email)) BETWEEN 1 AND 254)
);
CREATE INDEX IF NOT EXISTS idx_intentos_email ON intentos_login (lower(btrim(email)), creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_intentos_ip ON intentos_login (ip, creado_en DESC);

-- Auditoría de seguridad: registro de eventos relevantes (login, registro,
-- bloqueos, errores). No guarda contraseñas ni hashes.
CREATE TABLE IF NOT EXISTS auditoria_seguridad (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  accion TEXT NOT NULL,
  detalle TEXT,
  ip TEXT,
  user_agent TEXT,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_auditoria_accion ON auditoria_seguridad (accion, creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria_seguridad (usuario_id, creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_creado_en ON auditoria_seguridad (creado_en DESC);

-- Ampliación de auditoría para mayor trazabilidad (idempotente)
ALTER TABLE auditoria_seguridad ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Enlaces de recuperación de contraseña.
-- Se guarda SOLO el hash SHA-256 del token, nunca el token en texto plano.
-- El token original viaja una única vez por correo y deja de servir al usarse
-- o al vencer (30 minutos por defecto).
CREATE TABLE IF NOT EXISTS recuperacion_password (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  expira_en TIMESTAMP NOT NULL,
  usado_en TIMESTAMP,
  ip TEXT,
  CONSTRAINT recuperacion_token_len_ck CHECK (char_length(token_hash) = 64),
  CONSTRAINT recuperacion_expira_ck CHECK (expira_en > creado_en)
);
CREATE INDEX IF NOT EXISTS idx_recuperacion_usuario
  ON recuperacion_password (usuario_id, creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_recuperacion_expira
  ON recuperacion_password (expira_en);

-- ============================================
-- RBAC: Roles, Permisos y Relación
-- ============================================

-- Catálogo de roles
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Catálogo de permisos granulares
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  module VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Relación muchos a muchos entre roles y permisos
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions (role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_perm ON role_permissions (permission_id);

-- Ampliación de usuarios para RBAC y control de cuenta (idempotente)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS twofa_enabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS failed_login_count INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_usuarios_role_id ON usuarios (role_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_is_active ON usuarios (is_active);
