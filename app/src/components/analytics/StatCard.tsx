import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  subLabel: string;
  delay?: number;
  onClick?: () => void;
}

export function StatCard({ label, value, subLabel, delay = 0, onClick }: StatCardProps) {
  return (
    <motion.button
      type="button"
      aria-label={`查看 ${label} 详情`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileTap={{ scale: 0.98 }}
      className="min-w-0 flex-1 rounded-[18px] bg-white p-3 text-left shadow-[0_10px_24px_rgba(36,24,70,0.08)]"
    >
      <p className="mb-1 text-[11px] text-gray-500">{label}</p>
      <p className="text-lg font-bold text-neutral-black">{value}</p>
      <p className="text-[9px] leading-4 text-gray-400">{subLabel}</p>
    </motion.button>
  );
}
