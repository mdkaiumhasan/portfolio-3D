// Client-side persistent cache manager for large 3D models using Cache API
const CACHE_NAME = 'portfolio-3d-cache-v2';

// In-flight download promise singleton to prevent duplicate concurrent downloads
const activeDownloads = new Map<string, Promise<boolean>>();

/**
 * Checks if a 3D model is already saved in the browser's persistent Cache API.
 */
export async function isModelInCache(url: string): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return false;
  }
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(url);
    return !!match;
  } catch {
    return false;
  }
}

/**
 * Downloads and caches large 3D models (such as after_the_rain_2k.glb) with accurate byte progress.
 * If already cached on disk, resolves in ~10ms with 0 internet data downloaded.
 */
export async function preloadAndCacheModel(
  url: string,
  onProgress?: (progressPercent: number, loadedMB: number, totalMB: number) => void
): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    if (onProgress) onProgress(100, 0, 0);
    return true;
  }

  // If already being downloaded by another component, reuse promise
  if (activeDownloads.has(url)) {
    return activeDownloads.get(url)!;
  }

  const downloadPromise = (async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(url);

      if (cached) {
        if (onProgress) {
          const size = Number(cached.headers.get('content-length')) || 93869428;
          const mb = size / (1024 * 1024);
          onProgress(100, mb, mb);
        }
        return true;
      }

      // Not in cache: stream download with live byte tracking
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch model: ${response.status} ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 93869428;
      const totalMB = totalBytes / (1024 * 1024);

      if (!response.body) {
        await cache.put(url, response.clone());
        if (onProgress) onProgress(100, totalMB, totalMB);
        return true;
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let loadedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loadedBytes += value.length;

        if (onProgress) {
          const loadedMB = loadedBytes / (1024 * 1024);
          const percent = Math.min(99.9, (loadedBytes / totalBytes) * 100);
          onProgress(percent, loadedMB, totalMB);
        }
      }

      // Combine chunks and store in Cache API
      const combined = new Uint8Array(loadedBytes);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      const blob = new Blob([combined], { type: 'model/gltf-binary' });
      const cacheResponse = new Response(blob, {
        headers: {
          'Content-Type': 'model/gltf-binary',
          'Content-Length': blob.size.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });

      await cache.put(url, cacheResponse);

      if (onProgress) {
        onProgress(100, totalMB, totalMB);
      }
      return true;
    } catch (err) {
      console.warn('Asset cache download error, falling back to standard fetch:', err);
      if (onProgress) onProgress(100, 0, 0);
      return false;
    } finally {
      activeDownloads.delete(url);
    }
  })();

  activeDownloads.set(url, downloadPromise);
  return downloadPromise;
}
