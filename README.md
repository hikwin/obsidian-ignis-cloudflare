# Obsidian Web on Cloudflare (Serverless Jamstack)

<p align="center">
  <b>🌐 随时随地，在任意现代浏览器中畅享完整的 Obsidian 云端笔记体验</b><br>
  <b>🌐 Access your full Obsidian notes from any modern web browser, anywhere, anytime</b>
</p>

<p align="center">
  <a href="#-中文文档">🇨🇳 简体中文</a> | <a href="#-english-documentation">🇺🇸 English</a>
</p>

---

# 🇨🇳 中文文档

> **项目目标**：将 Obsidian Web（Ignis）改造成完全运行在 **Cloudflare 免费额度** 上的无服务器（Serverless / Jamstack）架构，实现 **0 服务器成本、0 运维、全球 CDN 加速、高可用与安全持久化存储**。

---

## 📑 方案目录导航

| 文件 | 核心内容说明 |
| :--- | :--- |
| 🌟 **[网页控制台纯手动部署教程 (保姆级)](./MANUAL_WEB_DEPLOY_TUTORIAL.md)** | **0 命令行、纯浏览器点击** 完成 R2、KV、Worker 代码粘贴与部署 |
| ⚡ **[命令行极速部署教程 (Wrangler CLI)](./COMMAND_DEPLOY_TUTORIAL.md)** | **无需源码编译**，使用打包好的 `dist/index.js` 与 `assets/` 极速部署 |

---

## 🎯 核心架构与原理

当前方案利用 Cloudflare 的全球边缘计算与存储产品构建了一套高可用、零维护成本的云端知识库：

```
+-------------------------------------------------------------------------+
|                              客户端浏览器                                |
|         (Obsidian 官方 app.js + ignis-ui.js + shim-loader.js)           |
+------------------------------------+------------------------------------+
                                     |
                +--------------------+--------------------+
                |                                         |
        [静态资源请求]                             [API 文件操作请求]
   (/assets/..., /favicon.ico)               (/api/fs/*, /api/vault/*)
                |                                         |
                v                                         v
+-------------------------------+       +---------------------------------+
|   Cloudflare Pages / Assets   |       |       Cloudflare Workers        |
|    - 托管 HTML / CSS / JS     |       |    - 处理 /api/fs/stat          |
|    - 无限免费流量与全球 CDN    |       |    - 处理 /api/fs/read/write    |
|    - 毫秒级边缘就近分发       |       |    - JWT / KV 鉴权校验          |
+-------------------------------+       +----------------+----------------+
                                                         |
                                 +-----------------------+-----------------------+
                                 |                                               |
                                 v                                               v
                  +-----------------------------+                 +-----------------------------+
                  |     Cloudflare R2 存储桶     |                 |  Cloudflare D1 / KV / Secret |
                  |   - 保存 Obsidian 笔记库     |                 |   - 保存密码 Hash / 会话    |
                  |   - 10GB 免费存储            |                 |   - 保存用户配置与仓库元数据 |
                  |   - 0 出网流量费 (Egress)    |                 |   - 毫秒级边缘读写           |
                  +-----------------------------+                 +-----------------------------+
```

---

## 💰 为什么 Cloudflare 免费额度对个人完全够用？

| 服务组件 | 角色与用途 | Cloudflare 官方免费额度 (Free Tier) | 个人 Obsidian 实际消耗评估 | 额度充足度 |
| :--- | :--- | :--- | :--- | :---: |
| **Cloudflare Pages / Assets** | 托管前端核心静态资源 | **无限请求次数、无限流量** | 核心文件约 15MB，全球 CDN 加速 | 🟢 **100% 免费** |
| **Cloudflare Workers** | 替代传统后端执行 API 逻辑 | **100,000 次请求 / 每天**<br>(10ms CPU/请求) | 个人单日重度编辑约 1,000 ~ 5,000 次 | 🟢 **充裕 (仅用 ~5%)** |
| **Cloudflare R2** | 替代本地磁盘保存笔记文件 | **10 GB 存储**<br>**100 万次/月 写入 (Class A)**<br>**1,000 万次/月 读取 (Class B)**<br>**0 出网流量费** | Markdown 纯文本+配图通常 < 2GB<br>日均读写几千次，月均远低于限额 | 🟢 **充裕 (仅用 ~10%)** |
| **Cloudflare KV / D1** | 保存会话 Token、密码与设置 | **KV：100,000 次读/天，1,000 次写/天**<br>**D1：500 万次读/天，10 万次写/天** | 仅用于登录状态校验与配置读取 | 🟢 **极其充裕** |
| **Cloudflare Zero Trust** | （可选）免密企业级 SSO 保护 | **免费支持最多 50 个用户** | 个人使用 1 个账号即可 | 🟢 **完全免费** |

