import { motion } from 'framer-motion';

export function HealthInsuranceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mx-5 rounded-[28px] p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F8C8DC 0%, #D4A5E0 100%)',
      }}
    >
      <div className="relative z-10">
        <p className="text-sm text-neutral-black/70 mb-1">梦境速记</p>
        <h2 className="text-xl font-bold text-neutral-black leading-tight mb-4 max-w-[60%]">
          趁记忆还温热, 快把梦里的画面写下来
        </h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-neutral-black text-white px-6 py-2.5 rounded-full text-sm font-medium"
        >
          立即记录
        </motion.button>
      </div>
      
      {/* 3D Characters */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-full">
        <motion.img
          src="/characters/purple-star.png"
          alt="Purple Star"
          className="absolute right-2 top-2 w-16 h-16 object-contain"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.img
          src="/characters/pink-boom.png"
          alt="Pink Boom"
          className="absolute right-8 bottom-4 w-14 h-14 object-contain"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.img
          src="/characters/purple-circle.png"
          alt="Purple Circle"
          className="absolute right-16 top-8 w-12 h-12 object-contain"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
