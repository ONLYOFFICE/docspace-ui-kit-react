// Guards the build output against the defect that used to break it outright:
// third-party packages compiled into dist. A vendored copy ships alongside the
// one npm installs from `dependencies`, which is fatal for anything holding
// module state (i18next, mobx, react-i18next) and merely wasteful for the rest.
//
// Run after `pnpm build`. Exits non-zero with the offending paths.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { analyseStylesheet, collect, orderedStylesheets } from "./order-styles.mjs";

const DIST = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);

// Rollup parks bundled third-party code in these directories when it inlines a
// package: `node_modules/<pkg>` mirrors the source tree, `_virtual` holds the
// CommonJS interop shims it synthesises.
const FORBIDDEN_DIRS = ["node_modules", "_virtual"];

const findForbidden = (dir, found = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (!entry.isDirectory()) continue;

    if (FORBIDDEN_DIRS.includes(entry.name)) {
      const count = fs.readdirSync(full).length;
      found.push({ path: path.relative(DIST, full), count });
      continue;
    }

    findForbidden(full, found);
  }

  return found;
};

if (!fs.existsSync(DIST)) {
  console.error("dist/ not found -- run `pnpm build` first.");
  process.exit(1);
}

const offenders = findForbidden(DIST);

if (offenders.length > 0) {
  console.error(
    "Bundled dependencies found in dist/. Every package listed in " +
      "`dependencies` or `peerDependencies` must stay external; see the " +
      "`isExternal` predicate in rollup.config.mjs.\n",
  );

  for (const { path: rel, count } of offenders) {
    console.error(`  dist/${rel} (${count} entries)`);
  }

  process.exit(1);
}

console.log("dist/ carries no bundled dependencies.");

// "use client" is a module-level directive, and rollup drops it while bundling:
// it warns "Module level directives cause errors when bundled" once per file,
// which is invisible among hundreds of lines of build output. Without the
// directive, every Next.js App Router consumer breaks on the first interactive
// component. `preserveUseClient` in rollup.config.mjs restores it per chunk, so
// this is enforced: every source occurrence must have a matching one in dist.
// Matched at the top of the file, where a directive has to be, and only as a
// statement. Searching the whole text for the quoted string counts a mention
// in a comment or in documentation as a real directive, which fails the build
// for no reason.
const DIRECTIVE = /^\s*(?:\/\*[\s\S]*?\*\/\s*|\/\/[^\n]*\n\s*)*["']use client["']\s*;?/;

/** Module ids (paths relative to `dir`, extension stripped) carrying the directive. */
const modulesWithDirective = (dir, exts) => {
  const found = new Set();

  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (!exts.some((ext) => entry.name.endsWith(ext))) continue;
      if (!DIRECTIVE.test(fs.readFileSync(full, "utf8"))) continue;

      found.add(
        path
          .relative(dir, full)
          .replace(/\\/g, "/")
          .replace(/\.(tsx?|jsx?)$/, ""),
      );
    }
  };

  walk(dir);

  return found;
};

const SOURCE_ROOT = path.resolve(DIST, "..");
const SKIP = ["node_modules", "dist", ".git", "storybook-static", "locales"];

// `components/button/Button.tsx` and `dist/esm/components/button/Button/index.js`
// name the same module: preserveModules keeps the tree and `entryFileNames`
// appends the `/index.js`. Dropping a trailing `index` from both sides makes
// them comparable, and also collapses `context/index.ts` onto `context`.
const moduleId = (id) => id.replace(/(^|\/)index$/, "");

const inSource = new Set(
  fs
    .readdirSync(SOURCE_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !SKIP.includes(e.name))
    .flatMap((e) =>
      [...modulesWithDirective(path.join(SOURCE_ROOT, e.name), [".ts", ".tsx"])].map(
        (id) => moduleId(`${e.name}/${id}`),
      ),
    ),
);

const inDist = new Set(
  [...modulesWithDirective(path.join(DIST, "esm"), [".js"])].map(moduleId),
);

// Name the modules rather than compare two totals. Equal counts can hide a
// mismatch -- one module losing the directive while another gains it reads as
// success -- and an unequal count says nothing about which module to look at.
const missing = [...inSource].filter((id) => !inDist.has(id)).sort();

if (missing.length > 0) {
  console.error(
    `\n  "use client" is missing from ${missing.length} built module(s):\n` +
      missing.slice(0, 10).map((id) => `    ${id}`).join("\n") +
      (missing.length > 10 ? `\n    ... and ${missing.length - 10} more` : "") +
      "\n\n  Rollup strips module-level directives, so Next.js App Router consumers " +
      "will\n  break on the first interactive component. Check preserveUseClient " +
      "in rollup.config.mjs.\n",
  );
  process.exit(1);
}

console.log(`"use client" preserved: ${inSource.size} modules.`);

