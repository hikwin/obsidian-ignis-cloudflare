# Cloudflare 网页控制台纯手动部署完整教程 (保姆级)

> **特点**：**全程在浏览器网页中点击鼠标操作**，无需安装 Node.js/Wrangler 命令行，无需终端配置，100% 免费利用 Cloudflare 官方额度（Workers + R2 + KV）搭建个人云端 Obsidian Web。

---

## 📌 部署前准备文件清单

在进行网页操作前，确认本地 `` 目录已包含以下文件：
1. **Worker 单文件代码**：[**`dist/index.js`**](dist/index.js)（已编译打包好，约 100KB）
2. **前端静态资源文件夹**：[**`assets/`**](assets/)（包含 `obsidian/`、`ui/`、`shim/`、`server/`）

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
3. 在本地文件选择器中，定位并选中整个 `assets` 文件夹：
   👉 路径：`存放路径\assets`
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
6. 点击右下角 **「部署 (Deploy)」**（此时会先生成一个默认的 Hello World Worker）。

---

### 步骤 5：在线粘贴核心代码
1. 部署成功提示页中，点击 **「编辑代码 (Edit code)」** 进入 Cloudflare 网页在线代码编辑器；
2. 打开本地文件：[**`/dist/index.js`**](/dist/index.js)；
3. 使用快捷键 **Ctrl + A**（全选）然后 **Ctrl + C**（复制）里面的全部代码；
4. 切换到 Cloudflare 网页编辑器，清空编辑器中原有的默认代码，按 **Ctrl + V** 粘贴刚才复制的代码；
5. 点击页面右上角的 **「部署 (Deploy)」** 按钮保存。

---

## 🔗 第三阶段：配置存储绑定与管理员密码

### 步骤 6：进入 Worker 设置页面
点击网页编辑器左上角的 **「← 返回 (Worker 名称)」**，回到 Worker 的管理主面板，然后点击上方导航栏的 **「绑定」** 标签页。

---

### 步骤 7：绑定 R2 存储桶
1. 在 **绑定** 页面点击「添加绑定+」按钮，然后选择「R2 存储桶绑定」；
2. 点击弹窗页面中的 **「添加绑定」**：
   - **变量名称 (Variable name)** 必须严格填写：`VAULT_BUCKET`
   - **R2 存储桶 (R2 bucket)** 下拉选择：`obsidian-vault`
3. 点击 **「保存并部署 (Save and deploy)」**。

---

### 步骤 8：绑定 KV 命名空间
1. 在 **绑定** 页面点击「添加绑定+」按钮，然后选择「KV 命名空间绑定」；
2. 点击 **「添加绑定 (Add binding)」**：
   - **变量名称 (Variable name)** 必须严格填写：`IGNIS_KV`
   - **KV 命名空间 (KV namespace)** 下拉选择：`IGNIS_KV`
3. 点击 **「保存并部署 (Save and deploy)」**。

---

### 步骤 9：配置管理员密码与环境变量
1. 向下滚动找到 **「环境变量 (Environment Variables)」**；
2. 点击 **「添加变量 (Add variable)」**，依次添加以下三组配置：
   
   | 变量名称 (Variable name) | 值 (Value) | 是否加密 (Encrypt) | 说明 |
   | :--- | :--- | :---: | :--- |
   | `DEFAULT_VAULT_ID` | `default` | 否 | 默认仓库 ID |
   | `DEFAULT_VAULT_NAME` | `我的知识库` | 否 | 默认仓库展示名称 |
   | `ADMIN_PASSWORD` | `您的管理员密码` (例如 `Obsidian@2026`) | **点击右侧加密小锁** | 登录后台的访问密码 |

3. 点击 **「保存并部署 (Save and deploy)」**。

---

## 🎉 第四阶段：访问与使用

1. 点击回到 Worker 的主页；
2. 找到系统为您生成的专属域名（格式为 `https://obsidian-web.您的子域.workers.dev`）；
3. 在浏览器中打开该网址，系统将自动展示登录页面：
   - **默认用户名**：`admin`
   - **密码**：刚才在环境变量 `ADMIN_PASSWORD` 中设置的密码
4. 登录成功后即可秒级进入 Obsidian 网页版，开始畅快记录笔记！所有笔记将实时持久化存储在您的 Cloudflare R2 中。

---

## 💡 进阶：绑定自己的独立域名 (可选)

如果您在 Cloudflare 上托管了自己的域名（例如 `yourdomain.com`）：
1. 在 Worker 的 **设置 (Settings)** -> **域和路由 (Domains & Routes)**；
2. 点击 **「添加 (Add)」** -> **「自定义域 (Custom Domain)」**；
3. 输入二级域名（例如 `notes.yourdomain.com`），点击添加；
4. Cloudflare 会自动配置 DNS 并签发全球免费 SSL 证书。
