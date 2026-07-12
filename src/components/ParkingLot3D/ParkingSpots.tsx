import { useRef, useMemo, useLayoutEffect } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { ParkingSpot } from '../../utils/types';

const STATUS_COLOR: Record<string, string> = {
  available: '#22c55e',
  occupied: '#ef4444',
  reserved: '#eab308',
  ev: '#3b82f6',
  accessible: '#a855f7',
};

interface Props {
  spots: ParkingSpot[];
  onSelect: (id: string) => void;
  highlightIds: Set<string>;
  selectedId: string | null;
}

const SPOT_W = 2.1;
const SPOT_D = 4.6;

export function ParkingSpots({ spots, onSelect, highlightIds, selectedId }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const outlineRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    const outline = outlineRef.current;
    if (!mesh || !outline) return;

    spots.forEach((spot, i) => {
      dummy.position.set(spot.x, 0.02, spot.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      const isHighlighted = highlightIds.has(spot.id) || selectedId === spot.id;
      dummy.scale.set(isHighlighted ? 1.08 : 1, 1, isHighlighted ? 1.08 : 1);
      dummy.updateMatrix();
      outline.setMatrixAt(i, dummy.matrix);

      const color = new THREE.Color(STATUS_COLOR[spot.status] ?? '#3b82f6');
      mesh.setColorAt(i, color);
      outline.setColorAt(
        i,
        isHighlighted ? new THREE.Color('#ffffff') : new THREE.Color(STATUS_COLOR[spot.status] ?? '#3b82f6')
      );
    });
    mesh.instanceMatrix.needsUpdate = true;
    outline.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    if (outline.instanceColor) outline.instanceColor.needsUpdate = true;
  }, [spots, dummy, highlightIds, selectedId]);

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    const id = e.instanceId;
    if (id === undefined) return;
    onSelect(spots[id].id);
  }

  return (
    <group>
      <instancedMesh
        ref={outlineRef}
        args={[undefined, undefined, spots.length]}
        position={[0, -0.01, 0]}
      >
        <boxGeometry args={[SPOT_W + 0.14, 0.02, SPOT_D + 0.14]} />
        <meshStandardMaterial transparent opacity={0.35} />
      </instancedMesh>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, spots.length]}
        onClick={handleClick}
        receiveShadow
      >
        <boxGeometry args={[SPOT_W, 0.04, SPOT_D]} />
        <meshStandardMaterial roughness={0.7} metalness={0.05} />
      </instancedMesh>
    </group>
  );
}
