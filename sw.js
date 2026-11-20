const CACHE_NAME = 'prestajara-pwa-v4'; 
const urlsToCache = [
  '/programa/index.html',
  '/programa/manifest.json',
  '/programa/logo.png'
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

// Activación: Limpia cachés viejos
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
  
  // TRUCO DE ORO: Si la petición NO es de nuestro GitHub (ej. es de Google Apps Script), 
  // ignoramos el Service Worker y dejamos que pase a máxima velocidad.
  if (!event.request.url.startsWith(self.location.origin)) {
    return; 
  }

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