---

## 💡 方案亮点对比

| 对比维度 | 原 PHP 架构 (传统 VPS) | Cloudflare Serverless 架构 (本方案) |
| :--- | :--- | :--- |
| **服务器费用** | 需要购买 VPS 或虚拟主机（每年数百元） | **永久 0 元**（利用官方终身免费额度） |
| **运维成本** | 需维护 PHP、Nginx/Apache、SQLite 备份、SSL 续期 | **0 运维**，无服务器停机与证书过期烦恼 |
| **访问速度** | 受限于单台 VPS 服务器带宽与地理位置 | **全球 300+ 边缘节点 CDN Anycast 加速** |
| **数据安全性** | 依赖单机硬盘，需自行配置增量异地备份 | **R2 对象存储 11 个 9 (99.999999999%) 耐用性** |
| **跨设备访问** | 只要有浏览器即可访问，无需在本地安装客户端 | **随时随地打开网页即可畅快记笔记** |

---

## 📦 前端静态资源获取与自动编译工具 (`download_assets.py`)

本项目提供了一个全自动化的 Python 静态资源下载与解包编译工具 [`download_assets.py`](./download_assets.py)，支持 **GUI 可视化窗口** 与 **CLI 命令行** 双模式运行。

### 1. 文件与目录结构规范

```text
obscf/                                   # 项目根目录
├── download_assets.py                   # 👈 Python 静态资源获取与自动编译工具
├── public/
│   ├── dist/                            # 🚀 本项目编译打包好的核心产物目录 (开箱即用)
│   │   ├── _worker.js                   # 👈 Cloudflare Pages / Workers 服务端执行核心
│   │   └── index.js                     # 👈 单文件版 Worker 脚本 (用于网页控制台粘贴或极速部署)
│   └── assets/                          # 静态资源根目录（脚本自动识别并输出到此）
│       ├── obsidian/                    # 👈 Obsidian 官方核心解压产物（已加入 git 忽略）
│       │   ├── app.js
│       │   ├── app.css
│       │   └── lib/ (CodeMirror, Moment, Pixi 等)
│       ├── ui/
│       │   └── ignis-ui.js              # 👈 Ignis UI 交互组件库
│       └── shim/
│           └── shim-loader.js           # 👈 Ignis 浏览器 Electron/Node 垫片层
└── ...
```

### 2. 工具运行方式

#### 🖥️ 方式 A：图形化界面 (GUI 模式，推荐)
在项目根目录下直接运行：
```bash
python download_assets.py
```
* 打开现代化桌面窗口，可视化选择 Obsidian 版本与 GitHub 加速镜像。
* **Ignis 模式切换**：支持在「⚡ 直连快速下载」与「🛠️ GitHub 源码本地编译」之间一键切换。
* 支持一键刷新 GitHub 最新 Release 标签，实时查看下载解压与打包进度日志。

#### ⚡ 方式 B：命令行 (CLI 模式)
在终端中，使用 `--cli` 参数运行：

```bash
# 1. 快速直连下载模式（默认推荐，无需 Node.js）
python download_assets.py --cli -v 1.12.7

# 2. 源码本地编译模式（从 GitHub Release 下载源码并在本地打包）
python download_assets.py --cli --build-ignis

# 3. 指定 Ignis 版本 Tag 与加速镜像
python download_assets.py --cli --build-ignis --ignis-tag v0.8.10+obsidian.1.12.7 --mirror https://ghproxy.net/

# 4. 仅编译 Ignis 组件，跳过 Obsidian 核心
python download_assets.py --cli --build-ignis --no-obsidian
```

