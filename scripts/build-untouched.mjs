#!/usr/bin/env node
/**
 * Decides whether the pre-push gate may skip building and packing: exits 0
 * when the branch leaves the build's own code alone, and 1 when it touches it.
 * lefthook.yml `skip`s the `package` job when this succeeds.
 *
 * "The branch" is everything that differs from where it left what it is pushed
 * to (scripts/lib/push-base.mjs): the commits being pushed, and the working
 * tree as well, the way `vitest --changed` sees it in the test step. On a push
 * the working tree is not what is sent, so counting it can only add a build;
 * run by hand with `pnpm gate` before a commit, it is what keeps an edited
 * rollup.config.mjs from being skipped.
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

import { touchesBuild } from "./lib/build-inputs.mjs";
import { changesSince, findPushBase } from "./lib/push-base.mjs";

const repoRoot = path.resolve(fileURLToPath(import.meta.url), "../..");

const base = findPushBase(repoRoot);
const changed = base && changesSince(repoRoot, base.sha);

// No base, no answer: build.
if (!changed) process.exit(1);

process.exit(changed.some(touchesBuild) ? 1 : 0);
