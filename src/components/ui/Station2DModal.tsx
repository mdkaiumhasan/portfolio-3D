import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

interface Station2DModalProps {
  station: 'about' | 'projects' | 'skills' | 'experience' | 'resume' | 'contact';
}

export const Station2DModal: React.FC<Station2DModalProps> = ({ station }) => {
  const { setActivePanel, audioEnabled } = useGameStore();

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === 'CLOSE_PANEL' || e.data?.type === 'CLOSE_MODAL' || e.data?.type === 'ENTER_3D') {
        handleClose();
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        backgroundColor: '#212529',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top Floating "Return to 3D World" Button */}
      <button
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.5rem',
          zIndex: 1001,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '9999px',
          background: 'rgba(33, 37, 41, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid #28a745',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '13px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6), 0 0 12px rgba(40, 167, 69, 0.3)',
          transition: 'all 0.2s ease'
        }}
        title="Return to 3D World (Esc)"
      >
        <X size={18} color="#28a745" />
        <span>Return to 3D World</span>
      </button>

      {/* Embedded 100% Identical 2D Portfolio View */}
      <iframe
        src={`/classic.html?station=${station}&theme=dark`}
        title={`2D Portfolio - ${station}`}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
      />
    </div>
  );
};
