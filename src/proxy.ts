import { Hono } from 'hono';
import { Env } from './types';

export const proxyRouter = new Hono<{ Bindings: Env }>();

// 检查是否为私有 IP / 内网 IP (防 SSRF 攻击)
function isPrivateIp(ip: string): boolean {
  if (ip === 'localhost' || ip === '127.0.0.1' || ip === '::1' || ip === '0.0.0.0') return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.')) return true;
  if (ip.startsWith('172.')) {
    const parts = ip.split('.');
    const second = parseInt(parts[1], 10);
    if (second >= 16 && second <= 31) return true;
  }
  if (ip.startsWith('169.254.')) return true; // Link-local
  return false;
}

// 自动加速 GitHub 资源链接
function rewriteGithubUrl(url: string): string {
  if (url.includes('raw.githubusercontent.com/')) {
    try {
      const u = new URL(url);
      const parts = u.pathname.replace(/^\/+/, '').split('/');
      if (parts.length >= 4) {
        const user = parts[0];
        const repo = parts[1];
        const branch = parts[2];
        const filePath = parts.slice(3).join('/');
        return `https://cdn.jsdelivr.net/gh/${user}/${repo}@${branch}/${filePath}`;
      }
    } catch (_) {}
  }
  return url;
}

proxyRouter.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const rawUrl = body.url;
  const method = (body.method || 'GET').toUpperCase();
  const headers = body.headers || {};
  const binary = !!body.binary;
  const reqBody = body.body;

  if (!rawUrl) {
    return c.json({ error: 'Missing url parameter' }, 400);
  }

  const targetUrl = rewriteGithubUrl(rawUrl);

  try {
    const parsed = new URL(targetUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return c.json({ error: 'Only http and https protocols are allowed' }, 400);
    }

    if (isPrivateIp(parsed.hostname)) {
      return c.json({ error: 'Access to private host is blocked', code: 'private-host' }, 403);
    }

    const fetchHeaders = new Headers();
    let hasUA = false;
    for (const [k, v] of Object.entries(headers)) {
      const lk = k.toLowerCase();
      if (lk === 'user-agent') hasUA = true;
      if (lk !== 'host' && lk !== 'content-length') {
        fetchHeaders.set(k, String(v));
      }
    }
    if (!hasUA) {
      fetchHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    }

    let fetchBody: any = undefined;
    if (reqBody !== undefined && method !== 'GET' && method !== 'HEAD') {
      if (binary && typeof reqBody === 'string') {
        const binStr = atob(reqBody);
        const bytes = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) {
          bytes[i] = binStr.charCodeAt(i);
        }
        fetchBody = bytes;
      } else {
        fetchBody = typeof reqBody === 'object' ? JSON.stringify(reqBody) : reqBody;
      }
    }

    const response = await fetch(targetUrl, {
      method,
      headers: fetchHeaders,
      body: fetchBody,
      redirect: 'follow',
    });

    const respHeaders: Record<string, string> = {};
    response.headers.forEach((v, k) => {
      respHeaders[k] = v;
    });

    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binaryString = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    const base64Body = btoa(binaryString);

    return c.json({
      status: response.status,
      headers: respHeaders,
      body: base64Body,
    });
  } catch (err: any) {
    return c.json({ error: `Proxy request failed: ${err.message}` }, 502);
  }
});
