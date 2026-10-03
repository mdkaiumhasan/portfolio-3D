// Service Worker for 3D Portfolio - Permanent Local Disk Caching of Large Models & Assets
const CACHE_NAME = 'portfolio-3d-cache-v2';

const ASSET_EXTENSIONS = ['.glb', '.gltf', '.hdr', '.bin', '.webp', '.png', '.jpg', '.jpeg', '.svg', '.mp3', '.ogg'];

self.addEventListener('install', (event) => {
  // Activate immediately without waiting for existing clients to close
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isModelOrMedia =
    url.pathname.startsWith('/models/') ||
    url.pathname.startsWith('/textures/') ||
    url.pathname.startsWith('/audio/') ||
    url.pathname.startsWith('/assets/') ||
    ASSET_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));

  if (isModelOrMedia) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        // 1. Check local disk cache first (0 network latency, 0 bytes data used)
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2. Fetch from network and store permanently in cache
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            // Clone and store in Cache API (works with large 90MB+ files)
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          if (cachedResponse) return cachedResponse;
          throw error;
        }
      })
    );
  }
});
