import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

const defaultOpenClawBaseUrl = 'http://127.0.0.1:18789';
const defaultOpenClawWsUrl = 'ws://127.0.0.1:18789';
const defaultProxyOrigin = 'http://127.0.0.1:8787';
const appRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distRoot = join(appRoot, 'dist');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

export function extractOpenClawToken(config) {
  const token = config?.gateway?.auth?.token;
  return typeof token === 'string' && token.length > 0 ? token : null;
}

export function normalizeOpenClawReply(payload) {
  const reply =
    payload?.reply ??
    payload?.message?.content ??
    payload?.data?.reply ??
    payload?.data?.message?.content ??
    payload?.content ??
    payload?.text;

  if (typeof reply === 'string' && reply.length > 0) {
    return { reply };
  }

  return { reply: '咩，我收到了，但暂时没有生成文字回复。' };
}

export function extractOpenClawMessageText(message) {
  if (typeof message === 'string') return message;
  if (!message || typeof message !== 'object') return '';

  if (typeof message.text === 'string') return message.text;
  if (typeof message.content === 'string') return message.content;
  if (typeof message.message === 'string') return message.message;

  if (Array.isArray(message.content)) {
    return message.content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part && typeof part === 'object' && typeof part.text === 'string') return part.text;
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  return '';
}

async function loadOpenClawToken(configPath = join(homedir(), '.openclaw', 'openclaw.json')) {
  if (process.env.OPENCLAW_TOKEN) {
    return process.env.OPENCLAW_TOKEN;
  }

  const rawConfig = await readFile(configPath, 'utf8');
  const token = extractOpenClawToken(JSON.parse(rawConfig));

  if (!token) {
    throw new Error(`OpenClaw token not found in ${configPath}`);
  }

  return token;
}

function getOpenClawWsUrl() {
  if (process.env.OPENCLAW_WS_URL) return process.env.OPENCLAW_WS_URL;

  const baseUrl = process.env.OPENCLAW_BASE_URL ?? defaultOpenClawBaseUrl;
  try {
    const url = new URL(baseUrl);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return url.toString();
  } catch {
    return defaultOpenClawWsUrl;
  }
}

async function readRequestJson(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) : {};
}

function writeJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  response.end(JSON.stringify(payload));
}

async function serveStaticAsset(url, response) {
  const requestedPath = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const normalizedPath = normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = join(distRoot, normalizedPath);

  if (!filePath.startsWith(`${distRoot}${sep}`) && filePath !== distRoot) {
    writeJson(response, 403, { error: 'forbidden' });
    return;
  }

  try {
    const bytes = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
    });
    response.end(bytes);
  } catch {
    const indexHtml = await readFile(join(distRoot, 'index.html'));
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(indexHtml);
  }
}

async function createOpenClawRpcClient() {
  const token = await loadOpenClawToken();
  const wsUrl = getOpenClawWsUrl();
  const origin = process.env.OPENCLAW_PROXY_ORIGIN ?? defaultProxyOrigin;
  const ws = new WebSocket(wsUrl, { headers: { Origin: origin } });
  let nextId = 1;
  const pending = new Map();
  const eventHandlers = new Set();

  const close = () => {
    for (const [, waiter] of pending) {
      waiter.reject(new Error('OpenClaw RPC connection closed'));
    }
    pending.clear();
    ws.close();
  };

  const request = (method, params) => {
    if (ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error('OpenClaw RPC connection is not open'));
    }

    const id = String(nextId++);
    ws.send(JSON.stringify({ type: 'req', id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  };

  ws.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(String(data));
    } catch {
      return;
    }

    if (message.type === 'res') {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      if (message.ok) {
        waiter.resolve(message.payload);
      } else {
        const errorMessage = message.error?.message ?? 'OpenClaw RPC request failed';
        const error = new Error(errorMessage);
        error.details = message.error;
        waiter.reject(error);
      }
      return;
    }

    if (message.type === 'event') {
      for (const handler of eventHandlers) handler(message);
    }
  });

  await new Promise((resolve, reject) => {
    ws.once('open', resolve);
    ws.once('error', reject);
  });

  await request('connect', {
    minProtocol: 3,
    maxProtocol: 3,
    client: {
      id: 'openclaw-control-ui',
      version: 'dream-planet',
      platform: 'node',
      mode: 'webchat',
    },
    role: 'operator',
    scopes: ['operator.admin', 'operator.read', 'operator.write', 'operator.approvals', 'operator.pairing'],
    caps: ['tool-events'],
    auth: { token },
    userAgent: 'dream-planet-bridge',
    locale: 'zh-CN',
  });

  return {
    request,
    close,
    onEvent(handler) {
      eventHandlers.add(handler);
      return () => eventHandlers.delete(handler);
    },
  };
}

