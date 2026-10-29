import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { StationInfo, useGameStore, playerRealtimePos } from '../../store/gameStore';
import { sound } from '../../systems/audio';
import { getStationTowerModelUrl } from '../../utils/modelUrl';

const PROJECT_TOWER_URL = getStationTowerModelUrl();

interface StationTowerModelProps {
  url: string;
  station: StationInfo;
  isNearby: boolean;
  targetHeight?: number;
}

const HologramGroundProjector: React.FC<{ color: string; isNearby: boolean }> = ({ color, isNearby }) => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const waveRingRef = useRef<THREE.Mesh>(null);
  const waveMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const speed = isNearby ? 1.8 : 1.0;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += 0.35 * speed * delta;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= 0.55 * speed * delta;
    }
    if (waveRingRef.current && waveMatRef.current) {
      const waveProgress = (t * 0.55 * speed) % 1.0;
      const currentScale = 0.35 + waveProgress * 1.6;
      waveRingRef.current.scale.set(currentScale, currentScale, 1);
      waveMatRef.current.opacity = Math.sin(waveProgress * Math.PI) * (isNearby ? 0.75 : 0.45);
    }
  });

  return (
    <group position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={outerRingRef}>
        <ringGeometry args={[1.35, 1.45, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isNearby ? 0.85 : 0.45}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[1.48, 1.54, 4]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isNearby ? 0.9 : 0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={innerRingRef}>
        <ringGeometry args={[0.75, 0.82, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isNearby ? 0.75 : 0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={waveRingRef}>
        <ringGeometry args={[0.95, 1.05, 36]} />
        <meshBasicMaterial
          ref={waveMatRef}
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// Shared sphere geometry across all motes to minimize GPU buffer allocations
const sharedMoteGeo = new THREE.SphereGeometry(0.026, 6, 6);

const AscendingEnergyMotes: React.FC<{ color: string; isNearby: boolean; count: number }> = ({
  color,
  isNearby,
  count,
}) => {
  const motesData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angleOffset: (i / count) * Math.PI * 2,
      radius: 0.32 + (i % 3) * 0.12,
      speedY: 0.4 + (i % 4) * 0.14,
      phaseY: i / count,
    }));
  }, [count]);

  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const speedMult = isNearby ? 1.7 : 1.0;

    for (let i = 0; i < motesData.length; i++) {
      const mote = motesData[i];
      const mesh = meshesRef.current[i];
      if (!mesh) continue;

      const progress = ((t * mote.speedY * speedMult * 0.45) + mote.phaseY) % 1.0;
      const y = 0.4 + progress * 2.0;

      const currentAngle = mote.angleOffset + t * 0.75 * speedMult + progress * 1.8;
      const currentRadius = mote.radius * (1.0 + Math.sin(progress * Math.PI) * 0.35);
      const x = Math.cos(currentAngle) * currentRadius;
      const z = Math.sin(currentAngle) * currentRadius;

      mesh.position.set(x, y, z);

      const opacity = Math.sin(progress * Math.PI);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = opacity * (isNearby ? 0.95 : 0.65);
      }
    }
  });

  return (
    <group>
      {motesData.map((_, i) => (
        <mesh
          key={i}
          geometry={sharedMoteGeo}
          ref={(el) => {
            meshesRef.current[i] = el;
          }}
        >
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

const StationTowerModel: React.FC<StationTowerModelProps> = ({
  url,
  isNearby,
  targetHeight = 2.3,
}) => {
  const { scene } = useGLTF(url, '/draco/');

  const { clone, modelScale, modelOffset } = useMemo(() => {
    scene.updateMatrixWorld(true);
    const c = SkeletonUtils.clone(scene);
    c.updateMatrixWorld(true);

    const bbox = new THREE.Box3().setFromObject(c);
    let s = 1.0;
    let offX = 0;
    let offY = 0;
    let offZ = 0;

    if (!bbox.isEmpty() && isFinite(bbox.min.y) && isFinite(bbox.max.y)) {
      const sizeY = bbox.max.y - bbox.min.y;
      const centerX = (bbox.min.x + bbox.max.x) / 2;
      const centerZ = (bbox.min.z + bbox.max.z) / 2;

      if (sizeY > 0.01 && isFinite(sizeY)) {
        s = targetHeight / sizeY;
      }
      if (isFinite(centerX)) offX = -centerX;
      if (isFinite(bbox.min.y)) offY = -bbox.min.y;
      if (isFinite(centerZ)) offZ = -centerZ;
    }

    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.frustumCulled = false;
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        const name = (mesh.name || '').toLowerCase();

        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const newMats = mats.map((m) => {
            const mat = m.clone();
            mat.side = THREE.DoubleSide;

            const matName = (mat.name || '').toLowerCase();

            if (
              name.includes('sphere_008') ||
              name.includes('sphere_009') ||
              name.includes('flyes') ||
              matName.includes('sphere_008') ||
              matName.includes('sphere_009') ||
              matName.includes('flyes')
            ) {
              mat.transparent = true;
              mat.depthWrite = false;
              mat.blending = THREE.AdditiveBlending;
            }

            mat.needsUpdate = true;
            return mat;
          });

          mesh.material = Array.isArray(mesh.material) ? newMats : newMats[0];
        }
      }
    });

    return {
      clone: c,
      modelScale: s,
      modelOffset: [offX, offY, offZ] as [number, number, number],
    };
  }, [scene, targetHeight, url]);

  const animRefs = useMemo(() => {
    const coreContainer = clone.getObjectByName('Object_12') as THREE.Object3D | null;
    const ring1 = clone.getObjectByName('Sphere_009_7_0') as THREE.Mesh | null;
    const ring2 = clone.getObjectByName('Sphere_008_9_0') as THREE.Mesh | null;
    const core1 = clone.getObjectByName('Sphere_005_15_0') as THREE.Mesh | null;
    const core2 = clone.getObjectByName('Sphere_006_13_0') as THREE.Mesh | null;
    const core3 = clone.getObjectByName('Sphere_007_11_0') as THREE.Mesh | null;

    return {
      coreContainer,
      initialCoreY: coreContainer ? coreContainer.position.y : 0,
      ring1,
      ring2,
      core1,
      core2,
      core3,
    };
  }, [clone]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const speedMult = isNearby ? 1.75 : 1.0;

    if (animRefs.coreContainer) {
      animRefs.coreContainer.position.y =
        animRefs.initialCoreY + (Math.sin(t * 1.6 * speedMult) * 0.45 + Math.cos(t * 0.8 * speedMult) * 0.15);
    }

    if (animRefs.core1) animRefs.core1.rotation.y += 1.2 * speedMult * delta;
    if (animRefs.core2) animRefs.core2.rotation.y -= 1.6 * speedMult * delta;
    if (animRefs.core3) animRefs.core3.rotation.y += 0.8 * speedMult * delta;

    if (animRefs.ring1) animRefs.ring1.rotation.y += 2.6 * speedMult * delta;
    if (animRefs.ring2) animRefs.ring2.rotation.y -= 2.0 * speedMult * delta;
  });

  return (
    <group scale={[modelScale, modelScale, modelScale]}>
      <primitive object={clone} position={modelOffset} />
    </group>
  );
};

