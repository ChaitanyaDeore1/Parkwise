import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Warehouse,
  BarChart3,
  Car,
  FileText,
  Bell,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from 'lucide-react';
import { useParkingStore } from '../../store/useParkingStore';
import type { PageKey } from '../../utils/types';

const NAV_ITEMS: { key: PageKey; label: string; icon: LucideIcon }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'lots', label: 'Parking Lots', icon: Warehouse },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'vehicles', label: 'Vehicles', icon: Car },
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'alerts', label: 'Alerts', icon: Bell },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { activePage, setActivePage, sidebarCollapsed, toggleSidebar, alerts } = useParkingStore();
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 76 : 236 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="h-screen shrink-0 flex flex-col border-r"
      style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
    >
      <div className="flex items-center gap-2.5 px-5 h-16 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
          <Warehouse size={16} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="font-semibold text-[15px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
            ParkWise
          </span>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group"
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-hover)' : 'transparent',
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-blue-500"
                />
              )}
              <Icon size={17} className="shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              {!sidebarCollapsed && item.key === 'alerts' && unreadAlerts > 0 && (
                <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">
                  {unreadAlerts}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
          style={{ color: 'var(--text-tertiary)', background: 'var(--bg-elevated)' }}
        >
          {sidebarCollapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
        </button>
      </div>
    </motion.aside>
  );
}
