import React, { Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ThirdPersonCamera } from '../camera/ThirdPersonCamera';
import { Player } from '../player/Player';
import { RainStreet } from './RainStreet';
import { AnimatedSky } from './AnimatedSky';

const PerformanceProfiler: React.FC = () => {
  const { gl } = useThree();

  useFrame(() => {
    (window as any).__THREE_STATS__ = {
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
    };
  });
  return null;
};

// WebGL Context Lost & Restored Safeguard - prevents mobile browser from crashing the tab
const WebGLContextGuard: React.FC = () => {
  const { gl } = useThree();

  React.useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault(); // Prevents Chrome/Safari from killing the tab
      console.warn('WebGL context lost during resize/orientation - protected from crash');
    };
    const handleContextRestored = () => {
      console.log('WebGL context successfully restored');
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  return null;
};

const GL_CONFIG = {
  antialias: false, // Prevents GPU VRAM exhaustion on mobile during resize
  powerPreference: 'default' as const,
  stencil: false,
  depth: true,
  precision: 'mediump' as const,
  toneMapping: THREE.NeutralToneMapping,
  toneMappingExposure: 1.28,
};

const DPR_RANGE: [number, number] = [1, 1.25];

export const World: React.FC = React.memo(() => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        shadows={false}
        camera={{ position: [0, 4, 46], fov: 50, near: 0.25, far: 180 }}
        gl={GL_CONFIG}
        dpr={DPR_RANGE}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <PerformanceProfiler />
        <WebGLContextGuard />
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
});
