import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MobileFrameProps {
  children: ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[393px] h-[852px] bg-app-bg rounded-[50px] overflow-hidden shadow-2xl"
        style={{
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25), 0 10px 30px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Phone Frame Border */}
        <div className="absolute inset-0 rounded-[50px] border-[8px] border-gray-800 pointer-events-none z-50" />
        
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-50" />
        
        {/* Screen Content */}
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
