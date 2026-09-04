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

// Runs the two packaging validators against a real tarball.
//
// Both are invoked through `npx --yes` rather than added as devDependencies:
// the repository's dependencies test detects usage by scanning for
// import/require/from literals, and a CLI-only tool has none, so declaring
// them would be reported as an unused dependency and fail the push. Adding
// them properly means an allowlist entry on the client side -- tracked as debt.
//
// The tarball MUST be produced by pnpm. `publishConfig` field overrides are a
// pnpm feature; `npm pack` leaves them unapplied, so an npm-packed tarball has
// no `exports` and no `main` and every check reports total failure for the
// wrong reason. That is debt B-8, and it is why `attw --pack .` is useless here.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PKG_DIR = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
);

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", ...opts });

const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ui-kit-verify-"));

try {
  console.log("Packing with pnpm (publishConfig applied)...");
  run("pnpm", ["pack", "--pack-destination", outDir], { cwd: PKG_DIR });

  const tarball = fs
    .readdirSync(outDir)
    .filter((f) => f.endsWith(".tgz"))
    .map((f) => path.join(outDir, f))[0];

  if (!tarball) throw new Error("pnpm pack produced no tarball");

  // A packed package with no entry points is the failure mode B-8 describes;
  // catch it here rather than discovering it after publishing.
  const packed = JSON.parse(
    run("tar", ["xzOf", tarball, "package/package.json"]),
  );

  for (const field of ["main", "exports"]) {
    if (!packed[field]) {
      console.error(
        `The packed package.json has no "${field}". publishConfig was not ` +
          "applied -- do not publish this tarball.",
      );
      process.exitCode = 1;
    }
  }

  console.log(`\n=== publint ===`);
  try {
    console.log(run("npx", ["--yes", "publint", tarball]));
  } catch (error) {
    console.log(error.stdout ?? String(error));
    process.exitCode = 1;
  }

  console.log(`=== attw ===`);
  try {
    // styles.css is excluded, not ignored globally: a CSS entry point has
    // neither types nor JavaScript, so attw reports NoResolution for it in all
    // four resolution modes. Verified to be a tool limitation rather than a
    // defect here -- react-toastify, correctly published and widely used, gets
    // the identical result for its own CSS exports. Excluding the entry keeps
    // `no-resolution` active for every other export, which `--ignore-rules`
    // would not.
    console.log(
      // The tarball goes first: --exclude-entrypoints is variadic and would
      // otherwise swallow the path as another entry point name.
      run("npx", [
        "--yes",
        "@arethetypeswrong/cli",
        tarball,
        "--exclude-entrypoints",
        "styles.css",
      ]),
    );
  } catch (error) {
    console.log(error.stdout ?? String(error));
    process.exitCode = 1;
  }
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
