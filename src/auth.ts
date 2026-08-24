import { Hono, MiddlewareHandler } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { Env, Variables } from './types';
import { renderLoginPage, renderChangePasswordPage } from './views';

export const authRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// Web Crypto SHA-256 密码哈希
export async function hashPassword(password: string, salt: string = 'ignis_salt_cf'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + ':' + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// 简易安全 JWT 生成 (使用 HMAC-SHA256)
export async function createToken(payload: Record<string, any>, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodeBase64Url = (obj: any) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const unsignedToken = `${encodeBase64Url(header)}.${encodeBase64Url(payload)}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(unsignedToken));
  const sigArray = Array.from(new Uint8Array(signature));
  const signatureBase64Url = btoa(String.fromCharCode(...sigArray))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${unsignedToken}.${signatureBase64Url}`;
}

// 简易安全 JWT 校验
export async function verifyToken(token: string, secret: string): Promise<Record<string, any> | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const unsignedToken = `${headerB64}.${payloadB64}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigStr = atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBytes = new Uint8Array(sigStr.split('').map((c) => c.charCodeAt(0)));

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(unsignedToken));
    if (!isValid) return null;

    const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);

    // 检查过期时间 (默认 7 天)
    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch (e) {
    return null;
  }
}

// 获取当前存储的管理员密码哈希
export async function getAdminPasswordHash(env: Env): Promise<{ username: string; hash: string }> {
  // 1. 尝试从 KV 读取
  if (env.IGNIS_KV) {
    const kvUser = await env.IGNIS_KV.get('ADMIN_USER_DATA', 'json') as { username: string; hash: string } | null;
    if (kvUser && kvUser.hash) {
      return kvUser;
    }
  }

  // 2. 如果 KV 没有，从环境变量读取 (默认 admin / admin123)
  const username = env.ADMIN_USERNAME || 'admin';
  const rawPass = env.ADMIN_PASSWORD || 'admin123';
  const hash = await hashPassword(rawPass);
  return { username, hash };
}

// 身份验证中间件
export const authMiddleware: MiddlewareHandler<{ Bindings: Env; Variables: Variables }> = async (c, next) => {
  const env = c.env;
  const cookieName = env.COOKIE_NAME || 'ignis_cf_token';
  const jwtSecret = env.JWT_SECRET || 'ignis-cf-default-secret-key-change-me';

  const token = getCookie(c, cookieName) || c.req.header('Authorization')?.replace(/^Bearer\s+/i, '');

  if (!token) {
    if (c.req.path.startsWith('/api/')) {
      return c.json({ error: 'Unauthorized', code: 401 }, 401);
    }
    return c.redirect('/login');
  }

  const payload = await verifyToken(token, jwtSecret);
  if (!payload) {
    if (c.req.path.startsWith('/api/')) {
      return c.json({ error: 'Invalid or expired session', code: 401 }, 401);
    }
    deleteCookie(c, cookieName);
    return c.redirect('/login');
  }

  c.set('user', payload);
  await next();
};

// 登录 API & 页面
authRouter.get('/login', async (c) => {
  return c.html(renderLoginPage());
});

authRouter.post('/login', async (c) => {
  const env = c.env;
  let username = '';
  let password = '';

  const contentType = c.req.header('Content-Type') || '';
  if (contentType.includes('application/json')) {
    const body = await c.req.json().catch(() => ({}));
    username = body.username || '';
    password = body.password || '';
  } else {
    const body = await c.req.parseBody();
    username = (body['username'] as string) || '';
    password = (body['password'] as string) || '';
  }

  const admin = await getAdminPasswordHash(env);
  const inputHash = await hashPassword(password);

  if (username === admin.username && inputHash === admin.hash) {
    const jwtSecret = env.JWT_SECRET || 'ignis-cf-default-secret-key-change-me';
    const cookieName = env.COOKIE_NAME || 'ignis_cf_token';

    const token = await createToken(
      {
        username,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 天有效
      },
      jwtSecret
    );

    setCookie(c, cookieName, token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    if (contentType.includes('application/json')) {
      return c.json({ success: true, message: '登录成功', redirectUrl: '/' });
    }
    return c.redirect('/');
  }

  if (contentType.includes('application/json')) {
    return c.json({ success: false, message: '用户名或密码错误' }, 401);
  }
  return c.html(renderLoginPage('用户名或密码错误'));
});

// 退出登录
authRouter.get('/logout', async (c) => {
  const cookieName = c.env.COOKIE_NAME || 'ignis_cf_token';
  deleteCookie(c, cookieName, { path: '/' });
  return c.redirect('/login');
});

// 修改密码路由
authRouter.get('/pwd', authMiddleware, async (c) => {
  return c.html(renderChangePasswordPage());
});

authRouter.post('/pwd', authMiddleware, async (c) => {
  const env = c.env;
  const body = await c.req.parseBody();
  const oldPass = (body['old_password'] as string) || '';
  const newPass = (body['new_password'] as string) || '';
  const confirmPass = (body['confirm_password'] as string) || '';

  if (newPass.length < 6) {
    return c.html(renderChangePasswordPage('新密码长度不能少于 6 位', true));
  }
  if (newPass !== confirmPass) {
    return c.html(renderChangePasswordPage('两次输入的新密码不一致', true));
  }

  const admin = await getAdminPasswordHash(env);
  const oldHash = await hashPassword(oldPass);

  if (oldHash !== admin.hash) {
    return c.html(renderChangePasswordPage('原密码输入错误', true));
  }

  const newHash = await hashPassword(newPass);

  if (env.IGNIS_KV) {
    await env.IGNIS_KV.put('ADMIN_USER_DATA', JSON.stringify({ username: admin.username, hash: newHash }));
  }

  return c.html(renderChangePasswordPage('密码修改成功！请牢记新密码。', false));
});
