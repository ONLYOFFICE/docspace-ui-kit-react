# Design sync notes

Repo-specific findings for syncing `@onlyoffice/apps-ui-kit` to claude.ai/design.
Read before every re-sync.

## Setup

- Storybook shape, config at `.storybook/`. The reference build is
  `npx --no-install storybook build -c .storybook -o <repo>/.design-sync/sb-reference`
  (about 1000 stories under ~150 titles). Library build: `pnpm build` -> `dist/esm/index.js`.
- Converter runs with `--node-modules ./node_modules --entry ./dist/esm/index.js`
  and `NODE_OPTIONS=--max-old-space-size=8192`.
- First sync (2026-11-12): the user asked to build and verify everything
  locally first and approve the upload later. The project
  (`projectId` in config.json) was created empty and stays empty until then.

## Fixes

- [GENERAL] Decorator bundle fails: `.storybook/mocks/handlers/portal.ts`
  imports `*.svg?raw`, which the converter's esbuild has no loader for, so the
  Storybook decorators never wrap previews. Fix: explicit `cfg.provider`
  (TranslationProvider -> ThemeProviderComponent), mirroring the decorator in
  `.storybook/preview.tsx`. Its data (translations Map, light theme, light
  colour scheme, brand lookup) lives in `.design-sync/preview-context.mjs`,
  bundled through `cfg.extraEntries` and referenced with `$ref`.
- [GENERAL] Story titles that differ from export names are mapped in
  `titleMap` (Circle -> CircleSkeleton, Filter -> FilterInput, ...).
- [GENERAL] `.design-sync/overrides/story-imports.mjs` (fork, declared in
  `libOverrides`) teaches preview compiles what the repo's Vite setup does:
  - plain `*.svg` imports compile through svgr (`exportType: default`, ref,
    titleProp, no svgo - the `vite-plugin-svgr` options in
    `.storybook/main.ts`); `?url` stays a data URL, `?raw` is text. Without
    it about half the previews threw "tag name ... data:image/svg+xml".
    `@svgr/core` is reached via `realpath(node_modules/@svgr/rollup)` - pnpm
    does not hoist it.
  - component folders are kebab-case, so `import { DropDown } from "."`
    (-> `drop-down/index.tsx`) maps to the export ignoring case and dashes;
    otherwise the story renders a second source copy ("Element type is
    invalid").
  - imports into `utils|hooks|context|enums|constants|providers` that the
    repo-root `index.ts` re-exports (checked against each `<dir>/index.ts`)
    use the shipped bundle - a source copy broke `EmailSettings` instanceof
    checks in EmailInput. The repo-root `index.ts` counts as the barrel.
  - `@vueless/storybook-dark-mode` -> `useDarkMode() === false` (light).
  - the `fn(impl)` stub calls through to `impl` (TableBody's
    `fetchMoreFiles: fn(async () => {})` needs the promise).
  - eager `import.meta.glob("dir/*.ext", { query, import: "default",
eager: true })` is expanded to static imports (RoomLogoCoverDialog).
- `storyImports.bundle: ["components/room-logo/RoomLogo.tsx"]` - the story
  imports `RoomLogoPure`, which the root barrel does not export.
- Excluded via `titleMap: null`:
  - portal-coupled modules, not in the root barrel and needing a live portal
    (docs/public-api.md): AI Chat/Settings, Files/Rooms/Forms sections,
    Document Editor, the six data-driven selectors, ApiProvider;
  - `Samples/*` (whole demo apps, not components);
  - sub-components with no root export: ArticleItem, GroupMenuItem,
    TableHeaderCell, TableSettings, TilesSkeleton.

## Grading conventions (learned in the solo phase)

- [GENERAL] Reference shots are cropped to the story root and are often much
  smaller than the 900x700 preview shots, so the sheet scales them up. Compare
  sizes from `raw/` PNG dimensions, never from the sheet.
- [GENERAL] Many stories have `play` functions that click, type or focus.
  The reference captures the state after `play`; previews never run it. A
  focus ring, a typed value or a validation error that only `play` produces
  is a reference artifact: grade the component's render and say so in the
  note. If the play state is the whole point (a stateful error demo), grade
  `close` with that reason.
- [GENERAL] Overlays opened only by `play` (ModalDialog) render as a bare
  trigger button. Own the preview and force the open arg (`visible: true`)
  in the copied `compose()`, and set `cardMode: "single"`. The reference then
  shows only a backdrop band (fixed content falls outside the crop): judge
  the open dialog on its own.
- Story assets under Storybook's `staticDirs` (`/static/...`, e.g. Avatar's
  `/static/@.react.svg`) do not exist outside Storybook. Grade `close` with
  that reason; do not fake the asset.
