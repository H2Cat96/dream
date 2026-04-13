import { motion } from 'framer-motion';
import { ChevronLeft, ExternalLink, Sparkles } from 'lucide-react';

interface ParticleFxPageProps {
  onBack: () => void;
}

export function ParticleFxPage({ onBack }: ParticleFxPageProps) {
  const particleUrl = 'http://localhost:3000/';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-full min-h-[852px] overflow-hidden bg-[#05050a] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(162,139,255,0.14),transparent_30%),linear-gradient(180deg,rgba(6,6,14,0.24)_0%,rgba(6,6,14,0.78)_100%)]" />

      <div className="relative z-10 flex items-center justify-between px-5 pt-6 pb-4">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 backdrop-blur-md"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-white/76 backdrop-blur-md">
          梦境内部星图
        </div>
        <a
          href={particleUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 backdrop-blur-md"
        >
          <ExternalLink className="h-4.5 w-4.5" />
        </a>
      </div>

      <div className="relative z-10 px-5">
        <div className="mb-4 rounded-[24px] border border-white/10 bg-white/6 p-3.5 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffe7a1]/14">
              <Sparkles className="h-4.5 w-4.5 text-[#ffe7a1]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">已进入梦境粒子示例</p>
              <p className="mt-1 text-xs leading-5 text-white/64">
                这里承载的是你提供的 `particle-fx` 示例界面，后续可以继续把它梦境化、儿童化。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 h-[calc(100%-118px)] px-4 pb-4">
        <div className="h-full overflow-hidden rounded-[30px] border border-white/10 bg-black shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <iframe
            title="particle-fx"
            src={particleUrl}
            className="h-full w-full bg-black"
          />
        </div>
      </div>
    </motion.div>
  );
}
