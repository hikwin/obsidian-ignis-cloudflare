import { Hono } from 'hono';
import { Env, Variables } from './types';
import { authRouter, authMiddleware } from './auth';
import { fsRouter, resolveR2Key, getMimeTypeByPath } from './fs';
import { vaultRouter } from './vault';
import { bootstrapRouter } from './bootstrap';
import { proxyRouter } from './proxy';
import { settingsRouter } from './settings';
import { pluginsRouter } from './plugins';
import { renderHostAppPage } from './views';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// 1. 健康检查与路由测试 API
app.get('/api/test-route', (c) => {
  return c.json({ success: true, serverless: true, platform: 'cloudflare-workers' });
});

app.get('/api/version', (c) => {
  return c.json({
    version: '1.0.0-serverless',
    obsidianVersion: c.env.OBSIDIAN_VERSION || '1.8.7',
    runtime: 'Cloudflare Workers (Edge)',
  });
});

// 2. WebSocket 握手处理 (/ws?vault=default) 兼容文件监听
app.get('/ws', async (c) => {
  const upgradeHeader = c.req.header('Upgrade');
  if (upgradeHeader === 'websocket') {
    // @ts-ignore Cloudflare WebSocketPair
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair) as [WebSocket, WebSocket];
    // @ts-ignore
    server.accept();
    server.addEventListener('message', (event) => {
      // 保持长连接心跳响应
      try {
        const data = JSON.parse(event.data as string);
        if (data.type === 'ping') {
          server.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (_) {}
    });
    return new Response(null, { status: 101, webSocket: client });
  }
  return c.text('Expected WebSocket', 400);
});

// 3. 认证与登录路由 (公开)
app.route('/', authRouter);
app.route('/api/auth', authRouter);

// 4. 设置页面快捷别名
app.get('/pass', (c) => c.redirect('/pwd'));
app.get('/password', (c) => c.redirect('/pwd'));
app.get('/change-password', (c) => c.redirect('/pwd'));

// 5. API 路由 (受鉴权保护)
app.use('/api/*', authMiddleware);
app.route('/api/bootstrap', bootstrapRouter);
app.route('/api/fs', fsRouter);
app.route('/api/vault', vaultRouter);
app.route('/api/proxy', proxyRouter);
app.route('/api/settings', settingsRouter);
app.route('/api/plugins', pluginsRouter);

// 6. /vault-files/* 仓库文件直链读取 (用于附件图片等展示)
app.on(['GET', 'HEAD'], '/vault-files/*', authMiddleware, async (c) => {
  const url = new URL(c.req.url);
  const rawSubPath = url.pathname.replace(/^\/vault-files\/?/, '');
  if (!rawSubPath) {
    return c.text('File Not Found', 404);
  }

  const queryVault = c.req.query('vault');
  const defaultVault = c.env.DEFAULT_VAULT_ID || 'default';

  // 解析路径段
  const segments = rawSubPath.split('/');
  const candidateKeys: string[] = [];

  // 1. 如果路径包含多段 (如 /vault-files/sasa/Pasted%20image.png 或 /vault-files/sasa/sub/img.png)
  // 第一段是 vaultId (由 shim-loader ipcRenderer 'file-url' 生成: /vault-files/${vaultId}/...)
  if (segments.length >= 2) {
    let pathVaultId = segments[0];
    try {
      pathVaultId = decodeURIComponent(pathVaultId);
    } catch {}
    const remainingSegments = segments.slice(1);
    const decodedFilePath = remainingSegments.map((seg) => {
      try {
        return decodeURIComponent(seg);
      } catch {
        return seg;
      }
    }).join('/');
    try {
      candidateKeys.push(resolveR2Key(pathVaultId, decodedFilePath));
    } catch {}
  }

  // 2. 如果提供了 ?vault=xxx 参数
  if (queryVault) {
    const decodedPath = segments.map((seg) => {
      try {
        return decodeURIComponent(seg);
      } catch {
        return seg;
      }
    }).join('/');
    try {
      candidateKeys.push(resolveR2Key(queryVault, decodedPath));
    } catch {}
  }

  // 3. Fallback: 整个路径作为 default vault 下的相对路径
  {
    const decodedPath = segments.map((seg) => {
      try {
        return decodeURIComponent(seg);
      } catch {
        return seg;
      }
    }).join('/');
    try {
      candidateKeys.push(resolveR2Key(defaultVault, decodedPath));
    } catch {}
  }

  const uniqueKeys = [...new Set(candidateKeys)];

  let obj: any = null;
  for (const key of uniqueKeys) {
    obj = await c.env.VAULT_BUCKET.get(key);
    if (obj) break;
  }

  if (obj) {
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set('ETag', obj.httpEtag);
    headers.set('Cache-Control', 'private, max-age=3600');

    // 智能补全 Content-Type，确保图片/媒体/文档正常渲染
    const currentContentType = headers.get('Content-Type');
    if (!currentContentType || currentContentType === 'application/octet-stream') {
      const mime = getMimeTypeByPath(rawSubPath);
      if (mime) {
        headers.set('Content-Type', mime);
      }
    }

    if (c.req.method === 'HEAD') {
      return new Response(null, { headers });
    }
    return new Response(obj.body, { headers });
  }

  return c.text('File Not Found', 404);
});

// 7. Obsidian Web 宿主入口 (受鉴权保护)
app.get('/', authMiddleware, (c) => {
  return c.html(renderHostAppPage());
});

// 7. 静态资源多路径智能解析 (优先 Assets，无绑定时从 R2 存储桶读取)
async function handleStaticAsset(c: any, rawPath: string): Promise<Response | null> {
  if (c.env.ASSETS) {
    const assetResp = await c.env.ASSETS.fetch(c.req.raw);
    if (assetResp.status !== 404) return assetResp;
  }

  if (!c.env.VAULT_BUCKET) return null;

  // 清洗路径
  let clean = rawPath.replace(/^\/+/, '');
  
  // 备选查找 Key 列表
  const candidateKeys = [
    clean,
    `assets/${clean}`,
    `assets/obsidian/${clean}`,
    `assets/server/${clean}`,
    `assets/shim/${clean}`,
    `assets/ui/${clean}`,
  ];

  // 特殊重定向
  if (clean === 'worker.js') {
    candidateKeys.unshift('assets/obsidian/worker.js');
  } else if (clean === 'favicon.ico' || clean === 'favicon.png') {
    candidateKeys.unshift('assets/favicon.png');
  }

  for (const key of candidateKeys) {
    const obj = await c.env.VAULT_BUCKET.get(key);
    if (obj) {
      const headers = new Headers();
      obj.writeHttpMetadata(headers);
      headers.set('ETag', obj.httpEtag);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');

      if (key.endsWith('.js')) headers.set('Content-Type', 'application/javascript; charset=utf-8');
      else if (key.endsWith('.css')) headers.set('Content-Type', 'text/css; charset=utf-8');
      else if (key.endsWith('.png')) headers.set('Content-Type', 'image/png');
      else if (key.endsWith('.svg')) headers.set('Content-Type', 'image/svg+xml');
      else if (key.endsWith('.html')) headers.set('Content-Type', 'text/html; charset=utf-8');
      else if (key.endsWith('.json')) headers.set('Content-Type', 'application/json; charset=utf-8');
      else if (key.endsWith('.wasm')) headers.set('Content-Type', 'application/wasm');

      return new Response(obj.body, { headers });
    }
  }

  return null;
}

// 静态资产路由
app.all('/assets/*', async (c) => {
  const url = new URL(c.req.url);
  const resp = await handleStaticAsset(c, url.pathname);
  if (resp) return resp;
  return c.text('Asset Not Found', 404);
});

// 兜底路由 (包含 /worker.js, /favicon.png, /lib/* 等可能被直连请求的文件)
app.all('*', async (c) => {
  const url = new URL(c.req.url);
  const resp = await handleStaticAsset(c, url.pathname);
  if (resp) return resp;
  return c.text('Not Found', 404);
});

export default app;
