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
  if (typeof window === 'undefined') return false;

  const doc = document as any;
  const docEl = document.documentElement as any;

  // 1. Enter Fullscreen first (required by W3C specification and Chrome for orientation lock)
  const isAlreadyFs =
    Boolean(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);

  if (!isAlreadyFs) {
    const requestFs =
      docEl.requestFullscreen ||
      docEl.webkitRequestFullscreen ||
      docEl.webkitRequestFullScreen ||
      docEl.mozRequestFullScreen ||
      docEl.msRequestFullscreen;

    if (requestFs) {
      try {
        await requestFs.call(docEl);
      } catch (fsErr) {
        console.warn('Fullscreen request failed or was blocked:', fsErr);
      }
    }
  }

  // 2. Lock screen orientation to landscape
  if (screen.orientation && typeof (screen.orientation as any).lock === 'function') {
    try {
      await (screen.orientation as any).lock('landscape');
      return true;
    } catch (lockErr1) {
      try {
        await (screen.orientation as any).lock('landscape-primary');
        return true;
      } catch (lockErr2) {
        console.warn('Screen orientation lock failed:', lockErr2);
      }
    }
  }

  // 3. Fallback for legacy Android browsers
  const screenAny = screen as any;
  const legacyLock =
    screenAny.lockOrientation || screenAny.mozLockOrientation || screenAny.msLockOrientation;

  if (legacyLock) {
    try {
      const locked = legacyLock.call(screenAny, 'landscape');
      if (locked) return true;
    } catch {}
  }

  // Check if we are now in landscape
  return window.innerWidth > window.innerHeight;
};

export const unlockOrientationLock = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    if (screen.orientation && (screen.orientation as any).unlock) {
      (screen.orientation as any).unlock();
    }
  } catch {}

  try {
    const doc = document as any;
    const exitFs =
      doc.exitFullscreen ||
      doc.webkitExitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.msExitFullscreen;

    if (doc.fullscreenElement && exitFs) {
      await exitFs.call(doc).catch(() => {});
    }
  } catch {}
};
