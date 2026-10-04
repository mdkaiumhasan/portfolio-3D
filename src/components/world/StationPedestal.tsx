import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { StationInfo, useGameStore, playerRealtimePos } from '../../store/gameStore';
import { sound } from '../../systems/audio';

const PROJECT_TOWER_URL = '/models/Project_tower.glb';

interface StationTowerModelProps {
  url: string;
  station: StationInfo;
  isNearby: boolean;
  targetHeight?: number;
}

const StationTowerModel: React.FC<StationTowerModelProps> = ({
  url,
  station,
  isNearby,
  targetHeight = 2.3,
}) => {
  const { scene, animations } = useGLTF(url);

  // Clone with SkeletonUtils so skinned meshes and animated hierarchies are fully preserved
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

    // Keep 100% ORIGINAL model textures and materials, fix flyes particle blending
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
            const mat = m.clone() as THREE.MeshStandardMaterial;
            mat.side = THREE.DoubleSide;

            const matName = (mat.name || '').toLowerCase();

            // The 'flyes' mesh (mainCrystal_low_flyes_0) contains white sparkles on a black background.
            // Setting AdditiveBlending makes the black background 100% transparent and leaves only
            // the brilliant glowing sparkles, revealing the authentic crystal texture underneath!
            if (name.includes('flyes') || matName.includes('flyes')) {
              mat.transparent = true;
              mat.depthWrite = false;
              mat.blending = THREE.AdditiveBlending;
              mat.emissiveIntensity = 1.8;
            } else if (name.includes('crystal') || matName.includes('crystal')) {
              // The crystal mesh has the original light blue and purple diamond texture.
              // Ensure proper emissive glow and zero metallic dullness so it shines:
              mat.roughness = Math.min(mat.roughness ?? 0.2, 0.25);
              mat.metalness = 0.0;
              mat.emissiveIntensity = isNearby ? 1.6 : 1.2;
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
  }, [scene, targetHeight, url, isNearby]);

  // Set up AnimationMixer for the cloned instance
  const mixer = useMemo(() => {
    if (animations && animations.length > 0) {
      return new THREE.AnimationMixer(clone);
    }
    return null;
  }, [clone, animations]);

  // Find the stone bone/mesh to add subtle mystical animation to the pedestal stone
  const { pedBone, initialPedPos, initialPedRot, stoneMesh, initialMeshPos } = useMemo(() => {
    const bone = clone.getObjectByName('ped_05') as THREE.Bone | null;
    const mesh = clone.getObjectByName('mainCrystal_low_pedestal_0') as THREE.Mesh | null;
    return {
      pedBone: bone,
      initialPedPos: bone ? bone.position.clone() : new THREE.Vector3(),
      initialPedRot: bone ? bone.quaternion.clone() : new THREE.Quaternion(),
      stoneMesh: mesh,
      initialMeshPos: mesh ? mesh.position.clone() : new THREE.Vector3(),
    };
  }, [clone]);

  // Play all embedded GLTF animation clips
  useEffect(() => {
    if (mixer && animations && animations.length > 0) {
      const actions = animations.map((clip) => {
        const act = mixer.clipAction(clip);
        act.play();
        return act;
      });
      return () => {
        actions.forEach((a) => a.stop());
      };
    }
  }, [mixer, animations]);

  // Frame update: plays GLTF animations AND adds subtle mystical breathing & rocking to the stone
  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }

    const t = state.clock.elapsedTime;
    if (pedBone) {
      // Gentle rhythmic floating breathing for the stone pedestal
      pedBone.position.y = initialPedPos.y + Math.sin(t * 1.5) * 0.04;
      // Subtle mystical rocking tilt
      const rockAngle = Math.sin(t * 1.2) * 0.03;
      pedBone.quaternion
        .copy(initialPedRot)
        .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rockAngle));
    } else if (stoneMesh) {
      stoneMesh.position.y = initialMeshPos.y + Math.sin(t * 1.5) * 0.04;
      stoneMesh.rotation.y = Math.sin(t * 1.2) * 0.03;
    }
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

export const StationPedestal: React.FC<StationPedestalProps> = ({ station }) => {
  const [inRange, setInRange] = useState(false);
  const inRangeRef = useRef(false);

  const { nearbyStation, setActivePanel, audioEnabled, activePanel } = useGameStore();
  const isNearby = nearbyStation?.id === station.id;

  useFrame(() => {
    // Dynamic distance check: Only mount DOM badge within 16m to save CPU/GPU overhead
    const dist = Math.hypot(
      playerRealtimePos.x - station.position[0],
      playerRealtimePos.z - station.position[2]
    );
    const close = dist < 16;
    if (close !== inRangeRef.current) {
      inRangeRef.current = close;
      setInRange(close);
    }
  });

  const handleInteract = () => {
    if (audioEnabled) sound.playChime();
    setActivePanel(station.panel);
  };

  return (
    <group position={station.position}>
      {/* 3D Animated Model: Project_tower.glb for all stations */}
      <Suspense fallback={null}>
        <StationTowerModel
          url={PROJECT_TOWER_URL}
          station={station}
          isNearby={isNearby}
          targetHeight={2.5}
        />
      </Suspense>

      {/* Point Light Illuminating Environment with station color */}
      <pointLight
        position={[0, 1.5, 0]}
        color={station.color}
        intensity={isNearby ? 3.2 : 1.8}
        distance={7.5}
        decay={2}
      />

      {/* Floating HTML Badge & Prompt - Compact, attached right above tower head */}
      {!activePanel && inRange && (
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
                  ⚡ Press [E] to Inspect
                </div>
              )}
            </div>

            {/* Subtle glowing anchor pin attaching card to tower head */}
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
};

useGLTF.preload(PROJECT_TOWER_URL);
