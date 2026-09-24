// Resolve the review scope for the current branch: which base branch to diff
// against, what the branch adds on top of it, and which of this repository's
// unenforced checks the changed paths call for.
//
// A port of DocSpace-client's .claude/scripts/review/review-scope.mjs without
// the submodule half -- this repository has none since the split.
//
// Read-only except for `--save`, which records the resolved base in git config.
//
//   node .claude/scripts/review/review-scope.mjs
//   node .claude/scripts/review/review-scope.mjs release/v4.0.0
//   node .claude/scripts/review/review-scope.mjs --diff --max-diff-lines 4000
//   node .claude/scripts/review/review-scope.mjs --save --fetch
//
// Exit 1 only when git fails or no base can be found.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_CONFIG = {
  // Branch-name patterns that may act as a base, most specific first. The
  // order also breaks ties when two candidates fork at the same commit.
  basePatterns: ["release/*", "hotfix/*", "develop", "master", "main"],
  // A candidate this many commits behind HEAD's fork point is treated as an
  // ancestor of a better candidate rather than the fork itself.
  maxCommitsAhead: 500,
  maxDiffLines: 3000,
};

const loadConfig = () => {
  let cfg = { ...DEFAULT_CONFIG };
  for (const name of ["config.json", "config.local.json"]) {
    const file = path.join(SCRIPT_DIR, name);
    if (!existsSync(file)) continue;
    try {
      cfg = { ...cfg, ...JSON.parse(readFileSync(file, "utf8")) };
    } catch (e) {
      console.error(`[review-scope] ignoring bad ${name}: ${e.message}`);
    }
  }
  return cfg;
};

const git = (repo, args, { allowFail = false } = {}) => {
  try {
    return execFileSync("git", ["-C", repo, ...args], {
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", allowFail ? "ignore" : "pipe"],
    }).trim();
  } catch (e) {
    if (allowFail) return "";
    throw new Error(`git ${args.join(" ")} failed in ${repo}: ${e.message}`);
  }
};

const matches = (name, pattern) =>
  pattern.endsWith("/*")
    ? name.startsWith(pattern.slice(0, -1))
    : name === pattern;

