// Reorders dist/styles.css so a module's rules always follow its dependencies'.
//
// Why this exists
// ---------------
// The package used to inject each CSS module as its own <style> at import time
// (`postcss({ inject: true })`). Injection order is ES module execution order,
// which is depth-first *post*-order: a module's imports run before its own
// body. So Button's rules were in the document before Navigation's, and
// Navigation's `.aiChatSlot :global(.ai-chat-button) { padding: 6px 10px }`
// beat Button's `.button.small { padding: 0 28px }` on order, exactly as the
// author intended -- the two selectors have identical specificity (0,2,0), so
// order is the only thing separating them.
//
// Extracting to one stylesheet changed that, and rollup-plugin-postcss 4.0.2
// gets the replacement order wrong twice over (see its `getExtracted`):
//
//   1. It seeds the walk from ONE entry chunk -- `Object.keys(bundle).find(f =>
//      bundle[f].isEntry)`. This package has 717 entry points, so that pick is
//      arbitrary; every CSS module not reachable from it sorts at index -1 and
//      keeps whatever order rollup happened to transform it in. Two builds of
//      the same commit emit different stylesheets.
//   2. `getRecursiveImportOrder` is pre-order: it pushes a module before
//      recursing into its imports. So for the modules it *does* reach, a
//      component's rules land BEFORE the rules of the components it builds on
//      -- the exact inverse of what injection did.
//
// Together those put Navigation's override 289 KB ahead of Button's base rule,
// so Button won and the AI chat button in the portal header rendered 36px wider
// than its baseline. 420 cross-module `:global` overrides in this package sit on
// the same cascade, so this was never about one button.
//
// What it does
// ------------
// Recomputes a correct order and rewrites the stylesheet:
//
//   - the module graph comes from `dist/esm`, which mirrors the source tree 1:1
//     thanks to `preserveModules`;
//   - every rule is attributed to the module that owns it through the compiled
//     class maps (`dist/esm/**/X.module.scss/index.js`), so the mapping is the
//     build's own and needs no guessing from file names -- three basenames
//     (Tabs, Amount, PaymentMethod) exist twice in this repo and only the hash
//     suffix tells their classes apart;
//   - modules are ranked by a deterministic post-order walk over every entry,
//     and the rules are stable-sorted by that rank.
//
// `check-dist.mjs` asserts the result, so a regression fails the build rather
// than showing up as a screenshot diff.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import cssnano from "cssnano";
import postcss from "postcss";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const ESM = path.join(DIST, "esm");
const STYLESHEET = path.join(DIST, "styles.css");

/** Every .js under a directory, as paths relative to it, sorted. */
const collect = (root, dir = root, found = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(root, full, found);
    else if (entry.name.endsWith(".js")) found.push(path.relative(root, full));
  }
  return found;
};

/**
 * Relative import specifiers of one built module, resolved to module ids.
 * Bare specifiers are externals and carry no CSS, so they are dropped.
 */
const IMPORT_RE = /(?:^|\n)\s*(?:import|export)[^'"\n]*?from\s*["']([^"']+)["']|(?:^|\n)\s*import\s*["']([^"']+)["']/g;

const importsOf = (id) => {
  const code = fs.readFileSync(path.join(ESM, id), "utf8");
  const out = [];

  for (const m of code.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2];
    if (!spec || !spec.startsWith(".")) continue;
    out.push(path.normalize(path.join(path.dirname(id), spec)));
  }

  return out;
};

/**
 * Deterministic post-order walk: a module is ranked after everything it
 * imports. Entry order is the sorted module list, so the result does not depend
 * on how rollup happened to traverse the graph.
 */
const rankModules = (ids) => {
  const graph = new Map(ids.map((id) => [id, importsOf(id)]));
  const rank = new Map();
  const onStack = new Set();

  const visit = (id) => {
    if (rank.has(id) || onStack.has(id)) return; // second term breaks cycles
    if (!graph.has(id)) return; // an id that resolved outside the tree
    onStack.add(id);
    for (const dep of graph.get(id)) visit(dep);
    onStack.delete(id);
    rank.set(id, rank.size);
  };

  for (const id of ids) visit(id);

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
    const prefix = `dsui-${path.basename(path.dirname(id), ".scss").replace(/\./g, "-")}__`;
    if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
    byPrefix.get(prefix).push(id);

    const code = fs.readFileSync(path.join(ESM, id), "utf8");
    for (const m of code.matchAll(/"([^"]+)":"(dsui-[^"]+)"/g)) byClass.set(m[2], id);
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
 * sit ahead of a module they depend on. Exported so check-dist can assert the
 * count is zero without duplicating any of this.
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
      owner = candidates.length === 1 ? candidates[0] : (byClass.get(cls) ?? null);
      if (owner) break;
    }

    if (owner === null) unattributed += 1;

    return { text, index, owner };
  });

  // What is left carries no module class at all: the `.light` / `.dark` custom
  // property blocks and `.aui-root`. They declare variables the components then
  // read, so the head of the file is both the correct place and a fixed one --
  // inheriting the preceding rule's module would make their position depend on
  // the very input order this script exists to normalise.
  const rankOf = (owner) => (owner === null ? -1 : (rank.get(owner) ?? Number.MAX_SAFE_INTEGER));

  const sorted = [...items].sort(
    (a, b) => rankOf(a.owner) - rankOf(b.owner) || (a.owner === null ? a.text.localeCompare(b.text) : a.index - b.index),
  );

  // Pairs that were in the wrong relative order before the sort -- i.e. how
  // much cascade the extract step had actually inverted.
  let inverted = 0;
  for (let i = 1; i < items.length; i += 1) {
    if (rankOf(items[i].owner) < rankOf(items[i - 1].owner)) inverted += 1;
  }

  return {
    charset,
    items,
    sorted,
    inverted,
    unattributed,
    ruleCount: rules.length,
    moduleCount: new Set(items.map((i) => i.owner)).size,
  };
};

const main = async () => {
  if (!fs.existsSync(STYLESHEET)) {
    console.error(`${path.relative(DIST, STYLESHEET)} not found -- run finalize-dist first.`);
    process.exit(1);
  }

  const before = fs.statSync(STYLESHEET).size;
  const { charset, sorted, inverted, unattributed, ruleCount, moduleCount } = analyseStylesheet();
  const ordered = charset + sorted.map((r) => r.text).join("");

  // Minify only now. cssnano merges rules that sit next to each other, so on
  // the ordered stylesheet every merge it makes is between rules that were
  // already adjacent in the correct cascade -- which cannot change the outcome.
  // Run before the sort (rollup-plugin-postcss's own `minimize`) it merged
  // across module boundaries instead, welding selectors from two modules into
  // one rule that then belonged to neither.
  const { css } = await postcss([cssnano({ preset: "default" })]).process(ordered, {
    from: STYLESHEET,
    to: STYLESHEET,
  });

  fs.writeFileSync(STYLESHEET, css);

  const after = fs.statSync(STYLESHEET).size;

  console.log(
    `dist/styles.css ordered and minified: ${ruleCount} rules across ${moduleCount} modules; ` +
      `${inverted} were behind a module they depend on, ${unattributed} global rules hoisted to the head; ` +
      `${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB.`,
  );
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
