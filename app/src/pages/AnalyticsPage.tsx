import { motion } from 'framer-motion';
import { ChevronLeft, Settings } from 'lucide-react';
import { StatusBar } from '../components/layout/StatusBar';
import { MoodReflectionsCard } from '../components/analytics/MoodReflectionsCard';
import { WeekSelector } from '../components/analytics/WeekSelector';
import { StatCard } from '../components/analytics/StatCard';
import { DreamDistributionCard } from '../components/analytics/DreamDistributionCard';

interface AnalyticsPageProps {
  onBack: () => void;
}

export function AnalyticsPage({ onBack }: AnalyticsPageProps) {
  const stats = [
    { label: '记录总数', value: '128', subLabel: '篇梦境' },
    { label: '已解释', value: '36/48', subLabel: '待整理 12 篇' },
    { label: '高频意象', value: '88%', subLabel: '最近反复出现' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative min-h-full pb-24"
    >
      <StatusBar />

      <div className="flex items-center justify-between px-5 py-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-black" />
        </motion.button>
        <h1 className="text-lg font-bold tracking-[0.18em] text-neutral-black">释梦</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <Settings className="w-5 h-5 text-neutral-black" />
        </motion.button>
      </div>

      <div className="mb-3">
        <MoodReflectionsCard />
      </div>

      <div className="mb-3">
        <WeekSelector />
      </div>

      <div className="mb-3 flex gap-2 px-5">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            subLabel={stat.subLabel}
            delay={0.4 + index * 0.1}
          />
        ))}
      </div>

      <div>
        <DreamDistributionCard />
      </div>
    </motion.div>
  );
}
