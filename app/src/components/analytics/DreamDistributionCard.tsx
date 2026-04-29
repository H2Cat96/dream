import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const DISTRIBUTION_COLORS = [
  { color: '#d66cff', shell: '#f3d9ff' },
  { color: '#ff8e53', shell: '#ffd9c9' },
  { color: '#ef62bd', shell: '#ffd3ec' },
  { color: '#7f79ff', shell: '#d7d5ff' },
  { color: '#ee618c', shell: '#ffd6e0' },
  { color: '#a986f6', shell: '#e5d7ff' },
  { color: '#8ab6f5', shell: '#d9e7ff' },
  { color: '#e9648a', shell: '#ffd4e1' },
];

const CHART_HEIGHT = 146;
const SEGMENT_GAP = 6;
const MIN_FILL_HEIGHT = 20;

interface DreamDistributionCardProps {
  monthLabel: string;
  distribution: Array<{ label: string; value: number }>;
}

export function DreamDistributionCard({ monthLabel, distribution }: DreamDistributionCardProps) {
  const maxValue = distribution.reduce((currentMax, item) => Math.max(currentMax, item.value), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="mx-5 rounded-[24px] bg-white p-4 shadow-[0_12px_28px_rgba(48,37,84,0.06)]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[22px] font-semibold leading-none text-neutral-black">梦境分布</h3>
          <p className="mt-1 text-xs text-gray-500">基于当月梦境标签出现次数</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-neutral-black px-3 py-1.5 text-xs text-white">
          {monthLabel}
          <ChevronDown className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="grid grid-cols-8 items-end gap-1 pb-1">
        {distribution.map((item, index) => {
          const palette = DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length];
          const fillRatio = maxValue === 0 ? 0 : item.value / maxValue;
          const fillHeight = item.value === 0 ? 0 : Math.max(MIN_FILL_HEIGHT, Math.round(fillRatio * (CHART_HEIGHT - SEGMENT_GAP)));
          const topHeight = Math.max(0, CHART_HEIGHT - fillHeight - (fillHeight > 0 ? SEGMENT_GAP : 0));

          return (
            <motion.div
              key={`${monthLabel}-${item.label}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 * index + 0.4 }}
              className="flex min-w-0 flex-col items-center"
            >
              <div className="relative flex h-[152px] w-full max-w-[30px] flex-col items-center justify-end">
                {topHeight > 0 && (
                  <div
                    className="absolute top-0 w-full rounded-[20px]"
                    style={{ height: `${topHeight}px`, backgroundColor: palette.shell }}
                  />
                )}
                {fillHeight > 0 && (
                  <div
                    className="absolute bottom-0 w-full rounded-[20px]"
                    style={{ height: `${fillHeight}px`, backgroundColor: palette.color }}
                  />
                )}
                <span className="absolute bottom-2 text-[10px] font-medium text-[#231f2f]">{item.value}次</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-8 gap-1">
        {distribution.map((item, index) => {
          const palette = DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length];
          return (
            <div key={`${monthLabel}-legend-${item.label}`} className="flex min-w-0 flex-col items-center gap-1">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: palette.color }} />
              <span className="w-full truncate text-center text-[8px] leading-3 text-gray-600">{item.label}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
