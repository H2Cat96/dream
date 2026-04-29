import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenText, Sparkles, X } from 'lucide-react';

type ArchiveSpecimen = {
  id: string;
  title: string;
  count: string;
  lastSeen: string;
  companions: string[];
  meaning: string;
  accent: string;
};

type SpecimenDetailSheetProps = {
  specimen: ArchiveSpecimen | null;
  open: boolean;
  onClose: () => void;
};

export function SpecimenDetailSheet({ specimen, open, onClose }: SpecimenDetailSheetProps) {
  return (
    <AnimatePresence>
      {open && specimen ? (
        <motion.div
          key={specimen.id}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/28 px-4 pb-7 pt-6 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.section
            initial={{ y: 36, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-[388px] overflow-hidden rounded-[32px] border border-[#eadcb9] bg-[linear-gradient(180deg,rgba(255,251,243,0.98)_0%,rgba(255,246,228,0.95)_100%)] p-4 shadow-[0_24px_70px_rgba(82,61,18,0.20)]"
          >
            <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${specimen.accent} opacity-85`} />
            <div className="absolute right-5 top-5 h-16 w-16 rounded-full bg-white/28 blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] text-[#8d6b1d] shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    标本详情
                  </div>
                  <h3 className="mt-3 text-[22px] font-bold leading-tight text-[#4b3611]">{specimen.title}</h3>
                  <p className="mt-1 text-xs text-[#8e6f32]">{specimen.count}</p>
                </div>
                <button
                  type="button"
                  aria-label="关闭标本详情"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[#6f5415] shadow-sm"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="mt-4 rounded-[26px] border border-[#ead9af] bg-white/88 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                <div className="flex items-center gap-2 text-[#7f5d18]">
                  <BookOpenText className="h-4 w-4" />
                  <span className="text-sm font-semibold">最近一次出现</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#6d5521]">{specimen.lastSeen}</p>
                <p className="mt-4 text-xs leading-5 text-[#8d7847]">{specimen.meaning}</p>
              </div>

              <div className="mt-4 rounded-[24px] border border-[#eadcb9] bg-white/78 p-4">
                <p className="text-xs font-semibold tracking-[0.08em] text-[#8f6f1c]">常一起出现</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {specimen.companions.map((companion) => (
                    <span key={companion} className="rounded-full border border-[#e4d5a8] bg-[#fff7df] px-3 py-1 text-xs text-[#735612]">
                      {companion}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#8a7b54]">这是一个假的详情页，用来演示标本被单独展开查看的状态。</p>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
