# Sheep Agent Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a playful sheep pet entry fixed on every page that opens an in-frame side chat drawer with voice and text demo inputs.

**Architecture:** Add one global floating trigger and one shared drawer at the app shell level so all pages inherit the same sheep interaction. Keep the drawer purely prototype-grade with local fake conversation state and no backend integration.

**Tech Stack:** React, TypeScript, Framer Motion, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Add the failing sheep-entry interaction test

**Files:**
- Modify: `app/src/__tests__/prototypeInteractions.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it('opens the sheep drawer and shows voice and text inputs', async () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /打开小羊助手/i }));

  expect(await screen.findByText('咩，想让我帮你看看这个梦吗？')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /按住说话/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('和小羊说点什么')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm run test -- prototypeInteractions.test.tsx`
Expected: FAIL because the sheep entry and drawer do not exist yet.

### Task 2: Add a global sheep trigger and drawer

**Files:**
- Create: `app/src/components/assistant/SheepAgentButton.tsx`
- Create: `app/src/components/assistant/SheepAgentDrawer.tsx`
- Modify: `app/src/App.tsx`

- [ ] **Step 1: Create the floating sheep trigger**

```tsx
// app/src/components/assistant/SheepAgentButton.tsx
import { motion } from 'framer-motion';

interface SheepAgentButtonProps {
  onClick: () => void;
}

export function SheepAgentButton({ onClick }: SheepAgentButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label="打开小羊助手"
      onClick={onClick}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
      transition={{ opacity: { duration: 0.25 }, x: { duration: 0.25 }, y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } }}
      whileTap={{ scale: 0.96 }}
      className="absolute right-[-10px] bottom-32 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-white/18 bg-[linear-gradient(180deg,rgba(24,24,32,0.86)_0%,rgba(9,9,14,0.84)_100%)] shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-[18px]"
    >
      <span className="text-2xl">🐑</span>
    </motion.button>
  );
}
```

- [ ] **Step 2: Create the side drawer**

```tsx
// app/src/components/assistant/SheepAgentDrawer.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, Send, X } from 'lucide-react';

interface SheepAgentDrawerProps {
  open: boolean;
  onClose: () => void;
}

const fakeMessages = [
  { id: '1', from: 'sheep', text: '咩，想让我帮你看看这个梦吗？' },
  { id: '2', from: 'user', text: '我昨晚梦见自己在追月亮。' },
  { id: '3', from: 'sheep', text: '那听起来像一个很亮、很想靠近的梦。' },
];

export function SheepAgentDrawer({ open, onClose }: SheepAgentDrawerProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[95]"
        >
          <button type="button" aria-label="关闭小羊助手遮罩" onClick={onClose} className="absolute inset-0 bg-black/24" />
          <motion.aside
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 36 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-3 bottom-28 top-24 w-[78%] rounded-[30px] border border-white/14 bg-[linear-gradient(180deg,rgba(20,20,28,0.88)_0%,rgba(10,10,16,0.84)_100%)] p-4 text-white shadow-[0_28px_55px_rgba(0,0,0,0.34)] backdrop-blur-[20px]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-white/48">SHEEP FRIEND</p>
                <h3 className="mt-1 text-lg font-semibold">小羊助手</h3>
              </div>
              <button type="button" aria-label="关闭小羊助手" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {fakeMessages.map((message) => (
                <div key={message.id} className={`max-w-[88%] rounded-[20px] px-3 py-2 text-sm leading-5 ${message.from === 'sheep' ? 'bg-white/10 text-white' : 'ml-auto bg-[#ffe39b] text-[#20152c]'}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <div className="absolute inset-x-4 bottom-4 space-y-2">
              <button type="button" aria-label="按住说话" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ffe39b] px-4 py-3 text-sm font-semibold text-[#20152c]">
                <Mic className="h-4 w-4" />
                按住说话
              </button>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2.5">
                <input className="w-full bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none" placeholder="和小羊说点什么" />
                <button type="button" aria-label="发送消息" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/14">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Wire the shell-level state**

```tsx
// app/src/App.tsx excerpt
import { SheepAgentButton } from './components/assistant/SheepAgentButton';
import { SheepAgentDrawer } from './components/assistant/SheepAgentDrawer';

const [sheepOpen, setSheepOpen] = useState(false);

<MobileFrame>
  ...
  {activeTab !== 'particle' && (
    <>
      <SheepAgentButton onClick={() => setSheepOpen(true)} />
      <SheepAgentDrawer open={sheepOpen} onClose={() => setSheepOpen(false)} />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  )}
</MobileFrame>
```

- [ ] **Step 4: Run the focused test**

Run: `cd app && npm run test -- prototypeInteractions.test.tsx`
Expected: PASS for the sheep-entry interaction.

### Task 3: Final verification

**Files:**
- Test: `app/src/__tests__/prototypeInteractions.test.tsx`

- [ ] **Step 1: Run full tests**

Run: `cd app && npm run test`
Expected: PASS.

- [ ] **Step 2: Run build**

Run: `cd app && npm run build`
Expected: PASS.

- [ ] **Step 3: Manually verify preview**

Run: open `http://localhost:4173/`
Check:
- all non-particle pages show the sheep trigger
- the trigger does not overlap the center bottom-nav button
- clicking the sheep opens the right-side drawer within the phone frame
- the drawer shows both voice and text inputs
