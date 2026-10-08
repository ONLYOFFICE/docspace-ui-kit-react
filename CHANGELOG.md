# Change Log

## 4.0.0

First release under its own name and from its own repository. It was `@docspace/ui-kit@0.0.1`,
a workspace package of the DocSpace client resolved to its source root; it is now
`@onlyoffice/apps-ui-kit`, built and consumed as a package. The version follows the DocSpace
4.0 line.

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
