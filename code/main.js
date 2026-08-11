/* ============================================
   TAMI - main.js
   Lógica de presentación + persistencia en LocalStorage
   ============================================ */

"use strict";

const ESTADO_CLAVE = "tami:estado";

function leerEstado() {
  try {
    const crudo = localStorage.getItem(ESTADO_CLAVE);
    return crudo ? JSON.parse(crudo) : {};
  } catch (error) {
    console.error("Error al leer LocalStorage:", error);
    return {};
  }
}

function guardarEstado(estado) {
  try {
    localStorage.setItem(ESTADO_CLAVE, JSON.stringify(estado));
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

function inicializar() {
  const botonAcceder = document.getElementById("btn-acceder");
  if (botonAcceder) {
    botonAcceder.addEventListener("click", () => {
      const estado = leerEstado();
      estado.ultimaVisita = new Date().toISOString();
      guardarEstado(estado);

      mostrarMensaje("¡Bienvenido/a! Guardamos tu última visita de forma segura en este dispositivo.");
    });
  }

  const estado = leerEstado();
  if (estado.ultimaVisita) {
    mostrarMensaje("¡Qué bueno verte de nuevo! Última visita registrada en este dispositivo.");
  }
}

document.addEventListener("DOMContentLoaded", inicializar);
