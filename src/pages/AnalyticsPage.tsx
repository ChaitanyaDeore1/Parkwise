import {
  OccupancyTrendChart,
  HourlyVehicleChart,
  ParkingDistributionChart,
  DurationTrendChart,
  PeakHoursHeatmap,
} from '../components/Charts/AnalyticsCharts';

export function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-4">
        <OccupancyTrendChart />
        <HourlyVehicleChart />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <ParkingDistributionChart />
        <DurationTrendChart />
      </div>
      <PeakHoursHeatmap />
    </div>
  );
}
