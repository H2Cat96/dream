import { motion } from 'framer-motion';
import { useState } from 'react';

const monthData = [
  { month: '1月', color: '#ffd78a', bg: '#fff4df', started: true },
  { month: '2月', color: '#8fb4ff', bg: '#eaf1ff', started: true },
  { month: '3月', color: '#cda2ff', bg: '#f4eaff', started: true },
  { month: '4月', color: '#ff9e9e', bg: '#ffeaea', started: true },
  { month: '5月', color: '#8ab6f5', bg: '#d9e7ff', started: false },
  { month: '6月', color: '#a986f6', bg: '#e5d7ff', started: false },
  { month: '7月', color: '#ffd78a', bg: '#fff4df', started: false },
  { month: '8月', color: '#8fb4ff', bg: '#eaf1ff', started: false },
  { month: '9月', color: '#e9648a', bg: '#ffd4e1', started: false },
  { month: '10月', color: '#cda2ff', bg: '#f4eaff', started: false },
  { month: '11月', color: '#8ab6f5', bg: '#d9e7ff', started: false },
  { month: '12月', color: '#ffd78a', bg: '#fff4df', started: false },
];

export function WeekSelector() {
  const [selectedMonth, setSelectedMonth] = useState('4月');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mx-5 overflow-x-auto pb-1 scrollbar-hide"
    >
      <div className="flex min-w-max gap-2">
        {monthData.map((item) => {
          const isSelected = selectedMonth === item.month;
          const isLocked = !item.started;

          return (
            <motion.button
              key={item.month}
              onClick={() => setSelectedMonth(item.month)}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <motion.div
                className="flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-semibold"
                animate={{
                  backgroundColor: isSelected
                    ? item.color
                    : isLocked
                      ? '#1A1A1A'
                      : item.bg,
                  borderColor: isSelected
                    ? item.color
                    : isLocked
                      ? '#1A1A1A'
                      : 'rgba(30,22,51,0.06)',
                  color: isSelected
                    ? '#ffffff'
                    : isLocked
                      ? '#ffffff'
                      : '#3b3350',
                }}
                transition={{ duration: 0.2 }}
              >
                {item.month.replace('月', '')}
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