---

## 🔒 数据安全与隐私合规建议

> [!IMPORTANT]
> **关于数据隐私的重要提示**：
> 1. **明文笔记特性**：Obsidian 的核心设计在于采用纯文本 Markdown 格式管理数据。在云端环境中，笔记与附件会以原始文件形式保存在 Cloudflare R2 对象存储桶中。
> 2. **公网访问防范**：通过 Cloudflare Worker 部署后，应用具备公网可访问性。请务必牢记以下安全防护建议：
>    - **强化密码与密钥**：部署时务必配置高强度访问密码（`ADMIN_PASSWORD`）与随机的 `JWT_SECRET`（建议通过 Cloudflare Secrets 安全注入，切勿提交至公开代码库）。
>    - **保护访问地址与仓库名**：避免在公开平台或社交网络泄露您的 Worker 访问域名、自定义二级域名或 笔记 Vaults 名称。
>    - **妥善隔离高敏感隐私**：请审慎斟酌云端存储内容，**切勿在云端明文笔记中存放银行密码、私钥、助记词、身份证件等极端高敏感个人资产信息**。

---

<br><br>

# 🇺🇸 English Documentation

> **Project Goal**: Transform Obsidian Web (Ignis) into a completely serverless Jamstack architecture running on **Cloudflare Free Tier**, achieving **$0 hosting cost, zero maintenance, global CDN acceleration, high availability, and persistent secure storage**.

---

## 📑 Documentation Index

| Guide | Description |
| :--- | :--- |
| 🌟 **[Manual Web Console Deployment Guide (Step-by-Step)](./MANUAL_WEB_DEPLOY_TUTORIAL.md)** | **100% GUI-based**: Deploy R2, KV, and Worker directly in the Cloudflare dashboard without any CLI |
| ⚡ **[Command Line Deployment Guide (Wrangler CLI)](./COMMAND_DEPLOY_TUTORIAL.md)** | **Ready to deploy**: Instant deployment using pre-packaged `dist/index.js` and `assets/` |

---

## 🎯 Architecture Overview

This project leverages Cloudflare edge compute and distributed storage products to deliver an ultra-fast, zero-maintenance private cloud notebook:

```
+-------------------------------------------------------------------------+
|                              Web Browser                                |
|         (Obsidian Official app.js + ignis-ui.js + shim-loader.js)       |
+------------------------------------+------------------------------------+
                                     |
                +--------------------+--------------------+
                |                                         |
      [Static Asset Requests]                       [File API Requests]
    (/assets/..., /favicon.ico)                  (/api/fs/*, /api/vault/*)
                |                                         |
                v                                         v
+-------------------------------+       +---------------------------------+
|   Cloudflare Pages / Assets   |       |       Cloudflare Workers        |
|    - Host HTML / CSS / JS     |       |    - Handle /api/fs/stat        |
|    - Unlimited bandwidth/CDN  |       |    - Handle /api/fs/read/write  |
|    - Edge caching globally    |       |    - JWT / KV Auth validation   |
+-------------------------------+       +----------------+----------------+
                                                         |
                                 +-----------------------+-----------------------+
                                 |                                               |
                                 v                                               v
                  +-----------------------------+                 +-----------------------------+
                  |     Cloudflare R2 Bucket    |                 |  Cloudflare D1 / KV / Secret|
                  |   - Obsidian Vault Notes    |                 |   - Password hash & session |
                  |   - 10GB Free Storage       |                 |   - Vault configs & metadata|
                  |   - $0 Egress Traffic Fees  |                 |   - Sub-millisecond reads   |
                  +-----------------------------+                 +-----------------------------+
```

---

## 💰 Cloudflare Free Tier Capacity Evaluation

