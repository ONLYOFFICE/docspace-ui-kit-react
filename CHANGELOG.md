# Change Log

## Unreleased

Every fault `docs/known-defects.md` collected is fixed — the eleven it opened with and the two
the sweep turned up — and the file is gone. Four of these change what a consumer sees, so read
_Changed_ before upgrading.

### Changed

- **`DocumentEditor`'s props are one of two shapes.** Either `documentServerUrl` with
  `config`, or `fileId` (with `fileVersion` and `isView` if wanted), in which case the wrapper
  fetches both from the portal behind the nearest `ApiProvider`, as it always did. The type
  used to demand all of them at once, so a caller with a file id had to cast past it; and a
  caller with neither made the wrapper open file `1`, which it now refuses through
  `onLoadComponentError` instead
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
  valid and are now redundant; pass `-1` where you mean the keyboard to skip a control. A
  disabled `Checkbox` or `ComboBox` is out of the tab order whatever `tabIndex` says, as a
  disabled native control would be. `DropDownItem` keeps its `-1` deliberately: an option inside a listbox belongs off the tab
  order while the container holds focus, which is the active-descendant pattern it implements
- **`ModalDialog` carries `role="dialog"` and `aria-modal` on the dialog surface**
  (`#modal-dialog`) instead of on the click-to-close layer, which spans the whole viewport. A
  test or stylesheet selecting `[role="dialog"]` now matches a different element
- **`Aside` is a flex column and its body takes the space the header leaves.** The bottom
  ~53px of a long body used to sit below the panel's edge, unreachable. If you pass
  `withoutBodyScroll` and bring your own scroller, give it `flex: 1 1 0` and `min-height: 0`
- **`Aside` puts only `aria-*` on the `<aside>` element; every other prop it does not read goes
  to the header alone.** It used to copy them onto both, so `onBackClick` and `isBackButton`
  reached the DOM (React warned "Unknown event handler property `onBackClick`"), a `style`
  replaced the panel's own `z-index`, and an `id` appeared twice on the page. The split follows
  the prop table, which already gave `id` and `style` to the header. **What reached the panel
  before and no longer does:** an `id`, `style` or `data-*` meant for the `<aside>`, and any DOM
  handler — an `onClick` on the panel is now dropped, since the header does not read one either.
  Wrap the `Aside` or its children to handle a click on the panel
- **`Article`'s `showProgress` is optional, and it and `isInfoPanelVisible` are deprecated.**
  Both only moved the live chat launcher, which the component no longer draws, so neither is
  read. Passing them still compiles; they go in the next major

### Added

- `Text` takes **`role`, `aria-label`, `aria-live` and `aria-hidden`**. It always passed
  unknown props to the element, but its props type is closed, so a status line could not be
  declared `role="status"` without a wrapper element; its own README told callers to pass a
  role the type refused. `Heading` and `Link` share the type and take the same four.
  Declaring `aria-label` also showed that `Link` set it to `children` whatever they were, an
  object for a node child; it now falls back to `children` only when that is a string
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
- The package ships **`docs/plugin-surface.json`**: every name the root barrel exports, with
  its kind and the module it comes from, as the TypeScript checker resolves it. Tooling outside
  this repository can tell a portal-internal name from a public one without parsing the barrels
  itself — agent-skills' `ui-kit` skill does. `pnpm surface:check` keeps it current in pre-push
  and CI, and fails on an added name as well as a removed one

### Deprecated

- `LIVE_CHAT_LOCAL_STORAGE_KEY`. The live chat no longer restores its state from storage, so
  nothing reads or writes this key. It stays exported because the root barrel is the plugin API

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

- `ComboBox` works from the keyboard. The button answered no key, so a list could not be opened
  without a pointer, and the ArrowDown and Enter handler on the document looked for options by a
  test id its own options never carry — so it moved nothing, and while a list was open it
  swallowed Enter for the whole page. The button now answers Enter, Space and the arrows to open
  the list, the arrows to move a highlight that skips options which cannot be picked, Enter or
  Space to pick, and Escape or Tab to close; the highlighted option is named by
  `aria-activedescendant`. Nothing listens on the document any more
- `Checkbox` toggles from the keyboard. Focus lands on the box icon rather than the hidden
  input, and the icon answered no key, so Tab reached the checkbox and Space did nothing — a
  form could not be filled in without a pointer. Space on the focused icon now clicks the input,
  which fires the same `onChange` a pointer does; Enter still does nothing, as on a native
  checkbox
- `Button`'s `tooltipText` opens only its own tooltip. A button with no `id` named its tooltip
  `button-tooltip`, the same as every other such button, and each tooltip opens for any anchor
  carrying its name — so hovering one of three buttons opened three tooltips, and the page held
  three elements with one `id`. A button without an `id` now gets a generated one; a button
  with an `id` is unchanged
