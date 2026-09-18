// Assembles dist/styles.css -- the whole-library stylesheet kept for consumers
// that import it -- from the per-module CSS files the build emits, in the
// order the cascade needs, and asserts that order for check-dist.
//
// Why the order matters
// ---------------------
// The package used to inject each CSS module as its own <style> at import time
// (`postcss({ inject: true })`). Injection order is ES module execution order,
// which is depth-first *post*-order: a module's imports run before its own
// body. So Button's rules were in the document before Navigation's, and
// Navigation's `.aiChatSlot :global(.ai-chat-button) { padding: 6px 10px }`
// beat Button's `.button.small { padding: 0 28px }` on order, exactly as the
// author intended -- the two selectors have identical specificity (0,2,0), so
// order is the only thing separating them. 420 cross-module `:global`
// overrides in this package sit on the same cascade.
//
// Consumers that import components now get each module's CSS through the
// module itself (see scripts/rollup/per-module-css.mjs) and their bundler
// emits it in that same post-order. The bundle built here has to reproduce
// it by hand, and the first extraction did not: rollup-plugin-postcss seeded
// its walk from one arbitrary entry of 717 and ranked modules pre-order, which
// put Navigation's override 289 KB ahead of Button's base rule and rendered
// the AI chat button in the portal header 36px wider than its baseline.
//
// What it does
// ------------
//   - the module graph comes from `dist/esm`, which mirrors the source tree 1:1
//     thanks to `preserveModules`;
//   - the stylesheets are topologically sorted against each other -- a
//     stylesheet follows every stylesheet its importers build on;
//   - the non-module stylesheets (the `.light` / `.dark` custom-property
//     blocks, `.aui-root`) go first: they declare variables the components
//     read and belong to no component's cascade;
//   - the files are concatenated in that order and minified once, at the end,
//     because cssnano merges *adjacent* rules and must only ever see rules that
//     are already adjacent in the correct cascade.
//
// `check-dist.mjs` asserts the result through `analyseStylesheet`, so a
// regression fails the build rather than showing up as a screenshot diff.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import cssnano from "cssnano";
import postcss from "postcss";

import { assertPosixIds, walk } from "./lib/fs-ids.mjs";

const DIST = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);
const ESM = path.join(DIST, "esm");
const STYLESHEET = path.join(DIST, "styles.css");

/** Every .js under a directory, as POSIX ids relative to it, sorted. */
export const collect = (root) =>
  assertPosixIds(
    [...walk(root, { sort: true })]
      .filter((e) => !e.isDir && e.name.endsWith(".js"))
      .map((e) => e.id),
    "collect",
  );

/**
 * Relative import specifiers of one built module, resolved to module ids.
 * Bare specifiers are externals and carry no CSS, so they are dropped.
 */
