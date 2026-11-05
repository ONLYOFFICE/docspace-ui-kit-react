// Where the commits being pushed begin.
//
// Shared by the pre-push steps that narrow what they check to what a push
// changed (scripts/test-changed.mjs, scripts/build-untouched.mjs). Lefthook
// has a notion of push files of its own, but it reads them from
// `git diff HEAD @{push}`, which a branch with no upstream cannot answer: it
// reports no files at all, and every step filtered on them is skipped on
// exactly the push that introduces a branch.
//
// A branch with an upstream is compared with it: what differs is what this push
// sends. A branch pushed for the first time has none, so it is compared with
// the long-lived branch it was most likely cut from -- of master, develop,
// release/* and hotfix/* on origin, the one HEAD is fewest commits ahead of.
// origin/master alone is not good enough: a branch cut from release/v4.1.0 was
// 749 commits and 1631 files ahead of it and 1 commit and 22 files ahead of its
// real parent, so every step ran as if the whole release had changed.
//
// Returns null when no candidate exists. Callers treat that as "everything
// changed" rather than guess.

import { spawnSync } from "node:child_process";

const git = (cwd, ...args) => {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
};

// Prefix patterns: `refs/remotes/origin/release` matches every release/* ref.
const LONG_LIVED = [
  "refs/remotes/origin/master",
  "refs/remotes/origin/develop",
  "refs/remotes/origin/release",
  "refs/remotes/origin/hotfix",
];

const baseAgainst = (cwd, ref) => {
  const sha = git(cwd, "merge-base", "HEAD", ref);
  if (!sha) return null;
  const count = git(cwd, "rev-list", "--count", `${sha}..HEAD`);
  // Checked before converting: Number(null) is 0, which would make a ref git
  // could not count the nearest of all.
  if (count === null) return null;
  const ahead = Number(count);
  return Number.isNaN(ahead) ? null : { sha, ref, ahead };
};

export function findPushBase(cwd) {
  const upstream = git(
    cwd,
    "rev-parse",
    "--abbrev-ref",
    "--symbolic-full-name",
    "@{upstream}",
  );

  if (upstream) {
    const base = baseAgainst(cwd, upstream);
    if (base) return base;
  }

  const refs = (
    git(cwd, "for-each-ref", "--format=%(refname:short)", ...LONG_LIVED) ?? ""
  )
    .split("\n")
    .filter(Boolean);

  let nearest = null;

  for (const ref of refs) {
    const base = baseAgainst(cwd, ref);
    if (base && (!nearest || base.ahead < nearest.ahead)) nearest = base;
  }

  return nearest;
}

/**
 * Files that differ from `sha` -- committed, staged, unstaged or untracked --
 * repository-relative and POSIX; null when git cannot say.
 *
 * The working tree counts, as it does for `vitest --changed`, so the steps of
 * one gate agree on what changed. On a push it only adds work; run by hand
 * (`pnpm gate`) before a commit, it is what makes an edited rollup.config.mjs
 * build instead of being skipped.
 */
export function changesSince(cwd, sha) {
  const tracked = git(cwd, "diff", "--name-only", sha);
  const untracked = git(cwd, "ls-files", "--others", "--exclude-standard");
  if (tracked === null || untracked === null) return null;
  return [...new Set(`${tracked}\n${untracked}`.split("\n").filter(Boolean))];
}
