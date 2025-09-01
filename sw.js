const CACHE_NAME = 'schedule-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Обслуживание запросов из кэша
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Возвращаем ресурс из кэша, если он есть
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
