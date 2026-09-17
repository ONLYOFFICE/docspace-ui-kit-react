// Three style defects this repository cannot otherwise see, in one pass over
// the SCSS and TSX.
//
//   1. var(--x) that nothing defines -- here or in the client's theme.scss.
//      CSS has no error for this: the declaration is dropped and the property
//      inherits, so the component looks nearly right in light theme and wrong
//      in dark.
//   2. Hardcoded hex. A colour that cannot follow the theme. The client's gate
//      used to catch it; on feature/ui-kit-separation this package is no longer
//      in its scanned workspaces, so nothing does. See .claude/rules/source-checks.md.
//   3. Physical left/right where a logical property belongs. Breaks RTL
//      portals silently; nothing anywhere reports it.
//
//   node .claude/scripts/audit-tokens/audit.mjs            # whole package
//   node .claude/scripts/audit-tokens/audit.mjs --changed   # files in the diff
//   node .claude/scripts/audit-tokens/audit.mjs --base develop --changed
//
// Exit 1 when anything is found. See .claude/rules/theming.md.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const CLIENT_ROOT = process.env.DOCSPACE_CLIENT_ROOT
  ? path.resolve(ROOT, process.env.DOCSPACE_CLIENT_ROOT)
  : path.resolve(ROOT, "../DocSpace/client");

const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);
const argOf = (flag) => {
  const i = argv.indexOf(flag);
  return i === -1 ? undefined : argv[i + 1];
};

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  "storybook-static",
  "coverage",
  "locales",
  "biome-plugins",
]);

const collect = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) collect(full, out);
    } else if (/\.(scss|css|tsx?)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
};

const allFiles = collect(ROOT);

const changedFiles = () => {
  const base = argOf("--base") ?? "HEAD";
  const diff = execFileSync(
    "git",
    ["diff", "--name-only", "--diff-filter=d", base],
    { cwd: ROOT, encoding: "utf8" },
  );
  const untracked = execFileSync(
    "git",
    ["ls-files", "--others", "--exclude-standard"],
    { cwd: ROOT, encoding: "utf8" },
  );
  return [...diff.split("\n"), ...untracked.split("\n")]
    .filter(Boolean)
    .map((p) => path.join(ROOT, p))
    .filter((p) => allFiles.includes(p));
};

const files = has("--changed") ? changedFiles() : allFiles;
const rel = (file) => path.relative(ROOT, file).replaceAll("\\", "/");

// --- what is defined ---------------------------------------------------------

