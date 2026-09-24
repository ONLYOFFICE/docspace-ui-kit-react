---
name: review-branch
description: Review the current branch against its parent branch -- resolves the base automatically, traces reachability through the barrels and the plugin API, runs the checks nothing here enforces, and reports ranked findings
argument-hint: "[<baseBranch>] [--save] [--fetch]"
---

# Review a branch against its parent

Read-only code review of everything the current branch adds on top of its base.
Never edits, never commits, never pushes -- the output is findings.

Script (run from the repository root): `.claude/scripts/review/review-scope.mjs`.
It is the DocSpace-client script of the same name without the submodule half --
this repository has none since the split.

## Step 1 -- resolve the scope

```bash
node .claude/scripts/review/review-scope.mjs $ARGUMENTS
```

It prints the base branch and how it was resolved, the merge-base, the commits
(merges excluded), the diffstat, any new component folders, and **the checks the
changed paths call for**, with the commands already filled in. Base resolution
order:

1. `$ARGUMENTS` -- an explicit branch name (`release/v4.0.0`)
2. `git config branch.<current>.reviewBase` -- a base pinned for this branch
3. `reviewBase` in `.claude/scripts/review/config.local.json` (gitignored)
4. **auto-detect** -- of every `release/*`, `hotfix/*`, `develop`, `master`,
   `main` ref (local and remote), the candidate whose fork point is closest to
   HEAD, i.e. leaves the fewest commits on our side. Ties go to the more
   specific pattern.

Flags: `--save` (pin the resolved base for this branch), `--fetch` (refresh refs
first -- do this when the script warns the local base lags origin), `--diff`,
`--max-diff-lines N`.

Sanity-check the auto-detected base against the runners-up. `feature/*` branches
here merge `release/*` into themselves regularly, so the closest fork point is
usually right -- but a branch that was cut from `develop` and later merged a
release will pick the release. If the pick is implausible, re-run with an
explicit base rather than review the wrong range. **State the resolved base in
your report** -- the whole review is relative to it.

A diff of thousands of files (the separation branch against `master` is one)
is not reviewable as a whole. Say so, and review by commit or by folder
(`git diff <base>...HEAD -- components/<name>`) instead of skimming.

## Step 2 -- get the actual diff

```bash
git diff <base>...HEAD
```

Three dots -- our side only, not the base's own movement.

The reverse of the client's rule holds here: **a change made in this repository
reaches DocSpace-client only as a swapped tarball**, and nothing in the client
recompiles this source. So a breaking change here produces no error on either
side until someone packs, installs and opens the screen. That is why the
consumer-facing checks in step 4 matter more than they would in the client.

## Step 3 -- read the changed files whole, then trace reachability

Never judge a hunk from the diff alone. For each changed file: read it in full,
then find out how it is actually reached.

- **Who renders or calls this, here?** `git grep -n "<Symbol>" -- "*.ts" "*.tsx"`.
  Components compose each other (selectors use `components/`, `billing/` uses
  `api/`), so an internal caller is the first thing to check.
- **Is it public?** Follow the barrels: `components/<name>/index.ts` ->
  `components/index.ts` -> root `index.ts`. Anything reachable from the root
  barrel is the DocSpace plugin UI API
  ([plugin-api.md](../../rules/plugin-api.md)), and a prop or default changed
  there changes behaviour for plugins nobody here can see. The tier of each
  module is in `docs/public-api.md`; portal-coupled modules (`ai-agent`, `api`,
  `billing`, `selectors`, `uploader`, `document-editor`) are consumed by the
  client only.
- **How does the client use it?** When the client checkout is at
  `../DocSpace/client` (or `DOCSPACE_CLIENT_ROOT`), grep it for the symbol --
  `git -C ../DocSpace/client grep -n "<Symbol>" -- packages`. The real prop
  shapes live there, not in the stories. If the client is not available, say
  that the consumer side is unverified.
- **Does a helper's predicate actually mean what its name says?**
  (`includes("ai")` is not `=== AI_TOOLS`.)

This step is what separates a real finding from a guess. If you cannot
establish reachability, say the finding is unverified instead of asserting it.

## Step 4 -- the checks nothing runs

The pre-push gate (`format:gate`, `lint`, `tsc`, `test`, `build`,
`verify:package`) and CI cover formatting, lint, types, tests and packaging.
**Everything below is outside both**, and the client suite that used to catch
some of it no longer scans this source
([source-checks.md](../../rules/source-checks.md)). Run the ones step 1 listed
for this diff; the table says what each one guards.

