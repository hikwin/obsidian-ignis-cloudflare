# Cloudflare 命令行 (Wrangler CLI) 极速部署教程 / Cloudflare Wrangler CLI Fast Deployment Guide

<p align="center">
  <a href="#-中文教程">🇨🇳 简体中文</a> | <a href="#-english-guide">🇺🇸 English</a>
</p>

---

# 🇨🇳 中文教程

> **适用对象**：持有当前项目包（包含 `assets/`、`dist/` 及 `wrangler.toml`）的用户。
> **特点**：**纯开箱即用，无需源码，无需编译**，仅需几条终端命令即可 100% 免费完成个人云端 Obsidian Web 部署。

---

## 📌 当前目录结构一览

```text
├── public/
│   └── assets/           # ✅ 前端静态资源目录
│       ├── obsidian/     # 👈 存放 Obsidian 官方客户端资源 (若为空请运行下方的 download_assets.py)
│       ├── ui/           # 👈 Ignis UI 交互脚本 (ignis-ui.js)
│       └── shim/         # 👈 Ignis 适配垫片脚本 (shim-loader.js)
├── dist/
│   └── index.js          # ✅ 已编译打包好的 Worker 单文件核心 (无需额外编译)
├── wrangler.toml         # ✅ 部署配置文件 (已预置好基础配置)
├── download_assets.py    # 📦 静态资源下载与自动编译工具 (GUI / CLI)
├── MANUAL_WEB_DEPLOY_TUTORIAL.md    # 📖 网页控制台鼠标点击部署教程
└── COMMAND_DEPLOY_TUTORIAL.md       # 📖 本教程 (CLI 部署教程)
```