const IMPORT_RE =
  /(?:^|\n)\s*(?:import|export)[^'"\n]*?from\s*["']([^"']+)["']|(?:^|\n)\s*import\s*["']([^"']+)["']/g;

const importsOf = (id) => {
  const code = fs.readFileSync(path.join(ESM, id), "utf8");
  const out = [];

  for (const m of code.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2];
    if (!spec || !spec.startsWith(".")) continue;
    out.push(path.posix.join(path.posix.dirname(id), spec));
  }

  return out;
};

/** A CSS Module: the only stylesheets that own component rules and take part in the ranking. */
const isStylesheet = (id) => id.includes(".module.scss");

/** Every emitted stylesheet, as POSIX `<stylesheet>/index.css` ids relative to dist/esm, sorted. */
const collectCss = (root) =>
  assertPosixIds(
    [...walk(root, { sort: true })]
      .filter((e) => !e.isDir && e.name === "index.css")
      .map((e) => e.id),
    "collectCss",
  );

/**
 * Ranks the stylesheets, which is all the sort needs -- every rule is
 * attributed to a `.module.scss`, never to a `.tsx`.
 *
 * A post-order walk over the module graph does not answer this on its own. A
 * stylesheet is a leaf: it imports nothing, so a plain walk ranks it the moment
 * the first importer reaches it, and which importer that is depends on
 * alphabetical order. `TransactionHistory.module.scss` has seven importers;
 * the first one visited is `TableLoader.tsx`, which pulls in only the skeleton
 * component -- so the stylesheet landed 13 KB ahead of `SelectedItem`, and its
 * `.selectedContactItem { margin-bottom: 0 }` lost to `.selectedItem`'s 4px at
 * equal specificity. The contact chip then made the filter row 4px taller and
 * pushed the whole transaction table down.
 *
 * A stylesheet has to sit after every stylesheet belonging to a component that
 * *any* of its importers builds on, because those are exactly the components
 * its rules may override. So the order is a topological sort over the
 * stylesheets themselves: S depends on T when some importer of S reaches T.
 * Ties and cycles resolve by path, so the result is the same on every machine.
 */
const rankModules = (ids) => {
  const graph = new Map(ids.map((id) => [id, importsOf(id)]));

  const importers = new Map();
  for (const id of ids) {
    if (isStylesheet(id)) continue;
    for (const dep of graph.get(id)) {
      if (!isStylesheet(dep) || !graph.has(dep)) continue;
      if (!importers.has(dep)) importers.set(dep, []);
      importers.get(dep).push(id);
    }
  }

  // Stylesheets reachable from a set of modules. One breadth-first sweep per
  // stylesheet, sharing a visited set across its importers -- the graph is
  // small enough that this is cheaper than getting memoisation right across
  // the cycles the import graph does contain.
  const stylesFrom = (roots) => {
    const seen = new Set(roots);
    const queue = [...roots];
    const found = new Set();

    while (queue.length > 0) {
      const id = queue.pop();
      if (!graph.has(id)) continue;
      if (isStylesheet(id)) found.add(id);
      for (const dep of graph.get(id)) {
        if (seen.has(dep)) continue;
        seen.add(dep);
        queue.push(dep);
      }
    }

    return found;
  };

  const stylesheets = ids.filter(isStylesheet).sort();
  const deps = new Map(
    stylesheets.map((id) => {
      const found = stylesFrom(importers.get(id) ?? []);
      found.delete(id);
      return [id, [...found].sort()];
    }),
  );

  const rank = new Map();
  const onStack = new Set();

  const visit = (id) => {
    if (rank.has(id) || onStack.has(id)) return; // second term breaks cycles
    onStack.add(id);
    for (const dep of deps.get(id) ?? []) visit(dep);
    onStack.delete(id);
    rank.set(id, rank.size);
  };

  for (const id of stylesheets) visit(id);

  return rank;
};

/**
 * Two ways to attribute a generated class to the module that declares it.
 *
 * `byPrefix` is the primary one: `generateScopedName` puts the file's basename
 * in every class, so `dsui-Button-module__small--f1Z4s` names Button.module.scss
 * outright. It covers rules the export map misses -- hashed @keyframes names,
 * and locals that postcss-modules did not export (Section's
 * `.progressBarContainer` is one).
 *
 * `byClass` only settles the ambiguity: Tabs.module.scss and
 * PaymentMethod.module.scss each exist twice in this repo, so their prefix
 * names two modules and the hash is the only thing that tells them apart.
 */
const attribution = (ids) => {
  const byPrefix = new Map();
  const byClass = new Map();

  for (const id of ids) {
    if (!id.includes(".module.scss")) continue;

    // generateScopedName is "dsui-[name]__[local]--[hash]" and [name] is the
    // file name without its extension, dots turned into dashes:
    // Button.module.scss -> "dsui-Button-module__".
    const prefix = `dsui-${path.posix.basename(path.posix.dirname(id), ".scss").replace(/\./g, "-")}__`;
    if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
    byPrefix.get(prefix).push(id);

    const code = fs.readFileSync(path.join(ESM, id), "utf8");
    for (const m of code.matchAll(/"([^"]+)":"(dsui-[^"]+)"/g))
      byClass.set(m[2], id);
  }

  return { byPrefix, byClass };
};

/** Split a stylesheet into top-level rules, keeping at-rule blocks whole. */
const topLevelRules = (css) => {
  const rules = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        rules.push(css.slice(start, i + 1));
        start = i + 1;
      }
    }
  }

  // Anything after the last closing brace (should be nothing, but never drop
  // bytes from the stylesheet).
  const tail = css.slice(start);
  if (tail.trim()) rules.push(tail);

  return rules;
};

/**
 * Attributes every rule in dist/styles.css to its module and counts how many
 * sit ahead of a rule of a module they depend on. Exported so check-dist can
 * assert the count is zero without duplicating any of this.
 */
