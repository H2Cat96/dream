import { AnimatePresence, motion } from 'framer-motion';
import { FileText, X } from 'lucide-react';

interface StatDetailSheetProps {
  open: boolean;
  title: string;
  body: string;
  onClose: () => void;
}

export function StatDetailSheet({ open, title, body, onClose }: StatDetailSheetProps) {
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
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f6f1ff] px-3 py-1 text-xs text-[#66598c]">
                <FileText className="h-3.5 w-3.5" />
                统计详情
              </div>
              <button
                type="button"
                aria-label="关闭统计详情"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f1ff] text-[#66598c]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-[#1f1731]">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#6f667f]">{body}</p>

            <div className="mt-5 rounded-[22px] bg-[#faf7ff] px-4 py-3 text-[12px] leading-5 text-[#7b718e]">
              这是用于产品演示的假详情面板，后续可以接更完整的月度分析和趋势解释。
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