function waitForChatFinal(client, sessionKey, runId, timeoutMs = 30000) {
  return new Promise((resolve) => {
    let latestText = '';
    const timer = setTimeout(() => {
      unsubscribe();
      resolve(latestText);
    }, timeoutMs);

    const finish = (text) => {
      clearTimeout(timer);
      unsubscribe();
      resolve(text || latestText);
    };

    const unsubscribe = client.onEvent((event) => {
      const payload = event.payload ?? {};
      if (payload.sessionKey && payload.sessionKey !== sessionKey) return;
      if (runId && payload.runId && payload.runId !== runId) return;

      const text = extractOpenClawMessageText(payload.message ?? payload.delta ?? payload.content);
      if (text) latestText = text;

      if (payload.state === 'final') {
        finish(extractOpenClawMessageText(payload.message) || latestText);
      } else if (payload.state === 'error') {
        finish(extractOpenClawMessageText(payload.message) || payload.error?.message || latestText);
      }
    });
  });
}

async function sendOpenClawChat({ message, sessionKey }) {
  const client = await createOpenClawRpcClient();
  const idempotencyKey = `dream-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    const finalReply = waitForChatFinal(client, sessionKey, idempotencyKey);
    const result = await client.request('chat.send', {
      sessionKey,
      message,
      deliver: false,
      idempotencyKey,
    });
    const reply = await finalReply;

    return normalizeOpenClawReply({
      reply: reply || extractOpenClawMessageText(result?.message) || result?.reply,
    });
  } finally {
    client.close();
  }
}

async function requestOpenClawRpc(method, params) {
  const client = await createOpenClawRpcClient();
  try {
    return await client.request(method, params);
  } finally {
    client.close();
  }
}

async function handleSheepChat(request, response) {
  const body = await readRequestJson(request);

  if (typeof body.message !== 'string' || body.message.trim().length === 0) {
    writeJson(response, 400, { error: 'message is required' });
    return;
  }

  const payload = await sendOpenClawChat({
    message: body.message,
    sessionKey: body.sessionKey ?? 'dream-planet-app-user-001',
  });

  writeJson(response, 200, normalizeOpenClawReply(payload));
}

async function handleSheepHistory(url, response) {
  const sessionKey = url.searchParams.get('sessionKey') ?? 'dream-planet-app-user-001';
  const limit = url.searchParams.get('limit') ?? '10';
  const payload = await requestOpenClawRpc('sessions.list', { limit: Number(limit), includeUnknown: true });

  writeJson(response, 200, { sessionKey, messages: [], sessions: payload?.sessions ?? [] });
}

async function handleSheepSessions(response) {
  const payload = await requestOpenClawRpc('sessions.list', { includeUnknown: true });
  writeJson(response, 200, payload);
}

export function createOpenClawProxyServer() {
  return createServer(async (request, response) => {
    if (!request.url) {
      writeJson(response, 404, { error: 'not found' });
      return;
    }

    if (request.method === 'OPTIONS') {
      writeJson(response, 204, {});
      return;
    }

    const url = new URL(request.url, 'http://localhost');

    try {
      if (request.method === 'POST' && url.pathname === '/api/sheep/chat') {
        await handleSheepChat(request, response);
        return;
      }

      if (request.method === 'GET' && url.pathname === '/api/sheep/history') {
        await handleSheepHistory(url, response);
        return;
      }

      if (request.method === 'GET' && url.pathname === '/api/sheep/sessions') {
        await handleSheepSessions(response);
        return;
      }

      if (request.method === 'GET') {
        await serveStaticAsset(url, response);
        return;
      }

      writeJson(response, 404, { error: 'not found' });
    } catch (error) {
      writeJson(response, 502, { error: error instanceof Error ? error.message : 'OpenClaw proxy failed' });
    }
  });
}
