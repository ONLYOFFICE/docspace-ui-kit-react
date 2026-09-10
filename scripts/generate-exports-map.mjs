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

// Inserts one exact `publishConfig.exports` key per real module subpath,
// generated fresh from `dist/` on every build.
//
// A single `"./*"` wildcard cannot serve this package: it ships two
// incompatible module shapes side by side depending on how each source file
// happens to be organised -- `billing/utils/common.ts` (flat file) and
// `context/InterfaceDirectionContext/index.tsx` (folder-with-index) both
// exist throughout components/, billing/, selectors/, utils/, hooks/.
// Per the ES module spec, the exports-array fallback (`["./dist/esm/*.js",
// "./dist/esm/*/index.js"]`) only skips an entry on a condition mismatch,
// never on a missing file -- confirmed with a minimal Node repro. Whichever
// pattern is listed first is required to exist for every subpath, so a
// wildcard always breaks one shape or the other. This was invisible while
// the package was consumed as a pnpm workspace dependency, because that
// resolves straight into source and never looks at `exports` at all.
//
// This writes only the `package.json` text between the `"./*.js": {` marker
// (kept as the last static entry) and its preceding sibling -- a plain
// JSON.parse/stringify round-trip of the whole file would reformat unrelated
// fields (key ordering, whitespace) and produce a diff with nothing to do
// with exports.
//
// Run after `finalize-dist.mjs` (needs the format markers in place) and
// before `check-dist.mjs`.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
);
const DIST = path.join(ROOT, "dist");
const PKG_PATH = path.join(ROOT, "package.json");

const isSvgFile = (rel) => rel.endsWith(".svg.js");

const listModules = (dir) => {
  const files = new Set();
  const dirsWithIndex = new Set();

  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      const rel = path.relative(dir, full);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (!entry.name.endsWith(".js") || isSvgFile(rel)) continue;

      if (entry.name === "index.js") {
        dirsWithIndex.add(path.dirname(rel));
      } else {
        files.add(rel.slice(0, -".js".length));
      }
    }
  };

  walk(dir);

  return { files, dirsWithIndex };
};

const esm = listModules(path.join(DIST, "esm"));
const cjs = listModules(path.join(DIST, "cjs"));

const allFiles = new Set([...esm.files, ...cjs.files]);
const allDirs = new Set([...esm.dirsWithIndex, ...cjs.dirsWithIndex]);

const collisions = [...allFiles].filter((f) => allDirs.has(f));

if (collisions.length > 0) {
  console.error(
    "Subpaths built as both a flat file and a folder-with-index -- pick one shape:\n" +
      collisions.map((c) => `  ${c}`).join("\n"),
  );
  process.exit(1);
}

const toPosix = (p) => p.split(path.sep).join("/");

// A module can be types-only: tsc emits declarations for the whole source
// tree regardless of rollup's SHIPPING_DIRS entry-point list, so
// `types/index.ts` and `types/ai.ts` (re-exported portal type declarations,
// never containing a runtime value) have a `.d.ts` in dist/types but no `.js`
// anywhere in dist/esm or dist/cjs. `import type { X } from
// "@onlyoffice/apps-ui-kit/types"` is a real, used subpath, so it still needs
// an exports entry -- just one with no `default` target.
const listTypeOnlyModules = (dir, knownFiles, knownDirs) => {
  const files = new Set();
  const dirsWithIndex = new Set();

  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      const rel = path.relative(dir, full);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (!entry.name.endsWith(".d.ts") || isSvgFile(rel)) continue;
      // *.types.d.ts is already served by the static "./*.types" pattern.
      if (entry.name.endsWith(".types.d.ts")) continue;

      if (entry.name === "index.d.ts") {
        const subpath = toPosix(path.dirname(rel));
        if (!knownDirs.has(subpath)) dirsWithIndex.add(subpath);
      } else {
        const subpath = toPosix(rel.slice(0, -".d.ts".length));
        if (!knownFiles.has(subpath)) files.add(subpath);
      }
    }
  };

  walk(dir);

  return { files, dirsWithIndex };
};

const typesOnly = listTypeOnlyModules(
  path.join(DIST, "types"),
  new Set([...allFiles].map(toPosix)),
  new Set([...allDirs].map(toPosix)),
);

const entryForFile = (subpath) =>
  `      "./${subpath}": {
        "import": {
          "types": "./dist/types/${subpath}.d.mts",
          "default": "./dist/esm/${subpath}.js"
        },
        "require": {
          "types": "./dist/types/${subpath}.d.ts",
          "default": "./dist/cjs/${subpath}.js"
        }
      },\n`;

const entryForDir = (subpath) =>
  `      "./${subpath}": {
        "import": {
          "types": "./dist/types/${subpath}/index.d.mts",
          "default": "./dist/esm/${subpath}/index.js"
        },
        "require": {
          "types": "./dist/types/${subpath}/index.d.ts",
          "default": "./dist/cjs/${subpath}/index.js"
        }
      },\n`;

const entryForTypesOnlyFile = (subpath) =>
  `      "./${subpath}": {
        "import": "./dist/types/${subpath}.d.mts",
        "require": "./dist/types/${subpath}.d.ts"
      },\n`;

const entryForTypesOnlyDir = (subpath) =>
  `      "./${subpath}": {
        "import": "./dist/types/${subpath}/index.d.mts",
        "require": "./dist/types/${subpath}/index.d.ts"
      },\n`;

const sortedFiles = [...allFiles].map(toPosix).sort();
const sortedDirs = [...allDirs].map(toPosix).sort();
const sortedTypesOnlyFiles = [...typesOnly.files].sort();
const sortedTypesOnlyDirs = [...typesOnly.dirsWithIndex].sort();

const generatedBlock =
  sortedFiles.map(entryForFile).join("") +
  sortedDirs.map(entryForDir).join("") +
  sortedTypesOnlyFiles.map(entryForTypesOnlyFile).join("") +
  sortedTypesOnlyDirs.map(entryForTypesOnlyDir).join("");

const pkgText = fs.readFileSync(PKG_PATH, "utf8");

// A dedicated placeholder key, not a JSON comment (package.json has none),
// so a fresh checkout (before the first build) still parses as valid JSON.
// Re-inserting it right after the freshly generated block keeps every run
// idempotent: the block between the previous sibling and this line is always
// exactly what the last `generate-exports-map.mjs` run produced.
const PLACEHOLDER_LINE_RE =
  /^ {6}"\.\/__generated_exports_placeholder__": ".*",\n/m;

if (!PLACEHOLDER_LINE_RE.test(pkgText)) {
  console.error(
    'Could not find the "./__generated_exports_placeholder__" line in package.json.',
  );
  process.exit(1);
}

const placeholderLine = pkgText.match(PLACEHOLDER_LINE_RE)[0];
const nextText = pkgText.replace(
  PLACEHOLDER_LINE_RE,
  generatedBlock + placeholderLine,
);

// Guard against a regex/JSON mismatch (e.g. the placeholder line was hand-
// edited) silently producing invalid JSON.
JSON.parse(nextText);

fs.writeFileSync(PKG_PATH, nextText);

const total =
  sortedFiles.length +
  sortedDirs.length +
  sortedTypesOnlyFiles.length +
  sortedTypesOnlyDirs.length;

console.log(
  `Generated ${total} exact export entries ` +
    `(${sortedFiles.length} files, ${sortedDirs.length} folders, ` +
    `${sortedTypesOnlyFiles.length + sortedTypesOnlyDirs.length} types-only) ` +
    "in publishConfig.exports.",
);
