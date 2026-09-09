/* ============================================
   TAMI - main.js
   PMV V1.0 - Lógica interactiva con conexión API
   Manejo de vistas, validaciones, API REST,
   LocalStorage como caché/fallback y renderizado.
   ============================================ */

"use strict";

// ============================================
// CONSTANTES Y CLAVES
// ============================================

const API_URL = "http://localhost:3000/api";
const CLAVE_SESION = "tami:sesion";
const CLAVE_USUARIOS_CACHE = "tami:usuariosCache";
const CLAVE_TEST_CACHE = "tami:testCache";
const CLAVE_EXAMEN_CACHE = "tami:examenCache";
const CLAVE_ALERTAS_CACHE = "tami:alertasCache";

// Mapa de navegacion: pantalla -> breadcrumb
// Cada entrada define la ruta completa desde Inicio hasta la pantalla actual.
// Los niveles previos son clickeables; el ultimo es texto plano.
const MAPA_NAVEGACION = {
  "pantalla-inicio": [{ etiqueta: "Inicio", pantalla: null }],
  "pantalla-registro": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Registro", pantalla: null }
  ],
  "pantalla-login": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Ingresar", pantalla: null }
  ],
  "pantalla-test": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Test de nivelacion", pantalla: null }
  ],
  "pantalla-dashboard": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Mi entorno seguro", pantalla: null }
  ],
  "pantalla-campus": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Mi entorno seguro", pantalla: "pantalla-dashboard" },
    { etiqueta: "Campus Educativo", pantalla: null }
  ],
  "pantalla-leccion": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Mi entorno seguro", pantalla: "pantalla-dashboard" },
    { etiqueta: "Campus Educativo", pantalla: "pantalla-campus" },
    { etiqueta: "Modulo 4: Fraudes", pantalla: null }
  ],
  "pantalla-escudo": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Mi entorno seguro", pantalla: "pantalla-dashboard" },
    { etiqueta: "Escudo de Seguridad", pantalla: null }
  ],
  "pantalla-progreso": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Mi entorno seguro", pantalla: "pantalla-dashboard" },
    { etiqueta: "Mi Progreso", pantalla: null }
  ],
  "pantalla-examen": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Mi entorno seguro", pantalla: "pantalla-dashboard" },
    { etiqueta: "Campus Educativo", pantalla: "pantalla-campus" },
    { etiqueta: "Examen rapido", pantalla: null }
  ]
};

// ============================================
// UTILIDADES DE LOCALSTORAGE (CACHÉ/FALLBACK)
// ============================================

function leerLocal(clave, valorPorDefecto) {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? JSON.parse(crudo) : valorPorDefecto;
  } catch (error) {
    console.error("Error al leer LocalStorage:", error);
    return valorPorDefecto;
  }
}

function guardarLocal(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.error("Error al guardar en LocalStorage:", error);
  }
}

// ============================================
// CAPA DE COMUNICACIÓN CON LA API
// Cada función intenta hablar con el servidor y,
// si falla, usa LocalStorage como fallback.
// ============================================

async function apiGet(recurso) {
  try {
    const respuesta = await fetch(API_URL + "/" + recurso, {
      headers: { "Content-Type": "application/json" }
    });
    if (!respuesta.ok) {
      throw new Error("Error HTTP " + respuesta.status);
    }
    const datos = await respuesta.json();
    return { exito: true, datos: datos };
  } catch (error) {
    console.error("API GET falló (" + recurso + "):", error.message);
    return { exito: false, datos: null, error: error.message };
  }
}

async function apiPost(recurso, cuerpo) {
  try {
    const respuesta = await fetch(API_URL + "/" + recurso, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo)
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
      return { exito: false, datos: datos, error: datos.error || "Error HTTP " + respuesta.status };
    }
    return { exito: true, datos: datos };
  } catch (error) {
    console.error("API POST falló (" + recurso + "):", error.message);
    return { exito: false, datos: null, error: error.message };
  }
}

// ============================================
// NAVEGACIÓN ENTRE PANTALLAS (SPA)
// ============================================

