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
import { SettingsModal } from './components/ui/SettingsModal';
import { TutorialModal } from './components/ui/TutorialModal';
import { useGameStore } from './store/gameStore';
import { sound } from './systems/audio';
import './styles/hud.css';

export const App: React.FC = () => {
  const { mode, activePanel, setActivePanel, setIsMobile, audioEnabled } = useGameStore();
  const [isLoading, setIsLoading] = useState(mode === '3d');

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const isMob = window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
      setIsMobile(isMob);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

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
      {/* Initial Loading Screen */}
      {isLoading && (
        <LoadingScreen onLoaded={() => setIsLoading(false)} />
      )}

      {/* Primary Experience Mode */}
      {mode === '3d' ? (
        <>
          {/* 3D World Canvas */}
          <World />

          {/* Heads Up Display & Overlays */}
          <HUD />

          {/* Mobile Touch Joystick & Action Buttons */}
          <MobileControls />
        </>
      ) : (
        /* 2D Modern Glassmorphic View */
        <Classic2DView />
      )}

      {/* Active Interactive Modals */}
      {activePanel === 'about' && <AboutModal />}
      {activePanel === 'projects' && <ProjectsModal />}
      {activePanel === 'skills' && <SkillsModal />}
      {activePanel === 'experience' && <ExperienceModal />}
      {activePanel === 'resume' && <ResumeModal />}
      {activePanel === 'contact' && <ContactModal />}
      {activePanel === 'settings' && <SettingsModal />}
      {activePanel === 'tutorial' && <TutorialModal />}
    </div>
  );
};

export default App;
