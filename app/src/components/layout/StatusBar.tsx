import { Signal, Wifi, Battery } from 'lucide-react';

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-2">
      <span className="text-sm font-semibold text-neutral-black">9:41</span>
      <div className="flex items-center gap-1">
        <Signal className="w-4 h-4 text-neutral-black" />
        <Wifi className="w-4 h-4 text-neutral-black" />
        <Battery className="w-5 h-5 text-neutral-black" />
      </div>
    </div>
  );
}
