// Manifest invariants that this package documents in prose and nothing checks.
//
// `pnpm build` guards the emitted tree and `pnpm verify:package` guards the
// tarball. Neither reads package.json as a set of promises, and the suite that
// used to -- DocSpace-client's dependencies.test.js -- no longer scans this
// package (.claude/rules/source-checks.md). What is left unchecked:
//
//   1. A declared dependency nothing imports, and an imported package nothing
//      declares. The second one ships a package that resolves only by accident
//      of the consumer's tree.
//   2. A peer and its devDependency mirror disagreeing on the version. pnpm
//      does not install peers, so the dev copy is what the build, the tests and
//      Storybook actually run against -- and what a consumer gets is the peer.
//   3. peerDependenciesMeta naming something that is not a peer.
//   4. A `files` entry matching nothing.
//
//   node .claude/scripts/release-check/manifest.mjs
//
// Exit 1 on any finding. Reads no network and needs no build.

import fs from "node:fs";
import path from "node:path";
import { builtinModules } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const deps = pkg.dependencies ?? {};
const peers = pkg.peerDependencies ?? {};
const devs = pkg.devDependencies ?? {};
const meta = pkg.peerDependenciesMeta ?? {};

const findings = [];
const add = (title, detail) => findings.push({ title, detail });

// --- what the source imports --------------------------------------------------

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  "storybook-static",
  "coverage",
  "locales",
  "biome-plugins",
  "__tests__",
  ".claude",
]);

const sources = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(full);
    } else if (/\.(tsx?|mts|mjs|jsx?)$/.test(entry.name)) {
      sources.push(full);
    }
  }
};
walk(ROOT);

// A bare specifier's package name: `lodash/debounce` -> lodash,
// `@scope/pkg/sub` -> @scope/pkg. Relative and absolute paths are not packages.
const BUILTINS = new Set(builtinModules);

const packageOf = (specifier) => {
  if (specifier.startsWith(".") || specifier.startsWith("/")) return undefined;
  if (specifier.startsWith("node:")) return undefined;
  // A specifier is a path-shaped token. Anything with a space, a `$` or a `<`
  // came out of a template literal or a sentence, not an import.
  if (!/^[@a-zA-Z0-9._~/-]+$/.test(specifier)) return undefined;
  const parts = specifier.split("/");
  const name = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
  // `import path from "path"` -- a builtin written without the node: prefix.
  return BUILTINS.has(name) ? undefined : name;
};

