import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.resolve(__dirname, '../public/assets/obsidian');
const VERSION = process.argv[2] || 'v1.8.7';
const BASE_VERSION = VERSION.replace(/^v/, '');
const GITHUB_URL = `https://github.com/obsidianmd/obsidian-releases/releases/download/${VERSION}/obsidian-${BASE_VERSION}.asar.gz`;
const FALLBACK_URL = `https://ghproxy.net/${GITHUB_URL}`;

console.log(`\n📦 开始获取 Obsidian 官方核心资源 (${VERSION})...`);

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function fetchBuffer(url) {
  console.log(`🌐 正在请求下载: ${url}`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// 简易 ASAR 提取器 (纯原生 JS，无需第三方依赖)
function extractAsar(asarBuf, outDir) {
  console.log('📂 正在解析并解包 ASAR 归档文件...');
  let offset = 0;
  // ASAR 头部规范: 4 字节 4, 4 字节 headerSize(u32), 4 字节 headerSize(u32), 4 字节 jsonSize(u32)
  const headerSize = asarBuf.readUInt32LE(12);
  const jsonBuf = asarBuf.subarray(16, 16 + headerSize);
  const header = JSON.parse(jsonBuf.toString('utf8'));
  const payloadOffset = 16 + headerSize;

  function walk(node, currentPath) {
    if (node.files) {
      const dirPath = path.join(outDir, currentPath);
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
      for (const [name, child] of Object.entries(node.files)) {
        walk(child, path.join(currentPath, name));
      }
    } else if (node.size !== undefined && node.offset !== undefined) {
      const fileOffset = payloadOffset + parseInt(node.offset, 10);
      const fileData = asarBuf.subarray(fileOffset, fileOffset + node.size);
      const filePath = path.join(outDir, currentPath);
      const parentDir = path.dirname(filePath);
      if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
      fs.writeFileSync(filePath, fileData);
    }
  }

  walk(header, '');
  console.log('✅ ASAR 核心文件解包完成！');
}

async function run() {
  let gzBuffer;
  try {
    gzBuffer = await fetchBuffer(GITHUB_URL);
  } catch (err) {
    console.warn(`⚠️ 直连下载失败 (${err.message})，尝试使用 GitHub 加速镜像...`);
    try {
      gzBuffer = await fetchBuffer(FALLBACK_URL);
    } catch (err2) {
      console.error(`❌ 下载失败: ${err2.message}`);
      console.log('👉 提示：您可以手动将已解压的 app.js, app.css, lib/, i18n/ 放置到 obscf/public/assets/obsidian/ 目录下。');
      process.exit(1);
    }
  }

  console.log(`📥 下载成功 (${(gzBuffer.length / 1024 / 1024).toFixed(2)} MB)，正在解压 GZip...`);
  const asarBuffer = zlib.gunzipSync(gzBuffer);

  extractAsar(asarBuffer, TARGET_DIR);
  console.log(`\n🎉 Obsidian 核心资源已成功安装至: ${TARGET_DIR}`);
  console.log('包含文件:', fs.readdirSync(TARGET_DIR).join(', '));
}

run();
