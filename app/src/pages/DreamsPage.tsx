import { motion } from 'framer-motion';
import { Bell, Check, ChevronDown, Clock3, MoonStar, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ArchiveDetailSheet } from '../components/dreams/ArchiveDetailSheet';
import { SpecimenDetailSheet } from '../components/dreams/SpecimenDetailSheet';
import { StatusBar } from '../components/layout/StatusBar';
import { archiveSpecimens } from '../lib/prototypeData';

const archiveEntries = [
  {
    id: 'whale-moon',
    title: '追着月亮奔跑的鲸鱼',
    time: '今天 03:18',
    summary: '海面像镜子一样发光，鲸鱼背上长着会响铃的月牙。',
    longSummary: '这页绘本把海浪写成了会发光的纸，鲸鱼从中间穿过去，月亮像被追逐的风筝一样挂在前方。',
    mood: '温柔发亮',
    accent: 'from-[#ffe4a8] via-[#ffc978] to-[#ffb47e]',
    chapter: '绘本档案 01',
    tags: ['月亮', '海浪', '鲸鱼'],
    coverImage:
      'https://plus.unsplash.com/premium_vector-1761390349550-ba0ba0492d27?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWxlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=900',
  },
  {
    id: 'spiral-staircase',
    title: '旋转楼梯通往云上教室',
    time: '昨天 06:42',
    summary: '每走上一层台阶，就会看见一朵新的云，云里坐着会说话的小动物。',
    longSummary: '楼梯在这页里不停转弯，像把梦境抬进更高的地方。每一层都换一束光，最后落进云上的教室。',
    mood: '奇异好奇',
    accent: 'from-[#c9d7ff] via-[#9aaeff] to-[#7c87ff]',
    chapter: '绘本档案 02',
    tags: ['楼梯', '云朵', '教室'],
    coverImage:
      'https://plus.unsplash.com/premium_vector-1714422862794-e598d918af0d?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWxlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=900',
  },
  {
    id: 'candy-rain',
    title: '糖果雨落进深蓝森林',
    time: '4 月 10 日',
    summary: '树叶像玻璃纸，脚下有软软的星光，空气里全是甜甜的声音。',
    longSummary: '这是一段更轻盈的记录，糖果像雨一样慢慢飘落，把森林染成了会发亮的深蓝色。',
    mood: '甜梦收藏',
    accent: 'from-[#f3c8ff] via-[#d6aaff] to-[#c89bff]',
    chapter: '绘本档案 03',
    tags: ['糖果雨', '森林', '星光'],
    coverImage:
      'https://plus.unsplash.com/premium_photo-1682308332903-f57dcdd7d194?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWxlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=900',
  },
  {
    id: 'pink-forest',
    title: '粉色森林里的小出口',
    time: '4 月 6 日',
    summary: '树叶像薄薄的彩纸，远处有一束粉色的风，把整片树林都照亮了。',
    longSummary: '这页被柔软的粉色包围着，像在森林尽头悄悄藏了一扇小门，等人慢慢走过去。',
    mood: '安静奇想',
    accent: 'from-[#ffd5ee] via-[#e5b6ff] to-[#c39dff]',
    chapter: '绘本档案 04',
    tags: ['森林', '出口', '粉色'],
    coverImage:
      'https://plus.unsplash.com/premium_vector-1725358564319-5d34244237ea?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWxlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=900',
  },
];

type MonthKey = '2026-02' | '2026-03' | '2026-04';

type CalendarDay = {
  day: number;
  type?: keyof typeof dreamTypes;
};

const dreamTypes = {
  reality: { label: '现实梦', color: '#8fb4ff', bg: 'bg-[#eaf1ff]', text: 'text-[#5673b7]' },
  prophecy: { label: '预言梦', color: '#cda2ff', bg: 'bg-[#f4eaff]', text: 'text-[#7b58af]' },
  nightmare: { label: '噩梦', color: '#ff9e9e', bg: 'bg-[#ffeaea]', text: 'text-[#b45a5a]' },
  sweet: { label: '甜梦', color: '#ffd78a', bg: 'bg-[#fff4df]', text: 'text-[#a6781f]' },
} as const;

