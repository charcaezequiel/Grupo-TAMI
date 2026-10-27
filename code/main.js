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
const CLAVE_AVATAR = "tami:avatar";
const CLAVE_PROGRESO_CACHE = "tami:progresoCache";
const CLAVE_MINI_TRABAJOS_CACHE = "tami:miniTrabajosCache";
const TIEMPO_MAXIMO_API_MS = 2500;

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

// El avance de los niveles se guarda también en el dispositivo: así el
// desbloqueo del nivel siguiente se mantiene aunque la API no responda.
function claveProgresoCache(usuarioId) {
  return usuarioId ? CLAVE_PROGRESO_CACHE + ":" + usuarioId : CLAVE_PROGRESO_CACHE;
}

function claveMiniTrabajosCache(usuarioId) {
  return usuarioId ? CLAVE_MINI_TRABAJOS_CACHE + ":" + usuarioId : CLAVE_MINI_TRABAJOS_CACHE;
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
  "pantalla-curso": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Mi entorno seguro", pantalla: "pantalla-dashboard" },
    { etiqueta: "Campus Educativo", pantalla: "pantalla-campus" },
    { etiqueta: "Curso", pantalla: null }
  ],
  "pantalla-leccion": [
    { etiqueta: "Inicio", pantalla: "pantalla-inicio" },
    { etiqueta: "Mi entorno seguro", pantalla: "pantalla-dashboard" },
    { etiqueta: "Campus Educativo", pantalla: "pantalla-campus" },
    { etiqueta: "Curso", pantalla: "pantalla-curso" },
    { etiqueta: "Nivel", pantalla: null }
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
    { etiqueta: "Curso", pantalla: "pantalla-curso" },
    { etiqueta: "Examen del nivel", pantalla: null }
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

// La API local puede tardar varios segundos en rechazar la conexión en Windows.
// Con este límite, la interfaz cae al respaldo local sin dejar botones "colgados".
async function fetchApi(recurso, opciones) {
  const controlador = new AbortController();
  const temporizador = setTimeout(function () {
    controlador.abort();
  }, TIEMPO_MAXIMO_API_MS);

  try {
    return await fetch(API_URL + "/" + recurso, Object.assign({}, opciones, {
      signal: controlador.signal
    }));
  } finally {
    clearTimeout(temporizador);
  }
}

function esErrorDeConexion(error) {
  if (!error) return false;
  if (error.name === "AbortError") return true;
  return /failed to fetch|networkerror|load failed|abort|timeout/i.test(String(error.message || ""));
}

async function apiGet(recurso) {
  try {
    const respuesta = await fetchApi(recurso, {
      headers: { "Content-Type": "application/json" }
    });
    if (!respuesta.ok) {
      throw new Error("Error HTTP " + respuesta.status);
    }
    const datos = await respuesta.json();
    return { exito: true, datos: datos };
  } catch (error) {
    const conexion = esErrorDeConexion(error);
    console.error("API GET falló (" + recurso + "):", error.message);
    return { exito: false, datos: null, error: conexion ? "offline" : error.message, esConexion: conexion };
  }
}

async function apiPost(recurso, cuerpo) {
  try {
    const respuesta = await fetchApi(recurso, {
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
    const conexion = esErrorDeConexion(error);
    console.error("API POST falló (" + recurso + "):", error.message);
    return { exito: false, datos: null, error: conexion ? "offline" : error.message, esConexion: conexion };
  }
}

async function apiPut(recurso, cuerpo) {
  try {
    const respuesta = await fetchApi(recurso, {
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
    const conexion = esErrorDeConexion(error);
    console.error("API PUT falló (" + recurso + "):", error.message);
    return { exito: false, datos: null, error: conexion ? "offline" : error.message, esConexion: conexion };
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
  if (resultado.esConexion) {
    console.warn("API no disponible, usando localStorage como fallback");
    return registrarUsuarioFallback(nombre, email, password);
  }

  return { exito: false, mensaje: resultado.datos ? resultado.datos.error : "Error al registrar" };
}

// Los usuarios de respaldo viven solo en este dispositivo. Guardamos un hash
// de la contraseña para que el acceso local no quede abierto a cualquiera.
async function generarHashPassword(password) {
  const texto = String(password || "");
  if (window.crypto && window.crypto.subtle && window.TextEncoder) {
    const datos = new TextEncoder().encode("tami:" + texto);
    const buffer = await window.crypto.subtle.digest("SHA-256", datos);
    return Array.from(new Uint8Array(buffer)).map(function (byte) {
      return byte.toString(16).padStart(2, "0");
    }).join("");
  }
  let hash = 5381;
  for (let i = 0; i < texto.length; i++) {
    hash = ((hash << 5) + hash + texto.charCodeAt(i)) | 0;
  }
  return "local:" + (hash >>> 0).toString(16);
}

async function registrarUsuarioFallback(nombre, email, password) {
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
    password_hash: await generarHashPassword(password),
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
  if (resultado.esConexion) {
    console.warn("API no disponible, usando localStorage como fallback");
    return iniciarSesionFallback(email, password);
  }

  return { exito: false, mensaje: resultado.datos ? resultado.datos.error : "Error al iniciar sesión" };
}

async function iniciarSesionFallback(email, password) {
  const usuarios = leerLocal(CLAVE_USUARIOS_CACHE, []);
  const indice = usuarios.findIndex(function (u) {
    return u.email === email.trim().toLowerCase();
  });

  if (indice === -1) {
    return { exito: false, mensaje: "No se encontró una cuenta con ese correo." };
  }

  const usuario = usuarios[indice];
  const hashIngresado = await generarHashPassword(password);

  // Cuentas creadas antes de guardar el hash: se vincula en el primer acceso.
  if (usuario.password_hash && usuario.password_hash !== hashIngresado) {
    return { exito: false, mensaje: "La contraseña no es correcta." };
  }

  if (!usuario.password_hash) {
    usuarios[indice] = Object.assign({}, usuario, { password_hash: hashIngresado });
    guardarLocal(CLAVE_USUARIOS_CACHE, usuarios);
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
// LECCIÓN DE UN NIVEL DEL CURSO
// El contenido de cada nivel vive en contenido-cursos.js
// ============================================

let cursoActual = null;
let moduloActual = null;
let indicePasoActual = 0;

function pasosDelNivelActual() {
  return moduloActual && Array.isArray(moduloActual.pasos) ? moduloActual.pasos : [];
}

function renderizarPasoLeccion(indice) {
  const contenedor = document.getElementById("contenido-leccion");
  if (!contenedor) return;

  const pasos = pasosDelNivelActual();
  contenedor.innerHTML = "";

  if (pasos.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "leccion__vacio";
    vacio.textContent = "Este nivel todavía no tiene contenido. Volvé al curso y elegí otro nivel.";
    contenedor.appendChild(vacio);
    return;
  }

  const paso = pasos[indice] || pasos[0];

  const divPaso = document.createElement("div");
  divPaso.className = "leccion__paso";

  const numeroPaso = document.createElement("p");
  numeroPaso.className = "leccion__numero";
  numeroPaso.textContent = "Teoría " + (indice + 1) + " de " + pasos.length;
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

  const botonAnterior = document.getElementById("btn-leccion-anterior");
  const botonSiguiente = document.getElementById("btn-leccion-siguiente");

  if (botonAnterior) {
    botonAnterior.disabled = (indice === 0);
  }

  if (botonSiguiente) {
    botonSiguiente.textContent = indice === pasos.length - 1
      ? "✓ Ir al repaso del nivel"
      : "Siguiente teoría →";
  }
}

// Guarda progreso del módulo en la API y en el dispositivo
async function guardarProgresoModulo(usuarioId, moduloId, paso, completado) {
  actualizarProgresoLocal(usuarioId, moduloId, paso, completado);

  await apiPost("progreso/modulo", {
    usuarioId: usuarioId,
    moduloId: moduloId,
    pasoActual: paso,
    completado: completado
  });
}

// ============================================
// ESCUDO DE SEGURIDAD (MINI RETOS)
// ============================================

const RETOS_ESCUDO_DATA = (typeof RETOS_ESCUDO !== "undefined" && Array.isArray(RETOS_ESCUDO))
  ? RETOS_ESCUDO
  : [];

let retosEscudo = [];
let retoActualEscudo = null;
let indiceRetoEscudo = 0;
let aciertosRetoEscudo = 0;
let estadoRetoEscudo = "inicio";
let resultadoRetoEscudo = null;

function mezclarRetos(lista) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temporal = copia[i];
    copia[i] = copia[j];
    copia[j] = temporal;
  }
  return copia;
}

function prepararRetosEscudo() {
  return mezclarRetos(RETOS_ESCUDO_DATA).map(function (reto) {
    const copia = Object.assign({}, reto);
    copia.tipos = mezclarRetos(Array.isArray(reto.tipos) ? reto.tipos : []);
    return copia;
  });
}

function iniciarRetosEscudo(enfocar) {
  retosEscudo = prepararRetosEscudo();
  indiceRetoEscudo = 0;
  aciertosRetoEscudo = 0;
  resultadoRetoEscudo = null;
  retoActualEscudo = retosEscudo[0] || null;
  estadoRetoEscudo = retoActualEscudo ? "decision" : "fin";
  renderizarRetoEscudo(Boolean(enfocar));
}

function crearTarjetaRetoEscudo(reto) {
  const tarjeta = document.createElement("div");
  tarjeta.className = "reto__tarjeta";

  const barra = document.createElement("div");
  barra.className = "reto__app";

  const icono = document.createElement("span");
  icono.className = "reto__app-icono";
  icono.setAttribute("aria-hidden", "true");
  icono.textContent = reto.icono || "📩";
  barra.appendChild(icono);

  const canal = document.createElement("span");
  canal.className = "reto__canal";
  canal.textContent = reto.canal;
  barra.appendChild(canal);

  const hora = document.createElement("span");
  hora.className = "reto__hora";
  hora.textContent = reto.hora || "Ahora";
  barra.appendChild(hora);

  tarjeta.appendChild(barra);

  const cuerpo = document.createElement("div");
  cuerpo.className = "reto__cuerpo-mensaje";

  const etiquetasRemitente = {
    "Correo electrónico": "De: ",
    "Mensaje de texto (SMS)": "De: ",
    "Llamada telefónica": "Llamada de: ",
    "WhatsApp": "De: ",
    "Sitio web": "Sitio: ",
    "Red social": "Perfil: "
  };
  const remitente = document.createElement("p");
  remitente.className = "reto__remitente";
  remitente.textContent = (etiquetasRemitente[reto.canal] || "De: ") + reto.remitente;
  cuerpo.appendChild(remitente);

  if (reto.asunto) {
    const etiquetasAsunto = {
      "Correo electrónico": "Asunto:",
      "Sitio web": "Título:",
      "Red social": "Publicación:"
    };
    const asunto = document.createElement("p");
    asunto.className = "reto__asunto";
    const etiquetaAsunto = document.createElement("span");
    etiquetaAsunto.className = "reto__asunto-etiqueta";
    etiquetaAsunto.textContent = etiquetasAsunto[reto.canal] || "Asunto:";
    asunto.appendChild(etiquetaAsunto);
    asunto.appendChild(document.createTextNode(" " + reto.asunto));
    cuerpo.appendChild(asunto);
  }

  const mensaje = document.createElement("p");
  mensaje.className = "reto__mensaje";
  mensaje.textContent = reto.mensaje;
  cuerpo.appendChild(mensaje);

  if (reto.enlace) {
    const cajaEnlace = document.createElement("div");
    cajaEnlace.className = "reto__enlace-caja";
    const etiquetaEnlace = document.createElement("span");
    etiquetaEnlace.className = "reto__enlace-etiqueta";
    etiquetaEnlace.textContent = "🔗 Enlace";
    const enlace = document.createElement("span");
    enlace.className = "reto__enlace";
    enlace.textContent = reto.enlace;
    enlace.title = "Enlace de ejemplo: no se puede abrir";
    cajaEnlace.appendChild(etiquetaEnlace);
    cajaEnlace.appendChild(enlace);
    cuerpo.appendChild(cajaEnlace);
  }

  if (reto.adjunto) {
    const adjunto = document.createElement("p");
    adjunto.className = "reto__adjunto";
    adjunto.textContent = "📎 " + reto.adjunto;
    cuerpo.appendChild(adjunto);
  }

  const nota = document.createElement("p");
  nota.className = "reto__nota";
  nota.textContent = "Mensaje simulado con fines educativos.";
  cuerpo.appendChild(nota);

  tarjeta.appendChild(cuerpo);
  return tarjeta;
}

function renderizarRetoEscudo(enfocar) {
  const contenedor = document.getElementById("escudo-retos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (retosEscudo.length === 0) {
    const aviso = document.createElement("p");
    aviso.className = "reto__fin-texto";
    aviso.textContent = "No se pudieron cargar los mini retos. Recargá la página e intentá de nuevo.";
    contenedor.appendChild(aviso);
    return;
  }

  if (estadoRetoEscudo === "fin") {
    renderizarFinRetosEscudo(contenedor);
    if (enfocar) {
      const fin = contenedor.querySelector(".reto__fin");
      if (fin) fin.focus();
    }
    return;
  }

  const reto = retoActualEscudo;
  if (!reto) return;

  const completados = indiceRetoEscudo + (estadoRetoEscudo === "resultado" ? 1 : 0);
  const porcentaje = Math.round((completados / retosEscudo.length) * 100);

  const cabecera = document.createElement("div");
  cabecera.className = "reto__cabecera";

  const contador = document.createElement("span");
  contador.className = "reto__contador";
  contador.textContent = "Reto " + (indiceRetoEscudo + 1) + " de " + retosEscudo.length;

  const aciertos = document.createElement("span");
  aciertos.className = "reto__aciertos";
  aciertos.textContent = "Aciertos: " + aciertosRetoEscudo;

  cabecera.appendChild(contador);
  cabecera.appendChild(aciertos);
  contenedor.appendChild(cabecera);

  const barra = document.createElement("div");
  barra.className = "reto__barra";
  barra.setAttribute("role", "progressbar");
  barra.setAttribute("aria-label", "Avance de los mini retos");
  barra.setAttribute("aria-valuemin", "0");
  barra.setAttribute("aria-valuemax", String(retosEscudo.length));
  barra.setAttribute("aria-valuenow", String(completados));

  const relleno = document.createElement("div");
  relleno.className = "reto__barra-relleno";
  relleno.style.width = porcentaje + "%";
  barra.appendChild(relleno);
  contenedor.appendChild(barra);

  contenedor.appendChild(crearTarjetaRetoEscudo(reto));

  if (estadoRetoEscudo === "resultado" && resultadoRetoEscudo) {
    const acertado = resultadoRetoEscudo.acertado;
    const caja = document.createElement("div");
    caja.className = "reto__feedback" + (acertado ? "" : " reto__feedback--error");
    caja.tabIndex = -1;

    const titulo = document.createElement("p");
    titulo.className = "reto__feedback-titulo";
    if (acertado) {
      titulo.textContent = "✅ ¡Correcto!";
    } else if (reto.esEstafa) {
      titulo.textContent = "❌ Ojo: era una estafa";
    } else {
      titulo.textContent = "❌ Era un mensaje confiable";
    }
    caja.appendChild(titulo);

    const texto = document.createElement("p");
    texto.className = "reto__feedback-texto";
    texto.textContent = reto.explicacion;
    caja.appendChild(texto);

    if (reto.esEstafa && reto.tipo) {
      const tipo = document.createElement("p");
      tipo.className = "reto__feedback-texto";
      const etiquetaTipo = document.createElement("strong");
      etiquetaTipo.textContent = "Tipo de estafa: ";
      tipo.appendChild(etiquetaTipo);
      tipo.appendChild(document.createTextNode(reto.tipo));
      caja.appendChild(tipo);
    }

    if (!acertado && resultadoRetoEscudo.tipoElegido) {
      const elegido = document.createElement("p");
      elegido.className = "reto__feedback-texto reto__feedback-texto--elegido";
      const etiquetaElegido = document.createElement("strong");
      etiquetaElegido.textContent = "Tu respuesta: ";
      elegido.appendChild(etiquetaElegido);
      elegido.appendChild(document.createTextNode(resultadoRetoEscudo.tipoElegido));
      caja.appendChild(elegido);
    }

    if (Array.isArray(reto.senales) && reto.senales.length > 0) {
      const bloqueSenales = document.createElement("div");
      bloqueSenales.className = "reto__senales" + (reto.esEstafa ? " reto__senales--estafa" : " reto__senales--confiable");

      const tituloSenales = document.createElement("p");
      tituloSenales.className = "reto__senales-titulo";
      tituloSenales.textContent = reto.esEstafa
        ? "🔎 Señales para detectarlo"
        : "🔎 Por qué es confiable";
      bloqueSenales.appendChild(tituloSenales);

      const listaSenales = document.createElement("ul");
      listaSenales.className = "reto__senales-lista";
      reto.senales.forEach(function (senal) {
        const item = document.createElement("li");
        item.textContent = senal;
        listaSenales.appendChild(item);
      });
      bloqueSenales.appendChild(listaSenales);
      caja.appendChild(bloqueSenales);
    }

    const consejo = document.createElement("div");
    consejo.className = "reto__consejo";
    const etiquetaConsejo = document.createElement("strong");
    etiquetaConsejo.textContent = "🔒 Qué hacer: ";
    consejo.appendChild(etiquetaConsejo);
    consejo.appendChild(document.createTextNode(reto.consejo));
    caja.appendChild(consejo);

    contenedor.appendChild(caja);

    const siguiente = document.createElement("button");
    siguiente.type = "button";
    siguiente.className = "btn btn--primario reto__siguiente";
    siguiente.textContent = indiceRetoEscudo === retosEscudo.length - 1
      ? "Ver mi resultado →"
      : "Siguiente reto →";
    siguiente.addEventListener("click", siguienteRetoEscudo);
    contenedor.appendChild(siguiente);

    if (enfocar) caja.focus();
    return;
  }

  if (estadoRetoEscudo === "tipo") {
    const pregunta = document.createElement("p");
    pregunta.className = "reto__pregunta";
    pregunta.textContent = "¿De qué tipo de estafa se trata?";
    contenedor.appendChild(pregunta);

    const tipos = document.createElement("div");
    tipos.className = "reto__tipos";

    reto.tipos.forEach(function (opcion, indice) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "btn btn--secundario reto__tipo";

      const letra = document.createElement("span");
      letra.className = "reto__letra";
      letra.setAttribute("aria-hidden", "true");
      letra.textContent = String.fromCharCode(65 + indice);

      const etiqueta = document.createElement("span");
      etiqueta.className = "reto__tipo-texto";
      etiqueta.textContent = opcion.texto;

      boton.appendChild(letra);
      boton.appendChild(etiqueta);
      boton.addEventListener("click", function () {
        elegirTipoReto(indice);
      });
      tipos.appendChild(boton);
    });

    contenedor.appendChild(tipos);

    if (enfocar) {
      const primero = tipos.querySelector("button");
      if (primero) primero.focus();
    }
    return;
  }

  const pregunta = document.createElement("p");
  pregunta.className = "reto__pregunta";
  pregunta.textContent = "¿Esta situación es una estafa?";
  contenedor.appendChild(pregunta);

  const acciones = document.createElement("div");
  acciones.className = "reto__acciones";

  const botonEstafa = document.createElement("button");
  botonEstafa.type = "button";
  botonEstafa.className = "btn btn--primario reto__opcion";
  botonEstafa.textContent = "🚨 Sí, es una estafa";
  botonEstafa.addEventListener("click", function () {
    elegirDecisionReto(true);
  });

  const botonConfiable = document.createElement("button");
  botonConfiable.type = "button";
  botonConfiable.className = "btn btn--secundario reto__opcion";
  botonConfiable.textContent = "✅ No, es confiable";
  botonConfiable.addEventListener("click", function () {
    elegirDecisionReto(false);
  });

  acciones.appendChild(botonEstafa);
  acciones.appendChild(botonConfiable);
  contenedor.appendChild(acciones);

  const ayuda = document.createElement("p");
  ayuda.className = "reto__ayuda";
  ayuda.textContent = "Revisá el remitente, el asunto, el enlace y lo que te piden. Desconfiá de la urgencia, de los premios y de los datos bancarios.";
  contenedor.appendChild(ayuda);

  if (enfocar) botonEstafa.focus();
}

function elegirDecisionReto(indicaEstafa) {
  const reto = retoActualEscudo;
  if (!reto || estadoRetoEscudo !== "decision") return;

  if (reto.esEstafa && indicaEstafa) {
    estadoRetoEscudo = "tipo";
    renderizarRetoEscudo(true);
    return;
  }

  const acertado = !reto.esEstafa && !indicaEstafa;
  if (acertado) aciertosRetoEscudo += 1;
  resultadoRetoEscudo = { acertado: acertado, tipoElegido: "" };
  estadoRetoEscudo = "resultado";
  renderizarRetoEscudo(true);
}

function elegirTipoReto(indice) {
  const reto = retoActualEscudo;
  if (!reto || estadoRetoEscudo !== "tipo" || !reto.tipos[indice]) return;

  const opcion = reto.tipos[indice];
  const acertado = Boolean(opcion.correcto);
  if (acertado) aciertosRetoEscudo += 1;
  resultadoRetoEscudo = { acertado: acertado, tipoElegido: opcion.texto };
  estadoRetoEscudo = "resultado";
  renderizarRetoEscudo(true);
}

function siguienteRetoEscudo() {
  if (indiceRetoEscudo >= retosEscudo.length - 1) {
    estadoRetoEscudo = "fin";
    retoActualEscudo = null;
    resultadoRetoEscudo = null;
    renderizarRetoEscudo(true);
    return;
  }

  indiceRetoEscudo += 1;
  retoActualEscudo = retosEscudo[indiceRetoEscudo];
  resultadoRetoEscudo = null;
  estadoRetoEscudo = "decision";
  renderizarRetoEscudo(true);
}

function mensajeFinRetosEscudo(aciertos, total) {
  const proporcion = total > 0 ? aciertos / total : 0;
  if (proporcion >= 0.85) {
    return "Excelente: reconocés muy bien las señales de estafa y sabés qué hacer. Seguí así y compartí estos consejos con tu familia.";
  }
  if (proporcion >= 0.6) {
    return "Muy bien: detectaste la mayoría de las estafas. Repasá los casos que fallaste y volvé a intentarlo cuando quieras.";
  }
  return "Buen comienzo: las estafas cambian de forma. Leé con calma el remitente, desconfiá de la urgencia y volvé a practicar.";
}

function renderizarFinRetosEscudo(contenedor) {
  const total = retosEscudo.length;

  const fin = document.createElement("div");
  fin.className = "reto__fin";
  fin.tabIndex = -1;

  const titulo = document.createElement("h3");
  titulo.className = "reto__fin-titulo";
  titulo.textContent = "🛡️ ¡Terminaste los mini retos!";
  fin.appendChild(titulo);

  const puntaje = document.createElement("p");
  puntaje.className = "reto__fin-puntaje";
  const porcentaje = total > 0 ? Math.round((aciertosRetoEscudo / total) * 100) : 0;
  puntaje.textContent = "Acertaste " + aciertosRetoEscudo + " de " + total + " (" + porcentaje + "%)";
  fin.appendChild(puntaje);

  const texto = document.createElement("p");
  texto.className = "reto__fin-texto";
  texto.textContent = mensajeFinRetosEscudo(aciertosRetoEscudo, total);
  fin.appendChild(texto);

  const tipos = [];
  retosEscudo.forEach(function (reto) {
    if (reto.esEstafa && reto.tipo && tipos.indexOf(reto.tipo) === -1) {
      tipos.push(reto.tipo);
    }
  });

  if (tipos.length > 0) {
    const lista = document.createElement("p");
    lista.className = "reto__fin-tipos";
    lista.textContent = "Tipos de estafa que practicaste: " + tipos.join(", ") + ".";
    fin.appendChild(lista);
  }

  const reiniciar = document.createElement("button");
  reiniciar.type = "button";
  reiniciar.className = "btn btn--primario reto__reiniciar";
  reiniciar.textContent = "Volver a empezar";
  reiniciar.addEventListener("click", function () {
    iniciarRetosEscudo(true);
  });
  fin.appendChild(reiniciar);

  contenedor.appendChild(fin);
}

// ============================================
// EXAMEN RÁPIDO (AL FINAL DE CADA NIVEL)
// ============================================

let moduloExamenActual = null;

function iniciarExamen(modulo) {
  if (!modulo || !Array.isArray(modulo.examen) || modulo.examen.length === 0) return;

  moduloExamenActual = modulo;

  asignarTexto("examen-titulo", "Repaso del Nivel " + modulo.numero + ": " + modulo.titulo);
  asignarTexto(
    "examen-subtitulo",
    "Curso " + modulo.cursoId + ": " + modulo.cursoTitulo + " · " + modulo.nivelComprension +
      " · " + modulo.examen.length + " preguntas"
  );

  const contenedorResultado = document.getElementById("examen-resultado");
  if (contenedorResultado) contenedorResultado.hidden = true;

  const btnEnviar = document.getElementById("btn-enviar-examen");
  if (btnEnviar) btnEnviar.hidden = false;

  renderizarPreguntasTest("contenedor-examen", modulo.examen);

  MAPA_NAVEGACION["pantalla-examen"][3].etiqueta =
    "Curso " + modulo.cursoId + ": " + modulo.cursoTitulo;
  MAPA_NAVEGACION["pantalla-examen"][4].etiqueta =
    "Repaso del Nivel " + modulo.numero;

  mostrarPantalla("pantalla-examen");
}

async function enviarExamen(usuarioId, respuestas) {
  const modulo = moduloExamenActual;
  const preguntas = modulo && Array.isArray(modulo.examen) ? modulo.examen : [];
  const moduloId = modulo ? modulo.id : null;

  let puntaje = 0;
  respuestas.forEach(function (r) {
    if (r === "correcto") puntaje++;
  });

  const datos = {
    puntaje: puntaje,
    total_preguntas: preguntas.length,
    modulo_id: moduloId,
    curso_id: modulo ? modulo.cursoId : null,
    curso_titulo: modulo ? modulo.cursoTitulo : "",
    nivel_numero: modulo ? modulo.numero : null,
    nivel_nombre: modulo ? modulo.nivelComprension : "",
    titulo: modulo ? "Nivel " + modulo.numero + ": " + modulo.titulo : "",
    creado_en: new Date().toISOString()
  };

  let desdeApi = false;
  if (moduloId) {
    const resultado = await apiPost("progreso/examen", {
      usuarioId: usuarioId,
      moduloId: moduloId,
      respuestas: respuestas,
      puntaje: puntaje,
      totalPreguntas: preguntas.length
    });
    desdeApi = Boolean(resultado.exito);
  }

  guardarLocal(claveExamenCache(usuarioId), datos);
  if (moduloId) guardarLocal(claveExamenCache(usuarioId) + ":" + moduloId, datos);

  if (moduloId) {
    const pasos = Array.isArray(modulo.pasos) ? modulo.pasos.length : 1;
    await guardarProgresoModulo(usuarioId, moduloId, pasos, true);
  }

  return { exito: true, puntaje: puntaje, total: preguntas.length, desdeApi: desdeApi };
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
  let modulos = [];

  // Intenta cargar desde la API
  const resultadoProgreso = await apiGet("progreso/" + sesion.id);
  if (resultadoProgreso.exito && resultadoProgreso.datos) {
    testInicial = resultadoProgreso.datos.testInicial;
    examen = resultadoProgreso.datos.examen;
    modulos = Array.isArray(resultadoProgreso.datos.modulos) ? resultadoProgreso.datos.modulos : [];
  } else {
    // Fallback: usa lo guardado en el dispositivo
    testInicial = leerLocal(claveTestCache(sesion.id), null);
    examen = leerLocal(claveExamenCache(sesion.id), null);
  }

  aplicarProgresoModulos(modulos, sesion.id);
  modulos = progresoModulosCache.slice();

  contenedor.innerHTML = "";

  // Sección: Avance por curso
  const seccionCursos = document.createElement("div");
  seccionCursos.className = "progreso__seccion";

  const tituloCursos = document.createElement("h3");
  tituloCursos.className = "progreso__titulo-seccion";
  tituloCursos.textContent = "Avance por curso";
  seccionCursos.appendChild(tituloCursos);

  const nivelesCompletados = modulos.filter(function (fila) {
    return Boolean(fila.completado) && Boolean(buscarNivelPorId(fila.modulo_id));
  }).length;

  const resumenCursos = document.createElement("p");
  resumenCursos.className = "progreso__nivel";
  resumenCursos.textContent =
    "Niveles completados: " + nivelesCompletados + " de " + TOTAL_NIVELES_CAMPUS +
    " (" + CURSOS.length + " cursos con " + TOTAL_NIVELES_POR_CURSO + " niveles cada uno).";
  seccionCursos.appendChild(resumenCursos);

  CURSOS.forEach(function (curso) {
    const completados = nivelesCompletadosDeCurso(curso.id);
    const detalle = document.createElement("div");
    detalle.className = "progreso__curso";

    const nombre = document.createElement("p");
    nombre.className = "progreso__curso-nombre";
    nombre.textContent = curso.icono + " Curso " + curso.id + ": " + curso.titulo;
    detalle.appendChild(nombre);

    detalle.appendChild(crearBarraDeProgreso(
      completados,
      curso.modulos.length,
      "progreso__barra--curso",
      "",
      "Niveles"
    ));

    seccionCursos.appendChild(detalle);
  });

  if (nivelesCompletados === 0) {
    const sinCursos = document.createElement("p");
    sinCursos.className = "progreso__mensaje";
    sinCursos.textContent = "Todavía no completaste ningún nivel. Entrá al Campus Educativo y empezá por el Curso 1.";
    seccionCursos.appendChild(sinCursos);
  }

  contenedor.appendChild(seccionCursos);

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

  // Sección: Último repaso rendido
  const seccionExamen = document.createElement("div");
  seccionExamen.className = "progreso__seccion";

  const tituloExamen = document.createElement("h3");
  tituloExamen.className = "progreso__titulo-seccion";
  tituloExamen.textContent = "Último repaso de nivel";
  seccionExamen.appendChild(tituloExamen);

  if (examen) {
    const nivelDelExamen = buscarNivelPorId(examen.modulo_id);
    const porcentajeExamen = Math.round((examen.puntaje / examen.total_preguntas) * 100);

    const referencia = document.createElement("div");
    referencia.className = "progreso__nivel";
    referencia.textContent = nivelDelExamen
      ? "Curso " + nivelDelExamen.curso.id + ": " + nivelDelExamen.curso.titulo +
        " · Nivel " + nivelDelExamen.modulo.numero + ": " + nivelDelExamen.modulo.titulo
      : "Nivel " + examen.modulo_id;
    seccionExamen.appendChild(referencia);

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
        textoComparacion = "Repasá el nivel para reforzar tus conocimientos. 💪";
      }
      comparacion.textContent = textoComparacion;
      seccionExamen.appendChild(comparacion);
    }
  } else {
    const sinExamen = document.createElement("p");
    sinExamen.className = "progreso__mensaje";
    sinExamen.textContent = "Todavía no rendiste ningún repaso de nivel. Cada nivel termina con 6 preguntas rápidas.";
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

function crearBarraDeProgreso(valor, total, claseColor, textoSuperior, etiqueta) {
  const wrapper = document.createElement("div");

  const etiquetaEl = document.createElement("div");
  etiquetaEl.className = "progreso__etiqueta";

  const labelIzq = document.createElement("span");
  labelIzq.textContent = etiqueta || "Progreso";
  etiquetaEl.appendChild(labelIzq);

  const labelDer = document.createElement("span");
  labelDer.textContent = valor + " / " + total;
  etiquetaEl.appendChild(labelDer);

  wrapper.appendChild(etiquetaEl);

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
// CAMPUS EDUCATIVO: CURSOS Y NIVELES DE COMPRENSIÓN
// Cada curso tiene 4 niveles (Descubrir, Comprender, Practicar,
// Dominar y proteger). El contenido vive en contenido-cursos.js.
// ============================================

const CURSOS = (typeof CONTENIDO_CURSOS !== "undefined" && Array.isArray(CONTENIDO_CURSOS))
  ? CONTENIDO_CURSOS
  : [];

const GUIA_NIVELES = (typeof NIVELES_COMPRENSION !== "undefined" && Array.isArray(NIVELES_COMPRENSION))
  ? NIVELES_COMPRENSION
  : [];

// Teorías complementarias por nivel (clave "101" a "504").
// Se suman a las 4 teorías base de contenido-cursos.js hasta llegar a 10.
const TEORIAS_POR_NIVEL = (typeof TEORIAS_EXTRA !== "undefined" && TEORIAS_EXTRA && typeof TEORIAS_EXTRA === "object")
  ? TEORIAS_EXTRA
  : {};

// Preguntas adicionales del repaso (clave "101" a "504").
// Se suman a las 3 preguntas base de cada nivel para llegar a 6.
const PREGUNTAS_POR_NIVEL = (typeof PREGUNTAS_EXTRA !== "undefined" && PREGUNTAS_EXTRA && typeof PREGUNTAS_EXTRA === "object")
  ? PREGUNTAS_EXTRA
  : {};

const TOTAL_NIVELES_POR_CURSO = 4;

const TOTAL_NIVELES_CAMPUS = CURSOS.reduce(function (total, curso) {
  return total + (Array.isArray(curso.modulos) ? curso.modulos.length : 0);
}, 0);

const ETIQUETAS_TEMA = {
  movil: "Celular y aplicaciones",
  redes: "Internet y privacidad",
  tramites: "Trámites y organismos oficiales",
  fraudes: "Prevención de estafas",
  comunicacion: "Mensajes y videollamadas"
};

// Un mini trabajo por curso y por nivel de usuario. El texto es simple y accionable.
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
let progresoModulosCache = [];
let cursosCache = CURSOS.map(function (curso) { return crearCursoCache(curso); });
let nivelTrabajos = null;
let miniTrabajosCache = [];

function crearCursoCache(curso) {
  return {
    id: curso.id,
    titulo: curso.titulo,
    resumen: curso.resumen,
    icono: curso.icono,
    tema: curso.tema,
    nivel: curso.nivel,
    duracion: curso.duracion,
    totalNiveles: Array.isArray(curso.modulos) ? curso.modulos.length : 0,
    nivelesCompletados: 0
  };
}

function idNivelCurso(cursoId, numero) {
  return Number(cursoId) * 100 + Number(numero);
}

function buscarCurso(cursoId) {
  return CURSOS.find(function (curso) {
    return Number(curso.id) === Number(cursoId);
  }) || null;
}

function buscarNivelPorId(moduloId) {
  const id = Number(moduloId);
  for (let i = 0; i < CURSOS.length; i++) {
    const curso = CURSOS[i];
    const modulos = Array.isArray(curso.modulos) ? curso.modulos : [];
    for (let j = 0; j < modulos.length; j++) {
      if (idNivelCurso(curso.id, modulos[j].numero) === id) {
        return { curso: curso, modulo: modulos[j] };
      }
    }
  }
  return null;
}

function nombreNivel(modulo) {
  return "Nivel " + modulo.numero + " · " + modulo.nivelComprension;
}

// Une las 4 teorías base con las 6 complementarias del archivo contenido-teorias.js.
function teoriasDelNivel(cursoId, modulo) {
  const base = Array.isArray(modulo.pasos) ? modulo.pasos.slice() : [];
  const extras = TEORIAS_POR_NIVEL[String(idNivelCurso(cursoId, modulo.numero))];
  return Array.isArray(extras) ? base.concat(extras) : base;
}

// Une las 3 preguntas base con las 3 complementarias del archivo contenido-repaso.js.
function examenDelNivel(cursoId, modulo) {
  const base = Array.isArray(modulo.examen) ? modulo.examen.slice() : [];
  const extras = PREGUNTAS_POR_NIVEL[String(idNivelCurso(cursoId, modulo.numero))];
  return Array.isArray(extras) ? base.concat(extras) : base;
}

// El avance guardado en el dispositivo se suma al de la API: nunca se pierde
// un nivel completado por una respuesta vieja o por estar sin conexión.
function leerProgresoLocal(usuarioId) {
  const filas = leerLocal(claveProgresoCache(usuarioId), []);
  return Array.isArray(filas) ? filas : [];
}

function guardarProgresoLocal(usuarioId) {
  if (!usuarioId) return;
  guardarLocal(claveProgresoCache(usuarioId), progresoModulosCache);
}

function combinarProgreso(remotos, usuarioId) {
  const mapa = new Map();

  (Array.isArray(remotos) ? remotos : []).forEach(function (fila) {
    if (!fila || !fila.modulo_id) return;
    mapa.set(Number(fila.modulo_id), {
      modulo_id: Number(fila.modulo_id),
      paso_actual: Number(fila.paso_actual) || 0,
      completado: Boolean(fila.completado)
    });
  });

  leerProgresoLocal(usuarioId).forEach(function (fila) {
    if (!fila || !fila.modulo_id) return;
    const id = Number(fila.modulo_id);
    const previo = mapa.get(id);
    mapa.set(id, {
      modulo_id: id,
      paso_actual: Math.max(previo ? previo.paso_actual : 0, Number(fila.paso_actual) || 0),
      completado: Boolean(previo && previo.completado) || Boolean(fila.completado)
    });
  });

  return Array.from(mapa.values());
}

function aplicarProgresoModulos(remotos, usuarioId) {
  progresoModulosCache = combinarProgreso(remotos, usuarioId);
  guardarProgresoLocal(usuarioId);
  refrescarAvanceCursos();
}

function actualizarProgresoLocal(usuarioId, moduloId, paso, completado) {
  const fila = progresoModulosCache.find(function (registro) {
    return Number(registro.modulo_id) === Number(moduloId);
  });
  const pasoNumero = Number(paso) || 0;

  if (fila) {
    fila.paso_actual = Math.max(Number(fila.paso_actual) || 0, pasoNumero);
    fila.completado = Boolean(fila.completado) || Boolean(completado);
  } else {
    progresoModulosCache.push({
      modulo_id: Number(moduloId),
      paso_actual: pasoNumero,
      completado: Boolean(completado)
    });
  }

  guardarProgresoLocal(usuarioId);
  refrescarAvanceCursos();
}

// Un nivel se abre al completar el anterior. El Nivel 1 siempre está abierto,
// y un nivel ya completado se puede repasar aunque sea de un curso anterior.
function nivelDesbloqueado(cursoId, numero) {
  if (Number(numero) <= 1) return true;
  if (nivelEstaCompletado(idNivelCurso(cursoId, numero))) return true;
  return nivelEstaCompletado(idNivelCurso(cursoId, Number(numero) - 1));
}

function nivelEstaCompletado(moduloId) {
  return progresoModulosCache.some(function (fila) {
    return Number(fila.modulo_id) === Number(moduloId) && Boolean(fila.completado);
  });
}

function nivelesCompletadosDeCurso(cursoId) {
  const curso = buscarCurso(cursoId);
  if (!curso || !Array.isArray(curso.modulos)) return 0;
  return curso.modulos.reduce(function (total, modulo) {
    return total + (nivelEstaCompletado(idNivelCurso(curso.id, modulo.numero)) ? 1 : 0);
  }, 0);
}

function refrescarAvanceCursos() {
  cursosCache.forEach(function (curso) {
    curso.nivelesCompletados = nivelesCompletadosDeCurso(curso.id);
  });
}

// Evita que los datos de una cuenta queden visibles al entrar con otra.
function reiniciarDatosDeSesion() {
  cursosCache = CURSOS.map(function (curso) { return crearCursoCache(curso); });
  progresoModulosCache = [];
  miniTrabajosCache = [];
  nivelTrabajos = null;
  filtroCampusNivel = false;
  cursoActual = null;
  moduloActual = null;
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

function asignarTexto(id, texto) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = texto;
}

async function renderizarCampus() {
  const lista = document.getElementById("lista-modulos");
  if (!lista) return;

  // Muestra el catálogo local al instante y luego lo completa con la API.
  renderizarListaCampus(cursosCache);

  const cargar = [apiGet("cursos")];
  const sesion = obtenerSesion();
  if (sesion) cargar.push(apiGet("usuarios/" + sesion.id + "/progreso"));

  const respuestas = await Promise.all(cargar);
  const resultadoCursos = respuestas[0];
  const resultadoProgreso = respuestas[1];

  const cursosApi = resultadoCursos.exito && Array.isArray(resultadoCursos.datos)
    ? resultadoCursos.datos
    : [];

  cursosCache = CURSOS.map(function (base) {
    const api = cursosApi.find(function (m) { return Number(m.id) === Number(base.id); });
    return {
      id: base.id,
      titulo: api && api.titulo ? api.titulo : base.titulo,
      resumen: base.resumen,
      icono: base.icono,
      tema: base.tema,
      nivel: api && api.nivel ? api.nivel : base.nivel,
      duracion: base.duracion,
      totalNiveles: Array.isArray(base.modulos) ? base.modulos.length : 0,
      nivelesCompletados: 0
    };
  });

  aplicarProgresoModulos(
    resultadoProgreso && resultadoProgreso.exito && resultadoProgreso.datos
      ? resultadoProgreso.datos.modulos
      : [],
    sesion ? sesion.id : null
  );

  renderizarListaCampus(cursosCache);
}

function renderizarListaCampus(cursos) {
  const lista = document.getElementById("lista-modulos");
  if (!lista) return;

  const sesion = obtenerSesion();
  const nivelCrudo = sesion ? String(sesion.nivelDigital || "").toLowerCase() : "";
  const nivelUsuario = sesion ? normalizarNivel(sesion.nivelDigital) : null;
  const visibles = filtroCampusNivel && nivelUsuario
    ? (nivelCrudo === "protegido"
        ? cursos
        : cursos.filter(function (curso) { return normalizarNivel(curso.nivel) === nivelUsuario; }))
    : cursos;

  lista.innerHTML = "";

  if (visibles.length === 0) {
    const vacio = document.createElement("li");
    vacio.className = "lista-modulos__vacio";
    vacio.textContent = "Todavía no hay cursos para tu nivel. Probá con «Todos».";
    lista.appendChild(vacio);
    return;
  }

  visibles.forEach(function (curso) {
    const item = document.createElement("li");
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "modulo modulo--disponible";

    const icono = document.createElement("span");
    icono.className = "modulo__icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = curso.icono || "📘";
    boton.appendChild(icono);

    const info = document.createElement("span");
    info.className = "modulo__info";

    const nombre = document.createElement("span");
    nombre.className = "modulo__nombre";
    nombre.textContent = "Curso " + curso.id + ": " + curso.titulo;
    info.appendChild(nombre);

    const completo = curso.totalNiveles > 0 && curso.nivelesCompletados >= curso.totalNiveles;
    const estado = document.createElement("span");
    estado.className = "modulo__estado" + (completo || curso.nivelesCompletados > 0 ? " modulo__estado--disponible" : "");
    if (completo) {
      estado.textContent = "✓ Curso completado";
    } else if (curso.nivelesCompletados > 0) {
      estado.textContent = curso.nivelesCompletados + " de " + curso.totalNiveles + " niveles completados";
    } else {
      estado.textContent = curso.totalNiveles + " niveles · " + curso.duracion + " min · Nivel " + formatearNivel(curso.nivel);
    }
    info.appendChild(estado);

    const barra = document.createElement("span");
    barra.className = "modulo__barra";
    barra.setAttribute("aria-hidden", "true");
    const relleno = document.createElement("span");
    relleno.className = "modulo__barra-relleno";
    const porcentaje = curso.totalNiveles > 0
      ? Math.round((curso.nivelesCompletados / curso.totalNiveles) * 100)
      : 0;
    relleno.style.width = porcentaje + "%";
    barra.appendChild(relleno);
    info.appendChild(barra);

    boton.appendChild(info);
    boton.addEventListener("click", function () {
      abrirCurso(curso);
    });

    item.appendChild(boton);
    lista.appendChild(item);
  });
}

async function abrirCurso(curso) {
  if (!curso) return;

  renderizarCurso(curso);
  mostrarPantalla("pantalla-curso");

  const sesion = obtenerSesion();
  if (!sesion) return;

  const resultado = await apiGet("usuarios/" + sesion.id + "/progreso");
  aplicarProgresoModulos(
    resultado.exito && resultado.datos ? resultado.datos.modulos : [],
    sesion.id
  );
  renderizarCurso(curso);
}

function renderizarCurso(curso) {
  const detalle = buscarCurso(curso.id);
  if (!detalle) return;

  cursoActual = curso;

  asignarTexto("curso-etiqueta", "Curso " + detalle.id);
  asignarTexto("curso-titulo", detalle.titulo);
  asignarTexto("curso-resumen", detalle.resumen || "");

  const meta = document.getElementById("curso-meta");
  if (meta) {
    meta.innerHTML = "";
    const etiquetas = [
      "📚 " + detalle.modulos.length + " niveles",
      "📖 " + teoriasDelNivel(detalle.id, detalle.modulos[0]).length + " teorías por nivel",
      "⏱️ " + detalle.duracion + " min en total",
      "🎯 Nivel " + formatearNivel(detalle.nivel)
    ];
    etiquetas.forEach(function (texto) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = texto;
      meta.appendChild(badge);
    });

    if (detalle.porQueImporta) {
      const porque = document.createElement("p");
      porque.className = "curso__porque";
      porque.textContent = "Por qué importa: " + detalle.porQueImporta;
      meta.appendChild(porque);
    }
  }

  const guia = document.getElementById("curso-niveles-guia");
  if (guia) {
    guia.innerHTML = "";
    GUIA_NIVELES.forEach(function (nivel) {
      const item = document.createElement("li");
      const titulo = document.createElement("strong");
      titulo.textContent = "Nivel " + nivel.numero + " · " + nivel.etiqueta + ": ";
      item.appendChild(titulo);
      item.appendChild(document.createTextNode(nivel.descripcion));
      guia.appendChild(item);
    });
  }

  const lista = document.getElementById("lista-niveles-curso");
  if (lista) {
    lista.innerHTML = "";

    detalle.modulos.forEach(function (modulo) {
      const moduloId = idNivelCurso(detalle.id, modulo.numero);
      const hecho = nivelEstaCompletado(moduloId);
      const bloqueado = !nivelDesbloqueado(detalle.id, modulo.numero);

      const tarjeta = document.createElement("article");
      tarjeta.className = "nivel-card" +
        (hecho ? " nivel-card--hecho" : "") +
        (bloqueado ? " nivel-card--bloqueado" : "");

      const numero = document.createElement("span");
      numero.className = "nivel-card__numero";
      numero.setAttribute("aria-hidden", "true");
      numero.textContent = modulo.numero;
      tarjeta.appendChild(numero);

      const cuerpo = document.createElement("div");
      cuerpo.className = "nivel-card__cuerpo";

      const etiqueta = document.createElement("p");
      etiqueta.className = "nivel-card__etiqueta";
      etiqueta.textContent = "Nivel " + modulo.numero + " · " + modulo.nivelComprension;
      cuerpo.appendChild(etiqueta);

      const titulo = document.createElement("h4");
      titulo.className = "nivel-card__titulo";
      titulo.textContent = modulo.titulo;
      cuerpo.appendChild(titulo);

      const subtitulo = document.createElement("p");
      subtitulo.className = "nivel-card__texto";
      subtitulo.textContent = modulo.subtitulo;
      cuerpo.appendChild(subtitulo);

      const metaNivel = document.createElement("p");
      metaNivel.className = "nivel-card__meta";
      if (bloqueado) {
        metaNivel.textContent = "🔒 Completá el Nivel " + (modulo.numero - 1) + " para desbloquear este nivel.";
      } else {
        const teorias = teoriasDelNivel(detalle.id, modulo).length;
        const preguntas = examenDelNivel(detalle.id, modulo).length;
        metaNivel.textContent = "⏱️ " + modulo.duracion + " min · " + teorias + " teorías · " +
          (hecho ? "✓ Completado" : preguntas + " preguntas de repaso");
      }
      cuerpo.appendChild(metaNivel);

      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "btn " + (hecho ? "btn--secundario" : "btn--primario") + " nivel-card__boton";
      boton.textContent = bloqueado
        ? "🔒 Primero completá el Nivel " + (modulo.numero - 1)
        : (hecho ? "Repasar nivel" : "Empezar nivel");
      boton.disabled = bloqueado;
      if (bloqueado) {
        boton.title = "Este nivel se abre cuando completes el Nivel " + (modulo.numero - 1) + ".";
      }
      boton.addEventListener("click", function () {
        iniciarNivel(detalle, modulo);
      });
      cuerpo.appendChild(boton);

      tarjeta.appendChild(cuerpo);
      lista.appendChild(tarjeta);
    });
  }

  MAPA_NAVEGACION["pantalla-curso"][3].etiqueta = "Curso " + detalle.id + ": " + detalle.titulo;
}

function iniciarNivel(curso, modulo) {
  const detalle = buscarCurso(curso.id);
  if (!detalle) return;

  if (!nivelDesbloqueado(detalle.id, modulo.numero)) {
    mostrarMensaje(
      "🔒 Para entrar al Nivel " + modulo.numero + " primero tenés que completar el Nivel " +
        (modulo.numero - 1) + ", incluido su repaso final.",
      4500
    );
    return;
  }

  cursoActual = curso;
  moduloActual = {
    id: idNivelCurso(detalle.id, modulo.numero),
    cursoId: detalle.id,
    cursoTitulo: detalle.titulo,
    tema: detalle.tema,
    numero: modulo.numero,
    titulo: modulo.titulo,
    nivelComprension: modulo.nivelComprension,
    subtitulo: modulo.subtitulo,
    objetivo: modulo.objetivo,
    objetivos: modulo.objetivos || [],
    pasos: teoriasDelNivel(detalle.id, modulo),
    glosario: modulo.glosario || [],
    examen: examenDelNivel(detalle.id, modulo)
  };

  indicePasoActual = 0;
  actualizarEncabezadoLeccion();
  renderizarPasoLeccion(0);
  mostrarPantalla("pantalla-leccion");
}

function actualizarEncabezadoLeccion() {
  if (!moduloActual) return;

  asignarTexto("leccion-tema-etiqueta", "Curso " + moduloActual.cursoId + ": " + moduloActual.cursoTitulo);
  asignarTexto("leccion-titulo", "Nivel " + moduloActual.numero + ": " + moduloActual.titulo);
  asignarTexto("leccion-nivel-badge", "Nivel " + moduloActual.numero + " de " + TOTAL_NIVELES_POR_CURSO + " · " + moduloActual.nivelComprension);
  asignarTexto("leccion-objetivo", moduloActual.objetivo || "");

  const listaObjetivos = document.getElementById("leccion-objetivos");
  if (listaObjetivos) {
    listaObjetivos.innerHTML = "";
    (moduloActual.objetivos || []).forEach(function (objetivo) {
      const item = document.createElement("li");
      item.textContent = objetivo;
      listaObjetivos.appendChild(item);
    });
  }

  const glosario = document.getElementById("leccion-glosario");
  if (glosario) {
    glosario.innerHTML = "";
    (moduloActual.glosario || []).forEach(function (entrada) {
      const termino = document.createElement("dt");
      termino.textContent = entrada.termino;
      const definicion = document.createElement("dd");
      definicion.textContent = entrada.definicion;
      glosario.appendChild(termino);
      glosario.appendChild(definicion);
    });
  }

  MAPA_NAVEGACION["pantalla-leccion"][3].etiqueta = "Curso " + moduloActual.cursoId + ": " + moduloActual.cursoTitulo;
  MAPA_NAVEGACION["pantalla-leccion"][4].etiqueta = "Nivel " + moduloActual.numero + ": " + moduloActual.titulo;
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
  const remotos = resultado.exito && resultado.datos && Array.isArray(resultado.datos.miniTrabajos)
    ? resultado.datos.miniTrabajos
    : [];
  miniTrabajosCache = combinarMiniTrabajos(remotos, sesion.id);
  guardarLocal(claveMiniTrabajosCache(sesion.id), miniTrabajosCache);

  renderizarListaTrabajos();
}

// Los trabajos hechos sin conexión se guardan en el dispositivo y se suman
// a los que devuelve la API cuando vuelve a estar disponible.
function combinarMiniTrabajos(remotos, usuarioId) {
  const locales = leerLocal(claveMiniTrabajosCache(usuarioId), []);
  const mapa = new Map();

  remotos.forEach(function (trabajo) {
    mapa.set(String(trabajo.modulo_id) + ":" + String(trabajo.nivel), trabajo);
  });
  (Array.isArray(locales) ? locales : []).forEach(function (trabajo) {
    const clave = String(trabajo.modulo_id) + ":" + String(trabajo.nivel);
    if (!mapa.has(clave)) mapa.set(clave, trabajo);
  });

  return Array.from(mapa.values());
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

  CURSOS.forEach(function (curso) {
    const tarea = (TRABAJOS_PRACTICOS[curso.id] || {})[nivelTrabajos] || "";
    const hecho = trabajoEstaHecho(curso.id, nivelTrabajos);

    const tarjeta = document.createElement("article");
    tarjeta.className = "trabajo" + (hecho ? " trabajo--hecho" : "");

    const icono = document.createElement("span");
    icono.className = "trabajo__icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = curso.icono || "🛠️";
    tarjeta.appendChild(icono);

    const cuerpo = document.createElement("div");
    cuerpo.className = "trabajo__cuerpo";

    const titulo = document.createElement("h3");
    titulo.className = "trabajo__titulo";
    titulo.textContent = "Curso " + curso.id + ": " + curso.titulo;
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
      guardarMiniTrabajo(curso.id, nivelTrabajos, !hecho);
    });
    tarjeta.appendChild(boton);

    lista.appendChild(tarjeta);
  });
}

async function guardarMiniTrabajo(moduloId, nivel, completado) {
  const sesion = obtenerSesion();
  if (!sesion) return;

  const indice = miniTrabajosCache.findIndex(function (trabajo) {
    return Number(trabajo.modulo_id) === Number(moduloId) && String(trabajo.nivel) === nivel;
  });
  const registro = { modulo_id: moduloId, nivel: nivel, completado: completado };
  if (indice >= 0) {
    miniTrabajosCache[indice] = registro;
  } else {
    miniTrabajosCache.push(registro);
  }
  guardarLocal(claveMiniTrabajosCache(sesion.id), miniTrabajosCache);
  renderizarListaTrabajos();

  const resultado = await apiPost("progreso/mini-trabajo", {
    usuarioId: sesion.id,
    moduloId: moduloId,
    nivel: nivel,
    completado: completado
  });

  if (resultado.exito) {
    mostrarMensaje(completado ? "¡Trabajo guardado como hecho! 🎉" : "Trabajo marcado como pendiente.", 3000);
  } else {
    mostrarMensaje(
      completado
        ? "¡Trabajo guardado como hecho en este dispositivo!"
        : "Trabajo marcado como pendiente en este dispositivo.",
      4500
    );
  }
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

  const modulosApi = resultado.exito && resultado.datos && Array.isArray(resultado.datos.modulos)
    ? resultado.datos.modulos
    : [];
  aplicarProgresoModulos(modulosApi, sesion.id);
  modulosCompletados = progresoModulosCache.filter(function (m) {
    return Boolean(m.completado) && Boolean(buscarNivelPorId(m.modulo_id));
  }).length;

  if (resultado.exito && resultado.datos) {
    const trabajos = resultado.datos.miniTrabajos || [];
    trabajosHechos = trabajos.filter(function (t) { return Boolean(t.completado); }).length;
    examen = resultado.datos.examen;
  }

  refrescarAvanceCursos();

  contenedor.innerHTML = "";

  const datos = [
    { etiqueta: "Tu nivel", valor: formatearNivel(sesion.nivelDigital), icono: "🎯" },
    { etiqueta: "Niveles completados", valor: modulosCompletados + " de " + TOTAL_NIVELES_CAMPUS, icono: "📚" },
    { etiqueta: "Trabajos hechos", valor: String(trabajosHechos), icono: "🛠️" }
  ];

  if (examen && examen.total_preguntas) {
    const nivelDelExamen = buscarNivelPorId(examen.modulo_id);
    datos.push({
      etiqueta: nivelDelExamen
        ? "Último repaso: Nivel " + nivelDelExamen.modulo.numero
        : "Último repaso",
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
  "pantalla-curso": "btn-nav-campus",
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
    if (retosEscudo.length === 0 || estadoRetoEscudo === "fin") {
      iniciarRetosEscudo(false);
    } else {
      renderizarRetoEscudo(false);
    }
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
    renderizarListaCampus(cursosCache);
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
    if (!moduloActual) return;
    if (indicePasoActual > 0) {
      indicePasoActual--;
      renderizarPasoLeccion(indicePasoActual);
      const sesion = obtenerSesion();
      if (sesion) guardarProgresoModulo(sesion.id, moduloActual.id, indicePasoActual, false);
    }
  });

  document.getElementById("btn-leccion-siguiente").addEventListener("click", async function () {
    if (!moduloActual) return;

    const pasos = pasosDelNivelActual();
    if (indicePasoActual < pasos.length - 1) {
      indicePasoActual++;
      renderizarPasoLeccion(indicePasoActual);
      const sesion = obtenerSesion();
      if (sesion) guardarProgresoModulo(sesion.id, moduloActual.id, indicePasoActual, false);
    } else {
      const sesion = obtenerSesion();
      if (sesion) await guardarProgresoModulo(sesion.id, moduloActual.id, pasos.length, false);
      mostrarMensaje(
        "¡Leíste las " + pasos.length + " teorías! Respondé el repaso para completar el nivel y desbloquear el siguiente.",
        4500
      );
      iniciarExamen(moduloActual);
    }
  });

  // --- Curso: Volver al campus ---
  const btnVolverCurso = document.getElementById("btn-volver-curso");
  if (btnVolverCurso) {
    btnVolverCurso.addEventListener("click", function () {
      renderizarCampus();
      mostrarPantalla("pantalla-campus");
    });
  }

  // --- Examen: Volver al curso desde el resultado del repaso ---
  const btnVolverCursoExamen = document.getElementById("btn-volver-al-curso-examen");
  if (btnVolverCursoExamen) {
    btnVolverCursoExamen.addEventListener("click", function () {
      if (!moduloActual) {
        renderizarCampus();
        mostrarPantalla("pantalla-campus");
        return;
      }
      const curso = buscarCurso(moduloActual.cursoId);
      if (curso) {
        abrirCurso(curso);
      } else {
        renderizarCampus();
        mostrarPantalla("pantalla-campus");
      }
    });
  }

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
      boton.style.marginTop = "16px";
      boton.addEventListener("click", function () {
        callback(boton);
      });
      contenedor.parentNode.appendChild(boton);
    }
    boton.hidden = false;
    boton.disabled = false;
    boton.textContent = texto;
  }

  const observerConfig = { childList: true, subtree: true };

  const observerTest = new MutationObserver(function () {
    if (!contenedorTest.hidden && contenedorTest.children.length > 0) {
      agregarBotonEnviar(contenedorTest, "btn-enviar-test", "Enviar mis respuestas", async function (boton) {
        const respuestas = obtenerRespuestasDeTest("contenedor-preguntas", preguntasTestInicial.length);
        if (tieneRespuestasNull(respuestas)) {
          mostrarMensaje("Por favor, respondé todas las preguntas antes de continuar.", 3000);
          return;
        }

        const textoOriginal = boton.textContent;
        boton.disabled = true;
        boton.textContent = "Enviando…";

        try {
          const sesion = obtenerSesion();
          const usuarioId = sesion ? sesion.id : null;
          const resultado = await enviarTest(usuarioId, respuestas, preguntasTestInicial);

          const resultadoEl = document.getElementById("test-resultado");
          const resultadoTexto = document.getElementById("test-resultado-texto");
          resultadoTexto.textContent = "Tu nivel inicial es: " + resultado.nivel + ". ¡Ahora entrás a TAMI!";

          contenedorTest.hidden = true;
          boton.hidden = true;
          resultadoEl.hidden = false;
        } finally {
          boton.disabled = false;
          boton.textContent = textoOriginal;
        }
      });
    }
  });

  const observerExamen = new MutationObserver(function () {
    if (!contenedorExamen.hidden && contenedorExamen.children.length > 0) {
      agregarBotonEnviar(contenedorExamen, "btn-enviar-examen", "Enviar mis respuestas", async function (boton) {
        const totalPreguntas = moduloExamenActual && Array.isArray(moduloExamenActual.examen)
          ? moduloExamenActual.examen.length
          : 0;
        if (totalPreguntas === 0) return;

        const respuestas = obtenerRespuestasDeTest("contenedor-examen", totalPreguntas);
        if (tieneRespuestasNull(respuestas)) {
          mostrarMensaje("Por favor, respondé todas las preguntas antes de continuar.", 3000);
          return;
        }

        const textoOriginal = boton.textContent;
        boton.disabled = true;
        boton.textContent = "Enviando…";

        try {
          const sesion = obtenerSesion();
          const usuarioId = sesion ? sesion.id : null;
          const resultado = await enviarExamen(usuarioId, respuestas);

          const resultadoEl = document.getElementById("examen-resultado");
          const resultadoTexto = document.getElementById("examen-resultado-texto");
          const nombreNivelExamen = moduloExamenActual
            ? "Nivel " + moduloExamenActual.numero + ": " + moduloExamenActual.titulo
            : "el nivel";
          const siguienteNumero = moduloExamenActual ? moduloExamenActual.numero + 1 : null;
          const avisoDesbloqueo = siguienteNumero && siguienteNumero <= TOTAL_NIVELES_POR_CURSO
            ? " Nivel completado: ya podés entrar al Nivel " + siguienteNumero + "."
            : " Nivel completado. ¡Terminaste los cuatro niveles de este curso!";
          resultadoTexto.textContent =
            "Obtuviste " + resultado.puntaje + " de " + resultado.total +
            " respuestas correctas en " + nombreNivelExamen + "." + avisoDesbloqueo;

          contenedorExamen.hidden = true;
          boton.hidden = true;
          resultadoEl.hidden = false;
        } finally {
          boton.disabled = false;
          boton.textContent = textoOriginal;
        }
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
