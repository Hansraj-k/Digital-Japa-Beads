const CACHE_NAME = 'digital-japa-counter-cache-v1';
const ASSETS = [ 
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/rkhkmclogo.jpg',
    '/rkhkmc.mp3',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    '/BiskiTrial-Regular.otf',
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
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS)
        .catch((err) => {
          console.error('Failed to cache assets:', err);
        });
    })
  );
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        console.warn('Failed to fetch:', event.request.url);
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log("Service Worker Activated");
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // Ensure clients use the updated service worker
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(error) {
    console.log('ServiceWorker registration failed: ', error);
  });
}

// Example service-worker.js file
self.addEventListener('push', function(event) {
  console.log("Push notification received: ", event);
  const message = event.data ? event.data.text() : 'No message payload';
  event.waitUntil(
    self.registration.showNotification('Daily Chant Reminder', {
      body: message,
      icon: '/rkhkmclogo.jpg',
    })
  );
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(function(registration) {
    registration.update();
  });
}