function mostrarPantalla(idPantalla) {
  const todasLasPantallas = document.querySelectorAll(".pantalla");
  todasLasPantallas.forEach(function (pantalla) {
    pantalla.hidden = true;
  });

  const pantallaObjetivo = document.getElementById(idPantalla);
  if (pantallaObjetivo) {
    pantallaObjetivo.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Actualiza las migas de pan segun la pantalla visible
  actualizarBreadcrumb(idPantalla);

  // Avisa a los lectores de pantalla que cambio la vista
  const tituloPantalla = pantallaObjetivo
    ? pantallaObjetivo.querySelector("h1, h2, h3")
    : null;
  if (tituloPantalla) {
    tituloPantalla.setAttribute("tabindex", "-1");
    tituloPantalla.focus({ preventScroll: true });
  }
}

// ============================================
// BREADCRUMBS (MIGAS DE PAN)
// Regla de usabilidad: los niveles previos son
// enlaces interactivos y el actual es texto plano
// ============================================

function actualizarBreadcrumb(idPantalla) {
  const barra = document.getElementById("breadcrumb-bar");
  const lista = document.getElementById("breadcrumb-lista");
  if (!barra || !lista) return;

  const ruta = MAPA_NAVEGACION[idPantalla];
  if (!ruta || ruta.length <= 1) {
    barra.hidden = true;
    lista.innerHTML = "";
    return;
  }

  barra.hidden = false;
  lista.innerHTML = "";

  ruta.forEach(function (item, indice) {
    const esUltimo = indice === ruta.length - 1;
    const elementoLista = document.createElement("li");
    elementoLista.className = "breadcrumb__item";
    elementoLista.setAttribute("itemprop", "itemListElement");
    elementoLista.setAttribute("itemscope", "");
    elementoLista.setAttribute("itemtype", "https://schema.org/ListItem");

    if (esUltimo) {
      // Pagina actual: texto plano NO interactivo
      const actual = document.createElement("span");
      actual.className = "breadcrumb__actual";
      actual.setAttribute("aria-current", "page");
      actual.textContent = item.etiqueta;
      elementoLista.appendChild(actual);
    } else if (item.pantalla) {
      // Nivel previo: enlace interactivo
      const enlace = document.createElement("button");
      enlace.className = "breadcrumb__link";
      enlace.type = "button";
      enlace.textContent = item.etiqueta;
      enlace.addEventListener("click", function () {
        // No se permite volver al inicio si hay sesion activa:
        // redirige al dashboard en lugar de cerrar la sesion.
        if (item.pantalla === "pantalla-inicio" && obtenerSesion()) {
          mostrarDashboard(obtenerSesion());
          return;
        }
        mostrarPantalla(item.pantalla);
      });
      elementoLista.appendChild(enlace);
    } else {
      const texto = document.createElement("span");
      texto.textContent = item.etiqueta;
      elementoLista.appendChild(texto);
    }

    // Separador ">" entre niveles
    if (!esUltimo) {
      const separador = document.createElement("span");
      separador.className = "breadcrumb__separador";
      separador.setAttribute("aria-hidden", "true");
      separador.textContent = " > ";
      lista.appendChild(elementoLista);
      lista.appendChild(separador);
    } else {
      lista.appendChild(elementoLista);
    }
  });
}

// ============================================
// SISTEMA DE MENSAJES GLOBALES
// ============================================

function mostrarMensaje(texto, duracionMs) {
  const zonaMensajes = document.getElementById("zona-mensajes");
  const textoMensaje = document.getElementById("texto-mensaje");
  if (!zonaMensajes || !textoMensaje) return;

  textoMensaje.textContent = texto;
  zonaMensajes.hidden = false;

  if (duracionMs) {
    setTimeout(function () {
      zonaMensajes.hidden = true;
    }, duracionMs);
  }
}

function ocultarMensaje() {
  const zonaMensajes = document.getElementById("zona-mensajes");
  if (zonaMensajes) {
    zonaMensajes.hidden = true;
  }
}

// ============================================
// VALIDACIONES DE FORMULARIO
// ============================================

function validarNombre(nombre) {
  const nombreLimpio = nombre.trim();
  if (nombreLimpio.length === 0) {
    return "Por favor, ingresá tu nombre.";
  }
  if (nombreLimpio.length < 2) {
    return "El nombre debe tener al menos 2 caracteres.";
  }
  return null;
}

function validarEmail(email) {
  const emailLimpio = email.trim();
  if (emailLimpio.length === 0) {
    return "Por favor, ingresá tu correo electrónico.";
  }
  const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patronEmail.test(emailLimpio)) {
    return "El correo electrónico no es válido. Usá el formato correo@dominio.com";
  }
  return null;
}

function validarPassword(password) {
  if (password.length === 0) {
    return "Por favor, ingresá una contraseña.";
  }
  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  return null;
}

function mostrarError(idSpan, mensaje) {
  const span = document.getElementById(idSpan);
  if (span) {
    span.textContent = mensaje;
    span.hidden = false;
  }
}

function ocultarTodosLosErrores() {
  const todosLosErrores = document.querySelectorAll(".campo__error");
  todosLosErrores.forEach(function (error) {
    error.hidden = true;
    error.textContent = "";
  });
}

// ============================================
// GESTIÓN DE SESIÓN
// ============================================

function guardarSesion(usuario) {
  guardarLocal(CLAVE_SESION, {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    nivelDigital: usuario.nivel_digital
  });
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  ocultarMensaje();
  document.getElementById("btn-cerrar-sesion").hidden = true;
  mostrarPantalla("pantalla-inicio");
}

function obtenerSesion() {
  return leerLocal(CLAVE_SESION, null);
}

// ============================================
// AUTENTICACIÓN: REGISTRAR + LOGIN
// ============================================

async function registrarUsuario(nombre, email, password) {
  // Intenta registrar en la API
  const resultado = await apiPost("usuarios/registrar", {
    nombre: nombre,
    email: email,
    password: password
  });

  if (resultado.exito) {
    guardarSesion(resultado.datos);
    return { exito: true, usuario: resultado.datos };
  }

  // Si la API no está disponible, usa localStorage como fallback
  if (resultado.error && resultado.error.includes("Failed to fetch")) {
    console.warn("API no disponible, usando localStorage como fallback");
    return registrarUsuarioFallback(nombre, email, password);
  }

  return { exito: false, mensaje: resultado.datos ? resultado.datos.error : "Error al registrar" };
}

function registrarUsuarioFallback(nombre, email, password) {
  const usuarios = leerLocal(CLAVE_USUARIOS_CACHE, []);
  const emailNormalizado = email.trim().toLowerCase();

  const existente = usuarios.find(function (u) {
    return u.email === emailNormalizado;
  });
  if (existente) {
    return { exito: false, mensaje: "Este correo ya está registrado." };
  }

  const nuevoUsuario = {
    id: Date.now(),
    nombre: nombre.trim(),
    email: emailNormalizado,
    nivel_digital: "principiante",
    creado_en: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);
  guardarLocal(CLAVE_USUARIOS_CACHE, usuarios);
  guardarSesion(nuevoUsuario);

  return { exito: true, usuario: nuevoUsuario };
}

async function iniciarSesion(email, password) {
  const resultado = await apiPost("usuarios/login", {
    email: email,
    password: password
  });

  if (resultado.exito) {
    guardarSesion(resultado.datos);
    return { exito: true, usuario: resultado.datos };
  }

  // Fallback a localStorage
  if (resultado.error && resultado.error.includes("Failed to fetch")) {
    console.warn("API no disponible, usando localStorage como fallback");
    return iniciarSesionFallback(email, password);
  }

  return { exito: false, mensaje: resultado.datos ? resultado.datos.error : "Error al iniciar sesión" };
}

