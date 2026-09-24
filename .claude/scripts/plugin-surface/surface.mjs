// Extracts the plugin-visible API surface -- every name reachable from the root
// barrel -- and diffs it against the committed baseline.
//
// Why this exists: DocSpace hands a plugin the portal's own copy of this kit
// through a one-line re-export of the root barrel (see .claude/rules/plugin-api.md),
// and refuses any subpath. So `index.ts` is the whole plugin UI API, and dropping
// a name from it breaks plugins with no compile error in this repository or in
// the client. Nothing else reports that.
//
//   node .claude/scripts/plugin-surface/surface.mjs            # report + diff
//   node .claude/scripts/plugin-surface/surface.mjs --write     # accept current as baseline
//   node .claude/scripts/plugin-surface/surface.mjs --json      # machine-readable
//
// Exit code 1 when a name disappeared or changed kind; 0 otherwise, additions
// included. Added names are safe; removed ones are the release-blocking half.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

import { toPosix } from "../../../scripts/lib/fs-ids.mjs";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
// TypeScript hands back every fileName with `/`, on Windows too, while ROOT
// there is `C:\...`. Compared raw, no file is ever inside the repository: every
// name reads as `origin: "unknown"`, `external: "ambient"`, and a baseline
// written that way reports the whole surface as moved.
const ROOT_ID = toPosix(ROOT);
const BASELINE = path.join(ROOT, "docs/plugin-surface.json");
const ENTRY = path.join(ROOT, "index.ts");

const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);

// --- collect -----------------------------------------------------------------

const configPath = ts.findConfigFile(ROOT, ts.sys.fileExists, "tsconfig.json");
const config = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, ROOT);

const program = ts.createProgram({
  rootNames: [ENTRY],
  options: { ...parsed.options, noEmit: true, skipLibCheck: true },
});

const checker = program.getTypeChecker();
const entrySource = program.getSourceFile(ENTRY);

if (!entrySource) {
  console.error(`Cannot load ${ENTRY}`);
  process.exit(2);
}

const entrySymbol = checker.getSymbolAtLocation(entrySource);

if (!entrySymbol) {
  console.error(
    "index.ts resolved to no module symbol -- it has no exports, or the program failed to build.",
  );
  process.exit(2);
}

const F = ts.SymbolFlags;

// An `export *` chain hands back alias symbols; the real kind and location are
// on the target. The whole chain is kept, not just the target: for an icon the
// target is declared in vite/client's ambient `*.svg` module and for an API type
// it is declared in node_modules, so only the intermediate links say which
// module of ours put the name in the barrel. Depth-guarded because a re-export
// cycle would otherwise recur forever, and biome's noImportCycles does not
// cover type-only cycles.
const chainOf = (symbol) => {
  const chain = [symbol];
  let current = symbol;
  while (current.flags & F.Alias && chain.length < 16) {
    current = checker.getAliasedSymbol(current);
    chain.push(current);
  }
  return chain;
};

// Ordered: a symbol can carry several flags (a class is a value *and* a type,
// an enum member is both), and the first match is the one worth reporting.
const KINDS = [
  [F.RegularEnum | F.ConstEnum, "enum"],
  [F.Class, "class"],
  [F.Function, "function"],
  [F.Variable, "variable"],
  [F.Interface, "interface"],
  [F.TypeAlias, "type"],
  [F.Module, "namespace"],
  [F.EnumMember, "enum-member"],
];

const kindOf = (symbol) => {
  for (const [flag, name] of KINDS) if (symbol.flags & flag) return name;
  return "other";
};

const packageOf = (file) => {
  // The *last* node_modules wins: pnpm nests the real package under
  // `.pnpm/<name>@<version>/node_modules/<name>`, and the first match there is
  // the literal directory `.pnpm`.
  const tail = file.slice(file.lastIndexOf("node_modules/") + 13);
  const segments = tail.split("/");
  return tail.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
};

const fileOf = (symbol) => symbol.declarations?.[0]?.getSourceFile().fileName;

// Where the name enters the barrel, as a directory: `components/button`, not
// `components/button/Button.types.ts`. Read from the deepest link of the alias
// chain that is still inside this repository, so a re-exported icon is credited
// to the component that re-exports it rather than to vite's ambient SVG module.
const originOf = (chain) => {
  for (let i = chain.length - 1; i >= 0; i -= 1) {
    const file = fileOf(chain[i]);
    if (
      !file ||
      file.includes("node_modules") ||
      !toPosix(file).startsWith(ROOT_ID)
    )
      continue;
    const dir = path.dirname(path.relative(ROOT, file)).replaceAll("\\", "/");
    // The root barrel itself says nothing; keep walking outwards.
    if (dir !== ".") return dir;
  }
  return "unknown";
};

