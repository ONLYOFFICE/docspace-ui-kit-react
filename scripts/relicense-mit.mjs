/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */


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
// Every header here is the same block form -- `/* ... */`, occasionally
// preceded by a "use client" directive -- so one pattern covers all of them.
// CRLF is preserved, since biome.json specifies it.
//
//   node scripts/relicense-mit.mjs --dry-run
//   node scripts/relicense-mit.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
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

const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".scss"];

const OLD_MARKER = "SPDX-License-Identifier: AGPL-3.0-only";

// Any block comment carrying the AGPL marker, plus the blank line that
// follows it. Non-greedy on both sides so a file with the header duplicated
// (image-editor/ButtonDelete has it twice) loses both, not one giant span.
const AGPL_BLOCK = /\/\*(?:(?!\*\/)[\s\S])*?SPDX-License-Identifier: AGPL-3\.0-only(?:(?!\*\/)[\s\S])*?\*\/\n?\n?/g;


const walk = (dir, found = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), found);
      continue;
    }

    if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      found.push(path.join(dir, entry.name));
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

  if (!text.includes(OLD_MARKER)) {
    skipped += 1;
    continue;
  }

  const next = text.replace(AGPL_BLOCK, "").replace(/^\n+/, "");

  // A file that still carries the old marker means the block pattern missed
  // it -- report rather than leave it half-converted.
  if (next.includes(OLD_MARKER)) {
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
