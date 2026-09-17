---
name: new-component
description: Scaffold a component folder in this package's shape -- barrel, props with JSDoc, SCSS module using theme tokens, story, test, README -- and register it in the barrel that is the plugin API
argument-hint: "<kebab-name> [--enums]"
---

# Add a component

Script: `.claude/scripts/new-component/scaffold.mjs`. It writes the seven files the house shape
needs and appends the export to `components/index.ts`.

```bash
node .claude/scripts/new-component/scaffold.mjs status-chip --dry-run
node .claude/scripts/new-component/scaffold.mjs status-chip --enums
```

`--enums` adds `<Name>.enums.ts` with a string enum and wires it through the barrel;
`--no-register` leaves `components/index.ts` alone. The scaffold passes `pnpm tsc`,
`pnpm lint`, `pnpm test` and `pnpm format` as written.

## What registering actually does

`components/index.ts` feeds the root `index.ts`, and **the root barrel is the DocSpace plugin
UI API in full** ([plugin-api.md](../../rules/plugin-api.md)). So the moment the component is
registered, its name and its props type are public to every plugin author, and taking either
away later breaks them with no compile error anywhere. Confirm what was added:

```bash
node .claude/scripts/plugin-surface/surface.mjs
```

If the component is portal-specific or not ready to be committed to, scaffold with
`--no-register` and say why.

## Then fill in, in this order

1. **Props and their JSDoc.** One line per prop. This is the entire documentation a plugin
   author gets — they read the emitted `.d.ts`, not this repository. A prop with no comment is
   a prop nobody outside the client will use correctly.
2. **The SCSS.** Only theme tokens; no hex, no physical `left`/`right`
   ([theming.md](../../rules/theming.md)). The scaffold's `var(--<name>-gap, 8px)` is the
   pattern for a knob of your own: always a fallback, always a row in the story's table.
   Check any token you add against the client before relying on it —
   `node .claude/scripts/audit-tokens/audit.mjs --changed`.
3. **The story.** Every component needs one, and the story carries the docs: the feature list,
   the accessibility notes and the CSS-variable table. Replace `UI/TODO section/` with the real
   Storybook section — look at a neighbouring component rather than inventing one.
4. **The test.** `vitest.config.ts` collects `components/**`, so a test here runs. It would not
   under `billing/`, `uploader/`, `document-editor/` or `api/`
   ([component-authoring.md](../../rules/component-authoring.md)).
5. **The README.** It ships in the published package (`files` in `package.json`), so a TODO
   left here is a TODO in the artifact. Ten components already have none — do not add an
   eleventh gap.

## Conventions the scaffold encodes, so you notice if you diverge

- `ref` is an ordinary prop (`ref?: React.Ref<…>`). React 19; `forwardRef` is legacy here.
- `testId` with a default, rendered as `data-testid`. Not `dataTestId` — `card` spells it that
  way and is the outlier, not the pattern.
- The barrel re-exports the component, its props type and its enums. Wrapper HOCs go in the
  barrel, not in the component file — that is how `Button` acquires `withTooltip`.
- Enums are string enums whose members equal their own names.
- Two-space indentation, LF. A file must never mix tabs and spaces.

## Finish

```bash
pnpm tsc && pnpm lint && pnpm test
node .claude/scripts/plugin-surface/surface.mjs
```

Storybook (`pnpm storybook`) is the environment for the visual half; it needs `pnpm sync-locales`
to have run once in a fresh clone, or it fails on the missing `css/fonts.css`.
