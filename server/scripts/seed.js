/**
 * Seed (sembrado de datos iniciales) - TAMI
 * --------------------------------
 * Carga únicamente datos de catálogo (cursos y alertas de fraude).
 * NO inserta usuarios, ni resultados ni progresos. Se ejecuta de forma
 * segura y NO duplica contenido: solo si las tablas están vacías.
 *
 * Uso:  npm run db:seed
 *
 * Importante: NO vuelve a migrar el contenido existente. Solo agrega
 * los datos maestros mínimos necesarios para que la app funcione.
 */
const pool = require("../db");

async function main() {
  const conectado = await pool.verificarConexion();
  if (!conectado) {
    process.exitCode = 1;
    return;
  }

  // Cursos (catálogo de módulos). Solo insertar si está vacío.
  const cursosCount = await pool.query("SELECT count(*)::int AS c FROM cursos");
  if (cursosCount.rows[0].c > 0) {
    console.log(`[Seed] Cursos ya existen (${cursosCount.rows[0].c}). No se vuelven a insertar.`);
  } else {
    console.log("[Seed] Insertando cursos iniciales...");
    await pool.query(`
      INSERT INTO cursos (titulo, descripcion, nivel, duracion_min, tema) VALUES
        ('Uso de Smartphones', 'Aprendé a usar tu celular de forma segura.', 'principiante', 30, 'movil'),
        ('Redes e Internet', 'Navegá por internet con confianza.', 'principiante', 40, 'redes'),
        ('Trámites en Línea', 'Hacé trámites desde tu casa de forma segura.', 'intermedio', 45, 'tramites'),
        ('Fraudes Digitales (Phishing)', 'Identificá y evitá estafas en línea.', 'principiante', 35, 'fraudes'),
        ('Comunicación Digital', 'Mantené el contacto con tu familia de forma segura.', 'principiante', 25, 'comunicacion')
      ON CONFLICT DO NOTHING
    `);
    console.log("[Seed] Cursos cargados correctamente.");

    // Si los cursos ya existian, se les completa el tema que falta.
    await pool.query(`
      UPDATE cursos SET tema = 'movil'        WHERE titulo = 'Uso de Smartphones' AND tema IS NULL;
      UPDATE cursos SET tema = 'redes'        WHERE titulo = 'Redes e Internet' AND tema IS NULL;
      UPDATE cursos SET tema = 'tramites'     WHERE titulo = 'Trámites en Línea' AND tema IS NULL;
      UPDATE cursos SET tema = 'fraudes'      WHERE titulo = 'Fraudes Digitales (Phishing)' AND tema IS NULL;
      UPDATE cursos SET tema = 'comunicacion' WHERE titulo = 'Comunicación Digital' AND tema IS NULL;
    `);
  }

  // Alertas de fraude. Solo insertar si está vacío.
  const alertasCount = await pool.query("SELECT count(*)::int AS c FROM alertas_fraude");
  if (alertasCount.rows[0].c > 0) {
    console.log(`[Seed] Alertas ya existen (${alertasCount.rows[0].c}). No se vuelven a insertar.`);
  } else {
    console.log("[Seed] Insertando alertas de fraude iniciales...");
    await pool.query(`
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
      ON CONFLICT DO NOTHING
    `);
    console.log("[Seed] Alertas cargadas correctamente.");
  }

  const conteo = await pool.query(`
    SELECT (SELECT count(*) FROM cursos)         AS cursos,
           (SELECT count(*) FROM alertas_fraude) AS alertas
  `);
  console.log(`[Seed] Estado final → cursos: ${conteo.rows[0].cursos}, alertas: ${conteo.rows[0].alertas}`);
}

main()
  .catch((err) => {
    console.error("[Seed] Error:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
