import { motion } from 'framer-motion';
import { BellRing, Clock3, Mic, X } from 'lucide-react';

type HomeNotificationSheetProps = {
  open: boolean;
  onClose: () => void;
  onStartVoiceJourney: () => void;
};

export function HomeNotificationSheet({
  open,
  onClose,
  onStartVoiceJourney,
}: HomeNotificationSheetProps) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40"
    >
      <button
        type="button"
        aria-label="关闭通知"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
      />

      <motion.section
        initial={{ y: 26, opacity: 0.2, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-4 bottom-4 overflow-hidden rounded-[30px] border border-white/14 bg-[linear-gradient(180deg,rgba(18,21,37,0.96)_0%,rgba(11,13,24,0.94)_100%)] text-white shadow-[0_22px_48px_rgba(0,0,0,0.38)]"
      >
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8">
              <BellRing className="h-4.5 w-4.5 text-[#ffe59a]" />
            </span>
            <div>
              <p className="text-[11px] text-white/55">昨夜提醒</p>
              <h2 className="text-[15px] font-semibold">今天继续把梦讲完</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/7 text-white/78"
            aria-label="关闭通知面板"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 px-4 py-4">
          <div className="rounded-[22px] border border-white/10 bg-white/6 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] text-white/56">
                <Clock3 className="h-3.5 w-3.5" />
                <span>03:18</span>
              </div>
              <span className="rounded-full bg-[#ffe59a]/16 px-2 py-0.5 text-[10px] text-[#ffe59a]">
                昨夜收藏
              </span>
            </div>
            <p className="mt-2 text-[15px] font-medium leading-6">
              你提到“会发光的桥”和“把月亮装进口袋”，我帮你留在最前面了。
            </p>
            <p className="mt-1.5 text-[12px] leading-5 text-white/60">
              这条提醒会在你重新打开绘梦星球时显示，方便你把梦继续说完。
            </p>
          </div>

          <div className="rounded-[22px] border border-[#ffe59a]/18 bg-[#ffe59a]/10 p-3">
            <div className="flex items-center gap-2 text-[11px] text-[#ffe59a]">
              <Mic className="h-3.5 w-3.5" />
              <span>建议现在补讲</span>
            </div>
            <p className="mt-2 text-[13px] leading-5 text-white/85">
              如果愿意，直接开始讲梦，我们会先听、再转写、最后存进星球档案。
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onStartVoiceJourney}
              className="flex-1 rounded-full bg-[#ffe59a] px-4 py-3 text-[13px] font-semibold text-[#161624]"
            >
              去讲梦
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-[13px] text-white/84"
            >
              稍后
            </button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
