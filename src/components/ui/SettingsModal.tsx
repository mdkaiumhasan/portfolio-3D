import React from 'react';
import { X, Volume2, VolumeX, Monitor, Sliders, Sparkles, Layout } from 'lucide-react';
import { useGameStore, QualityTier } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const SettingsModal: React.FC = () => {
  const {
    setActivePanel,
    audioEnabled,
    toggleAudio,
    qualityTier,
    setQualityTier,
    mode,
    setMode
  } = useGameStore();

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const handleQualityChange = (tier: QualityTier) => {
    if (audioEnabled) sound.playClick();
    setQualityTier(tier);
  };

  const handleModeSwitch = (newMode: '3d' | '2d') => {
    if (audioEnabled) sound.playClick();
    setMode(newMode);
    setActivePanel(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sliders size={20} color="#38bdf8" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>
              EXPERIENCE SETTINGS
            </h2>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Audio Engine Setting */}
          <div
            className="glass-panel"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.6)'
            }}
          >
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>
                Procedural Sound & Rain
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Synthesized ambient rain, footsteps, jumps, and UI chimes
              </div>
            </div>

            <button
              onClick={() => {
                toggleAudio();
                if (!audioEnabled) {
                  sound.startRain();
                  sound.playChime();
                } else {
                  sound.stopRain();
                }
              }}
              className="btn-cyber"
              style={{
                background: audioEnabled ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.5)',
                borderColor: audioEnabled ? '#38bdf8' : 'rgba(148, 163, 184, 0.2)'
              }}
            >
              {audioEnabled ? <Volume2 size={16} color="#38bdf8" /> : <VolumeX size={16} color="#94a3b8" />}
              {audioEnabled ? 'Active' : 'Muted'}
            </button>
          </div>

          {/* Graphics Quality */}
          <div
            className="glass-panel"
            style={{
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.6)'
            }}
          >
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>
                Rendering Quality Profile
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Tune shadow maps, pixel ratio, and particle count for peak FPS
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {(['low', 'medium', 'high'] as QualityTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleQualityChange(tier)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: qualityTier === tier ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, rgba(37, 99, 235, 0.25) 100%)' : 'rgba(30, 41, 59, 0.4)',
                    border: `1.5px solid ${qualityTier === tier ? '#38bdf8' : 'rgba(148, 163, 184, 0.2)'}`,
                    color: qualityTier === tier ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.2s ease',
                    boxShadow: qualityTier === tier ? '0 0 12px rgba(56, 189, 248, 0.3)' : 'none'
                  }}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Mode (3D vs 2D) */}
          <div
            className="glass-panel"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.6)'
            }}
          >
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>
                Display Mode
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Switch between 3D Free Roam and 2D Classic Portfolio view
              </div>
            </div>

            <button
              onClick={() => handleModeSwitch(mode === '3d' ? '2d' : '3d')}
              className="btn-cyber btn-cyber-primary"
            >
              {mode === '3d' ? <Layout size={15} /> : <Monitor size={15} />}
              {mode === '3d' ? 'Switch to 2D' : 'Switch to 3D'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
