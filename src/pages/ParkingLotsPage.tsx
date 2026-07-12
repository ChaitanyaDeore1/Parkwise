import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParkingStore } from '../store/useParkingStore';
import { FilterBar } from '../components/common/FilterBar';
import { ParkingLot3D } from '../components/ParkingLot3D/ParkingLot3D';
import { formatDuration, formatTime } from '../utils/format';

const STATUS_COLOR: Record<string, string> = {
  available: 'var(--accent-green)',
  occupied: 'var(--accent-red)',
  reserved: 'var(--accent-yellow)',
  ev: 'var(--accent-blue)',
  accessible: 'var(--accent-purple)',
};

export function ParkingLotsPage() {
  const spots = useParkingStore((s) => s.spots);
  const filters = useParkingStore((s) => s.filters);
  const searchQuery = useParkingStore((s) => s.searchQuery);
  const selectSpot = useParkingStore((s) => s.selectSpot);

  const filtered = useMemo(() => {
    return spots
      .filter((s) => (filters.floor === 'all' ? true : s.floor === filters.floor))
      .filter((s) => (filters.status === 'all' ? true : s.status === filters.status))
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.trim().toLowerCase();
        return s.id.toLowerCase().includes(q);
      });
  }, [spots, filters, searchQuery]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Parking Lot Layout
        </h2>
        <FilterBar />
      </div>

      <ParkingLot3D />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
      >
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Spot Directory
          </h3>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {filtered.length} of {spots.length} spots
          </span>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0" style={{ background: 'var(--bg-surface)' }}>
              <tr style={{ color: 'var(--text-tertiary)' }}>
                <th className="text-left font-medium px-4 py-2">Spot</th>
                <th className="text-left font-medium px-4 py-2">Floor</th>
                <th className="text-left font-medium px-4 py-2">Status</th>
                <th className="text-left font-medium px-4 py-2">Parked At</th>
                <th className="text-left font-medium px-4 py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => selectSpot(s.id)}
                  className="border-t cursor-pointer hover:bg-white/5"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <td className="px-4 py-2 font-medium" style={{ color: 'var(--text-primary)' }}>{s.id}</td>
                  <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>Level {s.floor}</td>
                  <td className="px-4 py-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize"
                      style={{ background: `color-mix(in srgb, ${STATUS_COLOR[s.status]} 18%, transparent)`, color: STATUS_COLOR[s.status] }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>{s.parkedAt ? formatTime(s.parkedAt) : '—'}</td>
                  <td className="px-4 py-2" style={{ color: 'var(--text-secondary)' }}>
                    {s.parkedAt ? formatDuration(s.parkedAt) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
