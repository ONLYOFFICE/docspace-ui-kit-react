#!/usr/bin/env node
/**
 * The pre-push test step: runs the unit tests a branch's changes can reach,
 * not all of them.
 *
 * `vitest --changed <commit>` takes the files that differ from <commit> --
 * committed or not -- and runs every test whose import graph reaches one of
 * them. The commit is where this branch left what it is pushed to: the merge
 * base with its upstream, or on a first push with the long-lived branch it was
 * cut from (scripts/lib/push-base.mjs). A change to the setup file, the mocks,
 * the English strings, the lockfile or the configuration reaches every test
 * without being imported by any; those are `forceRerunTriggers` in
 * vitest.config.mts and run the whole suite.
 *
 * CI runs the whole suite on every pull request (`pnpm test`), so what this
 * leaves out is still checked before a merge -- it only moves out of the push.
 * When no base can be found it runs everything rather than guess.
 *
 * Node rather than a shell pipeline: this runs on Windows too -- see
 * .claude/rules/cross-platform.md -- and Vitest is started through
 * process.execPath and its own bin, not the node_modules/.bin shim.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { findPushBase } from "./lib/push-base.mjs";

const repoRoot = path.resolve(fileURLToPath(import.meta.url), "../..");

const base = findPushBase(repoRoot);

const vitestDir = path.join(repoRoot, "node_modules", "vitest");
const { bin } = JSON.parse(
  fs.readFileSync(path.join(vitestDir, "package.json"), "utf8"),
);
const vitestBin = path.join(
  vitestDir,
  typeof bin === "string" ? bin : bin.vitest,
);

const args = ["run", "--project=unit"];

if (base) {
  console.log(
    `Running the unit tests affected since ${base.ref} (${base.sha.slice(0, 10)}).`,
  );
  // No test reaching a change is a pass, not "no test files found".
  args.push("--changed", base.sha, "--passWithNoTests");
} else {
  console.log(
    "No upstream or long-lived branch to compare with: running every test.",
  );
}

const result = spawnSync(process.execPath, [vitestBin, ...args], {
  cwd: repoRoot,
  stdio: "inherit",
});

if (result.error) {
  console.error(`Could not run Vitest: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
