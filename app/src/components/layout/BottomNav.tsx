import { motion } from 'framer-motion';
import { useState } from 'react';

interface BottomNavProps {
  activeTab: 'dreams' | 'home' | 'analytics';
  onTabChange: (tab: 'dreams' | 'home' | 'analytics') => void;
  onOpenSheep: () => void;
}

type FlatIconProps = {
  active?: boolean;
};

function StoryBookIcon({ active = false }: FlatIconProps) {
  const color = active ? '#17171b' : 'rgba(255,255,255,0.82)';

  return (
    <svg viewBox="0 0 1024 1024" className="h-8 w-8" aria-hidden="true">
      <path
        d="M724.906667 853.098667H299.093333A107.562667 107.562667 0 0 1 192 745.28V448.874667a107.52 107.52 0 0 1 107.093333-107.776h425.813334A107.562667 107.562667 0 0 1 832 448.874667v296.405333a107.605333 107.605333 0 0 1-107.093333 107.818667Zm2.56-554.666667H296.533333c-12.8 0-19.2-7.061333-19.2-21.205333v-.256c0-14.144 6.4-21.205333 19.2-21.205334h430.933334c12.821333 0 19.2 7.061333 19.2 21.205334v.256c0 14.144-6.378667 21.205333-19.2 21.205333Zm-63.082667-85.333333H359.616c-12.16 0-18.282667-6.997333-18.282667-20.992v-.213334c0-13.994667 6.101333-20.992 18.282667-20.992h304.768c12.16 0 18.282667 6.997333 18.282667 20.992v.213334c0 13.994667-6.101333 20.992-18.282667 20.992ZM618.666667 618.666667H405.333333v-64a21.333333 21.333333 0 0 0-42.666666 0v85.333333a21.333333 21.333333 0 0 0 21.333333 21.333333h256a21.333333 21.333333 0 0 0 21.333333-21.333333v-85.333333a21.333333 21.333333 0 0 0-42.666666 0v64Z"
        fill={color}
      />
    </svg>
  );
}

function MoonMagicIcon({ active = false }: FlatIconProps) {
  const color = active ? '#17171b' : 'rgba(255,255,255,0.82)';

  return (
    <svg viewBox="0 0 1024 1024" className="h-7 w-7" aria-hidden="true">
      <path
        d="m523.52 453.632-107.2-32.256a29.888 29.888 0 0 1-20.416-37.632 30.08 30.08 0 0 1 11.712-15.552l137.152-93.952a29.76 29.76 0 0 0 13.12-24.896l-2.176-162.56A30.528 30.528 0 0 1 586.304 56.32a31.68 31.68 0 0 1 18.944 5.952l134.656 97.28a31.872 31.872 0 0 0 28.48 4.352l159.104-52.224a31.232 31.232 0 0 1 39.296 18.816 29.12 29.12 0 0 1 0 19.264l-53.952 154.048a29.248 29.248 0 0 0 4.544 27.584l100.48 130.368a29.44 29.44 0 0 1-6.336 41.984 31.68 31.68 0 0 1-18.944 5.952l-167.936-2.048a31.36 31.36 0 0 0-25.728 12.672l-96.96 132.8a31.68 31.68 0 0 1-43.264 7.168 30.08 30.08 0 0 1-11.712-15.616L615.872 547.84 222.784 987.2a112.832 112.832 0 0 1-161.408 5.568 104.448 104.448 0 0 1 5.76-156.224L523.52 453.632ZM115.648 448C51.84 448 0 397.824 0 336S51.84 224 115.648 224c63.936 0 115.712 50.176 115.712 112S179.52 448 115.648 448Zm268.736-320c-36.48 0-66.112-28.672-66.112-64s29.632-64 66.112-64c36.48 0 66.112 28.672 66.112 64s-29.632 64-66.112 64Zm478.208 800c-63.872 0-115.648-50.176-115.648-112S798.72 704 862.592 704c63.872 0 115.712 50.176 115.712 112s-51.84 112-115.712 112Z"
        fill={color}
      />
    </svg>
  );
}