interface StationPedestalProps {
  station: StationInfo;
}

export const StationPedestal: React.FC<StationPedestalProps> = React.memo(({ station }) => {
  const [inRange, setInRange] = useState(false);
  const inRangeRef = useRef(false);

  // Atomic Zustand selectors prevent re-rendering all 7 pedestals when playerPosition updates!
  const isNearby = useGameStore((s) => s.nearbyStation?.id === station.id);
  const setActivePanel = useGameStore((s) => s.setActivePanel);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const hasActivePanel = useGameStore((s) => s.activePanel !== null);
  const isIntroLoading = useGameStore((s) => s.isIntroLoading);
  const qualityTier = useGameStore((s) => s.qualityTier);
  const isMobile = useGameStore((s) => s.isMobile);
  const resolvedTowerModelUrl = useGameStore((s) => s.resolvedTowerModelUrl);
  const activeTowerUrl = resolvedTowerModelUrl || PROJECT_TOWER_URL;

  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (isIntroLoading) {
      if (inRangeRef.current) {
        inRangeRef.current = false;
        setInRange(false);
      }
      return;
    }

    const dist = Math.hypot(
      playerRealtimePos.x - station.position[0],
      playerRealtimePos.z - station.position[2]
    );
    const close = dist < 16;
    if (close !== inRangeRef.current) {
      inRangeRef.current = close;
      setInRange(close);
    }

    if (lightRef.current) {
      const t = state.clock.elapsedTime;
      const speed = isNearby ? 1.75 : 1.0;
      lightRef.current.intensity = (isNearby ? 3.8 : 2.0) + Math.sin(t * 3.0 * speed) * 0.5;
    }
  });

  const handleInteract = () => {
    if (audioEnabled) sound.playChime();
    setActivePanel(station.panel);
  };

  const moteCount = qualityTier === 'high' ? 10 : qualityTier === 'medium' ? 5 : 0;

  return (
    <group position={station.position}>
      {/* 1. Ground Holographic Projector Ring */}
      <HologramGroundProjector color={station.color} isNearby={isNearby} />

      {/* 2. Ascending Cyber Plasma Motes (scaled by qualityTier) */}
      {moteCount > 0 && (
        <AscendingEnergyMotes color={station.color} isNearby={isNearby} count={moteCount} />
      )}

      {/* 3. 3D Animated Tower Model */}
      <StationTowerModel
        url={activeTowerUrl}
        station={station}
        isNearby={isNearby}
        targetHeight={2.3}
      />

      {/* 4. Dynamic Breathing Cyber Point Light (disabled on low qualityTier to save dynamic lights) */}
      {qualityTier !== 'low' && (
        <pointLight
          ref={lightRef}
          position={[0, 1.45, 0]}
          color={station.color}
          distance={8.0}
          decay={2}
        />
      )}

      {/* 5. Floating HTML Badge & Prompt */}
      {!hasActivePanel && !isIntroLoading && inRange && (
        <Html
          position={[0, 2.7, 0]}
          center
          style={{ pointerEvents: 'auto' }}
        >
          <div
            onClick={handleInteract}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                background: isNearby
                  ? 'rgba(10, 14, 25, 0.92)'
                  : 'rgba(10, 14, 25, 0.82)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                border: `1.2px solid ${station.color}${isNearby ? 'dd' : '77'}`,
                boxShadow: isNearby
                  ? `0 0 10px ${station.color}88, inset 0 0 6px ${station.color}22`
                  : `0 0 4px ${station.color}44`,
                color: '#ffffff',
                fontFamily: 'var(--font-hud)',
                fontSize: '12.5px',
                fontWeight: 700,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: station.color,
                    boxShadow: `0 0 5px ${station.color}`,
                    display: 'inline-block',
                  }}
                />
                <span style={{ letterSpacing: '0.6px' }}>{station.title}</span>
              </div>

              {isNearby && (
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-hud)',
                    color: station.color,
                    fontWeight: 700,
                    letterSpacing: '0.5px'
                  }}
                >
                  {isMobile ? '⚡ Tap to Inspect' : '⚡ Press [E] to Inspect'}
                </div>
              )}
            </div>

            <div
              style={{
                width: '1.5px',
                height: '10px',
                background: `linear-gradient(to bottom, ${station.color}, transparent)`,
              }}
            />
          </div>
        </Html>
      )}
    </group>
  );
});
