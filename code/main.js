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
const CLAVE_AVATAR = "tami:avatar";

// Token del enlace de recuperación que llega en la URL (?reset=...).
// Se mantiene en memoria para no dejarlo guardado en LocalStorage.
let tokenRecuperacion = "";

// Los resultados de test y examen se guardan por usuario para que dos
// cuentas usadas en el mismo dispositivo no compartan datos.
function claveTestCache(usuarioId) {
  return usuarioId ? CLAVE_TEST_CACHE + ":" + usuarioId : CLAVE_TEST_CACHE;
}

function claveExamenCache(usuarioId) {
  return usuarioId ? CLAVE_EXAMEN_CACHE + ":" + usuarioId : CLAVE_EXAMEN_CACHE;
}

function claveAvatar(usuarioId) {
  return usuarioId ? CLAVE_AVATAR + ":" + usuarioId : CLAVE_AVATAR;
}

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
  "pantalla-recuperar": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Ingresar", pantalla: "pantalla-login" },
    { etiqueta: "Recuperar contraseña", pantalla: null }
  ],
  "pantalla-restablecer": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Ingresar", pantalla: "pantalla-login" },
    { etiqueta: "Nueva contraseña", pantalla: null }
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
  "pantalla-trabajos": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Mi entorno seguro", pantalla: "pantalla-dashboard" },
    { etiqueta: "Trabajos Prácticos", pantalla: null }
  ],
  "pantalla-configuracion": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Mi entorno seguro", pantalla: "pantalla-dashboard" },
    { etiqueta: "Mi Perfil", pantalla: null }
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

async function apiPut(recurso, cuerpo) {
  try {
    const respuesta = await fetch(API_URL + "/" + recurso, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo)
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
      return { exito: false, datos: datos, error: datos.error || "Error HTTP " + respuesta.status };
    }
    return { exito: true, datos: datos };
  } catch (error) {
    console.error("API PUT falló (" + recurso + "):", error.message);
    return { exito: false, datos: null, error: error.message };
  }
}

// ============================================
// NAVEGACIÓN ENTRE PANTALLAS (SPA)
// ============================================

