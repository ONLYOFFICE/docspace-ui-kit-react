---
name: plugin-surface
description: Report what the root barrel exports -- the DocSpace plugin UI API in full -- and diff it against the committed baseline to find names a change removed, renamed or re-kinded
argument-hint: "[--write]"
---

# What this change does to the plugin API

The portal hands a plugin its own mounted copy of this kit through a one-line re-export of the
root barrel, and refuses any subpath import. So **`index.ts` is the plugin UI API in full**, and
a name dropped from it breaks plugins with no compile error in this repository or in
DocSpace-client. Background: [.claude/rules/plugin-api.md](../../rules/plugin-api.md).

Script: `.claude/scripts/plugin-surface/surface.mjs`. Baseline: `docs/plugin-surface.json`.

## Step 1 -- take the diff

```bash
node .claude/scripts/plugin-surface/surface.mjs
```

Reads `index.ts` through the TypeScript API (no build needed, ~2 s), resolves every `export *`
chain, and compares against the baseline. Exit code 1 when something was **removed** or
**changed kind**; 0 for additions and moves.

The four sections mean different things:

| Section | Severity |
|---|---|
| **Removed** | a release blocker. Every plugin importing the name stops compiling, and the failure surfaces in someone else's repository |
| **Kind changed** | usually a break too -- `enum -> variable` survives, `variable -> type` does not (the value is gone at runtime) |
| **Moved between modules** | harmless to plugins; it is still exported. Worth a glance: an unintended move usually means a barrel was edited by hand |
| **Added** | safe, but new names are the ones a plugin author cannot rely on yet -- the portal ships an older build than the author's checkout |

`--json` for the raw data, `--write` to accept the current surface as the new baseline.

## Step 2 -- explain each removal, do not just list it

For every removed name, find out whether it is gone or merely moved out of the barrel:

```bash
git log --oneline -3 -S "<Name>" -- index.ts components/index.ts
grep -rn "export .*\b<Name>\b" --include="*.ts" --include="*.tsx" . | grep -v node_modules
```

- Still exported from its own folder but no longer from `components/index.ts` -> the barrel was
  edited, probably unintentionally. That is the common case and the easy fix.
- Genuinely deleted -> say so, and say what replaces it. A plugin author needs the replacement
  name, not the news.

Then check who would notice, in both consumers:

```bash
grep -rn "\b<Name>\b" --include="*.ts" --include="*.tsx" \
  ../../DocSpace/client/packages 2>/dev/null | head
grep -rn "\b<Name>\b" ../agent-skills/skills/plugin-sdk 2>/dev/null | head
```

The client resolves by subpath, so it can survive a barrel removal that kills every plugin —
a clean `pnpm tsc` there proves nothing about plugins.

## Step 3 -- the external block

The report ends with names declared outside this repository and re-exported anyway. Today:
22 SVG icon components (`assets (*.react.svg)`, via `components/quick-actions/icons.ts` and
`components/nav-menu/icons.ts`) and 6 types from `@onlyoffice/docspace-api-sdk`.

These are real plugin API — a plugin can import `CreateDocumentIcon` by name — and they move
when the dependency or the asset moves, silently. When the count changes, say which package
gained or lost names and whether that was intended; re-exporting a dependency's type from the
barrel is a decision, not usually an accident worth keeping.

## Step 4 -- report, and update the baseline only deliberately

Write the report as: the totals, then removals with their replacement, then anything else worth
a sentence. State plainly whether the change is safe for plugins.

`--write` is not part of reviewing. Run it when the change is agreed and the removals are
intended, commit `docs/plugin-surface.json` in the same commit as the change that moved it, and
name the removed exports in the commit message — that file is the only record plugin authors
have of when a name went away.
