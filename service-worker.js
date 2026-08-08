const CACHE_NAME = 'unsemill-ja-v1.1-cache-final';
const ASSETS_TO_CACHE = [
  './index.html',
  './about.html',
  './contact.html',
  './privacy.html',
  './manifest.json',
  './css/style_ja.css?v=20260807-120000',
  './js/app_ja.js?v=20260807-120000',
  './data/fortune-data_ja.json?v=20260807-120000',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@0.294.0/dist/umd/lucide.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap'
];

// 1. 서비스 워커 설치 및 핵심 자원 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching K-Unsei core assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. 서비스 워커 활성화 및 오래된 캐시 청소
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. 네트워크 우선 요청 처리 (실시간 운세 변경 반영을 위해 Network First 후 Cache Fallback)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});