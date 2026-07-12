import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import { useParkingStore } from '../../store/useParkingStore';
import { formatDistanceToNow } from '../../utils/format';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  lots: 'Parking Lots',
  analytics: 'Analytics',
  vehicles: 'Vehicles',
  reports: 'Reports',
  alerts: 'Alerts',
  settings: 'Settings',
};

export function Navbar() {
  const { activePage, searchQuery, setSearchQuery, theme, toggleTheme, alerts, markAlertRead } =
    useParkingStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unread = alerts.filter((a) => !a.read).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header
      className="h-16 shrink-0 flex items-center justify-between gap-4 px-6 border-b"
      style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
    >
      <div className="flex items-center gap-4 min-w-0">
        <h1 className="text-[15px] font-semibold tracking-tight shrink-0" style={{ color: 'var(--text-primary)' }}>
          {PAGE_TITLES[activePage]}
        </h1>
      </div>

      <div className="flex-1 max-w-md">
        <div
          className="flex items-center gap-2 px-3 h-9 rounded-lg border"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
        >
          <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parking ID..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-80 rounded-xl border shadow-2xl overflow-hidden z-50 glass-panel"
              >
                <div className="px-4 py-3 border-b text-sm font-medium" style={{ borderColor: 'var(--border-subtle)' }}>
                  Notifications
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {alerts.slice(0, 8).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => markAlertRead(a.id)}
                      className="w-full text-left px-4 py-3 border-b last:border-0 hover:bg-white/5 transition-colors"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <div className="flex items-center gap-2">
                        {!a.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          {a.type}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {a.message}
                      </p>
                      <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                        {formatDistanceToNow(a.timestamp)}
                      </span>
                    </button>
                  ))}
                  {alerts.length === 0 && (
                    <div className="px-4 py-6 text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      No notifications
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-lg border cursor-pointer"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-[10px] font-bold text-white">
            OM
          </div>
          <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--text-primary)' }}>
            Ops Manager
          </span>
          <ChevronDown size={13} style={{ color: 'var(--text-tertiary)' }} />
        </div>
      </div>
    </header>
  );
}
