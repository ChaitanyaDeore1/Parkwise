import { motion, AnimatePresence } from 'framer-motion';
import { X, Gauge, MapPin, Clock, Hash } from 'lucide-react';
import type { Vehicle } from '../../utils/types';
import { formatTime } from '../../utils/format';

export function VehicleDetailsPanel({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-3 left-3 w-72 rounded-xl overflow-hidden glass-panel shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {vehicle.destinationSpotId}
          </span>
          <button onClick={onClose} className="text-[color:var(--text-tertiary)] hover:text-white">
            <X size={15} />
          </button>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <Row icon={<Hash size={13} />} label="Vehicle ID" value={vehicle.id} />
          <Row icon={<MapPin size={13} />} label="Parking ID" value={vehicle.destinationSpotId} />
          <Row icon={<Clock size={13} />} label="Time of Parking" value={formatTime(vehicle.entryTime)} />
          <Row icon={<Gauge size={13} />} label="Current Speed" value={`${vehicle.speed} km/h`} />
          <Row icon={<Clock size={13} />} label="Est. Exit Time" value={formatTime(vehicle.estimatedExitTime)} />
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
      <span className="text-xs font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}
