const CACHE_NAME = 'prestajara-pwa-v5'; 
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

// Fetch: Sirve los archivos locales y deja pasar a Apps Script a máxima velocidad
self.addEventListener('fetch', event => {
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
