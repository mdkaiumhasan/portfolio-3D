import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, Layout } from 'lucide-react';
import { useProgress } from '@react-three/drei';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';
import { preloadAndCacheModel, isModelInCache } from '../../utils/assetCache';
import { RAIN_STREET_MODEL_URL } from '../world/RainStreet';

interface LoadingScreenProps {
  onLoaded: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const { progress, active } = useProgress();
  const [minTimerDone, setMinTimerDone] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [downloadStats, setDownloadStats] = useState<{ percent: number; loadedMB: number; totalMB: number }>({
    percent: 0,
    loadedMB: 0,
    totalMB: 89.5,
  });
  const { setMode, setAudioEnabled } = useGameStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimerDone(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Preload and verify that the 90MB map model is 100% downloaded and stored in persistent cache
  useEffect(() => {
    let isMounted = true;

    // Check if already in persistent local disk cache
    isModelInCache(RAIN_STREET_MODEL_URL).then((cached) => {
      if (!isMounted) return;
      if (cached) {
        setDownloadStats({ percent: 100, loadedMB: 89.5, totalMB: 89.5 });
        setModelReady(true);
      } else {
        // Stream download with live byte tracker and save to cache
        preloadAndCacheModel(RAIN_STREET_MODEL_URL, (percent, loadedMB, totalMB) => {
          if (!isMounted) return;
          setDownloadStats({ percent, loadedMB, totalMB });
          if (percent >= 100) {
            setModelReady(true);
          }
        }).then(() => {
          if (isMounted) setModelReady(true);
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const isReady = modelReady && (progress >= 90 || !active) && minTimerDone;

  const displayProgress = isReady
    ? 100
    : modelReady
    ? Math.max(90, Math.min(99, Math.round(progress)))
    : Math.max(10, Math.min(99, Math.round(downloadStats.percent)));

  const statusText = !isReady
    ? downloadStats.loadedMB > 0 && !modelReady
      ? `DOWNLOADING 3D WORLD: ${downloadStats.loadedMB.toFixed(1)} MB / ${downloadStats.totalMB.toFixed(1)} MB (${Math.round(downloadStats.percent)}%)...`
      : `INITIALIZING 3D WORLD ASSETS (${displayProgress}%)...`
    : 'SYSTEM READY // WORLD GENERATED';


  const handleEnterWorld = (enableAudio: boolean) => {
    if (enableAudio) {
      setAudioEnabled(true);
      sound.startRain();
      sound.playChime();
    }
    onLoaded();
  };

  const handleSkipTo2D = () => {
    setMode('2d');
    onLoaded();
  };

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
        overflow: 'hidden'
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
          maxWidth: '520px',
          width: '100%',
          padding: '36px 30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          textAlign: 'center',
          background: 'rgba(13, 17, 27, 0.95)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 0 40px rgba(14, 165, 233, 0.25)'
        }}
      >
        {/* Pulsing Core Icon */}
        <div
          style={{
            position: 'relative',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(37, 99, 235, 0.35) 100%)',
            border: '2px solid #38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)'
          }}
        >
          <Sparkles size={28} color="#38bdf8" />
        </div>

        {/* Title */}
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 900, color: '#ffffff', letterSpacing: '1px', margin: 0 }}>
            MD. KAIUM HASAN
          </h1>
          <p style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 600, marginTop: '4px', margin: 0 }}>
            3D INTERACTIVE DEVELOPER PORTFOLIO
          </p>
        </div>

        {/* Progress Bar Container */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              width: '100%',
              height: '8px',
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

        {/* Ready Actions */}
        {isReady ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '6px' }}>
            <button
              onClick={() => handleEnterWorld(true)}
              className="btn-cyber btn-cyber-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px' }}
            >
              <Volume2 size={18} />
              Enter 3D World (With Sound)
            </button>

            <button
              onClick={() => handleEnterWorld(false)}
              className="btn-cyber"
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px' }}
            >
              <VolumeX size={16} />
              Enter Silently
            </button>

            <button
              onClick={handleSkipTo2D}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '12px',
                cursor: 'pointer',
                marginTop: '4px',
                textDecoration: 'underline'
              }}
            >
              Skip to 2D Classic Portfolio View
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', marginTop: '4px' }}>
            <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
              Exploring real-time architectures, enterprise microservices & CCNA networking
            </p>
            <button
              onClick={handleSkipTo2D}
              style={{
                background: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '6px',
                padding: '8px 16px',
                color: '#38bdf8',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Layout size={14} />
              Instant Fast Load: Go Directly to 2D Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
