import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subLabel: string;
  delay?: number;
}

function AnimatedNumber({ value, delay = 0 }: { value: string; delay?: number }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const hasComma = value.includes(',');
  const isPercentage = value.includes('%');
  const isFraction = value.includes('/');

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 30 });
  const displayValue = useTransform(springValue, (latest) => {
    if (isFraction) return value;
    const num = Math.round(latest);
    if (hasComma) return num.toLocaleString();
    if (isPercentage) return `${num}%`;
    return num.toString();
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      motionValue.set(numericValue);
    }, delay * 1000 + 500);
    return () => clearTimeout(timer);
  }, [numericValue, motionValue, delay]);

  if (isFraction) {
    return <span>{value}</span>;
  }

  return <motion.span>{displayValue}</motion.span>;
}

export function StatCard({ label, value, subLabel, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="min-w-0 flex-1 rounded-[18px] bg-white p-3"
    >
      <p className="mb-1 text-[11px] text-gray-500">{label}</p>
      <p className="text-lg font-bold text-neutral-black">
        <AnimatedNumber value={value} delay={delay} />
      </p>
      <p className="text-[9px] leading-4 text-gray-400">{subLabel}</p>
    </motion.div>
  );
}
