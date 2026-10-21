# Change Log

## 4.0.2

### Changed

- `@onlyoffice/document-editor-react` peer raised from `2.1.1` to `2.2.0`. That release
  dropped its own `IConfig` and takes the editor configuration type, `Config`, from
  `@onlyoffice/doceditor-types`, which is now an optional peer here as well (`^9.3.1`)
- `document-editor` still exports `IConfig`, now as an alias of that `Config`
- `@onlyoffice/document-editor-react` peer raised further to `2.3.0`, and the
  `@onlyoffice/doceditor-types` peer widened to `>=9.3.1` so that its `10.0.0` line
  (the types for ONLYOFFICE Docs 10.0, which drop the deprecated `showReviewChanges`,
  `reviewDisplay` and `trackChanges` customization keys) satisfies it the same way it
  satisfies `document-editor-react` itself
- `document-editor` folds its `width`, `height` and `events_*` props into `config`
  before handing it to `document-editor-react`, which deprecated those flat props in
  2.3.0. The component's own props are unchanged; a value set in `config` wins over the
  matching prop, and `events_onAppReady` still receives the editor instance
- `@onlyoffice/ai-chat` peer requirement raised to `^1.0.4` (the composer's tool cards follow the round's context scope; files and images share one attachment cap)
- AI settings: `McpServers` takes a `toolPrefsScope` prop. Pass `"tenant"` where the viewer administers the portal, so a tool switched off there is off for every user; omitted, the page edits the viewer's own list (Bug 84381)

### Fixed

- `InputBlock` passes the `TextInput` props it does not name itself on to the inner `<input>`.
  Its type has always accepted every `TextInput` prop, but the component forwarded only a fixed
  list, so `inputMode`, `aria-label` and any other `aria-*` were dropped without a warning: the
  field had no accessible name and a phone showed the full keyboard. They now reach the
  `<input>`; the props it names keep going where they went
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
- AI chat: the copy buttons (message, code block, tool card) work on a portal served over plain HTTP. The platform adapter now supplies `copyToClipboard`, which falls back to `copy-to-clipboard` where the Clipboard API is unavailable outside a secure context (Bug 84481)
- Files and images share one 5-attachment cap on a message, including the Forms section's single slot (Bug 84379)
- The E2E Docker image copies the vendored ai-chat tarball before `pnpm install`

## 4.0.1

### Changed

- `@onlyoffice/ai-chat` peer requirement raised to `^1.0.1`

## 4.0.0

First release under its own name and from its own repository. It was `@docspace/ui-kit@0.0.1`,
a workspace package of the DocSpace client resolved to its source root; it is now
`@onlyoffice/apps-ui-kit`, built and consumed as a package. The version follows the
ONLYOFFICE Apps 4.0 line.

### Changed

- **Renamed** from `@docspace/ui-kit` to `@onlyoffice/apps-ui-kit`
- **ESM only**: `dist/esm/**` and `.d.mts` declarations in `dist/types/**`; no CJS output
- **An `exports` map decides what resolves**: `.`, `./styles.css`, `./package.json`,
  `./locales/*`, `./styles/*` and a `./*` wildcard onto `<subpath>/index.js`. A plain
  (non-module) stylesheet is reached only through the module that imports it
- **One CSS file per module**, imported by that module; `dist/styles.css` still holds the
  whole sheet
- **Dependencies split three ways**: 32 `dependencies`; `react`, `react-dom`, `i18next` and
  `react-i18next` as required peers; 15 optional peers needed only by the portal-internal
  modules (`@onlyoffice/ai-chat` `^1.0.0`, `mobx`, `mobx-react`, `axios`, `socket.io-client`,
  `react-router`, the markdown/KaTeX stack, `@onlyoffice/document-editor-react`)
- `@onlyoffice/docspace-api-sdk` comes from npm (`^3.7.0`); `react`/`react-dom` peers are
  `^19.0.0`; `i18next` 25, `react-i18next` 15, `react-svg` 16.4.2
- `providers/api` and `providers/Providers` left `providers/index.ts`; import them by subpath
- The `hooks` barrel is exported from the root
- **`Article` / `ArticleLiveChat`** drive Zendesk through the messaging API; `zendeskEmail`,
  `chatDisplayName` and `Zendesk`'s `config` are gone
- **`DocumentEditor`** takes either `documentServerUrl` + `config`, or `fileId`; with neither
  it reports through `onLoadComponentError` instead of opening file `1`
- **The section header has its height (69/61/53px) and background back.** This changes the
  portal's layout
- **`TextInput`, `Textarea`, `Checkbox`, `ComboBox`** no longer default `tabIndex` to `-1`
- **`ModalDialog`** puts `role="dialog"` and `aria-modal` on the dialog surface, not the
  overlay
- **`Aside`** is a flex column whose body fills the remaining height; only `aria-*` props go
  to the `<aside>`, everything else to the header
- `DateTimePickerProps` includes the required `translations`
- **`TwoStateToggle`** defaults name the product ONLYOFFICE Apps: `title` is
  "ONLYOFFICE Apps design", `ariaLabel` "Switch ONLYOFFICE Apps design", and `confirmBody` ends
  "…the classic ONLYOFFICE Apps view." A test querying the old accessible name fails
- `ThemeProvider` no longer fetches the portal palette (the call never worked); pass
  `colorTheme`

### Added

- `FilterInput` and `StatusMessage` as named exports
- `Text`, `Heading`, `Link`: `role`, `aria-label`, `aria-live`, `aria-hidden`
- `Textarea` and `ModalDialog`: `aria-label`, `aria-labelledby`, `aria-describedby`
- `FieldContainer`: `labelFor`
- A README for every component and public provider; `docs/getting-started.md`,
  `docs/components.md` and `docs/public-api.md`
- `docs/plugin-surface.json`: every name the root barrel exports, with its kind and module

### Fixed

- `ImageEditor` crash on render; icons keep their `viewBox`
- `Selector` no longer scrolls the page on mount
- `RoomLogoCoverDialog` fits the window on first open
- `MCPServersSelector` loads the portal logo from the `ApiProvider`'s `baseUrl`
- Secondary scaled `Tabs` no longer report false overflow
- `RoomIcon` without `logo` draws initials
- `Uploader`'s `targetId` accepts `string | number`
- `ModalDialog` no longer leaks `touchend` listeners
- `ThemeProvider` follows a `colorTheme` that arrives after the first render
- Two mounted `Toast`s no longer throw
- `AIAgentSelector` no longer disables every agent for a right the folder never carries
- Missing `locales/en` keys for `Filter` and the AI agent export labels
- Brand and constant lookups survive a second module instance

### Known issues

- The root barrel needs `mobx`, `mobx-react`, `react-router` and `axios` to build (via
  `billing` and `uploader`); import by subpath to avoid them