function SheepFaceIcon({ active = false }: FlatIconProps) {
  const color = active ? '#17171b' : 'rgba(255,255,255,0.82)';

  return (
    <svg viewBox="0 0 1024 1024" className="h-7 w-7" aria-hidden="true">
      <path
        d="M331.776 507.904H172.032q-48.128-37.888-72.704-90.624t-27.648-105.984 13.824-101.888 51.712-78.848 86.016-35.84 115.712 25.088q61.44 29.696 102.912 90.112t69.12 138.24q26.624-77.824 68.096-138.24t102.912-90.112q65.536-30.72 116.736-25.088t86.016 35.84 51.712 78.848 13.824 101.888-27.648 105.984-72.704 90.624H689.152q13.312-23.552 24.576-43.008 9.216-17.408 17.92-32.256t10.752-19.968q3.072-7.168 11.264-30.208t11.776-45.056-2.56-33.28-32.768 6.144q-35.84 23.552-58.88 72.192t-37.376 104.96-20.992 111.104-10.752 91.648-7.168 77.312-5.12 73.216q-3.072 39.936-4.096 76.8H445.44q-1.024-36.864-4.096-76.8-2.048-32.768-5.632-73.216t-7.68-77.312-10.752-91.648-20.992-111.104-37.376-104.96-58.88-72.192q-26.624-17.408-32.768-6.144t-2.56 33.28 11.776 45.056 11.264 30.208q2.048 5.12 10.752 19.968t17.92 32.256q11.264 19.456 24.576 43.008Z"
        fill={color}
      />
    </svg>
  );
}

