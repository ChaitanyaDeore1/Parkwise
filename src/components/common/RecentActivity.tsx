import { useMemo } from 'react';
import { Car } from 'lucide-react';
import { useParkingStore } from '../../store/useParkingStore';
import { formatDistanceToNow, formatTime } from '../../utils/format';

export function RecentActivity() {
  const spots = useParkingStore((s) => s.spots);

  const recent = useMemo(() => {
    return spots
      .filter((s) => s.status === 'occupied' && s.parkedAt)
      .sort((a, b) => (b.parkedAt ?? 0) - (a.parkedAt ?? 0))
      .slice(0, 8);
  }, [spots]);

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Recent Activity
      </h3>
      <div className="space-y-1">
        {recent.map((s) => (
          <div key={s.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'color-mix(in srgb, var(--accent-green) 15%, transparent)' }}>
              <Car size={13} style={{ color: 'var(--accent-green)' }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                Parking ID {s.id} — parked at {s.parkedAt ? formatTime(s.parkedAt) : ''}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                {s.parkedAt ? formatDistanceToNow(s.parkedAt) : ''}
              </p>
            </div>
          </div>
        ))}
        {recent.length === 0 && (
          <p className="text-xs py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
}
