import { useRef, useMemo } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

export interface SimVehicle {
  id: string;
  parkingId: string;
  color: string;
  path: THREE.Vector3[];
  segment: number;
  t: number;
  speed: number;
}

interface Props {
  vehicles: SimVehicle[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

const CAR_COLORS = ['#e2e8f0', '#94a3b8', '#3b82f6', '#0f172a', '#facc15', '#dc2626'];

export function carColor(seed: number) {
  return CAR_COLORS[seed % CAR_COLORS.length];
}

function CarMesh({ vehicle, isSelected, onClick }: { vehicle: SimVehicle; isSelected: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const { path, segment, t } = vehicle;
    if (segment >= path.length - 1) return;
    const a = path[segment];
    const b = path[segment + 1];
    g.position.lerpVectors(a, b, t);
    const dir = new THREE.Vector3().subVectors(b, a);
    if (dir.length() > 0.001) {
      const angle = Math.atan2(dir.x, dir.z);
      g.rotation.y = angle;
    }
  });

  return (
    <group ref={groupRef} onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); }}>
      <mesh castShadow position={[0, 0.32, 0]}>
        <boxGeometry args={[0.95, 0.42, 1.9]} />
        <meshStandardMaterial color={vehicle.color} metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[0, 0.62, -0.1]}>
        <boxGeometry args={[0.8, 0.28, 0.9]} />
        <meshStandardMaterial color={vehicle.color} metalness={0.3} roughness={0.4} transparent opacity={0.9} />
      </mesh>
      {isSelected && (
        <mesh position={[0, 1.1, 0]}>
          <coneGeometry args={[0.18, 0.3, 4]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      )}
      {[[-0.42, 0.16, 0.9], [0.42, 0.16, 0.9]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export function MovingVehicles({ vehicles, onSelect, selectedId }: Props) {
  const items = useMemo(() => vehicles, [vehicles]);
  return (
    <group>
      {items.map((v) => (
        <CarMesh key={v.id} vehicle={v} isSelected={selectedId === v.id} onClick={() => onSelect(v.id)} />
      ))}
    </group>
  );
}
