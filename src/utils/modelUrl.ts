import { isMobileDevice } from './orientation';

/**
 * Lightweight 3D asset URL resolvers kept free of Three.js imports
 * so LoadingScreen and 2D views never pull Three.js into the initial bundle.
 *
 * Supports optional `VITE_MODEL_BASE_URL` (e.g. a GitHub Release / Cloudflare R2 / S3 CDN base URL)
 * while defaulting to local `/models` inside `public/models/`.
 */
const MODEL_BASE_URL = (import.meta.env.VITE_MODEL_BASE_URL || '/models').replace(/\/+$/, '');

export const getRainStreetModelUrl = (): string => {
  if (typeof window === 'undefined') return `${MODEL_BASE_URL}/after_the_rain_mobile.glb`;
  return isMobileDevice()
    ? `${MODEL_BASE_URL}/after_the_rain_mobile.glb`
    : `${MODEL_BASE_URL}/after_the_rain_2k.glb`;
};

export const getThroneModelUrl = (): string => {
  if (typeof window === 'undefined') return `${MODEL_BASE_URL}/throne_mobile.glb`;
  return isMobileDevice()
    ? `${MODEL_BASE_URL}/throne_mobile.glb`
    : `${MODEL_BASE_URL}/throne_of_iron__stone.glb?v=v2_webp`;
};

export const getPlayerModelUrl = (): string => {
  return `${MODEL_BASE_URL}/cool_man.glb?v=v10_clean_idle_grounded`;
};

export const getStationTowerModelUrl = (): string => {
  return `${MODEL_BASE_URL}/Project_tower.glb`;
};
