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
// component. Reported rather than enforced, because the fix is still an open
// decision (debt B-10); enforcing it now would leave the build permanently red.
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
const inDist = countDirective(DIST, [".js"]);

if (inDist < inSource) {
  console.warn(
    `\n  WARNING: "use client" is in ${inSource} source files and ${inDist} ` +
      "built files.\n  Rollup strips module-level directives, so Next.js App " +
      "Router consumers will\n  break on the first interactive component. " +
      "See debt B-10.\n",
  );
}
