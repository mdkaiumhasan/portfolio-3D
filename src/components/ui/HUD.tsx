import React from 'react';
import {
  Volume2,
  VolumeX,
  Sliders,
  HelpCircle,
  Layout,
  Monitor,
  Terminal,
  Cpu,
  Radio,
  FileText,
  Send,
  User,
  Compass,
  Trophy
} from 'lucide-react';
import { useGameStore, STATIONS, ActivePanel } from '../../store/gameStore';
import { sound } from '../../systems/audio';

const StreetRadar: React.FC = React.memo(() => {
  const playerPosition = useGameStore((state) => state.playerPosition);

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '80px',
        right: '16px',
        width: '130px',
        height: '130px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10, 14, 25, 0.85)',
        pointerEvents: 'auto'
      }}
    >
      <div style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', fontWeight: 700, letterSpacing: '0.8px', color: '#38bdf8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Compass size={12} />
        STREET RADAR
      </div>

      {/* Circular Radar Screen */}
      <div
        style={{
          position: 'relative',
          width: '85px',
          height: '85px',
          borderRadius: '50%',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, rgba(10, 14, 25, 0.95) 75%)',
          overflow: 'hidden'
        }}
      >
        {/* Radar Grid Lines */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(56, 189, 248, 0.2)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(56, 189, 248, 0.2)' }} />

        {/* Stations Blips */}
        {STATIONS.map((st) => {
          const relX = (st.position[0] - playerPosition[0]) * 1.5;
          const relZ = (st.position[2] - playerPosition[2]) * 0.7;
          const screenX = 42.5 + relX;
          const screenY = 42.5 + relZ;

          if (screenX < 2 || screenX > 83 || screenY < 2 || screenY > 83) return null;

          return (
            <div
              key={st.id}
              title={st.title}
              style={{
                position: 'absolute',
                left: `${screenX}px`,
                top: `${screenY}px`,
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: st.color,
                boxShadow: `0 0 6px ${st.color}`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}

        {/* Player Center Blip */}
        <div
          style={{
            position: 'absolute',
            left: '42.5px',
            top: '42.5px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 8px #ffffff',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    </div>
  );
});

export const HUD: React.FC = () => {
  const {
    activePanel,
    setActivePanel,
    nearbyStation,
    audioEnabled,
    toggleAudio,
    mode,
    setMode,
    discoveredStations,
    activeNotification,
    setActiveEmote
  } = useGameStore();

  const [fps, setFps] = React.useState(60);
  const [renderStats, setRenderStats] = React.useState('');

  React.useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 500) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
        const stats = (window as any).__THREE_STATS__;
        if (stats) {
          setRenderStats(`${stats.calls} dc • ${Math.round(stats.triangles / 1000)}k`);
        }
      }
      animId = requestAnimationFrame(measureFps);
    };
    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleOpenPanel = (panel: ActivePanel) => {
    if (audioEnabled) sound.playClick();
    setActivePanel(panel);
  };

  const handleAudioToggle = () => {
    toggleAudio();
    if (!audioEnabled) {
      sound.startRain();
      sound.playChime();
    } else {
      sound.stopRain();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
      {/* Top Header Navigation Bar */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'auto'
        }}
      >
        {/* Left: Brand / Name Badge */}
        <div
          className="glass-panel"
          style={{
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(10, 14, 25, 0.9)'
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 10px #10b981'
              }}
            />
            <div
              className="pulse-indicator"
              style={{
                position: 'absolute',
                top: '-3px',
                left: '-3px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '1.5px solid #10b981'
              }}
            />
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px' }}>
              MD. KAIUM HASAN
            </div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '11px', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.8px' }}>
              FULLSTACK & SYSTEMS // CCNA ENGINEER
            </div>
          </div>
        </div>

        {/* Center: Fast Nav Bar (Hidden on small mobile, visible on desktop/tablet) */}
        <div
          className="glass-panel"
          style={{
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(10, 14, 25, 0.85)'
          }}
        >
          <button
            onClick={() => handleOpenPanel('about')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            <User size={13} color="#00e5ff" />
            About
          </button>
          <button
            onClick={() => handleOpenPanel('projects')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            <Terminal size={13} color="#ff007f" />
            Projects
          </button>
          <button
            onClick={() => handleOpenPanel('skills')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            <Cpu size={13} color="#39ff14" />
            Skills
          </button>
          <button
            onClick={() => handleOpenPanel('experience')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            <Radio size={13} color="#ffb703" />
            NOC
          </button>
          <button
            onClick={() => handleOpenPanel('resume')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px', borderColor: '#a855f7' }}
          >
            <FileText size={13} color="#a855f7" />
            Resumes
          </button>
          <button
            onClick={() => handleOpenPanel('contact')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            <Send size={13} color="#06b6d4" />
            Contact
          </button>
        </div>

        {/* Right: Quick Action Controls */}
        <div
          className="glass-panel"
          style={{
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(10, 14, 25, 0.9)'
          }}
        >
          {/* Real-time FPS Monitor */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              fontFamily: 'var(--font-hud)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              color: fps >= 50 ? '#22c55e' : fps >= 30 ? '#eab308' : '#ef4444'
            }}
            title="Real-time frame rate"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: fps >= 50 ? '#22c55e' : fps >= 30 ? '#eab308' : '#ef4444',
                display: 'inline-block'
              }}
            />
            {fps} FPS {renderStats ? `[${renderStats}]` : ''}
          </div>

          {/* Audio */}
          <button
            onClick={handleAudioToggle}
            className="btn-cyber"
            style={{ padding: '8px', borderRadius: '8px' }}
            title={audioEnabled ? 'Mute Sound' : 'Enable Rain & SFX'}
          >
            {audioEnabled ? <Volume2 size={16} color="#38bdf8" /> : <VolumeX size={16} color="#94a3b8" />}
          </button>

          {/* Mode Switch (3D <-> 2D) */}
          <button
            onClick={() => {
              if (audioEnabled) sound.playClick();
              setMode(mode === '3d' ? '2d' : '3d');
            }}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px' }}
            title="Switch View Mode"
          >
            {mode === '3d' ? <Layout size={14} color="#ff007f" /> : <Monitor size={14} color="#00e5ff" />}
            {mode === '3d' ? '2D View' : '3D World'}
          </button>

          {/* Settings */}
          <button
            onClick={() => handleOpenPanel('settings')}
            className="btn-cyber"
            style={{ padding: '8px', borderRadius: '8px' }}
            title="Settings"
          >
            <Sliders size={16} />
          </button>

          {/* Help */}
          <button
            onClick={() => handleOpenPanel('tutorial')}
            className="btn-cyber"
            style={{ padding: '8px', borderRadius: '8px' }}
            title="Controls & Guide"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </div>

      {/* Top-Right: Mini-Radar Compass */}
      <StreetRadar />

      {/* Top-Left: Station Discovery Progress */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '80px',
          left: '16px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(10, 14, 25, 0.85)',
          pointerEvents: 'auto'
        }}
      >
        <Trophy size={16} color="#fbbf24" />
        <div>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>
            Exploration Quests
          </div>
          <div style={{ fontSize: '13px', fontFamily: 'var(--font-hud)', fontWeight: 700, color: '#ffffff', letterSpacing: '0.4px' }}>
            {discoveredStations.length} / {STATIONS.length} Stations Discovered
          </div>
        </div>
      </div>

      {/* Center: Achievement Notification Toast */}
      {activeNotification && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '85px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(13, 18, 30, 0.95) 100%)',
            border: '1.5px solid #fbbf24',
            boxShadow: '0 0 25px rgba(251, 191, 36, 0.4)',
            animation: 'modalFadeIn 0.3s ease-out',
            pointerEvents: 'auto'
          }}
        >
          <Trophy size={22} color="#fbbf24" />
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', color: '#fcd34d', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              {activeNotification.title}
            </div>
            <div style={{ fontSize: '13px', fontFamily: 'var(--font-body)', color: '#ffffff', fontWeight: 500 }}>
              {activeNotification.subtitle}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Center: Nearby Station Interaction Banner */}
      {nearbyStation && !activePanel && (
        <div
          onClick={() => {
            if (audioEnabled) sound.playChime();
            setActivePanel(nearbyStation.panel);
          }}
          className="glass-panel"
          style={{
            position: 'absolute',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(10, 14, 25, 0.95)',
            border: `2px solid ${nearbyStation.color}`,
            boxShadow: `0 0 30px ${nearbyStation.color}88`,
            cursor: 'pointer',
            pointerEvents: 'auto',
            animation: 'modalFadeIn 0.2s ease-out'
          }}
        >
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: nearbyStation.color,
              color: '#000000',
              fontWeight: 800,
              fontFamily: 'var(--font-hud)',
              fontSize: '15px',
              letterSpacing: '0.5px'
            }}
          >
            [E]
          </span>

          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
              Enter {nearbyStation.title}
            </div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '12px', color: nearbyStation.color, fontWeight: 600, letterSpacing: '0.5px' }}>
              Press [E] or Click to inspect station
            </div>
          </div>
        </div>
      )}

      {/* Bottom Left: Emotes Desktop Toolbar */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(10, 14, 25, 0.8)',
          pointerEvents: 'auto'
        }}
      >
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', color: '#94a3b8', marginRight: '4px', fontWeight: 700, letterSpacing: '0.6px' }}>Emotes:</span>
        <button
          onClick={() => setActiveEmote('salute')}
          className="btn-cyber"
          style={{ padding: '4px 8px', fontSize: '11px' }}
        >
          [1] Salute
        </button>
        <button
          onClick={() => setActiveEmote('shakehand')}
          className="btn-cyber"
          style={{ padding: '4px 8px', fontSize: '11px' }}
        >
          [2] Handshake
        </button>
        <button
          onClick={() => setActiveEmote('cough')}
          className="btn-cyber"
          style={{ padding: '4px 8px', fontSize: '11px' }}
        >
          [3] Cough
        </button>
      </div>
    </div>
  );
};