function VoiceIcon({ recording = false }: { recording?: boolean }) {
  return (
    <svg viewBox="0 0 1024 1024" className={`h-8 w-8 ${recording ? 'text-[#d9362c]' : 'text-neutral-black'}`} aria-hidden="true">
      <path
        d="M868.847849 461.029118c0 177.22947-134.214794 326.877769-308.185035 350.078167l2.316765 108.726284h152.934135c26.883277 0 50.977022 24.593118 50.977022 50.977022 0 26.38595-17.150612 50.977022-44.033889 50.977022H301.14213c-26.883277 0-44.033889-24.591071-44.033889-50.977022 0-26.383904 24.094768-50.977022 50.978045-50.977022h152.934135l2.315742-108.726284c-173.968194-23.200398-308.185035-172.848697-308.185035-350.078167v3.284813-.100284c0-26.435069 15.631002-54.16462 50.978045-54.16462 39.503712 0 50.977022 24.593118 50.977022 50.978045.074701 140.737348 111.589494 254.842129 254.890224 254.891248 143.301753-.050142 254.81757-114.154923 254.891248-254.891248 0-26.384927 24.095791-50.978045 50.979068-50.978045 26.882254 0 50.977022 27.728528 50.977022 54.16462v.100284c.00307.099261.00307-3.385097.00307-3.284813ZM511.999488 639.451764c-107.507526 0-178.423669-72.832795-178.423669-178.422645V180.648336c0-105.57757 70.917166-178.435948 178.423669-178.435948 107.509573 0 178.423669 72.858378 178.423669 178.435948v280.380782c0 105.58985-70.916143 178.422645-178.423669 178.422646Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UniverseIcon() {
  return (
    <svg viewBox="0 0 1024 1024" className="h-8 w-8 text-neutral-black" aria-hidden="true">
      <path
        d="M875.946667 296.106667c-65.28 90.325333-160.597333 200.746667-271.018667 311.125333-25.088 25.088-173.141333 170.666667-311.125333 268.501333a418.986667 418.986667 0 0 0 220.8 62.72c235.861333 0 424.064-188.16 424.064-421.546666 0-80.298667-22.613333-158.08-62.72-220.8Zm-253.44 489.301333a56.746667 56.746667 0 0 1-57.728-57.728 56.746667 56.746667 0 0 1 57.728-57.685333 56.746667 56.746667 0 0 1 57.728 57.685333 56.746667 56.746667 0 0 1-57.728 57.728ZM843.306667 250.88c57.728-80.256 82.816-140.501333 65.28-158.08A28.501333 28.501333 0 0 0 888.448 85.333333c-27.605333 0-80.298667 27.605333-148.053333 75.264a220.330667 220.330667 0 0 0-25.088-15.061333c-7.509333-4.992-17.578667-7.509333-27.605334-12.544-52.693333-22.570667-110.421333-37.632-173.141333-37.632-230.826667 0-419.029333 188.202667-419.029333 421.546667 0 62.72 12.544 120.448 37.632 173.141333 5.034667 10.026667 7.552 17.578667 12.544 27.605333 5.034667 7.552 10.026667 15.061333 15.061333 25.088-60.202667 85.333333-87.808 148.053333-70.272 165.632a36.266667 36.266667 0 0 0 17.578667 4.992c27.605333 0 77.781333-25.088 143.018666-70.229333 87.808-60.245333 200.746667-158.122667 318.677334-273.493333 115.413333-117.973333 210.773333-230.869333 273.493333-318.72Zm-511.872 338.773333a72.832 72.832 0 0 1 0-145.536c40.149333 0 72.789333 32.597333 72.789333 72.746667 0 40.149333-30.122667 72.789333-72.789333 72.789333Zm132.992-193.237333a89.941333 89.941333 0 0 1-90.325334-90.325333c0-50.176 40.106667-90.325333 90.325334-90.325334 50.176 0 90.325333 40.149333 90.325333 90.325334 0 50.176-40.106667 90.325333-90.325333 90.325333Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DreamActionIcon({ isHome, recording }: { isHome: boolean; recording: boolean }) {
  if (isHome) {
    return <VoiceIcon recording={recording} />;
  }

  return <UniverseIcon />;
}

export function BottomNav({ activeTab, onTabChange, onOpenSheep }: BottomNavProps) {
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const navItems = [
    { id: 'dreams', label: '查看梦境档案', icon: StoryBookIcon },
    { id: 'analytics', label: '进入释梦', icon: MoonMagicIcon },
    { id: 'sheep', label: '打开小羊助手', icon: SheepFaceIcon },
  ] as const;

  return (
    <div className="absolute bottom-8 left-1/2 z-40 flex w-[90%] -translate-x-1/2 items-center justify-between gap-3">
      <div className="relative flex flex-1 items-center justify-between rounded-full border border-white/12 bg-[#09090b] px-4 py-3 shadow-[0_18px_38px_rgba(0,0,0,0.26)]">
        <div className="pointer-events-none absolute inset-x-5 top-1 h-5 rounded-full bg-white/8 blur-md" />
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              type="button"
              aria-label={item.label}
              onClick={() => {
                if (item.id === 'sheep') {
                  onOpenSheep();
                  return;
                }
                onTabChange(item.id);
              }}
              whileTap={{ scale: 0.92 }}
              className="relative flex h-11 w-11 items-center justify-center rounded-full"
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: 'spring', stiffness: 520, damping: 32 }}
                />
              )}
              <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full ${isActive ? '' : 'bg-white/5'}`}>
                <Icon active={isActive} />
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        type="button"
        aria-label={activeTab === 'home' ? '语音讲梦' : '进入梦境宇宙'}
        aria-pressed={activeTab === 'home' ? isVoiceRecording : undefined}
        onPointerDown={(event) => {
          if (activeTab !== 'home') return;
          event.preventDefault();
          setIsVoiceRecording(true);
          window.dispatchEvent(new CustomEvent('dream-voice-hold-start'));
        }}
        onPointerUp={(event) => {
          if (activeTab !== 'home') return;
          event.preventDefault();
          setIsVoiceRecording(false);
        }}
        onPointerCancel={() => {
          if (activeTab !== 'home') return;
          setIsVoiceRecording(false);
        }}
        onPointerLeave={() => {
          if (activeTab !== 'home' || !isVoiceRecording) return;
          setIsVoiceRecording(false);
        }}
        onClick={() => {
          if (activeTab !== 'home') {
            onTabChange('home');
          }
        }}
        whileTap={{ scale: 0.94 }}
        className={`relative flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full border-[5px] border-[#09090b] shadow-[0_14px_30px_rgba(0,0,0,0.18)] ${
          isVoiceRecording ? 'bg-[#fff0ed]' : 'bg-white'
        }`}
      >
        {isVoiceRecording && (
          <motion.span
            className="absolute inset-[-8px] rounded-full border border-[#ff6b5d]/50"
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        {isVoiceRecording && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ff4d42]" />}
        <DreamActionIcon isHome={activeTab === 'home'} recording={isVoiceRecording} />
      </motion.button>
    </div>
  );
}
