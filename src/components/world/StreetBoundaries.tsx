import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * SouthPerimeterGate:
 * Seals the South end of the street at Z = 49.30 (where bat1 and bat12 end).
 * Connects directly between bat1 on the left (X = -4.43, Z = 49.27) and bat12 on the right (X = 7.13, Z = 49.34).
 * Exact road width: 11.56m, centered at X = 1.35, Z = 49.30.
 * Period-authentic 19th-century Parisian stone perimeter gateway with ornate wrought-iron railings.
 */
export const SouthPerimeterGate: React.FC = () => {
  const [wallDiffuse, wallNormal] = useTexture([
    '/textures/paris_wall_diffuse.png',
    '/textures/paris_wall_normal.png'
  ]);

  const stoneMaterial = useMemo(() => {
    const dMap = wallDiffuse.clone();
    dMap.wrapS = THREE.RepeatWrapping;
    dMap.wrapT = THREE.RepeatWrapping;
    dMap.repeat.set(1.5, 2.5);
    dMap.needsUpdate = true;

    const nMap = wallNormal.clone();
    nMap.wrapS = THREE.RepeatWrapping;
    nMap.wrapT = THREE.RepeatWrapping;
    nMap.repeat.set(1.5, 2.5);
    nMap.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: dMap,
      normalMap: nMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughness: 0.85,
      metalness: 0.1,
    });
  }, [wallDiffuse, wallNormal]);

  return (
    <group position={[1.35, 0, 49.30]}>
      {/* 1. Extended Cobblestone Ground beyond the gate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 7]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#475569" roughness={0.75} metalness={0.08} />
      </mesh>

      {/* 2. Left Stone Pier (attaches to bat1) */}
      <mesh position={[-5.78, 4.3, 0]} material={stoneMaterial}>
        <boxGeometry args={[1.5, 8.6, 1.5]} />
      </mesh>
      {/* Left Antique Gas Street Lantern */}
      <mesh position={[-5.78, 4.8, -0.9]}>
        <boxGeometry args={[0.3, 0.45, 0.3]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fed7aa" emissiveIntensity={2.5} />
      </mesh>

      {/* 3. Right Stone Pier (attaches to bat12) */}
      <mesh position={[5.78, 4.3, 0]} material={stoneMaterial}>
        <boxGeometry args={[1.5, 8.6, 1.5]} />
      </mesh>
      {/* Right Antique Gas Street Lantern */}
      <mesh position={[5.78, 4.8, -0.9]}>
        <boxGeometry args={[0.3, 0.45, 0.3]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fed7aa" emissiveIntensity={2.5} />
      </mesh>

      {/* 4. Central Gateway Stone Arch Beam & Keystone */}
      <mesh position={[0, 7.6, 0]} material={stoneMaterial}>
        <boxGeometry args={[11.56, 1.0, 0.8]} />
      </mesh>
      <mesh position={[0, 7.6, -0.45]} material={stoneMaterial}>
        <boxGeometry args={[0.7, 1.3, 0.25]} />
      </mesh>

      {/* 5. Period-Authentic Parisian Wrought-Iron Perimeter Gate */}
      <group position={[0, 0, 0]}>
        {/* Dark Stone Plinth Curb */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[11.2, 0.5, 0.5]} />
          <meshStandardMaterial color="#1e232b" roughness={0.85} />
        </mesh>
        {/* Backing Stone Architectural Facade (100% blocks distant void with 24m width) */}
        <mesh position={[0, 4.5, 0.2]} material={stoneMaterial}>
          <boxGeometry args={[24.0, 9.5, 0.6]} />
        </mesh>
        {/* Horizontal Iron Rails */}
        <mesh position={[0, 1.2, -0.05]}>
          <boxGeometry args={[11.0, 0.08, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 6.5, -0.05]}>
          <boxGeometry args={[11.0, 0.08, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Vertical Wrought Iron Spindles with Spearheads */}
        {[-4.0, -2.0, 0, 2.0, 4.0].map((x, i) => (
          <group key={`s-spindle-${i}`} position={[x, 0, -0.05]}>
            <mesh position={[0, 3.8, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 5.8, 6]} />
              <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.2} />
            </mesh>
            <mesh position={[0, 6.8, 0]}>
              <coneGeometry args={[0.08, 0.3, 6]} />
              <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

/**
 * NorthStreetTerminus:
 * Exact 3D geometric enclosure for the North end of the curved street.
 *
 * Uses the authentic 2K Parisian stone/brick diffuse & normal textures extracted
 * directly from the 3D model, so the wall texture ("sketch/lines/bricks") matches the
 * surrounding buildings 100% seamlessly!
 */
export const NorthStreetTerminus: React.FC = () => {
  const [brickDiffuse, brickNormal, stoneDiffuse, stoneNormal] = useTexture([
    '/textures/parisian_brick_diffuse.png',
    '/textures/parisian_brick_normal.png',
    '/textures/parisian_stone_diffuse.png',
    '/textures/parisian_stone_normal.png',
  ]);

  // Main Parisian Weathered Brick & Stone Material with repeating UVs and authentic Normal Mapping
  const wallMaterial = useMemo(() => {
    const dMap = brickDiffuse.clone();
    dMap.wrapS = THREE.RepeatWrapping;
    dMap.wrapT = THREE.RepeatWrapping;
    dMap.repeat.set(6.0, 2.5);
    dMap.needsUpdate = true;

    const nMap = brickNormal.clone();
    nMap.wrapS = THREE.RepeatWrapping;
    nMap.wrapT = THREE.RepeatWrapping;
    nMap.repeat.set(6.0, 2.5);
    nMap.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: dMap,
      normalMap: nMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughness: 0.82,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });
  }, [brickDiffuse, brickNormal]);

  // Lower Parisian Ashlar Limestone Foundation Plinth Material
  const plinthMaterial = useMemo(() => {
    const dMap = stoneDiffuse.clone();
    dMap.wrapS = THREE.RepeatWrapping;
    dMap.wrapT = THREE.RepeatWrapping;
    dMap.repeat.set(6.0, 1.0);
    dMap.needsUpdate = true;

    const nMap = stoneNormal.clone();
    nMap.wrapS = THREE.RepeatWrapping;
    nMap.wrapT = THREE.RepeatWrapping;
    nMap.repeat.set(6.0, 1.0);
    nMap.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: dMap,
      normalMap: nMap,
      normalScale: new THREE.Vector2(1.0, 1.0),
      color: '#dbe0e6',
      roughness: 0.85,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });
  }, [stoneDiffuse, stoneNormal]);

  // Classical Pilasters Material (Buttresses)
  const pilasterMaterial = useMemo(() => {
    const dMap = stoneDiffuse.clone();
    dMap.wrapS = THREE.RepeatWrapping;
    dMap.wrapT = THREE.RepeatWrapping;
    dMap.repeat.set(1.0, 3.5);
    dMap.needsUpdate = true;

    const nMap = stoneNormal.clone();
    nMap.wrapS = THREE.RepeatWrapping;
    nMap.wrapT = THREE.RepeatWrapping;
    nMap.repeat.set(1.0, 3.5);
    nMap.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: dMap,
      normalMap: nMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      color: '#d4d9df',
      roughness: 0.82,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
  }, [stoneDiffuse, stoneNormal]);

  return (
    <group position={[18.50, 0, -48.88]} rotation={[0, 0.5067, 0]}>
      {/* 1. Extended Cobblestone Ground under and behind North Terminus */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -3.0]} receiveShadow>
        <planeGeometry args={[18, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.75} metalness={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Solid Architectural Stone Backing Wall (DoubleSide, completely blocks sky void) */}
      {/* Spans from bat12 (X ~ 12.60) to bat3 (X ~ 24.40) - 14.2m total width, 9.6m high, 0.8m thick */}
      <mesh position={[0, 4.8, 0.2]} material={wallMaterial}>
        <boxGeometry args={[14.2, 9.6, 0.8]} />
      </mesh>

      {/* 3. Lower Ashlar Limestone Plinth Base across full 14.2m width */}
      <mesh position={[0, 0.9, 0.05]} material={plinthMaterial}>
        <boxGeometry args={[14.2, 1.8, 1.1]} />
      </mesh>

      {/* 4. Left Flank Solid Masonry Wall (between bat12 corner and gateway pier, local X = -4.7) */}
      <mesh position={[-4.7, 4.8, 0]} material={wallMaterial}>
        <boxGeometry args={[4.2, 8.0, 0.9]} />
      </mesh>

      {/* 5. Right Flank Solid Masonry Wall (between bat3 corner and gateway pier, local X = +4.7) */}
      <mesh position={[4.7, 4.8, 0]} material={wallMaterial}>
        <boxGeometry args={[4.2, 8.0, 0.9]} />
      </mesh>

      {/* 6. Left End Pier (embeds flush into bat12 at local X = -6.8) */}
      <mesh position={[-6.8, 4.8, 0]} material={pilasterMaterial}>
        <boxGeometry args={[1.2, 9.6, 1.2]} />
      </mesh>

      {/* 7. Right End Pier (embeds flush into bat3 at local X = +6.8) */}
      <mesh position={[6.8, 4.8, 0]} material={pilasterMaterial}>
        <boxGeometry args={[1.2, 9.6, 1.2]} />
      </mesh>

      {/* 8. Intermediate Left Gate Pier at local X = -2.6 */}
      <mesh position={[-2.6, 4.8, 0]} material={pilasterMaterial}>
        <boxGeometry args={[1.1, 9.6, 1.1]} />
      </mesh>
      {/* Left Antique Gas Lantern */}
      <mesh position={[-2.6, 5.2, -0.6]}>
        <boxGeometry args={[0.26, 0.38, 0.26]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fed7aa" emissiveIntensity={2.5} />
      </mesh>

      {/* 9. Intermediate Right Gate Pier at local X = +2.6 */}
      <mesh position={[2.6, 4.8, 0]} material={pilasterMaterial}>
        <boxGeometry args={[1.1, 9.6, 1.1]} />
      </mesh>
      {/* Right Antique Gas Lantern */}
      <mesh position={[2.6, 5.2, -0.6]}>
        <boxGeometry args={[0.26, 0.38, 0.26]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fed7aa" emissiveIntensity={2.5} />
      </mesh>

      {/* 10. Overhead Arch Header Beam spanning 5.2m central gateway */}
      <mesh position={[0, 7.8, 0]} material={pilasterMaterial}>
        <boxGeometry args={[5.4, 1.0, 1.0]} />
      </mesh>
      <mesh position={[0, 7.9, -0.55]} material={pilasterMaterial}>
        <boxGeometry args={[0.6, 1.2, 0.3]} />
      </mesh>

      {/* 11. Classical Cornice Coping across full 14.2m width */}
      <mesh position={[0, 9.4, 0]} material={pilasterMaterial}>
        <boxGeometry args={[14.4, 0.45, 1.3]} />
      </mesh>

      {/* 12. Central Parisian Street Lantern */}
      <mesh position={[0, 6.2, -0.55]}>
        <boxGeometry args={[0.3, 0.45, 0.3]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fed7aa" emissiveIntensity={2.5} />
      </mesh>

      {/* 13. Ornate Wrought-Iron Double Carriage Gate in 5.2m central opening */}
      <group>
        {/* Base Stone Curb */}
        <mesh position={[0, 0.25, -0.05]}>
          <boxGeometry args={[5.0, 0.5, 0.4]} />
          <meshStandardMaterial color="#1e232b" roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* Horizontal Iron Rails */}
        <mesh position={[0, 1.2, -0.1]}>
          <boxGeometry args={[4.9, 0.08, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 6.6, -0.1]}>
          <boxGeometry args={[4.9, 0.08, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Vertical Iron Spindles */}
        {[-2.0, -1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5, 2.0].map((x, i) => (
          <mesh key={`north-spin-${i}`} position={[x, 3.9, -0.1]}>
            <boxGeometry args={[0.06, 5.4, 0.06]} />
            <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/**
 * EastPerimeterGate:
 * Period-authentic 19th-century Parisian stone perimeter gateway with ornate wrought-iron railings.
 * Seals the East side street exit on the right side of the main boulevard between
 * bat6 (X = 23.59, Z = -35.96) and bat4 (X = 31.94, Z = -41.76).
 * Exact span: 10.16m, centered at [27.77, 0, -38.86] with rotation Y = 0.6069 rad.
 * Overlaps 0.62m into bat6 and bat4 with continuous 11.4m solid DoubleSide stone wall!
 */
export const EastPerimeterGate: React.FC = () => {
  const [wallDiffuse, wallNormal, stoneDiffuse, stoneNormal] = useTexture([
    '/textures/paris_wall_diffuse.png',
    '/textures/paris_wall_normal.png',
    '/textures/parisian_stone_diffuse.png',
    '/textures/parisian_stone_normal.png',
  ]);

  const wallMaterial = useMemo(() => {
    const dMap = wallDiffuse.clone();
    dMap.wrapS = THREE.RepeatWrapping;
    dMap.wrapT = THREE.RepeatWrapping;
    dMap.repeat.set(3.5, 2.5);
    dMap.needsUpdate = true;

    const nMap = wallNormal.clone();
    nMap.wrapS = THREE.RepeatWrapping;
    nMap.wrapT = THREE.RepeatWrapping;
    nMap.repeat.set(3.5, 2.5);
    nMap.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: dMap,
      normalMap: nMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughness: 0.85,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
  }, [wallDiffuse, wallNormal]);

  const plinthMaterial = useMemo(() => {
    const dMap = stoneDiffuse.clone();
    dMap.wrapS = THREE.RepeatWrapping;
    dMap.wrapT = THREE.RepeatWrapping;
    dMap.repeat.set(6.0, 1.0);
    dMap.needsUpdate = true;

    const nMap = stoneNormal.clone();
    nMap.wrapS = THREE.RepeatWrapping;
    nMap.wrapT = THREE.RepeatWrapping;
    nMap.repeat.set(6.0, 1.0);
    nMap.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: dMap,
      normalMap: nMap,
      normalScale: new THREE.Vector2(1.0, 1.0),
      color: '#dbe0e6',
      roughness: 0.85,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });
  }, [stoneDiffuse, stoneNormal]);

  const pilasterMaterial = useMemo(() => {
    const dMap = stoneDiffuse.clone();
    dMap.wrapS = THREE.RepeatWrapping;
    dMap.wrapT = THREE.RepeatWrapping;
    dMap.repeat.set(1.0, 3.5);
    dMap.needsUpdate = true;

    const nMap = stoneNormal.clone();
    nMap.wrapS = THREE.RepeatWrapping;
    nMap.wrapT = THREE.RepeatWrapping;
    nMap.repeat.set(1.0, 3.5);
    nMap.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: dMap,
      normalMap: nMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      color: '#d4d9df',
      roughness: 0.82,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
  }, [stoneDiffuse, stoneNormal]);

  return (
    <group position={[27.77, 0, -38.86]} rotation={[0, 0.6069, 0]}>
      {/* 1. Extended Dark Cobblestone Ground beyond the gate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 3.5]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#14181f" roughness={0.8} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Solid Continuous Architectural Backing Wall (11.4m wide, 9.2m high, 0.8m thick, DoubleSide) */}
      {/* 100% guarantees NO sky void is ever visible through gate bars or around piers */}
      <mesh position={[0, 4.6, 0.2]} material={wallMaterial}>
        <boxGeometry args={[11.4, 9.2, 0.8]} />
      </mesh>

      {/* 3. Lower Ashlar Limestone Plinth Base across full 11.4m width */}
      <mesh position={[0, 0.8, 0.05]} material={plinthMaterial}>
        <boxGeometry args={[11.4, 1.6, 1.1]} />
      </mesh>

      {/* 4. Left Flank Solid Masonry Wall (between bat6 and gateway pier, local X = -3.75) */}
      <mesh position={[-3.75, 4.6, 0]} material={wallMaterial}>
        <boxGeometry args={[2.7, 7.6, 0.9]} />
      </mesh>

      {/* 5. Right Flank Solid Masonry Wall (between bat4 and gateway pier, local X = +3.75) */}
      <mesh position={[3.75, 4.6, 0]} material={wallMaterial}>
        <boxGeometry args={[2.7, 7.6, 0.9]} />
      </mesh>

      {/* 6. Left End Pier (embeds flush into bat6 at local X = -5.1) */}
      <mesh position={[-5.1, 4.6, 0]} material={pilasterMaterial}>
        <boxGeometry args={[1.2, 9.2, 1.2]} />
      </mesh>

      {/* 7. Right End Pier (embeds flush into bat4 at local X = +5.1) */}
      <mesh position={[5.1, 4.6, 0]} material={pilasterMaterial}>
        <boxGeometry args={[1.2, 9.2, 1.2]} />
      </mesh>

      {/* 8. Intermediate Left Gate Pier at local X = -2.4 */}
      <mesh position={[-2.4, 4.6, 0]} material={pilasterMaterial}>
        <boxGeometry args={[1.1, 9.2, 1.1]} />
      </mesh>
      {/* Left Antique Gas Lantern */}
      <mesh position={[-2.4, 5.0, -0.6]}>
        <boxGeometry args={[0.26, 0.38, 0.26]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fed7aa" emissiveIntensity={2.5} />
      </mesh>

      {/* 9. Intermediate Right Gate Pier at local X = +2.4 */}
      <mesh position={[2.4, 4.6, 0]} material={pilasterMaterial}>
        <boxGeometry args={[1.1, 9.2, 1.1]} />
      </mesh>
      {/* Right Antique Gas Lantern */}
      <mesh position={[2.4, 5.0, -0.6]}>
        <boxGeometry args={[0.26, 0.38, 0.26]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fed7aa" emissiveIntensity={2.5} />
      </mesh>

      {/* 10. Overhead Arch Header Beam spanning 4.8m central gateway */}
      <mesh position={[0, 7.6, 0]} material={pilasterMaterial}>
        <boxGeometry args={[5.0, 1.0, 1.0]} />
      </mesh>
      <mesh position={[0, 7.7, -0.55]} material={pilasterMaterial}>
        <boxGeometry args={[0.6, 1.2, 0.3]} />
      </mesh>

      {/* 11. Molded Cornice Coping spanning entire 11.4m width */}
      <mesh position={[0, 9.0, 0]} material={pilasterMaterial}>
        <boxGeometry args={[11.6, 0.4, 1.3]} />
      </mesh>

      {/* 12. Period-Authentic Parisian Wrought-Iron Double Carriage Gate in 4.8m opening */}
      <group>
        {/* Stone Plinth Curb */}
        <mesh position={[0, 0.25, -0.05]}>
          <boxGeometry args={[4.4, 0.5, 0.4]} />
          <meshStandardMaterial color="#1e232b" roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* Horizontal Iron Rails */}
        <mesh position={[0, 1.2, -0.1]}>
          <boxGeometry args={[4.3, 0.08, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 6.5, -0.1]}>
          <boxGeometry args={[4.3, 0.08, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Grille Bars */}
        {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((x, i) => (
          <mesh key={`east-spindle-${i}`} position={[x, 3.8, -0.1]}>
            <boxGeometry args={[0.06, 5.4, 0.06]} />
            <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/**
 * CorridorClosureGate:
 * Seals off the right-side corridor entrance between bat10 (Z = 20.4) and bat9 (Z = 23.5)
 * at X = 7.90, Z = 21.95.
 * Period-authentic 19th-century Parisian stone architectural wall with an ornate
 * wrought-iron carriage gate, limestone plinth, pilaster piers, and an antique gas lantern.
 * Prevents characters from entering the corridor and eliminates any view of unfinished voids.
 */
export const CorridorClosureGate: React.FC = () => {
  const [wallDiffuse, wallNormal, stoneDiffuse, stoneNormal] = useTexture([
    '/textures/paris_wall_diffuse.png',
    '/textures/paris_wall_normal.png',
    '/textures/parisian_stone_diffuse.png',
    '/textures/parisian_stone_normal.png',
  ]);

  const wallMaterial = useMemo(() => {
    const dMap = wallDiffuse.clone();
    dMap.wrapS = THREE.RepeatWrapping;
    dMap.wrapT = THREE.RepeatWrapping;
    dMap.repeat.set(2.0, 2.5);
    dMap.needsUpdate = true;

    const nMap = wallNormal.clone();
    nMap.wrapS = THREE.RepeatWrapping;
    nMap.wrapT = THREE.RepeatWrapping;
    nMap.repeat.set(2.0, 2.5);
    nMap.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: dMap,
      normalMap: nMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughness: 0.85,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
  }, [wallDiffuse, wallNormal]);

  const plinthMaterial = useMemo(() => {
    const dMap = stoneDiffuse.clone();
    dMap.wrapS = THREE.RepeatWrapping;
    dMap.wrapT = THREE.RepeatWrapping;
    dMap.repeat.set(3.0, 1.0);
    dMap.needsUpdate = true;

    const nMap = stoneNormal.clone();
    nMap.wrapS = THREE.RepeatWrapping;
    nMap.wrapT = THREE.RepeatWrapping;
    nMap.repeat.set(3.0, 1.0);
    nMap.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: dMap,
      normalMap: nMap,
      normalScale: new THREE.Vector2(1.0, 1.0),
      color: '#dbe0e6',
      roughness: 0.85,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });
  }, [stoneDiffuse, stoneNormal]);

  const pilasterMaterial = useMemo(() => {
    const dMap = stoneDiffuse.clone();
    dMap.wrapS = THREE.RepeatWrapping;
    dMap.wrapT = THREE.RepeatWrapping;
    dMap.repeat.set(1.0, 3.5);
    dMap.needsUpdate = true;

    const nMap = stoneNormal.clone();
    nMap.wrapS = THREE.RepeatWrapping;
    nMap.wrapT = THREE.RepeatWrapping;
    nMap.repeat.set(1.0, 3.5);
    nMap.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      map: dMap,
      normalMap: nMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      color: '#d4d9df',
      roughness: 0.82,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
  }, [stoneDiffuse, stoneNormal]);

  return (
    <group position={[7.90, 0, 21.95]} rotation={[0, -Math.PI / 2, 0]}>
      {/* 1. Solid continuous architectural stone backing wall (4.2m wide, 9.2m high, 0.6m thick) */}
      {/* Embeds 0.55m into bat10 and bat9, 100% guarantees no voids or light leaks */}
      <mesh position={[0, 4.6, -0.1]} material={wallMaterial}>
        <boxGeometry args={[4.2, 9.2, 0.6]} />
      </mesh>

      {/* 2. Lower ashlar limestone plinth base */}
      <mesh position={[0, 0.6, 0.05]} material={plinthMaterial}>
        <boxGeometry args={[4.2, 1.2, 0.9]} />
      </mesh>

      {/* 3. Left stone pier (embeds into bat10 corner at local X = -1.65) */}
      <mesh position={[-1.65, 4.6, 0.05]} material={pilasterMaterial}>
        <boxGeometry args={[0.9, 9.2, 0.9]} />
      </mesh>

      {/* 4. Right stone pier (embeds into bat9 corner at local X = +1.65) */}
      <mesh position={[1.65, 4.6, 0.05]} material={pilasterMaterial}>
        <boxGeometry args={[0.9, 9.2, 0.9]} />
      </mesh>

      {/* 5. Overhead arch header beam across the 2.4m gate opening */}
      <mesh position={[0, 7.4, 0.05]} material={pilasterMaterial}>
        <boxGeometry args={[2.8, 0.9, 0.85]} />
      </mesh>
      {/* Keystone */}
      <mesh position={[0, 7.4, 0.5]} material={pilasterMaterial}>
        <boxGeometry args={[0.45, 1.1, 0.2]} />
      </mesh>

      {/* 6. Classical molded cornice coping */}
      <mesh position={[0, 9.0, 0.05]} material={pilasterMaterial}>
        <boxGeometry args={[4.3, 0.35, 1.0]} />
      </mesh>

      {/* 7. Antique Parisian Gas Street Lantern on central beam */}
      <mesh position={[0, 5.8, 0.4]}>
        <boxGeometry args={[0.26, 0.38, 0.26]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fed7aa" emissiveIntensity={2.5} />
      </mesh>

      {/* 8. Wrought-Iron Security Gate in the central opening (local X from -1.2 to +1.2) */}
      <group position={[0, 0, 0.15]}>
        {/* Base stone curb */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[2.4, 0.5, 0.35]} />
          <meshStandardMaterial color="#1e232b" roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* Horizontal iron rails */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[2.35, 0.07, 0.07]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 3.8, 0]}>
          <boxGeometry args={[2.35, 0.07, 0.07]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 6.4, 0]}>
          <boxGeometry args={[2.35, 0.07, 0.07]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Vertical iron spindles with spearheads */}
        {[-0.95, -0.65, -0.35, -0.05, 0.25, 0.55, 0.85].map((x, i) => (
          <group key={`corridor-gate-bar-${i}`} position={[x, 0, 0]}>
            <mesh position={[0, 3.75, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 5.3, 6]} />
              <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.2} />
            </mesh>
            <mesh position={[0, 6.55, 0]}>
              <coneGeometry args={[0.07, 0.25, 6]} />
              <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
            </mesh>
          </group>
        ))}
        {/* Central ornate iron rosette medallion */}
        <mesh position={[0, 3.8, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.88} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
};

export const CourtyardBackWall = CorridorClosureGate;

useTexture.preload('/textures/paris_wall_diffuse.png');
useTexture.preload('/textures/paris_wall_normal.png');
useTexture.preload('/textures/parisian_brick_diffuse.png');
useTexture.preload('/textures/parisian_brick_normal.png');
useTexture.preload('/textures/parisian_stone_diffuse.png');
useTexture.preload('/textures/parisian_stone_normal.png');



