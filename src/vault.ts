import { Hono } from 'hono';
import { Env, VaultInfo } from './types';

export const vaultRouter = new Hono<{ Bindings: Env }>();

// 获取所有已注册的 Vaults
export async function getRegisteredVaults(env: Env): Promise<VaultInfo[]> {
  const defaultVault: VaultInfo = {
    id: env.DEFAULT_VAULT_ID || 'default',
    name: env.DEFAULT_VAULT_NAME || 'Default Vault',
    path: `vaults/${env.DEFAULT_VAULT_ID || 'default'}`,
    platform: 'win32',
    version: env.OBSIDIAN_VERSION || '1.8.7',
  };

  if (env.IGNIS_KV) {
    const list = await env.IGNIS_KV.get('VAULT_LIST', 'json') as VaultInfo[] | null;
    if (list && Array.isArray(list) && list.length > 0) {
      return list;
    }
  }

  return [defaultVault];
}

// 1. GET /api/vault/list
vaultRouter.get('/list', async (c) => {
  const vaults = await getRegisteredVaults(c.env);
  return c.json(vaults);
});

// 2. GET /api/vault/info
vaultRouter.get('/info', async (c) => {
  const vaultId = c.req.query('vault') || c.env.DEFAULT_VAULT_ID || 'default';
  const vaults = await getRegisteredVaults(c.env);
  const found = vaults.find((v) => v.id === vaultId) || vaults[0];

  return c.json({
    id: found.id,
    name: found.name,
    path: found.path,
    platform: 'win32',
    version: c.env.OBSIDIAN_VERSION || '1.8.7',
  });
});

// 3. POST /api/vault/create
vaultRouter.post('/create', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const name = (body.name || '').trim();

  if (!name || /[\/\\:*?"<>|]/.test(name)) {
    return c.json({ error: 'Invalid vault name' }, 400);
  }

  const vaults = await getRegisteredVaults(c.env);
  if (vaults.some((v) => v.id === name || v.name === name)) {
    return c.json({ error: 'Vault already exists' }, 409);
  }

  // 在 R2 中创建仓库目录及 .obsidian 配置标记
  const keepKey = `vaults/${name}/.obsidian/.ignis_keep`;
  await c.env.VAULT_BUCKET.put(keepKey, '', {
    customMetadata: { mtime: Date.now().toString() },
  });

  const newVault: VaultInfo = {
    id: name,
    name: name,
    path: `vaults/${name}`,
    platform: 'win32',
    version: c.env.OBSIDIAN_VERSION || '1.8.7',
  };

  vaults.push(newVault);
  if (c.env.IGNIS_KV) {
    await c.env.IGNIS_KV.put('VAULT_LIST', JSON.stringify(vaults));
  }

  return c.json({ ok: true, id: name, path: newVault.path });
});

// 4. POST /api/vault/rename
vaultRouter.post('/rename', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const vaultId = body.vault;
  const newName = (body.name || '').trim();

  if (!vaultId || !newName || /[\/\\:*?"<>|]/.test(newName)) {
    return c.json({ error: 'Invalid parameters' }, 400);
  }

  const vaults = await getRegisteredVaults(c.env);
  const target = vaults.find((v) => v.id === vaultId);
  if (!target) {
    return c.json({ error: 'Vault not found' }, 404);
  }

  // 批量移动 R2 中的对象
  const oldPrefix = `vaults/${vaultId}/`;
  const newPrefix = `vaults/${newName}/`;

  const list = await c.env.VAULT_BUCKET.list({ prefix: oldPrefix });
  for (const obj of list.objects) {
    const subKey = obj.key.slice(oldPrefix.length);
    const item = await c.env.VAULT_BUCKET.get(obj.key);
    if (item) {
      await c.env.VAULT_BUCKET.put(`${newPrefix}${subKey}`, item.body, {
        customMetadata: item.customMetadata,
      });
    }
  }
  if (list.objects.length > 0) {
    await c.env.VAULT_BUCKET.delete(list.objects.map((o) => o.key));
  }

  target.id = newName;
  target.name = newName;
  target.path = `vaults/${newName}`;

  if (c.env.IGNIS_KV) {
    await c.env.IGNIS_KV.put('VAULT_LIST', JSON.stringify(vaults));
  }

  return c.json({ ok: true, id: newName, path: target.path });
});

// 5. POST /api/vault/remove (或 GET ?vault=...)
vaultRouter.all('/remove', async (c) => {
  const vaultId = c.req.query('vault') || (await c.req.json().catch(() => ({}))).vault;
  if (!vaultId) return c.json({ error: 'Missing vault' }, 400);

  let vaults = await getRegisteredVaults(c.env);
  vaults = vaults.filter((v) => v.id !== vaultId);

  // 清空 R2 仓库前缀下的所有文件
  const prefix = `vaults/${vaultId}/`;
  const list = await c.env.VAULT_BUCKET.list({ prefix });
  if (list.objects.length > 0) {
    await c.env.VAULT_BUCKET.delete(list.objects.map((o) => o.key));
  }

  if (c.env.IGNIS_KV) {
    await c.env.IGNIS_KV.put('VAULT_LIST', JSON.stringify(vaults));
  }

  return c.json({ ok: true });
});
