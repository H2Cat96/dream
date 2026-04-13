import { motion } from 'framer-motion';

export function MoodTipCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mx-5 rounded-[28px] p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F8C8DC 0%, #D4A5E0 100%)',
      }}
    >
      <div className="relative z-10 max-w-[65%]">
        <p className="text-xs text-neutral-black/70 mb-1">今晚提示</p>
        <h3 className="text-lg font-bold text-neutral-black leading-tight">
          重复出现的人物与场景，往往比情节更值得记录
        </h3>
      </div>
      
      {/* 3D Characters */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-[35%]">
        <motion.img
          src="/characters/orange-star.png"
          alt=""
          className="absolute right-8 -top-4 w-12 h-12 object-contain"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.img
          src="/characters/purple-circle.png"
          alt=""
          className="absolute right-2 top-2 w-10 h-10 object-contain"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <motion.img
          src="/characters/red-boom.png"
          alt=""
          className="absolute right-10 top-6 w-10 h-10 object-contain"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
