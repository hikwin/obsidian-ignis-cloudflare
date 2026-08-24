# Cloudflare 网页控制台纯手动部署教程 / Cloudflare Web Dashboard Manual Deployment Guide

<p align="center">
  <a href="#-中文教程">🇨🇳 简体中文</a> | <a href="#-english-guide">🇺🇸 English</a>
</p>

---

# 🇨🇳 中文教程

> **特点**：**全程在浏览器网页中点击鼠标操作**，无需安装 Node.js/Wrangler 命令行，无需终端配置，100% 免费利用 Cloudflare 官方额度（Workers + R2 + KV）搭建个人云端 Obsidian Web。

---

## 📌 部署前准备文件清单

在进行网页操作前，确认本地项目目录已包含以下文件：
1. **Worker 单文件代码**：`dist/index.js`（已编译打包好，约 100KB）
2. **前端静态资源文件夹**：`public/assets/`（包含 `ui/`、`shim/` 以及 `obsidian/`）
   > 💡 **提示**：`public/assets/obsidian/` 目录默认在 Git 中保留了空结构。如果该目录为空，请先双击运行项目根目录下的 **`python download_assets.py`**（或命令行 `python download_assets.py --cli`），它会自动将 Obsidian 官方核心资源下载解压到此目录中。

---

## 🚀 第一阶段：创建免费存储组件 (R2 与 KV)

