import { motion, type Variants } from 'framer-motion';
import {
  ParkingSquare,
  CircleCheck,
  CircleParking,
  BookmarkCheck,
  Zap,
  Accessibility,
  Gauge,
  Car,
} from 'lucide-react';
import { useParkingStore } from '../../store/useParkingStore';
import { AnimatedNumber } from './AnimatedNumber';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export function KPIGrid() {
  const kpis = useParkingStore((s) => s.kpis);

  const cards = [
    { label: 'Total Spaces', value: kpis.totalSpaces, icon: ParkingSquare, accent: 'var(--accent-blue)' },
    { label: 'Available', value: kpis.available, icon: CircleCheck, accent: 'var(--accent-green)' },
    { label: 'Occupied', value: kpis.occupied, icon: CircleParking, accent: 'var(--accent-red)' },
    { label: 'Reserved', value: kpis.reserved, icon: BookmarkCheck, accent: 'var(--accent-yellow)' },
    { label: 'EV Charging', value: kpis.evSpaces, icon: Zap, accent: 'var(--accent-cyan)' },
    { label: 'Accessible', value: kpis.accessibleSpaces, icon: Accessibility, accent: 'var(--accent-purple)' },
    { label: 'Occupancy', value: kpis.occupancyPercent, suffix: '%', icon: Gauge, accent: 'var(--accent-blue)' },
    { label: 'Vehicles Today', value: kpis.vehiclesToday, icon: Car, accent: 'var(--accent-blue)' },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3"
    >
      {cards.map((c) => (
        <motion.div
          key={c.label}
          variants={item}
          whileHover={{ y: -2 }}
          className="rounded-xl border p-4 relative overflow-hidden"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {c.label}
            </span>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `color-mix(in srgb, ${c.accent} 15%, transparent)` }}
            >
              <c.icon size={14} style={{ color: c.accent }} />
            </div>
          </div>
          <div className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            <AnimatedNumber value={c.value} suffix={c.suffix} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}