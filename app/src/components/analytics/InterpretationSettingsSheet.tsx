import { AnimatePresence, motion } from 'framer-motion';
import { BellRing, MoonStar, SlidersHorizontal, X } from 'lucide-react';

interface InterpretationSettingsSheetProps {
  open: boolean;
  monthLabel: string;
  onClose: () => void;
}

const options = [
  { icon: BellRing, title: '记录提醒', helper: '每天清晨轻提醒一次，别错过刚醒来的梦。' },
  { icon: MoonStar, title: '自动整理', helper: '记录后自动生成关键词和梦境标签。' },
  { icon: SlidersHorizontal, title: '展示偏好', helper: '优先显示当前月份的高频意象和释梦卡。' },
];

export function InterpretationSettingsSheet({ open, monthLabel, onClose }: InterpretationSettingsSheetProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[95] bg-[#090611]/62 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-4 bottom-24 rounded-[30px] bg-white p-4 text-[#1c1630] shadow-[0_24px_50px_rgba(25,18,45,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.16em] text-[#9b91ad]">{monthLabel}</p>
                <h3 className="mt-1 text-xl font-semibold">释梦设置</h3>
              </div>
              <button
                type="button"
                aria-label="关闭释梦设置"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f1ff] text-[#66598c]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.title} className="rounded-[22px] border border-[#ece5ff] bg-[#faf7ff] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6f5aa6] shadow-sm">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#23193a]">{option.title}</p>
                        <p className="mt-1 text-[12px] leading-5 text-[#746a86]">{option.helper}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs leading-5 text-[#8b819b]">这是用于演示的假设置面板，帮助你确认释梦页后续会有哪些可调节项。</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
