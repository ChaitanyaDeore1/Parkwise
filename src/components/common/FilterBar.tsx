import { useParkingStore } from '../../store/useParkingStore';
import type { FilterKey } from '../../utils/types';

const STATUS_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'occupied', label: 'Occupied' },
  { key: 'reserved', label: 'Reserved' },
  { key: 'ev', label: 'EV Charging' },
  { key: 'accessible', label: 'Accessible' },
];

export function FilterBar() {
  const filters = useParkingStore((s) => s.filters);
  const setFilters = useParkingStore((s) => s.setFilters);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 p-1 rounded-lg border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}>
        {[1, 2].map((floor) => (
          <button
            key={floor}
            onClick={() => setFilters({ floor })}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              color: filters.floor === floor ? 'var(--text-primary)' : 'var(--text-tertiary)',
              background: filters.floor === floor ? 'var(--bg-hover)' : 'transparent',
            }}
          >
            Floor {floor}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilters({ status: opt.key })}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              color: filters.status === opt.key ? 'var(--text-primary)' : 'var(--text-tertiary)',
              background: filters.status === opt.key ? 'var(--bg-hover)' : 'transparent',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
