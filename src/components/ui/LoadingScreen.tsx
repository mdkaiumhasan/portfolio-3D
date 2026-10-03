import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Layout, VolumeX, ArrowRight } from 'lucide-react';
import { useProgress } from '@react-three/drei';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

interface LoadingScreenProps {
  onLoaded: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const { progress, active } = useProgress();
  const { setMode, setAudioEnabled } = useGameStore();
  const [displayProgress, setDisplayProgress] = useState(25);
  const [isReady, setIsReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const hasTriggeredLoaded = useRef(false);

  // Check if user has already entered 3D world in this session (e.g. page reload)
  const isReload = typeof window !== 'undefined' && sessionStorage.getItem('visited_3d') === 'true';

  const triggerLoaded = (enableAudio: boolean = false) => {
    if (hasTriggeredLoaded.current) return;
    hasTriggeredLoaded.current = true;
    sessionStorage.setItem('visited_3d', 'true');

    if (enableAudio) {
      setAudioEnabled(true);
      sound.startRain();
      sound.playChime();
    }

    setIsFadingOut(true);
    setTimeout(() => {
      onLoaded();
    }, 300);
  };

  // Smoothly increment and never freeze at 96%
  useEffect(() => {
    // If drei reports 85% or higher, accelerate to 100%
    const target = progress >= 88 ? 100 : Math.max(displayProgress, Math.round(progress));
    setDisplayProgress((prev) => Math.max(prev, target));

    if (target >= 100 || !active) {
      setIsReady(true);
    }
  }, [progress, active]);

  // Safety fallback timers
  useEffect(() => {
    // 1. Max wait timeout: force ready after 2.2 seconds max (or 800ms on reload)
    const maxTimeoutMs = isReload ? 800 : 2200;
    const safetyTimer = setTimeout(() => {
      setDisplayProgress(100);
      setIsReady(true);
    }, maxTimeoutMs);

    return () => clearTimeout(safetyTimer);
  }, [isReload]);

  // Automatic entry on page reload once ready
  useEffect(() => {
    if (isReady && isReload && !hasTriggeredLoaded.current) {
      // User is reloading the page: auto enter immediately!
      const reloadTimer = setTimeout(() => {
        triggerLoaded(false);
      }, 250);
      return () => clearTimeout(reloadTimer);
    }
  }, [isReady, isReload]);

  // Automatic countdown entry for first-time visitors once 100% ready (after 2s)
  useEffect(() => {
    if (isReady && !isReload && !hasTriggeredLoaded.current) {
      const autoEnterTimer = setTimeout(() => {
        triggerLoaded(false);
      }, 2500);
      return () => clearTimeout(autoEnterTimer);
    }
  }, [isReady, isReload]);

  const handleSkipTo2D = () => {
    sessionStorage.setItem('visited_3d', 'true');
    setMode('2d');
    onLoaded();
  };

  const statusText = !isReady
    ? `INITIALIZING 3D WORLD ASSETS (${displayProgress}%)...`
    : 'SYSTEM READY // WORLD GENERATED';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#07090e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflow: 'hidden',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        pointerEvents: isFadingOut ? 'none' : 'auto'
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(7, 9, 14, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        className="glass-panel"
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
          textAlign: 'center',
          background: 'rgba(13, 17, 27, 0.95)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 0 40px rgba(14, 165, 233, 0.25)'
        }}
      >
        {/* Pulsing Core Hologram */}
        <div
          style={{
            position: 'relative',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(37, 99, 235, 0.35) 100%)',
            border: '2px solid #00e5ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(0, 229, 255, 0.45)'
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: isReady ? '#39ff14' : '#00e5ff',
              boxShadow: isReady ? '0 0 12px #39ff14' : '0 0 12px #00e5ff',
              transition: 'all 0.3s ease'
            }}
          />
        </div>

        {/* Title */}
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.8px', margin: 0 }}>
            MD. KAIUM HASAN
          </h1>
          <p style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600, marginTop: '4px', margin: 0 }}>
            3D INTERACTIVE DEVELOPER PORTFOLIO
          </p>
        </div>

        {/* Progress Bar Container */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              width: '100%',
              height: '7px',
              borderRadius: '4px',
              background: 'rgba(30, 41, 59, 0.8)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: `${displayProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 50%, #00e5ff 100%)',
                boxShadow: '0 0 12px #00e5ff',
                transition: 'width 0.3s ease-out'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            <span>{statusText}</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{displayProgress}%</span>
          </div>
        </div>

        {/* Actions / Ready State */}
        {isReady ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', width: '100%', marginTop: '4px' }}>
            <button
              onClick={() => triggerLoaded(true)}
              className="btn-cyber btn-cyber-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '13px' }}
            >
              <Volume2 size={16} />
              Enter 3D World (Sound On)
            </button>

            <button
              onClick={() => triggerLoaded(false)}
              className="btn-cyber"
              style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: '12.5px' }}
            >
              <VolumeX size={15} />
              Enter Silently
            </button>

            <button
              onClick={handleSkipTo2D}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '11.5px',
                cursor: 'pointer',
                marginTop: '2px',
                textDecoration: 'underline'
              }}
            >
              Switch to 2D Classic Portfolio
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%', marginTop: '2px' }}>
            <p style={{ fontSize: '11.5px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
              Exploring real-time architectures, enterprise microservices & CCNA networking
            </p>
            <button
              onClick={handleSkipTo2D}
              style={{
                background: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '6px',
                padding: '7px 14px',
                color: '#38bdf8',
                fontSize: '11.5px',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Layout size={13} />
              Instant Fast Load: Go Directly to 2D Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
