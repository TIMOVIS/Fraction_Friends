const CACHE_NAME = 'fraction-friends-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap',
  // Cache the specific versions used in the import map
  'https://aistudiocdn.com/react@^19.2.1',
  'https://aistudiocdn.com/react-dom@^19.2.1/',
  'https://aistudiocdn.com/react@^19.2.1/',
  'https://aistudiocdn.com/@google/genai@^1.31.0',
  'https://aistudiocdn.com/lucide-react@^0.556.0'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // For API calls (Gemini), try network first, then fall back (handled by app logic)
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return; // Let the app handle the API failure gracefully
  }

  // For everything else (assets), try cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});