- [GENERAL] Two copies of react-i18next: a story calling `useTranslation`
  under the bundle's `TranslationProvider` rendered raw keys
  (TranslationProvider Default). Fixed in the fork: story-side
  `react-i18next` resolves to `window.AppsUiKit.__dsReactI18next`, which
  `preview-context.mjs` re-exports from the bundle. The story's `./i18n`
  import shims to the root namespace via
  `storyImports.shim: ["providers/translation/i18n.ts"]`.
- [GENERAL] Lists/calendars opened only by `play` (AccessRightSelect
  CssCustomization, ComboBox WithOptionDescriptions, DatePicker
  FutureDatesOnly): the owned preview wraps just that story in an
  `openOnMount(Story, selector)` helper that clicks the trigger once after
  mount. Other stories stay generated-equivalent.
- [GENERAL] RTL stories set `globals.direction: "rtl"`, which flips the whole
  Storybook page; the preview provider is fixed LTR, so a fixed-width RTL
  component sits at the opposite edge. Framing only - grade the component.
- ToggleButton `right-to-left` is skipped: no root content in Storybook either
  (absolutely positioned label with no intrinsic size inside a bare `dir`
  div).
- PasswordInput CustomValidation / WithPasswordGenerator: the requirements
  tooltip opens only from typing (internal `displayTooltip` state, no prop) -
  graded `close`.
- Calendar Locale Examples is 868px tall; the 700px capture crops the last two
  calendars. Cosmetic; a `viewport` override would re-grade Calendar.
- `cardMode` overrides were applied as `package-validate` suggested
  (`[GRID_OVERFLOW]`: `wide` -> `column`, `escape` -> `single`).
- [GENERAL] Story-local `*.stories.module.scss` / `*.stories.scss` compiled
  to empty modules, so 13 story scenes lost their page background, cards and
  private `--<x>-story-*` tokens (Aside, Navigation, Row, NavMenu, ...). The
  fork compiles them with the repo's `sass` (`local-css` for modules, `css`
  otherwise); the output lands in `_preview/<Name>.css`.
- [GENERAL] `cardMode: "single"` wraps the story in `.ds-single`, which has
  `transform: translateZ(0)` and so is the containing block for
  `position: fixed` content. Fixed layers are inset by its 24px padding, and
  when the only child is fixed the wrapper is 0px tall (MainButtonMobile's
  `bottom: 24px` button landed above the card). The template is emitted by
  `lib/emit.mjs`, which must not be forked: give such a preview a tall box in
  its owned `.tsx` (MainButtonMobile: `minHeight: 640`), otherwise grade the
  inset `close` (Aside, Backdrop).
- [GENERAL] Open-on-mount helpers: some overlays attach listeners after
  mount (react-tooltip in HelpButton ignored a click in the first effect -
  300ms delay works); multi-step sequences (ContextMenu Dynamic Model) should
  advance on DOM changes (MutationObserver), not fixed timers.
- Owned previews that open a play-only overlay: AccessRightSelect, ComboBox,
  DatePicker, ContextMenu, DropDown, HelpButton, LinkWithDropdown, MainButton,
  Aside, Backdrop, ImageEditor (replays the upload), ModalDialog.
- Dropzone Loading: graded `close` because of a COMPONENT defect - the
  spinner (`.dropzoneLoader`, absolute 50%/50%) has no positioned ancestor
  (`.dropzoneWrapper` lacks `position: relative`), so in Storybook it centres
  on the page, outside the box. The preview cell is positioned and shows it in
  the box. Fix belongs in `components/dropzone/Dropzone.module.scss`.
- ImageEditor: four stories `close` - the reference's image area is blank for
  the SVG picture, the preview draws it. Cause on the reference side not
  found.
- [GENERAL] Story imports of a COMPONENT's own `*.module.scss` (Card's
  `styles.connectedStatus`, Portal) got an empty map. Rollup drops unused keys
  from the shipped JS map, but the rules ship in `_ds_bundle.css`; the fork
  reads every `dsui-<Name>-module__<local>--<hash5>` class from
  `dist/esm/<path>/index.css` and exports that map.
- [GENERAL] Component-file mapping in the fork is case-insensitive under
  `components/` (`./Snackbar` -> `SnackBar`) and follows the barrel's
  renames (`export { default as FilterInput } from "./filter"`). Without it
  SnackBar and FilterInput rendered unstyled source copies.
- [GENERAL] Previews ignore `parameters.layout: "centered"`; auto-fill grids
  under it lay out differently (RoomLogo). Framing only.
- TwoStateToggle Right To Left: the thumb direction comes from the theme's
  `interfaceDirection`; the preview provider is LTR for the whole page, and an
  RTL provider per story would flip every other story in a grid card. Graded
  `close`.
- OperationsProgressButton and Toast: owned previews (fixed bottom-right
  button in a `minHeight` box; Toast clicks the story's first trigger after
  300ms). OperationsProgressButton Completed Operation is `close` - autoHide
  slide-out caught mid-animation.
