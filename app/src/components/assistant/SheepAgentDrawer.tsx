import { AnimatePresence, motion } from 'framer-motion';
import { Mic, Send, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { sendSheepMessage, type SheepMessage } from '../../lib/openclawApi';

interface SheepAgentDrawerProps {
  open: boolean;
  onClose: () => void;
}

const sheepSessionKey = 'dream-planet-app-user-001';

const initialMessages: SheepMessage[] = [
  { id: 'sheep-1', from: 'sheep', text: '咩，想让我帮你看看这个梦吗？' },
  { id: 'user-1', from: 'user', text: '我昨晚梦见自己在追月亮。' },
  { id: 'sheep-2', from: 'sheep', text: '那听起来像一个很亮、很想靠近的梦。' },
];

export function SheepAgentDrawer({ open, onClose }: SheepAgentDrawerProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = draft.trim();
    if (!trimmed || isSending) return;

    const userMessage: SheepMessage = {
      id: `user-${Date.now()}`,
      from: 'user',
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setDraft('');
    setIsSending(true);
    setError(null);

    try {
      const response = await sendSheepMessage(trimmed, sheepSessionKey);
      setMessages((current) => [
        ...current,
        {
          id: `sheep-${Date.now()}`,
          from: 'sheep',
          text: response.reply,
        },
      ]);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : '小羊暂时没有连上';
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50"
        >
          <button
            type="button"
            aria-label="关闭小羊助手遮罩"
            onClick={onClose}
            className="absolute inset-0 bg-black/28"
          />

          <motion.aside
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-3 top-20 bottom-24 w-[78%] rounded-[30px] border border-white/14 bg-[linear-gradient(180deg,rgba(24,24,32,0.92)_0%,rgba(11,11,17,0.92)_100%)] p-4 text-white shadow-[0_24px_55px_rgba(0,0,0,0.34)] backdrop-blur-[20px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.18em] text-white/42">SHEEP FRIEND</p>
                <h2 className="mt-1 text-lg font-semibold">小羊助手</h2>
              </div>
              <button
                type="button"
                aria-label="关闭小羊助手"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/16"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 pb-28">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[88%] rounded-[20px] px-3 py-2 text-sm leading-5 ${
                    message.from === 'sheep' || message.from === 'assistant'
                      ? 'bg-white/10 text-white'
                      : 'ml-auto bg-[#ffe39b] text-[#20152c]'
                  }`}
                >
                  {message.text}
                </div>
              ))}
              {error ? (
                <div className="rounded-[18px] border border-[#ffb4a8]/20 bg-[#ff6b5d]/12 px-3 py-2 text-xs leading-5 text-[#ffd8d2]">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="absolute inset-x-4 bottom-4 space-y-2">
              <button
                type="button"
                aria-label="按住说话"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ffe39b] px-4 py-3 text-sm font-semibold text-[#20152c] shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
              >
                <Mic className="h-4 w-4" />
                按住说话
              </button>

              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2.5"
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/42 focus:outline-none"
                  placeholder="和小羊说点什么"
                />
                <button
                  type="button"
                  aria-label="发送消息"
                  onClick={(event) => {
                    event.currentTarget.form?.requestSubmit();
                  }}
                  disabled={isSending || draft.trim().length === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/14 text-white transition hover:bg-white/18"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
