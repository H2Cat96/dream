import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const moodData = [
  { day: 'Mon', happiness: 51, calmness: 30, anger: 10, excitement: 40, sadness: 20, stress: 35 },
  { day: 'Tue', happiness: 40, calmness: 72, anger: 15, excitement: 30, sadness: 25, stress: 20 },
  { day: 'Wed', happiness: 60, calmness: 45, anger: 20, excitement: 68, sadness: 15, stress: 25 },
  { day: 'Thu', happiness: 35, calmness: 25, anger: 25, excitement: 20, sadness: 30, stress: 15 },
  { day: 'Fri', happiness: 70, calmness: 50, anger: 10, excitement: 85, sadness: 10, stress: 20 },
  { day: 'Sat', happiness: 80, calmness: 60, anger: 5, excitement: 86, sadness: 8, stress: 15 },
  { day: 'Sun', happiness: 65, calmness: 55, anger: 8, excitement: 79, sadness: 12, stress: 50 },
];

const moodColors = {
  happiness: 'bg-app-purple',
  calmness: 'bg-app-orange',
  anger: 'bg-app-red',
  excitement: 'bg-app-blue',
  sadness: 'bg-app-yellow',
  stress: 'bg-app-purple-dark',
};

const moodLabels = [
  { key: 'happiness', label: '愉悦', color: 'bg-app-purple' },
  { key: 'calmness', label: '平静', color: 'bg-app-orange' },
  { key: 'anger', label: '压迫', color: 'bg-app-red' },
  { key: 'excitement', label: '奇异', color: 'bg-app-blue' },
  { key: 'sadness', label: '失落', color: 'bg-app-yellow' },
  { key: 'stress', label: '紧张', color: 'bg-app-purple-dark' },
];

export function SatisfactionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mx-5 bg-white rounded-[28px] p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-black">梦境情绪曲线</h3>
          <p className="text-xs text-gray-500">基于每次记录中的情绪标签</p>
        </div>
        <button className="flex items-center gap-1 bg-neutral-black text-white px-3 py-1.5 rounded-full text-xs">
          本周
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between h-40 mb-4 gap-1">
        {moodData.map((day, dayIndex) => (
          <div key={day.day} className="flex flex-col items-center flex-1">
            <div className="flex items-end gap-[2px] h-32 w-full justify-center">
              {Object.entries(moodColors).map(([mood, color]) => {
                const value = day[mood as keyof typeof day] as number;
                return (
                  <motion.div
                    key={mood}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ 
                      duration: 0.8, 
                      delay: dayIndex * 0.1 + 0.5,
                      ease: 'easeOut'
                    }}
                    className={`w-2 ${color} rounded-full`}
                  />
                );
              })}
            </div>
            <span className="text-[10px] text-gray-500 mt-1">{day.day}</span>
          </div>
        ))}
      </div>

      {/* Percentage Labels */}
      <div className="flex justify-between mb-3 px-1">
        <span className="text-xs font-medium text-app-purple">51%</span>
        <span className="text-xs font-medium text-app-orange">72%</span>
        <span className="text-xs font-medium text-app-purple">68%</span>
        <span className="text-xs font-medium text-app-red">25%</span>
        <span className="text-xs font-medium text-app-purple">85%</span>
        <span className="text-xs font-medium text-app-purple">86%</span>
        <span className="text-xs font-medium text-app-blue">79%</span>
        <span className="text-xs font-medium text-app-red">50%</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {moodLabels.map((mood) => (
          <div key={mood.key} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${mood.color}`} />
            <span className="text-[10px] text-gray-600">{mood.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
