export function extractOpenClawToken(config: unknown): string | null;
export function extractOpenClawMessageText(message: unknown): string;
export function normalizeOpenClawReply(payload: unknown): { reply: string };
export function createOpenClawProxyServer(): import('node:http').Server;
