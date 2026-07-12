import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useParkingStore } from '../../store/useParkingStore';
import { ChartCard } from './ChartCard';

const GRID_COLOR = 'var(--border-subtle)';
const AXIS_COLOR = 'var(--text-tertiary)';

const tooltipStyle = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--text-primary)',
};

export function OccupancyTrendChart() {
  const data = useParkingStore((s) => s.occupancyTrend);
  return (
    <ChartCard title="Occupancy Trend" subtitle="24-hour occupancy percentage">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" stroke={AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} interval={3} />
          <YAxis stroke={AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} unit="%" />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function HourlyVehicleChart() {
  const data = useParkingStore((s) => s.hourlyVehicleCount);
  return (
    <ChartCard title="Hourly Vehicle Count" subtitle="Vehicles entering per hour">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="hour" stroke={AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} interval={3} />
          <YAxis stroke={AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--bg-hover)' }} />
          <Bar dataKey="vehicles" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const PIE_COLORS: Record<string, string> = {
  available: '#22c55e',
  occupied: '#ef4444',
  reserved: '#eab308',
  ev: '#3b82f6',
  accessible: '#a855f7',
};

export function ParkingDistributionChart() {
  const kpis = useParkingStore((s) => s.kpis);
  const data = [
    { name: 'available', label: 'Available', value: kpis.available },
    { name: 'occupied', label: 'Occupied', value: kpis.occupied },
    { name: 'reserved', label: 'Reserved', value: kpis.reserved },
    { name: 'ev', label: 'EV Charging', value: kpis.evSpaces },
    { name: 'accessible', label: 'Accessible', value: kpis.accessibleSpaces },
  ];
  return (
    <ChartCard title="Parking Distribution" subtitle="Spots by status">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={55} outerRadius={80} paddingAngle={3}>
            {data.map((d) => (
              <Cell key={d.name} fill={PIE_COLORS[d.name]} stroke="var(--bg-surface)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DurationTrendChart() {
  const data = useParkingStore((s) => s.durationTrend);
  return (
    <ChartCard title="Average Parking Duration" subtitle="Minutes per visit, sampled every 2h">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" stroke={AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke={AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} unit="m" />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="minutes" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: '#a855f7' }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PeakHoursHeatmap() {
  const data = useParkingStore((s) => s.heatmap);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  function cellColor(value: number) {
    const alpha = Math.max(0.08, value / 100);
    return `color-mix(in srgb, #3b82f6 ${Math.round(alpha * 100)}%, var(--bg-elevated))`;
  }

  return (
    <ChartCard title="Peak Hours" subtitle="Occupancy intensity by day and hour" className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="flex gap-[3px] mb-1 pl-9">
          {hours.map((h) => (
            <div key={h} className="w-[22px] text-[9px] text-center" style={{ color: 'var(--text-tertiary)' }}>
              {h % 3 === 0 ? h : ''}
            </div>
          ))}
        </div>
        {days.map((day) => (
          <div key={day} className="flex items-center gap-[3px] mb-[3px]">
            <span className="w-6 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{day}</span>
            {hours.map((h) => {
              const cell = data.find((c) => c.day === day && c.hour === h);
              return (
                <div
                  key={h}
                  title={`${day} ${h}:00 — ${cell?.value ?? 0}%`}
                  className="w-[22px] h-[14px] rounded-sm"
                  style={{ background: cellColor(cell?.value ?? 0) }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
