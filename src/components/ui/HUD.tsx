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
  Trophy,
  BookOpen
} from 'lucide-react';
import { useGameStore, STATIONS, ActivePanel } from '../../store/gameStore';
import { usePortfolioData, extractAuthorName, extractAuthorRole } from '../../hooks/usePortfolioData';
import { sound } from '../../systems/audio';
import { unlockOrientationLock } from '../../utils/orientation';

const StreetRadar: React.FC = React.memo(() => {
  const playerPosition = useGameStore((state) => state.playerPosition);

  return (
    <div
      className="glass-panel hud-radar-mobile"
      style={{
        position: 'absolute',
        top: '76px',
        right: 'max(16px, env(safe-area-inset-right, 16px))',
        width: '120px',
        height: '120px',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10, 14, 25, 0.85)',
        pointerEvents: 'auto'
      }}
    >
      <div className="hud-radar-label" style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', fontWeight: 700, letterSpacing: '0.8px', color: '#38bdf8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Compass size={12} />
        RADAR
      </div>

      <div
        className="hud-radar-circle"
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
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(56, 189, 248, 0.2)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(56, 189, 248, 0.2)' }} />

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
                left: `${(screenX / 85) * 100}%`,
                top: `${(screenY / 85) * 100}%`,
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

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
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

const FpsBadge: React.FC<{ isMobile: boolean }> = React.memo(({ isMobile }) => {
  const [fps, setFps] = React.useState(60);
  const [renderStats, setRenderStats] = React.useState('');

  React.useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 600) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
        const stats = (window as any).__THREE_STATS__;
        if (stats && !isMobile) {
          setRenderStats(`${stats.calls} dc • ${Math.round(stats.triangles / 1000)}k`);
        }
      }
      animId = requestAnimationFrame(measureFps);
    };
    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, [isMobile]);

  const statusColor = fps >= 50 ? '#22c55e' : fps >= 30 ? '#eab308' : '#ef4444';

  return (
    <div
      className="hud-fps-badge"
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
        color: statusColor,
        whiteSpace: 'nowrap'
      }}
      title="Real-time frame rate"
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: statusColor,
          display: 'inline-block'
        }}
      />
      {fps} FPS {!isMobile && renderStats ? `[${renderStats}]` : ''}
    </div>
  );
});

