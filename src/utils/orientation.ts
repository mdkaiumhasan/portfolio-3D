/**
 * Device Orientation & Screen Detection Utilities
 * Accurately distinguishes handheld phones/tablets from touchscreen Windows/Mac laptops.
 */

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent || '';
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua) ||
    // iPadOS 13+ reports Macintosh UA with multi-touch and coarse pointer
    (/Macintosh/i.test(ua) &&
      navigator.maxTouchPoints > 1 &&
      Boolean(window.matchMedia?.('(pointer: coarse)').matches));

  const isCoarsePointer = Boolean(window.matchMedia?.('(pointer: coarse)').matches);
  const shortestSide = Math.min(window.innerWidth, window.innerHeight);

  // Only treat coarse-pointer devices with tablet/phone dimensions or explicit mobile UAs as mobile.
  // Desktop/laptop touchscreens (1920x1080 with fine trackpad/mouse pointer) remain desktop.
  return isMobileUA || (isCoarsePointer && shortestSide <= 1024);
};

export const isPortraitOrientation = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerHeight > window.innerWidth;
};

export const requestLandscapeLock = async (): Promise<boolean> => {
  return typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : true;
};

export const unlockOrientationLock = async (): Promise<void> => {
  // No-op safe cleanup (avoids Android Chrome orientation-lock activity teardown)
};
