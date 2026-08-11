/* ============================================
   TAMI - main.js
   Capa Lógica: consume la API Node.js/PostgreSQL
   y usa LocalStorage como caché/fallback.
   ============================================ */

"use strict";

const API_URL = "http://localhost:3000/api";
const ESTADO_CLAVE = "tami:estado";
const CACHE_CLAVE = "tami:cache";

function leerLocal(clave, porDefecto) {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? JSON.parse(crudo) : porDefecto;
  } catch (error) {
    console.error("Error al leer LocalStorage:", error);
    return porDefecto;
  }
}

function guardarLocal(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.error("Error al guardar en LocalStorage:", error);
  }
}

function mostrarMensaje(texto) {
  const zonaMensaje = document.getElementById("zona-mensaje");
  const textoMensaje = document.getElementById("texto-mensaje");
  if (!zonaMensaje || !textoMensaje) return;

  textoMensaje.textContent = texto;
  zonaMensaje.hidden = false;
}

async function obtenerDeApi(recurso) {
  const respuesta = await fetch(`${API_URL}/${recurso}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }
  return respuesta.json();
}

function obtenerDeCache(recurso) {
  const cache = leerLocal(CACHE_CLAVE, {});
  return cache[recurso] || [];
}

function guardarEnCache(recurso, datos) {
  const cache = leerLocal(CACHE_CLAVE, {});
  cache[recurso] = datos;
  guardarLocal(CACHE_CLAVE, cache);
}

function cargarLista(recurso, contenedorId, renderizador) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  renderizador(contenedor, obtenerDeCache(recurso), false);

  obtenerDeApi(recurso)
    .then((datos) => {
      guardarEnCache(recurso, datos);
      renderizador(contenedor, datos, true);
    })
    .catch((error) => {
      console.error(`No se pudo conectar con la API (${recurso}):`, error);
      mostrarMensaje("No se pudo conectar con el servidor. Mostrando datos guardados localmente.");
    });
}

function renderizarCursos(contenedor, cursos, desdeApi) {
  contenedor.innerHTML = "";
  if (cursos.length === 0) {
    contenedor.innerHTML = "<p>Aún no hay cursos disponibles.</p>";
    return;
  }
  cursos.forEach((curso) => {
    const articulo = document.createElement("article");
    articulo.className = "tarjeta";
    articulo.innerHTML = `
      <h3 class="tarjeta__titulo">${curso.titulo}</h3>
      <p class="tarjeta__texto">${curso.descripcion || ""}</p>
      <p class="tarjeta__meta">Nivel: ${curso.nivel} · Duración: ${curso.duracion_min || "—"} min</p>
    `;
    contenedor.appendChild(articulo);
  });
  if (!desdeApi) {
    const nota = document.createElement("p");
    nota.className = "tarjeta__nota";
    nota.textContent = "Datos locales (sin conexión).";
    contenedor.appendChild(nota);
  }
}

function renderizarAlertas(contenedor, alertas, desdeApi) {
  contenedor.innerHTML = "";
  if (alertas.length === 0) {
    contenedor.innerHTML = "<p>Aún no hay alertas.</p>";
    return;
  }
  alertas.forEach((alerta) => {
    const item = document.createElement("li");
    item.className = "alerta alerta--" + alerta.severidad;
    item.innerHTML = `
      <strong class="alerta__titulo">${alerta.titulo}</strong>
      <span class="alerta__texto">${alerta.descripcion}</span>
    `;
    contenedor.appendChild(item);
  });
  if (!desdeApi) {
    const nota = document.createElement("li");
    nota.className = "tarjeta__nota";
    nota.textContent = "Datos locales (sin conexión).";
    contenedor.appendChild(nota);
  }
}

function inicializar() {
  const botonAcceder = document.getElementById("btn-acceder");
  if (botonAcceder) {
    botonAcceder.addEventListener("click", () => {
      const estado = leerLocal(ESTADO_CLAVE, {});
      estado.ultimaVisita = new Date().toISOString();
      guardarLocal(ESTADO_CLAVE, estado);

      mostrarMensaje("¡Bienvenido/a! Registramos tu visita. Los datos más importantes viajan a nuestra base de datos.");
    });
  }

  const estado = leerLocal(ESTADO_CLAVE, {});
  if (estado.ultimaVisita) {
    mostrarMensaje("¡Qué bueno verte de nuevo! Recordá siempre verificar quién te contacta antes de compartir datos.");
  }

  cargarLista("cursos", "lista-cursos", renderizarCursos);
  cargarLista("alertas", "lista-alertas", renderizarAlertas);
}

document.addEventListener("DOMContentLoaded", inicializar);