function iniciarSesionFallback(email, password) {
  const usuarios = leerLocal(CLAVE_USUARIOS_CACHE, []);
  const usuario = usuarios.find(function (u) {
    return u.email === email.trim().toLowerCase();
  });

  if (!usuario) {
    return { exito: false, mensaje: "No se encontró una cuenta con ese correo." };
  }

  guardarSesion(usuario);
  return { exito: true, usuario: usuario };
}

// ============================================
// TEST DE NIVELACIÓN
// ============================================

const preguntasTestInicial = [
  {
    texto: "¿Sabés qué es un mensaje de phishing?",
    opciones: [
      { texto: "Sí, sé qué es", valor: "si" },
      { texto: "He escuchado pero no estoy seguro/a", valor: "medio" },
      { texto: "No, no sé qué es", valor: "no" }
    ]
  },
  {
    texto: "Si recibís un mensaje pidiéndote tus datos bancarios, ¿qué harías?",
    opciones: [
      { texto: "Los enviaría si parece importante", valor: "riesgo" },
      { texto: "Dudaría pero probablemente los enviaría", valor: "medio" },
      { texto: "No los enviaría, desconfiaría", valor: "seguro" }
    ]
  },
  {
    texto: "¿Conocés la diferencia entre un correo real y uno falso?",
    opciones: [
      { texto: "Sí, siempre lo distingo", valor: "si" },
      { texto: "A veces lo noto, a veces no", valor: "medio" },
      { texto: "No, me cuesta distinguirlos", valor: "no" }
    ]
  }
];

function calcularNivel(respuestas) {
  let puntaje = 0;
  respuestas.forEach(function (respuesta) {
    if (respuesta === "si" || respuesta === "seguro") {
      puntaje += 2;
    } else if (respuesta === "medio") {
      puntaje += 1;
    }
  });

  return puntaje >= 4 ? "Protegido" : "Principiante";
}

function renderizarPreguntasTest(contenedorId, preguntas) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.innerHTML = "";
  contenedor.hidden = false;

  preguntas.forEach(function (pregunta, indice) {
    const divPregunta = document.createElement("div");
    divPregunta.className = "test__pregunta";

    const numeroPregunta = document.createElement("p");
    numeroPregunta.className = "test__numero";
    numeroPregunta.textContent = "Pregunta " + (indice + 1) + " de " + preguntas.length;
    divPregunta.appendChild(numeroPregunta);

    const textoPregunta = document.createElement("p");
    textoPregunta.className = "test__texto-pregunta";
    textoPregunta.textContent = pregunta.texto;
    divPregunta.appendChild(textoPregunta);

    const divOpciones = document.createElement("div");
    divOpciones.className = "test__opciones";
    divOpciones.setAttribute("role", "group");
    divOpciones.setAttribute("aria-label", "Opciones para la pregunta " + (indice + 1));

    pregunta.opciones.forEach(function (opcion) {
      const botonOpcion = document.createElement("button");
      botonOpcion.className = "test__opcion";
      botonOpcion.type = "button";
      botonOpcion.setAttribute("aria-pressed", "false");
      botonOpcion.setAttribute("data-pregunta", indice);
      botonOpcion.setAttribute("data-valor", opcion.valor);

      const icono = document.createElement("span");
      icono.className = "test__opcion-icono";
      icono.textContent = "○";
      botonOpcion.appendChild(icono);

      botonOpcion.appendChild(document.createTextNode(opcion.texto));

      botonOpcion.addEventListener("click", function () {
        const todasOpciones = divOpciones.querySelectorAll(".test__opcion");
        todasOpciones.forEach(function (op) {
          op.setAttribute("aria-pressed", "false");
          op.querySelector(".test__opcion-icono").textContent = "○";
        });
        botonOpcion.setAttribute("aria-pressed", "true");
        botonOpcion.querySelector(".test__opcion-icono").textContent = "●";
      });

      divOpciones.appendChild(botonOpcion);
    });

    divPregunta.appendChild(divOpciones);
    contenedor.appendChild(divPregunta);
  });
}

function obtenerRespuestasDeTest(contenedorId, totalPreguntas) {
  const respuestas = [];
  for (let i = 0; i < totalPreguntas; i++) {
    const seleccionada = document.querySelector(
      "#" + contenedorId + " .test__opcion[aria-pressed='true'][data-pregunta='" + i + "']"
    );
    respuestas.push(seleccionada ? seleccionada.getAttribute("data-valor") : null);
  }
  return respuestas;
}

function tieneRespuestasNull(respuestas) {
  return respuestas.some(function (r) { return r === null; });
}

async function enviarTest(usuarioId, respuestas, preguntas) {
  const nivel = calcularNivel(respuestas);
  let puntaje = 0;
  respuestas.forEach(function (r) {
    if (r === "si" || r === "seguro") puntaje += 2;
    else if (r === "medio") puntaje += 1;
  });

  // Guarda en la API
  const resultado = await apiPost("progreso/test", {
    usuarioId: usuarioId,
    respuestas: respuestas,
    nivel: nivel,
    puntaje: puntaje,
    totalPreguntas: preguntas.length
  });

  if (resultado.exito) {
    return { exito: true, nivel: nivel, puntaje: puntaje, total: preguntas.length, desdeApi: true };
  }

  // Fallback: guarda en localStorage
  const datos = { nivel: nivel, puntaje: puntaje, total: preguntas.length, fecha: new Date().toISOString() };
  guardarLocal(CLAVE_TEST_CACHE, datos);
  return { exito: true, nivel: nivel, puntaje: puntaje, total: preguntas.length, desdeApi: false };
}