// The `exports` map is a single wildcard pointing at `<subpath>/index.*`, so
// every emitted module must actually be an index file. Two ways that can break:
//
//   1. A stray non-index chunk -- unreachable, because no exports pattern
//      matches it.
//   2. A collision. `entryFileNames` maps `x.ts` to `x/index.js`, so a source
//      tree containing both `x.ts` and `x/index.ts` would have them land on the
//      same path. Rollup does not fail on that: it silently renames the loser
//      to `index2.js`, which no subpath resolves to. The dist check is the
//      only thing that would notice, so it looks for exactly that.
//
// Declarations are checked too: `dist/types` is produced by tsc, which mirrors
// the source tree, and is reshaped separately by scripts/normalize-types.mjs.
// If that step is skipped or fails, the types keep the flat layout while the
// JavaScript does not, and every deep import resolves code but no types.
const collectShapeOffenders = (root, ext) => {
  const stray = [];
  const collided = [];

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (!entry.name.endsWith(ext)) continue;

      const rel = path.relative(root, full);

      if (/^index\d+\./.test(entry.name)) {
        collided.push(rel);
        continue;
      }

      if (entry.name !== `index${ext}`) stray.push(rel);
    }
  };

  walk(root);

  return { stray, collided };
};

const SHAPE_TREES = [
  ["esm", ".js"],
  // .d.mts copies live beside each .d.ts; checking .d.ts covers both.
  ["types", ".d.ts"],
];

let shapeFailed = false;

for (const [tree, ext] of SHAPE_TREES) {
  const root = path.join(DIST, tree);

  if (!fs.existsSync(root)) continue;

  const { stray, collided } = collectShapeOffenders(root, ext);

  // globals.d.ts is an ambient declaration referenced by path, not an
  // importable subpath, so it is exempt from the index-only rule.
  const realStray = stray.filter((rel) => rel !== "globals.d.ts");

  if (collided.length > 0) {
    shapeFailed = true;
    console.error(
      `\n  dist/${tree}: ${collided.length} module(s) collided on the same ` +
        "normalised path and were renamed by rollup, making them\n  " +
        "unreachable. A source tree cannot hold both `x.ts` and " +
        "`x/index.ts` -- rename one:\n",
    );
    for (const rel of collided.slice(0, 10)) console.error(`    ${rel}`);
  }

  if (realStray.length > 0) {
    shapeFailed = true;
    console.error(
      `\n  dist/${tree}: ${realStray.length} module(s) are not index${ext}, ` +
        "so the `exports` wildcard does not resolve them:\n",
    );
    for (const rel of realStray.slice(0, 10)) console.error(`    ${rel}`);
    if (realStray.length > 10) {
      console.error(`    ... and ${realStray.length - 10} more`);
    }
  }
}

if (shapeFailed) process.exit(1);

console.log("dist/ module shape is uniform: every module is an index file.");

// Every emitted stylesheet is imported by at least one chunk, and a CSS
// Module's is imported by its own proxy: that import is how a consumer gets a
// component's styles at all now, so a stylesheet nothing imports is a
// component that renders unstyled.
const stylesheets = orderedStylesheets();
const cssImports = new Set();
const CSS_IMPORT_RE = /^import\s+["'](\.[^"']+\.css)["'];?/gm;

for (const id of collect(path.join(DIST, "esm"))) {
  const code = fs.readFileSync(path.join(DIST, "esm", id), "utf8");
  for (const m of code.matchAll(CSS_IMPORT_RE)) {
    cssImports.add(path.posix.normalize(path.posix.join(path.posix.dirname(id), m[1])));
  }
}

let detached = 0;

for (const file of stylesheets) {
  const proxy = file.replace(/index\.css$/, "index.js");
  const ownProxy = fs.existsSync(path.join(DIST, "esm", proxy));
  const importedByOwnProxy =
    ownProxy && fs.readFileSync(path.join(DIST, "esm", proxy), "utf8").startsWith('import "./index.css";');

  if ((ownProxy && !importedByOwnProxy) || !cssImports.has(file)) {
    detached += 1;
    console.error(`  ${file}: ${ownProxy ? "not imported by its proxy" : "imported by no chunk"}`);
  }
}

if (detached > 0) {
  console.error(`\n  ${detached} stylesheet(s) are detached from the modules that need them.\n`);
  process.exit(1);
}

console.log(`Per-module CSS: ${stylesheets.length} stylesheets, every one imported by the modules that use it.`);

// The cascade in the assembled dist/styles.css has to match the order the
// modules would have injected their styles in: a module's rules after
// everything it imports. scripts/order-styles.mjs writes it that way, so a
// non-zero count here means it did not run, or ran on a stale tree.
//
// This is not cosmetic. 420 cross-module `:global` overrides in this package
// resolve on order alone -- the override and the rule it overrides have equal
// specificity -- so an inverted pair silently restyles a component in every
// consumer, and only a visual test would catch it.
const { inverted, ruleCount, moduleCount } = analyseStylesheet();

if (inverted > 0) {
  console.error(
    `\n  dist/styles.css: ${inverted} rule(s) are placed ahead of a module ` +
      "they depend on, so any equal-specificity override among them loses.\n  " +
      "Run `node scripts/order-styles.mjs` again.\n",
  );
  process.exit(1);
}

console.log(
  `dist/styles.css cascade follows the module graph: ${ruleCount} rules, ${moduleCount} modules.`,
);
