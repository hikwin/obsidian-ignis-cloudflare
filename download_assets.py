#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Obsidian & Ignis 前端静态资源下载与提取工具 (GUI & CLI 增强版)
Obsidian Frontend Assets Downloader & Extractor for Python GUI

功能：
1. 图形化界面（GUI）与命令行（CLI）双模式运行
2. 从 GitHub 下载指定版本（默认 1.12.7）的 Obsidian 官方 core asar.gz 包并解压提取到 public/assets/obsidian/
3. 下载 Ignis UI 前端脚本 (ignis-ui.js) 到 public/assets/ui/
4. 下载 Ignis 环境适配脚本 (shim-loader.js) 到 public/assets/shim/
5. 自动安全备份与异常回滚机制
6. 支持 GitHub 官方直连及国内高速镜像自动降级切换
7. 纯原生 Python 实现（基于 Tkinter，无需安装第三方依赖）
"""

import os
import sys
import json
import gzip
import time
import struct
import shutil
import ssl
import argparse
import threading
import subprocess
import urllib.request
import urllib.error
from pathlib import Path

# 确保在 Windows 控制台环境下正常输出 UTF-8 编码文本与符号
if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        if hasattr(sys.stderr, "reconfigure"):
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# 默认配置
DEFAULT_VERSION = "1.12.7"
KNOWN_VERSIONS = ["1.12.7", "1.12.4", "1.11.7", "1.10.6"]

# Ignis 源码与直连地址配置
DEFAULT_IGNIS_TAG = "v0.8.10+obsidian.1.12.7"
IGNIS_GITHUB_REPO = "Nystik-gh/ignis"
IGNIS_UI_URL = "https://ignis-demo.thiefling.com/ignis-ui.js"
IGNIS_SHIM_URL = "https://ignis-demo.thiefling.com/shim-loader.js"

# GitHub 加速镜像前缀列表（按优先级依次尝试）
MIRROR_OPTIONS = [
    ("自动优选 (直连优先，失败切换镜像)", ""),
    ("GitHub 官方直连", "DIRECT"),
    ("ghproxy.net 加速", "https://ghproxy.net/"),
    ("mirror.ghproxy.com 加速", "https://mirror.ghproxy.com/"),
    ("github.moeyy.xyz 加速", "https://github.moeyy.xyz/"),
]

DEFAULT_MIRRORS = [
    "",  # 直连
    "https://ghproxy.net/",
    "https://mirror.ghproxy.com/",
    "https://github.moeyy.xyz/",
]

# NPM 镜像源选项
NPM_REGISTRIES = [
    ("淘宝/阿里云 npmmirror 镜像 (国内推荐)", "https://registry.npmmirror.com"),
    ("官方 npmjs 默认源", "https://registry.npmjs.org"),
]
DEFAULT_NPM_REGISTRY = "https://registry.npmmirror.com"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

# 终端彩色输出辅助
class Color:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    GREEN = "\033[32m"
    BLUE = "\033[34m"
    CYAN = "\033[36m"
    YELLOW = "\033[33m"
    RED = "\033[31m"
    GRAY = "\033[90m"

    @classmethod
    def enable_windows_ansi(cls):
        if sys.platform == "win32":
            try:
                import ctypes
                kernel32 = ctypes.windll.kernel32
                handle = kernel32.GetStdHandle(-11)
                mode = ctypes.c_ulong()
                kernel32.GetConsoleMode(handle, ctypes.byref(mode))
                kernel32.SetConsoleMode(handle, mode.value | 0x0004)
            except Exception:
                pass


Color.enable_windows_ansi()


def format_size(num_bytes):
    """格式化字节大小为可读字符串"""
    if num_bytes is None:
        return "未知大小"
    for unit in ["B", "KB", "MB", "GB"]:
        if abs(num_bytes) < 1024.0:
            return f"{num_bytes:.2f} {unit}"
        num_bytes /= 1024.0
    return f"{num_bytes:.2f} TB"


def create_ssl_context():
    """创建容错 SSL 上下文"""
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx
    except Exception:
        return ssl._create_unverified_context()


class AssetBackupManager:
    """静态资源备份与自动回滚管理器"""

    def __init__(self, base_dir: Path, logger=None):
        self.base_dir = Path(base_dir)
        self.backup_dir = self.base_dir.parent / f".backup_assets_{int(time.time())}"
        self.backed_up_items = []
        self.has_backup = False
        self.logger = logger or (lambda msg, type="info": print(f"[{type.upper()}] {msg}"))

    def create_backup(self):
        """备份现有的 obsidian 目录、ui 脚本和 shim 脚本"""
        items_to_backup = [
            ("obsidian", self.base_dir / "obsidian", True),
            ("ui/ignis-ui.js", self.base_dir / "ui" / "ignis-ui.js", False),
            ("shim/shim-loader.js", self.base_dir / "shim" / "shim-loader.js", False),
        ]

        existing_items = [item for item in items_to_backup if item[1].exists()]
        if not existing_items:
            self.logger("未检测到原有旧资源，跳过备份步骤", "info")
            return

        self.logger(f"正在创建当前旧静态资源安全备份 -> {self.backup_dir.name} ...", "info")
        self.backup_dir.mkdir(parents=True, exist_ok=True)

        for rel_name, path, is_dir in existing_items:
            dest_backup_path = self.backup_dir / rel_name
            dest_backup_path.parent.mkdir(parents=True, exist_ok=True)
            if is_dir:
                shutil.copytree(path, dest_backup_path, dirs_exist_ok=True)
            else:
                shutil.copy2(path, dest_backup_path)
            self.backed_up_items.append((rel_name, path, is_dir))

        self.has_backup = True
        self.logger("旧资源安全备份完成！若更新失败将自动触发回滚恢复。", "success")

    def rollback(self):
        """回滚恢复备份数据"""
        if not self.has_backup or not self.backup_dir.exists():
            self.logger("无可用备份或备份已被清理，无法回滚", "warn")
            return

        self.logger("🚨 正在触发自动回滚，恢复旧版本资源...", "warn")
        for rel_name, original_path, is_dir in self.backed_up_items:
            backup_source = self.backup_dir / rel_name
            if not backup_source.exists():
                continue

            try:
                if is_dir:
                    if original_path.exists():
                        shutil.rmtree(original_path, ignore_errors=True)
                    shutil.copytree(backup_source, original_path, dirs_exist_ok=True)
                else:
                    original_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(backup_source, original_path)
                self.logger(f"已恢复: {rel_name}", "info")
            except Exception as e:
                self.logger(f"恢复 {rel_name} 失败: {e}", "error")

        self.logger("✅ 旧版本静态资源已成功回滚恢复！现有服务不受本次失败影响。", "success")

    def clean_backup(self):
        """清理临时备份目录"""
        if self.backup_dir.exists():
            try:
                shutil.rmtree(self.backup_dir, ignore_errors=True)
            except OSError:
                pass


def download_file_with_progress(url, dest_path, description="下载中", progress_callback=None, cancel_event=None):
    """
    带进度回调的文件流式下载器
    """
    dest_path = Path(dest_path)
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = dest_path.with_name(f"{dest_path.name}.tmp")

    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "*/*",
    }

    req = urllib.request.Request(url, headers=headers)
    ctx = create_ssl_context()

    start_time = time.time()
    last_update_time = 0.0

    try:
        with urllib.request.urlopen(req, timeout=30, context=ctx) as response:
            if response.status not in (200, 206):
                raise urllib.error.HTTPError(url, response.status, response.reason, response.headers, None)

            total_size = response.headers.get("Content-Length")
            total_bytes = int(total_size) if total_size and total_size.isdigit() else None

            downloaded_bytes = 0
            chunk_size = 64 * 1024  # 64KB

            with open(temp_path, "wb") as f:
                while True:
                    if cancel_event and cancel_event.is_set():
                        raise KeyboardInterrupt("用户取消了下载操作")

                    chunk = response.read(chunk_size)
                    if not chunk:
                        break
                    f.write(chunk)
                    downloaded_bytes += len(chunk)

                    now = time.time()
                    if now - last_update_time >= 0.1 or (total_bytes and downloaded_bytes >= total_bytes):
                        last_update_time = now
                        elapsed = max(0.001, now - start_time)
                        speed = downloaded_bytes / elapsed
                        speed_str = f"{format_size(speed)}/s"

                        percent = min(100.0, (downloaded_bytes / total_bytes) * 100) if total_bytes else 0.0
                        if progress_callback:
                            progress_callback(percent, downloaded_bytes, total_bytes, speed_str, description)

            if progress_callback:
                progress_callback(100.0, downloaded_bytes, total_bytes, "完成", description)

        if temp_path.exists():
            if dest_path.exists():
                dest_path.unlink()
            temp_path.rename(dest_path)
            return True
    except Exception:
        if temp_path.exists():
            try:
                temp_path.unlink()
            except OSError:
                pass
        raise


def download_with_mirrors(base_url, dest_path, description="下载文件", custom_mirror=None, logger=None, progress_callback=None, cancel_event=None):
    """尝试直连及多个镜像下载"""
    log = logger or (lambda msg, type="info": print(f"[{type.upper()}] {msg}"))
    urls_to_try = []

    if custom_mirror and custom_mirror != "DIRECT":
        clean_mirror = custom_mirror.rstrip("/") + "/"
        urls_to_try.append(f"{clean_mirror}{base_url}")
    elif custom_mirror == "DIRECT":
        urls_to_try.append(base_url)
    else:
        for prefix in DEFAULT_MIRRORS:
            url = f"{prefix}{base_url}" if prefix else base_url
            if url not in urls_to_try:
                urls_to_try.append(url)

    last_error = None
    for idx, url in enumerate(urls_to_try):
        if cancel_event and cancel_event.is_set():
            raise KeyboardInterrupt("用户取消了操作")

        mirror_name = "官方直连" if url == base_url else f"加速镜像 #{idx}"
        log(f"正在从 [{mirror_name}] 获取: {url}", "info")
        try:
            download_file_with_progress(url, dest_path, description, progress_callback, cancel_event)
            return True
        except KeyboardInterrupt:
            raise
        except Exception as e:
            last_error = e
            log(f"当前源请求失败 ({e})，尝试切换备用源...", "warn")

    raise RuntimeError(f"所有可用源均已尝试且均失败: {last_error}")


def extract_asar(asar_bytes, out_dir, logger=None, progress_callback=None, cancel_event=None):
    """
    纯 Python 编写的 Electron ASAR 归档文件解析与提取器
    """
    log = logger or (lambda msg, type="info": print(f"[{type.upper()}] {msg}"))
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    if len(asar_bytes) < 16:
        raise ValueError("ASAR 文件损坏：头部数据不足 16 字节")

    # 4 字节魔数 (4), 4 字节 total_size, 4 字节 header_size, 4 字节 json_len
    magic, total_size, header_size, json_len = struct.unpack("<IIII", asar_bytes[:16])

    if magic != 4:
        raise ValueError(f"无效的 ASAR 文件魔数 (预期 4, 实际 {magic})")

    json_raw = asar_bytes[16 : 16 + json_len]
    header = json.loads(json_raw.decode("utf-8"))
    payload_offset = 16 + json_len

    file_entries = []

    def scan_tree(node, current_rel_path):
        if "files" in node:
            for child_name, child_node in node["files"].items():
                scan_tree(child_node, os.path.join(current_rel_path, child_name) if current_rel_path else child_name)
        elif "size" in node and "offset" in node:
            offset = payload_offset + int(node["offset"])
            size = int(node["size"])
            file_entries.append((current_rel_path, offset, size))

    scan_tree(header, "")

    total_files = len(file_entries)
    log(f"ASAR 归档解析完成，共发现 {total_files} 个核心文件，开始解包提取...", "info")

    for i, (rel_path, offset, size) in enumerate(file_entries, 1):
        if cancel_event and cancel_event.is_set():
            raise KeyboardInterrupt("用户取消了提取操作")

        target_file = out_dir / rel_path
        target_file.parent.mkdir(parents=True, exist_ok=True)

        file_data = asar_bytes[offset : offset + size]
        target_file.write_bytes(file_data)

        if progress_callback and (i % 5 == 0 or i == total_files):
            pct = (i / total_files) * 100.0
            progress_callback(pct, i, total_files, "", f"解包提取: {rel_path}")

    log(f"ASAR 文件已全部成功解压提取至: {out_dir}", "success")


def check_node_environment(logger=None):
    """检测当前操作系统中是否已安装 Node.js 与 npm"""
    log = logger or (lambda msg, type="info": print(f"[{type.upper()}] {msg}"))

    try:
        res_node = subprocess.run("node -v", shell=True, capture_output=True, text=True, errors="replace", check=False)
        res_npm = subprocess.run("npm -v", shell=True, capture_output=True, text=True, errors="replace", check=False)
        if res_node.returncode != 0 or res_npm.returncode != 0:
            return False, "系统环境中未正确检测到 Node.js 或 npm 命令，请确认已安装并在 PATH 中配置"
        node_ver = res_node.stdout.strip()
        npm_ver = res_npm.stdout.strip()
        return True, f"Node.js ({node_ver}) & npm ({npm_ver}) 就绪"
    except Exception as e:
        return False, f"检测 Node.js 运行环境时发生异常: {e}"


def fetch_ignis_releases(limit=5, logger=None):
    """从 GitHub API 获取 Ignis 仓库最新的 Releases 标签列表"""
    log = logger or (lambda msg, type="info": print(f"[{type.upper()}] {msg}"))
    url = f"https://api.github.com/repos/{IGNIS_GITHUB_REPO}/releases"
    headers = {"User-Agent": USER_AGENT, "Accept": "application/vnd.github.v3+json"}
    ctx = create_ssl_context()

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode("utf-8"))
                tags = [r.get("tag_name") for r in data if r.get("tag_name")]
                if tags:
                    return tags[:limit]
    except Exception as e:
        log(f"获取 GitHub Releases 列表失败 ({e})，将使用内置推荐版本列表", "warn")

    # 兜底已知稳定版本列表
    return [
        "v0.8.10+obsidian.1.12.7",
        "v0.8.9+obsidian.1.12.7",
        "v0.8.8+obsidian.1.12.7",
        "v0.8.7+obsidian.1.12.7",
        "v0.8.6+obsidian.1.12.7",
    ]


def run_command_stream(cmd, cwd, logger=None, cancel_event=None):
    """以流式方式执行子进程命令，实时输出日志并支持安全取消"""
    log = logger or (lambda msg, type="info": print(f"[{type.upper()}] {msg}"))
    proc = subprocess.Popen(
        cmd,
        cwd=cwd,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )

    try:
        while True:
            if cancel_event and cancel_event.is_set():
                proc.terminate()
                try:
                    proc.wait(timeout=3)
                except subprocess.TimeoutExpired:
                    proc.kill()
                raise KeyboardInterrupt("用户取消了编译任务")

            raw_line = proc.stdout.readline()
            if not raw_line and proc.poll() is not None:
                break
            if raw_line:
                line = raw_line.decode("utf-8", errors="replace").strip()
                if line:
                    log(f"  {line}", "info")

        proc.wait()
        if proc.returncode != 0:
            raise RuntimeError(f"命令执行失败 (退出码: {proc.returncode}): {cmd}")
    finally:
        if proc.poll() is None:
            proc.kill()


def download_and_compile_ignis(
    tag_name: str,
    target_base_dir: Path,
    mirror: str = None,
    npm_registry: str = DEFAULT_NPM_REGISTRY,
    logger=None,
    progress_callback=None,
    cancel_event=None,
):
    """
    从 GitHub 下载指定 Tag 的 Ignis 源码，并通过 Node.js / npm 自动编译生成 ignis-ui.js 与 shim-loader.js
    """
    import zipfile
    import tempfile

    log = logger or (lambda msg, type="info": print(f"[{type.upper()}] {msg}"))
    target_base_dir = Path(target_base_dir)

    # 1. 检查 Node.js 环境
    ok, env_msg = check_node_environment(logger=log)
    if not ok:
        raise RuntimeError(f"编译环境检测失败: {env_msg}")
    log(f"编译环境正常: {env_msg}", "success")

    # 2. 准备源码下载 URL
    clean_tag = tag_name.strip()
    source_url = f"https://github.com/{IGNIS_GITHUB_REPO}/archive/refs/tags/{clean_tag}.zip"
    temp_dir = Path(tempfile.mkdtemp(prefix="ignis_src_build_"))
    temp_zip = temp_dir / f"ignis-{clean_tag.replace('+', '_')}.zip"

    try:
        log(f"正在获取 Ignis 源码压缩包 ({clean_tag})...", "info")
        if progress_callback:
            progress_callback(10.0, 1, 10, "", f"下载 Ignis 源码 ({clean_tag})")

        download_with_mirrors(
            source_url,
            temp_zip,
            description=f"下载 Ignis 源码 ({clean_tag})",
            custom_mirror=mirror,
            logger=log,
            progress_callback=progress_callback,
            cancel_event=cancel_event,
        )

        log(f"正在解压源码归档包 ({format_size(temp_zip.stat().st_size)})...", "info")
        if progress_callback:
            progress_callback(30.0, 3, 10, "", "解压 Ignis 源码包")

        with zipfile.ZipFile(temp_zip, "r") as zf:
            zf.extractall(temp_dir)

        # 寻找包含 package.json 和 build.js 的根目录
        project_root = None
        for root_item in temp_dir.iterdir():
            if root_item.is_dir() and (root_item / "package.json").exists() and (root_item / "build.js").exists():
                project_root = root_item
                break

        if not project_root:
            raise RuntimeError(f"在解压后的源码目录中未找到有效的 Ignis 构建文件 (package.json / build.js)")

        log(f"Ignis 源码目录已就绪: {project_root.name}", "info")

        # 3. 执行 npm install
        log(f"正在安装 Ignis 构建依赖 (npm install，源: {npm_registry})...", "info")
        if progress_callback:
            progress_callback(50.0, 5, 10, "", "正在安装 Ignis 构建依赖 (npm install)")

        npm_cmd = f"npm install --no-audit --no-fund --registry={npm_registry}"
        run_command_stream(npm_cmd, cwd=str(project_root), logger=log, cancel_event=cancel_event)
        log("Ignis 构建依赖安装完成！", "success")

        # 4. 执行 node build.js 打包构建
        log("正在执行构建打包命令 (node build.js)...", "info")
        if progress_callback:
            progress_callback(75.0, 75, 100, "", "正在编译打包 Ignis (node build.js)")

        run_command_stream("node build.js", cwd=str(project_root), logger=log, cancel_event=cancel_event)
        log("Ignis 核心组件编译成功！", "success")

        # 5. 提取编译产物
        built_shim = project_root / "packages" / "shim" / "dist" / "shim-loader.js"
        built_ui = project_root / "packages" / "ui" / "dist" / "ignis-ui.js"

        if not built_shim.exists():
            raise RuntimeError(f"编译产物缺失: 未找到 {built_shim}")
        if not built_ui.exists():
            raise RuntimeError(f"编译产物缺失: 未找到 {built_ui}")

        # 复制到目标资源目录
        dest_shim = target_base_dir / "shim" / "shim-loader.js"
        dest_ui = target_base_dir / "ui" / "ignis-ui.js"

        dest_shim.parent.mkdir(parents=True, exist_ok=True)
        dest_ui.parent.mkdir(parents=True, exist_ok=True)

        shutil.copy2(built_shim, dest_shim)
        shutil.copy2(built_ui, dest_ui)

        log(f"🎉 编译产物已成功部署到静态资源目录:", "success")
        log(f"  ├─ UI 脚本:   {dest_ui.name} ({format_size(dest_ui.stat().st_size)})", "success")
        log(f"  └─ Shim 脚本: {dest_shim.name} ({format_size(dest_shim.stat().st_size)})", "success")

        if progress_callback:
            progress_callback(100.0, 10, 10, "完成", "Ignis 源码编译与部署完成")

        return True

    finally:
        # 清理临时编译目录
        if temp_dir.exists():
            try:
                shutil.rmtree(temp_dir, ignore_errors=True)
            except OSError:
                pass


def resolve_base_dir(custom_out_dir=None):
    """自动判断静态资源存放的目标根目录"""
    script_dir = Path(__file__).resolve().parent

    if custom_out_dir and str(custom_out_dir).strip():
        p = Path(custom_out_dir)
        return p.resolve() if p.is_absolute() else (script_dir / p).resolve()

    if (script_dir / "public" / "assets").exists() or (script_dir / "public").exists():
        return (script_dir / "public" / "assets").resolve()
    elif (script_dir / "assets").exists():
        return (script_dir / "assets").resolve()
    else:
        return (script_dir / "public" / "assets").resolve()


def launch_gui():
    try:
        import tkinter as tk
        from tkinter import ttk, filedialog, messagebox, scrolledtext
    except ImportError:
        print("错误: 当前 Python 环境缺少 Tkinter 组件，将回退到命令行模式。")
        run_cli(parse_args())
        return

    root = tk.Tk()
    root.title("Obsidian & Ignis 前端静态资源部署工具")
    root.geometry("820x720")
    root.minsize(740, 620)

    # 尝试设置现代化主题
    style = ttk.Style()
    available_themes = style.theme_names()
    if "vista" in available_themes:
        style.theme_use("vista")
    elif "clam" in available_themes:
        style.theme_use("clam")

    # 全局任务控制
    cancel_event = threading.Event()
    is_running = False

    # 顶栏 Header
    header_frame = tk.Frame(root, bg="#6366f1", height=70)
    header_frame.pack(fill="x", side="top")
    header_frame.pack_propagate(False)

    title_label = tk.Label(
        header_frame,
        text="Obsidian & Ignis 静态资源部署工具",
        font=("Segoe UI", 14, "bold"),
        fg="#ffffff",
        bg="#6366f1"
    )
    title_label.pack(anchor="w", padx=20, pady=(12, 2))

    sub_label = tk.Label(
        header_frame,
        text="一键下载 Obsidian 官方核心资源，支持直连获取或从 GitHub 源码自动编译 Ignis UI 与 Shim 适配层",
        font=("Segoe UI", 9),
        fg="#e0e7ff",
        bg="#6366f1"
    )
    sub_label.pack(anchor="w", padx=20)

    # 主表单容器
    main_frame = ttk.Frame(root, padding="16")
    main_frame.pack(fill="both", expand=True)

    # 配置区域 Frame
    config_group = ttk.LabelFrame(main_frame, text=" 基础与输出配置 ", padding="10")
    config_group.pack(fill="x", pady=(0, 8))

    # 1. 版本号
    row1 = ttk.Frame(config_group)
    row1.pack(fill="x", pady=3)
    ttk.Label(row1, text="Obsidian 版本:", width=14, anchor="w").pack(side="left")
    version_var = tk.StringVar(value=DEFAULT_VERSION)
    version_combo = ttk.Combobox(row1, textvariable=version_var, values=KNOWN_VERSIONS, width=18)
    version_combo.pack(side="left", padx=(0, 10))
    ttk.Label(row1, text="(默认推荐: 1.12.7，支持手动输入任意版本号)", foreground="#666666").pack(side="left")

    # 2. 目标输出目录
    row2 = ttk.Frame(config_group)
    row2.pack(fill="x", pady=3)
    ttk.Label(row2, text="静态资源目录:", width=14, anchor="w").pack(side="left")
    out_dir_var = tk.StringVar(value=str(resolve_base_dir()))
    out_entry = ttk.Entry(row2, textvariable=out_dir_var)
    out_entry.pack(side="left", fill="x", expand=True, padx=(0, 6))

    def choose_dir():
        chosen = filedialog.askdirectory(initialdir=out_dir_var.get(), title="选择静态资源存放目录")
        if chosen:
            out_dir_var.set(os.path.abspath(chosen))

    ttk.Button(row2, text="浏览...", width=8, command=choose_dir).pack(side="left")

    # 3. 加速镜像选择
    row3 = ttk.Frame(config_group)
    row3.pack(fill="x", pady=3)
    ttk.Label(row3, text="GitHub 镜像:", width=14, anchor="w").pack(side="left")
    mirror_var = tk.StringVar(value=MIRROR_OPTIONS[0][1])
    mirror_names = [opt[0] for opt in MIRROR_OPTIONS]
    mirror_name_var = tk.StringVar(value=mirror_names[0])

    def on_mirror_select(event):
        idx = mirror_combo.current()
        if 0 <= idx < len(MIRROR_OPTIONS):
            mirror_var.set(MIRROR_OPTIONS[idx][1])

    mirror_combo = ttk.Combobox(row3, textvariable=mirror_name_var, values=mirror_names, state="readonly", width=42)
    mirror_combo.bind("<<ComboboxSelected>>", on_mirror_select)
    mirror_combo.pack(side="left")

    # Ignis 模式配置 Frame
    ignis_group = ttk.LabelFrame(main_frame, text=" Ignis UI 与 Shim-Loader 获取模式 ", padding="10")
    ignis_group.pack(fill="x", pady=(0, 8))

    ignis_mode_var = tk.StringVar(value="download")  # "download" or "build"

    mode_row = ttk.Frame(ignis_group)
    mode_row.pack(fill="x", pady=2)
    ttk.Label(mode_row, text="模式选择:", width=14, anchor="w").pack(side="left")

    build_opts_frame = ttk.Frame(ignis_group)

    def on_mode_change():
        if ignis_mode_var.get() == "build":
            build_opts_frame.pack(fill="x", pady=(4, 0))
        else:
            build_opts_frame.pack_forget()

    ttk.Radiobutton(mode_row, text="⚡ 直连下载模式 (预编译快速下载，无需 Node.js)", variable=ignis_mode_var, value="download", command=on_mode_change).pack(side="left", padx=(0, 15))
    ttk.Radiobutton(mode_row, text="🛠️ 源码编译模式 (从 GitHub Release 下载源码并自动打包)", variable=ignis_mode_var, value="build", command=on_mode_change).pack(side="left")

    # 源码编译专属选项区域
    b_row1 = ttk.Frame(build_opts_frame)
    b_row1.pack(fill="x", pady=2)
    ttk.Label(b_row1, text="Ignis 源码 Tag:", width=14, anchor="w").pack(side="left")
    ignis_tag_var = tk.StringVar(value=DEFAULT_IGNIS_TAG)
    ignis_tag_combo = ttk.Combobox(b_row1, textvariable=ignis_tag_var, values=[
        "v0.8.10+obsidian.1.12.7",
        "v0.8.9+obsidian.1.12.7",
        "v0.8.8+obsidian.1.12.7",
        "v0.8.7+obsidian.1.12.7",
        "v0.8.6+obsidian.1.12.7",
    ], width=26)
    ignis_tag_combo.pack(side="left", padx=(0, 8))

    def refresh_tags():
        def _fetch():
            tags = fetch_ignis_releases(limit=6)
            root.after(0, lambda: ignis_tag_combo.config(values=tags))
            if tags:
                root.after(0, lambda: ignis_tag_var.set(tags[0]))
        threading.Thread(target=_fetch, daemon=True).start()

    ttk.Button(b_row1, text="🔄 刷新 GitHub 最新 Tags", command=refresh_tags).pack(side="left")

    b_row2 = ttk.Frame(build_opts_frame)
    b_row2.pack(fill="x", pady=2)
    ttk.Label(b_row2, text="NPM 镜像源:", width=14, anchor="w").pack(side="left")
    npm_reg_var = tk.StringVar(value=DEFAULT_NPM_REGISTRY)
    npm_reg_combo = ttk.Combobox(b_row2, textvariable=npm_reg_var, values=[opt[1] for opt in NPM_REGISTRIES], width=35)
    npm_reg_combo.pack(side="left", padx=(0, 8))
    ttk.Label(b_row2, text="(加速依赖安装)", foreground="#666666").pack(side="left")

    # 4. 选项复选框
    opt_group = ttk.Frame(main_frame)
    opt_group.pack(fill="x", pady=(0, 8))

    opt_obsidian_var = tk.BooleanVar(value=True)
    opt_ui_var = tk.BooleanVar(value=True)
    opt_shim_var = tk.BooleanVar(value=True)
    opt_backup_var = tk.BooleanVar(value=True)
    opt_clean_var = tk.BooleanVar(value=False)

    ttk.Checkbutton(opt_group, text="处理 Obsidian 核心", variable=opt_obsidian_var).pack(side="left", padx=(0, 15))
    ttk.Checkbutton(opt_group, text="处理 UI 脚本 (ignis-ui.js)", variable=opt_ui_var).pack(side="left", padx=(0, 15))
    ttk.Checkbutton(opt_group, text="处理 Shim 脚本 (shim-loader.js)", variable=opt_shim_var).pack(side="left", padx=(0, 15))
    ttk.Checkbutton(opt_group, text="自动备份与失败回滚", variable=opt_backup_var).pack(side="left", padx=(0, 15))
    ttk.Checkbutton(opt_group, text="提取前清空旧目录", variable=opt_clean_var).pack(side="left")

    # 进度区域
    progress_group = ttk.LabelFrame(main_frame, text=" 任务执行进度 ", padding="8")
    progress_group.pack(fill="x", pady=(0, 8))

    status_var = tk.StringVar(value="准备就绪，点击下方按钮开始部署。")
    status_label = ttk.Label(progress_group, textvariable=status_var, font=("Segoe UI", 9))
    status_label.pack(anchor="w", pady=(0, 4))

    prog_bar = ttk.Progressbar(progress_group, mode="determinate", maximum=100)
    prog_bar.pack(fill="x")

    # 日志输出区域
    log_group = ttk.LabelFrame(main_frame, text=" 实时执行日志 ", padding="8")
    log_group.pack(fill="both", expand=True, pady=(0, 8))

    log_box = scrolledtext.ScrolledText(
        log_group,
        wrap="word",
        height=9,
        font=("Consolas", 9),
        bg="#1e1e1e",
        fg="#d4d4d4",
        insertbackground="#ffffff"
    )
    log_box.pack(fill="both", expand=True)

    # 日志色彩标签配置
    log_box.tag_config("info", foreground="#38bdf8")
    log_box.tag_config("success", foreground="#4ade80")
    log_box.tag_config("warn", foreground="#facc15")
    log_box.tag_config("error", foreground="#f87171")
    log_box.tag_config("time", foreground="#94a3b8")

    def append_log(msg, log_type="info"):
        def _update():
            time_str = time.strftime("[%H:%M:%S] ")
            log_box.insert("end", time_str, "time")
            tag_name = log_type if log_type in ("info", "success", "warn", "error") else "info"
            log_box.insert("end", f"{msg}\n", tag_name)
            log_box.see("end")
        root.after(0, _update)

    def update_progress(percent, current, total, speed_str, desc):
        def _update():
            prog_bar["value"] = percent
            if speed_str:
                status_var.set(f"{desc} - {percent:.1f}% ({format_size(current)}/{format_size(total)}) [{speed_str}]")
            elif total and isinstance(current, int) and isinstance(total, int) and total > 0:
                status_var.set(f"{desc} - [{current}/{total}] ({percent:.1f}%)")
            else:
                status_var.set(f"{desc} - {percent:.1f}%")
        root.after(0, _update)

    # 底部按钮栏
    btn_frame = ttk.Frame(main_frame)
    btn_frame.pack(fill="x")

    start_btn = ttk.Button(btn_frame, text=" 🚀 开始下载与部署 ", style="Accent.TButton" if "Accent.TButton" in style.theme_names() else "TButton")
    start_btn.pack(side="left", padx=(0, 8), ipady=3)

    cancel_btn = ttk.Button(btn_frame, text=" ⏹ 取消 ", state="disabled")
    cancel_btn.pack(side="left", padx=(0, 8), ipady=3)

    def open_out_folder():
        p = Path(out_dir_var.get()).resolve()
        if not p.exists():
            p.mkdir(parents=True, exist_ok=True)
        if sys.platform == "win32":
            os.startfile(str(p))
        elif sys.platform == "darwin":
            subprocess.Popen(["open", str(p)])
        else:
            subprocess.Popen(["xdg-open", str(p)])

    open_btn = ttk.Button(btn_frame, text=" 📂 打开资源目录 ", command=open_out_folder)
    open_btn.pack(side="left", ipady=3)

    def clear_log():
        log_box.delete("1.0", "end")
        prog_bar["value"] = 0
        status_var.set("准备就绪。")

    clear_btn = ttk.Button(btn_frame, text=" 🧹 清空日志 ", command=clear_log)
    clear_btn.pack(side="right", ipady=3)

    # 核心后台执行逻辑
    def worker_thread(version, target_base_dir, mirror, ignis_mode, ignis_tag, npm_reg, do_obsidian, do_ui, do_shim, do_backup, do_clean):
        nonlocal is_running
        target_base_dir = Path(target_base_dir)
        obsidian_dir = target_base_dir / "obsidian"
        backup_mgr = AssetBackupManager(target_base_dir, logger=append_log)

        append_log("=" * 55, "info")
        append_log(f"开始任务: Obsidian v{version.lstrip('vV')}", "info")
        append_log(f"Ignis 模式: {'🛠️ 源码编译 (' + ignis_tag + ')' if ignis_mode == 'build' else '⚡ 预编译直连下载'}", "info")
        append_log(f"目标目录: {target_base_dir}", "info")
        append_log("=" * 55, "info")

        # 1. 自动备份
        if do_backup:
            try:
                backup_mgr.create_backup()
            except Exception as e:
                append_log(f"创建备份警告: {e}", "warn")

        update_success = False
        start_time = time.time()

        try:
            # 2. 下载并解压 Obsidian
            if do_obsidian:
                version_clean = version.lstrip("vV")
                version_tag = f"v{version_clean}"
                github_url = f"https://github.com/obsidianmd/obsidian-releases/releases/download/{version_tag}/obsidian-{version_clean}.asar.gz"

                if do_clean and obsidian_dir.exists():
                    append_log(f"清理旧目录: {obsidian_dir}", "info")
                    shutil.rmtree(obsidian_dir, ignore_errors=True)

                obsidian_dir.mkdir(parents=True, exist_ok=True)
                temp_gz_file = target_base_dir / f".temp_obsidian_{version_clean}.asar.gz"

                try:
                    append_log(f"开始下载 Obsidian 核心包 ({version_tag})...", "info")
                    download_with_mirrors(
                        github_url,
                        temp_gz_file,
                        description=f"下载 Obsidian {version_tag}",
                        custom_mirror=mirror,
                        logger=append_log,
                        progress_callback=update_progress,
                        cancel_event=cancel_event
                    )

                    append_log(f"Gzip 解压中 ({format_size(temp_gz_file.stat().st_size)})...", "info")
                    status_var.set("正在解压 Gzip 归档...")
                    with gzip.open(temp_gz_file, "rb") as gz_in:
                        asar_bytes = gz_in.read()

                    append_log(f"解压完成，原始 ASAR 大小: {format_size(len(asar_bytes))}", "info")
                    extract_asar(
                        asar_bytes,
                        obsidian_dir,
                        logger=append_log,
                        progress_callback=update_progress,
                        cancel_event=cancel_event
                    )
                finally:
                    if temp_gz_file.exists():
                        try:
                            temp_gz_file.unlink()
                        except OSError:
                            pass

            # 3. 处理 Ignis UI 与 Shim 脚本
            if do_ui or do_shim:
                if ignis_mode == "build":
                    # 源码编译模式
                    append_log("-" * 50, "info")
                    append_log(f"🚀 进入 Ignis 源码编译模式 (Tag: {ignis_tag})", "info")
                    download_and_compile_ignis(
                        tag_name=ignis_tag,
                        target_base_dir=target_base_dir,
                        mirror=mirror,
                        npm_registry=npm_reg,
                        logger=append_log,
                        progress_callback=update_progress,
                        cancel_event=cancel_event,
                    )
                else:
                    # 直连下载模式
                    if do_ui:
                        ui_dest = target_base_dir / "ui" / "ignis-ui.js"
                        append_log("正在下载 Ignis UI 脚本 (ignis-ui.js)...", "info")
                        download_with_mirrors(
                            IGNIS_UI_URL,
                            ui_dest,
                            description="下载 ignis-ui.js",
                            custom_mirror=mirror,
                            logger=append_log,
                            progress_callback=update_progress,
                            cancel_event=cancel_event
                        )
                        append_log(f"Ignis UI 脚本就绪: {ui_dest.name} ({format_size(ui_dest.stat().st_size)})", "success")

                    if do_shim:
                        shim_dest = target_base_dir / "shim" / "shim-loader.js"
                        append_log("正在下载 Ignis Shim 适配脚本 (shim-loader.js)...", "info")
                        download_with_mirrors(
                            IGNIS_SHIM_URL,
                            shim_dest,
                            description="下载 shim-loader.js",
                            custom_mirror=mirror,
                            logger=append_log,
                            progress_callback=update_progress,
                            cancel_event=cancel_event
                        )
                        append_log(f"Ignis Shim 脚本就绪: {shim_dest.name} ({format_size(shim_dest.stat().st_size)})", "success")

            # 4. 校验关键文件
            key_files = []
            if do_obsidian:
                key_files.extend([obsidian_dir / "app.js", obsidian_dir / "app.css", obsidian_dir / "lib"])
            if do_ui:
                key_files.append(target_base_dir / "ui" / "ignis-ui.js")
            if do_shim:
                key_files.append(target_base_dir / "shim" / "shim-loader.js")

            all_ok = all(kf.exists() for kf in key_files)
            if not all_ok:
                raise RuntimeError("部分核心静态资源校验缺失！")

            update_success = True
            elapsed = time.time() - start_time
            append_log("=" * 55, "success")
            append_log(f"🎉 全部静态资源部署成功！耗时: {elapsed:.2f}s", "success")
            append_log("=" * 55, "success")
            status_var.set("✅ 部署完成！所有核心资源均已成功就绪。")
            prog_bar["value"] = 100

            root.after(0, lambda: messagebox.showinfo("部署完成", f"Obsidian & Ignis 前端静态资源已成功就绪！\n耗时: {elapsed:.1f} 秒"))

        except KeyboardInterrupt:
            append_log("用户手动取消了任务。", "warn")
            status_var.set("任务已由用户取消。")
            if do_backup and backup_mgr.has_backup:
                backup_mgr.rollback()
        except Exception as e:
            append_log(f"执行发生错误: {e}", "error")
            status_var.set(f"❌ 部署失败: {e}")
            if do_backup and backup_mgr.has_backup:
                backup_mgr.rollback()
            root.after(0, lambda: messagebox.showerror("部署出错", f"静态资源下载部署失败:\n{e}\n\n已自动恢复旧版备份（若存在）。"))
        finally:
            if update_success and do_backup:
                backup_mgr.clean_backup()

            def _reset_ui():
                nonlocal is_running
                is_running = False
                start_btn.config(state="normal")
                cancel_btn.config(state="disabled")

            root.after(0, _reset_ui)

    def on_start():
        nonlocal is_running
        if is_running:
            return

        version = version_var.get().strip()
        if not version:
            messagebox.showwarning("提示", "请输入有效的 Obsidian 版本号")
            return

        target_dir = out_dir_var.get().strip()
        if not target_dir:
            messagebox.showwarning("提示", "请选择静态资源存放目录")
            return

        is_running = True
        cancel_event.clear()
        start_btn.config(state="disabled")
        cancel_btn.config(state="normal")
        prog_bar["value"] = 0
        status_var.set("正在启动下载部署任务...")

        th = threading.Thread(
            target=worker_thread,
            args=(
                version,
                target_dir,
                mirror_var.get(),
                ignis_mode_var.get(),
                ignis_tag_var.get().strip() or DEFAULT_IGNIS_TAG,
                npm_reg_var.get().strip() or DEFAULT_NPM_REGISTRY,
                opt_obsidian_var.get(),
                opt_ui_var.get(),
                opt_shim_var.get(),
                opt_backup_var.get(),
                opt_clean_var.get(),
            ),
            daemon=True
        )
        th.start()

    def on_cancel():
        if is_running:
            cancel_event.set()
            append_log("正在请求中断操作，请稍候...", "warn")

    start_btn.config(command=on_start)
    cancel_btn.config(command=on_cancel)

    # 居中显示窗口
    root.update_idletasks()
    w = root.winfo_width()
    h = root.winfo_height()
    ws = root.winfo_screenwidth()
    hs = root.winfo_screenheight()
    x = (ws // 2) - (w // 2)
    y = (hs // 2) - (h // 2)
    root.geometry(f"{w}x{h}+{x}+{y}")

    root.mainloop()


# ============================================================
# CLI 命令行模式支持
# ============================================================

def parse_args():
    parser = argparse.ArgumentParser(
        description="Obsidian & Ignis 前端静态资源快速下载与解包工具（支持 GUI / CLI 运行及源码编译）",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  python download_assets.py                                # 打开图形化窗口 (GUI 模式)
  python download_assets.py --cli                          # 命令行快速直连模式 (默认 Obsidian 1.12.7)
  python download_assets.py --cli --build-ignis            # 命令行启用 Ignis 源码自动编译模式
  python download_assets.py --cli --build-ignis --ignis-tag v0.8.10+obsidian.1.12.7
  python download_assets.py --cli -v 1.12.7 -o ./public/assets --mirror https://ghproxy.net/
        """,
    )
    parser.add_argument(
        "--cli",
        action="store_true",
        help="以命令行模式运行（不打开 GUI 窗口）",
    )
    parser.add_argument(
        "-v",
        "--version",
        dest="version",
        default=DEFAULT_VERSION,
        help=f"指定要下载的 Obsidian 版本号 (例如: 1.12.7, 默认: {DEFAULT_VERSION})",
    )
    parser.add_argument(
        "-o",
        "--out-dir",
        dest="out_dir",
        default="",
        help="静态资源输出根目录 (默认自动探测 public/assets 或 assets)",
    )
    parser.add_argument(
        "--mirror",
        dest="mirror",
        default=None,
        help="自定义 GitHub 加速镜像代理前缀 (例如: https://ghproxy.net/)",
    )
    parser.add_argument(
        "--ignis-mode",
        dest="ignis_mode",
        choices=["download", "build"],
        default="download",
        help="Ignis UI 与 Shim 获取方式: download (预编译直连) 或 build (源码本地编译)",
    )
    parser.add_argument(
        "--build-ignis",
        action="store_true",
        help="快捷启用 Ignis 源码自动编译模式（等同于 --ignis-mode build）",
    )
    parser.add_argument(
        "--ignis-tag",
        dest="ignis_tag",
        default=DEFAULT_IGNIS_TAG,
        help=f"指定 Ignis GitHub Release Tag (默认: {DEFAULT_IGNIS_TAG})",
    )
    parser.add_argument(
        "--npm-registry",
        dest="npm_registry",
        default=DEFAULT_NPM_REGISTRY,
        help=f"编译 Ignis 时使用的 NPM 镜像源 (默认: {DEFAULT_NPM_REGISTRY})",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="提取前清理目标目录中原有的 Obsidian 静态资源",
    )
    parser.add_argument(
        "--no-backup",
        action="store_true",
        help="禁用旧资源自动备份与失败回滚机制",
    )
    parser.add_argument(
        "--keep-backup",
        action="store_true",
        help="更新成功后保留旧版资源备份目录",
    )
    parser.add_argument(
        "--no-ui",
        action="store_true",
        help="跳过下载 Ignis UI 和 Shim 脚本",
    )
    parser.add_argument(
        "--no-obsidian",
        action="store_true",
        help="跳过下载 Obsidian 官方核心资源",
    )
    return parser.parse_args()


