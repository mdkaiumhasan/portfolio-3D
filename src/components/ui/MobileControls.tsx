import React, { useRef, useState } from 'react';
import { Zap, ArrowUp, Hand, Smile } from 'lucide-react';
import { useGameStore, mobileInputState } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const MobileControls: React.FC = React.memo(() => {
  const nearbyStation = useGameStore((s) => s.nearbyStation);
  const setActivePanel = useGameStore((s) => s.setActivePanel);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const hasActivePanel = useGameStore((s) => s.activePanel !== null);
  const setActiveEmote = useGameStore((s) => s.setActiveEmote);
  const isMobile = useGameStore((s) => s.isMobile);

  const [touchActive, setTouchActive] = useState(false);
  const [isSprintActive, setIsSprintActive] = useState(false);
  const [showEmotes, setShowEmotes] = useState(false);

  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const joystickPointerIdRef = useRef<number | null>(null);

  if (!isMobile || hasActivePanel) return null;

  const updateJoystick = (clientX: number, clientY: number) => {
    const base = joystickBaseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const distance = Math.hypot(deltaX, deltaY);
    const maxRadius = Math.max(1, rect.width / 2);

    const clampedDist = Math.min(distance, maxRadius);
    const angle = Math.atan2(deltaY, deltaX);

    const normX = (clampedDist / maxRadius) * Math.cos(angle);
    const normY = (clampedDist / maxRadius) * Math.sin(angle);

    // Zero-re-render direct DOM transform + direct physics buffer mutation!
    if (knobRef.current) {
      const px = normX * (maxRadius * 0.68);
      const py = normY * (maxRadius * 0.68);
      knobRef.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
    }
    mobileInputState.joystickX = normX;
    mobileInputState.joystickY = normY;
  };

  const resetJoystick = () => {
    joystickPointerIdRef.current = null;
    setTouchActive(false);
    mobileInputState.joystickX = 0;
    mobileInputState.joystickY = 0;
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate3d(0px, 0px, 0)';
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (joystickPointerIdRef.current !== null) return;
    e.stopPropagation();
    joystickPointerIdRef.current = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setTouchActive(true);
    updateJoystick(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerId !== joystickPointerIdRef.current) return;
    e.stopPropagation();
    updateJoystick(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerId !== joystickPointerIdRef.current) return;
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    resetJoystick();
  };

  const handleSelectEmote = (emoteName: 'salute' | 'shakehand' | 'cough') => {
    if (audioEnabled) sound.playClick();
    setActiveEmote(emoteName);
    setShowEmotes(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 110 }}>
      {/* Virtual Joystick (Bottom Left - Safe Area Aware) */}
      <div
        ref={joystickBaseRef}
        className="mobile-joystick-base"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'absolute',
          bottom: 'max(18px, calc(12px + env(safe-area-inset-bottom, 0px)))',
          left: 'max(20px, calc(14px + env(safe-area-inset-left, 0px)))',
          width: '104px',
          height: '104px',
          borderRadius: '50%',
          background: 'rgba(12, 18, 32, 0.78)',
          border: '2px solid rgba(56, 189, 248, 0.45)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(56, 189, 248, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          touchAction: 'none',
          userSelect: 'none'
        }}
      >
        <div
          ref={knobRef}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: touchActive
              ? 'radial-gradient(circle, #38bdf8 0%, #0284c7 100%)'
              : 'radial-gradient(circle, rgba(56, 189, 248, 0.8) 0%, rgba(2, 132, 199, 0.6) 100%)',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.6)',
            transform: 'translate3d(0px, 0px, 0)',
            transition: touchActive ? 'none' : 'transform 0.15s ease-out',
            willChange: 'transform',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Action Buttons (Bottom Right - Safe Area Aware) */}
      <div
        className="mobile-actions-cluster"
        style={{
          position: 'absolute',
          bottom: 'max(18px, calc(12px + env(safe-area-inset-bottom, 0px)))',
          right: 'max(20px, calc(14px + env(safe-area-inset-right, 0px)))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px',
          pointerEvents: 'auto'
        }}
      >
        {/* Mobile Emote Popup */}
        {showEmotes && (
          <div
            style={{
              display: 'flex',
              gap: '6px',
              padding: '6px 8px',
              borderRadius: '12px',
              background: 'rgba(10, 15, 26, 0.95)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)',
              marginBottom: '2px',
              animation: 'modalFadeIn 0.15s ease-out'
            }}
          >
            {(['salute', 'shakehand', 'cough'] as const).map((emote) => (
              <button
                key={emote}
                type="button"
                onClick={() => handleSelectEmote(emote)}
                style={{
                  background: 'rgba(30, 41, 59, 0.85)',
                  border: '1px solid rgba(251, 191, 36, 0.5)',
                  color: '#fbbf24',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-hud)',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {emote}
              </button>
            ))}
          </div>
        )}

        {/* Interact Button (when near station) */}
        {nearbyStation && (
          <button
            type="button"
            onClick={() => {
              if (audioEnabled) sound.playChime();
              setActivePanel(nearbyStation.panel);
            }}
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: nearbyStation.color,
              border: '2px solid #ffffff',
              color: '#000000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 22px ${nearbyStation.color}`,
              fontWeight: 800,
              fontSize: '10.5px',
              fontFamily: 'var(--font-hud)',
              letterSpacing: '0.6px',
              animation: 'pulseGlow 1.5s infinite',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
            aria-label={`Enter ${nearbyStation.title}`}
          >
            <Hand size={17} />
            <span>OPEN</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Emote Selector Toggle */}
          <button
            type="button"
            onClick={() => {
              if (audioEnabled) sound.playClick();
              setShowEmotes((v) => !v);
            }}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: showEmotes ? 'rgba(251, 191, 36, 0.88)' : 'rgba(15, 23, 42, 0.82)',
              border: '2px solid #fbbf24',
              color: showEmotes ? '#000000' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.4)',
              touchAction: 'none',
              cursor: 'pointer'
            }}
            aria-label="Emotes"
          >
            <Smile size={19} />
          </button>

          {/* Sprint Button (Hold OR Tap-Toggle friendly) */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
              setIsSprintActive(true);
              mobileInputState.sprint = true;
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              try {
                (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
              } catch {}
              setIsSprintActive(false);
              mobileInputState.sprint = false;
            }}
            onPointerCancel={() => {
              setIsSprintActive(false);
              mobileInputState.sprint = false;
            }}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: isSprintActive ? 'rgba(255, 0, 127, 0.88)' : 'rgba(15, 23, 42, 0.82)',
              border: '2px solid #ff007f',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isSprintActive ? '0 0 18px #ff007f' : '0 0 8px rgba(255, 0, 127, 0.4)',
              touchAction: 'none',
              cursor: 'pointer'
            }}
            aria-label="Sprint"
          >
            <Zap size={21} color={isSprintActive ? '#ffffff' : '#ff007f'} />
          </button>

          {/* Jump Button */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
              mobileInputState.jump = true;
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              try {
                (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
              } catch {}
              mobileInputState.jump = false;
            }}
            onPointerCancel={() => {
              mobileInputState.jump = false;
            }}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.82)',
              border: '2px solid #38bdf8',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)',
              touchAction: 'none',
              cursor: 'pointer'
            }}
            aria-label="Jump"
          >
            <ArrowUp size={23} color="#38bdf8" />
          </button>
        </div>
      </div>
    </div>
  );
});
