/* ============================================
   TAMI - Contenido del Campus Educativo
   --------------------------------------------
   Cada curso tiene 4 niveles de comprensión:
     1. Descubrir          (qué es y para qué sirve)
     2. Comprender         (cómo funciona por dentro)
     3. Practicar          (hacerlo paso a paso)
     4. Dominar y proteger (usarlo con autonomía y seguridad)

   Todo el texto está pensado para personas mayores:
   lenguaje simple, ejemplos cotidianos, pasos cortos y
   sin dar por sabido ningún conocimiento previo.
   ============================================ */

const NIVELES_COMPRENSION = [
  {
    numero: 1,
    etiqueta: "Descubrir",
    descripcion: "Conocer qué es, para qué sirve y perder el miedo. No hace falta saber nada antes."
  },
  {
    numero: 2,
    etiqueta: "Comprender",
    descripcion: "Entender cómo funciona por dentro y por qué pasan las cosas."
  },
  {
    numero: 3,
    etiqueta: "Practicar",
    descripcion: "Hacerlo paso a paso, con el celular o la computadora en la mano."
  },
  {
    numero: 4,
    etiqueta: "Dominar y proteger",
    descripcion: "Usarlo con autonomía, cuidarte de las estafas y poder ayudar a otras personas."
  }
];

