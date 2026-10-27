/* ============================================
   TAMI - Teorías complementarias por nivel
   --------------------------------------------
   Cada nivel del Campus tiene 10 teorías:
     - 4 teorías base en contenido-cursos.js
     - 6 teorías complementarias en este archivo

   La clave es el ID compuesto del nivel: curso * 100 + número.
   Ejemplo: 101 = Curso 1, Nivel 1.
   ============================================ */

const TEORIAS_EXTRA = {
  /* ==========================================================
     CURSO 1 - USO DE SMARTPHONES
     ========================================================== */

  // Nivel 1 · Descubrir
  "101": [
    {
      titulo: "La batería y el cargador",
      contenido: `<p>La <strong>batería</strong> guarda la energía que el celular necesita para funcionar. Cuando queda poca, aparece un dibujito de batería casi vacío o de color rojo. Ahí es momento de conectarlo al cargador.</p>
<p>Usá el cable y el enchufe que vinieron con el celular. Mientras carga, apoyalo en una mesa fresca y despejada, sin taparlo con almohadas ni papeles. Si el cable está pelado o el enchufe se calienta mucho, dejá de usarlo y pedí ayuda.</p>`,
      consejo: "💡 Consejo: cargá el celular durante el día, en un lugar visible, así no te olvidás de desconectarlo."
    },
    {
      titulo: "Los sonidos del celular",
      contenido: `<p>El celular avisa de tres maneras: con el <strong>timbre</strong> cuando te llaman, con un sonido corto cuando llega un mensaje (<strong>notificación</strong>) y con <strong>vibración</strong> si la activaste. Los botones del costado suben o bajan el volumen.</p>
<p>Si estás en el médico, en una reunión o de noche, podés ponerlo en <strong>modo silencio</strong>. En ese modo no suena, pero sigue recibiendo llamadas y mensajes, y la pantalla se ilumina para avisarte.</p>`,
      consejo: "💡 Consejo: subí el volumen y hacé sonar el timbre una vez por semana para comprobar que se escucha bien."
    },
    {
      titulo: "Conectarte al WiFi de tu casa",
      contenido: `<p>El <strong>WiFi</strong> es una conexión sin cables a internet que funciona dentro de tu casa. Para usarla necesitás la <strong>clave</strong> de la red, que suele estar en una etiqueta del aparato del internet o te la puede dar un familiar.</p>
<p>Entrá en <strong>Ajustes o Configuración</strong>, buscá la opción <strong>WiFi</strong> y elegí el nombre de tu red. Escribí la clave con cuidado, respetando mayúsculas y minúsculas. Cuando veas el dibujito de WiFi arriba de la pantalla, ya estás conectado.</p>`,
      consejo: "💡 Consejo: en casa usá WiFi. Así no gastás los datos móviles de tu plan."
    },
    {
      titulo: "Letras más grandes y pantalla más clara",
      contenido: `<p>El celular se puede adaptar a tus ojos. En <strong>Ajustes</strong> buscá <strong>Pantalla</strong> y después <strong>Tamaño de letra</strong>. Movés el control hacia la derecha y las letras se agrandan en todas las aplicaciones.</p>
<p>El <strong>brillo</strong> es la luz de la pantalla. Si lo subís, se ve mejor al sol, pero la batería dura menos. Si lo bajás, descansás la vista de noche. Muchos celulares tienen brillo automático, que se ajusta solo según la luz del lugar.</p>`,
      consejo: "💡 Consejo: agrandá las letras hoy mismo. No es un capricho: cuidar la vista también es cuidar tu salud."
    },
    {
      titulo: "Cuidar el celular por fuera",
      contenido: `<p>Una <strong>funda</strong> y un vidrio protector evitan que el celular se golpee o se raye si se cae. El calor es su peor enemigo: no lo dejes al sol ni dentro del auto estacionado, porque la batería se daña.</p>
<p>Para limpiarlo, usá un paño seco y suave. Evitá los líquidos y no lo lleves al baño ni a la pileta. Si se moja, apagalo y lleválo a un servicio técnico de confianza; no lo pongas en arroz.</p>`,
      consejo: "💡 Consejo: revisá la funda cada tanto. Si está rota o muy suelta, conviene cambiarla."
    },
    {
      titulo: "Pedir ayuda no es molestar",
      contenido: `<p>Aprender a usar el celular lleva tiempo y nadie nace sabiendo. Pedir ayuda a un familiar, a un vecino o a este curso es parte del aprendizaje. Lo importante es que la otra persona <strong>te muestre</strong> cómo se hace, en vez de hacerlo por vos.</p>
<p>Una buena idea es tener un <strong>cuaderno de pasos</strong>: anotá con tus palabras cómo encender el celular, cómo llamar o cómo mandar un mensaje. Cada vez que practicás, esos pasos quedan más firmes en tu memoria.</p>`,
      consejo: "💡 Consejo: practicá cinco minutos por día. Es mejor poco y seguido que mucho de una sola vez."
    }
  ],

  // Nivel 2 · Comprender
  "102": [
    {
      titulo: "La nube: tus fotos fuera del celular",
      contenido: `<p>La <strong>nube</strong> es un espacio de internet donde se guardan copias de tus fotos, contactos y archivos. Aunque parezca que están «en el aire», en realidad quedan guardadas en servidores seguros de la empresa que te da el servicio.</p>
<p>Si activás la copia en la nube y perdés el celular, tus fotos no se pierden: las recuperás cuando entrás con tu cuenta en otro equipo. Para ahorrar datos, configurá que la copia se haga solo cuando estés conectado al WiFi.</p>`,
      consejo: "💡 Consejo: guardar en la nube es como tener una caja fuerte en internet. No reemplaza la copia en un lugar seguro, la complementa."
    },
    {
      titulo: "Tu cuenta: la llave del celular",
      contenido: `<p>Para usar un celular inteligente necesitás una <strong>cuenta</strong>, que puede ser de Google o de Apple. Esa cuenta tiene un correo y una contraseña, y sirve para descargar aplicaciones, guardar copias y recuperar el equipo si se pierde.</p>
<p>Tu cuenta es personal: no la compartas ni prestes la contraseña. Si alguien entra en tu cuenta, puede ver tus fotos, tus contactos y tus correos. Anotá en un lugar seguro qué correo usaste para crearla.</p>`,
      consejo: "💡 Consejo: verificá que el correo de tu cuenta sea uno que usás de verdad y al que podés entrar."
    },
    {
      titulo: "Los iconos de arriba de la pantalla",
      contenido: `<p>En la <strong>barra de estado</strong>, arriba de todo, aparecen pequeños dibujos que informan cómo está el celular: la hora, la batería, la señal del teléfono, el WiFi y si hay notificaciones sin leer (una campanita).</p>
<p>Si ves un icono que no conocés, no te asustes: puede ser una actualización, el modo avión o una aplicación avisando algo. Tocá la barra y deslizá hacia abajo para ver el detalle de cada aviso.</p>`,
      consejo: "💡 Consejo: si un icono raro aparece y no desaparece, mostráselo a alguien de confianza antes de tocar nada."
    },
    {
      titulo: "Por qué el celular anda lento",
      contenido: `<p>Con el tiempo, el celular puede ponerse lento por tres motivos: hay muchas aplicaciones abiertas al mismo tiempo, la memoria está casi llena o el sistema está instalando una actualización.</p>
<p>Para mejorarlo, cerrá las aplicaciones que no estés usando, borrá videos y fotos que no necesitás y reiniciá el equipo una vez por semana. Reiniciar es apagarlo y volver a encenderlo: no borra nada, solo lo descansa.</p>`,
      consejo: "💡 Consejo: si está muy lento, reiniciá antes de preocuparte. La mayoría de las veces se soluciona así."
    },
    {
      titulo: "Modo avión y ahorro de batería",
      contenido: `<p>El <strong>modo avión</strong> apaga las conexiones del celular: no recibe llamadas ni usa internet. Sirve cuando viajás en avión o cuando querés descansar sin interrupciones. Se activa y se desactiva desde la barra de arriba.</p>
<p>El <strong>ahorro de batería</strong> reduce el consumo: baja el brillo, limita algunas aplicaciones y hace que la carga dure más. Se activa en Ajustes y es útil cuando estás lejos del cargador.</p>`,
      consejo: "💡 Consejo: si activaste el modo avión sin querer y no recibís llamadas, revisá ese icono primero."
    },
    {
      titulo: "Notificaciones: qué son y cómo controlarlas",
      contenido: `<p>Las <strong>notificaciones</strong> son avisos que las aplicaciones muestran en la pantalla: un mensaje nuevo, un correo, una noticia o el recordatorio de un turno. Aparecen arriba y, a veces, hacen sonar el celular.</p>
<p>No todas son importantes. Podés silenciar las que no te sirven desde Ajustes, dejando activas las llamadas, los mensajes y las alarmas. Así el celular avisa solo de lo que realmente te importa.</p>`,
      consejo: "💡 Consejo: revisá las notificaciones una vez al día, con calma, y no cada vez que suena."
    }
  ],

  // Nivel 3 · Practicar
  "103": [
    {
      titulo: "Contestar y cortar una llamada",
      contenido: `<p>Cuando entra una llamada, la pantalla muestra el nombre o el número y dos botones: uno <strong>verde</strong> para contestar y uno <strong>rojo</strong> para rechazar. En algunos celulares hay que deslizar el dedo sobre el botón verde.</p>
<p>Para cortar, tocá el botón rojo. Si no llegaste a contestar, vas a ver el aviso de <strong>llamada perdida</strong> y podés devolverla tocando el número. Si es un número desconocido que pide datos, no devuelvas la llamada: cortá y consultá.</p>`,
      consejo: "💡 Consejo: probá contestar y cortar con un familiar antes de una llamada importante, así practicás sin apuro."
    },
    {
      titulo: "Buscar cosas en el celular",
      contenido: `<p>Casi todos los celulares tienen una <strong>lupa</strong> o una barra de búsqueda en la pantalla de inicio. Sirve para encontrar rápido una aplicación, un contacto o una página web sin recorrer todos los iconos.</p>
<p>Tocá la lupa, escribí lo que buscás y elegí el resultado. También podés buscar con la voz: tocá el micrófono y decí «WhatsApp» o «clima». El celular entiende y te muestra las opciones.</p>`,
      consejo: "💡 Consejo: si no encontrás un icono, usá la lupa. Es más rápido que dar vueltas por las pantallas."
    },
    {
      titulo: "Escribir con el teclado",
      contenido: `<p>El <strong>teclado</strong> aparece cuando tocás un espacio para escribir. Las letras están en minúscula; la tecla con una flecha hacia arriba pone una mayúscula. La tecla de espacio separa las palabras y la de borrar elimina lo último que escribiste.</p>
<p>Si te cuesta escribir en letras chicas, usá el <strong>dictado por voz</strong>: tocá el micrófono del teclado, hablá claro y el texto aparece solo. Antes de enviar, leé lo que quedó escrito para corregir errores.</p>`,
      consejo: "💡 Consejo: no tengas miedo de equivocarte. Podés borrar y volver a escribir las veces que necesites."
    },
    {
      titulo: "Ver y compartir tus fotos",
      contenido: `<p>Las fotos que sacás se guardan en la <strong>Galería</strong> o en <strong>Fotos</strong>. Ahí podés verlas, ampliarlas con dos dedos y borrar las que no te gustan. Tocá una foto para verla y buscá el dibujo de compartir.</p>
<p>Desde ese botón podés enviar la foto por WhatsApp, por correo o guardarla en un lugar seguro. Si la foto tiene datos personales, como un documento o una dirección, pensalo dos veces antes de compartirla.</p>`,
      consejo: "💡 Consejo: borrá las fotos repetidas o borrosas. Liberan espacio y hacen que la galería sea más fácil de usar."
    },
    {
      titulo: "Reloj, alarma y calendario",
      contenido: `<p>El celular puede ayudarte a organizar el día. La <strong>alarma</strong> suena a la hora que elijas y es útil para tomar remedios, para un turno médico o para no olvidar una llamada.</p>
<p>El <strong>calendario</strong> permite anotar fechas importantes y recibir un aviso antes. Podés agregar un cumpleaños, una vacuna o el vencimiento de una cuenta. Todo queda guardado y te avisa a tiempo.</p>`,
      consejo: "💡 Consejo: poné una alarma para tus medicamentos y dejá el celular cerca, pero no debajo de la almohada."
    },
    {
      titulo: "La calculadora y otras apps útiles",
      contenido: `<p>Todos los celulares traen aplicaciones que no necesitan internet: <strong>calculadora</strong>, <strong>linterna</strong>, <strong>cámara</strong>, <strong>reloj</strong> y <strong>grabadora de voz</strong>. Son seguras y ya vienen instaladas.</p>
<p>Antes de instalar una aplicación nueva, preguntá para qué sirve y quién la hizo. Si promete regalos, dinero fácil o premios, desconfiá. Las apps útiles se descargan desde la tienda oficial del celular.</p>`,
      consejo: "💡 Consejo: empezá usando las aplicaciones que ya vienen instaladas. No necesitás descargar nada para las tareas básicas."
    }
  ],

  // Nivel 4 · Dominar y proteger
  "104": [
    {
      titulo: "Elegir un buen bloqueo",
      contenido: `<p>Hay tres formas comunes de bloquear el celular: un <strong>PIN</strong> de números, un <strong>patrón</strong> de puntos o la <strong>huella</strong> o el rostro. Cualquiera sirve; lo importante es que sea difícil de adivinar.</p>
<p>No uses 1234, 0000 ni tu fecha de nacimiento. Tampoco uses el mismo número que el del banco. Si alguien vio tu PIN, cambialo en Ajustes, en Seguridad o Bloqueo de pantalla.</p>`,
      consejo: "💡 Consejo: memorizá el PIN practicándolo, pero anotá una pista en un lugar privado por si lo olvidás."
    },
    {
      titulo: "Encontrar mi dispositivo",
      contenido: `<p>Google y Apple ofrecen un servicio para encontrar el celular si se pierde: <strong>Encontrar mi dispositivo</strong>. Desde otro equipo o desde una computadora podés ver dónde está, hacerlo sonar, bloquearlo o borrar sus datos.</p>
<p>Para que funcione, el celular tiene que estar encendido, con conexión y con tu cuenta activa. Activá esta opción hoy, mientras tenés el celular en la mano, no cuando ya lo perdiste.</p>`,
      consejo: "💡 Consejo: pedile a un familiar que te ayude a activar «Encontrar mi dispositivo» y que sepa cómo usarlo."
    },
    {
      titulo: "Qué apps pueden ver tu ubicación",
      contenido: `<p>Algunas aplicaciones piden permiso para saber <strong>dónde estás</strong>: el mapa, el clima o el transporte. Otras lo piden sin necesitarlo. Es importante revisar qué permiso tiene cada una.</p>
<p>En Ajustes, buscá <strong>Ubicación</strong> y mirá la lista de aplicaciones. Elegí «Solo mientras uso la app» para las que lo necesitan y quitá el permiso a las que no tienen motivo para saber dónde estás.</p>`,
      consejo: "💡 Consejo: si una aplicación de linterna o de calculadora pide tu ubicación, desconfiá y quitale el permiso."
    },
    {
      titulo: "Números de emergencia y datos importantes",
      contenido: `<p>En el celular podés guardar un <strong>contacto de emergencia</strong> para que alguien de confianza sea avisado si te pasa algo. También podés anotar tus alergias o medicamentos en la información médica del equipo.</p>
<p>Estos datos pueden verse desde la pantalla de bloqueo, sin necesidad de desbloquear el celular. En Argentina, el número de emergencias es el <strong>911</strong> y el de emergencias médicas en la ciudad de Buenos Aires es el <strong>107</strong>.</p>`,
      consejo: "💡 Consejo: avisale a un familiar que cargaste estos datos y comprobá que el número esté bien escrito."
    },
    {
      titulo: "Prestar el celular sin riesgos",
      contenido: `<p>Si le prestás el celular a otra persona, esa persona puede ver tus mensajes, tus fotos y tus cuentas. Por eso conviene quedarse cerca y no dejar sesiones abiertas en el banco ni en el correo.</p>
<p>Antes de prestarlo, cerrá las aplicaciones importantes. Si el préstamo es para una llamada, podés marcar el número vos mismo. Al terminar, revisá que todo esté como estaba.</p>`,
      consejo: "💡 Consejo: prestar el celular está bien, pero tus claves y tus datos son tuyos. No hace falta compartirlos."
    },
    {
      titulo: "Llamadas sospechosas",
      contenido: `<p>Si te llaman diciendo que son del banco, de una empresa o del gobierno y te piden contraseñas, códigos o datos de la tarjeta, es una estafa. Ninguna entidad seria pide esos datos por teléfono.</p>
<p>Cortá la llamada y, si tenés dudas, llamá vos al número oficial que figura en tu tarjeta o en la página web de la entidad. No uses el número que te dio la persona que llamó.</p>`,
      consejo: "💡 Consejo: ante una llamada rara, la mejor respuesta es cortar. Después consultás con calma."
    }
  ],

  /* ==========================================================
     CURSO 2 - REDES E INTERNET
     ========================================================== */

  // Nivel 1 · Descubrir
  "201": [
    {
      titulo: "WiFi, cable y datos móviles",
      contenido: `<p>Hay tres formas de conectarse a internet. El <strong>WiFi</strong> llega sin cables dentro de tu casa. El <strong>cable</strong> conecta una computadora fija y suele ser muy estable. Los <strong>datos móviles</strong> los da la compañía de telefonía y funcionan en cualquier lugar donde haya señal.</p>
<p>El WiFi y el cable no gastan datos del plan. Los datos móviles sí, y tienen un límite mensual. Por eso conviene usar WiFi en casa y reservar los datos para cuando estás en la calle.</p>`,
      consejo: "💡 Consejo: si en casa tenés WiFi, conectate siempre a esa red para no consumir datos."
    },
    {
      titulo: "Qué es un enlace",
      contenido: `<p>Un <strong>enlace</strong> (o <em>link</em>) es un texto de color azul o subrayado que, al tocarlo, te lleva a otra página. También puede ser una imagen o un botón. El dibujito de una mano con el dedo indica que se puede tocar.</p>
<p>Los enlaces son la forma de avanzar por internet. Pero no todos son confiables: si un enlace llega en un mensaje que te apura o te promete un premio, no lo toques. Primero verificá quién lo envió.</p>`,
      consejo: "💡 Consejo: si no sabés a dónde lleva un enlace, no lo toques. Es mejor quedarse con la duda que caer en una estafa."
    },
    {
      titulo: "Pestañas y ventanas",
      contenido: `<p>El navegador permite abrir varias páginas a la vez usando <strong>pestañas</strong>. Son como separadores de un cuaderno: cada una guarda una página distinta y podés pasar de una a otra sin perder lo que estabas viendo.</p>
<p>Arriba del navegador ves una fila con el título de cada pestaña. Tocás una para ir a esa página y la cruz (×) para cerrarla. Cerrar una pestaña no borra la página de internet: podés volver a abrirla cuando quieras.</p>`,
      consejo: "💡 Consejo: si se abren muchas pestañas y no sabés qué son, cerralas todas y empezá de nuevo. No se rompe nada."
    },
    {
      titulo: "Página de inicio y buscador",
      contenido: `<p>La <strong>página de inicio</strong> es la primera que aparece cuando abrís el navegador. El <strong>buscador</strong> es la barra o caja donde escribís lo que querés encontrar, como «clima en mi barrio» o «horario de la farmacia».</p>
<p>El buscador no es lo mismo que la dirección web. En la dirección escribís el nombre exacto de un sitio, como <em>anses.gob.ar</em>. En el buscador escribís palabras y él te propone páginas. Para tareas simples, el buscador es más fácil.</p>`,
      consejo: "💡 Consejo: no necesitás recordar direcciones difíciles. Escribí el nombre del lugar en el buscador y elegí el sitio oficial."
    },
    {
      titulo: "Qué es un sitio oficial",
      contenido: `<p>Los sitios oficiales del gobierno argentino terminan en <strong>.gob.ar</strong>. Los de universidades terminan en <strong>.edu.ar</strong> y los de organizaciones sin fines de lucro en <strong>.org.ar</strong>. Esa terminación ayuda a saber si el sitio es confiable.</p>
<p>Antes de ingresar datos, mirá bien la dirección. Un sitio falso puede parecerse mucho al verdadero, pero cambia una letra o agrega un guion. Si la dirección no coincide exactamente con la oficial, no escribas nada.</p>`,
      consejo: "💡 Consejo: para trámites, buscá siempre el sitio que termina en .gob.ar y revisá que la dirección esté completa."
    },
    {
      titulo: "Cuando no hay conexión",
      contenido: `<p>Si el navegador dice «sin conexión» o «no se puede acceder a este sitio», el problema suele estar en tu conexión, no en el sitio. Revisá si el WiFi está activado y si el aparato de internet tiene las luces encendidas.</p>
<p>También puede pasar que el sitio esté en mantenimiento. En ese caso, esperá unos minutos y volvé a intentar. Si el problema sigue, reiniciá el aparato de internet desenchufándolo y volviéndolo a enchufar.</p>`,
      consejo: "💡 Consejo: antes de preocuparte, mirá si el celular o la computadora está conectado a la red correcta."
    }
  ],

  // Nivel 2 · Comprender
  "202": [
    {
      titulo: "Qué es un servidor",
      contenido: `<p>Un <strong>servidor</strong> es una computadora muy potente que guarda las páginas web y las entrega cuando alguien las pide. Es como un kiosco de información que está abierto las 24 horas y atiende a muchísimas personas a la vez.</p>
<p>Cuando escribís una dirección, tu equipo le pide la página a ese servidor y la recibe en segundos. Por eso las páginas se ven igual desde cualquier lugar del mundo: todas vienen del mismo servidor.</p>`,
      consejo: "💡 Consejo: no necesitás saber nada técnico. Solo recordá que el servidor es el lugar donde «viven» las páginas que visitás."
    },
    {
      titulo: "Las partes de una dirección web",
      contenido: `<p>Una dirección web tiene partes que conviene reconocer. Por ejemplo, en <em>https://www.anses.gob.ar/tramites</em>: <strong>https</strong> indica que la conexión es segura, <strong>www.anses.gob.ar</strong> es el nombre del sitio y <strong>/tramites</strong> es la sección adentro del sitio.</p>
<p>Lo más importante es el nombre del sitio. Si alguien te envía un enlace donde ese nombre tiene una letra cambiada o una palabra agregada, probablemente sea falso.</p>`,
      consejo: "💡 Consejo: antes de tocar un enlace, leé el nombre del sitio. Ahí está la diferencia entre lo oficial y lo falso."
    },
    {
      titulo: "El historial de navegación",
      contenido: `<p>El <strong>historial</strong> es la lista de páginas que visitaste. Sirve para volver a encontrar algo que viste antes y no recordás cómo buscar. Se abre desde el menú del navegador, con el dibujo de un reloj o la palabra «Historial».</p>
<p>Si usás una computadora compartida, conviene borrar el historial después de revisar cosas personales. También podés borrarlo todo desde Ajustes o Configuración del navegador.</p>`,
      consejo: "💡 Consejo: en equipos prestados, borrá el historial y cerrá sesión antes de irte."
    },
    {
      titulo: "Ventanas emergentes y anuncios",
      contenido: `<p>Las <strong>ventanas emergentes</strong> son cuadros que aparecen solos, muchas veces diciendo que ganaste un premio o que tu celular tiene un virus. No son confiables y no hay que tocarlas.</p>
<p>Para cerrarlas, buscá la cruz (×) en un borde del cuadro. Si no aparece, volvé atrás con la flecha del navegador. Nunca escribas datos en una ventana que apareció sin que la hayas pedido.</p>`,
      consejo: "💡 Consejo: si un anuncio dice que tu equipo está infectado, es mentira. Cerrá la ventana y seguí con lo tuyo."
    },
    {
      titulo: "Formularios: cuándo completarlos",
      contenido: `<p>Un <strong>formulario</strong> es el espacio donde el sitio te pide datos: nombre, correo, teléfono o número de tarjeta. Muchos son legítimos, como los de un trámite oficial o una compra conocida.</p>
<p>Antes de completar uno, verificá que la dirección sea oficial y que el candado esté presente. Si el formulario pide contraseñas o datos de la tarjeta en un sitio que no conocés, cerrá la página.</p>`,
      consejo: "💡 Consejo: si dudás, no completes el formulario. Consultá primero con alguien de confianza o con el organismo."
    },
    {
      titulo: "Qué pasa cuando cerrás el navegador",
      contenido: `<p>Cerrar el navegador no borra tu información: las páginas siguen en internet y tus cuentas siguen abiertas hasta que cerrás sesión. Por eso, en una computadora compartida, cerrar la ventana no es suficiente.</p>
<p>Para salir de verdad, buscá el botón <strong>Cerrar sesión</strong> dentro del sitio. Así, la próxima persona que use el equipo no podrá entrar a tu correo ni a tus trámites.</p>`,
      consejo: "💡 Consejo: en un equipo ajeno, siempre tocá «Cerrar sesión». Es el candado que protege tu cuenta."
    }
  ],

  // Nivel 3 · Practicar
  "203": [
    {
      titulo: "Buscar con palabras clave",
      contenido: `<p>Para buscar bien, usá pocas palabras y bien elegidas. En lugar de escribir una frase larga, escribí lo esencial: «turno clínica médica», «horario banco», «receta de torta». El buscador entiende mejor las palabras clave.</p>
<p>Los primeros resultados no siempre son los mejores. Los sitios oficiales suelen aparecer con su nombre y la terminación <em>.gob.ar</em>. Leé el título y la dirección antes de tocar.</p>`,
      consejo: "💡 Consejo: si la búsqueda no da lo que querés, cambiá las palabras y volvé a probar. No hay límite de intentos."
    },
    {
      titulo: "Abrir y cerrar pestañas sin perderte",
      contenido: `<p>Para abrir una página en una pestaña nueva sin salir de la actual, mantené apretado el enlace y elegí «Abrir en una pestaña nueva». También podés tocar el signo <strong>+</strong> que está arriba del navegador.</p>
<p>Si te perdés entre muchas pestañas, mirá la fila de arriba: cada una tiene un título. Tocá la que quieras ver y cerrá las demás con la cruz. Así el navegador queda ordenado.</p>`,
      consejo: "💡 Consejo: no acumules pestañas. Cerrá las que ya no usás para que el equipo funcione más rápido."
    },
    {
      titulo: "Copiar y pegar un enlace",
      contenido: `<p>Copiar y pegar sirve para llevar un texto o una dirección de un lugar a otro. Mantené apretado el enlace hasta que aparezca el menú, elegí <strong>Copiar</strong> y después, en el lugar donde lo querés poner, mantené apretado y elegí <strong>Pegar</strong>.</p>
<p>Este truco es útil para enviar una dirección por WhatsApp o para pegarla en el navegador. Antes de compartir un enlace, verificá que sea el correcto.</p>`,
      consejo: "💡 Consejo: si copiaste algo y no sabés dónde quedó, volvé a copiar el texto correcto y pegá de nuevo."
    },
    {
      titulo: "Adjuntar un archivo a un correo",
      contenido: `<p>Cuando escribís un correo, podés sumar una foto o un documento con el botón que parece un <strong>clip</strong> o que dice <strong>Adjuntar</strong>. Se abre una lista con tus archivos y elegís el que querés enviar.</p>
<p>Esperá unos segundos hasta que el archivo termine de cargarse antes de tocar <strong>Enviar</strong>. Si el archivo es muy pesado, el correo puede tardar o no salir. En ese caso, conviene comprimir la foto o usar un enlace compartido.</p>`,
      consejo: "💡 Consejo: antes de enviar un documento, abrílo y revisá que sea el correcto. Es fácil confundirse de archivo."
    },
    {
      titulo: "Responder, reenviar y eliminar correos",
      contenido: `<p>Cuando abrís un correo, abajo aparecen tres opciones: <strong>Responder</strong> contesta solo a quien te escribió, <strong>Responder a todos</strong> contesta a todas las personas del mensaje y <strong>Reenviar</strong> manda ese correo a otra persona.</p>
<p>El dibujo de un tacho de basura elimina el correo. Si te equivocaste, muchos servicios tienen una papelera donde podés recuperarlo durante unos días.</p>`,
      consejo: "💡 Consejo: usá «Responder» y no «Responder a todos» salvo que realmente quieras que todos lean tu respuesta."
    },
    {
      titulo: "Encontrar un correo viejo",
      contenido: `<p>La bandeja de entrada puede llenarse de correos. Para encontrar uno viejo, usá la <strong>lupa</strong> o barra de búsqueda que está arriba y escribí el nombre de la persona o una palabra del asunto, como «turno» o «factura».</p>
<p>También podés ordenar los correos por fecha o por remitente. Si encontrás uno importante, marcalo con una estrella o guardalo en una carpeta para tenerlo a mano.</p>`,
      consejo: "💡 Consejo: buscá por el nombre de la persona o por una palabra del asunto. Es más rápido que revisar uno por uno."
    }
  ],

  // Nivel 4 · Dominar y proteger
  "204": [
    {
      titulo: "Una contraseña que puedas recordar",
      contenido: `<p>Una buena contraseña es larga y difícil de adivinar, pero fácil de recordar para vos. Podés armar una <strong>frase</strong> con varias palabras y algunos números, por ejemplo: «CafeConLeche42». Es más segura que una palabra sola.</p>
<p>No uses tu nombre, tu fecha de nacimiento ni «123456». Tampoco uses la misma contraseña en todos los sitios: si una se descubre, las demás quedan protegidas.</p>`,
      consejo: "💡 Consejo: pensá una frase que solo vos recuerdes y usala como base. No la escribas en lugares visibles."
    },
    {
      titulo: "Dónde guardar las contraseñas",
      contenido: `<p>Es imposible recordar decenas de contraseñas distintas. Por eso existen los <strong>gestores de contraseñas</strong>: aplicaciones seguras que las guardan y las completan por vos. También podés usar el gestor que ofrece el navegador o el celular.</p>
<p>Si preferís el papel, guardá tus claves en un cuaderno que no esté a la vista y no lo dejes cerca de la computadora. Lo que nunca hay que hacer es pegar la contraseña en la pantalla o compartirla por mensaje.</p>`,
      consejo: "💡 Consejo: elegí un solo método para guardar tus claves y usalo siempre. Así no te quedan contraseñas perdidas."
    },
    {
      titulo: "Qué hacer si te roban la contraseña",
      contenido: `<p>Si sospechás que alguien conoce tu contraseña, cambiala de inmediato desde el sitio oficial. Después, revisá si hay movimientos o mensajes que no reconocés y avisá a la entidad si se trata de tu banco.</p>
<p>Si usabas esa misma contraseña en otros sitios, cambiala también en todos. La verificación en dos pasos evita que alguien entre aunque tenga tu contraseña.</p>`,
      consejo: "💡 Consejo: no esperes a tener pruebas. Cambiar la contraseña es rápido y te deja tranquilo."
    },
    {
      titulo: "Cerrar sesión en equipos ajenos",
      contenido: `<p>Si revisás tu correo o tus trámites en una computadora de un familiar, de una biblioteca o de un ciber, acordate de <strong>cerrar sesión</strong> al terminar. Buscá tu nombre o la palabra «Salir» en la esquina de la página.</p>
<p>También conviene borrar el historial y no aceptar la opción «Recordarme» o «Mantener sesión iniciada». Esas opciones dejan tu cuenta abierta para la próxima persona.</p>`,
      consejo: "💡 Consejo: al terminar, hacé una última revisión: cerrar sesión, borrar historial y llevarte tus papeles."
    },
    {
      titulo: "Reconocer un sitio falso",
      contenido: `<p>Un sitio falso imita la imagen de uno oficial para que escribas tus datos. Las señales más comunes son: la dirección tiene una letra cambiada, el diseño se ve raro, aparecen errores de ortografía o el sitio pide datos que no debería.</p>
<p>Antes de ingresar, revisá que la dirección sea exactamente la oficial y que aparezca el <strong>candado</strong>. Si tenés dudas, no escribas nada y entrá al sitio desde un enlace que conozcas o desde el buscador.</p>`,
      consejo: "💡 Consejo: el candado indica que la conexión es segura, pero no que el sitio sea oficial. Mirá siempre la dirección completa."
    },
    {
      titulo: "Comprar en línea con seguridad",
      contenido: `<p>Comprar por internet es cómodo, pero conviene tomar precauciones. Usá sitios conocidos, revisá que la dirección empiece con <strong>https</strong> y leé las condiciones de envío y devolución antes de pagar.</p>
<p>Para pagar, elegí tarjeta o medios que permitan reclamo. Guardá el comprobante y el número de pedido. Si el precio es demasiado bajo o el sitio pide transferencias a una cuenta personal, desconfiá.</p>`,
      consejo: "💡 Consejo: si una oferta parece demasiado buena para ser verdad, probablemente no sea verdad. Consultá antes de pagar."
    }
  ],

  /* ==========================================================
     CURSO 3 - TRÁMITES EN LÍNEA
     ========================================================== */

  // Nivel 1 · Descubrir
  "301": [
    {
      titulo: "Turnos: qué son y por qué se usan",
      contenido: `<p>Un <strong>turno</strong> es una cita con día y hora para que te atiendan en un organismo, un banco o un centro de salud. Antes se sacaban por teléfono o en la puerta; hoy muchas veces se piden por internet.</p>
<p>El turno evita esperar horas y ordena la atención. Cuando lo conseguís, anotá la fecha, la hora, la dirección y qué tenés que llevar. Si no podés ir, cancelalo para que otra persona pueda usar ese lugar.</p>`,
      consejo: "💡 Consejo: anotá el turno en el calendario del celular y en un papel. Así lo tenés por dos vías."
    },
    {
      titulo: "Constancias y certificados",
      contenido: `<p>Una <strong>constancia</strong> es un documento que prueba un dato: que trabajás, que cobrás una jubilación, que estás inscripto en un curso. Sirve para presentar en bancos, escuelas u otros organismos.</p>
<p>Muchas constancias se descargan al instante desde el sitio oficial, en formato PDF. Antes de usarla, revisá que tu nombre y tus datos estén bien escritos. Si hay un error, pedí la corrección en el organismo.</p>`,
      consejo: "💡 Consejo: guardá una copia de cada constancia y anotá para qué trámite la usaste."
    },
    {
      titulo: "Trámites de ANSES, AFIP y bancos",
      contenido: `<p>Tres tipos de trámites se hacen mucho por internet: los de <strong>ANSES</strong> (jubilaciones, asignaciones, turnos), los de <strong>AFIP</strong> (clave fiscal, impuestos) y los del <strong>banco</strong> (consultas, transferencias, resúmenes).</p>
<p>Cada organismo tiene su propio sitio oficial y su forma de identificarte. Lo importante es entrar siempre desde el sitio verdadero y no desde un enlace que llegó por mensaje.</p>`,
      consejo: "💡 Consejo: guardá en favoritos los sitios oficiales que usás seguido. Así evitás confusiones."
    },
    {
      titulo: "Plazos y horarios de atención",
      contenido: `<p>Algunos trámites se resuelven al instante y otros demoran días o semanas. En la página del organismo suele figurar el <strong>plazo estimado</strong>. Leelo antes de empezar para saber cuándo esperar una respuesta.</p>
<p>También importa el horario: algunos sistemas funcionan las 24 horas y otros solo en horario de atención. Si el sitio está lento o no responde, probá en otro momento del día.</p>`,
      consejo: "💡 Consejo: no hagas trámites importantes a último momento. Dejá margen por si el sistema falla."
    },
    {
      titulo: "Guardar los comprobantes",
      contenido: `<p>Cuando terminás un trámite, el sistema muestra un <strong>número de trámite</strong> o un comprobante. Ese número es la prueba de que hiciste la gestión y sirve para consultar el estado o reclamar.</p>
<p>Guardalo de tres formas si podés: una captura de pantalla, un PDF descargado y una anotación en papel. También podés enviártelo por correo a vos mismo para tenerlo siempre a mano.</p>`,
      consejo: "💡 Consejo: sin número de trámite es más difícil reclamar. Guardalo antes de cerrar la página."
    },
    {
      titulo: "Cuándo conviene ir en persona",
      contenido: `<p>La mayoría de los trámites se pueden hacer por internet, pero hay casos que requieren presencia: sacar el DNI por primera vez, algunos trámites con firma ológrafa o situaciones que el sistema no resuelve.</p>
<p>Si el sitio te indica que tenés que ir, sacá un turno y llevá la documentación que pide. Si no tenés con quién dejar tus cosas o te da inseguridad ir sola o solo, pedile a alguien de confianza que te acompañe.</p>`,
      consejo: "💡 Consejo: no hay problema en pedir acompañamiento. Ir acompañado es más seguro y más tranquilo."
    }
  ],

  // Nivel 2 · Comprender
  "302": [
    {
      titulo: "CUIL y DNI: no son lo mismo",
      contenido: `<p>El <strong>DNI</strong> es el documento que te identifica como persona: tiene tu foto, tu nombre y tu número. El <strong>CUIL</strong> es un número que sirve para el trabajo y la seguridad social, y suele estar impreso en el DNI o en los recibos de sueldo.</p>
<p>Los dos son personales. El CUIL se puede compartir con un empleador o un organismo, pero no se publica en redes sociales ni se envía a desconocidos.</p>`,
      consejo: "💡 Consejo: tené a mano una foto del DNI en un lugar seguro. Te evita buscarlo cada vez que hacés un trámite."
    },
    {
      titulo: "Qué es una cuenta de usuario",
      contenido: `<p>Una <strong>cuenta de usuario</strong> es tu identificación dentro de un sitio: un correo o un nombre de usuario y una contraseña. Con ella el sistema sabe quién sos y te muestra tus datos y tus trámites.</p>
<p>Cada organismo puede tener su propia cuenta. No uses la misma contraseña en todos y no compartas tus accesos. Si te olvidás la contraseña, usá la opción «Olvidé mi contraseña» del sitio oficial.</p>`,
      consejo: "💡 Consejo: anotá en qué sitios tenés cuenta y con qué correo. Esa lista te ahorra dolores de cabeza."
    },
    {
      titulo: "Verificar tu identidad con una foto del DNI",
      contenido: `<p>Algunos trámites piden una <strong>verificación de identidad</strong>: sacarte una foto con el DNI en la mano o grabar un video corto. Es una medida de seguridad para confirmar que sos quien dice ser.</p>
<p>Hacelo en un lugar con buena luz, sin otras personas en la imagen y con el documento bien visible. Estas fotos son personales: no las compartas por WhatsApp ni las publiques.</p>`,
      consejo: "💡 Consejo: antes de empezar, mirá qué pide exactamente el sitio. Así preparás el DNI y la luz una sola vez."
    },
    {
      titulo: "Un correo seguro para trámites",
      contenido: `<p>Los organismos te escriben al correo que declaraste. Por eso es importante que ese correo sea uno que usás y al que podés entrar, y que tenga una contraseña segura.</p>
<p>Revisá la carpeta de correo no deseado: a veces los avisos oficiales caen ahí. Si cambiaste de correo, actualizá tus datos en el organismo para no perderte notificaciones importantes.</p>`,
      consejo: "💡 Consejo: usá un correo que revises seguido y no lo compartas en redes sociales."
    },
    {
      titulo: "Qué es la firma digital",
      contenido: `<p>La <strong>firma digital</strong> es una forma de firmar documentos por internet con la misma validez que la firma en papel. Se obtiene a través de organismos oficiales y se guarda en el celular o en un dispositivo especial.</p>
<p>Como reemplaza tu firma, es muy importante cuidarla: no se presta ni se comparte. Si creés que alguien la usó sin tu permiso, avisá de inmediato al organismo que te la emitió.</p>`,
      consejo: "💡 Consejo: si un trámite pide firma digital y no sabés cómo usarla, consultá en el organismo antes de intentarlo."
    },
    {
      titulo: "Datos que nunca se comparten",
      contenido: `<p>Hay datos que nunca deben enviarse por mensaje ni dictarse por teléfono: contraseñas, códigos de verificación, números completos de tarjeta, claves bancarias y el código de seguridad de la tarjeta.</p>
<p>Los organismos oficiales no piden esos datos por WhatsApp ni por correo. Si alguien insiste, es una señal de estafa. Cortá la comunicación y verificá por el canal oficial.</p>`,
      consejo: "💡 Consejo: si alguien te apura para dar un dato, respirá y cortá. Ningún trámite serio se resuelve con apuro."
    }
  ],

  // Nivel 3 · Practicar
  "303": [
    {
      titulo: "Completar un formulario paso a paso",
      contenido: `<p>Los formularios se completan de arriba hacia abajo. En cada casilla escribís un dato: nombre, apellido, número de documento, correo. Los campos con un asterisco (*) son obligatorios; los demás se pueden dejar vacíos.</p>
<p>Leé cada pregunta antes de responder y no completes datos que no entiendas. Si el formulario tiene un botón <strong>Siguiente</strong>, significa que hay más pasos. Al final aparece <strong>Enviar</strong> o <strong>Confirmar</strong>.</p>`,
      consejo: "💡 Consejo: no tengas apuro. Completá una casilla por vez y revisá antes de pasar a la siguiente."
    },
    {
      titulo: "Revisar antes de enviar",
      contenido: `<p>Antes de tocar el botón final, leé todo lo que escribiste. Revisá el número de documento, el correo y el teléfono: un error en esos datos puede hacer que el trámite no se procese o que la respuesta llegue a otra persona.</p>
<p>Si el formulario muestra un resumen, comparalo con tus datos. Si encontrás un error, volvé atrás y corregilo. Es normal tener que corregir algo.</p>`,
      consejo: "💡 Consejo: leé el formulario en voz baja antes de enviarlo. Escucharte ayuda a detectar errores."
    },
    {
      titulo: "Guardar un PDF en el celular",
      contenido: `<p>Cuando descargás una constancia, el archivo suele ser un <strong>PDF</strong>. En el celular se guarda en la carpeta <strong>Descargas</strong> y podés abrirlo desde allí o desde la aplicación de archivos.</p>
<p>Para tenerlo a mano, cambiale el nombre con algo claro, como «Constancia ANSES 2026». También podés enviarlo a tu correo o guardarlo en la nube para no perderlo si cambiás de celular.</p>`,
      consejo: "💡 Consejo: poné nombres claros a los archivos. «Documento1» no te dice nada cuando lo necesitás."
    },
    {
      titulo: "Imprimir desde el celular o la computadora",
      contenido: `<p>Si el organismo pide el documento impreso, podés imprimirlo desde una computadora o desde el celular. Buscá el botón <strong>Imprimir</strong> o el dibujo de una impresora y elegí la impresora disponible.</p>
<p>Si no tenés impresora, guardá el PDF en un pendrive y llevalo a un local de impresión. Antes de imprimir, revisá la vista previa para que el texto no quede cortado.</p>`,
      consejo: "💡 Consejo: imprimí una copia de más. Si se pierde o se moja, tenés otra."
    },
    {
      titulo: "Si se corta internet a mitad del trámite",
      contenido: `<p>Si se corta la conexión mientras completás un trámite, no te asustes: en la mayoría de los casos no se envió nada. Volvé a entrar al sitio y fijate si el trámite quedó guardado como borrador.</p>
<p>Si ya habías enviado y no estás seguro, consultá con el número de trámite o con el organismo. No repitas el envío varias veces sin verificar: podés generar duplicados.</p>`,
      consejo: "💡 Consejo: antes de empezar un trámite largo, verificá que el WiFi funcione bien."
    },
    {
      titulo: "Pedir ayuda en el organismo",
      contenido: `<p>Todos los organismos tienen canales de atención: teléfono, correo, chat o atención presencial con turno. Si te trabás en un paso, buscá la sección <strong>Ayuda</strong> o <strong>Contacto</strong> del sitio oficial.</p>
<p>Cuando escribas, contá qué trámite hacías, en qué paso te quedaste y qué mensaje apareció. Esa información ayuda a que te respondan más rápido y mejor.</p>`,
      consejo: "💡 Consejo: anotá el número de gestión o el nombre de quien te atendió. Sirve si tenés que volver a consultar."
    }
  ],

  // Nivel 4 · Dominar y proteger
  "304": [
    {
      titulo: "Reconocer un correo oficial",
      contenido: `<p>Los correos oficiales suelen llegar desde una dirección del dominio del organismo, por ejemplo algo que termina en <em>@anses.gob.ar</em> o <em>@afip.gob.ar</em>. Mirá esa dirección y no solo el nombre que aparece como remitente.</p>
<p>Desconfiá de los correos que piden contraseñas, que amenazan con suspender tu cuenta o que te apuran con un enlace. Los organismos no piden claves por correo.</p>`,
      consejo: "💡 Consejo: si el correo te apura o te asusta, no toques el enlace. Entrá al sitio oficial escribiendo la dirección vos mismo."
    },
    {
      titulo: "Cuidado con gestores que cobran",
      contenido: `<p>Hay empresas privadas que ofrecen «hacer el trámite por vos» y cobran por un servicio que en el organismo es gratuito. Algunas son legítimas, pero otras se quedan con tus datos o te cobran de más.</p>
<p>Antes de pagar, averiguá si el trámite se puede hacer gratis en el sitio oficial. Si decidís usar un gestor, leé las condiciones y no entregues contraseñas ni códigos bancarios.</p>`,
      consejo: "💡 Consejo: casi todos los trámites básicos son gratuitos en el sitio oficial. Verificá antes de pagar."
    },
    {
      titulo: "Trámites gratuitos y trámites pagos",
      contenido: `<p>No todos los trámites son gratuitos. Algunos tienen un costo, como ciertos certificados o legalizaciones, y se pagan en los canales oficiales del organismo. La página del trámite indica si hay que pagar y cuánto.</p>
<p>Si alguien te pide dinero por un trámite que el sitio oficial marca como gratuito, desconfiá. Tampoco pagues por transferencia a una cuenta personal sin comprobante oficial.</p>`,
      consejo: "💡 Consejo: revisá siempre en el sitio oficial si el trámite tiene costo antes de pagar en otro lado."
    },
    {
      titulo: "Cómo hacer un reclamo",
      contenido: `<p>Si un trámite salió mal o no recibiste respuesta, podés hacer un <strong>reclamo</strong>. Reuní la prueba: número de trámite, capturas de pantalla, correos y fechas. Después usá el canal de reclamos del organismo o de la empresa.</p>
<p>Si se trata de un servicio o una compra, también podés consultar en Defensa del Consumidor. Anotá el número de reclamo y los plazos que te informaron.</p>`,
      consejo: "💡 Consejo: guardá todas las pruebas del reclamo en una carpeta. Sin pruebas es más difícil que te den respuesta."
    },
    {
      titulo: "Guardar todo en una carpeta segura",
      contenido: `<p>Con los años se acumulan constancias, turnos y comprobantes. Tenerlos ordenados en una carpeta, ya sea de papel o digital, te ahorra tiempo y evita perder documentos importantes.</p>
<p>Podés separarlos por año o por tema: salud, jubilación, vivienda, banco. En el celular, creá una carpeta con el nombre «Trámites» y guardá ahí los PDF. Si son datos sensibles, protegé el equipo con contraseña.</p>`,
      consejo: "💡 Consejo: una vez por mes, revisá y ordená los papeles y archivos nuevos. Cinco minutos alcanzan."
    },
    {
      titulo: "Actualizar tus datos de contacto",
      contenido: `<p>Si cambiás de teléfono, de correo o de dirección, actualizá esos datos en los organismos y en el banco. Así vas a recibir los avisos importantes y no vas a perder turnos ni notificaciones.</p>
<p>La actualización se hace desde el sitio oficial, ingresando con tu cuenta. Si no podés hacerlo sola o solo, pedí ayuda en el organismo o a una persona de confianza.</p>`,
      consejo: "💡 Consejo: después de cambiar de celular, revisá que puedas recibir los códigos de seguridad de tus cuentas."
    }
  ],

  /* ==========================================================
     CURSO 4 - FRAUDES DIGITALES
     ========================================================== */
  "401": [
    {
      titulo: "El apuro es la primera señal",
      contenido: `<p>Casi todas las estafas tienen algo en común: te apuran. Te dicen que tenés que responder «ahora mismo», que la cuenta se cierra en una hora o que perdés un beneficio si no actuás ya. Ese apuro es intencional: buscan que decidas sin pensar.</p>
<p>Una entidad seria nunca te presiona por teléfono para que hagas una transferencia en el momento. Si sentís que te están corriendo, ese es el motivo exacto para frenar. Cortá, respirá y contale a alguien de confianza.</p>`,
      consejo: "💡 Consejo: ganar cinco minutos nunca te hace perder nada. El apuro siempre es del que llama, no tuyo."
    },
    {
      titulo: "Premios y beneficios que no pediste",
      contenido: `<p>«Usted ganó un premio», «su jubilación tiene un aumento sin cobrar», «tiene un reintegro pendiente». Estos mensajes buscan que entres a un link y dejes tus datos o pagués un supuesto trámite.</p>
<p>Si no participaste de un sorteo, no podés haber ganado. Y ningún organismo paga un beneficio pidiéndote primero una transferencia. Ante la duda, buscá el teléfono oficial del organismo y llamá vos.</p>`,
      consejo: "💡 Consejo: si te piden pagar para cobrar, es una estafa. Los beneficios reales nunca se cobran por adelantado."
    },
    {
      titulo: "El banco nunca te pide la clave",
      contenido: `<p>Ningún banco te va a llamar para pedirte la contraseña de homebanking, el PIN de la tarjeta o el código de seis dígitos que llega por mensaje. Esos datos son solo tuyos y sirven para confirmar que sos vos.</p>
<p>Si alguien dice ser del banco y te pide uno de esos datos, está intentando entrar a tu cuenta. Cortá la llamada y comunicate con el número que figura en el dorso de tu tarjeta.</p>`,
      consejo: "💡 Consejo: el código que llega por SMS es como la llave de tu casa. No se dicta a nadie, ni siquiera a alguien que dice ser del banco."
    },
    {
      titulo: "Números y correos que se disfrazan",
      contenido: `<p>Un estafador puede hacer que el mensaje parezca enviado por Mercado Pago, el banco o un familiar. Puede copiar el nombre, el logo e incluso el número de teléfono. Eso se llama <strong>suplantación de identidad</strong>.</p>
<p>Por eso no alcanza con mirar el nombre del remitente. Desconfiá si el mensaje pide datos, apura, tiene errores de escritura o incluye un link raro. Ante la duda, no respondas y verificá por otro canal.</p>`,
      consejo: "💡 Consejo: los nombres y los logos se copian fácil. Verificá siempre por un canal distinto al que te contactó."
    },
    {
      titulo: "Comprar por internet sin riesgos",
      contenido: `<p>Comprar en línea puede ser seguro si elegís sitios conocidos y pagás con medios que dejen registro. Las transferencias directas a una persona desconocida son las más difíciles de recuperar.</p>
<p>Revisá que la dirección del sitio empiece con <strong>https</strong>, leé las opiniones de otros compradores y guardá el comprobante. Si el precio es muchísimo más bajo que en otros lugares, probablemente sea un engaño.</p>`,
      consejo: "💡 Consejo: si te piden transferir a nombre de otra persona que no coincide con la tienda, no pagues."
    },
    {
      titulo: "Consultar antes de decidir",
      contenido: `<p>La mejor protección contra las estafas no es la tecnología, es hablar. Antes de transferir, de dar un dato o de tocar un link dudoso, contale a una persona de confianza: un familiar, una amiga, alguien del banco.</p>
<p>Los estafadores cuentan con que actúes en soledad y con vergüenza. Consultar rompe ese plan y casi siempre alcanza para ver el engaño a tiempo.</p>`,
      consejo: "💡 Consejo: si te da vergüenza contar que casi caíste, pensá que contarlo puede evitar que le pase a otra persona."
    }
  ],
  "402": [
    {
      titulo: "Cómo consiguen tu número",
      contenido: `<p>Los estafadores consiguen teléfonos y correos de listas filtradas, de sorteos, de formularios en internet o simplemente prueban números al azar. No hace falta que hayas hecho nada mal.</p>
<p>Por eso que te llamen no significa que te conozcan ni que tengan información real sobre vos. Muchas veces saben solo tu nombre y tu número, y con eso arman un relato que parece creíble.</p>`,
      consejo: "💡 Consejo: que el llamante sepa tu nombre no lo hace confiable. Esos datos circulan en listas."
    },
    {
      titulo: "Qué es la ingeniería social",
      contenido: `<p>La <strong>ingeniería social</strong> es el arte de convencerte de hacer algo sin usar la fuerza. El estafador no hackea tu celular: te convence de que le des la clave, de que transfieras o de que instales un programa.</p>
<p>Funciona porque imita situaciones reales: un problema con la tarjeta, un paquete demorado, un familiar en apuros. No apunta a tu conocimiento técnico, apunta a tu confianza y a tus emociones.</p>`,
      consejo: "💡 Consejo: cuando un mensaje te asusta o te emociona mucho, esperá antes de actuar. Ahí es donde suelen atacar."
    },
    {
      titulo: "Por qué un link puede ser falso",
      contenido: `<p>Un link es una dirección que te lleva a un sitio. El problema es que el texto que ves puede no coincidir con el sitio real: puede decir «banco» y llevar a una página copiada que solo se ve igual.</p>
<p>Fijate en la dirección completa antes de entrar. Si tiene letras de más, guiones raros o un final distinto al habitual, es una imitación. Cuando entrás a una página falsa, todo lo que escribís queda en manos de quien la creó.</p>`,
      consejo: "💡 Consejo: en lugar de tocar el link, abrí vos el sitio escribiéndolo en el navegador."
    },
    {
      titulo: "Los códigos de seguridad por SMS",
      contenido: `<p>Muchas cuentas confirman tu identidad con un código que llega por mensaje de texto. Ese código vence en pocos minutos y sirve una sola vez. Es la última barrera entre un estafador y tu cuenta.</p>
<p>Si alguien te pide ese código, aunque diga ser del banco, de una tienda o de un familiar, está intentando entrar. No lo compartas nunca y no lo reenvíes.</p>`,
      consejo: "💡 Consejo: si recibís un código que no pediste, alguien está intentando entrar a tu cuenta. Cambiá la contraseña."
    },
    {
      titulo: "Los perfiles falsos",
      contenido: `<p>En redes sociales y aplicaciones de mensajes existen cuentas creadas con fotos y nombres robados. Pueden hacerse pasar por un familiar, un vecino o una empresa para pedirte dinero o datos.</p>
<p>Antes de responder a un supuesto familiar que pide plata, llamalo por teléfono al número que ya tenés guardado. No uses el número nuevo que te dio por mensaje.</p>`,
      consejo: "💡 Consejo: si un familiar te escribe desde un número nuevo pidiendo dinero, llamalo al número de siempre antes de hacer nada."
    },
    {
      titulo: "Por qué caen personas capacitadas",
      contenido: `<p>Caer en una estafa no significa ser ingenuo. Los mensajes están escritos por personas que estudian cómo reaccionamos: usan el miedo, la urgencia y la confianza. Muchos profesionales también caen.</p>
<p>Lo importante no es no equivocarse nunca, sino detectar rápido y pedir ayuda. La vergüenza es el mejor aliado del estafador, porque impide que cuentes lo que pasó.</p>`,
      consejo: "💡 Consejo: contar rápido lo que pasó puede salvar tu dinero. Nunca es tarde para avisar al banco."
    }
  ],
  "403": [
    {
      titulo: "Revisar el remitente con calma",
      contenido: `<p>Antes de responder un mensaje, mirá quién lo envía: el número completo, la dirección de correo entera, no solo el nombre que muestra. En el correo, tocá el remitente para ver la dirección real.</p>
<p>Si la dirección tiene letras cambiadas, números agregados o un dominio extraño, no es de quien dice ser. Ante la duda, no respondas y verificá por otro canal.</p>`,
      consejo: "💡 Consejo: en el correo, abrí los detalles del remitente. Casi siempre la dirección real delata la estafa."
    },
    {
      titulo: "Mirar el link antes de tocarlo",
      contenido: `<p>En el celular, mantené apretado el link unos segundos sin soltar: aparece una vista previa con la dirección real. En la computadora, pasá el mouse por encima y mirá abajo a la izquierda de la pantalla.</p>
<p>Si la dirección no coincide con el sitio oficial, no lo abras. Es mejor escribir la dirección a mano en el navegador que tocar un link dudoso.</p>`,
      consejo: "💡 Consejo: si el link no se puede previsualizar, escribí la dirección oficial a mano y entrá desde ahí."
    },
    {
      titulo: "Cortar y llamar por otro canal",
      contenido: `<p>Si te llaman diciendo ser del banco, cortá y llamá vos al número del dorso de tu tarjeta. Si te escriben diciendo ser un familiar, llamalo a su número de siempre. Nunca uses el contacto que te dio el mensaje.</p>
<p>Ese cambio de canal es la prueba más simple y más efectiva: el estafador no puede atender el teléfono oficial ni la línea de tu familiar.</p>`,
      consejo: "💡 Consejo: cortá siempre. Una llamada tuya al número oficial resuelve la duda en dos minutos."
    },
    {
      titulo: "Guardar pruebas de lo que pasó",
      contenido: `<p>Si recibiste un mensaje sospechoso, sacá una captura de pantalla antes de borrarlo. Guardá el número, la fecha y la hora. Esa información sirve para denunciar y para que el banco investigue.</p>
<p>No reenvíes el mensaje a otras personas para preguntar: podés exponerlas. Mostrales la captura en persona o por una vía segura.</p>`,
      consejo: "💡 Consejo: la captura de pantalla es una prueba válida. Guardala en una carpeta aparte."
    },
    {
      titulo: "Bloquear y denunciar desde el celular",
      contenido: `<p>En WhatsApp, tocá el contacto, elegí «Bloquear» y después «Denunciar». En el correo, marcá el mensaje como spam o phishing. En las llamadas, usá la opción de bloquear número.</p>
<p>Bloquear no borra lo que pasó, pero evita que te vuelvan a contactar desde ese número. Si la estafa ya ocurrió, además hay que avisar al banco y hacer la denuncia.</p>`,
      consejo: "💡 Consejo: bloquear y denunciar lleva diez segundos y ayuda a que la aplicación detecte más casos."
    },
    {
      titulo: "Avisar al banco y cambiar claves",
      contenido: `<p>Si diste una clave, hiciste una transferencia o instalaste algo sospechoso, llamá al banco inmediatamente y pedí que bloqueen las operaciones. Cuanto antes avises, más posibilidades hay de frenar el movimiento.</p>
<p>Después cambiá la contraseña del homebanking, de la tarjeta y del correo. Si usabas la misma clave en otros sitios, cambiala también en esos lugares.</p>`,
      consejo: "💡 Consejo: el banco tiene un número de urgencias las 24 horas. Tenelo anotado a mano, no solo en el celular."
    }
  ],
  "404": [
    {
      titulo: "Cómo hacer la denuncia",
      contenido: `<p>Si fuiste víctima de una estafa, podés denunciar en la comisaría o en la fiscalía de tu zona. Llevá las capturas, el número de teléfono, los comprobantes de transferencia y cualquier dato que tengas.</p>
<p>También podés denunciar ante el banco y, si el hecho ocurrió en internet, en la unidad de delitos informáticos de tu jurisdicción. La denuncia deja registro y es el primer paso para recuperar el dinero.</p>`,
      consejo: "💡 Consejo: no borres nada antes de denunciar. Los mensajes y comprobantes son la prueba."
    },
    {
      titulo: "Recuperar una cuenta tomada",
      contenido: `<p>Si alguien entró a tu cuenta de correo o de mensajes, lo primero es cambiar la contraseña desde otro dispositivo y activar la verificación en dos pasos. Después revisá las sesiones abiertas y cerrá las que no reconozcas.</p>
<p>Avisá a tus contactos que te están usando para estafar, así no caen en los mensajes que salen a tu nombre. Si no podés recuperar la cuenta, contactá al soporte oficial del servicio.</p>`,
      consejo: "💡 Consejo: al recuperar la cuenta, revisá la dirección de respaldo y el teléfono asociado. El estafador pudo haberlos cambiado."
    },
    {
      titulo: "Ayudar a alguien que fue estafado",
      contenido: `<p>Si un familiar o un vecino cayó en una estafa, lo primero es no juzgarlo. La vergüenza hace que muchas personas no cuenten lo que pasó hasta que es tarde.</p>
<p>Ayudalo a llamar al banco, a guardar las pruebas y a hacer la denuncia. Explicá con calma qué pasó y qué se puede hacer, sin decir «te lo advertí».</p>`,
      consejo: "💡 Consejo: acompañar a hacer la denuncia vale más que cualquier reto. La persona ya sabe que se equivocó."
    },
    {
      titulo: "Proteger a la familia",
      contenido: `<p>Los estafadores suelen atacar a las personas mayores porque creen que están solas o que manejan menos la tecnología. Hablar del tema en familia es una defensa concreta.</p>
<p>Acordá una palabra clave con tus hijos o nietos para confirmar identidad por teléfono. Y definan juntos a quién llamar antes de hacer una transferencia importante.</p>`,
      consejo: "💡 Consejo: una palabra clave familiar simple, que nadie pueda adivinar, sirve para confirmar que quien llama es quien dice ser."
    },
    {
      titulo: "Revisar los permisos de las aplicaciones",
      contenido: `<p>Cada aplicación pide permisos: cámara, micrófono, contactos, ubicación. Algunas realmente los necesitan; otras piden más de la cuenta. Revisalos de vez en cuando y quitá los que no tengan sentido.</p>
<p>Una linterna no necesita tus contactos. Una aplicación de banco no necesita acceso a tus mensajes. Si una app pide algo que no tiene relación con su función, desconfiá.</p>`,
      consejo: "💡 Consejo: revisá los permisos una vez por mes desde la configuración del celular."
    },
    {
      titulo: "Mantener el celular actualizado",
      contenido: `<p>Las actualizaciones del sistema y de las aplicaciones corrigen fallas de seguridad. Aunque a veces tardan y ocupan espacio, conviene instalarlas cuando el celular está cargado y conectado al WiFi.</p>
<p>También activá el bloqueo automático de pantalla y el borrado de datos tras varios intentos fallidos. Son protecciones simples que funcionan si te roban el equipo.</p>`,
      consejo: "💡 Consejo: dejá el celular cargando de noche con el WiFi encendido para que se actualice solo."
    }
  ],

  /* ==========================================================
     CURSO 5 - COMUNICACIÓN DIGITAL
     ========================================================== */
  "501": [
    {
      titulo: "Qué es una videollamada",
      contenido: `<p>Una <strong>videollamada</strong> es una llamada donde además de escucharte, te ven. Se hace con aplicaciones como WhatsApp, Meet o Zoom, usando la cámara y el micrófono del celular o de la computadora.</p>
<p>Sirve para hablar con familiares lejos, hacer consultas médicas o participar de reuniones. No es necesario saber nada técnico: se contesta igual que una llamada común.</p>`,
      consejo: "💡 Consejo: si es tu primera videollamada, probala con alguien de confianza unos minutos antes."
    },
    {
      titulo: "Preparar la luz y el sonido",
      contenido: `<p>Para que te vean bien, ponete de frente a una ventana o a una lámpara. La luz tiene que dar en tu cara, no en tu espalda. Si la luz viene de atrás, tu imagen se ve oscura.</p>
<p>Para el sonido, usá auriculares si hay ruido ambiente. Probá hablar a una distancia normal del aparato y avisá si no te escuchan bien.</p>`,
      consejo: "💡 Consejo: antes de una videollamada importante, hacé una prueba de cámara y micrófono con la misma aplicación."
    },
    {
      titulo: "Avisar antes de llamar",
      contenido: `<p>Una videollamada sin aviso puede encontrar a la otra persona desprevenida, ocupada o sin estar presentable. Un mensaje corto como «¿podemos hablar por video a las 6?» evita incomodidades.</p>
<p>También es bueno avisar cuánto tiempo vas a necesitar. Así la otra persona organiza su día y la conversación fluye mejor.</p>`,
      consejo: "💡 Consejo: acordar un horario también ayuda a que la conexión sea mejor, porque no hay otras personas usando internet."
    },
    {
      titulo: "Cómo se termina una videollamada",
      contenido: `<p>Para cortar, buscá el botón rojo con el dibujo de un teléfono. Está casi siempre abajo en el centro o en una esquina. Tocarlo una vez cierra la llamada.</p>
<p>Si no encontrás el botón, mové el mouse en la computadora o tocá la pantalla en el celular: los controles aparecen y desaparecen solos para no tapar la imagen.</p>`,
      consejo: "💡 Consejo: el botón rojo de colgar es igual en casi todas las aplicaciones. Buscalo siempre abajo."
    },
    {
      titulo: "Hablar por altavoz",
      contenido: `<p>El <strong>altavoz</strong> hace que la voz salga por el parlante grande, como si fuera una radio. Sirve para escuchar mejor o para que varias personas participen de la misma llamada.</p>
<p>Cuando usás altavoz, el micrófono capta más ruido. Si la otra persona se queja de eco, bajá el volumen o volvé al modo normal.</p>`,
      consejo: "💡 Consejo: en una videollamada grupal, silenciá tu micrófono cuando no estés hablando."
    },
    {
      titulo: "Llamar a un número desconocido",
      contenido: `<p>Si necesitás llamar a un número que no tenés guardado, escribilo en la aplicación de teléfono y tocá el botón verde. Anotá el número en un papel antes, por si te equivocás.</p>
<p>Si te contestan y no es quien esperabas, pedí disculpas y cortá con tranquilidad. Equivocarse de número es algo que le pasa a todo el mundo y no tiene consecuencias.</p>`,
      consejo: "💡 Consejo: guardá los números importantes con nombre en la agenda. Así los reconocés cuando te llaman."
    }
  ],
  "502": [
    {
      titulo: "Cómo viaja un mensaje",
      contenido: `<p>Cuando mandás un mensaje, este viaja por internet hasta un servidor y desde ahí al celular de la otra persona. Si esa persona no tiene conexión en ese momento, el mensaje queda guardado y le llega cuando se conecta.</p>
<p>Por eso a veces el mensaje aparece con una sola tilde durante un rato. No está perdido: está esperando que el otro equipo lo reciba.</p>`,
      consejo: "💡 Consejo: si un mensaje no llega, revisá tu conexión antes de reenviarlo muchas veces."
    },
    {
      titulo: "Qué es un grupo",
      contenido: `<p>Un <strong>grupo</strong> es una conversación con varias personas. Todo lo que escribís lo ven todos los integrantes, no solo una persona.</p>
<p>En los grupos conviene ser breve y no mandar mensajes uno detrás de otro. Si necesitás hablar de algo privado, abrí una conversación individual.</p>`,
      consejo: "💡 Consejo: antes de escribir en un grupo, pensá si ese comentario lo puede leer cualquiera de los integrantes."
    },
    {
      titulo: "Las tildes y la hora",
      contenido: `<p>En WhatsApp, una tilde gris significa que el mensaje salió de tu celular; dos tildes grises, que llegó al celular del otro; dos tildes azules, que la persona lo leyó.</p>
<p>La hora que aparece al lado es la de tu celular. Si no coincide con la de la otra persona, puede ser que alguno tenga la hora mal configurada.</p>`,
      consejo: "💡 Consejo: que no haya tilde azul no significa que te ignoren. La persona puede tener las notificaciones silenciadas."
    },
    {
      titulo: "Dónde se guardan fotos y videos",
      contenido: `<p>Las fotos que te mandan por WhatsApp, en general, no se guardan solas en la galería. Quedan dentro de la conversación, ocupando espacio, hasta que las guardás o las borrás.</p>
<p>Para guardar una foto, mantenela apretada y elegí «Guardar» o el icono de descarga. Después la vas a encontrar en la galería, dentro de una carpeta con el nombre de la aplicación.</p>`,
      consejo: "💡 Consejo: borrar fotos viejas de las conversaciones libera espacio y hace que el celular funcione más rápido."
    },
    {
      titulo: "Mensajes que desaparecen",
      contenido: `<p>Algunas aplicaciones permiten enviar mensajes que se borran solos después de un tiempo, o fotos que se pueden ver una sola vez. Sirven para información pasajera, como una dirección o un dato bancario.</p>
<p>Pero ojo: la otra persona puede sacar una captura de pantalla antes de que desaparezca. No uses estos mensajes para algo que no quieras que quede registrado.</p>`,
      consejo: "💡 Consejo: si no querés que algo quede guardado, lo mejor es no mandarlo."
    },
    {
      titulo: "Respaldo de las conversaciones",
      contenido: `<p>Si cambiás de celular o se te rompe, podés perder las conversaciones. El <strong>respaldo</strong> guarda una copia en la nube o en la memoria del equipo para recuperarlas después.</p>
<p>Se activa desde la configuración de la aplicación, en la opción «Copias de seguridad». Conviene hacerlo con WiFi y con el celular enchufado, porque puede tardar.</p>`,
      consejo: "💡 Consejo: revisá que el respaldo esté activado antes de cambiar de celular, no después."
    }
  ],
  "503": [
    {
      titulo: "Mandar un mensaje de voz",
      contenido: `<p>Un mensaje de voz es más rápido que escribir y conserva el tono de tu voz. Para grabarlo, mantené apretado el botón del micrófono, hablá y soltá al terminar. Si te equivocaste, deslizá el dedo hacia un costado antes de soltar para cancelar.</p>
<p>Antes de grabar, pensá qué vas a decir. Un mensaje de 30 segundos se escucha mejor que uno de cinco minutos.</p>`,
      consejo: "💡 Consejo: si el mensaje es largo, dividilo en dos o tres partes cortas. Es más fácil de escuchar."
    },
    {
      titulo: "Compartir una foto",
      contenido: `<p>Para compartir una foto, abrí la conversación, tocá el clip o el icono de cámara y elegí «Galería». Seleccioná la imagen y confirmá el envío.</p>
<p>Antes de mandarla, revisá qué se ve en el fondo: papeles, documentos, personas que no dieron permiso. Es fácil pasar por alto un detalle.</p>`,
      consejo: "💡 Consejo: si la foto tiene datos sensibles, tapalos con el dedo en una captura antes de enviarla."
    },
    {
      titulo: "Compartir un documento",
      contenido: `<p>También podés enviar un archivo, como un PDF o una foto de una receta. Usá el clip y elegí «Documento». Así el archivo llega completo y con su nombre original.</p>
<p>Si es un documento importante, avisá por mensaje de qué se trata, para que la otra persona sepa qué abrir. Y confirmá que llegó bien.</p>`,
      consejo: "💡 Consejo: mandá documentos sensibles solo a personas conocidas y verificá que el destinatario sea el correcto."
    },
    {
      titulo: "Compartir tu ubicación",
      contenido: `<p>Puedés enviar tu ubicación para que te encuentren, por ejemplo si estás esperando a alguien en un lugar grande. Usá el clip y elegí «Ubicación».</p>
<p>La ubicación muestra un mapa con un punto. Conviene mandarla solo a personas de confianza y por tiempo limitado, y no publicarla en grupos abiertos.</p>`,
      consejo: "💡 Consejo: compartí la ubicación solo mientras la necesitás. No la dejes activa todo el día."
    },
    {
      titulo: "Responder a un mensaje anterior",
      contenido: `<p>Si en un grupo hay muchos mensajes, podés responder a uno en particular. Mantené apretado ese mensaje y elegí «Responder». Así queda claro a qué te referís.</p>
<p>Para buscar algo viejo, usá la lupa de la conversación y escribí una palabra. La aplicación te muestra los mensajes que la contienen.</p>`,
      consejo: "💡 Consejo: responder citando el mensaje evita confusiones en los grupos con mucha actividad."
    },
    {
      titulo: "Silenciar un grupo",
      contenido: `<p>Si un grupo manda demasiadas notificaciones, podés silenciarlo por 8 horas, una semana o siempre. Los mensajes siguen llegando, pero el celular no suena.</p>
<p>Se hace manteniendo apretado el nombre del grupo y eligiendo «Silenciar notificaciones». Podés volver a activarlas cuando quieras.</p>`,
      consejo: "💡 Consejo: silenciar no es lo mismo que salir del grupo. Podés seguir leyendo cuando quieras."
    }
  ],
  "504": [
    {
      titulo: "Cadenas y noticias falsas",
      contenido: `<p>Las cadenas son mensajes que piden reenviar a diez contactos para «evitar una tragedia» o «ganar un premio». Casi siempre son falsos y muchas veces incluyen links peligrosos.</p>
<p>Las noticias falsas buscan generar miedo o enojo para que las compartas sin verificar. Antes de reenviar, preguntate quién lo dice y si aparece en algún medio conocido.</p>`,
      consejo: "💡 Consejo: si un mensaje te pide reenviarlo a mucha gente para que «se cumpla» algo, no lo hagas."
    },
    {
      titulo: "Verificar antes de reenviar",
      contenido: `<p>Para verificar una noticia, buscá el título en internet y mirá si aparece en más de un medio confiable. Si solo está en un mensaje reenviado, probablemente no sea verdad.</p>
<p>También podés consultar sitios de verificación de noticias. Reenviar algo falso, aunque sea sin mala intención, daña la confianza de quienes te leen.</p>`,
      consejo: "💡 Consejo: antes de reenviar, esperá un minuto y buscá la noticia. Un minuto evita un error."
    },
    {
      titulo: "Privacidad en los grupos",
      contenido: `<p>En un grupo no sabés quién está ni quién leyó tu mensaje. Algo que contás en confianza puede salir de ahí sin que te des cuenta.</p>
<p>Evitá compartir datos de salud, números de tarjeta o contraseñas en grupos. Para temas personales, usá una conversación individual.</p>`,
      consejo: "💡 Consejo: lo que se manda a un grupo deja de ser privado en el momento en que se envía."
    },
    {
      titulo: "Horarios y tiempos de respuesta",
      contenido: `<p>Los mensajes no tienen horario, pero las personas sí. Contestar de madrugada o esperar respuesta inmediata a cualquier hora puede generar incomodidad.</p>
<p>Acordá con tu familia un horario razonable para escribir. Y recordá que no responder enseguida no es una falta de respeto: cada uno tiene sus tiempos.</p>`,
      consejo: "💡 Consejo: si escribís de noche, no te preocupes si no contestan. Lo van a leer al otro día."
    },
    {
      titulo: "Cuidar los datos de otras personas",
      contenido: `<p>Así como cuidás tus datos, cuidá los de los demás. No compartas el teléfono, la dirección o fotos de otra persona sin su permiso, aunque sea en un grupo familiar.</p>
<p>Si alguien te manda una foto de otra persona y te pide reenviarla, pensá primero. La privacidad de los demás también depende de vos.</p>`,
      consejo: "💡 Consejo: antes de compartir una foto donde aparece otra persona, preguntale si está de acuerdo."
    },
    {
      titulo: "Bloquear y reportar contactos",
      contenido: `<p>Si alguien te molesta, te insulta o te manda contenido que no querés, podés bloquearlo. Ya no vas a recibir sus mensajes ni llamadas, y la otra persona no va a saber que la bloqueaste.</p>
<p>Si el contenido es grave, usá «Reportar» además de bloquear. Así la aplicación revisa la cuenta y puede sancionarla.</p>`,
      consejo: "💡 Consejo: bloquear no es una descortesía. Es cuidar tu tranquilidad y tu tiempo."
    }
  ]
};
