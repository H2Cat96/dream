import { AnimatePresence, motion } from 'framer-motion';
import { LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';

export function ParentDreamInsightCard() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const confirmParentAccess = () => {
    setUnlocked(true);
    setConfirmOpen(false);
  };

  return (
    <div className="mx-5 mt-4 pb-10">
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="w-full rounded-[24px] border border-[#1e1633]/8 bg-white px-4 py-4 text-left shadow-[0_12px_28px_rgba(48,37,84,0.06)]"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f4efff] px-3 py-1 text-[11px] font-medium text-[#6b5a9e]">
              <LockKeyhole className="h-3.5 w-3.5" />
              家长可查看
            </div>
            <h3 className="mt-3 text-[18px] font-semibold text-[#1c1630]">家长梦境观察</h3>
            <p className="mt-1 text-[12px] leading-5 text-[#7a708d]">
              仅供家长了解孩子近期情绪线索，不作为诊断。
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#20152c] text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </button>

      {unlocked && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-[26px] border border-[#1e1633]/8 bg-[linear-gradient(180deg,#fffdf8_0%,#f7f1ff_100%)] p-4 shadow-[0_12px_28px_rgba(48,37,84,0.06)]"
        >
          <p className="text-sm font-semibold text-[#1c1630]">孩子最近的心理状态</p>
          <div className="mt-3 space-y-2.5 text-[13px] leading-5 text-[#6f667f]">
            <p><span className="font-semibold text-[#34264f]">近期情绪：</span>整体偏稳定，好奇心和表达欲更明显。</p>
            <p><span className="font-semibold text-[#34264f]">高频线索：</span>月亮、海浪、楼梯反复出现，可能和探索、安全感、成长阶段有关。</p>
            <p><span className="font-semibold text-[#34264f]">需要留意：</span>焦虑梦次数不高，但睡前可减少刺激内容。</p>
            <p><span className="font-semibold text-[#34264f]">陪伴建议：</span>早晨可以轻松问一句：“昨晚梦里最亮的东西是什么？”</p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[95] bg-[#090611]/62 p-4 backdrop-blur-md"
            onClick={() => setConfirmOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="absolute inset-x-4 bottom-24 rounded-[30px] bg-white p-4 text-[#1c1630] shadow-[0_24px_50px_rgba(25,18,45,0.24)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">家长确认</h3>
                <button
                  type="button"
                  aria-label="关闭家长确认"
                  onClick={() => setConfirmOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f1ff]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#6f667f]">
                这部分内容面向家长，用来帮助理解孩子近期梦境里的情绪线索。内容仅供陪伴和沟通参考，不作为心理诊断。
              </p>
              <button
                type="button"
                onClick={confirmParentAccess}
                className="mt-5 w-full rounded-full bg-[#20152c] px-4 py-3 text-sm font-semibold text-white"
              >
                我是家长，继续查看
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
