#!/usr/bin/env node
/**
 * Decides whether the pre-push gate builds and packs: exits 0 when the commits
 * being pushed touch the build's own code, 1 when they do not. lefthook.yml
 * runs the `package` job `only` when this succeeds.
 *
 * The build is in the gate for one reason -- it is the only place a Windows
 * developer's platform gets tested, and the three Windows-only breakages that
 * reached CI's Linux runners were all in the build's own code. A push that
 * leaves that code alone is built and packed by CI's `package` job instead.
 *
 * When the base of the push cannot be found it says yes: building for nothing
 * costs two minutes, skipping a build that was needed costs a broken release.
 */

import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { committedChangesSince, findPushBase } from "./lib/push-base.mjs";

const repoRoot = path.resolve(fileURLToPath(import.meta.url), "../..");

// Files and directories the build reads as code rather than as input.
const BUILD_FILES = new Set([
  "rollup.config.mjs",
  "package.json",
  "pnpm-lock.yaml",
  "tsconfig.build.json",
]);
const BUILD_DIRS = ["scripts/"];

const touchesBuild = (file) =>
  BUILD_FILES.has(file) || BUILD_DIRS.some((dir) => file.startsWith(dir));

const base = findPushBase(repoRoot);
const changed = base && committedChangesSince(repoRoot, base.sha);

if (!changed) {
  console.log("No base to compare the push with: building and packing.");
  process.exit(0);
}

const reasons = changed.filter(touchesBuild);

if (reasons.length === 0) {
  console.log(
    `No build code changed since ${base.ref}: build and pack left to CI.`,
  );
  process.exit(1);
}

console.log(`Build code changed since ${base.ref}:`);
for (const file of reasons) console.log(`  ${file}`);
process.exit(0);
