import React, { useRef, useState, useEffect } from 'react';
import { Zap, ArrowUp, Hand } from 'lucide-react';
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
    activePanel
  } = useGameStore();

  const [touchActive, setTouchActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isSprintActive, setIsSprintActive] = useState(false);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  // Check if touch device
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  if (!isTouchDevice || activePanel !== null) return null;

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

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 110 }}>
      {/* Virtual Joystick (Bottom Left) */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '30px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(15, 23, 42, 0.65)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          backdropFilter: 'blur(8px)',
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
            width: '50px',
            height: '50px',
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
          bottom: '30px',
          right: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          pointerEvents: 'auto'
        }}
      >
        {/* Sprint Toggle */}
        <button
          onTouchStart={() => {
            setIsSprintActive(true);
            setMobileActionSprint(true);
          }}
          onTouchEnd={() => {
            setIsSprintActive(false);
            setMobileActionSprint(false);
          }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isSprintActive ? 'rgba(255, 0, 127, 0.8)' : 'rgba(15, 23, 42, 0.75)',
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
          onTouchStart={() => setMobileActionJump(true)}
          onTouchEnd={() => setMobileActionJump(false)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '2px solid #38bdf8',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)',
            backdropFilter: 'blur(8px)',
            touchAction: 'none'
          }}
          aria-label="Jump"
        >
          <ArrowUp size={22} color="#38bdf8" />
        </button>

        {/* Interact Button (when near station) */}
        {nearbyStation && (
          <button
            onClick={() => {
              if (audioEnabled) sound.playChime();
              setActivePanel(nearbyStation.panel);
            }}
            style={{
              width: '64px',
              height: '64px',
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
              fontSize: '12px',
              fontFamily: 'var(--font-hud)',
              letterSpacing: '0.6px',
              animation: 'pulseGlow 1.5s infinite'
            }}
            aria-label="Interact"
          >
            <Hand size={20} />
            <span>ENTER</span>
          </button>
        )}
      </div>
    </div>
  );
};
