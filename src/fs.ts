import { Hono } from 'hono';
import { Env } from './types';

export const fsRouter = new Hono<{ Bindings: Env }>();

// 智能根据文件路径解析 MIME 类型
export function getMimeTypeByPath(filePath: string): string | null {
  const clean = filePath.split('?')[0].split('#')[0].toLowerCase();
  if (clean.endsWith('.png')) return 'image/png';
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return 'image/jpeg';
  if (clean.endsWith('.gif')) return 'image/gif';
  if (clean.endsWith('.webp')) return 'image/webp';
  if (clean.endsWith('.svg')) return 'image/svg+xml';
  if (clean.endsWith('.bmp')) return 'image/bmp';
  if (clean.endsWith('.ico')) return 'image/x-icon';
  if (clean.endsWith('.mp3')) return 'audio/mpeg';
  if (clean.endsWith('.wav')) return 'audio/wav';
  if (clean.endsWith('.ogg')) return 'audio/ogg';
  if (clean.endsWith('.m4a')) return 'audio/mp4';
  if (clean.endsWith('.mp4')) return 'video/mp4';
  if (clean.endsWith('.webm')) return 'video/webm';
  if (clean.endsWith('.mov')) return 'video/quicktime';
  if (clean.endsWith('.pdf')) return 'application/pdf';
  if (clean.endsWith('.md')) return 'text/markdown; charset=utf-8';
  if (clean.endsWith('.txt')) return 'text/plain; charset=utf-8';
  if (clean.endsWith('.json') || clean.endsWith('.canvas')) return 'application/json; charset=utf-8';
  if (clean.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (clean.endsWith('.css')) return 'text/css; charset=utf-8';
  if (clean.endsWith('.html')) return 'text/html; charset=utf-8';
  if (clean.endsWith('.wasm')) return 'application/wasm';
  return null;
}

// 安全解析并规范化 R2 对象 Key
export function resolveR2Key(vaultId: string, filePath: string): string {
  let clean = '';
  try {
    clean = decodeURIComponent(filePath || '').replace(/\\/g, '/');
  } catch {
    clean = (filePath || '').replace(/\\/g, '/');
  }
  // 移除开头的斜杠
  clean = clean.replace(/^\/+/, '');

  // 严格拦截路径穿越
  const segments = clean.split('/');
  for (const seg of segments) {
    if (seg === '..') throw new Error('Path traversal rejected');
  }

  return `vaults/${vaultId}/${clean}`;
}

// 1. GET & POST /api/fs/stat
const handleStat = async (c: any) => {
  let body: any = {};
  if (c.req.header('Content-Type')?.includes('application/json')) {
    body = await c.req.json().catch(() => ({}));
  }
  const vaultId = body.vault || c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const pathParam = body.path !== undefined ? body.path : c.req.query('path');
  if (pathParam === undefined) {
    return c.json({ error: 'Missing path parameter', code: 'EINVAL' }, 400);
  }

  const key = resolveR2Key(vaultId, pathParam);

  // 根目录直接判定为 directory
  if (pathParam === '' || pathParam === '/' || pathParam === '.') {
    return c.json({
      type: 'directory',
      size: 0,
      mtime: Date.now(),
      ctime: Date.now(),
    });
  }

  // 1. 尝试直接 HEAD 对象 (文件)
  let obj = await c.env.VAULT_BUCKET.head(key);

  // 自动补齐/去除 .md 后缀检查 (双向匹配，与 PHP 行为一致)
  if (!obj && !key.endsWith('.md')) {
    obj = await c.env.VAULT_BUCKET.head(key + '.md');
  } else if (!obj && key.endsWith('.md')) {
    obj = await c.env.VAULT_BUCKET.head(key.slice(0, -3));
  }

  if (obj) {
    const mtime = obj.customMetadata?.mtime ? parseInt(obj.customMetadata.mtime, 10) : obj.uploaded.getTime();
    const ctime = obj.customMetadata?.ctime ? parseInt(obj.customMetadata.ctime, 10) : mtime;
    return c.json({
      type: 'file',
      size: obj.size,
      mtime,
      ctime,
    });
  }

  // 2. 检查是否为目录 (前缀匹配)
  const dirPrefix = key.endsWith('/') ? key : `${key}/`;
  const list = await c.env.VAULT_BUCKET.list({ prefix: dirPrefix, limit: 1, delimiter: '/' });
  if (list.objects.length > 0 || (list.delimitedPrefixes && list.delimitedPrefixes.length > 0)) {
    return c.json({
      type: 'directory',
      size: 0,
      mtime: Date.now(),
      ctime: Date.now(),
    });
  }

  return c.json({ error: 'ENOENT: no such file or directory', code: 'ENOENT' }, 404);
};

fsRouter.on(['GET', 'POST'], '/stat', handleStat);

// 2. GET /api/fs/readdir
fsRouter.get('/readdir', async (c) => {
  const vaultId = c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const pathParam = c.req.query('path') || '';
  const key = resolveR2Key(vaultId, pathParam);
  const prefix = (pathParam === '' || pathParam === '/' || pathParam === '.')
    ? `vaults/${vaultId}/`
    : (key.endsWith('/') ? key : `${key}/`);

  const list = await c.env.VAULT_BUCKET.list({ prefix, delimiter: '/' });
  const entries: string[] = [];

  // 子目录
  for (const dir of list.delimitedPrefixes || []) {
    const relative = dir.slice(prefix.length).replace(/\/$/, '');
    if (relative && relative !== '.trash') {
      entries.push(relative);
    }
  }

  // 文件
  for (const obj of list.objects) {
    const relative = obj.key.slice(prefix.length);
    if (relative && relative !== '.ignis_keep' && !relative.includes('/')) {
      entries.push(relative);
    }
  }

  return c.json(entries);
});

// 3. GET /api/fs/readFile 与 /api/fs/read
const handleReadFile = async (c: any) => {
  const vaultId = c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const pathParam = c.req.query('path');
  if (!pathParam) {
    return c.json({ error: 'Missing path parameter', code: 'EINVAL' }, 400);
  }

  let key = resolveR2Key(vaultId, pathParam);
  let obj = await c.env.VAULT_BUCKET.get(key);

  if (!obj && !key.endsWith('.md')) {
    key = key + '.md';
    obj = await c.env.VAULT_BUCKET.get(key);
  }

  if (!obj) {
    return c.json({ error: 'ENOENT: no such file or directory', code: 'ENOENT' }, 404);
  }

  const encoding = c.req.query('encoding');
  if (encoding === 'base64') {
    const buf = await obj.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return c.json({ content: btoa(binary) });
  }

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('ETag', obj.httpEtag);
  headers.set('Cache-Control', 'no-cache');

  if (encoding === 'utf8' || encoding === 'utf-8') {
    headers.set('Content-Type', 'text/plain; charset=utf-8');
  }

  return new Response(obj.body, { headers });
};

fsRouter.get('/read', handleReadFile);
fsRouter.get('/readFile', handleReadFile);

// 4. POST /api/fs/writeFile 与 /api/fs/write
const handleWriteFile = async (c: any) => {
  const isJson = (c.req.header('Content-Type') || '').includes('application/json');
  let vaultId = c.env.DEFAULT_VAULT_ID || 'default';
  let filePath = '';
  let data: any = '';

  if (isJson) {
    const body = await c.req.json().catch(() => ({}));
    vaultId = body.vault || c.req.query('vault') || vaultId;
    filePath = body.path || c.req.query('path') || '';
    data = body.content ?? '';

    // 处理 base64 上传 (如图片附件)
    if (body.base64 && typeof data === 'string') {
      const binStr = atob(data);
      const bytes = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) {
        bytes[i] = binStr.charCodeAt(i);
      }
      data = bytes;
    }
  } else {
    vaultId = c.req.query('vault') || vaultId;
    filePath = c.req.query('path') || '';
    data = await c.req.arrayBuffer();
  }

  if (!filePath) {
    return c.json({ error: 'Missing path parameter', code: 'EINVAL' }, 400);
  }

  const key = resolveR2Key(vaultId, filePath);
  const now = Date.now().toString();

  // 获取已有 ctime
  const existing = await c.env.VAULT_BUCKET.head(key);
  const ctime = existing?.customMetadata?.ctime || now;

  const mime = getMimeTypeByPath(filePath);
  const httpMetadata: Record<string, string> = {};
  if (mime) {
    httpMetadata.contentType = mime;
  }

  const uploaded = await c.env.VAULT_BUCKET.put(key, data, {
    customMetadata: {
      mtime: now,
      ctime: ctime,
    },
    httpMetadata: Object.keys(httpMetadata).length > 0 ? httpMetadata : undefined,
  });

  return c.json({
    ok: true,
    success: true,
    mtime: parseInt(now, 10),
    size: uploaded?.size || 0,
  });
};