const CONTENIDO_CURSOS = [
  /* ==========================================================
     CURSO 1 - USO DE SMARTPHONES
     ========================================================== */
  {
    id: 1,
    titulo: "Uso de Smartphones",
    tema: "movil",
    icono: "📱",
    nivel: "principiante",
    duracion: 80,
    resumen: "Perdé el miedo al celular: aprendé a encenderlo, usarlo, comunicarte y protegerlo, desde cero y sin apuro.",
    porQueImporta: "El celular es la puerta de entrada a casi todo lo demás: comunicarse, hacer trámites, sacar fotos y pedir ayuda. Dominarlo te da autonomía.",
    modulos: [
      {
        numero: 1,
        titulo: "Conocer tu celular",
        nivelComprension: "Descubrir",
        subtitulo: "Qué es, qué partes tiene y cómo se enciende",
        duracion: 20,
        objetivo: "Reconocer las partes del celular y animarte a encenderlo y explorarlo sin miedo.",
        objetivos: [
          "Entender qué es un celular inteligente y en qué se diferencia de los teléfonos de antes.",
          "Reconocer las partes principales: pantalla, botones, cámara, parlante y entrada de carga.",
          "Encender, desbloquear y apagar el celular sin ayuda.",
          "Identificar los iconos de la pantalla de inicio y volver atrás cuando te equivocás."
        ],
        pasos: [
          {
            titulo: "¿Qué es un celular inteligente?",
            contenido: `<p>Un <strong>celular inteligente</strong> (también llamado <em>smartphone</em>) es un teléfono que además funciona como una pequeña computadora. Sirve para llamar, pero también para mandar mensajes, sacar fotos, ver videos, hacer trámites y hablar por videollamada.</p>
<p>La gran diferencia con los teléfonos de antes es la <strong>pantalla táctil</strong>: en lugar de apretar teclas, tocás la pantalla con el dedo. No se rompe por tocar suave, ni por equivocarte, ni por abrir algo que no era.</p>
<p>Pensalo así: es como una ventana que se abre a muchos lugares. Vos decidís qué mirar y cuándo cerrarla.</p>`,
            consejo: "💡 Consejo: No existe ningún botón que arruine el celular por tocarlo. Si algo sale mal, siempre se puede volver atrás."
          },
          {
            titulo: "Las partes del celular",
            contenido: `<p>Todo celular tiene estas partes. Reconocerlas te ayuda a saber qué tocar y para qué sirve cada cosa:</p>
<ul>
<li><strong>Pantalla:</strong> la parte grande y brillante. Muestra todo lo que hacés y responde a tus dedos.</li>
<li><strong>Botones del costado:</strong> uno enciende y apaga el equipo; el otro sube o baja el volumen.</li>
<li><strong>Cámara:</strong> los circulitos de atrás y el puntito de adelante sirven para fotos, videos y videollamadas.</li>
<li><strong>Parlante y micrófono:</strong> por el parlante escuchás; por el micrófono te escuchan.</li>
<li><strong>Entrada de carga:</strong> el huequito donde se conecta el cable para cargar la batería.</li>
</ul>
<p>Si mirás el celular y ubicás estas cinco partes, ya conocés lo esencial.</p>`,
            consejo: "💡 Consejo: Si el celular no enciende, primero revisá que tenga carga. Conectalo 15 minutos y volvé a intentar."
          },
          {
            titulo: "Encender, desbloquear y apagar",
            contenido: `<p>Para <strong>encender</strong> el celular, mantené apretado el botón del costado durante 2 o 3 segundos, hasta que aparezca el logo en la pantalla. Para <strong>apagarlo</strong>, hacé lo mismo y elegí la opción «Apagar».</p>
<p>Cuando dejás el celular un rato, la pantalla se apaga sola y el equipo queda <strong>bloqueado</strong>. Eso es una protección: nadie puede usarlo sin tu permiso.</p>
<p>Para usarlo de nuevo, tocá la pantalla y deslizá el dedo hacia arriba. Si configuraste un <strong>PIN</strong> (un número de 4 a 6 dígitos) o un patrón, ingresalo. Ese número es tuyo y no se comparte con nadie.</p>`,
            consejo: "💡 Consejo: Si te equivocás con el PIN, no pasa nada: esperá unos segundos y volvé a probar con calma."
          },
          {
            titulo: "La pantalla de inicio y los iconos",
            contenido: `<p>La <strong>pantalla de inicio</strong> es como el escritorio de una casa: ahí están los accesos a todo. Los cuadraditos con dibujos se llaman <strong>iconos</strong> y cada uno abre una <strong>aplicación</strong> (o <em>app</em>).</p>
<p>Arriba de todo vas a ver la <strong>barra de estado</strong>: la hora, la batería, la señal del celular y el WiFi. Si la batería está baja, aparece un dibujito rojo o naranja.</p>
<p>Para abrir algo, tocá el icono una vez. Para volver a la pantalla anterior, tocá la flecha o el botón de atrás. Para volver al inicio, tocá el círculo o la línea que está abajo.</p>`,
            consejo: "💡 Consejo: Tocá con la yema del dedo, sin apuro. Si abriste algo que no querías, volvé con la flecha y listo."
          }
        ],
        glosario: [
          { termino: "Pantalla táctil", definicion: "Superficie que responde al toque del dedo y permite usar el celular sin teclas." },
          { termino: "App (aplicación)", definicion: "Programa que se instala en el celular para hacer una tarea: llamar, mandar mensajes, ver el clima." },
          { termino: "PIN", definicion: "Número secreto de 4 a 6 dígitos que desbloquea el celular. No se comparte." }
        ],
        examen: [
          {
            texto: "¿Qué diferencia principal tiene un celular inteligente con un teléfono de antes?",
            opciones: [
              { texto: "Tiene pantalla táctil y funciona como una pequeña computadora", valor: "correcto" },
              { texto: "No se puede usar para llamar", valor: "incorrecto" },
              { texto: "Solo sirve para sacar fotos", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Para qué sirve el botón del costado del celular?",
            opciones: [
              { texto: "Para encender, apagar y bloquear el equipo", valor: "correcto" },
              { texto: "Para cambiar el color de la pantalla", valor: "incorrecto" },
              { texto: "Para borrar todas las fotos", valor: "incorrecto" }
            ]
          },
          {
            texto: "Si abriste una aplicación que no querías, ¿qué conviene hacer?",
            opciones: [
              { texto: "Tocar la flecha o el botón de atrás para volver", valor: "correcto" },
              { texto: "Apagar el celular y llevarlo a reparar", valor: "incorrecto" },
              { texto: "Sacar la batería", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 2,
        titulo: "Entender cómo funciona",
        nivelComprension: "Comprender",
        subtitulo: "Aplicaciones, actualizaciones, batería y conexión",
        duracion: 20,
        objetivo: "Entender qué hay detrás de la pantalla para tomar mejores decisiones y no depender de nadie.",
        objetivos: [
          "Saber qué es una aplicación y de dónde conviene descargarla.",
          "Entender para qué sirven las actualizaciones del sistema.",
          "Cuidar la batería y el espacio de almacenamiento del celular.",
          "Distinguir entre WiFi y datos móviles, y saber cuándo usa cada uno."
        ],
        pasos: [
          {
            titulo: "¿Qué es una aplicación?",
            contenido: `<p>Una <strong>aplicación</strong> es un programa que se instala en el celular para hacer una tarea concreta: WhatsApp para mensajes, la cámara para fotos, el banco para consultar tu cuenta, el clima para ver si va a llover.</p>
<p>Las aplicaciones se descargan de una <strong>tienda oficial</strong>: <em>Play Store</em> en los celulares Android y <em>App Store</em> en los iPhone. Esas tiendas son las únicas seguras: si alguien te manda un enlace para «instalar una app», desconfiá.</p>
<p>Cada app ocupa un lugar en el celular y puede pedir permisos (por ejemplo, usar la cámara). Vos decidís si se los das.</p>`,
            consejo: "💡 Consejo: Descargá aplicaciones solo desde la tienda oficial del celular, nunca desde un enlace que te llega por mensaje."
          },
          {
            titulo: "El sistema y las actualizaciones",
            contenido: `<p>El <strong>sistema operativo</strong> es el programa principal que hace funcionar el celular. Los más conocidos son <strong>Android</strong> (Samsung, Motorola, Xiaomi) y <strong>iOS</strong> (iPhone).</p>
<p>Cada tanto, el fabricante envía <strong>actualizaciones</strong>: pequeñas mejoras que corrigen errores y cierran puertas de seguridad. Cuando aparece un aviso de actualización, conviene aceptarlo, preferentemente con batería y WiFi.</p>
<p>Actualizar no borra tus fotos ni tus contactos. Solo mejora el funcionamiento. Si el aviso te da desconfianza, pedile a alguien de confianza que te acompañe, pero no lo ignores para siempre.</p>`,
            consejo: "💡 Consejo: Las actualizaciones son como el mantenimiento de una casa: cuestan un rato, pero evitan problemas mayores."
          },
          {
            titulo: "Batería, memoria y almacenamiento",
            contenido: `<p>El celular tiene dos «memorias» que conviene no confundir:</p>
<ul>
<li><strong>Almacenamiento:</strong> es el espacio donde viven las fotos, los videos y las apps. Si se llena, el celular se pone lento y no deja sacar más fotos.</li>
<li><strong>Memoria de trabajo:</strong> es la que usa el celular para funcionar en el momento. Se libera cerrando las apps que no estás usando.</li>
</ul>
<p>La <strong>batería</strong> dura más si bajás el brillo de la pantalla, cerrás las apps que no usás y evitás dejarlo cargando toda la noche. Cargalo cuando esté por debajo del 20% y desenchufalo cuando llegue al 100%.</p>`,
            consejo: "💡 Consejo: Si el celular avisa que no hay espacio, borrá videos viejos o pasalos a una computadora. No borres fotos sin revisarlas antes."
          },
          {
            titulo: "WiFi y datos móviles",
            contenido: `<p>El celular se conecta a internet de dos maneras:</p>
<ul>
<li><strong>WiFi:</strong> es la red de una casa, un café o un organismo. No consume los datos del plan y suele ser más rápida.</li>
<li><strong>Datos móviles:</strong> es la conexión que da tu compañía de telefonía. Tiene un límite mensual y, si se pasa, puede costar dinero extra.</li>
</ul>
<p>Cuando el icono del WiFi está encendido, el celular usa esa red. Si no hay WiFi, puede usar datos móviles automáticamente. En «Ajustes» podés decidir cuál usar y apagar los datos si querés ahorrar.</p>
<p>Las redes WiFi públicas (de un shopping o una plaza) no siempre son seguras: evitá entrar al banco desde una red abierta.</p>`,
            consejo: "💡 Consejo: En casa, conectate siempre al WiFi. Si estás fuera y no necesitás internet, apagá los datos móviles para no gastar el plan."
          }
        ],
        glosario: [
          { termino: "Sistema operativo", definicion: "Programa principal que hace funcionar el celular: Android o iOS." },
          { termino: "Almacenamiento", definicion: "Espacio donde se guardan fotos, videos, mensajes y aplicaciones." },
          { termino: "Datos móviles", definicion: "Internet que brinda la compañía telefónica y que tiene un límite mensual." }
        ],
        examen: [
          {
            texto: "¿De dónde conviene descargar las aplicaciones?",
            opciones: [
              { texto: "Desde la tienda oficial del celular (Play Store o App Store)", valor: "correcto" },
              { texto: "Desde cualquier enlace que llegue por WhatsApp", valor: "incorrecto" },
              { texto: "Desde un correo que dice «instalar app gratis»", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué hacen las actualizaciones del sistema?",
            opciones: [
              { texto: "Mejoran el funcionamiento y corrigen problemas de seguridad", valor: "correcto" },
              { texto: "Borran todas las fotos y contactos", valor: "incorrecto" },
              { texto: "Cambian el número de teléfono", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Cuál es la diferencia entre WiFi y datos móviles?",
            opciones: [
              { texto: "El WiFi es una red fija y los datos móviles son la conexión de la compañía con límite mensual", valor: "correcto" },
              { texto: "Son exactamente lo mismo", valor: "incorrecto" },
              { texto: "El WiFi solo funciona de noche", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 3,
        titulo: "Llamar, escribir y sacar fotos",
        nivelComprension: "Practicar",
        subtitulo: "Las tareas del día a día, paso a paso",
        duracion: 20,
        objetivo: "Realizar por tu cuenta las tareas más usadas: llamar, guardar contactos, escribir mensajes y usar la cámara.",
        objetivos: [
          "Hacer y recibir llamadas, y usar el altavoz cuando haga falta.",
          "Guardar un contacto nuevo y escribir un mensaje sin apuro.",
          "Sacar una foto o un video y encontrarlo en la galería.",
          "Instalar y borrar una aplicación de forma segura."
        ],
        pasos: [
          {
            titulo: "Hacer y recibir llamadas",
            contenido: `<p>Para <strong>llamar</strong>, abrí la app de teléfono (el icono suele ser un tubo verde). Tocá los números en el teclado y después el botón verde de llamar. Para <strong>cortar</strong>, tocá el botón rojo.</p>
<p>Cuando te llaman, la pantalla muestra el número o el nombre. Tocá el botón verde para atender o el rojo para rechazar. Si querés escuchar sin sostener el celular en la oreja, tocá el icono del <strong>altavoz</strong>.</p>
<p>Si perdiste una llamada, aparece un aviso. Tocá «Llamadas recientes» para ver quién llamó y devolver el llamado con un toque.</p>`,
            consejo: "💡 Consejo: Para llamar a un número largo, guardalo antes como contacto. Así no tenés que memorizarlo ni escribirlo cada vez."
          },
          {
            titulo: "Guardar contactos y escribir mensajes",
            contenido: `<p>Para <strong>guardar un contacto</strong>, abrí la app de teléfono o contactos, tocá «Nuevo contacto» y escribí el nombre y el número. Guardalo y verificá que el número esté bien escrito antes de llamar.</p>
<p>Para <strong>escribir un mensaje</strong>, abrí la app de mensajes, elegí el contacto y tocá el espacio blanco de abajo: aparece el <strong>teclado</strong>. Escribí con calma y tocá la flecha de enviar.</p>
<p>El teclado tiene una tecla para borrar (la flecha hacia atrás), otra para mayúsculas (la flecha hacia arriba) y otra para cambiar de letras a números. No hace falta escribir rápido: el mensaje espera.</p>`,
            consejo: "💡 Consejo: Antes de enviar, leé el mensaje una vez. Si te equivocaste, podés borrar con la tecla de flecha hacia atrás."
          },
          {
            titulo: "Sacar fotos y videos",
            contenido: `<p>Abrí la app <strong>Cámara</strong>. Vas a ver la imagen que enfoca el lente y un botón redondo grande: tocalo para sacar la <strong>foto</strong>. Para grabar un <strong>video</strong>, tocá el botón de video y volvé a tocarlo para detener.</p>
<p>Las fotos quedan guardadas en la <strong>Galería</strong> (o «Fotos»). Ahí podés verlas, ampliarlas y compartirlas con un toque en el botón de compartir.</p>
<p>Si la foto sale movida, apoyá los codos o el celular sobre una superficie firme. La luz natural ayuda mucho: cerca de una ventana las fotos salen mejor.</p>`,
            consejo: "💡 Consejo: No borres fotos por error: las fotos borradas suelen quedar en una papelera durante 30 días."
          },
          {
            titulo: "Instalar y borrar aplicaciones",
            contenido: `<p>Para <strong>instalar</strong> una app, abrí la tienda oficial, escribí su nombre en el buscador y tocá «Instalar». Esperá a que termine y abrila desde la pantalla de inicio.</p>
<p>Para <strong>borrar</strong> una app que no usás, mantené apretado su icono unos segundos y elegí «Desinstalar» o «Quitar». Eso libera espacio y ordena la pantalla.</p>
<p>Cuando una app pide permisos (cámara, micrófono, ubicación), leé qué pide. Si una linterna pide acceso a tus contactos, es una señal rara: mejor no instalarla.</p>`,
            consejo: "💡 Consejo: Si una app no la usaste en meses, borrala. Menos apps significa un celular más rápido y más seguro."
          }
        ],
        glosario: [
          { termino: "Contacto", definicion: "Ficha donde se guarda el nombre y el número de una persona para no memorizarlo." },
          { termino: "Galería", definicion: "Lugar del celular donde se guardan y se ven las fotos y los videos." },
          { termino: "Permiso", definicion: "Autorización que le das a una app para usar la cámara, el micrófono, la ubicación u otra función." }
        ],
        examen: [
          {
            texto: "¿Cómo se corta una llamada en el celular?",
            opciones: [
              { texto: "Tocando el botón rojo", valor: "correcto" },
              { texto: "Apagando el celular", valor: "incorrecto" },
              { texto: "Sacando la tarjeta SIM", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Dónde quedan guardadas las fotos que sacás?",
            opciones: [
              { texto: "En la Galería o app de Fotos", valor: "correcto" },
              { texto: "Se envían solas a internet", valor: "incorrecto" },
              { texto: "Se borran al apagar el celular", valor: "incorrecto" }
            ]
          },
          {
            texto: "Una app de linterna te pide acceso a tus contactos. ¿Qué conviene hacer?",
            opciones: [
              { texto: "Desconfiar y no instalarla", valor: "correcto" },
              { texto: "Aceptar todo sin leer", valor: "incorrecto" },
              { texto: "Darle también acceso a las fotos", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 4,
        titulo: "Usarlo con seguridad",
        nivelComprension: "Dominar y proteger",
        subtitulo: "Bloqueo, permisos, copias de seguridad y emergencias",
        duracion: 20,
        objetivo: "Proteger tu celular y tus datos, y saber qué hacer si lo perdés o recibís un engaño.",
        objetivos: [
          "Configurar el bloqueo de pantalla con PIN o patrón.",
          "Revisar los permisos de las aplicaciones y quitar los innecesarios.",
          "Entender la importancia de las actualizaciones y las copias de seguridad.",
          "Saber qué hacer si perdés el celular o si te llega una estafa."
        ],
        pasos: [
          {
            titulo: "Bloquear la pantalla con PIN o patrón",
            contenido: `<p>El <strong>bloqueo de pantalla</strong> es la primera defensa del celular. Sin él, cualquiera que lo encuentre puede ver tus fotos, tus mensajes y tus cuentas.</p>
<p>Para configurarlo, entrá en «Ajustes» → «Seguridad» → «Bloqueo de pantalla». Elegí un <strong>PIN</strong> de 4 a 6 números que puedas recordar pero que otra persona no adivine. Evitá 1234, 0000 o tu año de nacimiento.</p>
<p>También podés activar el <strong>desbloqueo con huella</strong> o con el rostro, que es cómodo y seguro. El PIN queda como respaldo por si el sensor falla.</p>`,
            consejo: "💡 Consejo: Nunca compartas tu PIN, ni siquiera con alguien que dice ser del banco o de la compañía telefónica."
          },
          {
            titulo: "Revisar los permisos de las apps",
            contenido: `<p>Cada app puede pedir permiso para usar la <strong>cámara</strong>, el <strong>micrófono</strong>, la <strong>ubicación</strong>, los <strong>contactos</strong> o las <strong>fotos</strong>. No todas necesitan todo.</p>
<p>Entrá en «Ajustes» → «Aplicaciones» → elegí una app → «Permisos». Ahí podés quitar los que no tengan sentido: una calculadora no necesita tu ubicación; una app de fotos no necesita tus contactos.</p>
<p>Si una app insiste en un permiso que no le corresponde, es una buena razón para desinstalarla. Tu información vale más que cualquier juego.</p>`,
            consejo: "💡 Consejo: Revisá los permisos cada tanto, sobre todo después de instalar algo nuevo. Es una revisión de cinco minutos que evita muchos problemas."
          },
          {
            titulo: "Actualizaciones y copia de seguridad",
            contenido: `<p>Las <strong>actualizaciones</strong> del sistema y de las apps corrigen fallas y mejoran la seguridad. Aceptalas cuando tengas WiFi y batería suficiente.</p>
<p>Una <strong>copia de seguridad</strong> guarda tus contactos, fotos y mensajes en un lugar seguro. Si el celular se rompe o se pierde, podés recuperar todo en uno nuevo.</p>
<p>En Android suele estar en «Ajustes» → «Google» → «Copia de seguridad». En iPhone, en «Ajustes» → tu nombre → «iCloud» → «Copia de seguridad». Activá la copia automática y, cada tanto, verificá que se haya hecho.</p>`,
            consejo: "💡 Consejo: Una copia de seguridad es como guardar una llave extra de casa: no la usás todos los días, pero el día que la necesitás lo cambia todo."
          },
          {
            titulo: "Si te roban el celular o recibís una estafa",
            contenido: `<p>Si <strong>perdés o te roban el celular</strong>: primero llamá a tu compañía telefónica para bloquear la línea y el equipo. Después cambiá las contraseñas de tu correo, tu banco y tus redes desde otro dispositivo. Si tenías la ubicación activada, podés intentar localizarlo desde otra computadora o celular.</p>
<p>Si recibís un <strong>mensaje sospechoso</strong> pidiendo datos, códigos o dinero: no respondas, no hagas clic y no compartas el código que llega por SMS. Ese código es la llave de tus cuentas.</p>
<p>Ante la duda, siempre: <strong>pará, pensá y consultá</strong> con alguien de confianza o con el organismo oficial.</p>`,
            consejo: "💡 Consejo: Si te roban, actuá rápido: bloquear la línea en los primeros minutos evita cargos y estafas."
          }
        ],
        glosario: [
          { termino: "Copia de seguridad", definicion: "Respaldo de tus contactos, fotos y datos que permite recuperarlos si el celular falla." },
          { termino: "Verificación en dos pasos", definicion: "Protección extra que pide un código además de la contraseña al iniciar sesión." },
          { termino: "Phishing", definicion: "Engaño que busca que entregues datos personales haciéndose pasar por una empresa o persona conocida." }
        ],
        examen: [
          {
            texto: "¿Cuál es un buen PIN para el celular?",
            opciones: [
              { texto: "Un número que solo vos recuerdes y que no sea obvio", valor: "correcto" },
              { texto: "1234, porque es fácil de recordar", valor: "incorrecto" },
              { texto: "Tu año de nacimiento", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué hace una copia de seguridad?",
            opciones: [
              { texto: "Guarda tus contactos y fotos para recuperarlos si el celular falla", valor: "correcto" },
              { texto: "Borra los archivos duplicados", valor: "incorrecto" },
              { texto: "Comparte tus fotos con desconocidos", valor: "incorrecto" }
            ]
          },
          {
            texto: "Si te llega un SMS con un código y alguien te lo pide por teléfono, ¿qué hacés?",
            opciones: [
              { texto: "No lo comparto y corto la llamada", valor: "correcto" },
              { texto: "Se lo doy si dice ser del banco", valor: "incorrecto" },
              { texto: "Lo reenvío a mis contactos", valor: "incorrecto" }
            ]
          }
        ]
      }
    ]
  },

  /* ==========================================================
     CURSO 2 - REDES E INTERNET
     ========================================================== */
  {
    id: 2,
    titulo: "Redes e Internet",
    tema: "redes",
    icono: "🌐",
    nivel: "principiante",
    duracion: 80,
    resumen: "Entendé cómo funciona internet, cómo buscar información confiable y cómo cuidar tus datos mientras navegás.",
    porQueImporta: "Casi todo pasa por internet: noticias, trámites, compras y comunicaciones. Entenderlo te permite usarlo con confianza y detectar engaños.",
    modulos: [
      {
        numero: 1,
        titulo: "Qué es internet",
        nivelComprension: "Descubrir",
        subtitulo: "La red, el navegador y las direcciones web",
        duracion: 20,
        objetivo: "Entender qué es internet y dar los primeros pasos para navegar y buscar información.",
        objetivos: [
          "Explicar con tus palabras qué es internet y para qué se usa.",
          "Reconocer qué es un navegador y cómo se abre.",
          "Identificar las partes de una dirección web.",
          "Buscar información y distinguir resultados confiables de los dudosos."
        ],
        pasos: [
          {
            titulo: "¿Qué es internet?",
            contenido: `<p><strong>Internet</strong> es una red mundial de computadoras conectadas entre sí. Cuando entrás a un sitio, tu celular o computadora pide información a otra computadora que está en algún lugar del mundo, y esa información viaja hasta tu pantalla en segundos.</p>
<p>Es como una biblioteca gigante que nunca cierra: hay diarios, videos, bancos, organismos oficiales, tiendas y personas. Todo convive en el mismo lugar, y por eso conviene saber distinguir lo confiable de lo que no lo es.</p>
<p>Internet no es «una nube mágica»: son cables, antenas y servidores reales. Entender eso ayuda a entender por qué a veces la conexión se corta o va lenta.</p>`,
            consejo: "💡 Consejo: No hace falta saber cómo funciona un motor para manejar un auto. Con internet pasa lo mismo: entendé lo básico y animate a usarlo."
          },
          {
            titulo: "¿Qué es un navegador?",
            contenido: `<p>El <strong>navegador</strong> es el programa que usás para entrar a internet. Los más comunes son <strong>Chrome</strong>, <strong>Safari</strong>, <strong>Edge</strong> y <strong>Firefox</strong>. En el celular suele estar en un icono con forma de brújula o de círculo de colores.</p>
<p>El navegador tiene una <strong>barra de direcciones</strong> arriba, donde se escribe el nombre del sitio o lo que querés buscar. Abajo o arriba están los botones de atrás y adelante, y el de recargar.</p>
<p>Podés abrir varias <strong>pestañas</strong> a la vez, como varias hojas de un cuaderno. Cada pestaña es una página distinta y se cierran con la cruz.</p>`,
            consejo: "💡 Consejo: Si una página no carga, tocá el botón de recargar (la flecha circular) antes de preocuparte."
          },
          {
            titulo: "La dirección web",
            contenido: `<p>Cada sitio tiene una <strong>dirección</strong>, también llamada URL. Por ejemplo: <strong>www.argentina.gob.ar</strong>. Se lee de derecha a izquierda y cada parte dice algo:</p>
<ul>
<li><strong>.gob.ar:</strong> indica que es un sitio oficial del Estado argentino. Es una buena señal de confianza.</li>
<li><strong>.com:</strong> es un sitio comercial, de una empresa.</li>
<li><strong>.org:</strong> suele ser de una organización sin fines de lucro.</li>
<li><strong>www.argentina:</strong> es el nombre del sitio. Se escribe sin espacios y sin mayúsculas.</li>
</ul>
<p>Los estafadores imitan direcciones parecidas: cambian una letra, agregan un guion o usan otro final. Por eso conviene leer la dirección completa antes de escribir datos.</p>`,
            consejo: "💡 Consejo: Para los trámites, escribí vos la dirección oficial en la barra. No llegues desde un enlace que te mandaron."
          },
          {
            titulo: "Buscar información confiable",
            contenido: `<p>Para buscar, escribí palabras clave en el buscador (por ejemplo: «clima en Buenos Aires» o «turno ANSES»). Aparecerá una lista de resultados.</p>
<p>Los primeros resultados no siempre son los mejores: algunos son <strong>publicidades</strong> y llevan a sitios que pagan para estar arriba. Mirá la dirección antes de entrar.</p>
<p>Para confirmar una noticia, buscá el mismo tema en dos o tres fuentes distintas. Si solo aparece en un lugar raro, con mayúsculas y signos de exclamación, probablemente sea un engaño o una noticia falsa.</p>`,
            consejo: "💡 Consejo: Ante una noticia sorprendente, no la reenvíes todavía. Buscala en un medio conocido y comprobá si es verdad."
          }
        ],
        glosario: [
          { termino: "Navegador", definicion: "Programa para entrar a internet, como Chrome, Safari, Edge o Firefox." },
          { termino: "URL", definicion: "Dirección de un sitio web, por ejemplo www.argentina.gob.ar." },
          { termino: "Pestaña", definicion: "Cada página abierta dentro del navegador; se pueden tener varias a la vez." }
        ],
        examen: [
          {
            texto: "¿Qué es internet?",
            opciones: [
              { texto: "Una red mundial de computadoras conectadas que comparten información", valor: "correcto" },
              { texto: "Un programa que solo sirve para ver videos", valor: "incorrecto" },
              { texto: "Una sola computadora gigante en el cielo", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué indica el final «.gob.ar» en una dirección web?",
            opciones: [
              { texto: "Que es un sitio oficial del Estado argentino", valor: "correcto" },
              { texto: "Que es un sitio de juegos", valor: "incorrecto" },
              { texto: "Que el sitio es inseguro", valor: "incorrecto" }
            ]
          },
          {
            texto: "En una búsqueda, ¿los primeros resultados son siempre los más confiables?",
            opciones: [
              { texto: "No: algunos son publicidades o sitios que pagan por aparecer primero", valor: "correcto" },
              { texto: "Sí, siempre son los mejores", valor: "incorrecto" },
              { texto: "Sí, porque los elige el gobierno", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 2,
        titulo: "Cómo viaja tu información",
        nivelComprension: "Comprender",
        subtitulo: "Servidores, candados, cookies y publicidad",
        duracion: 20,
        objetivo: "Entender qué pasa con tus datos cuando navegás y qué significa realmente la seguridad de un sitio.",
        objetivos: [
          "Comprender cómo llega la información desde un servidor hasta tu pantalla.",
          "Interpretar correctamente el candado y el HTTPS.",
          "Saber qué son las cookies y por qué ves publicidad personalizada.",
          "Reconocer qué datos dejás cuando navegás."
        ],
        pasos: [
          {
            titulo: "Cómo llega la información",
            contenido: `<p>Cuando abrís un sitio, tu dispositivo envía un pedido a un <strong>servidor</strong>: una computadora potente que guarda la página. El servidor responde y la información viaja por cables, antenas y routers hasta tu pantalla.</p>
<p>Ese viaje se parece al correo: tu pedido es la carta, el servidor es el destinatario y la respuesta es la carta que vuelve. Todo ocurre en milésimas de segundo.</p>
<p>Por eso, si el WiFi está débil o el servidor está caído, la página no carga. No es que «internet se rompió»: es que el camino está lento o cortado.</p>`,
            consejo: "💡 Consejo: Si un sitio carga lento, probá con otro WiFi o esperá un momento. No escribas datos hasta que la página esté completa."
          },
          {
            titulo: "El candado y el HTTPS",
            contenido: `<p>Arriba de la página, al lado de la dirección, suele aparecer un <strong>candado</strong>. Ese candado significa que la información viaja <strong>cifrada</strong>: si alguien la intercepta, no puede leerla. La dirección empieza con <strong>https</strong>.</p>
<p>Importante: el candado garantiza que la conexión es privada, <strong>no que el sitio sea honesto</strong>. Un sitio de estafadores también puede tener candado. Por eso, además del candado, hay que mirar que la dirección sea exactamente la oficial.</p>
<p>Nunca escribas contraseñas ni datos de tarjeta en un sitio sin candado.</p>`,
            consejo: "💡 Consejo: Candado sí, pero no alcanza. Candado + dirección oficial = sitio confiable."
          },
          {
            titulo: "Cookies y publicidad",
            contenido: `<p>Las <strong>cookies</strong> son pequeños archivos que un sitio guarda en tu navegador para recordar cosas: tu idioma, tu sesión iniciada o los productos que miraste. Son útiles, pero también permiten mostrarte publicidad «personalizada».</p>
<p>Cuando aceptás todas las cookies sin leer, autorizás a muchas empresas a seguir tus pasos por distintos sitios. Eso explica por qué después ves avisos de algo que buscaste ayer.</p>
<p>Podés borrar las cookies desde la configuración del navegador. Si borrás todas, algunos sitios te pedirán iniciar sesión de nuevo. Es un precio razonable por un poco más de privacidad.</p>`,
            consejo: "💡 Consejo: Cuando un sitio pregunta si aceptás cookies, buscá la opción «Solo las necesarias» o «Rechazar las publicitarias»."
          },
          {
            titulo: "Tu huella digital",
            contenido: `<p>Cada vez que navegás dejás rastros: los sitios que visitás, lo que buscás, el dispositivo que usás y, a veces, tu ubicación. A ese conjunto se le llama <strong>huella digital</strong>.</p>
<p>No es para asustarse, pero conviene saberlo: la información se usa para publicidad, para recomendarte contenido y, en manos malintencionadas, para engañarte con mensajes muy creíbles.</p>
<p>Para cuidarla: revisá la privacidad de tus redes sociales, evitá publicar cuando te vas de viaje y no compartas datos sensibles en sitios que no conocés.</p>`,
            consejo: "💡 Consejo: Antes de publicar algo, preguntate: «¿Quién puede ver esto y qué podría hacer con esta información?»."
          }
        ],
        glosario: [
          { termino: "Servidor", definicion: "Computadora que guarda los sitios y envía la información cuando la pedís." },
          { termino: "HTTPS", definicion: "Conexión cifrada entre tu dispositivo y un sitio; se muestra con un candado." },
          { termino: "Cookie", definicion: "Archivo pequeño que un sitio guarda para recordar tus preferencias o tu sesión." }
        ],
        examen: [
          {
            texto: "¿Qué significa que una página tenga candado y HTTPS?",
            opciones: [
              { texto: "Que la información viaja cifrada, aunque no garantiza que el sitio sea honesto", valor: "correcto" },
              { texto: "Que el sitio es oficial y seguro en todos los sentidos", valor: "incorrecto" },
              { texto: "Que el sitio es gratis", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Para qué sirven las cookies?",
            opciones: [
              { texto: "Para recordar preferencias y también para publicidad personalizada", valor: "correcto" },
              { texto: "Para limpiar el celular por dentro", valor: "incorrecto" },
              { texto: "Para hacer más rápida la batería", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué es la huella digital?",
            opciones: [
              { texto: "El conjunto de rastros que dejás al navegar", valor: "correcto" },
              { texto: "La marca del dedo en la pantalla", valor: "incorrecto" },
              { texto: "Un tipo de contraseña", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 3,
        titulo: "Navegar y usar el correo",
        nivelComprension: "Practicar",
        subtitulo: "Buscar, guardar favoritos, correo y descargas",
        duracion: 20,
        objetivo: "Navegar con soltura: buscar, organizar pestañas, guardar sitios y usar el correo electrónico.",
        objetivos: [
          "Abrir, cambiar y cerrar pestañas sin perderte.",
          "Guardar un sitio en favoritos para encontrarlo fácil.",
          "Crear y usar una cuenta de correo electrónico.",
          "Descargar un archivo y encontrarlo en el dispositivo."
        ],
        pasos: [
          {
            titulo: "Pestañas: varias páginas a la vez",
            contenido: `<p>Las <strong>pestañas</strong> permiten tener varias páginas abiertas al mismo tiempo. En el celular, tocá el número dentro de un cuadrado para ver todas las pestañas abiertas; en la computadora, están arriba.</p>
<p>Para abrir una nueva, tocá el signo <strong>+</strong>. Para cerrar una, tocá la <strong>X</strong> o deslizala hacia un costado. Para cambiar de página, tocá la pestaña que quieras ver.</p>
<p>Si tenés muchas pestañas abiertas, el celular se pone lento y gasta más batería. Cerrá las que no estés usando.</p>`,
            consejo: "💡 Consejo: Si te perdiste entre tantas páginas, cerrá todas y empezá de nuevo. No se rompe nada."
          },
          {
            titulo: "Guardar favoritos",
            contenido: `<p>Los <strong>favoritos</strong> (o «marcadores») son atajos a sitios que usás seguido. Sirven para no tener que buscar la dirección cada vez.</p>
<p>Para guardar uno: abrí el sitio, tocá el menú (los tres puntos o la estrella) y elegí «Agregar a favoritos». Para volver a él, abrí el menú y tocá «Favoritos».</p>
<p>Guardá como favoritos solo sitios oficiales que ya verificaste: tu banco, el organismo de trámites, el diario que leés. Así evitás llegar a una copia falsa.</p>`,
            consejo: "💡 Consejo: Armá una carpeta de favoritos llamada «Oficiales» con los sitios que usás para trámites. Es la forma más segura de entrar."
          },
          {
            titulo: "El correo electrónico",
            contenido: `<p>El <strong>correo electrónico</strong> es como una carta que llega al instante. Sirve para comunicarte, recibir comprobantes y crear cuentas en otros sitios.</p>
<p>Para usarlo necesitás una dirección (por ejemplo, <strong>nombre@gmail.com</strong>) y una contraseña. Al escribir un correo, completá el <strong>asunto</strong> (de qué se trata), el mensaje y tocá «Enviar».</p>
<p>Podés adjuntar fotos o documentos con el clip. En la bandeja de entrada ves lo que llega; en «Enviados», lo que mandaste. Si un correo no lo esperabas, no abras sus enlaces ni adjuntos.</p>`,
            consejo: "💡 Consejo: Usá un correo distinto para los trámites importantes y otro para registrarte en juegos o compras. Así protegés el principal."
          },
          {
            titulo: "Descargar y encontrar archivos",
            contenido: `<p><strong>Descargar</strong> es traer un archivo de internet a tu dispositivo: un PDF, una foto, un comprobante. Al tocar el botón de descarga, el archivo se guarda en la carpeta <strong>Descargas</strong>.</p>
<p>En el celular, abrí la app «Archivos» o «Mis archivos» y buscá «Descargas». En la computadora, está en la carpeta Descargas del usuario.</p>
<p>Descargá solo archivos de sitios confiables. Un archivo ejecutable (.exe o .apk) que llega por correo o mensaje es una trampa frecuente: no lo abras.</p>`,
            consejo: "💡 Consejo: Si no sabés qué es un archivo o quién lo mandó, no lo abras. Preguntá antes a alguien de confianza."
          }
        ],
        glosario: [
          { termino: "Favorito", definicion: "Atajo guardado en el navegador para volver rápido a un sitio." },
          { termino: "Adjunto", definicion: "Archivo que se envía junto con un correo o mensaje." },
          { termino: "Descarga", definicion: "Acción de traer un archivo de internet al dispositivo." }
        ],
        examen: [
          {
            texto: "¿Para qué sirven los favoritos del navegador?",
            opciones: [
              { texto: "Para guardar atajos a sitios que usás seguido", valor: "correcto" },
              { texto: "Para borrar el historial", valor: "incorrecto" },
              { texto: "Para cambiar la contraseña del correo", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué es el asunto de un correo electrónico?",
            opciones: [
              { texto: "Una frase corta que resume de qué se trata el mensaje", valor: "correcto" },
              { texto: "La contraseña de la cuenta", valor: "incorrecto" },
              { texto: "El nombre del destinatario", valor: "incorrecto" }
            ]
          },
          {
            texto: "Recibís un archivo .exe por correo de un remitente desconocido. ¿Qué hacés?",
            opciones: [
              { texto: "No lo abro y lo elimino", valor: "correcto" },
              { texto: "Lo abro para ver qué es", valor: "incorrecto" },
              { texto: "Lo reenvío a mis contactos", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 4,
        titulo: "Privacidad y seguridad",
        nivelComprension: "Dominar y proteger",
        subtitulo: "Contraseñas, dos pasos, WiFi público y sitios falsos",
        duracion: 20,
        objetivo: "Navegar de forma segura y proteger tus cuentas y tus datos personales.",
        objetivos: [
          "Crear contraseñas fuertes y distintas para cada cuenta.",
          "Activar la verificación en dos pasos.",
          "Reconocer los riesgos de las redes WiFi públicas.",
          "Detectar sitios falsos y descargas peligrosas."
        ],
        pasos: [
          {
            titulo: "Contraseñas fuertes y distintas",
            contenido: `<p>Una <strong>contraseña fuerte</strong> tiene al menos 12 caracteres y combina mayúsculas, minúsculas, números y algún símbolo. Evitá nombres de familiares, fechas de nacimiento y palabras como «123456» o «password».</p>
<p>Lo más importante: <strong>no uses la misma contraseña en todos lados</strong>. Si una empresa sufre un robo de datos, los estafadores prueban esa misma contraseña en tu correo y en tu banco.</p>
<p>Una buena técnica es armar una frase fácil de recordar y transformarla: «Café con dos medialunas» puede ser <strong>CafeCon2Medialunas!</strong>. Si te resulta difícil recordar muchas, un gestor de contraseñas las guarda por vos.</p>`,
            consejo: "💡 Consejo: Anotá tus contraseñas en un cuaderno guardado en un lugar seguro de tu casa, nunca en una nota del celular ni en un mensaje."
          },
          {
            titulo: "Verificación en dos pasos",
            contenido: `<p>La <strong>verificación en dos pasos</strong> (o «doble factor») agrega una segunda llave además de la contraseña. Aunque alguien descubra tu contraseña, no podrá entrar sin el código que llega a tu celular.</p>
<p>Se activa en la configuración de seguridad de cada cuenta: correo, redes sociales, banco. Suele pedirte un número de teléfono o una app especial.</p>
<p>El código que llega por SMS <strong>es personal</strong>. Ninguna empresa legítima te lo va a pedir por teléfono, chat o correo. Si te lo piden, es una estafa.</p>`,
            consejo: "💡 Consejo: Activá la verificación en dos pasos primero en el correo electrónico: si proteges el correo, protegés todas las cuentas que dependen de él."
          },
          {
            titulo: "Redes WiFi públicas",
            contenido: `<p>Las redes WiFi abiertas de bares, hoteles, aeropuertos y plazas son cómodas, pero no siempre seguras. Otra persona conectada a la misma red podría intentar ver tu actividad.</p>
<p>Evitá entrar al banco, hacer compras o escribir contraseñas desde una red pública. Si necesitás hacerlo, usá los datos móviles de tu celular, que son más seguros.</p>
<p>Cuando te conectes a una red pública, desactivá la opción de «conectarse automáticamente» a redes abiertas. Y desconfiá de redes con nombres parecidos al lugar pero con letras raras.</p>`,
            consejo: "💡 Consejo: Para trámites o dinero, usá tu WiFi de casa o los datos móviles. Nunca una red pública."
          },
          {
            titulo: "Sitios falsos y descargas peligrosas",
            contenido: `<p>Los sitios falsos copian el diseño de un banco o de un organismo oficial para que entregues tus datos. Señales de alerta:</p>
<ul>
<li>La dirección no es exactamente la oficial (tiene letras cambiadas o un guion extra).</li>
<li>Te piden contraseña, número de tarjeta o código por un formulario que llegó por un enlace.</li>
<li>Aparecen ventanas emergentes diciendo que «ganaste un premio» o que tu celular «tiene un virus».</li>
<li>El sitio tiene errores de ortografía o funciona mal.</li>
</ul>
<p>Nunca descargues programas desde avisos que dicen «actualizá tu navegador» o «limpiá tu celular». Esas descargas suelen instalar virus.</p>`,
            consejo: "💡 Consejo: Escribí la dirección oficial a mano o usá un favorito guardado. Es la defensa más simple contra los sitios falsos."
          }
        ],
        glosario: [
          { termino: "Verificación en dos pasos", definicion: "Segundo código de seguridad que se pide además de la contraseña." },
          { termino: "Gestor de contraseñas", definicion: "Aplicación que guarda tus contraseñas de forma cifrada." },
          { termino: "Ventana emergente", definicion: "Aviso que aparece de golpe en la pantalla; muchas veces es publicidad o engaño." }
        ],
        examen: [
          {
            texto: "¿Cuál es la mejor práctica con las contraseñas?",
            opciones: [
              { texto: "Usar una contraseña larga y distinta para cada cuenta", valor: "correcto" },
              { texto: "Usar la misma en todos lados para no olvidarla", valor: "incorrecto" },
              { texto: "Usar tu fecha de nacimiento", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué agrega la verificación en dos pasos?",
            opciones: [
              { texto: "Un código extra además de la contraseña", valor: "correcto" },
              { texto: "Una contraseña más corta", valor: "incorrecto" },
              { texto: "Publicidad personalizada", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué conviene evitar en una red WiFi pública?",
            opciones: [
              { texto: "Entrar al banco o escribir contraseñas", valor: "correcto" },
              { texto: "Leer el diario", valor: "incorrecto" },
              { texto: "Mirar el clima", valor: "incorrecto" }
            ]
          }
        ]
      }
    ]
  },

  /* ==========================================================
     CURSO 3 - TRÁMITES EN LÍNEA
     ========================================================== */
  {
    id: 3,
    titulo: "Trámites en Línea",
    tema: "tramites",
    icono: "🧾",
    nivel: "intermedio",
    duracion: 90,
    resumen: "Hacé tus trámites desde casa con seguridad: cuentas oficiales, constancias, turnos y comprobantes, sin filas ni traslados.",
    porQueImporta: "Resolver un trámite sin viajar ahorra tiempo, dinero y esfuerzo. Saber hacerlo también te da independencia y evita que dependas de otros.",
    modulos: [
      {
        numero: 1,
        titulo: "Qué podés hacer desde casa",
        nivelComprension: "Descubrir",
        subtitulo: "Trámites, requisitos y cuidados básicos",
        duracion: 20,
        objetivo: "Saber qué trámites se pueden hacer en línea, qué necesitás y cuáles conviene resolver en persona.",
        objetivos: [
          "Reconocer los trámites más comunes que se hacen por internet.",
          "Reunir los datos y elementos necesarios antes de empezar.",
          "Entender las ventajas y los límites de los trámites en línea.",
          "Incorporar el hábito de verificar el sitio antes de escribir datos."
        ],
        pasos: [
          {
            titulo: "Trámites que se hacen por internet",
            contenido: `<p>Cada vez más trámites se pueden resolver desde una computadora o un celular, sin ir a una oficina:</p>
<ul>
<li>Descargar constancias y comprobantes (de sueldo, de domicilio, de jubilación).</li>
<li>Sacar un turno para atención presencial.</li>
<li>Consultar y actualizar datos personales.</li>
<li>Pagar impuestos, servicios y tasas.</li>
<li>Consultar el estado de un expediente o de un trámite.</li>
</ul>
<p>La ventaja es enorme: se hace a la hora que quieras, desde tu casa y sin esperar en una fila. La condición es entrar siempre al sitio oficial.</p>`,
            consejo: "💡 Consejo: Hacé una lista en papel con los trámites que resolvés por internet y guardala junto a tus datos. Te va a ordenar el uso."
          },
          {
            titulo: "Qué necesitás para empezar",
            contenido: `<p>Antes de empezar cualquier trámite en línea, tené a mano:</p>
<ul>
<li><strong>Tu CUIL</strong> (número de 11 dígitos que identifica a cada trabajador).</li>
<li><strong>Tu DNI</strong>, para verificar identidad.</li>
<li>Una <strong>dirección de correo electrónico</strong> que uses y recuerdes.</li>
<li>Una <strong>contraseña segura</strong> y, si se puede, verificación en dos pasos.</li>
<li>Tu <strong>número de teléfono</strong>, para recibir códigos de confirmación.</li>
</ul>
<p>Tener todo junto evita interrumpir el trámite a mitad de camino y reduce el riesgo de errores.</p>`,
            consejo: "💡 Consejo: Guardá tus datos en un cuaderno seguro, no en mensajes ni en fotos del celular. Es más difícil que te los roben."
          },
          {
            titulo: "Ventajas y límites",
            contenido: `<p>Los trámites en línea tienen grandes ventajas: ahorran viajes, permiten hacerlos fuera del horario de oficina y dejan un comprobante digital inmediato.</p>
<p>Pero no todo se resuelve por internet. Algunos trámites requieren firma en persona, entrega de documentación original o validación biométrica. En esos casos, el sitio oficial te lo va a indicar y te va a ofrecer un turno.</p>
<p>Si un supuesto «trámite online» te pide pagar por transferencia a una cuenta personal, es una señal de estafa. Los organismos oficiales tienen canales de pago formales y comprobantes.</p>`,
            consejo: "💡 Consejo: Si dudás si un trámite se puede hacer en línea, consultá primero en la web oficial del organismo o llamá a su número de atención."
          },
          {
            titulo: "Cuidados básicos antes de ingresar datos",
            contenido: `<p>La regla de oro de los trámites en línea: <strong>el sitio tiene que ser el oficial</strong>. Antes de escribir tu DNI o tu contraseña, revisá la dirección completa. Los organismos nacionales terminan en <strong>.gob.ar</strong>.</p>
<p>No llegues al sitio desde un enlace que te mandaron por WhatsApp, correo o SMS. Aunque el mensaje diga «trámite urgente», no es confiable. Escribí la dirección vos o usá un favorito guardado.</p>
<p>Nunca pagues un trámite con transferencia a un particular ni compartas el código que llega por SMS. Los organismos no piden esos datos por mensaje.</p>`,
            consejo: "💡 Consejo: Antes de completar un formulario, mirá la dirección una segunda vez. Dos segundos de control evitan una estafa."
          }
        ],
        glosario: [
          { termino: "CUIL", definicion: "Número de 11 dígitos que identifica a cada persona trabajadora en Argentina." },
          { termino: "Turno", definicion: "Reserva de día y hora para ser atendido en una oficina." },
          { termino: "Comprobante", definicion: "Documento digital que demuestra que un trámite o pago se realizó." }
        ],
        examen: [
          {
            texto: "¿Cuál es la regla de oro antes de hacer un trámite en línea?",
            opciones: [
              { texto: "Verificar que el sitio sea el oficial y entrar escribiendo la dirección", valor: "correcto" },
              { texto: "Entrar desde el enlace que llegó por WhatsApp", valor: "incorrecto" },
              { texto: "Pagar por transferencia a una cuenta personal", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué documento identifica a cada trabajador con 11 dígitos?",
            opciones: [
              { texto: "El CUIL", valor: "correcto" },
              { texto: "El número de tarjeta", valor: "incorrecto" },
              { texto: "El código de barras", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Todos los trámites se pueden hacer por internet?",
            opciones: [
              { texto: "No: algunos requieren firma o documentación en persona", valor: "correcto" },
              { texto: "Sí, absolutamente todos", valor: "incorrecto" },
              { texto: "Solo los días de semana", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 2,
        titulo: "Tu identidad digital",
        nivelComprension: "Comprender",
        subtitulo: "Cuentas, Mi Argentina, clave fiscal y comprobantes",
        duracion: 25,
        objetivo: "Entender cómo se representa tu identidad en internet y qué herramientas oficiales tenés disponibles.",
        objetivos: [
          "Comprender qué es la identidad digital y por qué se protege.",
          "Conocer qué es Mi Argentina y para qué sirve.",
          "Entender qué es la clave fiscal y por qué es secreta.",
          "Diferenciar turnos, constancias y comprobantes."
        ],
        pasos: [
          {
            titulo: "¿Qué es la identidad digital?",
            contenido: `<p>Tu <strong>identidad digital</strong> es el conjunto de datos que te representan en internet: tu nombre, tu DNI, tu correo, tus cuentas y tu historial de trámites. Es tan valiosa como tu documento en papel.</p>
<p>Cuando creás una cuenta oficial, esa identidad queda vinculada a un usuario y una contraseña. Quien tenga esos datos puede hacer trámites en tu nombre, por eso hay que protegerlos.</p>
<p>Una identidad digital cuidada se apoya en tres cosas: contraseña fuerte, verificación en dos pasos y nunca compartir códigos de confirmación.</p>`,
            consejo: "💡 Consejo: Tratá tu contraseña como la llave de tu casa: no se la das a nadie, ni a quien dice ser un empleado del organismo."
          },
          {
            titulo: "Mi Argentina",
            contenido: `<p><strong>Mi Argentina</strong> es la plataforma del Estado nacional donde podés consultar tus datos personales, descargar credenciales y acceder a distintos servicios. Funciona desde el navegador y también desde su aplicación oficial.</p>
<p>Dentro de tu perfil encontrás información como tus datos personales, tu CUIL y credenciales digitales. Es útil para tener todo en un solo lugar y mostrar tu identidad cuando la necesitás.</p>
<p>Para crear la cuenta se valida tu identidad con tus datos y un correo electrónico. Si el sistema te pide algo que no entendés, no inventes datos: consultá en la web oficial o pedí ayuda.</p>`,
            consejo: "💡 Consejo: Ingresá a Mi Argentina desde la dirección oficial y guardala en favoritos. No uses enlaces que lleguen por mensaje."
          },
          {
            titulo: "La clave fiscal",
            contenido: `<p>La <strong>clave fiscal</strong> es una contraseña especial que se usa para trámites impositivos y de facturación ante el organismo de recaudación (ARCA, antes AFIP). No es la misma que la contraseña de tu correo.</p>
<p>Es una de las claves más sensibles que tenés: con ella se pueden consultar y modificar datos fiscales, emitir comprobantes y hacer declaraciones. Por eso se guarda en un lugar seguro y no se comparte con nadie.</p>
<p>El organismo nunca te la pide por teléfono, correo, WhatsApp ni en un formulario que llegó por un enlace. Si te la piden así, es una estafa.</p>`,
            consejo: "💡 Consejo: Si olvidaste tu clave fiscal, recuperala solo desde el sitio oficial del organismo. Nunca desde un enlace que te enviaron."
          },
          {
            titulo: "Turnos, constancias y comprobantes",
            contenido: `<p>En los trámites aparecen tres documentos que conviene distinguir:</p>
<ul>
<li><strong>Turno:</strong> la reserva de un día y una hora para ser atendido. Se muestra o se imprime para presentarse.</li>
<li><strong>Constancia:</strong> un documento que certifica un dato: domicilio, trabajo, jubilación, alumno regular.</li>
<li><strong>Comprobante:</strong> la prueba de que hiciste un pago o completaste una solicitud. Tiene un número de operación.</li>
</ul>
<p>Guardá los comprobantes en una carpeta del celular o de la computadora, con un nombre claro que incluya la fecha. Te van a servir si necesitás reclamar.</p>`,
            consejo: "💡 Consejo: Renombrá los archivos con fecha y trámite («2026-10-27 turno ANSES»). Así los encontrás en segundos cuando los necesitás."
          }
        ],
        glosario: [
          { termino: "Identidad digital", definicion: "Conjunto de datos y cuentas que te representan en internet." },
          { termino: "Clave fiscal", definicion: "Contraseña especial para trámites impositivos; es secreta y personal." },
          { termino: "Constancia", definicion: "Documento oficial que certifica un dato o una situación." }
        ],
        examen: [
          {
            texto: "¿Qué es la identidad digital?",
            opciones: [
              { texto: "El conjunto de datos y cuentas que te representan en internet", valor: "correcto" },
              { texto: "La foto de tu DNI en el celular", valor: "incorrecto" },
              { texto: "El nombre de tu red WiFi", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué es la clave fiscal?",
            opciones: [
              { texto: "Una contraseña especial y secreta para trámites impositivos", valor: "correcto" },
              { texto: "El número de tu CUIL", valor: "incorrecto" },
              { texto: "La clave del WiFi de casa", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué documento prueba que hiciste un pago?",
            opciones: [
              { texto: "El comprobante con número de operación", valor: "correcto" },
              { texto: "El turno", valor: "incorrecto" },
              { texto: "La constancia de domicilio", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 3,
        titulo: "Hacer un trámite paso a paso",
        nivelComprension: "Practicar",
        subtitulo: "Ingresar, descargar, sacar turno y guardar",
        duracion: 25,
        objetivo: "Completar un trámite en línea de principio a fin, guardando los comprobantes de forma ordenada.",
        objetivos: [
          "Verificar el sitio oficial antes de ingresar cualquier dato.",
          "Iniciar sesión en una cuenta oficial de forma segura.",
          "Descargar y guardar una constancia o comprobante.",
          "Solicitar un turno y registrarlo en tu calendario."
        ],
        pasos: [
          {
            titulo: "Verificar el sitio oficial",
            contenido: `<p>Antes de cualquier trámite, hacé esta revisión de 30 segundos:</p>
<ul>
<li>La dirección termina en <strong>.gob.ar</strong> y coincide exactamente con la oficial.</li>
<li>Aparece el <strong>candado</strong> y la dirección empieza con <strong>https</strong>.</li>
<li>No llegaste desde un enlace de WhatsApp, correo o publicidad.</li>
<li>El sitio no te pide pagar a una cuenta personal ni te apura con mensajes alarmantes.</li>
</ul>
<p>Si algo no coincide, cerrá la página y entrá escribiendo la dirección oficial. Es mejor perder un minuto que entregar tus datos.</p>`,
            consejo: "💡 Consejo: Guardá los sitios oficiales en la carpeta de favoritos «Oficiales». Entrá siempre desde ahí."
          },
          {
            titulo: "Ingresar a tu cuenta",
            contenido: `<p>En la página oficial tocá «Ingresar» o «Iniciar sesión». El sistema te va a pedir tu usuario (a veces el CUIL) y tu contraseña.</p>
<p>Escribí la contraseña con calma y revisá que el teclado no haya cambiado mayúsculas. Si el sitio pide un código adicional, lo vas a recibir por SMS o por una app de autenticación: ingresalo sin compartirlo con nadie.</p>
<p>Si te equivocás varias veces, la cuenta puede bloquearse por seguridad. En ese caso, usá la opción oficial de recuperación de contraseña.</p>`,
            consejo: "💡 Consejo: Escribí la contraseña en el lugar correcto: si el sitio no tiene candado, no la escribas. Cerrá la página y verificá la dirección."
          },
          {
            titulo: "Descargar una constancia o comprobante",
            contenido: `<p>Dentro de tu cuenta, buscá la sección del trámite (por ejemplo «Constancias», «Mis documentos» o «Comprobantes»). Elegí el documento y tocá «Descargar» o «Generar PDF».</p>
<p>El archivo se guarda en la carpeta <strong>Descargas</strong>. Abrilo para confirmar que se descargó bien y que tus datos son correctos.</p>
<p>Guardalo también en una carpeta ordenada y, si es importante, mandátelo por correo a vos mismo o guardalo en un pendrive. Así no lo perdés si cambiás de celular.</p>`,
            consejo: "💡 Consejo: Antes de cerrar la sesión, revisá que el archivo esté descargado. Muchos trámites no permiten volver a generarlo fácilmente."
          },
          {
            titulo: "Sacar un turno y guardarlo",
            contenido: `<p>Si el trámite necesita atención presencial, el sitio ofrece un <strong>turno</strong>. Elegí sede, día y horario disponible, y confirmá.</p>
<p>Al finalizar, descargá o imprimí el comprobante del turno. Anotá la fecha en un calendario de papel o en el celular, con alarma unos días antes.</p>
<p>Llevá el día del turno tu DNI y el comprobante impreso o en el celular. Si no podés asistir, cancelalo desde el mismo sitio para liberar el lugar.</p>`,
            consejo: "💡 Consejo: Anotá también qué documentación tenés que llevar. Llegar con todo evita tener que volver otro día."
          }
        ],
        glosario: [
          { termino: "Iniciar sesión", definicion: "Entrar a una cuenta con tu usuario y contraseña." },
          { termino: "PDF", definicion: "Formato de archivo que conserva el documento tal como se ve, ideal para constancias." },
          { termino: "Sede", definicion: "Oficina física donde te atienden el día del turno." }
        ],
        examen: [
          {
            texto: "Antes de escribir tu contraseña en un sitio, ¿qué tenés que verificar?",
            opciones: [
              { texto: "Que la dirección sea la oficial y tenga candado", valor: "correcto" },
              { texto: "Que el sitio tenga muchos colores", valor: "incorrecto" },
              { texto: "Que la página cargue rápido", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Dónde se guarda un archivo que descargaste?",
            opciones: [
              { texto: "En la carpeta Descargas del dispositivo", valor: "correcto" },
              { texto: "Se envía solo por correo", valor: "incorrecto" },
              { texto: "Se borra automáticamente", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué conviene hacer después de sacar un turno?",
            opciones: [
              { texto: "Guardar el comprobante y anotar la fecha con anticipación", valor: "correcto" },
              { texto: "Compartir el comprobante en redes sociales", valor: "incorrecto" },
              { texto: "Borrar el correo de confirmación", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 4,
        titulo: "Trámites seguros y sin miedo",
        nivelComprension: "Dominar y proteger",
        subtitulo: "Claves, sesiones, errores y ayuda",
        duracion: 20,
        objetivo: "Hacer trámites con autonomía, proteger tus claves y saber cómo resolver problemas sin caer en engaños.",
        objetivos: [
          "Proteger tus claves y códigos de confirmación.",
          "Cerrar sesión correctamente en equipos compartidos.",
          "Reaccionar bien si un trámite falla o el sitio parece raro.",
          "Saber a quién pedir ayuda sin exponer tus datos."
        ],
        pasos: [
          {
            titulo: "Tus claves y códigos son secretos",
            contenido: `<p>Ningún organismo oficial, banco ni empresa legítima te va a pedir por teléfono, WhatsApp o correo:</p>
<ul>
<li>Tu contraseña.</li>
<li>Tu clave fiscal.</li>
<li>El código que llega por SMS.</li>
<li>El número completo de tu tarjeta y su código de seguridad.</li>
</ul>
<p>Si alguien los pide, aunque diga que es para «verificar tu identidad» o «destrabar un trámite», es una estafa. Cortá la comunicación y verificá por el canal oficial.</p>`,
            consejo: "💡 Consejo: La frase para recordar: «El que te pide la clave, te quiere robar». No hay excepciones."
          },
          {
            titulo: "Cuidar la sesión en equipos compartidos",
            contenido: `<p>Si hacés un trámite en una computadora de un familiar, un centro comunitario o una biblioteca, acordate de <strong>cerrar sesión</strong> al terminar. No alcanza con cerrar la pestaña.</p>
<p>Buscá el botón «Salir» o «Cerrar sesión» en la esquina superior. Después, si el navegador lo permite, borrá los datos de navegación.</p>
<p>Nunca dejes marcada la opción «Recordarme» en un equipo que no es tuyo, y no guardes la contraseña en el navegador compartido.</p>`,
            consejo: "💡 Consejo: Cerrar sesión es como cerrar la puerta al salir: aunque vuelvas pronto, es lo que corresponde."
          },
          {
            titulo: "Si el trámite falla o el sitio parece raro",
            contenido: `<p>A veces el sitio se cae, la página se queda cargando o el trámite se interrumpe. Antes de repetir todo, probá recargar la página y revisar la conexión.</p>
<p>Si el sitio te pide datos que no corresponden, te apura, tiene errores de ortografía o la dirección no coincide, cerrá todo y verificá desde el canal oficial.</p>
<p>Si ya ingresaste datos en un sitio dudoso, cambiá la contraseña de esa cuenta desde el sitio oficial y avisá al organismo. Cuanto antes actúes, mejor.</p>`,
            consejo: "💡 Consejo: Si un trámite se interrumpe, no empieces de cero sin revisar si quedó registrado. Consultá «Mis trámites» o el estado de la solicitud."
          },
          {
            titulo: "Dónde pedir ayuda de forma segura",
            contenido: `<p>Pedir ayuda está bien y no te hace menos capaz. Lo importante es a quién le pedís y qué le mostrás.</p>
<ul>
<li>Pedile ayuda a un familiar o persona de confianza, pero que sea <strong>vos</strong> quien escriba la contraseña.</li>
<li>Consultá en la oficina oficial del organismo o en su línea de atención publicada en el sitio oficial.</li>
<li>En centros comunitarios y bibliotecas suele haber talleres de inclusión digital.</li>
<li>Nunca le entregues tu celular desbloqueado a un desconocido que se ofrece a «hacerte el trámite».</li>
</ul>
<p>Anotá los números oficiales en un cuaderno. Así, si te llaman diciendo que son del organismo, podés verificar llamando vos.</p>`,
            consejo: "💡 Consejo: Para ayudar a alguien, lo mejor es explicar y acompañar, no hacer el trámite por la otra persona."
          }
        ],
        glosario: [
          { termino: "Cerrar sesión", definicion: "Salir de tu cuenta para que otra persona no pueda usarla en ese equipo." },
          { termino: "Canal oficial", definicion: "Sitio web, teléfono u oficina publicados por el propio organismo." },
          { termino: "Código SMS", definicion: "Número temporal que llega por mensaje de texto para confirmar tu identidad." }
        ],
        examen: [
          {
            texto: "¿Qué hacés si alguien te pide por teléfono el código que llegó por SMS?",
            opciones: [
              { texto: "No se lo doy y corto la llamada", valor: "correcto" },
              { texto: "Se lo doy si dice ser del organismo", valor: "incorrecto" },
              { texto: "Se lo envío por WhatsApp", valor: "incorrecto" }
            ]
          },
          {
            texto: "Terminaste un trámite en una computadora compartida. ¿Qué hacés?",
            opciones: [
              { texto: "Cerrar sesión y borrar los datos de navegación", valor: "correcto" },
              { texto: "Solo cerrar la pestaña", valor: "incorrecto" },
              { texto: "Dejar la sesión abierta para otro día", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Cómo conviene ayudar a una persona mayor con un trámite?",
            opciones: [
              { texto: "Explicando y acompañando, sin hacer todo por ella", valor: "correcto" },
              { texto: "Haciendo el trámite y quedándose con sus claves", valor: "incorrecto" },
              { texto: "Pidiéndole que comparta el código SMS", valor: "incorrecto" }
            ]
          }
        ]
      }
    ]
  },

  /* ==========================================================
     CURSO 4 - FRAUDES DIGITALES (PHISHING)
     ========================================================== */
  {
    id: 4,
    titulo: "Fraudes Digitales (Phishing)",
    tema: "fraudes",
    icono: "🛡️",
    nivel: "principiante",
    duracion: 80,
    resumen: "Aprendé a reconocer estafas por correo, WhatsApp, SMS y llamadas, y a proteger tus cuentas y tu dinero.",
    porQueImporta: "El engaño digital ya no se ve pobre: se ve profesional. Reconocerlo a tiempo protege tus datos, tu dinero y a toda tu familia.",
    modulos: [
      {
        numero: 1,
        titulo: "Qué es una estafa digital",
        nivelComprension: "Descubrir",
        subtitulo: "El anzuelo, los canales y lo que buscan",
        duracion: 20,
        objetivo: "Entender qué es el phishing, por qué existe y cómo llega hasta vos.",
        objetivos: [
          "Explicar con tus palabras qué es el phishing.",
          "Entender por qué los estafadores apuntan a personas con menos experiencia digital.",
          "Reconocer los canales por donde llega un engaño.",
          "Identificar qué datos buscan robar."
        ],
        pasos: [
          {
            titulo: "¿Qué es el phishing?",
            contenido: `<p>El <strong>phishing</strong> es un engaño que busca que entregues tus datos personales haciéndose pasar por alguien de confianza: tu banco, una empresa de envíos, un organismo oficial o incluso un familiar.</p>
<p>La palabra viene de <em>fishing</em> («pescar» en inglés): el estafador lanza un anzuelo —un mensaje que parece real— y espera que alguien muerda. No es un ataque a la fuerza: es un engaño a la confianza.</p>
<p>Puede llegar por correo electrónico, mensaje de texto, WhatsApp, redes sociales o llamada telefónica. El objetivo siempre es el mismo: que hagas clic, respondas o pagues.</p>`,
            consejo: "💡 Consejo: Si algo te apura, te asusta o te promete un premio inesperado, desconfiá. Los trámites y las empresas serias no funcionan así."
          },
          {
            titulo: "Por qué existe y a quién apunta",
            contenido: `<p>Los datos personales valen dinero. Con tu nombre, tu DNI, tu correo y una contraseña, un estafador puede abrir cuentas, pedir préstamos o vaciar tus ahorros. Por eso el phishing es un negocio organizado.</p>
<p>Es importante decirlo claro: <strong>caer en una estafa no es señal de ser tonto</strong>. Los mensajes están diseñados por profesionales para engañar a cualquier persona cansada, apurada o preocupada.</p>
<p>Los estafadores aprovechan momentos de emoción: una compra que esperás, un problema con el banco, una noticia que te asusta. Si estás nervioso, es más probable que actúes sin pensar. Por eso la calma es tu mejor defensa.</p>`,
            consejo: "💡 Consejo: Nunca respondas un mensaje importante con el corazón acelerado. Esperá 10 minutos y consultá con alguien de confianza."
          },
          {
            titulo: "Por dónde llega el engaño",
            contenido: `<p>El phishing usa los mismos canales que usás todos los días:</p>
<ul>
<li><strong>Correo electrónico:</strong> un mensaje que parece de tu banco, de una empresa de envíos o de un organismo.</li>
<li><strong>Mensaje de texto (SMS):</strong> avisos de un paquete retenido, una deuda o un premio.</li>
<li><strong>WhatsApp:</strong> un contacto desconocido o un familiar que pide dinero.</li>
<li><strong>Llamada telefónica:</strong> alguien que dice ser del banco o de soporte técnico.</li>
<li><strong>Redes sociales:</strong> publicidades falsas, sorteos y mensajes directos.</li>
</ul>
<p>El canal cambia, pero la intención es la misma: que entregues datos o dinero.</p>`,
            consejo: "💡 Consejo: Desconfiá de cualquier mensaje que te pida datos, dinero o códigos, sin importar por dónde llegue."
          },
          {
            titulo: "Qué datos buscan robar",
            contenido: `<p>Los estafadores buscan información que les permita entrar a tus cuentas o usar tu identidad:</p>
<ul>
<li>Contraseñas de correo, banco o redes sociales.</li>
<li>Números de tarjeta y el código de seguridad de atrás.</li>
<li>El código que llega por SMS para confirmar una operación.</li>
<li>Tu DNI, CUIL y fecha de nacimiento.</li>
<li>Fotos de documentos o de tu rostro.</li>
</ul>
<p>Si un mensaje pide alguno de estos datos, no importa cuán oficial parezca: es una estafa. Las empresas legítimas no los piden por mensaje.</p>`,
            consejo: "💡 Consejo: El código SMS es la llave de tus cuentas. Ni siquiera tu banco debería pedírtelo: si lo pide, no es tu banco."
          }
        ],
        glosario: [
          { termino: "Phishing", definicion: "Engaño que imita a una persona o empresa confiable para robar datos personales." },
          { termino: "Estafador", definicion: "Persona que busca quedarse con tu dinero o tus datos mediante un engaño." },
          { termino: "Código de seguridad", definicion: "Números de la tarjeta o del SMS que confirman una operación y no se comparten." }
        ],
        examen: [
          {
            texto: "¿Qué es el phishing?",
            opciones: [
              { texto: "Un engaño que imita a alguien de confianza para robar datos", valor: "correcto" },
              { texto: "Un virus que se instala solo al encender el celular", valor: "incorrecto" },
              { texto: "Una actualización de seguridad del banco", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Por qué los estafadores usan mensajes con urgencia?",
            opciones: [
              { texto: "Para que actúes rápido, sin pensar ni consultar", valor: "correcto" },
              { texto: "Porque el banco tiene apuro real", valor: "incorrecto" },
              { texto: "Para que el mensaje llegue más rápido", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Cuál de estos datos NO se comparte nunca por mensaje?",
            opciones: [
              { texto: "El código que llega por SMS y la contraseña", valor: "correcto" },
              { texto: "El horario de atención del banco", valor: "incorrecto" },
              { texto: "La dirección de una sucursal", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 2,
        titulo: "Reconocer las señales",
        nivelComprension: "Comprender",
        subtitulo: "Urgencia, remitentes, errores e ingeniería social",
        duracion: 20,
        objetivo: "Detectar las señales típicas de un mensaje falso antes de actuar.",
        objetivos: [
          "Identificar la urgencia y el miedo como señales de alerta.",
          "Revisar el remitente y el enlace real de un mensaje.",
          "Reconocer errores, premios falsos y sorteos que no hiciste.",
          "Entender qué es la ingeniería social y cómo se usa."
        ],
        pasos: [
          {
            titulo: "Urgencia y miedo",
            contenido: `<p>La señal más común de una estafa es la <strong>urgencia</strong>: «Tu cuenta será bloqueada», «Último aviso», «Tenés 24 horas para pagar». También usan el miedo: «Detectamos un movimiento sospechoso», «Tu paquete será devuelto».</p>
<p>La urgencia es una técnica: buscan que actúes antes de pensar o de consultar. Las empresas y organismos serios te dan tiempo, canales oficiales y números de reclamo.</p>
<p>Cuando un mensaje te apura, la respuesta correcta es la contraria: <strong>frenar</strong>. No hagas clic, no pagues y no respondas. Verificá por otro canal.</p>`,
            consejo: "💡 Consejo: Regla simple: si el mensaje te asusta, probablemente sea falso. Respiré y verifique antes de actuar."
          },
          {
            titulo: "Mirá el remitente y el enlace real",
            contenido: `<p>El nombre que aparece como remitente se puede falsificar. Por eso hay que mirar la <strong>dirección completa</strong>: por ejemplo, un correo del banco debe terminar en el dominio oficial del banco, no en un correo gratuito.</p>
<p>Con los enlaces pasa lo mismo: el texto puede decir «www.mibanco.com» pero llevar a otro sitio. Antes de tocar, mantené presionado el enlace (en el celular) o pasá el mouse por encima (en la computadora) para ver la dirección real.</p>
<p>Señales de alarma: letras cambiadas, guiones extra, dominios raros, direcciones acortadas que no muestran a dónde llevan.</p>`,
            consejo: "💡 Consejo: Si el enlace no muestra claramente la dirección oficial, no lo toques. Entrá al sitio escribiendo la dirección vos."
          },
          {
            titulo: "Errores, premios y sorteos",
            contenido: `<p>Los mensajes falsos suelen tener errores que las empresas serias no cometerían: faltas de ortografía, frases mal armadas, logos deformados o un tono demasiado informal.</p>
<p>También prometen premios que no pediste: «Ganaste un celular», «Sos el afortunado», «Reclamá tu premio hoy». Si no participaste de un sorteo, no podés haber ganado nada.</p>
<p>Otro clásico: «Tu paquete está retenido, pagá una tasa». Las empresas de envío no cobran por enlaces ni por transferencias a cuentas personales.</p>`,
            consejo: "💡 Consejo: Ningún premio legítimo te pide pagar primero, ni tus datos de tarjeta, ni un código por SMS."
          },
          {
            titulo: "Ingeniería social: te conocen",
            contenido: `<p>La <strong>ingeniería social</strong> es el arte de manipular a las personas para que entreguen información. El estafador usa datos reales —tu nombre, el banco que usás, el nombre de un familiar— para parecer confiable.</p>
<p>Hoy además existen herramientas de inteligencia artificial capaces de imitar una voz o un video. Por eso no alcanza con reconocer la voz: hay que verificar por otro canal.</p>
<p>Si recibís un audio o una llamada de un familiar pidiendo dinero urgente, cortá y llamalo a su número de siempre. Si es real, te lo va a confirmar. Si no, acabás de evitar una estafa.</p>`,
            consejo: "💡 Consejo: Ante un pedido de dinero urgente de un familiar, cortá y llamalo a su número habitual. Nunca devuelvas el llamado al número que te llamó."
          }
        ],
        glosario: [
          { termino: "Remitente", definicion: "Persona o empresa que aparece como autora de un mensaje; se puede falsificar." },
          { termino: "Ingeniería social", definicion: "Manipulación que usa datos reales para ganarse tu confianza y obtener información." },
          { termino: "Enlace acortado", definicion: "Dirección corta que oculta el destino real; conviene revisarla antes de tocarla." }
        ],
        examen: [
          {
            texto: "¿Cuál es una señal típica de un mensaje falso?",
            opciones: [
              { texto: "Te apura con frases como «último aviso» o «tu cuenta será bloqueada»", valor: "correcto" },
              { texto: "Te saluda por tu nombre", valor: "incorrecto" },
              { texto: "Tiene el logo de una empresa", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Cómo podés ver a dónde lleva realmente un enlace?",
            opciones: [
              { texto: "Manteniendo presionado el enlace o pasando el mouse por encima", valor: "correcto" },
              { texto: "Tocándolo rápido para ver qué pasa", valor: "incorrecto" },
              { texto: "Reenviándolo a un amigo", valor: "incorrecto" }
            ]
          },
          {
            texto: "Recibís un audio de un familiar pidiendo dinero urgente. ¿Qué hacés?",
            opciones: [
              { texto: "Cortás y lo llamás a su número de siempre para confirmar", valor: "correcto" },
              { texto: "Transferís enseguida por si es verdad", valor: "incorrecto" },
              { texto: "Respondés pidiendo más datos por el mismo chat", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 3,
        titulo: "Qué hacer paso a paso",
        nivelComprension: "Practicar",
        subtitulo: "Parar, verificar, eliminar y actuar",
        duracion: 20,
        objetivo: "Aplicar un procedimiento claro frente a cualquier mensaje sospechoso, incluso si ya hiciste clic.",
        objetivos: [
          "Frenar antes de hacer clic y revisar las señales.",
          "Verificar un mensaje por un canal oficial independiente.",
          "Eliminar, bloquear y reportar mensajes falsos.",
          "Saber qué hacer si ya entregaste datos o dinero."
        ],
        pasos: [
          {
            titulo: "Antes de hacer clic: PARAR",
            contenido: `<p>Cuando llega un mensaje que te genera duda, seguí estos tres pasos:</p>
<ul>
<li><strong>Pará:</strong> no toques ningún enlace ni respondas. Aunque el mensaje diga que es urgente.</li>
<li><strong>Pensá:</strong> ¿esperabas este mensaje? ¿Quién lo manda? ¿Qué te pide?</li>
<li><strong>Consultá:</strong> preguntale a alguien de confianza o verificá por el canal oficial.</li>
</ul>
<p>Este hábito de 30 segundos evita la gran mayoría de los fraudes. No hace falta ser experto: hace falta frenar.</p>`,
            consejo: "💡 Consejo: Pegá en un papel la frase «Pará, pensá y consultá» y dejalo cerca del celular."
          },
          {
            titulo: "Verificar por otro canal",
            contenido: `<p>La forma más segura de verificar un mensaje es <strong>no usar los datos que el mensaje te da</strong>. Si dice ser de tu banco, llamá al número que figura en el dorso de tu tarjeta o en el sitio oficial.</p>
<p>Si dice ser de un organismo, entrá a su web oficial escribiendo la dirección a mano. Si dice ser de una empresa de envíos, buscá el número de seguimiento en el sitio oficial.</p>
<p>Nunca uses el teléfono ni el enlace que aparecen en el mensaje sospechoso: pueden estar manejados por el estafador.</p>`,
            consejo: "💡 Consejo: Verificar por otro canal significa usar un canal distinto del que usó el estafador. Llamar al mismo número no sirve."
          },
          {
            titulo: "Eliminar, bloquear y reportar",
            contenido: `<p>Si confirmás que el mensaje es falso:</p>
<ul>
<li><strong>No respondas</strong> ni pidas que te saquen de la lista: eso confirma que tu número o correo está activo.</li>
<li><strong>Eliminá</strong> el mensaje.</li>
<li><strong>Bloqueá</strong> al remitente en WhatsApp, correo o teléfono.</li>
<li><strong>Reportalo</strong> como spam o phishing en la app.</li>
<li>Si el mensaje usa el nombre de una empresa, avisales por su canal oficial.</li>
</ul>
<p>Reportar ayuda a proteger a otras personas que podrían recibir el mismo engaño.</p>`,
            consejo: "💡 Consejo: No reenvíes el mensaje falso a tus contactos, ni siquiera para avisarles. Una captura de pantalla es suficiente."
          },
          {
            titulo: "Si ya hiciste clic o entregaste datos",
            contenido: `<p>No te quedes callado ni sientas vergüenza: actuar rápido reduce el daño.</p>
<ul>
<li>Cambiá la contraseña de la cuenta afectada desde el sitio oficial.</li>
<li>Activá la verificación en dos pasos si no la tenías.</li>
<li>Si entregaste datos de tarjeta, llamá al banco para bloquearla.</li>
<li>Revisá los movimientos de tus cuentas y guardá capturas de lo que pasó.</li>
<li>Denunciá en la comisaría o en el organismo correspondiente.</li>
</ul>
<p>Contale a alguien de confianza. Hablarlo ayuda y evita que la vergüenza te haga esperar.</p>`,
            consejo: "💡 Consejo: Si diste el código SMS o la contraseña, cambiala ya. Cada minuto cuenta para frenar una operación."
          }
        ],
        glosario: [
          { termino: "Bloquear", definicion: "Impedir que un número o correo vuelva a contactarte." },
          { termino: "Reportar", definicion: "Avisar a la aplicación o empresa que un mensaje es falso o abusivo." },
          { termino: "Denuncia", definicion: "Registro oficial de un delito ante la autoridad competente." }
        ],
        examen: [
          {
            texto: "¿Cuál es el primer paso ante un mensaje sospechoso?",
            opciones: [
              { texto: "Parar y no tocar ningún enlace", valor: "correcto" },
              { texto: "Hacer clic para ver si es verdad", valor: "incorrecto" },
              { texto: "Responder pidiendo explicaciones", valor: "incorrecto" }
            ]
          },
          {
            texto: "El mensaje dice ser de tu banco. ¿A qué número llamás?",
            opciones: [
              { texto: "Al número oficial que figura en tu tarjeta o en el sitio del banco", valor: "correcto" },
              { texto: "Al número que aparece en el mensaje", valor: "incorrecto" },
              { texto: "Al número que te dicta el remitente por chat", valor: "incorrecto" }
            ]
          },
          {
            texto: "Ya entregaste tu contraseña en un sitio falso. ¿Qué hacés primero?",
            opciones: [
              { texto: "Cambiar la contraseña desde el sitio oficial y avisar al banco si hace falta", valor: "correcto" },
              { texto: "Esperar unos días para ver qué pasa", valor: "incorrecto" },
              { texto: "No contarle a nadie por vergüenza", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 4,
        titulo: "Blindar tus cuentas",
        nivelComprension: "Dominar y proteger",
        subtitulo: "Contraseñas, dos pasos y ayuda a otros",
        duracion: 20,
        objetivo: "Construir una protección duradera para tus cuentas y convertirte en una persona de referencia para tu familia.",
        objetivos: [
          "Aplicar contraseñas fuertes y distintas en las cuentas importantes.",
          "Activar la verificación en dos pasos en el correo y el banco.",
          "Proteger el celular y el código SMS como llaves maestras.",
          "Acompañar a otras personas sin hacerles todo."
        ],
        pasos: [
          {
            titulo: "Contraseñas fuertes y distintas",
            contenido: `<p>Si usás la misma contraseña en el correo, el banco y las redes, un solo robo pone todo en riesgo. La solución es tener contraseñas <strong>largas y distintas</strong> para cada cuenta importante.</p>
<p>Una contraseña de frase es fácil de recordar y difícil de adivinar: «SábadoConTéYGalletitas2026». Agregá un símbolo y listo. Evitá nombres de familiares y fechas.</p>
<p>Si te cuesta recordar muchas, usá un cuaderno guardado en un lugar seguro o un gestor de contraseñas. Lo que nunca sirve es repetir la misma en todos lados.</p>`,
            consejo: "💡 Consejo: Empezá por cambiar la contraseña del correo. Es la llave que recupera todas las demás."
          },
          {
            titulo: "Verificación en dos pasos",
            contenido: `<p>La <strong>verificación en dos pasos</strong> es la protección más efectiva después de una buena contraseña. Aunque alguien la descubra, no puede entrar sin el segundo código.</p>
<p>Activala en el correo electrónico, en el banco y en las redes sociales. Se configura en «Seguridad» o «Privacidad» de cada cuenta.</p>
<p>El código llega por SMS o por una app de autenticación. Recordá: ese código <strong>nunca se comparte</strong>, ni con alguien que dice ser del banco, ni con un familiar que lo pide por WhatsApp.</p>`,
            consejo: "💡 Consejo: Activá primero la verificación en dos pasos del correo. Con eso protegés el acceso a casi todo lo demás."
          },
          {
            titulo: "Proteger el celular y el código SMS",
            contenido: `<p>Tu celular es la llave de tus cuentas: por él llegan los códigos de confirmación. Si alguien lo usa sin permiso, puede cambiar contraseñas y entrar a tu banco.</p>
<p>Protegelo con PIN o huella, no compartas el código de desbloqueo y no lo dejes sin supervisión con desconocidos. Si te lo roban, llamá inmediatamente a la compañía para bloquear la línea.</p>
<p>Ojo con la «portabilidad» o el cambio de chip que no pediste: si tu celular se queda sin señal de golpe, puede ser que alguien esté intentando quedarse con tu número. Llamá a tu compañía.</p>`,
            consejo: "💡 Consejo: Si un desconocido te pide el celular «para hacer una llamada», ofrecelé que vos marcás el número. No lo entregues desbloqueado."
          },
          {
            titulo: "Ayudar a otros y no sentir vergüenza",
            contenido: `<p>Las estafas funcionan mejor en silencio. Por eso, contar lo que te pasó y avisar a otros es parte de la protección colectiva.</p>
<ul>
<li>Enseñale a tu familia las señales que aprendiste, con ejemplos reales.</li>
<li>Acordá una «palabra clave» familiar para confirmar pedidos de dinero urgentes.</li>
<li>Si alguien cayó en una estafa, no lo retes: ayudalo a actuar rápido.</li>
<li>Compartí esta información en tu grupo de WhatsApp con calma y sin cadenas alarmistas.</li>
</ul>
<p>Una persona informada protege a muchas. Ese es el verdadero escudo.</p>`,
            consejo: "💡 Consejo: La vergüenza es aliada del estafador. Hablar del tema protege a toda la comunidad."
          }
        ],
        glosario: [
          { termino: "Verificación en dos pasos", definicion: "Código extra que se pide además de la contraseña para entrar a una cuenta." },
          { termino: "Portabilidad", definicion: "Cambio del número de teléfono de una compañía a otra; si no lo pediste, es una alerta." },
          { termino: "Palabra clave familiar", definicion: "Palabra acordada en familia para confirmar que un pedido urgente es real." }
        ],
        examen: [
          {
            texto: "¿Cuál es la contraseña más segura?",
            opciones: [
              { texto: "Una frase larga, distinta para cada cuenta importante", valor: "correcto" },
              { texto: "La misma en todos lados para no olvidarla", valor: "incorrecto" },
              { texto: "El nombre de tu nieto", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué protege la verificación en dos pasos?",
            opciones: [
              { texto: "La cuenta, aunque alguien conozca la contraseña", valor: "correcto" },
              { texto: "El WiFi de la casa", valor: "incorrecto" },
              { texto: "La batería del celular", valor: "incorrecto" }
            ]
          },
          {
            texto: "Si un familiar cae en una estafa, ¿qué conviene hacer?",
            opciones: [
              { texto: "Acompañarlo a actuar rápido y sin retarlo", valor: "correcto" },
              { texto: "Retarlo para que aprenda", valor: "incorrecto" },
              { texto: "Decirle que no cuente a nadie", valor: "incorrecto" }
            ]
          }
        ]
      }
    ]
  },

  /* ==========================================================
     CURSO 5 - COMUNICACIÓN DIGITAL
     ========================================================== */
  {
    id: 5,
    titulo: "Comunicación Digital",
    tema: "comunicacion",
    icono: "💬",
    nivel: "principiante",
    duracion: 70,
    resumen: "Hablá con tu familia por WhatsApp: mensajes, audios, fotos, grupos y videollamadas, cuidando tu privacidad.",
    porQueImporta: "La comunicación digital acorta distancias: ver y escuchar a los tuyos todos los días, sin importar dónde estén, cambia la vida cotidiana.",
    modulos: [
      {
        numero: 1,
        titulo: "Hablar con los tuyos",
        nivelComprension: "Descubrir",
        subtitulo: "WhatsApp, audios, videollamadas y contactos",
        duracion: 15,
        objetivo: "Entender para qué sirve la mensajería digital y perder el miedo a usarla.",
        objetivos: [
          "Saber qué es WhatsApp y para qué se usa.",
          "Elegir entre mensaje de texto, audio o videollamada según el momento.",
          "Agregar y reconocer contactos.",
          "Usar emojis y respuestas sin sentir presión."
        ],
        pasos: [
          {
            titulo: "¿Qué es WhatsApp?",
            contenido: `<p><strong>WhatsApp</strong> es una aplicación de mensajería: permite mandar mensajes, fotos, audios y hacer llamadas o videollamadas usando internet. Es la forma más común de comunicarse con la familia en Argentina.</p>
<p>No se paga por mensaje: usa tu conexión de WiFi o datos móviles. Por eso conviene conectarse a WiFi cuando mandás muchas fotos o videos.</p>
<p>La app se abre desde el icono verde con un teléfono dentro. Ahí ves la lista de conversaciones y, abajo, los botones para chatear, llamar o buscar.</p>`,
            consejo: "💡 Consejo: WhatsApp no reemplaza el teléfono: también podés llamar por voz. Usá lo que te resulte más cómodo."
          },
          {
            titulo: "Texto, audio o videollamada",
            contenido: `<p>Cada forma de comunicarse tiene su momento:</p>
<ul>
<li><strong>Mensaje de texto:</strong> para algo corto, una dirección o un dato que la otra persona puede leer cuando quiera.</li>
<li><strong>Audio:</strong> para contar algo largo o cuando escribir te resulta incómodo. Es más cálido, pero puede ser difícil de escuchar en lugares ruidosos.</li>
<li><strong>Llamada:</strong> para conversar en el momento sin mostrar la cara.</li>
<li><strong>Videollamada:</strong> para ver a los nietos, mostrar algo o conversar cara a cara a la distancia.</li>
</ul>
<p>No hay una forma «correcta»: elegí la que te haga sentir cómodo.</p>`,
            consejo: "💡 Consejo: Si un audio es muy largo, podés pausarlo y escucharlo en partes. No tenés que responder al instante."
          },
          {
            titulo: "Contactos y números",
            contenido: `<p>Para hablar con alguien por WhatsApp, esa persona tiene que estar guardada en tus <strong>contactos</strong> con su número de teléfono.</p>
<p>Para agregar un contacto, abrí la app de teléfono o contactos, tocá «Nuevo contacto», escribí el nombre y el número con código de área. Guardá y verificá que esté bien.</p>
<p>En WhatsApp, tocá el botón de nuevo chat y buscá el nombre. Si no aparece, revisá que el número esté guardado correctamente.</p>`,
            consejo: "💡 Consejo: Guardá los contactos con nombre y apellido, no solo «Mamá» o «Juan». Así evitás confusiones y engaños."
          },
          {
            titulo: "Emojis, respuestas y silencios",
            contenido: `<p>Los <strong>emojis</strong> son dibujitos que agregan tono a un mensaje: una carita sonriente suaviza una frase, un corazón demuestra cariño. No son obligatorios: podés escribir sin ellos.</p>
<p>También podés <strong>responder a un mensaje</strong> manteniéndolo apretado y eligiendo «Responder». Así queda claro a qué te referís.</p>
<p>Si un grupo tiene muchos mensajes, podés <strong>silenciarlo</strong> para que no suene todo el día. No se pierde nada: los mensajes quedan ahí para leerlos cuando quieras.</p>`,
            consejo: "💡 Consejo: Silenciar un grupo no es descortesía: es cuidar tu descanso. Podés leerlo cuando te convenga."
          }
        ],
        glosario: [
          { termino: "WhatsApp", definicion: "Aplicación para mandar mensajes, audios y hacer llamadas usando internet." },
          { termino: "Audio", definicion: "Mensaje de voz grabado dentro de la conversación." },
          { termino: "Emoji", definicion: "Dibujo pequeño que expresa una emoción o una idea en un mensaje." }
        ],
        examen: [
          {
            texto: "¿Qué necesita WhatsApp para funcionar?",
            opciones: [
              { texto: "Conexión a internet por WiFi o datos móviles", valor: "correcto" },
              { texto: "Una impresora conectada", valor: "incorrecto" },
              { texto: "Un cable de teléfono fijo", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Cuándo conviene mandar un audio en lugar de un texto?",
            opciones: [
              { texto: "Cuando querés contar algo largo o escribir te resulta incómodo", valor: "correcto" },
              { texto: "Cuando querés que nadie lo escuche", valor: "incorrecto" },
              { texto: "Siempre, porque el texto no sirve", valor: "incorrecto" }
            ]
          },
          {
            texto: "Silenciar un grupo de WhatsApp significa...",
            opciones: [
              { texto: "Que no suena, pero los mensajes siguen ahí", valor: "correcto" },
              { texto: "Que te expulsan del grupo", valor: "incorrecto" },
              { texto: "Que se borran los mensajes", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 2,
        titulo: "Cómo funcionan los mensajes",
        nivelComprension: "Comprender",
        subtitulo: "Cuenta, número, grupos y privacidad",
        duracion: 15,
        objetivo: "Entender qué hay detrás de una conversación de WhatsApp y cómo cuidar tu privacidad.",
        objetivos: [
          "Comprender cómo viajan los mensajes y por qué dependen de internet.",
          "Entender la relación entre tu cuenta y tu número de teléfono.",
          "Saber cómo funcionan los grupos y quién puede administrarlos.",
          "Configurar la privacidad de tu perfil, estados y última conexión."
        ],
        pasos: [
          {
            titulo: "Cómo viajan los mensajes",
            contenido: `<p>A diferencia de los SMS, los mensajes de WhatsApp viajan por <strong>internet</strong>. Cuando tocás «enviar», el mensaje va a los servidores de la empresa y baja al celular de la otra persona.</p>
<p>Por eso, si no tenés conexión, el mensaje queda con un relojito y se envía cuando vuelve la señal. No se perdió: está esperando.</p>
<p>Las marcas junto al mensaje te cuentan qué pasó: un reloj significa que se está enviando; un tilde, que llegó al servidor; dos tildes, que llegó al celular de la otra persona.</p>`,
            consejo: "💡 Consejo: Si un mensaje no sale, revisá tu WiFi o tus datos móviles antes de volver a escribirlo."
          },
          {
            titulo: "Tu cuenta y tu número",
            contenido: `<p>Tu cuenta de WhatsApp está ligada a tu <strong>número de teléfono</strong>. Cuando instalás la app, te llega un código por SMS para confirmar que el número es tuyo.</p>
<p>Si cambiás de celular pero mantenés el número, podés recuperar tu cuenta con ese código. Si cambiás de número, tenés que avisar a tus contactos y actualizar la cuenta.</p>
<p>El código de verificación es personal: quien lo tenga puede quedarse con tu cuenta. Nunca se lo des a nadie, ni siquiera a alguien que dice ser de soporte.</p>`,
            consejo: "💡 Consejo: Activá la verificación en dos pasos dentro de WhatsApp para que nadie pueda usar tu número sin el PIN."
          },
          {
            titulo: "Los grupos",
            contenido: `<p>Un <strong>grupo</strong> es una conversación con varias personas a la vez. Lo crea alguien, que suele ser <strong>administrador</strong>, y puede agregar o quitar participantes.</p>
<p>En los grupos hay reglas básicas de convivencia: no reenviar cadenas, no compartir datos de otros sin permiso y no discutir en público. Si un grupo te molesta, podés silenciarlo o salirte.</p>
<p>Para salir de un grupo: tocá el nombre del grupo, bajá hasta «Salir del grupo» y confirmá. No pasa nada: podés volver si te invitan.</p>`,
            consejo: "💡 Consejo: Si un grupo tiene 200 personas o más, pensá antes de compartir una foto familiar. No sabés quién la puede reenviar."
          },
          {
            titulo: "Privacidad y cifrado",
            contenido: `<p>WhatsApp usa <strong>cifrado de extremo a extremo</strong>: los mensajes se protegen en el camino y solo los puede leer quien los recibe. Es una buena protección, pero no impide que la otra persona haga una captura de pantalla.</p>
<p>En «Ajustes» → «Privacidad» podés decidir quién ve tu foto de perfil, tu última conexión, tu estado y quién puede agregarte a grupos. Una opción útil es limitar esos datos a «Mis contactos».</p>
<p>Revisá también los dispositivos vinculados (WhatsApp Web) y cerraste sesión en los que no reconozcas.</p>`,
            consejo: "💡 Consejo: Revisá la privacidad una vez al mes. Son dos minutos que protegen tu imagen y tu tranquilidad."
          }
        ],
        glosario: [
          { termino: "Cifrado de extremo a extremo", definicion: "Protección que impide que el mensaje sea leído por alguien distinto del destinatario." },
          { termino: "Administrador", definicion: "Persona que creó o administra un grupo y puede agregar o quitar miembros." },
          { termino: "WhatsApp Web", definicion: "Versión de WhatsApp que se usa desde una computadora vinculada al celular." }
        ],
        examen: [
          {
            texto: "¿Por dónde viajan los mensajes de WhatsApp?",
            opciones: [
              { texto: "Por internet, usando WiFi o datos móviles", valor: "correcto" },
              { texto: "Por el correo postal", valor: "incorrecto" },
              { texto: "Solo por el cable del teléfono fijo", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué significa el cifrado de extremo a extremo?",
            opciones: [
              { texto: "Que el mensaje se protege y solo lo lee el destinatario", valor: "correcto" },
              { texto: "Que el mensaje se borra solo", valor: "incorrecto" },
              { texto: "Que cualquiera puede leerlo", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué podés hacer si un grupo te manda demasiados mensajes?",
            opciones: [
              { texto: "Silenciarlo o salir del grupo", valor: "correcto" },
              { texto: "Apagar el celular para siempre", valor: "incorrecto" },
              { texto: "Borrar la aplicación", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 3,
        titulo: "Mandar mensajes, audios y fotos",
        nivelComprension: "Practicar",
        subtitulo: "Mensajes, archivos, grupos y videollamadas",
        duracion: 20,
        objetivo: "Usar las funciones principales de la mensajería con soltura y sin depender de otra persona.",
        objetivos: [
          "Enviar un mensaje de texto y un audio.",
          "Compartir una foto o un documento.",
          "Crear un grupo y participar en él.",
          "Hacer y recibir una videollamada."
        ],
        pasos: [
          {
            titulo: "Enviar un mensaje y un audio",
            contenido: `<p>Para <strong>mandar un mensaje</strong>: abrí la conversación, tocá el espacio blanco de abajo, escribí y tocá la flecha verde de enviar.</p>
<p>Para <strong>mandar un audio</strong>: mantené apretado el botón del micrófono mientras hablás y soltalo al terminar. Si te equivocaste, deslizá el dedo hacia el costado antes de soltar para cancelar.</p>
<p>Hablá cerca del micrófono y sin apuro. Si el audio salió muy largo, podés borrarlo y grabar otro.</p>`,
            consejo: "💡 Consejo: Antes de mandar un audio, pensá si la otra persona puede escucharlo en ese momento. Si es urgente, llamala."
          },
          {
            titulo: "Compartir una foto o un documento",
            contenido: `<p>Dentro de una conversación, tocá el <strong>clip</strong> o el botón <strong>+</strong>. Aparecen opciones: «Galería» para fotos, «Cámara» para sacar una en el momento, «Documento» para archivos.</p>
<p>Elegí la foto y tocá enviar. Si es un documento importante, verificá que elegiste el archivo correcto antes de mandarlo.</p>
<p>Ojo: una foto enviada se puede reenviar. No compartas fotos de documentos, tarjetas o datos personales por WhatsApp si no es imprescindible.</p>`,
            consejo: "💡 Consejo: Si necesitás mandar una foto de un documento, tapá con el dedo o con un papel los datos que no hacen falta."
          },
          {
            titulo: "Crear un grupo",
            contenido: `<p>Para <strong>crear un grupo</strong>: tocá el botón de nuevo chat, elegí «Nuevo grupo», seleccioná los contactos y ponele un nombre claro («Familia», «Vecinos del barrio»).</p>
<p>Como administrador, podés agregar o quitar personas y cambiar el nombre. Es útil para organizar un cumpleaños, coordinar un viaje o compartir novedades.</p>
<p>Antes de agregar a alguien, preguntale si quiere estar. No agregues a personas sin avisar ni compartas sus números con el resto.</p>`,
            consejo: "💡 Consejo: Ponele al grupo un nombre y una foto claros. Así todos saben de qué se trata y evitan confusiones."
          },
          {
            titulo: "Hacer una videollamada",
            contenido: `<p>Para <strong>videollamar</strong>: abrí la conversación y tocá el icono de la cámara (arriba a la derecha). La otra persona recibe el llamado y, si atiende, se ven las caras.</p>
<p>Antes de empezar, revisá que la cámara esté limpia y que haya buena luz. Podés silenciar el micrófono con el icono del micrófono y apagar la cámara con el icono de la cámara.</p>
<p>Para cortar, tocá el botón rojo. Si la conexión es mala, probá apagar la cámara: el audio suele mejorar.</p>`,
            consejo: "💡 Consejo: Para una videollamada, apoyá el celular en un lugar firme o usá un soporte. Así no se cansa el brazo."
          }
        ],
        glosario: [
          { termino: "Clip", definicion: "Botón con forma de sujetapapeles que abre las opciones para adjuntar archivos." },
          { termino: "Videollamada", definicion: "Llamada con imagen y sonido a través de internet." },
          { termino: "Silenciar micrófono", definicion: "Apagar tu micrófono para que los demás no te escuchen." }
        ],
        examen: [
          {
            texto: "¿Cómo se envía un audio en WhatsApp?",
            opciones: [
              { texto: "Manteniendo apretado el botón del micrófono mientras hablás", valor: "correcto" },
              { texto: "Escribiendo el texto y tocando el micrófono", valor: "incorrecto" },
              { texto: "Apagando el celular", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué conviene hacer antes de compartir la foto de un documento?",
            opciones: [
              { texto: "Tapar los datos que no hacen falta", valor: "correcto" },
              { texto: "Enviarla a todos los grupos", valor: "incorrecto" },
              { texto: "Publicarla en redes sociales", valor: "incorrecto" }
            ]
          },
          {
            texto: "En una videollamada con mala conexión, ¿qué puede ayudar?",
            opciones: [
              { texto: "Apagar la cámara para mejorar el audio", valor: "correcto" },
              { texto: "Gritar más fuerte", valor: "incorrecto" },
              { texto: "Apagar el router", valor: "incorrecto" }
            ]
          }
        ]
      },
      {
        numero: 4,
        titulo: "Comunicarte sin riesgos",
        nivelComprension: "Dominar y proteger",
        subtitulo: "Suplantación, cadenas, ubicación y sesiones",
        duracion: 20,
        objetivo: "Detectar engaños en la mensajería y proteger tu privacidad y la de tu familia.",
        objetivos: [
          "Reconocer cuando alguien se hace pasar por un familiar.",
          "Identificar cadenas, bulos y noticias falsas.",
          "Cuidar la ubicación y los datos sensibles que compartís.",
          "Revisar los dispositivos vinculados y cerrar sesiones."
        ],
        pasos: [
          {
            titulo: "Cuando alguien se hace pasar por un familiar",
            contenido: `<p>Un engaño frecuente: recibís un mensaje de un número desconocido que dice ser tu hijo o tu nieto, con un cuento urgente y un pedido de dinero. Puede usar una foto de perfil real y hasta un audio imitando la voz.</p>
<p>No transfieras dinero por presión. Cortá la conversación y llamá a tu familiar a su número de siempre. Si no contesta, llamá a otra persona que pueda confirmarte que está bien.</p>
<p>Acordá en familia una <strong>palabra clave</strong> para estos casos. Si el mensaje no la incluye, no es real.</p>`,
            consejo: "💡 Consejo: Nunca devuelvas el llamado al número del mensaje. Marcá vos el número que ya tenés guardado."
          },
          {
            titulo: "Cadenas, bulos y noticias falsas",
            contenido: `<p>Las <strong>cadenas</strong> son mensajes que piden reenviar a diez contactos «para evitar un peligro» o «para ganar un premio». Casi siempre son falsas y algunas contienen enlaces peligrosos.</p>
<p>Antes de reenviar una noticia, verificá si aparece en un medio conocido. Desconfiá de los mensajes con muchas mayúsculas, signos de exclamación y pedidos de urgencia.</p>
<p>Reenviar sin verificar aumenta el ruido y el miedo. La persona que te escribe con cariño merece información verdadera.</p>`,
            consejo: "💡 Consejo: Si dudás de una cadena, no la reenvíes. Buscala en Google y fijate si un medio serio la publicó."
          },
          {
            titulo: "Ubicación y datos sensibles",
            contenido: `<p>Compartir la <strong>ubicación en tiempo real</strong> es útil para que un familiar sepa que llegaste bien, pero no debe quedar activada para siempre. Se activa por un tiempo limitado y se desactiva al llegar.</p>
<p>Evitá publicar en estados o redes que estás de viaje, que estás solo o que tenés objetos de valor en casa. Es información que puede usar un delincuente.</p>
<p>Tampoco compartas fotos de tu DNI, tarjetas, recetas médicas o datos de tus nietos en grupos grandes.</p>`,
            consejo: "💡 Consejo: Antes de publicar una foto, mirá el fondo: a veces muestra la dirección, un documento o un dato que no querías compartir."
          },
          {
            titulo: "Dispositivos vinculados y cierre de sesión",
            contenido: `<p>WhatsApp permite usarse en la computadora mediante <strong>WhatsApp Web</strong>. Para eso se vincula escaneando un código QR. Si usás una computadora compartida, cerrá esa sesión al terminar.</p>
<p>En el celular, entrá en «Ajustes» → «Dispositivos vinculados» y revisá la lista. Si hay un equipo que no reconocés, cerralo de inmediato y activá la verificación en dos pasos.</p>
<p>También revisá cada tanto las sesiones abiertas de tu correo y redes sociales. Salir de los dispositivos que no usás es una higiene digital básica.</p>`,
            consejo: "💡 Consejo: Una vez por mes, revisá los dispositivos vinculados. Si ves algo raro, cerralo y cambiá la contraseña."
          }
        ],
        glosario: [
          { termino: "Suplantación", definicion: "Hacerse pasar por otra persona para engañar y obtener dinero o datos." },
          { termino: "Cadena", definicion: "Mensaje que pide reenviarse a muchas personas y suele contener información falsa." },
          { termino: "Dispositivo vinculado", definicion: "Computadora u otro equipo conectado a tu cuenta desde el que se puede usar." }
        ],
        examen: [
          {
            texto: "Un número desconocido dice ser tu nieto y pide dinero urgente. ¿Qué hacés?",
            opciones: [
              { texto: "Lo llamo a su número de siempre para confirmar", valor: "correcto" },
              { texto: "Transfiero el dinero enseguida", valor: "incorrecto" },
              { texto: "Le paso mis datos bancarios por el chat", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué conviene hacer con una cadena de WhatsApp?",
            opciones: [
              { texto: "No reenviarla y verificar la información en un medio serio", valor: "correcto" },
              { texto: "Reenviarla a todos por las dudas", valor: "incorrecto" },
              { texto: "Compartirla en todos los grupos", valor: "incorrecto" }
            ]
          },
          {
            texto: "¿Qué hacés si ves un dispositivo vinculado que no reconocés en WhatsApp?",
            opciones: [
              { texto: "Lo cierro y activo la verificación en dos pasos", valor: "correcto" },
              { texto: "Lo dejo, seguro es del celular", valor: "incorrecto" },
              { texto: "Le mando un mensaje", valor: "incorrecto" }
            ]
          }
        ]
      }
    ]
  }
];
