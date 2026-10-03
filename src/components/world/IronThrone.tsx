import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

const THRONE_URL = '/models/throne_of_iron__stone.glb';

export const IronThrone: React.FC = () => {
  const { scene } = useGLTF(THRONE_URL);
  const isSeatedOnThrone = useGameStore((state) => state.isSeatedOnThrone);
  const audioEnabled = useGameStore((state) => state.audioEnabled);

  const groupRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const [hasStartedVanishing, setHasStartedVanishing] = useState(false);
  const [vanished, setVanished] = useState(false);
  const vanishProgress = useRef(0);
  const soundPlayed = useRef(false);

  // Clone scene so materials can be safely made transparent without affecting cached model
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.frustumCulled = true;
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const newMats = mats.map((m) => {
            const oldMat = m as THREE.MeshStandardMaterial;
            const newMat = oldMat.clone();
            newMat.transparent = true;
            newMat.opacity = 1.0;
            if (newMat.map) {
              newMat.map.anisotropy = 4;
            }
            return newMat;
          });
          mesh.material = Array.isArray(mesh.material) ? newMats : newMats[0];
        }
      }
    });

    return clone;
  }, [scene]);

  // Ethereal royal ember sparkles around the throne
  const { particleGeo, particleMat } = useMemo(() => {
    const count = 35;
    const positions = new Float32Array(count * 3);
    const opacities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.8;
      positions[i * 3 + 1] = Math.random() * 2.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
      opacities[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    const mat = new THREE.PointsMaterial({
      color: '#facc15',
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { particleGeo: geo, particleMat: mat };
  }, []);

  // Trigger vanish sequence when character begins movement or emote
  useEffect(() => {
    if (!isSeatedOnThrone && !hasStartedVanishing) {
      setHasStartedVanishing(true);
      if (audioEnabled && !soundPlayed.current) {
        soundPlayed.current = true;
        sound.playThroneVanish();
      }
    }
  }, [isSeatedOnThrone, hasStartedVanishing, audioEnabled]);

  // Smooth dissipation and vanishing animation
  useFrame((_, delta) => {
    if (vanished) return;

    // Ambient floating particles & aura breathing while seated
    if (!hasStartedVanishing) {
      if (auraRef.current) {
        const t = performance.now() * 0.002;
        const scalePulse = 1.0 + Math.sin(t) * 0.04;
        auraRef.current.scale.set(scalePulse, scalePulse, 1);
      }

      if (particlesRef.current) {
        const posAttr = particlesRef.current.geometry.attributes.position;
        const arr = posAttr.array as Float32Array;
        for (let i = 0; i < arr.length / 3; i++) {
          arr[i * 3 + 1] += delta * 0.45;
          if (arr[i * 3 + 1] > 2.8) {
            arr[i * 3 + 1] = 0.1;
            arr[i * 3] = (Math.random() - 0.5) * 1.8;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
          }
        }
        posAttr.needsUpdate = true;
      }
      return;
    }

    // Vanish progress interpolation (completed in ~0.65 seconds)
    vanishProgress.current = Math.min(1.0, vanishProgress.current + delta * 1.55);
    const p = vanishProgress.current;

    // Smooth ease-out dissipation curve
    const scaleFactor = Math.max(0, 1 - Math.pow(p, 1.8));
    const opacityFactor = Math.max(0, 1 - p * 1.15);

    if (groupRef.current) {
      // Scale down rapidly towards zero
      const baseScale = 0.72;
      groupRef.current.scale.set(
        baseScale * scaleFactor,
        baseScale * scaleFactor,
        baseScale * scaleFactor
      );

      // Sink gracefully into the ground as it dissipates
      groupRef.current.position.y = 0.48 - p * 0.35;
    }

    // Fade materials
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            (m as THREE.Material).opacity = opacityFactor;
          });
        }
      }
    });

    // Fade and expand ethereal ground seal
    if (auraRef.current) {
      const auraMat = auraRef.current.material as THREE.MeshBasicMaterial;
      auraMat.opacity = Math.max(0, 0.6 * (1 - p));
      auraRef.current.scale.multiplyScalar(1.0 + delta * 1.5);
    }

    // Fade sparkles
    if (particlesRef.current) {
      particleMat.opacity = Math.max(0, 0.8 * (1 - p));
    }

    // Complete disappearance: unmount entirely to preserve 100% framerate
    if (p >= 1.0) {
      setVanished(true);
    }
  });

  if (vanished) return null;

  return (
    <group
      ref={groupRef}
      position={[0, 0.48, 31.95]}
      rotation={[0, Math.PI, 0]}
      scale={[0.72, 0.72, 0.72]}
    >
      {/* 3D Photorealistic Iron & Stone Throne */}
      <primitive object={clonedScene} />

      {/* Royal Golden Ground Inscription Seal under Throne */}
      <mesh
        ref={auraRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.46, 0.05]}
      >
        <ringGeometry args={[0.7, 1.35, 32]} />
        <meshBasicMaterial
          color="#eab308"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Floating Mystic Embers */}
      <points
        ref={particlesRef}
        geometry={particleGeo}
        material={particleMat}
        position={[0, -0.4, 0]}
      />
    </group>
  );
};

useGLTF.preload(THRONE_URL);
