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
between markers, and at least one compiling example. `pnpm check:readme` enforces it, in
pre-push and in CI. Every folder is on the template — `scripts/readme-allowlist.json`, which
held the ones still on the old format during the migration, is now `[]`, and a folder added back
to it is a folder whose documentation stops being checked. That template is the source of truth
for what a component's documentation says; where it and an older description of README shape
disagree, the template wins.

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

**Start with the component's own README.** The generator rewrites the prop table and the gates
fail on a table that has drifted, so the derived half looks after itself. The hand-written half
does not: "Behaviour the types don't state", "Accessibility", "CSS variables" and the recipes are
prose, and nothing in `check:readme` can tell that a sentence has become false. Change what a
component _does_ — not its signature — and those sections are where the lie will sit, green gates
and all. Five of them survived a merge that way: a header described as a `div` after it became an
`<h3>`, a disabled row described as "a colour, not a state" after it started refusing the click,
an `aria-controls` gap described as unclosable after it was closed, a prop called dead after it
became an alias, and storage access described as throwing after it was wrapped. Re-read those four
sections against what you just changed; it takes a minute and it is the only check there is.

A prop default, an outer margin or an intrinsic-size change is also a behaviour change for two
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
- **`STORY_TEMPLATE.md` governs stories, and it is the only file that does.**
  `parameters.docs.description.component` is hand-written in its shape — a short line,
  `### Features`, an optional `### Accessibility`, `### Usage`. Importing the README into it
  with `?raw` was tried on four components and reverted in September 2026: a 260-line page does
  not fit that template, and the four files were an unexplained exception among 146. This rule
  used to state the opposite as settled fact while it was true of four files, which is how a
  colleague following the template ended up contradicted by a rule. If the two ever disagree
  again, `STORY_TEMPLATE.md` wins.
- The consequence is that a component is described in two places by hand, and no gate compares
  them. Correct both in the same commit, and expect the story's half to be the stale one: of the
  two descriptions restored on the revert, one claimed `ModalDialog` traps focus, which it has
  never done.
- What stays in the story is what cannot be written down: the scenarios, the controls, the
  visual-regression surface. Feature lists, accessibility notes and the table of overridable
  `var(--x, fallback)` belong in the README, which is what `package.json` publishes — stories
  are not in the tarball, so a consumer never saw them.
- Tests are Vitest + React Testing Library. **`vitest.config.ts` lists the directories it
  runs** — `components`, `selectors`, `ai-agent`, `errors`, `ui`, `utils`, `context`,
  `providers`, `hooks`. A test placed under `billing/`, `uploader/`, `document-editor/` or
  `api/` is collected by nothing and passes by never running.
- Seven components have no test; that is tolerated, an untested _change_ to interactive logic is
  not. `node .claude/scripts/component-docs/gaps.mjs` lists them and the one missing story; no
  README is missing any more, and the gates keep it that way.
- `__tests__/` holds 94 Playwright visual-regression specs that run against a built Storybook
  and are **not in CI**. Nothing you push will run them.

## Missing documentation, as of today

None. All 112 READMEs — 98 component folders, 11 nested sub-components and the three public
providers — are on the template, and `check:readme` fails a folder that has none, so this cannot
regress quietly. `node .claude/scripts/component-docs/gaps.mjs` is the live count and today
reports only a missing story (`theme-provider`) and seven components without tests.

A provider block is the same schema with two fields dropped: no `category`, because a provider
appears in no section of the catalogue, and no `state`, because it renders no element a prop
shows or hides. `kind: "provider"` is what selects that variant, and naming either field there is
an error rather than merely unused — a blank `category` would go straight into the catalogue as
an empty row. The three folders come from `providers/index.ts` rather than the file system, so
`providers/api` and the composed `Providers`, both portal-internal, stay undocumented on purpose.

What is documented is not the same as what is correct. The rewrite turned up 13 faults in the
components themselves, which `docs/known-defects.md` collected until all of them were fixed on
2026-09-24; that file is gone, and `CHANGELOG.md` carries what each one means for a consumer.

**There is no separate defect list now, and starting one again is the wrong move.** Every fault
was already described in its own component's README — as the behaviour it was, because that is
what the README is for — and the second copy in a central list was a second thing to keep in
step. Describe a fault where the component is described; when it is fixed, correct that sentence
in the same commit as the code, and say in `CHANGELOG.md` what changed for whoever upgrades.