- `Selector` no longer scrolls the page when it mounts. The list's scroll container takes focus
  on mount, and so does the new-name field when it appears; both focused with a plain `focus()`,
  which scrolls the page to the element. They now pass `preventScroll`, so the focus still lands
  in the selector and the page stays where it was. Every selector built on it follows
- `RoomLogoCoverDialog` fits the window the first time it opens. Its `Portal` mounts the body
  after the first render, so the height was computed before there was anything to measure and
  stayed at the 648px (desktop) or 854px (tablet) preset, past the bottom of a short window; only
  a second opening measured it. The body is now measured once it is mounted. `RoomLogoCover`'s
  `forwardedRef` accepts a callback ref as well as a ref object
- `MCPServersSelector` loads the portal's logo from the portal. The system server's icon
  was a relative `/logo.ashx?logotype=3`, which the browser resolves against the page's own
  origin — the portal only when the application is served from it. Anywhere else the icon was a
  broken image. It is now built from the `baseUrl` of the nearest `ApiProvider`
- Secondary `Tabs` with `scaled` judged overflow by the tabs' own widths, which are the
  container's shares, so two tabs in a 480px row were "overflowing" and shown one at a time
  behind arrows. The check now measures the labels
- `RoomIcon` with no `logo` rendered an empty `<img>` unless `showDefault` was passed. It now
  draws the initials, which is what `showDefault` forces when a logo exists
- `Uploader`'s `targetId` was typed `string`, and a string id is what sends the upload down the
  third-party route; a portal folder's numeric id could only be passed through a cast. It is
  `string | number` now, and the README says which route each takes
- `ModalDialog` added a `touchend` listener inside its effect's teardown, where every sibling
  line removed one; each re-run left another listener behind
- `ThemeProvider` follows a `colorTheme` that arrives after the first render, instead of only
  reading it once
- The committed `locales/en` lacked six keys the source asks for: `Filter`'s forms variant
  (`SpaceGroups`, `AllSpaces`, `ManageGroupSpaces`) showed the raw key names, and the AI
  agent's export labels (`ExportPdfDocument`, `ExportDocxDocument`, `ExportMdFile`) had no
  entry, so only their inline English default could show
- Two mounted `Toast`s threw `Cannot set properties of undefined (setting 'toggle')` once one
  of them remounted while the other still showed a toast: `react-toastify` keys its registry by
  container id, and every `Toast` uses the same one. That happens on any Storybook docs page
  with several stories, and to a plugin that mounts its own next to the portal's. Only the
  first mounted `Toast` renders the container now, and the next takes over when it unmounts;
  the `className` and `style` of the others are ignored
- `AIAgentSelector` and the Files selector's agent list no longer disable every agent when
  `disableBySecurity` names a right that a folder's security never carries, such as the
  file-only `AskAi` of the chat's attach picker. Only a right set to `false`, or a missing
  security object, disables an agent now. The initial items (`withInit`) and the pages loaded
  after them follow the same rule; before, the initial items still disabled every agent

### Documentation

Two sentences that were false the day they were written, each found by an agent disagreeing
with the page in front of it. No code changed for either.

- `providers/theme` said `initialTheme` "is read once" and that a new value needs a remount.
  It is re-resolved by an effect keyed on that prop, so the theme changes in place and nothing
  below the provider loses its state
- `components/textarea` said `aria-label` and `aria-labelledby` were "the only two ways" to
  name the field. A `FieldContainer`'s `labelFor` reaches it as well, since its `id` lands on
  the `<textarea>` element
- **The nine default-only components are in the root barrel**, and nine READMEs plus
  `docs/getting-started.md` said they were not. `components/index.ts` re-exports them by name —
  `export { default as Section }` — six of them since before the READMEs were written and the
  other three since shortly after, but `check-readme` rebuilt the barrel's names from each
  folder's own exports, assumed `export *` throughout, and so failed any README that told the
  truth. It now asks the TypeScript checker what the barrels export. `import.barrel` is `true`
  for all nine
- `docs/getting-started.md` now gives the real reason to import by subpath: **the root barrel
  does not build without `mobx`, `mobx-react`, `react-router` and `axios`**, four optional peers
  the barrel's `billing` and `uploader` re-exports import. Vite stops on
  `"makeAutoObservable" is not exported by "__vite-optional-peer-dep:mobx"`

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

### Known issues

- **`axios` is not portal-only.** `docs/public-api.md` says it is; the root barrel reaches
  it through `uploader` and `billing`, both of which are exported from `index.ts`. Since
  `axios` is an optional peer, a consumer who bundles the barrel themselves must install it.
  The portal is unaffected
- `i18next` and `react-i18next` are required peers with no `devDependency` mirror here, so
  this repository's own tests run against whatever version resolves transitively
