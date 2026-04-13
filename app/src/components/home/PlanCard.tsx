import { motion } from 'framer-motion';

interface PlanCardProps {
  icon: string;
  title: string;
  delay?: number;
}

export function PlanCard({ icon, title, delay = 0 }: PlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="min-w-[140px] bg-white rounded-[20px] p-4 shadow-sm cursor-pointer"
    >
      <img src={icon} alt="" className="w-12 h-12 object-contain mb-3" />
      <p className="text-sm font-semibold text-neutral-black leading-tight">{title}</p>
    </motion.div>
  );
}
