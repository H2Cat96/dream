export type SheepMessage = {
  id: string;
  from: 'assistant' | 'user' | 'sheep';
  text: string;
  createdAt?: string;
};

export type SheepChatResponse = {
  reply: string;
  messages?: SheepMessage[];
};

export type SheepHistoryResponse = {
  messages: SheepMessage[];
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

async function readJsonResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof payload.error === 'string' ? payload.error : 'OpenClaw 请求失败';
    throw new Error(message);
  }

  return payload as T;
}

export async function sendSheepMessage(message: string, sessionKey: string): Promise<SheepChatResponse> {
  const response = await fetch(`${apiBaseUrl}/api/sheep/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionKey }),
  });

  return readJsonResponse<SheepChatResponse>(response);
}

export async function getSheepHistory(sessionKey: string, limit = 10): Promise<SheepHistoryResponse> {
  const params = new URLSearchParams({ sessionKey, limit: String(limit) });
  const response = await fetch(`${apiBaseUrl}/api/sheep/history?${params.toString()}`);

  return readJsonResponse<SheepHistoryResponse>(response);
}
