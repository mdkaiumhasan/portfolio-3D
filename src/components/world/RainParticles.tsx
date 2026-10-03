import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

export const RainParticles: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [geometry] = useMemo(() => {
    const count = 1400;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 90;
      speed[i] = Math.random() * 12 + 18;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('speed', new THREE.BufferAttribute(speed, 1));
    return [geo];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPlayerPos: { value: new THREE.Vector3(1.35, 0, 41) },
    uColor: { value: new THREE.Color('#cbd5e1') }
  }), []);

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += Math.min(delta, 0.05);
    const [px, py, pz] = useGameStore.getState().playerPosition;
    materialRef.current.uniforms.uPlayerPos.value.set(px, py, pz);
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform vec3 uPlayerPos;
          attribute float speed;

          void main() {
            vec3 p = position;
            // Continuous smooth falling loop
            p.y = mod(p.y - uTime * speed, 25.0);
            // Seamless infinite spatial wrapping around character
            p.x = mod(p.x - uPlayerPos.x + 25.0, 50.0) - 25.0 + uPlayerPos.x - (uTime * 1.5);
            p.z = mod(p.z - uPlayerPos.z + 45.0, 90.0) - 45.0 + uPlayerPos.z;

            vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = max(1.5, 36.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;

          void main() {
            vec2 coord = gl_PointCoord - vec2(0.5);
            if (length(coord) > 0.5) discard;
            gl_FragColor = vec4(uColor, 0.40);
          }
        `}
      />
    </points>
  );
};
