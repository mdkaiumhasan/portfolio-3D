import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import { HUD } from './components/ui/HUD';
import { MobileControls } from './components/ui/MobileControls';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { Classic2DView } from './components/ui/Classic2DView';
import { OrientationPrompt } from './components/ui/OrientationPrompt';
import { ErrorBoundary, isWebGLAvailable } from './components/ui/ErrorBoundary';
import { useGameStore } from './store/gameStore';
import { sound } from './systems/audio';
import { isMobileDevice, isPortraitOrientation, unlockOrientationLock } from './utils/orientation';
import './styles/hud.css';

// Code-split Three.js / WebGL World & heavy modals so 2D mode & initial loader stay ultra-lightweight
const World = lazy(() =>
  import('./components/world/World').then((m) => ({ default: m.World }))
);
const AboutModal = lazy(() =>
  import('./components/ui/AboutModal').then((m) => ({ default: m.AboutModal }))
);
const ProjectsModal = lazy(() =>
  import('./components/ui/ProjectsModal').then((m) => ({ default: m.ProjectsModal }))
);
const SkillsModal = lazy(() =>
  import('./components/ui/SkillsModal').then((m) => ({ default: m.SkillsModal }))
);
const ExperienceModal = lazy(() =>
  import('./components/ui/ExperienceModal').then((m) => ({ default: m.ExperienceModal }))
);
const ResumeModal = lazy(() =>
  import('./components/ui/ResumeModal').then((m) => ({ default: m.ResumeModal }))
);
const ContactModal = lazy(() =>
  import('./components/ui/ContactModal').then((m) => ({ default: m.ContactModal }))
);
const BlogModal = lazy(() =>
  import('./components/ui/BlogModal').then((m) => ({ default: m.BlogModal }))
);
const SettingsModal = lazy(() =>
  import('./components/ui/SettingsModal').then((m) => ({ default: m.SettingsModal }))
);
const TutorialModal = lazy(() =>
  import('./components/ui/TutorialModal').then((m) => ({ default: m.TutorialModal }))
);

export const App: React.FC = () => {
  const mode = useGameStore((s) => s.mode);
  const setMode = useGameStore((s) => s.setMode);
  const activePanel = useGameStore((s) => s.activePanel);
  const setActivePanel = useGameStore((s) => s.setActivePanel);
  const setIsMobile = useGameStore((s) => s.setIsMobile);
  const setIsPortrait = useGameStore((s) => s.setIsPortrait);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const isIntroLoading = useGameStore((s) => s.isIntroLoading);
  const setIsIntroLoading = useGameStore((s) => s.setIsIntroLoading);
  const resolvedEnvModelUrl = useGameStore((s) => s.resolvedEnvModelUrl);

  const webglSupported = useMemo(() => isWebGLAvailable(), []);

  // Automatically fall back to 2D Classic Portfolio if device/browser lacks WebGL support
  useEffect(() => {
    if (!webglSupported && mode === '3d') {
      setIsIntroLoading(false);
      setMode('2d');
    }
  }, [webglSupported, mode, setIsIntroLoading, setMode]);

  // Detect mobile viewport & orientation with debounce to prevent resize cascades on mobile
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const checkViewport = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const mob = isMobileDevice();
        const port = isPortraitOrientation();
        const state = useGameStore.getState();
        if (state.isMobile !== mob) setIsMobile(mob);
        if (state.isPortrait !== port) setIsPortrait(port);
      }, 60);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    window.addEventListener('orientationchange', checkViewport, { passive: true });
    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('orientationchange', checkViewport);
    };
  }, [setIsMobile, setIsPortrait]);

  // Clean up orientation & pause ambient rain audio when leaving 3D mode
  useEffect(() => {
    if (mode === '2d') {
      unlockOrientationLock();
      sound.stopRain();
    } else if (mode === '3d' && !isIntroLoading && audioEnabled) {
      sound.startRain();
    }
  }, [mode, isIntroLoading, audioEnabled]);

  // Global escape key to close active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePanel) {
        if (audioEnabled) sound.playClick();
        setActivePanel(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel, setActivePanel, audioEnabled]);

  // Only mount <World /> once LoadingScreen has resolved the single-stream model URL
  // (or after intro loading completes), guaranteeing zero duplicate 90 MB network streams!
  const shouldMountWorld = mode === '3d' && webglSupported && (resolvedEnvModelUrl !== null || !isIntroLoading);

  return (
    <ErrorBoundary>
      <div style={{ width: '100vw', height: '100dvh', position: 'relative', overflow: 'hidden' }}>
        {/* Primary Experience Mode */}
        {mode === '3d' ? (
          <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            {/* Lazy-Loaded 3D World Canvas */}
            {shouldMountWorld && (
              <ErrorBoundary fallbackMode="world">
                <Suspense fallback={null}>
                  <World />
                </Suspense>
              </ErrorBoundary>
            )}

            {/* Heads Up Display & Overlays - only active after loading is complete */}
            {!isIntroLoading && (
              <>
                <HUD />
                <MobileControls />
              </>
            )}
          </div>
        ) : (
          /* 2D Modern Glassmorphic View */
          <Classic2DView />
        )}

        {/* Cyberpunk Mobile Orientation Prompt */}
        <OrientationPrompt />

        {/* Initial Loading Screen (Premium Intro Loader) - rendered on top of 3D scene */}
        {isIntroLoading && mode === '3d' && (
          <LoadingScreen onLoaded={() => setIsIntroLoading(false)} />
        )}

        {/* Lazy-Loaded Interactive Modals */}
        <Suspense fallback={null}>
          {activePanel === 'about' && <AboutModal />}
          {activePanel === 'projects' && <ProjectsModal />}
          {activePanel === 'skills' && <SkillsModal />}
          {activePanel === 'experience' && <ExperienceModal />}
          {activePanel === 'resume' && <ResumeModal />}
          {activePanel === 'contact' && <ContactModal />}
          {activePanel === 'blog' && <BlogModal />}
          {activePanel === 'settings' && <SettingsModal />}
          {activePanel === 'tutorial' && <TutorialModal />}
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default App;
