/* ============================================
   TAMI - Escudo de Seguridad: mini retos
   --------------------------------------------
   Cada reto reproduce una situación real (correo, SMS, llamada,
   WhatsApp o sitio web) con datos verosímiles: remitente, asunto,
   enlace y hora. La persona debe decidir si es una estafa y, cuando
   lo es, reconocer de qué tipo se trata.
   Los casos con esEstafa: false son mensajes legítimos, para
   practicar también la detección de falsas alarmas.
   ============================================ */

const RETOS_ESCUDO = [
  {
    canal: "Correo electrónico",
    icono: "📧",
    hora: "08:42",
    remitente: "Banco del Río <seguridad@bancodelrio-cuentas.com>",
    asunto: "Último aviso: transferencia de $480.000 pendiente",
    mensaje: "Estimado cliente:\n\nRegistramos una transferencia programada por $480.000 desde su cuenta terminada en 4821. Si usted no la autorizó, cancele la operación en las próximas 2 horas.\n\nPara continuar, confirme su usuario y su clave desde el siguiente enlace.",
    enlace: "https://bancodelrio.com.verificar-cuenta.top/ingresar",
    adjunto: "",
    esEstafa: true,
    tipo: "Phishing",
    tipos: [
      { texto: "Phishing: un correo falso que imita a una empresa", correcto: true },
      { texto: "Smishing: un mensaje de texto con un enlace", correcto: false },
      { texto: "Vishing: una llamada telefónica para pedir datos", correcto: false }
    ],
    explicacion: "El correo imita al Banco del Río, pero el dominio real es «bancodelrio.com» y el enlace agrega «.verificar-cuenta.top». Ese detalle indica que el sitio es falso. Además, el banco no pide usuario y clave por correo.",
    senales: [
      "El dominio del enlace no es el oficial: después de «bancodelrio.com» aparece «.verificar-cuenta.top».",
      "Pide usuario y contraseña por correo.",
      "Mete urgencia con una supuesta transferencia y un plazo de 2 horas."
    ],
    consejo: "No abras el enlace. Entrá a la app oficial del banco o llamá al número que figura en el dorso de tu tarjeta."
  },
  {
    canal: "Mensaje de texto (SMS)",
    icono: "💬",
    hora: "12:07",
    remitente: "CorreoExpress",
    asunto: "",
    mensaje: "Su envío AR-8472910 quedó retenido en la sucursal. Para liberarlo hoy, abone $1.250 de gestión.",
    enlace: "https://correoexpress-pagos.top/AR8472910",
    adjunto: "",
    esEstafa: true,
    tipo: "Smishing",
    tipos: [
      { texto: "Smishing: un mensaje de texto con un enlace falso", correcto: true },
      { texto: "Phishing: un correo que imita a una empresa", correcto: false },
      { texto: "Falso premio: te piden pagar para recibir un regalo", correcto: false }
    ],
    explicacion: "Es un SMS con un enlace que imita a una empresa de envíos. El cobro chico y el apuro son las señales: el correo oficial no te cobra por un enlace así.",
    senales: [
      "El remitente es un nombre genérico, sin número oficial.",
      "El enlace no pertenece al sitio del correo: termina en «-pagos.top».",
      "Pide un pago pequeño para «liberar» el paquete y usa la palabra «hoy» para apurarte."
    ],
    consejo: "No pagues desde el enlace. Buscá el número de seguimiento en el sitio oficial del correo."
  },
  {
    canal: "Llamada telefónica",
    icono: "📞",
    hora: "16:18",
    remitente: "Banco del Río (nombre que muestra el teléfono)",
    asunto: "",
    mensaje: "—Hola, le habla Martín del área de prevención de fraudes del Banco del Río. Detectamos una compra de $89.999 en una tienda online con su tarjeta terminada en 4821. Para cancelarla necesito el código de 6 dígitos que le acaba de llegar por SMS. Dígamelo rápido, por favor.",
    enlace: "",
    adjunto: "",
    esEstafa: true,
    tipo: "Vishing",
    tipos: [
      { texto: "Vishing: una llamada falsa que se hace pasar por una entidad", correcto: true },
      { texto: "Smishing: un mensaje de texto con un enlace", correcto: false },
      { texto: "Compra falsa: una tienda que no existe", correcto: false }
    ],
    explicacion: "El nombre en pantalla se puede falsificar y los últimos 4 dígitos de la tarjeta se consiguen en filtraciones. Ningún empleado del banco te pide el código de 6 dígitos: ese código autoriza operaciones.",
    senales: [
      "El identificador de llamada se puede falsificar.",
      "Menciona los últimos 4 dígitos de tu tarjeta para ganar confianza.",
      "Pide el código de seguridad por teléfono y mete urgencia."
    ],
    consejo: "Cortá y llamá al número oficial del banco. Nunca dictes el código que llega por SMS."
  },
  {
    canal: "WhatsApp",
    icono: "📱",
    hora: "19:34",
    remitente: "+54 9 11 5555-7712 (no está en tus contactos)",
    asunto: "",
    mensaje: "Mamá, soy tu hijo. Se me rompió el celular y este es mi número nuevo. Necesito que me transfieras $85.000 a este alias para arreglarlo: hijo.urgente.mp. Después te lo devuelvo. No le digas a nadie, me da vergüenza.",
    enlace: "",
    adjunto: "",
    esEstafa: true,
    tipo: "Suplantación de familiar",
    tipos: [
      { texto: "Suplantación de familiar: alguien se hace pasar por un pariente", correcto: true },
      { texto: "Falso premio: te avisan que ganaste algo", correcto: false },
      { texto: "Trámite falso: te cobran por un trámite oficial", correcto: false }
    ],
    explicacion: "Pide dinero desde un número nuevo, con urgencia y secreto. Son tres señales clásicas de estafa. La persona que escribe no es tu familiar.",
    senales: [
      "Escribe desde un número que no tenés guardado.",
      "Pide una transferencia a un alias personal con urgencia.",
      "Pide secreto y que no llames a nadie."
    ],
    consejo: "Llamá a tu hijo al número de siempre. No transfieras ni respondas desde ese número nuevo."
  },
  {
    canal: "Sitio web",
    icono: "🌐",
    hora: "21:05",
    remitente: "premios.tami-sorteo.com",
    asunto: "¡Felicitaciones! Ganaste un celular 0 km",
    mensaje: "¡Felicitaciones! Usted fue seleccionada en el sorteo aniversario de TAMI. Para recibir un celular 0 km, complete sus datos y abone $3.900 por el envío. La promoción vence en 09:58 minutos.",
    enlace: "https://premios.tami-sorteo.com/datos",
    adjunto: "",
    esEstafa: true,
    tipo: "Falso premio",
    tipos: [
      { texto: "Falso premio: te piden pagar o dar datos para recibir un regalo", correcto: true },
      { texto: "Phishing: un correo que imita a una empresa", correcto: false },
      { texto: "Secuestro virtual: simulan tener a un familiar", correcto: false }
    ],
    explicacion: "No participaste de ningún sorteo, así que no podés haber ganado. El pago por adelantado y los datos personales son la trampa.",
    senales: [
      "No participaste en ese sorteo.",
      "Piden datos personales y un pago por adelantado.",
      "Hay un contador que apura la decisión."
    ],
    consejo: "Cerrá la ventana. Si querés participar de un sorteo, hacelo solo en sitios oficiales y leé las bases."
  },
  {
    canal: "Llamada telefónica",
    icono: "☎️",
    hora: "10:52",
    remitente: "Soporte técnico de Windows (nombre en pantalla)",
    asunto: "",
    mensaje: "—Le habla el soporte técnico de Microsoft. Su computadora está enviando datos a un servidor sospechoso; veo el error 0x80070005 en el registro de Windows. Para limpiarla, instale TeamViewer QuickSupport y déjeme controlar el equipo de forma remota. Es gratis y tarda 5 minutos.",
    enlace: "",
    adjunto: "",
    esEstafa: true,
    tipo: "Falso soporte técnico",
    tipos: [
      { texto: "Falso soporte técnico: te piden controlar tu equipo", correcto: true },
      { texto: "Vishing bancario: se hacen pasar por tu banco", correcto: false },
      { texto: "Compra falsa: te ofrecen un producto muy barato", correcto: false }
    ],
    explicacion: "Microsoft no llama por teléfono para avisar de virus ni pide instalar programas de acceso remoto. Si le das control del equipo, puede ver tus archivos, tus fotos y tus contraseñas.",
    senales: [
      "Microsoft no hace llamadas de soporte que vos no pediste.",
      "Pide instalar un programa de acceso remoto como TeamViewer.",
      "Usa un código de error técnico para asustarte y dar confianza."
    ],
    consejo: "Cortá la llamada. Si te preocupa un virus, llevá el equipo a un técnico de confianza."
  },
  {
    canal: "Red social",
    icono: "🛒",
    hora: "13:26",
    remitente: "Ofertas Tech (@ofertas_tech_ar)",
    asunto: "iPhone 15 Pro 256 GB — $380.000",
    mensaje: "iPhone 15 Pro 256 GB, nuevo, caja cerrada. Solo por hoy $380.000. Para reservarlo, transferí la mitad a este alias y mandame el comprobante por privado. Te lo envío por correo express.",
    enlace: "",
    adjunto: "",
    esEstafa: true,
    tipo: "Compra falsa",
    tipos: [
      { texto: "Compra falsa: una tienda o un vendedor que no existe", correcto: true },
      { texto: "Falso premio: te regalan algo a cambio de datos", correcto: false },
      { texto: "Suplantación de familiar: se hacen pasar por un pariente", correcto: false }
    ],
    explicacion: "El precio es demasiado bajo, pide transferencia a un alias personal y no tiene local ni factura. Si la cuenta no existe, el dinero no se recupera.",
    senales: [
      "El precio está muy por debajo del valor real del producto.",
      "Pide transferencia a un alias personal, no a una empresa.",
      "No hay local, factura ni garantía: solo un perfil en redes."
    ],
    consejo: "Comprá en sitios conocidos, pagá con tarjeta o medios que dejen registro y desconfiá de transferencias a particulares."
  },
  {
    canal: "WhatsApp",
    icono: "💬",
    hora: "09:15",
    remitente: "+54 9 11 5555-8890 (no está en tus contactos)",
    asunto: "",
    mensaje: "Hola, soy gestor de ANSES. Te puedo adelantar el trámite de la jubilación sin turno. Mandame foto de tu DNI, tu CUIL y pagá $12.000 de gestión. Es rápido y seguro.",
    enlace: "",
    adjunto: "",
    esEstafa: true,
    tipo: "Trámite falso",
    tipos: [
      { texto: "Trámite falso: alguien cobra por un trámite oficial", correcto: true },
      { texto: "Falso soporte técnico: te ofrecen ayuda con el celular", correcto: false },
      { texto: "Phishing: un correo que imita a una empresa", correcto: false }
    ],
    explicacion: "Los trámites oficiales se hacen en el organismo o en su sitio web, no por WhatsApp. Nadie debe pedirte una foto del DNI ni un pago de gestión por mensaje.",
    senales: [
      "Ofrece un trámite oficial por WhatsApp y sin turno.",
      "Pide foto del DNI, CUIL y un pago de gestión.",
      "Escribe desde un número que no está en tus contactos."
    ],
    consejo: "Entrá al sitio oficial del organismo o pedí un turno gratuito. No pagues gestores por WhatsApp."
  },
  {
    canal: "Llamada telefónica",
    icono: "😨",
    hora: "22:47",
    remitente: "Número desconocido",
    asunto: "",
    mensaje: "—Tenemos a tu nieto. Si querés verlo bien, no cortes y hacé lo que te digo. Necesitamos $200.000 ahora. No llames a nadie o lo lastimamos.",
    enlace: "",
    adjunto: "",
    esEstafa: true,
    tipo: "Secuestro virtual",
    tipos: [
      { texto: "Secuestro virtual: simulan tener a un familiar para asustarte", correcto: true },
      { texto: "Vishing bancario: se hacen pasar por tu banco", correcto: false },
      { texto: "Trámite falso: te cobran por un trámite oficial", correcto: false }
    ],
    explicacion: "Es una llamada para asustarte y que pagues sin pensar. El objetivo es que no cortes ni verifiques. No des dinero ni datos por teléfono.",
    senales: [
      "Habla de un familiar sin dar pruebas ni dejar que lo escuches.",
      "Pide que no cortes y que no llames a nadie.",
      "Exige dinero rápido y usa amenazas."
    ],
    consejo: "Cortá la llamada y comunicate con tu nieto o con su familia por otro número. Después hacé la denuncia."
  },
  {
    canal: "WhatsApp",
    icono: "💬",
    hora: "17:58",
    remitente: "+54 9 11 5555-6631 (no está en tus contactos)",
    asunto: "",
    mensaje: "Hola, soy del soporte de WhatsApp. Detectamos que van a borrar tu cuenta. Para verificarla, pasame el código de 6 dígitos que te acaba de llegar por SMS.",
    enlace: "",
    adjunto: "",
    esEstafa: true,
    tipo: "Código de verificación",
    tipos: [
      { texto: "Código de verificación: te piden el código que llega por SMS", correcto: true },
      { texto: "Phishing: un correo que imita a una empresa", correcto: false },
      { texto: "Falso premio: te avisan que ganaste algo", correcto: false }
    ],
    explicacion: "Nadie de WhatsApp te escribe para pedirte un código. Ese código es la llave de tu cuenta: si se lo das, la persona puede entrar y leer tus mensajes.",
    senales: [
      "El supuesto soporte escribe desde un número común.",
      "Pide un código de 6 dígitos por chat.",
      "Amenaza con borrar la cuenta para meter urgencia."
    ],
    consejo: "No compartas el código con nadie. Si te preocupa tu cuenta, revisá la configuración desde la app oficial."
  },
  {
    canal: "Correo electrónico",
    icono: "📧",
    hora: "11:03",
    remitente: "Facturación - Distribuidora del Sur <facturas@distribuidora-delsur.net>",
    asunto: "Factura A 0001-00004281 — vencimiento hoy",
    mensaje: "Estimado proveedor:\n\nAdjuntamos la factura A 0001-00004281 por $1.480.000. Le informamos que actualizamos nuestra cuenta bancaria: a partir de hoy, las transferencias deben hacerse al CBU 0000003100012345678901.\n\nPor favor, confirme la recepción de este correo.",
    enlace: "",
    adjunto: "Factura_0001-00004281.pdf",
    esEstafa: true,
    tipo: "Fraude de factura",
    tipos: [
      { texto: "Fraude de factura: cambian la cuenta bancaria de un proveedor", correcto: true },
      { texto: "Phishing: un correo que imita a una empresa", correcto: false },
      { texto: "Compra falsa: una tienda que no existe", correcto: false }
    ],
    explicacion: "El correo avisa un cambio de cuenta bancaria y apura el pago. Es un fraude clásico: el atacante se hace pasar por un proveedor para que transfieras a su cuenta.",
    senales: [
      "El remitente usa «distribuidora-delsur.net», distinto del dominio habitual «distribuidora-delsur.com».",
      "Avisan un cambio de CBU por correo, sin llamada de verificación.",
      "El vencimiento es hoy y piden confirmar rápido."
    ],
    consejo: "Antes de pagar, llamá al proveedor por un número que ya conozcas y verificá el CBU. No uses los datos del correo."
  },
  {
    canal: "WhatsApp",
    icono: "💼",
    hora: "08:10",
    remitente: "+54 9 11 5555-4820 (no está en tus contactos)",
    asunto: "",
    mensaje: "Hola, soy de Recursos Humanos de LogiTrans. Vi tu perfil y te ofrecemos trabajo desde casa: 2 horas por día, $350.000 por semana. Para empezar, mandame tu DNI y aboná $5.000 del kit de bienvenida. No necesitás experiencia.",
    enlace: "",
    adjunto: "",
    esEstafa: true,
    tipo: "Oferta de trabajo falsa",
    tipos: [
      { texto: "Oferta de trabajo falsa: prometen un empleo y piden dinero", correcto: true },
      { texto: "Trámite falso: te cobran por un trámite oficial", correcto: false },
      { texto: "Suplantación de familiar: se hacen pasar por un pariente", correcto: false }
    ],
    explicacion: "Ofrece un sueldo altísimo por pocas horas y pide un pago para empezar. Las empresas reales no cobran por trabajar ni piden el DNI por WhatsApp antes de una entrevista.",
    senales: [
      "El sueldo es desproporcionado para 2 horas por día.",
      "Piden un pago por el «kit de bienvenida».",
      "No hay entrevista ni contrato: todo se maneja por WhatsApp."
    ],
    consejo: "No pagues ni envíes documentos. Buscá la empresa en su sitio oficial y postulate por canales formales."
  },
  {
    canal: "Mensaje de texto (SMS)",
    icono: "🏦",
    hora: "10:22",
    remitente: "Banco del Río",
    asunto: "",
    mensaje: "Banco del Río: su código de seguridad es 482913. No lo comparta con nadie. Vence en 5 minutos. Si usted no lo solicitó, comuníquese al número del dorso de su tarjeta.",
    enlace: "",
    adjunto: "",
    esEstafa: false,
    tipo: "",
    tipos: [],
    explicacion: "Este mensaje no pide datos ni incluye enlaces: solo avisa un código y recuerda que no lo compartas. El peligro aparecería si alguien te llamara a pedírtelo.",
    senales: [
      "No incluye enlaces.",
      "No pide que respondas ni que compartas el código.",
      "Indica un canal oficial para consultar si no lo pediste."
    ],
    consejo: "Guardá el código para vos. Si te llaman pidiéndolo, cortá y llamá al banco."
  },
  {
    canal: "WhatsApp",
    icono: "👩",
    hora: "18:20",
    remitente: "Lucía (contacto guardado)",
    asunto: "",
    mensaje: "Mamá, ¿cómo estás? Cuando puedas llamame, te quiero contar una novedad. No es urgente. Te quiero.",
    enlace: "",
    adjunto: "",
    esEstafa: false,
    tipo: "",
    tipos: [],
    explicacion: "Es un mensaje de un contacto guardado, sin pedir dinero, datos ni enlaces, y no mete apuro. No hay señales de estafa.",
    senales: [
      "El número está guardado en tus contactos.",
      "No pide dinero, datos ni códigos.",
      "No hay enlaces ni urgencia."
    ],
    consejo: "Si algún día te pide dinero o un código, aunque sea su número, llamala antes de hacer cualquier cosa."
  },
  {
    canal: "Mensaje de texto (SMS)",
    icono: "🏥",
    hora: "07:30",
    remitente: "Hospital Central",
    asunto: "",
    mensaje: "Hospital Central: le recordamos su turno de clínica médica el 12/11 a las 09:00 en Av. San Martín 123. No es necesario responder este mensaje.",
    enlace: "",
    adjunto: "",
    esEstafa: false,
    tipo: "",
    tipos: [],
    explicacion: "No pide datos, no incluye enlaces ni pagos. Solo recuerda un turno que pediste. Es un aviso legítimo.",
    senales: [
      "No incluye enlaces ni pagos.",
      "No pide datos personales.",
      "Aclara que no hace falta responder."
    ],
    consejo: "Ante cualquier duda, llamá al hospital por el número que figura en tu turno impreso o en su sitio oficial."
  }
];