fsRouter.post('/write', handleWriteFile);
fsRouter.post('/writeFile', handleWriteFile);

// 5. POST /api/fs/appendFile
fsRouter.post('/appendFile', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const vaultId = body.vault || c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const filePath = body.path || c.req.query('path') || '';
  const newContent = body.content ?? '';

  if (!filePath) return c.json({ error: 'Missing path' }, 400);

  const key = resolveR2Key(vaultId, filePath);
  let oldContent = '';
  const existing = await c.env.VAULT_BUCKET.get(key);
  if (existing) {
    oldContent = await existing.text();
  }

  const merged = oldContent + newContent;
  const now = Date.now().toString();
  await c.env.VAULT_BUCKET.put(key, merged, {
    customMetadata: { mtime: now, ctime: existing?.customMetadata?.ctime || now }
  });

  return c.json({ ok: true });
});

// 6. POST /api/fs/mkdir
fsRouter.post('/mkdir', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const vaultId = body.vault || c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const filePath = body.path || c.req.query('path') || '';

  if (!filePath) {
    return c.json({ error: 'Missing path parameter', code: 'EINVAL' }, 400);
  }

  const key = `${resolveR2Key(vaultId, filePath)}/.ignis_keep`;
  await c.env.VAULT_BUCKET.put(key, '', {
    customMetadata: { mtime: Date.now().toString() },
  });

  return c.json({ ok: true, success: true });
});

