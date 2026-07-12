import type {
  ParkingSpot,
  SpotStatus,
  VehicleType,
  OccupancyPoint,
  HourlyCount,
  DurationPoint,
  HeatmapCell,
  AlertItem,
} from '../utils/types';

const VEHICLE_TYPES: VehicleType[] = ['sedan', 'suv', 'ev', 'truck', 'motorcycle'];

export function randomVehicleType(): VehicleType {
  return VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
}

// Layout: 2 floors x (rows x cols) grid of spots with driving lanes between row-pairs.
const ROWS = 6;
const COLS = 10;
const FLOORS = 2;
const SPOT_SPACING_X = 2.6;
const SPOT_SPACING_Z = 5.2;

function statusForIndex(i: number, total: number): { status: SpotStatus; type: ParkingSpot['type'] } {
  // Deterministic-ish distribution: ~10% EV, ~6% accessible, rest split occupied/reserved/available
  const pos = i / total;
  if (pos < 0.08) return { status: 'ev', type: 'ev' };
  if (pos < 0.14) return { status: 'accessible', type: 'accessible' };
  const roll = Math.random();
  if (roll < 0.52) return { status: 'occupied', type: 'standard' };
  if (roll < 0.66) return { status: 'reserved', type: 'standard' };
  return { status: 'available', type: 'standard' };
}

export function generateSpots(): ParkingSpot[] {
  const spots: ParkingSpot[] = [];
  let idx = 0;
  const total = FLOORS * ROWS * COLS;

  for (let floor = 0; floor < FLOORS; floor++) {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const { status, type } = statusForIndex(idx, total);
        const spot: ParkingSpot = {
          id: `F${floor + 1}-${String.fromCharCode(65 + row)}${col + 1}`,
          floor: floor + 1,
          row,
          col,
          x: (col - COLS / 2) * SPOT_SPACING_X,
          z: (row - ROWS / 2) * SPOT_SPACING_Z,
          status,
          type,
        };
        if (status === 'occupied') {
          spot.vehicleId = `VEH-${idx}`;
          spot.vehicleType = randomVehicleType();
          spot.parkedAt = Date.now() - Math.floor(Math.random() * 4 * 60 * 60 * 1000);
        }
        if (status === 'reserved') {
          spot.reservationExpiresAt = Date.now() + Math.floor(Math.random() * 60 * 60 * 1000);
        }
        if (status === 'ev') {
          spot.evChargerAvailable = Math.random() > 0.4;
        }
        spots.push(spot);
        idx++;
      }
    }
  }
  return spots;
}

export function generateOccupancyTrend(): OccupancyPoint[] {
  const points: OccupancyPoint[] = [];
  for (let h = 0; h < 24; h++) {
    const base = 30 + 45 * Math.sin(((h - 6) / 24) * Math.PI * 2) ** 2;
    points.push({
      time: `${h.toString().padStart(2, '0')}:00`,
      occupancy: Math.max(10, Math.min(98, Math.round(base + (Math.random() * 10 - 5)))),
    });
  }
  return points;
}

export function generateHourlyVehicleCount(): HourlyCount[] {
  const points: HourlyCount[] = [];
  for (let h = 0; h < 24; h++) {
    const peak = Math.exp(-((h - 9) ** 2) / 8) * 60 + Math.exp(-((h - 18) ** 2) / 10) * 70;
    points.push({
      hour: `${h.toString().padStart(2, '0')}:00`,
      vehicles: Math.round(peak + Math.random() * 8),
    });
  }
  return points;
}

export function generateDurationTrend(): DurationPoint[] {
  const points: DurationPoint[] = [];
  for (let h = 0; h < 24; h += 2) {
    points.push({
      time: `${h.toString().padStart(2, '0')}:00`,
      minutes: Math.round(40 + Math.random() * 90),
    });
  }
  return points;
}

export function generateHeatmap(): HeatmapCell[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const cells: HeatmapCell[] = [];
  days.forEach((day) => {
    for (let hour = 0; hour < 24; hour++) {
      const weekend = day === 'Sat' || day === 'Sun';
      const peak = Math.exp(-((hour - (weekend ? 14 : 9)) ** 2) / 10) * 80 +
        Math.exp(-((hour - 18) ** 2) / 12) * (weekend ? 40 : 70);
      cells.push({ day, hour, value: Math.round(Math.max(2, Math.min(100, peak + Math.random() * 10))) });
    }
  });
  return cells;
}

const ALERT_TEMPLATES: { type: AlertItem['type']; severity: AlertItem['severity']; message: string }[] = [
  { type: 'Parking Full', severity: 'critical', message: 'Floor 2 has reached full capacity.' },
  { type: 'EV Charger Available', severity: 'info', message: 'EV charging bay F1-A3 is now free.' },
  { type: 'Reservation Expiring', severity: 'warning', message: 'Reservation for spot F1-C6 expires in 10 minutes.' },
  { type: 'Unauthorized Parking', severity: 'critical', message: 'Vehicle detected in accessible spot without permit.' },
  { type: 'Gate Maintenance', severity: 'warning', message: 'Exit gate B scheduled for maintenance at 22:00.' },
];

export function generateAlert(): AlertItem {
  const template = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
  return {
    id: `AL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...template,
    timestamp: Date.now(),
    read: false,
  };
}

export function generateInitialAlerts(count = 5): AlertItem[] {
  return Array.from({ length: count }, (_, i) => ({
    ...generateAlert(),
    timestamp: Date.now() - i * 1000 * 60 * (5 + Math.random() * 40),
  }));
}
