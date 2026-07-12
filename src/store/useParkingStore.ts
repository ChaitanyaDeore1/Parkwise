import { create } from 'zustand';
import type {
  ParkingSpot,
  Vehicle,
  AlertItem,
  KPIData,
  Filters,
  ThemeMode,
  PageKey,
  OccupancyPoint,
  HourlyCount,
  DurationPoint,
  HeatmapCell,
} from '../utils/types';
import {
  generateSpots,
  generateOccupancyTrend,
  generateHourlyVehicleCount,
  generateDurationTrend,
  generateHeatmap,
  generateInitialAlerts,
  generateAlert,
  randomVehicleType,
} from '../mock-data/generate';

const THEME_KEY = 'parkwise-theme';

function computeKPIs(spots: ParkingSpot[], vehiclesToday: number): KPIData {
  const totalSpaces = spots.length;
  const available = spots.filter((s) => s.status === 'available').length;
  const occupied = spots.filter((s) => s.status === 'occupied').length;
  const reserved = spots.filter((s) => s.status === 'reserved').length;
  const evSpaces = spots.filter((s) => s.status === 'ev').length;
  const accessibleSpaces = spots.filter((s) => s.status === 'accessible').length;
  const occupancyPercent = Math.round(((occupied + reserved) / totalSpaces) * 100);
  return {
    totalSpaces,
    available,
    occupied,
    reserved,
    evSpaces,
    accessibleSpaces,
    occupancyPercent,
    vehiclesToday,
  };
}

interface ParkingState {
  spots: ParkingSpot[];
  vehicles: Vehicle[];
  alerts: AlertItem[];
  kpis: KPIData;
  occupancyTrend: OccupancyPoint[];
  hourlyVehicleCount: HourlyCount[];
  durationTrend: DurationPoint[];
  heatmap: HeatmapCell[];
  filters: Filters;
  searchQuery: string;
  selectedSpotId: string | null;
  selectedVehicleId: string | null;
  theme: ThemeMode;
  activePage: PageKey;
  sidebarCollapsed: boolean;
  vehiclesToday: number;
  isLoaded: boolean;

  setActivePage: (page: PageKey) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  setFilters: (filters: Partial<Filters>) => void;
  setSearchQuery: (q: string) => void;
  selectSpot: (id: string | null) => void;
  selectVehicle: (id: string | null) => void;
  markAlertRead: (id: string) => void;
  dismissAlert: (id: string) => void;
  tickSimulation: () => void;
  setLoaded: () => void;
}

function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

const initialSpots = generateSpots();
const initialOccupied = initialSpots.filter((s) => s.status === 'occupied').length;

export const useParkingStore = create<ParkingState>((set, get) => ({
  spots: initialSpots,
  vehicles: [],
  alerts: generateInitialAlerts(6),
  kpis: computeKPIs(initialSpots, initialOccupied + 12),
  occupancyTrend: generateOccupancyTrend(),
  hourlyVehicleCount: generateHourlyVehicleCount(),
  durationTrend: generateDurationTrend(),
  heatmap: generateHeatmap(),
  filters: { floor: 'all', status: 'all' },
  searchQuery: '',
  selectedSpotId: null,
  selectedVehicleId: null,
  theme: readStoredTheme(),
  activePage: 'dashboard',
  sidebarCollapsed: false,
  vehiclesToday: initialOccupied + 12,
  isLoaded: false,

  setActivePage: (page) => set({ activePage: page }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleTheme: () =>
    set((s) => {
      const next: ThemeMode = s.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, next);
      return { theme: next };
    }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  selectSpot: (id) => set({ selectedSpotId: id, selectedVehicleId: null }),
  selectVehicle: (id) => set({ selectedVehicleId: id, selectedSpotId: null }),
  markAlertRead: (id) =>
    set((s) => ({ alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)) })),
  dismissAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
  setLoaded: () => set({ isLoaded: true }),

  tickSimulation: () => {
    const state = get();
    let spots = state.spots;
    let vehiclesToday = state.vehiclesToday;
    let alerts = state.alerts;

    // Randomly free up an occupied spot (car leaves)
    const occupiedSpots = spots.filter((s) => s.status === 'occupied');
    if (occupiedSpots.length > 0 && Math.random() < 0.35) {
      const leaving = occupiedSpots[Math.floor(Math.random() * occupiedSpots.length)];
      spots = spots.map((s) =>
        s.id === leaving.id
          ? { ...s, status: 'available', vehicleId: undefined, vehicleType: undefined, parkedAt: undefined }
          : s
      );
    }

    // Randomly occupy an available spot (car enters)
    const availableSpots = spots.filter((s) => s.status === 'available');
    if (availableSpots.length > 0 && Math.random() < 0.4) {
      const entering = availableSpots[Math.floor(Math.random() * availableSpots.length)];
      spots = spots.map((s) =>
        s.id === entering.id
          ? {
              ...s,
              status: 'occupied',
              vehicleId: `VEH-${Date.now()}`,
              vehicleType: randomVehicleType(),
              parkedAt: Date.now(),
            }
          : s
      );
      vehiclesToday += 1;
    }

    // Occasionally convert a reserved spot into occupied (guest arrives) or back to available (expired)
    const reservedSpots = spots.filter((s) => s.status === 'reserved');
    if (reservedSpots.length > 0 && Math.random() < 0.15) {
      const target = reservedSpots[Math.floor(Math.random() * reservedSpots.length)];
      spots = spots.map((s) =>
        s.id === target.id
          ? {
              ...s,
              status: 'occupied',
              vehicleId: `VEH-${Date.now()}`,
              vehicleType: randomVehicleType(),
              parkedAt: Date.now(),
              reservationExpiresAt: undefined,
            }
          : s
      );
    }

    // Occasionally spawn an alert
    if (Math.random() < 0.25) {
      alerts = [generateAlert(), ...alerts].slice(0, 30);
    }

    const kpis = computeKPIs(spots, vehiclesToday);

    set({ spots, vehiclesToday, alerts, kpis });
  },
}));
