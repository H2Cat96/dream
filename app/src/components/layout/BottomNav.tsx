import { motion } from 'framer-motion';
import { BookOpen, Brain, Mic, Orbit } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dreams' | 'home' | 'analytics';
  onTabChange: (tab: 'dreams' | 'home' | 'analytics') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const centerIcon = activeTab === 'home' ? Mic : Orbit;
  const navItems = [
    { id: 'dreams', icon: BookOpen },
    { id: 'home', icon: centerIcon },
    { id: 'analytics', icon: Brain },
  ] as const;

  return (
    <div className="absolute bottom-8 left-1/2 z-40 w-[85%] -translate-x-1/2">
      <div className="relative overflow-visible rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(20,20,24,0.78)_0%,rgba(10,10,14,0.72)_100%)] px-5 py-4 shadow-[0_20px_45px_rgba(0,0,0,0.30)] backdrop-blur-[18px]">
        <div className="pointer-events-none absolute inset-x-6 top-1 h-6 rounded-full bg-white/10 blur-md" />
        <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/8" />
        <div className="flex items-end justify-between">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const isCreate = item.id === 'home';
          
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                if (item.id === 'home' && activeTab === 'home') {
                  return;
                }
                onTabChange(item.id);
              }}
              whileTap={{ scale: isCreate ? 0.96 : 0.9 }}
              className={`relative flex flex-col items-center ${
                isCreate ? '-mt-8' : ''
              }`}
            >
              {isActive && !isCreate && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute inset-x-0 top-0 mx-auto h-11 w-11 rounded-full bg-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <div
                className={`relative z-10 flex items-center justify-center ${
                  isCreate
                    ? 'h-16 w-16 rounded-full border border-white/60 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.92),rgba(255,236,168,0.95)_45%,rgba(255,198,92,0.96)_100%)] shadow-[0_18px_35px_rgba(255,194,84,0.42)] ring-4 ring-white/25'
                    : isActive
                      ? 'h-11 w-11 rounded-full'
                      : 'h-11 w-11 rounded-full bg-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                }`}
              >
                {!isCreate && !isActive && (
                  <div className="pointer-events-none absolute inset-0 rounded-full border border-white/8" />
                )}
                <Icon
                  className={`transition-colors ${
                    isCreate
                      ? 'h-7 w-7 text-neutral-black'
                      : isActive
                        ? 'h-5 w-5 text-white'
                        : 'h-5 w-5 text-white/70'
                  }`}
                />
              </div>
            </motion.button>
          );
        })}
        </div>
      </div>
    </div>
  );
}
