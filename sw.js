const CACHE_NAME = 'prestajara-pwa-v6'; 
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

// Fetch: Sirve los archivos locales y respeta la velocidad
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 1. Si la petición NO es de nuestro GitHub (ej. es de Google Apps Script), pasa libre a máxima velocidad
  if (!url.origin.includes(self.location.origin)) {
    return; 
  }

  // 2. Si la petición incluye "?reload=", es el botón de rescate del celular. NO USES CACHÉ, fuerza la red.
  if (url.searchParams.has('reload')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 3. Comportamiento normal PWA
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
