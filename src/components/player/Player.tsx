import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import { useGameStore, STATIONS, playerRealtimePos, playerRealtimeHeading } from '../../store/gameStore';
import { sound } from '../../systems/audio';
import { preparePlayerAnimations } from './characterAnimations';

interface PlayerProps {
  cameraRef?: React.RefObject<THREE.Camera>;
}

export const Player: React.FC<PlayerProps> = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const MODEL_URL = '/models/cool_man.glb?v=v6_grounded_cough';
  const { scene, animations } = useGLTF(MODEL_URL);

  // Prepare full 501-channel natural idle animation (with relaxed arms alongside coat and breathing cycle)
  // and in-place walking stabilization BEFORE Drei's useAnimations compiles the AnimationActions
  const processedAnimations = useMemo(() => {
    return preparePlayerAnimations(animations);
  }, [animations]);

  const { actions } = useAnimations(processedAnimations, groupRef);

  // Real 3D Physical Capsule Collider (radius = 0.35m, height = 1.8m)
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
  const heading = useRef(Math.PI); // Facing down the street (North towards Z < 0)
  const isGrounded = useRef(true);
  const footstepTimer = useRef(0);
  const hudSyncTimer = useRef(0);
  const currentAction = useRef<string>('idle');
  const isMovingLocal = useRef(false);
  const isRunningLocal = useRef(false);

  // Game store
  const {
    worldOctree,
    isMoving,
    setIsMoving,
    isRunning,
    setIsRunning,
    isJumping,
    setIsJumping,
    activeEmote,
    setActiveEmote,
    setPlayerPosition,
    setPlayerHeading,
    joystickVector,
    mobileActionSprint,
    mobileActionJump,
    setNearbyStation,
    nearbyStation,
    setActivePanel,
    audioEnabled,
    isSeatedOnThrone,
    setIsSeatedOnThrone
  } = useGameStore();

  // Keyboard state tracking
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      keys.current[e.code] = true;
      keys.current[e.key.toLowerCase()] = true;

      // Dismount throne immediately on any action/movement key
      const store = useGameStore.getState();
      if (store.isSeatedOnThrone) {
        store.setIsSeatedOnThrone(false);
      }

      // Emotes shortcuts
      if (e.key === '1') setActiveEmote('salute');
      if (e.key === '2') setActiveEmote('shakehand');
      if (e.key === '3') setActiveEmote('cough');

      // Interact shortcut
      if (e.key.toLowerCase() === 'e') {
        if (store.nearbyStation && !store.activePanel) {
          sound.playChime();
          setActivePanel(store.nearbyStation.panel);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setActivePanel, setActiveEmote]);

  // Adjust materials for cool_man
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.roughness = 0.55;
            mat.metalness = 0.2;
            mat.envMapIntensity = 1.2;
          }
        }
      });
    }
  }, [scene]);

  // Emote timeout to return to idle pose after emote finishes
  useEffect(() => {
    if (activeEmote && activeEmote !== 'idle') {
      const durationMap: { [key: string]: number } = {
        salute: 2800,
        shakehand: 4400,
        cough: 2200,
        sit: 7000
      };
      const dur = durationMap[activeEmote] || 3000;
      const timer = setTimeout(() => {
        setActiveEmote('idle');
      }, dur);
      return () => clearTimeout(timer);
    }
  }, [activeEmote, setActiveEmote]);

  const hasInitializedAnim = useRef(false);

  // Initial Animation: Seated pose on Iron Throne, otherwise standing Idle Pose
  useEffect(() => {
    if (!actions || hasInitializedAnim.current) return;
    hasInitializedAnim.current = true;
    const initialAnim = isSeatedOnThrone && actions['sit'] ? 'sit' : 'idle';
    if (actions[initialAnim]) {
      const initialAction = actions[initialAnim];
      initialAction.reset();
      initialAction.setLoop(THREE.LoopRepeat, Infinity);
      initialAction.fadeIn(0.2).play();
      currentAction.current = initialAnim;
    }
  }, [actions]);

  // Animation controller with seamless cross-fading (eliminates bone snapping & jerk on stop)
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

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const clampedDelta = Math.min(delta, 0.1);

    // Calculate movement vector from keyboard & joystick
    let inputX = 0;
    let inputZ = 0;

    // Keyboard controls
    if (keys.current['KeyW'] || keys.current['ArrowUp'] || keys.current['w']) inputZ -= 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown'] || keys.current['s']) inputZ += 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft'] || keys.current['a']) inputX -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight'] || keys.current['d']) inputX += 1;

    // Virtual Joystick
    if (Math.abs(joystickVector.x) > 0.1 || Math.abs(joystickVector.y) > 0.1) {
      inputX += joystickVector.x;
      inputZ += joystickVector.y;
    }

    const sprint = keys.current['ShiftLeft'] || keys.current['ShiftRight'] || mobileActionSprint;
    const jump = keys.current['Space'] || mobileActionJump;

    const hasInput = Math.hypot(inputX, inputZ) > 0.1;

    // Any movement or jump dismounts character from throne and triggers vanish sequence
    if ((hasInput || jump || mobileActionSprint || mobileActionJump) && isSeatedOnThrone) {
      setIsSeatedOnThrone(false);
    }
    const GRAVITY = 26.0;
    // Exactly matched to in-place stride speed (1.744m / 1.2s = 1.453 m/s)
    const speed = sprint ? 3.4 : 1.45;

    // 1. Calculate camera-relative movement intent
    if (hasInput) {
      const camForward = new THREE.Vector3();
      camera.getWorldDirection(camForward);
      camForward.y = 0;
      camForward.normalize();

      const camRight = new THREE.Vector3(-camForward.z, 0, camForward.x);

      const moveDir = new THREE.Vector3()
        .addScaledVector(camForward, -inputZ)
        .addScaledVector(camRight, inputX)
        .normalize();

      // Smoothly rotate character to target heading
      const targetHeading = Math.atan2(moveDir.x, moveDir.z);
      let diff = targetHeading - heading.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      heading.current += diff * Math.min(1, 15 * clampedDelta);

      // Smooth acceleration towards target velocity
      const targetVelX = moveDir.x * speed;
      const targetVelZ = moveDir.z * speed;
      const accel = sprint ? 16 : 12;
      vel.current.x = THREE.MathUtils.damp(vel.current.x, targetVelX, accel, clampedDelta);
      vel.current.z = THREE.MathUtils.damp(vel.current.z, targetVelZ, accel, clampedDelta);

      if (!isMovingLocal.current) {
        isMovingLocal.current = true;
        setIsMoving(true);
      }
      if (isRunningLocal.current !== sprint) {
        isRunningLocal.current = sprint;
        setIsRunning(sprint);
      }

      // Footstep cadence synced to walk cycle (1.2s cycle = ~0.58s per foot plant)
      footstepTimer.current += clampedDelta;
      const cadence = sprint ? 0.36 : 0.58;
      if (footstepTimer.current >= cadence) {
        footstepTimer.current = 0;
        if (audioEnabled && isGrounded.current) {
          sound.playFootstep(sprint);
        }
      }

      if (actions['walking']) {
        switchAnimation('walking', sprint ? 1.6 : 1.0);
      }
    } else {
      // Natural deceleration friction without abrupt stopping snap
      vel.current.x = THREE.MathUtils.damp(vel.current.x, 0, 16, clampedDelta);
      vel.current.z = THREE.MathUtils.damp(vel.current.z, 0, 16, clampedDelta);
      const curSpeed = Math.hypot(vel.current.x, vel.current.z);

      if (curSpeed < 0.04) {
        vel.current.x = 0;
        vel.current.z = 0;
        if (isMovingLocal.current) {
          isMovingLocal.current = false;
          setIsMoving(false);
        }
        if (isRunningLocal.current) {
          isRunningLocal.current = false;
          setIsRunning(false);
        }

        if (activeEmote && activeEmote !== 'idle' && actions[activeEmote]) {
          if (isSeatedOnThrone) setIsSeatedOnThrone(false);
          switchAnimation(activeEmote, 1.0, activeEmote === 'cough' ? 0.35 : 0.25);
        } else if (isSeatedOnThrone && actions['sit']) {
          switchAnimation('sit', 1.0, 0.22);
        } else {
          switchAnimation('idle', 1.0, 0.32);
        }
      } else {
        // Seamlessly scale down walking cadence during deceleration (eliminates stopping jerk)
        if (actions['walking']) {
          switchAnimation('walking', THREE.MathUtils.clamp(curSpeed / 1.45, 0.4, 1.0));
        }
      }
    }

    // 2. Jumping & Vertical Physics (Strictly controlled: zero false vertical drops)
    if (jump && isGrounded.current) {
      vel.current.y = 8.0;
      isGrounded.current = false;
      setIsJumping(true);
      if (audioEnabled) sound.playJump();
    }

    if (!isGrounded.current) {
      vel.current.y -= 24.0 * clampedDelta;
      vel.current.y = Math.max(-20, vel.current.y);
      playerCollider.current.translate(new THREE.Vector3(0, vel.current.y * clampedDelta, 0));

      if (playerCollider.current.start.y <= 0.35) {
        playerCollider.current.start.y = 0.35;
        playerCollider.current.end.y = 1.45;
        vel.current.y = 0;
        isGrounded.current = true;
        setIsJumping(false);
      }
    } else {
      // Firm, 100% stable ground contact on flat Parisian street: zero vertical jitter or micro-bounce
      playerCollider.current.start.y = 0.35;
      playerCollider.current.end.y = 1.45;
      vel.current.y = 0;
    }

    // 3. Move capsule horizontally by velocity * delta
    const deltaH = new THREE.Vector3(vel.current.x * clampedDelta, 0, vel.current.z * clampedDelta);
    playerCollider.current.translate(deltaH);

    // 4. Horizontal Wall Collision Resolution (Walls CANNOT push player vertically)
    if (worldOctree) {
      let iterations = 0;
      let hit = worldOctree.capsuleIntersect(playerCollider.current);

      while (hit && iterations < 5) {
        // Only resolve horizontal penetration so walls never lift player into false gravity drops
        const nx = hit.normal.x;
        const nz = hit.normal.z;
        const len = Math.hypot(nx, nz);

        if (len > 0.001) {
          const pushX = (nx / len) * hit.depth;
          const pushZ = (nz / len) * hit.depth;
          playerCollider.current.translate(new THREE.Vector3(pushX, 0, pushZ));

          // Cancel velocity into wall
          const dot = vel.current.x * (nx / len) + vel.current.z * (nz / len);
          if (dot < 0) {
            vel.current.x -= (nx / len) * dot;
            vel.current.z -= (nz / len) * dot;
          }
        }

        iterations++;
        hit = worldOctree.capsuleIntersect(playerCollider.current);
      }
    }

    // 5. Street safety boundaries (South Gate at Z = 49.30, North Carriage Gate at Z = -61.63)
    if (playerCollider.current.start.z > 47.5) {
      playerCollider.current.start.z = 47.5;
      playerCollider.current.end.z = 47.5;
      if (vel.current.z > 0) vel.current.z = 0;
    } else if (playerCollider.current.start.z < -60.0) {
      playerCollider.current.start.z = -60.0;
      playerCollider.current.end.z = -60.0;
      if (vel.current.z < 0) vel.current.z = 0;
    }

    // Safety boundary for right-side closed corridor (Z = 19.8 to 24.2, mouth at X = 7.8)
    if (playerCollider.current.start.x > 7.35 && playerCollider.current.start.z >= 19.8 && playerCollider.current.start.z <= 24.2) {
      playerCollider.current.start.x = 7.35;
      playerCollider.current.end.x = 7.35;
      if (vel.current.x > 0) vel.current.x = 0;
    }

    // 6. Synchronize 3D visual mesh position with physics capsule
    pos.current.set(
      playerCollider.current.start.x,
      playerCollider.current.start.y - 0.35,
      playerCollider.current.start.z
    );

    groupRef.current.position.x = pos.current.x;
    groupRef.current.position.y = pos.current.y;
    groupRef.current.position.z = pos.current.z;
    groupRef.current.rotation.y = heading.current;

    // Immediately update zero-latency realtime position for 60fps buttery-smooth camera tracking
    playerRealtimePos.x = pos.current.x;
    playerRealtimePos.y = pos.current.y;
    playerRealtimePos.z = pos.current.z;
    playerRealtimeHeading.current = heading.current;

    // Sync to store for HUD and radar at 12Hz (eliminates 60fps React re-render overhead)
    hudSyncTimer.current += clampedDelta;
    if (hudSyncTimer.current >= 0.08) {
      hudSyncTimer.current = 0;
      if (pos.current.distanceToSquared(lastReportedPos.current) > 0.01) {
        lastReportedPos.current.copy(pos.current);
        setPlayerPosition([pos.current.x, pos.current.y, pos.current.z]);
        setPlayerHeading(heading.current);
      }
    }

    // Station Proximity Detection
    let closestStation = null;
    const minDistance = 4.5;

    for (const station of STATIONS) {
      const dist = Math.hypot(
        pos.current.x - station.position[0],
        pos.current.z - station.position[2]
      );
      if (dist < minDistance) {
        closestStation = station;
        break;
      }
    }

    if (closestStation?.id !== nearbyStation?.id) {
      setNearbyStation(closestStation);
      if (closestStation && audioEnabled) {
        sound.playChime();
      }
    }
  });

  return (
    <group ref={groupRef} position={[1.35, 0, 41]} scale={[1, 1, 1]}>
      {/* 3D Character Model */}
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/models/cool_man.glb?v=v6_grounded_cough');
