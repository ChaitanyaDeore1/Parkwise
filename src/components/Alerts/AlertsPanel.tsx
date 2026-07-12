import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Info, XCircle, X, type LucideIcon } from 'lucide-react';
import { useParkingStore } from '../../store/useParkingStore';
import { formatDistanceToNow } from '../../utils/format';
import type { AlertSeverity } from '../../utils/types';

const SEVERITY_STYLE: Record<AlertSeverity, { color: string; icon: LucideIcon; label: string }> = {
  critical: { color: 'var(--accent-red)', icon: XCircle, label: 'Critical' },
  warning: { color: 'var(--accent-yellow)', icon: AlertTriangle, label: 'Warning' },
  info: { color: 'var(--accent-blue)', icon: Info, label: 'Info' },
};

export function AlertsPanel({ compact = false }: { compact?: boolean }) {
  const alerts = useParkingStore((s) => s.alerts);
  const dismissAlert = useParkingStore((s) => s.dismissAlert);
  const markAlertRead = useParkingStore((s) => s.markAlertRead);

  const list = compact ? alerts.slice(0, 5) : alerts;

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Alerts
      </h3>
      <div className={compact ? '' : 'grid sm:grid-cols-2 gap-2'}>
        <AnimatePresence initial={false}>
          {list.map((a) => {
            const meta = SEVERITY_STYLE[a.severity];
            const Icon = meta.icon;
            return (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => markAlertRead(a.id)}
                className="flex items-start gap-2.5 p-3 rounded-lg border mb-2 cursor-pointer"
                style={{
                  borderColor: 'var(--border-subtle)',
                  background: a.read ? 'transparent' : 'var(--bg-elevated)',
                }}
              >
                <Icon size={15} style={{ color: meta.color }} className="mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {a.type}
                    </span>
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: `color-mix(in srgb, ${meta.color} 18%, transparent)`, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{a.message}</p>
                  <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                    {formatDistanceToNow(a.timestamp)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissAlert(a.id);
                  }}
                  className="shrink-0"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <X size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {list.length === 0 && (
          <p className="text-xs py-6 text-center" style={{ color: 'var(--text-tertiary)' }}>
            No active alerts
          </p>
        )}
      </div>
    </div>
  );
}
