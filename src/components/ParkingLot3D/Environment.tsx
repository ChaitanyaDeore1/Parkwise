import { Text } from '@react-three/drei';

const LOT_WIDTH = 30;
const LOT_DEPTH = 34;

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 1.2, 6]} />
        <meshStandardMaterial color="#5a4632" />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <icosahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial color="#1f7a4d" roughness={0.8} />
      </mesh>
    </group>
  );
}

function StreetLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 3.2, 8]} />
        <meshStandardMaterial color="#2a3140" />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 3.2, 0]} intensity={8} distance={8} color="#fde68a" />
    </group>
  );
}

function Gate({ position, label, color }: { position: [number, number, number]; label: string; color: string }) {
  return (
    <group position={position}>
      <mesh position={[-1.4, 0.9, 0]} castShadow>
        <boxGeometry args={[0.15, 1.8, 0.15]} />
        <meshStandardMaterial color="#2a3140" />
      </mesh>
      <mesh position={[1.4, 0.9, 0]} castShadow>
        <boxGeometry args={[0.15, 1.8, 0.15]} />
        <meshStandardMaterial color="#2a3140" />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <boxGeometry args={[3, 0.15, 0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      <Text position={[0, 2.15, 0]} fontSize={0.4} color={color} anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

export function LotEnvironment() {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[LOT_WIDTH, LOT_DEPTH]} />
        <meshStandardMaterial color="#171c26" roughness={0.95} />
      </mesh>

      {/* Driving lane markers (subtle stripes down the center) */}
      {[-6.5, 6.5].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, z]}>
          <planeGeometry args={[LOT_WIDTH - 2, 2.4]} />
          <meshStandardMaterial color="#0e1219" roughness={1} />
        </mesh>
      ))}

      {/* Perimeter trees */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Tree key={`t-left-${i}`} position={[-14.5, 0, -15 + i * 6]} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <Tree key={`t-right-${i}`} position={[14.5, 0, -15 + i * 6]} />
      ))}

      {/* Street lights */}
      {[-10, -3, 4, 11].map((x, i) => (
        <StreetLight key={i} position={[x, 0, -16.5]} />
      ))}

      {/* Entry / Exit gates */}
      <Gate position={[-8, 0, 16]} label="ENTRY" color="#22c55e" />
      <Gate position={[8, 0, 16]} label="EXIT" color="#ef4444" />
    </group>
  );
}
