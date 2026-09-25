# Change Log

## Unreleased

Every fault `docs/known-defects.md` collected is fixed — the eleven it opened with and the two
the sweep turned up — and the file is gone. Four of these change what a consumer sees, so read
_Changed_ before upgrading.

### Changed

- **The section header has its height and background back.** `--section-header-height` and
  `--section-header-bg` were declared under `.header :global(.light)`, which compiles to
  `.header .light` — a `.light` element _inside_ the header, which nothing is — so both
  resolved to an invalid `var()` and were dropped. The header has been sizing to its content
  and showing no background; it is now 69/61/53px as intended. The same mistake was in
  `.infoPanelWrapper` and `.infoIcon`. **This changes the portal's layout**, which has been
  rendering the collapsed version all along
- **`TextInput`, `Textarea`, `Checkbox` and `ComboBox` no longer default `tabIndex` to `-1`.**
  Every control built from them was out of the tab order, so a form could not be filled in from
  the keyboard unless the caller passed `tabIndex={0}` to each one. Those explicit zeroes stay
  valid and are now redundant; pass `-1` where you mean the keyboard to skip a control.
  `DropDownItem` keeps its `-1` deliberately: an option inside a listbox belongs off the tab
  order while the container holds focus, which is the active-descendant pattern it implements
- **`ModalDialog` carries `role="dialog"` and `aria-modal` on the dialog surface**
  (`#modal-dialog`) instead of on the click-to-close layer, which spans the whole viewport. A
  test or stylesheet selecting `[role="dialog"]` now matches a different element
- **`Aside` is a flex column and its body takes the space the header leaves.** The bottom
  ~53px of a long body used to sit below the panel's edge, unreachable. If you pass
  `withoutBodyScroll` and bring your own scroller, give it `flex: 1 1 0` and `min-height: 0`

### Added

- `FieldContainer` takes **`labelFor`**, the `id` of the control it labels. It rendered its
  label with an empty `htmlFor`, so no caption in any form built from it was associated with
  its field
- `Textarea` takes **`aria-label`, `aria-labelledby` and `aria-describedby`**. Its props type
  is closed — it accepts no arbitrary DOM attributes — so these are declared as props rather
  than passed through. A captioned field needs none of them: `id` lands on the `<textarea>`
  itself, so a `FieldContainer` given the same string as `labelFor` names it like any other
  control
- `ModalDialog` takes the same three, and they reach the element carrying the role. An
  `aria-label` used to be swept into the rest props and land on the internal header, and only
  when a header was rendered
- The three public providers — `theme`, `translation`, `error-boundary` — have READMEs on
  `README_TEMPLATE.md`, with generated prop tables, and `check:readme` now covers
  `providers/**` as well as `components/**`. 112 pages, up from 109

### Removed

- **Breaking, types only:** `FieldContainerProps.icon`, `.helpButtonHeaderContent` and
  `.offsetRight`, and `WithTooltipProps.tooltipPlace` and `.tooltipFitToContent`. All five were
  declared and read nowhere, so passing one now fails to compile rather than doing nothing;
  runtime behaviour is unchanged. `omitTooltipProps` still strips the two tooltip names, so a
  caller that has not caught up does not put them on the DOM
- **`ThemeProvider` no longer imports the REST SDK as a value.** It awaited
  `CommonSettingsApiAxiosParamCreator().getPortalColorTheme()`, which is the API SDK's
  _parameter builder_: it returns `{ url, options }` and sends nothing, so the result was read
  as a response and the branch ended in silence. The palette was never loaded, in the portal
  either, unless `colorTheme` was passed. Removing it took `@onlyoffice/docspace-api-sdk` and
  `axios` out of every application that mounts the provider — verified against `dist`. The
  palette's type is still imported, as a type, and `colorTheme` is now the only way in

- **`docs/known-defects.md` is no longer published.** It collected faults across components
  until there were none left to collect. A fault is described in its own component's README,
  which is where someone reading about that component will meet it, and what a fix means for a
  consumer belongs here

### Fixed

- `ModalDialog` added a `touchend` listener inside its effect's teardown, where every sibling
  line removed one; each re-run left another listener behind
- `ThemeProvider` follows a `colorTheme` that arrives after the first render, instead of only
  reading it once

### Documentation

Two sentences that were false the day they were written, each found by an agent disagreeing
with the page in front of it. No code changed for either.

- `providers/theme` said `initialTheme` "is read once" and that a new value needs a remount.
  It is re-resolved by an effect keyed on that prop, so the theme changes in place and nothing
  below the provider loses its state
- `components/textarea` said `aria-label` and `aria-labelledby` were "the only two ways" to
  name the field. A `FieldContainer`'s `labelFor` reaches it as well, since its `id` lands on
  the `<textarea>` element

## 4.0.0

First release of this package under its own name and from its own repository. It was
`@docspace/ui-kit@0.0.1`, a workspace package of the DocSpace client resolved to its source
root; it is now `@onlyoffice/apps-ui-kit`, built and consumed as a package. The version
aligns with the DocSpace 4.0 line rather than continuing the old numbering.

Everything under _Changed_ is breaking for a consumer that previously resolved the source
tree.

### Changed

- **Renamed** from `@docspace/ui-kit` to `@onlyoffice/apps-ui-kit`
- **ESM only.** The published manifest declares `type: module`; the build emits
  `dist/esm/**` and `dist/types/**`. There is no CJS output and no `dist/cjs`
- **Declarations are `.d.mts`**, matching the `import` condition
- **An `exports` map now decides what resolves.** Six keys: `.`, `./styles.css`,
  `./package.json`, `./locales/*`, `./styles/*`, and one `./*` wildcard that serves every
  module subpath onto `<subpath>/index.js`. Anything it does not cover stops resolving —
  including a plain (non-module) stylesheet, which is emitted as `<Name>.scss/index.css`
  with no `index.js` beside it and has to be reached through the module that imports it