def run_cli(args):
    version = args.version or DEFAULT_VERSION
    target_base_dir = resolve_base_dir(args.out_dir)
    obsidian_dir = target_base_dir / "obsidian"
    ignis_mode = "build" if args.build_ignis or args.ignis_mode == "build" else "download"
    ignis_tag = args.ignis_tag or DEFAULT_IGNIS_TAG
    npm_reg = args.npm_registry or DEFAULT_NPM_REGISTRY

    print("\n" + "=" * 60)
    print(f"{Color.BOLD}Obsidian & Ignis 静态资源部署工具 (CLI 模式){Color.RESET}")
    print("=" * 60)
    print(f"目标 Obsidian 版本:  {Color.CYAN}{version}{Color.RESET}")
    print(f"Ignis 获取模式:      {Color.GREEN}{'源码本地编译 (' + ignis_tag + ')' if ignis_mode == 'build' else '预编译直连下载'}{Color.RESET}")
    print(f"静态资源根目录:      {Color.CYAN}{target_base_dir}{Color.RESET}")
    print(f"  ├─ Obsidian:       {obsidian_dir}")
    print(f"  ├─ UI 脚本:        {target_base_dir / 'ui' / 'ignis-ui.js'}")
    print(f"  └─ Shim 脚本:      {target_base_dir / 'shim' / 'shim-loader.js'}")
    print(f"安全机制:            {'[已启用自动备份与失败回滚]' if not args.no_backup else '[未启用备份]'}")
    print("=" * 60 + "\n")

    def cli_log(msg, log_type="info"):
        if log_type == "success":
            print(f"{Color.GREEN}[OK]{Color.RESET} {msg}")
        elif log_type == "warn":
            print(f"{Color.YELLOW}[WARN]{Color.RESET} {msg}")
        elif log_type == "error":
            print(f"{Color.RED}[ERROR]{Color.RESET} {msg}")
        else:
            print(f"{Color.CYAN}[INFO]{Color.RESET} {msg}")

    backup_mgr = AssetBackupManager(target_base_dir, logger=cli_log)

    if not args.no_backup:
        try:
            backup_mgr.create_backup()
            print("")
        except Exception as e:
            cli_log(f"创建备份警告: {e}", "warn")

    start_total = time.time()
    update_success = False

    try:
        if not args.no_obsidian:
            version_clean = version.lstrip("vV")
            version_tag = f"v{version_clean}"
            github_url = f"https://github.com/obsidianmd/obsidian-releases/releases/download/{version_tag}/obsidian-{version_clean}.asar.gz"

            if args.clean and obsidian_dir.exists():
                cli_log(f"清理旧目录: {obsidian_dir}", "info")
                shutil.rmtree(obsidian_dir, ignore_errors=True)

            obsidian_dir.mkdir(parents=True, exist_ok=True)
            temp_gz_file = target_base_dir / f".temp_obsidian_{version_clean}.asar.gz"

            try:
                cli_log(f"开始获取 Obsidian 官方核心资源 ({version_tag})...", "info")
                download_with_mirrors(
                    github_url,
                    temp_gz_file,
                    description=f"下载 Obsidian {version_tag}",
                    custom_mirror=args.mirror,
                    logger=cli_log
                )

                cli_log(f"正在使用 gzip 解压核心归档 ({format_size(temp_gz_file.stat().st_size)})...", "info")
                with gzip.open(temp_gz_file, "rb") as gz_in:
                    asar_bytes = gz_in.read()

                cli_log(f"Gzip 解压完成，原始 ASAR 大小: {format_size(len(asar_bytes))}", "info")
                extract_asar(asar_bytes, obsidian_dir, logger=cli_log)
            finally:
                if temp_gz_file.exists():
                    try:
                        temp_gz_file.unlink()
                    except OSError:
                        pass

        if not args.no_ui or not args.no_obsidian:
            if ignis_mode == "build":
                print("")
                cli_log(f"开始从 GitHub 源码编译 Ignis 组件 ({ignis_tag})...", "info")
                download_and_compile_ignis(
                    tag_name=ignis_tag,
                    target_base_dir=target_base_dir,
                    mirror=args.mirror,
                    npm_registry=npm_reg,
                    logger=cli_log,
                )
            else:
                if not args.no_ui:
                    print("")
                    ui_dest = target_base_dir / "ui" / "ignis-ui.js"
                    cli_log("正在获取 Ignis UI 界面脚本 (ignis-ui.js)...", "info")
                    download_with_mirrors(
                        IGNIS_UI_URL,
                        ui_dest,
                        description="下载 ignis-ui.js",
                        custom_mirror=args.mirror,
                        logger=cli_log
                    )
                    cli_log(f"Ignis UI 脚本已就绪: {ui_dest} ({format_size(ui_dest.stat().st_size)})", "success")

                if not args.no_ui:
                    shim_dest = target_base_dir / "shim" / "shim-loader.js"
                    cli_log("正在获取 Ignis 环境适配脚本 (shim-loader.js)...", "info")
                    download_with_mirrors(
                        IGNIS_SHIM_URL,
                        shim_dest,
                        description="下载 shim-loader.js",
                        custom_mirror=args.mirror,
                        logger=cli_log
                    )
                    cli_log(f"Ignis Shim 脚本已就绪: {shim_dest} ({format_size(shim_dest.stat().st_size)})", "success")

        update_success = True
        elapsed_total = time.time() - start_total
        print("\n" + "=" * 60)
        cli_log(f"全部资源下载并部署完成！总耗时: {elapsed_total:.2f}s", "success")
        print("=" * 60)

    except (Exception, KeyboardInterrupt) as e:
        cli_log(f"\n下载/解压/编译过程中发生错误: {e}", "error")
        if not args.no_backup and backup_mgr.has_backup:
            backup_mgr.rollback()
        raise

    finally:
        if update_success:
            if not args.keep_backup:
                backup_mgr.clean_backup()
            else:
                cli_log(f"已保留旧版本备份目录: {backup_mgr.backup_dir}", "info")


def main():
    # 判断是否明确指定了 CLI 参数，或者默认直接启动 GUI
    cli_flags = ["--cli", "-v", "--version", "-o", "--out-dir", "--mirror", "--ignis-mode", "--build-ignis", "--ignis-tag", "--npm-registry", "--clean", "--no-backup", "--keep-backup", "--no-ui", "--no-obsidian"]
    has_cli_args = any(arg in sys.argv for arg in cli_flags)

    if "--cli" in sys.argv or (has_cli_args and "--gui" not in sys.argv and not ("-h" in sys.argv or "--help" in sys.argv)):
        args = parse_args()
        try:
            run_cli(args)
        except KeyboardInterrupt:
            print(f"\n{Color.YELLOW}操作已由用户手动中断。{Color.RESET}")
            sys.exit(130)
        except Exception:
            sys.exit(1)
    else:
        if "-h" in sys.argv or "--help" in sys.argv:
            parse_args()
        else:
            launch_gui()


if __name__ == "__main__":
    main()