// ============================================
// LECCIÓN MÓDULO 4: FRAUDES DIGITALES
// ============================================

const pasosLeccion = [
  {
    titulo: "¿Qué es el Phishing?",
    contenido: "<p>El <strong>phishing</strong> es una técnica que usan los estafadores para engañarte y hacerte creer que estás hablando con alguien de confianza (como tu banco, una empresa o una persona conocida).</p><p>Lo hacen a través de <strong>correos electrónicos, mensajes de WhatsApp o llamadas telefónicas</strong> que parecen reales pero son falsos.</p>",
    consejo: "💡 Consejo: Si algo te genera duda, ¡pará y consultá con alguien de confianza!"
  },
  {
    titulo: "¿Cómo reconocer un mensaje falso?",
    contenido: "<p>Los mensajes de phishing suelen tener estas características:</p><ul><li><strong>Urgencia:</strong> Te dicen que tu cuenta será bloqueada o que debés actuar rápido.</li><li><strong>Errores:</strong> Tienen faltas de ortografía o frases raras.</li><li><strong>Links sospechosos:</strong> Las direcciones web no coinciden con las oficiales.</li><li><strong>Piden datos personales:</strong> Contraseñas, números de tarjeta o DNI.</li></ul>",
    consejo: "💡 Consejo: Tu banco NUNCA te va a pedir datos sensibles por mensaje o correo."
  },
  {
    titulo: "¿Qué hacer si recibís un mensaje sospechoso?",
    contenido: "<p>Seguí estos pasos si recibís un mensaje que te genera desconfianza:</p><ul><li><strong>No hagas clic</strong> en ningún enlace del mensaje.</li><li><strong>No descargues</strong> archivos adjuntos.</li><li><strong>No respondas</strong> con tus datos personales.</li><li><strong>Eliminá el mensaje</strong> y, si querés, bloqueá al remitente.</li><li><strong>Consultá</strong> directamente con la empresa llamando al número oficial.</li></ul>",
    consejo: "💡 Consejo: Es mejor prevenir. Ante la duda, no hagas nada y preguntá."
  },
  {
    titulo: "Ejemplos reales de phishing",
    contenido: "<p>Estos son algunos ejemplos comunes:</p><ul><li><strong>«Tu cuenta del banco fue bloqueada. Hacé clic aquí para desbloquearla»</strong> — El banco jamás pide esto por correo.</li><li><strong>«Ganaste un premio. Hacé clic para reclamarlo»</strong> — Si no participaste de ningún sorteo, es mentira.</li><li><strong>«Tu envío está retenido. Pagá el impuesto aquí»</strong> — Correos oficiales no piden pagos por links.</li></ul>",
    consejo: "💡 Consejo: Si recibís algo así, compará siempre con la fuente oficial antes de actuar."
  },
  {
    titulo: "¡Felicitaciones! Completaste el módulo",
    contenido: "<p>Ahora conocés las principales técnicas de phishing y sabés cómo protegerte. Recordá:</p><ul><li><strong>Nunca compartas</strong> datos personales por mensaje o correo.</li><li><strong>Si tenés duda</strong>, consultá con alguien de confianza.</li><li><strong>Tu seguridad</strong> está en tus manos.</li></ul><p>Podés volver a revisar esta lección cuando quieras desde el Campus Educativo.</p>",
    consejo: "🔒 Estás en un entorno seguro. Tus datos están protegidos."
  }
];

let indicePasoActual = 0;

function renderizarPasoLeccion(indice) {
  const contenedor = document.getElementById("contenido-leccion");
  if (!contenedor) return;

  const paso = pasosLeccion[indice];
  contenedor.innerHTML = "";

  const divPaso = document.createElement("div");
  divPaso.className = "leccion__paso";

  const numeroPaso = document.createElement("p");
  numeroPaso.className = "leccion__numero";
  numeroPaso.textContent = "Paso " + (indice + 1) + " de " + pasosLeccion.length;
  divPaso.appendChild(numeroPaso);

  const tituloPaso = document.createElement("h3");
  tituloPaso.className = "leccion__titulo-paso";
  tituloPaso.textContent = paso.titulo;
  divPaso.appendChild(tituloPaso);

  const contenidoDiv = document.createElement("div");
  contenidoDiv.className = "leccion__contenido";
  contenidoDiv.innerHTML = paso.contenido;
  divPaso.appendChild(contenidoDiv);

  if (paso.consejo) {
    const consejoDiv = document.createElement("div");
    consejoDiv.className = "leccion__consejo";
    consejoDiv.textContent = paso.consejo;
    divPaso.appendChild(consejoDiv);
  }

  contenedor.appendChild(divPaso);

  // Actualiza estado de botones
  const botonAnterior = document.getElementById("btn-leccion-anterior");
  const botonSiguiente = document.getElementById("btn-leccion-siguiente");

  if (botonAnterior) {
    botonAnterior.disabled = (indice === 0);
    botonAnterior.style.opacity = indice === 0 ? "0.4" : "1";
  }

  if (botonSiguiente) {
    botonSiguiente.textContent = indice === pasosLeccion.length - 1
      ? "✓ Finalizar módulo"
      : "Siguiente →";
  }
}

// Guarda progreso del módulo en la API
async function guardarProgresoModulo(usuarioId, moduloId, paso, completado) {
  await apiPost("progreso/modulo", {
    usuarioId: usuarioId,
    moduloId: moduloId,
    pasoActual: paso,
    completado: completado
  });
}

// ============================================
// ESCUDO DE SEGURIDAD (ALERTAS)
// ============================================

