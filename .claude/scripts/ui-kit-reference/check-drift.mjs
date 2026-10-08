// Checks the DocSpace plugin skill's picture of this kit against this kit.
//
// `agent-skills/skills/plugin-sdk/references/ui-kit.md` is hand-written prose
// about *this* source: prop defaults, which components carry their own margin,
// which CSS variables exist. Nothing keeps it honest, and a plugin author reads
// it instead of the code. So: every claim that can be checked mechanically is
// checked here, and the rest is listed for a human to re-read.
//
//   node .claude/scripts/ui-kit-reference/check-drift.mjs
//   AGENT_SKILLS_ROOT=/path/to/agent-skills node .claude/scripts/.../check-drift.mjs
//
// Exits 1 on drift. Read-only -- it never writes into the skill.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const argOf = (flag) => {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
};

const SKILLS_ROOT = path.resolve(
  ROOT,
  argOf("--skills") ?? process.env.AGENT_SKILLS_ROOT ?? "../agent-skills",
);
// scripts/copy-locales.js resolves the same variable from scripts/, so its
// default spells one more level up; this file sits three levels deeper.
const CLIENT_ROOT = process.env.DOCSPACE_CLIENT_ROOT
  ? path.resolve(ROOT, process.env.DOCSPACE_CLIENT_ROOT)
  : path.resolve(ROOT, "../DocSpace/client");

const PLUGIN_SDK = path.join(SKILLS_ROOT, "skills/plugin-sdk");
const REFERENCE = path.join(PLUGIN_SDK, "references/ui-kit.md");
const CONTRACT = path.join(PLUGIN_SDK, "scripts/contract.mjs");

if (!fs.existsSync(REFERENCE)) {
  console.error(
    `No plugin-sdk skill at ${SKILLS_ROOT}.\n` +
      "Pass --skills <path> or set AGENT_SKILLS_ROOT. This check needs the\n" +
      "agent-skills checkout; it deliberately does not guess.",
  );
  process.exit(2);
}

const pkg = JSON.parse(
  fs.readFileSync(path.join(ROOT, "package.json"), "utf8"),
);
const reference = fs.readFileSync(REFERENCE, "utf8");
const read = (file) =>
  fs.existsSync(file) ? fs.readFileSync(file, "utf8") : undefined;

const findings = [];
const ok = [];
const note = (list, label, detail) => list.push({ label, detail });

// --- A. the contract the portal enforces ------------------------------------

const contract = read(CONTRACT) ?? "";
const declaredPackage = contract.match(
  /UI_KIT_PACKAGE\s*=\s*["']([^"']+)["']/,
)?.[1];

if (declaredPackage !== pkg.name)
  note(
    findings,
    "package name",
    `contract.mjs says UI_KIT_PACKAGE = "${declaredPackage}", this package is "${pkg.name}".\n` +
      "    The portal shim throws on any specifier it does not know, so on the day the\n" +
      "    rename ships every plugin built from this skill stops loading.",
  );
else note(ok, "package name", `both say ${pkg.name}`);

// --- B. the vendored tarball -------------------------------------------------

const vendorDir = path.join(PLUGIN_SDK, "vendor");
const vendored = fs.existsSync(vendorDir)
  ? fs.readdirSync(vendorDir).filter((f) => f.endsWith(".tgz"))
  : [];
// The kit tarball is whichever one carries this description; matching on the
// file name would miss it across exactly the rename this check exists to catch.
const kitTarball = vendored.find((file) => {
  try {
    const manifest = execFileSync(
      "tar",
      ["-xzOf", path.join(vendorDir, file), "package/package.json"],
      { encoding: "utf8" },
    );
    const parsed = JSON.parse(manifest);
    return /ui-kit/i.test(parsed.name ?? "") || /ui.kit/i.test(file);
  } catch {
    return false;
  }
});

if (!kitTarball)
  note(findings, "vendored tarball", "no kit tarball in vendor/");
else {
  const manifest = JSON.parse(
    execFileSync(
      "tar",
      ["-xzOf", path.join(vendorDir, kitTarball), "package/package.json"],
      { encoding: "utf8" },
    ),
  );
  if (manifest.name !== pkg.name || manifest.version !== pkg.version)
    note(
      findings,
      "vendored tarball",
      `vendor/${kitTarball} is ${manifest.name}@${manifest.version}, ` +
        `this package is ${pkg.name}@${pkg.version}.\n` +
        "    Re-pack with `pnpm build && pnpm pack` and replace it.",
    );
  else note(ok, "vendored tarball", `${manifest.name}@${manifest.version}`);
}

// --- C. where the skill tells a plugin author to read props and CSS ---------

