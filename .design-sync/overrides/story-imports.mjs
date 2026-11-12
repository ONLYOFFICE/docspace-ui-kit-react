// How story modules resolve at preview-compile time. Small on purpose and
// FORKABLE: copy to .design-sync/overrides/story-imports.mjs (declare in
// cfg.libOverrides) when a repo's layout needs different rules - this seam
// owns ALL resolution policy, so a fork never touches generation or build
// orchestration. Lighter tweaks need no fork: cfg.storyImports.shim /
// cfg.storyImports.bundle are substring patterns matched against resolved
// paths (any import style - relative, tsconfig alias, bare workspace name)
// that force a module to the bundle global / to source bundling, and
// cfg.storyImports.loaders merges over STORY_LOADERS.
//
// Rules:
// 1. Package + extraEntries imports -> `window.<GLOBAL>` (the shipped bundle).
//    Subpaths whose last segment is an exported component (`<pkg>/Button`)
//    shim with that export as the default; every other subpath
//    (`<pkg>/locales/en.json`, `<pkg>/utils`) bundles normally - a wrong
//    shim is silent, a missing module is loud (and the fix is named:
//    cfg.extraEntries merges a subpath's exports onto the global).
// 2. ANY import that RESOLVES to an EXPORTED component's module ->
//    `window.<GLOBAL>` too, however it was spelled (relative `../Button` -
//    the dominant story convention - tsconfig alias, or monorepo path). This
//    keeps previews rendering the SHIPPED bundle instead of a duplicate
//    source copy - which breaks React context identity (consumers throw
//    their missing-provider errors) and drops co-located styles. Story files
//    themselves and anything under node_modules are never redirected.
//    Default imports get the matched export as `default` (default-importing
//    the component is a common story convention; a bare namespace shim
//    renders "Element type is invalid" in every such cell).
// 3. Every other import (fixtures, helpers, internal contexts) bundles from
//    source; component imports INSIDE those modules recurse through rule 2.
//    The honest residue: a story needing a component-PRIVATE context that
//    must share identity with the global component renders a cell error and
//    falls to grading/hand-fix - no shim can fix that, by construction.
// 4. @storybook/* runtime -> functional stubs. manager/preview/client-api get
//    real no-op hooks (useGlobals/useArgs/addons - module-scope
//    `addons.register()` or a decorator calling `useGlobals()` on an empty
//    stub takes the whole module down); everything else gets an inert
//    callable proxy so the canonical CSF idiom - `args: { onClick: fn() }`,
//    `action('click')` at module scope - evaluates instead of throwing.
// 5. Styles/assets -> LOADERS below (styles ship via _ds_bundle.css/styles.css;
//    images inline as data URLs so fixtures keep working offline). Exception:
//    `.module.css` falls through to esbuild's local-css default - class names
//    resolve and the compiled stylesheet lands at _preview/<Name>.css, which
//    the emitted html links when present.

import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { relative, resolve } from "node:path";

// FORK (apps-ui-kit): Storybook runs vite-plugin-svgr over every `*.svg`
// import (exportType "default", ref, titleProp, no svgo - .storybook/main.ts),
// so story files use `import Icon from "./x.react.svg"` as a React component.
// The stock loader map turns those into data URLs, which React then tries to
// mount as a tag name. This plugin compiles them with the same svgr the
// library build uses; `?url` imports stay data URLs.
// @svgr/core is not a direct dependency - reach it through @svgr/rollup,
// which is.
function svgrPlugin(rootDir) {
  let svgr = null;
  const load = () => {
    if (svgr) return svgr;
    // realpath: pnpm symlinks node_modules/@svgr/rollup into .pnpm/, and
    // @svgr/core is only reachable from the real location.
    const req = createRequire(
      realpathSync(resolve(rootDir, "node_modules/@svgr/rollup/package.json")),
    );
    svgr = { core: req("@svgr/core"), jsx: req("@svgr/plugin-jsx") };
    return svgr;
  };
  return {
    name: "ds-svgr",
    setup(b) {
      b.onLoad({ filter: /\.svg$/ }, async (a) => {
        if (a.namespace && a.namespace !== "file") return null;
        const raw = readFileSync(a.path);
        if (a.suffix && /url|raw/.test(a.suffix)) {
          return /raw/.test(a.suffix)
            ? { contents: raw, loader: "text" }
            : { contents: raw, loader: "dataurl" };
        }
        const { core, jsx } = load();
        const transform = core.transform ?? core.default?.transform;
        const code = await transform(
          raw.toString("utf8"),
          {
            exportType: "default",
            ref: true,
            svgo: false,
            titleProp: true,
            plugins: [jsx.default ?? jsx],
          },
          { filePath: a.path, caller: { name: "ds-svgr" } },
        );
        return {
          contents: code,
          loader: "jsx",
          resolveDir: resolve(a.path, ".."),
        };
      });
    },
  };
}

