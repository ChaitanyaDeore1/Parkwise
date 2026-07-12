import { KPIGrid } from '../components/KPI/KPIGrid';
import { OccupancyTrendChart, HourlyVehicleChart } from '../components/Charts/AnalyticsCharts';
import { RecentActivity } from '../components/common/RecentActivity';
import { AlertsPanel } from '../components/Alerts/AlertsPanel';

export function DashboardPage() {
  return (
    <div className="space-y-5">
      <KPIGrid />

      <div className="grid lg:grid-cols-2 gap-4">
        <OccupancyTrendChart />
        <HourlyVehicleChart />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <RecentActivity />
        <AlertsPanel compact />
      </div>
    </div>
  );
}