- StatusMessage Toggle Visibility / Message Swap / Quick Change: end states
  reachable only through `play` - `close`.
- Component defects found while grading (not preview faults):
  - Dropzone: `.dropzoneWrapper` lacks `position: relative` (above).
  - RoomType: open-state border uses `var(--accent-main)` with no fallback
    (`RoomType.module.scss` lines 153, 206) - currentColor without the portal
    theme.
- [GENERAL] A component `*.module.scss` with no shipped CSS (story-only:
  `Portal.module.scss`, which Portal.tsx never imports) or a Storybook
  helper's module (`.storybook/utils/RenameField.module.scss`, the tiles'
  Renaming State icon) is compiled with sass as `local-css` by the fork.
- [GENERAL] HARNESS PATCH, lost on every re-stage of `.ds-sync/`: the compare
  reference server `.ds-sync/storybook/http-serve.mjs` had no `.svg` MIME
  type, so `*.svg?url` images in the REFERENCE rendered as broken `<img>`
  (EmptyScreenContainer, likely ImageEditor). Re-apply after copying the
  scripts: add `'.svg': 'image/svg+xml'` (and woff/woff2) to its `MIME` map.
- AppLoader: owned preview, `minHeight: 652` box (fixed loader at
  `top: 35%` in the single card). Css Customization `close` - 24px inset.
- RowsSkeleton / CircleSkeleton / RectangleSkeleton `[RENDER_THIN]` are
  validator false positives: skeletons have no text; both sides paint.
- InfiniteLoaderComponent Right To Left `close` - same fixed-LTR provider
  cause as TwoStateToggle.
- [GENERAL] Stories whose only content is `position: fixed`
  (MainButtonMobile, AppLoader, Aside, Backdrop, OperationsProgressButton,
  Portal) photograph BLANK on the reference side: compare crops to the story
  root. Grade them against a full 900x700 viewport shot of
  `sb-reference/iframe.html?id=<id>&viewMode=story`.
- [GENERAL] DropDown re-measures its direction only on resize. Storybook's
  iframe fires a resize after load (menus near the bottom flip above the
  trigger); previews do not. Owned open-on-mount previews that need the flip
  dispatch `window` "resize" ~50ms after opening (MainButtonMobile).
- Owned previews with a `minHeight: 652` box for the single card: Aside,
  Backdrop, ContextMenu, HelpButton, MainButton, AppLoader, Portal,
  OperationsProgressButton (MainButtonMobile: 640).

## Re-sync risks

- `.design-sync/overrides/story-imports.mjs` is a fork of the converter's
  `lib/story-imports.mjs`. A converter update can change the stock module;
  diff the fork against the new stock copy and re-apply the `FORK
(apps-ui-kit)` blocks. Any fork edit clears EVERY grade (global contract) -
  budget a full re-grade.
- The `.svg` MIME patch in `.ds-sync/storybook/http-serve.mjs` is lost on
  every re-stage of `.ds-sync/` (see above). Without it the reference shows
  broken images and ImageEditor / EmptyScreenContainer grade falsely.
- 21 owned previews in `.design-sync/previews/` copy the generated
  `compose()` and replay `play` steps by selector / text / timer
  (`openOnMount`, clicks after 300ms, MutationObserver sequences). They
  shadow story edits: when a `[STORY_CHANGED]` names one, update it by hand.
- `[STORY_CAP]`: compare grades only the first 6 stories per component; the
  tail stories of ~40 components were never individually graded.
- Accepted `close` grades (play-only end states, 24px single-card inset,
  fixed-LTR provider for RTL stories, Avatar's `/static/` icon, Dropzone and
  RoomType component defects) are listed above - re-check them if the
  component changes.
- `preview-context.mjs` imports `dist/esm/index.js`, the locales and
  `test/fixtures/brands.json`; it rebuilds from those on every build.
- `[TOKENS_MISSING]` (~77 portal tokens referenced, not shipped) is expected:
  the portal defines them (`.claude/rules/theming.md`). Not a sync defect.
- Toolchain at first sync: Node 25.9, pnpm 12.11.2, Storybook 10, converter
  bundled with Claude Code 2.1.321.
- The screen layout guide lives at `docs/guides/screens.md` (picked up by the
  converter's default `guidelinesGlob`). It is distilled from the product
  screenshots in `../DocSpace/screenshots` (taken 2026-11-12, fake data),
  which are uploaded to the project under `screenshots/` - outside every path
  this sync writes or deletes, so re-syncs leave them alone. The guide cannot
  live under `.design-sync/`: the guideline path mirrors the source path, and a
  dot folder in the project path is treated as local. `docs/guides/` is not in
  `package.json` `files` and Storybook indexes only `.mdx` there.
