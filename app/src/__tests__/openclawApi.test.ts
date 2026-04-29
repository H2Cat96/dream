import { afterEach, describe, expect, it, vi } from 'vitest';
import { getSheepHistory, sendSheepMessage } from '../lib/openclawApi';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('openclaw api client', () => {
  it('sends sheep chat messages through the local proxy', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: '你好呀，我在。' }),
    });
    globalThis.fetch = fetchMock;

    const result = await sendSheepMessage('你好', 'app-user-001');

    expect(fetchMock).toHaveBeenCalledWith('/api/sheep/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '你好', sessionKey: 'app-user-001' }),
    });
    expect(result.reply).toBe('你好呀，我在。');
  });

  it('loads sheep chat history through the local proxy', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        messages: [{ id: '1', from: 'assistant', text: '咩，欢迎回来。' }],
      }),
    });
    globalThis.fetch = fetchMock;

    const result = await getSheepHistory('app-user-001', 10);

    expect(fetchMock).toHaveBeenCalledWith('/api/sheep/history?sessionKey=app-user-001&limit=10');
    expect(result.messages).toHaveLength(1);
  });

  it('throws a readable error when the proxy rejects a request', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'OpenClaw 暂时不可用' }),
    });

    await expect(sendSheepMessage('你好', 'app-user-001')).rejects.toThrow('OpenClaw 暂时不可用');
  });
});
