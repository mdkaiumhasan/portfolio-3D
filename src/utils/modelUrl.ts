import { isMobileDevice } from './orientation';

/**
 * Lightweight 3D asset URL resolvers kept free of Three.js imports
 * so LoadingScreen and 2D views never pull Three.js into the initial bundle.
 */
export const getRainStreetModelUrl = (): string => {
  if (typeof window === 'undefined') return '/models/after_the_rain_mobile.glb';
  return isMobileDevice()
    ? '/models/after_the_rain_mobile.glb'
    : '/models/after_the_rain_2k.glb';
};

export const getThroneModelUrl = (): string => {
  if (typeof window === 'undefined') return '/models/throne_mobile.glb';
  return isMobileDevice()
    ? '/models/throne_mobile.glb'
    : '/models/throne_of_iron__stone.glb';
};

