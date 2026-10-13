import React, { useRef, useState } from 'react';
import { Zap, ArrowUp, Hand, Smile } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const MobileControls: React.FC = () => {
  const {
    setJoystickVector,
    setMobileActionSprint,
    setMobileActionJump,
    nearbyStation,
    setActivePanel,
    audioEnabled,
    activePanel,
    setActiveEmote,
    isMobile
  } = useGameStore();

  const [touchActive, setTouchActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isSprintActive, setIsSprintActive] = useState(false);
  const [showEmotes, setShowEmotes] = useState(false);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  // Check if touch or mobile device
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0 || isMobile || window.innerWidth <= 768);

  if (!isTouchDevice || activePanel !== null) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setTouchActive(true);
    updateJoystick(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!touchActive) return;
    updateJoystick(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
    setTouchActive(false);
    setKnobPos({ x: 0, y: 0 });
    setJoystickVector({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setTouchActive(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setTouchActive(false);
        setKnobPos({ x: 0, y: 0 });
        setJoystickVector({ x: 0, y: 0 });
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const distance = Math.hypot(deltaX, deltaY);
    const maxRadius = rect.width / 2;

    const clampedDist = Math.min(distance, maxRadius);
    const angle = Math.atan2(deltaY, deltaX);

    const normX = (clampedDist / maxRadius) * Math.cos(angle);
    const normY = (clampedDist / maxRadius) * Math.sin(angle);

    setKnobPos({ x: normX * (maxRadius * 0.7), y: normY * (maxRadius * 0.7) });
    setJoystickVector({ x: normX, y: normY });
  };

  const handleSelectEmote = (emoteName: 'salute' | 'shakehand' | 'cough') => {
    if (audioEnabled) sound.playClick();
    setActiveEmote(emoteName);
    setShowEmotes(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 110 }}>
      {/* Virtual Joystick (Bottom Left) */}
      <div
        ref={joystickBaseRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          background: 'rgba(12, 18, 32, 0.75)',
          border: '2px solid rgba(56, 189, 248, 0.45)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(56, 189, 248, 0.1)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          touchAction: 'none'
        }}
      >
        {/* Joystick Center Thumb Knob */}
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: touchActive
              ? 'radial-gradient(circle, #38bdf8 0%, #0284c7 100%)'
              : 'radial-gradient(circle, rgba(56, 189, 248, 0.8) 0%, rgba(2, 132, 199, 0.6) 100%)',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.6)',
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: touchActive ? 'none' : 'transform 0.15s ease-out'
          }}
        />
      </div>

      {/* Action Buttons (Bottom Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
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
              marginBottom: '4px',
              animation: 'modalFadeIn 0.15s ease-out'
            }}
          >
            <button
              onClick={() => handleSelectEmote('salute')}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                color: '#fbbf24',
                padding: '6px 10px',
                borderRadius: '8px',
                fontFamily: 'var(--font-hud)',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              Salute
            </button>
            <button
              onClick={() => handleSelectEmote('shakehand')}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                color: '#fbbf24',
                padding: '6px 10px',
                borderRadius: '8px',
                fontFamily: 'var(--font-hud)',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              Shakehand
            </button>
            <button
              onClick={() => handleSelectEmote('cough')}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                color: '#fbbf24',
                padding: '6px 10px',
                borderRadius: '8px',
                fontFamily: 'var(--font-hud)',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              Cough
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Emote Selector Toggle */}
          <button
            onClick={() => {
              if (audioEnabled) sound.playClick();
              setShowEmotes(!showEmotes);
            }}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: showEmotes ? 'rgba(251, 191, 36, 0.85)' : 'rgba(15, 23, 42, 0.75)',
              border: '2px solid #fbbf24',
              color: showEmotes ? '#000000' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.4)',
              backdropFilter: 'blur(8px)',
              touchAction: 'none'
            }}
            aria-label="Emotes"
          >
            <Smile size={20} />
          </button>

          {/* Sprint Toggle */}
          <button
            onPointerDown={() => {
              setIsSprintActive(true);
              setMobileActionSprint(true);
            }}
            onPointerUp={() => {
              setIsSprintActive(false);
              setMobileActionSprint(false);
            }}
            onTouchStart={() => {
              setIsSprintActive(true);
              setMobileActionSprint(true);
            }}
            onTouchEnd={() => {
              setIsSprintActive(false);
              setMobileActionSprint(false);
            }}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: isSprintActive ? 'rgba(255, 0, 127, 0.85)' : 'rgba(15, 23, 42, 0.75)',
              border: '2px solid #ff007f',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isSprintActive ? '0 0 18px #ff007f' : '0 0 8px rgba(255, 0, 127, 0.4)',
              backdropFilter: 'blur(8px)',
              touchAction: 'none'
            }}
            aria-label="Sprint"
          >
            <Zap size={22} color={isSprintActive ? '#ffffff' : '#ff007f'} />
          </button>

          {/* Jump Button */}
          <button
            onPointerDown={() => setMobileActionJump(true)}
            onPointerUp={() => setMobileActionJump(false)}
            onTouchStart={() => setMobileActionJump(true)}
            onTouchEnd={() => setMobileActionJump(false)}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '2px solid #38bdf8',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)',
              backdropFilter: 'blur(8px)',
              touchAction: 'none'
            }}
            aria-label="Jump"
          >
            <ArrowUp size={24} color="#38bdf8" />
          </button>
        </div>

        {/* Interact Button (when near station) */}
        {nearbyStation && (
          <button
            onClick={() => {
              if (audioEnabled) sound.playChime();
              setActivePanel(nearbyStation.panel);
            }}
            style={{
              width: '62px',
              height: '62px',
              borderRadius: '50%',
              background: nearbyStation.color,
              border: '2px solid #ffffff',
              color: '#000000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 25px ${nearbyStation.color}`,
              fontWeight: 800,
              fontSize: '11px',
              fontFamily: 'var(--font-hud)',
              letterSpacing: '0.6px',
              animation: 'pulseGlow 1.5s infinite'
            }}
            aria-label="Interact"
          >
            <Hand size={18} />
            <span>ENTER</span>
          </button>
        )}
      </div>
    </div>
  );
};