function renderizarAlertasEscudo() {
  const contenedor = document.getElementById("lista-alertas-escudo");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  // Intenta cargar desde la API
  apiGet("alertas").then(function (resultado) {
    let alertas;

    if (resultado.exito && resultado.datos.length > 0) {
      alertas = resultado.datos;
      guardarLocal(CLAVE_ALERTAS_CACHE, alertas);
    } else {
      // Fallback: usa caché local o datos hardcodeados
      alertas = leerLocal(CLAVE_ALERTAS_CACHE, null);
      if (!alertas) {
        alertas = obtenerAlertasFallback();
        guardarLocal(CLAVE_ALERTAS_CACHE, alertas);
      }
    }

    renderizarListaAlertas(contenedor, alertas);
  });
}

function obtenerAlertasFallback() {
  return [
    {
      titulo: "Correo falso del banco",
      severidad: "alta",
      descripcion: "Detectamos un correo haciéndose pasar por tu banco pidiéndote que verifiques tu cuenta con urgencia.",
      que_hacer: "No hagas clic en ningún enlace. Eliminá el mensaje y llamá al número oficial de tu banco.",
      icono: "🚨"
    },
    {
      titulo: "Mensaje de WhatsApp con premio falso",
      severidad: "alta",
      descripcion: "Recibiste un mensaje diciendo que ganaste un celular. Te piden hacer clic en un enlace.",
      que_hacer: "No hagas clic. Ninguna empresa regala cosas por WhatsApp. Eliminá el mensaje.",
      icono: "🚨"
    },
    {
      titulo: "Llamada sospechosa suplantando a tu banco",
      severidad: "alta",
      descripcion: "Te llaman desde un número que parece oficial y te piden tu número de tarjeta.",
      que_hacer: "Colgá inmediatamente. Tu banco nunca te pide esos datos por teléfono.",
      icono: "🚨"
    },
    {
      titulo: "Mensaje de texto con link a trámite falso",
      severidad: "media",
      descripcion: "Te envían un mensaje diciendo que tenés un trámite pendiente con un link falso.",
      que_hacer: "No hagas clic. Andá directamente al sitio oficial del organismo.",
      icono: "⚠️"
    },
    {
      titulo: "Correo de empresa de envíos con cargo extra",
      severidad: "media",
      descripcion: "Recibís un correo diciendo que tu paquete está retenido por falta de pago.",
      que_hacer: "No pagues nada sin verificar. Entrá al sitio oficial de la empresa de envíos.",
      icono: "⚠️"
    },
    {
      titulo: "Solicitud de amistad sospechosa en redes",
      severidad: "baja",
      descripcion: "Una persona desconocida te envía solicitud de amistad y te pide datos personales.",
      que_hacer: "No aceptes la solicitud ni compartas información.",
      icono: "ℹ️"
    }
  ];
}

function renderizarListaAlertas(contenedor, alertas) {
  contenedor.innerHTML = "";

  alertas.forEach(function (alerta) {
    const divAlerta = document.createElement("div");
    divAlerta.className = "alerta-seguridad";
    if (alerta.severidad === "alta") {
      divAlerta.className += " alerta-seguridad--alta";
    }

    const icono = document.createElement("div");
    icono.className = "alerta-seguridad__icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = alerta.icono || (alerta.severidad === "alta" ? "🚨" : "⚠️");
    divAlerta.appendChild(icono);

    const titulo = document.createElement("h3");
    titulo.className = "alerta-seguridad__titulo";
    titulo.textContent = alerta.titulo;
    divAlerta.appendChild(titulo);

    const descripcion = document.createElement("p");
    descripcion.className = "alerta-seguridad__descripcion";
    descripcion.textContent = alerta.descripcion;
    divAlerta.appendChild(descripcion);

    if (alerta.que_hacer) {
      const queHacer = document.createElement("div");
      queHacer.className = "alerta-seguridad__que-hacer";
      const tituloQueHacer = document.createElement("strong");
      tituloQueHacer.textContent = "🔒 Qué hacer:";
      queHacer.appendChild(tituloQueHacer);
      queHacer.appendChild(document.createTextNode(" " + alerta.que_hacer));
      divAlerta.appendChild(queHacer);
    }

    contenedor.appendChild(divAlerta);
  });
}

// ============================================
// EXAMEN RÁPIDO (POST-LECCIÓN)
// ============================================

const preguntasExamen = [
  {
    texto: "¿Qué es el phishing?",
    opciones: [
      { texto: "Un tipo de virus que daña tu computadora", valor: "falso" },
      { texto: "Una técnica de engaño para robar datos personales haciéndose pasar por alguien de confianza", valor: "correcto" },
      { texto: "Una actualización de seguridad del celular", valor: "falso" }
    ]
  },
  {
    texto: "Si recibís un correo de tu banco pidiéndote que verifies tu cuenta, ¿qué debés hacer?",
    opciones: [
      { texto: "Hacer clic en el enlace y completar los datos", valor: "falso" },
      { texto: "Ignorarlo y eliminar el mensaje, luego llamar al banco si tenés dudas", valor: "correcto" },
      { texto: "Reenviarlo a todos tus contactos para que se cuiden", valor: "falso" }
    ]
  },
  {
    texto: "¿Cuál de estas señales indica que un mensaje puede ser falso?",
    opciones: [
      { texto: "Te pide que actúes con urgencia y hagas clic en un enlace", valor: "correcto" },
      { texto: "Viene de tu contacto de confianza", valor: "falso" },
      { texto: "Tiene el logo de la empresa", valor: "falso" }
    ]
  }
];

