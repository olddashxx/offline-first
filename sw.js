const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './mobile.html',
  './styles.css',
  './mobile-styles.css',
  './script.js',
  './mobile-script.js',
  './manifest.json',
  'https://code.jquery.com/jquery-3.6.0.min.js'
];

// Evento Instalación: Guarda recursos en caché local
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Evento Fetch: Intercepta solicitudes HTTP y sirve desde Caché si está offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});