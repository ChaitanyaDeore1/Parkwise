import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { ParkingSpot, Vehicle } from '../utils/types';
import { randomVehicleType } from '../mock-data/generate';
import { carColor, type SimVehicle } from '../components/ParkingLot3D/MovingVehicles';

const ENTRY = new THREE.Vector3(-8, 0.02, 15);
const LANE_Z = 8;

function buildPath(target: ParkingSpot, reverse: boolean): THREE.Vector3[] {
  const targetVec = new THREE.Vector3(target.x, 0.02, target.z);
  const laneEntry = new THREE.Vector3(-8, 0.02, LANE_Z);
  const laneAtCol = new THREE.Vector3(target.x, 0.02, LANE_Z);
  const path = [ENTRY, laneEntry, laneAtCol, targetVec];
  return reverse ? [...path].reverse() : path;
}

export interface VehicleMeta extends Vehicle {}

let idCounter = 0;

export function useVehicleSimulation(spots: ParkingSpot[]) {
  const [simVehicles, setSimVehicles] = useState<SimVehicle[]>([]);
  const [meta, setMeta] = useState<Record<string, VehicleMeta>>({});
  const simRef = useRef<SimVehicle[]>([]);
  const spotsRef = useRef(spots);
  spotsRef.current = spots;

  // Frame-independent movement ticker
  useEffect(() => {
    let raf: number;
    let last = performance.now();
    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      simRef.current.forEach((v) => {
        if (v.segment >= v.path.length - 1) return;
        const a = v.path[v.segment];
        const b = v.path[v.segment + 1];
        const dist = a.distanceTo(b) || 1;
        v.t += (v.speed * dt) / dist;
        if (v.t >= 1) {
          v.t = 0;
          v.segment += 1;
        }
      });
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Spawner: periodically add a new vehicle heading to a random available-ish spot
  useEffect(() => {
    const interval = setInterval(() => {
      const available = spotsRef.current.filter((s) => s.status === 'available');
      if (available.length === 0) return;
      if (simRef.current.length > 6) return;

      const target = available[Math.floor(Math.random() * available.length)];
      const id = `SIMV-${idCounter++}`;
      const path = buildPath(target, false);
      const sim: SimVehicle = {
        id,
        parkingId: target.id,
        color: carColor(idCounter),
        path,
        segment: 0,
        t: 0,
        speed: 3.2 + Math.random() * 1.2,
      };
      simRef.current = [...simRef.current, sim];
      setSimVehicles(simRef.current);

      const entryTime = Date.now();
      const estimatedExitTime = entryTime + (20 + Math.random() * 60) * 60 * 1000;
      setMeta((m) => ({
        ...m,
        [id]: {
          id,
          type: randomVehicleType(),
          entryTime,
          destinationSpotId: target.id,
          estimatedExitTime,
          speed: Math.round(sim.speed * 8),
          path: [],
          pathIndex: 0,
          progress: 0,
          state: 'entering',
          position: [ENTRY.x, ENTRY.z],
        },
      }));

      // Despawn after it "arrives" (approx travel time) + parked duration
      const travelTime = path.reduce((sum, p, i) => (i === 0 ? 0 : sum + p.distanceTo(path[i - 1]) / sim.speed), 0);
      const parkedDuration = 8000 + Math.random() * 12000;
      setTimeout(() => {
        simRef.current = simRef.current.filter((x) => x.id !== id);
        setSimVehicles(simRef.current);
        setMeta((m) => {
          const next = { ...m };
          delete next[id];
          return next;
        });
      }, travelTime * 1000 + parkedDuration);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return { simVehicles, meta };
}
