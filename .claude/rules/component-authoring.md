---
paths:
  - "components/**"
  - "errors/**"
  - "selectors/**"
  - "ai-agent/**"
  - "billing/**"
  - "uploader/**"
---

# Adding or changing a component

## The folder

```
components/<kebab-name>/
  index.tsx            barrel -- 82 of 98 use .tsx, 16 use .ts; either is fine
  <PascalName>.tsx     the component
  <PascalName>.types.ts    props (94 of 98 have one)
  <PascalName>.enums.ts    string enums, when the props need them (13 have one)
  <PascalName>.module.scss
  <PascalName>.stories.tsx
  <name>.test.tsx      lowercase or PascalCase, both exist
  README.md            shipped in the package (`files` in package.json)
```

The README follows [`README_TEMPLATE.md`](../../README_TEMPLATE.md), which is the contract:
a metadata block on line 1, a fixed order of sections, a prop table generated from the JSDoc
between markers, and at least one compiling example. `pnpm check:readme` enforces it and
`scripts/readme-allowlist.json` lists the folders still on the old format. That template is
the source of truth for what a component's documentation says; where it and an older
description of README shape disagree, the template wins.

The barrel re-exports the component, its props type and its enums, and is where a wrapper HOC
is applied — `Button`'s barrel wraps the raw component in `withTooltip`, so `Button.tsx` never
mentions tooltips. Six components do this. Import the wrapped form from `.`, never the raw
`./Button`.

Then add `export * from "./<kebab-name>";` to `components/index.ts` — blank line between
entries, and the file is **not** alphabetical, so append rather than sort.

## Props

- One JSDoc line per prop in `<Name>.types.ts`. This is not decoration: it is the entire
  documentation a plugin author gets, because they read the emitted
  `dist/types/components/<name>/<Name>.types.d.ts` and nothing else
  ([plugin-api.md](plugin-api.md)). It is also the only source of the README's prop table and
  of Storybook's, both generated from it — a prop with no JSDoc is a blank cell in three
  places and `pnpm check:readme` fails on it.
- `@default` only where the default is not a destructuring default in the component itself, for
  instance when a sub-component applies it (`TextInput`'s `maxLength` of 255). The generator
  reads the destructuring, including the `const { … } = props` form in the function body, and
  warns when a `@default` tag contradicts it.
- `@portal` marks a prop that only does something with DocSpace portal context; those render in
  a table of their own rather than among the props a standalone app can use.
- `ref?: React.Ref<HTMLElement>` **as an ordinary prop**. React 19 — `forwardRef` is not
  required and new components should not use it; 20 components still do, which is legacy, not
  a pattern to copy.
- `testId` with a default (`testId = "button"`), rendered as `data-testid`. 63 components carry
  it. Plugin markup has no test ids at all, so this is for the client's own suites.
- Enums are string enums in `<Name>.enums.ts` (`ButtonSize.normal === "normal"`) — the plugin
  validator's kit stub relies on a member resolving to its own name.

## What a change costs elsewhere

A prop default, an outer margin or an intrinsic-size change is a behaviour change for two
audiences that will never see this diff:

- The DocSpace client, which imports by subpath and rebuilds against a packed tarball.
- Plugin authors, whose documentation of these exact traps lives in
  `agent-skills/skills/plugin-sdk/references/ui-kit.md` and is hand-written prose.

Check that file for the component you touched. The traps it records today —
`FieldContainer.labelVisible` defaulting to `false` and its own bottom margin, `ToggleButton`'s
absolutely positioned label with no intrinsic size, `Textarea` having `max-width` but no
`width`, `SearchInput.onChange` receiving a string where every other input receives the event,
`ComboBox` matching by label rather than key, `RowContent` reading children by index — are all
still true, and all still unenforced.

## Stories and tests

- Every component needs a story. `theme-provider` is the only one without; the file may sit in
  a subdirectory (`table`, `rows`, `tiles` do), so search recursively before concluding one is
  missing.
- Stories no longer carry the prose. `parameters.docs.description.component` reads the
  component's own README — `import readme from "./README.md?raw"` — so the page a developer
  opens in Storybook and the file a coding agent reads are the same text, and neither can drift
  from the other. The metadata block and the generator markers are HTML comments and render as
  nothing; verified on the Button docs page.
- What stays in the story is what cannot be written down: the scenarios, the controls, the
  visual-regression surface. Feature lists, accessibility notes and the table of overridable
  `var(--x, fallback)` belong in the README, which is what `package.json` publishes — stories
  are not in the tarball, so a consumer never saw them.
- Tests are Vitest + React Testing Library. **`vitest.config.ts` lists the directories it
  runs** — `components`, `selectors`, `ai-agent`, `errors`, `ui`, `utils`, `context`,
  `providers`, `hooks`. A test placed under `billing/`, `uploader/`, `document-editor/` or
  `api/` is collected by nothing and passes by never running.
- 10 components have no test; that is tolerated, an untested _change_ to interactive logic is
  not. `node .claude/scripts/component-docs/gaps.mjs` lists them, along with the missing
  READMEs and stories.
- `__tests__/` holds 94 Playwright visual-regression specs that run against a built Storybook
  and are **not in CI**. Nothing you push will run them.

## Missing documentation, as of today

Ten components ship with no README: `action-button`, `avatar-editor-dialog`, `card`,
`collapsible-card`, `columnar-info-bar`, `quantity-picker`, `quick-actions`,
`room-logo-cover-dialog`, `room-type`, `two-state-toggle`. `package.json` publishes
`components/**/README.md`, so those are gaps in the shipped package, not just here. The
`component-docs` skill closes them; `node .claude/scripts/component-docs/gaps.mjs` is the
current count.
