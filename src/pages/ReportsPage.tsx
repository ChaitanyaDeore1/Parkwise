import { motion } from 'framer-motion';
import { useParkingStore } from '../store/useParkingStore';

export function ReportsPage() {
  const kpis = useParkingStore((s) => s.kpis);

  const reports = [
    {
      label: 'Daily Report',
      period: 'Today',
      occupancyRate: kpis.occupancyPercent,
      avgTime: '58 min',
      vehicleCount: kpis.vehiclesToday,
      peakUsage: '18:00 – 19:30',
    },
    {
      label: 'Weekly Report',
      period: 'Last 7 days',
      occupancyRate: Math.min(96, kpis.occupancyPercent + 6),
      avgTime: '64 min',
      vehicleCount: kpis.vehiclesToday * 7,
      peakUsage: 'Fri 18:00 – 20:00',
    },
    {
      label: 'Monthly Report',
      period: 'Last 30 days',
      occupancyRate: Math.min(94, kpis.occupancyPercent + 3),
      avgTime: '61 min',
      vehicleCount: kpis.vehiclesToday * 29,
      peakUsage: 'Weekends 14:00 – 20:00',
    },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {reports.map((r, i) => (
        <motion.div
          key={r.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="rounded-xl border p-5"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
        >
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{r.label}</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>{r.period}</p>

          <div className="space-y-3">
            <ReportRow label="Occupancy Rate" value={`${r.occupancyRate}%`} />
            <ReportRow label="Average Parking Time" value={r.avgTime} />
            <ReportRow label="Vehicle Count" value={r.vehicleCount.toLocaleString('en-IN')} />
            <ReportRow label="Peak Usage" value={r.peakUsage} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs pb-2 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}
