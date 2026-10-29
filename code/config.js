/* ============================================
   TAMI - config.js
   Define la dirección de la API según dónde se abra el sitio:
   - Servido por el propio backend (http://localhost:3000): /api
   - Abierto con Live Server u otro puerto local: http://localhost:3000/api
   - Abierto como archivo (file://): http://localhost:3000/api
   - Publicado en internet: /api del mismo dominio

   Se puede forzar otra dirección con ?api=https://mi-servidor/api
   ============================================ */
(function () {
  "use strict";

  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
  var puerto = window.location.port;
  var porDefecto;

  if (window.location.protocol === "file:") {
    porDefecto = "http://localhost:3000/api";
  } else if (local && puerto !== "3000") {
    porDefecto = "http://localhost:3000/api";
  } else {
    porDefecto = window.location.origin + "/api";
  }

  var forzada = "";
  try {
    forzada = new URLSearchParams(window.location.search).get("api") || "";
    if (!forzada) forzada = localStorage.getItem("tami:apiUrl") || "";
  } catch (error) {
    forzada = "";
  }

  window.TAMI_API_URL = String(forzada || porDefecto).replace(/\/+$/, "");
})();
