import { Hono } from 'hono';
import { Env } from './types';

export const settingsRouter = new Hono<{ Bindings: Env }>();

settingsRouter.get('/', async (c) => {
  return c.json({
    proxyMode: c.env.PROXY_MODE || 'all',
    contentCacheBytes: 52428800,
    inputCacheBytes: 10485760,
    inputCacheTtlMs: 300000,
    directFetchHosts: [],
  });
});

settingsRouter.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (c.env.IGNIS_KV) {
    await c.env.IGNIS_KV.put('SETTINGS', JSON.stringify(body));
  }
  return c.json({ success: true });
});