async function enviarExamen(usuarioId, respuestas) {
  let puntaje = 0;
  respuestas.forEach(function (r) {
    if (r === "correcto") puntaje++;
  });

  const resultado = await apiPost("progreso/examen", {
    usuarioId: usuarioId,
    moduloId: 4,
    respuestas: respuestas,
    puntaje: puntaje,
    totalPreguntas: preguntasExamen.length
  });

  const datos = { puntaje: puntaje, total: preguntasExamen.length, fecha: new Date().toISOString() };

  if (resultado.exito) {
    return { exito: true, puntaje: puntaje, total: preguntasExamen.length, desdeApi: true };
  }

  guardarLocal(CLAVE_EXAMEN_CACHE, datos);
  return { exito: true, puntaje: puntaje, total: preguntasExamen.length, desdeApi: false };
}

// ============================================
// PROGRESO Y GRÁFICOS
// ============================================

async function renderizarProgreso() {
  const contenedor = document.getElementById("contenido-progreso");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const sesion = obtenerSesion();
  if (!sesion) {
    contenedor.innerHTML = "<p>No se encontró información de tu perfil.</p>";
    return;
  }

  let testInicial = null;
  let examen = null;

  // Intenta cargar desde la API
  const resultadoProgreso = await apiGet("progreso/" + sesion.id);
  if (resultadoProgreso.exito && resultadoProgreso.datos) {
    testInicial = resultadoProgreso.datos.testInicial;
    examen = resultadoProgreso.datos.examen;
  } else {
    // Fallback: usa caché local
    testInicial = leerLocal(CLAVE_TEST_CACHE, null);
    examen = leerLocal(CLAVE_EXAMEN_CACHE, null);
  }

  // Sección: Nivel inicial
  const seccionInicial = document.createElement("div");
  seccionInicial.className = "progreso__seccion";

  const tituloInicial = document.createElement("h3");
  tituloInicial.className = "progreso__titulo-seccion";
  tituloInicial.textContent = "Nivel inicial (Test de nivelación)";
  seccionInicial.appendChild(tituloInicial);

  if (testInicial) {
    const nivelInicial = document.createElement("div");
    nivelInicial.className = "progreso__nivel";
    nivelInicial.textContent = "Tu nivel: " + testInicial.nivel;
    seccionInicial.appendChild(nivelInicial);

    const barraInicial = crearBarraDeProgreso(
      testInicial.puntaje,
      testInicial.total_preguntas * 2,
      "progreso__barra--test-inicial",
      testInicial.nivel
    );
    seccionInicial.appendChild(barraInicial);
  } else {
    const sinDatos = document.createElement("p");
    sinDatos.className = "progreso__mensaje";
    sinDatos.textContent = "Aún no completaste el test de nivelación.";
    seccionInicial.appendChild(sinDatos);
  }

  contenedor.appendChild(seccionInicial);

  // Sección: Examen post-lección
  const seccionExamen = document.createElement("div");
  seccionExamen.className = "progreso__seccion";

  const tituloExamen = document.createElement("h3");
  tituloExamen.className = "progreso__titulo-seccion";
  tituloExamen.textContent = "Examen post-lección (Módulo 4: Fraudes)";
  seccionExamen.appendChild(tituloExamen);

  if (examen) {
    const porcentajeExamen = Math.round((examen.puntaje / examen.total_preguntas) * 100);

    const barraExamen = crearBarraDeProgreso(
      examen.puntaje,
      examen.total_preguntas,
      "progreso__barra--examen",
      porcentajeExamen + "%"
    );
    seccionExamen.appendChild(barraExamen);

    if (testInicial) {
      const comparacion = document.createElement("div");
      comparacion.className = "progreso__nivel";
      const porcentajeInicial = Math.round((testInicial.puntaje / (testInicial.total_preguntas * 2)) * 100);
      const diferencia = porcentajeExamen - porcentajeInicial;
      let textoComparacion = "";
      if (diferencia > 0) {
        textoComparacion = "¡Mejoraste " + diferencia + "% respecto a tu nivel inicial! 🎉";
      } else if (diferencia === 0) {
        textoComparacion = "Mantuveniste tu nivel. ¡Seguí aprendiendo!";
      } else {
        textoComparacion = "Repasá el módulo para reforzar tus conocimientos. 💪";
      }
      comparacion.textContent = textoComparacion;
      seccionExamen.appendChild(comparacion);
    }
  } else {
    const sinExamen = document.createElement("p");
    sinExamen.className = "progreso__mensaje";
    sinExamen.textContent = "Completá el Módulo 4 para rendir el examen rápido y ver tu progreso.";
    seccionExamen.appendChild(sinExamen);

    const botonCampus = document.createElement("button");
    botonCampus.className = "btn btn--primario btn--masivo";
    botonCampus.type = "button";
    botonCampus.textContent = "Ir al Campus Educativo";
    botonCampus.addEventListener("click", function () {
      mostrarPantalla("pantalla-campus");
    });
    seccionExamen.appendChild(botonCampus);
  }

  contenedor.appendChild(seccionExamen);
}

function crearBarraDeProgreso(valor, total, claseColor, textoSuperior) {
  const wrapper = document.createElement("div");

  const etiqueta = document.createElement("div");
  etiqueta.className = "progreso__etiqueta";

  const labelIzq = document.createElement("span");
  labelIzq.textContent = "Progreso";
  etiqueta.appendChild(labelIzq);

  const labelDer = document.createElement("span");
  labelDer.textContent = valor + " / " + total;
  etiqueta.appendChild(labelDer);

  wrapper.appendChild(etiqueta);

  const contenedorBarra = document.createElement("div");
  contenedorBarra.className = "progreso__barra-contenedor";

  const barra = document.createElement("div");
  barra.className = "progreso__barra " + claseColor;
  const porcentaje = Math.round((valor / total) * 100);
  barra.style.width = Math.max(porcentaje, 5) + "%";
  barra.textContent = textoSuperior;

  contenedorBarra.appendChild(barra);
  wrapper.appendChild(contenedorBarra);

  return wrapper;
}

// ============================================
// ACTUALIZACIÓN DE HEADER
// ============================================

