/* ============================================
   TAMI - Repaso ampliado de cada nivel
   --------------------------------------------
   Cada nivel de contenido-cursos.js trae 3 preguntas base.
   Acá se suman 3 preguntas más por nivel para que el repaso
   tenga 6 preguntas en total, siempre con una sola respuesta
   correcta y con el mismo lenguaje simple de las teorías.
   ============================================ */

const PREGUNTAS_EXTRA = {
  /* ==========================================================
     CURSO 1 - USO DE SMARTPHONES
     ========================================================== */
  "101": [
    {
      texto: "¿Cómo conviene cargar la batería del celular?",
      opciones: [
        { texto: "Con el cargador original o uno de buena calidad", valor: "correcto" },
        { texto: "Con cualquier cargador que encontremos en la calle", valor: "incorrecto" },
        { texto: "Solo cuando el celular se apaga por completo", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Dónde se cambia el tamaño de las letras del celular?",
      opciones: [
        { texto: "En la aplicación de la cámara", valor: "incorrecto" },
        { texto: "En Ajustes, dentro de Pantalla", valor: "correcto" },
        { texto: "Sacudiendo el celular con fuerza", valor: "incorrecto" }
      ]
    },
    {
      texto: "Si no entendés cómo hacer algo en el celular, ¿qué conviene hacer?",
      opciones: [
        { texto: "Dejarlo guardado y no usarlo nunca más", valor: "incorrecto" },
        { texto: "Apretar todos los botones al mismo tiempo", valor: "incorrecto" },
        { texto: "Pedir ayuda a una persona de confianza", valor: "correcto" }
      ]
    }
  ],
  "102": [
    {
      texto: "¿Qué es la nube?",
      opciones: [
        { texto: "Un espacio en internet para guardar copias de tus archivos", valor: "correcto" },
        { texto: "El clima que muestra el celular", valor: "incorrecto" },
        { texto: "Un cable que conecta el celular a la computadora", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Qué indica el icono de la batería en rojo o naranja?",
      opciones: [
        { texto: "Que el celular tiene poca carga y conviene cargarlo", valor: "correcto" },
        { texto: "Que el celular está conectado al WiFi", valor: "incorrecto" },
        { texto: "Que llegó un mensaje nuevo", valor: "incorrecto" }
      ]
    },
    {
      texto: "Si el celular está lento, ¿qué puede ayudar?",
      opciones: [
        { texto: "Golpear suavemente la pantalla", valor: "incorrecto" },
        { texto: "Dejarlo encendido toda la noche sin tocarlo", valor: "incorrecto" },
        { texto: "Cerrar las aplicaciones que no estás usando", valor: "correcto" }
      ]
    }
  ],
  "103": [
    {
      texto: "¿Qué icono usás para buscar algo en el celular?",
      opciones: [
        { texto: "El dibujo de una lupa", valor: "correcto" },
        { texto: "El dibujo de una nube", valor: "incorrecto" },
        { texto: "El dibujo de una batería", valor: "incorrecto" }
      ]
    },
    {
      texto: "En el teclado, ¿cómo se escribe un espacio entre palabras?",
      opciones: [
        { texto: "Tocando la barra larga de abajo", valor: "correcto" },
        { texto: "Tocando dos veces la letra A", valor: "incorrecto" },
        { texto: "Apagando y encendiendo el celular", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Para qué sirve la aplicación Reloj?",
      opciones: [
        { texto: "Solo para ver la hora", valor: "incorrecto" },
        { texto: "Para alarma, cronómetro y temporizador", valor: "correcto" },
        { texto: "Para llamar a números desconocidos", valor: "incorrecto" }
      ]
    }
  ],
  "104": [
    {
      texto: "¿Para qué sirve «Buscar mi dispositivo»?",
      opciones: [
        { texto: "Para encontrar el celular si se pierde y bloquearlo", valor: "correcto" },
        { texto: "Para buscar el WiFi de los vecinos", valor: "incorrecto" },
        { texto: "Para borrar las fotos que no te gustan", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Qué conviene tener guardado en el contacto de emergencia?",
      opciones: [
        { texto: "El número de una pizzería", valor: "incorrecto" },
        { texto: "El número de una persona de confianza", valor: "correcto" },
        { texto: "La contraseña del correo", valor: "incorrecto" }
      ]
    },
    {
      texto: "Si le prestás el celular a otra persona, ¿qué conviene hacer?",
      opciones: [
        { texto: "Dejarlo desbloqueado para que lo use tranquila", valor: "incorrecto" },
        { texto: "Darle tu PIN y tu contraseña", valor: "incorrecto" },
        { texto: "Dejarlo bloqueado y no compartir tus claves", valor: "correcto" }
      ]
    }
  ],

  /* ==========================================================
     CURSO 2 - REDES E INTERNET
     ========================================================== */
  "201": [
    {
      texto: "¿Qué es una pestaña del navegador?",
      opciones: [
        { texto: "Una página abierta dentro del navegador", valor: "correcto" },
        { texto: "Un botón para apagar la computadora", valor: "incorrecto" },
        { texto: "Una carpeta donde se guardan las fotos", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Dónde se escribe la dirección de un sitio web?",
      opciones: [
        { texto: "En la barra de direcciones, arriba de la página", valor: "correcto" },
        { texto: "En el buscador de la galería de fotos", valor: "incorrecto" },
        { texto: "En un mensaje de texto", valor: "incorrecto" }
      ]
    },
    {
      texto: "Si se corta internet, ¿qué pasa con el navegador?",
      opciones: [
        { texto: "Se borran todas las páginas para siempre", valor: "incorrecto" },
        { texto: "No se abren páginas nuevas, pero lo guardado puede verse", valor: "correcto" },
        { texto: "La computadora se apaga sola", valor: "incorrecto" }
      ]
    }
  ],
  "202": [
    {
      texto: "¿Qué es el historial del navegador?",
      opciones: [
        { texto: "La lista de sitios que visitaste", valor: "correcto" },
        { texto: "El nombre de tu red WiFi", valor: "incorrecto" },
        { texto: "La contraseña del correo", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Qué es una ventana emergente?",
      opciones: [
        { texto: "Un aviso o publicidad que aparece sin pedir permiso", valor: "correcto" },
        { texto: "Una foto que se guarda en la galería", valor: "incorrecto" },
        { texto: "Un cable para cargar el celular", valor: "incorrecto" }
      ]
    },
    {
      texto: "En una dirección web, ¿qué parte indica el nombre del sitio?",
      opciones: [
        { texto: "Las letras que están antes de la arroba", valor: "incorrecto" },
        { texto: "El dominio, por ejemplo ansas.gob.ar", valor: "correcto" },
        { texto: "El número de la batería", valor: "incorrecto" }
      ]
    }
  ],
  "203": [
    {
      texto: "¿Cómo se copia un enlace que te enviaron?",
      opciones: [
        { texto: "Manteniéndolo apretado y eligiendo Copiar", valor: "correcto" },
        { texto: "Tocándolo muchas veces seguidas", valor: "incorrecto" },
        { texto: "Apagando el celular", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Qué significa adjuntar un archivo?",
      opciones: [
        { texto: "Borrar el archivo del celular", valor: "incorrecto" },
        { texto: "Agregar el archivo al mensaje que vas a enviar", valor: "correcto" },
        { texto: "Cambiarle el nombre a la aplicación", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Para qué sirve Responder en un correo electrónico?",
      opciones: [
        { texto: "Para contestar citando el mensaje original", valor: "correcto" },
        { texto: "Para borrar la cuenta de correo", valor: "incorrecto" },
        { texto: "Para cambiar la contraseña", valor: "incorrecto" }
      ]
    }
  ],
  "204": [
    {
      texto: "¿Qué es una frase de contraseña?",
      opciones: [
        { texto: "Varias palabras juntas, larga y fácil de recordar", valor: "correcto" },
        { texto: "Tu nombre y tu año de nacimiento", valor: "incorrecto" },
        { texto: "La misma clave que usás en todos lados", valor: "incorrecto" }
      ]
    },
    {
      texto: "Antes de comprar en un sitio, ¿qué conviene revisar?",
      opciones: [
        { texto: "Que tenga muchos colores y fotos", valor: "incorrecto" },
        { texto: "Que la dirección sea la oficial y tenga candado", valor: "correcto" },
        { texto: "Que el precio sea el más bajo de todos", valor: "incorrecto" }
      ]
    },
    {
      texto: "Si olvidaste una contraseña, ¿qué conviene hacer?",
      opciones: [
        { texto: "Crear otra cuenta con otro correo", valor: "incorrecto" },
        { texto: "Usar la opción «Olvidé mi contraseña» del sitio oficial", valor: "correcto" },
        { texto: "Pedirle la clave a un desconocido", valor: "incorrecto" }
      ]
    }
  ],

  /* ==========================================================
     CURSO 3 - TRÁMITES EN LÍNEA
     ========================================================== */
  "301": [
    {
      texto: "¿Qué es un turno?",
      opciones: [
        { texto: "Un día y una hora reservados para hacer un trámite", valor: "correcto" },
        { texto: "Un número de teléfono del organismo", valor: "incorrecto" },
        { texto: "Una constancia de domicilio", valor: "incorrecto" }
      ]
    },
    {
      texto: "Si un trámite tiene plazo, ¿qué conviene hacer?",
      opciones: [
        { texto: "Anotar la fecha y hacerlo con anticipación", valor: "correcto" },
        { texto: "Esperar al último día para hacerlo", valor: "incorrecto" },
        { texto: "Olvidarlo y esperar un aviso", valor: "incorrecto" }
      ]
    },
    {
      texto: "Después de completar un trámite, ¿qué conviene guardar?",
      opciones: [
        { texto: "Solo el nombre del organismo", valor: "incorrecto" },
        { texto: "El comprobante y el número de trámite", valor: "correcto" },
        { texto: "La contraseña de tu cuenta", valor: "incorrecto" }
      ]
    }
  ],
  "302": [
    {
      texto: "¿Cuál es la diferencia entre DNI y CUIL?",
      opciones: [
        { texto: "El DNI identifica a la persona y el CUIL, como trabajador", valor: "correcto" },
        { texto: "Son exactamente el mismo número", valor: "incorrecto" },
        { texto: "El CUIL sirve solo para el banco", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Qué dato de tu cuenta no se comparte con nadie?",
      opciones: [
        { texto: "El horario de atención del organismo", valor: "incorrecto" },
        { texto: "La contraseña o clave fiscal", valor: "correcto" },
        { texto: "El nombre del trámite que estás haciendo", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Para qué sirve la verificación con DNI en un sitio oficial?",
      opciones: [
        { texto: "Para confirmar que sos vos quien hace el trámite", valor: "correcto" },
        { texto: "Para pedirte un pago extra", valor: "incorrecto" },
        { texto: "Para publicar tus datos en internet", valor: "incorrecto" }
      ]
    }
  ],
  "303": [
    {
      texto: "Antes de enviar un formulario, ¿qué conviene revisar?",
      opciones: [
        { texto: "Que los datos estén completos y bien escritos", valor: "correcto" },
        { texto: "Que la letra sea de color llamativo", valor: "incorrecto" },
        { texto: "Que el formulario tenga muchas preguntas", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Cómo podés guardar el comprobante de un trámite?",
      opciones: [
        { texto: "Con la opción Guardar como PDF o descargar", valor: "correcto" },
        { texto: "Sacando una foto a la pantalla apagada", valor: "incorrecto" },
        { texto: "Cerrando el navegador sin guardar", valor: "incorrecto" }
      ]
    },
    {
      texto: "Se cortó internet mientras hacías un trámite. ¿Qué hacés?",
      opciones: [
        { texto: "Repetir el envío varias veces sin mirar", valor: "incorrecto" },
        { texto: "Verificar si quedó registrado antes de repetirlo", valor: "correcto" },
        { texto: "Crear una cuenta nueva", valor: "incorrecto" }
      ]
    }
  ],
  "304": [
    {
      texto: "Alguien te cobra por un trámite que es gratuito. ¿Qué hacés?",
      opciones: [
        { texto: "Pagar rápido para no perder el turno", valor: "incorrecto" },
        { texto: "Desconfiar y hacerlo por el canal oficial", valor: "correcto" },
        { texto: "Darle los datos de tu tarjeta por teléfono", valor: "incorrecto" }
      ]
    },
    {
      texto: "Si un trámite salió mal, ¿cómo se hace un reclamo?",
      opciones: [
        { texto: "Con el número de trámite y las pruebas, por el canal oficial", valor: "correcto" },
        { texto: "Contándolo solo en redes sociales", valor: "incorrecto" },
        { texto: "Borrando todos los correos del organismo", valor: "incorrecto" }
      ]
    },
    {
      texto: "Si cambiás de celular, ¿qué datos conviene actualizar?",
      opciones: [
        { texto: "El fondo de pantalla", valor: "incorrecto" },
        { texto: "El teléfono y el correo en organismos y banco", valor: "correcto" },
        { texto: "El nombre de la aplicación de mensajes", valor: "incorrecto" }
      ]
    }
  ],

  /* ==========================================================
     CURSO 4 - FRAUDES DIGITALES
     ========================================================== */
  "401": [
    {
      texto: "¿Cuál es una señal de que un mensaje puede ser una estafa?",
      opciones: [
        { texto: "Que te apure a decidir en el momento", valor: "correcto" },
        { texto: "Que te salude con respeto", valor: "incorrecto" },
        { texto: "Que tenga una letra clara y legible", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Un banco puede pedirte la contraseña por teléfono?",
      opciones: [
        { texto: "Sí, si es una urgencia", valor: "incorrecto" },
        { texto: "Solo si llamás vos primero", valor: "incorrecto" },
        { texto: "Nunca, por ningún motivo", valor: "correcto" }
      ]
    },
    {
      texto: "Te avisan que ganaste un premio que no pediste. ¿Qué hacés?",
      opciones: [
        { texto: "Desconfiar y no dar datos ni pagar nada", valor: "correcto" },
        { texto: "Pagar el envío para recibirlo", valor: "incorrecto" },
        { texto: "Dar tu número de tarjeta para confirmar", valor: "incorrecto" }
      ]
    }
  ],
  "402": [
    {
      texto: "¿Qué es la ingeniería social?",
      opciones: [
        { texto: "Convencerte de dar datos sin usar la fuerza", valor: "correcto" },
        { texto: "Arreglar celulares en un taller", valor: "incorrecto" },
        { texto: "Una red social para mayores", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Qué es un perfil falso?",
      opciones: [
        { texto: "Una cuenta con el nombre y las fotos de otra persona", valor: "correcto" },
        { texto: "Un perfil sin foto de perfil", valor: "incorrecto" },
        { texto: "Una cuenta que usa otro idioma", valor: "incorrecto" }
      ]
    },
    {
      texto: "Recibís un código de seguridad que no pediste. ¿Qué significa?",
      opciones: [
        { texto: "Que el banco te está felicitando", valor: "incorrecto" },
        { texto: "Que alguien intenta entrar a tu cuenta", valor: "correcto" },
        { texto: "Que el celular necesita actualizarse", valor: "incorrecto" }
      ]
    }
  ],
  "403": [
    {
      texto: "¿Cómo se verifica el remitente real de un correo?",
      opciones: [
        { texto: "Abriendo los detalles para ver la dirección completa", valor: "correcto" },
        { texto: "Mirando el logo del mensaje", valor: "incorrecto" },
        { texto: "Respondiendo para preguntar quién es", valor: "incorrecto" }
      ]
    },
    {
      texto: "Recibís un mensaje sospechoso. ¿Qué conviene hacer?",
      opciones: [
        { texto: "Guardar una captura, bloquear y denunciar", valor: "correcto" },
        { texto: "Reenviarlo a tus contactos para avisar", valor: "incorrecto" },
        { texto: "Tocar el enlace para ver qué pasa", valor: "incorrecto" }
      ]
    },
    {
      texto: "Si diste tu clave por error, ¿a quién avisás primero?",
      opciones: [
        { texto: "A tus vecinos", valor: "incorrecto" },
        { texto: "Al banco, para bloquear las operaciones", valor: "correcto" },
        { texto: "A nadie, para no preocupar", valor: "incorrecto" }
      ]
    }
  ],
  "404": [
    {
      texto: "¿Dónde se puede denunciar una estafa?",
      opciones: [
        { texto: "En la comisaría o fiscalía, con las pruebas", valor: "correcto" },
        { texto: "Solo en un grupo de mensajes", valor: "incorrecto" },
        { texto: "En la aplicación de la cámara", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Para qué sirven las actualizaciones del celular?",
      opciones: [
        { texto: "Para borrar todos los contactos", valor: "incorrecto" },
        { texto: "Para corregir fallas de seguridad", valor: "correcto" },
        { texto: "Para cambiar el número de teléfono", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Qué conviene revisar en los permisos de una aplicación?",
      opciones: [
        { texto: "Que tenga solo los permisos que necesita", valor: "correcto" },
        { texto: "Que tenga todos los permisos posibles", valor: "incorrecto" },
        { texto: "Que no tenga ningún permiso nunca", valor: "incorrecto" }
      ]
    }
  ],

  /* ==========================================================
     CURSO 5 - COMUNICACIÓN DIGITAL
     ========================================================== */
  "501": [
    {
      texto: "¿Qué es una videollamada?",
      opciones: [
        { texto: "Una llamada con imagen y sonido", valor: "correcto" },
        { texto: "Un mensaje de texto con fotos", valor: "incorrecto" },
        { texto: "Una llamada sin conexión a internet", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Dónde conviene que esté la luz en una videollamada?",
      opciones: [
        { texto: "Detrás de tu espalda", valor: "incorrecto" },
        { texto: "De frente, iluminando tu cara", valor: "correcto" },
        { texto: "Apagada para que no moleste", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Cómo se termina una videollamada?",
      opciones: [
        { texto: "Tocando el botón rojo con el dibujo de un teléfono", valor: "correcto" },
        { texto: "Apagando el WiFi de la casa", valor: "incorrecto" },
        { texto: "Cerrando la aplicación de la cámara", valor: "incorrecto" }
      ]
    }
  ],
  "502": [
    {
      texto: "¿Qué significa la doble tilde azul en WhatsApp?",
      opciones: [
        { texto: "Que el mensaje fue leído", valor: "correcto" },
        { texto: "Que el mensaje llegó al correo", valor: "incorrecto" },
        { texto: "Que el mensaje se borró", valor: "incorrecto" }
      ]
    },
    {
      texto: "Si guardás una foto que te enviaron, ¿dónde la encontrás?",
      opciones: [
        { texto: "En la galería del celular", valor: "correcto" },
        { texto: "En la aplicación del banco", valor: "incorrecto" },
        { texto: "En el historial del navegador", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Para qué sirve el respaldo de las conversaciones?",
      opciones: [
        { texto: "Para borrar los mensajes viejos", valor: "incorrecto" },
        { texto: "Para recuperarlas si cambiás de celular", valor: "correcto" },
        { texto: "Para compartir todo con desconocidos", valor: "incorrecto" }
      ]
    }
  ],
  "503": [
    {
      texto: "¿Cómo se graba un mensaje de voz?",
      opciones: [
        { texto: "Manteniendo apretado el micrófono mientras hablás", valor: "correcto" },
        { texto: "Escribiendo el texto y tocando el micrófono", valor: "incorrecto" },
        { texto: "Apagando el celular y hablando fuerte", valor: "incorrecto" }
      ]
    },
    {
      texto: "Antes de enviar una foto, ¿qué conviene revisar?",
      opciones: [
        { texto: "Que no se vean datos sensibles en el fondo", valor: "correcto" },
        { texto: "Que el color sea llamativo", valor: "incorrecto" },
        { texto: "Que la foto pese mucho", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Cómo se responde a un mensaje anterior en un grupo?",
      opciones: [
        { texto: "Manteniéndolo apretado y eligiendo Responder", valor: "correcto" },
        { texto: "Escribiendo el nombre del grupo", valor: "incorrecto" },
        { texto: "Silenciando la conversación", valor: "incorrecto" }
      ]
    }
  ],
  "504": [
    {
      texto: "¿Qué conviene hacer con una cadena de mensajes?",
      opciones: [
        { texto: "No reenviarla y verificar la información", valor: "correcto" },
        { texto: "Reenviarla a todos por las dudas", valor: "incorrecto" },
        { texto: "Compartirla en todos los grupos", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Qué datos no conviene compartir en un grupo?",
      opciones: [
        { texto: "El clima de la semana", valor: "incorrecto" },
        { texto: "Contraseñas y datos de salud", valor: "correcto" },
        { texto: "Una receta de cocina", valor: "incorrecto" }
      ]
    },
    {
      texto: "¿Para qué sirve bloquear un contacto?",
      opciones: [
        { texto: "Para no recibir más sus mensajes ni llamadas", valor: "correcto" },
        { texto: "Para borrar todas tus conversaciones", valor: "incorrecto" },
        { texto: "Para cambiar tu número de teléfono", valor: "incorrecto" }
      ]
    }
  ]
};
