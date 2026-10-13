/**
 * Device Orientation & Screen Lock Utilities for 3D Cyberpunk City
 */

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768 || (window.innerWidth <= 1024 && window.innerHeight <= 600);
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
    navigator.userAgent
  );
  return hasTouch || isMobileUA || isSmallScreen;
};

export const isPortraitOrientation = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerHeight > window.innerWidth;
};

export const requestLandscapeLock = async (): Promise<boolean> => {
  // We do not force screen.orientation.lock because Android Chrome tears down the Activity and reloads the page.
  // Instead, the user simply turns their physical phone to landscape, and our UI immediately responds smoothly.
  return window.innerWidth > window.innerHeight;
};

export const unlockOrientationLock = async (): Promise<void> => {
  // Safe cleanup - no destructive browser calls
};
