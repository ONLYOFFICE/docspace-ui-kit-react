# README Template Guide

Use this template when writing or rewriting a component README. The worked example is
[`components/button/README.md`](components/button/README.md) — read it before starting.

## What a component README is for

A README is the answer to "how do I use this component", given to someone who cannot read
the source: an external consumer, and a coding agent working from the published package
(`package.json` → `files` ships `components/**/README.md` in the tarball).

The bar is: **a reader who has only this file writes working code on the first attempt and
asks no follow-up question.** Every rule below exists because something in this package
fails that bar today — a prop table that disagrees with the types, a `visible` that the
reader guessed as `isVisible`, a size that the stylesheet contradicts, an import path that
only resolves inside DocSpace-client.

Three surfaces used to document a component and none of them agreed: this README, the story's
`parameters.docs.description.component`, and the react-docgen prop table Storybook builds
from the JSDoc on `*.types.ts`. Two of the three are now tied together: **the JSDoc is the
single source for prop descriptions**, and the README's prop table is generated from it, so no
prop is described twice by hand.

The story's component description stays its own text, in the shape `STORY_TEMPLATE.md` sets —
a short line, `### Features`, an optional `### Accessibility`, `### Usage`. Rendering this
whole README there instead was tried on four components and reverted: a 260-line page does not
fit that shape, and it carried sections a Storybook reader has no use for. What it bought,
one text instead of two, is real and is now bought by discipline rather than by machinery —
**when you change what a component does, the story's description is the second place to
correct**, and nothing will fail if you forget.

The CSS-variable table and the accessibility notes belong here rather than in the story either
way: `package.json` publishes `components/**/README.md` and does not publish stories, so
anything written only in a story does not exist for someone who installed the package.

## The skeleton

Sections marked **M** are mandatory and must appear in this order. **C** sections appear
only when their condition holds. Nothing else is allowed at `##` level, except free `###`
headings inside `## Recipes`.

````text
M = mandatory, C = only when the condition holds. The annotations in the right column are
not part of the file you write.

<!-- ui-kit-doc { …metadata… } -->             M  line 1, see "Metadata block"

# ComponentName                                M

One paragraph. The first sentence is the summary and must equal `metadata.summary`.
Say what the component is for, not what it is made of.

## Use this when / not when                    M

- Use when: …
- Not for …, use [`Sibling`](../sibling/README.md) instead.

## Import                                      M

```ts
import { ComponentName } from "@onlyoffice/apps-ui-kit/components/component-name";
```

Also exported from the root barrel `@onlyoffice/apps-ui-kit`.
                                               C  metadata.import.barrel

Needs `ThemeProvider` above it in the tree, and say what goes wrong without it.
                                               M  matches metadata.providers; link
                                                  ../../docs/getting-started.md once
                                                  that page exists

## Minimal example                             M

```tsx
…exactly one block, a complete module, compiles as-is…
```

## Props                                       M

<!-- props:start -->
…generated, do not edit…
<!-- props:end -->

### Enums                                      C  any prop is typed with an enum

<!-- enums:start -->
…generated…
<!-- enums:end -->

## Recipes                                     M

### Open / close (controlled)                  C  metadata.state.visibility
### Loading                                    C  metadata.state.loading
### Error                                      C  the component has hasError / errorMessage
### Disabled / read-only                       C  metadata.state.disabled
### …component-specific…                       optional

## Behaviour the types don't state             M

## Sub-components                              C  metadata.subComponents is non-empty

## CSS variables                               C  the stylesheet reads custom properties
                                                  a consumer may set

## Accessibility                               M

## Test ids                                    M

## Related                                     M
````

## Metadata block

An HTML comment on line 1. It is invisible on GitHub, on npm and in Storybook, and it is
what the downstream tooling reads: the catalogue in `docs/components.md`, and the
`ui-kit` agent skill, which syncs these files and builds a component index from them.