### 步骤 1：创建 R2 存储桶 (存放笔记数据与前端静态资源)
1. 浏览器打开 [Cloudflare 官方控制台](https://dash.cloudflare.com/) 并登录；
2. 在左侧菜单栏展开 **「存储和数据库 (Storage & Databases)」** -> 点击 **「R2 对象存储 (R2 Object Storage)」**；
3. 点击页面右上角的 **「创建存储桶 (Create bucket)」** 按钮；
4. 填写配置：
   - **存储桶名称 (Bucket name)**：输入 `obsidian-vault`
   - **位置提示 (Location Hint)**：选择 `自动 (Automatic)` 或 `亚太地区 (APAC)`
5. 点击 **「创建存储桶 (Create bucket)」** 完成。

---

### 步骤 2：在 R2 存储桶中上传前端静态资源
1. 在刚刚创建好的 `obsidian-vault` 存储桶管理页面中，点击右上角的 **「上传 (Upload)」** 按钮下拉菜单；
2. 选择 **「上传文件夹 (Upload folder)」**；
3. 在本地文件选择器中，定位并选中整个 `assets` 文件夹；
4. 确认上传。上传完成后，存储桶中应包含 `assets/obsidian/...`、`assets/ui/...`、`assets/shim/...` 等资源。

---

### 步骤 3：创建 KV 命名空间 (存放会话与配置)
1. 在左侧菜单栏 **「存储和数据库」** 下，点击 **「KV」**；
2. 点击右上角 **「创建命名空间 (Create namespace)」**；
3. **命名空间名称 (Namespace Name)** 输入：`IGNIS_KV`；
4. 点击 **「添加 (Add)」** 完成创建。

---

## ⚡ 第二阶段：创建并部署 Cloudflare Worker

### 步骤 4：创建 Worker 应用程序
1. 在左侧主菜单栏点击 **「Workers 和 Pages」** -> 点击 **「概述 (Overview)」**；
2. 点击右上角的 **「创建应用程序 (Create Application)」** 按钮；
3. 确保选中的是 **「Workers」** 标签页；
4. 点击 **「创建 Worker (Create Worker)」**；
5. 给 Worker 命名（例如默认的 `obsidian-web` 或自定义名称）；
6. 点击右下角 **「部署 (Deploy)」**。

---

### 步骤 5：在线粘贴核心代码
1. 部署成功提示页中，点击 **「编辑代码 (Edit code)」** 进入 Cloudflare 网页在线代码编辑器；
2. 打开本地文件 `dist/index.js`；
3. 全选并复制全部代码；
4. 切换到 Cloudflare 网页编辑器，清空原有默认代码并粘贴刚才复制的代码；
5. 点击页面右上角的 **「部署 (Deploy)」** 按钮保存。

---

## 🔗 第三阶段：配置存储绑定与管理员密码

### 步骤 6：进入 Worker 设置页面
点击网页编辑器左上角的 **「← 返回」** 回到 Worker 管理主面板，然后点击上方导航栏的 **「设置 (Settings)」** -> **「绑定 (Bindings)」**。

---

### 步骤 7：绑定 R2 存储桶
1. 在 **绑定** 页面点击「添加绑定」按钮，选择「R2 存储桶绑定」；
2. 填写绑定参数：
   - **变量名称 (Variable name)** 必须填写：`VAULT_BUCKET`
   - **R2 存储桶 (R2 bucket)** 下拉选择：`obsidian-vault`
3. 点击 **「保存并部署 (Save and deploy)」**。

---

### 步骤 8：绑定 KV 命名空间
1. 点击「添加绑定」按钮，选择「KV 命名空间绑定」；
2. 填写绑定参数：
   - **变量名称 (Variable name)** 必须填写：`IGNIS_KV`
   - **KV 命名空间 (KV namespace)** 下拉选择：`IGNIS_KV`
3. 点击 **「保存并部署 (Save and deploy)」**。

---

### 步骤 9：配置管理员密码与环境变量
1. 在设置页面向下滚动找到 **「环境变量 (Environment Variables)」**；
2. 点击 **「添加变量 (Add variable)」**，依次添加以下三组配置：
   
   | 变量名称 (Variable name) | 值 (Value) | 是否加密 (Encrypt) | 说明 |
   | :--- | :--- | :---: | :--- |
   | `DEFAULT_VAULT_ID` | `default` | 否 | 默认仓库 ID |
   | `DEFAULT_VAULT_NAME` | `我的知识库` | 否 | 默认仓库展示名称 |
   | `ADMIN_PASSWORD` | `您的管理员密码` (例如 `Obsidian@2026`) | **点击右侧加密小锁** | 登录后台的访问密码 |

3. 点击 **「保存并部署 (Save and deploy)」**。

---

## 🎉 第四阶段：访问与使用

1. 回到 Worker 的主页，找到系统为您生成的专属域名（如 `https://obsidian-web.your-subdomain.workers.dev`）；
2. 在浏览器中打开该网址，系统将自动展示登录页面：
   - **默认用户名**：`admin`
   - **密码**：在环境变量 `ADMIN_PASSWORD` 中设置的密码
3. 登录成功后即可在网页端畅快记录笔记！

---

<br><br>

# 🇺🇸 English Guide

> **Highlights**: **100% GUI Browser-Based Steps**. No Node.js or Wrangler CLI installation required. Leverage Cloudflare Free Tier (Workers + R2 + KV) to host your private web Obsidian.

---

## 📌 Preparation Checklist

Ensure your local directory has the following files ready:
1. **Worker Bundle Script**: `dist/index.js` (~100KB standalone script)
2. **Frontend Assets Directory**: `public/assets/` (contains `ui/`, `shim/`, and `obsidian/`)
   > 💡 **Note**: The `public/assets/obsidian/` directory structure is preserved in Git. If the folder is empty, simply run **`python download_assets.py`** (or `python download_assets.py --cli`) from the project root to automatically fetch and extract official Obsidian assets into this directory.

---

## 🚀 Phase 1: Create Free Storage Components (R2 & KV)

### Step 1: Create R2 Bucket (Notes & Static Assets)
1. Open and log into the [Cloudflare Dashboard](https://dash.cloudflare.com/);
2. In the left navigation, go to **Storage & Databases** -> **R2 Object Storage**;
3. Click **Create bucket** in the top right;
4. Configuration:
   - **Bucket name**: `obsidian-vault`
   - **Location Hint**: `Automatic` or `APAC`
5. Click **Create bucket**.

---

### Step 2: Upload Assets Folder to R2
1. In the `obsidian-vault` bucket management page, click the **Upload** dropdown -> **Upload folder**;
2. Select the local `assets` folder;
3. Confirm upload. The bucket should contain `assets/obsidian/...`, `assets/ui/...`, `assets/shim/...`.

---

### Step 3: Create KV Namespace (Sessions & Configs)
1. In the left menu under **Storage & Databases**, click **KV**;
2. Click **Create namespace**;
3. **Namespace Name**: `IGNIS_KV`;
4. Click **Add**.

---

## ⚡ Phase 2: Create & Deploy Cloudflare Worker

### Step 4: Create Worker Application
1. In the left navigation, click **Workers & Pages** -> **Overview**;
2. Click **Create Application**;
3. Select the **Workers** tab;
4. Click **Create Worker**;
5. Set a name (e.g. `obsidian-web`) and click **Deploy**.

---

### Step 5: Paste Worker Script
1. On the success screen, click **Edit code**;
2. Open your local file `dist/index.js`, copy all code;
3. In the Cloudflare online code editor, replace the existing code with your copied script;
4. Click **Deploy** in the top right.

---

## 🔗 Phase 3: Bind Storage & Configure Password

### Step 6: Go to Worker Settings
Click **← Back** in the top left to return to the Worker overview, then navigate to **Settings** -> **Bindings**.

---

### Step 7: Bind R2 Bucket
1. Click **Add binding** -> **R2 bucket**;
2. Configure:
   - **Variable name**: `VAULT_BUCKET` (must match exactly)
   - **R2 bucket**: select `obsidian-vault`
3. Click **Save and deploy**.

---

### Step 8: Bind KV Namespace
1. Click **Add binding** -> **KV namespace**;
2. Configure:
   - **Variable name**: `IGNIS_KV` (must match exactly)
   - **KV namespace**: select `IGNIS_KV`
3. Click **Save and deploy**.

---

### Step 9: Configure Environment Variables & Admin Password
1. Scroll down to **Environment Variables**;
2. Click **Add variable** to add the following three entries:
   
   | Variable name | Value | Encrypt | Notes |
   | :--- | :--- | :---: | :--- |
   | `DEFAULT_VAULT_ID` | `default` | No | Default vault ID |
   | `DEFAULT_VAULT_NAME` | `My Notes` | No | Vault display name |
   | `ADMIN_PASSWORD` | `YourPassword` (e.g. `Obsidian@2026`) | **Yes (Lock icon)** | Admin login password |

3. Click **Save and deploy**.

---

## 🎉 Phase 4: Access & Enjoy

1. Go back to the Worker overview and find your URL (e.g. `https://obsidian-web.your-subdomain.workers.dev`);
2. Open the URL in your browser;
3. Log in with `admin` and your configured password;
4. Enjoy your private Obsidian Web notebook in the cloud!
