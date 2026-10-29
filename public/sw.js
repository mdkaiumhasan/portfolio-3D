// Service Worker for 3D Portfolio - Same-Origin Static & 3D Asset Caching
const CACHE_NAME = 'portfolio-3d-cache-v3';
const MODEL_STREAM_CACHE = 'portfolio-3d-models-v3';
const PRESERVED_CACHES = new Set([CACHE_NAME, MODEL_STREAM_CACHE]);

const ASSET_EXTENSIONS = [
  '.glb',
  '.gltf',
  '.hdr',
  '.bin',
  '.wasm',
  '.webp',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.mp3',
  '.ogg',
];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (!PRESERVED_CACHES.has(key)) {
              return caches.delete(key);
            }
            return Promise.resolve(false);
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Strictly restrict caching to same-origin static assets; never intercept /api/ or external CDNs
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Large environment GLBs (after_the_rain_*.glb) are streamed & cached directly by assetCache.ts
  // with byte-level progress tracking; check MODEL_STREAM_CACHE first without duplicating 90MB!
  if (url.pathname.includes('/after_the_rain_')) {
    event.respondWith(
      caches.open(MODEL_STREAM_CACHE).then(async (modelCache) => {
        const hit = await modelCache.match(request);
        if (hit && hit.status === 200) return hit;
        return fetch(request);
      })
    );
    return;
  }

  const isStaticAsset =
    url.pathname.startsWith('/models/') ||
    url.pathname.startsWith('/draco/') ||
    url.pathname.startsWith('/textures/') ||
    url.pathname.startsWith('/audio/') ||
    url.pathname.startsWith('/assets/') ||
    ASSET_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));

  if (!isStaticAsset) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      const networkResponse = await fetch(request);
      if (
        networkResponse &&
        networkResponse.status === 200 &&
        networkResponse.type === 'basic'
      ) {
        cache.put(request, networkResponse.clone()).catch(() => {});
      }
      return networkResponse;
    })
  );
});
