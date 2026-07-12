import { motion } from 'framer-motion';
import { Warehouse } from 'lucide-react';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5"
      style={{ background: '#05070a' }}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center"
      >
        <Warehouse size={28} className="text-white" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <p className="text-white text-lg font-semibold tracking-tight">ParkWise</p>
        <p className="text-slate-500 text-xs mt-1">Loading smart parking analytics…</p>
      </motion.div>
      <motion.div
        className="w-40 h-0.5 rounded-full overflow-hidden"
        style={{ background: '#171c26' }}
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          className="w-1/2 h-full bg-blue-500"
        />
      </motion.div>
    </motion.div>
  );
}
