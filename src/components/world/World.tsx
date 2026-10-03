import React, { Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ThirdPersonCamera } from '../camera/ThirdPersonCamera';
import { Player } from '../player/Player';
import { RainStreet } from './RainStreet';
import { AnimatedSky } from './AnimatedSky';
import { useGameStore } from '../../store/gameStore';

const PerformanceProfiler: React.FC = () => {
  const { gl, scene } = useThree();
  const logged = React.useRef(false);

  useFrame(() => {
    (window as any).__THREE_STATS__ = {
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
    };

    if (!logged.current && gl.info.render.calls > 0) {
      logged.current = true;
      const meshes: { name: string; tris: number }[] = [];
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          const tris = m.geometry
            ? m.geometry.index
              ? m.geometry.index.count / 3
              : (m.geometry.attributes.position?.count || 0) / 3
            : 0;
          meshes.push({ name: m.name || m.parent?.name || 'unnamed', tris: Math.round(tris) });
        }
      });
      meshes.sort((a, b) => b.tris - a.tris);
      (window as any).__TOP_MESHES__ = meshes.slice(0, 15);
      console.log('TOP 15 MESHES BY TRIS:', meshes.slice(0, 15));
    }
  });
  return null;
};

export const World: React.FC = () => {
  const { qualityTier } = useGameStore();

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        shadows={false}
        camera={{ position: [0, 4, 46], fov: 50, near: 0.25, far: 180 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          precision: 'highp',
          toneMapping: THREE.NeutralToneMapping,
          toneMappingExposure: 1.28,
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <PerformanceProfiler />
        {/* Luminous Atmospheric Post-Rain Horizon Mist & Soft Distance Fog */}
        <color attach="background" args={['#d4e1ec']} />
        <fog attach="fog" args={['#d4e1ec', 65, 150]} />

        {/* High-Performance After-The-Rain Overcast Sky & Drifting Clouds */}
        <AnimatedSky />

        {/* Soft, Diffused Post-Rain Atmospheric Daylight Lighting */}
        <ambientLight intensity={1.12} color="#f8fafc" />
        <hemisphereLight
          args={['#d4e1ec', '#b0bec9', 1.05]}
          position={[0, 45, 0]}
        />
        <directionalLight
          position={[32, 50, 22]}
          intensity={1.85}
          color="#fffcf5"
        />

        {/* Smooth Following Third-Person Camera */}
        <ThirdPersonCamera />

        {/* Street & Stations */}
        <Suspense fallback={null}>
          <RainStreet />
          <Player />
        </Suspense>
      </Canvas>
    </div>
  );
};
