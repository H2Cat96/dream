import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

type PlanetStageSheetProps = {
  open: boolean;
  stageName: string;
  currentDreamCount: number;
  nextStageCount: number;
  progress: number;
  onClose: () => void;
};

export function PlanetStageSheet({
  open,
  stageName,
  currentDreamCount,
  nextStageCount,
  progress,
  onClose,
}: PlanetStageSheetProps) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none absolute inset-0 z-[95]"
    >
      <motion.section
        initial={{ x: '100%', opacity: 0.45 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto absolute bottom-32 right-0 flex w-[82%] max-w-[322px] overflow-hidden rounded-l-[24px] border border-r-0 border-white/12 bg-[linear-gradient(180deg,rgba(19,22,38,0.98)_0%,rgba(10,12,20,0.95)_100%)] text-white shadow-[0_20px_42px_rgba(0,0,0,0.32)]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-white/8 px-3.5 py-2">
            <div>
              <p className="text-[11px] text-white/56">星球阶段</p>
              <h2 className="text-[15px] font-semibold">{stageName}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/7 text-white/76"
              aria-label="关闭星球阶段"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-3.5 py-2.5">
            <div className="rounded-[18px] border border-white/10 bg-white/6 p-2.5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] text-white/52">当前光点</p>
                  <p className="text-[20px] font-semibold leading-none">{currentDreamCount}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-white/52">下一阶段</p>
                  <p className="text-[12px] font-medium">{nextStageCount} 个光点</p>
                </div>
              </div>

              <div className="mt-2.5 h-1.5 rounded-full bg-white/8">
                <motion.div
                  initial={false}
                  animate={{ width: `${Math.max(14, Math.min(progress * 100, 100))}%` }}
                  transition={{ duration: 0.35 }}
                  className="h-full rounded-full bg-[linear-gradient(90deg,#ffe59a_0%,#b9c8ff_50%,#c28fff_100%)]"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="收起星球成长记录"
          className="flex w-10 shrink-0 flex-col items-center justify-center gap-1.5 border-l border-white/10 bg-black/16 text-white/82"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#ffe7a1]" />
          <span className="flex flex-col items-center text-[11px] font-medium leading-[1.05] tracking-[0.08em]">
            <span>成</span>
            <span>长</span>
          </span>
        </button>
      </motion.section>
    </motion.div>
  );
}
