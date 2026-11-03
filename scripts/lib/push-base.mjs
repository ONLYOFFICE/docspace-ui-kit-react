// Where the commits being pushed begin: the merge base with the branch's
// upstream, or with origin/master when it has none yet -- a first push.
//
// Shared by the pre-push steps that narrow what they check to what a push
// changed (scripts/test-changed.mjs, scripts/push-touches-build.mjs). Lefthook
// has a notion of push files of its own, but it reads them from
// `git diff HEAD @{push}`, which a branch with no upstream cannot answer: it
// reports no files at all, and every step filtered on them is skipped on
// exactly the push that introduces a branch. origin/master is the widest
// sensible base -- a branch cut from a release branch then counts the release
// branch's own commits too, which can only make a step run when it need not.
//
// Returns null when neither ref exists. Callers treat that as "everything
// changed" rather than guess.

import { spawnSync } from "node:child_process";

const git = (cwd, ...args) => {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
};

export function findPushBase(cwd) {
  const upstream = git(
    cwd,
    "rev-parse",
    "--abbrev-ref",
    "--symbolic-full-name",
    "@{upstream}",
  );

  for (const ref of [upstream, "origin/master"]) {
    if (!ref) continue;
    const sha = git(cwd, "merge-base", "HEAD", ref);
    if (sha) return { sha, ref };
  }

  return null;
}

/** Files the commits from `sha` to HEAD touch, repository-relative, POSIX. */
export function committedChangesSince(cwd, sha) {
  const out = git(cwd, "diff", "--name-only", sha, "HEAD");
  return out === null ? null : out.split("\n").filter(Boolean);
}
