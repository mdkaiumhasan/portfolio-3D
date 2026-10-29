import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';
import { getThroneModelUrl } from '../../utils/modelUrl';

export { getThroneModelUrl };
const THRONE_URL = getThroneModelUrl();

export const IronThrone: React.FC = () => {
  const { scene } = useGLTF(THRONE_URL, '/draco/');
  const isSeatedOnThrone = useGameStore((state) => state.isSeatedOnThrone);
  const audioEnabled = useGameStore((state) => state.audioEnabled);

  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const [hasStartedVanishing, setHasStartedVanishing] = useState(false);
  const [vanished, setVanished] = useState(false);
  const vanishProgress = useRef(0);
  const soundPlayed = useRef(false);

  // Clone scene & collect flat material array once so useFrame vanish requires zero scene-graph traversals
  const { clonedScene, clonedMaterials } = useMemo(() => {
    const clone = scene.clone(true);
    const matsList: THREE.Material[] = [];

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
            matsList.push(newMat);
            return newMat;
          });
          mesh.material = Array.isArray(mesh.material) ? newMats : newMats[0];
        }
      }
    });

    return { clonedScene: clone, clonedMaterials: matsList };
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

  useFrame((_, delta) => {
    if (vanished) return;

    if (!hasStartedVanishing) {
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

    vanishProgress.current = Math.min(1.0, vanishProgress.current + delta * 1.55);
    const p = vanishProgress.current;

    const scaleFactor = Math.max(0, 1 - Math.pow(p, 1.8));
    const opacityFactor = Math.max(0, 1 - p * 1.15);

    if (groupRef.current) {
      const baseScale = 0.72;
      groupRef.current.scale.set(
        baseScale * scaleFactor,
        baseScale * scaleFactor,
        baseScale * scaleFactor
      );
      groupRef.current.position.y = 0.48 - p * 0.35;
    }

    for (let i = 0; i < clonedMaterials.length; i++) {
      clonedMaterials[i].opacity = opacityFactor;
    }

    if (particlesRef.current) {
      particleMat.opacity = Math.max(0, 0.8 * (1 - p));
    }

    if (p >= 1.0) {
      setVanished(true);
    }
  });

  if (vanished) return null;

  return (
    <group
      ref={groupRef}
      position={[1.35, 0.48, 40.95]}
      rotation={[0, Math.PI, 0]}
      scale={[0.72, 0.72, 0.72]}
    >
      <primitive object={clonedScene} />
      <points
        ref={particlesRef}
        geometry={particleGeo}
        material={particleMat}
        position={[0, -0.4, 0]}
      />
    </group>
  );
};
