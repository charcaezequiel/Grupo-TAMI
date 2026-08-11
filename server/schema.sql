-- ============================================
-- Esquema de base de datos - TAMI
-- PostgreSQL
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  nivel_digital TEXT DEFAULT 'principiante',
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cursos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  nivel TEXT NOT NULL,
  duracion_min INTEGER,
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS alertas_fraude (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  severidad TEXT DEFAULT 'media',
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inscripciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  inscrito_en TIMESTAMP DEFAULT NOW(),
  UNIQUE (usuario_id, curso_id)
);

-- Datos iniciales de ejemplo
INSERT INTO cursos (titulo, descripcion, nivel, duracion_min) VALUES
  ('Uso seguro del WhatsApp', 'Aprendé a detectar mensajes falsos y estafas.', 'principiante', 30),
  ('Banca digital sin miedo', 'Conocé cómo operar con home banking de forma segura.', 'intermedio', 45)
ON CONFLICT DO NOTHING;

INSERT INTO alertas_fraude (titulo, descripcion, severidad) VALUES
  ('Cuidado con llamadas del "banco"', 'Ningún banco te pide claves por teléfono.', 'alta'),
  ('Falsos ganadores de premios', 'Nunca pagues un "impuesto" para cobrar un premio.', 'media')
ON CONFLICT DO NOTHING;
