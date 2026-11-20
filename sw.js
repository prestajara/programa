// CAMBIO IMPORTANTE: Subimos a v3 para forzar la actualización
const CACHE_NAME = 'prestajara-pwa-v3'; 
const urlsToCache = [
  '/programa/index.html',
  '/programa/manifest.json',
  '/programa/logo.png',
  '/programa/icon-pwa.jpg' // <-- ACTUALIZADO A JPG
];

// Instalación: Guarda los archivos base
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación: Limpia cachés viejos (Borra v1 y v2)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch: Sirve los archivos locales
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
