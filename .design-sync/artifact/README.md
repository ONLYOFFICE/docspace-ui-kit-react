# ONLYOFFICE Apps UI Kit

The React component library behind ONLYOFFICE Apps - the file manager, rooms,
people and settings screens - published as `@onlyoffice/apps-ui-kit`. Every
component here is the real compiled package (`window.AppsUiKit`), and each
preview was checked against the kit's own Storybook render. A quiet, dense
work UI: white or charcoal surfaces, one accent the portal owner chooses,
Open Sans at 13px, thin grey borders and small radii.

## Content fundamentals

- **The product is "ONLYOFFICE Apps".** Where space is tight - buttons, links,
  badges - "ONLYOFFICE" alone is enough ("Open in ONLYOFFICE"). An instance is
  "an ONLYOFFICE Apps portal".
- **Sentence case everywhere**: buttons, menu items, headings, tabs ("Shared
  with me", "Developer Tools" is the one product-name exception). Never all
  caps, except file-format badges (DOCX, XLSX, PPTX, PDF) and small status
  pills (BETA).
- **Verbs on buttons, nouns in navigation.** Buttons say what happens:
  "Save", "Send invitation", "Create room". Sections are nouns: "Files",
  "Rooms", "Forms", "People", "Trash".
- **Roles use the product's own words**: Owner, Full admin, Room admin,
  Power user, User, Guest.
- **Explain consequences plainly**, in one sentence: "This action cannot be
  undone." No emoji in the UI.

## Visual foundations

**Wrap every tree in both providers.** Most components read the theme and
translations from context; without them they render half-styled or show raw
keys (`SaveButton`).

```jsx
const {
  TranslationProvider,
  ThemeProviderComponent,
  previewTranslations,
  previewTheme,
  previewColorScheme,
} = window.AppsUiKit;

<TranslationProvider locale="en" translations={previewTranslations}>
  <ThemeProviderComponent
    theme={previewTheme}
    currentColorScheme={previewColorScheme}
  >
    <App />
  </ThemeProviderComponent>
</TranslationProvider>;
```

- `ThemeProviderComponent` stamps `data-theme` on `<html>` and defines
  `--background-color`, `--text-color` and the rest of the theme colours.
  Dark theme: `theme={{ ...previewTheme, isBase: false }}`. Right-to-left:
  `interfaceDirection: "rtl"` - it flips the whole page.
- **One accent.** `--color-scheme-main-accent` marks the current place
  (active nav item, selected tab underline, links, focus);
  `--color-scheme-main-buttons` fills primary buttons. Portal owners replace
  both at runtime, so read the variables - never hard-code `light-blue-main`.
- **Neutrals do the work.** Surfaces step from `--background-color` through
  the greys (`gray-light` for the nav and cards, `light-gray-hover` for row
  hover, `gray-light-mid` for dividers, `gray-strong` for control borders).
  Colour comes from content - file-type icons, room logos - not chrome.
- **Type.** Open Sans. Body and table text 13px (`Text` default), secondary
  12px, captions 11px; labels and names semi-bold (600); `Heading` sizes
  15 / 19 / 21 / 23 / 27px at 600.
- **Shape.** 32px controls (buttons, inputs, toolbar icons), 48px table rows,
  36px menu items, radius 3px on controls and nav items, 6px on cards,
  menus and dialogs. Borders are 1px; shadows only on floating layers
  (menus, dialogs, toasts).

## Styling idiom: props first, no utility classes

Component CSS is hashed CSS modules: there is no class vocabulary to reuse.
Style components through their props; enums live on the same global:

- `Button` - `label`, `primary`, `size={ButtonSize.normal}` (`extraSmall`,
  `small`, `normal`, `medium`), `scale` (full width), `isDisabled`.
- `Text` - `fontSize="13px"`, `fontWeight={600}`, `isBold`, `as="span"`.
- `Heading` - `level={HeadingLevel.h2}`, `size={HeadingSize.medium}`.
- `TextInput` - `type={InputType.text}`, `value`, `onChange`,
  `size={InputSize.base}` (`base`, `middle`, `large`), `scale`.
- `FieldContainer` - `labelText`, `labelVisible` (defaults to false - set it),
  `isVertical`, `isRequired`.

Layout glue is plain flex/grid with the theme variables. Each component also
exposes `--<component>-*` custom properties (in `components/bundle.css`) as
override knobs. Do not invent `var(--...)` names: tokens the full portal
defines are not shipped, and an unknown name fails silently. Prefer logical
properties (`margin-inline-start`, `padding-block`) so RTL works.

## Known traps

- `SearchInput.onChange` receives the string, not the event.
- `Textarea` has a max-width but no width - give its container one.
- `ToggleButton`'s label is absolutely positioned with no intrinsic size -
  put it in a sized container.
- `ComboBox` matches the selected option by label, not key.
- Overlays render `position: fixed` and start closed: `ModalDialog` and
  `Aside` open with `visible`, `DropDown` with `open`.
- The kit targets React 19. On React 18 the bundle patches `use`,
  `useEffectEvent` and context providers itself; a `ref` passed as a plain
  prop to a function component is dropped there.

## Screens

How real ONLYOFFICE Apps screens are composed from these components - the
app shell, lists and tables, panels and dialogs, settings pages, empty
states - is in the **Screens** section, measured from 82 product
screenshots. The screenshots themselves are in the **Screenshots** asset
group; open the one closest to what you are building.

## Iconography and assets

- **Logos**: the ONLYOFFICE mark for light and dark surfaces
  (`lightsmall.svg`, `dark_lightsmall.svg`, `dark_leftmenu.svg`). Use them as
  given; `PortalLogo` renders the portal's own logo.
- **Icons**: the kit draws its icons inside components (16px, single ink
  following the text colour). Of the icon set only the 22 icons re-exported
  by `QuickActions` and `NavMenu` are public; the rest are not synced here.

## Not synced

- Portal-only modules that need a live ONLYOFFICE Apps backend: AI chat and
  settings, the data-driven selectors (files, rooms, people, groups, agents,
  MCP servers), the document editor, the uploader, billing.
- Exports with no Storybook story (e.g. `ComboButton`, `HeadingWithTooltip`,
  `TooltipContainer`, `RowLoader`, `SearchLoader`, the dialog skeletons),
  icon components and `*Pure` variants.
- Theme variables whose values are shorthands or runtime expressions (border
  shorthands, `calc()`, `var()` chains) are not listed as tokens; they are in
  `components/bundle.css`.
- Built from `@onlyoffice/apps-ui-kit` 4.1.0 by the repository's
  design-sync; change it in code and re-run the sync, not on this page.
