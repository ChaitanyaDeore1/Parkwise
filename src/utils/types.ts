export type SpotStatus = 'available' | 'occupied' | 'reserved' | 'ev' | 'accessible';

export type VehicleType = 'sedan' | 'suv' | 'ev' | 'truck' | 'motorcycle';

export interface ParkingSpot {
  id: string;
  floor: number;
  row: number;
  col: number;
  x: number;
  z: number;
  status: SpotStatus;
  type: Exclude<SpotStatus, 'occupied' | 'available'> | 'standard';
  vehicleId?: string;
  vehicleType?: VehicleType;
  reservationExpiresAt?: number;
  parkedAt?: number;
  evChargerAvailable?: boolean;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  entryTime: number;
  destinationSpotId: string;
  estimatedExitTime: number;
  speed: number;
  path: [number, number][];
  pathIndex: number;
  progress: number;
  state: 'entering' | 'parked' | 'exiting' | 'gone';
  position: [number, number];
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertType =
  | 'Parking Full'
  | 'EV Charger Available'
  | 'Reservation Expiring'
  | 'Unauthorized Parking'
  | 'Gate Maintenance';

export interface AlertItem {
  id: string;
  type: AlertType;
  message: string;
  severity: AlertSeverity;
  timestamp: number;
  read: boolean;
}

export interface OccupancyPoint {
  time: string;
  occupancy: number;
}

export interface HourlyCount {
  hour: string;
  vehicles: number;
}

export interface DurationPoint {
  time: string;
  minutes: number;
}

export interface HeatmapCell {
  day: string;
  hour: number;
  value: number;
}

export interface KPIData {
  totalSpaces: number;
  available: number;
  occupied: number;
  reserved: number;
  evSpaces: number;
  accessibleSpaces: number;
  occupancyPercent: number;
  vehiclesToday: number;
}

export type FilterKey = 'all' | SpotStatus;

export interface Filters {
  floor: number | 'all';
  status: FilterKey;
}

export type ThemeMode = 'dark' | 'light';

export type PageKey =
  | 'dashboard'
  | 'lots'
  | 'analytics'
  | 'vehicles'
  | 'reports'
  | 'alerts'
  | 'settings';
