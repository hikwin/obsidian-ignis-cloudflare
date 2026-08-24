export function renderLoginPage(errorMsg: string | null = null): string {
  const alertHtml = errorMsg
    ? `<div class="alert alert-error" style="display:block;">${escapeHtml(errorMsg)}</div>`
    : `<div class="alert alert-error" style="display:none;" id="alertBox"></div>`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录 - Obsidian Web (Cloudflare)</title>
    <link rel="icon" href="/assets/favicon.png">
    <style>
        :root{--bg:#f4f4f5;--card:#fff;--text:#18181b;--sub:#71717a;--border:#e4e4e7;--input-bg:#f4f4f5;--primary:#7c3aed;--primary-h:#6d28d9}
        @media(prefers-color-scheme:dark){:root{--bg:#18181b;--card:#27272a;--text:#f4f4f5;--sub:#a1a1aa;--border:#3f3f46;--input-bg:#18181b;--primary:#9333ea;--primary-h:#7e22ce}}
        html.dark{--bg:#18181b;--card:#27272a;--text:#f4f4f5;--sub:#a1a1aa;--border:#3f3f46;--input-bg:#18181b;--primary:#9333ea;--primary-h:#7e22ce}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--text);display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
        .card{background:var(--card);border:1px solid var(--border);border-radius:1rem;padding:2.5rem;width:100%;max-width:400px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05),0 8px 10px -6px rgba(0,0,0,0.05)}
        .logo{display:flex;align-items:center;justify-content:center;gap:0.75rem;margin-bottom:2rem}
        .logo img{width:48px;height:48px;border-radius:10px}
        .logo h1{font-size:1.5rem;font-weight:700;letter-spacing:-0.025em}
        .form-group{margin-bottom:1.25rem}
        label{display:block;font-size:0.875rem;font-weight:500;margin-bottom:0.5rem;color:var(--sub)}
        input{width:100%;padding:0.75rem 1rem;border-radius:0.5rem;border:1px solid var(--border);background:var(--input-bg);color:var(--text);font-size:0.95rem;outline:none;transition:border-color 0.2s}
        input:focus{border-color:var(--primary);box-shadow:0 0 0 2px rgba(124,58,237,0.2)}
        button{width:100%;padding:0.75rem;border-radius:0.5rem;border:none;background:var(--primary);color:#fff;font-size:1rem;font-weight:600;cursor:pointer;transition:background-color 0.2s;margin-top:0.5rem}
        button:hover{background:var(--primary-h)}
        .alert{padding:0.75rem 1rem;border-radius:0.5rem;font-size:0.875rem;margin-bottom:1.25rem}
        .alert-error{background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2)}
        .footer{margin-top:1.5rem;text-align:center;font-size:0.8rem;color:var(--sub)}
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">
            <img src="/assets/favicon.png" alt="Obsidian Logo">
            <h1>Obsidian Web</h1>
        </div>
        ${alertHtml}
        <form method="POST" action="/login" id="loginForm">
            <div class="form-group">
                <label for="username">用户名</label>
                <input type="text" id="username" name="username" required autofocus autocomplete="username" value="admin" placeholder="请输入管理员用户名">
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input type="password" id="password" name="password" required autocomplete="current-password" placeholder="请输入管理员密码">
            </div>
            <button type="submit" id="submitBtn">登 录</button>
        </form>
        <div class="footer">
            Powered by Cloudflare Serverless
        </div>
    </div>
</body>
</html>`;
}

export function renderChangePasswordPage(msg: string | null = null, isError: boolean = false): string {
  const alertHtml = msg
    ? `<div class="alert ${isError ? 'alert-error' : 'alert-success'}" style="display:block;">${escapeHtml(msg)}</div>`
    : ``;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>修改密码 - Obsidian Web</title>
    <link rel="icon" href="/assets/favicon.png">
    <style>
        :root{--bg:#f4f4f5;--card:#fff;--text:#18181b;--sub:#71717a;--border:#e4e4e7;--input-bg:#f4f4f5;--primary:#7c3aed;--primary-h:#6d28d9}
        @media(prefers-color-scheme:dark){:root{--bg:#18181b;--card:#27272a;--text:#f4f4f5;--sub:#a1a1aa;--border:#3f3f46;--input-bg:#18181b;--primary:#9333ea;--primary-h:#7e22ce}}
        html.dark{--bg:#18181b;--card:#27272a;--text:#f4f4f5;--sub:#a1a1aa;--border:#3f3f46;--input-bg:#18181b;--primary:#9333ea;--primary-h:#7e22ce}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--text);display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
        .card{background:var(--card);border:1px solid var(--border);border-radius:1rem;padding:2.5rem;width:100%;max-width:420px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05)}
        .logo{display:flex;align-items:center;justify-content:center;gap:0.75rem;margin-bottom:1.5rem}
        .logo img{width:40px;height:40px}
        .logo h1{font-size:1.35rem;font-weight:700}
        .form-group{margin-bottom:1.25rem}
        label{display:block;font-size:0.875rem;font-weight:500;margin-bottom:0.5rem;color:var(--sub)}
        input{width:100%;padding:0.75rem 1rem;border-radius:0.5rem;border:1px solid var(--border);background:var(--input-bg);color:var(--text);font-size:0.95rem;outline:none}
        button{width:100%;padding:0.75rem;border-radius:0.5rem;border:none;background:var(--primary);color:#fff;font-size:1rem;font-weight:600;cursor:pointer}
        .alert{padding:0.75rem 1rem;border-radius:0.5rem;font-size:0.875rem;margin-bottom:1.25rem}
        .alert-error{background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2)}
        .alert-success{background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.2)}
        .nav-links{display:flex;justify-content:space-between;margin-top:1.5rem;font-size:0.875rem}
        .nav-links a{color:var(--primary);text-decoration:none}
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">
            <img src="/assets/favicon.png" alt="Obsidian Logo">
            <h1>修改访问密码</h1>
        </div>
        ${alertHtml}
        <form method="POST" action="/pwd">
            <div class="form-group">
                <label for="old_password">原密码</label>
                <input type="password" id="old_password" name="old_password" required placeholder="请输入当前密码">
            </div>
            <div class="form-group">
                <label for="new_password">新密码</label>
                <input type="password" id="new_password" name="new_password" required minlength="6" placeholder="至少 6 位新密码">
            </div>
            <div class="form-group">
                <label for="confirm_password">确认新密码</label>
                <input type="password" id="confirm_password" name="confirm_password" required minlength="6" placeholder="请再次输入新密码">
            </div>
            <button type="submit">确认修改</button>
        </form>
        <div class="nav-links">
            <a href="/">← 返回知识库</a>
            <a href="/logout">退出登录</a>
        </div>
    </div>
</body>
</html>`;
}

export function renderHostAppPage(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
  <title>Obsidian</title>
  <link href="/assets/obsidian/app.css" type="text/css" rel="stylesheet"/>
  <link rel="icon" type="image/png" href="/assets/favicon.png"/>
  <link href="/assets/server/overrides.css" type="text/css" rel="stylesheet"/>
  <style>
    #ignis-status {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 18px;
      background: #202020;
      color: #b3b3b3;
      font: 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      z-index: 9999;
      transition: opacity 200ms ease-out;
    }
    #ignis-status.fade { opacity: 0; pointer-events: none; }
    #ignis-status img {
      width: 96px;
      height: 96px;
      animation: ignis-pulse 1.6s ease-in-out infinite;
    }
    #ignis-status-label { font-size: 13px; opacity: 0.75; }
    @keyframes ignis-pulse {
      0%, 100% { opacity: 0.85; transform: scale(1); }
      50%      { opacity: 1;    transform: scale(1.04); }
    }
  </style>
  <script>
    (function() {
      var origin = window.location.origin;
      function rewriteUrl(url) {
        if (typeof url !== 'string') return url;
        var cleanUrl = url;
        if (cleanUrl.startsWith(origin)) {
          cleanUrl = cleanUrl.substring(origin.length);
        }
        if (cleanUrl === '/worker.js' || cleanUrl === 'worker.js') {
          return '/assets/obsidian/worker.js';
        }
        return url;
      }

      var origFetch = window.fetch;
      if (origFetch) {
        window.fetch = function(input, init) {
          if (typeof input === 'string') {
            input = rewriteUrl(input);
          } else if (input && input.url) {
            input = new Request(rewriteUrl(input.url), input);
          }
          return origFetch.call(this, input, init);
        };
      }

      var OrigWorker = window.Worker;
      if (OrigWorker) {
        window.Worker = function(scriptURL, options) {
          if (typeof scriptURL === 'string') {
            scriptURL = rewriteUrl(scriptURL);
          }
          return new OrigWorker(scriptURL, options);
        };
        window.Worker.prototype = OrigWorker.prototype;
      }
    })();
  </script>
</head>
<body class="theme-dark">
<div id="ignis-status">
  <img src="/assets/favicon.png" alt=""/>
  <div id="ignis-status-label">Loading Obsidian...</div>
</div>

<script type="text/javascript" src="/assets/shim/shim-loader.js"></script>
<script type="text/javascript" src="/assets/ui/ignis-ui.js"></script>

<script>
(function () {
  var scripts = [
    "/assets/obsidian/lib/codemirror/codemirror.js",
    "/assets/obsidian/lib/codemirror/overlay.js",
    "/assets/obsidian/lib/codemirror/markdown.js",
    "/assets/obsidian/lib/codemirror/cm-addons.js",
    "/assets/obsidian/lib/codemirror/vim.js",
    "/assets/obsidian/lib/codemirror/meta.min.js",
    "/assets/obsidian/lib/moment.min.js",
    "/assets/obsidian/lib/pixi.min.js",
    "/assets/obsidian/lib/i18next.min.js",
    "/assets/obsidian/lib/scrypt.js",
    "/assets/obsidian/lib/turndown.js",
    "/assets/obsidian/enhance.js",
    "/assets/obsidian/i18n.js",
    "/assets/obsidian/app.js"
  ];
  var label = document.getElementById("ignis-status-label");
  var status = document.getElementById("ignis-status");
  var loaded = 0;

  function update() {
    if (label) {
      label.textContent = "Loading Obsidian " + loaded + "/" + scripts.length;
    }
  }

  function done() {
    if (!status) return;
    status.classList.add("fade");
    setTimeout(function () {
      if (status && status.parentNode) status.parentNode.removeChild(status);
    }, 250);
  }

  function appendScripts() {
    if (scripts.length === 0) {
      done();
      return;
    }

    update();

    function loadNext(index) {
      if (index >= scripts.length) {
        done();
        return;
      }
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = scripts[index];
      s.onload = function () {
        loaded++;
        update();
        loadNext(index + 1);
      };
      s.onerror = function () {
        console.warn("Failed to load: " + scripts[index]);
        loaded++;
        update();
        loadNext(index + 1);
      };
      document.body.appendChild(s);
    }

    loadNext(0);
  }

  var ready = window.__ignisBootReady;
  if (!ready || typeof ready.then !== "function") {
    appendScripts();
    return;
  }

  var started = false;
  function start() {
    if (started) return;
    started = true;
    window.__ignisBootStarted = true;
    appendScripts();
  }

  var timer = setTimeout(start, 3000);
  ready.then(
    function () {
      clearTimeout(timer);
      start();
    },
    function () {
      clearTimeout(timer);
      start();
    }
  );
})();
</script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
