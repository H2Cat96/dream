import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const distributionData = [
  {
    key: 'reality',
    label: '现实梦',
    value: 51,
    color: '#d66cff',
    shell: '#f3d9ff',
  },
  {
    key: 'prophecy',
    label: '预言梦',
    value: 72,
    color: '#ff8e53',
    shell: '#ffd9c9',
  },
  {
    key: 'nightmare',
    label: '噩梦',
    value: 68,
    color: '#ef62bd',
    shell: '#ffd3ec',
  },
  {
    key: 'lucid',
    label: '清醒梦',
    value: 25,
    color: '#7f79ff',
    shell: '#d7d5ff',
  },
  {
    key: 'sweet',
    label: '甜梦',
    value: 85,
    color: '#ee618c',
    shell: '#ffd6e0',
  },
  {
    key: 'repeat',
    label: '重复梦',
    value: 86,
    color: '#a986f6',
    shell: '#e5d7ff',
  },
  {
    key: 'fantasy',
    label: '奇幻梦',
    value: 79,
    color: '#8ab6f5',
    shell: '#d9e7ff',
  },
  {
    key: 'anxiety',
    label: '焦虑梦',
    value: 50,
    color: '#e9648a',
    shell: '#ffd4e1',
  },
];

const CHART_HEIGHT = 146;
const SEGMENT_GAP = 6;
const MIN_FILL_HEIGHT = 20;

export function DreamDistributionCard() {
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
          <p className="mt-1 text-xs text-gray-500">基于当月梦境标签统计</p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-full bg-neutral-black px-3 py-1.5 text-xs text-white">
          4月
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-8 items-end gap-1 pb-1">
        {distributionData.map((item, index) => (
          (() => {
            const fillHeight = Math.max(MIN_FILL_HEIGHT, Math.round((item.value / 100) * (CHART_HEIGHT - SEGMENT_GAP)));
            const topHeight = Math.max(0, CHART_HEIGHT - fillHeight - SEGMENT_GAP);

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 * index + 0.4 }}
                className="flex min-w-0 flex-col items-center"
              >
                <div className="relative flex h-[152px] w-full max-w-[30px] flex-col items-center justify-end">
                  {topHeight > 0 && (
                    <div
                      className="absolute top-0 w-full rounded-[20px]"
                      style={{
                        height: `${topHeight}px`,
                        backgroundColor: item.shell,
                      }}
                    />
                  )}
                  <div
                    className="absolute bottom-0 w-full rounded-[20px]"
                    style={{
                      height: `${fillHeight}px`,
                      backgroundColor: item.color,
                    }}
                  />
                  <span className="absolute bottom-2 text-[10px] font-medium text-[#231f2f]">
                    {item.value}%
                  </span>
                </div>
              </motion.div>
            );
          })()
        ))}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-x-2 gap-y-1.5">
        {distributionData.map((item) => (
          <div key={item.key} className="flex min-w-0 items-center gap-1">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate text-[9px] text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
