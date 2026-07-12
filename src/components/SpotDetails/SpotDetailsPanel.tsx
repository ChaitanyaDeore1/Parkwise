import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Car, Clock, Zap, Hash } from 'lucide-react';
import { useParkingStore } from '../../store/useParkingStore';
import { formatDuration, formatTime } from '../../utils/format';

const STATUS_LABEL: Record<string, string> = {
  available: 'Available',
  occupied: 'Occupied',
  reserved: 'Reserved',
  ev: 'EV Charging',
  accessible: 'Accessible',
};

const STATUS_COLOR: Record<string, string> = {
  available: 'var(--accent-green)',
  occupied: 'var(--accent-red)',
  reserved: 'var(--accent-yellow)',
  ev: 'var(--accent-blue)',
  accessible: 'var(--accent-purple)',
};

export function SpotDetailsPanel({ spotId, onClose }: { spotId: string; onClose: () => void }) {
  const spot = useParkingStore((s) => s.spots.find((sp) => sp.id === spotId));
  if (!spot) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-3 right-3 w-72 rounded-xl overflow-hidden glass-panel shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <MapPin size={14} style={{ color: STATUS_COLOR[spot.status] }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {spot.id}
            </span>
          </div>
          <button onClick={onClose} className="text-[color:var(--text-tertiary)] hover:text-white">
            <X size={15} />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <Row
            label="Status"
            value={
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{ background: `color-mix(in srgb, ${STATUS_COLOR[spot.status]} 18%, transparent)`, color: STATUS_COLOR[spot.status] }}
              >
                {STATUS_LABEL[spot.status]}
              </span>
            }
          />
          <Row label="Floor" value={`Level ${spot.floor}`} />

          {spot.status === 'occupied' && (
            <>
              <Row label="Vehicle Type" value={<span className="capitalize">{spot.vehicleType}</span>} icon={<Car size={13} />} />
              <Row label="Parking ID" value={spot.id} icon={<Hash size={13} />} />
              <Row
                label="Parked At"
                value={spot.parkedAt ? formatTime(spot.parkedAt) : '—'}
                icon={<Clock size={13} />}
              />
              <Row
                label="Parking Duration"
                value={spot.parkedAt ? formatDuration(spot.parkedAt) : '—'}
                icon={<Clock size={13} />}
              />
            </>
          )}

          {spot.status === 'reserved' && (
            <Row
              label="Reservation Expires"
              value={spot.reservationExpiresAt ? formatTime(spot.reservationExpiresAt) : '—'}
              icon={<Clock size={13} />}
            />
          )}

          {spot.status === 'ev' && (
            <Row
              label="EV Charger"
              value={spot.evChargerAvailable ? 'Available' : 'In Use'}
              icon={<Zap size={13} />}
            />
          )}

          <Row label="Reservation Status" value={spot.status === 'reserved' ? 'Reserved' : 'None'} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Row({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
        {icon}
        {label}
      </span>
      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}
