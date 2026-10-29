// Client-side persistent cache & single-stream ObjectURL handoff for large 3D GLB models
export const MODEL_CACHE_NAME = 'portfolio-3d-models-v3';
const LEGACY_MODEL_CACHES = ['portfolio-3d-cache-v1', 'portfolio-3d-cache-v2'];

// In-memory ObjectURL cache so repeat mounts resolve in 0ms without re-reading disk
const resolvedBlobUrls = new Map<string, string>();

// In-flight download deduplication map (only one network stream per URL ever runs)
const activeDownloads = new Map<string, Promise<string>>();

/**
 * Checks if a 3D model is already available in memory or persistent CacheStorage.
 */
export async function isModelInCache(url: string): Promise<boolean> {
  if (resolvedBlobUrls.has(url)) return true;
  if (typeof window === 'undefined' || !('caches' in window)) return false;

  try {
    const cache = await caches.open(MODEL_CACHE_NAME);
    const match = await cache.match(url);
    if (match) return true;

    // Migrate seamlessly if already cached in v2 so returning users don't re-download
    for (const legacyName of LEGACY_MODEL_CACHES) {
      const hasLegacy = await caches.has(legacyName);
      if (!hasLegacy) continue;
      const legacyCache = await caches.open(legacyName);
      const legacyMatch = await legacyCache.match(url);
      if (legacyMatch && legacyMatch.status === 200) {
        await cache.put(url, legacyMatch.clone());
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

export interface SceneModelUrls {
  env: string;
  throne: string;
  player: string;
  tower: string;
}

export function estimateModelBytes(url: string): number {
  if (url.includes('after_the_rain_mobile')) return 8_070_000;
  if (url.includes('after_the_rain_2k')) return 93_869_428;
  if (url.includes('throne_mobile')) return 1_575_000;
  if (url.includes('throne_of_iron__stone')) return 5_360_000;
  if (url.includes('cool_man')) return 7_970_000;
  if (url.includes('Project_tower')) return 1_240_000;
  return url.includes('mobile') ? 8_070_000 : 10_000_000;
}

/**
 * Streams and caches a 3D GLB model ONCE and returns an in-memory `blob:` ObjectURL
 * (or falls back to `url` if Blob/Cache APIs are restricted) so Three.js `useGLTF`
 * never triggers a duplicate network download.
 */
export async function preloadAndCacheModel(
  url: string,
  onProgress?: (progressPercent: number, loadedMB: number, totalMB: number) => void,
  signal?: AbortSignal
): Promise<string> {
  const defaultEstimateBytes = estimateModelBytes(url);

  if (typeof window === 'undefined') {
    onProgress?.(100, 0, 0);
    return url;
  }

  // 1. Instant RAM hit
  if (resolvedBlobUrls.has(url)) {
    const mb = defaultEstimateBytes / (1024 * 1024);
    onProgress?.(100, mb, mb);
    return resolvedBlobUrls.get(url)!;
  }

  // 2. Reuse active in-flight stream if another caller requested the same URL
  if (activeDownloads.has(url) && !signal) {
    return activeDownloads.get(url)!;
  }

  const downloadPromise = (async (): Promise<string> => {
    try {
      // Check persistent CacheStorage first
      if ('caches' in window) {
        try {
          const cache = await caches.open(MODEL_CACHE_NAME);
          const cached = await cache.match(url);
          if (cached && cached.status === 200) {
            const blob = await cached.blob();
            if (blob.size > 1024) {
              const mb = blob.size / (1024 * 1024);
              const blobUrl = URL.createObjectURL(blob);
              resolvedBlobUrls.set(url, blobUrl);
              onProgress?.(100, mb, mb);
              return blobUrl;
            }
          }
        } catch {
          // Proceed to network stream if CacheStorage read fails
        }
      }

      if (signal?.aborted) {
        throw new DOMException('Model preload aborted', 'AbortError');
      }

      // 3. Single network stream with live byte progress
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`Model fetch failed: ${response.status}`);
      }

      const contentLength = response.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : defaultEstimateBytes;
      const totalMB = totalBytes / (1024 * 1024);

      if (!response.body) {
        const blob = await response.blob();
        if ('caches' in window && blob.size > 1024) {
          caches
            .open(MODEL_CACHE_NAME)
            .then((c) =>
              c.put(
                url,
                new Response(blob, {
                  headers: {
                    'Content-Type': 'model/gltf-binary',
                    'Content-Length': String(blob.size),
                  },
                })
              )
            )
            .catch(() => {});
        }
        const blobUrl = URL.createObjectURL(blob);
        resolvedBlobUrls.set(url, blobUrl);
        onProgress?.(100, totalMB, totalMB);
        return blobUrl;
      }

      const reader = response.body.getReader();
      const chunks: BlobPart[] = [];
      let loadedBytes = 0;

      const onAbort = () => {
        reader.cancel().catch(() => {});
      };
      signal?.addEventListener('abort', onAbort, { once: true });

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (signal?.aborted) {
            throw new DOMException('Model preload aborted', 'AbortError');
          }
          if (value) {
            chunks.push(value);
            loadedBytes += value.byteLength;
            if (onProgress) {
              const loadedMB = loadedBytes / (1024 * 1024);
              const denom = Math.max(totalBytes, loadedBytes);
              const percent = Math.min(99.5, (loadedBytes / denom) * 100);
              onProgress(percent, loadedMB, denom / (1024 * 1024));
            }
          }
        }
      } finally {
        signal?.removeEventListener('abort', onAbort);
      }

      const blob = new Blob(chunks, { type: 'model/gltf-binary' });
      // Release chunk references immediately so GC only retains the single Blob
      chunks.length = 0;

      if ('caches' in window && blob.size > 1024) {
        caches
          .open(MODEL_CACHE_NAME)
          .then((cache) =>
            cache.put(
              url,
              new Response(blob, {
                headers: {
                  'Content-Type': 'model/gltf-binary',
                  'Content-Length': String(blob.size),
                  'Cache-Control': 'public, max-age=31536000, immutable',
                },
              })
            )
          )
          .catch(() => {});
      }

      const finalMB = blob.size / (1024 * 1024);
      const blobUrl = URL.createObjectURL(blob);
      resolvedBlobUrls.set(url, blobUrl);
      onProgress?.(100, finalMB, finalMB);
      return blobUrl;
    } catch (err: any) {
      if (err?.name === 'AbortError' || signal?.aborted) {
        throw err;
      }
      console.warn('Asset cache stream fallback to direct URL:', err);
      onProgress?.(100, 0, 0);
      return url;
    } finally {
      activeDownloads.delete(url);
    }
  })();

  if (!signal) {
    activeDownloads.set(url, downloadPromise);
  }
  return downloadPromise;
}

