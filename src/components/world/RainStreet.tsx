import React, { Suspense, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Octree } from 'three/examples/jsm/math/Octree.js';
import { StationPedestal } from './StationPedestal';
import { SouthPerimeterGate, NorthStreetTerminus, CorridorClosureGate, EastPerimeterGate } from './StreetBoundaries';
import { IronThrone } from './IronThrone';
import { STATIONS, useGameStore } from '../../store/gameStore';
import { getRainStreetModelUrl } from '../../utils/modelUrl';

export { getRainStreetModelUrl };
export const RAIN_STREET_MODEL_URL = getRainStreetModelUrl();

const MapModel: React.FC = () => {
  const resolvedEnvModelUrl = useGameStore((s) => s.resolvedEnvModelUrl);
  const setWorldOctree = useGameStore((s) => s.setWorldOctree);
  const qualityTier = useGameStore((s) => s.qualityTier);

  const activeModelUrl = resolvedEnvModelUrl || RAIN_STREET_MODEL_URL;
  const { scene } = useGLTF(activeModelUrl, '/draco/');

  useEffect(() => {
    if (!scene) return;

    // 1. Calibrate materials & Octree ONCE per loaded GLTF scene (safe across 3D <-> 2D remounts)
    if (!scene.userData.__calibrated) {
      scene.position.set(-6.0, 0, -25.0);
      scene.updateMatrixWorld(true);

      scene.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;

          mesh.frustumCulled = true;
          mesh.matrixAutoUpdate = false;
          mesh.castShadow = false;
          mesh.receiveShadow = false;

          const meshName = (mesh.name || '').toLowerCase();

          if (mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            const updatedMats = mats.map((m) => {
              const oldMat = m as THREE.MeshStandardMaterial;
              const matName = (oldMat.name || '').toLowerCase();

              if (oldMat.map) {
                oldMat.map.anisotropy = qualityTier === 'high' ? 8 : qualityTier === 'medium' ? 4 : 1;
              }

              // 1. Alpha foliage: grass tufts, dry weeds, fallen autumn leaves, tree foliage
              const isFoliage =
                oldMat.transparent ||
                (typeof oldMat.alphaTest === 'number' && oldMat.alphaTest > 0) ||
                matName.includes('grass') ||
                matName.includes('weed') ||
                matName.includes('leave') ||
                matName.includes('feuille') ||
                meshName.includes('grass') ||
                meshName.includes('weed') ||
                meshName.includes('leave') ||
                meshName.includes('feuille');

              if (isFoliage) {
                return new THREE.MeshBasicMaterial({
                  map: oldMat.map || null,
                  color: oldMat.color || new THREE.Color(0xffffff),
                  transparent: true,
                  alphaTest: 0.35,
                  depthWrite: true,
                  side: THREE.DoubleSide,
                  toneMapped: true,
                });
              }

              // 2. Translucent glass (street lanterns, windows)
              if (matName.includes('verre') || matName.includes('glass')) {
                return new THREE.MeshBasicMaterial({
                  map: oldMat.map || null,
                  color: oldMat.color || new THREE.Color(0xffffff),
                  transparent: true,
                  opacity: 0.7,
                  depthWrite: false,
                  side: THREE.DoubleSide,
                  toneMapped: true,
                });
              }

              // 3. Ground cobblestones, sidewalks, dirt, buildings, facades, roofs, props
              const isGround =
                matName.includes('ground') ||
                matName.includes('trottoir') ||
                matName.includes('terre') ||
                meshName.includes('ground') ||
                meshName.includes('trottoir') ||
                meshName.includes('terre');

              const mat = new THREE.MeshBasicMaterial({
                map: oldMat.map || null,
                color: isGround ? new THREE.Color(1.15, 1.15, 1.15) : (oldMat.color || new THREE.Color(1, 1, 1)),
                side: oldMat.side || THREE.DoubleSide,
                toneMapped: true,
              });

              // Share compiled WebGL shader programs across all ground vs facade meshes!
              mat.customProgramCacheKey = () => (isGround ? 'rain_street_ground_v1' : 'rain_street_facade_v1');

              mat.onBeforeCompile = (shader) => {
                shader.fragmentShader = shader.fragmentShader.replace(
                  '#include <dithering_fragment>',
                  `
                  // Lift crushed blacks and soften harsh contrast
                  gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(${isGround ? '0.84' : '0.90'}));
                  gl_FragColor.rgb = gl_FragColor.rgb * ${isGround ? '1.10' : '1.03'} + vec3(${isGround ? '0.045' : '0.015'});
                  #include <dithering_fragment>
                  `
                );
              };

              return mat;
            });
            mesh.material = Array.isArray(mesh.material) ? updatedMats : updatedMats[0];
          }
        }
      });

      // 2. High-Performance, Butter-Smooth Gapless Collision System
      const collisionRoot = new THREE.Group();

      const streetRoad = new THREE.Mesh(new THREE.BoxGeometry(80, 1.0, 120));
      streetRoad.position.set(10, -0.5, -10);
      collisionRoot.add(streetRoad);

      const southWall = new THREE.Mesh(new THREE.BoxGeometry(50, 16, 4.0));
      southWall.position.set(1.35, 8, 51.0);
      collisionRoot.add(southWall);

      const northWall = new THREE.Mesh(new THREE.BoxGeometry(14.6, 16, 2.0));
      northWall.position.set(18.50, 8, -48.88);
      northWall.rotation.set(0, 0.5067, 0);
      collisionRoot.add(northWall);

      const eastGateWall = new THREE.Mesh(new THREE.BoxGeometry(11.8, 16, 2.0));
      eastGateWall.position.set(27.77, 8, -38.86);
      eastGateWall.rotation.set(0, 0.6069, 0);
      collisionRoot.add(eastGateWall);

      const leftSegments = [
        { z1: 49.5, z2: 37.0, xFace: -4.4 },
        { z1: 37.5, z2: 33.5, xFace: -4.3 },
        { z1: 34.0, z2: 27.5, xFace: -5.3 },
        { z1: 28.0, z2: 20.5, xFace: -4.8 },
        { z1: 21.0, z2: 13.0, xFace: -5.0 },
        { z1: 13.5, z2: -1.0, xFace: -5.1 },
        { z1: -0.5, z2: -11.5, xFace: -4.9 },
        { z1: -11.0, z2: -19.0, xFace: -3.5 },
        { z1: -18.5, z2: -29.0, xFace: -0.3 },
        { z1: -28.5, z2: -36.0, xFace: 3.2 },
        { z1: -35.5, z2: -42.0, xFace: 8.3 },
        { z1: -41.5, z2: -46.0, xFace: 13.0 },
      ];

      const rightSegments = [
        { z1: 49.5, z2: 37.0, xFace: 7.2 },
        { z1: 37.5, z2: 33.5, xFace: 8.2 },
        { z1: 34.0, z2: 13.0, xFace: 7.8 },
        { z1: 13.5, z2: 5.5, xFace: 7.2 },
        { z1: 6.0, z2: -4.5, xFace: 7.6 },
        { z1: -4.0, z2: -11.5, xFace: 8.2 },
        { z1: -11.0, z2: -18.0, xFace: 9.6 },
        { z1: -17.5, z2: -24.5, xFace: 11.5 },
        { z1: -24.0, z2: -36.5, xFace: 15.0 },
        { z1: -36.0, z2: -46.5, xFace: 26.5 },
        { z1: -46.0, z2: -51.5, xFace: 24.2 },
        { z1: -51.0, z2: -54.2, xFace: 18.9 },
        { z1: -54.0, z2: -62.5, xFace: 18.5 },
      ];

      leftSegments.forEach((seg) => {
        const depth = Math.abs(seg.z1 - seg.z2) + 0.4;
        const zMid = (seg.z1 + seg.z2) / 2;
        const width = 18;
        const xCenter = seg.xFace - width / 2;
        const box = new THREE.Mesh(new THREE.BoxGeometry(width, 16, depth));
        box.position.set(xCenter, 8, zMid);
        collisionRoot.add(box);
      });

      rightSegments.forEach((seg) => {
        const depth = Math.abs(seg.z1 - seg.z2) + 0.4;
        const zMid = (seg.z1 + seg.z2) / 2;
        const width = 18;
        const xCenter = seg.xFace + width / 2;
        const box = new THREE.Mesh(new THREE.BoxGeometry(width, 16, depth));
        box.position.set(xCenter, 8, zMid);
        collisionRoot.add(box);
      });

      const corridorEntranceBlocker = new THREE.Mesh(new THREE.BoxGeometry(16, 16, 6.0));
      corridorEntranceBlocker.position.set(15.0, 8, 21.95);
      collisionRoot.add(corridorEntranceBlocker);

      collisionRoot.updateMatrixWorld(true);
      const octree = new Octree();
      octree.fromGraphNode(collisionRoot);
      scene.userData.__octree = octree;
      scene.userData.__calibrated = true;
    }

    if (scene.userData.__octree) {
      setWorldOctree(scene.userData.__octree as Octree);
    }
  }, [scene, setWorldOctree, qualityTier]);

  // Dynamically tune texture anisotropy when user toggles Rendering Quality in Settings
  useEffect(() => {
    if (!scene) return;
    const targetAniso = qualityTier === 'high' ? 8 : qualityTier === 'medium' ? 4 : 1;
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m: any) => {
          if (m?.map && m.map.anisotropy !== targetAniso) {
            m.map.anisotropy = targetAniso;
            m.map.needsUpdate = true;
          }
        });
      }
    });
  }, [scene, qualityTier]);

  return (
    <primitive
      object={scene}
      position={[-6.0, 0, -25.0]}
      scale={[1, 1, 1]}
    />
  );
};

