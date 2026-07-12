import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Navbar } from './components/Navbar/Navbar';
import { LoadingScreen } from './components/common/LoadingScreen';
import { DashboardPage } from './pages/DashboardPage';
import { ParkingLotsPage } from './pages/ParkingLotsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { ReportsPage } from './pages/ReportsPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useParkingStore } from './store/useParkingStore';

const PAGES: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  lots: ParkingLotsPage,
  analytics: AnalyticsPage,
  vehicles: VehiclesPage,
  reports: ReportsPage,
  alerts: AlertsPage,
  settings: SettingsPage,
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const theme = useParkingStore((s) => s.theme);
  const activePage = useParkingStore((s) => s.activePage);
  const tickSimulation = useParkingStore((s) => s.tickSimulation);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => tickSimulation(), 4000);
    return () => clearInterval(interval);
  }, [tickSimulation]);

  const PageComponent = PAGES[activePage] ?? DashboardPage;

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

      <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1500px] mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <PageComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