function actualizarHeaderParaSesion(haIniciadoSesion) {
  const botonCerrar = document.getElementById("btn-cerrar-sesion");
  const botonNavInicio = document.getElementById("btn-nav-inicio");
  if (botonCerrar) {
    botonCerrar.hidden = !haIniciadoSesion;
  }
  if (botonNavInicio) {
    botonNavInicio.hidden = haIniciadoSesion;
  }
}

// ============================================
// FLUJO PRINCIPAL DE NAVEGACIÓN
// ============================================

function evaluarEstadoYRedirigir() {
  const sesion = obtenerSesion();

  if (!sesion) {
    actualizarHeaderParaSesion(false);
    mostrarPantalla("pantalla-inicio");
    return;
  }

  actualizarHeaderParaSesion(true);

  const testInicial = leerLocal(CLAVE_TEST_CACHE, null);
  if (!testInicial) {
    mostrarPantalla("pantalla-test");
    renderizarPreguntasTest("contenedor-preguntas", preguntasTestInicial);
    return;
  }

  mostrarDashboard(sesion);
}

function mostrarDashboard(sesion) {
  const saludoEl = document.getElementById("dashboard-titulo");
  if (saludoEl) {
    saludoEl.textContent = "¡Hola, " + sesion.nombre + "! Estás en un entorno totalmente seguro 🔒";
  }
  mostrarPantalla("pantalla-dashboard");
}

// ============================================
// INICIALIZACIÓN Y EVENTOS
// ============================================

function inicializar() {
  // --- Botones de bienvenida ---
  document.getElementById("btn-registrarse").addEventListener("click", function () {
    ocultarTodosLosErrores();
    mostrarPantalla("pantalla-registro");
  });

  document.getElementById("btn-ir-login").addEventListener("click", function () {
    ocultarTodosLosErrores();
    mostrarPantalla("pantalla-login");
  });

  // --- Boton de navegacion "Inicio" en el header ---
  document.getElementById("btn-nav-inicio").addEventListener("click", function () {
    const sesion = obtenerSesion();
    if (sesion) {
      mostrarDashboard(sesion);
    } else {
      ocultarTodosLosErrores();
      mostrarPantalla("pantalla-inicio");
    }
  });

  // --- Botones de volver ---
  document.getElementById("btn-volver-registro").addEventListener("click", function () {
    mostrarPantalla("pantalla-inicio");
  });

  document.getElementById("btn-volver-login").addEventListener("click", function () {
    mostrarPantalla("pantalla-inicio");
  });

  // --- Formulario de Registro ---
  document.getElementById("formulario-registro").addEventListener("submit", async function (evento) {
    evento.preventDefault();
    ocultarTodosLosErrores();

    const nombre = document.getElementById("campo-nombre").value;
    const email = document.getElementById("campo-email-registro").value;
    const password = document.getElementById("campo-password-registro").value;

    let hayErrores = false;

    const errorNombre = validarNombre(nombre);
    if (errorNombre) {
      mostrarError("error-nombre", errorNombre);
      hayErrores = true;
    }

    const errorEmail = validarEmail(email);
    if (errorEmail) {
      mostrarError("error-email-registro", errorEmail);
      hayErrores = true;
    }

    const errorPassword = validarPassword(password);
    if (errorPassword) {
      mostrarError("error-password-registro", errorPassword);
      hayErrores = true;
    }

    if (hayErrores) return;

    const resultado = await registrarUsuario(nombre, email, password);
    if (!resultado.exito) {
      mostrarError("error-email-registro", resultado.mensaje);
      return;
    }

    mostrarMensaje("¡Cuenta creada con éxito! 🔒", 3000);
    mostrarPantalla("pantalla-test");
    renderizarPreguntasTest("contenedor-preguntas", preguntasTestInicial);
  });

  // --- Formulario de Login ---
  document.getElementById("formulario-login").addEventListener("submit", async function (evento) {
    evento.preventDefault();
    ocultarTodosLosErrores();

    const email = document.getElementById("campo-email-login").value;
    const password = document.getElementById("campo-password-login").value;

    let hayErrores = false;

    const errorEmail = validarEmail(email);
    if (errorEmail) {
      mostrarError("error-email-login", errorEmail);
      hayErrores = true;
    }

    const errorPassword = validarPassword(password);
    if (errorPassword) {
      mostrarError("error-password-login", errorPassword);
      hayErrores = true;
    }

    if (hayErrores) return;

    const resultado = await iniciarSesion(email, password);
    if (!resultado.exito) {
      mostrarError("error-password-login", resultado.mensaje);
      return;
    }

    mostrarMensaje("¡Bienvenido/a de vuelta, " + resultado.usuario.nombre + "! 🔒", 3000);

    const testInicial = leerLocal(CLAVE_TEST_CACHE, null);
    if (!testInicial) {
      mostrarPantalla("pantalla-test");
      renderizarPreguntasTest("contenedor-preguntas", preguntasTestInicial);
    } else {
      mostrarDashboard(resultado.usuario);
    }
  });

  // --- Test: botón continuar después de ver resultado ---
  document.getElementById("btn-continuar-desde-test").addEventListener("click", function () {
    const sesion = obtenerSesion();
    if (sesion) mostrarDashboard(sesion);
  });

  // --- Dashboard: Navegación ---
  document.getElementById("btn-campus").addEventListener("click", function () {
    mostrarPantalla("pantalla-campus");
  });

  document.getElementById("btn-escudo").addEventListener("click", function () {
    renderizarAlertasEscudo();
    mostrarPantalla("pantalla-escudo");
  });

  document.getElementById("btn-progreso").addEventListener("click", function () {
    renderizarProgreso();
    mostrarPantalla("pantalla-progreso");
  });

  // --- Campus: Volver ---
  document.getElementById("btn-volver-campus").addEventListener("click", function () {
    const sesion = obtenerSesion();
    if (sesion) mostrarDashboard(sesion);
  });

  // --- Campus: Abrir Módulo 4 ---
  document.getElementById("btn-modulo-fraudes").addEventListener("click", function () {
    indicePasoActual = 0;
    renderizarPasoLeccion(0);
    mostrarPantalla("pantalla-leccion");
  });

  // --- Lección: Navegación ---
  document.getElementById("btn-leccion-anterior").addEventListener("click", function () {
    if (indicePasoActual > 0) {
      indicePasoActual--;
      renderizarPasoLeccion(indicePasoActual);
      const sesion = obtenerSesion();
      if (sesion) guardarProgresoModulo(sesion.id, 4, indicePasoActual, false);
    }
  });

  document.getElementById("btn-leccion-siguiente").addEventListener("click", async function () {
    if (indicePasoActual < pasosLeccion.length - 1) {
      indicePasoActual++;
      renderizarPasoLeccion(indicePasoActual);
      const sesion = obtenerSesion();
      if (sesion) guardarProgresoModulo(sesion.id, 4, indicePasoActual, false);
    } else {
      const sesion = obtenerSesion();
      if (sesion) await guardarProgresoModulo(sesion.id, 4, pasosLeccion.length, true);
      mostrarMensaje("¡Módulo completado! Ahora rendí un examen rápido.", 3000);
      mostrarPantalla("pantalla-examen");
      renderizarPreguntasTest("contenedor-examen", preguntasExamen);
    }
  });

  // --- Examen: continuar ---
  document.getElementById("btn-continuar-desde-examen").addEventListener("click", function () {
    renderizarProgreso();
    mostrarPantalla("pantalla-progreso");
  });

  // --- Escudo: Volver ---
  document.getElementById("btn-volver-escudo").addEventListener("click", function () {
    const sesion = obtenerSesion();
    if (sesion) mostrarDashboard(sesion);
  });

  // --- Progreso: Volver ---
  document.getElementById("btn-volver-progreso").addEventListener("click", function () {
    const sesion = obtenerSesion();
    if (sesion) mostrarDashboard(sesion);
  });

  // --- Cerrar sesión ---
  document.getElementById("btn-cerrar-sesion").addEventListener("click", function () {
    cerrarSesion();
    mostrarMensaje("Sesión cerrada correctamente. Tus datos están guardados.", 3000);
  });

  // --- Evalúa el estado al cargar ---
  evaluarEstadoYRedirigir();
}

