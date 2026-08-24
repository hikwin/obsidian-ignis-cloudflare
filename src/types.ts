export interface Env {
  VAULT_BUCKET: R2Bucket;
  IGNIS_KV?: KVNamespace;
  ASSETS?: Fetcher;
  DEFAULT_VAULT_ID?: string;
  DEFAULT_VAULT_NAME?: string;
  OBSIDIAN_VERSION?: string;
  COOKIE_NAME?: string;
  PROXY_MODE?: string;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  JWT_SECRET?: string;
}

export interface Variables {
  user: Record<string, any>;
}

export interface TreeItem {
  type: 'file' | 'directory';
  size?: number;
  mtime?: number;
  ctime?: number;
}

export interface VaultInfo {
  id: string;
  name: string;
  path: string;
  platform?: string;
  version?: string;
}