| Component | Role | Cloudflare Free Tier | Personal Usage Evaluation | Sufficiency |
| :--- | :--- | :--- | :--- | :---: |
| **Cloudflare Pages / Assets** | Host core static web client | **Unlimited requests & traffic** | ~15MB bundle size, fast CDN edge caching | 🟢 **100% Free** |
| **Cloudflare Workers** | Serverless backend API | **100,000 requests / day**<br>(10ms CPU/request) | ~1,000 to 5,000 requests/day for active users | 🟢 **Abundant (~5% used)** |
| **Cloudflare R2** | Object storage for notes & images | **10 GB Storage**<br>**1M Class A ops/mo**<br>**10M Class B ops/mo**<br>**$0 Egress fee** | Typical Markdown notes + images < 2GB | 🟢 **Abundant** |
| **Cloudflare KV / D1** | Auth tokens & vault metadata | **KV: 100K reads/day, 1K writes/day**<br>**D1: 5M reads/day, 100K writes/day** | Only queried on login & vault switching | 🟢 **Abundant** |
| **Cloudflare Zero Trust** | Optional Enterprise SSO / Tunnel | **Free for up to 50 users** | Only 1 user account needed | 🟢 **100% Free** |

---

## 📦 Frontend Asset Downloader & Builder Tool (`download_assets.py`)

This project includes a Python automation script [`download_assets.py`](./download_assets.py) with both **GUI** and **CLI** modes.

### 1. Directory Structure

```text
obscf/                                   # Workspace root
├── download_assets.py                   # 👈 Asset downloader & compiler script
├── public/
│   ├── dist/                            # 🚀 Pre-compiled project artifacts (Ready to deploy)
│   │   ├── _worker.js                   # 👈 Cloudflare Pages / Workers backend execution core
│   │   └── index.js                     # 👈 Standalone Worker script (for Dashboard paste or CLI deploy)
│   └── assets/                          # Target asset directory
│       ├── obsidian/                    # 👈 Obsidian core extracted bundle (Git-ignored)
│       │   ├── app.js
│       │   ├── app.css
│       │   └── lib/ (CodeMirror, Moment, Pixi, etc.)
│       ├── ui/
│       │   └── ignis-ui.js              # 👈 Ignis UI components
│       └── shim/
│           └── shim-loader.js           # 👈 Ignis Electron/Node compatibility shim
└── ...
```

### 2. How to Run

#### 🖥️ Method A: Graphical User Interface (GUI, Recommended)
Run directly from the root directory:
```bash
python download_assets.py
```
* Interactive GUI with automatic version selection, mirror switching, and build progress log.
* Switch between **⚡ Direct Download** and **🛠️ Compile from GitHub Release Source**.

#### ⚡ Method B: Command Line Interface (CLI)
Run with the `--cli` argument:

```bash
# 1. Direct Download Mode (Default, No Node.js required)
python download_assets.py --cli -v 1.12.7

# 2. Source Compilation Mode (Compiles latest Ignis UI and Shim locally)
python download_assets.py --cli --build-ignis

# 3. Specify Ignis Tag and Mirror Proxy
python download_assets.py --cli --build-ignis --ignis-tag v0.8.10+obsidian.1.12.7 --mirror https://ghproxy.net/

# 4. Compile Ignis only, skip Obsidian core
python download_assets.py --cli --build-ignis --no-obsidian
```

---

## 🔒 Data Security & Privacy Guidelines

> [!IMPORTANT]
> **Key Privacy & Security Best Practices**:
> 1. **Plaintext Markdown Storage**: Obsidian notes and attachments are stored as native, plaintext Markdown files within your Cloudflare R2 bucket.
> 2. **Public Web Protection**: Because Cloudflare Workers run over public web endpoints, please follow these essential security guidelines:
>    - **Enforce Strong Credentials**: Always set a complex `ADMIN_PASSWORD` and a random `JWT_SECRET` (configured securely via Cloudflare Secrets, never committed in plaintext).
>    - **Keep URLs & Vault Names Private**: Do not disclose your Worker URL, custom domain, or Vault name on public forums or repositories.
>    - **Segregate Highly Sensitive Data**: Avoid storing unencrypted high-risk personal credentials (e.g., bank passwords, seed phrases, private keys, government IDs) in the cloud vault.
