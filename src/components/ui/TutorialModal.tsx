import React from 'react';
import { X, Navigation, Hand, Eye, Sparkles, Check } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const TutorialModal: React.FC = () => {
  const { setActivePanel, audioEnabled, setAudioEnabled } = useGameStore();

  const handleClose = () => {
    if (!audioEnabled) {
      setAudioEnabled(true);
      sound.startRain();
      sound.playChime();
    } else {
      sound.playClick();
    }
    setActivePanel(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={20} color="#00e5ff" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>
                HOW TO EXPLORE THE 3D WORLD
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Controls, Navigation & Interaction Guide
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Movement */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start', background: 'rgba(15, 23, 42, 0.6)' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
              <Navigation size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                Movement & Sprinting
              </h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                Use <strong style={{ color: '#38bdf8' }}>W, A, S, D</strong> or <strong style={{ color: '#38bdf8' }}>Arrow Keys</strong> to walk. Hold <strong style={{ color: '#38bdf8' }}>Shift</strong> to sprint faster. Press <strong style={{ color: '#38bdf8' }}>Space</strong> to jump over curbs.
              </p>
            </div>
          </div>

          {/* Camera Orbit */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start', background: 'rgba(15, 23, 42, 0.6)' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
              <Eye size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                Camera Orbit & Zoom
              </h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                <strong style={{ color: '#a855f7' }}>Click & Drag</strong> the mouse anywhere on the scene to orbit around the character. Use the <strong style={{ color: '#a855f7' }}>Mouse Wheel</strong> to zoom in and out.
              </p>
            </div>
          </div>

          {/* Hologram Interaction */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start', background: 'rgba(15, 23, 42, 0.6)' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255, 0, 127, 0.1)', color: '#ff007f' }}>
              <Hand size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                Interactive Hologram Stations
              </h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                Walk up to any glowing pedestal along the rain boulevard and press <strong style={{ color: '#ff007f' }}>[E]</strong> or click the floating badge to open case studies, credentials, and live projects.
              </p>
            </div>
          </div>

          {/* Emotes */}
          <div className="glass-panel" style={{ padding: '14px 20px', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              Character Emotes:
            </span>
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
              <span className="tech-tag">[1] Salute</span>
              <span className="tech-tag">[2] Handshake</span>
              <span className="tech-tag">[3] Cough</span>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleClose}
            className="btn-cyber btn-cyber-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', marginTop: '6px' }}
          >
            <Check size={18} />
            Enter Experience (Audio On)
          </button>
        </div>
      </div>
    </div>
  );
};
