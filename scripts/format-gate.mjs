#!/usr/bin/env node
/**
 * The pre-push formatting gate: fixes what it can, then reports honestly.
 *
 * `prettier --check` only names the offenders and leaves the developer to run
 * the fix themselves. This runs the fix for them -- but it still exits non-zero
 * when it had to change something, because a pre-push hook cannot rewrite the
 * commits being pushed. Letting the push through after rewriting the working
 * tree would send the unformatted commits to the remote and leave a dirty
 * checkout behind, which is worse than stopping.
 *
 * Only files Prettier actually disagrees with are touched. Unrelated
 * work-in-progress in the tree is left exactly as it is, so the message below
 * names the files the developer has to fold into a commit and nothing else.
 *
 * Node rather than a shell pipeline: this gate runs on Windows too -- see
 * .claude/rules/cross-platform.md -- and Prettier is invoked through
 * process.execPath and its own .cjs entry point, not the node_modules/.bin
 * shim, which is a shell script on POSIX and a .cmd there.
 */

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(fileURLToPath(import.meta.url), "../..");
const require = createRequire(import.meta.url);

let prettierBin;
try {
  prettierBin = require.resolve("prettier/bin/prettier.cjs");
} catch {
  console.error(
    "Prettier is not installed. Run `pnpm install` before pushing.",
  );
  process.exit(1);
}

const runPrettier = (args) =>
  spawnSync(process.execPath, [prettierBin, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });

// --list-different names every file whose formatting differs, and nothing else.
// It respects .prettierignore, so pnpm-lock.yaml, locales/, css/ and *.mdx stay
// out of scope here exactly as they do for `pnpm format`.
//
// --cache skips files already known to be formatted: about 25 seconds over the
// whole tree uncached, five or so once warm. The strategy is `content` -- a
// checkout or a rebase rewrites mtimes without changing a byte -- spelled out
// so a change of Prettier's default cannot quietly turn it into mtime. The
// cache is keyed on the Prettier and Node versions and the options, so an
// upgrade or a .prettierrc change starts it afresh.
//
// The location is this gate's own, not Prettier's default: every Prettier run
// WITHOUT --cache deletes the default cache file -- `pnpm format`, the
// pre-commit hook, an editor running the CLI -- so the gate found it gone on
// nearly every push.
const CACHE_LOCATION = path.join(
  repoRoot,
  "node_modules",
  ".cache",
  "prettier",
  "format-gate",
);

const listed = runPrettier([
  "--list-different",
  "--cache",
  "--cache-strategy",
  "content",
  "--cache-location",
  CACHE_LOCATION,
  ".",
]);

if (listed.error) {
  console.error(`Could not run Prettier: ${listed.error.message}`);
  process.exit(1);
}

// 0 is clean and 1 is "some files differ". Anything else -- 2 for a file
// Prettier cannot parse -- goes to stderr with nothing on stdout, and would
// otherwise read as zero offenders and pass the gate.
if (listed.status !== 0 && listed.status !== 1) {
  console.error("Prettier failed before it could check the formatting:");
  console.error(listed.stderr ?? "");
  process.exit(1);
}

const offenders = (listed.stdout ?? "")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

if (offenders.length === 0) process.exit(0);

const fixed = runPrettier(["--write", "--ignore-unknown", ...offenders]);

if (fixed.status !== 0) {
  console.error("Prettier could not rewrite these files:");
  for (const file of offenders) console.error(`  ${file}`);
  console.error(fixed.stderr ?? "");
  process.exit(1);
}

const plural = offenders.length === 1 ? "file" : "files";
console.error(`Prettier reformatted ${offenders.length} ${plural}:`);
for (const file of offenders) console.error(`  ${file}`);
console.error("");
console.error(
  "They are fixed in your working tree, but the commits you are pushing still",
);
console.error(
  "carry the unformatted version. Fold the fix in and push again, for example:",
);
console.error("");
console.error("  git add -A && git commit --amend --no-edit");
console.error("");
console.error("or `git add -A && git commit` if it belongs in its own commit.");
process.exit(1);
