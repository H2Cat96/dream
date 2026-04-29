import { motion } from 'framer-motion';

type MonthButton = {
  id: string;
  label: string;
  color: string;
  status: 'active' | 'locked';
};

interface WeekSelectorProps {
  selectedMonth: string;
  months: MonthButton[];
  onSelect: (monthId: string) => void;
}

export function WeekSelector({ selectedMonth, months, onSelect }: WeekSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mx-5 overflow-x-auto pb-1 scrollbar-hide"
    >
      <div className="flex min-w-max gap-2">
        {months.map((month) => {
          const isSelected = selectedMonth === month.id;
          const isLocked = month.status === 'locked';

          return (
            <motion.button
              key={month.id}
              type="button"
              aria-label={month.label}
              disabled={isLocked}
              onClick={() => {
                if (!isLocked) {
                  onSelect(month.id);
                }
              }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center disabled:cursor-not-allowed"
            >
              <motion.div
                className="flex min-w-[42px] items-center justify-center rounded-full border px-3 py-2 text-[11px] font-semibold"
                animate={{
                  backgroundColor: isLocked ? '#1A1A1A' : isSelected ? month.color : '#f4efff',
                  borderColor: isLocked ? '#1A1A1A' : isSelected ? month.color : 'rgba(30,22,51,0.06)',
                  color: isLocked || isSelected ? '#ffffff' : '#3b3350',
                }}
                transition={{ duration: 0.2 }}
              >
                {month.label.replace(' ', '')}
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