| Check                           | How                                                                                                                                                                                                                                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Plugin API surface**          | `node .claude/scripts/plugin-surface/surface.mjs`. A removed or re-kinded name is a blocker unless `docs/plugin-surface.json` is updated in the same change on purpose. See the `plugin-surface` skill                                                                                                                          |
| **Tokens, hex, RTL**            | `node .claude/scripts/audit-tokens/audit.mjs --changed --base <merge-base>`. Always `--changed`: the full run is a standing backlog this branch did not cause. Needs the client checkout, or every portal token reads as undefined ([theming.md](../../rules/theming.md))                                                       |
| **Manifest and packaging**      | when `package.json`, `rollup.config.mjs` or `scripts/` changed: `node .claude/scripts/release-check/manifest.mjs`, then `pnpm build && pnpm verify:package` ([packaging.md](../../rules/packaging.md)) -- `exports`, peers, per-module CSS, `"use client"`                                                                      |
| **Component docs**              | a new component needs a story and a README -- `node .claude/scripts/component-docs/gaps.mjs`. Stories may live in a subdirectory                                                                                                                                                                                                |
| **Plugin skill drift**          | `node .claude/scripts/ui-kit-reference/check-drift.mjs` when a documented prop default, name or CSS variable moved. A **new** finding blocks; the standing ones do not                                                                                                                                                          |
| **No license header**           | the opposite of the client: new files get **no** AGPL header. Flag one if added                                                                                                                                                                                                                                                 |
| **ASCII-only**                  | no en-dash `–`, typographic quotes, `…`, emoji, NBSP or Cyrillic in `.ts/.tsx` outside comment-leading lines; `.test.`/`.stories.` exempt                                                                                                                                                                                       |
| **Mixed indentation**           | no `.ts/.tsx` file indented with both tabs and spaces                                                                                                                                                                                                                                                                           |
| **i18n**                        | user-facing strings via `t()` with a literal first argument; brand and const names through `getBrandName()` / `getConstName()`, never `t("Common:ProductName")`. Biome's plugins catch the two lint-level cases, not a hardcoded English string                                                                                 |
| **Locale keys**                 | a key added to `locales/en/*.json` must exist in the client's `packages/client/public/locales/en/` file of the same name, or the next `pnpm sync-locales` drops it (`Common.json` keeps only keys the client has; `Payments.json` and `Settings.json` are copied whole). Flag as a follow-up for the client, not a blocker here |
| **Assets**                      | a new icon under `assets/` is referenced by basename and mirrored into the client's `public/images/` with the same name, path and content                                                                                                                                                                                       |
| **Dependencies**                | declared where it belongs (`dependencies` / `peerDependencies` / `devDependencies`), actually imported, and an optional peer mirrored in `devDependencies`                                                                                                                                                                      |
| **`ref` as a prop**             | no new `forwardRef`; `ref?: React.Ref<...>` in the props type ([component-authoring.md](../../rules/component-authoring.md))                                                                                                                                                                                                    |
| **Cross-platform**              | a changed `package.json` script or `scripts/*.mjs` must not call `rm`, `cp`, `VAR=x cmd`, pipes or a Unix tool; ids through `toPosix` ([cross-platform.md](../../rules/cross-platform.md))                                                                                                                                      |
| **Absolute paths and trailers** | no `/Users/...` or `C:\Users\...` in anything committed; no `Co-Authored-By` in commit messages (`git log <base>..HEAD --format=%B`)                                                                                                                                                                                            |

## Step 5 -- verify mechanically

Run what is cheap and targeted; do not run the whole gate unless the diff
warrants it.

```bash
pnpm exec biome lint <changed files>
pnpm exec prettier --check <changed files>
pnpm exec vitest run <changed or related test files>
```

Add `pnpm tsc` when types changed, and `pnpm build && pnpm verify:package` when
anything in the packaging surface did. Report what you ran and what it said --
including "nothing was run" when nothing was.

If the changed code has no test and is unit-testable, say so and name the test
that would guard it (`components/<name>/<Name>.test.tsx`; check
`vitest.config.ts` for what is actually collected). Keyboard handling, focus
management and anything under `billing/` without a regression test are worth
calling out on their own.

## Step 6 -- report

Ranked most severe first, in the language the user wrote in. For each finding:

- **Severity** -- high (correctness, a broken plugin API, money, security, data
  loss), medium (behaviour or UX wrong, a11y regression, theme or RTL broken,
  design drift, brittle structure), low, nit.
- **Where** -- a clickable `[Button.tsx:42](components/button/Button.tsx#L42)`
  link.
- **What breaks** -- a concrete failing input, not a category. "`max={5}` and
  ArrowUp from 5 renders 6" beats "bounds are not enforced".
- **Who sees it** -- this repository's Storybook only, the client, or plugins.
- **The fix** -- a short code block when it fits in a few lines.
- **Provenance** -- mark a finding as pre-existing when the branch did not
  introduce it, and say why it is still in scope (it usually is when it shares
  the bug class the branch set out to fix).

Open with the scope (base branch, size of the diff) and one honest sentence on
whether the change does what it claims. Close with which findings are merge
blockers and which are follow-ups -- including any follow-up that has to land
in DocSpace-client or `agent-skills` rather than here.

Do not pad the list. A finding you could not verify against real call sites is
either labeled as unverified or left out.
