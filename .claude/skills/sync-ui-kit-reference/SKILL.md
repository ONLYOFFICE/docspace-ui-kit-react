---
name: sync-ui-kit-reference
description: Check the DocSpace plugin skill's documentation of this kit (agent-skills/skills/plugin-sdk) against this source, and apply the fixes -- package name, installed range, dist paths, component names, CSS variables, behavioural traps
argument-hint: "[--skills <path>]"
---

# Keep the plugin skill's picture of this kit true

`agent-skills/skills/plugin-sdk` generates and validates DocSpace plugins, and its
`references/ui-kit.md` is hand-written prose about **this** source — prop defaults, which
components carry their own margin, which CSS variables exist. A plugin author reads it instead
of the code, and nothing keeps it honest.

Script: `.claude/scripts/ui-kit-reference/check-drift.mjs`. Read-only; it never writes into the
skill. Background: [.claude/rules/plugin-api.md](../../rules/plugin-api.md).

## Step 1 -- run it

```bash
node .claude/scripts/ui-kit-reference/check-drift.mjs
```

Finds the skill at `../agent-skills`, or `AGENT_SKILLS_ROOT`, or `--skills <path>`, and fails
loudly rather than guessing. Exit 1 on any drift. It checks six things: the package specifier in
`scripts/contract.mjs`, the range the generator installs the kit at, the `dist/` paths the reference
tells authors to read, every PascalCase name it backticks against `docs/plugin-surface.json`,
every CSS variable in its table against this package plus the client's `theme.scss`, and ten
behavioural claims against the components that make them true.

## Step 2 -- fix by category

**Package name.** `UI_KIT_PACKAGE` in `scripts/contract.mjs`. It is not a cosmetic rename: the
portal's shim throws on any bare specifier it does not know, so the skill's value and the
portal's must match exactly. The three repositories renamed it together on 2 October 2026
([plugin-api.md](../../rules/plugin-api.md) has the history); it changes again only when the
portal's shim does.

Anything that touches the specifier, the installed range or the externals list has to be re-verified by
the skill's own suite, `node skills/plugin-sdk/scripts/test-validator.mjs`, and by
`claude plugin validate . --strict` — its CONTRIBUTING requires both. Note that the externals
are written as a **regex** (`/^@onlyoffice\/apps-ui-kit(\/.*)?$/`) in `templates/vite.config`,
the eval fixture and `validator-tests/fixtures.mjs`; a grep for the plain package name does not
find those three, and missing them fails 11 expectations.

**Installed range.** `UI_KIT_RANGE` in `scripts/generator/project-files.mjs` is what a
generated plugin installs from npm, and the bundle keeps the kit external, so it only decides
what the plugin compiles against. Move it with the range the portal installs
(`packages/client/package.json` in DocSpace-client), never ahead of it: a plugin compiled
against a newer kit than the portal bundles can import a name the portal's copy lacks.

**Dist paths.** The reference points at `dist/cjs/**/<Name>.module.scss.js` for a component's
real CSS. That directory does not exist: the build is ESM-only. The equivalent is
`dist/esm/**/<Name>.module.scss/index.js` (the class-name map) with `index.css` beside it —
which is better for the purpose the reference has, since the CSS is a real stylesheet rather
than an inlined string. Rewrite the sentence, do not just swap the path.

**Component names.** A name the barrel no longer exports is advice that fails at the plugin's
`import`. Confirm with `node .claude/scripts/plugin-surface/surface.mjs --json`, then either
restore the export here or rewrite the reference to name the replacement. If the name is
deliberately not a kit export — the SDK has its own `ButtonGroup` and `ButtonSize` — add it to
`NOT_KIT` in the checker with a comment saying whose it is.

**CSS variables.** A promised variable that nothing defines means the reference tells authors
to write a `var()` that silently inherits. Either define it (see
[theming.md](../../rules/theming.md) for which layer it belongs in) or drop it from the table.
The inverse finding — a variable the reference lists as a non-existent trap that now resolves —
means the trap note is stale and someone will keep avoiding a working token.

**Behavioural traps.** A failing claim means the component moved. Decide which side is wrong:
if the component change was intended, rewrite that bullet in `references/ui-kit.md`; if it was
not, this is a regression in a component whose layout plugin authors depend on. Then update the
`CLAIMS` table in the checker so it guards the new truth.

## Step 3 -- what the checker cannot see

Say this out loud in the report rather than implying the file is verified. Unchecked: the
layout prose (kit components wrapping children in flex boxes, doubled margins where a `gap`
meets a component's own margin, the `scale`/`size`-against-container behaviour), the typography
and spacing numbers, and the width table. Those are true or false by reading, and the trigger
for re-reading them is a change to a component's box model — which the `plugin-surface` skill
will not flag either, because the exported name did not change.

## Step 4 -- committing

`agent-skills` is a separate repository whose default branch is `main`. Make the changes on a
branch there and do not commit to `main` without the user saying so. Present the diff and let
them decide when to push.

Its commit convention: one line, imperative, no type prefix.
