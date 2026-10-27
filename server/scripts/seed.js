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
        ('Uso de Smartphones', 'Perdé el miedo al celular: aprendé a encenderlo, usarlo, comunicarte y protegerlo, desde cero y sin apuro.', 'principiante', 80, 'movil'),
        ('Redes e Internet', 'Entendé cómo funciona internet, cómo buscar información confiable y cómo cuidar tus datos mientras navegás.', 'principiante', 80, 'redes'),
        ('Trámites en Línea', 'Hacé tus trámites desde casa con seguridad: cuentas oficiales, constancias, turnos y comprobantes, sin filas ni traslados.', 'intermedio', 90, 'tramites'),
        ('Fraudes Digitales (Phishing)', 'Aprendé a reconocer estafas por correo, WhatsApp, SMS y llamadas, y a proteger tus cuentas y tu dinero.', 'principiante', 80, 'fraudes'),
        ('Comunicación Digital', 'Hablá con tu familia por WhatsApp: mensajes, audios, fotos, grupos y videollamadas, cuidando tu privacidad.', 'principiante', 70, 'comunicacion')
      ON CONFLICT DO NOTHING
    `);
    console.log("[Seed] Cursos cargados correctamente.");
  }

  // Mantiene el catálogo alineado con los 4 niveles de cada curso:
  // actualiza descripción y duración de los cursos que ya existían.
  const catalogo = [
    ["Uso de Smartphones", "Perdé el miedo al celular: aprendé a encenderlo, usarlo, comunicarte y protegerlo, desde cero y sin apuro.", 80],
    ["Redes e Internet", "Entendé cómo funciona internet, cómo buscar información confiable y cómo cuidar tus datos mientras navegás.", 80],
    ["Trámites en Línea", "Hacé tus trámites desde casa con seguridad: cuentas oficiales, constancias, turnos y comprobantes, sin filas ni traslados.", 90],
    ["Fraudes Digitales (Phishing)", "Aprendé a reconocer estafas por correo, WhatsApp, SMS y llamadas, y a proteger tus cuentas y tu dinero.", 80],
    ["Comunicación Digital", "Hablá con tu familia por WhatsApp: mensajes, audios, fotos, grupos y videollamadas, cuidando tu privacidad.", 70],
  ];
  let catalogoActualizado = 0;
  for (const [titulo, descripcion, duracion] of catalogo) {
    const resultado = await pool.query(
      `UPDATE cursos
          SET descripcion = $2, duracion_min = $3
        WHERE titulo = $1
          AND (descripcion IS DISTINCT FROM $2 OR duracion_min IS DISTINCT FROM $3)`,
      [titulo, descripcion, duracion]
    );
    catalogoActualizado += resultado.rowCount;
  }
  if (catalogoActualizado > 0) {
    console.log(`[Seed] Catálogo actualizado en ${catalogoActualizado} curso(s).`);
  }

  // Si los cursos ya existian (o se insertaron sin tema en versiones previas),
  // se les completa el tema que falte. Es idempotente y no pisa valores ya cargados.
  const temas = [
    ["movil", "Uso de Smartphones"],
    ["redes", "Redes e Internet"],
    ["tramites", "Trámites en Línea"],
    ["fraudes", "Fraudes Digitales (Phishing)"],
    ["comunicacion", "Comunicación Digital"],
  ];
  let temasActualizados = 0;
  for (const [tema, titulo] of temas) {
    const resultado = await pool.query(
      "UPDATE cursos SET tema = $1 WHERE titulo = $2 AND tema IS NULL",
      [tema, titulo]
    );
    temasActualizados += resultado.rowCount;
  }
  if (temasActualizados > 0) {
    console.log(`[Seed] Tema completado en ${temasActualizados} curso(s).`);
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