// The build is ESM-only, and the CSS moved with it. Two spellings send a reader
// to something the package has not shipped since the separation: a dist/cjs path,
// and `<Name>.module.scss.js` -- the CJS build's inlined-CSS-plus-class-map file,
// now a directory holding index.css with the map in index.js beside it.
//
// Scanned across every reference, not just ui-kit.md: the kit is discussed in
// several of them (styles.md carried a stale `.module.scss.js` for exactly this
// reason), and a check that reads one file reports the other as clean.
const referencesDir = path.join(PLUGIN_SDK, "references");

const referenceFiles = fs.existsSync(referencesDir)
  ? fs
      .readdirSync(referencesDir, { recursive: true })
      .filter((name) => String(name).endsWith(".md"))
      .map((name) => path.join(referencesDir, String(name)))
  : [];

const STALE_PATHS = [
  [
    "dist/cjs",
    "the build emits dist/esm and dist/types; there is no CJS output",
  ],
  [
    ".module.scss.js",
    "a component's CSS is now <Name>.module.scss/index.css, with the class-name map in index.js beside it",
  ],
];

const stalePaths = [];
for (const file of referenceFiles) {
  const text = read(file) ?? "";
  for (const [needle, why] of STALE_PATHS)
    if (text.includes(needle))
      stalePaths.push(`${path.basename(file)} points at ${needle} -- ${why}`);
}

if (stalePaths.length) note(findings, "dist layout", stalePaths.join("\n    "));
else
  note(
    ok,
    "dist layout",
    `no CJS-era paths in ${referenceFiles.length} reference file(s)`,
  );

for (const claimed of reference.matchAll(/dist\/types\/[\w/<>.-]+/g)) {
  const shape = claimed[0];
  if (!shape.startsWith("dist/types/components/"))
    note(
      findings,
      "types path",
      `unexpected declaration path claimed: ${shape}`,
    );
}

// --- D. component names the reference talks about ---------------------------

const surfacePath = path.join(ROOT, "docs/plugin-surface.json");
const surface = read(surfacePath);

if (!surface)
  note(
    findings,
    "plugin surface",
    "docs/plugin-surface.json is missing -- run\n" +
      "    `node .claude/scripts/plugin-surface/surface.mjs --write` first.",
  );
else {
  const exported = new Set(Object.keys(JSON.parse(surface).exports));
  // Bold or backticked PascalCase names in the reference are kit components it
  // tells the author to use. A name the barrel no longer exports is advice that
  // fails at the plugin's import statement.
  // ui-kit.md only, deliberately -- unlike the path and variable scans above,
  // which read every reference. The heuristic "a backticked PascalCase name is a
  // kit component" is sound only where the whole file is about the kit. Widening
  // it to components.md and styles.md reported 26 names that were never the
  // kit's: SDK interfaces (IBox, IButton), selector types (TFilesSelector),
  // portal operations (Copy, Download) and JS builtins (AbortController).
  const mentioned = new Set(
    [...reference.matchAll(/`([A-Z][A-Za-z]+)`/g)].map((m) => m[1]),
  );
  // PascalCase names the reference uses that are deliberately not kit exports:
  // they belong to the plugin SDK or to the portal's own runtime. Anything else
  // it backticks is advice that has to resolve from the barrel.
  const NOT_KIT = new Set([
    "ButtonGroup", // the SDK's, passed to setSaveButton -- see the ButtonSize note
  ]);
  const gone = [...mentioned]
    .filter((name) => !exported.has(name) && !NOT_KIT.has(name))
    .sort();

  if (gone.length)
    note(
      findings,
      "components named in the reference",
      `not exported from the barrel: ${gone.join(", ")}`,
    );
  else
    note(
      ok,
      "components named in the reference",
      `${mentioned.size} names, all still exported`,
    );
}

// --- E. CSS variables the reference promises --------------------------------

// Walked in Node rather than shelled out to grep: `grep` is ugrep on some of
// these machines and quietly treats --include as a file argument, which turns
// the scan into "every file in the repository, node_modules included".
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  "storybook-static",
  "coverage",
]);

const scssDefinitions = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name));
      continue;
    }
    if (!entry.name.endsWith(".scss")) continue;
    const text = fs.readFileSync(path.join(dir, entry.name), "utf8");
    for (const match of text.matchAll(/(--[a-z0-9-]+)\s*:/g))
      scssDefinitions.push(match[1]);
  }
};
walk(ROOT);

const clientTheme = read(
  path.join(CLIENT_ROOT, "packages/shared/styles/theme.scss"),
);
const clientDefinitions = clientTheme
  ? [...clientTheme.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1])
  : [];

const defined = new Set([...scssDefinitions, ...clientDefinitions]);

