---
name: audit-deps
description: Find and fix vulnerable dependencies in this package -- audits the lockfile, says which findings ship to consumers and which stay in the dev tooling, picks the right fix for each, refreshes the lockfile and verifies the result
argument-hint: "[--level <low|moderate|high|critical>]"
---

# Audit and fix vulnerable dependencies

Script (from the repository root): `.claude/scripts/audit-deps/audit-deps.mjs`. Ported from
DocSpace-client's `.claude/scripts/audit/audit-deps.mjs`; a fix to the shared logic belongs in
both.

## What is different about a published package

An override in `pnpm-workspace.yaml` rewrites **this repository's lockfile only**. It is not
published. DocSpace and every other consumer resolve the package's `dependencies` and
`peerDependencies` against their own lockfile, so:

| Finding reaches the tree through                       | Who is exposed                                      | The fix that actually helps                                                                       |
| ------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `devDependencies` only (Storybook, vitest, serve, ...) | this repository: CI, the Storybook build, local dev | bump the dev dependency, else override here                                                       |
| `dependencies` / `peerDependencies`                    | **every consumer**                                  | raise the declared range in `package.json`; if a dependency pins it, a release of that dependency |

The script prints `reach: RUNTIME` or `reach: dev only` for every finding. For a runtime finding
an override here only cleans this audit - **say so in the report**, and say which upstream release
the real fix waits for. DocSpace-client carries its own overrides, so it is usually covered;
plugin authors and other consumers are not.

## Step 1 -- audit

```bash
node .claude/scripts/audit-deps/audit-deps.mjs                 # severity >= moderate
node .claude/scripts/audit-deps/audit-deps.mjs --level low
node .claude/scripts/audit-deps/audit-deps.mjs --json
```

Read-only. Exit 1 means findings at or above `--level`, ignoring documented exceptions.

## Step 2 -- pick the fix

The script sorts each finding:

- `direct dependency - bump it ... in:` - a manifest range still admits a vulnerable version.
  Bump it there. A peer range raised to the fix is a consumer-visible change; check that
  DocSpace-client already resolves at least that version (`grep "^  <pkg>@" pnpm-lock.yaml` in
  the client) before publishing. Bump lockstep families together: `storybook` with
  `@storybook/*`, `vitest` with `@vitest/*`.
- `also pulled in by:` - a parent brings its own copy. Add an override (Step 3) and name that
  parent in the comment, so it can be dropped when the parent lifts its pin.
- `documented exception` - the advisory id is already explained in `pnpm-workspace.yaml`. A
  finding you decide not to fix gets the same: its GHSA id and the reason next to the overrides,
  and in `auditConfig.ignoreGhsas` so `pnpm audit` agrees.
- `note: the fix crosses a major` - under 0.x every minor counts (katex 0.17 -> 0.18). Do not
  force it in a hotfix; it changes what consumers render.

An inclusive bound (`<=16.4.0`) is itself vulnerable; the script looks up the next release.

Never run `pnpm audit --fix` unattended - it crosses majors in the manifest.

## Step 3 -- the override trap

A selector (`"minimatch@^3"`) only narrows which dependents are rewritten; the replacement is
resolved on its own. `"minimatch@^3": ">=3.1.4"` resolves to minimatch 10. Bound the replacement
to the installed major (`"^3.1.4"`) - the script prints the bounded form and warns when several
majors coexist.

## Step 4 -- apply and verify

```bash
pnpm install --lockfile-only    # resolve, then inspect: grep "^  <pkg>@" pnpm-lock.yaml
pnpm install
node .claude/scripts/audit-deps/audit-deps.mjs --level low
```

A version younger than the release-age window is refused; wait, or add a **version-pinned**
entry to `minimumReleaseAgeExclude` with a comment.

Then the gate, since a bumped dev dependency is exactly what it exercises:

```bash
pnpm tsc && pnpm lint && pnpm test
pnpm build && pnpm verify:package
pnpm storybook-build            # when Storybook or vite moved
```

Commit `package.json`, `pnpm-workspace.yaml` and `pnpm-lock.yaml` together.

## Step 5 -- report

Per finding: what was vulnerable, runtime or dev, the fix, how it was verified. Call out
explicitly every runtime finding fixed only by an override here, with the upstream package and
release it waits for, and every finding left open with the reason.
