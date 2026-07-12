import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment as DreiEnvironment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { ParkingSpots } from './ParkingSpots';
import { LotEnvironment } from './Environment';
import { MovingVehicles } from './MovingVehicles';
import { useVehicleSimulation } from '../../hooks/useVehicleSimulation';
import { useParkingStore } from '../../store/useParkingStore';
import { SpotDetailsPanel } from '../SpotDetails/SpotDetailsPanel';
import { VehicleDetailsPanel } from '../SpotDetails/VehicleDetailsPanel';

function Loader3D() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

export function ParkingLot3D() {
  const spots = useParkingStore((s) => s.spots);
  const filters = useParkingStore((s) => s.filters);
  const searchQuery = useParkingStore((s) => s.searchQuery);
  const selectedSpotId = useParkingStore((s) => s.selectedSpotId);
  const selectedVehicleId = useParkingStore((s) => s.selectedVehicleId);
  const selectSpot = useParkingStore((s) => s.selectSpot);
  const selectVehicle = useParkingStore((s) => s.selectVehicle);

  const floorSpots = useMemo(
    () => spots.filter((s) => (filters.floor === 'all' ? s.floor === 1 : s.floor === filters.floor)),
    [spots, filters.floor]
  );

  const { simVehicles, meta } = useVehicleSimulation(floorSpots);

  const highlightIds = useMemo(() => {
    const set = new Set<string>();
    if (!searchQuery.trim()) return set;
    const q = searchQuery.trim().toLowerCase();
    floorSpots.forEach((s) => {
      if (s.id.toLowerCase().includes(q)) {
        set.add(s.id);
      }
    });
    return set;
  }, [floorSpots, searchQuery]);

  const filteredSpots = useMemo(() => {
    if (filters.status === 'all') return floorSpots;
    return floorSpots.filter((s) => s.status === filters.status);
  }, [floorSpots, filters.status]);

  return (
    <div className="relative w-full aspect-[16/10] max-h-[620px] min-h-[420px] rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-subtle)' }}>
      <Canvas
        shadows
        camera={{ position: [17, 15, 17], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ toneMappingExposure: 1.15 }}
      >
        <color attach="background" args={['#080b12']} />
        <fog attach="fog" args={['#080b12', 42, 78]} />

        <ambientLight intensity={0.75} />
        <directionalLight
          position={[15, 22, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />
        <hemisphereLight args={['#3b82f6', '#0b0e14', 0.45]} />

        <Suspense fallback={<Loader3D />}>
          <LotEnvironment />
          <ParkingSpots
            spots={filteredSpots}
            onSelect={selectSpot}
            highlightIds={highlightIds}
            selectedId={selectedSpotId}
          />
          <MovingVehicles vehicles={simVehicles} onSelect={selectVehicle} selectedId={selectedVehicleId} />
          <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={40} blur={2} far={10} />
          <DreiEnvironment preset="city" environmentIntensity={0.5} />
        </Suspense>

        <EffectComposer>
          <Bloom intensity={0.3} luminanceThreshold={0.75} luminanceSmoothing={0.3} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={0.5} />
        </EffectComposer>

        <OrbitControls
          enablePan={false}
          minDistance={13}
          maxDistance={38}
          minPolarAngle={0.55}
          maxPolarAngle={1.1}
          target={[0, 0.5, 0]}
        />
      </Canvas>

      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
        {[
          { label: 'Available', color: '#22c55e' },
          { label: 'Occupied', color: '#ef4444' },
          { label: 'Reserved', color: '#eab308' },
          { label: 'EV Charging', color: '#3b82f6' },
          { label: 'Accessible', color: '#a855f7' },
        ].map((l) => (
          <div
            key={l.label}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] glass-panel"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {selectedSpotId && <SpotDetailsPanel spotId={selectedSpotId} onClose={() => selectSpot(null)} />}
      {selectedVehicleId && meta[selectedVehicleId] && (
        <VehicleDetailsPanel vehicle={meta[selectedVehicleId]} onClose={() => selectVehicle(null)} />
      )}
    </div>
  );
}
