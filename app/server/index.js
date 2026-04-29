import { createOpenClawProxyServer } from './openclawProxy.js';

const port = Number(process.env.OPENCLAW_PROXY_PORT ?? 8787);
const host = process.env.OPENCLAW_PROXY_HOST ?? '127.0.0.1';

createOpenClawProxyServer().listen(port, host, () => {
  console.log(`OpenClaw proxy listening on http://${host}:${port}`);
});