const LANTERN_POSITIONS = [
  { z: 24, leftX: -4.4, rightX: 7.4 },
  { z: 10, leftX: -4.5, rightX: 7.2 },
  { z: -4, leftX: -4.5, rightX: 7.2 },
  { z: -16, leftX: -2.8, rightX: 9.2 },
  { z: -30, leftX: 3.5, rightX: 14.5 },
  { z: -44, leftX: 12.8, rightX: 25.5 },
];

const poleGeo = new THREE.CylinderGeometry(0.05, 0.08, 4.8, 6);
const headGeo = new THREE.BoxGeometry(0.26, 0.38, 0.26);
const poleMat = new THREE.MeshBasicMaterial({ color: '#1e293b' });
const headMat = new THREE.MeshBasicMaterial({ color: '#fed7aa' });

export const RainStreet: React.FC = () => {
  return (
    <group>
      {/* 2K Parisian Rain Street & Architectural Buildings */}
      <MapModel />

      {/* Street Lighting Lantern Posts along curved sidewalks */}
      {LANTERN_POSITIONS.map((lp, idx) => (
        <group key={`lamp-${idx}`}>
          <group position={[lp.leftX, 0, lp.z]}>
            <mesh position={[0, 2.4, 0]} geometry={poleGeo} material={poleMat} />
            <mesh position={[0.25, 4.7, 0]} geometry={headGeo} material={headMat} />
          </group>

          <group position={[lp.rightX, 0, lp.z]}>
            <mesh position={[0, 2.4, 0]} geometry={poleGeo} material={poleMat} />
            <mesh position={[-0.25, 4.7, 0]} geometry={headGeo} material={headMat} />
          </group>
        </group>
      ))}

      {/* Interactive Pedestals & Hologram Stations */}
      {STATIONS.map((station) => (
        <StationPedestal key={station.id} station={station} />
      ))}

      {/* Classical Parisian Architectural Boundary Terminus Closures */}
      <SouthPerimeterGate />
      <NorthStreetTerminus />
      <EastPerimeterGate />
      <CorridorClosureGate />

      {/* Royal Iron & Stone Throne at Welcome Spawn Point */}
      <Suspense fallback={null}>
        <IronThrone />
      </Suspense>
    </group>
  );
};