const calendarMonths: Record<MonthKey, { label: string; offset: number; days: CalendarDay[] }> = {
  '2026-02': {
    label: '2026 年 2 月',
    offset: 0,
    days: [
      { day: 1, type: 'sweet' }, { day: 2 }, { day: 3, type: 'reality' }, { day: 4 }, { day: 5 }, { day: 6, type: 'prophecy' }, { day: 7 },
      { day: 8 }, { day: 9 }, { day: 10, type: 'nightmare' }, { day: 11 }, { day: 12 }, { day: 13, type: 'sweet' }, { day: 14 },
      { day: 15 }, { day: 16, type: 'reality' }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20, type: 'prophecy' }, { day: 21 },
      { day: 22 }, { day: 23 }, { day: 24, type: 'nightmare' }, { day: 25 }, { day: 26 }, { day: 27, type: 'sweet' }, { day: 28 },
    ],
  },
  '2026-03': {
    label: '2026 年 3 月',
    offset: 0,
    days: [
      { day: 1 }, { day: 2, type: 'reality' }, { day: 3 }, { day: 4 }, { day: 5, type: 'sweet' }, { day: 6 }, { day: 7 },
      { day: 8, type: 'prophecy' }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12, type: 'nightmare' }, { day: 13 }, { day: 14 },
      { day: 15, type: 'sweet' }, { day: 16 }, { day: 17, type: 'reality' }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21, type: 'prophecy' },
      { day: 22 }, { day: 23 }, { day: 24 }, { day: 25, type: 'nightmare' }, { day: 26 }, { day: 27 }, { day: 28, type: 'sweet' },
      { day: 29 }, { day: 30, type: 'reality' }, { day: 31 },
    ],
  },
  '2026-04': {
    label: '2026 年 4 月',
    offset: 3,
    days: [
      { day: 1 }, { day: 2, type: 'sweet' }, { day: 3 }, { day: 4 }, { day: 5, type: 'reality' }, { day: 6 }, { day: 7 },
      { day: 8 }, { day: 9, type: 'prophecy' }, { day: 10 }, { day: 11, type: 'nightmare' }, { day: 12 }, { day: 13 }, { day: 14, type: 'sweet' },
      { day: 15 }, { day: 16 }, { day: 17, type: 'reality' }, { day: 18 }, { day: 19, type: 'sweet' }, { day: 20 }, { day: 21 },
      { day: 22, type: 'prophecy' }, { day: 23 }, { day: 24 }, { day: 25, type: 'nightmare' }, { day: 26 }, { day: 27, type: 'reality' }, { day: 28 },
      { day: 29 }, { day: 30, type: 'sweet' },
    ],
  },
};

