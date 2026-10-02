---
name: audit-tokens
description: Find CSS custom properties that nothing defines, hardcoded hex colours, and physical left/right properties that break RTL -- the three style defects this repository's own gate cannot see
argument-hint: "[--changed] [--base <ref>]"
---

# Style defects nothing here reports

Three things fail silently in this package: a `var(--x)` whose token does not exist (CSS drops
the declaration and the property inherits), a hardcoded hex (a colour that cannot follow the
theme), and a physical `margin-left` (wrong in Hebrew and Arabic portals). Biome's formatter is
off, `pnpm tsc` and `pnpm test` say nothing about any of them, and the DocSpace-client suite
that used to catch two of them **no longer scans this package** —
[source-checks.md](../../rules/source-checks.md) has the per-branch table.

Script: `.claude/scripts/audit-tokens/audit.mjs`. Reference:
[theming.md](../../rules/theming.md).

## Step 1 -- scope it

```bash
node .claude/scripts/audit-tokens/audit.mjs --changed          # what this change adds
node .claude/scripts/audit-tokens/audit.mjs --changed --base develop
node .claude/scripts/audit-tokens/audit.mjs                     # whole package
```

**Default to `--changed`.** The whole-package run reports a standing backlog — 31 undefined
variables, 54 hex, 26 physical properties as of `feature/ui-kit-separation` — and handing that
back as if the change caused it is worse than saying nothing. Exit code is 1 when anything is
found, in either mode.

Set `DOCSPACE_CLIENT_ROOT` if the client is not at `../DocSpace/client`. Without it the
~1 000 portal tokens count as undefined and the first section becomes meaningless; the script
warns when this happens, so read the header line before the findings.

## Step 2 -- undefined variables

Two different bugs wear the same shape:

- **A typo or a wrong name.** `--border-color` for `--border-service-color`. Fix the name.
- **A token that genuinely does not exist yet.** Then it has to be defined, and
  [theming.md](../../rules/theming.md) decides where: `ThemeProvider.scss` here if this package
  owns it, the client's `packages/shared/styles/theme.scss` if the portal does — in the same
  change, or Storybook will be the only place it ever resolves.

A knob of your own is neither: give it a fallback, `var(--card-gap, 8px)`, and the check
ignores it by design. Add the row to the component's story table while you are there.

`ai-agent/` is exempt: it maps `@onlyoffice/ai-chat`'s design system, whose tokens that package
defines. Do not "fix" those by inventing portal tokens.

## Step 3 -- hex

`styles/variables/_colors.scss` and `providers/theme/themes/` are where hex belongs; everywhere
else it is a colour frozen to one theme. `#RGB`-shaped HTML entities (`&#160;`) are already
excluded, as are tests and stories.

For an SVG in JSX, the fill has to come from `currentColor` or a CSS variable — a literal there
is the most common way an icon ends up invisible in dark theme.

## Step 4 -- physical properties

Only properties with a logical counterpart are reported: `margin-left`, `padding-right`,
`border-left` and friends. Replace with `margin-inline-start` / `padding-inline-end`, or the
mixins in `styles/mixins/_direction.scss` (`logical-padding`, `logical-margin`,
`logical-border-radius`); `flip-in-rtl` for a glyph that must mirror.

`left: 0` on a positioned element is deliberately **not** reported — it is often intended, and
there is no logical spelling browsers agree on. Judge those by reading.

## Step 5 -- report

Say which mode you ran. For `--changed`, report every finding — they are all yours. For a full
run, separate what this change introduced from the standing backlog, and do not fix the backlog
unless asked: a sweeping hex replacement across `components/` is a large diff with real visual
risk and no test to catch a wrong token.