// Storybook's preview-api also re-exports React-compatible hooks for use in
// render functions - those delegate to the page's React (an inert stub there
// is a guaranteed render crash: destructuring a non-iterable).
const MANAGER_API_STUB =
  "const noopChannel={on(){},off(){},once(){},emit(){},removeListener(){}};" +
  "const addons={register(){},add(){},getChannel(){return noopChannel},setConfig(){},getConfig(){return{}}};" +
  "const R=function(){return window.React||{}};" +
  "module.exports={addons,types:{},useGlobals(){return[{},function(){}]},useArgs(){return[{},function(){},function(){}]},useParameter(){},useStorybookApi(){return{}}," +
  "useState(){return R().useState.apply(null,arguments)},useCallback(){return R().useCallback.apply(null,arguments)},useRef(){return R().useRef.apply(null,arguments)}," +
  "useMemo(){return R().useMemo.apply(null,arguments)},useEffect(){return R().useEffect.apply(null,arguments)},useReducer(){return R().useReducer.apply(null,arguments)}," +
  "useChannel(){return function(){}}};";

// Inert callable proxy: every member access yields another inert callable, so
// `fn()`, `action("x")`, `expect.anything()`, `userEvent.click(...)` all
// evaluate to harmless values at module scope. Named imports are copied by
// esbuild's CJS interop from own enumerable props, so the common API surface
// is materialized explicitly (Object.assign keeps them as own props of the
// callable default - do not change the proxy target's own-property shape);
// everything else resolves through the get trap. The DEFAULT export is a
// children-passthrough component: stories render addon defaults as JSX
// (@storybook/addon-links `<LinkTo>...</LinkTo>`), and an object default
// throws "Element type is invalid" the instant React mounts it. Both traps
// hand back the REAL `prototype` - React's shouldConstruct() probes
// `.prototype.isReactComponent`, and a truthy proxy answer classifies the
// stub as a CLASS component, silently swallowing the children.
const INERT_STUB =
  "var inert=new Proxy(function(){},{" +
  'get:function(t,k){if(k==="then")return void 0;if(k==="prototype")return t.prototype;if(k==="valueOf"||k==="toString"||k===Symbol.toPrimitive)return function(){return""};return inert},' +
  "apply:function(){return inert},construct:function(){return{}}});" +
  'var m={};"fn action actions expect userEvent within waitFor screen fireEvent spyOn mocked jest vi configureActions decorateAction setupWorker http HttpResponse graphql rest".split(" ").forEach(function(k){m[k]=inert});' +
  // FORK (apps-ui-kit): fn(impl) calls through to impl, so a story arg like
  // `fetchMoreFiles: fn(async () => {})` still returns its promise.
  'm.fn=function(impl){var f=function(){return typeof impl==="function"?impl.apply(this,arguments):void 0};return new Proxy(f,{get:function(t,k){if(k==="then")return void 0;if(k==="prototype")return t.prototype;return k in t?t[k]:inert}})};' +
  "var def=function(p){return p&&p.children!==void 0?p.children:null};Object.assign(def,m);" +
  'module.exports=new Proxy(def,{get:function(t,k){if(k==="then")return void 0;if(k==="prototype")return t.prototype;return k in m?m[k]:k==="__esModule"?void 0:inert}});';

export const STORY_FILE_RE = /\.stor(?:y|ies)\.[cm]?[jt]sx?$/;

