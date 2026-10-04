import * as THREE from 'three';

/**
 * Builds realistic, natural humanoid animations for cool_man:
 * 1. Root-motion stabilized in-place walking
 * 2. Lifelike, relaxed standing idle animation:
 *    - Arms hanging naturally straight down along the trench coat (eliminates stiff 45° A-pose flare)
 *    - Soft natural elbow bend (12° flexion)
 *    - Relaxed fingers with natural resting curl (eliminates stiff flat paddle hands)
 *    - Subtle 3.6-second human breathing cycle (spine chest expansion & shoulder rise/fall)
 *    - Upright grounded stance on street cobblestones
 */
export function preparePlayerAnimations(rawClips: THREE.AnimationClip[]): THREE.AnimationClip[] {
  if (!rawClips || rawClips.length === 0) return rawClips;

  const resultClips: THREE.AnimationClip[] = [];

  // 1. Stabilize in-place walking cycle (neutralize root drift)
  const walkClip = rawClips.find((a) => a.name === 'walking');
  if (walkClip) {
    walkClip.tracks.forEach((track) => {
      if (track.name.endsWith('.position')) {
        const values = track.values;
        const count = values.length / 3;
        if (count < 2) return;
        const startZ = values[2];
        const endZ = values[values.length - 1];
        const deltaZ = endZ - startZ;
        if (Math.abs(deltaZ) > 0.02) {
          for (let i = 0; i < count; i++) {
            const progress = i / (count - 1);
            values[i * 3 + 2] -= deltaZ * progress;
          }
        }
      }
    });
  }

  // 2. Ground the 'cough' emote so character lies down directly on the street (eliminates floating 0.9m in air)
  const coughClip = rawClips.find((a) => a.name === 'cough');
  if (coughClip) {
    const rootNodesToDrop = new Set([
      'mixamorig:Hips_94',
      'Ctrl_Hips_128',
      'Ctrl_ArmPole_IK_Left_130',
      'Ctrl_Hand_IK_Left_131',
      'Ctrl_ArmPole_IK_Right_132',
      'Ctrl_Hand_IK_Right_133',
      'Ctrl_Foot_IK_Left_149',
      'Ctrl_LegPole_IK_Left_150',
      'Ctrl_Foot_IK_Right_166',
      'Ctrl_LegPole_IK_Right_167'
    ]);
    const dropHeight = 0.90;
    coughClip.tracks.forEach((track) => {
      if (track.name.endsWith('.position')) {
        const nodeName = track.name.replace('.position', '');
        if (rootNodesToDrop.has(nodeName)) {
          const values = track.values;
          for (let i = 1; i < values.length; i += 3) {
            values[i] -= dropHeight;
          }
        }
      }
    });
  }

  // 3. Reference upright standing clip with complete 501-channel skeleton
  const standingRefClip = rawClips.find((a) => a.name === 'salute') || walkClip;
  if (!standingRefClip) {
    return rawClips;
  }

  // Build the natural standing idle clip (3.6s loop, 5 keyframes for buttery-smooth breathing cycle)
  const idleDuration = 3.6;
  const times = [0.0, 0.9, 1.8, 2.7, 3.6];
  const idleTracks: THREE.KeyframeTrack[] = [];

  // Base orientations for arm relaxation (Mixamo coordinate space)
  const baseLeftArmQ = new THREE.Quaternion(0.21007, 0.11028, -0.02385, 0.97115).normalize();
  const baseRightArmQ = new THREE.Quaternion(0.21000, -0.08935, 0.01928, 0.97342).normalize();
  const baseForeArmLQ = new THREE.Quaternion(-0.08045, -0.01313, 0.16052, 0.98366).normalize();
  const baseForeArmRQ = new THREE.Quaternion(-0.07297, 0.01154, -0.15581, 0.98502).normalize();

  standingRefClip.tracks.forEach((track) => {
    const name = track.name;
    const valSize = track.getValueSize();
    const v0 = track.values.slice(0, valSize);

    // Hips Position: Upright grounded height with micro breathing rise/fall (1.5mm)
    if (name.includes('Hips') && name.endsWith('.position')) {
      const values = new Float32Array(times.length * 3);
      for (let i = 0; i < times.length; i++) {
        const t = times[i];
        const bob = Math.sin((t / idleDuration) * Math.PI * 2) * 0.0015;
        values[i * 3 + 0] = v0[0];
        values[i * 3 + 1] = v0[1] + bob;
        values[i * 3 + 2] = v0[2];
      }
      idleTracks.push(new THREE.VectorKeyframeTrack(name, times, values));
      return;
    }

    // Scale tracks
    if (name.endsWith('.scale')) {
      const values = new Float32Array(times.length * 3);
      for (let i = 0; i < times.length; i++) {
        values.set(v0, i * 3);
      }
      idleTracks.push(new THREE.VectorKeyframeTrack(name, times, values));
      return;
    }

    // Rotation tracks
    if (name.endsWith('.quaternion')) {
      const nodeName = name.replace('.quaternion', '');
      const values = new Float32Array(times.length * 4);

      // --- UPPER ARMS: Bring down naturally along trench coat sides with comfortable clearance ---
      if (nodeName.includes('LeftArm')) {
        for (let i = 0; i < times.length; i++) {
          const t = times[i];
          const breath = Math.sin((t / idleDuration) * Math.PI * 2) * 0.012;
          // 0.33 rad provides perfect natural posture with clean clearance outside the trench coat
          const qRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.33 + breath);
          const qFinal = baseLeftArmQ.clone().multiply(qRot).normalize();
          qFinal.toArray(values, i * 4);
        }
        idleTracks.push(new THREE.QuaternionKeyframeTrack(name, times, values));
        return;
      }

      if (nodeName.includes('RightArm')) {
        for (let i = 0; i < times.length; i++) {
          const t = times[i];
          const breath = Math.sin((t / idleDuration) * Math.PI * 2) * 0.012;
          const qRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.33 + breath);
          const qFinal = baseRightArmQ.clone().multiply(qRot).normalize();
          qFinal.toArray(values, i * 4);
        }
        idleTracks.push(new THREE.QuaternionKeyframeTrack(name, times, values));
        return;
      }

      // --- FOREARMS: Gentle natural elbow flexion (~6-8°) ---
      if (nodeName.includes('LeftForeArm')) {
        const qElbow = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.10);
        const qFinal = baseForeArmLQ.clone().multiply(qElbow).normalize();
        for (let i = 0; i < times.length; i++) {
          qFinal.toArray(values, i * 4);
        }
        idleTracks.push(new THREE.QuaternionKeyframeTrack(name, times, values));
        return;
      }

      if (nodeName.includes('RightForeArm')) {
        const qElbow = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.10);
        const qFinal = baseForeArmRQ.clone().multiply(qElbow).normalize();
        for (let i = 0; i < times.length; i++) {
          qFinal.toArray(values, i * 4);
        }
        idleTracks.push(new THREE.QuaternionKeyframeTrack(name, times, values));
        return;
      }

      // --- SPINE: Subtle organic breathing expansion ---
      if (nodeName.includes('Spine1') || nodeName.includes('Spine2')) {
        const baseQ = new THREE.Quaternion(v0[0], v0[1], v0[2], v0[3]);
        for (let i = 0; i < times.length; i++) {
          const t = times[i];
          const pitch = Math.sin((t / idleDuration) * Math.PI * 2) * 0.012; // ~0.7° breathing pitch
          const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -pitch);
          const qFinal = baseQ.clone().multiply(qPitch).normalize();
          qFinal.toArray(values, i * 4);
        }
        idleTracks.push(new THREE.QuaternionKeyframeTrack(name, times, values));
        return;
      }

      // --- SHOULDERS: Natural clavicle relaxation & breathing rise/fall ---
      if (nodeName.includes('LeftShoulder') || nodeName.includes('RightShoulder')) {
        const baseQ = new THREE.Quaternion(v0[0], v0[1], v0[2], v0[3]);
        for (let i = 0; i < times.length; i++) {
          const t = times[i];
          const lift = Math.sin((t / idleDuration) * Math.PI * 2) * 0.008;
          const qLift = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 0, 1),
            nodeName.includes('Left') ? lift : -lift
          );
          const qFinal = baseQ.clone().multiply(qLift).normalize();
          qFinal.toArray(values, i * 4);
        }
        idleTracks.push(new THREE.QuaternionKeyframeTrack(name, times, values));
        return;
      }

      // --- FINGERS: Soft natural resting curl (eliminates stiff flat paddle hands) ---
      if (
        nodeName.includes('Hand') &&
        (nodeName.includes('Index') ||
          nodeName.includes('Middle') ||
          nodeName.includes('Ring') ||
          nodeName.includes('Pinky') ||
          nodeName.includes('Thumb'))
      ) {
        const baseQ = new THREE.Quaternion(v0[0], v0[1], v0[2], v0[3]);
        const curlAngle = nodeName.includes('Thumb') ? 0.15 : (nodeName.includes('1') ? 0.32 : 0.22);
        const qCurl = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), curlAngle);
        const qFinal = baseQ.clone().multiply(qCurl).normalize();
        for (let i = 0; i < times.length; i++) {
          qFinal.toArray(values, i * 4);
        }
        idleTracks.push(new THREE.QuaternionKeyframeTrack(name, times, values));
        return;
      }

      // Default steady rotation for other upright standing bones
      for (let i = 0; i < times.length; i++) {
        values.set(v0, i * 4);
      }
      idleTracks.push(new THREE.QuaternionKeyframeTrack(name, times, values));
      return;
    }

    // Other tracks
    const totalCount = times.length * valSize;
    const values = new (track.values as any).constructor(totalCount);
    for (let i = 0; i < times.length; i++) {
      values.set(v0, i * valSize);
    }
    const TrackType = (track as any).constructor;
    idleTracks.push(new TrackType(name, times, values));
  });

  const naturalIdleClip = new THREE.AnimationClip('idle', idleDuration, idleTracks);
  // Also create a Pose clip with the identical natural tracks to safeguard any legacy calls
  const naturalPoseClip = new THREE.AnimationClip('Pose', idleDuration, idleTracks);

  // Preserve existing clips, replacing 'Pose' and adding 'idle'
  rawClips.forEach((clip) => {
    if (clip.name !== 'Pose' && clip.name !== 'idle') {
      resultClips.push(clip);
    }
  });

  resultClips.push(naturalIdleClip);
  resultClips.push(naturalPoseClip);

  return resultClips;
}