// Set when the name is ultimately declared outside this repository -- a type or
// value the barrel re-exports from a dependency. A plugin author inherits it
// without ever naming that package, and it moves when the dependency moves.
const ambientModuleName = (symbol) => {
  let node = symbol.declarations?.[0];
  while (node) {
    if (ts.isModuleDeclaration(node) && ts.isStringLiteral(node.name))
      return node.name.text;
    node = node.parent;
  }
  return undefined;
};

const externalOf = (chain) => {
  const target = chain[chain.length - 1];
  const file = fileOf(target);
  if (!file) return undefined;

  // An SVG imported as a component resolves to vite/client's `*.svg` ambient
  // module, so the declaration sits in node_modules while the asset is ours.
  // Naming vite here would send a reader to the wrong repository.
  const ambient = ambientModuleName(target);
  if (ambient?.endsWith(".svg")) return "assets (*.react.svg)";

  if (file.includes("node_modules")) return packageOf(file);
  if (!toPosix(file).startsWith(ROOT_ID)) return "ambient";
  return undefined;
};

const TYPE_ONLY = new Set(["interface", "type"]);

const entries = {};
for (const exported of checker.getExportsOfModule(entrySymbol)) {
  const chain = chainOf(exported);
  const target = chain[chain.length - 1];
  const external = externalOf(chain);
  entries[exported.getName()] = {
    kind: kindOf(target),
    origin: originOf(chain),
    ...(external ? { external } : {}),
  };
}

const names = Object.keys(entries).sort();
const surface = {
  // Recorded so a diff taken against another branch says which barrel it read.
  entry: "index.ts",
  package: JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"))
    .name,
  total: names.length,
  values: names.filter((n) => !TYPE_ONLY.has(entries[n].kind)).length,
  exports: Object.fromEntries(names.map((n) => [n, entries[n]])),
};

// --- report ------------------------------------------------------------------

if (has("--json")) {
  console.log(JSON.stringify(surface, null, 2));
  process.exit(0);
}

if (has("--write")) {
  fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
  fs.writeFileSync(BASELINE, `${JSON.stringify(surface, null, 2)}\n`);
  console.log(
    `Baseline written: ${path.relative(ROOT, BASELINE)} (${surface.total} exports)`,
  );
  process.exit(0);
}

const byOrigin = new Map();
for (const name of names) {
  const top = entries[name].origin.split("/")[0];
  byOrigin.set(top, (byOrigin.get(top) ?? 0) + 1);
}

console.log(`Plugin UI API surface -- ${surface.package}, root barrel`);
console.log(
  `  ${surface.total} exports (${surface.values} values, ${surface.total - surface.values} type-only)`,
);
for (const [origin, count] of [...byOrigin].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(5)}  ${origin}`);
}

const externals = new Map();
for (const name of names) {
  const { external } = surface.exports[name];
  if (external) externals.set(external, (externals.get(external) ?? 0) + 1);
}

if (externals.size) {
  console.log("\nDeclared outside this repository, re-exported anyway:");
  for (const [pkg, count] of [...externals].sort((a, b) => b[1] - a[1]))
    console.log(`  ${String(count).padStart(5)}  ${pkg}`);
  console.log(
    "  A plugin can use these, and they move when the dependency moves.",
  );
}

if (!fs.existsSync(BASELINE)) {
  console.log(
    `\nNo baseline at ${path.relative(ROOT, BASELINE)}. Create it with --write.`,
  );
  process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
const before = baseline.exports ?? {};

const removed = Object.keys(before)
  .filter((n) => !(n in surface.exports))
  .sort();
const added = names.filter((n) => !(n in before));
const changed = names
  .filter((n) => n in before && before[n].kind !== surface.exports[n].kind)
  .sort();
// A name that moved between modules still resolves; worth seeing, never fatal.
const moved = names
  .filter(
    (n) =>
      n in before &&
      before[n].kind === surface.exports[n].kind &&
      before[n].origin !== surface.exports[n].origin,
  )
  .sort();

const pad = (n) => n.padEnd(34);

if (removed.length) {
  console.log(
    `\nRemoved -- breaks every plugin using them (${removed.length}):`,
  );
  for (const n of removed) console.log(`  - ${pad(n)}was ${before[n].origin}`);
}

if (changed.length) {
  console.log(`\nKind changed (${changed.length}):`);
  for (const n of changed)
    console.log(`  ~ ${pad(n)}${before[n].kind} -> ${surface.exports[n].kind}`);
}

if (added.length) {
  console.log(`\nAdded (${added.length}):`);
  for (const n of added)
    console.log(`  + ${pad(n)}${surface.exports[n].origin}`);
}

if (moved.length) {
  console.log(`\nMoved between modules (${moved.length}), still exported:`);
  for (const n of moved)
    console.log(
      `  > ${pad(n)}${before[n].origin} -> ${surface.exports[n].origin}`,
    );
}

if (!removed.length && !changed.length && !added.length && !moved.length) {
  console.log("\nUnchanged against the baseline.");
}

process.exit(removed.length || changed.length ? 1 : 0);