export const STORY_LOADERS = {
  // jsx is a strict syntax superset of js - JSX-in-.js story files are a
  // common convention and plain .js parses identically.
  ".js": "jsx",
  ".css": "empty",
  ".scss": "empty",
  ".sass": "empty",
  ".less": "empty",
  ".styl": "empty",
  ".png": "dataurl",
  ".jpg": "dataurl",
  ".jpeg": "dataurl",
  ".gif": "dataurl",
  ".webp": "dataurl",
  ".avif": "dataurl",
  ".svg": "dataurl",
  ".ico": "dataurl",
  ".woff": "dataurl",
  ".woff2": "dataurl",
  ".ttf": "dataurl",
  ".eot": "empty",
  ".md": "text",
  ".mdx": "empty",
  ".mp4": "empty",
  ".webm": "empty",
  ".mov": "empty",
};

// Which exported component (if any) does a resolved file path look like the
// source module of? Matches `<...>/Button/Button.tsx`, `<...>/Button/index.ts`,
// and bare `<...>/Button.tsx`; returns the export name or null. A helper
// coincidentally named like an export (`utils/Text.ts`) would false-positive -
// that's what cfg.storyImports.bundle is for; over-shimming surfaces
// immediately as undefined-component cell errors, never as silent wrong
// renders.
function exportedComponentFor(p, exported) {
  const segs = p.replace(/\\/g, "/").split("/");
  const file = (segs[segs.length - 1] ?? "").replace(/\.[cm]?[jt]sx?$/, "");
  const dir = segs[segs.length - 2] ?? "";
  if (exported.has(file)) return file;
  if ((file === "index" || file === dir) && exported.has(dir)) return dir;
  // FORK (apps-ui-kit): component folders are kebab-case (`drop-down/`,
  // `main-button-mobile/`), so `import { DropDown } from "."` resolves to
  // `drop-down/index.tsx`. Match the folder to an export ignoring case and
  // dashes, so the story renders the shipped component rather than a second
  // source copy. Only for a folder's index, under components/.
  if (segs.includes("components")) {
    // A folder's index, or a component file whose name differs from the
    // export only in case (`./Snackbar` -> SnackBar).
    const key = (file === "index" ? dir : file).replace(/-/g, "").toLowerCase();
    for (const name of exported) {
      if (name.toLowerCase() === key) return name;
    }
    // The barrel renames some folders: `export { default as FilterInput }
    // from "./filter"` in components/index.ts.
    if (file === "index") {
      const alias = componentAliases(segs)[dir];
      if (alias && exported.has(alias)) return alias;
    }
  }
  return null;
}

// FORK (apps-ui-kit): `export { default as X } from "./<dir>"` in
// components/index.ts, read once per root.
const aliasCache = new Map();
function componentAliases(segs) {
  const root = segs.slice(0, segs.lastIndexOf("components") + 1).join("/");
  if (!aliasCache.has(root)) {
    const map = {};
    const f = `${root}/index.ts`;
    if (existsSync(f)) {
      for (const m of readFileSync(f, "utf8").matchAll(
        /export\s*\{\s*default\s+as\s+(\w+)\s*\}\s*from\s*["']\.\/([^"'/]+)["']/g,
      )) {
        map[m[2]] = m[1];
      }
    }
    aliasCache.set(root, map);
  }
  return aliasCache.get(root);
}

// FORK (apps-ui-kit): is `p` a module the repo-root barrel re-exports in
// full? True for `<dir>/index.*` of utils/hooks/context/enums/constants/
// providers, and for `<dir>/<sub>/index.*` only when `<dir>/index.ts` itself
// has `export * from "./<sub>"` (utils/interop-default, providers/api and
// friends are deliberately left out of the barrel).
const BARREL_DIRS =
  /^(utils|hooks|context|enums|constants|providers)\/(?:([^/]+)\/)?index\.[cm]?[jt]sx?$/;
