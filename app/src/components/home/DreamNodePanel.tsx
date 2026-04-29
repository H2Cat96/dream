import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, X } from 'lucide-react';
import type { HomeDreamNode } from '../../lib/prototypeData';

type DreamNodePanelProps = {
  node: HomeDreamNode | null;
  open: boolean;
  onClose: () => void;
};

export function DreamNodePanel({ node, open, onClose }: DreamNodePanelProps) {
  if (!open || !node) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40"
    >
      <button
        type="button"
        aria-label="关闭梦节点面板"
        onClick={onClose}
        className="absolute inset-0 bg-black/34 backdrop-blur-[1px]"
      />

      <motion.section
        initial={{ y: 22, opacity: 0.25 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-4 top-[16%] overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(21,24,40,0.96)_0%,rgba(10,12,20,0.94)_100%)] text-white shadow-[0_20px_42px_rgba(0,0,0,0.34)]"
      >
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/7 text-white/76"
              aria-label="返回"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <p className="text-[11px] text-white/56">梦节点面板</p>
              <h2 className="text-[16px] font-semibold">{node.label}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/7 text-white/76"
            aria-label="关闭梦节点"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] text-white/54">梦境节点</p>
                <p className="mt-1 text-[19px] font-semibold">{node.dreams} 个梦</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b9c8ff]/14">
                <Sparkles className="h-4.5 w-4.5 text-[#d8e1ff]" />
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-6 text-white/78">{node.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[18px] border border-white/10 bg-white/6 p-3">
              <p className="text-[11px] text-white/52">当前情绪</p>
              <p className="mt-1 text-[14px] font-medium">{node.mood}</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/6 p-3">
              <p className="text-[11px] text-white/52">节点编号</p>
              <p className="mt-1 text-[14px] font-medium">{node.id}</p>
            </div>
          </div>

          <div className="rounded-[18px] border border-white/10 bg-white/6 p-3">
            <p className="text-[11px] text-white/52">关联关键词</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {node.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] text-white/74">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
