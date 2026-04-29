import { motion } from 'framer-motion';
import { CheckCircle2, Mic, PencilLine, Radio, Sparkles, X } from 'lucide-react';

export type VoiceJourneyStage = 'idle' | 'recording' | 'transcribing' | 'saved';

type VoiceJourneySheetProps = {
  open: boolean;
  stage: VoiceJourneyStage;
  transcript: string;
  onClose: () => void;
  onSave: () => void;
};

const stageCopy: Record<VoiceJourneyStage, { title: string; subtitle: string }> = {
  idle: { title: '准备好后按下开始', subtitle: '我们会先听你的声音，再把它变成一段可存档的梦话。' },
  recording: { title: '正在听你讲梦', subtitle: '请继续说，哪怕只是碎片也没关系。' },
  transcribing: { title: '正在转写梦话', subtitle: '我们在把你的讲述整理成更清楚的句子。' },
  saved: { title: '梦已经存好', subtitle: '这段内容会留在你的星球档案里。' },
};

export function VoiceJourneySheet({ open, stage, transcript, onClose, onSave }: VoiceJourneySheetProps) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50"
    >
      <button
        type="button"
        aria-label="关闭讲梦面板"
        onClick={onClose}
        className="absolute inset-0 bg-black/38 backdrop-blur-[1px]"
      />

      <motion.section
        initial={{ y: 30, opacity: 0.2, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-4 bottom-4 overflow-hidden rounded-[30px] border border-white/14 bg-[linear-gradient(180deg,rgba(19,23,39,0.98)_0%,rgba(10,12,20,0.95)_100%)] text-white shadow-[0_24px_48px_rgba(0,0,0,0.42)]"
      >
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8">
              <Mic className="h-4.5 w-4.5 text-[#ffe59a]" />
            </span>
            <div>
              <p className="text-[11px] text-white/55">讲梦旅程</p>
              <h2 className="text-[15px] font-semibold">{stageCopy[stage].title}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/7 text-white/76"
            aria-label="关闭讲梦面板"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe59a]/14">
                {stage === 'saved' ? (
                  <CheckCircle2 className="h-5 w-5 text-[#ffe59a]" />
                ) : stage === 'transcribing' ? (
                  <PencilLine className="h-5 w-5 text-[#ffe59a]" />
                ) : (
                  <Radio className="h-5 w-5 text-[#ffe59a]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium">{stageCopy[stage].subtitle}</p>
                <p className="mt-1 text-[11px] text-white/54">
                  {stage === 'recording' && '录音中'}
                  {stage === 'transcribing' && '转写中'}
                  {stage === 'saved' && '已保存'}
                  {stage === 'idle' && '等待开始'}
                </p>
              </div>
            </div>

            <div className="mt-4 h-1.5 rounded-full bg-white/8">
              <motion.div
                initial={false}
                animate={{
                  width:
                    stage === 'idle'
                      ? '10%'
                      : stage === 'recording'
                        ? '42%'
                        : stage === 'transcribing'
                          ? '74%'
                          : '100%',
                }}
                transition={{ duration: 0.35 }}
                className="h-full rounded-full bg-[linear-gradient(90deg,#ffe59a_0%,#b9c8ff_55%,#c28fff_100%)]"
              />
            </div>
          </div>

          {stage === 'saved' ? (
            <div className="rounded-[22px] border border-white/10 bg-[#ffffff08] p-4">
              <p className="text-[11px] text-white/54">固定转写</p>
              <p className="mt-2 text-[14px] leading-6 text-white/88">{transcript}</p>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-[11px] text-white/66">
                <Sparkles className="h-3.5 w-3.5 text-[#ffe59a]" />
                已整理进星球记忆
              </div>
            </div>
          ) : (
            <div className="rounded-[22px] border border-white/10 bg-[#ffffff08] p-4">
              <p className="text-[11px] text-white/54">当前状态</p>
              <p className="mt-2 text-[14px] leading-6 text-white/84">
                你可以继续讲细节，我们会把它慢慢收进同一条梦里。
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSave}
              className="flex-1 rounded-full bg-[#ffe59a] px-4 py-3 text-[13px] font-semibold text-[#161624]"
            >
              保存
            </button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