export const analyseStylesheet = () => {
  const ids = collect(ESM);
  const rank = rankModules(ids);
  const { byPrefix, byClass } = attribution(ids);

  const css = fs.readFileSync(STYLESHEET, "utf8");

  // A leading @charset must stay the very first byte of the file.
  const charset = css.match(/^@charset[^;]*;/)?.[0] ?? "";
  const body = css.slice(charset.length);

  const rules = topLevelRules(body);
  // No dot in the character class: a compound selector such as
  // `.dsui-Text-module__text--a.dsui-Text-module__inline--b` would otherwise be
  // captured as one token that belongs to no single module.
  const CLASS_RE = /dsui-[A-Za-z0-9_-]+?__[A-Za-z0-9_-]+?--[A-Za-z0-9_-]+/g;

  let unattributed = 0;

  const items = rules.map((text, index) => {
    let owner = null;

    for (const cls of text.match(CLASS_RE) ?? []) {
      const prefix = `${cls.slice(0, cls.indexOf("__") + 2)}`;
      const candidates = byPrefix.get(prefix);
      if (!candidates) continue;
      owner =
        candidates.length === 1 ? candidates[0] : (byClass.get(cls) ?? null);
      if (owner) break;
    }

    if (owner === null) unattributed += 1;

    return { text, index, owner };
  });

  // A rule with no module class at all -- the `.light` / `.dark` custom
  // property blocks, `.aui-root`, hashed @keyframes -- takes part in no
  // cross-module override and stays wherever its own stylesheet put it, so
  // the check below skips it and compares each attributed rule with the
  // attributed rule before it.
  const rankOf = (owner) => rank.get(owner) ?? Number.MAX_SAFE_INTEGER;

  let inverted = 0;
  let previous = null;

  for (const item of items) {
    if (item.owner === null) continue;
    if (previous !== null && rankOf(item.owner) < rankOf(previous.owner))
      inverted += 1;
    previous = item;
  }

  return {
    charset,
    items,
    inverted,
    unattributed,
    ruleCount: rules.length,
    moduleCount: new Set(items.map((i) => i.owner)).size,
  };
};

/**
 * The emitted CSS files in cascade order: the plain stylesheets first, by path
 * (they declare the `.light` / `.dark` variables the components read and take
 * part in no override), then the CSS Modules by rank. Exported so check-dist
 * can assert the emitted tree matches.
 */
export const orderedStylesheets = () => {
  const ids = collect(ESM);
  const rank = rankModules(ids);
  const files = collectCss(ESM);
  const rankOf = (file) => {
    const chunk = file.replace(/index\.css$/, "index.js");
    return isStylesheet(chunk)
      ? (rank.get(chunk) ?? Number.MAX_SAFE_INTEGER)
      : -1;
  };

  return assertPosixIds(
    files.sort((a, b) => rankOf(a) - rankOf(b) || a.localeCompare(b)),
    "orderedStylesheets",
  );
};

const main = async () => {
  const files = orderedStylesheets();

  if (files.length === 0) {
    console.error("No stylesheets under dist/esm -- did the build run?");
    process.exit(1);
  }

  let charset = "";
  const parts = [];

  for (const file of files) {
    let css = fs.readFileSync(path.join(ESM, file), "utf8");
    // One @charset, and only at the very first byte of the bundle.
    const m = css.match(/^@charset[^;]*;\s*/);
    if (m) {
      charset ||= m[0].trim();
      css = css.slice(m[0].length);
    }
    parts.push(css);
  }

  const ordered = (charset ? `${charset}\n` : "") + parts.join("\n");

  const { css } = await postcss([cssnano({ preset: "default" })]).process(
    ordered,
    {
      from: undefined,
      to: STYLESHEET,
    },
  );

  fs.writeFileSync(STYLESHEET, css);

  const { inverted, ruleCount, moduleCount } = analyseStylesheet();

  console.log(
    `dist/styles.css assembled from ${files.length} stylesheets: ${ruleCount} rules across ${moduleCount} modules, ` +
      `${inverted} out of cascade order; ${Math.round(Buffer.byteLength(ordered) / 1024)} KB -> ${Math.round(fs.statSync(STYLESHEET).size / 1024)} KB.`,
  );
};

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();
