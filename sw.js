/* ===================================================================
   STUDYFLOW PRO - SERVICE WORKER
   Offline-first PWA capabilities
   =================================================================== */

const CACHE_NAME = 'studyflow-pro-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './engine.js',
  './app.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.0/math.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js',
  'https://cdn.plot.ly/plotly-2.27.0.min.js',
  'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          // Cache the fetched response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        }).catch(() => {
          // Network failed, return offline page if available
          return caches.match('./index.html');
        });
      })
  );
});

// Background sync for saving data when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-history') {
    event.waitUntil(syncHistory());
  }
});

async function syncHistory() {
  // Sync history data when connection is restored
  console.log('Syncing history data...');
  // Implementation depends on backend requirements
}
