-- ============================================
-- Esquema de base de datos - TAMI
-- PostgreSQL
-- ============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nivel_digital TEXT DEFAULT 'principiante',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de cursos / módulos
CREATE TABLE IF NOT EXISTS cursos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  nivel TEXT NOT NULL,
  duracion_min INTEGER,
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla de alertas de fraude
CREATE TABLE IF NOT EXISTS alertas_fraude (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  que_hacer TEXT,
  severidad TEXT DEFAULT 'media',
  icono TEXT DEFAULT '⚠️',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de inscripciones a cursos
CREATE TABLE IF NOT EXISTS inscripciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  inscrito_en TIMESTAMP DEFAULT NOW(),
  UNIQUE (usuario_id, curso_id)
);

-- Tabla de test de nivelación inicial
CREATE TABLE IF NOT EXISTS test_nivelacion (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  respuestas JSONB NOT NULL,
  nivel TEXT NOT NULL,
  puntaje INTEGER NOT NULL,
  total_preguntas INTEGER NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de exámenes post-lección
CREATE TABLE IF NOT EXISTS examenes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  modulo_id INTEGER,
  respuestas JSONB NOT NULL,
  puntaje INTEGER NOT NULL,
  total_preguntas INTEGER NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de progreso en módulos
CREATE TABLE IF NOT EXISTS progreso_modulos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  modulo_id INTEGER NOT NULL,
  paso_actual INTEGER DEFAULT 0,
  completado BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW(),
  UNIQUE (usuario_id, modulo_id)
);

-- ============================================
-- Datos iniciales de ejemplo
-- ============================================

-- Módulos del Campus Educativo
INSERT INTO cursos (titulo, descripcion, nivel, duracion_min) VALUES
  ('Uso de Smartphones', 'Aprendé a usar tu celular de forma segura.', 'principiante', 30),
  ('Redes e Internet', 'Navegá por internet con confianza.', 'principiante', 40),
  ('Trámites en Línea', 'Hacé trámites desde tu casa de forma segura.', 'intermedio', 45),
  ('Fraudes Digitales (Phishing)', 'Identificá y evitá estafas en línea.', 'principiante', 35),
  ('Comunicación Digital', 'Mantené el contacto con tu familia de forma segura.', 'principiante', 25)
ON CONFLICT DO NOTHING;

-- Alertas de fraude iniciales
INSERT INTO alertas_fraude (titulo, descripcion, que_hacer, severidad, icono) VALUES
  ('Correo falso del banco',
   'Detectamos un correo haciéndose pasar por tu banco pidiéndote que verifiques tu cuenta con urgencia. El remitente no es oficial.',
   'No hagas clic en ningún enlace. Eliminá el mensaje y, si querés, llamá al número oficial de tu banco para confirmar.',
   'alta', '🚨'),
  ('Mensaje de WhatsApp con premio falso',
   'Recibiste un mensaje diciendo que ganaste un celular. Te piden hacer clic en un enlace para reclamarlo.',
   'No hagas clic. Ninguna empresa regala cosas por WhatsApp. Eliminá el mensaje y bloqueá al remitente.',
   'alta', '🚨'),
  ('Llamada sospechosa suplantando a tu banco',
   'Te llaman desde un número que parece oficial y te piden tu número de tarjeta y código de seguridad.',
   'Colgá inmediatamente. Tu banco nunca te va a pedir esos datos por teléfono. Llamá vos al número oficial para confirmar.',
   'alta', '🚨'),
  ('Mensaje de texto con link a trámite falso',
   'Te envían un mensaje diciendo que tenés un trámite pendiente y te dan un link para completarlo. El link no es oficial.',
   'No hagas clic. Andá directamente al sitio oficial del organismo que figura en el mensaje y verificá ahí.',
   'media', '⚠️'),
  ('Correo de empresa de envíos con cargo extra',
   'Recibís un correo diciendo que tu paquete está retenido por falta de pago. Te piden ingresar datos y pagar una tarifa.',
   'No pagues nada sin verificar. Entrá al sitio oficial de la empresa de envíos y controlá el estado de tu paquete.',
   'media', '⚠️'),
  ('Solicitud de amistad sospechosa en redes',
   'Una persona desconocida te envía solicitud de amistad y luego te escribe pidiéndote datos personales o dinero.',
   'No aceptes la solicitud ni compartas información. Si conocés a la persona, verificá por otro medio si realmente es ella.',
   'baja', 'ℹ️')
ON CONFLICT DO NOTHING;
