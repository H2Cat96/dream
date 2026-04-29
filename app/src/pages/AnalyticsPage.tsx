import { motion } from 'framer-motion';
import { ChevronLeft, Settings } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MoodReflectionsCard } from '../components/analytics/MoodReflectionsCard';
import { WeekSelector } from '../components/analytics/WeekSelector';
import { DreamDistributionCard } from '../components/analytics/DreamDistributionCard';
import { InterpretationSettingsSheet } from '../components/analytics/InterpretationSettingsSheet';
import { ParentDreamInsightCard } from '../components/analytics/ParentDreamInsightCard';
import { StatusBar } from '../components/layout/StatusBar';
import { interpretationMonths } from '../lib/prototypeData';

interface AnalyticsPageProps {
  onBack: () => void;
}

export function AnalyticsPage({ onBack }: AnalyticsPageProps) {
  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [showSettings, setShowSettings] = useState(false);

  const currentMonth = useMemo(
    () => interpretationMonths.find((month) => month.id === selectedMonth) ?? interpretationMonths[0],
    [selectedMonth],
  );

  const monthButtons = useMemo(
    () => interpretationMonths.map(({ id, label, color, status }) => ({ id, label, color, status })),
    [],
  );

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
          type="button"
          aria-label="返回上一页"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-black" />
        </motion.button>
        <h1 className="text-lg font-bold tracking-[0.18em] text-neutral-black">释梦</h1>
        <motion.button
          type="button"
          aria-label="打开释梦设置"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <Settings className="w-5 h-5 text-neutral-black" />
        </motion.button>
      </div>

      <div className="mb-3">
        <MoodReflectionsCard motifs={currentMonth.motifs} tarot={currentMonth.tarot} monthLabel={currentMonth.label} />
      </div>

      <div className="mb-3">
        <WeekSelector selectedMonth={selectedMonth} months={monthButtons} onSelect={setSelectedMonth} />
      </div>

      <DreamDistributionCard monthLabel={currentMonth.label} distribution={currentMonth.distribution} />

      <ParentDreamInsightCard />

      <InterpretationSettingsSheet
        open={showSettings}
        monthLabel={currentMonth.label}
        onClose={() => setShowSettings(false)}
      />
    </motion.div>
  );
}
