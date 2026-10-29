import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import {
  useGameStore,
  STATIONS,
  playerRealtimePos,
  playerRealtimeHeading,
  mobileInputState,
} from '../../store/gameStore';
import { sound } from '../../systems/audio';
import { preparePlayerAnimations } from './characterAnimations';
import { getPlayerModelUrl } from '../../utils/modelUrl';

interface PlayerProps {
  cameraRef?: React.RefObject<THREE.Camera>;
}

const PLAYER_MODEL_URL = getPlayerModelUrl();

// Module-scoped scratch vectors for zero-GC 60/120fps physics loop
const _camForward = new THREE.Vector3();
const _camRight = new THREE.Vector3();
const _moveDir = new THREE.Vector3();
const _deltaV = new THREE.Vector3();
const _deltaH = new THREE.Vector3();
const _pushVec = new THREE.Vector3();

export const Player: React.FC<PlayerProps> = React.memo(() => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const resolvedPlayerModelUrl = useGameStore((s) => s.resolvedPlayerModelUrl);
  const activePlayerUrl = resolvedPlayerModelUrl || PLAYER_MODEL_URL;
  const { scene, animations } = useGLTF(activePlayerUrl, '/draco/');

  const processedAnimations = useMemo(() => {
    return preparePlayerAnimations(animations);
  }, [animations]);

  const { actions } = useAnimations(processedAnimations, groupRef);

  const playerCollider = useRef(
    new Capsule(
      new THREE.Vector3(1.35, 0.35, 41),
      new THREE.Vector3(1.35, 1.45, 41),
      0.35
    )
  );

  // Local physics & input state
  const pos = useRef(new THREE.Vector3(1.35, 0, 41));
  const lastReportedPos = useRef(new THREE.Vector3(1.35, 0, 41));
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const heading = useRef(Math.PI);
  const isGrounded = useRef(true);
  const footstepTimer = useRef(0);
  const hudSyncTimer = useRef(0);
  const currentAction = useRef<string>('idle');
  const isMovingLocal = useRef(false);
  const isRunningLocal = useRef(false);

  // Atomic Zustand selectors (never subscribe to playerPosition!)
  const activeEmote = useGameStore((s) => s.activeEmote);
  const setActiveEmote = useGameStore((s) => s.setActiveEmote);
  const setActivePanel = useGameStore((s) => s.setActivePanel);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);

  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return;

      const store = useGameStore.getState();
      if (store.isIntroLoading || store.activePanel) return;

      keys.current[e.code] = true;
      keys.current[e.key.toLowerCase()] = true;

      if (store.isSeatedOnThrone) {
        store.setIsSeatedOnThrone(false);
      }

      if (e.key === '1') setActiveEmote('salute');
      if (e.key === '2') setActiveEmote('shakehand');
      if (e.key === '3') setActiveEmote('cough');

      if (e.key.toLowerCase() === 'e') {
        if (store.nearbyStation && !store.activePanel) {
          if (store.audioEnabled) sound.playChime();
          setActivePanel(store.nearbyStation.panel);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
      keys.current[e.key.toLowerCase()] = false;
      if (useGameStore.getState().isIntroLoading) {
        keys.current = {};
      }
    };

    const handleBlur = () => {
      keys.current = {};
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    if (typeof window !== 'undefined') {
      (window as any).__teleportPlayer = (x: number, y: number, z: number, h?: number) => {
        pos.current.set(x, y, z);
        playerCollider.current.start.set(x, y + 0.35, z);
        playerCollider.current.end.set(x, y + 1.45, z);
        playerRealtimePos.x = x;
        playerRealtimePos.y = y;
        playerRealtimePos.z = z;
        if (h !== undefined) {
          heading.current = h;
          playerRealtimeHeading.current = h;
        }
        setPlayerPosition([x, y, z]);
        useGameStore.getState().setIsSeatedOnThrone(false);
      };
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      if (typeof window !== 'undefined') {
        delete (window as any).__teleportPlayer;
      }
    };
  }, [setActivePanel, setActiveEmote, setPlayerPosition]);

  // Adjust materials for cool_man once
  useEffect(() => {
    if (scene && !scene.userData.__playerMatCalibrated) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.roughness = 0.55;
            mat.metalness = 0.2;
            mat.envMapIntensity = 1.2;
          }
        }
      });
      scene.userData.__playerMatCalibrated = true;
    }
  }, [scene]);

  // Emote timeout to return to idle pose after emote finishes
  useEffect(() => {
    if (activeEmote && activeEmote !== 'idle') {
      const durationMap: { [key: string]: number } = {
        salute: 2800,
        shakehand: 4400,
        cough: 2200,
        sit: 7000,
      };
      const dur = durationMap[activeEmote] || 3000;
      const timer = setTimeout(() => {
        setActiveEmote('idle');
      }, dur);
      return () => clearTimeout(timer);
    }
  }, [activeEmote, setActiveEmote]);

  const hasInitializedAnim = useRef(false);

  useEffect(() => {
    if (!actions || hasInitializedAnim.current) return;
    hasInitializedAnim.current = true;
    const isSeated = useGameStore.getState().isSeatedOnThrone;
    const initialAnim = isSeated && actions['sit'] ? 'sit' : 'idle';
    if (actions[initialAnim]) {
      const initialAction = actions[initialAnim];
      initialAction.reset();
      initialAction.setLoop(THREE.LoopRepeat, Infinity);
      initialAction.fadeIn(0.2).play();
      currentAction.current = initialAnim;
    }
  }, [actions]);

  const switchAnimation = (animName: string, timeScale = 1.0, duration = 0.28) => {
    if (!actions[animName]) return;
    if (currentAction.current === animName) {
      const act = actions[animName];
      if (act) act.timeScale = timeScale;
      return;
    }

    const prevAction = actions[currentAction.current];
    const nextAction = actions[animName];

    if (nextAction) {
      nextAction.reset();
      nextAction.setEffectiveTimeScale(timeScale);
      nextAction.setEffectiveWeight(1);
      nextAction.setLoop(THREE.LoopRepeat, Infinity);
      nextAction.play();
      if (prevAction) {
        nextAction.crossFadeFrom(prevAction, duration, true);
      }
    }
    currentAction.current = animName;
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const store = useGameStore.getState();

    // Freeze physics while intro loader is active
    if (store.isIntroLoading) {
      vel.current.set(0, 0, 0);
      keys.current = {};
      return;
    }

    const clampedDelta = Math.min(delta, 0.1);

    let inputX = 0;
    let inputZ = 0;

    if (!store.activePanel) {
      if (keys.current['KeyW'] || keys.current['ArrowUp'] || keys.current['w']) inputZ -= 1;
      if (keys.current['KeyS'] || keys.current['ArrowDown'] || keys.current['s']) inputZ += 1;
      if (keys.current['KeyA'] || keys.current['ArrowLeft'] || keys.current['a']) inputX -= 1;
      if (keys.current['KeyD'] || keys.current['ArrowRight'] || keys.current['d']) inputX += 1;

      if (Math.abs(mobileInputState.joystickX) > 0.08 || Math.abs(mobileInputState.joystickY) > 0.08) {
        inputX += mobileInputState.joystickX;
        inputZ += mobileInputState.joystickY;
      }
    }

    const sprint =
      !store.activePanel &&
      (Boolean(keys.current['ShiftLeft']) ||
        Boolean(keys.current['ShiftRight']) ||
        mobileInputState.sprint);
    const jump = !store.activePanel && (Boolean(keys.current['Space']) || mobileInputState.jump);

    const hasInput = Math.hypot(inputX, inputZ) > 0.1;

    if ((hasInput || jump || sprint) && store.isSeatedOnThrone) {
      store.setIsSeatedOnThrone(false);
    }

    const speed = sprint ? 3.4 : 1.45;

    if (hasInput) {
      camera.getWorldDirection(_camForward);
      _camForward.y = 0;
      _camForward.normalize();

      _camRight.set(-_camForward.z, 0, _camForward.x);

      _moveDir
        .set(0, 0, 0)
        .addScaledVector(_camForward, -inputZ)
        .addScaledVector(_camRight, inputX)
        .normalize();

      const targetHeading = Math.atan2(_moveDir.x, _moveDir.z);
      let diff = targetHeading - heading.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      heading.current += diff * Math.min(1, 15 * clampedDelta);

      const targetVelX = _moveDir.x * speed;
      const targetVelZ = _moveDir.z * speed;
      const accel = sprint ? 16 : 12;
      vel.current.x = THREE.MathUtils.damp(vel.current.x, targetVelX, accel, clampedDelta);
      vel.current.z = THREE.MathUtils.damp(vel.current.z, targetVelZ, accel, clampedDelta);

      if (!isMovingLocal.current) {
        isMovingLocal.current = true;
        store.setIsMoving(true);
      }
      if (isRunningLocal.current !== sprint) {
        isRunningLocal.current = sprint;
        store.setIsRunning(sprint);
      }

      footstepTimer.current += clampedDelta;
      const cadence = sprint ? 0.36 : 0.58;
      if (footstepTimer.current >= cadence) {
        footstepTimer.current = 0;
        if (store.audioEnabled && isGrounded.current) {
          sound.playFootstep(sprint);
        }
      }

      if (actions['walking']) {
        switchAnimation('walking', sprint ? 1.6 : 1.0);
      }
    } else {
      vel.current.x = THREE.MathUtils.damp(vel.current.x, 0, 16, clampedDelta);
      vel.current.z = THREE.MathUtils.damp(vel.current.z, 0, 16, clampedDelta);
      const curSpeed = Math.hypot(vel.current.x, vel.current.z);

      if (curSpeed < 0.04) {
        vel.current.x = 0;
        vel.current.z = 0;
        if (isMovingLocal.current) {
          isMovingLocal.current = false;
          store.setIsMoving(false);
        }
        if (isRunningLocal.current) {
          isRunningLocal.current = false;
          store.setIsRunning(false);
        }

        if (store.activeEmote && store.activeEmote !== 'idle' && actions[store.activeEmote]) {
          if (store.isSeatedOnThrone) store.setIsSeatedOnThrone(false);
          switchAnimation(store.activeEmote, 1.0, store.activeEmote === 'cough' ? 0.35 : 0.25);
        } else if (store.isSeatedOnThrone && actions['sit']) {
          switchAnimation('sit', 1.0, 0.22);
        } else {
          switchAnimation('idle', 1.0, 0.32);
        }
      } else if (actions['walking']) {
        switchAnimation('walking', THREE.MathUtils.clamp(curSpeed / 1.45, 0.4, 1.0));
      }
    }

    // Jumping & Vertical Physics
    if (jump && isGrounded.current) {
      vel.current.y = 8.0;
      isGrounded.current = false;
      store.setIsJumping(true);
      if (store.audioEnabled) sound.playJump();
    }

    if (!isGrounded.current) {
      vel.current.y -= 24.0 * clampedDelta;
      vel.current.y = Math.max(-20, vel.current.y);
      _deltaV.set(0, vel.current.y * clampedDelta, 0);
      playerCollider.current.translate(_deltaV);

      if (playerCollider.current.start.y <= 0.35) {
        playerCollider.current.start.y = 0.35;
        playerCollider.current.end.y = 1.45;
        vel.current.y = 0;
        isGrounded.current = true;
        store.setIsJumping(false);
      }
    } else {
      playerCollider.current.start.y = 0.35;
      playerCollider.current.end.y = 1.45;
      vel.current.y = 0;
    }

    // Horizontal motion + Wall Collision Resolution
    _deltaH.set(vel.current.x * clampedDelta, 0, vel.current.z * clampedDelta);
    playerCollider.current.translate(_deltaH);

    if (store.worldOctree) {
      let iterations = 0;
      let hit = store.worldOctree.capsuleIntersect(playerCollider.current);

      while (hit && iterations < 5) {
        const nx = hit.normal.x;
        const nz = hit.normal.z;
        const len = Math.hypot(nx, nz);

        if (len > 0.001) {
          const pushX = (nx / len) * hit.depth;
          const pushZ = (nz / len) * hit.depth;
          _pushVec.set(pushX, 0, pushZ);
          playerCollider.current.translate(_pushVec);

          const dot = vel.current.x * (nx / len) + vel.current.z * (nz / len);
          if (dot < 0) {
            vel.current.x -= (nx / len) * dot;
            vel.current.z -= (nz / len) * dot;
          }
        }

        iterations++;
        hit = store.worldOctree.capsuleIntersect(playerCollider.current);
      }
    }

    // Street safety boundaries
    if (playerCollider.current.start.z > 47.5) {
      playerCollider.current.start.z = 47.5;
      playerCollider.current.end.z = 47.5;
      if (vel.current.z > 0) vel.current.z = 0;
    } else if (playerCollider.current.start.z < -60.0) {
      playerCollider.current.start.z = -60.0;
      playerCollider.current.end.z = -60.0;
      if (vel.current.z < 0) vel.current.z = 0;
    }

    if (
      playerCollider.current.start.x > 7.35 &&
      playerCollider.current.start.z >= 19.8 &&
      playerCollider.current.start.z <= 24.2
    ) {
      playerCollider.current.start.x = 7.35;
      playerCollider.current.end.x = 7.35;
      if (vel.current.x > 0) vel.current.x = 0;
    }

    // Synchronize visual mesh
    pos.current.set(
      playerCollider.current.start.x,
      playerCollider.current.start.y - 0.35,
      playerCollider.current.start.z
    );

    groupRef.current.position.copy(pos.current);
    groupRef.current.rotation.y = heading.current;

    playerRealtimePos.x = pos.current.x;
    playerRealtimePos.y = pos.current.y;
    playerRealtimePos.z = pos.current.z;
    playerRealtimeHeading.current = heading.current;

    // Sync to store for StreetRadar at ~10Hz only when player actually moves
    hudSyncTimer.current += clampedDelta;
    if (hudSyncTimer.current >= 0.1) {
      hudSyncTimer.current = 0;
      if (pos.current.distanceToSquared(lastReportedPos.current) > 0.02) {
        lastReportedPos.current.copy(pos.current);
        store.setPlayerPosition([pos.current.x, pos.current.y, pos.current.z]);
        store.setPlayerHeading(heading.current);
      }
    }

    // Station Proximity Detection
    let closestStation = null;
    const minDistance = 4.5;

    for (let i = 0; i < STATIONS.length; i++) {
      const station = STATIONS[i];
      const dist = Math.hypot(
        pos.current.x - station.position[0],
        pos.current.z - station.position[2]
      );
      if (dist < minDistance) {
        closestStation = station;
        break;
      }
    }

    if (closestStation?.id !== store.nearbyStation?.id) {
      store.setNearbyStation(closestStation);
      if (closestStation && store.audioEnabled) {
        sound.playChime();
      }
    }
  });

  return (
    <group ref={groupRef} position={[1.35, 0, 41]} scale={[1, 1, 1]}>
      <primitive object={scene} />
    </group>
  );
});
