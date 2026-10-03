import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// 1. Soft Overcast Stratocumulus Cloud Texture ("After The Rain" billowy clouds)
// ---------------------------------------------------------------------------
function createOvercastCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 256);

  // Billowy, soft-edged overcast cloud formation with gentle silver highlights and moody slate base
  const puffs = [
    { x: 256, y: 130, r: 88, a: 0.94, shade: 0.88 },
    { x: 195, y: 140, r: 76, a: 0.90, shade: 0.84 },
    { x: 315, y: 140, r: 76, a: 0.90, shade: 0.85 },
    { x: 135, y: 155, r: 66, a: 0.85, shade: 0.80 },
    { x: 375, y: 155, r: 66, a: 0.85, shade: 0.82 },
    { x: 80,  y: 175, r: 52, a: 0.75, shade: 0.78 },
    { x: 430, y: 175, r: 52, a: 0.75, shade: 0.78 },
    { x: 256, y: 95,  r: 64, a: 0.92, shade: 0.96 }, // Top rim catching breaking sun
    { x: 210, y: 110, r: 56, a: 0.88, shade: 0.92 },
    { x: 300, y: 110, r: 56, a: 0.88, shade: 0.92 },
    { x: 256, y: 170, r: 70, a: 0.92, shade: 0.76 }, // Lower base with gentle slate depth
    { x: 175, y: 175, r: 62, a: 0.88, shade: 0.75 },
    { x: 335, y: 175, r: 62, a: 0.88, shade: 0.75 },
  ];

  puffs.forEach((p) => {
    const grad = ctx.createRadialGradient(p.x, p.y - p.r * 0.22, 0, p.x, p.y, p.r);
    // Silver-white highlight at top center
    const rTop = Math.round(250 * p.shade);
    const gTop = Math.round(252 * p.shade);
    const bTop = Math.round(255 * p.shade);

    // Soft slate-grey undertone
    const rBase = Math.round(195 * p.shade);
    const gBase = Math.round(210 * p.shade);
    const bBase = Math.round(225 * p.shade);

    grad.addColorStop(0, `rgba(${rTop}, ${gTop}, ${bTop}, ${p.a})`);
    grad.addColorStop(0.38, `rgba(${rTop - 10}, ${gTop - 8}, ${bTop}, ${p.a * 0.88})`);
    grad.addColorStop(0.72, `rgba(${rBase}, ${gBase}, ${bBase}, ${p.a * 0.38})`);
    grad.addColorStop(1, `rgba(${rBase}, ${gBase}, ${bBase}, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// 2. High-Altitude Overcast Wisps Texture (Atmospheric ceiling)
// ---------------------------------------------------------------------------
function createOvercastWispsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 512);

  const wisps = [
    { x: 140, y: 130, rx: 140, ry: 70, a: 0.45 },
    { x: 360, y: 220, rx: 160, ry: 80, a: 0.40 },
    { x: 200, y: 380, rx: 150, ry: 75, a: 0.42 },
    { x: 420, y: 410, rx: 120, ry: 60, a: 0.35 },
  ];

  wisps.forEach((w) => {
    const grad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, Math.max(w.rx, w.ry));
    grad.addColorStop(0, `rgba(240, 245, 250, ${w.a})`);
    grad.addColorStop(0.45, `rgba(220, 232, 242, ${w.a * 0.6})`);
    grad.addColorStop(0.85, `rgba(200, 218, 232, ${w.a * 0.15})`);
    grad.addColorStop(1, 'rgba(195, 215, 230, 0)');

    ctx.save();
    ctx.translate(w.x, w.y);
    ctx.scale(w.rx / Math.max(w.rx, w.ry), w.ry / Math.max(w.rx, w.ry));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(w.rx, w.ry), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// 3. Post-Rain Diffused Sun Glow Texture (Sun breaking through clearing storm)
// ---------------------------------------------------------------------------
function createPostRainSunTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 126);
  grad.addColorStop(0, 'rgba(255, 253, 246, 0.98)');     // Luminous silver-warm sun disc
  grad.addColorStop(0.18, 'rgba(255, 248, 230, 0.75)');  // Gentle warm corona
  grad.addColorStop(0.45, 'rgba(240, 246, 252, 0.32)');  // Silver atmospheric halo
  grad.addColorStop(0.75, 'rgba(215, 232, 245, 0.08)');  // Light blue-grey mist dispersion
  grad.addColorStop(1, 'rgba(210, 230, 245, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 128, 126, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// 4. Main Export: AnimatedSky (Atmospheric "After The Rain" Overcast Sky, 60fps)
// ---------------------------------------------------------------------------
export const AnimatedSky: React.FC = () => {
  const domeRef = useRef<THREE.Mesh>(null);
  const canopyRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Group>(null);

  const cloudTexture = useMemo(() => createOvercastCloudTexture(), []);
  const wispsTexture = useMemo(() => createOvercastWispsTexture(), []);
  const sunTexture = useMemo(() => createPostRainSunTexture(), []);

  // 1. Hardware Vertex-Colored Overcast Sky Dome
  // Seamlessly interpolates from soft zenith slate-blue to silver-pearl to luminous horizon mist (#cbd8e3)
  const skyGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(78, 28, 18);
    const count = geo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    const pos = geo.attributes.position;

    // Authentic Parisian "After The Rain" bright luminous overcast palette
    const zenithColor  = new THREE.Color('#58728a'); // Soft slate-blue overhead
    const upperColor   = new THREE.Color('#7a93a8'); // Clearing overcast blue-gray
    const midColor     = new THREE.Color('#9eb3c4'); // Silver-pearl soft sky
    const lowerColor   = new THREE.Color('#c2d2df'); // Pale luminous mist
    const horizonColor = new THREE.Color('#d4e1ec'); // Exact match to distance fog (#d4e1ec)

    for (let i = 0; i < count; i++) {
      const y = pos.getY(i) / 78; // Normalized height (-1 to 1)
      const c = new THREE.Color();

      if (y > 0.45) {
        c.lerpColors(upperColor, zenithColor, (y - 0.45) / 0.55);
      } else if (y > 0.18) {
        c.lerpColors(midColor, upperColor, (y - 0.18) / 0.27);
      } else if (y > 0.04) {
        c.lerpColors(lowerColor, midColor, (y - 0.04) / 0.14);
      } else {
        c.lerpColors(horizonColor, lowerColor, Math.max(0, y + 0.15) / 0.19);
      }

      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // 3D Billow Clouds drifting down both North (down street) and South (above spawn)
  const cloudConfigs = useMemo(
    () => [
      // North / Boulevard Clouds
      { x: -28, y: 28, z: -35, speed: 1.4, w: 32, h: 16, opacity: 0.88 },
      { x: 14,  y: 32, z: -52, speed: 1.1, w: 36, h: 18, opacity: 0.84 },
      { x: 38,  y: 26, z: -22, speed: 1.6, w: 28, h: 14, opacity: 0.82 },
      { x: -8,  y: 35, z: -15, speed: 1.3, w: 34, h: 17, opacity: 0.86 },
      // South / Spawn Area Clouds
      { x: -24, y: 27, z: 26,  speed: 1.2, w: 32, h: 16, opacity: 0.86 },
      { x: 18,  y: 29, z: 36,  speed: 1.5, w: 34, h: 17, opacity: 0.85 },
      { x: -38, y: 25, z: 46,  speed: 1.0, w: 30, h: 15, opacity: 0.82 },
      { x: 4,   y: 34, z: 12,  speed: 1.3, w: 38, h: 19, opacity: 0.80 },
    ],
    []
  );

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);

    // Keep sky dome centered on camera so horizon stays perfectly level and never clips
    if (domeRef.current) {
      domeRef.current.position.set(state.camera.position.x, 0, state.camera.position.z);
    }

    // High altitude overcast canopy subtle drift
    if (canopyRef.current) {
      canopyRef.current.position.set(state.camera.position.x, 48, state.camera.position.z);
      canopyRef.current.rotation.y += 0.008 * clampedDelta;
    }

    // Continuous wind drifting of billowy 3D clouds across the overcast sky
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((mesh, i) => {
        const cfg = cloudConfigs[i];
        if (!cfg) return;
        mesh.position.x += cfg.speed * clampedDelta;
        // Wrap around seamlessly
        if (mesh.position.x > 82) {
          mesh.position.x = -82;
        }
      });
    }
  });

  return (
    <group>
      {/* 1. Atmospheric Overcast Sky Dome (0% custom shader ALU, zero stutter) */}
      <mesh ref={domeRef} geometry={skyGeometry} scale={[-1, 1, 1]}>
        <meshBasicMaterial
          vertexColors={true}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Soft High-Altitude Overcast Wisps Layer */}
      <mesh ref={canopyRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[140, 140]} />
        <meshBasicMaterial
          map={wispsTexture}
          transparent
          opacity={0.38}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Luminous Post-Rain Sun Breaking Through Clouds */}
      <mesh position={[35, 52, -25]}>
        <planeGeometry args={[26, 26]} />
        <meshBasicMaterial
          map={sunTexture}
          transparent
          opacity={0.92}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Soft Overcast Stratocumulus Clouds Drifting Across the Sky */}
      <group ref={cloudsRef}>
        {cloudConfigs.map((c, i) => (
          <mesh key={i} position={[c.x, c.y, c.z]}>
            <planeGeometry args={[c.w, c.h]} />
            <meshBasicMaterial
              map={cloudTexture}
              transparent
              opacity={c.opacity}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
