(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/path-browserify/index.js
  var require_path_browserify = __commonJS({
    "node_modules/path-browserify/index.js"(exports, module) {
      "use strict";
      function assertPath(path) {
        if (typeof path !== "string") {
          throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
        }
      }
      function normalizeStringPosix(path, allowAboveRoot) {
        var res = "";
        var lastSegmentLength = 0;
        var lastSlash = -1;
        var dots = 0;
        var code2;
        for (var i = 0; i <= path.length; ++i) {
          if (i < path.length)
            code2 = path.charCodeAt(i);
          else if (code2 === 47)
            break;
          else
            code2 = 47;
          if (code2 === 47) {
            if (lastSlash === i - 1 || dots === 1) {
            } else if (lastSlash !== i - 1 && dots === 2) {
              if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                if (res.length > 2) {
                  var lastSlashIndex = res.lastIndexOf("/");
                  if (lastSlashIndex !== res.length - 1) {
                    if (lastSlashIndex === -1) {
                      res = "";
                      lastSegmentLength = 0;
                    } else {
                      res = res.slice(0, lastSlashIndex);
                      lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                    }
                    lastSlash = i;
                    dots = 0;
                    continue;
                  }
                } else if (res.length === 2 || res.length === 1) {
                  res = "";
                  lastSegmentLength = 0;
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              }
              if (allowAboveRoot) {
                if (res.length > 0)
                  res += "/..";
                else
                  res = "..";
                lastSegmentLength = 2;
              }
            } else {
              if (res.length > 0)
                res += "/" + path.slice(lastSlash + 1, i);
              else
                res = path.slice(lastSlash + 1, i);
              lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
          } else if (code2 === 46 && dots !== -1) {
            ++dots;
          } else {
            dots = -1;
          }
        }
        return res;
      }
      function _format(sep, pathObject) {
        var dir = pathObject.dir || pathObject.root;
        var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
        if (!dir) {
          return base;
        }
        if (dir === pathObject.root) {
          return dir + base;
        }
        return dir + sep + base;
      }
      var posix = {
        // path.resolve([from ...], to)
        resolve: function resolve() {
          var resolvedPath = "";
          var resolvedAbsolute = false;
          var cwd;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path;
            if (i >= 0)
              path = arguments[i];
            else {
              if (cwd === void 0)
                cwd = process.cwd();
              path = cwd;
            }
            assertPath(path);
            if (path.length === 0) {
              continue;
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === 47;
          }
          resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
          if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
              return "/" + resolvedPath;
            else
              return "/";
          } else if (resolvedPath.length > 0) {
            return resolvedPath;
          } else {
            return ".";
          }
        },
        normalize: function normalize2(path) {
          assertPath(path);
          if (path.length === 0)
            return ".";
          var isAbsolute = path.charCodeAt(0) === 47;
          var trailingSeparator = path.charCodeAt(path.length - 1) === 47;
          path = normalizeStringPosix(path, !isAbsolute);
          if (path.length === 0 && !isAbsolute)
            path = ".";
          if (path.length > 0 && trailingSeparator)
            path += "/";
          if (isAbsolute)
            return "/" + path;
          return path;
        },
        isAbsolute: function isAbsolute(path) {
          assertPath(path);
          return path.length > 0 && path.charCodeAt(0) === 47;
        },
        join: function join() {
          if (arguments.length === 0)
            return ".";
          var joined;
          for (var i = 0; i < arguments.length; ++i) {
            var arg = arguments[i];
            assertPath(arg);
            if (arg.length > 0) {
              if (joined === void 0)
                joined = arg;
              else
                joined += "/" + arg;
            }
          }
          if (joined === void 0)
            return ".";
          return posix.normalize(joined);
        },
        relative: function relative(from, to) {
          assertPath(from);
          assertPath(to);
          if (from === to)
            return "";
          from = posix.resolve(from);
          to = posix.resolve(to);
          if (from === to)
            return "";
          var fromStart = 1;
          for (; fromStart < from.length; ++fromStart) {
            if (from.charCodeAt(fromStart) !== 47)
              break;
          }
          var fromEnd = from.length;
          var fromLen = fromEnd - fromStart;
          var toStart = 1;
          for (; toStart < to.length; ++toStart) {
            if (to.charCodeAt(toStart) !== 47)
              break;
          }
          var toEnd = to.length;
          var toLen = toEnd - toStart;
          var length = fromLen < toLen ? fromLen : toLen;
          var lastCommonSep = -1;
          var i = 0;
          for (; i <= length; ++i) {
            if (i === length) {
              if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                  return to.slice(toStart + i + 1);
                } else if (i === 0) {
                  return to.slice(toStart + i);
                }
              } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                  lastCommonSep = i;
                } else if (i === 0) {
                  lastCommonSep = 0;
                }
              }
              break;
            }
            var fromCode = from.charCodeAt(fromStart + i);
            var toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
              break;
            else if (fromCode === 47)
              lastCommonSep = i;
          }
          var out = "";
          for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === 47) {
              if (out.length === 0)
                out += "..";
              else
                out += "/..";
            }
          }
          if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
          else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === 47)
              ++toStart;
            return to.slice(toStart);
          }
        },
        _makeLong: function _makeLong(path) {
          return path;
        },
        dirname: function dirname(path) {
          assertPath(path);
          if (path.length === 0)
            return ".";
          var code2 = path.charCodeAt(0);
          var hasRoot = code2 === 47;
          var end = -1;
          var matchedSlash = true;
          for (var i = path.length - 1; i >= 1; --i) {
            code2 = path.charCodeAt(i);
            if (code2 === 47) {
              if (!matchedSlash) {
                end = i;
                break;
              }
            } else {
              matchedSlash = false;
            }
          }
          if (end === -1)
            return hasRoot ? "/" : ".";
          if (hasRoot && end === 1)
            return "//";
          return path.slice(0, end);
        },
        basename: function basename(path, ext) {
          if (ext !== void 0 && typeof ext !== "string")
            throw new TypeError('"ext" argument must be a string');
          assertPath(path);
          var start = 0;
          var end = -1;
          var matchedSlash = true;
          var i;
          if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
              return "";
            var extIdx = ext.length - 1;
            var firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
              var code2 = path.charCodeAt(i);
              if (code2 === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else {
                if (firstNonSlashEnd === -1) {
                  matchedSlash = false;
                  firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                  if (code2 === ext.charCodeAt(extIdx)) {
                    if (--extIdx === -1) {
                      end = i;
                    }
                  } else {
                    extIdx = -1;
                    end = firstNonSlashEnd;
                  }
                }
              }
            }
            if (start === end)
              end = firstNonSlashEnd;
            else if (end === -1)
              end = path.length;
            return path.slice(start, end);
          } else {
            for (i = path.length - 1; i >= 0; --i) {
              if (path.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
              }
            }
            if (end === -1)
              return "";
            return path.slice(start, end);
          }
        },
        extname: function extname(path) {
          assertPath(path);
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var preDotState = 0;
          for (var i = path.length - 1; i >= 0; --i) {
            var code2 = path.charCodeAt(i);
            if (code2 === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code2 === 46) {
              if (startDot === -1)
                startDot = i;
              else if (preDotState !== 1)
                preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            return "";
          }
          return path.slice(startDot, end);
        },
        format: function format(pathObject) {
          if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
          }
          return _format("/", pathObject);
        },
        parse: function parse(path) {
          assertPath(path);
          var ret = { root: "", dir: "", base: "", ext: "", name: "" };
          if (path.length === 0)
            return ret;
          var code2 = path.charCodeAt(0);
          var isAbsolute = code2 === 47;
          var start;
          if (isAbsolute) {
            ret.root = "/";
            start = 1;
          } else {
            start = 0;
          }
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var i = path.length - 1;
          var preDotState = 0;
          for (; i >= start; --i) {
            code2 = path.charCodeAt(i);
            if (code2 === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code2 === 46) {
              if (startDot === -1)
                startDot = i;
              else if (preDotState !== 1)
                preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            if (end !== -1) {
              if (startPart === 0 && isAbsolute)
                ret.base = ret.name = path.slice(1, end);
              else
                ret.base = ret.name = path.slice(startPart, end);
            }
          } else {
            if (startPart === 0 && isAbsolute) {
              ret.name = path.slice(1, startDot);
              ret.base = path.slice(1, end);
            } else {
              ret.name = path.slice(startPart, startDot);
              ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
          }
          if (startPart > 0)
            ret.dir = path.slice(0, startPart - 1);
          else if (isAbsolute)
            ret.dir = "/";
          return ret;
        },
        sep: "/",
        delimiter: ":",
        win32: null,
        posix: null
      };
      posix.posix = posix;
      module.exports = posix;
    }
  });

  // packages/shim/src/node/util.js
  var require_util = __commonJS({
    "packages/shim/src/node/util.js"(exports, module) {
      function promisify(fn) {
        if (typeof fn !== "function") {
          throw new TypeError('The "original" argument must be of type Function');
        }
        if (fn[promisify.custom]) {
          return fn[promisify.custom];
        }
        function promisified(...args) {
          return new Promise((resolve, reject) => {
            fn.call(this, ...args, (err2, ...results) => {
              if (err2) {
                reject(err2);
              } else if (results.length <= 1) {
                resolve(results[0]);
              } else {
                resolve(results);
              }
            });
          });
        }
        return promisified;
      }
      promisify.custom = Symbol.for("nodejs.util.promisify.custom");
      function callbackify(fn) {
        if (typeof fn !== "function") {
          throw new TypeError('The "original" argument must be of type Function');
        }
        function callbackified(...args) {
          const callback = args.pop();
          fn.apply(this, args).then(
            (result) => callback(null, result),
            (err2) => callback(err2)
          );
        }
        return callbackified;
      }
      function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
      }
      function deprecate(fn, msg) {
        let warned3 = false;
        function deprecated(...args) {
          if (!warned3) {
            console.warn("[ignis:util] DeprecationWarning:", msg);
            warned3 = true;
          }
          return fn.apply(this, args);
        }
        return deprecated;
      }
      function inspect(obj, opts) {
        try {
          return JSON.stringify(obj, null, 2);
        } catch {
          return String(obj);
        }
      }
      function format(fmt, ...args) {
        if (typeof fmt !== "string") {
          return [fmt, ...args].map(String).join(" ");
        }
        let i = 0;
        const result = fmt.replace(/%[sdjifoO%]/g, (match) => {
          if (match === "%%") {
            return "%";
          }
          if (i >= args.length) {
            return match;
          }
          const arg = args[i++];
          switch (match) {
            case "%s":
              return String(arg);
            case "%d":
            case "%i":
              return parseInt(arg, 10).toString();
            case "%f":
              return parseFloat(arg).toString();
            case "%j":
              try {
                return JSON.stringify(arg);
              } catch {
                return "[Circular]";
              }
            case "%o":
            case "%O":
              return inspect(arg);
            default:
              return match;
          }
        });
        const remaining = args.slice(i);
        if (remaining.length > 0) {
          return result + " " + remaining.map(String).join(" ");
        }
        return result;
      }
      function debuglog(section) {
        return function() {
        };
      }
      function isDeepStrictEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
      }
      var types = {
        isArray: Array.isArray,
        isDate: (v) => v instanceof Date,
        isRegExp: (v) => v instanceof RegExp,
        isAsyncFunction: (v) => typeof v === "function" && v.constructor.name === "AsyncFunction",
        isPromise: (v) => v instanceof Promise,
        isGeneratorFunction: (v) => typeof v === "function" && v.constructor.name === "GeneratorFunction",
        isArrayBuffer: (v) => v instanceof ArrayBuffer,
        isTypedArray: (v) => ArrayBuffer.isView(v) && !(v instanceof DataView),
        isMap: (v) => v instanceof Map,
        isSet: (v) => v instanceof Set,
        isWeakMap: (v) => v instanceof WeakMap,
        isWeakSet: (v) => v instanceof WeakSet
      };
      module.exports = {
        promisify,
        callbackify,
        inherits,
        deprecate,
        inspect,
        format,
        debuglog,
        isDeepStrictEqual,
        types,
        TextEncoder: globalThis.TextEncoder,
        TextDecoder: globalThis.TextDecoder
      };
    }
  });

  // packages/bridge/src/file-actions.js
  function getVaultId() {
    return window.__currentVaultId || "";
  }
  function triggerDownload(endpoint, filePath, downloadName) {
    const vaultId2 = getVaultId();
    const url = `/api/fs/${endpoint}?vault=${encodeURIComponent(vaultId2)}&path=${encodeURIComponent(filePath)}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    a.click();
  }
  async function copyIgnisUrl(file) {
    const url = `${window.location.origin}/?vault=${encodeURIComponent(getVaultId())}&file=${encodeURIComponent(file.path)}`;
    const copied = await writeToClipboard(url);
    new import_obsidian.Notice(copied ? "Ignis URL copied" : `Ignis URL: ${url}`);
  }
  async function writeToClipboard(text) {
    if (window.isSecureContext && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
      }
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    textarea.remove();
    return ok;
  }
  function showFilePicker(app, targetFolder = null) {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.style.display = "none";
    input.addEventListener("change", async () => {
      const files = Array.from(input.files || []);
      if (files.length === 0)
        return;
      const folder = targetFolder || app.vault.getRoot();
      const folderPath = folder.path;
      new import_obsidian.Notice(`Uploading ${files.length} file(s)...`);
      let successCount = 0;
      let errorCount = 0;
      for (const file of files) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const targetPath = folderPath ? `${folderPath}/${file.name}` : file.name;
          await app.vault.createBinary(targetPath, arrayBuffer);
          successCount++;
        } catch (e) {
          console.error("[ignis-bridge] Upload failed:", file.name, e);
          errorCount++;
        }
      }
      if (successCount > 0) {
        new import_obsidian.Notice(`Uploaded ${successCount} file(s) successfully`);
      }
      if (errorCount > 0) {
        new import_obsidian.Notice(`Failed to upload ${errorCount} file(s)`, 5e3);
      }
      input.remove();
    });
    document.body.appendChild(input);
    input.click();
  }
  function addFileMenuItems(menu, file) {
    menu.addItem((item) => {
      item.setTitle("Download").setIcon("download").onClick(() => triggerDownload("download", file.path, file.name));
    });
    menu.addItem((item) => {
      item.setSection("info.copy").setTitle("as Ignis URL").setIcon("link").onClick(() => copyIgnisUrl(file));
    });
  }
  function addFolderMenuItems(menu, folder, app) {
    menu.addItem((item) => {
      item.setTitle("Download as ZIP").setIcon("download").onClick(
        () => triggerDownload("download-zip", folder.path, `${folder.name}.zip`)
      );
    });
    menu.addItem((item) => {
      item.setTitle("Upload file").setIcon("upload").onClick(() => showFilePicker(app, folder));
    });
  }
  var import_obsidian;
  var init_file_actions = __esm({
    "packages/bridge/src/file-actions.js"() {
      import_obsidian = __require("obsidian");
    }
  });

  // packages/bridge/src/demo-guards.js
  function isDemoMode2() {
    return document.body && document.body.dataset.demoMode === "true";
  }
  function disableInputs(root) {
    const inputs = root.querySelectorAll(
      'input[type="email"], input[type="password"]'
    );
    for (const input of inputs) {
      if (input.dataset.ignisDemoDisabled === "1") {
        continue;
      }
      input.disabled = true;
      input.value = "";
      input.placeholder = PLACEHOLDER;
      input.dataset.ignisDemoDisabled = "1";
    }
  }
  function startDemoGuards() {
    if (!isDemoMode2() || observer) {
      return;
    }
    disableInputs(document.body);
    observer = new MutationObserver(() => {
      disableInputs(document.body);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  function stopDemoGuards() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }
  var PLACEHOLDER, observer;
  var init_demo_guards = __esm({
    "packages/bridge/src/demo-guards.js"() {
      PLACEHOLDER = "Disabled in demo. Don't enter credentials on a server you don't control.";
      observer = null;
    }
  });

  // packages/bridge/src/util/version.js
  function stripBuildMetadata(version2) {
    return (version2 || "").split("+")[0];
  }
  function parseSemver(version2) {
    const parts = (version2 || "").split(".");
    if (parts.length < 3) {
      return null;
    }
    const nums = parts.slice(0, 3).map((p) => parseInt(p, 10));
    return nums.some((n) => !Number.isInteger(n)) ? null : nums;
  }
  function isNewer(latest, current) {
    const a = parseSemver(latest);
    const b = parseSemver(current);
    if (!a || !b) {
      return false;
    }
    for (let i = 0; i < 3; i++) {
      if (a[i] !== b[i]) {
        return a[i] > b[i];
      }
    }
    return false;
  }
  var init_version = __esm({
    "packages/bridge/src/util/version.js"() {
    }
  });

  // packages/bridge/src/settings/list-editor-modal.js
  var import_obsidian2, ListEditorModal;
  var init_list_editor_modal = __esm({
    "packages/bridge/src/settings/list-editor-modal.js"() {
      import_obsidian2 = __require("obsidian");
      ListEditorModal = class extends import_obsidian2.Modal {
        constructor(app, opts) {
          super(app);
          this.opts = opts;
          this.values = [...opts.values || []];
        }
        onOpen() {
          this.titleEl.setText(this.opts.title);
          if (this.opts.recommended) {
            new import_obsidian2.Setting(this.contentEl).setDesc(this.opts.recommended.note).addButton(
              (btn) => btn.setButtonText(
                this.opts.recommended.buttonText || "Add recommended"
              ).onClick(() => this.addRecommended())
            );
          }
          this.listEl = this.contentEl.createDiv("ignis-list-editor");
          this.renderList();
          new import_obsidian2.Setting(this.contentEl).setName("Add entry").addText((text) => {
            this.input = text;
            text.setPlaceholder(this.opts.placeholder || "");
            text.inputEl.addEventListener("keydown", (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                this.addCurrent();
              }
            });
          }).addButton(
            (btn) => btn.setButtonText("Add").setCta().onClick(() => this.addCurrent())
          );
        }
        addEntry(entry) {
          if (this.values.includes(entry)) {
            return false;
          }
          this.values.push(entry);
          return true;
        }
        addCurrent() {
          const entry = this.input.getValue().trim();
          if (!entry) {
            return;
          }
          if (!this.addEntry(entry)) {
            new import_obsidian2.Notice("That entry is already in the list.");
            return;
          }
          this.input.setValue("");
          this.input.inputEl.focus();
          this.commit();
          this.renderList();
        }
        addRecommended() {
          let added = 0;
          for (const host of this.opts.recommended.hosts) {
            if (this.addEntry(host)) {
              added++;
            }
          }
          if (added > 0) {
            this.commit();
            this.renderList();
          }
          new import_obsidian2.Notice(
            added > 0 ? `Added ${added} host${added === 1 ? "" : "s"}.` : "All recommended hosts are already in the list."
          );
        }
        remove(entry) {
          this.values = this.values.filter((v) => v !== entry);
          this.commit();
          this.renderList();
        }
        renderList() {
          this.listEl.empty();
          if (this.values.length === 0) {
            this.listEl.createDiv({
              text: this.opts.emptyNote,
              cls: "ignis-list-empty"
            });
            return;
          }
          for (const entry of this.values) {
            new import_obsidian2.Setting(this.listEl).setName(entry).addExtraButton(
              (btn) => btn.setIcon("trash-2").setTooltip("Remove").onClick(() => this.remove(entry))
            );
          }
        }
        commit() {
          this.opts.onChange([...this.values]);
        }
        onClose() {
          this.contentEl.empty();
        }
      };
    }
  });

  // packages/bridge/src/settings/general-tab.js
  function getVersion() {
    var _a;
    return ((_a = window.__ignis) == null ? void 0 : _a.version) || "unknown";
  }
  async function checkForUpdate(currentVersion) {
    var _a;
    try {
      const res = await fetch(GITHUB_API_LATEST);
      if (!res.ok) {
        return null;
      }
      const data = await res.json();
      const latest = stripBuildMetadata((_a = data.tag_name) == null ? void 0 : _a.replace(/^v/, ""));
      const current = stripBuildMetadata(currentVersion);
      if (isNewer(latest, current)) {
        return { version: latest, url: data.html_url };
      }
      return null;
    } catch {
      return null;
    }
  }
  function display(containerEl, app) {
    const version2 = getVersion();
    const header = containerEl.createDiv("ignis-header");
    header.createEl("img", {
      cls: "ignis-header-logo",
      attr: { src: "/assets/ignis.webp", alt: "Ignis" }
    });
    const info = header.createDiv("ignis-header-info");
    info.createEl("div", { text: "Ignis", cls: "ignis-header-title" });
    info.createEl("div", {
      text: "Obsidian server bridge",
      cls: "ignis-header-subtitle"
    });
    const right = header.createDiv("ignis-header-right");
    const versionCol = right.createDiv("ignis-header-version-col");
    versionCol.createEl("span", {
      text: `Version ${version2}`,
      cls: "ignis-header-version"
    });
    const updateIndicator = versionCol.createEl("a", {
      text: "Checking...",
      cls: "ignis-update-indicator",
      attr: { target: "_blank", rel: "noopener noreferrer" }
    });
    const githubLink = right.createEl("a", {
      cls: "ignis-github-link",
      href: GITHUB_URL,
      attr: { target: "_blank", "aria-label": "GitHub" }
    });
    githubLink.createEl("img", {
      cls: "ignis-github-icon",
      attr: { src: "/assets/github.svg", alt: "GitHub" }
    });
    checkForUpdate(version2).then((latest) => {
      if (latest) {
        updateIndicator.textContent = `v${latest.version} available`;
        updateIndicator.addClass("ignis-update-available");
        updateIndicator.href = latest.url;
      } else {
        updateIndicator.textContent = "Up to date";
      }
    });
    addInsecureContextCallout(containerEl);
    addServerStatus(containerEl);
    addServerSettings(containerEl, app);
  }
  function addInsecureContextCallout(containerEl) {
    if (window.isSecureContext) {
      return;
    }
    const callout = containerEl.createDiv("ignis-insecure-callout");
    const icon = callout.createDiv("ignis-insecure-callout-icon");
    (0, import_obsidian3.setIcon)(icon, "alert-triangle");
    const text = callout.createDiv("ignis-insecure-callout-text");
    text.createEl("div", {
      text: "Insecure connection",
      cls: "ignis-insecure-callout-title"
    });
    const body = text.createEl("div", { cls: "ignis-insecure-callout-body" });
    body.appendText(
      "The browser disables some APIs on insecure pages, so parts of Obsidian do not work here. "
    );
    body.createEl("a", {
      text: "Serving Ignis over HTTPS",
      href: REMOTE_ACCESS_DOCS_URL,
      attr: { target: "_blank", rel: "noopener noreferrer" }
    });
    body.appendText(" restores them.");
  }
  function createSettingGroup(containerEl, heading) {
    const group = containerEl.createDiv("setting-group");
    if (heading) {
      new import_obsidian3.Setting(group).setName(heading).setHeading();
    }
    return group.createDiv("setting-items");
  }
  function addServerStatus(containerEl) {
    const ws = window.__ignis.ws;
    const items = createSettingGroup(containerEl);
    const setting = new import_obsidian3.Setting(items).setName("Server status");
    const dotEl = setting.controlEl.createEl("span", {
      cls: "ignis-status-dot"
    });
    const labelEl = setting.controlEl.createEl("span", {
      cls: "ignis-status-label"
    });
    function render(state2) {
      dotEl.className = `ignis-status-dot ${STATUS_DOT_CLASSES[state2] || STATUS_DOT_CLASSES.closed}`;
      labelEl.textContent = STATUS_LABELS[state2] || STATUS_LABELS.closed;
    }
    render(ws.isOpen() ? "open" : "closed");
    const unsub = ws.onStateChange(render);
    const observer2 = new MutationObserver(() => {
      if (!containerEl.isConnected) {
        unsub();
        observer2.disconnect();
      }
    });
    observer2.observe(containerEl.parentElement || document.body, {
      childList: true,
      subtree: true
    });
  }
  function addServerSettings(containerEl, app) {
    if (isDemoMode2()) {
      const items = createSettingGroup(containerEl);
      new import_obsidian3.Setting(items).setName("Server settings").setDesc("Server settings are disabled in demo mode.");
      return;
    }
    const loading = containerEl.createEl("p", {
      text: "Loading server settings...",
      cls: "setting-item-description"
    });
    fetch("/api/settings").then((res) => res.ok ? res.json() : Promise.reject(res)).then((current) => {
      loading.remove();
      renderServerSettings(containerEl, current, app);
    }).catch(() => {
      loading.setText("Failed to load server settings.");
    });
  }
  function renderServerSettings(containerEl, current, app) {
    const caching = createSettingGroup(containerEl, "Caching");
    numberField(caching, {
      name: "Content cache (MB)",
      desc: "Browser cache of file content. Applies after reload.",
      value: Math.round(current.contentCacheBytes / MB),
      key: "contentCacheBytes",
      toStored: (n) => n * MB
    });
    numberField(caching, {
      name: "Input cache (MB)",
      desc: "Cache for files picked for import. Applies after reload.",
      value: Math.round(current.inputCacheBytes / MB),
      key: "inputCacheBytes",
      toStored: (n) => n * MB
    });
    numberField(caching, {
      name: "Input cache TTL (minutes)",
      desc: "How long picked files stay cached. Applies after reload.",
      value: Math.round(current.inputCacheTtlMs / MINUTE),
      key: "inputCacheTtlMs",
      toStored: (n) => n * MINUTE
    });
    const security = createSettingGroup(containerEl, "Security");
    numberField(security, {
      name: "Max request body (MB)",
      desc: "Largest request the server accepts.",
      value: Math.round(current.maxBodyBytes / MB),
      key: "maxBodyBytes",
      toStored: (n) => n * MB
    });
    proxyAccessField(security, current, app);
    listField(security, {
      name: "Direct-fetch hosts",
      desc: "Hosts the browser fetches directly, bypassing the proxy. Only for hosts that allow cross-origin browser requests (CORS);  everything else goes through the proxy. Applies after reload.",
      value: current.directFetchHosts,
      key: "directFetchHosts",
      app,
      modal: {
        placeholder: "api.example.com",
        emptyNote: "No hosts yet."
      }
    });
    const advanced = createSettingGroup(containerEl, "Advanced");
    numberField(advanced, {
      name: "Write coalesce window (ms)",
      desc: "Debounce window for rapid writes on slow filesystems. 0 disables. Maximum 60000.",
      value: current.writeCoalesceMs,
      key: "writeCoalesceMs",
      toStored: (n) => n
    });
  }
  async function saveSetting(partial) {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
    } catch (e) {
      new import_obsidian3.Notice(`Failed to save setting: ${e.message}`);
    }
  }
  function numberField(containerEl, { name, desc, value, key, toStored }) {
    let committed = value;
    new import_obsidian3.Setting(containerEl).setName(name).setDesc(desc).addText((text) => {
      text.setValue(String(value));
      const commit = () => {
        const n = parseInt(text.getValue(), 10);
        if (!Number.isInteger(n) || n < 0 || n === committed) {
          return;
        }
        committed = n;
        saveSetting({ [key]: toStored(n) });
      };
      text.inputEl.addEventListener("blur", commit);
      text.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          commit();
        }
      });
    });
  }
  function proxyAccessField(parent, current, app) {
    let mode = current.proxyMode || "any";
    const setting = new import_obsidian3.Setting(parent).setName("Proxy access").setDesc(
      "Which external hosts Obsidian may reach through the server's CORS proxy."
    );
    const allowlistSetting = listField(parent, {
      name: "Proxy host allowlist",
      desc: "Hostnames the proxy may reach, matched exactly.",
      value: current.proxyAllowlist,
      key: "proxyAllowlist",
      app,
      modal: {
        placeholder: "api.example.com",
        emptyNote: "No hosts yet.",
        recommended: {
          note: "Restricting the proxy stops Obsidian's plugin and theme browser and updates from working unless their hosts are allowed.",
          hosts: [
            "releases.obsidian.md",
            "github.com",
            "api.github.com",
            "raw.githubusercontent.com"
          ],
          buttonText: "Add recommended hosts"
        }
      }
    });
    const applyVisibility = () => {
      allowlistSetting.settingEl.style.display = mode === "allowlist" ? "" : "none";
    };
    setting.addDropdown((dd) => {
      dd.addOption("any", "Any public host");
      dd.addOption("allowlist", "Allowlist only");
      dd.addOption("disabled", "Disabled");
      dd.setValue(mode);
      dd.onChange((value) => {
        mode = value;
        saveSetting({ proxyMode: value });
        applyVisibility();
      });
    });
    applyVisibility();
  }
  function listField(containerEl, { name, desc, value, key, app, modal }) {
    let current = [...value || []];
    const setting = new import_obsidian3.Setting(containerEl).setName(name).setDesc(desc);
    const setLabel = (btn) => btn.setButtonText(current.length ? `Edit (${current.length})` : "Edit");
    setting.addButton((btn) => {
      setLabel(btn);
      btn.onClick(() => {
        new ListEditorModal(app, {
          title: name,
          placeholder: modal.placeholder,
          emptyNote: modal.emptyNote,
          recommended: modal.recommended,
          values: current,
          onChange: (next) => {
            current = next;
            saveSetting({ [key]: current });
            setLabel(btn);
          }
        }).open();
      });
    });
    return setting;
  }
  var import_obsidian3, GITHUB_URL, GITHUB_API_LATEST, REMOTE_ACCESS_DOCS_URL, STATUS_LABELS, STATUS_DOT_CLASSES, MB, MINUTE;
  var init_general_tab = __esm({
    "packages/bridge/src/settings/general-tab.js"() {
      import_obsidian3 = __require("obsidian");
      init_demo_guards();
      init_version();
      init_list_editor_modal();
      GITHUB_URL = "https://github.com/Nystik-gh/ignis";
      GITHUB_API_LATEST = "https://api.github.com/repos/Nystik-gh/ignis/releases/latest";
      REMOTE_ACCESS_DOCS_URL = "https://ignis.thiefling.com/docs/security/remote-access/#running-without-tls";
      STATUS_LABELS = {
        open: "Connected",
        connecting: "Connecting...",
        closed: "Disconnected"
      };
      STATUS_DOT_CLASSES = {
        open: "ignis-status-connected",
        connecting: "ignis-status-connecting",
        closed: "ignis-status-disconnected"
      };
      MB = 1024 * 1024;
      MINUTE = 60 * 1e3;
    }
  });

  // packages/bridge/src/settings/settings-ui.js
  function createNavEl(tab, setting) {
    const nav = document.createElement("div");
    nav.className = "vertical-tab-nav-item tappable";
    if (tab.icon) {
      const iconEl = document.createElement("div");
      iconEl.className = "vertical-tab-nav-item-icon";
      if (tab.icon.startsWith("<svg") || tab.icon.startsWith("<img")) {
        iconEl.innerHTML = tab.icon;
      } else if (tab.icon.endsWith(".svg") || tab.icon.endsWith(".webp") || tab.icon.endsWith(".png")) {
        iconEl.innerHTML = `<img src="${tab.icon}" class="svg-icon" width="24" height="24" />`;
      } else {
        (0, import_obsidian4.setIcon)(iconEl, tab.icon);
      }
      nav.appendChild(iconEl);
    }
    const title = document.createElement("div");
    title.className = "vertical-tab-nav-item-title";
    title.textContent = tab.name;
    nav.appendChild(title);
    const chevron = document.createElement("div");
    chevron.className = "vertical-tab-nav-item-chevron";
    nav.appendChild(chevron);
    nav.addEventListener("click", () => {
      setting.openTab(tab);
    });
    return nav;
  }
  function createTab(id, name, displayFn, app, icon) {
    const tab = {
      id,
      name,
      icon: icon || null,
      containerEl: createDiv("vertical-tab-content"),
      navEl: null,
      display() {
        this.containerEl.empty();
        displayFn(this.containerEl, app);
      },
      hide() {
        this.containerEl.empty();
      }
    };
    return tab;
  }
  function createGroup(name) {
    const group = document.createElement("div");
    group.className = "vertical-tab-header-group";
    const title = document.createElement("div");
    title.className = "vertical-tab-header-group-title";
    title.textContent = name;
    group.appendChild(title);
    const items = document.createElement("div");
    items.className = "vertical-tab-header-group-items";
    group.appendChild(items);
    return { group, items };
  }
  function findGroupByTitle(tabHeadersEl, title) {
    const groups = tabHeadersEl.querySelectorAll(".vertical-tab-header-group");
    for (const g of groups) {
      const t = g.querySelector(".vertical-tab-header-group-title");
      if ((t == null ? void 0 : t.textContent) === title) {
        return g;
      }
    }
    return null;
  }
  var import_obsidian4;
  var init_settings_ui = __esm({
    "packages/bridge/src/settings/settings-ui.js"() {
      import_obsidian4 = __require("obsidian");
    }
  });

  // packages/bridge/src/plugin-registry.js
  async function refresh() {
    try {
      const res = await fetch("/api/plugins");
      const plugins = await res.json();
      knownIds.clear();
      knownIds.add("ignis-bridge");
      for (const plugin of plugins) {
        if (plugin.bundledPluginId) {
          knownIds.add(plugin.bundledPluginId);
        }
      }
    } catch {
    }
  }
  function isIgnisPlugin(pluginId) {
    return knownIds.has(pluginId);
  }
  var knownIds;
  var init_plugin_registry = __esm({
    "packages/bridge/src/plugin-registry.js"() {
      knownIds = /* @__PURE__ */ new Set(["ignis-bridge"]);
    }
  });

  // packages/bridge/src/settings/plugin-tabs.js
  function addPluginNavItem(pluginId, setting, corePluginsItems) {
    const tab = setting.pluginTabs.find((t) => t.id === pluginId);
    if (!tab) {
      return;
    }
    if (ownedPluginIds.has(pluginId)) {
      return;
    }
    const nav = document.createElement("div");
    nav.className = "vertical-tab-nav-item tappable";
    if (tab.icon) {
      const iconEl = document.createElement("div");
      iconEl.className = "vertical-tab-nav-item-icon";
      (0, import_obsidian5.setIcon)(iconEl, tab.icon);
      nav.appendChild(iconEl);
    }
    const title = document.createElement("div");
    title.className = "vertical-tab-nav-item-title";
    title.textContent = tab.name;
    nav.appendChild(title);
    const chevron = document.createElement("div");
    chevron.className = "vertical-tab-nav-item-chevron";
    nav.appendChild(chevron);
    nav.addEventListener("click", () => {
      setting.openTab(tab);
    });
    corePluginsItems.appendChild(nav);
    ownedPluginIds.add(pluginId);
    allIgnisNavEls.set(pluginId, nav);
  }
  function removePluginNavItem(pluginId) {
    const nav = allIgnisNavEls.get(pluginId);
    if (nav && ownedPluginIds.has(pluginId)) {
      nav.remove();
      ownedPluginIds.delete(pluginId);
      allIgnisNavEls.delete(pluginId);
    }
  }
  function hideIgnisFromCommunityPlugins(setting) {
    const cpTab = setting.settingTabs.find((t) => t.id === "community-plugins");
    if (!cpTab || cpTab._ignisPatched) {
      return;
    }
    const origRender = cpTab.renderInstalledPlugin;
    cpTab.renderInstalledPlugin = function(manifest, ...rest) {
      if (isIgnisPlugin(manifest.id)) {
        return;
      }
      return origRender.call(this, manifest, ...rest);
    };
    cpTab._ignisPatched = true;
    cpTab._origRenderInstalledPlugin = origRender;
  }
  function restoreCommunityPlugins(setting) {
    const cpTab = setting.settingTabs.find(
      (t) => t.id === "community-plugins"
    );
    if (cpTab == null ? void 0 : cpTab._origRenderInstalledPlugin) {
      cpTab.renderInstalledPlugin = cpTab._origRenderInstalledPlugin;
      delete cpTab._origRenderInstalledPlugin;
      delete cpTab._ignisPatched;
    }
  }
  function hideIgnisNavFromCommunityGroup(setting) {
    var _a;
    const communityGroup = findGroupByTitle(
      setting.tabHeadersEl,
      "Community plugins"
    );
    if (!communityGroup) {
      return;
    }
    const items = communityGroup.querySelector(".vertical-tab-header-group-items");
    if (!items) {
      return;
    }
    for (const tab of setting.pluginTabs) {
      if (isIgnisPlugin(tab.id) && ((_a = tab.navEl) == null ? void 0 : _a.parentElement) === items) {
        tab.navEl.style.display = "none";
      }
    }
    const hasVisible = Array.from(items.children).some(
      (el) => el.style.display !== "none"
    );
    communityGroup.style.display = hasVisible ? "" : "none";
  }
  function hideCorePluginsGroupIfEmpty() {
    let hasConnected = false;
    for (const id of ownedPluginIds) {
      const nav = allIgnisNavEls.get(id);
      if (nav == null ? void 0 : nav.isConnected) {
        hasConnected = true;
        break;
      }
    }
    const groups = document.querySelectorAll(".vertical-tab-header-group");
    for (const g of groups) {
      const title = g.querySelector(".vertical-tab-header-group-title");
      if ((title == null ? void 0 : title.textContent) === "Ignis Core Plugins") {
        g.style.display = hasConnected ? "" : "none";
        break;
      }
    }
  }
  function setupPluginTabs(setting, corePluginsItems) {
    for (const tab of setting.pluginTabs) {
      if (isIgnisPlugin(tab.id) && tab.id !== "ignis-bridge") {
        addPluginNavItem(tab.id, setting, corePluginsItems);
      }
    }
    hideIgnisNavFromCommunityGroup(setting);
    hideCorePluginsGroupIfEmpty();
    const communityGroup = findGroupByTitle(
      setting.tabHeadersEl,
      "Community plugins"
    );
    if (communityGroup) {
      const observer2 = new MutationObserver(() => {
        for (const tab of setting.pluginTabs) {
          if (isIgnisPlugin(tab.id) && tab.id !== "ignis-bridge") {
            addPluginNavItem(tab.id, setting, corePluginsItems);
          }
        }
        hideIgnisNavFromCommunityGroup(setting);
        hideCorePluginsGroupIfEmpty();
      });
      observer2.observe(communityGroup, { childList: true, subtree: true });
      const modalEl = setting.tabHeadersEl.closest(".modal");
      if (modalEl && modalEl.parentElement) {
        const cleanupObserver = new MutationObserver(() => {
          if (!setting.tabHeadersEl.isConnected) {
            observer2.disconnect();
            cleanupObserver.disconnect();
          }
        });
        cleanupObserver.observe(modalEl.parentElement, {
          childList: true
        });
      }
    }
  }
  function reconcilePluginTabs(setting) {
    const corePluginsGroup = findGroupByTitle(
      setting.tabHeadersEl,
      "Ignis Core Plugins"
    );
    if (!corePluginsGroup) {
      return;
    }
    const corePluginsItems = corePluginsGroup.querySelector(
      ".vertical-tab-header-group-items"
    );
    if (!corePluginsItems) {
      return;
    }
    const activeIds = new Set(
      setting.pluginTabs.filter((t) => isIgnisPlugin(t.id) && t.id !== "ignis-bridge").map((t) => t.id)
    );
    for (const id of ownedPluginIds) {
      if (!activeIds.has(id)) {
        removePluginNavItem(id);
      }
    }
    for (const id of activeIds) {
      addPluginNavItem(id, setting, corePluginsItems);
    }
    hideIgnisNavFromCommunityGroup(setting);
    hideCorePluginsGroupIfEmpty();
  }
  function clearOwnedPluginIds() {
    ownedPluginIds.clear();
  }
  var import_obsidian5, allIgnisNavEls, ownedPluginIds;
  var init_plugin_tabs = __esm({
    "packages/bridge/src/settings/plugin-tabs.js"() {
      import_obsidian5 = __require("obsidian");
      init_settings_ui();
      init_plugin_registry();
      allIgnisNavEls = /* @__PURE__ */ new Map();
      ownedPluginIds = /* @__PURE__ */ new Set();
    }
  });

  // packages/bridge/src/settings/server-plugins-tab.js
  function getVaultId2() {
    return window.__currentVaultId || "";
  }
  async function fetchPlugins() {
    const res = await fetch("/api/plugins");
    if (!res.ok) {
      throw new Error("Failed to fetch plugins");
    }
    return res.json();
  }
  async function togglePlugin(pluginId, enable) {
    const action = enable ? "enable" : "disable";
    const vaultId2 = getVaultId2();
    const res = await fetch(`/api/plugins/${pluginId}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vault: vaultId2 })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Failed to ${action} plugin`);
    }
    return res.json();
  }
  function display2(containerEl, app) {
    containerEl.createEl("h2", { text: "Ignis Core Plugins" });
    containerEl.createEl("p", {
      text: "Ignis plugins extend server functionality and run alongside your vaults. They are separate from Obsidian's built-in plugins.",
      cls: "ignis-plugins-description"
    });
    const loadingEl = containerEl.createEl("p", { text: "Loading plugins..." });
    fetchPlugins().then((plugins) => {
      loadingEl.remove();
      if (plugins.length === 0) {
        containerEl.createEl("p", {
          text: "No server plugins available.",
          cls: "setting-item-description"
        });
        return;
      }
      const vaultId2 = getVaultId2();
      for (const plugin of plugins) {
        const enabled = plugin.enabledVaults.includes(vaultId2);
        new import_obsidian6.Setting(containerEl).setName(plugin.name).setDesc(plugin.description || "").addToggle((toggle) => {
          toggle.setValue(enabled);
          toggle.onChange(async (value) => {
            try {
              await togglePlugin(plugin.id, value);
              new import_obsidian6.Notice(
                `${plugin.name} ${value ? "enabled" : "disabled"} for this vault.`
              );
              setTimeout(() => {
                reconcilePluginTabs(app.setting);
              }, 100);
            } catch (e) {
              new import_obsidian6.Notice(`Failed: ${e.message}`);
              toggle.setValue(!value);
            }
          });
        });
      }
    }).catch((e) => {
      loadingEl.setText("Failed to load plugins.");
      console.error("[ignis-bridge] Server plugins error:", e);
    });
  }
  var import_obsidian6;
  var init_server_plugins_tab = __esm({
    "packages/bridge/src/settings/server-plugins-tab.js"() {
      import_obsidian6 = __require("obsidian");
      init_plugin_tabs();
    }
  });

  // packages/bridge/src/settings/inject.js
  function removeExistingIgnisGroups(tabHeadersEl) {
    const groups = tabHeadersEl.querySelectorAll(".vertical-tab-header-group");
    for (const g of groups) {
      const title = g.querySelector(".vertical-tab-header-group-title");
      if ((title == null ? void 0 : title.textContent) === "Ignis" || (title == null ? void 0 : title.textContent) === "Ignis Core Plugins") {
        g.remove();
      }
    }
  }
  function replaceInstallerVersionRow(setting, ignisVersion) {
    const container = setting.tabContentContainer || setting.contentEl;
    if (!container) {
      return;
    }
    const rows = container.querySelectorAll(".setting-item");
    for (const row of rows) {
      const desc = row.querySelector(".setting-item-description");
      if (!desc || !desc.textContent.startsWith("Installer version:")) {
        continue;
      }
      desc.empty();
      desc.createEl("strong", { text: `Running in Ignis v${ignisVersion}` });
      desc.createEl("br");
      desc.appendText(
        "Obsidian is served through Ignis. There's no installer to update."
      );
      break;
    }
  }
  function patchOpenTab(setting, plugin) {
    if (setting._ignisOpenTabPatched) {
      return;
    }
    const original = setting.openTab.bind(setting);
    setting.openTab = function(tab) {
      for (const [, el] of allIgnisNavEls) {
        el.removeClass("is-active");
      }
      original(tab);
      const navEl = allIgnisNavEls.get(tab.id);
      if (navEl) {
        navEl.addClass("is-active");
      }
      if (tab && tab.id === "about") {
        replaceInstallerVersionRow(setting, plugin.manifest.version);
      }
    };
    setting._ignisOpenTabPatched = true;
  }
  function injectIgnisSettings(setting, app, plugin) {
    removeExistingIgnisGroups(setting.tabHeadersEl);
    clearOwnedPluginIds();
    allIgnisNavEls.clear();
    patchOpenTab(setting, plugin);
    replaceInstallerVersionRow(setting, plugin.manifest.version);
    const ignis = createGroup("Ignis");
    const tabs = [
      createTab("ignis-general", "General", display, app, "flame"),
      createTab(
        "ignis-core-plugins",
        "Core plugins",
        display2,
        app,
        "blocks"
      )
    ];
    for (const tab of tabs) {
      tab.navEl = createNavEl(tab, setting);
      ignis.items.appendChild(tab.navEl);
      allIgnisNavEls.set(tab.id, tab.navEl);
    }
    setting.tabHeadersEl.appendChild(ignis.group);
    const corePlugins = createGroup("Ignis Core Plugins");
    setting.tabHeadersEl.appendChild(corePlugins.group);
    hideIgnisFromCommunityPlugins(setting);
    setupPluginTabs(setting, corePlugins.items);
  }
  function patchSettingsModal(plugin) {
    const original = plugin.app.setting.onOpen;
    const app = plugin.app;
    plugin._originalOnOpen = original;
    plugin.app.setting.onOpen = function() {
      original.call(this);
      injectIgnisSettings(this, app, plugin);
    };
  }
  function unpatchSettingsModal(plugin) {
    if (plugin._originalOnOpen) {
      plugin.app.setting.onOpen = plugin._originalOnOpen;
    }
    delete plugin.app.setting._ignisOpenTabPatched;
    restoreCommunityPlugins(plugin.app.setting);
    clearOwnedPluginIds();
  }
  var init_inject = __esm({
    "packages/bridge/src/settings/inject.js"() {
      init_general_tab();
      init_server_plugins_tab();
      init_settings_ui();
      init_plugin_tabs();
    }
  });

  // packages/bridge/src/status-bar.js
  function initStatusBar(plugin) {
    const ws = window.__ignis.ws;
    const writes = window.__ignis.writes;
    const item = plugin.addStatusBarItem();
    item.addClass("ignis-statusbar-item");
    const dot = item.createEl("span", { cls: "ignis-statusbar-dot" });
    item.setAttribute("data-tooltip-position", "top");
    let connState = ws.isOpen() ? "open" : "closed";
    let writeState = writes ? writes.getState() : "clean";
    let failureNotice = null;
    function render() {
      const pending2 = writeState === "pending";
      const connClass = STATUS_DOT_CLASSES2[connState] || STATUS_DOT_CLASSES2.closed;
      dot.className = `ignis-statusbar-dot ${connClass}${pending2 ? " ignis-statusbar-writes-pending" : ""}`;
      let label = `Server: ${STATUS_LABELS2[connState] || STATUS_LABELS2.closed}`;
      if (pending2 && writes) {
        const { retrying } = writes.getDetail();
        label += retrying > 0 ? ` \xB7 Writes: ${retrying} retrying` : " \xB7 Writes: pending";
      }
      item.setAttribute("aria-label", label);
    }
    function showFailureNotice() {
      const count = writes.listFailed().length;
      if (count === 0) {
        return;
      }
      if (failureNotice) {
        failureNotice.hide();
      }
      const frag = document.createDocumentFragment();
      const text = document.createElement("div");
      text.textContent = `Ignis: ${count} change${count === 1 ? "" : "s"} could not be saved after repeated retries.`;
      frag.appendChild(text);
      const actions = document.createElement("div");
      actions.className = "ignis-write-failure-actions";
      const retry = document.createElement("button");
      retry.textContent = "Retry";
      retry.addEventListener("click", () => {
        writes.retryAll();
        if (failureNotice) {
          failureNotice.hide();
        }
      });
      const reload = document.createElement("button");
      reload.textContent = "Reload";
      reload.addEventListener("click", () => window.location.reload());
      actions.appendChild(retry);
      actions.appendChild(reload);
      frag.appendChild(actions);
      failureNotice = new import_obsidian7.Notice(frag, 0);
    }
    function reconcileFailureNotice() {
      if (failureNotice && writes.listFailed().length === 0) {
        failureNotice.hide();
        failureNotice = null;
      }
    }
    render();
    item.addEventListener("mouseenter", render);
    const unsubConn = ws.onStateChange((state2) => {
      connState = state2;
      render();
    });
    let unsubWriteState = () => {
    };
    let unsubFailure = () => {
    };
    let unsubFailureChange = () => {
    };
    if (writes) {
      unsubWriteState = writes.onStateChange((state2) => {
        writeState = state2;
        render();
      });
      unsubFailure = writes.onFailure(() => showFailureNotice());
      unsubFailureChange = writes.onFailureChange(() => reconcileFailureNotice());
    }
    return () => {
      unsubConn();
      unsubWriteState();
      unsubFailure();
      unsubFailureChange();
      if (failureNotice) {
        failureNotice.hide();
        failureNotice = null;
      }
    };
  }
  var import_obsidian7, STATUS_LABELS2, STATUS_DOT_CLASSES2;
  var init_status_bar = __esm({
    "packages/bridge/src/status-bar.js"() {
      import_obsidian7 = __require("obsidian");
      STATUS_LABELS2 = {
        open: "Connected",
        connecting: "Connecting...",
        closed: "Disconnected"
      };
      STATUS_DOT_CLASSES2 = {
        open: "ignis-statusbar-connected",
        connecting: "ignis-statusbar-connecting",
        closed: "ignis-statusbar-disconnected"
      };
    }
  });

  // packages/bridge/src/save-notice.js
  function initSaveNotice() {
    const writes = window.__ignis.writes;
    if (!writes) {
      return () => {
      };
    }
    let notice2 = null;
    let savedNotice = null;
    let showTimer = null;
    let refreshTimer = null;
    let watchTimer = null;
    let failedAtStart = 0;
    function isConfigPath(path) {
      return /(^|\/)\.obsidian\//.test(String(path));
    }
    function pendingHasNote() {
      if (typeof writes.listPending !== "function") {
        return true;
      }
      return writes.listPending().some((p) => !isConfigPath(p));
    }
    function message() {
      const { retrying } = writes.getDetail();
      return retrying > 0 ? `Saving... (${retrying} retrying)` : "Saving...";
    }
    function beginEpisode() {
      if (savedNotice) {
        savedNotice.hide();
        savedNotice = null;
      }
      failedAtStart = writes.listFailed().length;
      clearTimeout(showTimer);
      showTimer = setTimeout(() => {
        showTimer = null;
        notice2 = new import_obsidian8.Notice(message(), 0);
        refreshTimer = setInterval(
          () => notice2.setMessage(message()),
          REFRESH_MS
        );
      }, SHOW_AFTER_PENDING_MS);
    }
    function endEpisode() {
      clearTimeout(showTimer);
      showTimer = null;
      clearInterval(refreshTimer);
      refreshTimer = null;
      if (!notice2) {
        return;
      }
      const n = notice2;
      notice2 = null;
      if (writes.listFailed().length > failedAtStart) {
        n.hide();
        return;
      }
      n.setMessage("Saved");
      n.setAutoHide(SAVED_HIDE_MS);
      savedNotice = n;
    }
    function watchForNote() {
      clearInterval(watchTimer);
      watchTimer = setInterval(() => {
        if (writes.getState() !== "pending") {
          clearInterval(watchTimer);
          watchTimer = null;
          return;
        }
        if (pendingHasNote()) {
          clearInterval(watchTimer);
          watchTimer = null;
          beginEpisode();
        }
      }, 1e3);
    }
    const unsubState = writes.onStateChange((state2) => {
      if (state2 === "pending") {
        if (pendingHasNote()) {
          beginEpisode();
        } else {
          watchForNote();
        }
      } else {
        clearInterval(watchTimer);
        watchTimer = null;
        endEpisode();
      }
    });
    return () => {
      unsubState();
      clearTimeout(showTimer);
      clearInterval(refreshTimer);
      clearInterval(watchTimer);
      if (notice2) {
        notice2.hide();
        notice2 = null;
      }
      if (savedNotice) {
        savedNotice.hide();
        savedNotice = null;
      }
    };
  }
  var import_obsidian8, SHOW_AFTER_PENDING_MS, SAVED_HIDE_MS, REFRESH_MS;
  var init_save_notice = __esm({
    "packages/bridge/src/save-notice.js"() {
      import_obsidian8 = __require("obsidian");
      SHOW_AFTER_PENDING_MS = 1e3;
      SAVED_HIDE_MS = 2e3;
      REFRESH_MS = 2e3;
    }
  });

  // packages/bridge/src/view-mode.js
  function enterReadingMode(view) {
    if (!view || typeof view.getMode !== "function" || typeof view.setMode !== "function" || !view.modes || !view.modes.preview) {
      return null;
    }
    if (view.getMode() === "preview") {
      return null;
    }
    view.setMode(view.modes.preview);
    return () => {
      if (view.getMode() === "preview" && view.modes.source) {
        view.setMode(view.modes.source);
      }
    };
  }
  var init_view_mode = __esm({
    "packages/bridge/src/view-mode.js"() {
    }
  });

  // packages/bridge/src/loading-gate.js
  function beginGate(view) {
    const token = (view._ignisGateToken || 0) + 1;
    view._ignisGateToken = token;
    teardownGate(view);
    const contentEl = view.contentEl || null;
    const blocker = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    if (contentEl) {
      contentEl.addEventListener("beforeinput", blocker, true);
    }
    const timer = setTimeout(() => {
      if (view._ignisGateToken !== token) {
        return;
      }
      if (contentEl) {
        contentEl.classList.add("ignis-loading");
      }
      const gate = view._ignisGate;
      if (gate) {
        gate.restoreMode = enterReadingMode(view);
      }
    }, AFFORDANCE_DELAY_MS);
    view._ignisGate = { contentEl, blocker, timer, restoreMode: null };
    return token;
  }
  function teardownGate(view) {
    const gate = view._ignisGate;
    if (!gate) {
      return;
    }
    clearTimeout(gate.timer);
    if (gate.contentEl) {
      gate.contentEl.removeEventListener("beforeinput", gate.blocker, true);
      gate.contentEl.classList.remove("ignis-loading");
    }
    if (gate.restoreMode) {
      gate.restoreMode();
    }
    view._ignisGate = null;
  }
  function endGate(view, token) {
    if (view._ignisGateToken !== token) {
      return;
    }
    teardownGate(view);
  }
  function installLoadingGate() {
    if (patched || typeof import_obsidian9.MarkdownView !== "function" || !import_obsidian9.MarkdownView.prototype) {
      return () => {
      };
    }
    originalOnLoadFile = import_obsidian9.MarkdownView.prototype.onLoadFile;
    if (typeof originalOnLoadFile !== "function") {
      return () => {
      };
    }
    import_obsidian9.MarkdownView.prototype.onLoadFile = async function(file) {
      const token = beginGate(this);
      try {
        return await originalOnLoadFile.apply(this, arguments);
      } finally {
        endGate(this, token);
      }
    };
    patched = true;
    return uninstallLoadingGate;
  }
  function uninstallLoadingGate() {
    if (!patched) {
      return;
    }
    delete import_obsidian9.MarkdownView.prototype.onLoadFile;
    patched = false;
    originalOnLoadFile = null;
  }
  var import_obsidian9, AFFORDANCE_DELAY_MS, patched, originalOnLoadFile;
  var init_loading_gate = __esm({
    "packages/bridge/src/loading-gate.js"() {
      import_obsidian9 = __require("obsidian");
      init_view_mode();
      AFFORDANCE_DELAY_MS = 80;
      patched = false;
      originalOnLoadFile = null;
    }
  });

  // packages/bridge/src/workspace-picker.js
  var import_obsidian10, WorkspacePickerModal;
  var init_workspace_picker = __esm({
    "packages/bridge/src/workspace-picker.js"() {
      import_obsidian10 = __require("obsidian");
      WorkspacePickerModal = class extends import_obsidian10.FuzzySuggestModal {
        constructor(app) {
          super(app);
          this.setPlaceholder("Open workspace in new tab");
        }
        getItems() {
          const plugin = this.app.internalPlugins.plugins.workspaces;
          if (!plugin || !plugin.enabled || !plugin.instance) {
            return [];
          }
          return Object.keys(plugin.instance.workspaces);
        }
        getItemText(item) {
          return item;
        }
        onChooseItem(item) {
          const url = new URL(window.location.href);
          url.searchParams.set("workspace", item);
          url.searchParams.set("load", "preset");
          window.open(url.toString(), "_blank");
        }
      };
    }
  });

  // packages/bridge/src/insecure-api-notice.js
  function categorize(api) {
    if (typeof api !== "string") {
      return "other";
    }
    if (api.startsWith("crypto.subtle")) {
      return "crypto";
    }
    if (api.includes("clipboard")) {
      return "clipboard";
    }
    return "other";
  }
  function initInsecureApiNotice() {
    if (window.isSecureContext) {
      return () => {
      };
    }
    const notified = /* @__PURE__ */ new Set();
    const handler = (event) => {
      const category = categorize(event.detail && event.detail.api);
      if (notified.has(category)) {
        return;
      }
      notified.add(category);
      new import_obsidian11.Notice(MESSAGES[category], 8e3);
    };
    window.addEventListener(INSECURE_API_EVENT2, handler);
    return () => window.removeEventListener(INSECURE_API_EVENT2, handler);
  }
  var import_obsidian11, INSECURE_API_EVENT2, MESSAGES;
  var init_insecure_api_notice = __esm({
    "packages/bridge/src/insecure-api-notice.js"() {
      import_obsidian11 = __require("obsidian");
      INSECURE_API_EVENT2 = "ignis:insecure-api";
      MESSAGES = {
        crypto: "Cryptography is disabled on insecure connections. Serve Ignis over HTTPS to enable it.",
        clipboard: "Clipboard access is limited on insecure connections. Keyboard shortcuts still work. Serve Ignis over HTTPS for full clipboard support.",
        other: "This feature is disabled on insecure connections. Serve Ignis over HTTPS to enable it."
      };
    }
  });

  // packages/bridge/src/proxy-block-notice.js
  function noticeText({ code: code2, host }) {
    switch (code2) {
      case "private-host":
      case "private-resolve":
        return `Ignis blocked a connection to ${host} (private address).`;
      case "dns":
        return `Ignis could not resolve ${host}.`;
      case "allowlist":
        return `Ignis blocked ${host}: not in the proxy host allowlist.`;
      case "disabled":
        return "Ignis blocked a connection: proxy access is disabled.";
      default:
        return "Ignis blocked a connection.";
    }
  }
  function initProxyBlockNotice(app) {
    const handler = (event) => {
      const detail = event.detail || {};
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode(noticeText(detail) + " "));
      const details = document.createElement("button");
      details.textContent = "Details";
      details.addEventListener("click", () => {
        new ProxyBlockModal(app, detail).open();
      });
      frag.appendChild(details);
      new import_obsidian12.Notice(frag, 1e4);
    };
    window.addEventListener(PROXY_BLOCK_EVENT2, handler);
    return () => window.removeEventListener(PROXY_BLOCK_EVENT2, handler);
  }
  var import_obsidian12, PROXY_BLOCK_EVENT2, DOCS_URL, ProxyBlockModal;
  var init_proxy_block_notice = __esm({
    "packages/bridge/src/proxy-block-notice.js"() {
      import_obsidian12 = __require("obsidian");
      PROXY_BLOCK_EVENT2 = "ignis:proxy-blocked";
      DOCS_URL = "https://ignis.thiefling.com/docs/sync/#servers-on-a-private-address";
      ProxyBlockModal = class extends import_obsidian12.Modal {
        constructor(app, detail) {
          super(app);
          this.detail = detail;
        }
        onOpen() {
          const { contentEl } = this;
          const { code: code2, host, address } = this.detail;
          this.setTitle("Connection blocked");
          contentEl.addClass("ignis-block-modal");
          if (code2 === "private-host" || code2 === "private-resolve") {
            const intro = contentEl.createEl("p");
            intro.appendText(
              "Ignis relays plugin requests through the server, which blocks private addresses unless they are explicitly allowed. "
            );
            intro.createEl("code", { text: host });
            intro.appendText(
              code2 === "private-resolve" ? " resolves to the private address " : " is a private address."
            );
            if (code2 === "private-resolve") {
              intro.createEl("code", { text: address });
              intro.appendText(".");
            }
            intro.appendText(" Allow it in one of two ways:");
            const list = contentEl.createEl("ul");
            const envItem = list.createEl("li");
            envItem.appendText("Set the ");
            envItem.createEl("code", { text: "PROXY_ALLOW_PRIVATE_HOSTS" });
            envItem.appendText(" environment variable on the server to include ");
            envItem.createEl("code", { text: address || host });
            envItem.appendText(".");
            const directItem = list.createEl("li");
            directItem.appendText("Add ");
            directItem.createEl("code", { text: host });
            directItem.appendText(
              " to direct-fetch hosts (Settings > Ignis > General > Security), so the browser connects to it directly. The target must allow cross-origin requests (CORS)."
            );
            const docs = contentEl.createEl("p");
            docs.createEl("a", {
              text: "Docs: sync connectivity",
              href: DOCS_URL,
              attr: { target: "_blank", rel: "noopener noreferrer" }
            });
          } else if (code2 === "dns") {
            contentEl.createEl("p", {
              text: `The server could not resolve ${host}. Check the hostname, or use an IP address instead. The name must resolve on the Ignis server.`
            });
          } else if (code2 === "allowlist") {
            contentEl.createEl("p", {
              text: `Proxy access is restricted to an allowlist, and ${host} is not on it. Add it under Settings > Ignis > General > Security > Proxy host allowlist.`
            });
          } else if (code2 === "disabled") {
            contentEl.createEl("p", {
              text: "Proxy access is disabled under Settings > Ignis > General > Security. Cross-origin plugin requests are blocked while it is disabled."
            });
          } else {
            contentEl.createEl("p", {
              text: this.detail.message || "Ignis blocked the connection."
            });
          }
        }
        onClose() {
          this.contentEl.empty();
        }
      };
    }
  });

  // packages/bridge/src/write-giveup-notice.js
  function initWriteGiveupNotice() {
    const lastNotified = /* @__PURE__ */ new Map();
    const handler = (event) => {
      const path = event.detail && event.detail.path || "";
      const now = Date.now();
      for (const [k, at] of lastNotified) {
        if (now - at >= REPORT_INTERVAL_MS2) {
          lastNotified.delete(k);
        }
      }
      if (lastNotified.has(path)) {
        return;
      }
      lastNotified.set(path, now);
      new import_obsidian13.Notice(
        `Ignis failed to save "${path}". Changes may be lost on reload.`,
        1e4
      );
    };
    window.addEventListener(WRITE_GIVEUP_EVENT, handler);
    return () => window.removeEventListener(WRITE_GIVEUP_EVENT, handler);
  }
  var import_obsidian13, WRITE_GIVEUP_EVENT, REPORT_INTERVAL_MS2;
  var init_write_giveup_notice = __esm({
    "packages/bridge/src/write-giveup-notice.js"() {
      import_obsidian13 = __require("obsidian");
      WRITE_GIVEUP_EVENT = "ignis:write-giveup";
      REPORT_INTERVAL_MS2 = 60 * 1e3;
    }
  });

  // packages/bridge/src/image-retry.js
  function isVaultImage(el) {
    if (!el || el.tagName !== "IMG" || !el.src) {
      return false;
    }
    try {
      const url = new URL(el.src, window.location.href);
      return url.origin === window.location.origin && url.pathname.startsWith("/vault-files/");
    } catch {
      return false;
    }
  }
  function initImageRetry() {
    const attempts = /* @__PURE__ */ new WeakMap();
    const timers = /* @__PURE__ */ new Set();
    function onError(e) {
      const img = e.target;
      if (!isVaultImage(img)) {
        return;
      }
      const attempt2 = attempts.get(img) || 0;
      if (attempt2 >= MAX_ATTEMPTS2) {
        return;
      }
      attempts.set(img, attempt2 + 1);
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (!img.isConnected) {
          return;
        }
        const url = new URL(img.src, window.location.href);
        url.searchParams.set("ignis-retry", String(attempt2 + 1));
        img.src = url.toString();
      }, RETRY_DELAYS_MS[attempt2]);
      timers.add(timer);
    }
    function onLoad(e) {
      if (isVaultImage(e.target)) {
        attempts.delete(e.target);
      }
    }
    document.addEventListener("error", onError, true);
    document.addEventListener("load", onLoad, true);
    return () => {
      document.removeEventListener("error", onError, true);
      document.removeEventListener("load", onLoad, true);
      for (const timer of timers) {
        clearTimeout(timer);
      }
      timers.clear();
    };
  }
  var MAX_ATTEMPTS2, RETRY_DELAYS_MS;
  var init_image_retry = __esm({
    "packages/bridge/src/image-retry.js"() {
      MAX_ATTEMPTS2 = 3;
      RETRY_DELAYS_MS = [500, 2e3, 8e3];
    }
  });

  // packages/bridge/src/main.js
  var main_exports = {};
  __export(main_exports, {
    default: () => main_default
  });
  var import_obsidian14, IgnisBridgePlugin, main_default;
  var init_main = __esm({
    "packages/bridge/src/main.js"() {
      import_obsidian14 = __require("obsidian");
      init_file_actions();
      init_inject();
      init_plugin_registry();
      init_status_bar();
      init_save_notice();
      init_loading_gate();
      init_workspace_picker();
      init_demo_guards();
      init_insecure_api_notice();
      init_proxy_block_notice();
      init_write_giveup_notice();
      init_image_retry();
      IgnisBridgePlugin = class extends import_obsidian14.Plugin {
        async onload() {
          if (!window.__ignis) {
            console.log("[ignis-bridge] Not running in Ignis - plugin is a no-op.");
            return;
          }
          console.log("[ignis-bridge] Plugin loaded");
          await refresh();
          patchSettingsModal(this);
          startDemoGuards();
          this._statusBarUnsub = initStatusBar(this);
          this._saveNoticeUnsub = initSaveNotice();
          this._loadingGateUnsub = installLoadingGate();
          this._insecureApiUnsub = initInsecureApiNotice();
          this._proxyBlockUnsub = initProxyBlockNotice(this.app);
          this._writeGiveupUnsub = initWriteGiveupNotice();
          this._imageRetryUnsub = initImageRetry();
          this.addRibbonIcon("upload", "Upload file", () => {
            showFilePicker(this.app);
          });
          this.addCommand({
            id: "open-workspace-in-new-tab",
            name: "Open workspace in new tab",
            callback: () => {
              new WorkspacePickerModal(this.app).open();
            }
          });
          this.registerEvent(
            this.app.workspace.on("file-menu", (menu, file) => {
              if (file instanceof import_obsidian14.TFile) {
                addFileMenuItems(menu, file);
              } else if (file instanceof import_obsidian14.TFolder) {
                addFolderMenuItems(menu, file, this.app);
              }
            })
          );
        }
        onunload() {
          if (!window.__ignis) {
            return;
          }
          if (this._statusBarUnsub) {
            this._statusBarUnsub();
          }
          if (this._saveNoticeUnsub) {
            this._saveNoticeUnsub();
          }
          if (this._loadingGateUnsub) {
            this._loadingGateUnsub();
          }
          if (this._insecureApiUnsub) {
            this._insecureApiUnsub();
          }
          if (this._proxyBlockUnsub) {
            this._proxyBlockUnsub();
          }
          if (this._writeGiveupUnsub) {
            this._writeGiveupUnsub();
          }
          if (this._imageRetryUnsub) {
            this._imageRetryUnsub();
          }
          unpatchSettingsModal(this);
          stopDemoGuards();
          console.log("[ignis-bridge] Plugin unloaded");
        }
      };
      main_default = IgnisBridgePlugin;
    }
  });

  // packages/shim/src/ui-registry.js
  var handlers = {};
  function registerUI(impls) {
    handlers = { ...handlers, ...impls };
  }
  function proxy(name) {
    return (...args) => {
      const fn = handlers[name];
      if (typeof fn !== "function") {
        console.warn(`[ignis] UI handler '${name}' not registered`);
        return void 0;
      }
      return fn(...args);
    };
  }
  var showVaultManager = proxy("showVaultManager");
  var showMessageDialog = proxy("showMessageDialog");
  var showConfirmDialog = proxy("showConfirmDialog");
  var showPromptDialog = proxy("showPromptDialog");

  // packages/services/src/vault-service.js
  var API_BASE = "/api/vault";
  async function fetchJson(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(data.error || "Request failed");
    }
    return res.json();
  }
  var vaultService = {
    getCurrentVaultId() {
      return window.__currentVaultId || "";
    },
    async listVaults() {
      const list = await fetchJson(API_BASE + "/list");
      window.__vaultList = list;
      return list;
    },
    listVaultsSync() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", API_BASE + "/list", false);
      xhr.send();
      if (xhr.status === 200) {
        const list = JSON.parse(xhr.responseText);
        window.__vaultList = list;
        return list;
      }
      return [];
    },
    async createVault(name) {
      await fetchJson(API_BASE + "/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      this._setVaultTrust(name);
      return this.listVaults();
    },
    createVaultSync(name) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", API_BASE + "/create", false);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({ name }));
      if (xhr.status >= 400) {
        return null;
      }
      return true;
    },
    async renameVault(id, newName) {
      await fetchJson(API_BASE + "/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vault: id, name: newName })
      });
      this._migrateLocalStorage(id, newName);
      if (id === this.getCurrentVaultId()) {
        window.__currentVaultId = newName;
        if (window.__vaultConfig) {
          window.__vaultConfig.id = newName;
        }
        history.replaceState(null, "", "/?vault=" + encodeURIComponent(newName));
      }
      return this.listVaults();
    },
    async deleteVault(id) {
      await fetchJson(API_BASE + "/remove?vault=" + encodeURIComponent(id), {
        method: "DELETE"
      });
      const wasCurrentVault = id === this.getCurrentVaultId();
      await this.listVaults();
      return { wasCurrentVault };
    },
    deleteVaultSync(id) {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "DELETE",
        API_BASE + "/remove?vault=" + encodeURIComponent(id),
        false
      );
      xhr.send();
      return xhr.status < 400;
    },
    openVault(id) {
      localStorage.setItem("last-vault", id);
      const target = window.parent !== window ? window.parent : window;
      target.location.href = "/?vault=" + encodeURIComponent(id);
    },
    _setVaultTrust(vaultId2, trusted = true) {
      localStorage.setItem("enable-plugin-" + vaultId2, String(trusted));
    },
    _migrateLocalStorage(oldId, newId) {
      const pluginKey = "enable-plugin-";
      const oldVal = localStorage.getItem(pluginKey + oldId);
      if (oldVal !== null) {
        localStorage.setItem(pluginKey + newId, oldVal);
        localStorage.removeItem(pluginKey + oldId);
      }
      if (localStorage.getItem("last-vault") === oldId) {
        localStorage.setItem("last-vault", newId);
      }
    }
  };

  // packages/shim/src/util/base64.js
  function arrayBufferToBase64(buf) {
    const bytes = new Uint8Array(buf);
    let binary = "";
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }
  function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // packages/shim/src/util/proxy-block.js
  var PROXY_BLOCK_EVENT = "ignis:proxy-blocked";
  var BLOCK_CODES = /* @__PURE__ */ new Set([
    "private-host",
    "private-resolve",
    "dns",
    "allowlist",
    "disabled"
  ]);
  var REPORT_INTERVAL_MS = 60 * 1e3;
  var lastReported = /* @__PURE__ */ new Map();
  function isProxyBlock(body) {
    return !!(body && BLOCK_CODES.has(body.code));
  }
  function reportProxyBlock(body) {
    const now = Date.now();
    for (const [k, at] of lastReported) {
      if (now - at >= REPORT_INTERVAL_MS) {
        lastReported.delete(k);
      }
    }
    const key = `${body.code}:${body.host || ""}`;
    if (lastReported.has(key)) {
      return;
    }
    lastReported.set(key, now);
    console.warn(`[ignis] ${body.error}`);
    try {
      window.dispatchEvent(
        new CustomEvent(PROXY_BLOCK_EVENT, {
          detail: {
            code: body.code,
            host: body.host,
            address: body.address,
            message: body.error
          }
        })
      );
    } catch {
    }
  }

  // packages/shim/src/util/proxy.js
  async function proxyFetch({ url, method, headers, body, contentType }) {
    let encodedBody = null;
    let binary = false;
    if (body instanceof ArrayBuffer) {
      encodedBody = arrayBufferToBase64(body);
      binary = true;
    } else if (body instanceof Uint8Array) {
      encodedBody = arrayBufferToBase64(
        body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength)
      );
      binary = true;
    } else if (body != null) {
      encodedBody = body;
    }
    const payload = {
      url,
      method: method || "GET",
      headers: headers || {},
      body: encodedBody,
      binary
    };
    if (contentType !== void 0) {
      payload.contentType = contentType;
    }
    const nativeFetch = window.__originalFetch || fetch;
    const res = await nativeFetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err2 = await res.json().catch(() => ({}));
      if (isProxyBlock(err2)) {
        reportProxyBlock(err2);
      }
      throw new Error(err2.error || "Proxy request failed");
    }
    const result = await res.json();
    return {
      status: result.status,
      headers: result.headers,
      body: base64ToArrayBuffer(result.body)
    };
  }

  // packages/shim/src/electron/ipc-renderer.js
  var listeners = /* @__PURE__ */ new Map();
  var syncHandlers = {
    vault: () => window.__vaultConfig || { id: "default-vault", path: "/" },
    version: () => window.__obsidianVersion || "0.0.0",
    "is-dev": () => false,
    "file-url": () => "/vault-files/" + encodeURIComponent(window.__currentVaultId || "") + "/",
    "disable-update": () => true,
    update: () => "",
    "disable-gpu": () => false,
    frame: () => null,
    "set-icon": () => null,
    "get-icon": () => null,
    relaunch: () => {
      window.location.reload();
      return null;
    },
    starter: () => {
      showVaultManager();
      return null;
    },
    help: () => {
      window.open("https://help.obsidian.md/", "_blank");
      return null;
    },
    sandbox: () => null,
    "copy-asar": () => false,
    "check-update": () => null,
    "vault-list": () => {
      const result = {};
      for (const v of window.__vaultList || []) {
        result[v.id] = {
          path: "/" + v.id,
          ts: Date.now(),
          open: v.id === vaultService.getCurrentVaultId()
        };
      }
      return result;
    },
    "vault-open": (vaultPath, newWindow) => {
      const id = (vaultPath || "").replace(/^\/+/, "");
      const vault = (window.__vaultList || []).find((v) => v.id === id);
      if (!vault && id) {
        if (!vaultService.createVaultSync(id)) {
          return "Failed to create vault";
        }
      }
      vaultService.openVault(id);
      return true;
    },
    "vault-remove": (vaultPath) => {
      const id = (vaultPath || "").replace(/^\/+/, "");
      return vaultService.deleteVaultSync(id);
    },
    "vault-move": (oldPath, newPath) => {
      return "Moving vaults is not supported in the web version";
    },
    "vault-message": () => null,
    "get-default-vault-path": () => "/My Vault",
    "get-documents-path": () => "/",
    "desktop-dir": () => "/desktop",
    "documents-dir": () => "/documents",
    resources: () => ""
  };
  async function handleRequestUrl(requestId, request3) {
    try {
      const result = await proxyFetch({
        url: request3.url,
        method: request3.method,
        headers: request3.headers,
        body: request3.body,
        contentType: request3.contentType
      });
      ipcRenderer._emit(requestId, {
        status: result.status,
        headers: result.headers,
        body: result.body
      });
    } catch (e) {
      ipcRenderer._emit(requestId, {
        error: e.message
      });
    }
  }
  var ipcRenderer = {
    send(channel, ...args) {
      console.log("[shim:ipcRenderer] send:", channel, args);
      if (channel === "context-menu") {
        queueMicrotask(
          () => ipcRenderer._emit("context-menu", {
            webContentsId: 1,
            editFlags: { canCut: true, canCopy: true, canPaste: true }
          })
        );
        return;
      }
      if (channel === "request-url") {
        const [requestId, request3] = args;
        handleRequestUrl(requestId, request3);
        return;
      }
      if (channel === "print-to-pdf") {
        const iframe = window.__popupIframe;
        if (iframe) {
          setTimeout(() => {
            iframe.contentWindow.print();
            setTimeout(() => {
              iframe.contentWindow.close();
              ipcRenderer._emit("print-to-pdf", { success: true });
            }, 500);
          }, 200);
        } else {
          window.print();
          queueMicrotask(() => {
            ipcRenderer._emit("print-to-pdf", { success: true });
          });
        }
        return;
      }
    },
    sendSync(channel, ...args) {
      console.log("[shim:ipcRenderer] sendSync:", channel, args);
      if (syncHandlers[channel]) {
        return syncHandlers[channel](...args);
      }
      console.warn("[shim:ipcRenderer] Unhandled sendSync channel:", channel);
      return null;
    },
    on(channel, listener) {
      if (!listeners.has(channel)) {
        listeners.set(channel, []);
      }
      listeners.get(channel).push(listener);
      return ipcRenderer;
    },
    once(channel, listener) {
      const wrapped = (...args) => {
        ipcRenderer.removeListener(channel, wrapped);
        listener(...args);
      };
      return ipcRenderer.on(channel, wrapped);
    },
    removeListener(channel, listener) {
      const arr = listeners.get(channel);
      if (arr) {
        const idx = arr.indexOf(listener);
        if (idx >= 0) {
          arr.splice(idx, 1);
        }
      }
      return ipcRenderer;
    },
    removeAllListeners(channel) {
      if (channel) {
        listeners.delete(channel);
      } else {
        listeners.clear();
      }
      return ipcRenderer;
    },
    _emit(channel, ...args) {
      const arr = listeners.get(channel);
      if (arr) {
        for (const fn of arr) {
          fn({}, ...args);
        }
      }
    }
  };

  // packages/shim/src/electron/web-frame.js
  var currentZoom = 0;
  var webFrame = {
    getZoomLevel() {
      return currentZoom;
    },
    setZoomLevel(level) {
      currentZoom = level;
      const scale = Math.pow(1.2, level);
      document.body.style.zoom = scale;
    },
    getZoomFactor() {
      return Math.pow(1.2, currentZoom);
    },
    setZoomFactor(factor) {
      currentZoom = Math.log(factor) / Math.log(1.2);
      document.body.style.zoom = factor;
    }
  };

  // packages/shim/src/electron/remote/native-clipboard.js
  var proto = typeof Clipboard !== "undefined" ? Clipboard.prototype : null;
  function getClipboard() {
    const clip = typeof navigator !== "undefined" ? navigator.clipboard : void 0;
    if (!proto || !clip) {
      return null;
    }
    return {
      writeText: (text) => proto.writeText.call(clip, text),
      write: (items) => proto.write.call(clip, items),
      read: () => proto.read.call(clip)
    };
  }

  // packages/shim/src/util/clipboard.js
  function execCommandCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } finally {
      document.body.removeChild(ta);
    }
    return ok;
  }
  function execCommandCopyHTML(html, text) {
    const listener = (e) => {
      e.preventDefault();
      e.clipboardData.setData("text/html", html);
      e.clipboardData.setData("text/plain", text);
    };
    document.addEventListener("copy", listener, true);
    try {
      return execCommandCopy(text);
    } finally {
      document.removeEventListener("copy", listener, true);
    }
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      try {
        if (execCommandCopy(text)) {
          resolve();
        } else {
          reject(new Error("copy command rejected"));
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  // packages/shim/src/util/insecure-api.js
  var INSECURE_API_EVENT = "ignis:insecure-api";
  var warned = /* @__PURE__ */ new Set();
  function reportInsecureApi(api, { passive = false } = {}) {
    if (!warned.has(api)) {
      warned.add(api);
      console.warn(
        `[ignis] ${api} is disabled on insecure origins; serve over HTTPS to enable it`
      );
    }
    if (passive) {
      return;
    }
    try {
      window.dispatchEvent(
        new CustomEvent(INSECURE_API_EVENT, { detail: { api } })
      );
    } catch {
    }
  }

  // packages/shim/src/electron/remote/clipboard.js
  var clipboardShim = {
    readText() {
      return "";
    },
    writeText(text) {
      const clip = getClipboard();
      if (!clip) {
        try {
          if (!execCommandCopy(text)) {
            console.warn("[shim:clipboard] execCommand copy failed");
          }
        } catch (e) {
          console.warn("[shim:clipboard] execCommand copy failed:", e);
        }
        return;
      }
      clip.writeText(text).catch((e) => {
        console.warn("[shim:clipboard] writeText failed:", e);
      });
    },
    readHTML() {
      return "";
    },
    writeHTML(html) {
      const clip = getClipboard();
      if (!clip) {
        try {
          if (!execCommandCopyHTML(html, html)) {
            console.warn("[shim:clipboard] execCommand copy failed");
          }
        } catch (e) {
          console.warn("[shim:clipboard] execCommand copy failed:", e);
        }
        return;
      }
      clip.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" })
        })
      ]).catch((e) => {
        console.warn("[shim:clipboard] writeHTML failed:", e);
      });
    },
    readImage() {
      return { isEmpty: () => true, toPNG: () => new Uint8Array(0) };
    },
    writeImage(image) {
      if (!image || image.isEmpty()) {
        return;
      }
      const clip = getClipboard();
      if (!clip) {
        reportInsecureApi("clipboard.writeImage");
        return;
      }
      const pngData = image.toPNG();
      if (!pngData || pngData.length === 0) {
        return;
      }
      const blob = new Blob([pngData], { type: "image/png" });
      clip.write([new ClipboardItem({ "image/png": blob })]).catch((e) => {
        console.warn("[shim:clipboard] writeImage failed:", e);
      });
    },
    has(format) {
      return false;
    },
    read(format) {
      return "";
    },
    clear() {
      const clip = getClipboard();
      if (!clip) {
        reportInsecureApi("clipboard.clear", { passive: true });
        return;
      }
      clip.writeText("").catch(() => {
      });
    }
  };

  // packages/shim/src/electron/remote/shell.js
  var shellShim = {
    openExternal(url) {
      window.open(url, "_blank");
      return Promise.resolve();
    },
    openPath(filePath) {
      console.log("[shim:shell] openPath (stub):", filePath);
      return Promise.resolve("");
    },
    showItemInFolder(filePath) {
      console.log("[shim:shell] showItemInFolder (stub):", filePath);
    }
  };

  // packages/shim/src/util/path.js
  function normalize(p) {
    return (p || "").replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
  }

  // packages/shim/src/fs/input-cache.js
  var MAX_SIZE = 200 * 1024 * 1024;
  var TTL_MS = 5 * 60 * 1e3;
  var cache = /* @__PURE__ */ new Map();
  var currentSize = 0;
  function evictExpired() {
    const now = Date.now();
    for (const [key, entry] of cache) {
      if (now - entry.createdAt > TTL_MS) {
        currentSize -= entry.size;
        cache.delete(key);
      }
    }
  }
  function evictOldest() {
    let oldest = null;
    let oldestTime = Infinity;
    for (const [key, entry] of cache) {
      if (entry.createdAt < oldestTime) {
        oldest = key;
        oldestTime = entry.createdAt;
      }
    }
    if (oldest) {
      currentSize -= cache.get(oldest).size;
      cache.delete(oldest);
    }
  }
  function inputCacheGet(path) {
    const norm = normalize(path);
    const entry = cache.get(norm);
    if (!entry) {
      return null;
    }
    if (Date.now() - entry.createdAt > TTL_MS) {
      currentSize -= entry.size;
      cache.delete(norm);
      return null;
    }
    return entry.data;
  }
  function inputCacheSet(path, data) {
    const norm = normalize(path);
    const size = data ? data.length || data.byteLength || 0 : 0;
    if (cache.has(norm)) {
      currentSize -= cache.get(norm).size;
      cache.delete(norm);
    }
    evictExpired();
    while (currentSize + size > MAX_SIZE && cache.size > 0) {
      evictOldest();
    }
    cache.set(norm, { data, size, createdAt: Date.now() });
    currentSize += size;
  }
  function inputCacheDelete(path) {
    const norm = normalize(path);
    const entry = cache.get(norm);
    if (entry) {
      currentSize -= entry.size;
      cache.delete(norm);
    }
  }
  function setInputCacheLimits({ maxSize, ttlMs }) {
    if (Number.isFinite(maxSize)) {
      MAX_SIZE = maxSize;
      while (currentSize > MAX_SIZE && cache.size > 0) {
        evictOldest();
      }
    }
    if (Number.isFinite(ttlMs)) {
      TTL_MS = ttlMs;
    }
  }
  function isInputCachePath(path) {
    const norm = normalize(path);
    return norm.startsWith(".obsidian/imports/");
  }

  // packages/shim/src/electron/remote/dialog.js
  var IMPORTS_DIR = ".obsidian/imports";
  var STAGED_TTL_MS = 12e4;
  var staged = { paths: [], fingerprint: null, timestamp: 0 };
  function getCallerFingerprint() {
    const stack = new Error().stack || "";
    const frames = stack.split("\n").filter((l) => !l.includes("shim-loader") && !l.includes("dialog.js"));
    return frames.slice(0, 3).join("|");
  }
  function clearStagedFiles() {
    if (staged.paths.length === 0)
      return;
    console.log("[shim:dialog] Clearing expired staged files");
    for (const p of staged.paths) {
      inputCacheDelete(p.replace(/^\//, ""));
    }
    staged = { paths: [], fingerprint: null, timestamp: 0 };
  }
  function buildAcceptString(filters) {
    if (!filters || filters.length === 0) {
      return "";
    }
    const extensions = filters.flatMap((f) => f.extensions || []);
    if (extensions.includes("*")) {
      return "";
    }
    return extensions.map((ext) => "." + ext).join(",");
  }
  function pickFiles(accept, multiple) {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = multiple;
      input.style.display = "none";
      if (accept) {
        input.accept = accept;
      }
      input.addEventListener("change", () => {
        const files = Array.from(input.files || []);
        input.remove();
        resolve(files);
      });
      input.addEventListener("cancel", () => {
        input.remove();
        resolve([]);
      });
      document.body.appendChild(input);
      input.click();
    });
  }
  async function cacheToImports(file) {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const targetPath = IMPORTS_DIR + "/" + file.name;
    inputCacheSet(targetPath, bytes);
    return "/" + targetPath;
  }
  async function startWorkaroundFlow(options, fingerprint) {
    const properties = (options == null ? void 0 : options.properties) || [];
    const multiple = properties.includes("multiSelections");
    const accept = buildAcceptString(options == null ? void 0 : options.filters);
    const files = await pickFiles(accept, multiple);
    if (files.length === 0) {
      return;
    }
    const paths = [];
    for (const file of files) {
      const vaultPath = await cacheToImports(file);
      paths.push(vaultPath);
    }
    staged = { paths, fingerprint, timestamp: Date.now() };
    const names = paths.map((p) => p.split("/").pop()).join(", ");
    console.log("[shim:dialog] Files staged for caller:", fingerprint);
    await showMessageDialog(
      "Files Ready",
      `Staged: ${names}

Please retry the action that brought you here. The files will be provided automatically.`
    );
  }
  var dialogShim = {
    async showOpenDialog(browserWindow, options) {
      if (typeof browserWindow === "object" && !options) {
        options = browserWindow;
      }
      const properties = (options == null ? void 0 : options.properties) || [];
      const multiple = properties.includes("multiSelections");
      const accept = buildAcceptString(options == null ? void 0 : options.filters);
      console.log("[shim:dialog] showOpenDialog  -  opening browser file picker");
      const files = await pickFiles(accept, multiple);
      if (files.length === 0) {
        return { canceled: true, filePaths: [] };
      }
      const filePaths = [];
      for (const file of files) {
        const vaultPath = await cacheToImports(file);
        filePaths.push(vaultPath);
      }
      console.log("[shim:dialog] showOpenDialog  -  cached:", filePaths);
      return { canceled: false, filePaths };
    },
    showOpenDialogSync(browserWindow, options) {
      if (typeof browserWindow === "object" && !options) {
        options = browserWindow;
      }
      if (staged.paths.length > 0) {
        const elapsed = Date.now() - staged.timestamp;
        const fingerprint = getCallerFingerprint();
        const fingerprintMatch = fingerprint === staged.fingerprint;
        const expired = elapsed > STAGED_TTL_MS;
        if (expired) {
          console.warn("[shim:dialog] Staged files expired after", elapsed, "ms");
          clearStagedFiles();
        } else if (!fingerprintMatch) {
          console.warn(
            "[shim:dialog] Staged files caller mismatch  -  ignoring",
            "\n  expected:",
            staged.fingerprint,
            "\n  got:",
            fingerprint
          );
        } else {
          const paths = staged.paths;
          staged = { paths: [], fingerprint: null, timestamp: 0 };
          console.log(
            "[shim:dialog] showOpenDialogSync  -  returning staged files:",
            paths
          );
          return paths;
        }
      }
      console.warn(
        "[shim:dialog] showOpenDialogSync requires workaround in browser context"
      );
      const callerFingerprint = getCallerFingerprint();
      showConfirmDialog(
        "Feature Not Available",
        "This action requires a native file picker which is not available in the browser.",
        "A workaround is available: select your files first, then retry the action. They will be provided automatically.\n\nNote: individual files must be under 200 MB.",
        "Select Files"
      ).then((confirmed) => {
        if (confirmed) {
          startWorkaroundFlow(options, callerFingerprint);
        }
      });
      return void 0;
    },
    async showSaveDialog(browserWindow, options) {
      var _a;
      if (typeof browserWindow === "object" && !options) {
        options = browserWindow;
      }
      const defaultName = ((_a = options == null ? void 0 : options.defaultPath) == null ? void 0 : _a.split(/[/\\]/).pop()) || "download";
      const name = await showPromptDialog(
        "Save File",
        "Save as:",
        "filename",
        defaultName,
        "Save"
      );
      if (!name) {
        return { canceled: true, filePath: void 0 };
      }
      return { canceled: false, filePath: "/downloads/" + name };
    },
    async showMessageBox(browserWindow, options) {
      if (typeof browserWindow === "object" && !options) {
        options = browserWindow;
      }
      console.log("[shim:dialog] showMessageBox:", options);
      const message = options.message || "";
      const detail = options.detail || "";
      const buttons = options.buttons || ["OK"];
      const fullMessage = message + (detail ? "\n\n" + detail : "");
      if (buttons.length <= 1) {
        await showMessageDialog(options.title || "Message", fullMessage);
        return { response: 0, checkboxChecked: false };
      }
      const result = await showConfirmDialog(
        options.title || "Confirm",
        message,
        detail,
        buttons[0]
      );
      return {
        response: result ? 0 : 1,
        checkboxChecked: false
      };
    },
    showErrorBox(title, content) {
      console.error("[shim:dialog] Error:", title, content);
      showMessageDialog(title, content);
    }
  };

  // packages/shim/src/electron/remote/menu.js
  var menuShim = class _menuShim {
    constructor() {
      this.items = [];
    }
    static buildFromTemplate(template) {
      const menu = new _menuShim();
      menu.items = (template || []).map((item) => new menuItemShim(item));
      return menu;
    }
    static setApplicationMenu(menu) {
      console.log("[shim:Menu] setApplicationMenu (stub)");
    }
    static getApplicationMenu() {
      return null;
    }
    popup(options) {
      console.log("[shim:Menu] popup (stub)", options);
    }
    append(menuItem) {
      this.items.push(menuItem);
    }
    insert(pos, menuItem) {
      this.items.splice(pos, 0, menuItem);
    }
    closePopup() {
    }
    // If the appearance guard in native-menu-guard.js ever fails to block the native-menu path, warn instead of throwing.
    on(channel, listener) {
      console.warn(
        `[shim:Menu] Menu.on(${channel}) called; native-menu path escaped the guard.`
      );
      return this;
    }
    off(channel, listener) {
      return this;
    }
  };
  var menuItemShim = class {
    constructor(options = {}) {
      this.label = options.label || "";
      this.type = options.type || "normal";
      this.click = options.click || null;
      this.role = options.role || null;
      this.accelerator = options.accelerator || "";
      this.enabled = options.enabled !== false;
      this.visible = options.visible !== false;
      this.checked = !!options.checked;
      this.submenu = options.submenu ? menuShim.buildFromTemplate(
        Array.isArray(options.submenu) ? options.submenu : []
      ) : null;
      this.id = options.id || "";
    }
  };

  // packages/shim/src/electron/remote/app.js
  var appShim = {
    getPath(name) {
      const paths = {
        userData: "/.obsidian",
        home: "/",
        documents: "/documents",
        desktop: "/desktop",
        temp: "/tmp",
        appData: "/.obsidian"
      };
      return paths[name] || "/";
    },
    getVersion() {
      return window.__obsidianVersion || "0.0.0";
    },
    getName() {
      return "Obsidian";
    },
    getLocale() {
      return navigator.language || "en-US";
    },
    isPackaged: true,
    quit() {
      console.log("[shim:app] quit (stub)");
    },
    relaunch() {
      window.location.reload();
    },
    whenReady() {
      return Promise.resolve();
    },
    on() {
    },
    once() {
    },
    removeListener() {
    }
  };

  // packages/shim/src/electron/remote/window.js
  var currentWindowState = {
    title: "Obsidian",
    isMaximized: false,
    isMinimized: false,
    isFullScreen: false,
    isAlwaysOnTop: false,
    bounds: { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight },
    focusTime: Date.now()
  };
  var currentWindow = {
    isMaximized: () => currentWindowState.isMaximized,
    isMinimized: () => currentWindowState.isMinimized,
    isFullScreen: () => !!document.fullscreenElement,
    isAlwaysOnTop: () => currentWindowState.isAlwaysOnTop,
    isFocused: () => document.hasFocus(),
    isVisible: () => true,
    isDestroyed: () => false,
    minimize() {
      console.log("[shim:window] minimize (stub)");
    },
    maximize() {
      currentWindowState.isMaximized = true;
    },
    unmaximize() {
      currentWindowState.isMaximized = false;
    },
    restore() {
      currentWindowState.isMinimized = false;
    },
    close() {
      console.log("[shim:window] close (stub)");
    },
    focus() {
      window.focus();
    },
    show() {
    },
    hide() {
    },
    setTitle(title) {
      currentWindowState.title = title;
      document.title = title;
    },
    getTitle() {
      return currentWindowState.title;
    },
    setAlwaysOnTop(flag) {
      currentWindowState.isAlwaysOnTop = flag;
    },
    setFullScreen(flag) {
      var _a, _b, _c;
      if (flag) {
        (_b = (_a = document.documentElement).requestFullscreen) == null ? void 0 : _b.call(_a);
      } else {
        (_c = document.exitFullscreen) == null ? void 0 : _c.call(document);
      }
    },
    getBounds() {
      return {
        x: window.screenX,
        y: window.screenY,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    setBounds(bounds) {
      console.log("[shim:window] setBounds (stub):", bounds);
    },
    setSize(width, height) {
    },
    setPosition(x, y) {
    },
    center() {
    },
    setTrafficLightPosition() {
    },
    setWindowButtonPosition() {
    },
    get webContents() {
      return webContentsShim._current();
    },
    get menuBarVisible() {
      return false;
    },
    set menuBarVisible(v) {
    },
    get loaded() {
      return true;
    },
    set loaded(v) {
    },
    get focusTime() {
      return currentWindowState.focusTime;
    },
    set focusTime(v) {
      currentWindowState.focusTime = v;
    },
    on(event, handler) {
      if (event === "focus") {
        window.addEventListener("focus", handler);
      } else if (event === "blur") {
        window.addEventListener("blur", handler);
      } else if (event === "resize") {
        window.addEventListener("resize", handler);
      }
      return currentWindow;
    },
    once(event, handler) {
      if (event === "focus") {
        window.addEventListener("focus", handler, { once: true });
      }
      return currentWindow;
    },
    removeListener() {
      return currentWindow;
    },
    removeAllListeners() {
      return currentWindow;
    }
  };
  var currentWebContents = {
    id: 1,
    _zoomLevel: 0,
    get zoomLevel() {
      return this._zoomLevel;
    },
    set zoomLevel(v) {
      this._zoomLevel = v;
    },
    executeJavaScript(code) {
      try {
        return Promise.resolve(eval(code));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    getZoomFactor() {
      return Math.pow(1.2, this._zoomLevel);
    },
    getZoomLevel() {
      return this._zoomLevel;
    },
    setZoomLevel(v) {
      this._zoomLevel = v;
    },
    isDevToolsOpened() {
      return false;
    },
    openDevTools() {
    },
    setWindowOpenHandler(handler) {
      this._windowOpenHandler = handler;
    },
    printToPDF(options) {
      return new Promise((resolve) => {
        window.print();
        resolve(Buffer.from([]));
      });
    },
    capturePage(rect) {
      console.log("[shim:webContents] capturePage (stub)");
      return Promise.resolve({
        toPNG: () => new Uint8Array(0),
        toJPEG: () => new Uint8Array(0)
      });
    },
    undo() {
    },
    redo() {
    },
    cut() {
      document.execCommand("cut");
    },
    copy() {
      document.execCommand("copy");
    },
    paste() {
      const clip = getClipboard();
      if (!clip) {
        reportInsecureApi("clipboard paste");
        return;
      }
      clip.read().then(async (items) => {
        const dt = new DataTransfer();
        for (const item of items) {
          for (const type2 of item.types) {
            const blob = await item.getType(type2);
            if (type2.startsWith("text/")) {
              const text = await blob.text();
              dt.items.add(text, type2);
            } else {
              const ext = type2.split("/")[1] || "bin";
              dt.items.add(
                new File([blob], `pasted-image.${ext}`, { type: type2 })
              );
            }
          }
        }
        const pasteEvent = new ClipboardEvent("paste", {
          bubbles: true,
          cancelable: true,
          clipboardData: dt
        });
        const target = document.activeElement || document.body;
        target.dispatchEvent(pasteEvent);
      }).catch((e) => {
        console.warn("[shim:webContents] paste failed:", e);
      });
    },
    pasteAndMatchStyle() {
      const clip = getClipboard();
      if (!clip) {
        reportInsecureApi("clipboard paste");
        return;
      }
      clip.read().then(async (items) => {
        for (const item of items) {
          if (item.types.includes("text/plain")) {
            const blob = await item.getType("text/plain");
            const text = await blob.text();
            document.execCommand("insertText", false, text);
            return;
          }
        }
      }).catch((e) => {
        console.warn("[shim:webContents] pasteAndMatchStyle failed:", e);
      });
    },
    replaceMisspelling(word) {
    },
    session: {
      availableSpellCheckerLanguages: [],
      setSpellCheckerLanguages(langs) {
      },
      addWordToSpellCheckerDictionary(word) {
      }
    },
    setSpellCheckerLanguages(langs) {
    },
    on(event, handler) {
      return currentWebContents;
    },
    once(event, handler) {
      return currentWebContents;
    },
    removeListener() {
      return currentWebContents;
    },
    get isSecured() {
      return true;
    },
    set isSecured(v) {
    }
  };
  var _popupWindow = null;
  var _popupWebContents = null;
  function registerPopupWindow() {
    _popupWebContents = {
      id: 2,
      _zoomLevel: 0,
      getZoomFactor() {
        return 1;
      },
      getZoomLevel() {
        return 0;
      },
      setZoomLevel() {
      },
      printToPDF(options) {
        return Promise.resolve(Buffer.from([]));
      },
      executeJavaScript(code) {
        try {
          return Promise.resolve(eval(code));
        } catch (e) {
          return Promise.reject(e);
        }
      },
      on() {
        return _popupWebContents;
      },
      once() {
        return _popupWebContents;
      },
      removeListener() {
        return _popupWebContents;
      },
      isDestroyed() {
        return false;
      },
      isFocused() {
        return false;
      }
    };
    _popupWindow = {
      id: 2,
      webContents: _popupWebContents,
      isDestroyed() {
        return false;
      },
      isFocused() {
        return false;
      },
      isVisible() {
        return false;
      },
      close() {
        _popupWindow = null;
        _popupWebContents = null;
      },
      destroy() {
        _popupWindow = null;
        _popupWebContents = null;
      },
      on() {
        return _popupWindow;
      },
      once() {
        return _popupWindow;
      },
      removeListener() {
        return _popupWindow;
      }
    };
    return _popupWindow;
  }
  function unregisterPopupWindow() {
    _popupWindow = null;
    _popupWebContents = null;
  }
  var windowShim = {
    _current: () => currentWindow,
    getFocusedWindow() {
      return currentWindow;
    },
    getAllWindows() {
      const wins = [currentWindow];
      if (_popupWindow) {
        wins.push(_popupWindow);
      }
      return wins;
    },
    fromId(id) {
      if (id === currentWindow.id) {
        return currentWindow;
      }
      if (_popupWindow && id === _popupWindow.id) {
        return _popupWindow;
      }
      return null;
    },
    fromWebContents(wc) {
      if (wc === currentWebContents) {
        return currentWindow;
      }
      if (_popupWebContents && wc === _popupWebContents) {
        return _popupWindow;
      }
      return null;
    }
  };
  var webContentsShim = {
    _current: () => currentWebContents,
    fromId(id) {
      if (id === currentWebContents.id) {
        return currentWebContents;
      }
      if (_popupWebContents && id === _popupWebContents.id) {
        return _popupWebContents;
      }
      return null;
    },
    getAllWebContents() {
      const wcs = [currentWebContents];
      if (_popupWebContents) {
        wcs.push(_popupWebContents);
      }
      return wcs;
    }
  };

  // packages/shim/src/electron/remote/theme.js
  var listeners2 = [];
  var darkQuery = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  if (darkQuery == null ? void 0 : darkQuery.addEventListener) {
    darkQuery.addEventListener("change", () => {
      for (const fn of listeners2) {
        fn();
      }
    });
  }
  var themeShim = {
    get shouldUseDarkColors() {
      return darkQuery ? darkQuery.matches : true;
    },
    get themeSource() {
      return "system";
    },
    set themeSource(val) {
    },
    on(event, callback) {
      if (event === "updated") {
        listeners2.push(callback);
      }
      return themeShim;
    },
    once(event, callback) {
      if (event === "updated") {
        const wrapped = () => {
          const idx = listeners2.indexOf(wrapped);
          if (idx >= 0) {
            listeners2.splice(idx, 1);
          }
          callback();
        };
        listeners2.push(wrapped);
      }
      return themeShim;
    },
    removeListener(event, callback) {
      const idx = listeners2.indexOf(callback);
      if (idx >= 0) {
        listeners2.splice(idx, 1);
      }
      return themeShim;
    },
    removeAllListeners() {
      listeners2.length = 0;
      return themeShim;
    }
  };

  // packages/shim/src/electron/remote/session.js
  var sessionShim = {
    defaultSession: {
      clearCache() {
        return Promise.resolve();
      },
      clearStorageData() {
        return Promise.resolve();
      },
      setSpellCheckerLanguages(langs) {
      },
      getSpellCheckerLanguages() {
        return [];
      },
      on() {
      },
      once() {
      },
      removeListener() {
      }
    }
  };

  // packages/shim/src/electron/remote/system-preferences.js
  var systemPreferencesShim = {
    getAccentColor() {
      return "0078d4";
    },
    isAeroGlassEnabled() {
      return false;
    },
    getMediaAccessStatus(mediaType) {
      return "granted";
    },
    askForMediaAccess(mediaType) {
      return Promise.resolve(true);
    },
    on() {
    },
    once() {
    },
    removeListener() {
    }
  };

  // packages/shim/src/electron/remote/screen.js
  var screenShim = {
    getPrimaryDisplay() {
      return {
        workAreaSize: {
          width: window.screen.availWidth,
          height: window.screen.availHeight
        },
        size: { width: window.screen.width, height: window.screen.height },
        scaleFactor: window.devicePixelRatio || 1,
        bounds: {
          x: 0,
          y: 0,
          width: window.screen.width,
          height: window.screen.height
        },
        workArea: {
          x: 0,
          y: 0,
          width: window.screen.availWidth,
          height: window.screen.availHeight
        }
      };
    },
    getAllDisplays() {
      return [screenShim.getPrimaryDisplay()];
    },
    getDisplayNearestPoint(point) {
      return screenShim.getPrimaryDisplay();
    },
    getCursorScreenPoint() {
      return { x: 0, y: 0 };
    },
    on() {
    },
    once() {
    },
    removeListener() {
    }
  };

  // packages/shim/src/electron/remote/native-image.js
  function createImage(buffer, mimeType) {
    return {
      _buffer: buffer,
      _mimeType: mimeType || "image/png",
      isEmpty() {
        return !buffer || buffer.length === 0;
      },
      getSize() {
        return { width: 0, height: 0 };
      },
      toPNG() {
        return buffer || new Uint8Array(0);
      },
      toJPEG(quality) {
        return buffer || new Uint8Array(0);
      },
      toDataURL() {
        if (!buffer || buffer.length === 0) {
          return "";
        }
        const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return `data:${this._mimeType};base64,${btoa(binary)}`;
      },
      toBitmap() {
        return buffer || new Uint8Array(0);
      },
      getBitmap() {
        return buffer || new Uint8Array(0);
      }
    };
  }
  var nativeImageShim = {
    createFromBuffer(buffer, options) {
      return createImage(buffer, options == null ? void 0 : options.mimeType);
    },
    createFromPath(filePath) {
      return createImage(new Uint8Array(0));
    },
    createEmpty() {
      return createImage(new Uint8Array(0));
    },
    createFromDataURL(dataURL) {
      if (!dataURL || !dataURL.startsWith("data:")) {
        return createImage(new Uint8Array(0));
      }
      const parts = dataURL.split(",");
      const mimeMatch = parts[0].match(/data:([^;]+)/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
      try {
        const binary = atob(parts[1]);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return createImage(bytes, mimeType);
      } catch {
        return createImage(new Uint8Array(0));
      }
    }
  };

  // packages/shim/src/electron/remote/notification.js
  var notificationShim = class {
    constructor(options = {}) {
      this.title = options.title || "";
      this.body = options.body || "";
      this.silent = options.silent || false;
      this._handlers = {};
    }
    show() {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(this.title, { body: this.body, silent: this.silent });
      } else if ("Notification" in window && Notification.permission !== "denied") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification(this.title, {
              body: this.body,
              silent: this.silent
            });
          }
        });
      }
    }
    close() {
    }
    on(event, handler) {
      this._handlers[event] = handler;
      return this;
    }
    static isSupported() {
      return "Notification" in window;
    }
  };

  // packages/shim/src/electron/remote/index.js
  var remoteShim = {
    clipboard: clipboardShim,
    shell: shellShim,
    dialog: dialogShim,
    Menu: menuShim,
    MenuItem: menuItemShim,
    app: appShim,
    BrowserWindow: windowShim,
    nativeTheme: themeShim,
    session: sessionShim,
    systemPreferences: systemPreferencesShim,
    screen: screenShim,
    nativeImage: nativeImageShim,
    Notification: notificationShim,
    safeStorage: {
      isEncryptionAvailable() {
        return false;
      },
      encryptString(plainText) {
        return Buffer.from(plainText);
      },
      decryptString(encrypted) {
        return encrypted.toString();
      }
    },
    getCurrentWindow() {
      return windowShim._current();
    },
    webContents: webContentsShim,
    getCurrentWebContents() {
      return webContentsShim._current();
    }
  };

  // packages/shim/src/electron/index.js
  var electronShim = {
    ipcRenderer,
    webFrame,
    remote: remoteShim,
    nativeImage: nativeImageShim,
    clipboard: clipboardShim,
    safeStorage: {
      isEncryptionAvailable() {
        return false;
      },
      encryptString(plainText) {
        return Buffer.from(plainText);
      },
      decryptString(encrypted) {
        return encrypted.toString();
      }
    },
    webUtils: {
      getPathForFile(file) {
        return "";
      }
    },
    deprecate: {
      function(fn, name) {
        return fn;
      },
      event(emitter, name) {
      },
      removeFunction(fn, name) {
        return fn;
      },
      log(message) {
        console.log("[electron:deprecate]", message);
      },
      warn(oldName, newName) {
      },
      promisify(fn) {
        return fn;
      },
      renameFunction(fn, newName) {
        return fn;
      }
    }
  };

  // packages/shim/src/fs/metadata-cache.js
  var MetadataCache = class {
    constructor() {
      this._entries = /* @__PURE__ */ new Map();
    }
    // Populate from a server-provided tree object
    // tree shape: { "relative/path": { type, size, mtime, ctime }, ... }
    populate(tree) {
      this._entries.clear();
      for (const [path, meta] of Object.entries(tree)) {
        this._entries.set(this._normalize(path), meta);
      }
    }
    has(path) {
      return this._entries.has(this._normalize(path));
    }
    get(path) {
      return this._entries.get(this._normalize(path)) || null;
    }
    set(path, meta) {
      this._entries.set(this._normalize(path), meta);
    }
    delete(path) {
      this._entries.delete(this._normalize(path));
    }
    // Rename: move metadata from old path to new path (and children if directory)
    rename(oldPath, newPath) {
      const oldNorm = this._normalize(oldPath);
      const newNorm = this._normalize(newPath);
      const meta = this._entries.get(oldNorm);
      if (meta) {
        this._entries.delete(oldNorm);
        this._entries.set(newNorm, meta);
      }
      const prefix = oldNorm + "/";
      for (const [key, val] of this._entries) {
        if (key.startsWith(prefix)) {
          const newKey = newNorm + "/" + key.slice(prefix.length);
          this._entries.delete(key);
          this._entries.set(newKey, val);
        }
      }
    }
    // List direct children of a directory path
    readdir(dirPath) {
      const norm = this._normalize(dirPath);
      const prefix = norm === "" ? "" : norm + "/";
      const results = [];
      const seen = /* @__PURE__ */ new Set();
      for (const key of this._entries.keys()) {
        if (prefix === "" || key.startsWith(prefix)) {
          const rest = key.slice(prefix.length);
          const slashIdx = rest.indexOf("/");
          const childName = slashIdx >= 0 ? rest.slice(0, slashIdx) : rest;
          if (childName && !seen.has(childName)) {
            seen.add(childName);
            const childMeta = this._entries.get(prefix + childName);
            results.push({
              name: childName,
              type: (childMeta == null ? void 0 : childMeta.type) || (slashIdx >= 0 ? "directory" : "file")
            });
          }
        }
      }
      return results;
    }
    get size() {
      return this._entries.size;
    }
    // Normalized keys of every entry, for callers that diff the cache against a fresh tree.
    keys() {
      return [...this._entries.keys()];
    }
    toStat(path) {
      const meta = this.get(path);
      if (!meta) {
        return null;
      }
      return {
        size: meta.size || 0,
        mtimeMs: meta.mtime || 0,
        ctimeMs: meta.ctime || 0,
        atimeMs: meta.mtime || 0,
        birthtimeMs: meta.ctime || 0,
        mtime: new Date(meta.mtime || 0),
        ctime: new Date(meta.ctime || 0),
        atime: new Date(meta.mtime || 0),
        birthtime: new Date(meta.ctime || 0),
        isFile: () => meta.type === "file",
        isDirectory: () => meta.type === "directory",
        isSymbolicLink: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isFIFO: () => false,
        isSocket: () => false
      };
    }
    _normalize(p) {
      return (p || "").replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
    }
  };

  // packages/shim/src/fs/content-cache.js
  var DEFAULT_MAX_SIZE = 50 * 1024 * 1024;
  var ContentCache = class {
    constructor(maxSize = DEFAULT_MAX_SIZE) {
      this._cache = /* @__PURE__ */ new Map();
      this._currentSize = 0;
      this._maxSize = maxSize;
    }
    setMaxSize(maxSize) {
      this._maxSize = maxSize;
      while (this._currentSize > this._maxSize && this._cache.size > 0) {
        this._evictOne();
      }
    }
    has(path) {
      return this._cache.has(this._normalize(path));
    }
    get(path) {
      const entry = this._cache.get(this._normalize(path));
      if (entry) {
        entry.accessedAt = Date.now();
        return entry.data;
      }
      return null;
    }
    set(path, data) {
      const norm = this._normalize(path);
      const size = data ? data.length || data.byteLength || 0 : 0;
      if (this._cache.has(norm)) {
        this._currentSize -= this._cache.get(norm).size;
      }
      while (this._currentSize + size > this._maxSize && this._cache.size > 0) {
        this._evictOne();
      }
      this._cache.set(norm, { data, size, accessedAt: Date.now() });
      this._currentSize += size;
    }
    delete(path) {
      const norm = this._normalize(path);
      const entry = this._cache.get(norm);
      if (entry) {
        this._currentSize -= entry.size;
        this._cache.delete(norm);
      }
    }
    // Invalidate a path (remove from cache so next read fetches fresh)
    invalidate(path) {
      this.delete(path);
    }
    clear() {
      this._cache.clear();
      this._currentSize = 0;
    }
    get size() {
      return this._cache.size;
    }
    get currentBytes() {
      return this._currentSize;
    }
    get maxSize() {
      return this._maxSize;
    }
    _evictOne() {
      let oldest = null;
      let oldestTime = Infinity;
      for (const [key, entry] of this._cache) {
        if (entry.accessedAt < oldestTime) {
          oldest = key;
          oldestTime = entry.accessedAt;
        }
      }
      if (oldest) {
        this.delete(oldest);
      }
    }
    _normalize(p) {
      return (p || "").replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
    }
  };

  // packages/shim/src/fs/transport.js
  var API_BASE2 = "/api/fs";
  function normPath(p) {
    return (p || "").replace(/^\/+/, "");
  }
  function uint8ToBase64(bytes) {
    let binary = "";
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }
  function vaultId() {
    return window.__currentVaultId || "";
  }
  var KEEPALIVE_MAX_BYTES = 64 * 1024;
  function withinKeepaliveCap(body) {
    if (!body) {
      return true;
    }
    return new TextEncoder().encode(body).length <= KEEPALIVE_MAX_BYTES;
  }
  async function request(method, endpoint, params = {}, headers) {
    const url = new URL(API_BASE2 + endpoint, window.location.origin);
    const options = { method };
    if (method === "GET" || method === "DELETE") {
      if (vaultId()) {
        url.searchParams.set("vault", vaultId());
      }
      for (const [key, val] of Object.entries(params)) {
        url.searchParams.set(key, val);
      }
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify({ vault: vaultId(), ...params });
    }
    if (headers) {
      options.headers = { ...options.headers, ...headers };
    }
    if (method !== "GET" && withinKeepaliveCap(options.body)) {
      options.keepalive = true;
    }
    const res = await fetch(url.toString(), options);
    if (!res.ok && res.status !== 304) {
      const err2 = await res.json().catch(() => ({ error: res.statusText, code: "UNKNOWN" }));
      const e = new Error(err2.error || res.statusText);
      e.code = err2.code || "UNKNOWN";
      throw e;
    }
    return res;
  }
  async function requestJson(method, endpoint, params = {}) {
    const res = await request(method, endpoint, params);
    return res.json();
  }
  function requestSync(method, endpoint, params = {}) {
    const url = new URL(API_BASE2 + endpoint, window.location.origin);
    if (method === "GET" || method === "DELETE") {
      if (vaultId()) {
        url.searchParams.set("vault", vaultId());
      }
      for (const [key, val] of Object.entries(params)) {
        url.searchParams.set(key, val);
      }
    }
    const xhr = new XMLHttpRequest();
    xhr.open(method, url.toString(), false);
    if (method !== "GET" && method !== "DELETE") {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({ vault: vaultId(), ...params }));
    } else {
      xhr.send();
    }
    if (xhr.status >= 400) {
      let err2;
      try {
        const body = JSON.parse(xhr.responseText);
        err2 = new Error(body.error || "Request failed");
        err2.code = body.code || "UNKNOWN";
      } catch {
        err2 = new Error("Request failed: " + xhr.status);
        err2.code = "UNKNOWN";
      }
      throw err2;
    }
    return xhr;
  }
  var transport = {
    async fetchTree(etag) {
      const headers = etag ? { "If-None-Match": etag } : void 0;
      const res = await request("GET", "/tree", {}, headers);
      if (res.status === 304) {
        return { notModified: true, etag: res.headers.get("ETag") };
      }
      return { tree: await res.json(), etag: res.headers.get("ETag") };
    },
    async stat(path) {
      return requestJson("GET", "/stat", { path: normPath(path) });
    },
    async readFile(path, encoding) {
      const res = await request("GET", "/readFile", {
        path: normPath(path),
        encoding: encoding || ""
      });
      if (encoding === "utf8" || encoding === "utf-8") {
        return res.text();
      }
      const buf = await res.arrayBuffer();
      return new Uint8Array(buf);
    },
    async writeFile(path, content, encoding) {
      const isText = typeof content === "string";
      return requestJson("POST", "/writeFile", {
        path: normPath(path),
        content: isText ? content : uint8ToBase64(content),
        encoding: encoding || (isText ? "utf-8" : "binary"),
        base64: !isText
      });
    },
    async appendFile(path, content) {
      return requestJson("POST", "/appendFile", {
        path: normPath(path),
        content
      });
    },
    async mkdir(path, recursive) {
      return requestJson("POST", "/mkdir", { path: normPath(path), recursive });
    },
    async rename(oldPath, newPath) {
      return requestJson("POST", "/rename", {
        oldPath: normPath(oldPath),
        newPath: normPath(newPath)
      });
    },
    async copyFile(src, dest) {
      return requestJson("POST", "/copyFile", {
        src: normPath(src),
        dest: normPath(dest)
      });
    },
    async unlink(path) {
      return requestJson("DELETE", "/unlink", { path: normPath(path) });
    },
    async rmdir(path) {
      return requestJson("DELETE", "/rmdir", { path: normPath(path) });
    },
    async rm(path, recursive) {
      return requestJson("DELETE", "/rm", {
        path: normPath(path),
        recursive: recursive ? "true" : "false"
      });
    },
    async access(path) {
      return requestJson("GET", "/access", { path: normPath(path) });
    },
    async utimes(path, atime, mtime) {
      return requestJson("POST", "/utimes", {
        path: normPath(path),
        atime,
        mtime
      });
    },
    readFileSync(path, encoding) {
      const xhr = requestSync("GET", "/readFile", {
        path: normPath(path),
        encoding: encoding || ""
      });
      if (encoding === "utf8" || encoding === "utf-8") {
        return xhr.responseText;
      }
      const binary = xhr.responseText;
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    },
    writeFileSync(path, content, encoding) {
      const isText = typeof content === "string";
      requestSync("POST", "/writeFile", {
        path: normPath(path),
        content: isText ? content : uint8ToBase64(content),
        encoding: encoding || (isText ? "utf-8" : "binary"),
        base64: !isText
      });
    }
  };

  // packages/shim/src/fs/echo-guard.js
  var ECHO_SUPPRESS_MS = 1500;
  var recentOps = /* @__PURE__ */ new Map();
  function markLocalOp(path) {
    recentOps.set(normalize(path), Date.now());
  }
  function isRecentLocalOp(path) {
    const norm = normalize(path);
    const ts = recentOps.get(norm);
    if (!ts)
      return false;
    if (Date.now() - ts < ECHO_SUPPRESS_MS) {
      return true;
    }
    recentOps.delete(norm);
    return false;
  }

  // packages/shim/src/fs/write-durability.js
  var PENDING_AFTER_MS = 1e3;
  var BACKOFF_MS = [1e3, 2e3, 4e3, 8e3, 16e3, 3e4];
  var MAX_ATTEMPTS = 8;
  var transport2 = null;
  var listenersBound = false;
  var serialize = (path, run) => run();
  var entries = /* @__PURE__ */ new Map();
  var genCounter = 0;
  var state = "clean";
  var stateSubs = /* @__PURE__ */ new Set();
  var failureSubs = /* @__PURE__ */ new Set();
  var failureChangeSubs = /* @__PURE__ */ new Set();
  function initWriteDurability(t, serializeFn) {
    transport2 = t;
    if (serializeFn) {
      serialize = serializeFn;
    }
    if (listenersBound || typeof window === "undefined" || typeof window.addEventListener !== "function") {
      return;
    }
    listenersBound = true;
    window.addEventListener("pagehide", flushOnUnload);
    if (typeof document !== "undefined" && document.addEventListener) {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          flushOnUnload();
        }
      });
    }
  }
  function flushOnUnload() {
    if (!transport2) {
      return;
    }
    for (const [path, entry] of entries) {
      if (entry.data === void 0 || entry.data === null) {
        continue;
      }
      if (entry.status === "retrying") {
        clearTimeout(entry.retryTimer);
        attempt(path, entry.gen);
      } else if (entry.status === "failed") {
        entry.status = "retrying";
        entry.attempts = 1;
        attempt(path, entry.gen);
      }
    }
    recompute();
  }
  function discard(path) {
    const entry = entries.get(path);
    if (!entry) {
      return;
    }
    clearTimeout(entry.startTimer);
    clearTimeout(entry.retryTimer);
    entries.delete(path);
  }
  function contributesPending(entry) {
    if (entry.silent || entry.status === "failed") {
      return false;
    }
    return entry.status === "retrying" || entry.status === "inflight" && entry.overThreshold;
  }
  function recompute() {
    let next = "clean";
    for (const entry of entries.values()) {
      if (contributesPending(entry)) {
        next = "pending";
        break;
      }
    }
    if (next === state) {
      return;
    }
    state = next;
    for (const fn of stateSubs) {
      try {
        fn(state);
      } catch (e) {
        console.error("[shim:fs] write-durability subscriber threw:", e);
      }
    }
  }
  function emitFailure(path) {
    for (const fn of failureSubs) {
      try {
        fn(path);
      } catch (e) {
        console.error("[shim:fs] write-durability failure subscriber threw:", e);
      }
    }
  }
  function emitFailureChange() {
    for (const fn of failureChangeSubs) {
      try {
        fn();
      } catch (e) {
        console.error(
          "[shim:fs] write-durability failure-change subscriber threw:",
          e
        );
      }
    }
  }
  function scheduleRetry(path, gen) {
    const entry = entries.get(path);
    if (!entry || entry.gen !== gen) {
      return;
    }
    const delay = BACKOFF_MS[Math.min(entry.attempts - 1, BACKOFF_MS.length - 1)];
    clearTimeout(entry.retryTimer);
    entry.retryTimer = setTimeout(() => attempt(path, gen), delay);
  }
  function attempt(path, gen) {
    const entry = entries.get(path);
    if (!entry || entry.gen !== gen || !transport2) {
      return;
    }
    serialize(path, () => {
      const e = entries.get(path);
      if (!e || e.gen !== gen) {
        return Promise.resolve(null);
      }
      markLocalOp(path);
      return transport2.writeFile(path, e.data, e.encoding);
    }).then(
      (result) => {
        const e = entries.get(path);
        if (!e || e.gen !== gen) {
          return;
        }
        if (e.onResult && result && result.mtime) {
          e.onResult(result);
        }
        discard(path);
        recompute();
      },
      () => {
        const e = entries.get(path);
        if (!e || e.gen !== gen) {
          return;
        }
        e.attempts += 1;
        if (e.attempts <= MAX_ATTEMPTS) {
          scheduleRetry(path, gen);
          return;
        }
        if (e.silent) {
          console.error("[shim:fs] write durability gave up (silent):", path);
          discard(path);
          recompute();
        } else {
          e.status = "failed";
          recompute();
          emitFailure(path);
        }
      }
    );
  }
  function trackWrite(path, opts) {
    const prev = entries.get(path);
    const supersededFailure = !!(prev && prev.status === "failed" && !prev.silent);
    discard(path);
    const gen = ++genCounter;
    const entry = {
      gen,
      status: "inflight",
      silent: !!(opts && opts.silent),
      overThreshold: false,
      startTimer: null,
      retryTimer: null
    };
    entry.startTimer = setTimeout(() => {
      const e = entries.get(path);
      if (e && e.gen === gen && e.status === "inflight") {
        e.overThreshold = true;
        recompute();
      }
    }, PENDING_AFTER_MS);
    entries.set(path, entry);
    recompute();
    if (supersededFailure) {
      emitFailureChange();
    }
    return {
      success() {
        const e = entries.get(path);
        if (e && e.gen === gen) {
          discard(path);
          recompute();
        }
      },
      failure(data, encoding, onResult) {
        const e = entries.get(path);
        if (!e || e.gen !== gen) {
          return;
        }
        clearTimeout(e.startTimer);
        e.data = data;
        e.encoding = encoding;
        e.onResult = onResult;
        e.status = "retrying";
        e.overThreshold = true;
        e.attempts = 1;
        scheduleRetry(path, gen);
        recompute();
      }
    };
  }
  function getState() {
    return state;
  }
  function onStateChange(handler) {
    stateSubs.add(handler);
    return () => {
      stateSubs.delete(handler);
    };
  }
  function onFailure(handler) {
    failureSubs.add(handler);
    return () => {
      failureSubs.delete(handler);
    };
  }
  function onFailureChange(handler) {
    failureChangeSubs.add(handler);
    return () => {
      failureChangeSubs.delete(handler);
    };
  }
  function listPending() {
    const pending2 = [];
    for (const [path, entry] of entries) {
      if (contributesPending(entry)) {
        pending2.push(path);
      }
    }
    return pending2;
  }
  function listFailed() {
    const failed = [];
    for (const [path, entry] of entries) {
      if (entry.status === "failed" && !entry.silent) {
        failed.push(path);
      }
    }
    return failed;
  }
  function getDetail() {
    let pending2 = 0;
    let retrying = 0;
    for (const entry of entries.values()) {
      if (entry.silent || entry.status === "failed") {
        continue;
      }
      if (entry.status === "retrying") {
        retrying += 1;
        pending2 += 1;
      } else if (entry.status === "inflight" && entry.overThreshold) {
        pending2 += 1;
      }
    }
    return { pending: pending2, retrying };
  }
  function retryAll() {
    for (const [path, entry] of entries) {
      if (entry.status === "failed" && !entry.silent) {
        entry.status = "retrying";
        entry.attempts = 1;
        attempt(path, entry.gen);
      }
    }
    recompute();
  }

  // packages/shim/src/fs/write-coalescer.js
  var QUIET_MS = 100;
  var MAX_WAIT_MS = 2e3;
  var COALESCE_MAX_BYTES = 32 * 1024;
  var transport3 = null;
  var listenersBound2 = false;
  var pending = /* @__PURE__ */ new Map();
  var tails = /* @__PURE__ */ new Map();
  function isBooting() {
    return typeof window !== "undefined" && window.__ignisBooting === true;
  }
  function initWriteCoalescer(t) {
    transport3 = t;
    if (listenersBound2 || typeof window === "undefined" || typeof window.addEventListener !== "function") {
      return;
    }
    listenersBound2 = true;
    window.addEventListener("pagehide", flushAll);
    if (typeof document !== "undefined" && document.addEventListener) {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          flushAll();
        }
      });
    }
  }
  function performWrite(path, data, encoding, onResult) {
    markLocalOp(path);
    const track = trackWrite(path);
    return transport3.writeFile(path, data, encoding).then(
      (result) => {
        track.success();
        if (result && result.mtime && onResult) {
          onResult(result);
        }
        return result;
      },
      (err2) => {
        track.failure(data, encoding, onResult);
        throw err2;
      }
    );
  }
  function enqueue(path, run) {
    const prev = tails.get(path) || Promise.resolve();
    const result = prev.then(run, run);
    const tail = result.catch(() => {
    });
    tails.set(path, tail);
    tail.then(() => {
      if (tails.get(path) === tail) {
        tails.delete(path);
      }
    });
    return result;
  }
  function doFlush(path) {
    const entry = pending.get(path);
    if (!entry) {
      return;
    }
    clearTimeout(entry.quiet);
    clearTimeout(entry.max);
    pending.delete(path);
    enqueue(
      path,
      () => performWrite(path, entry.data, entry.encoding, entry.onResult)
    ).catch(() => {
    });
  }
  function bufferWrite(path, data, encoding, onResult) {
    const entry = pending.get(path) || { max: null };
    clearTimeout(entry.quiet);
    entry.data = data;
    entry.encoding = encoding;
    entry.onResult = onResult;
    entry.quiet = setTimeout(() => doFlush(path), QUIET_MS);
    if (!entry.max) {
      entry.max = setTimeout(() => doFlush(path), MAX_WAIT_MS);
    }
    pending.set(path, entry);
  }
  function enqueueWrite(path, data, encoding, onResult) {
    return enqueue(path, () => performWrite(path, data, encoding, onResult));
  }
  function cancelPending(path) {
    const entry = pending.get(path);
    if (!entry) {
      return;
    }
    clearTimeout(entry.quiet);
    clearTimeout(entry.max);
    pending.delete(path);
  }
  function hasPending(path) {
    return pending.has(path);
  }
  function flushAll() {
    for (const path of Array.from(pending.keys())) {
      doFlush(path);
    }
  }

  // packages/shim/src/fs/transforms.js
  var pathResolvers = [];
  function registerPathResolver(matcher, resolver) {
    pathResolvers.push({ matcher, resolver });
  }
  function resolvePathInfo(path) {
    const norm = normalize(path);
    for (const { matcher, resolver } of pathResolvers) {
      try {
        if (matcher(norm)) {
          const resolved = resolver(norm);
          if (typeof resolved === "string" && resolved.length > 0) {
            return { resolved, redirected: true };
          }
        }
      } catch {
      }
    }
    return { resolved: norm, redirected: false };
  }
  function resolvePath(path) {
    return resolvePathInfo(path).resolved;
  }
  var readTransforms = /* @__PURE__ */ new Map();
  function registerReadTransform(path, fn) {
    readTransforms.set(normalize(path), fn);
  }
  function removeReadTransform(path) {
    readTransforms.delete(normalize(path));
  }
  function applyReadTransform(path, data) {
    const fn = readTransforms.get(normalize(path));
    if (!fn) {
      return data;
    }
    try {
      return fn(data);
    } catch {
      return data;
    }
  }
  var writeTransforms = /* @__PURE__ */ new Map();
  function registerWriteTransform(path, fn) {
    writeTransforms.set(normalize(path), fn);
  }
  function applyWriteTransform(path, data) {
    const fn = writeTransforms.get(normalize(path));
    if (!fn) {
      return data;
    }
    try {
      return fn(data);
    } catch {
      return data;
    }
  }

  // packages/shim/src/fs/virtual-files.js
  var virtualFiles = /* @__PURE__ */ new Map();
  function setVirtualFile(path, content) {
    const normalized = normalize(path);
    if (normalized.split("/").includes("..")) {
      throw new Error(`virtual file path may not contain '..': ${path}`);
    }
    virtualFiles.set(normalized, content);
  }
  function removeVirtualFile(path) {
    virtualFiles.delete(normalize(path));
  }
  function getVirtualFile(path) {
    return virtualFiles.get(normalize(path));
  }
  function hasVirtualFile(path) {
    return virtualFiles.has(normalize(path));
  }

  // packages/shim/src/fs/realpath.js
  function realpathSync(path) {
    return typeof path === "string" ? path : String(path);
  }
  function realpath(path, options, callback) {
    const cb = typeof options === "function" ? options : callback;
    queueMicrotask(() => cb(null, realpathSync(path)));
  }
  realpath.native = realpath;
  realpathSync.native = realpathSync;

  // packages/shim/src/fs/utimes.js
  function toMs(time) {
    return time instanceof Date ? time.getTime() : Number(time) * 1e3;
  }
  function createUtimes(metadataCache2, transport4) {
    return function commitUtimes(path, atime, mtime) {
      const resolved = resolvePath(path);
      const mtimeMs = toMs(mtime);
      const meta = metadataCache2.get(resolved);
      if (meta) {
        meta.mtime = mtimeMs;
        metadataCache2.set(resolved, meta);
      }
      transport4.utimes(resolved, toMs(atime), mtimeMs).catch((e) => {
        console.error("[shim:fs] utimes flush failed:", resolved, e);
      });
    };
  }

  // packages/shim/src/fs/promises.js
  function createFsPromises(metadataCache2, contentCache2, transport4) {
    initWriteCoalescer(transport4);
    initWriteDurability(transport4, enqueue);
    onFailure((failedPath) => {
      contentCache2.invalidate(failedPath);
    });
    const commitUtimes = createUtimes(metadataCache2, transport4);
    return {
      async stat(path) {
        const resolved = resolvePath(path);
        const cached = metadataCache2.toStat(resolved);
        if (cached) {
          return cached;
        }
        const meta = await transport4.stat(resolved);
        metadataCache2.set(resolved, meta);
        return metadataCache2.toStat(resolved);
      },
      async lstat(path) {
        return this.stat(path);
      },
      async readdir(path) {
        const meta = metadataCache2.get(path);
        if (meta && meta.type === "file") {
          return [];
        }
        if (!meta && path && path !== "/" && path !== ".") {
          const e = new Error(
            `ENOENT: no such file or directory, scandir '${path}'`
          );
          e.code = "ENOENT";
          throw e;
        }
        const entries2 = metadataCache2.readdir(path);
        return entries2.map((e) => e.name);
      },
      async readFile(path, encoding) {
        if (typeof encoding === "object") {
          encoding = encoding == null ? void 0 : encoding.encoding;
        }
        const wantText = encoding === "utf8" || encoding === "utf-8";
        const { resolved, redirected } = resolvePathInfo(path);
        if (hasVirtualFile(resolved)) {
          const content = getVirtualFile(resolved);
          if (wantText) {
            return typeof content === "string" ? content : new TextDecoder().decode(content);
          }
          return typeof content === "string" ? new TextEncoder().encode(content) : content;
        }
        let result = null;
        if (isInputCachePath(path)) {
          result = inputCacheGet(path);
        }
        if (result === null) {
          const meta = metadataCache2.get(resolved);
          if (meta && meta.type === "directory") {
            const e = new Error("EISDIR: illegal operation on a directory, read");
            e.code = "EISDIR";
            throw e;
          }
          if (!meta && !redirected) {
            const e = new Error(
              `ENOENT: no such file or directory, open '${path}'`
            );
            e.code = "ENOENT";
            throw e;
          }
          result = contentCache2.get(resolved);
        }
        if (result === null) {
          try {
            result = await transport4.readFile(resolved, encoding);
          } catch (e) {
            if (redirected && e.code === "ENOENT") {
              result = await transport4.readFile(path, encoding);
            } else {
              throw e;
            }
          }
          contentCache2.set(resolved, result);
        }
        result = applyReadTransform(resolved, result);
        if (wantText) {
          return typeof result === "string" ? result : new TextDecoder().decode(result);
        }
        if (typeof result === "string") {
          return new TextEncoder().encode(result);
        }
        return result;
      },
      async writeFile(path, data, encoding) {
        var _a;
        if (typeof encoding === "object") {
          encoding = encoding == null ? void 0 : encoding.encoding;
        }
        const resolved = resolvePath(path);
        const transformed = applyWriteTransform(resolved, data);
        contentCache2.set(resolved, transformed);
        const size = typeof transformed === "string" ? transformed.length : transformed.byteLength || 0;
        const applyResult = (result) => {
          var _a2;
          metadataCache2.set(resolved, {
            type: "file",
            size: result.size || size,
            mtime: result.mtime,
            ctime: ((_a2 = metadataCache2.get(resolved)) == null ? void 0 : _a2.ctime) || Date.now()
          });
        };
        metadataCache2.set(resolved, {
          type: "file",
          size,
          mtime: Date.now(),
          ctime: ((_a = metadataCache2.get(resolved)) == null ? void 0 : _a.ctime) || Date.now()
        });
        if (isBooting() && size <= COALESCE_MAX_BYTES) {
          bufferWrite(resolved, transformed, encoding, applyResult);
          return;
        }
        if (hasPending(resolved)) {
          cancelPending(resolved);
        }
        try {
          await enqueueWrite(resolved, transformed, encoding, applyResult);
        } catch {
        }
      },
      async appendFile(path, data, encoding) {
        const resolved = resolvePath(path);
        markLocalOp(resolved);
        contentCache2.invalidate(resolved);
        await transport4.appendFile(resolved, data);
        const meta = await transport4.stat(resolved);
        metadataCache2.set(resolved, meta);
      },
      async unlink(path) {
        const resolved = resolvePath(path);
        markLocalOp(resolved);
        contentCache2.delete(resolved);
        metadataCache2.delete(resolved);
        await transport4.unlink(resolved);
      },
      async rename(oldPath, newPath) {
        const resolvedOld = resolvePath(oldPath);
        const resolvedNew = resolvePath(newPath);
        markLocalOp(resolvedOld);
        markLocalOp(resolvedNew);
        const content = contentCache2.get(resolvedOld);
        if (content !== null) {
          contentCache2.set(resolvedNew, content);
          contentCache2.delete(resolvedOld);
        }
        metadataCache2.rename(resolvedOld, resolvedNew);
        await transport4.rename(resolvedOld, resolvedNew);
      },
      async mkdir(path, options) {
        const recursive = typeof options === "object" ? !!options.recursive : !!options;
        const resolved = resolvePath(path);
        markLocalOp(resolved);
        metadataCache2.set(resolved, { type: "directory" });
        await transport4.mkdir(resolved, recursive);
      },
      async rmdir(path) {
        const resolved = resolvePath(path);
        markLocalOp(resolved);
        metadataCache2.delete(resolved);
        await transport4.rmdir(resolved);
      },
      async rm(path, options) {
        const recursive = typeof options === "object" ? !!options.recursive : false;
        const resolved = resolvePath(path);
        markLocalOp(resolved);
        metadataCache2.delete(resolved);
        contentCache2.delete(resolved);
        await transport4.rm(resolved, recursive);
      },
      async copyFile(src, dest) {
        const resolvedDest = resolvePath(dest);
        markLocalOp(resolvedDest);
        await transport4.copyFile(src, resolvedDest);
        const meta = await transport4.stat(resolvedDest);
        metadataCache2.set(resolvedDest, meta);
      },
      async access(path) {
        const resolved = resolvePath(path);
        if (metadataCache2.has(resolved)) {
          return;
        }
        const e = new Error(
          `ENOENT: no such file or directory, access '${path}'`
        );
        e.code = "ENOENT";
        throw e;
      },
      async realpath(path) {
        if (!path || path === "/" || path === ".") {
          return "/";
        }
        return realpathSync(path);
      },
      async utimes(path, atime, mtime) {
        commitUtimes(path, atime, mtime);
      },
      async chmod() {
      },
      async open(path, flags) {
        const hasInCache = isInputCachePath(path) && inputCacheGet(path) !== null;
        const resolved = resolvePath(path);
        if (!hasInCache && !metadataCache2.has(resolved)) {
          const err2 = new Error(
            `ENOENT: no such file or directory, open '${path}'`
          );
          err2.code = "ENOENT";
          throw err2;
        }
        const data = await this.readFile(path);
        const fileData = typeof data === "string" ? new TextEncoder().encode(data) : data;
        const fileStat = metadataCache2.toStat(resolved) || {
          size: fileData.length,
          isFile: () => true,
          isDirectory: () => false
        };
        return {
          async stat() {
            return fileStat;
          },
          async read(buffer, offset, length, position) {
            const available = Math.min(length, fileData.length - position);
            if (available <= 0) {
              return { bytesRead: 0, buffer };
            }
            const slice = fileData.subarray(position, position + available);
            buffer.set(slice, offset);
            return { bytesRead: available, buffer };
          },
          async close() {
          }
        };
      }
    };
  }

  // packages/shim/src/fs/sync.js
  function createFsSync(metadataCache2, contentCache2, transport4) {
    const commitUtimes = createUtimes(metadataCache2, transport4);
    return {
      existsSync(path) {
        if (isInputCachePath(path) && inputCacheGet(path) !== null) {
          return true;
        }
        const resolved = resolvePath(path);
        return metadataCache2.has(resolved);
      },
      statSync(path) {
        if (isInputCachePath(path) && inputCacheGet(path) !== null) {
          const data = inputCacheGet(path);
          const size = data ? data.length || data.byteLength || 0 : 0;
          return {
            size,
            mtime: /* @__PURE__ */ new Date(),
            ctime: /* @__PURE__ */ new Date(),
            isFile: () => true,
            isDirectory: () => false,
            isSymbolicLink: () => false
          };
        }
        const resolved = resolvePath(path);
        const stat = metadataCache2.toStat(resolved);
        if (!stat) {
          const err2 = new Error(
            `ENOENT: no such file or directory, stat '${path}'`
          );
          err2.code = "ENOENT";
          throw err2;
        }
        return stat;
      },
      accessSync(path, mode) {
        if (isInputCachePath(path) && inputCacheGet(path) !== null) {
          return;
        }
        const resolved = resolvePath(path);
        if (!metadataCache2.has(resolved)) {
          const err2 = new Error(
            `ENOENT: no such file or directory, access '${path}'`
          );
          err2.code = "ENOENT";
          throw err2;
        }
      },
      readFileSync(path, encoding) {
        if (typeof encoding === "object") {
          encoding = encoding == null ? void 0 : encoding.encoding;
        }
        const wantText = encoding === "utf8" || encoding === "utf-8";
        const { resolved, redirected } = resolvePathInfo(path);
        if (hasVirtualFile(resolved)) {
          const content = getVirtualFile(resolved);
          if (wantText) {
            return typeof content === "string" ? content : new TextDecoder().decode(content);
          }
          return typeof content === "string" ? new TextEncoder().encode(content) : content;
        }
        const meta = metadataCache2.get(resolved);
        if (meta && meta.type === "directory") {
          const e = new Error("EISDIR: illegal operation on a directory, read");
          e.code = "EISDIR";
          throw e;
        }
        let result = null;
        if (isInputCachePath(path)) {
          const inputData = inputCacheGet(path);
          if (inputData !== null) {
            result = inputData;
          }
        }
        if (result === null) {
          result = contentCache2.get(resolved);
        }
        if (result === null && !meta && !redirected) {
          const e = new Error(
            `ENOENT: no such file or directory, open '${path}'`
          );
          e.code = "ENOENT";
          throw e;
        }
        if (result === null) {
          try {
            result = transport4.readFileSync(resolved, encoding);
          } catch (e) {
            if (redirected && e.code === "ENOENT") {
              console.warn(
                "[shim:fs] readFileSync cache miss, using sync XHR:",
                path
              );
              result = transport4.readFileSync(path, encoding);
            } else {
              throw e;
            }
          }
          contentCache2.set(resolved, result);
        }
        result = applyReadTransform(resolved, result);
        if (wantText) {
          return typeof result === "string" ? result : new TextDecoder().decode(result);
        }
        return result;
      },
      writeFileSync(path, data, encoding) {
        var _a;
        if (typeof encoding === "object") {
          encoding = encoding == null ? void 0 : encoding.encoding;
        }
        const resolved = resolvePath(path);
        const transformed = applyWriteTransform(resolved, data);
        markLocalOp(resolved);
        contentCache2.set(resolved, transformed);
        const size = typeof transformed === "string" ? transformed.length : transformed.byteLength || 0;
        metadataCache2.set(resolved, {
          type: "file",
          size,
          mtime: Date.now(),
          ctime: ((_a = metadataCache2.get(resolved)) == null ? void 0 : _a.ctime) || Date.now()
        });
        const track = trackWrite(resolved, { silent: true });
        transport4.writeFile(resolved, transformed, encoding).then(
          () => track.success(),
          () => track.failure(transformed, encoding, null)
        );
      },
      unlinkSync(path) {
        const resolved = resolvePath(path);
        markLocalOp(resolved);
        contentCache2.delete(resolved);
        metadataCache2.delete(resolved);
        transport4.unlink(resolved).catch((e) => {
          if (e.code !== "ENOENT") {
            console.error(
              "[shim:fs] unlinkSync background delete failed:",
              resolved,
              e
            );
          }
        });
      },
      readdirSync(path) {
        const entries2 = metadataCache2.readdir(path);
        return entries2.map((e) => e.name);
      },
      lstatSync(path) {
        return this.statSync(path);
      },
      mkdirSync(path, options) {
        const recursive = typeof options === "object" ? !!options.recursive : !!options;
        const resolved = resolvePath(path);
        markLocalOp(resolved);
        metadataCache2.set(resolved, { type: "directory" });
        transport4.mkdir(resolved, recursive).catch((e) => {
          console.error(
            "[shim:fs] mkdirSync background create failed:",
            resolved,
            e
          );
        });
      },
      rmdirSync(path) {
        const resolved = resolvePath(path);
        markLocalOp(resolved);
        metadataCache2.delete(resolved);
        transport4.rmdir(resolved).catch((e) => {
          console.error(
            "[shim:fs] rmdirSync background remove failed:",
            resolved,
            e
          );
        });
      },
      rmSync(path, options) {
        const recursive = typeof options === "object" ? !!options.recursive : false;
        const resolved = resolvePath(path);
        markLocalOp(resolved);
        metadataCache2.delete(resolved);
        contentCache2.delete(resolved);
        transport4.rm(resolved, recursive).catch((e) => {
          console.error(
            "[shim:fs] rmSync background remove failed:",
            resolved,
            e
          );
        });
      },
      renameSync(oldPath, newPath) {
        const resolvedOld = resolvePath(oldPath);
        const resolvedNew = resolvePath(newPath);
        markLocalOp(resolvedOld);
        markLocalOp(resolvedNew);
        const content = contentCache2.get(resolvedOld);
        if (content !== null) {
          contentCache2.set(resolvedNew, content);
          contentCache2.delete(resolvedOld);
        }
        metadataCache2.rename(resolvedOld, resolvedNew);
        transport4.rename(resolvedOld, resolvedNew).catch((e) => {
          console.error(
            "[shim:fs] renameSync background rename failed:",
            resolvedOld,
            e
          );
        });
      },
      copyFileSync(src, dest) {
        const resolvedSrc = resolvePath(src);
        const resolvedDest = resolvePath(dest);
        markLocalOp(resolvedDest);
        const content = contentCache2.get(resolvedSrc);
        if (content !== null) {
          contentCache2.set(resolvedDest, content);
        }
        const srcMeta = metadataCache2.get(resolvedSrc);
        if (srcMeta) {
          metadataCache2.set(resolvedDest, { ...srcMeta });
        }
        transport4.copyFile(src, resolvedDest).then(() => transport4.stat(resolvedDest)).then((meta) => metadataCache2.set(resolvedDest, meta)).catch((e) => {
          console.error(
            "[shim:fs] copyFileSync background copy failed:",
            resolvedDest,
            e
          );
        });
      },
      appendFileSync(path, data) {
        const resolved = resolvePath(path);
        markLocalOp(resolved);
        contentCache2.invalidate(resolved);
        transport4.appendFile(resolved, data).then(() => transport4.stat(resolved)).then((meta) => metadataCache2.set(resolved, meta)).catch((e) => {
          console.error(
            "[shim:fs] appendFileSync background append failed:",
            resolved,
            e
          );
        });
      },
      utimesSync(path, atime, mtime) {
        commitUtimes(path, atime, mtime);
      },
      chmodSync() {
      }
    };
  }

  // packages/shim/src/fs/watch.js
  function createFsWatch(transport4) {
    const watchers = /* @__PURE__ */ new Map();
    return {
      watch(path, options, listener) {
        if (typeof options === "function") {
          listener = options;
          options = {};
        }
        if (!watchers.has(path)) {
          watchers.set(path, /* @__PURE__ */ new Set());
        }
        const entry = {
          direct: typeof listener === "function" ? listener : null,
          eventListeners: /* @__PURE__ */ new Map(),
          // event name -> Set<fn>
          call(eventType, filename) {
            if (this.direct) {
              this.direct(eventType, filename);
            }
            const fns = this.eventListeners.get("change");
            if (fns) {
              for (const fn of fns) {
                try {
                  fn(eventType, filename);
                } catch (e) {
                  console.error("[shim:fs:watch] Listener error:", e);
                }
              }
            }
          }
        };
        watchers.get(path).add(entry);
        return {
          close() {
            const set = watchers.get(path);
            if (set) {
              set.delete(entry);
              if (set.size === 0) {
                watchers.delete(path);
              }
            }
          },
          on(event, fn) {
            if (!entry.eventListeners.has(event)) {
              entry.eventListeners.set(event, /* @__PURE__ */ new Set());
            }
            entry.eventListeners.get(event).add(fn);
            return this;
          },
          once(event, fn) {
            const wrapped = (...args) => {
              this.removeListener(event, wrapped);
              fn(...args);
            };
            return this.on(event, wrapped);
          },
          removeListener(event, fn) {
            const fns = entry.eventListeners.get(event);
            if (fns) {
              fns.delete(fn);
            }
            return this;
          }
        };
      },
      // Internal: called when transport receives a file-change event
      _dispatch(eventType, filePath) {
        const normFile = (filePath || "").replace(/^\/+/, "");
        for (const [watchPath, listeners3] of watchers) {
          const normWatch = (watchPath || "").replace(/^\/+/, "");
          const isMatch = normWatch === "" || normFile === normWatch || normFile.startsWith(normWatch + "/");
          if (isMatch) {
            const relativeName = normWatch === "" ? normFile : normFile.slice(normWatch.length + 1) || normFile;
            for (const entry of listeners3) {
              try {
                entry.call(eventType, relativeName);
              } catch (e) {
                console.error("[shim:fs:watch] Listener error:", e);
              }
            }
          }
        }
      }
    };
  }

  // packages/shim/src/fs/watcher-client.js
  var RESYNC_DEBOUNCE_MS = 1e3;
  function createWatcherClient(metadataCache2, contentCache2, fsWatch2, wsClient2, transport4) {
    function handleCreated(msg) {
      const { path, stat } = msg;
      if (!path || isRecentLocalOp(path)) {
        return;
      }
      if (stat) {
        metadataCache2.set(path, {
          type: "file",
          size: stat.size,
          mtime: stat.mtime,
          ctime: stat.ctime
        });
      }
      contentCache2.invalidate(path);
      fsWatch2._dispatch("created", path);
    }
    function handleFolderCreated(msg) {
      const { path } = msg;
      if (!path || isRecentLocalOp(path)) {
        return;
      }
      metadataCache2.set(path, { type: "directory" });
      fsWatch2._dispatch("folder-created", path);
    }
    function handleModified(msg) {
      const { path, stat } = msg;
      if (!path || isRecentLocalOp(path)) {
        return;
      }
      if (stat) {
        metadataCache2.set(path, {
          type: "file",
          size: stat.size,
          mtime: stat.mtime,
          ctime: stat.ctime
        });
      }
      contentCache2.invalidate(path);
      fsWatch2._dispatch("modified", path);
    }
    function handleDeleted(msg) {
      const { path } = msg;
      if (!path || isRecentLocalOp(path)) {
        return;
      }
      metadataCache2.delete(path);
      contentCache2.invalidate(path);
      fsWatch2._dispatch("deleted", path);
    }
    wsClient2.subscribe("created", handleCreated);
    wsClient2.subscribe("folder-created", handleFolderCreated);
    wsClient2.subscribe("modified", handleModified);
    wsClient2.subscribe("deleted", handleDeleted);
    let treeRevision = null;
    function setTreeRevision(rev) {
      treeRevision = rev;
    }
    function reconcile(tree) {
      const fresh = new Set(Object.keys(tree).map(normalize));
      for (const [path, meta] of Object.entries(tree)) {
        const existing = metadataCache2.get(path);
        if (!existing) {
          if (meta.type === "directory") {
            handleFolderCreated({ path });
          } else {
            handleCreated({
              path,
              stat: { size: meta.size, mtime: meta.mtime, ctime: meta.ctime }
            });
          }
        } else if (meta.type === "file" && (existing.mtime !== meta.mtime || existing.size !== meta.size)) {
          handleModified({
            path,
            stat: { size: meta.size, mtime: meta.mtime, ctime: meta.ctime }
          });
        }
      }
      for (const key of metadataCache2.keys()) {
        if (key === "" || fresh.has(key)) {
          continue;
        }
        handleDeleted({ path: key });
      }
    }
    async function resync() {
      let result;
      try {
        result = await transport4.fetchTree(treeRevision);
      } catch (e) {
        console.warn("[shim:fs] tree resync failed:", e);
        return;
      }
      if (result.notModified) {
        return;
      }
      treeRevision = result.etag;
      reconcile(result.tree);
    }
    let resyncTimer = null;
    function scheduleResync() {
      if (resyncTimer) {
        clearTimeout(resyncTimer);
      }
      resyncTimer = setTimeout(() => {
        resyncTimer = null;
        resync();
      }, RESYNC_DEBOUNCE_MS);
    }
    wsClient2.onOpen(scheduleResync);
    function connect2(vaultId2) {
      wsClient2.connect(vaultId2);
    }
    function disconnect() {
      wsClient2.disconnect();
    }
    return {
      connect: connect2,
      disconnect,
      reconcile,
      setTreeRevision
    };
  }

  // packages/shim/src/fs/fd.js
  var nextFd = 100;
  var openFiles = /* @__PURE__ */ new Map();
  function createFdOps(metadataCache2, contentCache2, transport4) {
    function ensureData(path) {
      if (isInputCachePath(path)) {
        const inputData = inputCacheGet(path);
        if (inputData !== null) {
          if (typeof inputData === "string") {
            return new TextEncoder().encode(inputData);
          }
          return inputData;
        }
      }
      const resolved = resolvePath(path);
      if (hasVirtualFile(resolved)) {
        const content = getVirtualFile(resolved);
        return typeof content === "string" ? new TextEncoder().encode(content) : content;
      }
      const cached = contentCache2.get(resolved);
      if (cached !== null) {
        if (typeof cached === "string") {
          return new TextEncoder().encode(cached);
        }
        return cached;
      }
      console.warn("[shim:fs] fd open cache miss, using sync XHR:", resolved);
      const data = transport4.readFileSync(resolved);
      contentCache2.set(resolved, data);
      return data;
    }
    function getEntry(fd) {
      const entry = openFiles.get(fd);
      if (!entry) {
        const err2 = new Error(`EBADF: bad file descriptor, fd ${fd}`);
        err2.code = "EBADF";
        throw err2;
      }
      return entry;
    }
    function openSync(path, flags, mode) {
      const hasInCache = isInputCachePath(path) && inputCacheGet(path) !== null;
      const resolved = resolvePath(path);
      if (!hasInCache && !hasVirtualFile(resolved) && !metadataCache2.has(resolved)) {
        const err2 = new Error(
          `ENOENT: no such file or directory, open '${path}'`
        );
        err2.code = "ENOENT";
        throw err2;
      }
      const data = ensureData(path);
      const fd = nextFd++;
      openFiles.set(fd, { path: resolved, data });
      return fd;
    }
    function readSync(fd, buffer, offset, length, position) {
      const entry = getEntry(fd);
      const available = Math.min(length, entry.data.length - position);
      if (available <= 0) {
        return 0;
      }
      const slice = entry.data.subarray(position, position + available);
      buffer.set(slice, offset);
      return available;
    }
    function closeSync(fd) {
      openFiles.delete(fd);
    }
    function fstatSync(fd) {
      const entry = getEntry(fd);
      const stat = metadataCache2.toStat(entry.path);
      if (stat) {
        return stat;
      }
      return {
        size: entry.data.length,
        isFile: () => true,
        isDirectory: () => false
      };
    }
    function open(path, flags, modeOrCb, cb) {
      if (typeof modeOrCb === "function") {
        cb = modeOrCb;
      }
      try {
        const fd = openSync(path, flags);
        queueMicrotask(() => cb(null, fd));
      } catch (e) {
        queueMicrotask(() => cb(e));
      }
    }
    function read(fd, buffer, offset, length, position, cb) {
      try {
        const bytesRead = readSync(fd, buffer, offset, length, position);
        queueMicrotask(() => cb(null, bytesRead, buffer));
      } catch (e) {
        queueMicrotask(() => cb(e));
      }
    }
    function close(fd, cb) {
      try {
        closeSync(fd);
        if (cb) {
          queueMicrotask(() => cb(null));
        }
      } catch (e) {
        if (cb) {
          queueMicrotask(() => cb(e));
        }
      }
    }
    function fstat(fd, optionsOrCb, cb) {
      if (typeof optionsOrCb === "function") {
        cb = optionsOrCb;
      }
      try {
        const stat = fstatSync(fd);
        queueMicrotask(() => cb(null, stat));
      } catch (e) {
        queueMicrotask(() => cb(e));
      }
    }
    return {
      openSync,
      readSync,
      closeSync,
      fstatSync,
      open,
      read,
      close,
      fstat
    };
  }

  // packages/shim/src/fs/callback.js
  var CALLBACK_METHODS = [
    "stat",
    "lstat",
    "readdir",
    "readFile",
    "writeFile",
    "appendFile",
    "unlink",
    "rename",
    "mkdir",
    "rmdir",
    "rm",
    "copyFile",
    "access",
    "utimes",
    "chmod"
  ];
  function createFsCallbacks(fsPromises2) {
    const callbacks = {};
    for (const name of CALLBACK_METHODS) {
      callbacks[name] = function(...args) {
        const callback = args.pop();
        fsPromises2[name](...args).then(
          (result) => callback(null, result),
          (err2) => callback(err2)
        );
      };
    }
    return callbacks;
  }

  // packages/shim/src/fs/constants.js
  var constants = {
    F_OK: 0,
    R_OK: 4,
    W_OK: 2,
    X_OK: 1,
    COPYFILE_EXCL: 1,
    COPYFILE_FICLONE: 2,
    COPYFILE_FICLONE_FORCE: 4,
    O_RDONLY: 0,
    O_WRONLY: 1,
    O_RDWR: 2,
    O_CREAT: 64,
    O_EXCL: 128,
    O_TRUNC: 512,
    O_APPEND: 1024
  };

  // packages/shim/src/ws-client.js
  var RECONNECT_DELAY_MS = 2e3;
  function createWsClient() {
    let ws = null;
    let vaultId2 = null;
    let reconnectTimer = null;
    let manuallyClosed = false;
    let state2 = "closed";
    const globalSubs = /* @__PURE__ */ new Map();
    const channelSubs = /* @__PURE__ */ new Map();
    const channelSubCount = /* @__PURE__ */ new Map();
    const stateSubs2 = /* @__PURE__ */ new Set();
    const openSubs = /* @__PURE__ */ new Set();
    function setState(next) {
      if (state2 === next) {
        return;
      }
      state2 = next;
      for (const fn of stateSubs2) {
        try {
          fn(state2);
        } catch (e) {
          console.error("[ws] state subscriber threw:", e);
        }
      }
    }
    function postRaw(message) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    }
    function sendSubscribeChannel(name) {
      postRaw({ type: "subscribe-channel", channel: name });
    }
    function sendUnsubscribeChannel(name) {
      postRaw({ type: "unsubscribe-channel", channel: name });
    }
    function dispatch(msg) {
      if (msg.channel) {
        const types = channelSubs.get(msg.channel);
        const handlers3 = types && types.get(msg.type);
        if (handlers3) {
          for (const fn of handlers3) {
            try {
              fn(msg);
            } catch (e) {
              console.error(
                `[ws] channel subscriber for ${msg.channel}:${msg.type} threw:`,
                e
              );
            }
          }
        }
        return;
      }
      const handlers2 = globalSubs.get(msg.type);
      if (handlers2) {
        for (const fn of handlers2) {
          try {
            fn(msg);
          } catch (e) {
            console.error(`[ws] subscriber for ${msg.type} threw:`, e);
          }
        }
      }
    }
    function openSocket() {
      if (ws) {
        return;
      }
      setState("connecting");
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const url = `${protocol}//${window.location.host}/ws?vault=${encodeURIComponent(vaultId2)}`;
      try {
        ws = new WebSocket(url);
      } catch (e) {
        console.error("[ws] failed to create WebSocket:", e);
        ws = null;
        setState("closed");
        scheduleReconnect();
        return;
      }
      ws.onopen = () => {
        console.log("[ws] connected");
        setState("open");
        for (const name of channelSubCount.keys()) {
          sendSubscribeChannel(name);
        }
        for (const fn of openSubs) {
          try {
            fn();
          } catch (e) {
            console.error("[ws] open subscriber threw:", e);
          }
        }
      };
      ws.onmessage = (event) => {
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch (e) {
          console.error("[ws] failed to parse message:", e);
          return;
        }
        dispatch(msg);
      };
      ws.onclose = () => {
        ws = null;
        setState("closed");
        if (!manuallyClosed) {
          scheduleReconnect();
        }
      };
      ws.onerror = (e) => {
        console.error("[ws] error:", e);
      };
    }
    function scheduleReconnect() {
      if (reconnectTimer || manuallyClosed) {
        return;
      }
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        console.log("[ws] reconnecting...");
        openSocket();
      }, RECONNECT_DELAY_MS);
    }
    function connect2(id) {
      if (!id) {
        console.warn("[ws] no vault id; skipping connect");
        return;
      }
      vaultId2 = id;
      manuallyClosed = false;
      openSocket();
    }
    function disconnect() {
      manuallyClosed = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (ws) {
        ws.close();
        ws = null;
      }
      setState("closed");
    }
    function subscribe(type2, handler) {
      if (!globalSubs.has(type2)) {
        globalSubs.set(type2, /* @__PURE__ */ new Set());
      }
      globalSubs.get(type2).add(handler);
      return () => {
        var _a;
        (_a = globalSubs.get(type2)) == null ? void 0 : _a.delete(handler);
      };
    }
    function send(type2, payload) {
      postRaw({ type: type2, ...payload });
    }
    function channel(name) {
      return {
        subscribe(type2, handler) {
          if (!channelSubs.has(name)) {
            channelSubs.set(name, /* @__PURE__ */ new Map());
          }
          const types = channelSubs.get(name);
          if (!types.has(type2)) {
            types.set(type2, /* @__PURE__ */ new Set());
          }
          types.get(type2).add(handler);
          const prevCount = channelSubCount.get(name) || 0;
          channelSubCount.set(name, prevCount + 1);
          if (prevCount === 0) {
            sendSubscribeChannel(name);
          }
          return () => {
            const set = types.get(type2);
            if (!set || !set.has(handler)) {
              return;
            }
            set.delete(handler);
            const newCount = (channelSubCount.get(name) || 0) - 1;
            if (newCount <= 0) {
              channelSubCount.delete(name);
              sendUnsubscribeChannel(name);
            } else {
              channelSubCount.set(name, newCount);
            }
          };
        },
        send(type2, payload) {
          postRaw({ channel: name, type: type2, ...payload });
        }
      };
    }
    function isOpen() {
      return state2 === "open";
    }
    function onStateChange2(handler) {
      stateSubs2.add(handler);
      return () => {
        stateSubs2.delete(handler);
      };
    }
    function onOpen(handler) {
      openSubs.add(handler);
      return () => {
        openSubs.delete(handler);
      };
    }
    return {
      connect: connect2,
      disconnect,
      subscribe,
      send,
      channel,
      isOpen,
      onStateChange: onStateChange2,
      onOpen
    };
  }
  var wsClient = createWsClient();

  // packages/shim/src/fs/index.js
  var metadataCache = new MetadataCache();
  var contentCache = new ContentCache();
  var fsPromises = createFsPromises(metadataCache, contentCache, transport);
  var fsSync = createFsSync(metadataCache, contentCache, transport);
  var fsWatch = createFsWatch(transport);
  var watcherClient = createWatcherClient(
    metadataCache,
    contentCache,
    fsWatch,
    wsClient,
    transport
  );
  var fdOps = createFdOps(metadataCache, contentCache, transport);
  var fsCallbacks = createFsCallbacks(fsPromises);
  var fsShim = {
    promises: fsPromises,
    ...fsCallbacks,
    existsSync: fsSync.existsSync,
    readFileSync: fsSync.readFileSync,
    writeFileSync: fsSync.writeFileSync,
    unlinkSync: fsSync.unlinkSync,
    accessSync: fsSync.accessSync,
    statSync: fsSync.statSync,
    readdirSync: fsSync.readdirSync,
    lstatSync: fsSync.lstatSync,
    mkdirSync: fsSync.mkdirSync,
    rmdirSync: fsSync.rmdirSync,
    rmSync: fsSync.rmSync,
    renameSync: fsSync.renameSync,
    copyFileSync: fsSync.copyFileSync,
    appendFileSync: fsSync.appendFileSync,
    utimesSync: fsSync.utimesSync,
    chmodSync: fsSync.chmodSync,
    realpath,
    realpathSync,
    open: fdOps.open,
    openSync: fdOps.openSync,
    read: fdOps.read,
    readSync: fdOps.readSync,
    close: fdOps.close,
    closeSync: fdOps.closeSync,
    fstat: fdOps.fstat,
    fstatSync: fdOps.fstatSync,
    watch: fsWatch.watch,
    constants,
    invalidate(path) {
      contentCache.invalidate(resolvePath(path));
    },
    _metadataCache: metadataCache,
    _contentCache: contentCache,
    _watcherClient: watcherClient,
    _registerReadTransform: registerReadTransform,
    _removeReadTransform: removeReadTransform
  };

  // packages/shim/src/path.js
  var import_path6 = __toESM(require_path_browserify());
  var _origBasename = import_path6.default.basename;
  var pathShim = {
    ...import_path6.default,
    basename(p, ext) {
      if (p === "/" && window.__currentVaultId) {
        return window.__currentVaultId;
      }
      return _origBasename(p, ext);
    }
  };

  // packages/shim/src/url.js
  var urlShim = {
    URL: globalThis.URL,
    URLSearchParams: globalThis.URLSearchParams,
    pathToFileURL(p) {
      const encoded = encodeURI(p.replace(/\\/g, "/"));
      const href = "file:///" + encoded.replace(/^\/+/, "");
      return { href, toString: () => href };
    },
    fileURLToPath(url) {
      let str = typeof url === "string" ? url : url.href || url.toString();
      if (str.startsWith("file:///")) {
        str = str.slice(8);
      } else if (str.startsWith("file://")) {
        str = str.slice(7);
      }
      return decodeURI(str);
    }
  };

  // packages/shim/src/crypto/random-bytes.js
  function randomBytes(size) {
    const buf = new Uint8Array(size);
    crypto.getRandomValues(buf);
    buf.toString = function(encoding) {
      if (encoding === "hex") {
        return Array.from(this).map((b) => b.toString(16).padStart(2, "0")).join("");
      }
      if (encoding === "base64") {
        return btoa(String.fromCharCode(...this));
      }
      return new TextDecoder().decode(this);
    };
    return buf;
  }

  // node_modules/@noble/hashes/utils.js
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
  }
  function abytes(value, length, title = "") {
    const bytes = isBytes(value);
    const len = value == null ? void 0 : value.length;
    const needsLen = length !== void 0;
    if (!bytes || needsLen && len !== length) {
      const prefix = title && `"${title}" `;
      const ofLen = needsLen ? ` of length ${length}` : "";
      const got = bytes ? `length=${len}` : `type=${typeof value}`;
      const message = prefix + "expected Uint8Array" + ofLen + ", got " + got;
      if (!bytes)
        throw new TypeError(message);
      throw new RangeError(message);
    }
    return value;
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes(out, void 0, "digestInto() output");
    const min = instance.outputLen;
    if (out.length < min) {
      throw new RangeError('"digestInto() output" expected to be of length >=' + min);
    }
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  function rotl(word, shift) {
    return word << shift | word >>> 32 - shift >>> 0;
  }
  function createHasher(hashCons, info = {}) {
    const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
    const tmp = hashCons(void 0);
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.canXOF = tmp.canXOF;
    hashC.create = (opts) => hashCons(opts);
    Object.assign(hashC, info);
    return Object.freeze(hashC);
  }
  var oidNist = (suffix) => ({
    // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
    // Larger suffix values would need base-128 OID encoding and a different length byte.
    oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
  });

  // node_modules/@noble/hashes/_md.js
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD = class {
    blockLen;
    outputLen;
    canXOF = false;
    padOffset;
    isLE;
    // For partial updates less than block size
    buffer;
    view;
    finished = false;
    length = 0;
    pos = 0;
    destroyed = false;
    constructor(blockLen, outputLen, padOffset, isLE) {
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      aexists(this);
      abytes(data);
      const { view, buffer, blockLen } = this;
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      aexists(this);
      aoutput(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      clean(this.buffer.subarray(pos));
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE);
      this.process(view, 0);
      const oview = createView(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen must be aligned to 32bit");
      const outLen = len / 4;
      const state2 = this.get();
      if (outLen > state2.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state2[i], isLE);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to ||= new this.constructor();
      to.set(...this.get());
      const { blockLen, buffer, length, finished, destroyed, pos } = this;
      to.destroyed = destroyed;
      to.finished = finished;
      to.length = length;
      to.pos = pos;
      if (length % blockLen)
        to.buffer.set(buffer);
      return to;
    }
    clone() {
      return this._cloneInto();
    }
  };
  var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  var SHA384_IV = /* @__PURE__ */ Uint32Array.from([
    3418070365,
    3238371032,
    1654270250,
    914150663,
    2438529370,
    812702999,
    355462360,
    4144912697,
    1731405415,
    4290775857,
    2394180231,
    1750603025,
    3675008525,
    1694076839,
    1203062813,
    3204075428
  ]);
  var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    4089235720,
    3144134277,
    2227873595,
    1013904242,
    4271175723,
    2773480762,
    1595750129,
    1359893119,
    2917565137,
    2600822924,
    725511199,
    528734635,
    4215389547,
    1541459225,
    327033209
  ]);

  // node_modules/@noble/hashes/_u64.js
  var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
  var _32n = /* @__PURE__ */ BigInt(32);
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  function split(lst, le = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for (let i = 0; i < len; i++) {
      const { h, l } = fromBig(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  }
  var shrSH = (h, _l, s) => h >>> s;
  var shrSL = (h, l, s) => h << 32 - s | l >>> s;
  var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
  var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
  var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
  var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
  function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
  }
  var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
  var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
  var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
  var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
  var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
  var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

  // node_modules/@noble/hashes/sha2.js
  var SHA256_K = /* @__PURE__ */ Uint32Array.from([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  var SHA2_32B = class extends HashMD {
    constructor(outputLen) {
      super(64, outputLen, 8, false);
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
        const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
        const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
        const T2 = sigma0 + Maj(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      clean(SHA256_W);
    }
    destroy() {
      this.destroyed = true;
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      clean(this.buffer);
    }
  };
  var _SHA256 = class extends SHA2_32B {
    // We cannot use array here since array allows indexing by variable
    // which means optimizer/compiler cannot use registers.
    A = SHA256_IV[0] | 0;
    B = SHA256_IV[1] | 0;
    C = SHA256_IV[2] | 0;
    D = SHA256_IV[3] | 0;
    E = SHA256_IV[4] | 0;
    F = SHA256_IV[5] | 0;
    G = SHA256_IV[6] | 0;
    H = SHA256_IV[7] | 0;
    constructor() {
      super(32);
    }
  };
  var K512 = /* @__PURE__ */ (() => split([
    "0x428a2f98d728ae22",
    "0x7137449123ef65cd",
    "0xb5c0fbcfec4d3b2f",
    "0xe9b5dba58189dbbc",
    "0x3956c25bf348b538",
    "0x59f111f1b605d019",
    "0x923f82a4af194f9b",
    "0xab1c5ed5da6d8118",
    "0xd807aa98a3030242",
    "0x12835b0145706fbe",
    "0x243185be4ee4b28c",
    "0x550c7dc3d5ffb4e2",
    "0x72be5d74f27b896f",
    "0x80deb1fe3b1696b1",
    "0x9bdc06a725c71235",
    "0xc19bf174cf692694",
    "0xe49b69c19ef14ad2",
    "0xefbe4786384f25e3",
    "0x0fc19dc68b8cd5b5",
    "0x240ca1cc77ac9c65",
    "0x2de92c6f592b0275",
    "0x4a7484aa6ea6e483",
    "0x5cb0a9dcbd41fbd4",
    "0x76f988da831153b5",
    "0x983e5152ee66dfab",
    "0xa831c66d2db43210",
    "0xb00327c898fb213f",
    "0xbf597fc7beef0ee4",
    "0xc6e00bf33da88fc2",
    "0xd5a79147930aa725",
    "0x06ca6351e003826f",
    "0x142929670a0e6e70",
    "0x27b70a8546d22ffc",
    "0x2e1b21385c26c926",
    "0x4d2c6dfc5ac42aed",
    "0x53380d139d95b3df",
    "0x650a73548baf63de",
    "0x766a0abb3c77b2a8",
    "0x81c2c92e47edaee6",
    "0x92722c851482353b",
    "0xa2bfe8a14cf10364",
    "0xa81a664bbc423001",
    "0xc24b8b70d0f89791",
    "0xc76c51a30654be30",
    "0xd192e819d6ef5218",
    "0xd69906245565a910",
    "0xf40e35855771202a",
    "0x106aa07032bbd1b8",
    "0x19a4c116b8d2d0c8",
    "0x1e376c085141ab53",
    "0x2748774cdf8eeb99",
    "0x34b0bcb5e19b48a8",
    "0x391c0cb3c5c95a63",
    "0x4ed8aa4ae3418acb",
    "0x5b9cca4f7763e373",
    "0x682e6ff3d6b2b8a3",
    "0x748f82ee5defb2fc",
    "0x78a5636f43172f60",
    "0x84c87814a1f0ab72",
    "0x8cc702081a6439ec",
    "0x90befffa23631e28",
    "0xa4506cebde82bde9",
    "0xbef9a3f7b2c67915",
    "0xc67178f2e372532b",
    "0xca273eceea26619c",
    "0xd186b8c721c0c207",
    "0xeada7dd6cde0eb1e",
    "0xf57d4f7fee6ed178",
    "0x06f067aa72176fba",
    "0x0a637dc5a2c898a6",
    "0x113f9804bef90dae",
    "0x1b710b35131c471b",
    "0x28db77f523047d84",
    "0x32caab7b40c72493",
    "0x3c9ebe0a15c9bebc",
    "0x431d67c49c100d4c",
    "0x4cc5d4becb3e42b6",
    "0x597f299cfc657e2a",
    "0x5fcb6fab3ad6faec",
    "0x6c44198c4a475817"
  ].map((n) => BigInt(n))))();
  var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
  var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
  var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
  var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
  var SHA2_64B = class extends HashMD {
    constructor(outputLen) {
      super(128, outputLen, 16, false);
    }
    // prettier-ignore
    get() {
      const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
      return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
    }
    // prettier-ignore
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
      this.Ah = Ah | 0;
      this.Al = Al | 0;
      this.Bh = Bh | 0;
      this.Bl = Bl | 0;
      this.Ch = Ch | 0;
      this.Cl = Cl | 0;
      this.Dh = Dh | 0;
      this.Dl = Dl | 0;
      this.Eh = Eh | 0;
      this.El = El | 0;
      this.Fh = Fh | 0;
      this.Fl = Fl | 0;
      this.Gh = Gh | 0;
      this.Gl = Gl | 0;
      this.Hh = Hh | 0;
      this.Hl = Hl | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4) {
        SHA512_W_H[i] = view.getUint32(offset);
        SHA512_W_L[i] = view.getUint32(offset += 4);
      }
      for (let i = 16; i < 80; i++) {
        const W15h = SHA512_W_H[i - 15] | 0;
        const W15l = SHA512_W_L[i - 15] | 0;
        const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
        const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
        const W2h = SHA512_W_H[i - 2] | 0;
        const W2l = SHA512_W_L[i - 2] | 0;
        const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
        const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
        const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
        const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
        SHA512_W_H[i] = SUMh | 0;
        SHA512_W_L[i] = SUMl | 0;
      }
      let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
      for (let i = 0; i < 80; i++) {
        const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
        const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
        const CHIh = Eh & Fh ^ ~Eh & Gh;
        const CHIl = El & Fl ^ ~El & Gl;
        const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
        const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
        const T1l = T1ll | 0;
        const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
        const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
        const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
        const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
        Hh = Gh | 0;
        Hl = Gl | 0;
        Gh = Fh | 0;
        Gl = Fl | 0;
        Fh = Eh | 0;
        Fl = El | 0;
        ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
        Dh = Ch | 0;
        Dl = Cl | 0;
        Ch = Bh | 0;
        Cl = Bl | 0;
        Bh = Ah | 0;
        Bl = Al | 0;
        const All = add3L(T1l, sigma0l, MAJl);
        Ah = add3H(All, T1h, sigma0h, MAJh);
        Al = All | 0;
      }
      ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
      ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
      ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
      ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
      ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
      ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
      ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
      ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
      this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
      clean(SHA512_W_H, SHA512_W_L);
    }
    destroy() {
      this.destroyed = true;
      clean(this.buffer);
      this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  };
  var _SHA512 = class extends SHA2_64B {
    Ah = SHA512_IV[0] | 0;
    Al = SHA512_IV[1] | 0;
    Bh = SHA512_IV[2] | 0;
    Bl = SHA512_IV[3] | 0;
    Ch = SHA512_IV[4] | 0;
    Cl = SHA512_IV[5] | 0;
    Dh = SHA512_IV[6] | 0;
    Dl = SHA512_IV[7] | 0;
    Eh = SHA512_IV[8] | 0;
    El = SHA512_IV[9] | 0;
    Fh = SHA512_IV[10] | 0;
    Fl = SHA512_IV[11] | 0;
    Gh = SHA512_IV[12] | 0;
    Gl = SHA512_IV[13] | 0;
    Hh = SHA512_IV[14] | 0;
    Hl = SHA512_IV[15] | 0;
    constructor() {
      super(64);
    }
  };
  var _SHA384 = class extends SHA2_64B {
    Ah = SHA384_IV[0] | 0;
    Al = SHA384_IV[1] | 0;
    Bh = SHA384_IV[2] | 0;
    Bl = SHA384_IV[3] | 0;
    Ch = SHA384_IV[4] | 0;
    Cl = SHA384_IV[5] | 0;
    Dh = SHA384_IV[6] | 0;
    Dl = SHA384_IV[7] | 0;
    Eh = SHA384_IV[8] | 0;
    El = SHA384_IV[9] | 0;
    Fh = SHA384_IV[10] | 0;
    Fl = SHA384_IV[11] | 0;
    Gh = SHA384_IV[12] | 0;
    Gl = SHA384_IV[13] | 0;
    Hh = SHA384_IV[14] | 0;
    Hl = SHA384_IV[15] | 0;
    constructor() {
      super(48);
    }
  };
  var sha256 = /* @__PURE__ */ createHasher(
    () => new _SHA256(),
    /* @__PURE__ */ oidNist(1)
  );
  var sha512 = /* @__PURE__ */ createHasher(
    () => new _SHA512(),
    /* @__PURE__ */ oidNist(3)
  );
  var sha384 = /* @__PURE__ */ createHasher(
    () => new _SHA384(),
    /* @__PURE__ */ oidNist(2)
  );

  // node_modules/@noble/hashes/legacy.js
  var SHA1_IV = /* @__PURE__ */ Uint32Array.from([
    1732584193,
    4023233417,
    2562383102,
    271733878,
    3285377520
  ]);
  var SHA1_W = /* @__PURE__ */ new Uint32Array(80);
  var _SHA1 = class extends HashMD {
    A = SHA1_IV[0] | 0;
    B = SHA1_IV[1] | 0;
    C = SHA1_IV[2] | 0;
    D = SHA1_IV[3] | 0;
    E = SHA1_IV[4] | 0;
    constructor() {
      super(64, 20, 8, false);
    }
    get() {
      const { A, B, C, D, E } = this;
      return [A, B, C, D, E];
    }
    set(A, B, C, D, E) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA1_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 80; i++)
        SHA1_W[i] = rotl(SHA1_W[i - 3] ^ SHA1_W[i - 8] ^ SHA1_W[i - 14] ^ SHA1_W[i - 16], 1);
      let { A, B, C, D, E } = this;
      for (let i = 0; i < 80; i++) {
        let F, K2;
        if (i < 20) {
          F = Chi(B, C, D);
          K2 = 1518500249;
        } else if (i < 40) {
          F = B ^ C ^ D;
          K2 = 1859775393;
        } else if (i < 60) {
          F = Maj(B, C, D);
          K2 = 2400959708;
        } else {
          F = B ^ C ^ D;
          K2 = 3395469782;
        }
        const T = rotl(A, 5) + F + E + K2 + SHA1_W[i] | 0;
        E = D;
        D = C;
        C = rotl(B, 30);
        B = A;
        A = T;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      this.set(A, B, C, D, E);
    }
    roundClean() {
      clean(SHA1_W);
    }
    destroy() {
      this.destroyed = true;
      this.set(0, 0, 0, 0, 0);
      clean(this.buffer);
    }
  };
  var sha1 = /* @__PURE__ */ createHasher(() => new _SHA1());
  var p32 = /* @__PURE__ */ Math.pow(2, 32);
  var K = /* @__PURE__ */ Array.from({ length: 64 }, (_, i) => Math.floor(p32 * Math.abs(Math.sin(i + 1))));
  var MD5_IV = /* @__PURE__ */ SHA1_IV.slice(0, 4);
  var MD5_W = /* @__PURE__ */ new Uint32Array(16);
  var _MD5 = class extends HashMD {
    A = MD5_IV[0] | 0;
    B = MD5_IV[1] | 0;
    C = MD5_IV[2] | 0;
    D = MD5_IV[3] | 0;
    constructor() {
      super(64, 16, 8, true);
    }
    get() {
      const { A, B, C, D } = this;
      return [A, B, C, D];
    }
    set(A, B, C, D) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        MD5_W[i] = view.getUint32(offset, true);
      let { A, B, C, D } = this;
      for (let i = 0; i < 64; i++) {
        let F, g, s;
        if (i < 16) {
          F = Chi(B, C, D);
          g = i;
          s = [7, 12, 17, 22];
        } else if (i < 32) {
          F = Chi(D, B, C);
          g = (5 * i + 1) % 16;
          s = [5, 9, 14, 20];
        } else if (i < 48) {
          F = B ^ C ^ D;
          g = (3 * i + 5) % 16;
          s = [4, 11, 16, 23];
        } else {
          F = C ^ (B | ~D);
          g = 7 * i % 16;
          s = [6, 10, 15, 21];
        }
        F = F + A + K[i] + MD5_W[g];
        A = D;
        D = C;
        C = B;
        B = B + rotl(F, s[i % 4]);
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      this.set(A, B, C, D);
    }
    roundClean() {
      clean(MD5_W);
    }
    destroy() {
      this.destroyed = true;
      this.set(0, 0, 0, 0);
      clean(this.buffer);
    }
  };
  var md5 = /* @__PURE__ */ createHasher(() => new _MD5());

  // packages/shim/src/crypto/create-hash.js
  var HASHERS = {
    SHA1: sha1,
    SHA256: sha256,
    SHA512: sha512,
    MD5: md5
  };
  var SUBTLE_ALG = {
    SHA1: "SHA-1",
    SHA256: "SHA-256",
    SHA512: "SHA-512"
  };
  function normalizeAlgorithm(algorithm) {
    return algorithm.toUpperCase().replace(/-/g, "");
  }
  function encode(bytes, encoding) {
    if (!encoding) {
      return bytes;
    }
    if (encoding === "hex") {
      let hex = "";
      for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, "0");
      }
      return hex;
    }
    if (encoding === "base64") {
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }
    throw new Error(`Unsupported digest encoding: ${encoding}`);
  }
  function createHash(algorithm) {
    const alg = normalizeAlgorithm(algorithm);
    const hasher = HASHERS[alg];
    if (!hasher) {
      throw new Error(`Unsupported hash algorithm: ${algorithm}`);
    }
    let inputData = new Uint8Array(0);
    return {
      update(data) {
        const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
        const merged = new Uint8Array(inputData.length + bytes.length);
        merged.set(inputData);
        merged.set(bytes, inputData.length);
        inputData = merged;
        return this;
      },
      digest(encoding) {
        return encode(hasher(inputData), encoding);
      },
      async digestAsync(encoding) {
        const subtleAlg = SUBTLE_ALG[alg];
        if (!subtleAlg) {
          return encode(hasher(inputData), encoding);
        }
        const buf = await crypto.subtle.digest(subtleAlg, inputData);
        return encode(new Uint8Array(buf), encoding);
      }
    };
  }

  // packages/shim/src/crypto/scrypt.js
  function scrypt(password, salt, keylen, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    const N = (options == null ? void 0 : options.N) || 32768;
    const r = (options == null ? void 0 : options.r) || 8;
    const p = (options == null ? void 0 : options.p) || 1;
    if (window.scrypt && window.scrypt.scrypt) {
      const pwBytes = typeof password === "string" ? new TextEncoder().encode(password) : password;
      const saltBytes = typeof salt === "string" ? new TextEncoder().encode(salt) : salt;
      window.scrypt.scrypt(pwBytes, saltBytes, N, r, p, keylen).then((result) => callback(null, new Uint8Array(result))).catch((err2) => callback(err2));
    } else {
      callback(new Error("scrypt not available"));
    }
  }

  // packages/shim/src/crypto/random-uuid.js
  function randomUUID() {
    return crypto.randomUUID();
  }

  // packages/shim/src/crypto/index.js
  var cryptoShim = {
    randomBytes,
    createHash,
    scrypt,
    randomUUID
  };

  // packages/shim/src/node/child_process.js
  var child_process_exports = {};
  __export(child_process_exports, {
    exec: () => exec,
    execFile: () => execFile,
    execFileSync: () => execFileSync,
    execSync: () => execSync,
    fork: () => fork,
    spawn: () => spawn,
    spawnSync: () => spawnSync
  });
  function notAvailable(name) {
    return function() {
      throw new Error(
        `child_process.${name}() is not available in the web version.`
      );
    };
  }
  var exec = notAvailable("exec");
  var execSync = notAvailable("execSync");
  var spawn = notAvailable("spawn");
  var fork = notAvailable("fork");
  var execFile = notAvailable("execFile");
  var execFileSync = notAvailable("execFileSync");
  var spawnSync = notAvailable("spawnSync");

  // packages/shim/src/node/events.js
  var events_exports = {};
  __export(events_exports, {
    EventEmitter: () => EventEmitter,
    default: () => events_default
  });
  var EventEmitter = class {
    constructor() {
      this._events = {};
    }
    on(event, listener) {
      if (!this._events[event]) {
        this._events[event] = [];
      }
      this._events[event].push(listener);
      return this;
    }
    once(event, listener) {
      const wrapped = (...args) => {
        this.removeListener(event, wrapped);
        listener.apply(this, args);
      };
      wrapped._original = listener;
      return this.on(event, wrapped);
    }
    emit(event, ...args) {
      const listeners3 = this._events[event];
      if (!listeners3 || listeners3.length === 0) {
        return false;
      }
      for (const fn of [...listeners3]) {
        fn.apply(this, args);
      }
      return true;
    }
    removeListener(event, listener) {
      const arr = this._events[event];
      if (!arr) {
        return this;
      }
      const idx = arr.findIndex(
        (fn) => fn === listener || fn._original === listener
      );
      if (idx >= 0) {
        arr.splice(idx, 1);
      }
      return this;
    }
    off(event, listener) {
      return this.removeListener(event, listener);
    }
    removeAllListeners(event) {
      if (event) {
        delete this._events[event];
      } else {
        this._events = {};
      }
      return this;
    }
    listeners(event) {
      return (this._events[event] || []).slice();
    }
    listenerCount(event) {
      return (this._events[event] || []).length;
    }
    addListener(event, listener) {
      return this.on(event, listener);
    }
    prependListener(event, listener) {
      if (!this._events[event]) {
        this._events[event] = [];
      }
      this._events[event].unshift(listener);
      return this;
    }
    eventNames() {
      return Object.keys(this._events);
    }
    setMaxListeners() {
      return this;
    }
    getMaxListeners() {
      return 10;
    }
  };
  var events_default = EventEmitter;

  // packages/shim/src/node/os.js
  var os_exports = {};
  __export(os_exports, {
    EOL: () => EOL,
    arch: () => arch,
    cpus: () => cpus,
    endianness: () => endianness,
    freemem: () => freemem,
    homedir: () => homedir,
    hostname: () => hostname,
    networkInterfaces: () => networkInterfaces,
    platform: () => platform,
    release: () => release,
    tmpdir: () => tmpdir,
    totalmem: () => totalmem,
    type: () => type,
    version: () => version
  });
  function platform() {
    return "linux";
  }
  function arch() {
    return "x64";
  }
  function homedir() {
    return "/";
  }
  function tmpdir() {
    return "/tmp";
  }
  function hostname() {
    return "localhost";
  }
  function type() {
    return "Linux";
  }
  function release() {
    return "0.0.0";
  }
  function cpus() {
    return [{ model: "browser", speed: 0 }];
  }
  function totalmem() {
    return 0;
  }
  function freemem() {
    return 0;
  }
  function networkInterfaces() {
    return {};
  }
  function endianness() {
    return "LE";
  }
  function version() {
    return "v20.0.0";
  }
  var EOL = "\n";

  // packages/shim/src/node/net.js
  var net_exports = {};
  __export(net_exports, {
    Server: () => Server,
    Socket: () => Socket,
    connect: () => connect,
    createConnection: () => createConnection,
    createServer: () => createServer
  });
  function notAvailable2(name) {
    return function() {
      throw new Error(`net.${name}() is not available in the web version.`);
    };
  }
  var createServer = notAvailable2("createServer");
  var createConnection = notAvailable2("createConnection");
  var connect = notAvailable2("connect");
  var Socket = class {
    constructor() {
      throw new Error("net.Socket is not available in the web version.");
    }
  };
  var Server = class {
    constructor() {
      throw new Error("net.Server is not available in the web version.");
    }
  };

  // packages/shim/src/node/http.js
  var http_exports = {};
  __export(http_exports, {
    Agent: () => Agent,
    ClientRequest: () => ClientRequest,
    IncomingMessage: () => IncomingMessage,
    createServer: () => createServer2,
    get: () => get,
    globalAgent: () => globalAgent,
    request: () => request2
  });
  var IncomingMessage = class extends EventEmitter {
    constructor() {
      super();
      this.headers = {};
      this.statusCode = 0;
    }
  };
  var ClientRequest = class extends EventEmitter {
    constructor() {
      super();
    }
    end() {
    }
    write() {
    }
    abort() {
    }
    destroy() {
    }
  };
  function request2(options, callback) {
    const req = new ClientRequest();
    if (callback) {
      req.once("response", callback);
    }
    setTimeout(() => {
      req.emit(
        "error",
        new Error(
          "http.request is not available in the web version. Use requestUrl() instead."
        )
      );
    }, 0);
    return req;
  }
  function get(options, callback) {
    const req = request2(options, callback);
    req.end();
    return req;
  }
  function createServer2() {
    throw new Error("http.createServer is not available in the web version.");
  }
  var Agent = class {
  };
  var globalAgent = new Agent();

  // packages/shim/src/node/zlib.js
  var zlib_exports = {};
  __export(zlib_exports, {
    constants: () => constants3,
    createDeflate: () => createDeflate,
    createDeflateRaw: () => createDeflateRaw,
    createGunzip: () => createGunzip,
    createGzip: () => createGzip,
    createInflate: () => createInflate,
    createInflateRaw: () => createInflateRaw,
    createUnzip: () => createUnzip,
    deflate: () => deflate2,
    deflateRaw: () => deflateRaw2,
    deflateRawSync: () => deflateRawSync,
    deflateSync: () => deflateSync,
    gunzip: () => gunzip,
    gunzipSync: () => gunzipSync,
    gzip: () => gzip2,
    gzipSync: () => gzipSync,
    inflate: () => inflate2,
    inflateRaw: () => inflateRaw2,
    inflateRawSync: () => inflateRawSync,
    inflateSync: () => inflateSync,
    unzip: () => unzip,
    unzipSync: () => unzipSync
  });

  // node_modules/pako/dist/pako.esm.mjs
  var Z_FIXED$1 = 4;
  var Z_BINARY = 0;
  var Z_TEXT = 1;
  var Z_UNKNOWN$1 = 2;
  function zero$1(buf) {
    let len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  var STORED_BLOCK = 0;
  var STATIC_TREES = 1;
  var DYN_TREES = 2;
  var MIN_MATCH$1 = 3;
  var MAX_MATCH$1 = 258;
  var LENGTH_CODES$1 = 29;
  var LITERALS$1 = 256;
  var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
  var D_CODES$1 = 30;
  var BL_CODES$1 = 19;
  var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
  var MAX_BITS$1 = 15;
  var Buf_size = 16;
  var MAX_BL_BITS = 7;
  var END_BLOCK = 256;
  var REP_3_6 = 16;
  var REPZ_3_10 = 17;
  var REPZ_11_138 = 18;
  var extra_lbits = (
    /* extra bits for each length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0])
  );
  var extra_dbits = (
    /* extra bits for each distance code */
    new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13])
  );
  var extra_blbits = (
    /* extra bits for each bit length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])
  );
  var bl_order = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var DIST_CODE_LEN = 512;
  var static_ltree = new Array((L_CODES$1 + 2) * 2);
  zero$1(static_ltree);
  var static_dtree = new Array(D_CODES$1 * 2);
  zero$1(static_dtree);
  var _dist_code = new Array(DIST_CODE_LEN);
  zero$1(_dist_code);
  var _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
  zero$1(_length_code);
  var base_length = new Array(LENGTH_CODES$1);
  zero$1(base_length);
  var base_dist = new Array(D_CODES$1);
  zero$1(base_dist);
  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree;
    this.extra_bits = extra_bits;
    this.extra_base = extra_base;
    this.elems = elems;
    this.max_length = max_length;
    this.has_stree = static_tree && static_tree.length;
  }
  var static_l_desc;
  var static_d_desc;
  var static_bl_desc;
  function TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree;
    this.max_code = 0;
    this.stat_desc = stat_desc;
  }
  var d_code = (dist) => {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  };
  var put_short = (s, w) => {
    s.pending_buf[s.pending++] = w & 255;
    s.pending_buf[s.pending++] = w >>> 8 & 255;
  };
  var send_bits = (s, value, length) => {
    if (s.bi_valid > Buf_size - length) {
      s.bi_buf |= value << s.bi_valid & 65535;
      put_short(s, s.bi_buf);
      s.bi_buf = value >> Buf_size - s.bi_valid;
      s.bi_valid += length - Buf_size;
    } else {
      s.bi_buf |= value << s.bi_valid & 65535;
      s.bi_valid += length;
    }
  };
  var send_code = (s, c, tree) => {
    send_bits(
      s,
      tree[c * 2],
      tree[c * 2 + 1]
      /*.Len*/
    );
  };
  var bi_reverse = (code2, len) => {
    let res = 0;
    do {
      res |= code2 & 1;
      code2 >>>= 1;
      res <<= 1;
    } while (--len > 0);
    return res >>> 1;
  };
  var bi_flush = (s) => {
    if (s.bi_valid === 16) {
      put_short(s, s.bi_buf);
      s.bi_buf = 0;
      s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
      s.pending_buf[s.pending++] = s.bi_buf & 255;
      s.bi_buf >>= 8;
      s.bi_valid -= 8;
    }
  };
  var gen_bitlen = (s, desc) => {
    const tree = desc.dyn_tree;
    const max_code = desc.max_code;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const extra = desc.stat_desc.extra_bits;
    const base = desc.stat_desc.extra_base;
    const max_length = desc.stat_desc.max_length;
    let h;
    let n, m;
    let bits;
    let xbits;
    let f;
    let overflow = 0;
    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      s.bl_count[bits] = 0;
    }
    tree[s.heap[s.heap_max] * 2 + 1] = 0;
    for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
      n = s.heap[h];
      bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
      if (bits > max_length) {
        bits = max_length;
        overflow++;
      }
      tree[n * 2 + 1] = bits;
      if (n > max_code) {
        continue;
      }
      s.bl_count[bits]++;
      xbits = 0;
      if (n >= base) {
        xbits = extra[n - base];
      }
      f = tree[n * 2];
      s.opt_len += f * (bits + xbits);
      if (has_stree) {
        s.static_len += f * (stree[n * 2 + 1] + xbits);
      }
    }
    if (overflow === 0) {
      return;
    }
    do {
      bits = max_length - 1;
      while (s.bl_count[bits] === 0) {
        bits--;
      }
      s.bl_count[bits]--;
      s.bl_count[bits + 1] += 2;
      s.bl_count[max_length]--;
      overflow -= 2;
    } while (overflow > 0);
    for (bits = max_length; bits !== 0; bits--) {
      n = s.bl_count[bits];
      while (n !== 0) {
        m = s.heap[--h];
        if (m > max_code) {
          continue;
        }
        if (tree[m * 2 + 1] !== bits) {
          s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
          tree[m * 2 + 1] = bits;
        }
        n--;
      }
    }
  };
  var gen_codes = (tree, max_code, bl_count) => {
    const next_code = new Array(MAX_BITS$1 + 1);
    let code2 = 0;
    let bits;
    let n;
    for (bits = 1; bits <= MAX_BITS$1; bits++) {
      code2 = code2 + bl_count[bits - 1] << 1;
      next_code[bits] = code2;
    }
    for (n = 0; n <= max_code; n++) {
      let len = tree[n * 2 + 1];
      if (len === 0) {
        continue;
      }
      tree[n * 2] = bi_reverse(next_code[len]++, len);
    }
  };
  var tr_static_init = () => {
    let n;
    let bits;
    let length;
    let code2;
    let dist;
    const bl_count = new Array(MAX_BITS$1 + 1);
    length = 0;
    for (code2 = 0; code2 < LENGTH_CODES$1 - 1; code2++) {
      base_length[code2] = length;
      for (n = 0; n < 1 << extra_lbits[code2]; n++) {
        _length_code[length++] = code2;
      }
    }
    _length_code[length - 1] = code2;
    dist = 0;
    for (code2 = 0; code2 < 16; code2++) {
      base_dist[code2] = dist;
      for (n = 0; n < 1 << extra_dbits[code2]; n++) {
        _dist_code[dist++] = code2;
      }
    }
    dist >>= 7;
    for (; code2 < D_CODES$1; code2++) {
      base_dist[code2] = dist << 7;
      for (n = 0; n < 1 << extra_dbits[code2] - 7; n++) {
        _dist_code[256 + dist++] = code2;
      }
    }
    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      bl_count[bits] = 0;
    }
    n = 0;
    while (n <= 143) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    while (n <= 255) {
      static_ltree[n * 2 + 1] = 9;
      n++;
      bl_count[9]++;
    }
    while (n <= 279) {
      static_ltree[n * 2 + 1] = 7;
      n++;
      bl_count[7]++;
    }
    while (n <= 287) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    gen_codes(static_ltree, L_CODES$1 + 1, bl_count);
    for (n = 0; n < D_CODES$1; n++) {
      static_dtree[n * 2 + 1] = 5;
      static_dtree[n * 2] = bi_reverse(n, 5);
    }
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);
  };
  var init_block = (s) => {
    let n;
    for (n = 0; n < L_CODES$1; n++) {
      s.dyn_ltree[n * 2] = 0;
    }
    for (n = 0; n < D_CODES$1; n++) {
      s.dyn_dtree[n * 2] = 0;
    }
    for (n = 0; n < BL_CODES$1; n++) {
      s.bl_tree[n * 2] = 0;
    }
    s.dyn_ltree[END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.sym_next = s.matches = 0;
  };
  var bi_windup = (s) => {
    if (s.bi_valid > 8) {
      put_short(s, s.bi_buf);
    } else if (s.bi_valid > 0) {
      s.pending_buf[s.pending++] = s.bi_buf;
    }
    s.bi_buf = 0;
    s.bi_valid = 0;
  };
  var smaller = (tree, n, m, depth) => {
    const _n2 = n * 2;
    const _m2 = m * 2;
    return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
  };
  var pqdownheap = (s, tree, k) => {
    const v = s.heap[k];
    let j = k << 1;
    while (j <= s.heap_len) {
      if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
        j++;
      }
      if (smaller(tree, v, s.heap[j], s.depth)) {
        break;
      }
      s.heap[k] = s.heap[j];
      k = j;
      j <<= 1;
    }
    s.heap[k] = v;
  };
  var compress_block = (s, ltree, dtree) => {
    let dist;
    let lc;
    let sx = 0;
    let code2;
    let extra;
    if (s.sym_next !== 0) {
      do {
        dist = s.pending_buf[s.sym_buf + sx++] & 255;
        dist += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
        lc = s.pending_buf[s.sym_buf + sx++];
        if (dist === 0) {
          send_code(s, lc, ltree);
        } else {
          code2 = _length_code[lc];
          send_code(s, code2 + LITERALS$1 + 1, ltree);
          extra = extra_lbits[code2];
          if (extra !== 0) {
            lc -= base_length[code2];
            send_bits(s, lc, extra);
          }
          dist--;
          code2 = d_code(dist);
          send_code(s, code2, dtree);
          extra = extra_dbits[code2];
          if (extra !== 0) {
            dist -= base_dist[code2];
            send_bits(s, dist, extra);
          }
        }
      } while (sx < s.sym_next);
    }
    send_code(s, END_BLOCK, ltree);
  };
  var build_tree = (s, desc) => {
    const tree = desc.dyn_tree;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const elems = desc.stat_desc.elems;
    let n, m;
    let max_code = -1;
    let node;
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE$1;
    for (n = 0; n < elems; n++) {
      if (tree[n * 2] !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;
      } else {
        tree[n * 2 + 1] = 0;
      }
    }
    while (s.heap_len < 2) {
      node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
      tree[node * 2] = 1;
      s.depth[node] = 0;
      s.opt_len--;
      if (has_stree) {
        s.static_len -= stree[node * 2 + 1];
      }
    }
    desc.max_code = max_code;
    for (n = s.heap_len >> 1; n >= 1; n--) {
      pqdownheap(s, tree, n);
    }
    node = elems;
    do {
      n = s.heap[
        1
        /*SMALLEST*/
      ];
      s.heap[
        1
        /*SMALLEST*/
      ] = s.heap[s.heap_len--];
      pqdownheap(
        s,
        tree,
        1
        /*SMALLEST*/
      );
      m = s.heap[
        1
        /*SMALLEST*/
      ];
      s.heap[--s.heap_max] = n;
      s.heap[--s.heap_max] = m;
      tree[node * 2] = tree[n * 2] + tree[m * 2];
      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
      tree[n * 2 + 1] = tree[m * 2 + 1] = node;
      s.heap[
        1
        /*SMALLEST*/
      ] = node++;
      pqdownheap(
        s,
        tree,
        1
        /*SMALLEST*/
      );
    } while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[
      1
      /*SMALLEST*/
    ];
    gen_bitlen(s, desc);
    gen_codes(tree, max_code, s.bl_count);
  };
  var scan_tree = (s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[0 * 2 + 1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 65535;
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        s.bl_tree[curlen * 2] += count;
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          s.bl_tree[curlen * 2]++;
        }
        s.bl_tree[REP_3_6 * 2]++;
      } else if (count <= 10) {
        s.bl_tree[REPZ_3_10 * 2]++;
      } else {
        s.bl_tree[REPZ_11_138 * 2]++;
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };
  var send_tree = (s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[0 * 2 + 1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        do {
          send_code(s, curlen, s.bl_tree);
        } while (--count !== 0);
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          send_code(s, curlen, s.bl_tree);
          count--;
        }
        send_code(s, REP_3_6, s.bl_tree);
        send_bits(s, count - 3, 2);
      } else if (count <= 10) {
        send_code(s, REPZ_3_10, s.bl_tree);
        send_bits(s, count - 3, 3);
      } else {
        send_code(s, REPZ_11_138, s.bl_tree);
        send_bits(s, count - 11, 7);
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };
  var build_bl_tree = (s) => {
    let max_blindex;
    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
    build_tree(s, s.bl_desc);
    for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
      if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
        break;
      }
    }
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    return max_blindex;
  };
  var send_all_trees = (s, lcodes, dcodes, blcodes) => {
    let rank2;
    send_bits(s, lcodes - 257, 5);
    send_bits(s, dcodes - 1, 5);
    send_bits(s, blcodes - 4, 4);
    for (rank2 = 0; rank2 < blcodes; rank2++) {
      send_bits(s, s.bl_tree[bl_order[rank2] * 2 + 1], 3);
    }
    send_tree(s, s.dyn_ltree, lcodes - 1);
    send_tree(s, s.dyn_dtree, dcodes - 1);
  };
  var detect_data_type = (s) => {
    let block_mask = 4093624447;
    let n;
    for (n = 0; n <= 31; n++, block_mask >>>= 1) {
      if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
        return Z_BINARY;
      }
    }
    if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
      return Z_TEXT;
    }
    for (n = 32; n < LITERALS$1; n++) {
      if (s.dyn_ltree[n * 2] !== 0) {
        return Z_TEXT;
      }
    }
    return Z_BINARY;
  };
  var static_init_done = false;
  var _tr_init$1 = (s) => {
    if (!static_init_done) {
      tr_static_init();
      static_init_done = true;
    }
    s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
    s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;
    init_block(s);
  };
  var _tr_stored_block$1 = (s, buf, stored_len, last) => {
    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
    bi_windup(s);
    put_short(s, stored_len);
    put_short(s, ~stored_len);
    if (stored_len) {
      s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
    }
    s.pending += stored_len;
  };
  var _tr_align$1 = (s) => {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
  };
  var _tr_flush_block$1 = (s, buf, stored_len, last) => {
    let opt_lenb, static_lenb;
    let max_blindex = 0;
    if (s.level > 0) {
      if (s.strm.data_type === Z_UNKNOWN$1) {
        s.strm.data_type = detect_data_type(s);
      }
      build_tree(s, s.l_desc);
      build_tree(s, s.d_desc);
      max_blindex = build_bl_tree(s);
      opt_lenb = s.opt_len + 3 + 7 >>> 3;
      static_lenb = s.static_len + 3 + 7 >>> 3;
      if (static_lenb <= opt_lenb) {
        opt_lenb = static_lenb;
      }
    } else {
      opt_lenb = static_lenb = stored_len + 5;
    }
    if (stored_len + 4 <= opt_lenb && buf !== -1) {
      _tr_stored_block$1(s, buf, stored_len, last);
    } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {
      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
      compress_block(s, static_ltree, static_dtree);
    } else {
      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
      compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    init_block(s);
    if (last) {
      bi_windup(s);
    }
  };
  var _tr_tally$1 = (s, dist, lc) => {
    s.pending_buf[s.sym_buf + s.sym_next++] = dist;
    s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
    s.pending_buf[s.sym_buf + s.sym_next++] = lc;
    if (dist === 0) {
      s.dyn_ltree[lc * 2]++;
    } else {
      s.matches++;
      dist--;
      s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]++;
      s.dyn_dtree[d_code(dist) * 2]++;
    }
    return s.sym_next === s.sym_end;
  };
  var _tr_init_1 = _tr_init$1;
  var _tr_stored_block_1 = _tr_stored_block$1;
  var _tr_flush_block_1 = _tr_flush_block$1;
  var _tr_tally_1 = _tr_tally$1;
  var _tr_align_1 = _tr_align$1;
  var trees = {
    _tr_init: _tr_init_1,
    _tr_stored_block: _tr_stored_block_1,
    _tr_flush_block: _tr_flush_block_1,
    _tr_tally: _tr_tally_1,
    _tr_align: _tr_align_1
  };
  var adler32 = (adler, buf, len, pos) => {
    let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
    while (len !== 0) {
      n = len > 2e3 ? 2e3 : len;
      len -= n;
      do {
        s1 = s1 + buf[pos++] | 0;
        s2 = s2 + s1 | 0;
      } while (--n);
      s1 %= 65521;
      s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
  };
  var adler32_1 = adler32;
  var makeTable = () => {
    let c, table = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) {
        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  };
  var crcTable = new Uint32Array(makeTable());
  var crc32 = (crc, buf, len, pos) => {
    const t = crcTable;
    const end = pos + len;
    crc ^= -1;
    for (let i = pos; i < end; i++) {
      crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
    }
    return crc ^ -1;
  };
  var crc32_1 = crc32;
  var messages = {
    2: "need dictionary",
    /* Z_NEED_DICT       2  */
    1: "stream end",
    /* Z_STREAM_END      1  */
    0: "",
    /* Z_OK              0  */
    "-1": "file error",
    /* Z_ERRNO         (-1) */
    "-2": "stream error",
    /* Z_STREAM_ERROR  (-2) */
    "-3": "data error",
    /* Z_DATA_ERROR    (-3) */
    "-4": "insufficient memory",
    /* Z_MEM_ERROR     (-4) */
    "-5": "buffer error",
    /* Z_BUF_ERROR     (-5) */
    "-6": "incompatible version"
    /* Z_VERSION_ERROR (-6) */
  };
  var constants$2 = {
    /* Allowed flush values; see deflate() and inflate() below for details */
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    /* Return codes for the compression/decompression functions. Negative values
    * are errors, positive values are used for special but normal events.
    */
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    //Z_VERSION_ERROR: -6,
    /* compression levels */
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    /* Possible values of the data_type field (though see inflate()) */
    Z_BINARY: 0,
    Z_TEXT: 1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN: 2,
    /* The deflate compression method */
    Z_DEFLATED: 8
    //Z_NULL:                 null // Use -1 or null inline, depending on var type
  };
  var { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;
  var {
    Z_NO_FLUSH: Z_NO_FLUSH$2,
    Z_PARTIAL_FLUSH,
    Z_FULL_FLUSH: Z_FULL_FLUSH$1,
    Z_FINISH: Z_FINISH$3,
    Z_BLOCK: Z_BLOCK$1,
    Z_OK: Z_OK$3,
    Z_STREAM_END: Z_STREAM_END$3,
    Z_STREAM_ERROR: Z_STREAM_ERROR$2,
    Z_DATA_ERROR: Z_DATA_ERROR$2,
    Z_BUF_ERROR: Z_BUF_ERROR$1,
    Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
    Z_FILTERED,
    Z_HUFFMAN_ONLY,
    Z_RLE,
    Z_FIXED,
    Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
    Z_UNKNOWN,
    Z_DEFLATED: Z_DEFLATED$2
  } = constants$2;
  var MAX_MEM_LEVEL = 9;
  var MAX_WBITS$1 = 15;
  var DEF_MEM_LEVEL = 8;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  var D_CODES = 30;
  var BL_CODES = 19;
  var HEAP_SIZE = 2 * L_CODES + 1;
  var MAX_BITS = 15;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
  var PRESET_DICT = 32;
  var INIT_STATE = 42;
  var GZIP_STATE = 57;
  var EXTRA_STATE = 69;
  var NAME_STATE = 73;
  var COMMENT_STATE = 91;
  var HCRC_STATE = 103;
  var BUSY_STATE = 113;
  var FINISH_STATE = 666;
  var BS_NEED_MORE = 1;
  var BS_BLOCK_DONE = 2;
  var BS_FINISH_STARTED = 3;
  var BS_FINISH_DONE = 4;
  var OS_CODE = 3;
  var err = (strm, errorCode) => {
    strm.msg = messages[errorCode];
    return errorCode;
  };
  var rank = (f) => {
    return f * 2 - (f > 4 ? 9 : 0);
  };
  var zero = (buf) => {
    let len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  };
  var slide_hash = (s) => {
    let n, m;
    let p;
    let wsize = s.w_size;
    n = s.hash_size;
    p = n;
    do {
      m = s.head[--p];
      s.head[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
    n = wsize;
    p = n;
    do {
      m = s.prev[--p];
      s.prev[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
  };
  var HASH_ZLIB = (s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask;
  var HASH = HASH_ZLIB;
  var flush_pending = (strm) => {
    const s = strm.state;
    let len = s.pending;
    if (len > strm.avail_out) {
      len = strm.avail_out;
    }
    if (len === 0) {
      return;
    }
    strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) {
      s.pending_out = 0;
    }
  };
  var flush_block_only = (s, last) => {
    _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    flush_pending(s.strm);
  };
  var put_byte = (s, b) => {
    s.pending_buf[s.pending++] = b;
  };
  var putShortMSB = (s, b) => {
    s.pending_buf[s.pending++] = b >>> 8 & 255;
    s.pending_buf[s.pending++] = b & 255;
  };
  var read_buf = (strm, buf, start, size) => {
    let len = strm.avail_in;
    if (len > size) {
      len = size;
    }
    if (len === 0) {
      return 0;
    }
    strm.avail_in -= len;
    buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
    if (strm.state.wrap === 1) {
      strm.adler = adler32_1(strm.adler, buf, len, start);
    } else if (strm.state.wrap === 2) {
      strm.adler = crc32_1(strm.adler, buf, len, start);
    }
    strm.next_in += len;
    strm.total_in += len;
    return len;
  };
  var longest_match = (s, cur_match) => {
    let chain_length = s.max_chain_length;
    let scan = s.strstart;
    let match;
    let len;
    let best_len = s.prev_length;
    let nice_match = s.nice_match;
    const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
    const _win = s.window;
    const wmask = s.w_mask;
    const prev = s.prev;
    const strend = s.strstart + MAX_MATCH;
    let scan_end1 = _win[scan + best_len - 1];
    let scan_end = _win[scan + best_len];
    if (s.prev_length >= s.good_match) {
      chain_length >>= 2;
    }
    if (nice_match > s.lookahead) {
      nice_match = s.lookahead;
    }
    do {
      match = cur_match;
      if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
        continue;
      }
      scan += 2;
      match++;
      do {
      } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
      len = MAX_MATCH - (strend - scan);
      scan = strend - MAX_MATCH;
      if (len > best_len) {
        s.match_start = cur_match;
        best_len = len;
        if (len >= nice_match) {
          break;
        }
        scan_end1 = _win[scan + best_len - 1];
        scan_end = _win[scan + best_len];
      }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s.lookahead) {
      return best_len;
    }
    return s.lookahead;
  };
  var fill_window = (s) => {
    const _w_size = s.w_size;
    let n, more, str;
    do {
      more = s.window_size - s.lookahead - s.strstart;
      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
        s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
        s.match_start -= _w_size;
        s.strstart -= _w_size;
        s.block_start -= _w_size;
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
        slide_hash(s);
        more += _w_size;
      }
      if (s.strm.avail_in === 0) {
        break;
      }
      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
      s.lookahead += n;
      if (s.lookahead + s.insert >= MIN_MATCH) {
        str = s.strstart - s.insert;
        s.ins_h = s.window[str];
        s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
        while (s.insert) {
          s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
          s.insert--;
          if (s.lookahead + s.insert < MIN_MATCH) {
            break;
          }
        }
      }
    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
  };
  var deflate_stored = (s, flush) => {
    let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
    let len, left, have, last = 0;
    let used = s.strm.avail_in;
    do {
      len = 65535;
      have = s.bi_valid + 42 >> 3;
      if (s.strm.avail_out < have) {
        break;
      }
      have = s.strm.avail_out - have;
      left = s.strstart - s.block_start;
      if (len > left + s.strm.avail_in) {
        len = left + s.strm.avail_in;
      }
      if (len > have) {
        len = have;
      }
      if (len < min_block && (len === 0 && flush !== Z_FINISH$3 || flush === Z_NO_FLUSH$2 || len !== left + s.strm.avail_in)) {
        break;
      }
      last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
      _tr_stored_block(s, 0, 0, last);
      s.pending_buf[s.pending - 4] = len;
      s.pending_buf[s.pending - 3] = len >> 8;
      s.pending_buf[s.pending - 2] = ~len;
      s.pending_buf[s.pending - 1] = ~len >> 8;
      flush_pending(s.strm);
      if (left) {
        if (left > len) {
          left = len;
        }
        s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
        s.strm.next_out += left;
        s.strm.avail_out -= left;
        s.strm.total_out += left;
        s.block_start += left;
        len -= left;
      }
      if (len) {
        read_buf(s.strm, s.strm.output, s.strm.next_out, len);
        s.strm.next_out += len;
        s.strm.avail_out -= len;
        s.strm.total_out += len;
      }
    } while (last === 0);
    used -= s.strm.avail_in;
    if (used) {
      if (used >= s.w_size) {
        s.matches = 2;
        s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
        s.strstart = s.w_size;
        s.insert = s.strstart;
      } else {
        if (s.window_size - s.strstart <= used) {
          s.strstart -= s.w_size;
          s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
          if (s.matches < 2) {
            s.matches++;
          }
          if (s.insert > s.strstart) {
            s.insert = s.strstart;
          }
        }
        s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
        s.strstart += used;
        s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
      }
      s.block_start = s.strstart;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }
    if (last) {
      return BS_FINISH_DONE;
    }
    if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 && s.strm.avail_in === 0 && s.strstart === s.block_start) {
      return BS_BLOCK_DONE;
    }
    have = s.window_size - s.strstart;
    if (s.strm.avail_in > have && s.block_start >= s.w_size) {
      s.block_start -= s.w_size;
      s.strstart -= s.w_size;
      s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
      if (s.matches < 2) {
        s.matches++;
      }
      have += s.w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
    }
    if (have > s.strm.avail_in) {
      have = s.strm.avail_in;
    }
    if (have) {
      read_buf(s.strm, s.window, s.strstart, have);
      s.strstart += have;
      s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }
    have = s.bi_valid + 42 >> 3;
    have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
    min_block = have > s.w_size ? s.w_size : have;
    left = s.strstart - s.block_start;
    if (left >= min_block || (left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 && s.strm.avail_in === 0 && left <= have) {
      len = left > have ? have : left;
      last = flush === Z_FINISH$3 && s.strm.avail_in === 0 && len === left ? 1 : 0;
      _tr_stored_block(s, s.block_start, len, last);
      s.block_start += len;
      flush_pending(s.strm);
    }
    return last ? BS_FINISH_STARTED : BS_NEED_MORE;
  };
  var deflate_fast = (s, flush) => {
    let hash_head;
    let bflush;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
          s.match_length--;
          do {
            s.strstart++;
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          } while (--s.match_length !== 0);
          s.strstart++;
        } else {
          s.strstart += s.match_length;
          s.match_length = 0;
          s.ins_h = s.window[s.strstart];
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
        }
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  var deflate_slow = (s, flush) => {
    let hash_head;
    let bflush;
    let max_insert;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      s.prev_length = s.match_length;
      s.prev_match = s.match_start;
      s.match_length = MIN_MATCH - 1;
      if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
          s.match_length = MIN_MATCH - 1;
        }
      }
      if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
        max_insert = s.strstart + s.lookahead - MIN_MATCH;
        bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
        s.lookahead -= s.prev_length - 1;
        s.prev_length -= 2;
        do {
          if (++s.strstart <= max_insert) {
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
        } while (--s.prev_length !== 0);
        s.match_available = 0;
        s.match_length = MIN_MATCH - 1;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      } else if (s.match_available) {
        bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
        if (bflush) {
          flush_block_only(s, false);
        }
        s.strstart++;
        s.lookahead--;
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      } else {
        s.match_available = 1;
        s.strstart++;
        s.lookahead--;
      }
    }
    if (s.match_available) {
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
      s.match_available = 0;
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  var deflate_rle = (s, flush) => {
    let bflush;
    let prev;
    let scan, strend;
    const _win = s.window;
    for (; ; ) {
      if (s.lookahead <= MAX_MATCH) {
        fill_window(s);
        if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      s.match_length = 0;
      if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
        scan = s.strstart - 1;
        prev = _win[scan];
        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
          strend = s.strstart + MAX_MATCH;
          do {
          } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
          s.match_length = MAX_MATCH - (strend - scan);
          if (s.match_length > s.lookahead) {
            s.match_length = s.lookahead;
          }
        }
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        s.strstart += s.match_length;
        s.match_length = 0;
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  var deflate_huff = (s, flush) => {
    let bflush;
    for (; ; ) {
      if (s.lookahead === 0) {
        fill_window(s);
        if (s.lookahead === 0) {
          if (flush === Z_NO_FLUSH$2) {
            return BS_NEED_MORE;
          }
          break;
        }
      }
      s.match_length = 0;
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
  }
  var configuration_table = [
    /*      good lazy nice chain */
    new Config(0, 0, 0, 0, deflate_stored),
    /* 0 store only */
    new Config(4, 4, 8, 4, deflate_fast),
    /* 1 max speed, no lazy matches */
    new Config(4, 5, 16, 8, deflate_fast),
    /* 2 */
    new Config(4, 6, 32, 32, deflate_fast),
    /* 3 */
    new Config(4, 4, 16, 16, deflate_slow),
    /* 4 lazy matches */
    new Config(8, 16, 32, 32, deflate_slow),
    /* 5 */
    new Config(8, 16, 128, 128, deflate_slow),
    /* 6 */
    new Config(8, 32, 128, 256, deflate_slow),
    /* 7 */
    new Config(32, 128, 258, 1024, deflate_slow),
    /* 8 */
    new Config(32, 258, 258, 4096, deflate_slow)
    /* 9 max compression */
  ];
  var lm_init = (s) => {
    s.window_size = 2 * s.w_size;
    zero(s.head);
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    s.ins_h = 0;
  };
  function DeflateState() {
    this.strm = null;
    this.status = 0;
    this.pending_buf = null;
    this.pending_buf_size = 0;
    this.pending_out = 0;
    this.pending = 0;
    this.wrap = 0;
    this.gzhead = null;
    this.gzindex = 0;
    this.method = Z_DEFLATED$2;
    this.last_flush = -1;
    this.w_size = 0;
    this.w_bits = 0;
    this.w_mask = 0;
    this.window = null;
    this.window_size = 0;
    this.prev = null;
    this.head = null;
    this.ins_h = 0;
    this.hash_size = 0;
    this.hash_bits = 0;
    this.hash_mask = 0;
    this.hash_shift = 0;
    this.block_start = 0;
    this.match_length = 0;
    this.prev_match = 0;
    this.match_available = 0;
    this.strstart = 0;
    this.match_start = 0;
    this.lookahead = 0;
    this.prev_length = 0;
    this.max_chain_length = 0;
    this.max_lazy_match = 0;
    this.level = 0;
    this.strategy = 0;
    this.good_match = 0;
    this.nice_match = 0;
    this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
    this.dyn_dtree = new Uint16Array((2 * D_CODES + 1) * 2);
    this.bl_tree = new Uint16Array((2 * BL_CODES + 1) * 2);
    zero(this.dyn_ltree);
    zero(this.dyn_dtree);
    zero(this.bl_tree);
    this.l_desc = null;
    this.d_desc = null;
    this.bl_desc = null;
    this.bl_count = new Uint16Array(MAX_BITS + 1);
    this.heap = new Uint16Array(2 * L_CODES + 1);
    zero(this.heap);
    this.heap_len = 0;
    this.heap_max = 0;
    this.depth = new Uint16Array(2 * L_CODES + 1);
    zero(this.depth);
    this.sym_buf = 0;
    this.lit_bufsize = 0;
    this.sym_next = 0;
    this.sym_end = 0;
    this.opt_len = 0;
    this.static_len = 0;
    this.matches = 0;
    this.insert = 0;
    this.bi_buf = 0;
    this.bi_valid = 0;
  }
  var deflateStateCheck = (strm) => {
    if (!strm) {
      return 1;
    }
    const s = strm.state;
    if (!s || s.strm !== strm || s.status !== INIT_STATE && //#ifdef GZIP
    s.status !== GZIP_STATE && //#endif
    s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) {
      return 1;
    }
    return 0;
  };
  var deflateResetKeep = (strm) => {
    if (deflateStateCheck(strm)) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    strm.total_in = strm.total_out = 0;
    strm.data_type = Z_UNKNOWN;
    const s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) {
      s.wrap = -s.wrap;
    }
    s.status = //#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE : (
      //#endif
      s.wrap ? INIT_STATE : BUSY_STATE
    );
    strm.adler = s.wrap === 2 ? 0 : 1;
    s.last_flush = -2;
    _tr_init(s);
    return Z_OK$3;
  };
  var deflateReset = (strm) => {
    const ret = deflateResetKeep(strm);
    if (ret === Z_OK$3) {
      lm_init(strm.state);
    }
    return ret;
  };
  var deflateSetHeader = (strm, head) => {
    if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
      return Z_STREAM_ERROR$2;
    }
    strm.state.gzhead = head;
    return Z_OK$3;
  };
  var deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {
    if (!strm) {
      return Z_STREAM_ERROR$2;
    }
    let wrap = 1;
    if (level === Z_DEFAULT_COMPRESSION$1) {
      level = 6;
    }
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else if (windowBits > 15) {
      wrap = 2;
      windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || windowBits === 8 && wrap !== 1) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    if (windowBits === 8) {
      windowBits = 9;
    }
    const s = new DeflateState();
    strm.state = s;
    s.strm = strm;
    s.status = INIT_STATE;
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
    s.window = new Uint8Array(s.w_size * 2);
    s.head = new Uint16Array(s.hash_size);
    s.prev = new Uint16Array(s.w_size);
    s.lit_bufsize = 1 << memLevel + 6;
    s.pending_buf_size = s.lit_bufsize * 4;
    s.pending_buf = new Uint8Array(s.pending_buf_size);
    s.sym_buf = s.lit_bufsize;
    s.sym_end = (s.lit_bufsize - 1) * 3;
    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return deflateReset(strm);
  };
  var deflateInit = (strm, level) => {
    return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
  };
  var deflate$2 = (strm, flush) => {
    if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
      return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
    }
    const s = strm.state;
    if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH$3) {
      return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
    }
    const old_flush = s.last_flush;
    s.last_flush = flush;
    if (s.pending !== 0) {
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$3) {
      return err(strm, Z_BUF_ERROR$1);
    }
    if (s.status === FINISH_STATE && strm.avail_in !== 0) {
      return err(strm, Z_BUF_ERROR$1);
    }
    if (s.status === INIT_STATE && s.wrap === 0) {
      s.status = BUSY_STATE;
    }
    if (s.status === INIT_STATE) {
      let header = Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;
      let level_flags = -1;
      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= level_flags << 6;
      if (s.strstart !== 0) {
        header |= PRESET_DICT;
      }
      header += 31 - header % 31;
      putShortMSB(s, header);
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      strm.adler = 1;
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    if (s.status === GZIP_STATE) {
      strm.adler = 0;
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) {
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      } else {
        put_byte(
          s,
          (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
        );
        put_byte(s, s.gzhead.time & 255);
        put_byte(s, s.gzhead.time >> 8 & 255);
        put_byte(s, s.gzhead.time >> 16 & 255);
        put_byte(s, s.gzhead.time >> 24 & 255);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, s.gzhead.os & 255);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 255);
          put_byte(s, s.gzhead.extra.length >> 8 & 255);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    if (s.status === EXTRA_STATE) {
      if (s.gzhead.extra) {
        let beg = s.pending;
        let left = (s.gzhead.extra.length & 65535) - s.gzindex;
        while (s.pending + left > s.pending_buf_size) {
          let copy = s.pending_buf_size - s.pending;
          s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
          s.pending = s.pending_buf_size;
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          s.gzindex += copy;
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
          left -= copy;
        }
        let gzhead_extra = new Uint8Array(s.gzhead.extra);
        s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
        s.pending += left;
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        s.gzindex = 0;
      }
      s.status = NAME_STATE;
    }
    if (s.status === NAME_STATE) {
      if (s.gzhead.name) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        s.gzindex = 0;
      }
      s.status = COMMENT_STATE;
    }
    if (s.status === COMMENT_STATE) {
      if (s.gzhead.comment) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.comment.length) {
            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
      }
      s.status = HCRC_STATE;
    }
    if (s.status === HCRC_STATE) {
      if (s.gzhead.hcrc) {
        if (s.pending + 2 > s.pending_buf_size) {
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
        }
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        strm.adler = 0;
      }
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE) {
      let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
        s.status = FINISH_STATE;
      }
      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
        if (strm.avail_out === 0) {
          s.last_flush = -1;
        }
        return Z_OK$3;
      }
      if (bstate === BS_BLOCK_DONE) {
        if (flush === Z_PARTIAL_FLUSH) {
          _tr_align(s);
        } else if (flush !== Z_BLOCK$1) {
          _tr_stored_block(s, 0, 0, false);
          if (flush === Z_FULL_FLUSH$1) {
            zero(s.head);
            if (s.lookahead === 0) {
              s.strstart = 0;
              s.block_start = 0;
              s.insert = 0;
            }
          }
        }
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
    }
    if (flush !== Z_FINISH$3) {
      return Z_OK$3;
    }
    if (s.wrap <= 0) {
      return Z_STREAM_END$3;
    }
    if (s.wrap === 2) {
      put_byte(s, strm.adler & 255);
      put_byte(s, strm.adler >> 8 & 255);
      put_byte(s, strm.adler >> 16 & 255);
      put_byte(s, strm.adler >> 24 & 255);
      put_byte(s, strm.total_in & 255);
      put_byte(s, strm.total_in >> 8 & 255);
      put_byte(s, strm.total_in >> 16 & 255);
      put_byte(s, strm.total_in >> 24 & 255);
    } else {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 65535);
    }
    flush_pending(strm);
    if (s.wrap > 0) {
      s.wrap = -s.wrap;
    }
    return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
  };
  var deflateEnd = (strm) => {
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    const status = strm.state.status;
    strm.state = null;
    return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
  };
  var deflateSetDictionary = (strm, dictionary) => {
    let dictLength = dictionary.length;
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    const s = strm.state;
    const wrap = s.wrap;
    if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
      return Z_STREAM_ERROR$2;
    }
    if (wrap === 1) {
      strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
    }
    s.wrap = 0;
    if (dictLength >= s.w_size) {
      if (wrap === 0) {
        zero(s.head);
        s.strstart = 0;
        s.block_start = 0;
        s.insert = 0;
      }
      let tmpDict = new Uint8Array(s.w_size);
      tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
      dictionary = tmpDict;
      dictLength = s.w_size;
    }
    const avail = strm.avail_in;
    const next = strm.next_in;
    const input = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    fill_window(s);
    while (s.lookahead >= MIN_MATCH) {
      let str = s.strstart;
      let n = s.lookahead - (MIN_MATCH - 1);
      do {
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
      } while (--n);
      s.strstart = str;
      s.lookahead = MIN_MATCH - 1;
      fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input;
    strm.avail_in = avail;
    s.wrap = wrap;
    return Z_OK$3;
  };
  var deflateInit_1 = deflateInit;
  var deflateInit2_1 = deflateInit2;
  var deflateReset_1 = deflateReset;
  var deflateResetKeep_1 = deflateResetKeep;
  var deflateSetHeader_1 = deflateSetHeader;
  var deflate_2$1 = deflate$2;
  var deflateEnd_1 = deflateEnd;
  var deflateSetDictionary_1 = deflateSetDictionary;
  var deflateInfo = "pako deflate (from Nodeca project)";
  var deflate_1$2 = {
    deflateInit: deflateInit_1,
    deflateInit2: deflateInit2_1,
    deflateReset: deflateReset_1,
    deflateResetKeep: deflateResetKeep_1,
    deflateSetHeader: deflateSetHeader_1,
    deflate: deflate_2$1,
    deflateEnd: deflateEnd_1,
    deflateSetDictionary: deflateSetDictionary_1,
    deflateInfo
  };
  var _has = (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
  var assign = function(obj) {
    const sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      const source = sources.shift();
      if (!source) {
        continue;
      }
      if (typeof source !== "object") {
        throw new TypeError(source + "must be non-object");
      }
      for (const p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }
    return obj;
  };
  var flattenChunks = (chunks) => {
    let len = 0;
    for (let i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }
    const result = new Uint8Array(len);
    for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
      let chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  };
  var common = {
    assign,
    flattenChunks
  };
  var STR_APPLY_UIA_OK = true;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (__) {
    STR_APPLY_UIA_OK = false;
  }
  var _utf8len = new Uint8Array(256);
  for (let q = 0; q < 256; q++) {
    _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
  }
  _utf8len[254] = _utf8len[254] = 1;
  var string2buf = (str) => {
    if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) {
      return new TextEncoder().encode(str);
    }
    let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
    for (m_pos = 0; m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    }
    buf = new Uint8Array(buf_len);
    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      if (c < 128) {
        buf[i++] = c;
      } else if (c < 2048) {
        buf[i++] = 192 | c >>> 6;
        buf[i++] = 128 | c & 63;
      } else if (c < 65536) {
        buf[i++] = 224 | c >>> 12;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      } else {
        buf[i++] = 240 | c >>> 18;
        buf[i++] = 128 | c >>> 12 & 63;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      }
    }
    return buf;
  };
  var buf2binstring = (buf, len) => {
    if (len < 65534) {
      if (buf.subarray && STR_APPLY_UIA_OK) {
        return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
      }
    }
    let result = "";
    for (let i = 0; i < len; i++) {
      result += String.fromCharCode(buf[i]);
    }
    return result;
  };
  var buf2string = (buf, max) => {
    const len = max || buf.length;
    if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) {
      return new TextDecoder().decode(buf.subarray(0, max));
    }
    let i, out;
    const utf16buf = new Array(len * 2);
    for (out = 0, i = 0; i < len; ) {
      let c = buf[i++];
      if (c < 128) {
        utf16buf[out++] = c;
        continue;
      }
      let c_len = _utf8len[c];
      if (c_len > 4) {
        utf16buf[out++] = 65533;
        i += c_len - 1;
        continue;
      }
      c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
      while (c_len > 1 && i < len) {
        c = c << 6 | buf[i++] & 63;
        c_len--;
      }
      if (c_len > 1) {
        utf16buf[out++] = 65533;
        continue;
      }
      if (c < 65536) {
        utf16buf[out++] = c;
      } else {
        c -= 65536;
        utf16buf[out++] = 55296 | c >> 10 & 1023;
        utf16buf[out++] = 56320 | c & 1023;
      }
    }
    return buf2binstring(utf16buf, out);
  };
  var utf8border = (buf, max) => {
    max = max || buf.length;
    if (max > buf.length) {
      max = buf.length;
    }
    let pos = max - 1;
    while (pos >= 0 && (buf[pos] & 192) === 128) {
      pos--;
    }
    if (pos < 0) {
      return max;
    }
    if (pos === 0) {
      return max;
    }
    return pos + _utf8len[buf[pos]] > max ? pos : max;
  };
  var strings = {
    string2buf,
    buf2string,
    utf8border
  };
  function ZStream() {
    this.input = null;
    this.next_in = 0;
    this.avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this.next_out = 0;
    this.avail_out = 0;
    this.total_out = 0;
    this.msg = "";
    this.state = null;
    this.data_type = 2;
    this.adler = 0;
  }
  var zstream = ZStream;
  var toString$1 = Object.prototype.toString;
  var {
    Z_NO_FLUSH: Z_NO_FLUSH$1,
    Z_SYNC_FLUSH,
    Z_FULL_FLUSH,
    Z_FINISH: Z_FINISH$2,
    Z_OK: Z_OK$2,
    Z_STREAM_END: Z_STREAM_END$2,
    Z_DEFAULT_COMPRESSION,
    Z_DEFAULT_STRATEGY,
    Z_DEFLATED: Z_DEFLATED$1
  } = constants$2;
  function Deflate$1(options) {
    this.options = common.assign({
      level: Z_DEFAULT_COMPRESSION,
      method: Z_DEFLATED$1,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: Z_DEFAULT_STRATEGY
    }, options || {});
    let opt = this.options;
    if (opt.raw && opt.windowBits > 0) {
      opt.windowBits = -opt.windowBits;
    } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
      opt.windowBits += 16;
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream();
    this.strm.avail_out = 0;
    let status = deflate_1$2.deflateInit2(
      this.strm,
      opt.level,
      opt.method,
      opt.windowBits,
      opt.memLevel,
      opt.strategy
    );
    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }
    if (opt.header) {
      deflate_1$2.deflateSetHeader(this.strm, opt.header);
    }
    if (opt.dictionary) {
      let dict;
      if (typeof opt.dictionary === "string") {
        dict = strings.string2buf(opt.dictionary);
      } else if (toString$1.call(opt.dictionary) === "[object ArrayBuffer]") {
        dict = new Uint8Array(opt.dictionary);
      } else {
        dict = opt.dictionary;
      }
      status = deflate_1$2.deflateSetDictionary(this.strm, dict);
      if (status !== Z_OK$2) {
        throw new Error(messages[status]);
      }
      this._dict_set = true;
    }
  }
  Deflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    let status, _flush_mode;
    if (this.ended) {
      return false;
    }
    if (flush_mode === ~~flush_mode)
      _flush_mode = flush_mode;
    else
      _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;
    if (typeof data === "string") {
      strm.input = strings.string2buf(data);
    } else if (toString$1.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (; ; ) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      status = deflate_1$2.deflate(strm, _flush_mode);
      if (status === Z_STREAM_END$2) {
        if (strm.next_out > 0) {
          this.onData(strm.output.subarray(0, strm.next_out));
        }
        status = deflate_1$2.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK$2;
      }
      if (strm.avail_out === 0) {
        this.onData(strm.output);
        continue;
      }
      if (_flush_mode > 0 && strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      if (strm.avail_in === 0)
        break;
    }
    return true;
  };
  Deflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Deflate$1.prototype.onEnd = function(status) {
    if (status === Z_OK$2) {
      this.result = common.flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function deflate$1(input, options) {
    const deflator = new Deflate$1(options);
    deflator.push(input, true);
    if (deflator.err) {
      throw deflator.msg || messages[deflator.err];
    }
    return deflator.result;
  }
  function deflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return deflate$1(input, options);
  }
  function gzip$1(input, options) {
    options = options || {};
    options.gzip = true;
    return deflate$1(input, options);
  }
  var Deflate_1$1 = Deflate$1;
  var deflate_2 = deflate$1;
  var deflateRaw_1$1 = deflateRaw$1;
  var gzip_1$1 = gzip$1;
  var constants$1 = constants$2;
  var deflate_1$1 = {
    Deflate: Deflate_1$1,
    deflate: deflate_2,
    deflateRaw: deflateRaw_1$1,
    gzip: gzip_1$1,
    constants: constants$1
  };
  var BAD$1 = 16209;
  var TYPE$1 = 16191;
  var inffast = function inflate_fast(strm, start) {
    let _in;
    let last;
    let _out;
    let beg;
    let end;
    let dmax;
    let wsize;
    let whave;
    let wnext;
    let s_window;
    let hold;
    let bits;
    let lcode;
    let dcode;
    let lmask;
    let dmask;
    let here;
    let op;
    let len;
    let dist;
    let from;
    let from_source;
    let input, output;
    const state2 = strm.state;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    dmax = state2.dmax;
    wsize = state2.wsize;
    whave = state2.whave;
    wnext = state2.wnext;
    s_window = state2.window;
    hold = state2.hold;
    bits = state2.bits;
    lcode = state2.lencode;
    dcode = state2.distcode;
    lmask = (1 << state2.lenbits) - 1;
    dmask = (1 << state2.distbits) - 1;
    top:
      do {
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = lcode[hold & lmask];
        dolen:
          for (; ; ) {
            op = here >>> 24;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 255;
            if (op === 0) {
              output[_out++] = here & 65535;
            } else if (op & 16) {
              len = here & 65535;
              op &= 15;
              if (op) {
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                len += hold & (1 << op) - 1;
                hold >>>= op;
                bits -= op;
              }
              if (bits < 15) {
                hold += input[_in++] << bits;
                bits += 8;
                hold += input[_in++] << bits;
                bits += 8;
              }
              here = dcode[hold & dmask];
              dodist:
                for (; ; ) {
                  op = here >>> 24;
                  hold >>>= op;
                  bits -= op;
                  op = here >>> 16 & 255;
                  if (op & 16) {
                    dist = here & 65535;
                    op &= 15;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                      }
                    }
                    dist += hold & (1 << op) - 1;
                    if (dist > dmax) {
                      strm.msg = "invalid distance too far back";
                      state2.mode = BAD$1;
                      break top;
                    }
                    hold >>>= op;
                    bits -= op;
                    op = _out - beg;
                    if (dist > op) {
                      op = dist - op;
                      if (op > whave) {
                        if (state2.sane) {
                          strm.msg = "invalid distance too far back";
                          state2.mode = BAD$1;
                          break top;
                        }
                      }
                      from = 0;
                      from_source = s_window;
                      if (wnext === 0) {
                        from += wsize - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      } else if (wnext < op) {
                        from += wsize + wnext - op;
                        op -= wnext;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = 0;
                          if (wnext < len) {
                            op = wnext;
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                      } else {
                        from += wnext - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      }
                      while (len > 2) {
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        len -= 3;
                      }
                      if (len) {
                        output[_out++] = from_source[from++];
                        if (len > 1) {
                          output[_out++] = from_source[from++];
                        }
                      }
                    } else {
                      from = _out - dist;
                      do {
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        len -= 3;
                      } while (len > 2);
                      if (len) {
                        output[_out++] = output[from++];
                        if (len > 1) {
                          output[_out++] = output[from++];
                        }
                      }
                    }
                  } else if ((op & 64) === 0) {
                    here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                    continue dodist;
                  } else {
                    strm.msg = "invalid distance code";
                    state2.mode = BAD$1;
                    break top;
                  }
                  break;
                }
            } else if ((op & 64) === 0) {
              here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
              continue dolen;
            } else if (op & 32) {
              state2.mode = TYPE$1;
              break top;
            } else {
              strm.msg = "invalid literal/length code";
              state2.mode = BAD$1;
              break top;
            }
            break;
          }
      } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state2.hold = hold;
    state2.bits = bits;
    return;
  };
  var MAXBITS = 15;
  var ENOUGH_LENS$1 = 852;
  var ENOUGH_DISTS$1 = 592;
  var CODES$1 = 0;
  var LENS$1 = 1;
  var DISTS$1 = 2;
  var lbase = new Uint16Array([
    /* Length codes 257..285 base */
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ]);
  var lext = new Uint8Array([
    /* Length codes 257..285 extra */
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ]);
  var dbase = new Uint16Array([
    /* Distance codes 0..29 base */
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ]);
  var dext = new Uint8Array([
    /* Distance codes 0..29 extra */
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ]);
  var inflate_table = (type2, lens, lens_index, codes, table, table_index, work, opts) => {
    const bits = opts.bits;
    let len = 0;
    let sym = 0;
    let min = 0, max = 0;
    let root = 0;
    let curr = 0;
    let drop = 0;
    let left = 0;
    let used = 0;
    let huff = 0;
    let incr;
    let fill;
    let low;
    let mask;
    let next;
    let base = null;
    let match;
    const count = new Uint16Array(MAXBITS + 1);
    const offs = new Uint16Array(MAXBITS + 1);
    let extra = null;
    let here_bits, here_op, here_val;
    for (len = 0; len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0; sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }
    root = bits;
    for (max = MAXBITS; max >= 1; max--) {
      if (count[max] !== 0) {
        break;
      }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      opts.bits = 1;
      return 0;
    }
    for (min = 1; min < max; min++) {
      if (count[min] !== 0) {
        break;
      }
    }
    if (root < min) {
      root = min;
    }
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      }
    }
    if (left > 0 && (type2 === CODES$1 || max !== 1)) {
      return -1;
    }
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }
    for (sym = 0; sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }
    if (type2 === CODES$1) {
      base = extra = work;
      match = 20;
    } else if (type2 === LENS$1) {
      base = lbase;
      extra = lext;
      match = 257;
    } else {
      base = dbase;
      extra = dext;
      match = 0;
    }
    huff = 0;
    sym = 0;
    len = min;
    next = table_index;
    curr = root;
    drop = 0;
    low = -1;
    used = 1 << root;
    mask = used - 1;
    if (type2 === LENS$1 && used > ENOUGH_LENS$1 || type2 === DISTS$1 && used > ENOUGH_DISTS$1) {
      return 1;
    }
    for (; ; ) {
      here_bits = len - drop;
      if (work[sym] + 1 < match) {
        here_op = 0;
        here_val = work[sym];
      } else if (work[sym] >= match) {
        here_op = extra[work[sym] - match];
        here_val = base[work[sym] - match];
      } else {
        here_op = 32 + 64;
        here_val = 0;
      }
      incr = 1 << len - drop;
      fill = 1 << curr;
      min = fill;
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
      } while (fill !== 0);
      incr = 1 << len - 1;
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }
      sym++;
      if (--count[len] === 0) {
        if (len === max) {
          break;
        }
        len = lens[lens_index + work[sym]];
      }
      if (len > root && (huff & mask) !== low) {
        if (drop === 0) {
          drop = root;
        }
        next += min;
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) {
            break;
          }
          curr++;
          left <<= 1;
        }
        used += 1 << curr;
        if (type2 === LENS$1 && used > ENOUGH_LENS$1 || type2 === DISTS$1 && used > ENOUGH_DISTS$1) {
          return 1;
        }
        low = huff & mask;
        table[low] = root << 24 | curr << 16 | next - table_index | 0;
      }
    }
    if (huff !== 0) {
      table[next + huff] = len - drop << 24 | 64 << 16 | 0;
    }
    opts.bits = root;
    return 0;
  };
  var inftrees = inflate_table;
  var CODES = 0;
  var LENS = 1;
  var DISTS = 2;
  var {
    Z_FINISH: Z_FINISH$1,
    Z_BLOCK,
    Z_TREES,
    Z_OK: Z_OK$1,
    Z_STREAM_END: Z_STREAM_END$1,
    Z_NEED_DICT: Z_NEED_DICT$1,
    Z_STREAM_ERROR: Z_STREAM_ERROR$1,
    Z_DATA_ERROR: Z_DATA_ERROR$1,
    Z_MEM_ERROR: Z_MEM_ERROR$1,
    Z_BUF_ERROR,
    Z_DEFLATED
  } = constants$2;
  var HEAD = 16180;
  var FLAGS = 16181;
  var TIME = 16182;
  var OS = 16183;
  var EXLEN = 16184;
  var EXTRA = 16185;
  var NAME = 16186;
  var COMMENT = 16187;
  var HCRC = 16188;
  var DICTID = 16189;
  var DICT = 16190;
  var TYPE = 16191;
  var TYPEDO = 16192;
  var STORED = 16193;
  var COPY_ = 16194;
  var COPY = 16195;
  var TABLE = 16196;
  var LENLENS = 16197;
  var CODELENS = 16198;
  var LEN_ = 16199;
  var LEN = 16200;
  var LENEXT = 16201;
  var DIST = 16202;
  var DISTEXT = 16203;
  var MATCH = 16204;
  var LIT = 16205;
  var CHECK = 16206;
  var LENGTH = 16207;
  var DONE = 16208;
  var BAD = 16209;
  var MEM = 16210;
  var SYNC = 16211;
  var ENOUGH_LENS = 852;
  var ENOUGH_DISTS = 592;
  var MAX_WBITS = 15;
  var DEF_WBITS = MAX_WBITS;
  var zswap32 = (q) => {
    return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
  };
  function InflateState() {
    this.strm = null;
    this.mode = 0;
    this.last = false;
    this.wrap = 0;
    this.havedict = false;
    this.flags = 0;
    this.dmax = 0;
    this.check = 0;
    this.total = 0;
    this.head = null;
    this.wbits = 0;
    this.wsize = 0;
    this.whave = 0;
    this.wnext = 0;
    this.window = null;
    this.hold = 0;
    this.bits = 0;
    this.length = 0;
    this.offset = 0;
    this.extra = 0;
    this.lencode = null;
    this.distcode = null;
    this.lenbits = 0;
    this.distbits = 0;
    this.ncode = 0;
    this.nlen = 0;
    this.ndist = 0;
    this.have = 0;
    this.next = null;
    this.lens = new Uint16Array(320);
    this.work = new Uint16Array(288);
    this.lendyn = null;
    this.distdyn = null;
    this.sane = 0;
    this.back = 0;
    this.was = 0;
  }
  var inflateStateCheck = (strm) => {
    if (!strm) {
      return 1;
    }
    const state2 = strm.state;
    if (!state2 || state2.strm !== strm || state2.mode < HEAD || state2.mode > SYNC) {
      return 1;
    }
    return 0;
  };
  var inflateResetKeep = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state2 = strm.state;
    strm.total_in = strm.total_out = state2.total = 0;
    strm.msg = "";
    if (state2.wrap) {
      strm.adler = state2.wrap & 1;
    }
    state2.mode = HEAD;
    state2.last = 0;
    state2.havedict = 0;
    state2.flags = -1;
    state2.dmax = 32768;
    state2.head = null;
    state2.hold = 0;
    state2.bits = 0;
    state2.lencode = state2.lendyn = new Int32Array(ENOUGH_LENS);
    state2.distcode = state2.distdyn = new Int32Array(ENOUGH_DISTS);
    state2.sane = 1;
    state2.back = -1;
    return Z_OK$1;
  };
  var inflateReset = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state2 = strm.state;
    state2.wsize = 0;
    state2.whave = 0;
    state2.wnext = 0;
    return inflateResetKeep(strm);
  };
  var inflateReset2 = (strm, windowBits) => {
    let wrap;
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state2 = strm.state;
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else {
      wrap = (windowBits >> 4) + 5;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR$1;
    }
    if (state2.window !== null && state2.wbits !== windowBits) {
      state2.window = null;
    }
    state2.wrap = wrap;
    state2.wbits = windowBits;
    return inflateReset(strm);
  };
  var inflateInit2 = (strm, windowBits) => {
    if (!strm) {
      return Z_STREAM_ERROR$1;
    }
    const state2 = new InflateState();
    strm.state = state2;
    state2.strm = strm;
    state2.window = null;
    state2.mode = HEAD;
    const ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK$1) {
      strm.state = null;
    }
    return ret;
  };
  var inflateInit = (strm) => {
    return inflateInit2(strm, DEF_WBITS);
  };
  var virgin = true;
  var lenfix;
  var distfix;
  var fixedtables = (state2) => {
    if (virgin) {
      lenfix = new Int32Array(512);
      distfix = new Int32Array(32);
      let sym = 0;
      while (sym < 144) {
        state2.lens[sym++] = 8;
      }
      while (sym < 256) {
        state2.lens[sym++] = 9;
      }
      while (sym < 280) {
        state2.lens[sym++] = 7;
      }
      while (sym < 288) {
        state2.lens[sym++] = 8;
      }
      inftrees(LENS, state2.lens, 0, 288, lenfix, 0, state2.work, { bits: 9 });
      sym = 0;
      while (sym < 32) {
        state2.lens[sym++] = 5;
      }
      inftrees(DISTS, state2.lens, 0, 32, distfix, 0, state2.work, { bits: 5 });
      virgin = false;
    }
    state2.lencode = lenfix;
    state2.lenbits = 9;
    state2.distcode = distfix;
    state2.distbits = 5;
  };
  var updatewindow = (strm, src, end, copy) => {
    let dist;
    const state2 = strm.state;
    if (state2.window === null) {
      state2.wsize = 1 << state2.wbits;
      state2.wnext = 0;
      state2.whave = 0;
      state2.window = new Uint8Array(state2.wsize);
    }
    if (copy >= state2.wsize) {
      state2.window.set(src.subarray(end - state2.wsize, end), 0);
      state2.wnext = 0;
      state2.whave = state2.wsize;
    } else {
      dist = state2.wsize - state2.wnext;
      if (dist > copy) {
        dist = copy;
      }
      state2.window.set(src.subarray(end - copy, end - copy + dist), state2.wnext);
      copy -= dist;
      if (copy) {
        state2.window.set(src.subarray(end - copy, end), 0);
        state2.wnext = copy;
        state2.whave = state2.wsize;
      } else {
        state2.wnext += dist;
        if (state2.wnext === state2.wsize) {
          state2.wnext = 0;
        }
        if (state2.whave < state2.wsize) {
          state2.whave += dist;
        }
      }
    }
    return 0;
  };
  var inflate$2 = (strm, flush) => {
    let state2;
    let input, output;
    let next;
    let put;
    let have, left;
    let hold;
    let bits;
    let _in, _out;
    let copy;
    let from;
    let from_source;
    let here = 0;
    let here_bits, here_op, here_val;
    let last_bits, last_op, last_val;
    let len;
    let ret;
    const hbuf = new Uint8Array(4);
    let opts;
    let n;
    const order = (
      /* permutation of code lengths */
      new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
    );
    if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
      return Z_STREAM_ERROR$1;
    }
    state2 = strm.state;
    if (state2.mode === TYPE) {
      state2.mode = TYPEDO;
    }
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state2.hold;
    bits = state2.bits;
    _in = have;
    _out = left;
    ret = Z_OK$1;
    inf_leave:
      for (; ; ) {
        switch (state2.mode) {
          case HEAD:
            if (state2.wrap === 0) {
              state2.mode = TYPEDO;
              break;
            }
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state2.wrap & 2 && hold === 35615) {
              if (state2.wbits === 0) {
                state2.wbits = 15;
              }
              state2.check = 0;
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state2.check = crc32_1(state2.check, hbuf, 2, 0);
              hold = 0;
              bits = 0;
              state2.mode = FLAGS;
              break;
            }
            if (state2.head) {
              state2.head.done = false;
            }
            if (!(state2.wrap & 1) || /* check if zlib header allowed */
            (((hold & 255) << 8) + (hold >> 8)) % 31) {
              strm.msg = "incorrect header check";
              state2.mode = BAD;
              break;
            }
            if ((hold & 15) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state2.mode = BAD;
              break;
            }
            hold >>>= 4;
            bits -= 4;
            len = (hold & 15) + 8;
            if (state2.wbits === 0) {
              state2.wbits = len;
            }
            if (len > 15 || len > state2.wbits) {
              strm.msg = "invalid window size";
              state2.mode = BAD;
              break;
            }
            state2.dmax = 1 << state2.wbits;
            state2.flags = 0;
            strm.adler = state2.check = 1;
            state2.mode = hold & 512 ? DICTID : TYPE;
            hold = 0;
            bits = 0;
            break;
          case FLAGS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state2.flags = hold;
            if ((state2.flags & 255) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state2.mode = BAD;
              break;
            }
            if (state2.flags & 57344) {
              strm.msg = "unknown header flags set";
              state2.mode = BAD;
              break;
            }
            if (state2.head) {
              state2.head.text = hold >> 8 & 1;
            }
            if (state2.flags & 512 && state2.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state2.check = crc32_1(state2.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state2.mode = TIME;
          case TIME:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state2.head) {
              state2.head.time = hold;
            }
            if (state2.flags & 512 && state2.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              hbuf[2] = hold >>> 16 & 255;
              hbuf[3] = hold >>> 24 & 255;
              state2.check = crc32_1(state2.check, hbuf, 4, 0);
            }
            hold = 0;
            bits = 0;
            state2.mode = OS;
          case OS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state2.head) {
              state2.head.xflags = hold & 255;
              state2.head.os = hold >> 8;
            }
            if (state2.flags & 512 && state2.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state2.check = crc32_1(state2.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state2.mode = EXLEN;
          case EXLEN:
            if (state2.flags & 1024) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state2.length = hold;
              if (state2.head) {
                state2.head.extra_len = hold;
              }
              if (state2.flags & 512 && state2.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state2.check = crc32_1(state2.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
            } else if (state2.head) {
              state2.head.extra = null;
            }
            state2.mode = EXTRA;
          case EXTRA:
            if (state2.flags & 1024) {
              copy = state2.length;
              if (copy > have) {
                copy = have;
              }
              if (copy) {
                if (state2.head) {
                  len = state2.head.extra_len - state2.length;
                  if (!state2.head.extra) {
                    state2.head.extra = new Uint8Array(state2.head.extra_len);
                  }
                  state2.head.extra.set(
                    input.subarray(
                      next,
                      // extra field is limited to 65536 bytes
                      // - no need for additional size check
                      next + copy
                    ),
                    /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                    len
                  );
                }
                if (state2.flags & 512 && state2.wrap & 4) {
                  state2.check = crc32_1(state2.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                state2.length -= copy;
              }
              if (state2.length) {
                break inf_leave;
              }
            }
            state2.length = 0;
            state2.mode = NAME;
          case NAME:
            if (state2.flags & 2048) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state2.head && len && state2.length < 65536) {
                  state2.head.name += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state2.flags & 512 && state2.wrap & 4) {
                state2.check = crc32_1(state2.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state2.head) {
              state2.head.name = null;
            }
            state2.length = 0;
            state2.mode = COMMENT;
          case COMMENT:
            if (state2.flags & 4096) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state2.head && len && state2.length < 65536) {
                  state2.head.comment += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state2.flags & 512 && state2.wrap & 4) {
                state2.check = crc32_1(state2.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state2.head) {
              state2.head.comment = null;
            }
            state2.mode = HCRC;
          case HCRC:
            if (state2.flags & 512) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state2.wrap & 4 && hold !== (state2.check & 65535)) {
                strm.msg = "header crc mismatch";
                state2.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            if (state2.head) {
              state2.head.hcrc = state2.flags >> 9 & 1;
              state2.head.done = true;
            }
            strm.adler = state2.check = 0;
            state2.mode = TYPE;
            break;
          case DICTID:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            strm.adler = state2.check = zswap32(hold);
            hold = 0;
            bits = 0;
            state2.mode = DICT;
          case DICT:
            if (state2.havedict === 0) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state2.hold = hold;
              state2.bits = bits;
              return Z_NEED_DICT$1;
            }
            strm.adler = state2.check = 1;
            state2.mode = TYPE;
          case TYPE:
            if (flush === Z_BLOCK || flush === Z_TREES) {
              break inf_leave;
            }
          case TYPEDO:
            if (state2.last) {
              hold >>>= bits & 7;
              bits -= bits & 7;
              state2.mode = CHECK;
              break;
            }
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state2.last = hold & 1;
            hold >>>= 1;
            bits -= 1;
            switch (hold & 3) {
              case 0:
                state2.mode = STORED;
                break;
              case 1:
                fixedtables(state2);
                state2.mode = LEN_;
                if (flush === Z_TREES) {
                  hold >>>= 2;
                  bits -= 2;
                  break inf_leave;
                }
                break;
              case 2:
                state2.mode = TABLE;
                break;
              case 3:
                strm.msg = "invalid block type";
                state2.mode = BAD;
            }
            hold >>>= 2;
            bits -= 2;
            break;
          case STORED:
            hold >>>= bits & 7;
            bits -= bits & 7;
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
              strm.msg = "invalid stored block lengths";
              state2.mode = BAD;
              break;
            }
            state2.length = hold & 65535;
            hold = 0;
            bits = 0;
            state2.mode = COPY_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case COPY_:
            state2.mode = COPY;
          case COPY:
            copy = state2.length;
            if (copy) {
              if (copy > have) {
                copy = have;
              }
              if (copy > left) {
                copy = left;
              }
              if (copy === 0) {
                break inf_leave;
              }
              output.set(input.subarray(next, next + copy), put);
              have -= copy;
              next += copy;
              left -= copy;
              put += copy;
              state2.length -= copy;
              break;
            }
            state2.mode = TYPE;
            break;
          case TABLE:
            while (bits < 14) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state2.nlen = (hold & 31) + 257;
            hold >>>= 5;
            bits -= 5;
            state2.ndist = (hold & 31) + 1;
            hold >>>= 5;
            bits -= 5;
            state2.ncode = (hold & 15) + 4;
            hold >>>= 4;
            bits -= 4;
            if (state2.nlen > 286 || state2.ndist > 30) {
              strm.msg = "too many length or distance symbols";
              state2.mode = BAD;
              break;
            }
            state2.have = 0;
            state2.mode = LENLENS;
          case LENLENS:
            while (state2.have < state2.ncode) {
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state2.lens[order[state2.have++]] = hold & 7;
              hold >>>= 3;
              bits -= 3;
            }
            while (state2.have < 19) {
              state2.lens[order[state2.have++]] = 0;
            }
            state2.lencode = state2.lendyn;
            state2.lenbits = 7;
            opts = { bits: state2.lenbits };
            ret = inftrees(CODES, state2.lens, 0, 19, state2.lencode, 0, state2.work, opts);
            state2.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid code lengths set";
              state2.mode = BAD;
              break;
            }
            state2.have = 0;
            state2.mode = CODELENS;
          case CODELENS:
            while (state2.have < state2.nlen + state2.ndist) {
              for (; ; ) {
                here = state2.lencode[hold & (1 << state2.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_val < 16) {
                hold >>>= here_bits;
                bits -= here_bits;
                state2.lens[state2.have++] = here_val;
              } else {
                if (here_val === 16) {
                  n = here_bits + 2;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  if (state2.have === 0) {
                    strm.msg = "invalid bit length repeat";
                    state2.mode = BAD;
                    break;
                  }
                  len = state2.lens[state2.have - 1];
                  copy = 3 + (hold & 3);
                  hold >>>= 2;
                  bits -= 2;
                } else if (here_val === 17) {
                  n = here_bits + 3;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 3 + (hold & 7);
                  hold >>>= 3;
                  bits -= 3;
                } else {
                  n = here_bits + 7;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 11 + (hold & 127);
                  hold >>>= 7;
                  bits -= 7;
                }
                if (state2.have + copy > state2.nlen + state2.ndist) {
                  strm.msg = "invalid bit length repeat";
                  state2.mode = BAD;
                  break;
                }
                while (copy--) {
                  state2.lens[state2.have++] = len;
                }
              }
            }
            if (state2.mode === BAD) {
              break;
            }
            if (state2.lens[256] === 0) {
              strm.msg = "invalid code -- missing end-of-block";
              state2.mode = BAD;
              break;
            }
            state2.lenbits = 9;
            opts = { bits: state2.lenbits };
            ret = inftrees(LENS, state2.lens, 0, state2.nlen, state2.lencode, 0, state2.work, opts);
            state2.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid literal/lengths set";
              state2.mode = BAD;
              break;
            }
            state2.distbits = 6;
            state2.distcode = state2.distdyn;
            opts = { bits: state2.distbits };
            ret = inftrees(DISTS, state2.lens, state2.nlen, state2.ndist, state2.distcode, 0, state2.work, opts);
            state2.distbits = opts.bits;
            if (ret) {
              strm.msg = "invalid distances set";
              state2.mode = BAD;
              break;
            }
            state2.mode = LEN_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case LEN_:
            state2.mode = LEN;
          case LEN:
            if (have >= 6 && left >= 258) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state2.hold = hold;
              state2.bits = bits;
              inffast(strm, _out);
              put = strm.next_out;
              output = strm.output;
              left = strm.avail_out;
              next = strm.next_in;
              input = strm.input;
              have = strm.avail_in;
              hold = state2.hold;
              bits = state2.bits;
              if (state2.mode === TYPE) {
                state2.back = -1;
              }
              break;
            }
            state2.back = 0;
            for (; ; ) {
              here = state2.lencode[hold & (1 << state2.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_op && (here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state2.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state2.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state2.back += here_bits;
            state2.length = here_val;
            if (here_op === 0) {
              state2.mode = LIT;
              break;
            }
            if (here_op & 32) {
              state2.back = -1;
              state2.mode = TYPE;
              break;
            }
            if (here_op & 64) {
              strm.msg = "invalid literal/length code";
              state2.mode = BAD;
              break;
            }
            state2.extra = here_op & 15;
            state2.mode = LENEXT;
          case LENEXT:
            if (state2.extra) {
              n = state2.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state2.length += hold & (1 << state2.extra) - 1;
              hold >>>= state2.extra;
              bits -= state2.extra;
              state2.back += state2.extra;
            }
            state2.was = state2.length;
            state2.mode = DIST;
          case DIST:
            for (; ; ) {
              here = state2.distcode[hold & (1 << state2.distbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state2.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state2.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state2.back += here_bits;
            if (here_op & 64) {
              strm.msg = "invalid distance code";
              state2.mode = BAD;
              break;
            }
            state2.offset = here_val;
            state2.extra = here_op & 15;
            state2.mode = DISTEXT;
          case DISTEXT:
            if (state2.extra) {
              n = state2.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state2.offset += hold & (1 << state2.extra) - 1;
              hold >>>= state2.extra;
              bits -= state2.extra;
              state2.back += state2.extra;
            }
            if (state2.offset > state2.dmax) {
              strm.msg = "invalid distance too far back";
              state2.mode = BAD;
              break;
            }
            state2.mode = MATCH;
          case MATCH:
            if (left === 0) {
              break inf_leave;
            }
            copy = _out - left;
            if (state2.offset > copy) {
              copy = state2.offset - copy;
              if (copy > state2.whave) {
                if (state2.sane) {
                  strm.msg = "invalid distance too far back";
                  state2.mode = BAD;
                  break;
                }
              }
              if (copy > state2.wnext) {
                copy -= state2.wnext;
                from = state2.wsize - copy;
              } else {
                from = state2.wnext - copy;
              }
              if (copy > state2.length) {
                copy = state2.length;
              }
              from_source = state2.window;
            } else {
              from_source = output;
              from = put - state2.offset;
              copy = state2.length;
            }
            if (copy > left) {
              copy = left;
            }
            left -= copy;
            state2.length -= copy;
            do {
              output[put++] = from_source[from++];
            } while (--copy);
            if (state2.length === 0) {
              state2.mode = LEN;
            }
            break;
          case LIT:
            if (left === 0) {
              break inf_leave;
            }
            output[put++] = state2.length;
            left--;
            state2.mode = LEN;
            break;
          case CHECK:
            if (state2.wrap) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold |= input[next++] << bits;
                bits += 8;
              }
              _out -= left;
              strm.total_out += _out;
              state2.total += _out;
              if (state2.wrap & 4 && _out) {
                strm.adler = state2.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
                state2.flags ? crc32_1(state2.check, output, _out, put - _out) : adler32_1(state2.check, output, _out, put - _out);
              }
              _out = left;
              if (state2.wrap & 4 && (state2.flags ? hold : zswap32(hold)) !== state2.check) {
                strm.msg = "incorrect data check";
                state2.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state2.mode = LENGTH;
          case LENGTH:
            if (state2.wrap && state2.flags) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state2.wrap & 4 && hold !== (state2.total & 4294967295)) {
                strm.msg = "incorrect length check";
                state2.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state2.mode = DONE;
          case DONE:
            ret = Z_STREAM_END$1;
            break inf_leave;
          case BAD:
            ret = Z_DATA_ERROR$1;
            break inf_leave;
          case MEM:
            return Z_MEM_ERROR$1;
          case SYNC:
          default:
            return Z_STREAM_ERROR$1;
        }
      }
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state2.hold = hold;
    state2.bits = bits;
    if (state2.wsize || _out !== strm.avail_out && state2.mode < BAD && (state2.mode < CHECK || flush !== Z_FINISH$1)) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out))
        ;
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state2.total += _out;
    if (state2.wrap & 4 && _out) {
      strm.adler = state2.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      state2.flags ? crc32_1(state2.check, output, _out, strm.next_out - _out) : adler32_1(state2.check, output, _out, strm.next_out - _out);
    }
    strm.data_type = state2.bits + (state2.last ? 64 : 0) + (state2.mode === TYPE ? 128 : 0) + (state2.mode === LEN_ || state2.mode === COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
      ret = Z_BUF_ERROR;
    }
    return ret;
  };
  var inflateEnd = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    let state2 = strm.state;
    if (state2.window) {
      state2.window = null;
    }
    strm.state = null;
    return Z_OK$1;
  };
  var inflateGetHeader = (strm, head) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state2 = strm.state;
    if ((state2.wrap & 2) === 0) {
      return Z_STREAM_ERROR$1;
    }
    state2.head = head;
    head.done = false;
    return Z_OK$1;
  };
  var inflateSetDictionary = (strm, dictionary) => {
    const dictLength = dictionary.length;
    let state2;
    let dictid;
    let ret;
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    state2 = strm.state;
    if (state2.wrap !== 0 && state2.mode !== DICT) {
      return Z_STREAM_ERROR$1;
    }
    if (state2.mode === DICT) {
      dictid = 1;
      dictid = adler32_1(dictid, dictionary, dictLength, 0);
      if (dictid !== state2.check) {
        return Z_DATA_ERROR$1;
      }
    }
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state2.mode = MEM;
      return Z_MEM_ERROR$1;
    }
    state2.havedict = 1;
    return Z_OK$1;
  };
  var inflateReset_1 = inflateReset;
  var inflateReset2_1 = inflateReset2;
  var inflateResetKeep_1 = inflateResetKeep;
  var inflateInit_1 = inflateInit;
  var inflateInit2_1 = inflateInit2;
  var inflate_2$1 = inflate$2;
  var inflateEnd_1 = inflateEnd;
  var inflateGetHeader_1 = inflateGetHeader;
  var inflateSetDictionary_1 = inflateSetDictionary;
  var inflateInfo = "pako inflate (from Nodeca project)";
  var inflate_1$2 = {
    inflateReset: inflateReset_1,
    inflateReset2: inflateReset2_1,
    inflateResetKeep: inflateResetKeep_1,
    inflateInit: inflateInit_1,
    inflateInit2: inflateInit2_1,
    inflate: inflate_2$1,
    inflateEnd: inflateEnd_1,
    inflateGetHeader: inflateGetHeader_1,
    inflateSetDictionary: inflateSetDictionary_1,
    inflateInfo
  };
  function GZheader() {
    this.text = 0;
    this.time = 0;
    this.xflags = 0;
    this.os = 0;
    this.extra = null;
    this.extra_len = 0;
    this.name = "";
    this.comment = "";
    this.hcrc = 0;
    this.done = false;
  }
  var gzheader = GZheader;
  var toString = Object.prototype.toString;
  var {
    Z_NO_FLUSH,
    Z_FINISH,
    Z_OK,
    Z_STREAM_END,
    Z_NEED_DICT,
    Z_STREAM_ERROR,
    Z_DATA_ERROR,
    Z_MEM_ERROR
  } = constants$2;
  function Inflate$1(options) {
    this.options = common.assign({
      chunkSize: 1024 * 64,
      windowBits: 15,
      to: ""
    }, options || {});
    const opt = this.options;
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) {
        opt.windowBits = -15;
      }
    }
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
      opt.windowBits += 32;
    }
    if (opt.windowBits > 15 && opt.windowBits < 48) {
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream();
    this.strm.avail_out = 0;
    let status = inflate_1$2.inflateInit2(
      this.strm,
      opt.windowBits
    );
    if (status !== Z_OK) {
      throw new Error(messages[status]);
    }
    this.header = new gzheader();
    inflate_1$2.inflateGetHeader(this.strm, this.header);
    if (opt.dictionary) {
      if (typeof opt.dictionary === "string") {
        opt.dictionary = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) {
        status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== Z_OK) {
          throw new Error(messages[status]);
        }
      }
    }
  }
  Inflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    const dictionary = this.options.dictionary;
    let status, _flush_mode, last_avail_out;
    if (this.ended)
      return false;
    if (flush_mode === ~~flush_mode)
      _flush_mode = flush_mode;
    else
      _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
    if (toString.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (; ; ) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      status = inflate_1$2.inflate(strm, _flush_mode);
      if (status === Z_NEED_DICT && dictionary) {
        status = inflate_1$2.inflateSetDictionary(strm, dictionary);
        if (status === Z_OK) {
          status = inflate_1$2.inflate(strm, _flush_mode);
        } else if (status === Z_DATA_ERROR) {
          status = Z_NEED_DICT;
        }
      }
      while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {
        inflate_1$2.inflateReset(strm);
        status = inflate_1$2.inflate(strm, _flush_mode);
      }
      switch (status) {
        case Z_STREAM_ERROR:
        case Z_DATA_ERROR:
        case Z_NEED_DICT:
        case Z_MEM_ERROR:
          this.onEnd(status);
          this.ended = true;
          return false;
      }
      last_avail_out = strm.avail_out;
      if (strm.next_out) {
        if (strm.avail_out === 0 || status === Z_STREAM_END) {
          if (this.options.to === "string") {
            let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
            let tail = strm.next_out - next_out_utf8;
            let utf8str = strings.buf2string(strm.output, next_out_utf8);
            strm.next_out = tail;
            strm.avail_out = chunkSize - tail;
            if (tail)
              strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
            this.onData(utf8str);
          } else {
            this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
          }
        }
      }
      if (status === Z_OK && last_avail_out === 0)
        continue;
      if (status === Z_STREAM_END) {
        status = inflate_1$2.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return true;
      }
      if (strm.avail_in === 0)
        break;
    }
    return true;
  };
  Inflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Inflate$1.prototype.onEnd = function(status) {
    if (status === Z_OK) {
      if (this.options.to === "string") {
        this.result = this.chunks.join("");
      } else {
        this.result = common.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function inflate$1(input, options) {
    const inflator = new Inflate$1(options);
    inflator.push(input);
    if (inflator.err)
      throw inflator.msg || messages[inflator.err];
    return inflator.result;
  }
  function inflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return inflate$1(input, options);
  }
  var Inflate_1$1 = Inflate$1;
  var inflate_2 = inflate$1;
  var inflateRaw_1$1 = inflateRaw$1;
  var ungzip$1 = inflate$1;
  var constants2 = constants$2;
  var inflate_1$1 = {
    Inflate: Inflate_1$1,
    inflate: inflate_2,
    inflateRaw: inflateRaw_1$1,
    ungzip: ungzip$1,
    constants: constants2
  };
  var { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;
  var { Inflate, inflate, inflateRaw, ungzip } = inflate_1$1;
  var Deflate_1 = Deflate;
  var deflate_1 = deflate;
  var deflateRaw_1 = deflateRaw;
  var gzip_1 = gzip;
  var Inflate_1 = Inflate;
  var inflate_1 = inflate;
  var inflateRaw_1 = inflateRaw;
  var ungzip_1 = ungzip;
  var constants_1 = constants$2;
  var pako = {
    Deflate: Deflate_1,
    deflate: deflate_1,
    deflateRaw: deflateRaw_1,
    gzip: gzip_1,
    Inflate: Inflate_1,
    inflate: inflate_1,
    inflateRaw: inflateRaw_1,
    ungzip: ungzip_1,
    constants: constants_1
  };

  // packages/shim/src/node/zlib.js
  var constants3 = {
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    Z_VERSION_ERROR: -6,
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    Z_DEFAULT_WINDOWBITS: 15,
    Z_DEFAULT_MEMLEVEL: 8
  };
  function toUint8Array(buf) {
    if (buf instanceof Uint8Array) {
      return buf;
    }
    if (typeof buf === "string") {
      return new TextEncoder().encode(buf);
    }
    if (buf instanceof ArrayBuffer) {
      return new Uint8Array(buf);
    }
    if (ArrayBuffer.isView(buf)) {
      return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
    }
    return new Uint8Array(buf);
  }
  function wrapAsync(syncFn) {
    return function(buf, optionsOrCb, cb) {
      if (typeof optionsOrCb === "function") {
        cb = optionsOrCb;
        optionsOrCb = {};
      }
      try {
        const result = syncFn(buf, optionsOrCb || {});
        if (cb) {
          queueMicrotask(() => cb(null, result));
        }
      } catch (e) {
        if (cb) {
          queueMicrotask(() => cb(e));
        }
      }
    };
  }
  function deflateSync(buf, options) {
    return pako.deflate(toUint8Array(buf), options);
  }
  function inflateSync(buf, options) {
    return pako.inflate(toUint8Array(buf), options);
  }
  function deflateRawSync(buf, options) {
    return pako.deflateRaw(toUint8Array(buf), options);
  }
  function inflateRawSync(buf, options) {
    return pako.inflateRaw(toUint8Array(buf), options);
  }
  function gzipSync(buf, options) {
    return pako.gzip(toUint8Array(buf), options);
  }
  function gunzipSync(buf, options) {
    return pako.ungzip(toUint8Array(buf), options);
  }
  function unzipSync(buf, options) {
    return pako.ungzip(toUint8Array(buf), options);
  }
  var deflate2 = wrapAsync(deflateSync);
  var inflate2 = wrapAsync(inflateSync);
  var deflateRaw2 = wrapAsync(deflateRawSync);
  var inflateRaw2 = wrapAsync(inflateRawSync);
  var gzip2 = wrapAsync(gzipSync);
  var gunzip = wrapAsync(gunzipSync);
  var unzip = wrapAsync(unzipSync);
  function notImplemented(name) {
    return function() {
      throw new Error(
        `zlib.${name}() streaming is not yet implemented. Use the sync/callback variants instead.`
      );
    };
  }
  var createDeflate = notImplemented("createDeflate");
  var createInflate = notImplemented("createInflate");
  var createDeflateRaw = notImplemented("createDeflateRaw");
  var createInflateRaw = notImplemented("createInflateRaw");
  var createGzip = notImplemented("createGzip");
  var createGunzip = notImplemented("createGunzip");
  var createUnzip = notImplemented("createUnzip");

  // packages/shim/src/require.js
  var utilShim = __toESM(require_util());

  // packages/shim/src/node/constants.js
  var constantsShim = {
    // File access checks (fs.access mode).
    F_OK: 0,
    X_OK: 1,
    W_OK: 2,
    R_OK: 4,
    // open() flags.
    O_RDONLY: 0,
    O_WRONLY: 1,
    O_RDWR: 2,
    O_CREAT: 64,
    O_EXCL: 128,
    O_NOCTTY: 256,
    O_TRUNC: 512,
    O_APPEND: 1024,
    O_DIRECTORY: 65536,
    O_NOATIME: 262144,
    O_NOFOLLOW: 131072,
    O_SYNC: 1052672,
    O_DSYNC: 4096,
    O_NONBLOCK: 2048,
    // File type bits (st_mode & S_IFMT).
    S_IFMT: 61440,
    S_IFREG: 32768,
    S_IFDIR: 16384,
    S_IFCHR: 8192,
    S_IFBLK: 24576,
    S_IFIFO: 4096,
    S_IFLNK: 40960,
    S_IFSOCK: 49152,
    // Permission bits.
    S_IRWXU: 448,
    S_IRUSR: 256,
    S_IWUSR: 128,
    S_IXUSR: 64,
    S_IRWXG: 56,
    S_IRGRP: 32,
    S_IWGRP: 16,
    S_IXGRP: 8,
    S_IRWXO: 7,
    S_IROTH: 4,
    S_IWOTH: 2,
    S_IXOTH: 1
  };

  // packages/shim/src/node/assert.js
  var AssertionError = class extends Error {
    constructor(message) {
      super(message || "Assertion failed");
      this.name = "AssertionError";
    }
  };
  function assert(value, message) {
    if (!value) {
      throw new AssertionError(message);
    }
  }
  assert.AssertionError = AssertionError;
  assert.ok = assert;
  assert.strict = assert;
  assert.fail = function(message) {
    throw new AssertionError(message || "Failed");
  };
  assert.equal = function(actual, expected, message) {
    if (actual != expected) {
      throw new AssertionError(message || `${actual} == ${expected}`);
    }
  };
  assert.notEqual = function(actual, expected, message) {
    if (actual == expected) {
      throw new AssertionError(message || `${actual} != ${expected}`);
    }
  };
  assert.strictEqual = function(actual, expected, message) {
    if (actual !== expected) {
      throw new AssertionError(message || `${actual} === ${expected}`);
    }
  };
  assert.notStrictEqual = function(actual, expected, message) {
    if (actual === expected) {
      throw new AssertionError(message || `${actual} !== ${expected}`);
    }
  };
  assert.deepEqual = function(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new AssertionError(message || "deepEqual");
    }
  };
  assert.deepStrictEqual = assert.deepEqual;
  assert.throws = function(fn, message) {
    let threw = false;
    try {
      fn();
    } catch {
      threw = true;
    }
    if (!threw) {
      throw new AssertionError(message || "Missing expected exception");
    }
  };
  assert.doesNotThrow = function(fn, message) {
    try {
      fn();
    } catch (e) {
      throw new AssertionError(message || `Got unwanted exception: ${e.message}`);
    }
  };
  assert.ifError = function(value) {
    if (value) {
      throw new AssertionError(`ifError got unwanted exception: ${value}`);
    }
  };
  var assertShim = assert;

  // packages/shim/src/node/stream.js
  var stream_exports = {};
  __export(stream_exports, {
    Duplex: () => Duplex,
    PassThrough: () => PassThrough,
    Readable: () => Readable,
    Stream: () => Stream,
    Transform: () => Transform,
    Writable: () => Writable
  });
  var warned2 = false;
  function warnNoDataFlow(method) {
    if (warned2) {
      return;
    }
    warned2 = true;
    console.warn(
      `[shim:stream] ${method}() called, but stream data flow is not implemented. This plugin needs the full stream shim.`
    );
  }
  var Stream = class extends EventEmitter {
    pipe(destination) {
      warnNoDataFlow("pipe");
      return destination;
    }
  };
  var Readable = class extends Stream {
    constructor(options) {
      super();
      this.readable = true;
      this._readableState = { options: options || {} };
    }
    read() {
      warnNoDataFlow("read");
      return null;
    }
    push() {
      warnNoDataFlow("push");
      return false;
    }
    _read() {
    }
  };
  var Writable = class extends Stream {
    constructor(options) {
      super();
      this.writable = true;
      this._writableState = { options: options || {} };
    }
    write() {
      warnNoDataFlow("write");
      return false;
    }
    end() {
      warnNoDataFlow("end");
      return this;
    }
    _write() {
    }
  };
  var Duplex = class extends Readable {
    constructor(options) {
      super(options);
      this.writable = true;
    }
    write() {
      warnNoDataFlow("write");
      return false;
    }
    end() {
      warnNoDataFlow("end");
      return this;
    }
  };
  var Transform = class extends Duplex {
    _transform() {
    }
  };
  var PassThrough = class extends Transform {
  };

  // packages/shim/src/debug.js
  var DEBUG = true;
  var _accessLog = /* @__PURE__ */ new Map();
  function wrapWithProxy(obj, name) {
    if (!DEBUG || !obj || typeof obj !== "object") {
      return obj;
    }
    return new Proxy(obj, {
      get(target, prop) {
        if (typeof prop === "string" && prop !== "then" && prop !== "toJSON" && !prop.startsWith("_")) {
          const key = `${name}.${prop}`;
          _accessLog.set(key, (_accessLog.get(key) || 0) + 1);
          if (!(prop in target)) {
            console.warn(`[shim:MISS] ${key} - property not found on shim`);
          }
        }
        return target[prop];
      }
    });
  }
  function installDebugHelpers(rawRegistry2) {
    window.__shimLog = function() {
      const sorted = [..._accessLog.entries()].sort((a, b) => b[1] - a[1]);
      console.table(sorted.map(([k, v]) => ({ api: k, calls: v })));
    };
    window.__shimMisses = function() {
      const sorted = [..._accessLog.entries()].filter(([k]) => {
        const [mod, prop] = k.split(".");
        const shim = rawRegistry2[mod];
        return shim && !(prop in shim);
      }).sort((a, b) => b[1] - a[1]);
      console.table(sorted.map(([k, v]) => ({ api: k, calls: v })));
    };
  }

  // packages/shim/src/require.js
  var rawRegistry = {
    electron: electronShim,
    "@electron/remote": remoteShim,
    "original-fs": fsShim,
    fs: fsShim,
    path: pathShim,
    url: urlShim,
    crypto: cryptoShim,
    child_process: child_process_exports,
    events: events_exports,
    os: os_exports,
    net: net_exports,
    http: http_exports,
    https: http_exports,
    zlib: zlib_exports,
    util: utilShim,
    constants: constantsShim,
    assert: assertShim,
    stream: stream_exports
  };
  var shimRegistry = {};
  var throwOnRequire = /* @__PURE__ */ new Set(["btime", "get-fonts", "vibrancy-win"]);
  function installRequire() {
    for (const [name, shim] of Object.entries(rawRegistry)) {
      shimRegistry[name] = wrapWithProxy(shim, name);
    }
    if (typeof window.Buffer !== "undefined") {
      shimRegistry.buffer = window.Buffer;
    }
    shimRegistry.long = void 0;
    window.require = function(moduleName) {
      const normalizedName = moduleName.startsWith("node:") ? moduleName.slice(5) : moduleName;
      if (throwOnRequire.has(normalizedName)) {
        throw new Error(`Cannot find module '${moduleName}'`);
      }
      if (shimRegistry[normalizedName]) {
        return shimRegistry[normalizedName];
      }
      console.warn("[ignis] Unshimmed require:", moduleName);
      return wrapWithProxy({}, `UNKNOWN(${moduleName})`);
    };
    installDebugHelpers(rawRegistry);
  }
  function registerShim(name, mod) {
    shimRegistry[name] = mod;
  }

  // packages/shim/src/process.js
  var processShim = {
    platform: "linux",
    version: "v18.18.0",
    versions: {
      electron: "28.2.3",
      node: "18.18.0",
      chrome: "120.0.0.0"
    },
    env: {},
    cwd: () => "/",
    nextTick: (fn, ...args) => setTimeout(() => fn(...args), 0),
    argv: [],
    type: "renderer",
    resourcesPath: "/",
    stdout: { write: (s) => console.log(s) },
    stderr: { write: (s) => console.error(s) },
    on: () => {
    },
    once: () => {
    },
    removeListener: () => {
    }
  };

  // packages/shim/src/globals/buffer.js
  var CHUNK = 8192;
  var ENCODINGS = [
    "utf8",
    "utf-8",
    "ascii",
    "binary",
    "base64",
    "hex",
    "latin1"
  ];
  var warnedEncodings = /* @__PURE__ */ new Set();
  function normalizeEncoding(encoding) {
    const enc = (encoding || "utf-8").toLowerCase();
    if (ENCODINGS.includes(enc)) {
      return enc;
    }
    if (!warnedEncodings.has(enc)) {
      warnedEncodings.add(enc);
      console.warn(`[shim:buffer] unknown encoding "${enc}", treating as utf-8`);
    }
    return "utf-8";
  }
  function binaryString(bytes) {
    let binary = "";
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    return binary;
  }
  var BufferShim = class extends Uint8Array {
    toString(encoding = "utf-8") {
      const enc = normalizeEncoding(encoding);
      if (enc === "base64") {
        return btoa(binaryString(this));
      }
      if (enc === "hex") {
        let hex = "";
        for (let i = 0; i < this.length; i++) {
          hex += this[i].toString(16).padStart(2, "0");
        }
        return hex;
      }
      if (enc === "ascii" || enc === "latin1" || enc === "binary") {
        return binaryString(this);
      }
      return new TextDecoder().decode(this);
    }
  };
  function fromString(str, encoding) {
    const enc = normalizeEncoding(encoding);
    if (enc === "base64") {
      const binary = atob(str);
      const bytes = new BufferShim(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }
    if (enc === "hex") {
      const bytes = new BufferShim(Math.floor(str.length / 2));
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(str.slice(i * 2, i * 2 + 2), 16);
      }
      return bytes;
    }
    if (enc === "ascii" || enc === "latin1" || enc === "binary") {
      const bytes = new BufferShim(str.length);
      for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i) & 255;
      }
      return bytes;
    }
    return new BufferShim(new TextEncoder().encode(str));
  }
  function installBuffer() {
    if (typeof window.Buffer !== "undefined")
      return;
    window.Buffer = {
      from: function(data, encoding) {
        if (typeof data === "string") {
          return fromString(data, encoding);
        }
        return new BufferShim(data);
      },
      alloc: function(size, fill, encoding) {
        const buf = new BufferShim(size);
        if (fill !== void 0) {
          buf.fill(typeof fill === "string" ? fill.charCodeAt(0) : fill);
        }
        return buf;
      },
      allocUnsafe: function(size) {
        return new BufferShim(size);
      },
      concat: function(arrays) {
        const total = arrays.reduce((sum, a) => sum + a.length, 0);
        const result = new BufferShim(total);
        let offset = 0;
        for (const arr of arrays) {
          result.set(arr, offset);
          offset += arr.length;
        }
        return result;
      },
      isBuffer: function(obj) {
        return obj instanceof Uint8Array;
      },
      byteLength: function(str, encoding) {
        const enc = normalizeEncoding(encoding);
        if (enc === "base64") {
          const unpadded = str.replace(/=+$/, "");
          return Math.floor(unpadded.length * 3 / 4);
        }
        if (enc === "hex") {
          return Math.floor(str.length / 2);
        }
        if (enc === "ascii" || enc === "latin1" || enc === "binary") {
          return str.length;
        }
        return new TextEncoder().encode(str).length;
      },
      isEncoding: function(encoding) {
        return ENCODINGS.includes((encoding || "").toLowerCase());
      }
    };
  }

  // packages/shim/src/util/url.js
  function isSameOrigin(url) {
    if (!url || url.startsWith("/") && !url.startsWith("//") || url.startsWith("./") || url.startsWith("../")) {
      return true;
    }
    if (url.startsWith("data:") || url.startsWith("blob:")) {
      return true;
    }
    try {
      const parsed = new URL(url, window.location.origin);
      return parsed.origin === window.location.origin;
    } catch {
      return true;
    }
  }
  var directFetchHosts = /* @__PURE__ */ new Set();
  function setDirectFetchHosts(list) {
    directFetchHosts = new Set(
      (Array.isArray(list) ? list : []).map((host) => String(host).trim().toLowerCase()).filter(Boolean)
    );
  }
  function isDirectFetchHost(url) {
    if (directFetchHosts.size === 0) {
      return false;
    }
    try {
      const parsed = new URL(url, window.location.origin);
      return directFetchHosts.has(parsed.hostname.toLowerCase());
    } catch {
      return false;
    }
  }

  // packages/shim/src/globals/fetch.js
  function installFetchShim() {
    const originalFetch = window.fetch.bind(window);
    window.__originalFetch = originalFetch;
    window.fetch = async function(input, init) {
      let url;
      if (typeof input === "string") {
        url = input;
      } else if (input instanceof URL) {
        url = input.href;
      } else if (input instanceof Request) {
        url = input.url;
      } else {
        url = String(input);
      }
      if (isSameOrigin(url) || isDirectFetchHost(url)) {
        return originalFetch(input, init);
      }
      const method = ((init == null ? void 0 : init.method) || (input instanceof Request ? input.method : "GET")).toUpperCase();
      const headers = {};
      if (init == null ? void 0 : init.headers) {
        const h = init.headers instanceof Headers ? init.headers : new Headers(init.headers);
        h.forEach((val, key) => {
          headers[key] = val;
        });
      } else if (input instanceof Request) {
        input.headers.forEach((val, key) => {
          headers[key] = val;
        });
      }
      if (!headers["user-agent"] && !headers["User-Agent"]) {
        headers["user-agent"] = navigator.userAgent;
      }
      if (!headers["origin"] && !headers["Origin"]) {
        headers["origin"] = "app://obsidian.md";
      }
      let body = null;
      if ((init == null ? void 0 : init.body) && method !== "GET" && method !== "HEAD") {
        if (typeof init.body === "string") {
          body = init.body;
        } else if (init.body instanceof ArrayBuffer || init.body instanceof Uint8Array) {
          body = init.body;
        } else if (typeof init.body === "object") {
          body = JSON.stringify(init.body);
        } else {
          body = String(init.body);
        }
      }
      console.log("[shim:fetch] Proxying cross-origin:", method, url);
      let result;
      try {
        result = await proxyFetch({ url, method, headers, body });
      } catch (e) {
        throw new TypeError(e.message || "Failed to fetch");
      }
      return new Response(result.body, {
        status: result.status,
        headers: result.headers
      });
    };
  }

  // packages/shim/src/globals/window.js
  function installWindowClose() {
    window.close = function() {
      var _a;
      console.log("[ignis] window.close() blocked");
      if (document.body.classList.contains("in-progress")) {
        (_a = document.querySelector(".progress-bar-container")) == null ? void 0 : _a.remove();
        document.body.classList.remove("in-progress");
        return;
      }
      if (!window.__vaultConfig) {
        showVaultManager();
      }
    };
  }
  function installWindowOpen() {
    window.__popupIframe = null;
    const _originalOpen = window.open;
    window.open = function(url, target, features) {
      if (url === "about:blank" || features && features.includes("popup")) {
        console.log("[ignis] intercepted popup:", url, features);
        registerPopupWindow();
        const iframe = document.createElement("iframe");
        iframe.style.cssText = "position:fixed;left:-9999px;width:0;height:0;border:none;";
        document.body.appendChild(iframe);
        window.__popupIframe = iframe;
        const iframeWin = iframe.contentWindow;
        iframeWin.require = window.require;
        iframeWin.module = window.module;
        iframeWin.Buffer = window.Buffer;
        iframeWin.process = window.process;
        iframeWin.global = iframeWin;
        iframeWin.globalEnhance = window.globalEnhance;
        iframeWin.close = function() {
          unregisterPopupWindow();
          iframe.remove();
          window.__popupIframe = null;
        };
        return iframeWin;
      }
      return _originalOpen.call(window, url, target, features);
    };
  }

  // packages/shim/src/globals/web-apis.js
  function installVibrateShim() {
    if (typeof navigator.vibrate === "function") {
      return;
    }
    try {
      Object.defineProperty(navigator, "vibrate", {
        configurable: true,
        writable: true,
        value: () => true
      });
    } catch {
    }
  }
  function installQueryLocalFontsShim() {
    const native = typeof window.queryLocalFonts === "function" ? window.queryLocalFonts.bind(window) : null;
    try {
      Object.defineProperty(window, "queryLocalFonts", {
        configurable: true,
        writable: true,
        value: () => native ? native().catch(() => []) : Promise.resolve([])
      });
    } catch {
    }
  }
  function installRandomUUIDShim() {
    if (typeof window.crypto.randomUUID === "function") {
      return;
    }
    if (typeof window.crypto.getRandomValues !== "function") {
      return;
    }
    const randomUUID2 = () => {
      const bytes = window.crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = bytes[6] & 15 | 64;
      bytes[8] = bytes[8] & 63 | 128;
      let hex = "";
      for (let i = 0; i < 16; i++) {
        hex += bytes[i].toString(16).padStart(2, "0");
      }
      return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
    };
    try {
      Object.defineProperty(window.crypto, "randomUUID", {
        configurable: true,
        writable: true,
        value: randomUUID2
      });
    } catch {
    }
  }
  function installClipboardShim() {
    if (navigator.clipboard) {
      return;
    }
    const writeText = (text) => {
      try {
        return execCommandCopy(text) ? Promise.resolve() : Promise.reject(new Error("clipboard write failed"));
      } catch (e) {
        return Promise.reject(e);
      }
    };
    const readText = () => {
      reportInsecureApi("navigator.clipboard.readText");
      return Promise.reject(
        new Error(
          "navigator.clipboard.readText is unavailable on insecure origins"
        )
      );
    };
    try {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText, readText }
      });
    } catch {
    }
  }
  function installMediaDevicesShim() {
    if (navigator.mediaDevices) {
      return;
    }
    const getUserMedia = () => {
      reportInsecureApi("navigator.mediaDevices.getUserMedia");
      return Promise.reject(
        new Error(
          "navigator.mediaDevices.getUserMedia is unavailable on insecure origins"
        )
      );
    };
    try {
      Object.defineProperty(navigator, "mediaDevices", {
        configurable: true,
        value: { getUserMedia }
      });
    } catch {
    }
  }
  var SUBTLE_DIGEST = {
    "SHA-1": sha1,
    "SHA-256": sha256,
    "SHA-384": sha384,
    "SHA-512": sha512
  };
  var SUBTLE_STUB_METHODS = [
    "encrypt",
    "decrypt",
    "sign",
    "verify",
    "generateKey",
    "deriveKey",
    "deriveBits",
    "importKey",
    "exportKey",
    "wrapKey",
    "unwrapKey"
  ];
  function installSubtleShim() {
    if (window.crypto && window.crypto.subtle) {
      return;
    }
    const digest = (algorithm, data) => {
      const name = typeof algorithm === "string" ? algorithm : algorithm && algorithm.name;
      const hasher = SUBTLE_DIGEST[name];
      if (!hasher) {
        return Promise.reject(
          new Error("crypto.subtle.digest: unsupported algorithm " + name)
        );
      }
      const view = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
      const out = hasher(view);
      return Promise.resolve(
        out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength)
      );
    };
    const subtle = { digest };
    for (const method of SUBTLE_STUB_METHODS) {
      subtle[method] = () => {
        reportInsecureApi("crypto.subtle." + method);
        return Promise.reject(
          new Error(
            "crypto.subtle." + method + " is unavailable on insecure origins"
          )
        );
      };
    }
    try {
      Object.defineProperty(window.crypto, "subtle", {
        configurable: true,
        value: subtle
      });
    } catch {
    }
  }

  // packages/shim/src/globals/index.js
  function installProcess() {
    window.process = processShim;
  }
  function installGlobalAlias() {
    window.global = window;
  }
  function installContextMenuFix() {
    window.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        Object.defineProperty(e, "defaultPrevented", { get: () => false });
      },
      true
    );
  }
  function installGlobals() {
    installGlobalAlias();
    installProcess();
    installBuffer();
    installFetchShim();
    installWindowClose();
    installWindowOpen();
    installVibrateShim();
    installQueryLocalFontsShim();
    installRandomUUIDShim();
    installClipboardShim();
    installMediaDevicesShim();
    installSubtleShim();
    installContextMenuFix();
  }

  // packages/bridge/styles.css
  var styles_default = '.ignis-header {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 16px 0 12px;\n  margin-bottom: 12px;\n  border-bottom: 1px solid var(--background-modifier-border);\n}\n\n.ignis-header-logo {\n  width: 48px;\n  height: 48px;\n  flex-shrink: 0;\n}\n\n.ignis-header-info {\n  flex: 1;\n  min-width: 0;\n}\n\n.ignis-header-title {\n  font-size: var(--font-ui-large);\n  font-weight: var(--font-semibold);\n  line-height: 1.2;\n  margin: 0;\n}\n\n.ignis-header-subtitle {\n  font-size: var(--font-ui-small);\n  color: var(--text-muted);\n  line-height: 1.2;\n  margin: 4px 0 0;\n}\n\n.ignis-header-right {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  flex-shrink: 0;\n}\n\n.ignis-header-version-col {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 2px;\n}\n\n.ignis-header-version {\n  font-size: var(--font-ui-small);\n  color: var(--text-muted);\n}\n\n.ignis-update-indicator {\n  font-size: var(--font-ui-smaller);\n  color: var(--text-faint);\n  text-decoration: none;\n}\n\n.ignis-update-indicator.ignis-update-available {\n  color: var(--text-accent);\n}\n\n.ignis-update-indicator.ignis-update-available:hover {\n  text-decoration: underline;\n}\n\n.ignis-github-link {\n  color: var(--text-muted);\n  display: flex;\n  align-items: center;\n}\n\n.ignis-github-link:hover {\n  color: var(--text-normal);\n}\n\n.ignis-github-link:hover .ignis-github-icon {\n  opacity: 1;\n}\n\n.ignis-github-icon {\n  width: 32px;\n  height: 32px;\n  opacity: 0.6;\n}\n\n.ignis-insecure-callout {\n  display: flex;\n  gap: 12px;\n  padding: 12px 14px;\n  margin-bottom: 16px;\n  border: 1px solid rgba(190, 150, 45, 0.55);\n  background: rgba(190, 150, 45, 0.09);\n  border-radius: 8px;\n}\n\n.ignis-insecure-callout-icon {\n  flex-shrink: 0;\n  color: var(--text-warning, #d6a935);\n}\n\n.ignis-insecure-callout-icon svg {\n  width: 18px;\n  height: 18px;\n}\n\n.ignis-insecure-callout-title {\n  font-weight: var(--font-semibold);\n  color: var(--text-warning, #d6a935);\n  margin-bottom: 4px;\n}\n\n.ignis-insecure-callout-body {\n  font-size: var(--font-ui-small);\n  color: var(--text-muted);\n  line-height: 1.5;\n}\n\n.ignis-block-modal p {\n  margin: 0 0 12px;\n  line-height: 1.5;\n}\n\n.ignis-block-modal p:last-child {\n  margin-bottom: 0;\n}\n\n.ignis-block-modal ul {\n  margin: 0 0 14px;\n  padding-left: 22px;\n}\n\n.ignis-block-modal li {\n  margin-bottom: 10px;\n  line-height: 1.5;\n}\n\n.ignis-block-modal li:last-child {\n  margin-bottom: 0;\n}\n\n.ignis-block-modal code {\n  font-size: 0.9em;\n  background: var(--background-primary-alt);\n  padding: 1px 5px;\n  border-radius: 4px;\n}\n\n.ignis-status-dot {\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  margin-right: 6px;\n}\n\n.ignis-status-connected {\n  background-color: var(--color-green);\n}\n\n.ignis-status-connecting {\n  background-color: var(--color-yellow);\n}\n\n.ignis-status-disconnected {\n  background-color: var(--color-red);\n}\n\n.ignis-status-label {\n  font-size: var(--font-ui-small);\n  color: var(--text-muted);\n}\n\n.ignis-statusbar-item {\n  display: flex;\n  align-items: center;\n  cursor: default;\n}\n\n.ignis-statusbar-dot {\n  display: inline-block;\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n}\n\n.ignis-statusbar-connected {\n  background-color: var(--color-green);\n}\n\n.ignis-statusbar-connecting {\n  background-color: var(--color-yellow);\n}\n\n.ignis-statusbar-disconnected {\n  background-color: var(--color-red);\n}\n\n.ignis-statusbar-writes-pending {\n  animation: ignis-writes-pulse 1.6s ease-in-out infinite;\n}\n\n@keyframes ignis-writes-pulse {\n  0%,\n  100% {\n    opacity: 1;\n  }\n\n  50% {\n    opacity: 0.35;\n  }\n}\n\n.ignis-write-failure-actions {\n  display: flex;\n  gap: 8px;\n  margin-top: 8px;\n}\n\n.ignis-loading {\n  position: relative;\n}\n\n.ignis-loading .cm-editor,\n.ignis-loading .markdown-reading-view {\n  opacity: 0.5;\n}\n\n.ignis-loading::after {\n  content: "Loading\\2026";\n  position: absolute;\n  top: 8px;\n  left: 50%;\n  transform: translateX(-50%);\n  padding: 2px 10px;\n  border-radius: 12px;\n  background: var(--background-modifier-hover);\n  color: var(--text-muted);\n  font-size: var(--font-ui-smaller);\n  pointer-events: none;\n  z-index: 20;\n}\n\n.ignis-plugins-description {\n  padding: 0 16px;\n  color: var(--text-muted);\n  font-size: var(--font-ui-small);\n  margin-bottom: 16px;\n}\n\n.ignis-list-editor {\n  border: 1px solid var(--background-modifier-border);\n  border-radius: var(--radius-m);\n  max-height: 220px;\n  overflow-y: auto;\n  padding: 0 var(--size-4-3);\n  margin-bottom: var(--size-4-4);\n}\n\n.ignis-list-empty {\n  color: var(--text-muted);\n  font-size: var(--font-ui-smaller);\n  padding: var(--size-4-3) 0;\n}\n';

  // packages/shim/src/css-overrides.js
  function installCssOverrides() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/overrides.css";
    link.setAttribute("data-ignis", "css-overrides");
    document.head.appendChild(link);
    const bridgeStyle = document.createElement("style");
    bridgeStyle.textContent = styles_default;
    bridgeStyle.setAttribute("data-ignis", "bridge-css");
    document.head.appendChild(bridgeStyle);
  }

  // packages/shim/src/emulate-mobile.js
  function installEmulateMobile() {
    if (window.innerWidth < 600) {
      localStorage.setItem("EmulateMobile", "true");
      stripEmulateMobileClass();
    } else {
      localStorage.removeItem("EmulateMobile");
    }
  }
  function stripEmulateMobileClass() {
    const strip = () => {
      if (document.body.classList.contains("emulate-mobile")) {
        document.body.classList.remove("emulate-mobile");
      }
    };
    const observer2 = new MutationObserver(strip);
    observer2.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  // packages/shim/src/mobile-vault-switcher.js
  function installMobileVaultSwitcher(app) {
    app.workspace.onLayoutReady(() => {
      const select = document.querySelector(
        ".workspace-drawer-header-switcher select"
      );
      if (!select || select.dataset.ignisVaults) {
        return;
      }
      select.dataset.ignisVaults = "true";
      populate(select);
      intercept(select);
    });
  }
  function populate(select) {
    const current = vaultService.getCurrentVaultId();
    const manageOption = select.querySelector('option[value="manage-vaults"]');
    for (const v of window.__vaultList || []) {
      const option = document.createElement("option");
      option.value = v.id;
      option.textContent = v.name || v.id;
      option.selected = v.id === current;
      select.insertBefore(option, manageOption);
    }
  }
  function intercept(select) {
    const label = select.closest("label") || select.parentElement;
    label.addEventListener(
      "change",
      (e) => {
        if (select.value === "manage-vaults") {
          setTimeout(() => {
            select.value = vaultService.getCurrentVaultId();
          }, 0);
          return;
        }
        e.stopPropagation();
        if (select.value !== vaultService.getCurrentVaultId()) {
          vaultService.openVault(select.value);
        }
      },
      true
    );
  }

  // packages/shim/src/open-file-param.js
  function installOpenFileParam(app) {
    app.workspace.onLayoutReady(() => {
      const raw = new URLSearchParams(window.location.search).get("file");
      if (!raw) {
        return;
      }
      stripFileParam();
      const hashIndex = raw.indexOf("#");
      const path = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;
      if (!path) {
        return;
      }
      const file = resolveFile(app, path);
      if (!file) {
        new window.__ignis.obsidian.Notice(`Ignis: note not found: ${path}`);
        return;
      }
      const anchor = hashIndex >= 0 ? raw.slice(hashIndex) : "";
      app.workspace.openLinkText(file.path + anchor, "", false);
    });
  }
  function resolveFile(app, path) {
    const { TFile: TFile2 } = window.__ignis.obsidian;
    const exact = app.vault.getAbstractFileByPath(path);
    if (exact instanceof TFile2) {
      return exact;
    }
    const withExtension = app.vault.getAbstractFileByPath(path + ".md");
    if (withExtension instanceof TFile2) {
      return withExtension;
    }
    return app.metadataCache.getFirstLinkpathDest(path, "");
  }
  function stripFileParam() {
    const url = new URL(window.location.href);
    url.searchParams.delete("file");
    history.replaceState(null, "", url.toString());
  }

  // packages/shim/src/request-url.js
  async function proxyRequestUrl(request3) {
    if (typeof request3 === "string") {
      request3 = { url: request3 };
    }
    if (isSameOrigin(request3.url) || isDirectFetchHost(request3.url)) {
      const res = await fetch(request3.url, {
        method: request3.method || "GET",
        headers: request3.headers || {},
        body: request3.body
      });
      const arrayBuf = await res.arrayBuffer();
      return makeResponse(
        request3,
        res.status,
        Object.fromEntries(res.headers),
        arrayBuf
      );
    }
    const result = await proxyFetch({
      url: request3.url,
      method: request3.method,
      headers: request3.headers,
      body: request3.body
    });
    return makeResponse(request3, result.status, result.headers, result.body);
  }
  function makeResponse(request3, status, headers, arrayBuf) {
    const text = new TextDecoder().decode(arrayBuf);
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    return { status, headers, arrayBuffer: arrayBuf, text, json };
  }
  function installRequestUrlShim() {
    Object.defineProperty(window, "requestUrl", {
      get() {
        return proxyRequestUrl;
      },
      // Swallow Obsidian's later assignment so the shim keeps serving its own requestUrl.
      set() {
      },
      configurable: true
    });
  }

  // packages/shim/src/workspace.js
  var WORKSPACE_PATH = ".obsidian/workspace.json";
  var WORKSPACES_PATH = ".obsidian/workspaces.json";
  function isValidWorkspaceName(name) {
    return /^[A-Za-z0-9 _.-]{1,64}$/.test(name);
  }
  registerPathResolver(
    (path) => path === WORKSPACE_PATH && !!window.__workspaceName,
    () => `.obsidian/workspace.${window.__workspaceName}.json`
  );
  registerWriteTransform(WORKSPACES_PATH, (content) => {
    const original = window.__originalActiveWorkspace;
    if (!original || !window.__workspaceName) {
      return content;
    }
    if (typeof content !== "string") {
      return content;
    }
    try {
      const parsed = JSON.parse(content);
      if (parsed.active !== original) {
        parsed.active = original;
        return JSON.stringify(parsed);
      }
    } catch {
    }
    return content;
  });
  function setWorkspaceParam(name) {
    const url = new URL(window.location.href);
    if (name) {
      url.searchParams.set("workspace", name);
    } else {
      url.searchParams.delete("workspace");
    }
    history.replaceState(null, "", url.toString());
  }
  function loadPresetIfRequested() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("load") !== "preset" || !window.__workspaceName) {
      return;
    }
    try {
      const presetsText = fsShim.readFileSync(WORKSPACES_PATH, "utf-8");
      const presets = JSON.parse(presetsText);
      const preset = presets.workspaces && presets.workspaces[window.__workspaceName];
      if (!preset) {
        console.warn(
          "[ignis] load=preset requested but no preset found for:",
          window.__workspaceName
        );
        return;
      }
      fsShim.writeFileSync(WORKSPACE_PATH, JSON.stringify(preset), "utf-8");
      console.log("[ignis] Loaded preset for workspace:", window.__workspaceName);
    } catch (e) {
      console.warn("[ignis] Failed to load preset:", e);
    } finally {
      const url = new URL(window.location.href);
      url.searchParams.delete("load");
      history.replaceState(null, "", url.toString());
    }
  }
  function readJsonIfPresent(path) {
    try {
      return JSON.parse(fsShim.readFileSync(path, "utf-8"));
    } catch {
      return null;
    }
  }
  function resolveWorkspaceName() {
    if (!window.__workspaceName) {
      const corePlugins = readJsonIfPresent(".obsidian/core-plugins.json");
      if (!corePlugins || !corePlugins.workspaces) {
        return;
      }
    }
    const workspaces = readJsonIfPresent(WORKSPACES_PATH);
    if (!workspaces) {
      return;
    }
    if (workspaces.active) {
      window.__originalActiveWorkspace = workspaces.active;
    }
    if (!window.__workspaceName && workspaces.active) {
      window.__workspaceName = workspaces.active;
      setWorkspaceParam(workspaces.active);
      console.log("[ignis] Workspace resolved from active:", workspaces.active);
    }
  }
  function initWorkspacePatch() {
    const observer2 = new MutationObserver(() => {
      if (!document.querySelector(".workspace")) {
        return;
      }
      const plugin = window.app && window.app.internalPlugins && window.app.internalPlugins.plugins && window.app.internalPlugins.plugins.workspaces;
      if (!plugin || !plugin.enabled || !plugin.instance) {
        return;
      }
      observer2.disconnect();
      const instance = plugin.instance;
      const origLoad = instance.loadWorkspace.bind(instance);
      const origSave = instance.saveWorkspace.bind(instance);
      instance.loadWorkspace = function(name) {
        window.__workspaceName = name;
        setWorkspaceParam(name);
        fsShim.invalidate(WORKSPACE_PATH);
        return origLoad(name);
      };
      instance.saveWorkspace = function(name) {
        let currentLayout = null;
        try {
          currentLayout = fsShim.readFileSync(WORKSPACE_PATH, "utf-8");
        } catch {
        }
        window.__workspaceName = name;
        setWorkspaceParam(name);
        fsShim.invalidate(WORKSPACE_PATH);
        const result = origSave(name);
        if (currentLayout) {
          fsShim.writeFileSync(WORKSPACE_PATH, currentLayout, "utf-8");
        }
        return result;
      };
      registerReadTransform(WORKSPACES_PATH, (data) => {
        if (!window.__workspaceName) {
          return data;
        }
        let text = typeof data === "string" ? data : new TextDecoder().decode(data);
        try {
          const parsed = JSON.parse(text);
          if (parsed.active !== window.__workspaceName) {
            parsed.active = window.__workspaceName;
            return JSON.stringify(parsed);
          }
        } catch {
        }
        return data;
      });
      fsShim.watch(".obsidian", (eventType, filename) => {
        if (filename === "workspaces.json") {
          plugin.loadData().then((data) => {
            if (data) {
              instance.workspaces = data.workspaces || {};
            }
          });
        }
      });
      console.log(
        "[ignis] Workspaces plugin patched, workspace:",
        window.__workspaceName || "(none)"
      );
    });
    observer2.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // packages/shim/src/fs/indexer-prefetch.js
  var TEXT_EXTENSIONS = /* @__PURE__ */ new Set([
    ".md",
    ".markdown",
    ".txt",
    ".json",
    ".csv",
    ".css",
    ".js",
    ".ts",
    ".tsx",
    ".mjs",
    ".cjs",
    ".html",
    ".xml",
    ".yaml",
    ".yml",
    ".toml",
    ".svg"
  ]);
  var MAX_FILE_BYTES = 512 * 1024;
  var PRIORITY_MAX_FILE_BYTES = 4 * 1024 * 1024;
  var BATCH_SIZE = 50;
  var BATCH_CONCURRENCY = 6;
  var MAX_FILES = 4e3;
  var PREFETCH_CACHE_FRACTION = 0.75;
  var PREFETCH_MAX_BYTES = 100 * 1024 * 1024;
  var PREFETCH_MIN_BYTES = 8 * 1024 * 1024;
  var DEFAULT_CACHE_BYTES = 50 * 1024 * 1024;
  function isTextPath(path) {
    const dot = path.lastIndexOf(".");
    if (dot < 0) {
      return false;
    }
    return TEXT_EXTENSIONS.has(path.slice(dot).toLowerCase());
  }
  function isPriorityPath(path) {
    if (!path.startsWith(".obsidian/")) {
      return false;
    }
    if (/^\.obsidian\/[^/]+\.json$/.test(path)) {
      return true;
    }
    return /^\.obsidian\/plugins\/[^/]+\/(main\.js|manifest\.json|styles\.css)$/.test(
      path
    );
  }
  function isDataJsonPath(path) {
    return /^\.obsidian\/plugins\/[^/]+\/data\.json$/.test(path);
  }
  function isPluginAsset(path) {
    return /^\.obsidian\/plugins\/[^/]+\//.test(path) && !isPriorityPath(path) && !isDataJsonPath(path);
  }
  function prefetchByteBudget(contentCache2) {
    const cacheMax = contentCache2 && Number.isFinite(contentCache2.maxSize) ? contentCache2.maxSize : DEFAULT_CACHE_BYTES;
    return Math.min(
      PREFETCH_MAX_BYTES,
      cacheMax,
      Math.max(
        PREFETCH_MIN_BYTES,
        Math.floor(cacheMax * PREFETCH_CACHE_FRACTION)
      )
    );
  }
  function collectSlice(entries2, predicate, perFileCap, budget, label) {
    const files = [];
    let bytes = 0;
    let truncated = 0;
    for (const [path, entry] of entries2) {
      if (entry.type !== "file" || !isTextPath(path) || !predicate(path)) {
        continue;
      }
      const size = entry.size || 0;
      if (size === 0 || size > perFileCap) {
        continue;
      }
      if (bytes + size > budget) {
        continue;
      }
      if (files.length >= MAX_FILES) {
        truncated++;
        continue;
      }
      files.push({ path, size });
      bytes += size;
    }
    if (truncated > 0) {
      console.warn(
        `[ignis] Prefetch ${label} slice hit the ${MAX_FILES}-file cap; ${truncated} file(s) left for on-demand reads.`
      );
    }
    return { files, bytes };
  }
  function selectPrefetchTargets(tree, totalBudget) {
    const entries2 = Object.entries(tree);
    const core = collectSlice(
      entries2,
      isPriorityPath,
      PRIORITY_MAX_FILE_BYTES,
      totalBudget,
      "priority"
    );
    const data = collectSlice(
      entries2,
      isDataJsonPath,
      PRIORITY_MAX_FILE_BYTES,
      totalBudget - core.bytes,
      "data.json"
    );
    const priority = {
      files: [...core.files, ...data.files],
      bytes: core.bytes + data.bytes
    };
    const admitted = new Set(priority.files.map((f) => f.path));
    const bulk = collectSlice(
      entries2,
      (path) => !admitted.has(path) && !isPluginAsset(path),
      MAX_FILE_BYTES,
      totalBudget - priority.bytes,
      "bulk"
    );
    return { priority, bulk };
  }
  async function fetchBatch(vaultId2, paths) {
    const res = await fetch("/api/fs/batch-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vault: vaultId2, paths })
    });
    if (!res.ok) {
      throw new Error("batch-read failed: " + res.status);
    }
    return res.json();
  }
  async function runBatches(vaultId2, slice, contentCache2, label, onProgress) {
    if (slice.files.length === 0) {
      return;
    }
    const t0 = Date.now();
    let cached = 0;
    let received = 0;
    if (onProgress) {
      onProgress(0, slice.bytes);
    }
    const batches = [];
    for (let i = 0; i < slice.files.length; i += BATCH_SIZE) {
      batches.push(slice.files.slice(i, i + BATCH_SIZE));
    }
    let cursor = 0;
    let aborted = false;
    async function worker() {
      while (!aborted) {
        const idx = cursor++;
        if (idx >= batches.length) {
          return;
        }
        const batch = batches[idx];
        let result;
        try {
          result = await fetchBatch(
            vaultId2,
            batch.map((f) => f.path)
          );
        } catch (e) {
          console.warn(`[ignis] Prefetch ${label} batch failed:`, e.message);
          aborted = true;
          return;
        }
        for (const [path, content] of Object.entries(result.files || {})) {
          if (typeof content === "string") {
            contentCache2.set(path, content);
            cached++;
          }
        }
        if (onProgress) {
          for (const f of batch) {
            received += f.size;
          }
          onProgress(received, slice.bytes);
        }
      }
    }
    const workerCount = Math.max(1, Math.min(BATCH_CONCURRENCY, batches.length));
    await Promise.all(Array.from({ length: workerCount }, () => worker()));
    const ms = Date.now() - t0;
    console.log(
      `[ignis] Prefetched ${label} ${cached}/${slice.files.length} files (${(slice.bytes / 1024).toFixed(0)} KB) in ${ms}ms`
    );
  }
  function prefetchVaultContent(vaultId2, tree, contentCache2, options = {}) {
    if (!vaultId2 || !tree) {
      return { priority: Promise.resolve(), bulk: Promise.resolve() };
    }
    const totalBudget = prefetchByteBudget(contentCache2);
    const { priority, bulk } = selectPrefetchTargets(tree, totalBudget);
    const priorityDone = runBatches(
      vaultId2,
      priority,
      contentCache2,
      "priority",
      options.onProgress
    );
    const bulkDone = priorityDone.catch(() => {
    }).then(() => runBatches(vaultId2, bulk, contentCache2, "bulk")).catch((e) => {
      console.warn("[ignis] Prefetch bulk failed:", e && e.message);
    });
    return { priority: priorityDone, bulk: bulkDone };
  }

  // packages/shim/src/demo.js
  function isDemoMode() {
    return typeof document !== "undefined" && document.body && document.body.dataset.demoMode === "true";
  }
  function autoTrustDemoVaults(vaultList) {
    if (!isDemoMode() || !Array.isArray(vaultList)) {
      return;
    }
    for (const v of vaultList) {
      if (v && v.id) {
        localStorage.setItem("enable-plugin-" + v.id, "true");
      }
    }
  }
  function maybeProvisionDemoVault() {
    if (!isDemoMode()) {
      return false;
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("vault")) {
      return false;
    }
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "/api/demo/provision", false);
      xhr.send();
      if (xhr.status === 200) {
        const { vault } = JSON.parse(xhr.responseText);
        if (vault) {
          localStorage.setItem("enable-plugin-" + vault, "true");
          window.location.replace("/?vault=" + encodeURIComponent(vault));
          return true;
        }
      }
    } catch (e) {
      console.warn("[ignis] Demo provision failed:", e);
    }
    return false;
  }

  // packages/shim/src/native-menu-guard.js
  var APPEARANCE_PATH = ".obsidian/appearance.json";
  var preservedNativeMenus = void 0;
  function snapshotAppearance() {
    try {
      const obj = JSON.parse(fsShim.readFileSync(APPEARANCE_PATH, "utf-8"));
      if ("nativeMenus" in obj) {
        preservedNativeMenus = obj.nativeMenus;
      }
    } catch {
    }
  }
  function readTransform(data) {
    const text = typeof data === "string" ? data : new TextDecoder().decode(data);
    try {
      const obj = JSON.parse(text);
      if (obj.nativeMenus !== false) {
        obj.nativeMenus = false;
        return JSON.stringify(obj);
      }
    } catch {
    }
    return data;
  }
  function writeTransform(data) {
    const text = typeof data === "string" ? data : new TextDecoder().decode(data);
    try {
      const obj = JSON.parse(text);
      if (preservedNativeMenus === void 0) {
        delete obj.nativeMenus;
      } else {
        obj.nativeMenus = preservedNativeMenus;
      }
      return JSON.stringify(obj);
    } catch {
      return data;
    }
  }
  function patchSetConfig() {
    const tryPatch = () => {
      const vault = window.app && window.app.vault;
      if (!vault || typeof vault.setConfig !== "function") {
        return false;
      }
      if (vault.__ignisNativeMenuGuarded) {
        return true;
      }
      const orig = vault.setConfig.bind(vault);
      vault.setConfig = function(key, value) {
        if (key === "nativeMenus") {
          return orig("nativeMenus", false);
        }
        return orig(key, value);
      };
      vault.__ignisNativeMenuGuarded = true;
      vault.setConfig("nativeMenus", false);
      return true;
    };
    if (tryPatch()) {
      return;
    }
    const observer2 = new MutationObserver(() => {
      if (tryPatch()) {
        observer2.disconnect();
      }
    });
    observer2.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  function disableNativeMenuToggle() {
    const apply2 = () => {
      document.querySelectorAll(".setting-item-name").forEach((nameEl) => {
        if (!/native.?menu/i.test(nameEl.textContent)) {
          return;
        }
        const item = nameEl.closest(".setting-item");
        const input = item && item.querySelector('input[type="checkbox"]');
        if (!input || input.__ignisDisabled) {
          return;
        }
        input.disabled = true;
        input.__ignisDisabled = true;
        const container = input.closest(".checkbox-container");
        if (container) {
          container.title = "Forced off in Ignis - browser context can't render native menus.";
        }
      });
    };
    const observer2 = new MutationObserver(apply2);
    observer2.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  function initNativeMenuGuard() {
    snapshotAppearance();
    registerReadTransform(APPEARANCE_PATH, readTransform);
    registerWriteTransform(APPEARANCE_PATH, writeTransform);
    patchSetConfig();
    disableNativeMenuToggle();
  }

  // packages/shim/src/browser-detect.js
  function detectBrowser(ua = typeof navigator !== "undefined" && navigator.userAgent || "") {
    if (/\bEdg\//.test(ua)) {
      return "edge";
    }
    if (/\bOPR\//.test(ua)) {
      return "opera";
    }
    if (/\bVivaldi\//.test(ua)) {
      return "vivaldi";
    }
    if (/\bFirefox\//.test(ua)) {
      return "firefox";
    }
    if (/\bSafari\//.test(ua) && !/\bChrom(e|ium)\//.test(ua)) {
      return "safari";
    }
    return "chrome";
  }

  // packages/shim/src/spellcheck-guard.js
  var SETTINGS_URLS = {
    chrome: "chrome://settings/languages",
    edge: "edge://settings/languages",
    opera: "opera://settings/languages",
    vivaldi: "vivaldi://settings/languages",
    firefox: "about:preferences",
    safari: null
  };
  function flash(el, original, message) {
    el.textContent = message;
    setTimeout(() => {
      el.textContent = original;
    }, 1200);
  }
  function copyLink(url) {
    const a = document.createElement("a");
    a.textContent = url;
    a.href = "#";
    a.setAttribute("aria-label", "Copy " + url);
    a.style.color = "inherit";
    a.style.textDecoration = "underline";
    a.style.cursor = "pointer";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      copyText(url).then(
        () => flash(a, url, "Copied"),
        () => flash(a, url, "Copy failed")
      );
    });
    return a;
  }
  function renderNotice(desc) {
    const url = SETTINGS_URLS[detectBrowser()];
    desc.textContent = "";
    desc.style.color = "var(--text-error)";
    desc.appendChild(
      document.createTextNode("Ignis can't set browser spellchecker languages. ")
    );
    if (url) {
      desc.appendChild(document.createTextNode("Please use "));
      desc.appendChild(copyLink(url));
      desc.appendChild(document.createTextNode(" (click to copy)."));
    } else {
      desc.appendChild(
        document.createTextNode(
          "Please enable spellcheck in your system settings."
        )
      );
    }
  }
  function apply() {
    document.querySelectorAll(".setting-item-name").forEach((nameEl) => {
      if (!/spellcheck languages/i.test(nameEl.textContent)) {
        return;
      }
      const item = nameEl.closest(".setting-item");
      if (!item || item.__ignisSpellcheckGuarded) {
        return;
      }
      const select = item.querySelector("select");
      if (select) {
        select.disabled = true;
      }
      const desc = item.querySelector(".setting-item-description");
      if (desc) {
        renderNotice(desc);
      }
      item.__ignisSpellcheckGuarded = true;
    });
  }
  function initSpellcheckGuard() {
    const observer2 = new MutationObserver(apply);
    observer2.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    apply();
  }

  // packages/shim/src/init.js
  var bootstrapVirtualPlugins = [];
  function applyServerSettings(s) {
    if (!s) {
      return;
    }
    if (Number.isFinite(s.contentCacheBytes)) {
      fsShim._contentCache.setMaxSize(s.contentCacheBytes);
    }
    setInputCacheLimits({ maxSize: s.inputCacheBytes, ttlMs: s.inputCacheTtlMs });
    setDirectFetchHosts(s.directFetchHosts);
  }
  function getBootstrapVirtualPlugins() {
    return bootstrapVirtualPlugins;
  }
  function resolveVaultId() {
    const urlParams = new URLSearchParams(window.location.search);
    window.__currentVaultId = urlParams.get("vault") || localStorage.getItem("last-vault") || "";
    const workspace = urlParams.get("workspace") || "";
    window.__workspaceName = isValidWorkspaceName(workspace) ? workspace : "";
  }
  function fetchBootstrap() {
    if (!window.__currentVaultId) {
      return null;
    }
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "/api/bootstrap?vault=" + encodeURIComponent(window.__currentVaultId),
        false
      );
      xhr.send();
      if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
      }
    } catch (e) {
      console.warn("[ignis] Bootstrap fetch failed:", e);
    }
    return null;
  }
  function applyVaultInfo(info) {
    window.__currentVaultId = info.id;
    localStorage.setItem("last-vault", info.id);
    window.__obsidianVersion = info.version || "0.0.0";
    window.__vaultConfig = {
      id: info.id,
      path: "/"
    };
    console.log("[ignis] Vault:", window.__vaultConfig);
    console.log("[ignis] Obsidian version:", window.__obsidianVersion);
  }
  function applyTree(tree) {
    fsShim._metadataCache.populate(tree);
    fsShim._metadataCache.set("", { type: "directory" });
    fsShim._metadataCache.set("/", { type: "directory" });
    console.log(
      "[ignis] Metadata cache populated:",
      fsShim._metadataCache.size,
      "entries"
    );
  }
  function initVaultConfigFallback() {
    try {
      const vaultParam = window.__currentVaultId ? "?vault=" + encodeURIComponent(window.__currentVaultId) : "";
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "/api/vault/info" + vaultParam, false);
      xhr.send();
      if (xhr.status === 200) {
        applyVaultInfo(JSON.parse(xhr.responseText));
      } else {
        console.warn("[ignis] No vault found, will show manager");
      }
    } catch (e) {
      console.error("[ignis] Failed to fetch vault config:", e);
    }
  }
  function initVaultListFallback() {
    try {
      vaultService.listVaultsSync();
    } catch {
      window.__vaultList = [];
    }
  }
  function initMetadataCacheFallback() {
    try {
      const vaultParam = window.__currentVaultId ? "?vault=" + encodeURIComponent(window.__currentVaultId) : "";
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "/api/fs/tree" + vaultParam, false);
      xhr.send();
      if (xhr.status === 200) {
        applyTree(JSON.parse(xhr.responseText));
      } else {
        console.error("[ignis] Failed to fetch metadata tree:", xhr.status);
      }
    } catch (e) {
      console.error("[ignis] Failed to init metadata cache:", e);
    }
  }
  function applyCoreSyncGuard(plugins) {
    const vaultId2 = window.__currentVaultId;
    if (!vaultId2 || !plugins) {
      return;
    }
    const headlessSync = plugins.find(
      (p) => p.id === "headless-sync" && p.bundledPluginId
    );
    if (!headlessSync || !headlessSync.enabledVaults.includes(vaultId2)) {
      return;
    }
    console.log(
      "[ignis] Headless sync active for this vault, patching core-plugins.json reads"
    );
    window.__ignisHeadlessSyncActive = true;
    registerReadTransform(".obsidian/core-plugins.json", (data) => {
      if (!window.__ignisHeadlessSyncActive) {
        return data;
      }
      let text = typeof data === "string" ? data : new TextDecoder().decode(data);
      try {
        const config = JSON.parse(text);
        if (config.sync === true) {
          config.sync = false;
          return JSON.stringify(config);
        }
      } catch {
      }
      return data;
    });
  }
  function initCoreSyncGuardFallback() {
    const vaultId2 = window.__currentVaultId;
    if (!vaultId2) {
      return;
    }
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "/api/plugins", false);
      xhr.send();
      if (xhr.status === 200) {
        applyCoreSyncGuard(JSON.parse(xhr.responseText));
      }
    } catch (e) {
      console.warn("[ignis] Failed to init core sync guard:", e);
    }
  }
  function updateBootProgress(received, total) {
    if (window.__ignisBootStarted) {
      return;
    }
    const label = document.getElementById("ignis-status-label");
    if (!label || !total) {
      return;
    }
    const mb = (n) => (n / (1024 * 1024)).toFixed(1);
    label.textContent = `Loading plugins... ${mb(received)}/${mb(total)} MB`;
  }
  function resolveWorkspaceAndAppearance() {
    resolveWorkspaceName();
    loadPresetIfRequested();
    initNativeMenuGuard();
    initSpellcheckGuard();
  }
  function initialize() {
    if (maybeProvisionDemoVault()) {
      window.__ignisBootReady = Promise.resolve();
      return;
    }
    resolveVaultId();
    const bootstrap = fetchBootstrap();
    if (bootstrap) {
      applyVaultInfo(bootstrap.vault);
      window.__vaultList = bootstrap.vaultList;
      autoTrustDemoVaults(bootstrap.vaultList);
      applyTree(bootstrap.tree);
      fsShim._watcherClient.setTreeRevision(bootstrap.treeRevision);
      applyCoreSyncGuard(bootstrap.plugins);
      bootstrapVirtualPlugins = bootstrap.virtualPlugins || [];
      applyServerSettings(bootstrap.settings);
      const { priority } = prefetchVaultContent(
        window.__currentVaultId,
        bootstrap.tree,
        fsShim._contentCache,
        { onProgress: updateBootProgress }
      );
      window.__ignisBooting = true;
      window.__ignisBootReady = priority.then(resolveWorkspaceAndAppearance);
    } else {
      initVaultConfigFallback();
      initVaultListFallback();
      initMetadataCacheFallback();
      initCoreSyncGuardFallback();
      resolveWorkspaceAndAppearance();
      window.__ignisBootReady = Promise.resolve();
    }
    installRequestUrlShim();
    initWorkspacePatch();
  }

  // packages/shim/src/virtual-plugin-loader.js
  var EXTRACTOR_ID = "ignis-obsidian-extractor";
  var EXTRACTOR_DIR = ".ignis/virtual/" + EXTRACTOR_ID;
  var EXTRACTOR_PATH = EXTRACTOR_DIR + "/main.js";
  var EXTRACTOR_SRC = `
const obsidian = require("obsidian");
window.__ignisCapturedObsidian = obsidian;
module.exports = class extends obsidian.Plugin {
  onload() {}
};
`;
  var EXTRACTOR_MANIFEST = {
    id: EXTRACTOR_ID,
    name: "Ignis Obsidian Module Extractor",
    version: "0.0.0",
    minAppVersion: "1.0.0",
    description: "Internal: captures the obsidian module for virtual plugins.",
    author: "ignis",
    authorUrl: "",
    isDesktopOnly: false,
    dir: EXTRACTOR_DIR
  };
  function waitForApp() {
    return new Promise((resolve) => {
      if (window.app && window.app.plugins && window.app.workspace) {
        return resolve();
      }
      const interval = setInterval(() => {
        if (window.app && window.app.plugins && window.app.workspace) {
          clearInterval(interval);
          resolve();
        }
      }, 20);
    });
  }
  async function extractObsidianModule() {
    if (window.__ignis.obsidian) {
      return window.__ignis.obsidian;
    }
    await waitForApp();
    const plugins = window.app.plugins;
    const wasEnabled = plugins.isEnabled();
    let toggledOn = false;
    if (!wasEnabled) {
      try {
        await plugins.setEnable(true);
        toggledOn = true;
      } catch (e) {
        console.warn(
          "[ignis] could not enable community plugins for extractor:",
          e
        );
      }
    }
    setVirtualFile(EXTRACTOR_PATH, EXTRACTOR_SRC);
    plugins.manifests[EXTRACTOR_ID] = EXTRACTOR_MANIFEST;
    try {
      await plugins.loadPlugin(EXTRACTOR_ID);
    } catch (e) {
      console.error("[ignis] extractor load failed:", e);
    }
    const captured = window.__ignisCapturedObsidian;
    try {
      await plugins.unloadPlugin(EXTRACTOR_ID);
    } catch {
    }
    delete plugins.manifests[EXTRACTOR_ID];
    removeVirtualFile(EXTRACTOR_PATH);
    delete window.__ignisCapturedObsidian;
    if (toggledOn) {
      try {
        await plugins.setEnable(false);
      } catch {
      }
    }
    if (!captured) {
      console.error("[ignis] obsidian module extraction failed");
      return null;
    }
    window.__ignis.obsidian = captured;
    registerShim("obsidian", captured);
    console.log("[ignis] obsidian module captured");
    return captured;
  }
  function assertSameOrigin(url) {
    if (new URL(url, location.origin).origin !== location.origin) {
      throw new Error(`refusing cross-origin plugin URL: ${url}`);
    }
  }
  var inFlight = /* @__PURE__ */ new Map();
  function serialized(id, fn) {
    const prev = inFlight.get(id) || Promise.resolve();
    const next = prev.then(fn, fn);
    inFlight.set(id, next);
    next.finally(() => {
      if (inFlight.get(id) === next) {
        inFlight.delete(id);
      }
    });
    return next;
  }
  function loadVirtualPlugin(entry) {
    return serialized(entry.id, async () => {
      window.__ignis.plugins = window.__ignis.plugins || {};
      if (window.__ignis.plugins[entry.id]) {
        console.log(`[ignis] virtual plugin already loaded: ${entry.id}`);
        return;
      }
      assertSameOrigin(entry.scriptUrl);
      if (entry.cssUrl) {
        assertSameOrigin(entry.cssUrl);
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = entry.cssUrl;
        link.setAttribute("data-ignis-virtual-plugin", entry.id);
        document.head.appendChild(link);
      }
      const res = await fetch(entry.scriptUrl);
      if (!res.ok) {
        throw new Error(
          `fetch ${entry.scriptUrl} -> ${res.status} ${res.statusText}`
        );
      }
      const src = await res.text() + `
//# sourceURL=ignis-virtual/${entry.id}.js`;
      const module = { exports: {} };
      const localRequire = (name) => name === "obsidian" ? window.__ignis.obsidian : window.require(name);
      new Function("module", "exports", "require", src)(
        module,
        module.exports,
        localRequire
      );
      const PluginClass = module.exports.default || module.exports;
      const instance = new PluginClass(window.app, entry.manifest);
      instance._loaded = true;
      await instance.onload();
      window.__ignis.plugins[entry.id] = { instance, manifest: entry.manifest };
    });
  }
  function unloadVirtualPlugin(id) {
    return serialized(id, async () => {
      var _a, _b;
      const tracked = (_b = (_a = window.__ignis) == null ? void 0 : _a.plugins) == null ? void 0 : _b[id];
      if (!tracked) {
        return;
      }
      try {
        await tracked.instance.unload();
      } catch (e) {
        reportUnloadFailure(id, e);
      }
      document.querySelectorAll(`link[data-ignis-virtual-plugin="${id}"]`).forEach((el) => el.remove());
      delete window.__ignis.plugins[id];
    });
  }
  function notice(text) {
    try {
      new window.__ignis.obsidian.Notice(text);
    } catch {
    }
  }
  function reportLoadFailure(id, e) {
    console.error(`[ignis] virtual plugin load failed: ${id}`, e);
    notice(`Failed to load plugin '${id}': ${e.message}`);
  }
  function reportUnloadFailure(id, e) {
    console.warn(`[ignis] virtual plugin unload failed: ${id}`, e);
    notice(`Failed to unload plugin '${id}': ${e.message}`);
  }
  function watchPluginToggles(wsClient2) {
    wsClient2.subscribe("virtual-plugin-enable", (msg) => {
      if (msg.vault !== window.__currentVaultId) {
        return;
      }
      loadVirtualPlugin(msg.entry).catch(
        (e) => {
          var _a;
          return reportLoadFailure((_a = msg.entry) == null ? void 0 : _a.id, e);
        }
      );
    });
    wsClient2.subscribe("virtual-plugin-disable", (msg) => {
      if (msg.vault !== window.__currentVaultId) {
        return;
      }
      unloadVirtualPlugin(msg.id).catch((e) => reportUnloadFailure(msg.id, e));
    });
  }

  // packages/shim/src/ignis-api.js
  function installIgnisApi(wsClient2, writes) {
    window.__ignis = window.__ignis || {};
    Object.defineProperty(window.__ignis, "vault", {
      get() {
        var _a;
        return {
          id: window.__currentVaultId || null,
          path: ((_a = window.__vaultConfig) == null ? void 0 : _a.path) || null
        };
      },
      enumerable: true,
      configurable: true
    });
    window.__ignis.ws = {
      subscribe: wsClient2.subscribe,
      send: wsClient2.send,
      channel: wsClient2.channel,
      isOpen: wsClient2.isOpen,
      onStateChange: wsClient2.onStateChange
    };
    window.__ignis.writes = writes;
    window.__ignis.plugins = window.__ignis.plugins || {};
  }

  // packages/shim/src/loader.js
  window.__ignis = { version: "0.8.10", build: "t7a58wg" };
  window.__ignis_registerUI = registerUI;
  installIgnisApi(wsClient, {
    getState,
    onStateChange,
    onFailure,
    onFailureChange,
    listPending,
    listFailed,
    retryAll,
    getDetail
  });
  var BRIDGE_MANIFEST = {
    id: "ignis-bridge",
    name: "Ignis Bridge",
    version: "0.8.10",
    minAppVersion: "1.12.4",
    description: "Additional Ignis specific functionality and ignis plugin management.",
    author: "Nystik",
    authorUrl: "https://github.com/Nystik-gh/ignis",
    isDesktopOnly: false
  };
  installGlobals();
  installRequire();
  installCssOverrides();
  installEmulateMobile();
  setTimeout(() => {
    window.__ignisBooting = false;
  }, 2e4);
  initialize();
  function onLayoutReady() {
    window.__ignisBooting = false;
  }
  if (window.__currentVaultId) {
    fsShim._watcherClient.connect(window.__currentVaultId);
    watchPluginToggles(wsClient);
  }
  wsClient.subscribe("write-giveup", (msg) => {
    fsShim.invalidate(msg.path);
    window.dispatchEvent(
      new CustomEvent("ignis:write-giveup", { detail: { path: msg.path } })
    );
  });
  extractObsidianModule().then(async () => {
    if (window.app && window.app.workspace && window.app.workspace.onLayoutReady) {
      window.app.workspace.onLayoutReady(onLayoutReady);
    }
    installMobileVaultSwitcher(window.app);
    installOpenFileParam(window.app);
    const mod = await Promise.resolve().then(() => (init_main(), main_exports));
    const IgnisBridgePlugin2 = mod.default || mod;
    const bridge = new IgnisBridgePlugin2(window.app, BRIDGE_MANIFEST);
    await bridge.onload();
    console.log("[ignis] bridge loaded");
    for (const vp of getBootstrapVirtualPlugins()) {
      try {
        await loadVirtualPlugin(vp);
        console.log(`[ignis] virtual plugin loaded: ${vp.id}`);
      } catch (e) {
        reportLoadFailure(vp.id, e);
      }
    }
  }).catch((e) => console.error("[ignis] bridge load failed:", e));
  console.log("[ignis] Shim loader initialized");
})();
/*! Bundled license information:

pako/dist/pako.esm.mjs:
  (*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) *)
*/