- **One CSS file per module, imported by that module.** A consumer importing a component
  pulls in that component's CSS and nothing else, and its bundler splits styles along the
  same chunk boundaries as the code. `dist/styles.css` is still assembled, in module-graph
  order, for consumers that want the whole sheet
- **Dependencies are split three ways.** 32 `dependencies` for the public core;
  `react`, `react-dom`, `i18next` and `react-i18next` as required peers; 15 optional peers
  for what only the portal-internal modules need (`@onlyoffice/ai-chat`, `mobx`,
  `mobx-react`, `axios`, `socket.io-client`, `@socket.io/component-emitter`, `react-router`,
  the markdown and KaTeX stack, `@onlyoffice/document-editor-react`). An external install
  downloads none of the optional set
- `@onlyoffice/docspace-api-sdk` resolves from npm as `^3.7.0` instead of a vendored
  `file:` tarball
- `react` and `react-dom` peers relaxed to `^19.0.0`
- Moved to `i18next` 25 and `react-i18next` 15; `react-svg` to 16.4.2
- `providers/api` and the composed `providers/Providers` left `providers/index.ts`. Both
  are portal-specific — `Providers` fetches portal settings on mount — and both remain
  importable by subpath
- The `hooks` barrel is exported from the root
- Licence declaration moved out of the source files: the package is still AGPL-3.0-only,
  declared in `package.json`, `LICENSE` and the README, with no per-file headers

### Added

- `locales/en` is committed, so the package builds, tests and runs Storybook with no
  DocSpace checkout beside it. The other languages are refreshed on demand with
  `pnpm sync-locales`, which needs a client checkout and fails loudly without one
- `pnpm verify:package` — packs with pnpm, then runs `publint` and `attw` against the real
  tarball. It must be pnpm: `publishConfig` field overrides are a pnpm feature, and an
  npm-packed tarball has no `exports` and no `main` at all
- `scripts/check-dist.mjs`, at the end of `pnpm build`: fails on a bundled dependency, on a
  chunk that is not an `index` file (which no `exports` pattern would match), and on a
  module that lost its `"use client"` directive — rollup drops module-level directives when
  bundling, and without them every Next.js App Router consumer breaks on the first
  interactive component
- A CI job that builds the package and runs the packaging gate. Blocking
- `docs/public-api.md` — what is public, what is portal-internal, and what neither
  guarantees
- Stories for `QuantityPicker`, the avatar editor dialog and the room logo cover dialog;
  visual-regression specs for `Selector` and `Table`
- `ui-kit.code-workspace` and `.vscode/` — tasks for the build, the checks, Storybook, the
  E2E suite and the audit scripts, behind grouped status-bar buttons
- A README for every component, against `README_TEMPLATE.md`: 98 folders and 11 nested
  sub-components, each with a machine-checked metadata block and a prop table generated from
  the JSDoc. `docs/getting-started.md`, `docs/components.md` and `docs/known-defects.md`
  alongside them, all four `docs/` pages published in the tarball
- `pnpm check:readme`, `readme:props:check` and `readme:catalogue:check`, in pre-push and in
  CI; `pnpm check:readme:full` additionally type-checks every `tsx` example in every README
- **`FilterInput` and `StatusMessage` are now named exports** as well as default ones. Both
  were reachable only by subpath, because the root barrel re-exports folders with `export *`,
  which drops a default. Additive: the default export of each is unchanged

### Changed in the type declarations

Behaviour is untouched; these are types that did not describe the component they belonged to.

- **`DateTimePickerProps` now includes `translations`**, which the component has always
  required and the exported type omitted. Code that built a `DateTimePickerProps` value
  without it stops compiling, and was already passing an incomplete object at runtime
- `Checkbox` and `ToggleButton` declare their input and label props directly instead of
  `Pick`ing them out of React's attribute interfaces, so each one carries its own
  description. The types are the same, `Checkbox.value` included

### Removed

- `react-virtualized-auto-sizer` and `@babel/runtime` — neither is imported, and the build
  does not miss them
- The monorepo paths, aliases and submodule wiring the package carried while it lived
  inside the client

### Fixed

- `ImageEditor` no longer crashes on render
- Built icons keep their `viewBox`
- `RoomLogo` regained a class name it needed
- Storybook stories repaired across `ActionButton`, `AppLoader`, `Aside`, `DragAndDrop`,
  `DropDown`, `FloatingButton`, `InfiniteLoader`, `Navigation`, `Portal`, `RadioButton`,
  `Row`, `Table` and `TopLoadingIndicator`, plus the story globs and the sidebar order
- Brand and constant lookups are held on `globalThis`, so they survive a second module
  instance
- `pnpm build` no longer needs a DocSpace checkout

#### Line endings

`.gitattributes` pins the repository to LF (`* text=auto eol=lf`). This matters
on Windows: with `core.autocrlf=true` a checkout used to get CRLF working
copies of files that are LF in git, and `pnpm format` — now part of the
pre-push gate — then failed on all ~1700 of them.

A checkout that predates `.gitattributes` is not converted by pulling it, since
git only rewrites working copies at checkout. **See "Line endings" in the
README for the one-time migration**; it discards uncommitted changes, so commit
or stash first.

## Known issues

- **`axios` is not portal-only.** `docs/public-api.md` says it is; the root barrel reaches
  it through `uploader` and `billing`, both of which are exported from `index.ts`. Since
  `axios` is an optional peer, a consumer who bundles the barrel themselves must install it.
  The portal is unaffected
- `i18next` and `react-i18next` are required peers with no `devDependency` mirror here, so
  this repository's own tests run against whatever version resolves transitively