// ============================================
// BOTONES DE ENVIAR TEST/EXAMEN (delegación)
// ============================================

function vincularBotonesEnvio() {
  const contenedorTest = document.getElementById("contenedor-preguntas");
  const contenedorExamen = document.getElementById("contenedor-examen");

  function agregarBotonEnviar(contenedor, idBoton, texto, callback) {
    let boton = document.getElementById(idBoton);
    if (!boton) {
      boton = document.createElement("button");
      boton.id = idBoton;
      boton.className = "btn btn--primario btn--masivo";
      boton.type = "button";
      boton.textContent = texto;
      boton.style.marginTop = "16px";
      boton.addEventListener("click", callback);
      contenedor.parentNode.appendChild(boton);
    }
  }

  const observerConfig = { childList: true, subtree: true };

  const observerTest = new MutationObserver(function () {
    if (!contenedorTest.hidden && contenedorTest.children.length > 0) {
      agregarBotonEnviar(contenedorTest, "btn-enviar-test", "Enviar mis respuestas", async function () {
        const respuestas = obtenerRespuestasDeTest("contenedor-preguntas", preguntasTestInicial.length);
        if (tieneRespuestasNull(respuestas)) {
          mostrarMensaje("Por favor, respondé todas las preguntas antes de continuar.", 3000);
          return;
        }

        const sesion = obtenerSesion();
        const usuarioId = sesion ? sesion.id : null;
        const resultado = await enviarTest(usuarioId, respuestas, preguntasTestInicial);

        const resultadoEl = document.getElementById("test-resultado");
        const resultadoTexto = document.getElementById("test-resultado-texto");
        resultadoTexto.textContent = "Tu nivel inicial es: " + resultado.nivel + ". ¡Ahora entrás a TAMI!";

        contenedorTest.hidden = true;
        document.getElementById("btn-enviar-test").hidden = true;
        resultadoEl.hidden = false;
      });
    }
  });

  const observerExamen = new MutationObserver(function () {
    if (!contenedorExamen.hidden && contenedorExamen.children.length > 0) {
      agregarBotonEnviar(contenedorExamen, "btn-enviar-examen", "Enviar mis respuestas", async function () {
        const respuestas = obtenerRespuestasDeTest("contenedor-examen", preguntasExamen.length);
        if (tieneRespuestasNull(respuestas)) {
          mostrarMensaje("Por favor, respondé todas las preguntas antes de continuar.", 3000);
          return;
        }

        const sesion = obtenerSesion();
        const usuarioId = sesion ? sesion.id : null;
        const resultado = await enviarExamen(usuarioId, respuestas);

        const resultadoEl = document.getElementById("examen-resultado");
        const resultadoTexto = document.getElementById("examen-resultado-texto");
        resultadoTexto.textContent = "Obtuviste " + resultado.puntaje + " de " + resultado.total + " respuestas correctas.";

        contenedorExamen.hidden = true;
        document.getElementById("btn-enviar-examen").hidden = true;
        resultadoEl.hidden = false;
      });
    }
  });

  if (contenedorTest) observerTest.observe(contenedorTest, observerConfig);
  if (contenedorExamen) observerExamen.observe(contenedorExamen, observerConfig);
}

// ============================================
// PUNTO DE ENTRADA
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  inicializar();
  vincularBotonesEnvio();
});
