import React, { useState, useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';

interface LoadingScreenProps {
  onLoaded: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const { progress, active } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(20);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const hasFinishedRef = useRef(false);

  const finishLoading = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      onLoaded();
    }, 350);
  };

  // Smoothly increment progress and never stall
  useEffect(() => {
    const target = progress >= 88 ? 100 : Math.max(displayProgress, Math.round(progress));
    setDisplayProgress((prev) => Math.max(prev, target));

    if ((target >= 100 || !active) && !hasFinishedRef.current) {
      const enterTimer = setTimeout(() => {
        finishLoading();
      }, 200);
      return () => clearTimeout(enterTimer);
    }
  }, [progress, active]);

  // Safety fallback: Automatically enter within 1.8 seconds max under any network condition
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setDisplayProgress(100);
      finishLoading();
    }, 1800);

    return () => clearTimeout(safetyTimer);
  }, []);

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
        transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
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
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '380px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Glowing Indicator Core */}
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#00e5ff',
            boxShadow: '0 0 20px #00e5ff, 0 0 40px rgba(0, 229, 255, 0.6)'
          }}
        />

        {/* Title */}
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '18px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '1px',
              margin: 0
            }}
          >
            MD. KAIUM HASAN
          </h2>
          <p
            style={{
              fontSize: '12px',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              marginTop: '4px',
              margin: 0,
              letterSpacing: '0.5px'
            }}
          >
            ENTERING 3D INTERACTIVE WORLD
          </p>
        </div>

        {/* Sleek Minimal Progress Bar */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
          <div
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
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
                boxShadow: '0 0 10px #00e5ff',
                transition: 'width 0.25s ease-out'
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#94a3b8',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <span>INITIALIZING...</span>
            <span style={{ color: '#00e5ff', fontWeight: 700 }}>{displayProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
