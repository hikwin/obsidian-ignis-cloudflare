# Cloudflare 命令行 (Wrangler CLI) 极速部署教程

> **适用对象**：持有当前发布包（包含 `assets/`、`dist/` 及 `wrangler.toml`）的用户。
> **特点**：**纯开箱即用，无需源码，无需编译**，仅需几条终端命令即可 100% 免费完成个人云端 Obsidian Web 部署。

---

## 📌 当前目录结构一览

解压或打开本文件夹后，根目录下已包含部署所需的全部文件：

```text
├── assets/               # ✅ 前端静态资源目录 (包含 Obsidian 官方客户端、UI 及桥接脚本)
├── dist/
│   └── index.js          # ✅ 已编译打包好的 Worker 单文件核心 (无需编译)
├── wrangler.toml         # ✅ 部署配置文件 (已预置好基础配置)
├── 命令行cf部署.md        # 📖 本教程
└── 手动cf部署.md          # 📖 网页控制台鼠标点击部署教程
```

> 💡 **部署前准备**：
> 1. 电脑已安装 **[Node.js](https://nodejs.org/) (推荐 LTS 18+ 或 20+)**；
> 2. 一个 **[Cloudflare 免费账号](https://dash.cloudflare.com/)**。

---

## 🚀 第一步：安装并登录 Wrangler CLI

在当前文件夹的空白处按住 `Shift` 键点击鼠标右键，选择 **「在此处打开 PowerShell 窗口」**（或在终端中 `cd` 进当前文件夹）：

```bash
# 1. 全局安装 Cloudflare 官方部署工具 wrangler (如已安装可跳过)
npm install -g wrangler

# 2. 登录您的 Cloudflare 账号
wrangler login
```

*执行 `wrangler login` 后，浏览器会自动弹出 Cloudflare 官方授权页面，点击 **「Allow (允许)」** 授权即可。*

---

## 📦 第二步：创建 R2 存储桶与 KV 命名空间

在当前文件夹的终端中，依次执行以下命令：

### 1. 创建 R2 存储桶 (存放个人笔记与图片附件)
```bash
wrangler r2 bucket create obsidian-vault
```
*终端提示 `Created bucket 'obsidian-vault'` 即表示创建成功。*

### 2. 创建 KV 命名空间 (存放登录会话与用户配置)
```bash
wrangler kv namespace create IGNIS_KV
```

执行后，终端将输出类似以下内容：
```text
🌀 Creating namespace with title "obsidian-web-IGNIS_KV"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
[[kv_namespaces]]
binding = "IGNIS_KV"
id = "a1b2c3d4e5f67890abcdef1234567890"  <-- 复制这串属于您账号的真实 ID
```

---

## ⚙️ 第三步：填写 `wrangler.toml` 中的 KV ID

使用任意文本编辑器（如记事本、VS Code）打开当前目录下的 `wrangler.toml` 文件：

找到第 13 行左右的 `id = "YOUR_KV_NAMESPACE_ID"`，将 `YOUR_KV_NAMESPACE_ID` 替换为第二步生成的真实 ID：

```toml
name = "obsidian-web"
main = "dist/index.js"
compatibility_date = "2024-05-12"
compatibility_flags = ["nodejs_compat"]

# 1. 绑定 R2 存储桶
[[r2_buckets]]
binding = "VAULT_BUCKET"
bucket_name = "obsidian-vault"

# 2. 绑定 KV 命名空间 (将下方引号内替换为您的真实 KV ID)
[[kv_namespaces]]
binding = "IGNIS_KV"
id = "a1b2c3d4e5f67890abcdef1234567890"

# 3. 静态资源自动托管绑定 (Cloudflare Workers Assets)
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
*保存并关闭 `wrangler.toml`。*

---

## 🔐 第四步：设置管理员访问密码

在终端执行以下命令设置您的后台访问密码（密码将在 Cloudflare 端加密存储，安全无忧）：

```bash
wrangler secret put ADMIN_PASSWORD
```

> 终端会提示 `Enter a secret value:`，输入您自定义的密码（例如 `Obsidian@2026`）后按回车。

---

## 🚀 第五步：一键部署发布

确认上述步骤完成后，直接执行部署命令：

```bash
wrangler deploy
```

部署成功后，终端将输出您的专属访问域名，例如：
```text
Total Upload: 116.71 KiB / gzip: 27.64 KiB
Uploaded obsidian-web (2.12 sec)
Deployed obsidian-web triggers (0.85 sec)
  https://obsidian-web.your-subdomain.workers.dev
Current Deployment ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 🌐 第六步：登录与使用

1. 打开浏览器，访问终端输出的链接 `https://obsidian-web.your-subdomain.workers.dev`；
2. 系统会自动跳转到登录页 `/login`；
3. 输入在第四步中设置的管理员密码即可进入系统；
4. 进入后您可以在浏览器中享受全功能 Obsidian，支持 Markdown 实时编辑、粘贴图片、双链跳转与多知识库管理！

---

## 🛠️ 常用维护命令指南

| 需求场景 | 终端命令 | 说明 |
| :--- | :--- | :--- |
| **重新部署 / 更新** | `wrangler deploy` | 修改配置或更新文件后重新发布 |
| **修改管理员密码** | `wrangler secret put ADMIN_PASSWORD` | 随时重置登录访问密码 |
| **查看实时运行日志** | `wrangler tail` | 排查接口与运行报错 |
| **绑定自定义独立域名** | `wrangler domains add notes.yourdomain.com` | 绑定自己的个性化域名 |
| **查看 R2 存储桶文件列表** | `wrangler r2 object list obsidian-vault` | 查看当前已保存的笔记与附件 |

---

## ❓ 常见问题排查 (FAQ)

1. **Q：提示 `wrangler: command not found` 或不是内部命令？**
   - **解决**：说明本地未正确安装 Node.js 或未执行 `npm install -g wrangler`。请先下载安装 Node.js 后重试。
2. **Q：部署时提示 `main: "dist/index.js" does not exist`？**
   - **解决**：请确认您的终端处于包含 `dist/` 文件夹的根目录下执行 `wrangler deploy`。
3. **Q：访问页面报 500 或报错 `KV namespace binding not found`？**
   - **解决**：请检查 `wrangler.toml` 中的 `id` 是否已替换为您在第二步通过 `wrangler kv namespace create` 生成的真实 ID，修改后重新执行 `wrangler deploy`。
4. **Q：粘贴图片或附件显示 404？**
   - **解决**：本包内自带的 `dist/index.js` 已包含最新的多策略 `/vault-files/*` 路由与 MIME 智能识别修复，无需任何手动调整。