// 7. 各种删除别名 (unlink, rmdir, rm, delete)
const handleDelete = async (c: any) => {
  const body = await c.req.json().catch(() => ({}));
  const vaultId = body.vault || c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const filePath = body.path || c.req.query('path') || '';

  if (!filePath) {
    return c.json({ error: 'Missing path parameter', code: 'EINVAL' }, 400);
  }

  const key = resolveR2Key(vaultId, filePath);

  // 1. 删除单个文件
  await c.env.VAULT_BUCKET.delete(key);
  if (!key.endsWith('.md')) {
    await c.env.VAULT_BUCKET.delete(key + '.md');
  }

  // 2. 如果是目录，批量删除包含的所有子对象
  const dirPrefix = key.endsWith('/') ? key : `${key}/`;
  const list = await c.env.VAULT_BUCKET.list({ prefix: dirPrefix });
  if (list.objects.length > 0) {
    const keysToDelete = list.objects.map((o: any) => o.key);
    await c.env.VAULT_BUCKET.delete(keysToDelete);
  }

  return c.json({ ok: true, success: true });
};

fsRouter.all('/delete', handleDelete);
fsRouter.all('/unlink', handleDelete);
fsRouter.all('/rmdir', handleDelete);
fsRouter.all('/rm', handleDelete);

