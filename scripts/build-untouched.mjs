#!/usr/bin/env node
/**
 * Decides whether the pre-push gate may skip building and packing: exits 0
 * when the commits being pushed leave the build's own code alone, and 1 when
 * they touch it. lefthook.yml `skip`s the `package` job when this succeeds.
 *
 * The sense is deliberate. Lefthook reads any non-zero exit as "condition not
 * met", and a crash exits non-zero -- so with the condition this way round a
 * script that fails builds, where the opposite (`only` on "the build changed")
 * would skip the build exactly when nothing could tell whether it was needed.
 *
 * The build is in the gate for one reason -- it is the only place a Windows
 * developer's platform gets tested, and the three Windows-only breakages that
 * reached CI's Linux runners were all in the build's own code. A push that
 * leaves that code alone is built and packed by CI's `package` job instead.
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

// No base, no answer: build.
if (!changed) process.exit(1);

process.exit(changed.some(touchesBuild) ? 1 : 0);
