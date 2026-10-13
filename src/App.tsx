import React, { useState, useEffect } from 'react';
import { World } from './components/world/World';
import { HUD } from './components/ui/HUD';
import { MobileControls } from './components/ui/MobileControls';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { Classic2DView } from './components/ui/Classic2DView';
import { AboutModal } from './components/ui/AboutModal';
import { ProjectsModal } from './components/ui/ProjectsModal';
import { SkillsModal } from './components/ui/SkillsModal';
import { ExperienceModal } from './components/ui/ExperienceModal';
import { ResumeModal } from './components/ui/ResumeModal';
import { ContactModal } from './components/ui/ContactModal';
import { BlogModal } from './components/ui/BlogModal';
import { SettingsModal } from './components/ui/SettingsModal';
import { TutorialModal } from './components/ui/TutorialModal';
import { OrientationPrompt } from './components/ui/OrientationPrompt';
import { useGameStore } from './store/gameStore';
import { sound } from './systems/audio';
import { isMobileDevice, isPortraitOrientation, unlockOrientationLock } from './utils/orientation';
import './styles/hud.css';

export const App: React.FC = () => {
  const {
    mode,
    activePanel,
    setActivePanel,
    setIsMobile,
    setIsPortrait,
    audioEnabled,
    isIntroLoading,
    setIsIntroLoading
  } = useGameStore();

  // Detect mobile viewport & orientation with debounce to prevent resize cascades on mobile
  useEffect(() => {
    let resizeTimer: any = null;
    const checkViewport = () => {
      clearTimeout(resizeTimer);
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
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('orientationchange', checkViewport);
    };
  }, [setIsMobile, setIsPortrait]);

  // Clean up orientation when leaving 3D mode
  useEffect(() => {
    if (mode === '2d') {
      unlockOrientationLock();
    }
  }, [mode]);

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

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Primary Experience Mode */}
      {mode === '3d' ? (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
          {/* 3D World Canvas */}
          <World />

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

      {/* Active Interactive Modals */}
      {activePanel === 'about' && <AboutModal />}
      {activePanel === 'projects' && <ProjectsModal />}
      {activePanel === 'skills' && <SkillsModal />}
      {activePanel === 'experience' && <ExperienceModal />}
      {activePanel === 'resume' && <ResumeModal />}
      {activePanel === 'contact' && <ContactModal />}
      {activePanel === 'blog' && <BlogModal />}
      {activePanel === 'settings' && <SettingsModal />}
      {activePanel === 'tutorial' && <TutorialModal />}
    </div>
  );
};

export default App;
