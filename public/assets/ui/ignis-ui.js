var IgnisUI = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/ui/src/index.js
  var src_exports = {};
  __export(src_exports, {
    Banner: () => Banner_default,
    ConfirmDialog: () => ConfirmDialog_default,
    MessageDialog: () => MessageDialog_default,
    PromptDialog: () => PromptDialog_default,
    SyncSetupModal: () => SyncSetupModal_default,
    VaultManager: () => VaultManager_default
  });

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
    _setVaultTrust(vaultId, trusted = true) {
      localStorage.setItem("enable-plugin-" + vaultId, String(trusted));
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

  // node_modules/svelte/src/runtime/internal/utils.js
  function noop() {
  }
  function assign(tar, src) {
    for (const k in src)
      tar[k] = src[k];
    return (
      /** @type {T & S} */
      tar
    );
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === void 0) {
        return lets;
      }
      if (typeof lets === "object") {
        const merged = [];
        const len = Math.max($$scope.dirty.length, lets.length);
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
      const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
      if (k[0] !== "$")
        result[k] = props[k];
    return result;
  }
  function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
      if (!keys.has(k) && k[0] !== "$")
        rest[k] = props[k];
    return rest;
  }
  function compute_slots(slots) {
    const result = {};
    for (const key in slots) {
      result[key] = true;
    }
    return result;
  }

  // node_modules/svelte/src/runtime/internal/globals.js
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
    // @ts-ignore Node typings have this
    global
  );

  // node_modules/svelte/src/runtime/internal/ResizeObserverSingleton.js
  var ResizeObserverSingleton = class _ResizeObserverSingleton {
    /**
     * @private
     * @readonly
     * @type {WeakMap<Element, import('./private.js').Listener>}
     */
    _listeners = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;
    /**
     * @private
     * @type {ResizeObserver}
     */
    _observer = void 0;
    /** @type {ResizeObserverOptions} */
    options;
    /** @param {ResizeObserverOptions} options */
    constructor(options) {
      this.options = options;
    }
    /**
     * @param {Element} element
     * @param {import('./private.js').Listener} listener
     * @returns {() => void}
     */
    observe(element2, listener) {
      this._listeners.set(element2, listener);
      this._getObserver().observe(element2, this.options);
      return () => {
        this._listeners.delete(element2);
        this._observer.unobserve(element2);
      };
    }
    /**
     * @private
     */
    _getObserver() {
      return this._observer ?? (this._observer = new ResizeObserver((entries) => {
        var _a;
        for (const entry of entries) {
          _ResizeObserverSingleton.entries.set(entry.target, entry);
          (_a = this._listeners.get(entry.target)) == null ? void 0 : _a(entry);
        }
      }));
    }
  };
  ResizeObserverSingleton.entries = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;

  // node_modules/svelte/src/runtime/internal/dom.js
  var is_hydrating = false;
  function start_hydrating() {
    is_hydrating = true;
  }
  function end_hydrating() {
    is_hydrating = false;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function append_styles(target, style_sheet_id, styles) {
    const append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
      const style = element("style");
      style.id = style_sheet_id;
      style.textContent = styles;
      append_stylesheet(append_styles_to, style);
    }
  }
  function get_root_for_style(node) {
    if (!node)
      return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && /** @type {ShadowRoot} */
    root.host) {
      return (
        /** @type {ShadowRoot} */
        root
      );
    }
    return node.ownerDocument;
  }
  function append_stylesheet(node, style) {
    append(
      /** @type {Document} */
      node.head || node,
      style
    );
    return style.sheet;
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i])
        iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function set_svg_attributes(node, attributes) {
    for (const key in attributes) {
      attr(node, key, attributes[key]);
    }
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.data === data)
      return;
    text2.data = /** @type {string} */
    data;
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  function set_style(node, key, value, important) {
    if (value == null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? "important" : "");
    }
  }
  function select_option(select, value, mounting) {
    for (let i = 0; i < select.options.length; i += 1) {
      const option = select.options[i];
      if (option.__value === value) {
        option.selected = true;
        return;
      }
    }
    if (!mounting || value !== void 0) {
      select.selectedIndex = -1;
    }
  }
  function select_value(select) {
    const selected_option = select.querySelector(":checked");
    return selected_option && selected_option.__value;
  }
  function toggle_class(element2, name, toggle) {
    element2.classList.toggle(name, !!toggle);
  }
  function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    return new CustomEvent(type, { detail, bubbles, cancelable });
  }
  function get_custom_elements_slots(element2) {
    const result = {};
    element2.childNodes.forEach(
      /** @param {Element} node */
      (node) => {
        result[node.slot || "default"] = true;
      }
    );
    return result;
  }

  // node_modules/svelte/src/runtime/internal/lifecycle.js
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
      const callbacks = component.$$.callbacks[type];
      if (callbacks) {
        const event = custom_event(
          /** @type {string} */
          type,
          detail,
          { cancelable }
        );
        callbacks.slice().forEach((fn) => {
          fn.call(component, event);
        });
        return !event.defaultPrevented;
      }
      return true;
    };
  }

  // node_modules/svelte/src/runtime/internal/scheduler.js
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = /* @__PURE__ */ Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  function add_flush_callback(fn) {
    flush_callbacks.push(fn);
  }
  var seen_callbacks = /* @__PURE__ */ new Set();
  var flushidx = 0;
  function flush() {
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }

  // node_modules/svelte/src/runtime/internal/transitions.js
  var outroing = /* @__PURE__ */ new Set();
  var outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
      // parent group
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }

  // node_modules/svelte/src/runtime/internal/each.js
  function ensure_array_like(array_like_or_iterator) {
    return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
      lookup.delete(block.key);
    });
  }
  function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block5, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
      old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = /* @__PURE__ */ new Map();
    const deltas = /* @__PURE__ */ new Map();
    const updates = [];
    i = n;
    while (i--) {
      const child_ctx = get_context(ctx, list, i);
      const key = get_key(child_ctx);
      let block = lookup.get(key);
      if (!block) {
        block = create_each_block5(key, child_ctx);
        block.c();
      } else if (dynamic) {
        updates.push(() => block.p(child_ctx, dirty));
      }
      new_lookup.set(key, new_blocks[i] = block);
      if (key in old_indexes)
        deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = /* @__PURE__ */ new Set();
    const did_move = /* @__PURE__ */ new Set();
    function insert2(block) {
      transition_in(block, 1);
      block.m(node, next);
      lookup.set(block.key, block);
      next = block.first;
      n--;
    }
    while (o && n) {
      const new_block = new_blocks[n - 1];
      const old_block = old_blocks[o - 1];
      const new_key = new_block.key;
      const old_key = old_block.key;
      if (new_block === old_block) {
        next = new_block.first;
        o--;
        n--;
      } else if (!new_lookup.has(old_key)) {
        destroy(old_block, lookup);
        o--;
      } else if (!lookup.has(new_key) || will_move.has(new_key)) {
        insert2(new_block);
      } else if (did_move.has(old_key)) {
        o--;
      } else if (deltas.get(new_key) > deltas.get(old_key)) {
        did_move.add(new_key);
        insert2(new_block);
      } else {
        will_move.add(old_key);
        o--;
      }
    }
    while (o--) {
      const old_block = old_blocks[o];
      if (!new_lookup.has(old_block.key))
        destroy(old_block, lookup);
    }
    while (n)
      insert2(new_blocks[n - 1]);
    run_all(updates);
    return new_blocks;
  }

  // node_modules/svelte/src/runtime/internal/spread.js
  function get_spread_update(levels, updates) {
    const update2 = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
      const o = levels[i];
      const n = updates[i];
      if (n) {
        for (const key in o) {
          if (!(key in n))
            to_null_out[key] = 1;
        }
        for (const key in n) {
          if (!accounted_for[key]) {
            update2[key] = n[key];
            accounted_for[key] = 1;
          }
        }
        levels[i] = n;
      } else {
        for (const key in o) {
          accounted_for[key] = 1;
        }
      }
    }
    for (const key in to_null_out) {
      if (!(key in update2))
        update2[key] = void 0;
    }
    return update2;
  }
  function get_spread_object(spread_props) {
    return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
  }

  // node_modules/svelte/src/shared/boolean_attributes.js
  var _boolean_attributes = (
    /** @type {const} */
    [
      "allowfullscreen",
      "allowpaymentrequest",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "defer",
      "disabled",
      "formnovalidate",
      "hidden",
      "inert",
      "ismap",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "selected"
    ]
  );
  var boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);

  // node_modules/svelte/src/runtime/internal/Component.js
  function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== void 0) {
      component.$$.bound[index] = callback;
      callback(component.$$.ctx[index]);
    }
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance30, create_fragment30, not_equal, props, append_styles2 = null, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles2 && append_styles2($$.root);
    let ready = false;
    $$.ctx = instance30 ? instance30(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment30 ? create_fragment30($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        start_hydrating();
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      end_hydrating();
      flush();
    }
    set_current_component(parent_component);
  }
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      /** The Svelte component constructor */
      $$ctor;
      /** Slots */
      $$s;
      /** The Svelte component instance */
      $$c;
      /** Whether or not the custom element is connected */
      $$cn = false;
      /** Component props data */
      $$d = {};
      /** `true` if currently in the process of reflecting component props back to attributes */
      $$r = false;
      /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
      $$p_d = {};
      /** @type {Record<string, Function[]>} Event listeners */
      $$l = {};
      /** @type {Map<Function, Function>} Event listener unsubscribe functions */
      $$l_u = /* @__PURE__ */ new Map();
      constructor($$componentCtor, $$slots, use_shadow_dom) {
        super();
        this.$$ctor = $$componentCtor;
        this.$$s = $$slots;
        if (use_shadow_dom) {
          this.attachShadow({ mode: "open" });
        }
      }
      addEventListener(type, listener, options) {
        this.$$l[type] = this.$$l[type] || [];
        this.$$l[type].push(listener);
        if (this.$$c) {
          const unsub = this.$$c.$on(type, listener);
          this.$$l_u.set(listener, unsub);
        }
        super.addEventListener(type, listener, options);
      }
      removeEventListener(type, listener, options) {
        super.removeEventListener(type, listener, options);
        if (this.$$c) {
          const unsub = this.$$l_u.get(listener);
          if (unsub) {
            unsub();
            this.$$l_u.delete(listener);
          }
        }
        if (this.$$l[type]) {
          const idx = this.$$l[type].indexOf(listener);
          if (idx >= 0) {
            this.$$l[type].splice(idx, 1);
          }
        }
      }
      async connectedCallback() {
        this.$$cn = true;
        if (!this.$$c) {
          let create_slot2 = function(name) {
            return () => {
              let node;
              const obj = {
                c: function create() {
                  node = element("slot");
                  if (name !== "default") {
                    attr(node, "name", name);
                  }
                },
                /**
                 * @param {HTMLElement} target
                 * @param {HTMLElement} [anchor]
                 */
                m: function mount(target, anchor) {
                  insert(target, node, anchor);
                },
                d: function destroy(detaching) {
                  if (detaching) {
                    detach(node);
                  }
                }
              };
              return obj;
            };
          };
          await Promise.resolve();
          if (!this.$$cn || this.$$c) {
            return;
          }
          const $$slots = {};
          const existing_slots = get_custom_elements_slots(this);
          for (const name of this.$$s) {
            if (name in existing_slots) {
              $$slots[name] = [create_slot2(name)];
            }
          }
          for (const attribute of this.attributes) {
            const name = this.$$g_p(attribute.name);
            if (!(name in this.$$d)) {
              this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
            }
          }
          for (const key in this.$$p_d) {
            if (!(key in this.$$d) && this[key] !== void 0) {
              this.$$d[key] = this[key];
              delete this[key];
            }
          }
          this.$$c = new this.$$ctor({
            target: this.shadowRoot || this,
            props: {
              ...this.$$d,
              $$slots,
              $$scope: {
                ctx: []
              }
            }
          });
          const reflect_attributes = () => {
            this.$$r = true;
            for (const key in this.$$p_d) {
              this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
              if (this.$$p_d[key].reflect) {
                const attribute_value = get_custom_element_value(
                  key,
                  this.$$d[key],
                  this.$$p_d,
                  "toAttribute"
                );
                if (attribute_value == null) {
                  this.removeAttribute(this.$$p_d[key].attribute || key);
                } else {
                  this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
                }
              }
            }
            this.$$r = false;
          };
          this.$$c.$$.after_update.push(reflect_attributes);
          reflect_attributes();
          for (const type in this.$$l) {
            for (const listener of this.$$l[type]) {
              const unsub = this.$$c.$on(type, listener);
              this.$$l_u.set(listener, unsub);
            }
          }
          this.$$l = {};
        }
      }
      // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
      // and setting attributes through setAttribute etc, this is helpful
      attributeChangedCallback(attr2, _oldValue, newValue) {
        var _a;
        if (this.$$r)
          return;
        attr2 = this.$$g_p(attr2);
        this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
        (_a = this.$$c) == null ? void 0 : _a.$set({ [attr2]: this.$$d[attr2] });
      }
      disconnectedCallback() {
        this.$$cn = false;
        Promise.resolve().then(() => {
          if (!this.$$cn && this.$$c) {
            this.$$c.$destroy();
            this.$$c = void 0;
          }
        });
      }
      $$g_p(attribute_name) {
        return Object.keys(this.$$p_d).find(
          (key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name
        ) || attribute_name;
      }
    };
  }
  function get_custom_element_value(prop, value, props_definition, transform) {
    var _a;
    const type = (_a = props_definition[prop]) == null ? void 0 : _a.type;
    value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
    if (!transform || !props_definition[prop]) {
      return value;
    } else if (transform === "toAttribute") {
      switch (type) {
        case "Object":
        case "Array":
          return value == null ? null : JSON.stringify(value);
        case "Boolean":
          return value ? "" : null;
        case "Number":
          return value == null ? null : value;
        default:
          return value;
      }
    } else {
      switch (type) {
        case "Object":
        case "Array":
          return value && JSON.parse(value);
        case "Boolean":
          return value;
        case "Number":
          return value != null ? +value : value;
        default:
          return value;
      }
    }
  }
  var SvelteComponent = class {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    $$ = void 0;
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    $$set = void 0;
    /** @returns {void} */
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    /**
     * @template {Extract<keyof Events, string>} K
     * @param {K} type
     * @param {((e: Events[K]) => void) | null | undefined} callback
     * @returns {() => void}
     */
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    /**
     * @param {Partial<Props>} props
     * @returns {void}
     */
    $set(props) {
      if (this.$$set && !is_empty(props)) {
        this.$$.skip_bound = true;
        this.$$set(props);
        this.$$.skip_bound = false;
      }
    }
  };

  // node_modules/svelte/src/shared/version.js
  var PUBLIC_VERSION = "4";

  // node_modules/svelte/src/runtime/internal/disclose-version/index.js
  if (typeof window !== "undefined")
    (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);

  // node_modules/lucide-svelte/dist/defaultAttributes.js
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  };
  var defaultAttributes_default = defaultAttributes;

  // node_modules/lucide-svelte/dist/utils/hasA11yProp.js
  var hasA11yProp = (props) => {
    for (const prop in props) {
      if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
        return true;
      }
    }
    return false;
  };

  // node_modules/lucide-svelte/dist/utils/mergeClasses.js
  var mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
  }).join(" ").trim();

  // node_modules/lucide-svelte/dist/Icon.svelte
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[10] = list[i][0];
    child_ctx[11] = list[i][1];
    return child_ctx;
  }
  function create_dynamic_element(ctx) {
    let svelte_element;
    let svelte_element_levels = [
      /*attrs*/
      ctx[11]
    ];
    let svelte_element_data = {};
    for (let i = 0; i < svelte_element_levels.length; i += 1) {
      svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    }
    return {
      c() {
        svelte_element = svg_element(
          /*tag*/
          ctx[10]
        );
        set_svg_attributes(svelte_element, svelte_element_data);
      },
      m(target, anchor) {
        insert(target, svelte_element, anchor);
      },
      p(ctx2, dirty) {
        set_svg_attributes(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*iconNode*/
        32 && /*attrs*/
        ctx2[11]]));
      },
      d(detaching) {
        if (detaching) {
          detach(svelte_element);
        }
      }
    };
  }
  function create_each_block(ctx) {
    let previous_tag = (
      /*tag*/
      ctx[10]
    );
    let svelte_element_anchor;
    let svelte_element = (
      /*tag*/
      ctx[10] && create_dynamic_element(ctx)
    );
    return {
      c() {
        if (svelte_element)
          svelte_element.c();
        svelte_element_anchor = empty();
      },
      m(target, anchor) {
        if (svelte_element)
          svelte_element.m(target, anchor);
        insert(target, svelte_element_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (
          /*tag*/
          ctx2[10]
        ) {
          if (!previous_tag) {
            svelte_element = create_dynamic_element(ctx2);
            previous_tag = /*tag*/
            ctx2[10];
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else if (safe_not_equal(
            previous_tag,
            /*tag*/
            ctx2[10]
          )) {
            svelte_element.d(1);
            svelte_element = create_dynamic_element(ctx2);
            previous_tag = /*tag*/
            ctx2[10];
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else {
            svelte_element.p(ctx2, dirty);
          }
        } else if (previous_tag) {
          svelte_element.d(1);
          svelte_element = null;
          previous_tag = /*tag*/
          ctx2[10];
        }
      },
      d(detaching) {
        if (detaching) {
          detach(svelte_element_anchor);
        }
        if (svelte_element)
          svelte_element.d(detaching);
      }
    };
  }
  function create_fragment(ctx) {
    let svg;
    let each_1_anchor;
    let svg_stroke_width_value;
    let svg_class_value;
    let current;
    let each_value = ensure_array_like(
      /*iconNode*/
      ctx[5]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }
    const default_slot_template = (
      /*#slots*/
      ctx[9].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[8],
      null
    );
    let svg_levels = [
      defaultAttributes_default,
      !hasA11yProp(
        /*$$restProps*/
        ctx[6]
      ) ? { "aria-hidden": "true" } : void 0,
      /*$$restProps*/
      ctx[6],
      { width: (
        /*size*/
        ctx[2]
      ) },
      { height: (
        /*size*/
        ctx[2]
      ) },
      { stroke: (
        /*color*/
        ctx[1]
      ) },
      {
        "stroke-width": svg_stroke_width_value = /*absoluteStrokeWidth*/
        ctx[4] ? Number(
          /*strokeWidth*/
          ctx[3]
        ) * 24 / Number(
          /*size*/
          ctx[2]
        ) : (
          /*strokeWidth*/
          ctx[3]
        )
      },
      {
        class: svg_class_value = mergeClasses(
          "lucide-icon",
          "lucide",
          /*name*/
          ctx[0] ? `lucide-${/*name*/
          ctx[0]}` : "",
          /*$$props*/
          ctx[7].class
        )
      }
    ];
    let svg_data = {};
    for (let i = 0; i < svg_levels.length; i += 1) {
      svg_data = assign(svg_data, svg_levels[i]);
    }
    return {
      c() {
        svg = svg_element("svg");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
        if (default_slot)
          default_slot.c();
        set_svg_attributes(svg, svg_data);
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(svg, null);
          }
        }
        append(svg, each_1_anchor);
        if (default_slot) {
          default_slot.m(svg, null);
        }
        current = true;
      },
      p(ctx2, [dirty]) {
        if (dirty & /*iconNode*/
        32) {
          each_value = ensure_array_like(
            /*iconNode*/
            ctx2[5]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(svg, each_1_anchor);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          256)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[8],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[8]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[8],
                dirty,
                null
              ),
              null
            );
          }
        }
        set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
          defaultAttributes_default,
          dirty & /*$$restProps*/
          64 && (!hasA11yProp(
            /*$$restProps*/
            ctx2[6]
          ) ? { "aria-hidden": "true" } : void 0),
          dirty & /*$$restProps*/
          64 && /*$$restProps*/
          ctx2[6],
          (!current || dirty & /*size*/
          4) && { width: (
            /*size*/
            ctx2[2]
          ) },
          (!current || dirty & /*size*/
          4) && { height: (
            /*size*/
            ctx2[2]
          ) },
          (!current || dirty & /*color*/
          2) && { stroke: (
            /*color*/
            ctx2[1]
          ) },
          (!current || dirty & /*absoluteStrokeWidth, strokeWidth, size*/
          28 && svg_stroke_width_value !== (svg_stroke_width_value = /*absoluteStrokeWidth*/
          ctx2[4] ? Number(
            /*strokeWidth*/
            ctx2[3]
          ) * 24 / Number(
            /*size*/
            ctx2[2]
          ) : (
            /*strokeWidth*/
            ctx2[3]
          ))) && { "stroke-width": svg_stroke_width_value },
          (!current || dirty & /*name, $$props*/
          129 && svg_class_value !== (svg_class_value = mergeClasses(
            "lucide-icon",
            "lucide",
            /*name*/
            ctx2[0] ? `lucide-${/*name*/
            ctx2[0]}` : "",
            /*$$props*/
            ctx2[7].class
          ))) && { class: svg_class_value }
        ]));
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(svg);
        }
        destroy_each(each_blocks, detaching);
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    const omit_props_names = ["name", "color", "size", "strokeWidth", "absoluteStrokeWidth", "iconNode"];
    let $$restProps = compute_rest_props($$props, omit_props_names);
    let { $$slots: slots = {}, $$scope } = $$props;
    let { name = void 0 } = $$props;
    let { color = "currentColor" } = $$props;
    let { size = 24 } = $$props;
    let { strokeWidth = 2 } = $$props;
    let { absoluteStrokeWidth = false } = $$props;
    let { iconNode = [] } = $$props;
    $$self.$$set = ($$new_props) => {
      $$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      $$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
      if ("name" in $$new_props)
        $$invalidate(0, name = $$new_props.name);
      if ("color" in $$new_props)
        $$invalidate(1, color = $$new_props.color);
      if ("size" in $$new_props)
        $$invalidate(2, size = $$new_props.size);
      if ("strokeWidth" in $$new_props)
        $$invalidate(3, strokeWidth = $$new_props.strokeWidth);
      if ("absoluteStrokeWidth" in $$new_props)
        $$invalidate(4, absoluteStrokeWidth = $$new_props.absoluteStrokeWidth);
      if ("iconNode" in $$new_props)
        $$invalidate(5, iconNode = $$new_props.iconNode);
      if ("$$scope" in $$new_props)
        $$invalidate(8, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [
      name,
      color,
      size,
      strokeWidth,
      absoluteStrokeWidth,
      iconNode,
      $$restProps,
      $$props,
      $$scope,
      slots
    ];
  }
  var Icon = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {
        name: 0,
        color: 1,
        size: 2,
        strokeWidth: 3,
        absoluteStrokeWidth: 4,
        iconNode: 5
      });
    }
  };
  var Icon_default = Icon;

  // node_modules/lucide-svelte/dist/icons/check.svelte
  function create_default_slot(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment2(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "check" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance2($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Check = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance2, create_fragment2, safe_not_equal, {});
    }
  };
  var check_default = Check;

  // node_modules/lucide-svelte/dist/icons/circle-alert.svelte
  function create_default_slot2(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment3(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "circle-alert" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot2] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance3($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "10" }],
      [
        "line",
        {
          "x1": "12",
          "x2": "12",
          "y1": "8",
          "y2": "12"
        }
      ],
      [
        "line",
        {
          "x1": "12",
          "x2": "12.01",
          "y1": "16",
          "y2": "16"
        }
      ]
    ];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Circle_alert = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance3, create_fragment3, safe_not_equal, {});
    }
  };
  var circle_alert_default = Circle_alert;

  // node_modules/lucide-svelte/dist/icons/ellipsis-vertical.svelte
  function create_default_slot3(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment4(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "ellipsis-vertical" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot3] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance4($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "1" }],
      ["circle", { "cx": "12", "cy": "5", "r": "1" }],
      ["circle", { "cx": "12", "cy": "19", "r": "1" }]
    ];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Ellipsis_vertical = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance4, create_fragment4, safe_not_equal, {});
    }
  };
  var ellipsis_vertical_default = Ellipsis_vertical;

  // node_modules/lucide-svelte/dist/icons/folder.svelte
  function create_default_slot4(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment5(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "folder" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot4] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance5($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
        }
      ]
    ];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Folder = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance5, create_fragment5, safe_not_equal, {});
    }
  };
  var folder_default = Folder;

  // node_modules/lucide-svelte/dist/icons/pen-line.svelte
  function create_default_slot5(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment6(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "pen-line" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot5] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance6($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [
      ["path", { "d": "M13 21h8" }],
      [
        "path",
        {
          "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
        }
      ]
    ];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Pen_line = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance6, create_fragment6, safe_not_equal, {});
    }
  };
  var pen_line_default = Pen_line;

  // node_modules/lucide-svelte/dist/icons/pencil.svelte
  function create_default_slot6(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment7(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "pencil" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot6] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance7($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
        }
      ],
      ["path", { "d": "m15 5 4 4" }]
    ];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Pencil = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance7, create_fragment7, safe_not_equal, {});
    }
  };
  var pencil_default = Pencil;

  // node_modules/lucide-svelte/dist/icons/plus.svelte
  function create_default_slot7(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment8(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "plus" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot7] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance8($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Plus = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance8, create_fragment8, safe_not_equal, {});
    }
  };
  var plus_default = Plus;

  // node_modules/lucide-svelte/dist/icons/search.svelte
  function create_default_slot8(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment9(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "search" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot8] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance9($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [
      ["path", { "d": "m21 21-4.34-4.34" }],
      ["circle", { "cx": "11", "cy": "11", "r": "8" }]
    ];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Search = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance9, create_fragment9, safe_not_equal, {});
    }
  };
  var search_default = Search;

  // node_modules/lucide-svelte/dist/icons/square-plus.svelte
  function create_default_slot9(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment10(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "square-plus" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot9] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance10($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [
      [
        "rect",
        {
          "width": "18",
          "height": "18",
          "x": "3",
          "y": "3",
          "rx": "2"
        }
      ],
      ["path", { "d": "M8 12h8" }],
      ["path", { "d": "M12 8v8" }]
    ];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Square_plus = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance10, create_fragment10, safe_not_equal, {});
    }
  };
  var square_plus_default = Square_plus;

  // node_modules/lucide-svelte/dist/icons/trash-2.svelte
  function create_default_slot10(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment11(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "trash-2" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot10] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance11($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [
      ["path", { "d": "M10 11v6" }],
      ["path", { "d": "M14 11v6" }],
      [
        "path",
        {
          "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
        }
      ],
      ["path", { "d": "M3 6h18" }],
      [
        "path",
        {
          "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        }
      ]
    ];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Trash_2 = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance11, create_fragment11, safe_not_equal, {});
    }
  };
  var trash_2_default = Trash_2;

  // node_modules/lucide-svelte/dist/icons/triangle-alert.svelte
  function create_default_slot11(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment12(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "triangle-alert" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot11] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance12($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
        }
      ],
      ["path", { "d": "M12 9v4" }],
      ["path", { "d": "M12 17h.01" }]
    ];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Triangle_alert = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance12, create_fragment12, safe_not_equal, {});
    }
  };
  var triangle_alert_default = Triangle_alert;

  // node_modules/lucide-svelte/dist/icons/vault.svelte
  function create_default_slot12(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment13(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "vault" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot12] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance13($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [
      [
        "rect",
        {
          "width": "18",
          "height": "18",
          "x": "3",
          "y": "3",
          "rx": "2"
        }
      ],
      [
        "circle",
        {
          "cx": "7.5",
          "cy": "7.5",
          "r": ".5",
          "fill": "currentColor"
        }
      ],
      ["path", { "d": "m7.9 7.9 2.7 2.7" }],
      [
        "circle",
        {
          "cx": "16.5",
          "cy": "7.5",
          "r": ".5",
          "fill": "currentColor"
        }
      ],
      ["path", { "d": "m13.4 10.6 2.7-2.7" }],
      [
        "circle",
        {
          "cx": "7.5",
          "cy": "16.5",
          "r": ".5",
          "fill": "currentColor"
        }
      ],
      ["path", { "d": "m7.9 16.1 2.7-2.7" }],
      [
        "circle",
        {
          "cx": "16.5",
          "cy": "16.5",
          "r": ".5",
          "fill": "currentColor"
        }
      ],
      ["path", { "d": "m13.4 13.4 2.7 2.7" }],
      ["circle", { "cx": "12", "cy": "12", "r": "2" }]
    ];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var Vault = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance13, create_fragment13, safe_not_equal, {});
    }
  };
  var vault_default = Vault;

  // node_modules/lucide-svelte/dist/icons/x.svelte
  function create_default_slot13(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_fragment14(ctx) {
    let icon;
    let current;
    const icon_spread_levels = [
      { name: "x" },
      /*$$props*/
      ctx[1],
      { iconNode: (
        /*iconNode*/
        ctx[0]
      ) }
    ];
    let icon_props = {
      $$slots: { default: [create_default_slot13] },
      $$scope: { ctx }
    };
    for (let i = 0; i < icon_spread_levels.length; i += 1) {
      icon_props = assign(icon_props, icon_spread_levels[i]);
    }
    icon = new Icon_default({ props: icon_props });
    return {
      c() {
        create_component(icon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(icon, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const icon_changes = dirty & /*$$props, iconNode*/
        3 ? get_spread_update(icon_spread_levels, [
          icon_spread_levels[0],
          dirty & /*$$props*/
          2 && get_spread_object(
            /*$$props*/
            ctx2[1]
          ),
          dirty & /*iconNode*/
          1 && { iconNode: (
            /*iconNode*/
            ctx2[0]
          ) }
        ]) : {};
        if (dirty & /*$$scope*/
        8) {
          icon_changes.$$scope = { dirty, ctx: ctx2 };
        }
        icon.$set(icon_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(icon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(icon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(icon, detaching);
      }
    };
  }
  function instance14($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const iconNode = [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]];
    $$self.$$set = ($$new_props) => {
      $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
      if ("$$scope" in $$new_props)
        $$invalidate(3, $$scope = $$new_props.$$scope);
    };
    $$props = exclude_internal_props($$props);
    return [iconNode, $$props, slots, $$scope];
  }
  var X = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance14, create_fragment14, safe_not_equal, {});
    }
  };
  var x_default = X;

  // packages/ui/src/components/layout/Modal.svelte
  function add_css(target) {
    append_styles(target, "svelte-1t3ht5j", ".modal-overlay.svelte-1t3ht5j{position:fixed;inset:0;z-index:99999;background:rgba(0, 0, 0, 0.4);display:flex;align-items:center;justify-content:center;font-family:var(--font-interface)}.modal-shell.svelte-1t3ht5j{background:var(--background-secondary);color:var(--text-normal);border-radius:0.75rem;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 1rem 3rem rgba(0, 0, 0, 0.5);overflow:hidden}.modal-header.svelte-1t3ht5j{display:flex;align-items:center;justify-content:space-between;padding:0.5rem 1rem 0.5rem 1.5rem;background:var(--background-primary);flex-shrink:0}.header-left.svelte-1t3ht5j{display:flex;align-items:center;gap:0.625rem;color:var(--text-muted)}.header-title.svelte-1t3ht5j{font-size:1rem;font-weight:600;color:var(--text-normal)}.close-btn.svelte-1t3ht5j{background:none;border:none;box-shadow:none;color:var(--text-muted);cursor:pointer;padding:0.25rem;border-radius:0.25rem;display:flex;align-items:center}.close-btn.svelte-1t3ht5j:hover{color:var(--text-normal)}.modal-footer.svelte-1t3ht5j{padding:0.8rem 1.5rem 0.8rem;flex-shrink:0}");
  }
  var get_footer_slot_changes = (dirty) => ({});
  var get_footer_slot_context = (ctx) => ({});
  var get_icon_slot_changes = (dirty) => ({});
  var get_icon_slot_context = (ctx) => ({});
  function create_if_block(ctx) {
    let div;
    let current;
    const footer_slot_template = (
      /*#slots*/
      ctx[10].footer
    );
    const footer_slot = create_slot(
      footer_slot_template,
      ctx,
      /*$$scope*/
      ctx[9],
      get_footer_slot_context
    );
    return {
      c() {
        div = element("div");
        if (footer_slot)
          footer_slot.c();
        attr(div, "class", "modal-footer svelte-1t3ht5j");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (footer_slot) {
          footer_slot.m(div, null);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (footer_slot) {
          if (footer_slot.p && (!current || dirty & /*$$scope*/
          512)) {
            update_slot_base(
              footer_slot,
              footer_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[9],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[9]
              ) : get_slot_changes(
                footer_slot_template,
                /*$$scope*/
                ctx2[9],
                dirty,
                get_footer_slot_changes
              ),
              get_footer_slot_context
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(footer_slot, local);
        current = true;
      },
      o(local) {
        transition_out(footer_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (footer_slot)
          footer_slot.d(detaching);
      }
    };
  }
  function create_fragment15(ctx) {
    let div3;
    let div2;
    let div1;
    let div0;
    let t0;
    let span;
    let t1;
    let t2;
    let button;
    let x;
    let t3;
    let t4;
    let current;
    let mounted;
    let dispose;
    const icon_slot_template = (
      /*#slots*/
      ctx[10].icon
    );
    const icon_slot = create_slot(
      icon_slot_template,
      ctx,
      /*$$scope*/
      ctx[9],
      get_icon_slot_context
    );
    x = new x_default({ props: { size: "1.125rem" } });
    const default_slot_template = (
      /*#slots*/
      ctx[10].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[9],
      null
    );
    let if_block = (
      /*$$slots*/
      ctx[6].footer && create_if_block(ctx)
    );
    return {
      c() {
        div3 = element("div");
        div2 = element("div");
        div1 = element("div");
        div0 = element("div");
        if (icon_slot)
          icon_slot.c();
        t0 = space();
        span = element("span");
        t1 = text(
          /*title*/
          ctx[0]
        );
        t2 = space();
        button = element("button");
        create_component(x.$$.fragment);
        t3 = space();
        if (default_slot)
          default_slot.c();
        t4 = space();
        if (if_block)
          if_block.c();
        attr(span, "class", "header-title svelte-1t3ht5j");
        attr(div0, "class", "header-left svelte-1t3ht5j");
        attr(button, "class", "close-btn svelte-1t3ht5j");
        attr(button, "title", "Close");
        attr(div1, "class", "modal-header svelte-1t3ht5j");
        attr(div2, "class", "modal-shell svelte-1t3ht5j");
        set_style(div2, "width", "min(" + /*width*/
        ctx[1] + ", 90vw)");
        attr(div3, "class", "modal-overlay svelte-1t3ht5j");
      },
      m(target, anchor) {
        insert(target, div3, anchor);
        append(div3, div2);
        append(div2, div1);
        append(div1, div0);
        if (icon_slot) {
          icon_slot.m(div0, null);
        }
        append(div0, t0);
        append(div0, span);
        append(span, t1);
        append(div1, t2);
        append(div1, button);
        mount_component(x, button, null);
        append(div2, t3);
        if (default_slot) {
          default_slot.m(div2, null);
        }
        append(div2, t4);
        if (if_block)
          if_block.m(div2, null);
        ctx[11](div3);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              button,
              "click",
              /*close*/
              ctx[3]
            ),
            listen(
              div3,
              "click",
              /*onOverlayClick*/
              ctx[4]
            ),
            listen(
              div3,
              "keydown",
              /*onKeydown*/
              ctx[5]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (icon_slot) {
          if (icon_slot.p && (!current || dirty & /*$$scope*/
          512)) {
            update_slot_base(
              icon_slot,
              icon_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[9],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[9]
              ) : get_slot_changes(
                icon_slot_template,
                /*$$scope*/
                ctx2[9],
                dirty,
                get_icon_slot_changes
              ),
              get_icon_slot_context
            );
          }
        }
        if (!current || dirty & /*title*/
        1)
          set_data(
            t1,
            /*title*/
            ctx2[0]
          );
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          512)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[9],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[9]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[9],
                dirty,
                null
              ),
              null
            );
          }
        }
        if (
          /*$$slots*/
          ctx2[6].footer
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*$$slots*/
            64) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(div2, null);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
        if (!current || dirty & /*width*/
        2) {
          set_style(div2, "width", "min(" + /*width*/
          ctx2[1] + ", 90vw)");
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(icon_slot, local);
        transition_in(x.$$.fragment, local);
        transition_in(default_slot, local);
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(icon_slot, local);
        transition_out(x.$$.fragment, local);
        transition_out(default_slot, local);
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div3);
        }
        if (icon_slot)
          icon_slot.d(detaching);
        destroy_component(x);
        if (default_slot)
          default_slot.d(detaching);
        if (if_block)
          if_block.d();
        ctx[11](null);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance15($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const $$slots = compute_slots(slots);
    let { title = "" } = $$props;
    let { width = "600px" } = $$props;
    let { closeOnOverlayClick = true } = $$props;
    const dispatch = createEventDispatcher();
    let overlayEl;
    function close() {
      if (overlayEl) {
        overlayEl.remove();
      }
      dispatch("close");
    }
    function onOverlayClick(e) {
      if (e.target === overlayEl && closeOnOverlayClick) {
        close();
      }
    }
    function onKeydown(e) {
      if (e.key === "Escape") {
        dispatch("escape");
      }
    }
    function dismiss() {
      close();
    }
    function div3_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        overlayEl = $$value;
        $$invalidate(2, overlayEl);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("title" in $$props2)
        $$invalidate(0, title = $$props2.title);
      if ("width" in $$props2)
        $$invalidate(1, width = $$props2.width);
      if ("closeOnOverlayClick" in $$props2)
        $$invalidate(7, closeOnOverlayClick = $$props2.closeOnOverlayClick);
      if ("$$scope" in $$props2)
        $$invalidate(9, $$scope = $$props2.$$scope);
    };
    return [
      title,
      width,
      overlayEl,
      close,
      onOverlayClick,
      onKeydown,
      $$slots,
      closeOnOverlayClick,
      dismiss,
      $$scope,
      slots,
      div3_binding
    ];
  }
  var Modal = class extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance15,
        create_fragment15,
        safe_not_equal,
        {
          title: 0,
          width: 1,
          closeOnOverlayClick: 7,
          dismiss: 8
        },
        add_css
      );
    }
    get dismiss() {
      return this.$$.ctx[8];
    }
  };
  var Modal_default = Modal;

  // packages/ui/src/components/input/Button.svelte
  function add_css2(target) {
    append_styles(target, "svelte-2kjcwi", ".btn.svelte-2kjcwi{display:inline-flex;align-items:center;gap:0.375rem;font-size:0.875rem;font-weight:500;cursor:pointer;border-radius:0.375rem;box-shadow:none;transition:background 0.1s}.btn.svelte-2kjcwi:disabled{opacity:0.5;cursor:not-allowed}.btn-icon.svelte-2kjcwi{display:flex;align-items:center}.primary.svelte-2kjcwi{padding:0.375rem 1rem;border:none;background:var(--interactive-accent);color:var(--text-on-accent)}.primary.svelte-2kjcwi:hover:not(:disabled){filter:brightness(1.1)}.secondary.svelte-2kjcwi{padding:0.375rem 0.75rem;border:1px solid var(--background-modifier-border);background:none;color:var(--text-muted)}.secondary.svelte-2kjcwi:hover:not(:disabled){color:var(--text-normal);background:var(--background-modifier-hover)}.ghost.svelte-2kjcwi{padding:0.375rem 0.5rem;border:none;background:none;color:var(--interactive-accent)}.ghost.svelte-2kjcwi:hover:not(:disabled){background:var(--background-modifier-hover)}.danger.svelte-2kjcwi{padding:0.375rem 1rem;border:none;background:var(--text-error, #e93147);color:#fff}.danger.svelte-2kjcwi:hover:not(:disabled){filter:brightness(1.1)}");
  }
  var get_icon_slot_changes2 = (dirty) => ({});
  var get_icon_slot_context2 = (ctx) => ({});
  function create_if_block2(ctx) {
    let span;
    let current;
    const icon_slot_template = (
      /*#slots*/
      ctx[7].icon
    );
    const icon_slot = create_slot(
      icon_slot_template,
      ctx,
      /*$$scope*/
      ctx[6],
      get_icon_slot_context2
    );
    return {
      c() {
        span = element("span");
        if (icon_slot)
          icon_slot.c();
        attr(span, "class", "btn-icon svelte-2kjcwi");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        if (icon_slot) {
          icon_slot.m(span, null);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (icon_slot) {
          if (icon_slot.p && (!current || dirty & /*$$scope*/
          64)) {
            update_slot_base(
              icon_slot,
              icon_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[6],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[6]
              ) : get_slot_changes(
                icon_slot_template,
                /*$$scope*/
                ctx2[6],
                dirty,
                get_icon_slot_changes2
              ),
              get_icon_slot_context2
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(icon_slot, local);
        current = true;
      },
      o(local) {
        transition_out(icon_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
        if (icon_slot)
          icon_slot.d(detaching);
      }
    };
  }
  function create_fragment16(ctx) {
    let button;
    let t;
    let button_class_value;
    let current;
    let mounted;
    let dispose;
    let if_block = (
      /*$$slots*/
      ctx[5].icon && create_if_block2(ctx)
    );
    const default_slot_template = (
      /*#slots*/
      ctx[7].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[6],
      null
    );
    return {
      c() {
        button = element("button");
        if (if_block)
          if_block.c();
        t = space();
        if (default_slot)
          default_slot.c();
        attr(button, "class", button_class_value = "btn " + /*variant*/
        ctx[0] + " svelte-2kjcwi");
        attr(
          button,
          "type",
          /*type*/
          ctx[3]
        );
        button.disabled = /*disabled*/
        ctx[1];
        attr(
          button,
          "title",
          /*title*/
          ctx[2]
        );
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (if_block)
          if_block.m(button, null);
        append(button, t);
        if (default_slot) {
          default_slot.m(button, null);
        }
        current = true;
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*onClick*/
            ctx[4]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (
          /*$$slots*/
          ctx2[5].icon
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*$$slots*/
            32) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block2(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(button, t);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          64)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[6],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[6]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[6],
                dirty,
                null
              ),
              null
            );
          }
        }
        if (!current || dirty & /*variant*/
        1 && button_class_value !== (button_class_value = "btn " + /*variant*/
        ctx2[0] + " svelte-2kjcwi")) {
          attr(button, "class", button_class_value);
        }
        if (!current || dirty & /*type*/
        8) {
          attr(
            button,
            "type",
            /*type*/
            ctx2[3]
          );
        }
        if (!current || dirty & /*disabled*/
        2) {
          button.disabled = /*disabled*/
          ctx2[1];
        }
        if (!current || dirty & /*title*/
        4) {
          attr(
            button,
            "title",
            /*title*/
            ctx2[2]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        if (if_block)
          if_block.d();
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function instance16($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const $$slots = compute_slots(slots);
    let { variant = "primary" } = $$props;
    let { disabled = false } = $$props;
    let { title = "" } = $$props;
    let { type = "button" } = $$props;
    const dispatch = createEventDispatcher();
    function onClick(e) {
      if (!disabled) {
        dispatch("click", e);
      }
    }
    $$self.$$set = ($$props2) => {
      if ("variant" in $$props2)
        $$invalidate(0, variant = $$props2.variant);
      if ("disabled" in $$props2)
        $$invalidate(1, disabled = $$props2.disabled);
      if ("title" in $$props2)
        $$invalidate(2, title = $$props2.title);
      if ("type" in $$props2)
        $$invalidate(3, type = $$props2.type);
      if ("$$scope" in $$props2)
        $$invalidate(6, $$scope = $$props2.$$scope);
    };
    return [variant, disabled, title, type, onClick, $$slots, $$scope, slots];
  }
  var Button = class extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance16,
        create_fragment16,
        safe_not_equal,
        {
          variant: 0,
          disabled: 1,
          title: 2,
          type: 3
        },
        add_css2
      );
    }
  };
  var Button_default = Button;

  // packages/ui/src/components/layout/InsecureContextModal.svelte
  function add_css3(target) {
    append_styles(target, "svelte-lsz7kn", ".body.svelte-lsz7kn.svelte-lsz7kn{padding:0 1.5rem 0;font-size:0.9rem;line-height:1.5;color:var(--text-normal)}.callout.svelte-lsz7kn.svelte-lsz7kn{display:flex;gap:0.75rem;padding:0.85rem 1rem;margin:0.5rem 0 1rem;border:1px solid rgba(190, 150, 45, 0.55);background:rgba(190, 150, 45, 0.09);border-radius:8px}.callout-icon.svelte-lsz7kn.svelte-lsz7kn{flex-shrink:0;display:flex;padding-top:0.1rem;color:var(--text-warning, #d6a935)}.callout-title.svelte-lsz7kn.svelte-lsz7kn{margin:0 0 0.35rem;font-weight:700;color:var(--text-warning, #d6a935)}.callout-text.svelte-lsz7kn p.svelte-lsz7kn{margin:0}.fix.svelte-lsz7kn.svelte-lsz7kn{padding:0.85rem 1rem;margin-bottom:0.75rem;border:1px solid var(--background-modifier-border);border-radius:8px}.fix.svelte-lsz7kn p.svelte-lsz7kn{margin:0.5rem 0 0}.fix-head.svelte-lsz7kn.svelte-lsz7kn{display:flex;align-items:center;gap:0.5rem}.fix-title.svelte-lsz7kn.svelte-lsz7kn{font-weight:600;color:var(--text-normal)}.badge.svelte-lsz7kn.svelte-lsz7kn{font-size:0.7rem;font-weight:500;padding:0.1rem 0.55rem;border-radius:999px;background:var(--background-modifier-border);color:var(--text-muted)}.badge-accent.svelte-lsz7kn.svelte-lsz7kn{background:var(--background-modifier-hover);color:var(--interactive-accent)}.steps.svelte-lsz7kn.svelte-lsz7kn{list-style:none;margin:0.7rem 0 0;padding:0}.steps.svelte-lsz7kn li.svelte-lsz7kn{display:flex;flex-wrap:wrap;align-items:center;gap:0.6rem;margin-bottom:0.5rem}.steps.svelte-lsz7kn li.svelte-lsz7kn:last-child{margin-bottom:0}.num.svelte-lsz7kn.svelte-lsz7kn{flex-shrink:0;width:1.4rem;height:1.4rem;border-radius:999px;background:var(--background-modifier-border);color:var(--text-muted);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:600}.step-label.svelte-lsz7kn.svelte-lsz7kn{flex-shrink:0;color:var(--text-normal)}.field.svelte-lsz7kn.svelte-lsz7kn{flex:1 1 14rem;min-width:0;font-family:var(--font-monospace, ui-monospace, monospace);font-size:0.8rem;background:var(--background-primary);border:1px solid var(--background-modifier-border);border-radius:5px;padding:0.25rem 0.5rem;color:var(--text-normal);user-select:all;white-space:nowrap;overflow-x:auto}code.svelte-lsz7kn.svelte-lsz7kn{font-family:var(--font-monospace, ui-monospace, monospace);font-size:0.85em;background:var(--background-primary);padding:1px 5px;border-radius:4px}a.svelte-lsz7kn.svelte-lsz7kn{color:var(--interactive-accent)}.footer.svelte-lsz7kn.svelte-lsz7kn{display:flex;justify-content:flex-end}");
  }
  function create_default_slot_1(ctx) {
    let div4;
    let div1;
    let span0;
    let trianglealert;
    let t0;
    let div0;
    let t4;
    let section0;
    let t14;
    let section1;
    let div3;
    let t18;
    let ol;
    let li0;
    let t24;
    let li1;
    let span8;
    let t26;
    let span9;
    let t28;
    let span10;
    let t30;
    let li2;
    let current;
    trianglealert = new triangle_alert_default({ props: { size: "1.25rem" } });
    return {
      c() {
        div4 = element("div");
        div1 = element("div");
        span0 = element("span");
        create_component(trianglealert.$$.fragment);
        t0 = space();
        div0 = element("div");
        div0.innerHTML = `<p class="callout-title svelte-lsz7kn">Obsidian is partially broken on this connection.</p> <p class="svelte-lsz7kn">The browser blocks some APIs from insecure pages, so some of
          Obsidian&#39;s features are broken as a result. Please use one of these
          fixes in order to get a properly functioning app:</p>`;
        t4 = space();
        section0 = element("section");
        section0.innerHTML = `<div class="fix-head svelte-lsz7kn"><span class="fix-title svelte-lsz7kn">Serve over HTTPS</span> <span class="badge badge-accent svelte-lsz7kn">Recommended</span></div> <p class="svelte-lsz7kn">Serve Ignis over HTTPS with <code class="svelte-lsz7kn">tailscale serve</code> or a TLS
        reverse proxy. Setup is covered in the
        <a href="https://ignis.thiefling.com/docs/security/remote-access/#running-without-tls" target="_blank" rel="noopener" class="svelte-lsz7kn">remote access guide</a>.</p>`;
        t14 = space();
        section1 = element("section");
        div3 = element("div");
        div3.innerHTML = `<span class="fix-title svelte-lsz7kn">Treat this origin as secure</span> <span class="badge svelte-lsz7kn">This browser only</span>`;
        t18 = space();
        ol = element("ol");
        li0 = element("li");
        li0.innerHTML = `<span class="num svelte-lsz7kn">1</span> <span class="step-label svelte-lsz7kn">Open the Chrome flag</span> <span class="field svelte-lsz7kn">chrome://flags/#unsafely-treat-insecure-origin-as-secure</span>`;
        t24 = space();
        li1 = element("li");
        span8 = element("span");
        span8.textContent = "2";
        t26 = space();
        span9 = element("span");
        span9.textContent = "Add this origin to the list";
        t28 = space();
        span10 = element("span");
        span10.textContent = `${/*origin*/
        ctx[1]}`;
        t30 = space();
        li2 = element("li");
        li2.innerHTML = `<span class="num svelte-lsz7kn">3</span> <span class="step-label svelte-lsz7kn">Relaunch Chrome</span>`;
        attr(span0, "class", "callout-icon svelte-lsz7kn");
        attr(div0, "class", "callout-text svelte-lsz7kn");
        attr(div1, "class", "callout svelte-lsz7kn");
        attr(section0, "class", "fix svelte-lsz7kn");
        attr(div3, "class", "fix-head svelte-lsz7kn");
        attr(li0, "class", "svelte-lsz7kn");
        attr(span8, "class", "num svelte-lsz7kn");
        attr(span9, "class", "step-label svelte-lsz7kn");
        attr(span10, "class", "field svelte-lsz7kn");
        attr(li1, "class", "svelte-lsz7kn");
        attr(li2, "class", "svelte-lsz7kn");
        attr(ol, "class", "steps svelte-lsz7kn");
        attr(section1, "class", "fix svelte-lsz7kn");
        attr(div4, "class", "body svelte-lsz7kn");
      },
      m(target, anchor) {
        insert(target, div4, anchor);
        append(div4, div1);
        append(div1, span0);
        mount_component(trianglealert, span0, null);
        append(div1, t0);
        append(div1, div0);
        append(div4, t4);
        append(div4, section0);
        append(div4, t14);
        append(div4, section1);
        append(section1, div3);
        append(section1, t18);
        append(section1, ol);
        append(ol, li0);
        append(ol, t24);
        append(ol, li1);
        append(li1, span8);
        append(li1, t26);
        append(li1, span9);
        append(li1, t28);
        append(li1, span10);
        append(ol, t30);
        append(ol, li2);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(trianglealert.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(trianglealert.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div4);
        }
        destroy_component(trianglealert);
      }
    };
  }
  function create_default_slot14(ctx) {
    let t;
    return {
      c() {
        t = text("Continue");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_footer_slot(ctx) {
    let div;
    let button;
    let current;
    button = new Button_default({
      props: {
        variant: "primary",
        $$slots: { default: [create_default_slot14] },
        $$scope: { ctx }
      }
    });
    button.$on(
      "click",
      /*click_handler*/
      ctx[3]
    );
    return {
      c() {
        div = element("div");
        create_component(button.$$.fragment);
        attr(div, "class", "footer svelte-lsz7kn");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(button, div, null);
        current = true;
      },
      p(ctx2, dirty) {
        const button_changes = {};
        if (dirty & /*$$scope*/
        128) {
          button_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button.$set(button_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(button.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(button.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(button);
      }
    };
  }
  function create_fragment17(ctx) {
    let modal;
    let current;
    let modal_props = {
      title: "Insecure connection",
      width: "700px",
      closeOnOverlayClick: false,
      $$slots: {
        footer: [create_footer_slot],
        default: [create_default_slot_1]
      },
      $$scope: { ctx }
    };
    modal = new Modal_default({ props: modal_props });
    ctx[4](modal);
    modal.$on(
      "close",
      /*onClose*/
      ctx[2]
    );
    modal.$on(
      "escape",
      /*escape_handler*/
      ctx[5]
    );
    return {
      c() {
        create_component(modal.$$.fragment);
      },
      m(target, anchor) {
        mount_component(modal, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const modal_changes = {};
        if (dirty & /*$$scope, modalRef*/
        129) {
          modal_changes.$$scope = { dirty, ctx: ctx2 };
        }
        modal.$set(modal_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(modal.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(modal.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        ctx[4](null);
        destroy_component(modal, detaching);
      }
    };
  }
  function instance17($$self, $$props, $$invalidate) {
    const dispatch = createEventDispatcher();
    const origin = window.location.origin;
    let modalRef;
    function onClose() {
      dispatch("close");
    }
    const click_handler = () => modalRef.dismiss();
    function modal_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        modalRef = $$value;
        $$invalidate(0, modalRef);
      });
    }
    const escape_handler = () => modalRef.dismiss();
    return [modalRef, origin, onClose, click_handler, modal_binding, escape_handler];
  }
  var InsecureContextModal = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance17, create_fragment17, safe_not_equal, {}, add_css3);
    }
  };
  var InsecureContextModal_default = InsecureContextModal;

  // packages/ui/src/bootstrap.js
  function showVaultManager() {
    if (document.querySelector(".vault-manager-overlay"))
      return;
    new window.IgnisUI.VaultManager({
      target: document.body,
      props: { vaultService }
    });
  }
  function showMessageDialog(title, message) {
    return new Promise((resolve) => {
      const dialog = new window.IgnisUI.MessageDialog({
        target: document.body,
        props: { title, message }
      });
      dialog.$on("confirm", () => {
        dialog.$destroy();
        resolve();
      });
    });
  }
  function showConfirmDialog(title, message, description, confirmText = "OK") {
    return new Promise((resolve) => {
      const dialog = new window.IgnisUI.ConfirmDialog({
        target: document.body,
        props: { title, message, description, confirmText }
      });
      dialog.$on("confirm", () => {
        dialog.$destroy();
        resolve(true);
      });
      dialog.$on("cancel", () => {
        dialog.$destroy();
        resolve(false);
      });
    });
  }
  function showPromptDialog(title, label, placeholder = "", value = "", confirmText = "OK") {
    return new Promise((resolve) => {
      const dialog = new window.IgnisUI.PromptDialog({
        target: document.body,
        props: { title, label, placeholder, value, confirmText }
      });
      dialog.$on("confirm", (event) => {
        dialog.$destroy();
        resolve(event.detail);
      });
      dialog.$on("cancel", () => {
        dialog.$destroy();
        resolve(null);
      });
    });
  }
  if (typeof window !== "undefined" && window.__ignis_registerUI) {
    window.__ignis_registerUI({
      showVaultManager,
      showMessageDialog,
      showConfirmDialog,
      showPromptDialog
    });
  } else if (typeof window !== "undefined") {
    console.warn(
      "[ignis] __ignis_registerUI not available; UI handlers not registered"
    );
  }
  var INSECURE_ACK_KEY = "ignis-insecure-ack";
  function showInsecureContextModal() {
    if (window.isSecureContext) {
      return;
    }
    if (localStorage.getItem(INSECURE_ACK_KEY)) {
      return;
    }
    const modal = new InsecureContextModal_default({ target: document.body });
    modal.$on("close", () => {
      localStorage.setItem(INSECURE_ACK_KEY, "1");
      modal.$destroy();
    });
  }
  if (typeof window !== "undefined") {
    if (document.body) {
      showInsecureContextModal();
    } else {
      window.addEventListener("DOMContentLoaded", showInsecureContextModal, {
        once: true
      });
    }
  }

  // packages/ui/src/components/layout/PromptDialog.svelte
  function add_css4(target) {
    append_styles(target, "svelte-1ri9t3", ".prompt-body.svelte-1ri9t3{padding:1.25rem 1.5rem;border-bottom:1px solid var(--background-modifier-border)}.prompt-label.svelte-1ri9t3{display:block;font-size:1.125rem;font-weight:600;color:var(--text-normal);margin-bottom:0.75rem}.prompt-input.svelte-1ri9t3{width:100%;padding:0.625rem 0.75rem;border-radius:0.375rem;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);font-size:1rem;outline:none;box-shadow:none;box-sizing:border-box}.prompt-input.svelte-1ri9t3:focus{border-color:var(--interactive-accent)}.prompt-footer.svelte-1ri9t3{display:flex;justify-content:flex-end;gap:0.5rem}");
  }
  var get_icon_slot_changes3 = (dirty) => ({});
  var get_icon_slot_context3 = (ctx) => ({});
  var get_confirmIcon_slot_changes = (dirty) => ({});
  var get_confirmIcon_slot_context = (ctx) => ({});
  function create_default_slot_2(ctx) {
    let div;
    let label_1;
    let t0;
    let t1;
    let input;
    let mounted;
    let dispose;
    return {
      c() {
        div = element("div");
        label_1 = element("label");
        t0 = text(
          /*label*/
          ctx[2]
        );
        t1 = space();
        input = element("input");
        attr(label_1, "class", "prompt-label svelte-1ri9t3");
        attr(label_1, "for", "prompt-input");
        attr(input, "id", "prompt-input");
        attr(input, "class", "prompt-input svelte-1ri9t3");
        attr(input, "type", "text");
        attr(
          input,
          "placeholder",
          /*placeholder*/
          ctx[3]
        );
        input.autofocus = true;
        attr(div, "class", "prompt-body svelte-1ri9t3");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, label_1);
        append(label_1, t0);
        append(div, t1);
        append(div, input);
        set_input_value(
          input,
          /*value*/
          ctx[0]
        );
        input.focus();
        if (!mounted) {
          dispose = [
            listen(
              input,
              "input",
              /*input_input_handler*/
              ctx[13]
            ),
            listen(
              input,
              "keydown",
              /*onKeydown*/
              ctx[10]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*label*/
        4)
          set_data(
            t0,
            /*label*/
            ctx2[2]
          );
        if (dirty & /*placeholder*/
        8) {
          attr(
            input,
            "placeholder",
            /*placeholder*/
            ctx2[3]
          );
        }
        if (dirty & /*value*/
        1 && input.value !== /*value*/
        ctx2[0]) {
          set_input_value(
            input,
            /*value*/
            ctx2[0]
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_icon_slot_1(ctx) {
    let current;
    const icon_slot_template = (
      /*#slots*/
      ctx[12].icon
    );
    const icon_slot = create_slot(
      icon_slot_template,
      ctx,
      /*$$scope*/
      ctx[15],
      get_icon_slot_context3
    );
    return {
      c() {
        if (icon_slot)
          icon_slot.c();
      },
      m(target, anchor) {
        if (icon_slot) {
          icon_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (icon_slot) {
          if (icon_slot.p && (!current || dirty & /*$$scope*/
          32768)) {
            update_slot_base(
              icon_slot,
              icon_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[15],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[15]
              ) : get_slot_changes(
                icon_slot_template,
                /*$$scope*/
                ctx2[15],
                dirty,
                get_icon_slot_changes3
              ),
              get_icon_slot_context3
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(icon_slot, local);
        current = true;
      },
      o(local) {
        transition_out(icon_slot, local);
        current = false;
      },
      d(detaching) {
        if (icon_slot)
          icon_slot.d(detaching);
      }
    };
  }
  function create_default_slot_12(ctx) {
    let t;
    return {
      c() {
        t = text("Cancel");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot15(ctx) {
    let t;
    return {
      c() {
        t = text(
          /*confirmText*/
          ctx[4]
        );
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*confirmText*/
        16)
          set_data(
            t,
            /*confirmText*/
            ctx2[4]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_icon_slot(ctx) {
    let current;
    const confirmIcon_slot_template = (
      /*#slots*/
      ctx[12].confirmIcon
    );
    const confirmIcon_slot = create_slot(
      confirmIcon_slot_template,
      ctx,
      /*$$scope*/
      ctx[15],
      get_confirmIcon_slot_context
    );
    return {
      c() {
        if (confirmIcon_slot)
          confirmIcon_slot.c();
      },
      m(target, anchor) {
        if (confirmIcon_slot) {
          confirmIcon_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (confirmIcon_slot) {
          if (confirmIcon_slot.p && (!current || dirty & /*$$scope*/
          32768)) {
            update_slot_base(
              confirmIcon_slot,
              confirmIcon_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[15],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[15]
              ) : get_slot_changes(
                confirmIcon_slot_template,
                /*$$scope*/
                ctx2[15],
                dirty,
                get_confirmIcon_slot_changes
              ),
              get_confirmIcon_slot_context
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(confirmIcon_slot, local);
        current = true;
      },
      o(local) {
        transition_out(confirmIcon_slot, local);
        current = false;
      },
      d(detaching) {
        if (confirmIcon_slot)
          confirmIcon_slot.d(detaching);
      }
    };
  }
  function create_footer_slot2(ctx) {
    let div;
    let button0;
    let t;
    let button1;
    let current;
    button0 = new Button_default({
      props: {
        variant: "secondary",
        $$slots: { default: [create_default_slot_12] },
        $$scope: { ctx }
      }
    });
    button0.$on(
      "click",
      /*onCancel*/
      ctx[8]
    );
    button1 = new Button_default({
      props: {
        variant: "primary",
        $$slots: {
          icon: [create_icon_slot],
          default: [create_default_slot15]
        },
        $$scope: { ctx }
      }
    });
    button1.$on(
      "click",
      /*onConfirm*/
      ctx[7]
    );
    return {
      c() {
        div = element("div");
        create_component(button0.$$.fragment);
        t = space();
        create_component(button1.$$.fragment);
        attr(div, "class", "prompt-footer svelte-1ri9t3");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(button0, div, null);
        append(div, t);
        mount_component(button1, div, null);
        current = true;
      },
      p(ctx2, dirty) {
        const button0_changes = {};
        if (dirty & /*$$scope*/
        32768) {
          button0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button0.$set(button0_changes);
        const button1_changes = {};
        if (dirty & /*$$scope, confirmText*/
        32784) {
          button1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button1.$set(button1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(button0.$$.fragment, local);
        transition_in(button1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(button0.$$.fragment, local);
        transition_out(button1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(button0);
        destroy_component(button1);
      }
    };
  }
  function create_fragment18(ctx) {
    let modal;
    let current;
    let modal_props = {
      title: (
        /*title*/
        ctx[1]
      ),
      width: (
        /*width*/
        ctx[5]
      ),
      closeOnOverlayClick: false,
      $$slots: {
        footer: [create_footer_slot2],
        icon: [create_icon_slot_1],
        default: [create_default_slot_2]
      },
      $$scope: { ctx }
    };
    modal = new Modal_default({ props: modal_props });
    ctx[14](modal);
    modal.$on(
      "escape",
      /*onEscape*/
      ctx[9]
    );
    return {
      c() {
        create_component(modal.$$.fragment);
      },
      m(target, anchor) {
        mount_component(modal, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const modal_changes = {};
        if (dirty & /*title*/
        2)
          modal_changes.title = /*title*/
          ctx2[1];
        if (dirty & /*width*/
        32)
          modal_changes.width = /*width*/
          ctx2[5];
        if (dirty & /*$$scope, confirmText, placeholder, value, label*/
        32797) {
          modal_changes.$$scope = { dirty, ctx: ctx2 };
        }
        modal.$set(modal_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(modal.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(modal.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        ctx[14](null);
        destroy_component(modal, detaching);
      }
    };
  }
  function instance18($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { title = "" } = $$props;
    let { label = "" } = $$props;
    let { value = "" } = $$props;
    let { placeholder = "" } = $$props;
    let { confirmText = "Confirm" } = $$props;
    let { width = "500px" } = $$props;
    const dispatch = createEventDispatcher();
    let modalRef;
    function onConfirm() {
      dispatch("confirm", value);
    }
    function onCancel() {
      modalRef.dismiss();
      dispatch("cancel");
    }
    function onEscape() {
      onCancel();
    }
    function onKeydown(e) {
      if (e.key === "Enter") {
        onConfirm();
      }
    }
    function dismiss() {
      modalRef.dismiss();
    }
    function input_input_handler() {
      value = this.value;
      $$invalidate(0, value);
    }
    function modal_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        modalRef = $$value;
        $$invalidate(6, modalRef);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("title" in $$props2)
        $$invalidate(1, title = $$props2.title);
      if ("label" in $$props2)
        $$invalidate(2, label = $$props2.label);
      if ("value" in $$props2)
        $$invalidate(0, value = $$props2.value);
      if ("placeholder" in $$props2)
        $$invalidate(3, placeholder = $$props2.placeholder);
      if ("confirmText" in $$props2)
        $$invalidate(4, confirmText = $$props2.confirmText);
      if ("width" in $$props2)
        $$invalidate(5, width = $$props2.width);
      if ("$$scope" in $$props2)
        $$invalidate(15, $$scope = $$props2.$$scope);
    };
    return [
      value,
      title,
      label,
      placeholder,
      confirmText,
      width,
      modalRef,
      onConfirm,
      onCancel,
      onEscape,
      onKeydown,
      dismiss,
      slots,
      input_input_handler,
      modal_binding,
      $$scope
    ];
  }
  var PromptDialog = class extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance18,
        create_fragment18,
        safe_not_equal,
        {
          title: 1,
          label: 2,
          value: 0,
          placeholder: 3,
          confirmText: 4,
          width: 5,
          dismiss: 11
        },
        add_css4
      );
    }
    get dismiss() {
      return this.$$.ctx[11];
    }
  };
  var PromptDialog_default = PromptDialog;

  // packages/ui/src/components/layout/ConfirmDialog.svelte
  function add_css5(target) {
    append_styles(target, "svelte-89hn9h", ".confirm-body.svelte-89hn9h{padding:1.25rem 1.5rem;border-bottom:1px solid var(--background-modifier-border)}.confirm-message.svelte-89hn9h{margin:0 0 0.5rem;font-size:1.125rem;font-weight:600;color:var(--text-normal)}.confirm-description.svelte-89hn9h{margin:0;font-size:0.875rem;color:var(--text-muted);line-height:1.5}.confirm-footer.svelte-89hn9h{display:flex;justify-content:flex-end;gap:0.5rem}");
  }
  var get_icon_slot_changes4 = (dirty) => ({});
  var get_icon_slot_context4 = (ctx) => ({});
  var get_confirmIcon_slot_changes2 = (dirty) => ({});
  var get_confirmIcon_slot_context2 = (ctx) => ({});
  function create_if_block3(ctx) {
    let p;
    let t;
    return {
      c() {
        p = element("p");
        t = text(
          /*description*/
          ctx[2]
        );
        attr(p, "class", "confirm-description svelte-89hn9h");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*description*/
        4)
          set_data(
            t,
            /*description*/
            ctx2[2]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(p);
        }
      }
    };
  }
  function create_default_slot_22(ctx) {
    let div;
    let p;
    let t0;
    let t1;
    let if_block = (
      /*description*/
      ctx[2] && create_if_block3(ctx)
    );
    return {
      c() {
        div = element("div");
        p = element("p");
        t0 = text(
          /*message*/
          ctx[1]
        );
        t1 = space();
        if (if_block)
          if_block.c();
        attr(p, "class", "confirm-message svelte-89hn9h");
        attr(div, "class", "confirm-body svelte-89hn9h");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, p);
        append(p, t0);
        append(div, t1);
        if (if_block)
          if_block.m(div, null);
      },
      p(ctx2, dirty) {
        if (dirty & /*message*/
        2)
          set_data(
            t0,
            /*message*/
            ctx2[1]
          );
        if (
          /*description*/
          ctx2[2]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block3(ctx2);
            if_block.c();
            if_block.m(div, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (if_block)
          if_block.d();
      }
    };
  }
  function create_icon_slot_12(ctx) {
    let current;
    const icon_slot_template = (
      /*#slots*/
      ctx[11].icon
    );
    const icon_slot = create_slot(
      icon_slot_template,
      ctx,
      /*$$scope*/
      ctx[13],
      get_icon_slot_context4
    );
    return {
      c() {
        if (icon_slot)
          icon_slot.c();
      },
      m(target, anchor) {
        if (icon_slot) {
          icon_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (icon_slot) {
          if (icon_slot.p && (!current || dirty & /*$$scope*/
          8192)) {
            update_slot_base(
              icon_slot,
              icon_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[13],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[13]
              ) : get_slot_changes(
                icon_slot_template,
                /*$$scope*/
                ctx2[13],
                dirty,
                get_icon_slot_changes4
              ),
              get_icon_slot_context4
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(icon_slot, local);
        current = true;
      },
      o(local) {
        transition_out(icon_slot, local);
        current = false;
      },
      d(detaching) {
        if (icon_slot)
          icon_slot.d(detaching);
      }
    };
  }
  function create_default_slot_13(ctx) {
    let t;
    return {
      c() {
        t = text("Cancel");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot16(ctx) {
    let t;
    return {
      c() {
        t = text(
          /*confirmText*/
          ctx[3]
        );
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*confirmText*/
        8)
          set_data(
            t,
            /*confirmText*/
            ctx2[3]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_icon_slot2(ctx) {
    let current;
    const confirmIcon_slot_template = (
      /*#slots*/
      ctx[11].confirmIcon
    );
    const confirmIcon_slot = create_slot(
      confirmIcon_slot_template,
      ctx,
      /*$$scope*/
      ctx[13],
      get_confirmIcon_slot_context2
    );
    return {
      c() {
        if (confirmIcon_slot)
          confirmIcon_slot.c();
      },
      m(target, anchor) {
        if (confirmIcon_slot) {
          confirmIcon_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (confirmIcon_slot) {
          if (confirmIcon_slot.p && (!current || dirty & /*$$scope*/
          8192)) {
            update_slot_base(
              confirmIcon_slot,
              confirmIcon_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[13],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[13]
              ) : get_slot_changes(
                confirmIcon_slot_template,
                /*$$scope*/
                ctx2[13],
                dirty,
                get_confirmIcon_slot_changes2
              ),
              get_confirmIcon_slot_context2
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(confirmIcon_slot, local);
        current = true;
      },
      o(local) {
        transition_out(confirmIcon_slot, local);
        current = false;
      },
      d(detaching) {
        if (confirmIcon_slot)
          confirmIcon_slot.d(detaching);
      }
    };
  }
  function create_footer_slot3(ctx) {
    let div;
    let button0;
    let t;
    let button1;
    let current;
    button0 = new Button_default({
      props: {
        variant: "secondary",
        $$slots: { default: [create_default_slot_13] },
        $$scope: { ctx }
      }
    });
    button0.$on(
      "click",
      /*onCancel*/
      ctx[8]
    );
    button1 = new Button_default({
      props: {
        variant: (
          /*confirmVariant*/
          ctx[4]
        ),
        $$slots: {
          icon: [create_icon_slot2],
          default: [create_default_slot16]
        },
        $$scope: { ctx }
      }
    });
    button1.$on(
      "click",
      /*onConfirm*/
      ctx[7]
    );
    return {
      c() {
        div = element("div");
        create_component(button0.$$.fragment);
        t = space();
        create_component(button1.$$.fragment);
        attr(div, "class", "confirm-footer svelte-89hn9h");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(button0, div, null);
        append(div, t);
        mount_component(button1, div, null);
        current = true;
      },
      p(ctx2, dirty) {
        const button0_changes = {};
        if (dirty & /*$$scope*/
        8192) {
          button0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button0.$set(button0_changes);
        const button1_changes = {};
        if (dirty & /*confirmVariant*/
        16)
          button1_changes.variant = /*confirmVariant*/
          ctx2[4];
        if (dirty & /*$$scope, confirmText*/
        8200) {
          button1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button1.$set(button1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(button0.$$.fragment, local);
        transition_in(button1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(button0.$$.fragment, local);
        transition_out(button1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(button0);
        destroy_component(button1);
      }
    };
  }
  function create_fragment19(ctx) {
    let modal;
    let current;
    let modal_props = {
      title: (
        /*title*/
        ctx[0]
      ),
      width: (
        /*width*/
        ctx[5]
      ),
      closeOnOverlayClick: false,
      $$slots: {
        footer: [create_footer_slot3],
        icon: [create_icon_slot_12],
        default: [create_default_slot_22]
      },
      $$scope: { ctx }
    };
    modal = new Modal_default({ props: modal_props });
    ctx[12](modal);
    modal.$on(
      "escape",
      /*onEscape*/
      ctx[9]
    );
    return {
      c() {
        create_component(modal.$$.fragment);
      },
      m(target, anchor) {
        mount_component(modal, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const modal_changes = {};
        if (dirty & /*title*/
        1)
          modal_changes.title = /*title*/
          ctx2[0];
        if (dirty & /*width*/
        32)
          modal_changes.width = /*width*/
          ctx2[5];
        if (dirty & /*$$scope, confirmVariant, confirmText, description, message*/
        8222) {
          modal_changes.$$scope = { dirty, ctx: ctx2 };
        }
        modal.$set(modal_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(modal.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(modal.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        ctx[12](null);
        destroy_component(modal, detaching);
      }
    };
  }
  function instance19($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { title = "" } = $$props;
    let { message = "" } = $$props;
    let { description = "" } = $$props;
    let { confirmText = "Confirm" } = $$props;
    let { confirmVariant = "primary" } = $$props;
    let { width = "500px" } = $$props;
    const dispatch = createEventDispatcher();
    let modalRef;
    function onConfirm() {
      dispatch("confirm");
    }
    function onCancel() {
      modalRef.dismiss();
      dispatch("cancel");
    }
    function onEscape() {
      onCancel();
    }
    function dismiss() {
      modalRef.dismiss();
    }
    function modal_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        modalRef = $$value;
        $$invalidate(6, modalRef);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("title" in $$props2)
        $$invalidate(0, title = $$props2.title);
      if ("message" in $$props2)
        $$invalidate(1, message = $$props2.message);
      if ("description" in $$props2)
        $$invalidate(2, description = $$props2.description);
      if ("confirmText" in $$props2)
        $$invalidate(3, confirmText = $$props2.confirmText);
      if ("confirmVariant" in $$props2)
        $$invalidate(4, confirmVariant = $$props2.confirmVariant);
      if ("width" in $$props2)
        $$invalidate(5, width = $$props2.width);
      if ("$$scope" in $$props2)
        $$invalidate(13, $$scope = $$props2.$$scope);
    };
    return [
      title,
      message,
      description,
      confirmText,
      confirmVariant,
      width,
      modalRef,
      onConfirm,
      onCancel,
      onEscape,
      dismiss,
      slots,
      modal_binding,
      $$scope
    ];
  }
  var ConfirmDialog = class extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance19,
        create_fragment19,
        safe_not_equal,
        {
          title: 0,
          message: 1,
          description: 2,
          confirmText: 3,
          confirmVariant: 4,
          width: 5,
          dismiss: 10
        },
        add_css5
      );
    }
    get dismiss() {
      return this.$$.ctx[10];
    }
  };
  var ConfirmDialog_default = ConfirmDialog;

  // packages/ui/src/components/layout/MessageDialog.svelte
  function add_css6(target) {
    append_styles(target, "svelte-o5gz3n", ".message-body.svelte-o5gz3n{padding:1.25rem 1.5rem;border-bottom:1px solid var(--background-modifier-border)}.message-text.svelte-o5gz3n{margin:0;font-size:0.9375rem;color:var(--text-normal);line-height:1.5;white-space:pre-wrap}.message-footer.svelte-o5gz3n{display:flex;justify-content:flex-end}");
  }
  function create_default_slot_14(ctx) {
    let div;
    let p;
    let t;
    return {
      c() {
        div = element("div");
        p = element("p");
        t = text(
          /*message*/
          ctx[1]
        );
        attr(p, "class", "message-text svelte-o5gz3n");
        attr(div, "class", "message-body svelte-o5gz3n");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, p);
        append(p, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*message*/
        2)
          set_data(
            t,
            /*message*/
            ctx2[1]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_icon_slot3(ctx) {
    let circlealert;
    let current;
    circlealert = new circle_alert_default({ props: { size: "1.25rem" } });
    return {
      c() {
        create_component(circlealert.$$.fragment);
      },
      m(target, anchor) {
        mount_component(circlealert, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(circlealert.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(circlealert.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(circlealert, detaching);
      }
    };
  }
  function create_default_slot17(ctx) {
    let t;
    return {
      c() {
        t = text("OK");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_footer_slot4(ctx) {
    let div;
    let button;
    let current;
    button = new Button_default({
      props: {
        variant: "primary",
        $$slots: { default: [create_default_slot17] },
        $$scope: { ctx }
      }
    });
    button.$on(
      "click",
      /*onConfirm*/
      ctx[4]
    );
    return {
      c() {
        div = element("div");
        create_component(button.$$.fragment);
        attr(div, "class", "message-footer svelte-o5gz3n");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(button, div, null);
        current = true;
      },
      p(ctx2, dirty) {
        const button_changes = {};
        if (dirty & /*$$scope*/
        512) {
          button_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button.$set(button_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(button.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(button.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(button);
      }
    };
  }
  function create_fragment20(ctx) {
    let modal;
    let current;
    let modal_props = {
      title: (
        /*title*/
        ctx[0]
      ),
      width: (
        /*width*/
        ctx[2]
      ),
      closeOnOverlayClick: false,
      $$slots: {
        footer: [create_footer_slot4],
        icon: [create_icon_slot3],
        default: [create_default_slot_14]
      },
      $$scope: { ctx }
    };
    modal = new Modal_default({ props: modal_props });
    ctx[7](modal);
    modal.$on(
      "escape",
      /*onEscape*/
      ctx[5]
    );
    return {
      c() {
        create_component(modal.$$.fragment);
      },
      m(target, anchor) {
        mount_component(modal, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const modal_changes = {};
        if (dirty & /*title*/
        1)
          modal_changes.title = /*title*/
          ctx2[0];
        if (dirty & /*width*/
        4)
          modal_changes.width = /*width*/
          ctx2[2];
        if (dirty & /*$$scope, message*/
        514) {
          modal_changes.$$scope = { dirty, ctx: ctx2 };
        }
        modal.$set(modal_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(modal.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(modal.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        ctx[7](null);
        destroy_component(modal, detaching);
      }
    };
  }
  function instance20($$self, $$props, $$invalidate) {
    let { title = "Message" } = $$props;
    let { message = "" } = $$props;
    let { width = "500px" } = $$props;
    const dispatch = createEventDispatcher();
    let modalRef;
    function onConfirm() {
      modalRef.dismiss();
      dispatch("confirm");
    }
    function onEscape() {
      onConfirm();
    }
    function dismiss() {
      modalRef.dismiss();
    }
    function modal_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        modalRef = $$value;
        $$invalidate(3, modalRef);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("title" in $$props2)
        $$invalidate(0, title = $$props2.title);
      if ("message" in $$props2)
        $$invalidate(1, message = $$props2.message);
      if ("width" in $$props2)
        $$invalidate(2, width = $$props2.width);
    };
    return [title, message, width, modalRef, onConfirm, onEscape, dismiss, modal_binding];
  }
  var MessageDialog = class extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance20,
        create_fragment20,
        safe_not_equal,
        {
          title: 0,
          message: 1,
          width: 2,
          dismiss: 6
        },
        add_css6
      );
    }
    get dismiss() {
      return this.$$.ctx[6];
    }
  };
  var MessageDialog_default = MessageDialog;

  // packages/ui/src/components/input/SearchInput.svelte
  function add_css7(target) {
    append_styles(target, "svelte-3djej6", ".search-input.svelte-3djej6{position:relative;display:flex;align-items:center}.search-icon.svelte-3djej6{position:absolute;left:0.625rem;color:var(--text-muted);pointer-events:none;margin-top:0.2rem}input.svelte-3djej6{width:100%;padding:0.375rem 0.625rem 0.375rem 1.875rem;border-radius:0.375rem;border:1px solid var(--background-primary);background:var(--background-primary);color:var(--text-normal);font-size:0.8125rem;outline:none;box-shadow:none}input.svelte-3djej6:hover{background:var(--background-modifier-form-field)}input.svelte-3djej6::placeholder{color:var(--text-muted)}input.svelte-3djej6:focus{border-color:var(--interactive-accent)}input.svelte-3djej6:focus:hover{background:var(--background-primary)}");
  }
  function create_fragment21(ctx) {
    let div;
    let span;
    let search;
    let t;
    let input;
    let current;
    let mounted;
    let dispose;
    search = new search_default({ props: { size: "0.875rem" } });
    return {
      c() {
        div = element("div");
        span = element("span");
        create_component(search.$$.fragment);
        t = space();
        input = element("input");
        attr(span, "class", "search-icon svelte-3djej6");
        attr(input, "type", "text");
        attr(
          input,
          "placeholder",
          /*placeholder*/
          ctx[1]
        );
        input.value = /*value*/
        ctx[0];
        attr(input, "class", "svelte-3djej6");
        attr(div, "class", "search-input svelte-3djej6");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, span);
        mount_component(search, span, null);
        append(div, t);
        append(div, input);
        current = true;
        if (!mounted) {
          dispose = listen(
            input,
            "input",
            /*onInput*/
            ctx[2]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (!current || dirty & /*placeholder*/
        2) {
          attr(
            input,
            "placeholder",
            /*placeholder*/
            ctx2[1]
          );
        }
        if (!current || dirty & /*value*/
        1 && input.value !== /*value*/
        ctx2[0]) {
          input.value = /*value*/
          ctx2[0];
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(search.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(search.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(search);
        mounted = false;
        dispose();
      }
    };
  }
  function instance21($$self, $$props, $$invalidate) {
    let { value = "" } = $$props;
    let { placeholder = "Search" } = $$props;
    const dispatch = createEventDispatcher();
    function onInput(e) {
      dispatch("input", e.target.value);
    }
    $$self.$$set = ($$props2) => {
      if ("value" in $$props2)
        $$invalidate(0, value = $$props2.value);
      if ("placeholder" in $$props2)
        $$invalidate(1, placeholder = $$props2.placeholder);
    };
    return [value, placeholder, onInput];
  }
  var SearchInput = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance21, create_fragment21, safe_not_equal, { value: 0, placeholder: 1 }, add_css7);
    }
  };
  var SearchInput_default = SearchInput;

  // packages/ui/src/components/display/ListItem.svelte
  function add_css8(target) {
    append_styles(target, "svelte-16bpy8f", ".list-item.svelte-16bpy8f{display:flex;align-items:center;gap:1rem;padding:0.5rem 0.4rem 0.5rem 1rem;margin:0 0.2rem;background:var(--background-primary);border-radius:0.5rem;border:1px solid transparent;transition:background 0.1s,\n      border-color 0.1s}.list-item.clickable.svelte-16bpy8f{cursor:pointer}.list-item.clickable.svelte-16bpy8f:hover{background:var(--background-modifier-hover);border-color:var(--background-modifier-border)}.item-icon.svelte-16bpy8f{display:flex;align-items:center;flex-shrink:0;color:var(--text-muted);opacity:0.6}.item-content.svelte-16bpy8f{flex:1;min-width:0;display:flex;flex-direction:column;gap:0.125rem}.item-primary.svelte-16bpy8f{font-weight:600;font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.item-secondary.svelte-16bpy8f{font-size:0.8125rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.item-action.svelte-16bpy8f{flex-shrink:0;margin-left:auto}");
  }
  var get_action_slot_changes = (dirty) => ({});
  var get_action_slot_context = (ctx) => ({});
  var get_icon_slot_changes5 = (dirty) => ({});
  var get_icon_slot_context5 = (ctx) => ({});
  function create_if_block_3(ctx) {
    let div;
    let current;
    const icon_slot_template = (
      /*#slots*/
      ctx[7].icon
    );
    const icon_slot = create_slot(
      icon_slot_template,
      ctx,
      /*$$scope*/
      ctx[6],
      get_icon_slot_context5
    );
    return {
      c() {
        div = element("div");
        if (icon_slot)
          icon_slot.c();
        attr(div, "class", "item-icon svelte-16bpy8f");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (icon_slot) {
          icon_slot.m(div, null);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (icon_slot) {
          if (icon_slot.p && (!current || dirty & /*$$scope*/
          64)) {
            update_slot_base(
              icon_slot,
              icon_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[6],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[6]
              ) : get_slot_changes(
                icon_slot_template,
                /*$$scope*/
                ctx2[6],
                dirty,
                get_icon_slot_changes5
              ),
              get_icon_slot_context5
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(icon_slot, local);
        current = true;
      },
      o(local) {
        transition_out(icon_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (icon_slot)
          icon_slot.d(detaching);
      }
    };
  }
  function create_else_block(ctx) {
    let span;
    let t0;
    let t1;
    let if_block_anchor;
    let if_block = (
      /*secondary*/
      ctx[1] && create_if_block_2(ctx)
    );
    return {
      c() {
        span = element("span");
        t0 = text(
          /*primary*/
          ctx[0]
        );
        t1 = space();
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
        attr(span, "class", "item-primary svelte-16bpy8f");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t0);
        insert(target, t1, anchor);
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*primary*/
        1)
          set_data(
            t0,
            /*primary*/
            ctx2[0]
          );
        if (
          /*secondary*/
          ctx2[1]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block_2(ctx2);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(span);
          detach(t1);
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function create_if_block_1(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[7].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[6],
      null
    );
    return {
      c() {
        if (default_slot)
          default_slot.c();
      },
      m(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          64)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[6],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[6]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[6],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
  }
  function create_if_block_2(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*secondary*/
          ctx[1]
        );
        attr(span, "class", "item-secondary svelte-16bpy8f");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*secondary*/
        2)
          set_data(
            t,
            /*secondary*/
            ctx2[1]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_if_block4(ctx) {
    let div;
    let current;
    const action_slot_template = (
      /*#slots*/
      ctx[7].action
    );
    const action_slot = create_slot(
      action_slot_template,
      ctx,
      /*$$scope*/
      ctx[6],
      get_action_slot_context
    );
    return {
      c() {
        div = element("div");
        if (action_slot)
          action_slot.c();
        attr(div, "class", "item-action svelte-16bpy8f");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (action_slot) {
          action_slot.m(div, null);
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (action_slot) {
          if (action_slot.p && (!current || dirty & /*$$scope*/
          64)) {
            update_slot_base(
              action_slot,
              action_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[6],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[6]
              ) : get_slot_changes(
                action_slot_template,
                /*$$scope*/
                ctx2[6],
                dirty,
                get_action_slot_changes
              ),
              get_action_slot_context
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(action_slot, local);
        current = true;
      },
      o(local) {
        transition_out(action_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (action_slot)
          action_slot.d(detaching);
      }
    };
  }
  function create_fragment22(ctx) {
    let div1;
    let t0;
    let div0;
    let current_block_type_index;
    let if_block1;
    let t1;
    let current;
    let mounted;
    let dispose;
    let if_block0 = (
      /*$$slots*/
      ctx[5].icon && create_if_block_3(ctx)
    );
    const if_block_creators = [create_if_block_1, create_else_block];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*$$slots*/
        ctx2[5].default
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx, -1);
    if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    let if_block2 = (
      /*$$slots*/
      ctx[5].action && create_if_block4(ctx)
    );
    return {
      c() {
        div1 = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        div0 = element("div");
        if_block1.c();
        t1 = space();
        if (if_block2)
          if_block2.c();
        attr(div0, "class", "item-content svelte-16bpy8f");
        attr(div1, "class", "list-item svelte-16bpy8f");
        toggle_class(
          div1,
          "active",
          /*active*/
          ctx[2]
        );
        toggle_class(
          div1,
          "clickable",
          /*clickable*/
          ctx[3]
        );
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        if (if_block0)
          if_block0.m(div1, null);
        append(div1, t0);
        append(div1, div0);
        if_blocks[current_block_type_index].m(div0, null);
        append(div1, t1);
        if (if_block2)
          if_block2.m(div1, null);
        current = true;
        if (!mounted) {
          dispose = listen(
            div1,
            "click",
            /*onClick*/
            ctx[4]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (
          /*$$slots*/
          ctx2[5].icon
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
            if (dirty & /*$$slots*/
            32) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_3(ctx2);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(div1, t0);
          }
        } else if (if_block0) {
          group_outros();
          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });
          check_outros();
        }
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block1 = if_blocks[current_block_type_index];
          if (!if_block1) {
            if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block1.c();
          } else {
            if_block1.p(ctx2, dirty);
          }
          transition_in(if_block1, 1);
          if_block1.m(div0, null);
        }
        if (
          /*$$slots*/
          ctx2[5].action
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
            if (dirty & /*$$slots*/
            32) {
              transition_in(if_block2, 1);
            }
          } else {
            if_block2 = create_if_block4(ctx2);
            if_block2.c();
            transition_in(if_block2, 1);
            if_block2.m(div1, null);
          }
        } else if (if_block2) {
          group_outros();
          transition_out(if_block2, 1, 1, () => {
            if_block2 = null;
          });
          check_outros();
        }
        if (!current || dirty & /*active*/
        4) {
          toggle_class(
            div1,
            "active",
            /*active*/
            ctx2[2]
          );
        }
        if (!current || dirty & /*clickable*/
        8) {
          toggle_class(
            div1,
            "clickable",
            /*clickable*/
            ctx2[3]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block0);
        transition_in(if_block1);
        transition_in(if_block2);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(if_block1);
        transition_out(if_block2);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div1);
        }
        if (if_block0)
          if_block0.d();
        if_blocks[current_block_type_index].d();
        if (if_block2)
          if_block2.d();
        mounted = false;
        dispose();
      }
    };
  }
  function instance22($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const $$slots = compute_slots(slots);
    let { primary = "" } = $$props;
    let { secondary = "" } = $$props;
    let { active = false } = $$props;
    let { clickable = true } = $$props;
    const dispatch = createEventDispatcher();
    function onClick() {
      if (clickable) {
        dispatch("click");
      }
    }
    $$self.$$set = ($$props2) => {
      if ("primary" in $$props2)
        $$invalidate(0, primary = $$props2.primary);
      if ("secondary" in $$props2)
        $$invalidate(1, secondary = $$props2.secondary);
      if ("active" in $$props2)
        $$invalidate(2, active = $$props2.active);
      if ("clickable" in $$props2)
        $$invalidate(3, clickable = $$props2.clickable);
      if ("$$scope" in $$props2)
        $$invalidate(6, $$scope = $$props2.$$scope);
    };
    return [primary, secondary, active, clickable, onClick, $$slots, $$scope, slots];
  }
  var ListItem = class extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance22,
        create_fragment22,
        safe_not_equal,
        {
          primary: 0,
          secondary: 1,
          active: 2,
          clickable: 3
        },
        add_css8
      );
    }
  };
  var ListItem_default = ListItem;

  // packages/ui/src/components/menu/PopoverMenu.svelte
  function add_css9(target) {
    append_styles(target, "svelte-lcnz7g", ".popover-wrapper.svelte-lcnz7g{position:relative}.popover-trigger.svelte-lcnz7g{background:none;border:none;box-shadow:none;color:var(--text-muted);cursor:pointer;padding:0.375rem;border-radius:0.25rem;display:flex;align-items:center;justify-content:center}.popover-trigger.svelte-lcnz7g:hover{color:var(--text-normal)}.popover-panel.svelte-lcnz7g{position:absolute;right:0;top:100%;z-index:10;background:var(--background-primary);border:1px solid var(--background-modifier-border);border-radius:0.375rem;padding:0.25rem;min-width:7.5rem;box-shadow:0 0.25rem 1rem rgba(0, 0, 0, 0.4)}.popover-item.svelte-lcnz7g{display:block;width:100%;padding:0.375rem 0.75rem;border:none;background:none;box-shadow:none;color:var(--text-normal);font-size:0.8125rem;cursor:pointer;border-radius:0.25rem;text-align:left}.popover-item.svelte-lcnz7g:hover{background:var(--background-modifier-hover)}.popover-item.danger.svelte-lcnz7g{color:var(--text-error, #e93147)}.popover-item.danger.svelte-lcnz7g:hover{background:rgba(233, 49, 71, 0.1)}");
  }
  function get_each_context2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[6] = list[i];
    return child_ctx;
  }
  function create_if_block5(ctx) {
    let div;
    let each_value = ensure_array_like(
      /*items*/
      ctx[1]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block2(get_each_context2(ctx, each_value, i));
    }
    return {
      c() {
        div = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(div, "class", "popover-panel svelte-lcnz7g");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div, null);
          }
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*items, onItemClick*/
        10) {
          each_value = ensure_array_like(
            /*items*/
            ctx2[1]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context2(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block2(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, null);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function create_each_block2(ctx) {
    let button;
    let t0_value = (
      /*item*/
      ctx[6].label + ""
    );
    let t0;
    let t1;
    let mounted;
    let dispose;
    function click_handler(...args) {
      return (
        /*click_handler*/
        ctx[4](
          /*item*/
          ctx[6],
          ...args
        )
      );
    }
    return {
      c() {
        button = element("button");
        t0 = text(t0_value);
        t1 = space();
        attr(button, "class", "popover-item svelte-lcnz7g");
        toggle_class(
          button,
          "danger",
          /*item*/
          ctx[6].danger
        );
      },
      m(target, anchor) {
        insert(target, button, anchor);
        append(button, t0);
        append(button, t1);
        if (!mounted) {
          dispose = listen(button, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*items*/
        2 && t0_value !== (t0_value = /*item*/
        ctx[6].label + ""))
          set_data(t0, t0_value);
        if (dirty & /*items*/
        2) {
          toggle_class(
            button,
            "danger",
            /*item*/
            ctx[6].danger
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment23(ctx) {
    let div;
    let button;
    let ellipsisvertical;
    let t;
    let current;
    let mounted;
    let dispose;
    ellipsisvertical = new ellipsis_vertical_default({ props: { size: "1rem" } });
    let if_block = (
      /*open*/
      ctx[0] && create_if_block5(ctx)
    );
    return {
      c() {
        div = element("div");
        button = element("button");
        create_component(ellipsisvertical.$$.fragment);
        t = space();
        if (if_block)
          if_block.c();
        attr(button, "class", "popover-trigger svelte-lcnz7g");
        attr(button, "title", "Options");
        attr(div, "class", "popover-wrapper svelte-lcnz7g");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, button);
        mount_component(ellipsisvertical, button, null);
        append(div, t);
        if (if_block)
          if_block.m(div, null);
        current = true;
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*onTriggerClick*/
            ctx[2]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (
          /*open*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block5(ctx2);
            if_block.c();
            if_block.m(div, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(ellipsisvertical.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(ellipsisvertical.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(ellipsisvertical);
        if (if_block)
          if_block.d();
        mounted = false;
        dispose();
      }
    };
  }
  function instance23($$self, $$props, $$invalidate) {
    let { open = false } = $$props;
    let { items = [] } = $$props;
    const dispatch = createEventDispatcher();
    function onTriggerClick(e) {
      e.stopPropagation();
      dispatch("toggle");
    }
    function onItemClick(e, item) {
      e.stopPropagation();
      dispatch("select", item);
    }
    const click_handler = (item, e) => onItemClick(e, item);
    $$self.$$set = ($$props2) => {
      if ("open" in $$props2)
        $$invalidate(0, open = $$props2.open);
      if ("items" in $$props2)
        $$invalidate(1, items = $$props2.items);
    };
    return [open, items, onTriggerClick, onItemClick, click_handler];
  }
  var PopoverMenu = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance23, create_fragment23, safe_not_equal, { open: 0, items: 1 }, add_css9);
    }
  };
  var PopoverMenu_default = PopoverMenu;

  // packages/ui/src/views/VaultManager.svelte
  function add_css10(target) {
    append_styles(target, "svelte-of6ag7", ".section-header.svelte-of6ag7.svelte-of6ag7{display:flex;align-items:center;justify-content:space-between;padding:0.5rem 2rem 0rem 1.5rem;flex-shrink:0}.section-header.svelte-of6ag7 h3.svelte-of6ag7{margin:0;font-size:1.25rem;font-weight:700;color:var(--text-normal)}.search-wrapper.svelte-of6ag7.svelte-of6ag7{width:11rem}.section-body.svelte-of6ag7.svelte-of6ag7{flex:1;display:flex;flex-direction:column;padding:1rem 1.1rem 0rem 1rem}.vault-list.svelte-of6ag7.svelte-of6ag7{flex:1;overflow-y:auto;scrollbar-gutter:stable;min-height:300px;max-height:300px;padding:0rem 0 1rem 0;display:flex;flex-direction:column;gap:0.375rem;border-bottom:1px solid var(--background-modifier-border)}.empty.svelte-of6ag7.svelte-of6ag7{color:var(--text-muted);padding:2rem 1rem;text-align:center;font-size:0.875rem}.vault-name.svelte-of6ag7.svelte-of6ag7{font-weight:600;font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.active-label.svelte-of6ag7.svelte-of6ag7{color:var(--interactive-accent);font-weight:400;font-size:0.875rem;margin-left:0.375rem}.active-check.svelte-of6ag7.svelte-of6ag7{color:var(--interactive-accent);font-size:0.875rem;margin-left:0.125rem}.vault-path.svelte-of6ag7.svelte-of6ag7{font-size:0.8125rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.footer-left.svelte-of6ag7.svelte-of6ag7{display:flex;align-items:center}.footer-right.svelte-of6ag7.svelte-of6ag7{display:flex;justify-content:flex-end}.version-info.svelte-of6ag7.svelte-of6ag7{font-size:0.75rem;color:var(--text-muted);user-select:none}");
  }
  function get_each_context3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[37] = list[i];
    return child_ctx;
  }
  function create_else_block2(ctx) {
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let each_1_anchor;
    let current;
    let each_value = ensure_array_like(
      /*filteredVaults*/
      ctx[10]
    );
    const get_key = (ctx2) => (
      /*vault*/
      ctx2[37].id
    );
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context3(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block3(key, child_ctx));
    }
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, each_1_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*filteredVaults, currentVaultId, openVault, openMenuId, menuItems, toggleMenu, onMenuSelect*/
        62984) {
          each_value = ensure_array_like(
            /*filteredVaults*/
            ctx2[10]
          );
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block3, each_1_anchor, get_each_context3);
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(each_1_anchor);
        }
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d(detaching);
        }
      }
    };
  }
  function create_if_block_6(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        div.textContent = "No vaults match your search.";
        attr(div, "class", "empty svelte-of6ag7");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_if_block_5(ctx) {
    let div;
    return {
      c() {
        div = element("div");
        div.textContent = "No vaults yet. Create one below.";
        attr(div, "class", "empty svelte-of6ag7");
      },
      m(target, anchor) {
        insert(target, div, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_icon_slot_5(ctx) {
    let folder;
    let t;
    let current;
    folder = new folder_default({ props: { size: "1.5rem" } });
    return {
      c() {
        create_component(folder.$$.fragment);
        t = space();
      },
      m(target, anchor) {
        mount_component(folder, target, anchor);
        insert(target, t, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(folder.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(folder.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
        destroy_component(folder, detaching);
      }
    };
  }
  function create_if_block_7(ctx) {
    let span0;
    let t1;
    let span1;
    return {
      c() {
        span0 = element("span");
        span0.textContent = "(active)";
        t1 = space();
        span1 = element("span");
        span1.textContent = "\u2713";
        attr(span0, "class", "active-label svelte-of6ag7");
        attr(span1, "class", "active-check svelte-of6ag7");
      },
      m(target, anchor) {
        insert(target, span0, anchor);
        insert(target, t1, anchor);
        insert(target, span1, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(span0);
          detach(t1);
          detach(span1);
        }
      }
    };
  }
  function create_default_slot_23(ctx) {
    let span0;
    let t0_value = (
      /*vault*/
      ctx[37].name + ""
    );
    let t0;
    let t1;
    let t2;
    let span1;
    let t3_value = (
      /*vault*/
      ctx[37].path + ""
    );
    let t3;
    let t4;
    let if_block = (
      /*vault*/
      ctx[37].id === /*currentVaultId*/
      ctx[9] && create_if_block_7(ctx)
    );
    return {
      c() {
        span0 = element("span");
        t0 = text(t0_value);
        t1 = space();
        if (if_block)
          if_block.c();
        t2 = space();
        span1 = element("span");
        t3 = text(t3_value);
        t4 = space();
        attr(span0, "class", "vault-name svelte-of6ag7");
        attr(span1, "class", "vault-path svelte-of6ag7");
      },
      m(target, anchor) {
        insert(target, span0, anchor);
        append(span0, t0);
        append(span0, t1);
        if (if_block)
          if_block.m(span0, null);
        insert(target, t2, anchor);
        insert(target, span1, anchor);
        append(span1, t3);
        insert(target, t4, anchor);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*filteredVaults*/
        1024 && t0_value !== (t0_value = /*vault*/
        ctx2[37].name + ""))
          set_data(t0, t0_value);
        if (
          /*vault*/
          ctx2[37].id === /*currentVaultId*/
          ctx2[9]
        ) {
          if (if_block) {
          } else {
            if_block = create_if_block_7(ctx2);
            if_block.c();
            if_block.m(span0, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        if (dirty[0] & /*filteredVaults*/
        1024 && t3_value !== (t3_value = /*vault*/
        ctx2[37].path + ""))
          set_data(t3, t3_value);
      },
      d(detaching) {
        if (detaching) {
          detach(span0);
          detach(t2);
          detach(span1);
          detach(t4);
        }
        if (if_block)
          if_block.d();
      }
    };
  }
  function create_action_slot(ctx) {
    let popovermenu;
    let t;
    let current;
    function toggle_handler() {
      return (
        /*toggle_handler*/
        ctx[25](
          /*vault*/
          ctx[37]
        )
      );
    }
    function select_handler(...args) {
      return (
        /*select_handler*/
        ctx[26](
          /*vault*/
          ctx[37],
          ...args
        )
      );
    }
    popovermenu = new PopoverMenu_default({
      props: {
        open: (
          /*openMenuId*/
          ctx[3] === /*vault*/
          ctx[37].id
        ),
        items: (
          /*menuItems*/
          ctx[12]
        )
      }
    });
    popovermenu.$on("toggle", toggle_handler);
    popovermenu.$on("select", select_handler);
    return {
      c() {
        create_component(popovermenu.$$.fragment);
        t = space();
      },
      m(target, anchor) {
        mount_component(popovermenu, target, anchor);
        insert(target, t, anchor);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        const popovermenu_changes = {};
        if (dirty[0] & /*openMenuId, filteredVaults*/
        1032)
          popovermenu_changes.open = /*openMenuId*/
          ctx[3] === /*vault*/
          ctx[37].id;
        popovermenu.$set(popovermenu_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(popovermenu.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(popovermenu.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
        destroy_component(popovermenu, detaching);
      }
    };
  }
  function create_each_block3(key_1, ctx) {
    let first;
    let listitem;
    let current;
    function click_handler() {
      return (
        /*click_handler*/
        ctx[27](
          /*vault*/
          ctx[37]
        )
      );
    }
    listitem = new ListItem_default({
      props: {
        primary: (
          /*vault*/
          ctx[37].name
        ),
        secondary: (
          /*vault*/
          ctx[37].path
        ),
        active: (
          /*vault*/
          ctx[37].id === /*currentVaultId*/
          ctx[9]
        ),
        $$slots: {
          action: [create_action_slot],
          default: [create_default_slot_23],
          icon: [create_icon_slot_5]
        },
        $$scope: { ctx }
      }
    });
    listitem.$on("click", click_handler);
    return {
      key: key_1,
      first: null,
      c() {
        first = empty();
        create_component(listitem.$$.fragment);
        this.first = first;
      },
      m(target, anchor) {
        insert(target, first, anchor);
        mount_component(listitem, target, anchor);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        const listitem_changes = {};
        if (dirty[0] & /*filteredVaults*/
        1024)
          listitem_changes.primary = /*vault*/
          ctx[37].name;
        if (dirty[0] & /*filteredVaults*/
        1024)
          listitem_changes.secondary = /*vault*/
          ctx[37].path;
        if (dirty[0] & /*filteredVaults, currentVaultId*/
        1536)
          listitem_changes.active = /*vault*/
          ctx[37].id === /*currentVaultId*/
          ctx[9];
        if (dirty[0] & /*openMenuId, filteredVaults, currentVaultId*/
        1544 | dirty[1] & /*$$scope*/
        512) {
          listitem_changes.$$scope = { dirty, ctx };
        }
        listitem.$set(listitem_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(listitem.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(listitem.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(first);
        }
        destroy_component(listitem, detaching);
      }
    };
  }
  function create_default_slot_15(ctx) {
    let div1;
    let h3;
    let t1;
    let div0;
    let searchinput;
    let t2;
    let div3;
    let div2;
    let current_block_type_index;
    let if_block;
    let current;
    searchinput = new SearchInput_default({ props: { value: (
      /*searchQuery*/
      ctx[1]
    ) } });
    searchinput.$on(
      "input",
      /*input_handler*/
      ctx[24]
    );
    const if_block_creators = [create_if_block_5, create_if_block_6, create_else_block2];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*vaults*/
        ctx2[0].length === 0
      )
        return 0;
      if (
        /*filteredVaults*/
        ctx2[10].length === 0
      )
        return 1;
      return 2;
    }
    current_block_type_index = select_block_type(ctx, [-1, -1]);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        div1 = element("div");
        h3 = element("h3");
        h3.textContent = "Vaults";
        t1 = space();
        div0 = element("div");
        create_component(searchinput.$$.fragment);
        t2 = space();
        div3 = element("div");
        div2 = element("div");
        if_block.c();
        attr(h3, "class", "svelte-of6ag7");
        attr(div0, "class", "search-wrapper svelte-of6ag7");
        attr(div1, "class", "section-header svelte-of6ag7");
        attr(div2, "class", "vault-list svelte-of6ag7");
        attr(div3, "class", "section-body svelte-of6ag7");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, h3);
        append(div1, t1);
        append(div1, div0);
        mount_component(searchinput, div0, null);
        insert(target, t2, anchor);
        insert(target, div3, anchor);
        append(div3, div2);
        if_blocks[current_block_type_index].m(div2, null);
        current = true;
      },
      p(ctx2, dirty) {
        const searchinput_changes = {};
        if (dirty[0] & /*searchQuery*/
        2)
          searchinput_changes.value = /*searchQuery*/
          ctx2[1];
        searchinput.$set(searchinput_changes);
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(div2, null);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(searchinput.$$.fragment, local);
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(searchinput.$$.fragment, local);
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div1);
          detach(t2);
          detach(div3);
        }
        destroy_component(searchinput);
        if_blocks[current_block_type_index].d();
      }
    };
  }
  function create_icon_slot_4(ctx) {
    let vault_1;
    let current;
    vault_1 = new vault_default({ props: { size: "1.25rem" } });
    return {
      c() {
        create_component(vault_1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(vault_1, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(vault_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(vault_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(vault_1, detaching);
      }
    };
  }
  function create_if_block_4(ctx) {
    let span;
    let t0;
    let t1;
    return {
      c() {
        span = element("span");
        t0 = text("Ignis v");
        t1 = text(
          /*version*/
          ctx[8]
        );
        attr(span, "class", "version-info svelte-of6ag7");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t0);
        append(span, t1);
      },
      p(ctx2, dirty) {
        if (dirty[0] & /*version*/
        256)
          set_data(
            t1,
            /*version*/
            ctx2[8]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_default_slot18(ctx) {
    let t;
    return {
      c() {
        t = text("Create New Vault");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_icon_slot_3(ctx) {
    let plus;
    let current;
    plus = new plus_default({ props: { size: "1rem" } });
    return {
      c() {
        create_component(plus.$$.fragment);
      },
      m(target, anchor) {
        mount_component(plus, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(plus.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(plus.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(plus, detaching);
      }
    };
  }
  function create_footer_slot5(ctx) {
    let div0;
    let t;
    let div1;
    let button;
    let current;
    let if_block = (
      /*version*/
      ctx[8] && create_if_block_4(ctx)
    );
    button = new Button_default({
      props: {
        variant: "ghost",
        $$slots: {
          icon: [create_icon_slot_3],
          default: [create_default_slot18]
        },
        $$scope: { ctx }
      }
    });
    button.$on(
      "click",
      /*showCreateDialog*/
      ctx[16]
    );
    return {
      c() {
        div0 = element("div");
        if (if_block)
          if_block.c();
        t = space();
        div1 = element("div");
        create_component(button.$$.fragment);
        attr(div0, "class", "footer-left svelte-of6ag7");
        attr(div1, "class", "footer-right svelte-of6ag7");
      },
      m(target, anchor) {
        insert(target, div0, anchor);
        if (if_block)
          if_block.m(div0, null);
        insert(target, t, anchor);
        insert(target, div1, anchor);
        mount_component(button, div1, null);
        current = true;
      },
      p(ctx2, dirty) {
        if (
          /*version*/
          ctx2[8]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block_4(ctx2);
            if_block.c();
            if_block.m(div0, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        const button_changes = {};
        if (dirty[1] & /*$$scope*/
        512) {
          button_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button.$set(button_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(button.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(button.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div0);
          detach(t);
          detach(div1);
        }
        if (if_block)
          if_block.d();
        destroy_component(button);
      }
    };
  }
  function create_if_block_32(ctx) {
    let promptdialog;
    let updating_value;
    let current;
    function promptdialog_value_binding(value) {
      ctx[29](value);
    }
    let promptdialog_props = {
      title: "Create Vault",
      label: "Vault Name:",
      placeholder: "My New Vault",
      confirmText: "Create Vault",
      $$slots: {
        confirmIcon: [create_confirmIcon_slot_2],
        icon: [create_icon_slot_2]
      },
      $$scope: { ctx }
    };
    if (
      /*dialogValue*/
      ctx[6] !== void 0
    ) {
      promptdialog_props.value = /*dialogValue*/
      ctx[6];
    }
    promptdialog = new PromptDialog_default({ props: promptdialog_props });
    binding_callbacks.push(() => bind(promptdialog, "value", promptdialog_value_binding));
    promptdialog.$on(
      "confirm",
      /*onCreateConfirm*/
      ctx[18]
    );
    promptdialog.$on(
      "cancel",
      /*closeDialog*/
      ctx[17]
    );
    return {
      c() {
        create_component(promptdialog.$$.fragment);
      },
      m(target, anchor) {
        mount_component(promptdialog, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const promptdialog_changes = {};
        if (dirty[1] & /*$$scope*/
        512) {
          promptdialog_changes.$$scope = { dirty, ctx: ctx2 };
        }
        if (!updating_value && dirty[0] & /*dialogValue*/
        64) {
          updating_value = true;
          promptdialog_changes.value = /*dialogValue*/
          ctx2[6];
          add_flush_callback(() => updating_value = false);
        }
        promptdialog.$set(promptdialog_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(promptdialog.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(promptdialog.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(promptdialog, detaching);
      }
    };
  }
  function create_icon_slot_2(ctx) {
    let squareplus;
    let current;
    squareplus = new square_plus_default({ props: { size: "1.25rem" } });
    return {
      c() {
        create_component(squareplus.$$.fragment);
      },
      m(target, anchor) {
        mount_component(squareplus, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(squareplus.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(squareplus.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(squareplus, detaching);
      }
    };
  }
  function create_confirmIcon_slot_2(ctx) {
    let plus;
    let current;
    plus = new plus_default({ props: { size: "0.875rem" } });
    return {
      c() {
        create_component(plus.$$.fragment);
      },
      m(target, anchor) {
        mount_component(plus, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(plus.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(plus.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(plus, detaching);
      }
    };
  }
  function create_if_block_22(ctx) {
    let promptdialog;
    let updating_value;
    let current;
    function promptdialog_value_binding_1(value) {
      ctx[30](value);
    }
    let promptdialog_props = {
      title: "Rename Item",
      label: "New Name:",
      confirmText: "Save",
      $$slots: {
        confirmIcon: [create_confirmIcon_slot_1],
        icon: [create_icon_slot_13]
      },
      $$scope: { ctx }
    };
    if (
      /*dialogValue*/
      ctx[6] !== void 0
    ) {
      promptdialog_props.value = /*dialogValue*/
      ctx[6];
    }
    promptdialog = new PromptDialog_default({ props: promptdialog_props });
    binding_callbacks.push(() => bind(promptdialog, "value", promptdialog_value_binding_1));
    promptdialog.$on(
      "confirm",
      /*onRenameConfirm*/
      ctx[19]
    );
    promptdialog.$on(
      "cancel",
      /*closeDialog*/
      ctx[17]
    );
    return {
      c() {
        create_component(promptdialog.$$.fragment);
      },
      m(target, anchor) {
        mount_component(promptdialog, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const promptdialog_changes = {};
        if (dirty[1] & /*$$scope*/
        512) {
          promptdialog_changes.$$scope = { dirty, ctx: ctx2 };
        }
        if (!updating_value && dirty[0] & /*dialogValue*/
        64) {
          updating_value = true;
          promptdialog_changes.value = /*dialogValue*/
          ctx2[6];
          add_flush_callback(() => updating_value = false);
        }
        promptdialog.$set(promptdialog_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(promptdialog.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(promptdialog.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(promptdialog, detaching);
      }
    };
  }
  function create_icon_slot_13(ctx) {
    let penline;
    let current;
    penline = new pen_line_default({ props: { size: "1.25rem" } });
    return {
      c() {
        create_component(penline.$$.fragment);
      },
      m(target, anchor) {
        mount_component(penline, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(penline.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(penline.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(penline, detaching);
      }
    };
  }
  function create_confirmIcon_slot_1(ctx) {
    let check;
    let current;
    check = new check_default({ props: { size: "0.875rem" } });
    return {
      c() {
        create_component(check.$$.fragment);
      },
      m(target, anchor) {
        mount_component(check, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(check.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(check.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(check, detaching);
      }
    };
  }
  function create_if_block_12(ctx) {
    let confirmdialog;
    let current;
    confirmdialog = new ConfirmDialog_default({
      props: {
        title: "Delete Confirmation",
        message: (
          /*deleteMessage*/
          ctx[11]
        ),
        description: "This action cannot be undone. All notes and linked files within this vault will be permanently removed from your system.",
        confirmText: "Confirm Delete",
        confirmVariant: "danger",
        $$slots: {
          confirmIcon: [create_confirmIcon_slot],
          icon: [create_icon_slot4]
        },
        $$scope: { ctx }
      }
    });
    confirmdialog.$on(
      "confirm",
      /*onDeleteConfirm*/
      ctx[20]
    );
    confirmdialog.$on(
      "cancel",
      /*closeDialog*/
      ctx[17]
    );
    return {
      c() {
        create_component(confirmdialog.$$.fragment);
      },
      m(target, anchor) {
        mount_component(confirmdialog, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const confirmdialog_changes = {};
        if (dirty[0] & /*deleteMessage*/
        2048)
          confirmdialog_changes.message = /*deleteMessage*/
          ctx2[11];
        if (dirty[1] & /*$$scope*/
        512) {
          confirmdialog_changes.$$scope = { dirty, ctx: ctx2 };
        }
        confirmdialog.$set(confirmdialog_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(confirmdialog.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(confirmdialog.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(confirmdialog, detaching);
      }
    };
  }
  function create_icon_slot4(ctx) {
    let trash2;
    let current;
    trash2 = new trash_2_default({ props: { size: "1.25rem" } });
    return {
      c() {
        create_component(trash2.$$.fragment);
      },
      m(target, anchor) {
        mount_component(trash2, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(trash2.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(trash2.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(trash2, detaching);
      }
    };
  }
  function create_confirmIcon_slot(ctx) {
    let check;
    let current;
    check = new check_default({ props: { size: "0.875rem" } });
    return {
      c() {
        create_component(check.$$.fragment);
      },
      m(target, anchor) {
        mount_component(check, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(check.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(check.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(check, detaching);
      }
    };
  }
  function create_if_block6(ctx) {
    let messagedialog;
    let current;
    messagedialog = new MessageDialog_default({
      props: {
        title: "Error",
        message: (
          /*errorMessage*/
          ctx[7]
        )
      }
    });
    messagedialog.$on(
      "confirm",
      /*confirm_handler*/
      ctx[31]
    );
    return {
      c() {
        create_component(messagedialog.$$.fragment);
      },
      m(target, anchor) {
        mount_component(messagedialog, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const messagedialog_changes = {};
        if (dirty[0] & /*errorMessage*/
        128)
          messagedialog_changes.message = /*errorMessage*/
          ctx2[7];
        messagedialog.$set(messagedialog_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(messagedialog.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(messagedialog.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(messagedialog, detaching);
      }
    };
  }
  function create_fragment24(ctx) {
    let modal;
    let t0;
    let t1;
    let t2;
    let t3;
    let if_block3_anchor;
    let current;
    let modal_props = {
      title: "Vault Manager",
      width: "600px",
      closeOnOverlayClick: false,
      $$slots: {
        footer: [create_footer_slot5],
        icon: [create_icon_slot_4],
        default: [create_default_slot_15]
      },
      $$scope: { ctx }
    };
    modal = new Modal_default({ props: modal_props });
    ctx[28](modal);
    modal.$on(
      "escape",
      /*onEscape*/
      ctx[22]
    );
    modal.$on(
      "close",
      /*onModalClose*/
      ctx[21]
    );
    let if_block0 = (
      /*activeDialog*/
      ctx[5] === "create" && create_if_block_32(ctx)
    );
    let if_block1 = (
      /*activeDialog*/
      ctx[5] === "rename" && create_if_block_22(ctx)
    );
    let if_block2 = (
      /*activeDialog*/
      ctx[5] === "delete" && /*targetVault*/
      ctx[2] && create_if_block_12(ctx)
    );
    let if_block3 = (
      /*activeDialog*/
      ctx[5] === "error" && create_if_block6(ctx)
    );
    return {
      c() {
        create_component(modal.$$.fragment);
        t0 = space();
        if (if_block0)
          if_block0.c();
        t1 = space();
        if (if_block1)
          if_block1.c();
        t2 = space();
        if (if_block2)
          if_block2.c();
        t3 = space();
        if (if_block3)
          if_block3.c();
        if_block3_anchor = empty();
      },
      m(target, anchor) {
        mount_component(modal, target, anchor);
        insert(target, t0, anchor);
        if (if_block0)
          if_block0.m(target, anchor);
        insert(target, t1, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, t2, anchor);
        if (if_block2)
          if_block2.m(target, anchor);
        insert(target, t3, anchor);
        if (if_block3)
          if_block3.m(target, anchor);
        insert(target, if_block3_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const modal_changes = {};
        if (dirty[0] & /*version, vaults, filteredVaults, currentVaultId, openMenuId, searchQuery*/
        1803 | dirty[1] & /*$$scope*/
        512) {
          modal_changes.$$scope = { dirty, ctx: ctx2 };
        }
        modal.$set(modal_changes);
        if (
          /*activeDialog*/
          ctx2[5] === "create"
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
            if (dirty[0] & /*activeDialog*/
            32) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_32(ctx2);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(t1.parentNode, t1);
          }
        } else if (if_block0) {
          group_outros();
          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });
          check_outros();
        }
        if (
          /*activeDialog*/
          ctx2[5] === "rename"
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty[0] & /*activeDialog*/
            32) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block_22(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(t2.parentNode, t2);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
        if (
          /*activeDialog*/
          ctx2[5] === "delete" && /*targetVault*/
          ctx2[2]
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
            if (dirty[0] & /*activeDialog, targetVault*/
            36) {
              transition_in(if_block2, 1);
            }
          } else {
            if_block2 = create_if_block_12(ctx2);
            if_block2.c();
            transition_in(if_block2, 1);
            if_block2.m(t3.parentNode, t3);
          }
        } else if (if_block2) {
          group_outros();
          transition_out(if_block2, 1, 1, () => {
            if_block2 = null;
          });
          check_outros();
        }
        if (
          /*activeDialog*/
          ctx2[5] === "error"
        ) {
          if (if_block3) {
            if_block3.p(ctx2, dirty);
            if (dirty[0] & /*activeDialog*/
            32) {
              transition_in(if_block3, 1);
            }
          } else {
            if_block3 = create_if_block6(ctx2);
            if_block3.c();
            transition_in(if_block3, 1);
            if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
          }
        } else if (if_block3) {
          group_outros();
          transition_out(if_block3, 1, 1, () => {
            if_block3 = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(modal.$$.fragment, local);
        transition_in(if_block0);
        transition_in(if_block1);
        transition_in(if_block2);
        transition_in(if_block3);
        current = true;
      },
      o(local) {
        transition_out(modal.$$.fragment, local);
        transition_out(if_block0);
        transition_out(if_block1);
        transition_out(if_block2);
        transition_out(if_block3);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(t1);
          detach(t2);
          detach(t3);
          detach(if_block3_anchor);
        }
        ctx[28](null);
        destroy_component(modal, detaching);
        if (if_block0)
          if_block0.d(detaching);
        if (if_block1)
          if_block1.d(detaching);
        if (if_block2)
          if_block2.d(detaching);
        if (if_block3)
          if_block3.d(detaching);
      }
    };
  }
  function instance24($$self, $$props, $$invalidate) {
    let deleteMessage;
    let filteredVaults;
    let { vaultService: vaultService2 } = $$props;
    let vaults = [];
    let searchQuery = "";
    let openMenuId = null;
    let modalRef;
    let activeDialog = null;
    let targetVault = null;
    let dialogValue = "";
    let errorMessage = "";
    let pendingReload = false;
    let version = "";
    const menuItems = [
      { id: "rename", label: "Rename" },
      {
        id: "delete",
        label: "Delete",
        danger: true
      }
    ];
    let currentVaultId = vaultService2.getCurrentVaultId();
    async function fetchVersion() {
      try {
        const res = await fetch("/api/version");
        const data = await res.json();
        $$invalidate(8, version = data.version);
      } catch (e) {
        console.warn("[VaultManager] Failed to fetch version:", e);
      }
    }
    async function refreshVaults() {
      try {
        $$invalidate(0, vaults = await vaultService2.listVaults());
      } catch {
        $$invalidate(0, vaults = []);
      }
    }
    function openVault(vault) {
      if (vault.id === currentVaultId) {
        modalRef.dismiss();
        return;
      }
      vaultService2.openVault(vault.id);
    }
    function toggleMenu(vaultId) {
      if (openMenuId === vaultId) {
        $$invalidate(3, openMenuId = null);
      } else {
        $$invalidate(3, openMenuId = vaultId);
      }
    }
    function onMenuSelect(vault, item) {
      $$invalidate(3, openMenuId = null);
      if (item.id === "rename") {
        showRenameDialog(vault);
      } else if (item.id === "delete") {
        showDeleteDialog(vault);
      }
    }
    function showCreateDialog() {
      $$invalidate(6, dialogValue = "");
      $$invalidate(5, activeDialog = "create");
    }
    function showRenameDialog(vault) {
      $$invalidate(2, targetVault = vault);
      $$invalidate(6, dialogValue = vault.name);
      $$invalidate(5, activeDialog = "rename");
    }
    function showDeleteDialog(vault) {
      $$invalidate(2, targetVault = vault);
      $$invalidate(5, activeDialog = "delete");
    }
    function closeDialog() {
      $$invalidate(5, activeDialog = null);
      $$invalidate(2, targetVault = null);
      $$invalidate(6, dialogValue = "");
    }
    async function onCreateConfirm(e) {
      const name = e.detail.trim();
      if (!name) {
        return;
      }
      try {
        $$invalidate(0, vaults = await vaultService2.createVault(name));
        closeDialog();
      } catch (err) {
        $$invalidate(7, errorMessage = "Failed to create vault: " + err.message);
        $$invalidate(5, activeDialog = "error");
      }
    }
    async function onRenameConfirm(e) {
      const trimmed = e.detail.trim();
      if (!trimmed || trimmed === targetVault.name) {
        closeDialog();
        return;
      }
      const wasCurrentVault = targetVault.id === currentVaultId;
      try {
        $$invalidate(0, vaults = await vaultService2.renameVault(targetVault.id, trimmed));
        closeDialog();
        if (wasCurrentVault) {
          $$invalidate(9, currentVaultId = vaultService2.getCurrentVaultId());
          pendingReload = true;
        }
      } catch (err) {
        $$invalidate(7, errorMessage = "Failed to rename vault: " + err.message);
        $$invalidate(5, activeDialog = "error");
      }
    }
    async function onDeleteConfirm() {
      try {
        const { wasCurrentVault } = await vaultService2.deleteVault(targetVault.id);
        closeDialog();
        $$invalidate(0, vaults = await vaultService2.listVaults());
        if (wasCurrentVault) {
          vaultService2.openVault("");
        }
      } catch (err) {
        $$invalidate(7, errorMessage = "Failed to delete vault: " + err.message);
        $$invalidate(5, activeDialog = "error");
      }
    }
    function onModalClose() {
      if (pendingReload) {
        window.location.reload();
      }
    }
    function onEscape() {
      if (openMenuId) {
        $$invalidate(3, openMenuId = null);
      } else {
        modalRef.dismiss();
      }
    }
    onMount(() => {
      refreshVaults();
      fetchVersion();
    });
    const input_handler = (e) => {
      $$invalidate(1, searchQuery = e.detail);
    };
    const toggle_handler = (vault) => toggleMenu(vault.id);
    const select_handler = (vault, e) => onMenuSelect(vault, e.detail);
    const click_handler = (vault) => openVault(vault);
    function modal_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        modalRef = $$value;
        $$invalidate(4, modalRef);
      });
    }
    function promptdialog_value_binding(value) {
      dialogValue = value;
      $$invalidate(6, dialogValue);
    }
    function promptdialog_value_binding_1(value) {
      dialogValue = value;
      $$invalidate(6, dialogValue);
    }
    const confirm_handler = () => {
      $$invalidate(5, activeDialog = null);
      $$invalidate(7, errorMessage = "");
    };
    $$self.$$set = ($$props2) => {
      if ("vaultService" in $$props2)
        $$invalidate(23, vaultService2 = $$props2.vaultService);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*targetVault*/
      4) {
        $:
          $$invalidate(11, deleteMessage = targetVault ? 'Are you sure you want to delete "' + targetVault.name + '"?' : "");
      }
      if ($$self.$$.dirty[0] & /*searchQuery, vaults*/
      3) {
        $:
          $$invalidate(10, filteredVaults = searchQuery ? vaults.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase())) : vaults);
      }
    };
    return [
      vaults,
      searchQuery,
      targetVault,
      openMenuId,
      modalRef,
      activeDialog,
      dialogValue,
      errorMessage,
      version,
      currentVaultId,
      filteredVaults,
      deleteMessage,
      menuItems,
      openVault,
      toggleMenu,
      onMenuSelect,
      showCreateDialog,
      closeDialog,
      onCreateConfirm,
      onRenameConfirm,
      onDeleteConfirm,
      onModalClose,
      onEscape,
      vaultService2,
      input_handler,
      toggle_handler,
      select_handler,
      click_handler,
      modal_binding,
      promptdialog_value_binding,
      promptdialog_value_binding_1,
      confirm_handler
    ];
  }
  var VaultManager = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance24, create_fragment24, safe_not_equal, { vaultService: 23 }, add_css10, [-1, -1]);
    }
  };
  var VaultManager_default = VaultManager;

  // packages/ui/src/components/layout/Banner.svelte
  function add_css11(target) {
    append_styles(target, "svelte-mnfkgx", '.banner.svelte-mnfkgx{position:fixed;top:0;left:0;right:0;z-index:2147483647;display:flex;align-items:center;gap:0.75rem;padding:0.625rem 1rem;font-family:var(\n      --font-interface,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      sans-serif\n    );font-size:0.8125rem;line-height:1.45;box-shadow:0 1px 6px rgba(0, 0, 0, 0.4);user-select:text;-webkit-user-select:text}.banner-body.svelte-mnfkgx{flex:1}.banner-title.svelte-mnfkgx{display:block;font-weight:600}.banner-close.svelte-mnfkgx{flex-shrink:0;align-self:flex-start;display:flex;align-items:center;background:none;border:none;box-shadow:none;color:inherit;opacity:0.8;cursor:pointer;padding:0.25rem;border-radius:0.25rem}.banner-close.svelte-mnfkgx:hover{opacity:1;background:rgba(0, 0, 0, 0.2)}.error.svelte-mnfkgx{background:#5c1a1a;color:#f3d6d6;border-bottom:1px solid #7a2a2a}.warning.svelte-mnfkgx{background:#5c4410;color:#f3e6c0;border-bottom:1px solid #7a5e1a}.info.svelte-mnfkgx{background:#13304d;color:#cfe2f3;border-bottom:1px solid #1d4a73}');
  }
  function create_if_block_13(ctx) {
    let strong;
    let t;
    return {
      c() {
        strong = element("strong");
        t = text(
          /*title*/
          ctx[2]
        );
        attr(strong, "class", "banner-title svelte-mnfkgx");
      },
      m(target, anchor) {
        insert(target, strong, anchor);
        append(strong, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*title*/
        4)
          set_data(
            t,
            /*title*/
            ctx2[2]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(strong);
        }
      }
    };
  }
  function create_if_block7(ctx) {
    let button;
    let x;
    let current;
    let mounted;
    let dispose;
    x = new x_default({ props: { size: "1.125rem" } });
    return {
      c() {
        button = element("button");
        create_component(x.$$.fragment);
        attr(button, "class", "banner-close svelte-mnfkgx");
        attr(button, "aria-label", "Dismiss");
        attr(button, "title", "Dismiss");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        mount_component(x, button, null);
        current = true;
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*dismiss*/
            ctx[4]
          );
          mounted = true;
        }
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(x.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(x.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        destroy_component(x);
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment25(ctx) {
    let div1;
    let div0;
    let t0;
    let t1;
    let div1_class_value;
    let current;
    let if_block0 = (
      /*title*/
      ctx[2] && create_if_block_13(ctx)
    );
    const default_slot_template = (
      /*#slots*/
      ctx[6].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[5],
      null
    );
    let if_block1 = (
      /*dismissible*/
      ctx[1] && create_if_block7(ctx)
    );
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        if (default_slot)
          default_slot.c();
        t1 = space();
        if (if_block1)
          if_block1.c();
        attr(div0, "class", "banner-body svelte-mnfkgx");
        attr(div1, "class", div1_class_value = "banner " + /*severity*/
        ctx[0] + " svelte-mnfkgx");
        attr(
          div1,
          "id",
          /*id*/
          ctx[3]
        );
        attr(div1, "role", "alert");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        if (if_block0)
          if_block0.m(div0, null);
        append(div0, t0);
        if (default_slot) {
          default_slot.m(div0, null);
        }
        append(div1, t1);
        if (if_block1)
          if_block1.m(div1, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*title*/
          ctx2[2]
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_13(ctx2);
            if_block0.c();
            if_block0.m(div0, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          32)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[5],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[5]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[5],
                dirty,
                null
              ),
              null
            );
          }
        }
        if (
          /*dismissible*/
          ctx2[1]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty & /*dismissible*/
            2) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block7(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div1, null);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
        if (!current || dirty & /*severity*/
        1 && div1_class_value !== (div1_class_value = "banner " + /*severity*/
        ctx2[0] + " svelte-mnfkgx")) {
          attr(div1, "class", div1_class_value);
        }
        if (!current || dirty & /*id*/
        8) {
          attr(
            div1,
            "id",
            /*id*/
            ctx2[3]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div1);
        }
        if (if_block0)
          if_block0.d();
        if (default_slot)
          default_slot.d(detaching);
        if (if_block1)
          if_block1.d();
      }
    };
  }
  function instance25($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { severity = "info" } = $$props;
    let { dismissible = true } = $$props;
    let { title = "" } = $$props;
    let { id = void 0 } = $$props;
    const dispatch = createEventDispatcher();
    function dismiss() {
      dispatch("dismiss");
    }
    $$self.$$set = ($$props2) => {
      if ("severity" in $$props2)
        $$invalidate(0, severity = $$props2.severity);
      if ("dismissible" in $$props2)
        $$invalidate(1, dismissible = $$props2.dismissible);
      if ("title" in $$props2)
        $$invalidate(2, title = $$props2.title);
      if ("id" in $$props2)
        $$invalidate(3, id = $$props2.id);
      if ("$$scope" in $$props2)
        $$invalidate(5, $$scope = $$props2.$$scope);
    };
    return [severity, dismissible, title, id, dismiss, $$scope, slots];
  }
  var Banner = class extends SvelteComponent {
    constructor(options) {
      super();
      init(
        this,
        options,
        instance25,
        create_fragment25,
        safe_not_equal,
        {
          severity: 0,
          dismissible: 1,
          title: 2,
          id: 3
        },
        add_css11
      );
    }
  };
  var Banner_default = Banner;

  // packages/ui/src/views/sync/VaultRow.svelte
  function add_css12(target) {
    append_styles(target, "svelte-1kcub1a", ".vault-row.svelte-1kcub1a.svelte-1kcub1a{border:1px solid var(--background-modifier-border);border-radius:0.375rem;overflow:hidden}.vault-row-main.svelte-1kcub1a.svelte-1kcub1a{display:flex;align-items:center;padding:0.75rem 1rem}.vault-row-info.svelte-1kcub1a.svelte-1kcub1a{flex:1;min-width:0}.vault-row-name.svelte-1kcub1a.svelte-1kcub1a{font-weight:600;font-size:0.9375rem;color:var(--text-normal)}.vault-row-region.svelte-1kcub1a.svelte-1kcub1a{font-size:0.8125rem;color:var(--text-muted);margin-top:0.125rem}.vault-row-actions.svelte-1kcub1a.svelte-1kcub1a{display:flex;align-items:center;gap:0.5rem}.vault-row-actions.svelte-1kcub1a .btn.secondary{padding:4px 12px;border-radius:5px;border:none;background:var(--interactive-normal);color:var(--text-normal)}.vault-row-actions.svelte-1kcub1a .btn.secondary:hover:not(:disabled){background:var(--interactive-hover);color:var(--text-normal)}.icon-btn.svelte-1kcub1a.svelte-1kcub1a{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border:none;border-radius:0.25rem;background:none;color:var(--text-muted);cursor:pointer;box-shadow:none}.icon-btn.svelte-1kcub1a.svelte-1kcub1a:hover{color:var(--text-normal);background:var(--background-modifier-hover)}.vault-row-options.svelte-1kcub1a.svelte-1kcub1a{padding:0.5rem 1rem 1rem;border-top:1px solid var(--background-modifier-border);background:var(--background-primary-alt)}.option-row.svelte-1kcub1a.svelte-1kcub1a{display:flex;align-items:center;justify-content:space-between;padding:0.625rem 0}.option-row.svelte-1kcub1a+.option-row.svelte-1kcub1a{border-top:1px solid var(--background-modifier-border)}.option-label.svelte-1kcub1a.svelte-1kcub1a{flex:1;min-width:0;margin-right:1rem}.option-name.svelte-1kcub1a.svelte-1kcub1a{font-size:0.875rem;font-weight:500;color:var(--text-normal)}.option-desc.svelte-1kcub1a.svelte-1kcub1a{font-size:0.75rem;color:var(--text-muted);margin-top:0.125rem}input.svelte-1kcub1a.svelte-1kcub1a,select.svelte-1kcub1a.svelte-1kcub1a{font-family:var(--font-interface);font-size:0.875rem;padding:0.375rem 0.625rem;border:1px solid var(--background-modifier-border);border-radius:0.375rem;background:var(--background-primary);color:var(--text-normal);min-width:200px}input.svelte-1kcub1a.svelte-1kcub1a:focus,select.svelte-1kcub1a.svelte-1kcub1a:focus{outline:none;border-color:var(--interactive-accent)}.option-footer.svelte-1kcub1a.svelte-1kcub1a{display:flex;justify-content:flex-end;gap:0.5rem;padding-top:0.75rem}");
  }
  function create_else_block3(ctx) {
    let button;
    let current;
    button = new Button_default({
      props: {
        variant: "secondary",
        $$slots: { default: [create_default_slot_24] },
        $$scope: { ctx }
      }
    });
    button.$on(
      "click",
      /*toggleExpand*/
      ctx[7]
    );
    return {
      c() {
        create_component(button.$$.fragment);
      },
      m(target, anchor) {
        mount_component(button, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const button_changes = {};
        if (dirty & /*$$scope, expanded*/
        16388) {
          button_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button.$set(button_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(button.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(button.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(button, detaching);
      }
    };
  }
  function create_if_block_23(ctx) {
    let button;
    let pencil;
    let current;
    let mounted;
    let dispose;
    pencil = new pencil_default({ props: { size: "14" } });
    return {
      c() {
        button = element("button");
        create_component(pencil.$$.fragment);
        attr(button, "class", "icon-btn svelte-1kcub1a");
        attr(button, "title", "Edit sync config");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        mount_component(pencil, button, null);
        current = true;
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*toggleExpand*/
            ctx[7]
          );
          mounted = true;
        }
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(pencil.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(pencil.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        destroy_component(pencil);
        mounted = false;
        dispose();
      }
    };
  }
  function create_default_slot_24(ctx) {
    let t_value = (
      /*expanded*/
      ctx[2] ? "Cancel" : "Connect"
    );
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*expanded*/
        4 && t_value !== (t_value = /*expanded*/
        ctx2[2] ? "Cancel" : "Connect"))
          set_data(t, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_if_block8(ctx) {
    let div12;
    let div3;
    let div2;
    let t3;
    let input0;
    let t4;
    let div7;
    let div6;
    let t8;
    let input1;
    let t9;
    let div10;
    let div9;
    let t11;
    let select;
    let option0;
    let option1;
    let option2;
    let t15;
    let div11;
    let t16;
    let button;
    let current;
    let mounted;
    let dispose;
    let if_block = (
      /*expanded*/
      ctx[2] && !/*linked*/
      ctx[1] && create_if_block_14(ctx)
    );
    button = new Button_default({
      props: {
        variant: "primary",
        disabled: (
          /*linking*/
          ctx[6]
        ),
        $$slots: { default: [create_default_slot19] },
        $$scope: { ctx }
      }
    });
    button.$on(
      "click",
      /*onLink*/
      ctx[8]
    );
    return {
      c() {
        div12 = element("div");
        div3 = element("div");
        div2 = element("div");
        div2.innerHTML = `<div class="option-name svelte-1kcub1a">Vault password</div> <div class="option-desc svelte-1kcub1a">Required if the vault uses end-to-end encryption</div>`;
        t3 = space();
        input0 = element("input");
        t4 = space();
        div7 = element("div");
        div6 = element("div");
        div6.innerHTML = `<div class="option-name svelte-1kcub1a">Device name</div> <div class="option-desc svelte-1kcub1a">Identifies this server in sync version history</div>`;
        t8 = space();
        input1 = element("input");
        t9 = space();
        div10 = element("div");
        div9 = element("div");
        div9.innerHTML = `<div class="option-name svelte-1kcub1a">Sync mode</div>`;
        t11 = space();
        select = element("select");
        option0 = element("option");
        option0.textContent = "Bidirectional";
        option1 = element("option");
        option1.textContent = "Pull only (remote to server)";
        option2 = element("option");
        option2.textContent = "Mirror remote (exact copy)";
        t15 = space();
        div11 = element("div");
        if (if_block)
          if_block.c();
        t16 = space();
        create_component(button.$$.fragment);
        attr(div2, "class", "option-label svelte-1kcub1a");
        attr(input0, "type", "password");
        attr(input0, "placeholder", "Leave empty if not encrypted");
        attr(input0, "class", "svelte-1kcub1a");
        attr(div3, "class", "option-row svelte-1kcub1a");
        attr(div6, "class", "option-label svelte-1kcub1a");
        attr(input1, "type", "text");
        attr(input1, "class", "svelte-1kcub1a");
        attr(div7, "class", "option-row svelte-1kcub1a");
        attr(div9, "class", "option-label svelte-1kcub1a");
        option0.__value = "bidirectional";
        set_input_value(option0, option0.__value);
        option1.__value = "pull-only";
        set_input_value(option1, option1.__value);
        option2.__value = "mirror-remote";
        set_input_value(option2, option2.__value);
        attr(select, "class", "svelte-1kcub1a");
        if (
          /*mode*/
          ctx[5] === void 0
        )
          add_render_callback(() => (
            /*select_change_handler*/
            ctx[12].call(select)
          ));
        attr(div10, "class", "option-row svelte-1kcub1a");
        attr(div11, "class", "option-footer svelte-1kcub1a");
        attr(div12, "class", "vault-row-options svelte-1kcub1a");
      },
      m(target, anchor) {
        insert(target, div12, anchor);
        append(div12, div3);
        append(div3, div2);
        append(div3, t3);
        append(div3, input0);
        set_input_value(
          input0,
          /*vaultPassword*/
          ctx[3]
        );
        append(div12, t4);
        append(div12, div7);
        append(div7, div6);
        append(div7, t8);
        append(div7, input1);
        set_input_value(
          input1,
          /*deviceName*/
          ctx[4]
        );
        append(div12, t9);
        append(div12, div10);
        append(div10, div9);
        append(div10, t11);
        append(div10, select);
        append(select, option0);
        append(select, option1);
        append(select, option2);
        select_option(
          select,
          /*mode*/
          ctx[5],
          true
        );
        append(div12, t15);
        append(div12, div11);
        if (if_block)
          if_block.m(div11, null);
        append(div11, t16);
        mount_component(button, div11, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              input0,
              "input",
              /*input0_input_handler*/
              ctx[10]
            ),
            listen(
              input1,
              "input",
              /*input1_input_handler*/
              ctx[11]
            ),
            listen(
              select,
              "change",
              /*select_change_handler*/
              ctx[12]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*vaultPassword*/
        8 && input0.value !== /*vaultPassword*/
        ctx2[3]) {
          set_input_value(
            input0,
            /*vaultPassword*/
            ctx2[3]
          );
        }
        if (dirty & /*deviceName*/
        16 && input1.value !== /*deviceName*/
        ctx2[4]) {
          set_input_value(
            input1,
            /*deviceName*/
            ctx2[4]
          );
        }
        if (dirty & /*mode*/
        32) {
          select_option(
            select,
            /*mode*/
            ctx2[5]
          );
        }
        if (
          /*expanded*/
          ctx2[2] && !/*linked*/
          ctx2[1]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*expanded, linked*/
            6) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block_14(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(div11, t16);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
        const button_changes = {};
        if (dirty & /*linking*/
        64)
          button_changes.disabled = /*linking*/
          ctx2[6];
        if (dirty & /*$$scope, linking*/
        16448) {
          button_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button.$set(button_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        transition_in(button.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        transition_out(button.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div12);
        }
        if (if_block)
          if_block.d();
        destroy_component(button);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block_14(ctx) {
    let button;
    let current;
    button = new Button_default({
      props: {
        variant: "secondary",
        $$slots: { default: [create_default_slot_16] },
        $$scope: { ctx }
      }
    });
    button.$on(
      "click",
      /*toggleExpand*/
      ctx[7]
    );
    return {
      c() {
        create_component(button.$$.fragment);
      },
      m(target, anchor) {
        mount_component(button, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const button_changes = {};
        if (dirty & /*$$scope*/
        16384) {
          button_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button.$set(button_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(button.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(button.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(button, detaching);
      }
    };
  }
  function create_default_slot_16(ctx) {
    let t;
    return {
      c() {
        t = text("Cancel");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot19(ctx) {
    let t_value = (
      /*linking*/
      ctx[6] ? "Linking..." : "Link Vault"
    );
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*linking*/
        64 && t_value !== (t_value = /*linking*/
        ctx2[6] ? "Linking..." : "Link Vault"))
          set_data(t, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_fragment26(ctx) {
    let div5;
    let div4;
    let div2;
    let div0;
    let t0_value = (
      /*vault*/
      ctx[0].name + ""
    );
    let t0;
    let t1;
    let div1;
    let t2_value = (
      /*vault*/
      (ctx[0].region || "Unknown region") + ""
    );
    let t2;
    let t3;
    let div3;
    let current_block_type_index;
    let if_block0;
    let t4;
    let current;
    const if_block_creators = [create_if_block_23, create_else_block3];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*linked*/
        ctx2[1]
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx, -1);
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    let if_block1 = (
      /*expanded*/
      ctx[2] && create_if_block8(ctx)
    );
    return {
      c() {
        div5 = element("div");
        div4 = element("div");
        div2 = element("div");
        div0 = element("div");
        t0 = text(t0_value);
        t1 = space();
        div1 = element("div");
        t2 = text(t2_value);
        t3 = space();
        div3 = element("div");
        if_block0.c();
        t4 = space();
        if (if_block1)
          if_block1.c();
        attr(div0, "class", "vault-row-name svelte-1kcub1a");
        attr(div1, "class", "vault-row-region svelte-1kcub1a");
        attr(div2, "class", "vault-row-info svelte-1kcub1a");
        attr(div3, "class", "vault-row-actions svelte-1kcub1a");
        attr(div4, "class", "vault-row-main svelte-1kcub1a");
        attr(div5, "class", "vault-row svelte-1kcub1a");
        toggle_class(
          div5,
          "expanded",
          /*expanded*/
          ctx[2]
        );
      },
      m(target, anchor) {
        insert(target, div5, anchor);
        append(div5, div4);
        append(div4, div2);
        append(div2, div0);
        append(div0, t0);
        append(div2, t1);
        append(div2, div1);
        append(div1, t2);
        append(div4, t3);
        append(div4, div3);
        if_blocks[current_block_type_index].m(div3, null);
        append(div5, t4);
        if (if_block1)
          if_block1.m(div5, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        if ((!current || dirty & /*vault*/
        1) && t0_value !== (t0_value = /*vault*/
        ctx2[0].name + ""))
          set_data(t0, t0_value);
        if ((!current || dirty & /*vault*/
        1) && t2_value !== (t2_value = /*vault*/
        (ctx2[0].region || "Unknown region") + ""))
          set_data(t2, t2_value);
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          } else {
            if_block0.p(ctx2, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(div3, null);
        }
        if (
          /*expanded*/
          ctx2[2]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty & /*expanded*/
            4) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block8(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div5, null);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
        if (!current || dirty & /*expanded*/
        4) {
          toggle_class(
            div5,
            "expanded",
            /*expanded*/
            ctx2[2]
          );
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block0);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div5);
        }
        if_blocks[current_block_type_index].d();
        if (if_block1)
          if_block1.d();
      }
    };
  }
  function instance26($$self, $$props, $$invalidate) {
    let { vault } = $$props;
    let { linked = false } = $$props;
    const dispatch = createEventDispatcher();
    let expanded = false;
    let vaultPassword = "";
    let deviceName = "ignis-headless";
    let mode = "bidirectional";
    let linking = false;
    function toggleExpand() {
      $$invalidate(2, expanded = !expanded);
    }
    async function onLink() {
      $$invalidate(6, linking = true);
      dispatch("link", {
        vault,
        vaultPassword: vaultPassword || void 0,
        deviceName,
        mode
      });
    }
    function setLinking(val) {
      $$invalidate(6, linking = val);
    }
    function input0_input_handler() {
      vaultPassword = this.value;
      $$invalidate(3, vaultPassword);
    }
    function input1_input_handler() {
      deviceName = this.value;
      $$invalidate(4, deviceName);
    }
    function select_change_handler() {
      mode = select_value(this);
      $$invalidate(5, mode);
    }
    $$self.$$set = ($$props2) => {
      if ("vault" in $$props2)
        $$invalidate(0, vault = $$props2.vault);
      if ("linked" in $$props2)
        $$invalidate(1, linked = $$props2.linked);
    };
    return [
      vault,
      linked,
      expanded,
      vaultPassword,
      deviceName,
      mode,
      linking,
      toggleExpand,
      onLink,
      setLinking,
      input0_input_handler,
      input1_input_handler,
      select_change_handler
    ];
  }
  var VaultRow = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance26, create_fragment26, safe_not_equal, { vault: 0, linked: 1, setLinking: 9 }, add_css12);
    }
    get setLinking() {
      return this.$$.ctx[9];
    }
  };
  var VaultRow_default = VaultRow;

  // packages/ui/src/views/sync/VaultList.svelte
  function add_css13(target) {
    append_styles(target, "svelte-18jtktw", ".vault-list-heading.svelte-18jtktw{font-size:1rem;font-weight:600;color:var(--text-normal);margin:0 0 0.75rem}.vault-list-empty.svelte-18jtktw{color:var(--text-muted);font-size:0.875rem;margin:0;padding:1rem 0}.vault-list-items.svelte-18jtktw{display:flex;flex-direction:column;gap:0.5rem;min-height:180px;margin-bottom:1rem}.vault-list-spinner-area.svelte-18jtktw{display:flex;align-items:center;justify-content:center;flex:1;min-height:180px}.vault-list-spinner.svelte-18jtktw{width:24px;height:24px;border:2px solid var(--background-modifier-border);border-top-color:var(--text-muted);border-radius:50%;animation:svelte-18jtktw-ignis-vault-spin 0.8s linear infinite}@keyframes svelte-18jtktw-ignis-vault-spin{to{transform:rotate(360deg)}}.vault-list-footer.svelte-18jtktw{display:flex;justify-content:flex-end}");
  }
  function get_each_context4(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[5] = list[i];
    return child_ctx;
  }
  function create_else_block4(ctx) {
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let each_1_anchor;
    let current;
    let each_value = ensure_array_like(
      /*vaults*/
      ctx[0]
    );
    const get_key = (ctx2) => (
      /*vault*/
      ctx2[5].id
    );
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context4(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block4(key, child_ctx));
    }
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, each_1_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*vaults, onLink*/
        5) {
          each_value = ensure_array_like(
            /*vaults*/
            ctx2[0]
          );
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block4, each_1_anchor, get_each_context4);
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(each_1_anchor);
        }
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d(detaching);
        }
      }
    };
  }
  function create_if_block_15(ctx) {
    let p;
    return {
      c() {
        p = element("p");
        p.textContent = "No remote vaults found. Create one to get started.";
        attr(p, "class", "vault-list-empty svelte-18jtktw");
      },
      m(target, anchor) {
        insert(target, p, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(p);
        }
      }
    };
  }
  function create_if_block9(ctx) {
    let div1;
    return {
      c() {
        div1 = element("div");
        div1.innerHTML = `<div class="vault-list-spinner svelte-18jtktw"></div>`;
        attr(div1, "class", "vault-list-spinner-area svelte-18jtktw");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div1);
        }
      }
    };
  }
  function create_each_block4(key_1, ctx) {
    let first;
    let vaultrow;
    let current;
    vaultrow = new VaultRow_default({ props: { vault: (
      /*vault*/
      ctx[5]
    ) } });
    vaultrow.$on(
      "link",
      /*onLink*/
      ctx[2]
    );
    return {
      key: key_1,
      first: null,
      c() {
        first = empty();
        create_component(vaultrow.$$.fragment);
        this.first = first;
      },
      m(target, anchor) {
        insert(target, first, anchor);
        mount_component(vaultrow, target, anchor);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        const vaultrow_changes = {};
        if (dirty & /*vaults*/
        1)
          vaultrow_changes.vault = /*vault*/
          ctx[5];
        vaultrow.$set(vaultrow_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(vaultrow.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(vaultrow.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(first);
        }
        destroy_component(vaultrow, detaching);
      }
    };
  }
  function create_default_slot20(ctx) {
    let t;
    return {
      c() {
        t = text("Create new vault");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_fragment27(ctx) {
    let div2;
    let h3;
    let t1;
    let div0;
    let current_block_type_index;
    let if_block;
    let t2;
    let div1;
    let button;
    let current;
    const if_block_creators = [create_if_block9, create_if_block_15, create_else_block4];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*loading*/
        ctx2[1]
      )
        return 0;
      if (
        /*vaults*/
        ctx2[0].length === 0
      )
        return 1;
      return 2;
    }
    current_block_type_index = select_block_type(ctx, -1);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    button = new Button_default({
      props: {
        variant: "primary",
        disabled: (
          /*loading*/
          ctx[1]
        ),
        $$slots: { default: [create_default_slot20] },
        $$scope: { ctx }
      }
    });
    button.$on(
      "click",
      /*onCreate*/
      ctx[3]
    );
    return {
      c() {
        div2 = element("div");
        h3 = element("h3");
        h3.textContent = "Your remote vaults";
        t1 = space();
        div0 = element("div");
        if_block.c();
        t2 = space();
        div1 = element("div");
        create_component(button.$$.fragment);
        attr(h3, "class", "vault-list-heading svelte-18jtktw");
        attr(div0, "class", "vault-list-items svelte-18jtktw");
        attr(div1, "class", "vault-list-footer svelte-18jtktw");
        attr(div2, "class", "vault-list");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, h3);
        append(div2, t1);
        append(div2, div0);
        if_blocks[current_block_type_index].m(div0, null);
        append(div2, t2);
        append(div2, div1);
        mount_component(button, div1, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(div0, null);
        }
        const button_changes = {};
        if (dirty & /*loading*/
        2)
          button_changes.disabled = /*loading*/
          ctx2[1];
        if (dirty & /*$$scope*/
        256) {
          button_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button.$set(button_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        transition_in(button.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        transition_out(button.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div2);
        }
        if_blocks[current_block_type_index].d();
        destroy_component(button);
      }
    };
  }
  function instance27($$self, $$props, $$invalidate) {
    let { vaults = [] } = $$props;
    let { loading = false } = $$props;
    const dispatch = createEventDispatcher();
    function onLink(e) {
      dispatch("link", e.detail);
    }
    function onCreate() {
      dispatch("create");
    }
    $$self.$$set = ($$props2) => {
      if ("vaults" in $$props2)
        $$invalidate(0, vaults = $$props2.vaults);
      if ("loading" in $$props2)
        $$invalidate(1, loading = $$props2.loading);
    };
    return [vaults, loading, onLink, onCreate];
  }
  var VaultList = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance27, create_fragment27, safe_not_equal, { vaults: 0, loading: 1 }, add_css13);
    }
  };
  var VaultList_default = VaultList;

  // packages/ui/src/views/sync/CreateVaultForm.svelte
  function add_css14(target) {
    append_styles(target, "svelte-ik3dso", ".form-row.svelte-ik3dso.svelte-ik3dso{display:flex;align-items:flex-start;justify-content:space-between;padding:0.75rem 0}.form-row.svelte-ik3dso+.form-row.svelte-ik3dso{border-top:1px solid var(--background-modifier-border)}.form-label.svelte-ik3dso.svelte-ik3dso{flex:1;min-width:0;margin-right:1rem}.form-name.svelte-ik3dso.svelte-ik3dso{font-size:0.875rem;font-weight:500;color:var(--text-normal)}.form-desc.svelte-ik3dso.svelte-ik3dso{font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;line-height:1.4}.form-warning.svelte-ik3dso.svelte-ik3dso{color:var(--text-error)}input.svelte-ik3dso.svelte-ik3dso,select.svelte-ik3dso.svelte-ik3dso{font-family:var(--font-interface);font-size:0.875rem;padding:0.375rem 0.625rem;border:1px solid var(--background-modifier-border);border-radius:0.375rem;background:var(--background-primary);color:var(--text-normal);min-width:200px;margin-top:0.125rem}input.svelte-ik3dso.svelte-ik3dso:focus,select.svelte-ik3dso.svelte-ik3dso:focus{outline:none;border-color:var(--interactive-accent)}.form-error.svelte-ik3dso.svelte-ik3dso{color:var(--text-error);font-size:0.8125rem;padding:0.5rem 0}.form-footer.svelte-ik3dso.svelte-ik3dso{display:flex;justify-content:flex-end;gap:0.5rem;padding-top:0.75rem;border-top:1px solid var(--background-modifier-border)}");
  }
  function create_if_block_16(ctx) {
    let div3;
    let div2;
    let t4;
    let input;
    let mounted;
    let dispose;
    return {
      c() {
        div3 = element("div");
        div2 = element("div");
        div2.innerHTML = `<div class="form-name svelte-ik3dso">Encryption password</div> <div class="form-desc svelte-ik3dso"><span class="form-warning svelte-ik3dso">If you forget this password, any remote data will remain unusable forever.</span>
          This does not affect your local data.</div>`;
        t4 = space();
        input = element("input");
        attr(div2, "class", "form-label svelte-ik3dso");
        attr(input, "type", "password");
        attr(input, "placeholder", "Your password");
        attr(input, "class", "svelte-ik3dso");
        attr(div3, "class", "form-row svelte-ik3dso");
      },
      m(target, anchor) {
        insert(target, div3, anchor);
        append(div3, div2);
        append(div3, t4);
        append(div3, input);
        set_input_value(
          input,
          /*password*/
          ctx[3]
        );
        if (!mounted) {
          dispose = listen(
            input,
            "input",
            /*input_input_handler_1*/
            ctx[11]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*password*/
        8 && input.value !== /*password*/
        ctx2[3]) {
          set_input_value(
            input,
            /*password*/
            ctx2[3]
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div3);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block10(ctx) {
    let div;
    let t;
    return {
      c() {
        div = element("div");
        t = text(
          /*error*/
          ctx[5]
        );
        attr(div, "class", "form-error svelte-ik3dso");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*error*/
        32)
          set_data(
            t,
            /*error*/
            ctx2[5]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_default_slot_17(ctx) {
    let t;
    return {
      c() {
        t = text("Back");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_default_slot21(ctx) {
    let t_value = (
      /*creating*/
      ctx[4] ? "Creating..." : "Create"
    );
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*creating*/
        16 && t_value !== (t_value = /*creating*/
        ctx2[4] ? "Creating..." : "Create"))
          set_data(t, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_fragment28(ctx) {
    let div13;
    let div3;
    let div2;
    let t3;
    let input;
    let t4;
    let div7;
    let div6;
    let t8;
    let select0;
    let option0;
    let option1;
    let option2;
    let option3;
    let option4;
    let t14;
    let div11;
    let div10;
    let t19;
    let select1;
    let option5;
    let option6;
    let t22;
    let t23;
    let t24;
    let div12;
    let button0;
    let t25;
    let button1;
    let current;
    let mounted;
    let dispose;
    let if_block0 = (
      /*encryption*/
      ctx[2] === "e2ee" && create_if_block_16(ctx)
    );
    let if_block1 = (
      /*error*/
      ctx[5] && create_if_block10(ctx)
    );
    button0 = new Button_default({
      props: {
        variant: "secondary",
        $$slots: { default: [create_default_slot_17] },
        $$scope: { ctx }
      }
    });
    button0.$on(
      "click",
      /*onBack*/
      ctx[7]
    );
    button1 = new Button_default({
      props: {
        variant: "primary",
        disabled: (
          /*creating*/
          ctx[4]
        ),
        $$slots: { default: [create_default_slot21] },
        $$scope: { ctx }
      }
    });
    button1.$on(
      "click",
      /*onSubmit*/
      ctx[6]
    );
    return {
      c() {
        div13 = element("div");
        div3 = element("div");
        div2 = element("div");
        div2.innerHTML = `<div class="form-name svelte-ik3dso">Vault name</div> <div class="form-desc svelte-ik3dso">Helps you remember what this vault is for</div>`;
        t3 = space();
        input = element("input");
        t4 = space();
        div7 = element("div");
        div6 = element("div");
        div6.innerHTML = `<div class="form-name svelte-ik3dso">Region</div> <div class="form-desc svelte-ik3dso">Select the server region closest to you</div>`;
        t8 = space();
        select0 = element("select");
        option0 = element("option");
        option0.textContent = "Automatic";
        option1 = element("option");
        option1.textContent = "Europe";
        option2 = element("option");
        option2.textContent = "North America";
        option3 = element("option");
        option3.textContent = "Asia";
        option4 = element("option");
        option4.textContent = "Oceania";
        t14 = space();
        div11 = element("div");
        div10 = element("div");
        div10.innerHTML = `<div class="form-name svelte-ik3dso">Encryption</div> <div class="form-desc svelte-ik3dso">End-to-end encryption requires a password you must remember.
        <span class="form-warning svelte-ik3dso">This cannot be changed later.</span></div>`;
        t19 = space();
        select1 = element("select");
        option5 = element("option");
        option5.textContent = "End-to-end encryption";
        option6 = element("option");
        option6.textContent = "Standard encryption";
        t22 = space();
        if (if_block0)
          if_block0.c();
        t23 = space();
        if (if_block1)
          if_block1.c();
        t24 = space();
        div12 = element("div");
        create_component(button0.$$.fragment);
        t25 = space();
        create_component(button1.$$.fragment);
        attr(div2, "class", "form-label svelte-ik3dso");
        attr(input, "type", "text");
        attr(input, "placeholder", "My awesome vault");
        attr(input, "class", "svelte-ik3dso");
        attr(div3, "class", "form-row svelte-ik3dso");
        attr(div6, "class", "form-label svelte-ik3dso");
        option0.__value = "";
        set_input_value(option0, option0.__value);
        option1.__value = "europe";
        set_input_value(option1, option1.__value);
        option2.__value = "north-america";
        set_input_value(option2, option2.__value);
        option3.__value = "asia";
        set_input_value(option3, option3.__value);
        option4.__value = "oceania";
        set_input_value(option4, option4.__value);
        attr(select0, "class", "svelte-ik3dso");
        if (
          /*region*/
          ctx[1] === void 0
        )
          add_render_callback(() => (
            /*select0_change_handler*/
            ctx[9].call(select0)
          ));
        attr(div7, "class", "form-row svelte-ik3dso");
        attr(div10, "class", "form-label svelte-ik3dso");
        option5.__value = "e2ee";
        set_input_value(option5, option5.__value);
        option6.__value = "standard";
        set_input_value(option6, option6.__value);
        attr(select1, "class", "svelte-ik3dso");
        if (
          /*encryption*/
          ctx[2] === void 0
        )
          add_render_callback(() => (
            /*select1_change_handler*/
            ctx[10].call(select1)
          ));
        attr(div11, "class", "form-row svelte-ik3dso");
        attr(div12, "class", "form-footer svelte-ik3dso");
        attr(div13, "class", "create-form");
      },
      m(target, anchor) {
        insert(target, div13, anchor);
        append(div13, div3);
        append(div3, div2);
        append(div3, t3);
        append(div3, input);
        set_input_value(
          input,
          /*name*/
          ctx[0]
        );
        append(div13, t4);
        append(div13, div7);
        append(div7, div6);
        append(div7, t8);
        append(div7, select0);
        append(select0, option0);
        append(select0, option1);
        append(select0, option2);
        append(select0, option3);
        append(select0, option4);
        select_option(
          select0,
          /*region*/
          ctx[1],
          true
        );
        append(div13, t14);
        append(div13, div11);
        append(div11, div10);
        append(div11, t19);
        append(div11, select1);
        append(select1, option5);
        append(select1, option6);
        select_option(
          select1,
          /*encryption*/
          ctx[2],
          true
        );
        append(div13, t22);
        if (if_block0)
          if_block0.m(div13, null);
        append(div13, t23);
        if (if_block1)
          if_block1.m(div13, null);
        append(div13, t24);
        append(div13, div12);
        mount_component(button0, div12, null);
        append(div12, t25);
        mount_component(button1, div12, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen(
              input,
              "input",
              /*input_input_handler*/
              ctx[8]
            ),
            listen(
              select0,
              "change",
              /*select0_change_handler*/
              ctx[9]
            ),
            listen(
              select1,
              "change",
              /*select1_change_handler*/
              ctx[10]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & /*name*/
        1 && input.value !== /*name*/
        ctx2[0]) {
          set_input_value(
            input,
            /*name*/
            ctx2[0]
          );
        }
        if (dirty & /*region*/
        2) {
          select_option(
            select0,
            /*region*/
            ctx2[1]
          );
        }
        if (dirty & /*encryption*/
        4) {
          select_option(
            select1,
            /*encryption*/
            ctx2[2]
          );
        }
        if (
          /*encryption*/
          ctx2[2] === "e2ee"
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_16(ctx2);
            if_block0.c();
            if_block0.m(div13, t23);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*error*/
          ctx2[5]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block10(ctx2);
            if_block1.c();
            if_block1.m(div13, t24);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        const button0_changes = {};
        if (dirty & /*$$scope*/
        8192) {
          button0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button0.$set(button0_changes);
        const button1_changes = {};
        if (dirty & /*creating*/
        16)
          button1_changes.disabled = /*creating*/
          ctx2[4];
        if (dirty & /*$$scope, creating*/
        8208) {
          button1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        button1.$set(button1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(button0.$$.fragment, local);
        transition_in(button1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(button0.$$.fragment, local);
        transition_out(button1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div13);
        }
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        destroy_component(button0);
        destroy_component(button1);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance28($$self, $$props, $$invalidate) {
    const dispatch = createEventDispatcher();
    let name = "";
    let region = "";
    let encryption = "e2ee";
    let password = "";
    let creating = false;
    let error = "";
    async function onSubmit() {
      $$invalidate(5, error = "");
      if (!name.trim()) {
        $$invalidate(5, error = "Vault name is required");
        return;
      }
      if (encryption === "e2ee" && !password) {
        $$invalidate(5, error = "Encryption password is required for end-to-end encryption");
        return;
      }
      $$invalidate(4, creating = true);
      try {
        const res = await fetch("/api/ext/headless-sync/create-remote-vault", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            encryption,
            password: password || void 0,
            region: region || void 0
          })
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Request failed: ${res.status}`);
        }
        dispatch("created");
      } catch (e) {
        $$invalidate(5, error = e.message);
        $$invalidate(4, creating = false);
      }
    }
    function onBack() {
      dispatch("back");
    }
    function input_input_handler() {
      name = this.value;
      $$invalidate(0, name);
    }
    function select0_change_handler() {
      region = select_value(this);
      $$invalidate(1, region);
    }
    function select1_change_handler() {
      encryption = select_value(this);
      $$invalidate(2, encryption);
    }
    function input_input_handler_1() {
      password = this.value;
      $$invalidate(3, password);
    }
    return [
      name,
      region,
      encryption,
      password,
      creating,
      error,
      onSubmit,
      onBack,
      input_input_handler,
      select0_change_handler,
      select1_change_handler,
      input_input_handler_1
    ];
  }
  var CreateVaultForm = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance28, create_fragment28, safe_not_equal, {}, add_css14);
    }
  };
  var CreateVaultForm_default = CreateVaultForm;

  // packages/ui/src/views/SyncSetupModal.svelte
  function add_css15(target) {
    append_styles(target, "svelte-bv1sbq", ".sync-setup-body.svelte-bv1sbq.svelte-bv1sbq{padding:1.25rem 1.5rem;overflow-y:auto}.sync-setup-desc.svelte-bv1sbq.svelte-bv1sbq{color:var(--text-muted);font-size:0.875rem;margin:0 0 1rem;line-height:1.4}.sync-setup-error.svelte-bv1sbq.svelte-bv1sbq{color:var(--text-error);font-size:0.875rem}.sync-setup-error.svelte-bv1sbq p.svelte-bv1sbq{margin:0 0 0.5rem}.retry-btn.svelte-bv1sbq.svelte-bv1sbq{font-family:var(--font-interface);font-size:0.8125rem;padding:0.25rem 0.75rem;border:1px solid var(--background-modifier-border);border-radius:0.375rem;background:none;color:var(--text-muted);cursor:pointer}.retry-btn.svelte-bv1sbq.svelte-bv1sbq:hover{color:var(--text-normal);background:var(--background-modifier-hover)}");
  }
  function create_else_block_1(ctx) {
    let p;
    let t1;
    let createvaultform;
    let current;
    createvaultform = new CreateVaultForm_default({});
    createvaultform.$on(
      "created",
      /*onCreated*/
      ctx[7]
    );
    createvaultform.$on(
      "back",
      /*back_handler*/
      ctx[12]
    );
    return {
      c() {
        p = element("p");
        p.textContent = "Create a new remote vault on Obsidian Sync.";
        t1 = space();
        create_component(createvaultform.$$.fragment);
        attr(p, "class", "sync-setup-desc svelte-bv1sbq");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        insert(target, t1, anchor);
        mount_component(createvaultform, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(createvaultform.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(createvaultform.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(p);
          detach(t1);
        }
        destroy_component(createvaultform, detaching);
      }
    };
  }
  function create_if_block11(ctx) {
    let p;
    let t1;
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block_17, create_else_block5];
    const if_blocks = [];
    function select_block_type_1(ctx2, dirty) {
      if (
        /*error*/
        ctx2[4]
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type_1(ctx, -1);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        p = element("p");
        p.textContent = "Link this vault to an Obsidian Sync remote vault for server-side synchronization.";
        t1 = space();
        if_block.c();
        if_block_anchor = empty();
        attr(p, "class", "sync-setup-desc svelte-bv1sbq");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        insert(target, t1, anchor);
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type_1(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(p);
          detach(t1);
          detach(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function create_else_block5(ctx) {
    let vaultlist;
    let current;
    vaultlist = new VaultList_default({
      props: {
        vaults: (
          /*vaults*/
          ctx[2]
        ),
        loading: (
          /*loading*/
          ctx[3]
        )
      }
    });
    vaultlist.$on(
      "link",
      /*onLink*/
      ctx[6]
    );
    vaultlist.$on(
      "create",
      /*create_handler*/
      ctx[11]
    );
    return {
      c() {
        create_component(vaultlist.$$.fragment);
      },
      m(target, anchor) {
        mount_component(vaultlist, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const vaultlist_changes = {};
        if (dirty & /*vaults*/
        4)
          vaultlist_changes.vaults = /*vaults*/
          ctx2[2];
        if (dirty & /*loading*/
        8)
          vaultlist_changes.loading = /*loading*/
          ctx2[3];
        vaultlist.$set(vaultlist_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(vaultlist.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(vaultlist.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(vaultlist, detaching);
      }
    };
  }
  function create_if_block_17(ctx) {
    let div;
    let p;
    let t0;
    let t1;
    let t2;
    let button;
    let mounted;
    let dispose;
    return {
      c() {
        div = element("div");
        p = element("p");
        t0 = text("Failed to load remote vaults: ");
        t1 = text(
          /*error*/
          ctx[4]
        );
        t2 = space();
        button = element("button");
        button.textContent = "Retry";
        attr(p, "class", "svelte-bv1sbq");
        attr(button, "class", "retry-btn svelte-bv1sbq");
        attr(div, "class", "sync-setup-error svelte-bv1sbq");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, p);
        append(p, t0);
        append(p, t1);
        append(div, t2);
        append(div, button);
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*fetchVaults*/
            ctx[5]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*error*/
        16)
          set_data(
            t1,
            /*error*/
            ctx2[4]
          );
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_default_slot22(ctx) {
    let div;
    let current_block_type_index;
    let if_block;
    let current;
    const if_block_creators = [create_if_block11, create_else_block_1];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*view*/
        ctx2[1] === "list"
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx, -1);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        div = element("div");
        if_block.c();
        attr(div, "class", "sync-setup-body svelte-bv1sbq");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if_blocks[current_block_type_index].m(div, null);
        current = true;
      },
      p(ctx2, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(div, null);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if_blocks[current_block_type_index].d();
      }
    };
  }
  function create_fragment29(ctx) {
    let modal;
    let current;
    let modal_props = {
      title: (
        /*view*/
        ctx[1] === "list" ? "Set up Headless Sync" : "Create new remote vault"
      ),
      width: "550px",
      $$slots: { default: [create_default_slot22] },
      $$scope: { ctx }
    };
    modal = new Modal_default({ props: modal_props });
    ctx[13](modal);
    modal.$on(
      "close",
      /*onClose*/
      ctx[8]
    );
    modal.$on(
      "escape",
      /*onClose*/
      ctx[8]
    );
    return {
      c() {
        create_component(modal.$$.fragment);
      },
      m(target, anchor) {
        mount_component(modal, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const modal_changes = {};
        if (dirty & /*view*/
        2)
          modal_changes.title = /*view*/
          ctx2[1] === "list" ? "Set up Headless Sync" : "Create new remote vault";
        if (dirty & /*$$scope, error, vaults, loading, view*/
        32798) {
          modal_changes.$$scope = { dirty, ctx: ctx2 };
        }
        modal.$set(modal_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(modal.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(modal.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        ctx[13](null);
        destroy_component(modal, detaching);
      }
    };
  }
  function instance29($$self, $$props, $$invalidate) {
    let { vaultId } = $$props;
    let { onSuccess = null } = $$props;
    const dispatch = createEventDispatcher();
    let modalRef;
    let view = "list";
    let vaults = [];
    let loading = true;
    let error = "";
    onMount(() => {
      fetchVaults();
    });
    async function fetchVaults() {
      $$invalidate(3, loading = true);
      $$invalidate(4, error = "");
      try {
        const res = await fetch("/api/ext/headless-sync/remote-vaults");
        if (!res.ok) {
          const data2 = await res.json().catch(() => ({}));
          throw new Error(data2.error || `Request failed: ${res.status}`);
        }
        const data = await res.json();
        $$invalidate(2, vaults = data.vaults);
      } catch (e) {
        $$invalidate(4, error = e.message);
      }
      $$invalidate(3, loading = false);
    }
    async function onLink(e) {
      const { vault, vaultPassword, deviceName, mode } = e.detail;
      $$invalidate(4, error = "");
      try {
        const res = await fetch("/api/ext/headless-sync/setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vaultId,
            remoteVault: vault.id,
            remoteVaultName: vault.name,
            vaultPassword,
            deviceName,
            mode
          })
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Request failed: ${res.status}`);
        }
        if (onSuccess) {
          onSuccess();
        }
        modalRef.dismiss();
      } catch (e2) {
        $$invalidate(4, error = e2.message);
      }
    }
    function onCreated() {
      $$invalidate(1, view = "list");
      fetchVaults();
    }
    function onClose() {
      dispatch("close");
    }
    const create_handler = () => $$invalidate(1, view = "create");
    const back_handler = () => $$invalidate(1, view = "list");
    function modal_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        modalRef = $$value;
        $$invalidate(0, modalRef);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("vaultId" in $$props2)
        $$invalidate(9, vaultId = $$props2.vaultId);
      if ("onSuccess" in $$props2)
        $$invalidate(10, onSuccess = $$props2.onSuccess);
    };
    return [
      modalRef,
      view,
      vaults,
      loading,
      error,
      fetchVaults,
      onLink,
      onCreated,
      onClose,
      vaultId,
      onSuccess,
      create_handler,
      back_handler,
      modal_binding
    ];
  }
  var SyncSetupModal = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance29, create_fragment29, safe_not_equal, { vaultId: 9, onSuccess: 10 }, add_css15);
    }
  };
  var SyncSetupModal_default = SyncSetupModal;
  return __toCommonJS(src_exports);
})();
/*! Bundled license information:

lucide-svelte/dist/defaultAttributes.js:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   * 
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   * 
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   * 
   * ---
   * 
   * The MIT License (MIT) (for portions derived from Feather)
   * 
   * Copyright (c) 2013-2026 Cole Bemis
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   * 
   *)

lucide-svelte/dist/utils/hasA11yProp.js:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   * 
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   * 
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   * 
   * ---
   * 
   * The MIT License (MIT) (for portions derived from Feather)
   * 
   * Copyright (c) 2013-2026 Cole Bemis
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   * 
   *)

lucide-svelte/dist/utils/mergeClasses.js:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   * 
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   * 
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   * 
   * ---
   * 
   * The MIT License (MIT) (for portions derived from Feather)
   * 
   * Copyright (c) 2013-2026 Cole Bemis
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   * 
   *)

lucide-svelte/dist/icons/check.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/circle-alert.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/ellipsis-vertical.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/folder.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/pen-line.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/pencil.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/plus.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/search.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/square-plus.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/trash-2.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/triangle-alert.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/vault.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/x.svelte:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2026 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *)

lucide-svelte/dist/icons/index.js:
  (**
   * @license lucide-svelte v0.577.0 - ISC
   *
   * ISC License
   * 
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
   * 
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   * 
   * ---
   * 
   * The MIT License (MIT) (for portions derived from Feather)
   * 
   * Copyright (c) 2013-2026 Cole Bemis
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   * 
   *)
*/
