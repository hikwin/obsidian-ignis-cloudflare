import { Hono } from 'hono';
import { Env, TreeItem } from './types';
import { getRegisteredVaults } from './vault';

export const bootstrapRouter = new Hono<{ Bindings: Env }>();

bootstrapRouter.get('/', async (c) => {
  const env = c.env;
  const vaultId = c.req.query('vault') || env.DEFAULT_VAULT_ID || 'default';
  const vaults = await getRegisteredVaults(env);
  const currentVault = vaults.find((v) => v.id === vaultId) || vaults[0];

  const prefix = `vaults/${vaultId}/`;
  const tree: Record<string, TreeItem> = {};

  // 1. 高速拉取 R2 存储桶中的对象构建完整树
  let truncated = true;
  let cursor: string | undefined = undefined;

  while (truncated) {
    const list = await env.VAULT_BUCKET.list({
      prefix,
      cursor,
    });

    for (const obj of list.objects) {
      const relPath = obj.key.slice(prefix.length);
      if (!relPath || relPath === '.ignis_keep') continue;

      const mtime = obj.customMetadata?.mtime ? parseInt(obj.customMetadata.mtime, 10) : obj.uploaded.getTime();
      const ctime = obj.customMetadata?.ctime ? parseInt(obj.customMetadata.ctime, 10) : mtime;

      // 如果包含子目录，自动构建父目录节点
      const parts = relPath.split('/');
      let currentDir = '';
      for (let i = 0; i < parts.length - 1; i++) {
        currentDir = currentDir ? `${currentDir}/${parts[i]}` : parts[i];
        if (!tree[currentDir]) {
          tree[currentDir] = { type: 'directory' };
        }
      }

      if (relPath.endsWith('/.ignis_keep')) {
        const dirName = relPath.slice(0, -'/.ignis_keep'.length);
        if (dirName && !tree[dirName]) {
          tree[dirName] = { type: 'directory' };
        }
      } else if (!relPath.endsWith('/')) {
        tree[relPath] = {
          type: 'file',
          size: obj.size,
          mtime,
          ctime,
        };
      }
    }

    truncated = list.truncated;
    cursor = list.truncated ? list.cursor : undefined;
  }

  const responseData = {
    vault: {
      id: currentVault.id,
      name: currentVault.name,
      path: currentVault.path,
      platform: 'win32',
      version: env.OBSIDIAN_VERSION || '1.8.7',
    },
    vaultList: vaults,
    tree,
    plugins: [],
    virtualPlugins: [],
    settings: {
      contentCacheBytes: 52428800,
      inputCacheBytes: 10485760,
      inputCacheTtlMs: 300000,
      directFetchHosts: [],
    },
  };

  return c.json(responseData, 200, {
    'Cache-Control': 'no-store',
  });
});