const barrelSubdirs = new Map();
function inRootBarrel(root, p) {
  const m = BARREL_DIRS.exec(relative(root, p).replace(/\\/g, "/"));
  if (!m) return false;
  const [, dir, sub] = m;
  if (!sub) return true;
  if (!barrelSubdirs.has(root + dir)) {
    const subs = new Set();
    for (const ext of [".ts", ".tsx"]) {
      const f = resolve(root, dir, "index" + ext);
      if (!existsSync(f)) continue;
      const src = readFileSync(f, "utf8");
      for (const x of src.matchAll(
        /export\s+\*\s+from\s+["']\.\/([^"'/]+)\/?["']/g,
      )) {
        subs.add(x[1]);
      }
    }
    barrelSubdirs.set(root + dir, subs);
  }
  return barrelSubdirs.get(root + dir).has(sub);
}

// The @storybook/* stub plugin alone - also used by the decorator bundler.
export function storybookStubPlugin() {
  return {
    name: "sb-stub",
    setup(b) {
      b.onResolve(
        { filter: /^(@storybook\/|storybook(\/|$)|msw(\/|$)|@mswjs\/)/ },
        (a) => ({ path: a.path, namespace: "sb-stub" }),
      );
      b.onLoad({ filter: /.*/, namespace: "sb-stub" }, (a) => ({
        contents: /(^|\/)(manager|preview|client)-api$/.test(a.path)
          ? MANAGER_API_STUB
          : INERT_STUB,
        loader: "js",
      }));
      // FORK (apps-ui-kit): the dark-mode addon. useDarkMode() is false, so
      // stories render the light theme, as the reference Storybook does.
      b.onResolve({ filter: /^@vueless\/storybook-dark-mode$/ }, (a) => ({
        path: a.path,
        namespace: "sb-darkmode-stub",
      }));
      b.onLoad({ filter: /.*/, namespace: "sb-darkmode-stub" }, () => ({
        contents:
          "export function useDarkMode(){return false}export const DARK_MODE_EVENT_NAME='DARK_MODE';export const UPDATE_DARK_MODE_EVENT_NAME='UPDATE_DARK_MODE';",
        loader: "js",
      }));
    },
  };
}

// FORK (apps-ui-kit): Vite's eager `import.meta.glob(pattern, { query,
// import: "default", eager: true })` in a story file, expanded at compile
// time into static imports. Only the single-directory `dir/*.ext` patterns
// the stories use; anything else is left alone and fails loudly at runtime.
// FORK (apps-ui-kit): a story's own stylesheet - `*.stories.module.scss`
// (CSS module: `styles.scene`, private `--<x>-story-*` tokens) or a plain
// `*.stories.scss`. The stock loader map compiles every .scss to an empty
// module, so story scenes lost their page background, cards and dividers
// (Aside, Navigation, Row, ...). Compiled with the repo's own sass; esbuild
// then emits the CSS to _preview/<Name>.css, which the card links. Component
// stylesheets are untouched: they ship in _ds_bundle.css.
function storyScssPlugin(rootDir) {
  let sass = null;
  return {
    name: "ds-story-scss",
    setup(b) {
      // A story importing a COMPONENT's own `*.module.scss` for a class name
      // (Card's `styles.connectedStatus`): the rule already ships in
      // _ds_bundle.css under its hashed name, but rollup drops unused keys
      // from the JS map, so read every class out of the shipped CSS
      // (`dsui-<Name>-module__<local>--<hash5>`) and export that map.
      b.onLoad({ filter: /\.module\.scss$/i }, (a) => {
        if (a.namespace && a.namespace !== "file") return null;
        if (/\.stories\.module\.scss$/i.test(a.path)) return null;
        const rel = relative(rootDir, a.path).replace(/\\/g, "/");
        const css = resolve(rootDir, "dist/esm", rel, "index.css");
        if (rel.startsWith("..")) return null;
        if (!existsSync(css)) {
          // No shipped CSS: a module only a story uses (Portal.module.scss,
          // which Portal.tsx never imports) or a Storybook helper's
          // (.storybook/utils/RenameField.module.scss). Compile it here.
          if (!sass) {
            const req = createRequire(
              realpathSync(resolve(rootDir, "package.json")),
            );
            sass = req("sass");
          }
          return {
            contents: sass.compile(a.path, {
              loadPaths: [rootDir, resolve(rootDir, "node_modules")],
              silenceDeprecations: ["import"],
            }).css,
            loader: "local-css",
            resolveDir: resolve(a.path, ".."),
          };
        }
        const map = {};
        for (const m of readFileSync(css, "utf8").matchAll(
          /\.(dsui-[A-Za-z0-9_-]+?-module__([A-Za-z0-9_-]+?)--[A-Za-z0-9_-]{5})(?![A-Za-z0-9_-])/g,
        )) {
          map[m[2]] ??= m[1];
        }
        return {
          contents: `export default ${JSON.stringify(map)};`,
          loader: "js",
        };
      });
      b.onLoad({ filter: /\.stories(\.module)?\.scss$/i }, (a) => {
        if (a.namespace && a.namespace !== "file") return null;
        if (!sass) {
          const req = createRequire(
            realpathSync(resolve(rootDir, "package.json")),
          );
          sass = req("sass");
        }
        const { css } = sass.compile(a.path, {
          loadPaths: [rootDir, resolve(rootDir, "node_modules")],
          silenceDeprecations: ["import"],
        });
        return {
          contents: css,
          loader: /\.module\.scss$/i.test(a.path) ? "local-css" : "css",
          resolveDir: resolve(a.path, ".."),
        };
      });
    },
  };
}