// 8. POST /api/fs/rename
fsRouter.post('/rename', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const vaultId = body.vault || c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const oldPath = body.oldPath || body.from;
  const newPath = body.newPath || body.to;

  if (!oldPath || !newPath) {
    return c.json({ error: 'Missing oldPath or newPath parameter', code: 'EINVAL' }, 400);
  }

  const oldKey = resolveR2Key(vaultId, oldPath);
  const newKey = resolveR2Key(vaultId, newPath);

  // 尝试按文件移动
  const oldObj = await c.env.VAULT_BUCKET.get(oldKey);
  if (oldObj) {
    await c.env.VAULT_BUCKET.put(newKey, oldObj.body, {
      customMetadata: oldObj.customMetadata,
      httpMetadata: oldObj.httpMetadata,
    });
    await c.env.VAULT_BUCKET.delete(oldKey);
    return c.json({ ok: true, success: true });
  }

  // 尝试按目录批量移动
  const oldDirPrefix = oldKey.endsWith('/') ? oldKey : `${oldKey}/`;
  const newDirPrefix = newKey.endsWith('/') ? newKey : `${newKey}/`;

  const list = await c.env.VAULT_BUCKET.list({ prefix: oldDirPrefix });
  if (list.objects.length > 0) {
    for (const obj of list.objects) {
      const subKey = obj.key.slice(oldDirPrefix.length);
      const targetSubKey = `${newDirPrefix}${subKey}`;
      const item = await c.env.VAULT_BUCKET.get(obj.key);
      if (item) {
        await c.env.VAULT_BUCKET.put(targetSubKey, item.body, {
          customMetadata: item.customMetadata,
          httpMetadata: item.httpMetadata,
        });
      }
    }
    await c.env.VAULT_BUCKET.delete(list.objects.map((o) => o.key));
    return c.json({ ok: true, success: true });
  }

  return c.json({ error: 'Source not found', code: 'ENOENT' }, 404);
});

// 9. POST /api/fs/copyFile
fsRouter.post('/copyFile', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const vaultId = body.vault || c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const src = body.src;
  const dest = body.dest;

  if (!src || !dest) return c.json({ error: 'Missing src or dest' }, 400);

  const srcKey = resolveR2Key(vaultId, src);
  const destKey = resolveR2Key(vaultId, dest);

  const obj = await c.env.VAULT_BUCKET.get(srcKey);
  if (!obj) return c.json({ error: 'Source file not found', code: 'ENOENT' }, 404);

  await c.env.VAULT_BUCKET.put(destKey, obj.body, {
    customMetadata: obj.customMetadata,
    httpMetadata: obj.httpMetadata,
  });

  return c.json({ ok: true });
});

// 10. GET /api/fs/access
fsRouter.get('/access', async (c) => {
  const vaultId = c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const pathParam = c.req.query('path');
  if (!pathParam) return c.json({ error: 'Missing path' }, 400);

  const key = resolveR2Key(vaultId, pathParam);
  const obj = await c.env.VAULT_BUCKET.head(key);
  if (obj) return c.json({ ok: true });

  const dirPrefix = key.endsWith('/') ? key : `${key}/`;
  const list = await c.env.VAULT_BUCKET.list({ prefix: dirPrefix, limit: 1 });
  if (list.objects.length > 0 || (list.delimitedPrefixes && list.delimitedPrefixes.length > 0)) {
    return c.json({ ok: true });
  }

  return c.json({ error: 'ENOENT', code: 'ENOENT' }, 404);
});

// 11. POST /api/fs/batch-read (或者 batchRead)
const handleBatchRead = async (c: any) => {
  const body = await c.req.json().catch(() => ({}));
  const vaultId = body.vault || c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const paths = Array.isArray(body.paths) ? body.paths : [];

  const files: Record<string, string> = {};
  for (const p of paths.slice(0, 100)) {
    const key = resolveR2Key(vaultId, p);
    const obj = await c.env.VAULT_BUCKET.get(key);
    if (obj) {
      files[p] = await obj.text();
    }
  }

  return c.json({ files });
};

fsRouter.post('/batch-read', handleBatchRead);
fsRouter.post('/batchRead', handleBatchRead);

// 12. 回收站机制 (trash, empty-trash)
fsRouter.post('/trash', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const vaultId = body.vault || c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const filePath = body.path || '';

  if (!filePath) return c.json({ error: 'Missing path' }, 400);

  const srcKey = resolveR2Key(vaultId, filePath);
  const trashKey = `vaults/${vaultId}/.trash/${filePath}`;

  const obj = await c.env.VAULT_BUCKET.get(srcKey);
  if (obj) {
    await c.env.VAULT_BUCKET.put(trashKey, obj.body, {
      customMetadata: {
        ...obj.customMetadata,
        trashTime: Date.now().toString(),
      },
    });
    await c.env.VAULT_BUCKET.delete(srcKey);
    return c.json({ ok: true, success: true });
  }

  return c.json({ error: 'File not found', code: 'ENOENT' }, 404);
});

