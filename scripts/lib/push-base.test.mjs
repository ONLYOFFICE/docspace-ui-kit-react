// The pre-push gate skips tests and the build on what these functions say, and
// a wrong answer fails nothing: it only leaves a check out. So the answers are
// pinned here, against a throwaway repository with the refs a real clone has.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { touchesBuild } from "./build-inputs.mjs";
import {
  baseAgainst,
  changesSince,
  findBranchBase,
  findPushBase,
  isCommit,
} from "./push-base.mjs";

let dir;

const git = (...args) => {
  const result = spawnSync(
    "git",
    [
      "-c",
      "user.name=test",
      "-c",
      "user.email=test@example.com",
      "-c",
      "commit.gpgsign=false",
      ...args,
    ],
    { cwd: dir, encoding: "utf8" },
  );
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};

const commit = (file, content = file) => {
  fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
  fs.writeFileSync(path.join(dir, file), content);
  git("add", "--", file);
  git("commit", "-q", "-m", file);
  return git("rev-parse", "HEAD");
};

// A remote-tracking ref without a remote: enough for for-each-ref and merge-base.
const remoteRef = (name, sha) => git("update-ref", `refs/remotes/${name}`, sha);

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "push-base-"));
  git("init", "-q", "-b", "master");
});

afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

describe("findPushBase", () => {
  it("takes the long-lived branch the feature is fewest commits ahead of", () => {
    const root = commit("a");
    remoteRef("origin/master", root);
    commit("b");
    const release = commit("c");
    remoteRef("origin/release/v1", release);
    git("switch", "-q", "-c", "feature");
    commit("d");

    expect(findPushBase(dir)).toEqual({
      sha: release,
      ref: "origin/release/v1",
      ahead: 1,
    });
  });

  it("prefers the upstream once the branch has one", () => {
    const root = commit("a");
    remoteRef("origin/master", root);
    git("switch", "-q", "-c", "feature");
    const pushed = commit("b");
    remoteRef("origin/feature", pushed);
    // What `git push -u` records; with no remote to talk to, written by hand.
    git("config", "remote.origin.url", dir);
    git("config", "remote.origin.fetch", "+refs/heads/*:refs/remotes/origin/*");
    git("config", "branch.feature.remote", "origin");
    git("config", "branch.feature.merge", "refs/heads/feature");
    commit("c");

    expect(findPushBase(dir)).toMatchObject({
      sha: pushed,
      ref: "origin/feature",
      ahead: 1,
    });
  });

  it("returns null with nothing to compare with", () => {
    commit("a");
    expect(findPushBase(dir)).toBeNull();
  });
});

// check-readme's `--base origin/<target>` in CI.
describe("baseAgainst", () => {
  it("starts after the target branch merged into the feature", () => {
    commit("a");
    git("switch", "-q", "-c", "feature");
    commit("components/mine.ts");
    git("switch", "-q", "master");
    const target = commit("components/theirs.ts");
    remoteRef("origin/release/v1", target);
    git("switch", "-q", "feature");
    git("merge", "-q", "--no-edit", "master");

    const base = baseAgainst(dir, "origin/release/v1");

    expect(base?.sha).toBe(target);
    expect(changesSince(dir, base?.sha ?? "")).toEqual(["components/mine.ts"]);
  });

  it("returns null when the history at hand has no common commit", () => {
    commit("a");
    git("switch", "-q", "--orphan", "other");
    remoteRef("origin/other", commit("b"));
    git("switch", "-q", "master");

    expect(baseAgainst(dir, "origin/other")).toBeNull();
  });
});

describe("isCommit", () => {
  it("tells a branch from a typo", () => {
    remoteRef("origin/release/v1", commit("a"));

    expect(isCommit(dir, "origin/release/v1")).toBe(true);
    expect(isCommit(dir, "origin/relase/v1")).toBe(false);
  });
});

describe("findBranchBase", () => {
  it("ignores the upstream and returns the branch's parent", () => {
    const root = commit("a");
    remoteRef("origin/master", root);
    git("switch", "-q", "-c", "feature");
    const pushed = commit("b");
    remoteRef("origin/feature", pushed);
    git("config", "remote.origin.url", dir);
    git("config", "remote.origin.fetch", "+refs/heads/*:refs/remotes/origin/*");
    git("config", "branch.feature.remote", "origin");
    git("config", "branch.feature.merge", "refs/heads/feature");
    commit("c");

    expect(findBranchBase(dir)).toEqual({
      sha: root,
      ref: "origin/master",
      ahead: 2,
    });
  });
});

describe("changesSince", () => {
  it("lists committed, unstaged and untracked files once each", () => {
    const base = commit("a");
    commit("components/x.ts");
    fs.writeFileSync(path.join(dir, "a"), "edited");
    fs.writeFileSync(path.join(dir, "rollup.config.mjs"), "new");

    expect(changesSince(dir, base).sort()).toEqual([
      "a",
      "components/x.ts",
      "rollup.config.mjs",
    ]);
  });

  // check-readme's `--base HEAD^1`: in CI, the first parent of a pull
  // request's merge commit.
  it("takes a revision as well as a sha", () => {
    commit("a");
    commit("components/x.ts");

    expect(changesSince(dir, "HEAD^1")).toEqual(["components/x.ts"]);
  });

  it("returns null for a commit git does not know", () => {
    commit("a");
    expect(changesSince(dir, "0".repeat(40))).toBeNull();
  });
});

describe("touchesBuild", () => {
  it.each([
    "rollup.config.mjs",
    "package.json",
    "pnpm-lock.yaml",
    "tsconfig.json",
    "tsconfig.build.json",
    "scripts/check-dist.mjs",
    "scripts/lib/push-base.mjs",
  ])("counts %s as the build's code", (file) => {
    expect(touchesBuild(file)).toBe(true);
  });

  it.each([
    "components/button/Button.tsx",
    "docs/scripts/x.mjs",
    "components/package.json",
    ".claude/scripts/review/review-scope.mjs",
  ])("leaves %s to CI", (file) => {
    expect(touchesBuild(file)).toBe(false);
  });
});