function viteGlobPlugin() {
  const GLOB =
    /import\.meta\.glob(?:<[^>]*>)?\(\s*["']([^"']+)["']\s*(?:,\s*(\{[^}]*\}))?\s*,?\s*\)/g;
  return {
    name: "ds-vite-glob",
    setup(b) {
      b.onLoad({ filter: STORY_FILE_RE }, (a) => {
        const src = readFileSync(a.path, "utf8");
        if (!src.includes("import.meta.glob")) return null;
        const dir = resolve(a.path, "..");
        const head = [];
        let n = 0;
        const out = src.replace(GLOB, (call, pattern, opts = "") => {
          const m = /^(.*)\/\*(\.[A-Za-z0-9]+)$/.exec(pattern);
          if (!m || !/eager\s*:\s*true/.test(opts)) return call;
          const query = /query\s*:\s*["']([^"']+)["']/.exec(opts)?.[1] ?? "";
          const base = resolve(dir, m[1]);
          const files = existsSync(base)
            ? readdirSync(base)
                .filter((f) => f.endsWith(m[2]))
                .sort()
            : [];
          const entries = files.map((f) => {
            const id = `__dsGlob${n++}`;
            head.push(
              `import ${id} from ${JSON.stringify(`${m[1]}/${f}${query}`)};`,
            );
            return `${JSON.stringify(`${m[1]}/${f}`)}: ${id}`;
          });
          return `({${entries.join(", ")}})`;
        });
        return {
          contents: head.join("\n") + "\n" + out,
          loader: a.path.endsWith("x") ? "tsx" : "ts",
          resolveDir: dir,
        };
      });
    },
  };
}

