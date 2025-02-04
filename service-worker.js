const CACHE_VERSION = new Date().toISOString(); // Unique version for each update
const CACHE_NAME = `digital-japa-counter-cache-${CACHE_VERSION}`;
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

// Install event: Cache assets
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

// Fetch event: Serve from cache, update in background
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone()); // Update cache in background
          return fetchResponse;
        });
      });
    }).catch(() => {
      console.warn('Failed to fetch:', event.request.url);
      return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    })
  );
});

// Activate event: Clear old caches and force refresh
self.addEventListener('activate', (event) => {
  console.log("Service Worker Activated");
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});
// Notify clients to refresh
self.addEventListener('message', (event) => {
  if (event.data === 'update') {
    self.skipWaiting();
  }});
// Register service worker and check for updates
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    console.log('ServiceWorker registered with scope:', registration.scope);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every 60 seconds

    // Listen for updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log("New service worker activated, refreshing page...");
      window.location.reload();
    });
  }).catch((error) => {
    console.log('ServiceWorker registration failed:', error);
  });
}

// Push Notification Handling
self.addEventListener('push', function(event) {
  console.log("Push notification received:", event);
  const message = event.data ? event.data.text() : 'No message payload';
  event.waitUntil(
    self.registration.showNotification('Daily Chant Reminder', {
      body: message,
      icon: '/rkhkmclogo.jpg',
    })
  );
});
