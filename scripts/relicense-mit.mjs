// Removes the per-file AGPL headers, so this package declares its licence the
// way @onlyoffice/ai-chat does: once in package.json, once in LICENSE, once in
// the README, and not in 1285 source files.
//
// Safe to run here specifically: the monorepo's license-header check calls
// getWorkSpaces({ excludeUiKit: true }) (common/tests/utils/license.js), so
// libs/ui-kit has never been in its scope -- despite what
// .claude/rules/source-checks.md says.
//
// Scoped to ui-kit deliberately: the rest of the monorepo stays AGPL, so the
// client-side bulk tool (common/scripts/update-license-headers.py) must not be
// pointed at this directory.
//
// Two header forms exist, and both have to go:
//
//   1. The current block form, `/* ... */` carrying an SPDX marker,
//      occasionally preceded by a "use client" directive. It can appear twice
//      in one file (image-editor/ButtonDelete did).
//   2. An older run of `//` lines with no SPDX marker, opening either with
//      "(c) Copyright Ascensio System SIA" or straight into "This program is
//      a free software product." 78 files still carried this one after the
//      first sweep, because the sweep only knew about form 1.
//
// Both are recognised by the licence grant itself rather than by their
// opening line, so a third punctuation variant would still be caught.
// CRLF is preserved, since biome.json specifies it.
//
//   node scripts/relicense-mit.mjs --dry-run
//   node scripts/relicense-mit.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  "storybook-static",
  "locales",
  "css",
  "fonts",
  "coverage",
]);

const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".scss"];

// This file spells the grant out in GRANT and in AGPL_BLOCK, so the "still
// carries the grant after replacement" guard below would always fire on it.
// Its own header was removed by hand.
const SKIP_FILES = new Set([path.resolve(ROOT, "scripts", "relicense-mit.mjs")]);

const GRANT = "GNU Affero General Public License";

// Any block comment carrying the licence grant, plus the blank line that
// follows it. Non-greedy on both sides so a file with the header duplicated
// (image-editor/ButtonDelete has it twice) loses both, not one giant span.
const AGPL_BLOCK =
  /\/\*(?:(?!\*\/)[\s\S])*?GNU Affero General Public License(?:(?!\*\/)[\s\S])*?\*\/\n?\n?/g;

// A leading run of `//` lines. Only removed when the run carries the grant,
// so an ordinary explanatory comment at the top of a file is left alone.
const LEADING_LINE_COMMENTS = /^(?:[ \t]*\/\/[^\n]*\n)+/;


const walk = (dir, found = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), found);
      continue;
    }

    const full = path.join(dir, entry.name);

    if (EXTENSIONS.some((ext) => entry.name.endsWith(ext)) && !SKIP_FILES.has(full)) {
      found.push(full);
    }
  }

  return found;
};

const dryRun = process.argv.includes("--dry-run");

let changed = 0;
let skipped = 0;
const unexpected = [];

for (const file of walk(ROOT)) {
  const raw = fs.readFileSync(file);
  const crlf = raw.includes("\r\n");
  const text = raw.toString("utf8").split("\r\n").join("\n");

  if (!text.includes(GRANT)) {
    skipped += 1;
    continue;
  }

  let next = text.replace(AGPL_BLOCK, "");

  const leading = next.match(LEADING_LINE_COMMENTS);
  if (leading && leading[0].includes(GRANT)) {
    next = next.slice(leading[0].length);
  }

  next = next.replace(/^\n+/, "");

  // A file that still carries the grant means neither pattern matched it --
  // report rather than leave it half-converted.
  if (next.includes(GRANT)) {
    unexpected.push(path.relative(ROOT, file));
    continue;
  }

  changed += 1;

  if (!dryRun) {
    fs.writeFileSync(file, crlf ? next.split("\n").join("\r\n") : next);
  }
}

console.log(
  `${dryRun ? "[dry run] " : ""}stripped AGPL headers from ${changed} files, ` +
    `${skipped} had none.`,
);

if (unexpected.length > 0) {
  console.error(
    `\n${unexpected.length} files still carry the AGPL marker after ` +
      "replacement -- the block pattern did not match:",
  );
  for (const f of unexpected) console.error(`  ${f}`);
  process.exit(1);
}
