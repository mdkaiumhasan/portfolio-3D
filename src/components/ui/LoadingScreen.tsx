import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Sparkles, Layout } from 'lucide-react';
import { useProgress } from '@react-three/drei';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';
import { preloadAndCacheModel, isModelInCache } from '../../utils/assetCache';
import { RAIN_STREET_MODEL_URL } from '../world/RainStreet';
import '../../styles/introLoader.css';

interface LoadingScreenProps {
  onLoaded: () => void;
}

const LOG_MILESTONES = [
  { at: 0, msg: 'resolving host [mdkaiumhasan.dev] ... <b>ok</b>' },
  { at: 20, msg: 'tcp handshake [tls 1.3 / quic] ... <b>established</b>' },
  { at: 45, msg: 'streaming 3D cyberpunk scene ...' },
  { at: 75, msg: 'compiling webgl2 shaders ... <b>done</b>' },
  { at: 92, msg: 'calibrating rain & audio engine ... <b>ready</b>' },
  { at: 100, msg: 'all systems operational // scene <b>ready</b>' },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const { progress: threeProgress, active: threeActive } = useProgress();
  const { setMode, setAudioEnabled } = useGameStore();

  const [isReadyToEnter, setIsReadyToEnter] = useState(false);

  // References to DOM elements for direct zero-re-render progress updates
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const downloadStatusRef = useRef<HTMLDivElement>(null);
  const enterWrapRef = useRef<HTMLDivElement>(null);

  // Download & Animation tracking refs
  const targetPercentRef = useRef(0);
  const displayedPercentRef = useRef(0);
  const downloadStatsRef = useRef({ loadedMB: 0, totalMB: 89.5 });
  const modelReadyRef = useRef(false);
  const isReadyRef = useRef(false);
  const shownLogIndexRef = useRef(-1);
  const animStateRef = useRef({ dead: false, exiting: false, raf: 0 });

  // 1. Download tracking directly connected to CacheStorage & network stream
  useEffect(() => {
    let isMounted = true;

    isModelInCache(RAIN_STREET_MODEL_URL).then((cached) => {
      if (!isMounted) return;
      if (cached) {
        const estMB = RAIN_STREET_MODEL_URL.includes('mobile') ? 8.0 : 89.5;
        downloadStatsRef.current = { loadedMB: estMB, totalMB: estMB };
        targetPercentRef.current = 100;
        modelReadyRef.current = true;
      } else {
        preloadAndCacheModel(RAIN_STREET_MODEL_URL, (percent, loadedMB, totalMB) => {
          if (!isMounted) return;
          downloadStatsRef.current = { loadedMB, totalMB };
          targetPercentRef.current = Math.min(99.5, Math.max(targetPercentRef.current, percent));
          if (percent >= 100) {
            modelReadyRef.current = true;
          }
        }).then(() => {
          if (isMounted) {
            modelReadyRef.current = true;
            targetPercentRef.current = 100;
          }
        }).catch((err) => {
          console.warn('Preload fallback:', err);
          if (isMounted) {
            modelReadyRef.current = true;
            targetPercentRef.current = 100;
          }
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync Three.js asset compilation into progress
  useEffect(() => {
    if (modelReadyRef.current) {
      if (!threeActive || threeProgress >= 90) {
        targetPercentRef.current = 100;
      } else {
        targetPercentRef.current = Math.max(targetPercentRef.current, Math.min(99, threeProgress));
      }
    }
  }, [threeProgress, threeActive]);

  // 2. Cinematic Shutter Exit Animation
  const triggerExit = useCallback(() => {
    const s = animStateRef.current;
    if (s.dead || s.exiting) return;
    s.exiting = true;

    const root = rootRef.current;
    if (!root) {
      s.dead = true;
      onLoaded();
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = root.querySelector('.stage');
    const seam = root.querySelector('#seam');
    const panelTop = root.querySelector('.panel.pt');
    const panelBottom = root.querySelector('.panel.pb');

    const exitTl = gsap.timeline({
      onComplete: () => {
        s.dead = true;
        cancelAnimationFrame(s.raf);
        onLoaded();
      },
    });

    exitTl.to(stage, { opacity: 0, duration: 0.28, ease: 'power1.in' }, 0);

    if (reduce) {
      exitTl.to([panelTop, panelBottom], { opacity: 0, duration: 0.4 }, 0.2);
    } else {
      exitTl
        .fromTo(seam, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.24, ease: 'power2.out' }, 0.08)
        .to(seam, { opacity: 0, duration: 0.14 }, 0.42)
        .to(panelTop, { yPercent: -100, duration: 0.55, ease: 'power3.inOut' }, 0.28)
        .to(panelBottom, { yPercent: 100, duration: 0.55, ease: 'power3.inOut' }, 0.28);
    }
  }, [onLoaded]);

  // Handle entering 3D Experience (with rain and ambient audio)
  const handleEnter3D = useCallback(() => {
    setAudioEnabled(true);
    sound.startRain();
    sound.playChime();
    triggerExit();
  }, [setAudioEnabled, triggerExit]);

  // Handle entering 2D Portfolio View
  const handleEnter2D = useCallback(() => {
    animStateRef.current.dead = true;
    cancelAnimationFrame(animStateRef.current.raf);
    setMode('2d');
    onLoaded();
  }, [setMode, onLoaded]);

  // Stop all game movement and action keys from leaking to background while loading
  useEffect(() => {
    const blockKeyLeak = (e: KeyboardEvent) => {
      if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyE'].includes(e.code)) {
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', blockKeyLeak, true);
    window.addEventListener('keyup', blockKeyLeak, true);
    return () => {
      window.removeEventListener('keydown', blockKeyLeak, true);
      window.removeEventListener('keyup', blockKeyLeak, true);
    };
  }, []);

  // Keyboard shortcut listener: Enter for 3D, '2' for 2D
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isReadyToEnter) return;
      if (e.code === 'Enter') {
        e.preventDefault();
        handleEnter3D();
      } else if (e.key === '2') {
        e.preventDefault();
        handleEnter2D();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isReadyToEnter, handleEnter3D, handleEnter2D]);

  // 3. Autonomous 60/120 FPS Network Mesh Canvas & Decoupled Progress Engine
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    const s = animStateRef.current;
    s.dead = false;
    s.exiting = false;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let D = Math.min(window.devicePixelRatio || 1, 2);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }

    interface Packet {
      a: Node;
      b: Node;
      p: number;
      hops: number;
      sp: number;
    }

    let nodes: Node[] = [];
    let packets: Packet[] = [];

    const size = () => {
      const isMob = window.innerWidth <= 768 || window.innerHeight <= 600 || 'ontouchstart' in window;
      D = isMob ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * D;
      cv.height = H * D;
      cx.setTransform(D, 0, 0, D, 0, 0);

      const n = Math.round(Math.min(20, Math.max(12, (W * H) / 45000)));
      const speed = reduce ? 0 : 0.2;
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: 1.2 + Math.random() * 1.5,
      }));
      packets = [];
    };

    size();
    window.addEventListener('resize', size, { passive: true });

    const near = (a: Node, L: number, skip?: Node) =>
      nodes.filter((b) => b !== a && b !== skip && Math.hypot(a.x - b.x, a.y - b.y) < L);

    // High-performance render loop: Mesh moves autonomously even if download is at 0%
    const frame = () => {
      if (s.dead || s.exiting) return;

      // ---- 1. Progress Bar & Counter strictly bound to download ----
      const target = targetPercentRef.current;
      const current = displayedPercentRef.current;

      // Smooth approach towards target download
      let nextProgress = current + (target - current) * 0.085;
      if (target >= 100 && nextProgress >= 99) {
        nextProgress = 100;
      }
      displayedPercentRef.current = nextProgress;

      const rounded = Math.min(100, Math.round(nextProgress));
      const progFraction = Math.min(1, Math.max(0, nextProgress / 100));

      // Direct DOM mutation for 60/120 FPS counter & bar
      if (countRef.current) {
        countRef.current.innerHTML = `${rounded}<small>%</small>`;
      }
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${progFraction})`;
      }

      // Download status message
      if (downloadStatusRef.current) {
        const stats = downloadStatsRef.current;
        if (rounded >= 100 && modelReadyRef.current) {
          downloadStatusRef.current.innerHTML = `ALL 3D ASSETS SYNCHRONIZED // <b>READY</b>`;
        } else if (stats.loadedMB > 0) {
          downloadStatusRef.current.innerHTML = `STREAMING 3D ASSETS: <b>${stats.loadedMB.toFixed(1)}</b> / ${stats.totalMB.toFixed(1)} MB (${rounded}%)`;
        } else {
          downloadStatusRef.current.innerHTML = `CONNECTING TO ASSET CDN // INITIALIZING`;
        }
      }

      // Terminal logs milestone updates
      LOG_MILESTONES.forEach((m, idx) => {
        if (nextProgress >= m.at && idx > shownLogIndexRef.current) {
          shownLogIndexRef.current = idx;
          if (logRef.current) {
            const line = document.createElement('div');
            line.innerHTML = `&gt; ${m.msg}`;
            logRef.current.appendChild(line);
            while (logRef.current.children.length > 4) {
              logRef.current.firstChild?.remove();
            }
          }
        }
      });

      // Ready state trigger once resource download reaches 100%
      if (rounded >= 100 && target >= 100 && modelReadyRef.current && !isReadyRef.current) {
        isReadyRef.current = true;
        setIsReadyToEnter(true);
      }

      // ---- 2. Autonomous Network Canvas Rendering (Continuous 60FPS) ----
      const L = Math.min(W, H) * 0.22 + 55;
      const L2 = L * L;
      cx.clearRect(0, 0, W, H);

      // Node physics: Always drifting continuously
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      // Batched interconnecting lines (single GPU stroke)
      cx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (Math.abs(dx) > L || Math.abs(dy) > L) continue;
          const distSq = dx * dx + dy * dy;
          if (distSq < L2) {
            cx.moveTo(a.x, a.y);
            cx.lineTo(b.x, b.y);
          }
        }
      }
      cx.strokeStyle = 'rgba(74, 92, 168, 0.32)';
      cx.lineWidth = 1;
      cx.stroke();

      // Batched node points (single GPU fill)
      cx.fillStyle = '#4a5ca8';
      cx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        cx.moveTo(n.x + n.r, n.y);
        cx.arc(n.x, n.y, n.r, 0, 6.283);
      }
      cx.fill();

      // Packets hopping: Continuously active regardless of download progress!
      if (!reduce && packets.length < 18 && Math.random() < 0.055) {
        const a = nodes[(Math.random() * nodes.length) | 0];
        const nb = near(a, L);
        if (nb.length) {
          packets.push({
            a,
            b: nb[(Math.random() * nb.length) | 0],
            p: 0,
            hops: 0,
            sp: 0.022 + Math.random() * 0.018,
          });
        }
      }

      cx.fillStyle = 'rgba(124, 243, 255, 0.95)';
      packets = packets.filter((k) => {
        k.p += k.sp;
        if (k.p >= 1) {
          const nb = near(k.b, L, k.a);
          if (++k.hops > 3 || !nb.length) return false;
          k.a = k.b;
          k.b = nb[(Math.random() * nb.length) | 0];
          k.p = 0;
        }
        const x = k.a.x + (k.b.x - k.a.x) * k.p;
        const y = k.a.y + (k.b.y - k.a.y) * k.p;
        cx.beginPath();
        cx.arc(x, y, 2.5, 0, 6.283);
        cx.fill();
        return true;
      });

      s.raf = requestAnimationFrame(frame);
    };

    s.raf = requestAnimationFrame(frame);

    return () => {
      s.dead = true;
      cancelAnimationFrame(s.raf);
      window.removeEventListener('resize', size);
    };
  }, []);

  const authorName = 'MD. Kaium Hasan';
  const authorRole = 'Network Engineer & Software Developer';

  return (
    <div
      ref={rootRef}
      id="loader"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      {/* Split Shutter Panels */}
      <div className="panel pt" />
      <div className="panel pb" />
      <div id="seam" />

      {/* Main Interactive Stage */}
      <div className="stage">
        {/* Continuous Dynamic Network Mesh Canvas */}
        <canvas ref={canvasRef} id="mesh" aria-hidden="true" />

        {/* Tactical Corner Brackets */}
        <div className="loader-bracket tl" />
        <div className="loader-bracket tr" />
        <div className="loader-bracket bl" />
        <div className="loader-bracket br" />

        {/* Top Telemetry HUD (Clean header without top-right buttons) */}
        <div className="top-hud">
          <div className="top-badge">
            <span className="top-dot" />
            <span>[KH-NET v2.4] // PING: 12MS // TLS 1.3</span>
          </div>
        </div>

        {/* Center Identity */}
        <div className="stage-center">
          {/* Hardware-accelerated CSS staggered reveal: cannot freeze */}
          <h1 id="name" aria-label={authorName}>
            {[...authorName].map((c, i) =>
              c === ' ' ? (
                <span key={`sp-${i}`} className="sp" />
              ) : (
                <span key={`ch-${i}`} className="ch">
                  <i style={{ '--char-idx': i } as React.CSSProperties}>{c}</i>
                </span>
              )
            )}
          </h1>

          <p id="role">
            {authorRole}
          </p>

          {/* Connected Resource Progress Bar */}
          <div id="bar">
            <div ref={fillRef} id="fill" />
          </div>

          {/* Live Download Telemetry */}
          <div ref={downloadStatusRef} id="download-status">
            CONNECTING TO ASSET CDN // INITIALIZING
          </div>

          {/* Interactive Enter Controls: Enter 3D or Enter 2D */}
          <div
            ref={enterWrapRef}
            className={`enter-wrap ${isReadyToEnter ? 'visible' : ''}`}
          >
            <div className="enter-btns">
              <button
                type="button"
                onClick={handleEnter3D}
                className="btn-enter enter-3d"
                autoFocus
              >
                <Sparkles size={16} />
                <span>Enter 3D</span>
              </button>

              <button
                type="button"
                onClick={handleEnter2D}
                className="btn-enter enter-2d"
              >
                <Layout size={15} />
                <span>Enter 2D</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom HUD: Tabular Counter & Terminal Logs */}
        <div className="hud">
          <div ref={countRef} id="count">
            0<small>%</small>
          </div>

          <div ref={logRef} id="log" aria-live="polite" />
        </div>
      </div>
    </div>
  );
};
