import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useParkingStore } from '../store/useParkingStore';

export function SettingsPage() {
  const theme = useParkingStore((s) => s.theme);
  const toggleTheme = useParkingStore((s) => s.toggleTheme);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl space-y-4"
    >
      <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Appearance</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
          Your theme preference is saved to this browser.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => theme !== 'dark' && toggleTheme()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium"
            style={{
              borderColor: theme === 'dark' ? 'var(--accent-blue)' : 'var(--border-subtle)',
              color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: theme === 'dark' ? 'var(--bg-hover)' : 'transparent',
            }}
          >
            <Moon size={14} /> Dark
          </button>
          <button
            onClick={() => theme !== 'light' && toggleTheme()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium"
            style={{
              borderColor: theme === 'light' ? 'var(--accent-blue)' : 'var(--border-subtle)',
              color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: theme === 'light' ? 'var(--bg-hover)' : 'transparent',
            }}
          >
            <Sun size={14} /> Light
          </button>
        </div>
      </div>

      <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>About ParkWise</h3>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          ParkWise is a frontend-only smart parking analytics dashboard built with React, TypeScript,
          React Three Fiber, and Recharts. All data shown is simulated mock data for demonstration purposes.
        </p>
      </div>
    </motion.div>
  );
}
