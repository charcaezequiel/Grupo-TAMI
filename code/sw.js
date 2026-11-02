/* TAMI - Service Worker
   Guarda el contenido del curso en el dispositivo para que se pueda seguir
   leyendo con mala conexión. Las llamadas a /api/ siempre van a la red: los
   datos personales no se cachean. */

const VERSION = "tami-v1.4.3";
const CACHE = "tami-cache-" + VERSION;

const RECURSOS = [
  "/",
  "/index.html",
  "/styles.css",
  "/manifest.json",
  "/config.js",
  "/contenido-cursos.js",
  "/contenido-teorias.js",
  "/contenido-repaso.js",
  "/contenido-retos.js",
  "/main.js",
  "/img/icono.svg",
  "/img/logo.svg",
  "/img/hero-ilustracion-formal.jpg",
  "/img/icono-192.png",
  "/img/icono-512.png",
  "/img/icono-maskable-512.png",
  "/img/apple-touch-icon.png",
  "/img/og-image.png",
  "/img/curso-1-smartphones.svg",
  "/img/curso-2-redes.svg",
  "/img/curso-3-tramites.svg",
  "/img/curso-4-fraudes.svg",
  "/img/curso-5-comunicacion.svg",
  "/img/nivel-1-descubrir.svg",
  "/img/nivel-2-comprender.svg",
  "/img/nivel-3-practicar.svg",
  "/img/nivel-4-dominar.svg"
];

self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(RECURSOS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(claves.map(function (clave) {
        return clave !== CACHE ? caches.delete(clave) : null;
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (evento) {
  const peticion = evento.request;

  if (peticion.method !== "GET") return;

  const url = new URL(peticion.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf("/api/") === 0) return;

  if (peticion.mode === "navigate") {
    evento.respondWith(
      fetch(peticion).then(function (respuesta) {
        const copia = respuesta.clone();
        caches.open(CACHE).then(function (cache) { cache.put("/index.html", copia); });
        return respuesta;
      }).catch(function () {
        return caches.match("/index.html").then(function (guardada) {
          return guardada || caches.match("/");
        });
      })
    );
    return;
  }

  evento.respondWith(
    caches.match(peticion).then(function (guardada) {
      const desdeRed = fetch(peticion).then(function (respuesta) {
        if (respuesta && respuesta.status === 200) {
          const copia = respuesta.clone();
          caches.open(CACHE).then(function (cache) { cache.put(peticion, copia); });
        }
        return respuesta;
      }).catch(function () {
        return guardada;
      });
      return guardada || desdeRed;
    })
  );
});
