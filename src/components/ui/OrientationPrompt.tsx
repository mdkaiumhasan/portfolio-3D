import React, { useState } from 'react';
import { Smartphone, Maximize2, Layout, X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { requestLandscapeLock } from '../../utils/orientation';
import { sound } from '../../systems/audio';

export const OrientationPrompt: React.FC = () => {
  const {
    mode,
    setMode,
    isMobile,
    isPortrait,
    audioEnabled,
    isIntroLoading
  } = useGameStore();

  const [isRotating, setIsRotating] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Strictly block 3D world on mobile portrait - user MUST rotate to landscape or switch to 2D
  if (
    mode !== '3d' ||
    !isMobile ||
    !isPortrait ||
    isIntroLoading
  ) {
    return null;
  }

  const handleAutoRotate = async () => {
    if (audioEnabled) sound.playClick();
    setIsRotating(true);
    const success = await requestLandscapeLock();
    setIsRotating(false);
    if (!success) {
      setShowHint(true);
    }
  };

  const handleSwitch2D = () => {
    if (audioEnabled) sound.playClick();
    setMode('2d');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(5, 8, 18, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#eaf0ff',
        userSelect: 'none',
        animation: 'modalFadeIn 0.3s ease-out'
      }}
    >
      {/* Exit Button in top corner - switches to 2D View */}
      <button
        onClick={handleSwitch2D}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#94a3b8',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        aria-label="Exit to 2D Mode"
        title="Exit to 2D Mode"
      >
        <X size={18} />
      </button>

      {/* Futuristic Cyber Badge Container */}
      <div
        className="glass-panel"
        style={{
          maxWidth: '380px',
          width: '100%',
          padding: '28px 22px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(14, 21, 38, 0.95) 0%, rgba(8, 12, 24, 0.98) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 0 35px rgba(0, 229, 255, 0.25), inset 0 0 20px rgba(56, 189, 248, 0.08)',
          borderRadius: '20px'
        }}
      >
        {/* Animated Rotating Smartphone Graphic */}
        <div
          style={{
            position: 'relative',
            width: '90px',
            height: '90px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Neon Ring Glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px dashed rgba(56, 189, 248, 0.35)',
              animation: 'spinOrbit 10s linear infinite'
            }}
          />

          {/* Phone Icon with smooth 90-degree continuous rotation keyframe */}
          <div
            style={{
              animation: 'phoneRotateCycle 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Smartphone size={46} color="#38bdf8" strokeWidth={1.8} />
          </div>
        </div>

        {/* Heading */}
        <div
          style={{
            fontFamily: 'var(--font-hud)',
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '1px',
            color: '#38bdf8',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}
        >
          Rotate For 3D World
        </div>

        {/* Subtitle in Bengali & English */}
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13.5px',
            fontWeight: 600,
            color: '#ffffff',
            marginBottom: '8px'
          }}
        >
          ফোনটি আড়াআড়ি (Landscape) ঘুরিয়ে নিন
        </div>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            lineHeight: 1.5,
            color: '#94a3b8',
            marginBottom: '22px'
          }}
        >
          3D Cyberpunk শহরটি সম্পূর্ণ Landscape ওয়াইডস্ক্রিনের জন্য অপ্টিমাইজড। গেমপ্যাড কন্ট্রোল ও ৩ডি এক্সপেরিয়েন্সের জন্য ফোনটি ঘুরিয়ে নিন।
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {/* 1. Auto Rotate / Fullscreen */}
          <button
            onClick={handleAutoRotate}
            disabled={isRotating}
            className="btn-cyber btn-cyber-primary"
            style={{
              justifyContent: 'center',
              padding: '12px 16px',
              fontSize: '13px',
              width: '100%',
              borderRadius: '10px'
            }}
          >
            <Maximize2 size={16} />
            <span>{isRotating ? 'Rotating...' : 'Auto Rotate (Fullscreen)'}</span>
          </button>

          {/* 2. Switch to 2D Mode */}
          <button
            onClick={handleSwitch2D}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              color: '#e2e8f0',
              padding: '11px 16px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontFamily: 'var(--font-hud)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
          >
            <Layout size={14} color="#00e5ff" />
            <span>Switch to 2D Mode (Vertical)</span>
          </button>
        </div>

        {/* Rotation Hint if Auto-Rotate needs manual tilt */}
        {showHint && (
          <div
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '8px',
              color: '#38bdf8',
              fontSize: '11.5px',
              fontFamily: 'var(--font-hud)',
              animation: 'modalFadeIn 0.2s ease-out'
            }}
          >
            📱 অনুগ্রহ করে আপনার ফোনটি আড়াআড়ি (Landscape) ঘুরিয়ে নিন
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes phoneRotateCycle {
          0%, 15% {
            transform: rotate(0deg) scale(1);
          }
          45%, 75% {
            transform: rotate(-90deg) scale(1.08);
          }
          95%, 100% {
            transform: rotate(0deg) scale(1);
          }
        }
        @keyframes spinOrbit {
          from { transform: rotate(0deg); }
          to { rotate: 360deg; }
        }
      `}</style>
    </div>
  );
};