/**
 * Streams and caches ALL required 3D spawn assets (Environment, Iron Throne, Player Avatar,
 * and Pedestal Tower) concurrently over HTTP/2-3 and returns in-memory `blob:` ObjectURLs
 * so every mesh mounts atomically on Frame 1 with zero delayed pop-in.
 */
export async function preloadAllSceneModels(
  urls: SceneModelUrls,
  onProgress?: (progressPercent: number, loadedMB: number, totalMB: number) => void,
  signal?: AbortSignal
): Promise<SceneModelUrls> {
  const keys: (keyof SceneModelUrls)[] = ['env', 'throne', 'player', 'tower'];
  const slotStats: Record<keyof SceneModelUrls, { loaded: number; total: number }> = {
    env: { loaded: 0, total: estimateModelBytes(urls.env) / (1024 * 1024) },
    throne: { loaded: 0, total: estimateModelBytes(urls.throne) / (1024 * 1024) },
    player: { loaded: 0, total: estimateModelBytes(urls.player) / (1024 * 1024) },
    tower: { loaded: 0, total: estimateModelBytes(urls.tower) / (1024 * 1024) },
  };

  const reportCombined = () => {
    if (!onProgress) return;
    let sumLoaded = 0;
    let sumTotal = 0;
    for (const k of keys) {
      sumLoaded += slotStats[k].loaded;
      sumTotal += Math.max(slotStats[k].total, slotStats[k].loaded);
    }
    const pct = sumTotal > 0 ? Math.min(99.5, (sumLoaded / sumTotal) * 100) : 100;
    onProgress(pct, sumLoaded, sumTotal);
  };

  const [env, throne, player, tower] = await Promise.all(
    keys.map((key) =>
      preloadAndCacheModel(
        urls[key],
        (_pct, loadedMB, totalMB) => {
          slotStats[key].loaded = loadedMB;
          if (totalMB > 0) {
            slotStats[key].total = totalMB;
          }
          reportCombined();
        },
        signal
      )
    )
  );

  return { env, throne, player, tower };
}