// The variable table is the set the skill tells authors to use. Collected from
// every reference, not from ui-kit.md alone: the table has already moved once
// (into styles.md), and a check bound to one file answered "0 promised, all
// defined" -- passing by measuring nothing, which is worse than failing.
const promised = new Set(
  referenceFiles.flatMap((file) =>
    [...(read(file) ?? "").matchAll(/^\|\s*(`--[^|]+)\|/gm)].flatMap((row) =>
      [...row[1].matchAll(/--[a-z0-9-]+/g)].map((m) => m[0]),
    ),
  ),
);

if (!promised.size)
  note(
    findings,
    "css variables",
    "no variable table found in any reference -- either it moved again, or its\n" +
      "    formatting changed. This check is measuring nothing until that is fixed.",
  );

// And these four it names as traps that must NOT resolve. Source: the "Traps"
// sentence under the table in references/ui-kit.md.
const CLAIMED_ABSENT = ["--error-color", "--success-color", "--border-color"];

const brokenPromises = [...promised].filter((v) => !defined.has(v));
const resurrected = CLAIMED_ABSENT.filter((v) => defined.has(v));

if (!clientTheme)
  note(
    ok,
    "css variables",
    `client theme.scss not found at ${CLIENT_ROOT} -- checked against this package only`,
  );

if (brokenPromises.length)
  note(
    findings,
    "css variables",
    `the reference tells authors to use these, and nothing defines them: ${brokenPromises.join(", ")}`,
  );
else note(ok, "css variables", `${promised.size} promised, all defined`);

if (resurrected.length)
  note(
    findings,
    "css variables",
    `documented as non-existent traps, but now defined: ${resurrected.join(", ")}`,
  );

// --- F. the behavioural traps ------------------------------------------------

// Each entry is a sentence in references/ui-kit.md and the thing in this source
// that makes it true. When a check fails the sentence is now wrong -- fix the
// prose, or the component, depending on which one moved.
const CLAIMS = [
  {
    claim: "FieldContainer.labelVisible defaults to false",
    file: "components/field-container/FieldContainer.tsx",
    expect: /labelVisible\s*=\s*false/,
  },
  {
    claim:
      "FieldContainer carries its own bottom margin, waived by removeMargin",
    file: "components/field-container/FieldContainer.tsx",
    expect: /removeMargin/,
  },
  {
    claim: "ToggleButton's label is absolutely positioned",
    file: "components/toggle-button/ToggleButton.module.scss",
    expect: /position:\s*absolute/,
  },
  {
    claim: "Textarea has a max-width but no intrinsic width",
    file: "components/textarea/Textarea.module.scss",
    expect: /max-width:\s*var\(--textarea-max-width\)/,
  },
  {
    claim: "SearchInput.onChange receives the string, not the event",
    file: "components/search-input/SearchInput.types.ts",
    expect: /onChange\??:\s*\(value:\s*string\)/,
  },
  {
    claim: "ComboBox matches the selected row by label",
    file: "components/combobox/ComboBox.tsx",
    expect: /label === selectedLabel/,
  },
  {
    claim: 'Link maps the literal "accent" to var(--accent-main)',
    file: "components/link/index.tsx",
    expect: /color === "accent" \? "var\(--accent-main\)"/,
  },
  {
    claim: "Text puts `color` straight into the inline style",
    file: "components/text/index.tsx",
    expect: /color,/,
  },
  {
    claim: "RowContent reads its children by index",
    file: "components/rows/row-content/index.tsx",
    expect: /children\[0\]/,
  },
  {
    claim:
      "EmptyView is sized by --empty-view-width / --empty-view-padding-top",
    file: "components/empty-view/EmptyView.module.scss",
    expect: /--empty-view-width[\s\S]*--empty-view-padding-top/,
  },
];

for (const { claim, file, expect } of CLAIMS) {
  const source = read(path.join(ROOT, file));
  if (source === undefined)
    note(findings, "trap", `${claim}\n    -- ${file} no longer exists`);
  else if (!expect.test(source))
    note(findings, "trap", `${claim}\n    -- no longer true in ${file}`);
  else note(ok, "trap", claim);
}

// --- report -------------------------------------------------------------------

console.log(`Reference: ${path.relative(ROOT, REFERENCE)}`);
console.log(`This kit:  ${pkg.name}@${pkg.version}\n`);

for (const { label, detail } of ok) console.log(`  ok    ${label}: ${detail}`);

if (!findings.length) {
  console.log("\nNo drift the checks can see.");
  console.log(
    "Still unchecked by anything: the layout prose (flex wrappers, doubled\n" +
      "margins, widths) and the typography and spacing numbers. Re-read those\n" +
      "sections when a component's box model changed.",
  );
  process.exit(0);
}

console.log(`\n${findings.length} drift finding(s):\n`);
for (const { label, detail } of findings)
  console.log(`  DRIFT ${label}: ${detail}`);
process.exit(1);
