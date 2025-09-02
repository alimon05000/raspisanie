const CACHE_NAME = 'schedule-cache-v3';
const urlsToCache = [
  '/',
  '/index.html'
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

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
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
        
        // Если ресурса нет в кэше, загружаем из сети
        return fetch(event.request).then(function(response) {
          // Проверяем, valid ли ответ
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Клонируем ответ
          var responseToCache = response.clone();
          
          // Добавляем в кэш для будущих запросов
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// Фоновая синхронизация
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Здесь можно реализовать фоновую синхронизацию данных
  return Promise.resolve();
}
