import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Wand2, X } from 'lucide-react';

type ArchiveEntry = {
  title: string;
  time: string;
  mood: string;
  chapter: string;
  longSummary: string;
  tags: string[];
  coverImage: string;
  accent: string;
};

type ArchiveDetailSheetProps = {
  entry: ArchiveEntry | null;
  open: boolean;
  onClose: () => void;
};

export function ArchiveDetailSheet({ entry, open, onClose }: ArchiveDetailSheetProps) {
  return (
    <AnimatePresence>
      {open && entry ? (
        <motion.div
          key={entry.title}
          className="absolute inset-0 z-[80] flex items-end justify-center bg-black/30 px-4 py-6 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.section
            initial={{ y: 26, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-[420px] overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,241,255,0.96)_100%)] p-4 shadow-[0_24px_70px_rgba(34,24,58,0.28)]"
          >
            <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${entry.accent} opacity-80`} />
            <div className="absolute right-6 top-6 h-16 w-16 rounded-full bg-white/25 blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] text-[#6c5b8f] shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    {entry.chapter}
                  </div>
                  <h3 className="mt-3 text-[22px] font-bold leading-tight text-[#1c1630]">{entry.title}</h3>
                  <p className="mt-1 text-xs text-[#7d7192]">
                    {entry.time} · {entry.mood}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="关闭档案详情"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[#46365f] shadow-sm"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-[26px] border border-white/70 shadow-[0_16px_28px_rgba(56,42,102,0.16)]">
                <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${entry.coverImage})` }} />
              </div>

              <p className="mt-4 text-sm leading-6 text-[#5b506f]">{entry.longSummary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#e7def3] bg-white px-3 py-1 text-xs text-[#6b5f82]">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-xs leading-5 text-[#8a8099]">这是一个假的详情页，用来演示档案翻开后的交互状态。</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6c5cff] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(108,92,255,0.22)]"
                >
                  <Wand2 className="h-4 w-4" />
                  生成绘本
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#d9cfee] bg-white px-4 py-3 text-sm font-semibold text-[#5a4b79]"
                >
                  继续整理
                </button>
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