function mostrarPantalla(idPantalla, opciones) {
  const evitarScroll = Boolean(opciones && opciones.evitarScroll);

  const todasLasPantallas = document.querySelectorAll(".pantalla");
  todasLasPantallas.forEach(function (pantalla) {
    pantalla.hidden = true;
  });

  const pantallaObjetivo = document.getElementById(idPantalla);
  if (pantallaObjetivo) {
    pantallaObjetivo.hidden = false;
    // Al saltar a una seccion del inicio, irASeccion controla el scroll.
    if (!evitarScroll) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Actualiza las migas de pan segun la pantalla visible
  actualizarBreadcrumb(idPantalla);

  // Marca en la barra de navegacion la seccion en la que está parado
  marcarNavegacionActiva(idPantalla);

  // En pantallas chicas, al cambiar de vista se cierra el menu
  cerrarMenuMovil();

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
// SEÑALIZACIÓN VISUAL DE FORMULARIOS
// Marca en la guía de pasos dónde está el usuario,
// qué campos ya completó y cuáles faltan corregir.
// ============================================

const validadoresPorCampo = {
  "campo-nombre": validarNombre,
  "campo-email-registro": validarEmail,
  "campo-email-login": validarEmail,
  "campo-password-registro": validarPassword,
  "campo-password-login": validarPassword
};

function configurarSenalizacion(idFormulario, idGuia) {
  const formulario = document.getElementById(idFormulario);
  const guia = document.getElementById(idGuia);
  if (!formulario || !guia) return null;

  const pasos = Array.prototype.slice.call(
    guia.querySelectorAll(".guia__paso[data-campo]")
  );
  const pasoFinal = guia.querySelector(".guia__paso[data-final]");
  const todosLosPasos = pasoFinal ? pasos.concat([pasoFinal]) : pasos.slice();

  function pasoDeCampo(idCampo) {
    return pasos.find(function (paso) {
      return paso.dataset.campo === idCampo;
    });
  }

  function estadoDeCampo(campo) {
    const validador = validadoresPorCampo[campo.id];
    if (!validador) return "neutro";
    if (campo.value.length === 0) return "neutro";
    return validador(campo.value) ? "error" : "ok";
  }

  function actualizarPasoFinal() {
    if (!pasoFinal) return;
    const todosListos = pasos.every(function (paso) {
      return paso.classList.contains("guia__paso--ok");
    });
    pasoFinal.classList.toggle("guia__paso--ok", todosListos);
  }

  function evaluarCampo(campo) {
    const estado = estadoDeCampo(campo);
    const paso = pasoDeCampo(campo.id);
    const contenedor = campo.closest(".campo");

    if (paso) {
      paso.classList.toggle("guia__paso--ok", estado === "ok");
      paso.classList.toggle("guia__paso--error", estado === "error");
    }
    if (contenedor) {
      contenedor.classList.toggle("campo--ok", estado === "ok");
    }
    actualizarPasoFinal();
  }

  function evaluarTodos() {
    formulario.querySelectorAll("input").forEach(function (campo) {
      evaluarCampo(campo);
    });
  }

  function limpiarActivos() {
    todosLosPasos.forEach(function (paso) {
      paso.classList.remove("guia__paso--activo");
    });
  }

  // Resalta en la guía el paso del campo con el que se está interactuando.
  function marcarActivo(idCampo) {
    limpiarActivos();
    const paso = pasoDeCampo(idCampo);
    if (paso) paso.classList.add("guia__paso--activo");
  }

  formulario.addEventListener("focusin", function (evento) {
    marcarActivo(evento.target.id);
  });

  formulario.addEventListener("pointerdown", function (evento) {
    marcarActivo(evento.target.id);
  });

  formulario.addEventListener("click", function (evento) {
    if (evento.target.tagName === "INPUT") marcarActivo(evento.target.id);
  });

  formulario.addEventListener("focusout", function (evento) {
    if (evento.target.tagName === "INPUT") evaluarCampo(evento.target);
  });

  formulario.addEventListener("input", function (evento) {
    if (evento.target.tagName === "INPUT") evaluarCampo(evento.target);
  });

  formulario.addEventListener("submit", evaluarTodos);

  return { actualizar: evaluarTodos };
}

// ============================================
// GESTIÓN DE SESIÓN
// ============================================

function guardarSesion(usuario) {
  guardarLocal(CLAVE_SESION, {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    nivelDigital: usuario.nivel_digital,
    tamanoFuente: usuario.tamano_fuente || "normal",
    temaPreferido: usuario.tema_preferido || "proteccion"
  });
}

// Une los datos nuevos que devuelve la API con la sesión guardada.
function actualizarSesionDesdeUsuario(usuario) {
  if (!usuario) return null;
  const actual = obtenerSesion() || {};
  const fusionada = {
    id: usuario.id !== undefined ? usuario.id : actual.id,
    nombre: usuario.nombre !== undefined ? usuario.nombre : actual.nombre,
    email: usuario.email !== undefined ? usuario.email : actual.email,
    nivelDigital: usuario.nivel_digital !== undefined ? usuario.nivel_digital : actual.nivelDigital,
    tamanoFuente: usuario.tamano_fuente !== undefined ? usuario.tamano_fuente : actual.tamanoFuente,
    temaPreferido: usuario.tema_preferido !== undefined ? usuario.tema_preferido : actual.temaPreferido
  };
  guardarSesion({
    id: fusionada.id,
    nombre: fusionada.nombre,
    email: fusionada.email,
    nivel_digital: fusionada.nivelDigital,
    tamano_fuente: fusionada.tamanoFuente,
    tema_preferido: fusionada.temaPreferido
  });
  return fusionada;
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  reiniciarDatosDeSesion();
  ocultarMensaje();
  aplicarPreferencias("normal", "proteccion");
  refrescarInterfazSesion(null);
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
// RECUPERACIÓN DE CONTRASEÑA
// El enlace que llega por correo tiene un token de un solo uso. El frontend
// no guarda el token: lo envía al servidor y lo borra de la URL al terminar.
// ============================================

function obtenerTokenRecuperacionDeUrl() {
  try {
    const parametros = new URLSearchParams(window.location.search);
    return String(parametros.get("reset") || parametros.get("token") || "").trim();
  } catch (error) {
    console.warn("No se pudo leer el enlace de recuperación:", error.message);
    return "";
  }
}

function limpiarTokenRecuperacionDeUrl() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete("reset");
    url.searchParams.delete("token");
    const ruta = url.pathname + (url.search ? url.search : "") + url.hash;
    window.history.replaceState({}, document.title, ruta);
  } catch (error) {
    console.warn("No se pudo limpiar el token de la URL:", error.message);
  }
}

async function solicitarRecuperacionPassword(email) {
  return apiPost("usuarios/recuperar-password", { email: email });
}

async function restablecerPasswordConToken(token, passwordNueva) {
  return apiPost("usuarios/restablecer-password", {
    token: token,
    passwordNueva: passwordNueva
  });
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

  // Guarda una copia local con el mismo formato que devuelve la API.
  const datos = {
    nivel: nivel,
    puntaje: puntaje,
    total_preguntas: preguntas.length,
    creado_en: new Date().toISOString()
  };
  guardarLocal(claveTestCache(usuarioId), datos);

  if (resultado.exito) {
    return { exito: true, nivel: nivel, puntaje: puntaje, total: preguntas.length, desdeApi: true };
  }

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

  // Muestra las alertas guardadas (o el respaldo local) sin esperar la red.
  const alertasIniciales = leerLocal(CLAVE_ALERTAS_CACHE, null) || obtenerAlertasFallback();
  renderizarListaAlertas(contenedor, alertasIniciales);

  // Luego intenta actualizar desde la API.
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

  const datos = {
    puntaje: puntaje,
    total_preguntas: preguntasExamen.length,
    modulo_id: 4,
    creado_en: new Date().toISOString()
  };
  guardarLocal(claveExamenCache(usuarioId), datos);

  if (resultado.exito) {
    return { exito: true, puntaje: puntaje, total: preguntasExamen.length, desdeApi: true };
  }

  return { exito: true, puntaje: puntaje, total: preguntasExamen.length, desdeApi: false };
}

// ============================================
// PROGRESO Y GRÁFICOS
// ============================================

async function renderizarProgreso() {
  const contenedor = document.getElementById("contenido-progreso");
  if (!contenedor) return;

  contenedor.innerHTML = "<p class=\"progreso__mensaje\">Cargando tu progreso…</p>";

  const sesion = obtenerSesion();
  if (!sesion) {
    contenedor.innerHTML = "<p class=\"progreso__mensaje\">No se encontró información de tu perfil.</p>";
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
    testInicial = leerLocal(claveTestCache(sesion.id), null);
    examen = leerLocal(claveExamenCache(sesion.id), null);
  }

  contenedor.innerHTML = "";

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
      testInicial.total_preguntas,
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
      const porcentajeInicial = Math.round((testInicial.puntaje / testInicial.total_preguntas) * 100);
      const diferencia = porcentajeExamen - porcentajeInicial;
      let textoComparacion = "";
      if (diferencia > 0) {
        textoComparacion = "¡Mejoraste " + diferencia + "% respecto a tu nivel inicial! 🎉";
      } else if (diferencia === 0) {
        textoComparacion = "Mantuviste tu nivel. ¡Seguí aprendiendo!";
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
      renderizarCampus();
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
// CAMPUS EDUCATIVO
// Catálogo de módulos. Solo el Módulo 4 tiene la lección completa;
// el resto se muestra como "Próximamente" para no romper la navegación.
// ============================================

const MODULOS_CAMPUS = [
  { id: 1, titulo: "Uso de Smartphones", tema: "movil", icono: "📱", nivel: "principiante", duracion: 30, disponible: false },
  { id: 2, titulo: "Redes e Internet", tema: "redes", icono: "🌐", nivel: "principiante", duracion: 40, disponible: false },
  { id: 3, titulo: "Trámites en Línea", tema: "tramites", icono: "🧾", nivel: "intermedio", duracion: 45, disponible: false },
  { id: 4, titulo: "Fraudes Digitales (Phishing)", tema: "fraudes", icono: "🛡️", nivel: "principiante", duracion: 35, disponible: true },
  { id: 5, titulo: "Comunicación Digital", tema: "comunicacion", icono: "💬", nivel: "principiante", duracion: 25, disponible: false }
];

const ETIQUETAS_TEMA = {
  movil: "Celular y aplicaciones",
  redes: "Internet y privacidad",
  tramites: "Trámites y organismos oficiales",
  fraudes: "Prevención de estafas",
  comunicacion: "Mensajes y videollamadas"
};

const ICONOS_TRABAJO = { 1: "📱", 2: "🌐", 3: "🧾", 4: "🛡️", 5: "💬" };

// Un mini trabajo por módulo y por nivel. El texto es simple y accionable.
const TRABAJOS_PRACTICOS = {
  1: {
    principiante: "Encendé tu celular y bajá el brillo desde los ajustes. Contale a alguien de confianza qué pasos hiciste.",
    intermedio: "Agregá un contacto nuevo y mandale un mensaje de saludo. Revisá que el número esté bien escrito.",
    avanzado: "Configurá el bloqueo de pantalla con PIN y activá el ahorro de batería."
  },
  2: {
    principiante: "Abrí el navegador y buscá el clima de tu barrio. Fijate en la dirección del sitio antes de leer.",
    intermedio: "Entrá al sitio oficial de tu banco y verificá que la dirección empiece con https y tenga el candado.",
    avanzado: "Revisá los permisos de dos aplicaciones y quitá los que no uses."
  },
  3: {
    principiante: "Buscá la página oficial de ANSES y guardala en favoritos para encontrarla fácil la próxima vez.",
    intermedio: "Ingresá a Mi Argentina y revisá tus datos personales sin modificar nada.",
    avanzado: "Descargá una constancia oficial y comprobá que el sitio sea el correcto antes de completar datos."
  },
  4: {
    principiante: "Revisá un correo reciente y marcá tres señales de alerta: urgencia, errores o un enlace raro.",
    intermedio: "Mostrale a un familiar una captura de un mensaje sospechoso y explicá por qué no hay que hacer clic.",
    avanzado: "Configurá el filtro de correo no deseado y reportá un mensaje como phishing."
  },
  5: {
    principiante: "Mandale un mensaje de voz a un familiar y pedile que te responda con otro.",
    intermedio: "Creá un grupo de WhatsApp con dos familiares y compartí una foto.",
    avanzado: "Hacé una videollamada y activá la verificación en dos pasos en tu cuenta de mensajería."
  }
};

const NIVELES_TRABAJO = [
  { valor: "principiante", etiqueta: "Principiante" },
  { valor: "intermedio", etiqueta: "Intermedio" },
  { valor: "avanzado", etiqueta: "Avanzado" }
];

const COLORES_AVATAR = ["#0A4B5C", "#007A87", "#2E7D32", "#B45309", "#6D4C41", "#7B1FA2"];

let filtroCampusNivel = false;
let modulosCampusCache = MODULOS_CAMPUS.slice();
let moduloActual = MODULOS_CAMPUS[3];
let nivelTrabajos = null;
let miniTrabajosCache = [];

// Evita que los datos de una cuenta queden visibles al entrar con otra.
function reiniciarDatosDeSesion() {
  modulosCampusCache = MODULOS_CAMPUS.slice();
  miniTrabajosCache = [];
  nivelTrabajos = null;
  filtroCampusNivel = false;
}

function normalizarNivel(nivel) {
  const valor = String(nivel || "").trim().toLowerCase();
  if (valor === "protegido" || valor === "avanzado") return "avanzado";
  if (valor === "intermedio") return "intermedio";
  return "principiante";
}

function formatearNivel(nivel) {
  const etiquetas = {
    principiante: "Principiante",
    intermedio: "Intermedio",
    avanzado: "Avanzado",
    protegido: "Protegido"
  };
  return etiquetas[String(nivel || "").toLowerCase()] || "Principiante";
}

function inicialDe(nombre) {
  const limpio = String(nombre || "").trim();
  return limpio ? limpio.charAt(0).toUpperCase() : "T";
}

async function renderizarCampus() {
  const lista = document.getElementById("lista-modulos");
  if (!lista) return;

  // Muestra el catálogo local al instante y luego lo completa con la API.
  renderizarListaCampus(modulosCampusCache);

  const cargar = [apiGet("cursos")];
  const sesion = obtenerSesion();
  if (sesion) cargar.push(apiGet("usuarios/" + sesion.id + "/progreso"));

  const respuestas = await Promise.all(cargar);
  const resultadoCursos = respuestas[0];
  const resultadoProgreso = respuestas[1];

  const modulosApi = resultadoCursos.exito && Array.isArray(resultadoCursos.datos)
    ? resultadoCursos.datos
    : [];

  modulosCampusCache = MODULOS_CAMPUS.map(function (base) {
    const api = modulosApi.find(function (m) { return Number(m.id) === base.id; });
    return {
      id: base.id,
      titulo: api && api.titulo ? api.titulo : base.titulo,
      tema: api && api.tema ? api.tema : base.tema,
      icono: base.icono,
      nivel: api && api.nivel ? api.nivel : base.nivel,
      duracion: api && api.duracion_min ? api.duracion_min : base.duracion,
      disponible: base.disponible
    };
  });

  if (resultadoProgreso && resultadoProgreso.exito && resultadoProgreso.datos) {
    const completados = resultadoProgreso.datos.modulos || [];
    modulosCampusCache.forEach(function (modulo) {
      const avance = completados.find(function (m) { return Number(m.modulo_id) === modulo.id; });
      modulo.completado = Boolean(avance && avance.completado);
    });
  }

  renderizarListaCampus(modulosCampusCache);
}

function renderizarListaCampus(modulos) {
  const lista = document.getElementById("lista-modulos");
  if (!lista) return;

  const sesion = obtenerSesion();
  const nivelCrudo = sesion ? String(sesion.nivelDigital || "").toLowerCase() : "";
  const nivelUsuario = sesion ? normalizarNivel(sesion.nivelDigital) : null;
  const visibles = filtroCampusNivel && nivelUsuario
    ? (nivelCrudo === "protegido"
        ? modulos
        : modulos.filter(function (m) { return normalizarNivel(m.nivel) === nivelUsuario; }))
    : modulos;

  lista.innerHTML = "";

  if (visibles.length === 0) {
    const vacio = document.createElement("li");
    vacio.className = "lista-modulos__vacio";
    vacio.textContent = "Todavía no hay módulos para tu nivel. Probá con «Todos».";
    lista.appendChild(vacio);
    return;
  }

  visibles.forEach(function (modulo) {
    const item = document.createElement("li");
    const esBoton = modulo.disponible;
    const elemento = document.createElement(esBoton ? "button" : "div");
    elemento.className = "modulo " + (esBoton ? "modulo--disponible" : "modulo--bloqueado");
    elemento.setAttribute("type", esBoton ? "button" : "div");

    if (!esBoton) {
      elemento.setAttribute("aria-disabled", "true");
    }

    const icono = document.createElement("span");
    icono.className = "modulo__icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = modulo.icono;
    elemento.appendChild(icono);

    const info = document.createElement("span");
    info.className = "modulo__info";

    const nombre = document.createElement("span");
    nombre.className = "modulo__nombre";
    nombre.textContent = "Módulo " + modulo.id + ": " + modulo.titulo;
    info.appendChild(nombre);

    const estado = document.createElement("span");
    estado.className = "modulo__estado" + (modulo.completado || modulo.disponible ? " modulo__estado--disponible" : "");
    if (modulo.completado) {
      estado.textContent = "✓ Completado";
    } else if (modulo.disponible) {
      estado.textContent = "Disponible · " + (modulo.duracion || 35) + " min · Nivel " + formatearNivel(modulo.nivel);
    } else {
      estado.textContent = "Próximamente";
    }
    info.appendChild(estado);
    elemento.appendChild(info);

    if (esBoton) {
      elemento.addEventListener("click", function () {
        abrirModulo(modulo);
      });
    }

    item.appendChild(elemento);
    lista.appendChild(item);
  });
}

function abrirModulo(modulo) {
  if (!modulo || !modulo.disponible) {
    mostrarMensaje("Este módulo estará disponible próximamente.", 3000);
    return;
  }

  moduloActual = modulo;
  indicePasoActual = 0;

  const etiquetaTema = document.getElementById("leccion-tema-etiqueta");
  if (etiquetaTema) {
    etiquetaTema.textContent = "Tema: " + (ETIQUETAS_TEMA[modulo.tema] || "Aprendizaje digital");
  }

  const tituloLeccion = document.getElementById("leccion-titulo");
  if (tituloLeccion) {
    tituloLeccion.textContent = "Módulo " + modulo.id + ": " + modulo.titulo;
  }

  const rutaLeccion = MAPA_NAVEGACION["pantalla-leccion"];
  if (rutaLeccion && rutaLeccion[3]) {
    rutaLeccion[3].etiqueta = "Módulo " + modulo.id + ": " + modulo.titulo;
  }

  renderizarPasoLeccion(0);
  mostrarPantalla("pantalla-leccion");
}

// ============================================
// TRABAJOS PRACTICOS (mini tareas por nivel)
// ============================================

function renderizarSelectorNivel() {
  const selector = document.getElementById("selector-nivel");
  if (!selector) return;

  selector.innerHTML = "";

  NIVELES_TRABAJO.forEach(function (nivel) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "chip-filtro" + (nivelTrabajos === nivel.valor ? " chip-filtro--activo" : "");
    boton.textContent = nivel.etiqueta;
    boton.setAttribute("aria-pressed", nivelTrabajos === nivel.valor ? "true" : "false");
    boton.addEventListener("click", function () {
      nivelTrabajos = nivel.valor;
      renderizarSelectorNivel();
      renderizarListaTrabajos();
    });
    selector.appendChild(boton);
  });
}

async function renderizarTrabajos() {
  const sesion = obtenerSesion();
  if (!sesion) return;

  nivelTrabajos = normalizarNivel(nivelTrabajos || sesion.nivelDigital);
  renderizarSelectorNivel();

  // Muestra las tareas al instante y luego sincroniza las que ya estan hechas.
  renderizarListaTrabajos();

  const resultado = await apiGet("usuarios/" + sesion.id + "/progreso");
  miniTrabajosCache = resultado.exito && resultado.datos && Array.isArray(resultado.datos.miniTrabajos)
    ? resultado.datos.miniTrabajos
    : [];

  renderizarListaTrabajos();
}

function trabajoEstaHecho(moduloId, nivel) {
  return miniTrabajosCache.some(function (trabajo) {
    return Number(trabajo.modulo_id) === Number(moduloId) &&
      String(trabajo.nivel) === nivel &&
      Boolean(trabajo.completado);
  });
}

function renderizarListaTrabajos() {
  const lista = document.getElementById("lista-trabajos");
  if (!lista) return;

  lista.innerHTML = "";

  MODULOS_CAMPUS.forEach(function (modulo) {
    const tarea = (TRABAJOS_PRACTICOS[modulo.id] || {})[nivelTrabajos] || "";
    const hecho = trabajoEstaHecho(modulo.id, nivelTrabajos);

    const tarjeta = document.createElement("article");
    tarjeta.className = "trabajo" + (hecho ? " trabajo--hecho" : "");

    const icono = document.createElement("span");
    icono.className = "trabajo__icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = ICONOS_TRABAJO[modulo.id] || "🛠️";
    tarjeta.appendChild(icono);

    const cuerpo = document.createElement("div");
    cuerpo.className = "trabajo__cuerpo";

    const titulo = document.createElement("h3");
    titulo.className = "trabajo__titulo";
    titulo.textContent = "Módulo " + modulo.id + ": " + modulo.titulo;
    cuerpo.appendChild(titulo);

    const texto = document.createElement("p");
    texto.className = "trabajo__texto";
    texto.textContent = tarea;
    cuerpo.appendChild(texto);

    tarjeta.appendChild(cuerpo);

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn " + (hecho ? "btn--secundario" : "btn--primario") + " trabajo__boton";
    boton.textContent = hecho ? "✓ Hecho" : "Marcar como hecho";
    boton.setAttribute("aria-pressed", hecho ? "true" : "false");
    boton.addEventListener("click", function () {
      guardarMiniTrabajo(modulo.id, nivelTrabajos, !hecho);
    });
    tarjeta.appendChild(boton);

    lista.appendChild(tarjeta);
  });
}

async function guardarMiniTrabajo(moduloId, nivel, completado) {
  const sesion = obtenerSesion();
  if (!sesion) return;

  const resultado = await apiPost("progreso/mini-trabajo", {
    usuarioId: sesion.id,
    moduloId: moduloId,
    nivel: nivel,
    completado: completado
  });

  if (!resultado.exito) {
    mostrarMensaje("No pudimos guardar el trabajo. Revisá tu conexión e intentá otra vez.", 4000);
    return;
  }

  const indice = miniTrabajosCache.findIndex(function (trabajo) {
    return Number(trabajo.modulo_id) === Number(moduloId) && String(trabajo.nivel) === nivel;
  });
  const registro = { modulo_id: moduloId, nivel: nivel, completado: completado };
  if (indice >= 0) {
    miniTrabajosCache[indice] = registro;
  } else {
    miniTrabajosCache.push(registro);
  }

  mostrarMensaje(completado ? "¡Trabajo guardado como hecho! 🎉" : "Trabajo marcado como pendiente.", 3000);
  renderizarListaTrabajos();
}

// ============================================
// PERFIL Y CONFIGURACION
// ============================================

function aplicarPreferencias(tamano, tema) {
  const tamanos = ["normal", "grande", "xl"];
  const temas = ["proteccion", "bosque", "calido"];
  const tamanoValido = tamanos.indexOf(tamano) >= 0 ? tamano : "normal";
  const temaValido = temas.indexOf(tema) >= 0 ? tema : "proteccion";
  document.documentElement.setAttribute("data-tamano", tamanoValido);
  document.documentElement.setAttribute("data-tema", temaValido);
}

function marcarPreferenciasEnFormulario(tamano, tema) {
  const radioTamano = document.querySelector("input[name='tamano-fuente'][value='" + tamano + "']");
  const radioTema = document.querySelector("input[name='tema'][value='" + tema + "']");
  if (radioTamano) radioTamano.checked = true;
  if (radioTema) radioTema.checked = true;
}

function aplicarAvatar() {
  const sesion = obtenerSesion();
  const guardado = sesion ? leerLocal(claveAvatar(sesion.id), null) : null;
  const elementos = [
    document.getElementById("cabecera-inicial"),
    document.getElementById("dashboard-inicial"),
    document.getElementById("config-inicial")
  ];

  elementos.forEach(function (elemento) {
    if (!elemento) return;
    elemento.style.backgroundImage = "";
    elemento.style.backgroundColor = "";
    elemento.style.color = "";

    if (!sesion) {
      elemento.textContent = "T";
      return;
    }

    elemento.textContent = inicialDe(sesion.nombre);

    if (guardado && guardado.tipo === "foto" && typeof guardado.valor === "string" && guardado.valor.indexOf("data:image/") === 0) {
      elemento.textContent = "";
      elemento.style.backgroundImage = "url('" + guardado.valor + "')";
      elemento.style.backgroundSize = "cover";
      elemento.style.backgroundPosition = "center";
      return;
    }

    if (guardado && guardado.tipo === "color" && COLORES_AVATAR.indexOf(guardado.valor) >= 0) {
      elemento.style.backgroundColor = guardado.valor;
      elemento.style.color = "#FFFFFF";
    }
  });
}

function renderizarOpcionesAvatar() {
  const contenedor = document.getElementById("opciones-avatar");
  if (!contenedor) return;

  const sesion = obtenerSesion();
  const guardado = sesion ? leerLocal(claveAvatar(sesion.id), null) : null;
  const colorActual = guardado && guardado.tipo === "color" ? guardado.valor : null;
  contenedor.innerHTML = "";

  COLORES_AVATAR.forEach(function (color, indice) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "config__avatar-opcion" + (colorActual === color ? " config__avatar-opcion--activo" : "");
    boton.style.backgroundColor = color;
    boton.setAttribute("aria-label", "Elegir el color " + (indice + 1) + " para mi foto");
    boton.setAttribute("aria-pressed", colorActual === color ? "true" : "false");
    boton.addEventListener("click", function () {
      const sesionActual = obtenerSesion();
      if (!sesionActual) return;
      guardarLocal(claveAvatar(sesionActual.id), { tipo: "color", valor: color });
      aplicarAvatar();
      renderizarOpcionesAvatar();
      mostrarMensaje("Color de la foto guardado en este dispositivo.", 2500);
    });
    contenedor.appendChild(boton);
  });
}

function pintarIdentidad(usuario) {
  if (!usuario) return;

  const nombre = usuario.nombre || "Tu nombre";
  const nivel = formatearNivel(usuario.nivelDigital || usuario.nivel_digital);

  const cabeceraNombre = document.getElementById("cabecera-nombre");
  if (cabeceraNombre) cabeceraNombre.textContent = nombre;
  const cabeceraNivel = document.getElementById("cabecera-nivel");
  if (cabeceraNivel) cabeceraNivel.textContent = "Nivel " + nivel;

  const dashboardNombre = document.getElementById("dashboard-nombre");
  if (dashboardNombre) dashboardNombre.textContent = nombre;
  const dashboardNivel = document.getElementById("dashboard-nivel");
  if (dashboardNivel) dashboardNivel.textContent = "Nivel " + nivel;

  const configNombre = document.getElementById("config-nombre-actual");
  if (configNombre) configNombre.textContent = nombre;
  const configEmail = document.getElementById("config-email-actual");
  if (configEmail) configEmail.textContent = usuario.email || "Correo no disponible";
  const configNivel = document.getElementById("config-nivel-actual");
  if (configNivel) configNivel.textContent = "Nivel: " + nivel;

  aplicarAvatar();
}

async function mostrarConfiguracion() {
  const sesion = obtenerSesion();
  if (!sesion) return;

  pintarIdentidad(sesion);
  renderizarOpcionesAvatar();

  const campoNombre = document.getElementById("campo-config-nombre");
  if (campoNombre) campoNombre.value = sesion.nombre || "";
  const campoNivel = document.getElementById("campo-config-nivel");
  if (campoNivel) campoNivel.value = sesion.nivelDigital || "principiante";
  const campoEmail = document.getElementById("campo-config-email");
  if (campoEmail) campoEmail.value = sesion.email || "";

  let tamano = sesion.tamanoFuente || "normal";
  let tema = sesion.temaPreferido || "proteccion";

  const resultado = await apiGet("usuarios/" + sesion.id);
  if (resultado.exito && resultado.datos) {
    tamano = resultado.datos.tamano_fuente || tamano;
    tema = resultado.datos.tema_preferido || tema;
    actualizarSesionDesdeUsuario(resultado.datos);
    pintarIdentidad(obtenerSesion());
  }

  aplicarPreferencias(tamano, tema);
  marcarPreferenciasEnFormulario(tamano, tema);
}

async function guardarDatosPerfil(evento) {
  evento.preventDefault();
  ocultarTodosLosErrores();

  const sesion = obtenerSesion();
  if (!sesion) return;

  const nombre = (document.getElementById("campo-config-nombre") || {}).value || "";
  const nivel = (document.getElementById("campo-config-nivel") || {}).value || "";
  const passwordActual = (document.getElementById("campo-config-password-actual") || {}).value || "";

  if (nombre.trim().length < 2) {
    mostrarError("error-config-nombre", "El nombre debe tener al menos 2 caracteres.");
    return;
  }

  if (nombre.trim() !== sesion.nombre && passwordActual.length === 0) {
    mostrarError("error-config-password-actual", "Para cambiar tu nombre, confirmá tu contraseña actual.");
    return;
  }

  const cuerpo = { nombre: nombre.trim(), nivel: nivel };
  if (passwordActual) cuerpo.passwordActual = passwordActual;

  const resultado = await apiPut("usuarios/" + sesion.id + "/perfil", cuerpo);
  if (!resultado.exito) {
    const mensaje = resultado.datos && resultado.datos.error ? resultado.datos.error : "No pudimos guardar tus datos.";
    mostrarError("error-config-password-actual", mensaje);
    return;
  }

  actualizarSesionDesdeUsuario(resultado.datos);
  refrescarInterfazSesion(obtenerSesion());
  pintarIdentidad(obtenerSesion());
  const campoPassword = document.getElementById("campo-config-password-actual");
  if (campoPassword) campoPassword.value = "";
  mostrarMensaje("Tus datos se guardaron correctamente. ✅", 3000);
}

async function guardarEmail(evento) {
  evento.preventDefault();
  ocultarTodosLosErrores();

  const sesion = obtenerSesion();
  if (!sesion) return;

  const email = ((document.getElementById("campo-config-email") || {}).value || "").trim();
  const passwordActual = (document.getElementById("campo-config-email-password") || {}).value || "";

  const errorEmail = validarEmail(email);
  if (errorEmail) {
    mostrarError("error-config-email", errorEmail);
    return;
  }
  if (passwordActual.length === 0) {
    mostrarError("error-config-email-password", "Ingresá tu contraseña actual para cambiar el correo.");
    return;
  }

  const resultado = await apiPut("usuarios/" + sesion.id + "/email", {
    email: email,
    passwordActual: passwordActual
  });

  if (!resultado.exito) {
    const mensaje = resultado.datos && resultado.datos.error ? resultado.datos.error : "No pudimos cambiar el correo.";
    mostrarError("error-config-email-password", mensaje);
    return;
  }

  actualizarSesionDesdeUsuario(resultado.datos);
  refrescarInterfazSesion(obtenerSesion());
  pintarIdentidad(obtenerSesion());
  const campoPassword = document.getElementById("campo-config-email-password");
  if (campoPassword) campoPassword.value = "";
  mostrarMensaje("Tu correo electrónico se actualizó. ✅", 3000);
}

async function guardarPassword(evento) {
  evento.preventDefault();
  ocultarTodosLosErrores();

  const sesion = obtenerSesion();
  if (!sesion) return;

  const passwordActual = (document.getElementById("campo-config-password-old") || {}).value || "";
  const passwordNueva = (document.getElementById("campo-config-password-nueva") || {}).value || "";
  const passwordRepetir = (document.getElementById("campo-config-password-repetir") || {}).value || "";

  if (passwordActual.length === 0) {
    mostrarError("error-config-password-old", "Ingresá tu contraseña actual.");
    return;
  }
  if (passwordNueva.length < 6) {
    mostrarError("error-config-password-nueva", "La contraseña nueva debe tener al menos 6 caracteres.");
    return;
  }
  if (passwordNueva !== passwordRepetir) {
    mostrarError("error-config-password-repetir", "Las contraseñas nuevas no coinciden.");
    return;
  }

  const resultado = await apiPut("usuarios/" + sesion.id + "/password", {
    passwordActual: passwordActual,
    passwordNueva: passwordNueva
  });

  if (!resultado.exito) {
    const mensaje = resultado.datos && resultado.datos.error ? resultado.datos.error : "No pudimos cambiar la contraseña.";
    mostrarError("error-config-password-old", mensaje);
    return;
  }

  const formulario = document.getElementById("formulario-password");
  if (formulario) formulario.reset();
  mostrarMensaje("Tu contraseña se actualizó correctamente. ✅", 3000);
}

async function guardarPreferencias(evento) {
  evento.preventDefault();
  const sesion = obtenerSesion();
  if (!sesion) return;

  const radioTamano = document.querySelector("input[name='tamano-fuente']:checked");
  const radioTema = document.querySelector("input[name='tema']:checked");
  const tamano = radioTamano ? radioTamano.value : "normal";
  const tema = radioTema ? radioTema.value : "proteccion";

  aplicarPreferencias(tamano, tema);

  const resultado = await apiPut("usuarios/" + sesion.id + "/perfil", {
    tamanoFuente: tamano,
    tema: tema
  });

  if (!resultado.exito) {
    // Mantiene la eleccion en este dispositivo aunque la API no responda.
    const sesionLocal = actualizarSesionDesdeUsuario({
      id: sesion.id,
      tamano_fuente: tamano,
      tema_preferido: tema
    });
    refrescarInterfazSesion(sesionLocal);
    mostrarMensaje("Las preferencias se aplicaron en este dispositivo, pero no se pudieron guardar en tu cuenta.", 4500);
    return;
  }

  actualizarSesionDesdeUsuario(resultado.datos);
  refrescarInterfazSesion(obtenerSesion());
  mostrarMensaje("Preferencias de lectura guardadas. ✅", 3000);
}

function guardarFoto(evento) {
  evento.preventDefault();
  const input = document.getElementById("campo-foto");
  const archivo = input && input.files ? input.files[0] : null;

  if (!archivo) {
    mostrarMensaje("Primero elegí una foto de tu dispositivo.", 3000);
    return;
  }
  if (archivo.type.indexOf("image/") !== 0) {
    mostrarMensaje("El archivo tiene que ser una imagen.", 3000);
    return;
  }
  if (archivo.size > 2 * 1024 * 1024) {
    mostrarMensaje("La foto es muy grande. Elegí una de menos de 2 MB.", 4000);
    return;
  }

  const sesion = obtenerSesion();
  if (!sesion) return;

  const lector = new FileReader();
  lector.onload = function () {
    if (typeof lector.result === "string" && lector.result.indexOf("data:image/") === 0) {
      guardarLocal(claveAvatar(sesion.id), { tipo: "foto", valor: lector.result });
      aplicarAvatar();
      renderizarOpcionesAvatar();
      mostrarMensaje("Foto guardada en este dispositivo. 📷", 3000);
    }
  };
  lector.readAsDataURL(archivo);
}

// ============================================
// RESUMEN DEL DASHBOARD
// ============================================

async function renderizarResumenDashboard(sesion) {
  const contenedor = document.getElementById("dashboard-resumen");
  if (!contenedor || !sesion) return;

  contenedor.innerHTML = "<p class=\"dashboard__resumen-cargando\">Cargando tu resumen…</p>";

  const resultado = await apiGet("usuarios/" + sesion.id + "/progreso");
  let modulosCompletados = 0;
  let trabajosHechos = 0;
  let examen = null;

  if (resultado.exito && resultado.datos) {
    const modulos = resultado.datos.modulos || [];
    modulosCompletados = modulos.filter(function (m) { return Boolean(m.completado); }).length;
    const trabajos = resultado.datos.miniTrabajos || [];
    trabajosHechos = trabajos.filter(function (t) { return Boolean(t.completado); }).length;
    examen = resultado.datos.examen;
  }

  contenedor.innerHTML = "";

  const datos = [
    { etiqueta: "Tu nivel", valor: formatearNivel(sesion.nivelDigital), icono: "🎯" },
    { etiqueta: "Módulos completados", valor: modulosCompletados + " de " + MODULOS_CAMPUS.length, icono: "📚" },
    { etiqueta: "Trabajos hechos", valor: String(trabajosHechos), icono: "🛠️" }
  ];

  if (examen && examen.total_preguntas) {
    datos.push({
      etiqueta: "Último examen",
      valor: examen.puntaje + " de " + examen.total_preguntas,
      icono: "🏅"
    });
  }

  datos.forEach(function (dato) {
    const item = document.createElement("div");
    item.className = "dashboard__dato";

    const icono = document.createElement("span");
    icono.className = "dashboard__dato-icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = dato.icono;
    item.appendChild(icono);

    const valor = document.createElement("span");
    valor.className = "dashboard__dato-valor";
    valor.textContent = dato.valor;
    item.appendChild(valor);

    const etiqueta = document.createElement("span");
    etiqueta.className = "dashboard__dato-etiqueta";
    etiqueta.textContent = dato.etiqueta;
    item.appendChild(etiqueta);

    contenedor.appendChild(item);
  });
}

// ============================================
// BARRA DE NAVEGACION (publica y con sesion)
// ============================================

const MAPA_NAV_ACTIVA = {
  "pantalla-campus": "btn-nav-campus",
  "pantalla-leccion": "btn-nav-campus",
  "pantalla-trabajos": "btn-nav-trabajos",
  "pantalla-progreso": "btn-nav-progreso",
  "pantalla-examen": "btn-nav-progreso",
  "pantalla-escudo": "btn-nav-escudo",
  "pantalla-configuracion": "btn-nav-perfil"
};

function marcarNavegacionActiva(idPantalla) {
  document.querySelectorAll(".header__nav-item").forEach(function (boton) {
    boton.classList.remove("header__nav-item--activo");
    boton.removeAttribute("aria-current");
  });

  const idActivo = MAPA_NAV_ACTIVA[idPantalla];
  if (idActivo) {
    const boton = document.getElementById(idActivo);
    if (boton) {
      boton.classList.add("header__nav-item--activo");
      boton.setAttribute("aria-current", "page");
    }
    return;
  }

  if (idPantalla === "pantalla-inicio" && !obtenerSesion()) {
    const botonInicio = document.querySelector("#nav-invitado [data-seccion='inicio']");
    if (botonInicio) {
      botonInicio.classList.add("header__nav-item--activo");
      botonInicio.setAttribute("aria-current", "page");
    }
  }
}

function refrescarInterfazSesion(sesion) {
  const haySesion = Boolean(sesion);

  document.querySelectorAll("[data-solo-invitado]").forEach(function (elemento) {
    elemento.hidden = haySesion;
  });
  document.querySelectorAll("[data-solo-sesion]").forEach(function (elemento) {
    elemento.hidden = !haySesion;
  });

  if (haySesion) {
    pintarIdentidad(sesion);
    aplicarPreferencias(sesion.tamanoFuente || "normal", sesion.temaPreferido || "proteccion");
  } else {
    aplicarPreferencias("normal", "proteccion");
    aplicarAvatar();
  }

  cerrarMenuMovil();
}

function cerrarMenuMovil() {
  const header = document.querySelector(".header");
  const boton = document.getElementById("btn-menu-movil");
  if (header) header.classList.remove("header--menu-abierto");
  if (boton) {
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menú de navegación");
  }
}

function alternarMenuMovil() {
  const header = document.querySelector(".header");
  const boton = document.getElementById("btn-menu-movil");
  if (!header || !boton) return;

  const abierto = header.classList.toggle("header--menu-abierto");
  boton.setAttribute("aria-expanded", abierto ? "true" : "false");
  boton.setAttribute("aria-label", abierto ? "Cerrar menú de navegación" : "Abrir menú de navegación");
}

function irASeccion(idSeccion) {
  const sesion = obtenerSesion();
  if (sesion) {
    mostrarDashboard(sesion);
    return;
  }

  ocultarTodosLosErrores();
  // Evita que el scroll al inicio compita con el scroll a la seccion elegida.
  mostrarPantalla("pantalla-inicio", { evitarScroll: true });

  // Marca como activa la seccion publica que se esta visitando.
  document.querySelectorAll("#nav-invitado [data-seccion]").forEach(function (boton) {
    boton.classList.remove("header__nav-item--activo");
    boton.removeAttribute("aria-current");
  });
  const botonSeccion = document.querySelector("#nav-invitado [data-seccion='" + idSeccion + "']");
  if (botonSeccion) {
    botonSeccion.classList.add("header__nav-item--activo");
    botonSeccion.setAttribute("aria-current", "page");
  }

  if (idSeccion === "inicio") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const seccion = document.getElementById(idSeccion);
  if (seccion) {
    seccion.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

async function continuarDespuesDeAcceso(usuario) {
  reiniciarDatosDeSesion();
  refrescarInterfazSesion(obtenerSesion());

  let testInicial = leerLocal(claveTestCache(usuario && usuario.id), null);

  if (!testInicial && usuario && usuario.id) {
    const resultado = await apiGet("usuarios/" + usuario.id + "/progreso");
    if (resultado.exito && resultado.datos && resultado.datos.testInicial) {
      testInicial = resultado.datos.testInicial;
      guardarLocal(claveTestCache(usuario.id), testInicial);
    }
  }

  if (!testInicial) {
    mostrarPantalla("pantalla-test");
    renderizarPreguntasTest("contenedor-preguntas", preguntasTestInicial);
    return;
  }

  mostrarDashboard(obtenerSesion() || usuario);
}

// ============================================
// ACTUALIZACIÓN DE HEADER
// ============================================

function actualizarHeaderParaSesion(haIniciadoSesion) {
  refrescarInterfazSesion(haIniciadoSesion ? obtenerSesion() : null);
}

// ============================================
// FLUJO PRINCIPAL DE NAVEGACIÓN
// ============================================

function evaluarEstadoYRedirigir() {
  const sesion = obtenerSesion();

  if (!sesion) {
    refrescarInterfazSesion(null);
    mostrarPantalla("pantalla-inicio");
    return;
  }

  refrescarInterfazSesion(sesion);
  continuarDespuesDeAcceso(sesion);
}

function mostrarDashboard(sesion) {
  if (!sesion) return;

  const saludoEl = document.getElementById("dashboard-titulo");
  if (saludoEl) {
    saludoEl.textContent = "¡Hola, " + sesion.nombre + "! 👋";
  }

  pintarIdentidad(sesion);
  renderizarResumenDashboard(sesion);
  mostrarPantalla("pantalla-dashboard");
}

// ============================================
// INICIALIZACIÓN Y EVENTOS
// ============================================

function inicializar() {
  // --- Señalización de los formularios (guías de pasos) ---
  const senalizacionRegistro = configurarSenalizacion("formulario-registro", "guia-registro");
  const senalizacionLogin = configurarSenalizacion("formulario-login", "guia-login");

  // --- Botones de bienvenida (hero y CTA final) ---
  function irARegistro() {
    ocultarTodosLosErrores();
    mostrarPantalla("pantalla-registro");
    if (senalizacionRegistro) senalizacionRegistro.actualizar();
  }

  function irALogin() {
    ocultarTodosLosErrores();
    mostrarPantalla("pantalla-login");
    if (senalizacionLogin) senalizacionLogin.actualizar();
  }

  function irARecuperar() {
    ocultarTodosLosErrores();

    const formulario = document.getElementById("formulario-recuperar");
    if (formulario) {
      formulario.hidden = false;
      formulario.reset();
    }

    const resultado = document.getElementById("recuperar-resultado");
    if (resultado) resultado.hidden = true;

    const enlaceDev = document.getElementById("recuperar-enlace-dev");
    if (enlaceDev) {
      enlaceDev.hidden = true;
      enlaceDev.removeAttribute("href");
    }

    const avisoDev = document.getElementById("recuperar-aviso-dev");
    if (avisoDev) avisoDev.hidden = true;

    const email = document.getElementById("campo-email-recuperar");
    const emailLogin = document.getElementById("campo-email-login");
    if (email && emailLogin) email.value = emailLogin.value;
    if (email) {
      setTimeout(function () {
        email.focus();
      }, 50);
    }

    mostrarPantalla("pantalla-recuperar");
  }

  function irARestablecer(token) {
    ocultarTodosLosErrores();
    tokenRecuperacion = String(token || "");

    const formulario = document.getElementById("formulario-restablecer");
    if (formulario) {
      formulario.hidden = false;
      formulario.reset();
    }

    const campoToken = document.getElementById("campo-reset-token");
    if (campoToken) campoToken.value = tokenRecuperacion;

    const resultado = document.getElementById("restablecer-resultado");
    if (resultado) resultado.hidden = true;

    mostrarPantalla("pantalla-restablecer");

    const primeraPassword = document.getElementById("campo-password-restablecer");
    if (primeraPassword) {
      setTimeout(function () {
        primeraPassword.focus();
      }, 50);
    }
  }

  function volverDesdeRecuperacion() {
    tokenRecuperacion = "";
    limpiarTokenRecuperacionDeUrl();

    const sesion = obtenerSesion();
    if (sesion) {
      refrescarInterfazSesion(sesion);
      mostrarDashboard(sesion);
      return;
    }

    refrescarInterfazSesion(null);
    irALogin();
  }

  ["btn-registrarse", "btn-registrarse-final", "btn-registrarse-desde-login"].forEach(function (id) {
    const boton = document.getElementById(id);
    if (boton) boton.addEventListener("click", irARegistro);
  });

  ["btn-ir-login", "btn-ir-login-final", "btn-ir-login-desde-registro"].forEach(function (id) {
    const boton = document.getElementById(id);
    if (boton) boton.addEventListener("click", irALogin);
  });

  // --- Barra de navegacion publica: lleva a cada seccion del inicio ---
  document.querySelectorAll("[data-seccion]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      irASeccion(boton.getAttribute("data-seccion"));
    });
  });

  // --- Menu movil ---
  const botonMenu = document.getElementById("btn-menu-movil");
  if (botonMenu) {
    botonMenu.addEventListener("click", alternarMenuMovil);
  }
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") cerrarMenuMovil();
  });

  // --- Marca TAMI: vuelve al inicio o al panel ---
  const botonMarca = document.getElementById("btn-marca");
  if (botonMarca) {
    botonMarca.addEventListener("click", function () {
      const sesion = obtenerSesion();
      if (sesion) {
        mostrarDashboard(sesion);
      } else {
        irASeccion("inicio");
      }
    });
  }

  // --- Acciones para quienes todavia no tienen cuenta ---
  const btnNavLogin = document.getElementById("btn-nav-login");
  if (btnNavLogin) btnNavLogin.addEventListener("click", irALogin);
  const btnNavRegistro = document.getElementById("btn-nav-registro");
  if (btnNavRegistro) btnNavRegistro.addEventListener("click", irARegistro);

  // --- Recuperación de contraseña ---
  const btnOlvidePassword = document.getElementById("btn-olvide-password");
  if (btnOlvidePassword) btnOlvidePassword.addEventListener("click", irARecuperar);

  ["btn-volver-recuperar", "btn-volver-restablecer"].forEach(function (id) {
    const boton = document.getElementById(id);
    if (boton) boton.addEventListener("click", volverDesdeRecuperacion);
  });

  const btnIrLoginDesdeRestablecer = document.getElementById("btn-ir-login-desde-restablecer");
  if (btnIrLoginDesdeRestablecer) {
    btnIrLoginDesdeRestablecer.addEventListener("click", function () {
      refrescarInterfazSesion(null);
      irALogin();
    });
  }

  // --- Navegacion con sesion ---
  function abrirCampus() {
    renderizarCampus();
    mostrarPantalla("pantalla-campus");
  }

  function abrirTrabajos() {
    renderizarTrabajos();
    mostrarPantalla("pantalla-trabajos");
  }

  function abrirEscudo() {
    renderizarAlertasEscudo();
    mostrarPantalla("pantalla-escudo");
  }

  function abrirProgreso() {
    renderizarProgreso();
    mostrarPantalla("pantalla-progreso");
  }

  async function abrirPerfil() {
    mostrarPantalla("pantalla-configuracion");
    await mostrarConfiguracion();
  }

  const accionesSesion = {
    "btn-nav-campus": abrirCampus,
    "btn-nav-trabajos": abrirTrabajos,
    "btn-nav-progreso": abrirProgreso,
    "btn-nav-escudo": abrirEscudo,
    "btn-nav-perfil": abrirPerfil,
    "btn-usuario-cabecera": abrirPerfil
  };
  Object.keys(accionesSesion).forEach(function (id) {
    const boton = document.getElementById(id);
    if (boton) boton.addEventListener("click", accionesSesion[id]);
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
    await continuarDespuesDeAcceso(resultado.usuario);
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
    await continuarDespuesDeAcceso(resultado.usuario);
  });

  // --- Recuperación: pedir el enlace por correo ---
  const formularioRecuperar = document.getElementById("formulario-recuperar");
  if (formularioRecuperar) {
    formularioRecuperar.addEventListener("submit", async function (evento) {
      evento.preventDefault();
      ocultarTodosLosErrores();

      const email = (document.getElementById("campo-email-recuperar") || {}).value || "";
      const errorEmail = validarEmail(email);
      if (errorEmail) {
        mostrarError("error-email-recuperar", errorEmail);
        return;
      }

      const boton = document.getElementById("btn-enviar-recuperacion");
      const textoBoton = boton ? boton.textContent : "";
      if (boton) {
        boton.disabled = true;
        boton.textContent = "Enviando…";
      }

      const resultado = await solicitarRecuperacionPassword(email.trim());

      if (boton) {
        boton.disabled = false;
        boton.textContent = textoBoton;
      }

      if (!resultado.exito) {
        const mensaje =
          resultado.datos && resultado.datos.error
            ? resultado.datos.error
            : "No pudimos enviar el enlace. Revisá tu conexión e intentá de nuevo.";
        mostrarError("error-email-recuperar", mensaje);
        return;
      }

      formularioRecuperar.hidden = true;

      const cajaResultado = document.getElementById("recuperar-resultado");
      const textoResultado = document.getElementById("recuperar-resultado-texto");
      if (textoResultado) {
        textoResultado.textContent =
          (resultado.datos && resultado.datos.mensaje) ||
          "Si el correo está registrado, te enviamos un enlace para crear una contraseña nueva.";
      }
      if (cajaResultado) cajaResultado.hidden = false;

      const enlaceDev = document.getElementById("recuperar-enlace-dev");
      const avisoDev = document.getElementById("recuperar-aviso-dev");
      if (enlaceDev && resultado.datos && resultado.datos.resetUrl) {
        enlaceDev.href = resultado.datos.resetUrl;
        enlaceDev.hidden = false;
        if (avisoDev) avisoDev.hidden = false;
      }
    });
  }

  // --- Recuperación: guardar la contraseña nueva con el token del enlace ---
  const formularioRestablecer = document.getElementById("formulario-restablecer");
  if (formularioRestablecer) {
    formularioRestablecer.addEventListener("submit", async function (evento) {
      evento.preventDefault();
      ocultarTodosLosErrores();

      const campoToken = document.getElementById("campo-reset-token");
      const token = tokenRecuperacion || (campoToken ? campoToken.value : "");

      const passwordNueva =
        (document.getElementById("campo-password-restablecer") || {}).value || "";
      const passwordRepetir =
        (document.getElementById("campo-password-restablecer-repetir") || {}).value || "";

      if (!token) {
        mostrarError(
          "error-restablecer",
          "El enlace no es válido o venció. Pedí uno nuevo desde '¿Olvidaste tu contraseña?'."
        );
        return;
      }

      if (passwordNueva.length < 6) {
        mostrarError(
          "error-password-restablecer",
          "La contraseña nueva debe tener al menos 6 caracteres."
        );
        return;
      }
      if (passwordNueva.length > 72) {
        mostrarError(
          "error-password-restablecer",
          "La contraseña no puede superar los 72 caracteres."
        );
        return;
      }
      if (passwordNueva !== passwordRepetir) {
        mostrarError(
          "error-password-restablecer-repetir",
          "Las contraseñas nuevas no coinciden."
        );
        return;
      }

      const boton = document.getElementById("btn-guardar-password-restablecer");
      const textoBoton = boton ? boton.textContent : "";
      if (boton) {
        boton.disabled = true;
        boton.textContent = "Guardando…";
      }

      const resultado = await restablecerPasswordConToken(token, passwordNueva);

      if (boton) {
        boton.disabled = false;
        boton.textContent = textoBoton;
      }

      if (!resultado.exito) {
        const mensaje =
          resultado.datos && resultado.datos.error
            ? resultado.datos.error
            : "No pudimos cambiar la contraseña. Intentá de nuevo.";
        mostrarError("error-restablecer", mensaje);
        return;
      }

      // El token ya se usó: se limpia de la URL y se cierra cualquier sesión
      // local para que la próxima entrada use la contraseña nueva.
      tokenRecuperacion = "";
      limpiarTokenRecuperacionDeUrl();
      if (campoToken) campoToken.value = "";
      localStorage.removeItem(CLAVE_SESION);
      reiniciarDatosDeSesion();
      refrescarInterfazSesion(null);

      formularioRestablecer.hidden = true;
      const cajaResultado = document.getElementById("restablecer-resultado");
      const textoResultado = document.getElementById("restablecer-resultado-texto");
      if (textoResultado) {
        textoResultado.textContent =
          (resultado.datos && resultado.datos.mensaje) ||
          "Tu contraseña se actualizó correctamente. La contraseña anterior ya no funciona. Ya podés iniciar sesión.";
      }
      if (cajaResultado) cajaResultado.hidden = false;
    });
  }

  // --- Test: botón continuar después de ver resultado ---
  document.getElementById("btn-continuar-desde-test").addEventListener("click", function () {
    const sesion = obtenerSesion();
    if (sesion) mostrarDashboard(sesion);
  });

  // --- Dashboard: accesos rapidos ---
  const btnCampus = document.getElementById("btn-campus");
  if (btnCampus) btnCampus.addEventListener("click", abrirCampus);

  const btnTrabajos = document.getElementById("btn-trabajos");
  if (btnTrabajos) btnTrabajos.addEventListener("click", abrirTrabajos);

  const btnEscudo = document.getElementById("btn-escudo");
  if (btnEscudo) btnEscudo.addEventListener("click", abrirEscudo);

  const btnProgreso = document.getElementById("btn-progreso");
  if (btnProgreso) btnProgreso.addEventListener("click", abrirProgreso);

  const btnPerfilDashboard = document.getElementById("btn-perfil-dashboard");
  if (btnPerfilDashboard) btnPerfilDashboard.addEventListener("click", abrirPerfil);

  // --- Campus: filtros por nivel ---
  const filtroTodos = document.getElementById("btn-filtro-todos");
  const filtroNivel = document.getElementById("btn-filtro-nivel");

  function actualizarFiltrosCampus() {
    if (filtroTodos) {
      filtroTodos.classList.toggle("chip-filtro--activo", !filtroCampusNivel);
      filtroTodos.setAttribute("aria-pressed", filtroCampusNivel ? "false" : "true");
    }
    if (filtroNivel) {
      filtroNivel.classList.toggle("chip-filtro--activo", filtroCampusNivel);
      filtroNivel.setAttribute("aria-pressed", filtroCampusNivel ? "true" : "false");
    }
    renderizarListaCampus(modulosCampusCache);
  }

  if (filtroTodos) {
    filtroTodos.addEventListener("click", function () {
      filtroCampusNivel = false;
      actualizarFiltrosCampus();
    });
  }
  if (filtroNivel) {
    filtroNivel.addEventListener("click", function () {
      filtroCampusNivel = true;
      actualizarFiltrosCampus();
    });
  }

  // --- Campus: Volver ---
  document.getElementById("btn-volver-campus").addEventListener("click", function () {
    const sesion = obtenerSesion();
    if (sesion) mostrarDashboard(sesion);
  });

  // --- Trabajos: Volver ---
  const btnVolverTrabajos = document.getElementById("btn-volver-trabajos");
  if (btnVolverTrabajos) {
    btnVolverTrabajos.addEventListener("click", function () {
      const sesion = obtenerSesion();
      if (sesion) mostrarDashboard(sesion);
    });
  }

  // --- Lección: Navegación ---
  document.getElementById("btn-leccion-anterior").addEventListener("click", function () {
    if (indicePasoActual > 0) {
      indicePasoActual--;
      renderizarPasoLeccion(indicePasoActual);
      const sesion = obtenerSesion();
      if (sesion) guardarProgresoModulo(sesion.id, moduloActual.id, indicePasoActual, false);
    }
  });

  document.getElementById("btn-leccion-siguiente").addEventListener("click", async function () {
    if (indicePasoActual < pasosLeccion.length - 1) {
      indicePasoActual++;
      renderizarPasoLeccion(indicePasoActual);
      const sesion = obtenerSesion();
      if (sesion) guardarProgresoModulo(sesion.id, moduloActual.id, indicePasoActual, false);
    } else {
      const sesion = obtenerSesion();
      if (sesion) await guardarProgresoModulo(sesion.id, moduloActual.id, pasosLeccion.length, true);
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

  // --- Configuracion: formularios ---
  const formularioPerfil = document.getElementById("formulario-perfil");
  if (formularioPerfil) formularioPerfil.addEventListener("submit", guardarDatosPerfil);

  const formularioEmail = document.getElementById("formulario-email");
  if (formularioEmail) formularioEmail.addEventListener("submit", guardarEmail);

  const formularioPassword = document.getElementById("formulario-password");
  if (formularioPassword) formularioPassword.addEventListener("submit", guardarPassword);

  const formularioPreferencias = document.getElementById("formulario-preferencias");
  if (formularioPreferencias) formularioPreferencias.addEventListener("submit", guardarPreferencias);

  const formularioFoto = document.getElementById("formulario-foto");
  if (formularioFoto) formularioFoto.addEventListener("submit", guardarFoto);

  // --- Cerrar sesion (cabecera y configuracion) ---
  function salirDeLaCuenta() {
    cerrarSesion();
    mostrarMensaje("Sesión cerrada correctamente. Tus datos están guardados.", 3000);
  }

  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
  if (btnCerrarSesion) btnCerrarSesion.addEventListener("click", salirDeLaCuenta);

  const btnCerrarSesionConfig = document.getElementById("btn-cerrar-sesion-config");
  if (btnCerrarSesionConfig) btnCerrarSesionConfig.addEventListener("click", salirDeLaCuenta);

  // --- Enlace de recuperación: tiene prioridad sobre la sesión guardada ---
  const tokenEnlace = obtenerTokenRecuperacionDeUrl();
  if (tokenEnlace) {
    irARestablecer(tokenEnlace);
  } else {
    evaluarEstadoYRedirigir();
  }
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
