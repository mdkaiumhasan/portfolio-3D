import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore, playerRealtimePos } from '../../store/gameStore';

export const ThirdPersonCamera: React.FC = () => {
  const { camera, gl } = useThree();
  const activePanel = useGameStore((state) => state.activePanel);
  const worldOctree = useGameStore((state) => state.worldOctree);
  const isSeatedOnThrone = useGameStore((state) => state.isSeatedOnThrone);
  const userHasDragged = useRef(false);

  // Camera spherical coordinates - starts from front 3/4 royal presentation angle
  const distance = useRef(4.8);
  const targetDistance = useRef(4.8);
  const currentActualDist = useRef(4.8);
  const yaw = useRef(2.85); // Front-quarter view showing character seated on throne
  const pitch = useRef(0.18); // Elegant eye-level angle
  const isDragging = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });

  // Camera look target
  const currentTarget = useRef(new THREE.Vector3(0, 1.45, 32));
  const currentPos = useRef(new THREE.Vector3(0, 2.5, 27));

  // Pointer drag listeners
  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
      isDragging.current = true;
      previousPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      userHasDragged.current = true;
      const deltaX = e.clientX - previousPointer.current.x;
      const deltaY = e.clientY - previousPointer.current.y;
      previousPointer.current = { x: e.clientX, y: e.clientY };

      yaw.current -= deltaX * 0.005;
      pitch.current = THREE.MathUtils.clamp(pitch.current + deltaY * 0.004, 0.04, 0.82);
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      // Step zoom that is immune to trackpad/free-spin wheel spikes
      const step = Math.sign(e.deltaY) * 0.4;
      targetDistance.current = THREE.MathUtils.clamp(
        targetDistance.current + step,
        2.5,
        6.5
      );
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);

    // Smooth base distance zoom
    distance.current = THREE.MathUtils.lerp(distance.current, targetDistance.current, 10 * clampedDelta);

    // If modal panel is open, zoom in slightly
    const effDistance = activePanel ? distance.current * 0.75 : distance.current;

    // Follow target is around player chest / head height
    // Zero-latency 60fps direct read from playerRealtimePos
    const targetX = playerRealtimePos.x;
    const targetY = playerRealtimePos.y + 1.55;
    const targetZ = playerRealtimePos.z;

    // Critically damped look target follow: zero overshoot, zero rubber-banding bounce
    currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, targetX, 22, clampedDelta);
    currentTarget.current.y = THREE.MathUtils.damp(currentTarget.current.y, targetY, 22, clampedDelta);
    currentTarget.current.z = THREE.MathUtils.damp(currentTarget.current.z, targetZ, 22, clampedDelta);

    // When dismounting the throne, smoothly sweep camera from front presentation angle behind character (yaw -> 0)
    if (!isSeatedOnThrone && !userHasDragged.current && Math.abs(yaw.current) > 0.04) {
      let diff = 0 - yaw.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      yaw.current += diff * Math.min(1, 2.8 * clampedDelta);
      pitch.current = THREE.MathUtils.lerp(pitch.current, 0.22, 2.8 * clampedDelta);
      targetDistance.current = 5.4;
    }

    // 1. Calculate desired camera direction vector (from character towards camera)
    const desiredHorizontalDist = effDistance * Math.cos(pitch.current);
    const camDir = new THREE.Vector3(
      desiredHorizontalDist * Math.sin(yaw.current),
      effDistance * Math.sin(pitch.current),
      desiredHorizontalDist * Math.cos(yaw.current)
    );
    const maxDist = camDir.length();
    camDir.normalize();

    // 2. Focused SpringArm Collision System (Prevents wall clipping without edge-snag jitter)
    let allowedDist = effDistance;

    if (worldOctree) {
      const probeOrigins = [
        currentTarget.current,
        currentTarget.current.clone().add(new THREE.Vector3(0, 0.15, 0)),
      ];

      for (const origin of probeOrigins) {
        const ray = new THREE.Ray(origin, camDir);
        const hit = worldOctree.rayIntersect(ray);
        if (hit && hit.distance < maxDist) {
          const probeDist = Math.max(1.8, hit.distance - 0.25);
          if (probeDist < allowedDist) {
            allowedDist = probeDist;
          }
        }
      }
    }

    // 3. Smooth SpringArm retraction & expansion using critical damping (zero pops, zero flicker)
    const armSpeed = allowedDist < currentActualDist.current ? 18 : 8;
    currentActualDist.current = THREE.MathUtils.damp(
      currentActualDist.current,
      allowedDist,
      armSpeed,
      clampedDelta
    );

    const actualDist = currentActualDist.current;
    const horizontalDist = actualDist * Math.cos(pitch.current);

    const camY = currentTarget.current.y + actualDist * Math.sin(pitch.current);
    const camX = currentTarget.current.x + horizontalDist * Math.sin(yaw.current);
    const camZ = currentTarget.current.z + horizontalDist * Math.cos(yaw.current);

    const targetPos = new THREE.Vector3(camX, camY, camZ);

    // 4. World Boundary Safeguard: Camera safely spans the entire Parisian curved street down to the North Gate
    targetPos.x = THREE.MathUtils.clamp(targetPos.x, -14.0, 36.0);
    targetPos.y = THREE.MathUtils.clamp(targetPos.y, 0.4, 14.0);
    targetPos.z = THREE.MathUtils.clamp(targetPos.z, -63.5, 52.0);

    // Critically damped position follow (tight follow with zero latency, zero wobble)
    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetPos.x, 26, clampedDelta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetPos.y, 26, clampedDelta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetPos.z, 26, clampedDelta);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
};