// Always the whole package, never just the changed files: a variable defined in
// ThemeProvider.scss and used in a changed module is defined.
const defined = new Set();
for (const file of allFiles) {
  const text = fs.readFileSync(file, "utf8");

  if (/\.(scss|css)$/.test(file)) {
    for (const m of text.matchAll(/(--[\w-]+)\s*:/g)) defined.add(m[1]);
    continue;
  }

  // A custom property can also be born in TypeScript, and two forms here do:
  // ThemeProvider calls root.style.setProperty("--color-scheme-main-accent"),
  // and several modules hand a plain object of "--x": value pairs to a theme
  // provider. Both define the variable as surely as a stylesheet does.
  for (const m of text.matchAll(/setProperty\(\s*["'`](--[\w-]+)/g))
    defined.add(m[1]);
  for (const m of text.matchAll(/["'](--[\w-]+)["']\s*:/g)) defined.add(m[1]);
}

const themeFile = path.join(CLIENT_ROOT, "packages/shared/styles/theme.scss");
const clientTheme = fs.existsSync(themeFile)
  ? fs.readFileSync(themeFile, "utf8")
  : undefined;

if (clientTheme)
  for (const m of clientTheme.matchAll(/(--[\w-]+)\s*:/g)) defined.add(m[1]);

// A `var(--x, fallback)` still renders when --x is undefined -- that is the
// documented way to declare a consumer-overridable knob, so it is not a defect.
const usedWithoutFallback = (text) =>
  [...text.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map((m) => m[1]);

// --- the three checks ---------------------------------------------------------

const undefinedVars = [];
const hardcodedHex = [];
const physicalDirection = [];

// ai-agent/ bridges to @onlyoffice/ai-chat's own design system: it builds a map
// of that package's tokens out of values that are themselves ai-chat tokens,
// defined inside that package rather than in any stylesheet here. Checking it
// against the portal's token set reports ~200 names that are not the portal's
// to define. Its wiring is verified by rendering the agent, not by this script.
const VAR_CHECK_EXEMPT = /^ai-agent\//;

// Hex belongs in exactly two places: the Sass token source and the theme
// objects. Everywhere else it is a colour that will not follow the theme.
// `themes`, `.test.` and `.stories.` mirror the client's own exemptions.
const HEX_EXEMPT =
  /(themes|\.test\.|\.stories\.|mockData\.|^styles\/variables\/)/;

// `&#160;` is an HTML numeric entity, not a colour, and utils/encoder is full
// of them -- 312 of the 470 raw matches. The client's regex has no such guard
// because the client has no such file.
const HEX = /(?<!&)#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g;

// Only properties with a logical counterpart. `text-align: left` and
// `float: right` are in; `left: 0` on a positioned element is not -- it has no
// logical spelling that browsers agree on, and is often deliberate.
const PHYSICAL = /(?:^|[\s;{])(margin|padding|border)-(left|right)\s*:/;

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    const where = `${rel(file)}:${index + 1}`;

    if (!VAR_CHECK_EXEMPT.test(rel(file)))
      for (const name of usedWithoutFallback(line))
        if (!defined.has(name)) undefinedVars.push({ where, name, line });

    if (!HEX_EXEMPT.test(rel(file)))
      for (const m of line.matchAll(HEX))
        hardcodedHex.push({ where, name: m[0], line });

    if (/\.scss$/.test(file) && PHYSICAL.test(line))
      physicalDirection.push({ where, name: line.trim(), line });
  });
}

// --- report --------------------------------------------------------------------

const scope = has("--changed")
  ? `${files.length} changed file(s)`
  : `${files.length} file(s)`;

console.log(`audit-tokens -- ${scope}`);
console.log(
  clientTheme
    ? `  resolving against this package + ${rel(themeFile)}`
    : `  WARNING: client theme.scss not found at ${CLIENT_ROOT}.\n` +
        "  ~1000 portal tokens will be reported as undefined. Set DOCSPACE_CLIENT_ROOT.",
);

const show = (title, items, note) => {
  if (!items.length) return;
  console.log(`\n${title} (${items.length}):`);
  // Grouped by name: one missing token is usually one mistake repeated.
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.name)) groups.set(item.name, []);
    groups.get(item.name).push(item.where);
  }
  for (const [name, places] of [...groups].sort(
    (a, b) => b[1].length - a[1].length,
  )) {
    console.log(`  ${name}`);
    for (const place of places.slice(0, 6)) console.log(`      ${place}`);
    if (places.length > 6) console.log(`      ... ${places.length - 6} more`);
  }
  if (note) console.log(`  ${note}`);
};

show(
  "Undefined CSS variables -- these inherit silently",
  undefinedVars,
  "Either the name is wrong, or the token has to be added to the client's theme.scss\n  in the same change. A knob of your own takes a fallback: var(--x, 8px).",
);
show(
  "Hardcoded hex -- a colour that cannot follow the theme",
  hardcodedHex,
  "Use styles/variables/_colors.scss, or providers/theme/themes/.\n" +
    "  Not enforced anywhere while the client's suites exclude this package.",
);
show(
  "Physical direction properties -- wrong in RTL portals",
  physicalDirection,
  "Use margin-inline-start / padding-inline-end, or the mixins in\n  styles/mixins/_direction.scss.",
);

const total =
  undefinedVars.length + hardcodedHex.length + physicalDirection.length;

if (!total) console.log("\nNothing found.");
process.exit(total ? 1 : 0);
