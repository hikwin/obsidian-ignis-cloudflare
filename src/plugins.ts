import { Hono } from 'hono';
import { Env } from './types';

export const pluginsRouter = new Hono<{ Bindings: Env }>();

pluginsRouter.get('/', async (c) => {
  return c.json([]);
});

pluginsRouter.get('/virtual', async (c) => {
  return c.json([]);
});
