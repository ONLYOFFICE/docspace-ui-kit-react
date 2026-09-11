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

// Guards the build output against the defect that used to break it outright:
// third-party packages compiled into dist. A vendored copy ships alongside the
// one npm installs from `dependencies`, which is fatal for anything holding
// module state (i18next, mobx, react-i18next) and merely wasteful for the rest.
//
// Run after `pnpm build`. Exits non-zero with the offending paths.

import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
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
const countDirective = (dir, exts) => {
  let n = 0;

  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (!exts.some((ext) => entry.name.endsWith(ext))) continue;
      if (fs.readFileSync(full, "utf8").includes('"use client"')) n += 1;
    }
  };

  walk(dir);

  return n;
};

const SOURCE_ROOT = path.resolve(DIST, "..");
const SKIP = ["node_modules", "dist", ".git", "storybook-static", "locales"];

const inSource = fs
  .readdirSync(SOURCE_ROOT, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !SKIP.includes(e.name))
  .reduce(
    (sum, e) => sum + countDirective(path.join(SOURCE_ROOT, e.name), [".ts", ".tsx"]),
    0,
  );
// Each source file compiles to both dist/esm and dist/cjs, so the built count
// must be exactly double the source count -- not just "at least as many".
const inDist = countDirective(DIST, [".js"]);
const expectedInDist = inSource * 2;

if (inDist !== expectedInDist) {
  console.error(
    `\n  "use client" is in ${inSource} source files but ${inDist} built files ` +
      `(expected ${expectedInDist} -- one per module per output format).\n  ` +
      "Rollup strips module-level directives, so Next.js App Router consumers " +
      "will\n  break on the first interactive component. Check preserveUseClient " +
      "in rollup.config.mjs.\n",
  );
  process.exit(1);
}

console.log(`"use client" preserved: ${inSource} source files, ${inDist} built files.`);

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
  ["cjs", ".js"],
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
