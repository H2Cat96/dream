import { motion } from 'framer-motion';

interface SheepAgentButtonProps {
  onClick: () => void;
}

export function SheepAgentButton({ onClick }: SheepAgentButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label="打开小羊助手"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="absolute right-4 bottom-28 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/14 bg-[radial-gradient(circle_at_30%_30%,rgba(255,248,214,0.96),rgba(255,226,140,0.96)_44%,rgba(255,188,84,0.96)_100%)] text-neutral-black shadow-[0_18px_35px_rgba(0,0,0,0.22)]"
    >
      <span className="text-[28px] leading-none" aria-hidden="true">🐑</span>
    </motion.button>
  );
}
