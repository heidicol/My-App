const CACHE_NAME = 'my-finance-v4';
const ASSETS = [
  '/My-Finance-Tracker/',
  '/My-Finance-Tracker/index.html',
  '/My-Finance-Tracker/manifest.json',
  '/My-Finance-Tracker/icon-192.png',
  '/My-Finance-Tracker/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(ASSETS.map(url => cache.add(url)));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() =>
        caches.match('/My-Finance-Tracker/')
      );
    })
  );
});