export const HUD: React.FC = React.memo(() => {
  const activePanel = useGameStore((s) => s.activePanel);
  const setActivePanel = useGameStore((s) => s.setActivePanel);
  const nearbyStation = useGameStore((s) => s.nearbyStation);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const toggleAudio = useGameStore((s) => s.toggleAudio);
  const mode = useGameStore((s) => s.mode);
  const setMode = useGameStore((s) => s.setMode);
  const discoveredCount = useGameStore((s) => s.discoveredStations.length);
  const activeNotification = useGameStore((s) => s.activeNotification);
  const setActiveEmote = useGameStore((s) => s.setActiveEmote);
  const isMobile = useGameStore((s) => s.isMobile);
  const availableForWork = usePortfolioData().data.available_for_work !== false;

  const { data } = usePortfolioData();
  const authorName = React.useMemo(() => {
    return extractAuthorName(data.home_heading).toUpperCase();
  }, [data.home_heading]);

  const authorSubheading = React.useMemo(() => {
    return extractAuthorRole(data.home_subheading, data.home_heading);
  }, [data.home_subheading, data.home_heading]);

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

  const dotColor = availableForWork ? '#10b981' : '#f43f5e';

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
      {/* Top Header Navigation Bar */}
      <div
        className="hud-header"
        style={{
          position: 'absolute',
          top: 'max(14px, env(safe-area-inset-top, 14px))',
          left: 'max(16px, env(safe-area-inset-left, 16px))',
          right: 'max(16px, env(safe-area-inset-right, 16px))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'auto'
        }}
      >
        {/* Left: Brand / Name Badge */}
        <div
          className="glass-panel hud-brand"
          onClick={() => handleOpenPanel('about')}
          style={{
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(10, 14, 25, 0.9)',
            height: '46px',
            boxSizing: 'border-box',
            flexShrink: 0,
            cursor: 'pointer'
          }}
          title={availableForWork ? 'Available for Work — Click to view Dossier' : 'Currently Engaged — Click to view Dossier'}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: dotColor,
                boxShadow: `0 0 10px ${dotColor}`
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
                border: `1.5px solid ${dotColor}`
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
            <div
              className="hud-brand-title"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '13px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2
              }}
            >
              {authorName}
            </div>
            <div
              className="hud-brand-subtitle"
              style={{
                fontFamily: 'var(--font-hud)',
                fontSize: '10px',
                color: '#38bdf8',
                fontWeight: 700,
                letterSpacing: '0.8px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2,
                marginTop: '2px'
              }}
            >
              {authorSubheading}
            </div>
          </div>
        </div>

        {/* Center: Fast Nav Bar (Horizontally scrollable on mobile) */}
        <div
          className="glass-panel hud-nav-scroll"
          style={{
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(10, 14, 25, 0.85)',
            flexShrink: 1,
            minWidth: 0
          }}
        >
          <button
            type="button"
            onClick={() => handleOpenPanel('about')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
          >
            <User size={13} color="#00e5ff" />
            About
          </button>
          <button
            type="button"
            onClick={() => handleOpenPanel('projects')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
          >
            <Terminal size={13} color="#ff007f" />
            Projects
          </button>
          <button
            type="button"
            onClick={() => handleOpenPanel('skills')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
          >
            <Cpu size={13} color="#39ff14" />
            Skills
          </button>
          <button
            type="button"
            onClick={() => handleOpenPanel('experience')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
          >
            <Radio size={13} color="#ffb703" />
            NOC
          </button>
          <button
            type="button"
            onClick={() => handleOpenPanel('resume')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px', borderColor: '#a855f7', whiteSpace: 'nowrap' }}
          >
            <FileText size={13} color="#a855f7" />
            Resumes
          </button>
          <button
            type="button"
            onClick={() => handleOpenPanel('contact')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
          >
            <Send size={13} color="#06b6d4" />
            Contact
          </button>
          <button
            type="button"
            onClick={() => handleOpenPanel('blog')}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px', borderColor: '#f43f5e', whiteSpace: 'nowrap' }}
          >
            <BookOpen size={13} color="#f43f5e" />
            Blog
          </button>
        </div>

        {/* Right: Quick Action Controls */}
        <div
          className="glass-panel hud-actions"
          style={{
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(10, 14, 25, 0.9)',
            flexShrink: 0
          }}
        >
          <FpsBadge isMobile={isMobile} />

          <button
            type="button"
            onClick={handleAudioToggle}
            className="btn-cyber"
            style={{ padding: '8px', borderRadius: '8px' }}
            title={audioEnabled ? 'Mute Sound' : 'Enable Rain & SFX'}
          >
            {audioEnabled ? <Volume2 size={16} color="#38bdf8" /> : <VolumeX size={16} color="#94a3b8" />}
          </button>

          <button
            type="button"
            onClick={() => {
              if (audioEnabled) sound.playClick();
              if (mode === '3d') {
                unlockOrientationLock();
              }
              setMode(mode === '3d' ? '2d' : '3d');
            }}
            className="btn-cyber"
            style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
            title="Switch View Mode"
          >
            {mode === '3d' ? <Layout size={14} color="#ff007f" /> : <Monitor size={14} color="#00e5ff" />}
            {mode === '3d' ? '2D View' : '3D World'}
          </button>

          <button
            type="button"
            onClick={() => handleOpenPanel('settings')}
            className="btn-cyber"
            style={{ padding: '8px', borderRadius: '8px' }}
            title="Settings"
          >
            <Sliders size={16} />
          </button>

          <button
            type="button"
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
        className="glass-panel hud-quests-mobile"
        style={{
          position: 'absolute',
          top: '76px',
          left: 'max(16px, env(safe-area-inset-left, 16px))',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(10, 14, 25, 0.85)',
          pointerEvents: 'auto'
        }}
      >
        <Trophy size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
        <div>
          <div className="hud-quests-label" style={{ fontSize: '11px', fontFamily: 'var(--font-hud)', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>
            Exploration Quests
          </div>
          <div style={{ fontSize: '13px', fontFamily: 'var(--font-hud)', fontWeight: 700, color: '#ffffff', letterSpacing: '0.4px' }}>
            {discoveredCount} / {STATIONS.length} Stations
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
          className="glass-panel hud-interact-banner"
          style={{
            position: 'absolute',
            bottom: 'max(28px, calc(16px + env(safe-area-inset-bottom, 0px)))',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'rgba(10, 14, 25, 0.95)',
            border: `2px solid ${nearbyStation.color}`,
            boxShadow: `0 0 30px ${nearbyStation.color}88`,
            cursor: 'pointer',
            pointerEvents: 'auto',
            animation: 'modalFadeIn 0.2s ease-out',
            maxWidth: 'min(420px, 60vw)'
          }}
        >
          <span
            style={{
              padding: '6px 11px',
              borderRadius: '6px',
              background: nearbyStation.color,
              color: '#000000',
              fontWeight: 800,
              fontFamily: 'var(--font-hud)',
              fontSize: '14px',
              letterSpacing: '0.5px',
              flexShrink: 0
            }}
          >
            {isMobile ? 'TAP' : '[E]'}
          </span>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Enter {nearbyStation.title}
            </div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '12px', color: nearbyStation.color, fontWeight: 600, letterSpacing: '0.5px' }}>
              {isMobile ? 'Tap banner or OPEN button' : 'Press [E] or Click to inspect'}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Left: Emotes Desktop Toolbar (Hidden on mobile touch devices) */}
      {!isMobile && (
        <div
          className="glass-panel desktop-only"
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
            type="button"
            onClick={() => setActiveEmote('salute')}
            className="btn-cyber"
            style={{ padding: '4px 8px', fontSize: '11px' }}
          >
            [1] Salute
          </button>
          <button
            type="button"
            onClick={() => setActiveEmote('shakehand')}
            className="btn-cyber"
            style={{ padding: '4px 8px', fontSize: '11px' }}
          >
            [2] Handshake
          </button>
          <button
            type="button"
            onClick={() => setActiveEmote('cough')}
            className="btn-cyber"
            style={{ padding: '4px 8px', fontSize: '11px' }}
          >
            [3] Cough
          </button>
        </div>
      )}
    </div>
  );
});