export function DreamsPage() {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>('2026-04');
  const [selectedDay, setSelectedDay] = useState(22);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [activeArchiveId, setActiveArchiveId] = useState<string | null>(null);
  const [activeSpecimenId, setActiveSpecimenId] = useState<string | null>(null);

  const currentMonth = calendarMonths[selectedMonth];
  const selectedDream = currentMonth.days.find((item) => item.day === selectedDay);
  const selectedType = selectedDream?.type ? dreamTypes[selectedDream.type] : null;
  const activeArchive = archiveEntries.find((entry) => entry.id === activeArchiveId) ?? null;
  const activeSpecimen = archiveSpecimens.find((specimen) => specimen.id === activeSpecimenId) ?? null;

  const handleMonthChange = (month: MonthKey) => {
    const nextMonth = calendarMonths[month];
    setSelectedMonth(month);
    setMonthPickerOpen(false);
    setSelectedDay(nextMonth.days.find((item) => item.type)?.day ?? nextMonth.days[0].day);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative min-h-full bg-[linear-gradient(180deg,#f8f4ff_0%,#f4efe6_100%)] pb-28"
    >
      <StatusBar />

      <div className="flex items-start justify-between px-5 py-3">
        <div>
          <h1 className="text-[25px] font-bold leading-tight text-[#1c1630]">翻一翻你收集过的梦</h1>
          <p className="mt-1.5 max-w-[82%] text-[13px] leading-5 text-[#6f667f]">每一条梦境都被整理成一张小档案，安静地存放在这里。</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-sm"
          type="button"
        >
          <Bell className="h-5 w-5 text-[#1c1630]" />
        </motion.button>
      </div>

      <div className="px-5">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="relative overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(29,20,53,0.95)_0%,rgba(54,42,88,0.92)_55%,rgba(34,26,58,0.96)_100%)] p-4 text-white shadow-[0_20px_50px_rgba(32,21,60,0.22)]"
        >
          <div className="absolute right-[-28px] top-[-20px] h-24 w-24 rounded-full bg-[#ffd56a]/18 blur-2xl" />
          <div className="absolute left-[-10px] bottom-[-12px] h-16 w-16 rounded-full bg-[#91a7ff]/15 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/76">
              <MoonStar className="h-4 w-4 text-[#ffe39b]" />
              <span className="text-xs">馆藏概览</span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[34px] font-bold leading-none tracking-[-0.04em]">128</p>
                <p className="mt-1 text-xs text-white/70">已存档梦境</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 px-3 py-1.5 text-right backdrop-blur-sm">
                <p className="text-xs text-white/62">最近入馆</p>
                <p className="mt-0.5 text-xs font-semibold">今天凌晨 03:18</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-white/76">
              <Sparkles className="h-4 w-4 text-[#ffe39b]" />
              <span className="text-xs font-semibold">意象标本</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {archiveSpecimens.map((specimen) => (
                <button
                  key={specimen.id}
                  type="button"
                  onClick={() => {
                    setActiveArchiveId(null);
                    setActiveSpecimenId(specimen.id);
                  }}
                  aria-label={`查看标本 ${specimen.title}`}
                  className="rounded-[20px] border border-white/12 bg-white/9 p-2.5 text-left transition-transform active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br ${specimen.accent}`}>
                      <span className="text-base font-bold text-white drop-shadow-sm">{specimen.title.slice(0, 1)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{specimen.title}</p>
                      <p className="mt-0.5 text-[11px] text-white/58">{specimen.count}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-5 px-5">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="rounded-[28px] border border-[#1e1633]/8 bg-white/86 p-4 shadow-[0_12px_28px_rgba(48,37,84,0.08)]"
        >
          <div className="relative flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#1c1630]">梦境馆历</h2>
            <button
              type="button"
              onClick={() => setMonthPickerOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-full bg-[#f4efff] px-3 py-1.5 text-sm text-[#5f5378]"
            >
              {currentMonth.label}
              <ChevronDown className={`h-4 w-4 transition-transform ${monthPickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {monthPickerOpen && (
              <div className="absolute right-0 top-11 z-20 min-w-[150px] rounded-2xl border border-[#1e1633]/8 bg-white p-2 shadow-[0_12px_30px_rgba(48,37,84,0.12)]">
                {(Object.keys(calendarMonths) as MonthKey[]).map((month) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthChange(month)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-[#4e4268] hover:bg-[#f6f1ff]"
                  >
                    {calendarMonths[month].label}
                    {selectedMonth === month && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1.5 text-center text-[11px] text-[#8b819b]">
            {['日', '一', '二', '三', '四', '五', '六'].map((weekDay) => (
              <div key={weekDay}>{weekDay}</div>
            ))}
          </div>

          <div className="mt-2.5 grid grid-cols-7 gap-1.5">
            {Array.from({ length: currentMonth.offset }).map((_, empty) => (
              <div key={`empty-${empty}`} className="h-9" />
            ))}
            {currentMonth.days.map((item) => {
              const type = item.type ? dreamTypes[item.type] : null;
              const isSelected = selectedDay === item.day;

              return (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => setSelectedDay(item.day)}
                  className={`relative h-9 rounded-[16px] border text-[13px] transition-all ${
                    isSelected
                      ? 'text-white shadow-[0_8px_18px_rgba(31,23,53,0.18)]'
                      : 'border-[#1e1633]/8 bg-[#faf8ff] text-[#31294a]'
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: type?.color ?? '#1f1735',
                          backgroundColor: type?.color ?? '#1f1735',
                        }
                      : undefined
                  }
                >
                  <span>{item.day}</span>
                  {type && (
                    <span
                      className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
                      style={{ backgroundColor: isSelected ? '#ffffff' : type.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-[20px] bg-[#f7f3ff] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[#261d3f]">
                {currentMonth.label} {selectedDay} 日档案
              </p>
              {selectedType ? (
                <div className={`rounded-full px-3 py-1 text-xs ${selectedType.bg} ${selectedType.text}`}>{selectedType.label}</div>
              ) : (
                <div className="rounded-full bg-white px-3 py-1 text-xs text-[#8b819b]">暂无标签</div>
              )}
            </div>
            <p className="mt-1.5 text-[13px] leading-5 text-[#6e647f]">
              {selectedType
                ? '这一天的梦境已经归档完成，你可以通过颜色快速分辨梦的类型。'
                : '这一天还没有记录梦境，可以在梦境宇宙页点击中间按钮新建一条梦。'}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 px-5">
        <h2 className="text-lg font-bold text-[#1c1630]">档案陈列</h2>
      </div>

      <div className="mt-3 space-y-4 px-5">
        {archiveEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
            className="rounded-[30px] border border-[#1e1633]/8 bg-white/90 p-3 shadow-[0_16px_34px_rgba(48,37,84,0.10)] backdrop-blur-sm"
          >
            <div className="flex gap-3">
              <div className="relative w-[114px] shrink-0 overflow-hidden rounded-[24px] shadow-[0_14px_24px_rgba(56,42,102,0.16)]">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${entry.coverImage})` }} />
                <div className={`absolute inset-0 bg-gradient-to-b ${entry.accent} opacity-70 mix-blend-multiply`} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.08)_0%,rgba(8,8,12,0.62)_100%)]" />
                <div className="relative flex min-h-[144px] h-full flex-col justify-between p-3 text-white">
                  <div className="flex items-start justify-between gap-2">
                    <div className="rounded-full bg-white/18 px-2 py-1 text-[10px] tracking-[0.04em] text-white/88 backdrop-blur-sm">
                      {entry.chapter}
                    </div>
                    <div className="rounded-full border border-white/20 bg-black/12 px-2 py-0.5 text-[10px] text-white/78">封面</div>
                  </div>
                  <div>
                    <p className="text-[11px] text-white/82">绘梦星球绘本</p>
                    <h3 className="mt-1 text-[17px] font-semibold leading-tight drop-shadow-sm">{entry.title}</h3>
                  </div>
                </div>
              </div>

              <div className="min-w-0 flex-1 py-1">
                <div className="flex items-center gap-2 text-xs text-[#7c718d]">
                  <Clock3 className="h-3.5 w-3.5" />
                  {entry.time}
                </div>
                <p className="mt-3 text-sm leading-6 text-[#6e647f]">{entry.summary}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="rounded-full bg-[#f3effc] px-3 py-1.5 text-xs text-[#6a5f80]">{entry.mood}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSpecimenId(null);
                      setActiveArchiveId(entry.id);
                    }}
                    aria-label={`打开绘本档案 ${entry.title}`}
                    className="rounded-full border border-[#1e1633]/10 bg-[#faf7ff] px-3 py-1.5 text-sm font-medium text-[#433a62]"
                  >
                    翻开绘本
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ArchiveDetailSheet
        entry={activeArchive}
        open={Boolean(activeArchive)}
        onClose={() => setActiveArchiveId(null)}
      />
      <SpecimenDetailSheet
        specimen={activeSpecimen}
        open={Boolean(activeSpecimen)}
        onClose={() => setActiveSpecimenId(null)}
      />
    </motion.div>
  );
}
