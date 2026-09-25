---
name: release-check
description: Full pre-merge sweep -- the CI gate, plus the checks nothing runs: manifest invariants, the plugin API surface diff, drift against the plugin skill, what the tarball would actually ship, and (before a publish) that every vendored peer is already on npm
argument-hint: "[--quick]"
---

# Before merging or publishing

CI runs two jobs: lint/tsc/test, and build + `verify:package`. Everything below that is not in
either one, and each gap has a repository of its own to fail in.

Run in this order; stop and report at the first hard failure rather than running the rest.

## 1 -- the gate CI runs

```bash
pnpm tsc && pnpm lint && pnpm test
pnpm build && pnpm verify:package
```

`verify:package` packs with **pnpm** — `publishConfig` overrides are a pnpm feature, and an
npm-packed tarball has no `exports` and no `main`, so every check fails for the wrong reason.
`pnpm build` ends in `scripts/check-dist.mjs`: no bundled dependencies, every emitted module an
`index` file, and a `"use client"` in dist for each of the 55 modules that declare one.

Skip this section with `--quick` only when the gate has already run on this exact tree.

## 2 -- manifest invariants

```bash
node .claude/scripts/release-check/manifest.mjs
```

Four promises `package.json` makes in prose: no dependency nothing imports, no import nothing
declares, every optional peer mirrored in `devDependencies` (pnpm installs neither, so the dev
copy is what the tests actually run against), `peerDependenciesMeta` naming only real peers, and
every `files` entry matching something.

DocSpace-client's `dependencies.test.js` used to catch the first two; it no longer scans this
package ([source-checks.md](../../rules/source-checks.md)).

Known and currently open: `i18next` and `react-i18next` are required peers with no dev mirror.
They resolve transitively and satisfy their ranges, so this is a note, not a blocker — but the
tests run against a version nothing here chose.

## 3 -- the plugin API surface

```bash
node .claude/scripts/plugin-surface/surface.mjs
```

The root barrel is the DocSpace plugin UI API in full, and a removal breaks plugins with no
compile error in this repository or in the client — so a clean `pnpm tsc` on both sides proves
nothing here. Exit 1 means a name was removed or changed kind. The `plugin-surface` skill covers
how to read and explain the diff; update `docs/plugin-surface.json` in the same commit when the
removal is intended.

## 4 -- drift against the plugin skill

```bash
node .claude/scripts/ui-kit-reference/check-drift.mjs
```

`agent-skills/skills/plugin-sdk` documents this kit for plugin authors: the package specifier,
a vendored tarball, prop defaults and layout traps. Nothing keeps it fresh. It is clean against
its own `feature/ui-kit-separation` branch and stale against `main` by design — the rename lands
in all three repositories at once ([plugin-api.md](../../rules/plugin-api.md)), so check which
branch is out before reading the result. A **new** finding blocks: it means this change
invalidated documentation somebody is reading right now.

## 5 -- what the change adds stylistically

```bash
node .claude/scripts/audit-tokens/audit.mjs --changed --base <merge-base>
```

`--changed`, never the full run: the full run reports a standing backlog that this change did
not cause.

## 6 -- read the file list

```bash
pnpm pack --dry-run
```

Read it, do not skim it. `locales/` is vendored and committed, and the build no longer runs the
copy scripts, so this list is literally what a publish ships. Check: `locales/en` present,
`dist/esm`, `dist/types` and `dist/styles.css` present, per-component `README.md` files present,
and nothing from `css/`, `fonts/` or `storybook-static/`.

## 7 -- publish order (before a publish only)

```bash
node .claude/scripts/release-check/registry.mjs
```

A vendored package (a tarball committed beside `package.json`, installed as a `file:`
devDependency) has to be on npm **before** this one is published: consumers never see the dev
copy, only the peer range, and a peer range can only be met from a registry. `@onlyoffice/ai-chat`
is the one this applies to today, and it is not on npm yet. Its peer range is a placeholder until
then — fixed to the published version at publish time, not during merges.

The script fails on a `file:` spec in `dependencies` or `peerDependencies`, on a vendored peer
missing from npm, and on a peer range that no published version satisfies (npm resolves the
range, so a prerelease such as `0.5.130-docs.8` does not meet `^0.5.121`). It needs the network;
exit 2 means the registry could not be asked, not that the check passed.

Before a merge, a "not on npm" finding here is expected: report it as a standing note, not a
blocker. Before a publish it blocks.

## Report

Lead with whether it is safe to merge, then the findings by section. Be explicit about which
standing issues you did **not** treat as blockers and why — a report that lists section 4's
three known drift findings as if this change caused them is worse than one that omits them.

Say what you ran and what you skipped. "Section 1 was skipped, the gate ran on this tree in CI"
is a fine sentence; silently not running it is not.
