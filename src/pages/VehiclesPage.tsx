import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import { useParkingStore } from '../store/useParkingStore';
import { formatDuration, formatTime } from '../utils/format';

export function VehiclesPage() {
  const spots = useParkingStore((s) => s.spots);
  const searchQuery = useParkingStore((s) => s.searchQuery);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const vehicles = useMemo(() => {
    return spots
      .filter((s) => s.status === 'occupied')
      .filter((s) => (typeFilter === 'all' ? true : s.vehicleType === typeFilter))
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.trim().toLowerCase();
        return s.id.toLowerCase().includes(q);
      })
      .sort((a, b) => (b.parkedAt ?? 0) - (a.parkedAt ?? 0));
  }, [spots, typeFilter, searchQuery]);

  const types = ['all', 'sedan', 'suv', 'ev', 'truck', 'motorcycle'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg border w-fit" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors"
            style={{
              color: typeFilter === t ? 'var(--text-primary)' : 'var(--text-tertiary)',
              background: typeFilter === t ? 'var(--bg-hover)' : 'transparent',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3"
      >
        {vehicles.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border p-4"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--accent-blue) 15%, transparent)' }}>
                <Car size={15} style={{ color: 'var(--accent-blue)' }} />
              </div>
              <span className="text-[10px] uppercase font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                {s.vehicleType}
              </span>
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Parking ID: {s.id}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Level {s.floor}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {s.parkedAt ? `Parked at ${formatTime(s.parkedAt)} · ${formatDuration(s.parkedAt)} ago` : ''}
            </p>
          </div>
        ))}
        {vehicles.length === 0 && (
          <p className="col-span-full text-center text-xs py-10" style={{ color: 'var(--text-tertiary)' }}>
            No vehicles match this filter.
          </p>
        )}
      </motion.div>
    </div>
  );
}
