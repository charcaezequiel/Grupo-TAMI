/**
 * Envío de correos - TAMI
 * --------------------------------
 * La recuperación de contraseña necesita enviar un enlace al correo del
 * usuario. Se usa SMTP porque funciona con Gmail, Outlook, Brevo, Mailgun,
 * Amazon SES y la mayoría de los proveedores transaccionales.
 *
 * Variables de entorno:
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM
 *
 * Si SMTP no está configurado, el servidor sigue funcionando: registra un
 * aviso y el enlace solo se muestra cuando RESET_DEBUG_LINK=true (desarrollo).
 */
const nodemailer = require("nodemailer");

let transporte = null;

function texto(valor) {
  return String(valor || "").trim();
}

function smtpConfigurado() {
  return Boolean(texto(process.env.SMTP_HOST));
}

function crearTransporte() {
  if (!smtpConfigurado()) return null;
  if (transporte) return transporte;

  const puerto = Number(process.env.SMTP_PORT) || 587;
  const seguro =
    String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || puerto === 465;
  const usuario = texto(process.env.SMTP_USER);
  const clave = texto(process.env.SMTP_PASS);

  const opciones = {
    host: texto(process.env.SMTP_HOST),
    port: puerto,
    secure: seguro,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
  };

  if (usuario) {
    opciones.auth = {
      user: usuario,
      pass: clave
    };
  }

  transporte = nodemailer.createTransport(opciones);
  return transporte;
}

function escaparHtml(valor) {
  return String(valor || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function plantillaHtml({ nombre, enlace, minutos }) {
  const nombreSeguro = escaparHtml(nombre || "vecino/a");
  const enlaceSeguro = escaparHtml(enlace);

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Recuperá tu contraseña de TAMI</title>
  </head>
  <body style="margin:0;padding:0;background:#F4F8F9;font-family:Arial,Helvetica,sans-serif;color:#1E3A3F;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F8F9;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FFFFFF;border:1px solid #D6E4E7;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#0A4B5C;padding:24px 28px;color:#FFFFFF;">
                <p style="margin:0;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">TAMI</p>
                <h1 style="margin:6px 0 0;font-size:24px;line-height:1.3;">Recuperá tu contraseña</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">Hola, ${nombreSeguro}:</p>
                <p style="margin:0 0 20px;font-size:16px;line-height:1.6;">
                  Recibimos un pedido para cambiar la contraseña de tu cuenta de TAMI.
                  Tocá el botón de abajo para elegir una contraseña nueva.
                </p>
                <p style="margin:0 0 24px;text-align:center;">
                  <a href="${enlaceSeguro}" style="display:inline-block;background:#007A87;color:#FFFFFF;text-decoration:none;font-size:17px;font-weight:bold;padding:14px 26px;border-radius:10px;">
                    Elegir una contraseña nueva
                  </a>
                </p>
                <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#4B6266;">
                  Al guardar la contraseña nueva, la anterior será reemplazada y dejará de funcionar.
                </p>
                <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#4B6266;">
                  Este enlace vence en ${Number(minutos) || 30} minutos y se puede usar una sola vez.
                </p>
                <p style="margin:0;font-size:14px;line-height:1.6;color:#4B6266;">
                  Si no pediste este cambio, ignorá este correo: tu contraseña actual sigue funcionando y no se modificó.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#F4F8F9;border-top:1px solid #D6E4E7;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#5C7478;">
                  TAMI · Educación digital para protegerte mejor.
                </p>
                <p style="margin:6px 0 0;font-size:12px;line-height:1.5;color:#5C7478;word-break:break-all;">
                  Si el botón no abre, copiá este enlace en tu navegador:<br>
                  ${enlaceSeguro}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function plantillaTexto({ nombre, enlace, minutos }) {
  return [
    "TAMI - Recuperación de contraseña",
    "",
    "Hola, " + (nombre || "vecino/a") + ":",
    "",
    "Recibimos un pedido para cambiar la contraseña de tu cuenta de TAMI.",
    "Abrí este enlace para elegir una contraseña nueva:",
    enlace,
    "",
    "Al guardar la contraseña nueva, la anterior será reemplazada y dejará de funcionar.",
    "",
    "El enlace vence en " + (Number(minutos) || 30) + " minutos y se puede usar una sola vez.",
    "",
    "Si no pediste este cambio, ignorá este correo: tu contraseña actual sigue funcionando y no se modificó."
  ].join("\n");
}

async function enviarCorreoRecuperacion({ destinatario, nombre, enlace, minutos }) {
  const transporteSmtp = crearTransporte();
  if (!transporteSmtp) {
    const error = new Error("SMTP no configurado");
    error.codigo = "SMTP_NO_CONFIGURADO";
    throw error;
  }

  const remitente = texto(process.env.SMTP_FROM) || "TAMI <no-reply@tami.local>";
  const minutosSeguros = Number(minutos) || 30;

  return transporteSmtp.sendMail({
    from: remitente,
    to: destinatario,
    subject: "Recuperá tu contraseña de TAMI",
    text: plantillaTexto({ nombre, enlace, minutos: minutosSeguros }),
    html: plantillaHtml({ nombre, enlace, minutos: minutosSeguros })
  });
}

module.exports = {
  smtpConfigurado,
  enviarCorreoRecuperacion
};