// Build the esbuild plugin set for compiling preview .tsx files (generated
// story-module wrappers AND hand-authored previews - same rules for both).
// IMPORTANT for callers: any tsconfig-paths plugin must be registered AFTER
// these (buildPreviews does this) - the policy plugin resolves aliases via
// b.resolve, so a paths plugin registered first would bypass rule 2.
export function storyImportPlugins({
  PKG,
  GLOBAL,
  extraEntries = [],
  exported,
  cfg,
  pkgDir,
}) {
  // Path-form entries (./, ../, absolute) are repo files bundled by path -
  // they must never enter import-SPECIFIER matching below, where a story's
  // relative import could coincidentally equal the config string and get
  // wrongly shimmed to the global. Bare package specifiers only.
  extraEntries = extraEntries.filter(
    (e) => !/^(\.\.?\/|\/|[A-Za-z]:[\\/])/.test(e),
  );
  const escRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pkgRx = new RegExp(
    `^(?:${[PKG, ...extraEntries].map(escRx).join("|")})(?:/.*)?$`,
  );
  const force = cfg?.storyImports ?? {};
  const matches = (p, pats) =>
    Array.isArray(pats) &&
    pats.some((s) => typeof s === "string" && p.includes(s));
  // ESM facade shim, NOT CJS: in a `"type":"module"` repo esbuild applies
  // node's ESM-CJS interop to the importing file - `default` becomes the
  // whole exports object and `__esModule` is ignored - which breaks every
  // `import Button from '<pkg>/Button'` (the style most docs examples use).
  // An ESM module binds `default` explicitly under BOTH interop modes; the
  // star re-export of the raw CJS global keeps dynamic named access working
  // (hooks, constants - anything on the global beyond the component list).
  const shimFor = (name) =>
    `export * from "__ds_raw__";var g=window.${GLOBAL};export default ${
      name
        ? `g[${JSON.stringify(name)}]!==void 0?g[${JSON.stringify(name)}]:g`
        : `"default" in g?g.default:g`
    };`;
  const shimResult = (name) => ({
    path: name ? `ds:${name}` : "ds",
    namespace: "ds-shim",
  });

  const dsShim = {
    name: "ds-global",
    setup(b) {
      // FORK (apps-ui-kit): a story's own `react-i18next` import must be the
      // bundle's copy - a second copy has its own I18nextContext, so
      // useTranslation() under the bundle's TranslationProvider sees no
      // instance and renders raw keys. .design-sync/preview-context.mjs
      // re-exports it as __dsReactI18next.
      b.onResolve({ filter: /^react-i18next$/ }, (a) =>
        a.importer && !/[\\/]node_modules[\\/]/.test(a.importer)
          ? { path: "react-i18next", namespace: "ds-react-i18next" }
          : null,
      );
      b.onLoad({ filter: /.*/, namespace: "ds-react-i18next" }, () => ({
        contents: `module.exports=window.${GLOBAL}.__dsReactI18next;`,
        loader: "js",
      }));
      const entryNames = new Set([PKG, ...extraEntries]);
      b.onResolve({ filter: pkgRx }, (a) => {
        if (matches(a.path, force.bundle)) return null; // explicit bundle wins
        if (!entryNames.has(a.path)) {
          // Subpath import: a named component shims default-aware; anything
          // else bundles normally - a wrong root-namespace shim is silent
          // (undefined members), a missing module is loud, and the loud
          // path's fix is named (cfg.extraEntries / node_modules symlink in
          // the package's own source repo).
          const name = (a.path.split("/").pop() ?? "").replace(
            /\.[cm]?[jt]sx?$/,
            "",
          );
          return exported.has(name) ? shimResult(name) : null;
        }
        return shimResult(null);
      });
      b.onLoad({ filter: /.*/, namespace: "ds-shim" }, (a) => ({
        contents: shimFor(a.path.startsWith("ds:") ? a.path.slice(3) : null),
        loader: "js",
      }));
      // Location-independent story imports emitted by the preview generator:
      // `@ds-stories/<repo-root-relative path>` resolves against cwd, so the
      // same wrapper compiles from the generated cache or from
      // .design-sync/previews/ after a promote. Extensionless - esbuild
      // appends its resolve extensions.
      b.onResolve({ filter: /^@ds-stories\// }, (a) => {
        const base = resolve(
          process.cwd(),
          a.path.slice("@ds-stories/".length),
        );
        for (const ext of [
          "",
          ".tsx",
          ".ts",
          ".jsx",
          ".js",
          ".mjs",
          ".cjs",
          ".mdx",
        ]) {
          if (existsSync(base + ext)) return { path: base + ext };
        }
        return {
          errors: [
            {
              text: `@ds-stories path not found: ${a.path} (resolved against ${process.cwd()})`,
            },
          ],
        };
      });
      // The raw CJS module the ESM facade star-re-exports - dynamic names
      // (everything on the global) without a static export list.
      b.onResolve({ filter: /^__ds_raw__$/ }, () => ({
        path: "__ds_raw__",
        namespace: "ds-raw",
      }));
      b.onLoad({ filter: /.*/, namespace: "ds-raw" }, () => ({
        contents: `module.exports=window.${GLOBAL};`,
        loader: "js",
      }));
    },
  };

  // Rule 2: resolve every remaining import and shim the ones that land on an
  // exported component's module - regardless of how the import was spelled.
  // Returning the b.resolve result (instead of null) keeps resolution single-pass.
  // The package's own source BARREL (src/index.* under the build cwd OR under
  // the package dir - monorepos build from the repo root while the barrel
  // lives at packages/<x>/src/) shims to the root namespace: `import { X }
  // from "../src"` would otherwise bundle a second copy of the whole library
  // with its own React contexts.
  const CWD = process.cwd().replace(/\\/g, "/");
  // realpath both roots - esbuild's resolver returns symlink-resolved paths,
  // and a merely-resolve()'d root (symlinked tmpdir, symlinked package dir)
  // would never prefix-match them.
  const real = (p) => {
    try {
      return realpathSync(p).replace(/\\/g, "/");
    } catch {
      return null;
    }
  };
  const barrelRoots = [
    ...new Set(
      [
        CWD,
        real(process.cwd()),
        pkgDir && resolve(pkgDir).replace(/\\/g, "/"),
        pkgDir && real(pkgDir),
      ].filter(Boolean),
    ),
  ];
  const policyRedirect = {
    name: "ds-import-policy",
    setup(b) {
      b.onResolve({ filter: /.*/ }, async (a) => {
        if (a.pluginData === "ds-resolving") return null; // our own re-entry
        if (a.kind === "entry-point" || (a.namespace && a.namespace !== "file"))
          return null;
        const r = await b.resolve(a.path, {
          kind: a.kind,
          resolveDir: a.resolveDir,
          importer: a.importer,
          pluginData: "ds-resolving",
        });
        if (r.errors.length > 0 || !r.path) return null;
        if (r.namespace && r.namespace !== "file") return r; // claimed by another plugin
        const p = r.path.replace(/\\/g, "/");
        if (STORY_FILE_RE.test(p)) return r; // never the story itself
        if (matches(p, force.bundle)) return r; // explicit bundle wins
        if (matches(p, force.shim))
          return shimResult(exportedComponentFor(p, exported));
        if (p.includes("/node_modules/")) return r; // third-party stays put
        // relative() instead of a startsWith prefix - case-insensitive on
        // win32, where the pkgDir roots carry user-typed casing (a lowercase
        // d:\ drive from --node-modules) while p carries cwd casing, and JS
        // realpathSync never canonicalizes case. Outside-root ('../') and
        // cross-drive (absolute) remainders can never match the anchor.
        // Known limit: darwin's default case-insensitive APFS still compares
        // case-sensitively here (path.posix.relative) - a blanket lowercase
        // compare would be wrong on case-SENSITIVE volumes, so mis-cased
        // --node-modules on mac remains the user's to fix.
        if (
          barrelRoots.some((root) =>
            // FORK (apps-ui-kit): the barrel is the repo-root index.ts; no src/.
            /^(src\/)?index\.[cm]?[jt]sx?$/.test(
              relative(root, p).replace(/\\/g, "/"),
            ),
          )
        ) {
          return shimResult(null); // package source barrel
        }
        // FORK (apps-ui-kit): the root index.ts re-exports these directories
        // wholesale, so a story import into them must use the shipped bundle
        // - a source copy duplicates classes (EmailSettings instanceof checks)
        // and React contexts. Only a directory's index (what the barrel
        // re-exports), never a deep file the barrel may not reach.
        if (barrelRoots.some((root) => inRootBarrel(root, p))) {
          return shimResult(null);
        }
        const name = exportedComponentFor(p, exported);
        return name ? shimResult(name) : r;
      });
    },
  };

  // Bare `import console from "console"` (and node:console) appears in real
  // story files; node builtins can't bundle for the browser, but this one has
  // an exact page-global equivalent.
  const consoleStub = {
    name: "node-console-stub",
    setup(b) {
      b.onResolve({ filter: /^(node:)?console$/ }, () => ({
        path: "console",
        namespace: "node-console",
      }));
      b.onLoad({ filter: /.*/, namespace: "node-console" }, () => ({
        contents: "module.exports=console;",
        loader: "js",
      }));
    },
  };

  return {
    plugins: [
      dsShim,
      storybookStubPlugin(),
      consoleStub,
      policyRedirect,
      svgrPlugin(pkgDir ?? process.cwd()),
      viteGlobPlugin(),
      storyScssPlugin(pkgDir ?? process.cwd()),
    ],
    loaders: { ...STORY_LOADERS, ...(force.loaders ?? {}) },
  };
}
