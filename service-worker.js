const CACHE_NAME = 'digital-japa-counter-cache-v2'; // Version bumped
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/rkhkmclogo.jpg',
  '/rkhkmc.mp3',
  '/streak-sound.mp3',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  '/Raleway-VariableFont_wght.ttf',
  '/manifest.json',
  '/rkhkmc.jpg',
  '/rkhkmc.png',
  '/SAMAN___.TTF',
  '/service-worker.js',
  '/rkhkmc_mwfet.png',
  '/rkspsauswbhkb.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network first strategy with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the response if it's valid
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