// Matches `from "x"`, `import "x"`, `require("x")` and `import("x")`. Same
// shape the client's own rule used: a regex over specifier literals, not a
// parse -- a specifier inside a comment counts, which errs toward declaring.
const SPECIFIER =
  /(?:\bfrom\s*|\bimport\s*|\brequire\s*\(\s*|\bimport\s*\(\s*)["']([^"']+)["']/g;

const imported = new Set();
const importedBy = new Map();

// Comments are stripped first. The client's rule scanned them too, which is
// right in the "is this dependency used" direction -- a mention keeps it
// declared -- and wrong in this one: a commented-out import of a package that
// was removed years ago is not an undeclared dependency.
const withoutComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");

for (const file of sources) {
  const text = withoutComments(fs.readFileSync(file, "utf8"));
  for (const match of text.matchAll(SPECIFIER)) {
    const name = packageOf(match[1]);
    if (!name) continue;
    imported.add(name);
    if (!importedBy.has(name)) importedBy.set(name, []);
    const rel = path.relative(ROOT, file).replaceAll("\\", "/");
    if (importedBy.get(name).length < 3) importedBy.get(name).push(rel);
  }
}

// --- 1. declared but unused, imported but undeclared --------------------------

const declared = new Set([...Object.keys(deps), ...Object.keys(peers)]);

const unused = [...declared].filter((name) => !imported.has(name)).sort();
if (unused.length)
  add(
    "declared but never imported",
    `${unused.join(", ")}\n    Drop them, or point at what uses them. A dependency nothing imports is\n    weight in every consumer's install.`,
  );

// Node builtins are already filtered; @types/* are devDependencies by nature
// and are imported as types through tsconfig rather than by specifier.
const undeclared = [...imported]
  .filter(
    (name) =>
      !declared.has(name) &&
      !(name in devs) &&
      !name.startsWith("@types/") &&
      // Self-references: some modules import the package by its own name.
      name !== pkg.name,
  )
  .sort();

if (undeclared.length)
  add(
    "imported but declared nowhere",
    undeclared
      .map((name) => `${name}  (${importedBy.get(name).join(", ")})`)
      .join("\n    ") +
      "\n    These resolve today only through the consumer's own tree.",
  );

// --- 2. peer / devDependency version drift ------------------------------------

// The manifest's own note: every non-required peer is mirrored in
// devDependencies, because pnpm installs neither peers nor optional peers and
// the build, tests and Storybook need a concrete copy.
const isOptional = (name) => meta[name]?.optional === true;

const missingOptional = Object.keys(peers)
  .filter((name) => isOptional(name) && !(name in devs))
  .sort();

if (missingOptional.length)
  add(
    "optional peer with no devDependency mirror",
    `${missingOptional.join(", ")}\n    package.json promises every non-required peer is mirrored -- pnpm installs\n    neither peers nor optional peers, so the build, the tests and Storybook have\n    no copy to run against.`,
  );

const missingRequired = Object.keys(peers)
  .filter((name) => !isOptional(name) && !(name in devs))
  .sort();

if (missingRequired.length)
  add(
    "required peer with no devDependency mirror",
    `${missingRequired.join(", ")}\n    These resolve transitively today, so the tests run against whatever version\n    another package happened to pull in -- not against the declared range.`,
  );

// Only an exact-vs-exact mismatch, or a caret range whose major the dev copy
// does not match, is drift. `peer ^19.0.0` against `dev 19.2.8` is the normal
// arrangement: a range for consumers, a pin for this repository.
const EXACT = /^\d+\.\d+\.\d+/;
const majorOf = (range) => range.match(/(\d+)\./)?.[1];

const drifted = Object.keys(peers)
  .filter((name) => name in devs)
  // A `file:` dev copy against a published peer range is the deliberate
  // arrangement for the vendored tarballs, not drift.
  .filter((name) => !devs[name].startsWith("file:"))
  .filter((name) => {
    const peer = peers[name];
    const dev = devs[name];
    if (peer === dev) return false;
    if (EXACT.test(peer) && EXACT.test(dev)) return true;
    return majorOf(peer) !== majorOf(dev);
  })
  .sort();

if (drifted.length)
  add(
    "peer and devDependency disagree",
    drifted
      .map((name) => `${name}: peer ${peers[name]}, dev ${devs[name]}`)
      .join("\n    ") +
      "\n    What is tested here is the dev copy; what a consumer gets is the peer.",
  );

// --- 3. peerDependenciesMeta ---------------------------------------------------

const strayMeta = Object.keys(meta)
  .filter((name) => !(name in peers))
  .sort();

if (strayMeta.length)
  add(
    "peerDependenciesMeta names a non-peer",
    `${strayMeta.join(", ")}\n    The entry does nothing; the package is not a peer.`,
  );

// --- 4. files ------------------------------------------------------------------

const unmatched = (pkg.files ?? []).filter((pattern) => {
  const literal = pattern.split("*")[0].replace(/\/$/, "");
  return literal && !fs.existsSync(path.join(ROOT, literal));
});

if (unmatched.length)
  add(
    "files entry matches nothing",
    `${unmatched.join(", ")}\n    Either the path moved, or it is generated by a build this check did not run.`,
  );

// --- report --------------------------------------------------------------------

console.log(`manifest -- ${pkg.name}@${pkg.version}`);
console.log(
  `  ${Object.keys(deps).length} dependencies, ${Object.keys(peers).length} peers ` +
    `(${Object.keys(meta).length} optional), ${Object.keys(devs).length} dev`,
);
console.log(`  scanned ${sources.length} source files for import specifiers`);

if (!findings.length) {
  console.log("\nNo manifest findings.");
  process.exit(0);
}

console.log(`\n${findings.length} finding(s):\n`);
for (const { title, detail } of findings) console.log(`  ${title}:\n    ${detail}\n`);
process.exit(1);