> 💡 **部署前准备**：
> 1. 电脑已安装 **[Node.js](https://nodejs.org/) (推荐 LTS 18+ 或 20+)**；
> 2. 一个 **[Cloudflare 免费账号](https://dash.cloudflare.com/)**；
> 3. **确认静态资源已就绪**：若 `public/assets/obsidian/` 目录为空，请先在终端执行 `python download_assets.py --cli` 一键下载并解压官方核心资源。

---

## 🚀 第一步：安装并登录 Wrangler CLI

在项目根目录下打开终端：

```bash
# 1. 全局安装 Cloudflare 官方部署工具 wrangler (如已安装可跳过)
npm install -g wrangler

# 2. 登录您的 Cloudflare 账号
wrangler login
```
*浏览器会自动弹出 Cloudflare 官方授权页面，点击 **「Allow (允许)」** 授权即可。*

---

## 📦 第二步：创建 R2 存储桶与 KV 命名空间

### 1. 创建 R2 存储桶 (存放个人笔记与附件)
```bash
wrangler r2 bucket create obsidian-vault
```

### 2. 创建 KV 命名空间 (存放登录会话与用户配置)
```bash
wrangler kv namespace create IGNIS_KV
```

执行后，终端将输出类似以下内容：
```text
[[kv_namespaces]]
binding = "IGNIS_KV"
id = "a1b2c3d4e5f67890abcdef1234567890"  <-- 复制这串属于您账号的真实 ID
```

---

## ⚙️ 第三步：填写 `wrangler.toml` 中的 KV ID

打开 `wrangler.toml` 文件，将 `YOUR_KV_NAMESPACE_ID` 替换为您刚刚生成的真实 ID：

```toml
name = "obsidian-web"
main = "dist/index.js"
compatibility_date = "2024-05-12"
compatibility_flags = ["nodejs_compat"]

# 1. 绑定 R2 存储桶
[[r2_buckets]]
binding = "VAULT_BUCKET"
bucket_name = "obsidian-vault"

# 2. 绑定 KV 命名空间
[[kv_namespaces]]
binding = "IGNIS_KV"
id = "a1b2c3d4e5f67890abcdef1234567890"

# 3. 静态资源自动托管绑定
[assets]
directory = "./"
binding = "ASSETS"

# 4. 环境变量配置
[vars]
DEFAULT_VAULT_ID = "default"
DEFAULT_VAULT_NAME = "我的知识库"
OBSIDIAN_VERSION = "1.8.7"
COOKIE_NAME = "ignis_cf_token"
PROXY_MODE = "all"
```

---

## 🔐 第四步：设置管理员访问密码

在终端执行以下命令设置登录密码：

```bash
wrangler secret put ADMIN_PASSWORD
```
> 终端提示 `Enter a secret value:`，输入您自定义的密码（例如 `Obsidian@2026`）后按回车。

---

## 🚀 第五步：一键部署发布

```bash
wrangler deploy
```

部署成功后，终端将输出您的专属访问域名：
```text
  https://obsidian-web.your-subdomain.workers.dev
```

---

## 🌐 第六步：登录与使用

1. 打开浏览器访问终端输出的链接；
2. 输入刚才设置的管理员密码即可进入系统；
3. 支持 Markdown 实时编辑、粘贴图片附件、双链跳转与多知识库管理！

---

## 🛠️ 常用维护命令指南

| 需求场景 | 终端命令 | 说明 |
| :--- | :--- | :--- |
| **重新部署 / 更新** | `wrangler deploy` | 修改配置或更新文件后重新发布 |
| **修改管理员密码** | `wrangler secret put ADMIN_PASSWORD` | 随时重置登录访问密码 |
| **查看实时运行日志** | `wrangler tail` | 排查接口与运行报错 |
| **绑定自定义独立域名** | `wrangler domains add notes.yourdomain.com` | 绑定自己的个性化域名 |

---

<br><br>

# 🇺🇸 English Guide

> **Audience**: Users deploying via the pre-built bundle (`assets/`, `dist/`, and `wrangler.toml`).
> **Highlights**: **Ready-to-use without source compilation**. Deploy your serverless private Obsidian in a few CLI commands.

---

## 📌 Directory Structure
 
```text
├── public/
│   └── assets/           # ✅ Static assets directory
│       ├── obsidian/     # 👈 Official Obsidian assets (run download_assets.py if empty)
│       ├── ui/           # 👈 Ignis UI script (ignis-ui.js)
│       └── shim/         # 👈 Ignis shim loader (shim-loader.js)
├── dist/
│   └── index.js          # ✅ Pre-built Worker single-file entrypoint
├── wrangler.toml         # ✅ Deployment configuration
├── download_assets.py    # 📦 Asset downloader and builder script (GUI / CLI)
├── MANUAL_WEB_DEPLOY_TUTORIAL.md    # 📖 Web Dashboard GUI Guide
└── COMMAND_DEPLOY_TUTORIAL.md       # 📖 This Guide (CLI)
```

> 💡 **Prerequisites**:
> 1. **[Node.js](https://nodejs.org/) (LTS 18+ or 20+ recommended)** installed;
> 2. A free **[Cloudflare account](https://dash.cloudflare.com/)**;
> 3. **Static Assets Check**: If `public/assets/obsidian/` is empty, run `python download_assets.py --cli` to automatically fetch and unpack the required official Obsidian assets.


---

## 🚀 Step 1: Install & Login Wrangler CLI

Open a terminal in the project directory:

```bash
# 1. Install Cloudflare Wrangler globally
npm install -g wrangler

# 2. Login to your Cloudflare account
wrangler login
```

---

## 📦 Step 2: Create R2 Bucket and KV Namespace

### 1. Create R2 Bucket (Notes & Attachments)
```bash
wrangler r2 bucket create obsidian-vault
```

### 2. Create KV Namespace (Sessions & Configs)
```bash
wrangler kv namespace create IGNIS_KV
```

Copy the generated namespace ID:
```text
[[kv_namespaces]]
binding = "IGNIS_KV"
id = "a1b2c3d4e5f67890abcdef1234567890"  <-- Copy your actual ID
```

---

## ⚙️ Step 3: Update `wrangler.toml` with your KV ID

Open `wrangler.toml` and replace `YOUR_KV_NAMESPACE_ID` with your actual ID from Step 2:

```toml
name = "obsidian-web"
main = "dist/index.js"
compatibility_date = "2024-05-12"
compatibility_flags = ["nodejs_compat"]

# 1. Bind R2 Bucket
[[r2_buckets]]
binding = "VAULT_BUCKET"
bucket_name = "obsidian-vault"

# 2. Bind KV Namespace
[[kv_namespaces]]
binding = "IGNIS_KV"
id = "a1b2c3d4e5f67890abcdef1234567890"

# 3. Static Assets Binding
[assets]
directory = "./"
binding = "ASSETS"

# 4. Environment Variables
[vars]
DEFAULT_VAULT_ID = "default"
DEFAULT_VAULT_NAME = "My Notes"
OBSIDIAN_VERSION = "1.8.7"
COOKIE_NAME = "ignis_cf_token"
PROXY_MODE = "all"
```

---

## 🔐 Step 4: Set Admin Password

Run the command to securely save your password:

```bash
wrangler secret put ADMIN_PASSWORD
```
> When prompted (`Enter a secret value:`), type your desired password (e.g. `Obsidian@2026`) and press Enter.

---

## 🚀 Step 5: Deploy

```bash
wrangler deploy
```

Once deployed, your live URL will be shown:
```text
  https://obsidian-web.your-subdomain.workers.dev
```

---

## 🌐 Step 6: Login & Use

1. Open the URL in your browser;
2. Log in with your password;
3. Enjoy your personal, serverless web-based Obsidian!

---

## 🛠️ Common Maintenance Commands

| Task | Command | Description |
| :--- | :--- | :--- |
| **Redeploy / Update** | `wrangler deploy` | Publish new assets or configuration |
| **Change Password** | `wrangler secret put ADMIN_PASSWORD` | Reset access password anytime |
| **View Live Logs** | `wrangler tail` | Stream realtime worker request logs |
| **Add Custom Domain** | `wrangler domains add notes.yourdomain.com` | Bind a custom apex or subdomain |
| **List R2 Files** | `wrangler r2 object list obsidian-vault` | Inspect notes and media in R2 |
