import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { DreamsPage } from '../pages/DreamsPage';
import { HomePage } from '../pages/HomePage';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('prototype home interactions', () => {
  it('opens the notification sheet and starts the fake voice flow', () => {
    const onOpenParticle = vi.fn();

    render(<HomePage onOpenParticle={onOpenParticle} />);

    fireEvent.click(screen.getByRole('button', { name: /通知/ }));

    expect(screen.getByText('昨夜提醒')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '去讲梦' }));

    expect(screen.getByText('正在听你讲梦')).toBeInTheDocument();
  });
});

describe('prototype archive interactions', () => {
  it('opens archive and specimen detail sheets from the archive page', async () => {
    render(<DreamsPage />);

    expect(screen.getByText('意象标本')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /打开绘本档案 追着月亮奔跑的鲸鱼/i }));

    expect(screen.getByText('继续整理')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /关闭档案详情/i }));

    await waitFor(() => {
      expect(screen.queryByText('继续整理')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /查看标本 月亮/i }));

    expect(screen.getByText(/最近一次出现/)).toBeInTheDocument();
  });
});

describe('prototype interpretation interactions', () => {
  it('switches interpretation month and keeps the stat cards removed', async () => {
    render(<AnalyticsPage onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /3 月/i }));

    expect(await screen.findByText('雨')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /查看 记录总数 详情/i })).not.toBeInTheDocument();
  });

  it('shows parent-only dream insight after confirmation', async () => {
    render(<AnalyticsPage onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /家长梦境观察/i }));
    expect(await screen.findByText('家长确认')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /我是家长，继续查看/i }));

    expect(await screen.findByText('孩子最近的心理状态')).toBeInTheDocument();
    expect(screen.getByText(/整体偏稳定/)).toBeInTheDocument();
  });
});

describe('sheep agent entry interactions', () => {
  it('opens the sheep drawer and shows voice and text inputs', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /打开小羊助手/i }));

    expect(await screen.findByText('咩，想让我帮你看看这个梦吗？')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /按住说话/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('和小羊说点什么')).toBeInTheDocument();
  });

  it('sends typed messages to the sheep agent proxy', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: '我听见了这个梦。' }),
    });
    globalThis.fetch = fetchMock;

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /打开小羊助手/i }));
    fireEvent.change(await screen.findByPlaceholderText('和小羊说点什么'), {
      target: { value: '我梦见月亮' },
    });
    fireEvent.click(screen.getByRole('button', { name: /发送消息/i }));

    expect(fetchMock).toHaveBeenCalledWith('/api/sheep/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '我梦见月亮', sessionKey: 'dream-planet-app-user-001' }),
    });
    expect(await screen.findByText('我听见了这个梦。')).toBeInTheDocument();
  });
});