YAML frontmatter was rejected for this: GitHub renders it as a table above the README and
npm prints it as raw text.

```json
<!-- ui-kit-doc {
  "schema": 1,
  "name": "ModalDialog",
  "folder": "components/modal-dialog",
  "kind": "component",
  "category": "Overlays",
  "status": "public",
  "summary": "Dialog rendered in a portal, as a centred modal or a side panel depending on the viewport.",
  "import": { "subpath": "components/modal-dialog", "barrel": true, "default": false },
  "exports": ["ModalDialog", "ModalDialogType", "ModalDialogProps"],
  "providers": ["ThemeProvider", "TranslationProvider"],
  "state": { "visibility": "visible", "close": "onClose", "loading": "isLoading", "disabled": null },
  "related": ["aside", "backdrop", "portal"],
  "subComponents": ["ModalDialog.Header", "ModalDialog.Body", "ModalDialog.Footer"],
  "testIds": ["modal-dialog"]
} -->
```

| Field                                            | Rule                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`                                         | Always `1`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `name`                                           | PascalCase, equals the `#` heading.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `folder`                                         | Path of the README's directory, relative to the repository root.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `kind`                                           | `component`, `sub-component` (a README under a component folder — `rows/row`, `tiles/base-tile`, `aside/aside-header`) or `compound` (several exported prop types, one `props:start` block each).                                                                                                                                                                                                                                                                                                                                     |
| `parent`                                         | Required when `kind` is `sub-component`: the parent component's folder.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `category`                                       | One of `Interactive elements`, `Form controls`, `Overlays`, `Data display`, `Layout`, `Navigation`, `Feedback`. See "Categories" below — the story titles use thirteen variants today and are not the authority.                                                                                                                                                                                                                                                                                                                      |
| `status`                                         | `public`, or `portal-internal` when the component only works with portal context — a required `t: TTranslation`, a MobX store, `currentDeviceType`. Per [`docs/public-api.md`](docs/public-api.md).                                                                                                                                                                                                                                                                                                                                   |
| `summary`                                        | One sentence, ≤ 160 characters, equal to the first sentence under the heading. This is the line the catalogue shows.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `import.subpath`                                 | Always the subpath (`components/<folder>`), even when the component is also in the barrel.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `import.barrel`                                  | Whether the component can be imported from the root barrel by name. **Derived truth** — `components/index.ts` re-exports all 98 folders, but `export *` drops defaults, so the nine default-only components are false and the nested ones are true.                                                                                                                                                                                                                                                                                   |
| `import.default`                                 | Whether the folder's `index` has a default export. **Derived truth.** Eleven components do (`section`, `article`, `navigation`, `filter`, `dropzone`, `app-loader`, `public-room-bar`, `operations-progress-button`, `quantity-picker`, `room-type`, `status-message`).                                                                                                                                                                                                                                                               |
| `exports`                                        | Every name a consumer can import from the folder, types included. Each must really be exported; the `## Import` block must import a subset.                                                                                                                                                                                                                                                                                                                                                                                           |
| `providers`                                      | Which of `ThemeProvider` / `TranslationProvider` must be above the component for it to render **correctly** — not merely without throwing. `TranslationProvider` is required whenever the component (or anything in its folder) calls `useTranslation` or `getCommonTranslation`: without it those labels come back empty and an i18n error is logged.                                                                                                                                                                                |
| `state.visibility`                               | The prop that shows and hides the component, **or `null`**. This field exists because the kit does not agree with itself: `visible` (Aside, ModalDialog, Backdrop, Portal, Selector), `isVisible` (Section's InfoPanel), `isOpen` (ComboBox, CollapsibleCard, HelpButton, LinkWithDropdown, Navigation, RoomType), `open` (DropDown), `opened` (MainButtonMobile). A reader who guesses wrong gets an ignored prop and no error. `OperationsProgressButton` has none at all: it is on screen while its operations array is not empty. |
| `state.close`, `state.loading`, `state.disabled` | Same idea for the close callback, the loading flag and the disabled flag. `null` when the component has none. Every named prop must exist in the resolved props.                                                                                                                                                                                                                                                                                                                                                                      |
| `related`                                        | Folder names of the components a reader might have meant instead. Must match the links under `## Related`.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `subComponents`                                  | Dotted statics (`ModalDialog.Header`) or separately exported sub-components. `[]` when there are none.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `testIds`                                        | Every `data-testid` the component renders, including the default value of a `testId` prop. Must appear under `## Test ids`.                                                                                                                                                                                                                                                                                                                                                                                                           |

### Categories

Seven, and they are what the catalogue groups by. The story titles currently carry thirteen
variants, including two spellings of the same thing, so they are mapped rather than trusted;
aligning the stories is a separate pass at the end of the rewrite.

| `category`             | Story titles that map to it                           |
| ---------------------- | ----------------------------------------------------- |
| `Interactive elements` | `UI/Interactive elements`                             |
| `Form controls`        | `UI/Form controls`                                    |
| `Overlays`             | `UI/Overlays`                                         |
| `Data display`         | `UI/Data display`, `UI/Table`, `UI/Tiles`, `UI/Rows`  |
| `Layout`               | `UI/Layout`, `UI/Layout components`                   |
| `Navigation`           | `UI/Navigation`                                       |
| `Feedback`             | `UI/Feedback`, `UI/Status components`, `UI/Skeletons` |

The validator warns when a component's `category` does not map from its story title; it is a
warning, not an error, because the story is the side that is wrong more often.

## Section rules

**`# Name` + paragraph.** What the component is for. No feature list — features are props,
and props are in the table.

**`## Use this when / not when`.** At least one "not when" naming a sibling and linking its
README. This is the section that stops a reader reaching for `Row` when they wanted a
table, or `LoadingButton` when they wanted `Button isLoading`.

**Say what the component does not have.** A README is read by someone who has a job to do and
is looking for the thing that does it; when it is not there, silence reads as "keep looking"
and costs a question or, worse, a hand-rolled substitute. Button has no destructive variant —
nothing in its stylesheet is red — and a reader building a delete confirmation will hunt for
one until the README says so and points at `--accent-button`. Write the absence wherever the
reader will look for the feature: a missing variant in "Use this when / not when", a missing
knob in "CSS variables", missing behaviour in "Behaviour the types don't state".

**`## Import`.** The subpath form is canonical: it is what the published `exports` map
guarantees for all 98 components, and it keeps a consumer's bundle to the components they
use. Add the barrel sentence when `import.barrel` is true; when it is false, say so in the words **not in the root barrel**, which the validator looks for. Never write a path into
`dist/`. Never use `PUBLIC_DIR` — that is a DocSpace-client webpack alias and does not
resolve for a consumer.

Icons need care. `@onlyoffice/apps-ui-kit/assets/…` **does** resolve: `preserveModules` emits
every asset a shipped component imports — 312 of them — and `files` ships `dist`. But only
those; an asset nothing imports is not in the package, and none of them has a per-asset
`.d.ts`, only the ambient `*.svg` declaration in `dist/types/globals.d.ts`. So an example
that needs an icon uses the consumer's own SVG through their own bundler, and reaches for a
kit asset only after checking that this one is emitted.

**`## Minimal example`.** Exactly one ```tsx block, and it must be a complete module that
compiles: imports at the top, an exported component, no `…` placeholders. If the component
is controlled (`state.visibility` or `state.loading` is set), the example holds that state
in `useState` — a reader who copies a controlled component without its state gets a
component that never opens.

**`## Props`.** Generated. See below.

**`## Recipes`.** Each recipe is a complete, compiling ```tsx block, one per state a reader
will need on the first day. Only the recipes whose condition holds; do not invent an
"Error" recipe for a component with no error state.

**`## Behaviour the types don't state`.** The reason this template exists. Collect it by
reading, not by recalling:

- `<Name>.module.scss` — `position`, `margin`, `width` / `min-width` / `max-width`,
  `height`, `display`, `overflow`, `z-index`. This is where you find that a component has
  no intrinsic size, brings its own outer margin, clips its label, or paints outside its box.
- `<Name>.tsx` — defaults applied by destructuring; what each `onX` is actually called
  with (`onChange(value)` versus `onChange(event)`); props that are coerced or ignored;
  literal element ids and `getElementById` / `ResizeObserver` (container requirements);
  `Portal` usage (renders to `document.body`); `useTranslation` (needs the provider).
- `<Name>.test.tsx` — every assertion about behaviour a consumer relies on.
- The wrapper, if `index.ts(x)` exports something other than the raw component
  (`withTooltip(Button)`): it may add props and intercept ones you documented.

Write each as a statement of what happens, not advice. "`type="reset"` is coerced to
`"button"`" beats "prefer `submit`".

**`## Sub-components`.** What each part is for and what it must contain. A compound
component gets one `props:start` block per exported prop type.

**`## CSS variables`.** Only custom properties a consumer may set — those read with a
fallback (`var(--button-height-md, 40px)`). Not the private ones the stylesheet defines for
itself. Columns: Variable, Default, Effect.

**`## Accessibility`.** Roles and ARIA the component sets by itself, what keyboard
interaction it supports, and what the consumer still has to supply. "Renders a plain
`<div>` and sets no ARIA of its own" is a valid and useful answer.

Whatever you tell the consumer to supply, check that they can. `ModalDialog`'s section used
to say "add `aria-label` yourself"; the prop type accepts one, but unknown props are spread
onto the internal header, not onto the element carrying `role="dialog"`, so following the
advice does nothing. A reader who takes an instruction that cannot work loses more than one
who is told the component has a gap.

**`## Test ids`.** Table of element → `data-testid`, and the prop that overrides it.

**`## Related`.** Links to the READMEs in `metadata.related`, one line each saying when to
go there instead.

## Generated blocks

The props table lives between markers and is written by `pnpm readme:props`:

```markdown
<!-- props:start -->
<!-- props:end -->
```

A compound component names its type in the marker: `<!-- props:start TableHeaderProps -->`.

Rules:

- **Never edit between the markers.** `pnpm readme:props:check` runs in pre-push and CI and
  fails on any hand edit. To change a description, change the JSDoc.
- **Every own prop needs a one-line JSDoc.** A prop without one is a validator error, and
  it is also a blank cell in Storybook's prop table.
- `@default` only where the default is not visible as a destructuring default in the
  component (for example when a sub-component applies it).
- `@portal` marks a prop that only makes sense with portal context; those render into a
  separate table.
- A boolean that is simply `undefined` when unset has **no** default. Do not write `false`
  in the Default column for it — that is a claim the code does not make.
- Props inherited from another kit type render as their own grouped table; props inherited
  from `@types/react` collapse into a single closing line.

## Procedure for one component

1. Read `index.ts(x)`, `<Name>.tsx`, `<Name>.types.ts(x)`, `<Name>.enums.ts`,
   `<Name>.module.scss`, `<Name>.stories.tsx`, `<Name>.test.tsx` and `sub-components/**`.
   If `index` wraps the component, read the wrapper too.
2. Complete the JSDoc on every own prop in the types file. Add `@portal` and `@default`
   where this guide says. **Read the existing sentences against the code rather than past
   them.** The validator can see that a description exists; only you can see that it is
   about this prop. On `ModalDialog`, `isCloseable` carried `visible`'s description and
   `closeOnBackdropClick` said it _disables_ what its name enables and its default turns on —
   both had been there for as long as the props had, and both survived every check.
3. Write the metadata block. Take `state.*` from the real props; take `import.barrel` and
   `import.default` from the source, not from memory.
4. `pnpm readme:props --write --only components/<folder>`, then fix every reported
   undocumented prop.
5. Write the hand sections. At least three bullets under "Behaviour the types don't state",
   each traceable to a file you read in step 1.
6. Remove anything stale the old README carried: `PUBLIC_DIR`, `@docspace/ui-kit`,
   `libs/ui-kit`, styled-components, sizes or defaults the source contradicts.
7. `pnpm check:readme:full --only components/<folder>` until it is clean.
8. Commit as `<Name>: rewrite README`. When the JSDoc pass is large (Selector, Section,
   Table), split it into `<Name>: document props` first.

`scripts/readme-allowlist.json` held the folders still on the old format while the rewrite was
running. It is `[]` now, and every folder is checked; adding one back is how documentation stops
being checked, not how a deadline is met.

## Checklist for each component

- [ ] Metadata block on line 1, valid, `state.visibility` names the real prop or is `null`
- [ ] Summary sentence matches `metadata.summary`
- [ ] "Not when" names at least one sibling and links it
- [ ] Import block uses the subpath; barrel sentence present only if it is in the barrel
- [ ] Minimal example is one complete module and compiles
- [ ] Every own prop has JSDoc; the table is generated, not typed
- [ ] Every prop description was read against the code, not merely found to exist
- [ ] The absences a reader will hunt for are stated where they will hunt
- [ ] Nothing in Accessibility asks the consumer to do something the component prevents
- [ ] No Default cell claims a default the code does not apply
- [ ] Recipes cover the states the metadata declares, and only those
- [ ] At least three behaviour bullets, each from the source, stylesheet or tests
- [ ] CSS variables table lists only consumer-settable properties
- [ ] Test ids table matches `metadata.testIds`
- [ ] No `PUBLIC_DIR`, no `dist/` path, no `@docspace/ui-kit`, no styled-components
- [ ] `pnpm check:readme:full --only components/<folder>` is clean

## Using this with Claude Code

Batch prompt:

```
Rewrite the READMEs for [combobox, toggle-button, checkbox] following README_TEMPLATE.md
and components/button/README.md. For each component, in order: complete the JSDoc on every
prop in the .types file (adding @portal and @default where the guide says), write the
metadata block, run `pnpm readme:props --write --only components/<folder>`, write the hand
sections — including at least three "Behaviour the types don't state" bullets found in the
.module.scss, the component source and the tests — then run
`pnpm check:readme:full --only components/<folder>` until clean, and commit as
"<Name>: rewrite README".
Do not edit anything between props:start and props:end by hand.
```

Single component:

```
Rewrite components/aside/README.md following README_TEMPLATE.md. Read the component, its
types, its stylesheet and its tests first, and tell me what you found that the current
README gets wrong before you write.
```

### Checking that a README actually works

Copy the finished READMEs somewhere outside this repository, give an agent those files and
nothing else — no checkout, no `node_modules`, no `.d.ts` — and ask it to build something real
from them. Then ask it for three lists: the questions it would have asked a colleague, the
assumptions it had to make, and what it had to read twice. Insist on bluntness; a polite answer
is worthless.

Run the result through `createExampleProgram` in `scripts/lib/readme-program.mjs`, which is
what type-checks the READMEs' own examples.

Done on `button` and `modal-dialog`, this produced a component that compiled with no
diagnostics and used only the props the kit already has — and nine questions the two files
should have answered. Every rule in this guide that mentions a specific defect came from that
run or from writing the four pilot READMEs. Questions about the _application_ — localisation,
error handling, which providers are mounted — are not this document's job; they belong in
`docs/getting-started.md`.

That last sentence is worth keeping: on Button it surfaced a documented size that the
stylesheet contradicts, a `title` prop consumed by a wrapper, and a `type` value that is
silently coerced.
