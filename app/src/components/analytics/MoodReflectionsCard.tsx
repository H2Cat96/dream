import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export function MoodReflectionsCard() {
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardImageSrc = '/dream-mucha-moon-card.jpg';

  const motifs = [
    { label: '月亮', note: '18 次' },
    { label: '海浪', note: '11 次' },
    { label: '楼梯', note: '9 次' },
    { label: '鲸鱼', note: '7 次' },
  ];

  const closeInterpretation = () => {
    setShowInterpretation(false);
    setIsFlipped(false);
  };

  const openInterpretation = () => {
    setIsFlipped(false);
    setShowInterpretation(true);
  };

  return (
    <>
      {!showInterpretation && (
        <motion.button
          type="button"
          onClick={openInterpretation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-5 w-[calc(100%-2.5rem)] rounded-[24px] bg-white px-4 py-3.5 text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="max-w-[60%]">
              <h3 className="text-[15px] font-semibold text-neutral-black">
                你的梦里常出现的东西
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {motifs.map((motif) => (
                  <div
                    key={motif.label}
                    className="rounded-full bg-[#f5f0ff] px-2.5 py-1 text-[10px] text-[#6e58a7]"
                  >
                    {motif.label}
                    <span className="ml-1 text-[#9a8bbb]">{motif.note}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-neutral-black px-3 py-1.5 text-[11px] font-medium text-white">
                <Brain className="h-3 w-3" />
                点击解梦
              </div>
            </div>

            <div className="relative h-20 min-w-[88px] flex-1">
              <div className="absolute inset-y-0 right-1 flex items-center">
                <img
                  src={cardImageSrc}
                  alt="月亮与海浪塔罗牌预览"
                  className="h-20 w-14 rounded-[14px] border border-[#dcb779]/45 bg-[#f2e4c7] object-cover object-top shadow-[0_10px_22px_rgba(103,76,164,0.2)]"
                  style={{
                    animation: 'float 2.8s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          </div>
        </motion.button>
      )}

      <AnimatePresence>
        {showInterpretation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[90] flex items-center justify-center bg-[#090611]/86 p-5 backdrop-blur-md"
            onClick={closeInterpretation}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.94 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[344px]"
              onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-3 flex items-center justify-between text-white">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] backdrop-blur-md">
                    <Sparkles className="h-3 w-3 text-[#ffe7a1]" />
                    梦境塔罗
                  </div>
                  <button
                    onClick={closeInterpretation}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/8 backdrop-blur-md"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>

                <motion.div
                  className="relative overflow-hidden rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,#1a1427_0%,#0d0917_100%)] p-3 shadow-[0_26px_60px_rgba(0,0,0,0.34)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,196,123,0.12),transparent_42%),radial-gradient(circle_at_bottom,rgba(118,94,181,0.16),transparent_46%)]" />

                  <div className="mb-2 flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] text-white/80">
                      <Brain className="h-3 w-3" />
                      轻点牌面翻面
                    </div>
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {!isFlipped ? (
                      <motion.button
                        key="front"
                        type="button"
                        onClick={() => setIsFlipped(true)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="block w-full text-left"
                      >
                        <div className="overflow-hidden rounded-[28px] border border-[#dcb779]/40 bg-[#f1e4c8] p-2 shadow-[0_24px_50px_rgba(37,20,12,0.28)]">
                          <div
                            className="aspect-[427/758] w-full rounded-[22px] border border-[#dcb779]/35 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${cardImageSrc})` }}
                          />
                        </div>

                        <div className="mt-3 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-center text-[11px] text-white/78">
                          轻点牌面翻到背面查看释梦
                        </div>
                      </motion.button>
                    ) : (
                      <motion.button
                        key="back"
                        type="button"
                        onClick={() => setIsFlipped(false)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="block min-h-[520px] w-full overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#181225_0%,#0d0916_100%)] px-4 py-5 text-left text-white"
                      >
                        <div className="pointer-events-none absolute left-5 top-6 h-24 w-24 rounded-full bg-[#c28fff]/18 blur-3xl" />
                        <div className="pointer-events-none absolute right-3 top-20 h-20 w-20 rounded-full bg-[#89b7ff]/18 blur-3xl" />
                        <div className="pointer-events-none absolute inset-3 rounded-[20px] border border-white/10" />

                        <div className="relative flex min-h-[480px] flex-col">
                          <div className="text-center">
                            <p className="text-[10px] tracking-[0.22em] text-white/58">
                              THE DREAM ARCANA
                            </p>
                            <h4 className="mt-2 text-[24px] font-semibold leading-tight">月亮与海浪</h4>
                            <p className="mt-1 text-[12px] tracking-[0.16em] text-white/62">
                              楼梯 · 鲸鱼
                            </p>
                          </div>

                          <div className="mt-5 rounded-[18px] border border-white/8 bg-white/6 px-3.5 py-3 text-left">
                            <p className="text-[10px] tracking-[0.18em] text-white/50">牌意解读</p>
                            <p className="mt-1.5 text-[13px] leading-5 text-white/82">
                              这组梦像一张“正在靠近内心深处”的牌。月亮带来陪伴和感受力，海浪代表情绪缓慢起伏，楼梯象征你正在向新的阶段靠近，鲸鱼则像藏在深处的大想象力，提醒你最近的梦很适合被认真记下来。
                            </p>
                          </div>

                          <div className="mt-3 rounded-[18px] border border-white/10 bg-black/18 px-3.5 py-3 text-left">
                            <p className="text-[10px] tracking-[0.18em] text-white/50">今日提示</p>
                            <p className="mt-1.5 text-[13px] leading-5 text-white/76">
                              如果下次又梦到这几个意象，可以补记一件事: 你在梦里是往上走、往前游，还是只是远远地看见它们。方向，常常比意象本身更有解释力。
                            </p>
                          </div>

                          <div className="mt-auto flex justify-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] text-white/78">
                              <Brain className="h-3 w-3" />
                              再点一次翻回牌面
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