fsRouter.post('/empty-trash', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const vaultId = body.vault || c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const trashPrefix = `vaults/${vaultId}/.trash/`;

  const list = await c.env.VAULT_BUCKET.list({ prefix: trashPrefix });
  if (list.objects.length > 0) {
    await c.env.VAULT_BUCKET.delete(list.objects.map((o) => o.key));
  }

  return c.json({ ok: true, success: true });
});

// 13. POST /api/fs/utimes (更新文件访问/修改时间戳)
const handleUtimes = async (c: any) => {
  let body: any = {};
  if (c.req.header('Content-Type')?.includes('application/json')) {
    body = await c.req.json().catch(() => ({}));
  }
  const vaultId = body.vault || c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const filePath = body.path || c.req.query('path') || '';
  const atime = body.atime !== undefined ? Number(body.atime) : (c.req.query('atime') ? Number(c.req.query('atime')) : Date.now());
  const mtime = body.mtime !== undefined ? Number(body.mtime) : (c.req.query('mtime') ? Number(c.req.query('mtime')) : Date.now());

  if (!filePath) {
    return c.json({ error: 'Missing path parameter', code: 'EINVAL' }, 400);
  }

  let key = resolveR2Key(vaultId, filePath);
  let obj = await c.env.VAULT_BUCKET.get(key);
  if (!obj && !key.endsWith('.md')) {
    const mdKey = key + '.md';
    const mdObj = await c.env.VAULT_BUCKET.get(mdKey);
    if (mdObj) {
      key = mdKey;
      obj = mdObj;
    }
  }

  if (obj) {
    const now = Date.now().toString();
    const ctime = obj.customMetadata?.ctime || now;
    await c.env.VAULT_BUCKET.put(key, obj.body, {
      customMetadata: {
        ...obj.customMetadata,
        ctime: ctime,
        mtime: mtime.toString(),
        atime: atime.toString(),
      },
      httpMetadata: obj.httpMetadata,
    });
  }

  return c.json({ ok: true, success: true });
};

fsRouter.all('/utimes', handleUtimes);

// 14. GET /api/fs/tree (获取全仓库/子目录文件树与元数据)
fsRouter.get('/tree', async (c) => {
  const vaultId = c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const pathParam = c.req.query('path') || '';
  const prefix = pathParam ? resolveR2Key(vaultId, pathParam) : `vaults/${vaultId}/`;
  const cleanPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;

  const tree: Record<string, any> = {};
  let cursor: string | undefined = undefined;

  do {
    const list: any = await c.env.VAULT_BUCKET.list({
      prefix: cleanPrefix,
      cursor,
      limit: 1000,
    });

    for (const obj of list.objects) {
      const rel = obj.key.slice(cleanPrefix.length);
      if (!rel || rel.startsWith('.trash/') || rel === '.ignis_keep' || rel.endsWith('/.ignis_keep')) continue;

      // 提取并补全父目录结构
      const parts = rel.split('/');
      let currentDir = '';
      for (let i = 0; i < parts.length - 1; i++) {
        currentDir = currentDir ? `${currentDir}/${parts[i]}` : parts[i];
        if (!tree[currentDir]) {
          tree[currentDir] = { type: 'directory' };
        }
      }

      const mtime = obj.customMetadata?.mtime ? parseInt(obj.customMetadata.mtime, 10) : obj.uploaded.getTime();
      const ctime = obj.customMetadata?.ctime ? parseInt(obj.customMetadata.ctime, 10) : mtime;
      tree[rel] = {
        type: 'file',
        size: obj.size,
        mtime,
        ctime,
      };
    }

    cursor = list.truncated ? list.cursor : undefined;
  } while (cursor);

  return c.json(tree, 200, { 'Cache-Control': 'no-store' });
});

// 15. GET /api/fs/download (直接下载单文件)
fsRouter.get('/download', async (c) => {
  const vaultId = c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const pathParam = c.req.query('path') || '';
  if (!pathParam) return c.json({ error: 'Missing path' }, 400);

  const key = resolveR2Key(vaultId, pathParam);
  const obj = await c.env.VAULT_BUCKET.get(key);
  if (!obj) return c.json({ error: 'File not found', code: 'ENOENT' }, 404);

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  const filename = pathParam.split('/').pop() || 'download';
  headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
  return new Response(obj.body, { headers });
});