const patternRank = (name, patterns) => {
  const i = patterns.findIndex((p) => matches(name, p));
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

/** Every local + remote ref that looks like a base branch. */
const candidates = (repo, patterns, current) => {
  const refs = git(repo, [
    "for-each-ref",
    "--format=%(refname:short)",
    "refs/heads",
    "refs/remotes",
  ])
    .split("\n")
    .filter(Boolean)
    .filter((r) => !r.endsWith("/HEAD"));

  const seen = new Map();
  for (const ref of refs) {
    // Collapse origin/develop and develop onto one candidate.
    const bare = ref.replace(/^origin\//, "");
    if (bare === current) continue;
    if (patternRank(bare, patterns) === Number.MAX_SAFE_INTEGER) continue;
    // Prefer the local ref when both exist; it is what the user works with.
    if (!seen.has(bare) || !ref.startsWith("origin/")) seen.set(bare, ref);
  }
  return [...seen.entries()].map(([bare, ref]) => ({ bare, ref }));
};

/**
 * The parent branch is the candidate whose fork point is closest to HEAD --
 * the one that leaves the fewest commits on our side. Ties go to the more
 * specific pattern (release/* before develop before master).
 */
const detectBase = (repo, current, cfg) => {
  const scored = [];
  for (const { bare, ref } of candidates(repo, cfg.basePatterns, current)) {
    const mergeBase = git(repo, ["merge-base", ref, "HEAD"], {
      allowFail: true,
    });
    if (!mergeBase) continue;
    const ahead = Number(
      git(repo, ["rev-list", "--count", `${mergeBase}..HEAD`]),
    );
    if (!Number.isFinite(ahead) || ahead > cfg.maxCommitsAhead) continue;
    scored.push({
      bare,
      ref,
      ahead,
      rank: patternRank(bare, cfg.basePatterns),
    });
  }
  scored.sort((a, b) => a.ahead - b.ahead || a.rank - b.rank);
  return scored;
};

const resolveBase = (repo, current, cfg, explicit) => {
  if (explicit) return { base: explicit, source: "argument", ranked: [] };

  const perBranch = git(repo, ["config", `branch.${current}.reviewBase`], {
    allowFail: true,
  });
  if (perBranch)
    return {
      base: perBranch,
      source: `git config branch.${current}.reviewBase`,
      ranked: [],
    };

  if (cfg.reviewBase)
    return { base: cfg.reviewBase, source: "config file", ranked: [] };

  const ranked = detectBase(repo, current, cfg);
  if (!ranked.length) return { base: null, source: "none", ranked };
  return { base: ranked[0].ref, source: "auto-detected", ranked };
};

// Which of the checks nothing runs (.claude/rules/source-checks.md) a changed
// path calls for. Each entry names the command, so the skill can run exactly
// the ones that apply instead of the whole sweep.
const CHECKS = [
  {
    when: (f) => f === "index.ts" || /(^|\/)index\.ts$/.test(f),
    what: "plugin API surface -- a barrel changed",
    run: "node .claude/scripts/plugin-surface/surface.mjs",
  },
  {
    when: (f) => /\.(scss|css|tsx?)$/.test(f),
    what: "undefined tokens, hex, physical left/right",
    run: "node .claude/scripts/audit-tokens/audit.mjs --changed --base <merge-base>",
  },
  {
    when: (f) =>
      f === "package.json" ||
      f === "rollup.config.mjs" ||
      f.startsWith("scripts/"),
    what: "manifest invariants and packaging (.claude/rules/packaging.md)",
    run: "node .claude/scripts/release-check/manifest.mjs && pnpm build && pnpm verify:package",
  },
  {
    when: (f) => f.startsWith("locales/en/"),
    what: "locale keys -- the client's Common.json must carry them too",
    run: "git diff <base>...HEAD -- locales/en",
  },
  {
    when: (f) => /^components\/[^/]+\/(index\.ts|[^/]+\.tsx)$/.test(f),
    what: "component docs -- story and README for new components",
    run: "node .claude/scripts/component-docs/gaps.mjs",
  },
  {
    when: (f) => f.startsWith("components/") && /\.tsx?$/.test(f),
    what: "plugin skill drift -- prop defaults and names it documents",
    run: "node .claude/scripts/ui-kit-reference/check-drift.mjs",
  },
];

const VALUE_FLAGS = new Set(["--max-diff-lines"]);
const BOOL_FLAGS = new Set(["--diff", "--save", "--fetch"]);

const parseArgs = (argv) => {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (VALUE_FLAGS.has(arg)) {
      flags[arg] = argv[i + 1] ?? null;
      i += 1;
    } else if (BOOL_FLAGS.has(arg)) {
      flags[arg] = true;
    } else if (arg.startsWith("--")) {
      throw new Error(`unknown flag ${arg}`);
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional };
};

const main = () => {
  const cfg = loadConfig();
  const { flags, positional } = parseArgs(process.argv.slice(2));
  const maxDiffLines = Number(flags["--max-diff-lines"]) || cfg.maxDiffLines;
  const explicit = positional[0] ?? null;

  const repo = git(process.cwd(), ["rev-parse", "--show-toplevel"]);

  if (flags["--fetch"]) {
    console.error("[review-scope] fetching...");
    git(repo, ["fetch", "--all", "--quiet"], { allowFail: true });
  }

  const head = git(repo, ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (head === "HEAD")
    throw new Error("detached HEAD -- check out the branch to review");

  const { base, source, ranked } = resolveBase(repo, head, cfg, explicit);
  if (!base) throw new Error("no base branch found -- pass one explicitly");

  console.log(`Branch: ${head}`);
  const alts = ranked
    .slice(1, 4)
    .map((c) => `${c.ref} (+${c.ahead})`)
    .join(", ");
  console.log(
    `Base: ${base}  [${source}]${alts ? `   runners-up: ${alts}` : ""}`,
  );

  const mergeBase = git(repo, ["merge-base", base, "HEAD"]);
  console.log(`Merge-base: ${mergeBase}`);

  // A local base that lags its remote makes unrelated commits look like ours.
  if (!base.startsWith("origin/")) {
    const remote = git(repo, ["rev-parse", "--verify", `origin/${base}`], {
      allowFail: true,
    });
    if (remote) {
      const behind = Number(
        git(repo, ["rev-list", "--count", `${base}..origin/${base}`], {
          allowFail: true,
        }) || "0",
      );
      if (behind > 0)
        console.log(
          `WARNING: local ${base} is ${behind} commit(s) behind origin/${base} -- consider --fetch.`,
        );
    }
  }

  const dirty = git(repo, ["status", "--porcelain"]);
  if (dirty)
    console.log(
      "NOTE: the working tree has uncommitted changes; they are not in the range below.",
    );

  const range = `${base}...HEAD`;

  console.log(`\n--- commits (${base}..HEAD, merges excluded) ---`);
  console.log(
    git(repo, [
      "log",
      "--oneline",
      "--no-decorate",
      "--no-merges",
      `${base}..HEAD`,
    ]) || "(none)",
  );

  console.log("\n--- stat ---");
  console.log(git(repo, ["diff", "--stat", range]) || "(no changes)");

  const changed = git(repo, ["diff", "--name-only", range])
    .split("\n")
    .filter(Boolean);
  const added = new Set(
    git(repo, ["diff", "--name-only", "--diff-filter=A", range])
      .split("\n")
      .filter(Boolean),
  );

  const newComponents = [
    ...new Set(
      [...added]
        .map((f) => f.match(/^components\/([^/]+)\/index\.ts$/)?.[1])
        .filter(Boolean),
    ),
  ];
  if (newComponents.length)
    console.log(`\nNew component folders: ${newComponents.join(", ")}`);

  const applicable = CHECKS.filter((c) => changed.some(c.when));
  console.log("\n--- checks the changed paths call for ---");
  if (!applicable.length) console.log("(none beyond reading the diff)");
  for (const c of applicable) {
    const cmd = c.run
      .replace("<merge-base>", mergeBase.slice(0, 12))
      .replace("<base>", base);
    console.log(`  ${c.what}\n    ${cmd}`);
  }

  if (flags["--save"]) {
    git(repo, ["config", `branch.${head}.reviewBase`, base]);
    console.log(`\nSaved: branch.${head}.reviewBase = ${base}`);
  }

  if (flags["--diff"]) {
    const diff = git(repo, ["diff", range]);
    const lines = diff ? diff.split("\n").length : 0;
    if (lines > maxDiffLines) {
      console.log(`\n--- diff omitted: ${lines} lines > ${maxDiffLines} ---`);
      console.log(`Request it per path:  git diff ${range} -- <path>`);
    } else if (diff) {
      console.log(`\n--- diff (${range}) ---`);
      console.log(diff);
    }
  }

  console.log(`\nSCOPE: ${range}`);
};

try {
  main();
} catch (e) {
  console.error(`[review-scope] ${e.message}`);
  process.exit(1);
}
