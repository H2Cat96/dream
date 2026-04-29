import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultOpenClawBaseUrl = 'http://127.0.0.1:18789';
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

async function forwardToOpenClaw(path, options = {}) {
  const token = await loadOpenClawToken();
  const baseUrl = process.env.OPENCLAW_BASE_URL ?? defaultOpenClawBaseUrl;
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = typeof payload.error === 'string' ? payload.error : `OpenClaw returned ${response.status}`;
    throw new Error(error);
  }

  return payload;
}

async function handleSheepChat(request, response) {
  const body = await readRequestJson(request);

  if (typeof body.message !== 'string' || body.message.trim().length === 0) {
    writeJson(response, 400, { error: 'message is required' });
    return;
  }

  const payload = await forwardToOpenClaw('/api/sessions/send', {
    method: 'POST',
    body: JSON.stringify({
      message: body.message,
      sessionKey: body.sessionKey ?? 'dream-planet-app-user-001',
    }),
  });

  writeJson(response, 200, normalizeOpenClawReply(payload));
}

async function handleSheepHistory(url, response) {
  const sessionKey = url.searchParams.get('sessionKey') ?? 'dream-planet-app-user-001';
  const limit = url.searchParams.get('limit') ?? '10';
  const payload = await forwardToOpenClaw(
    `/api/sessions/history?${new URLSearchParams({ sessionKey, limit }).toString()}`,
  );

  writeJson(response, 200, payload);
}

async function handleSheepSessions(response) {
  const payload = await forwardToOpenClaw('/api/sessions');
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
