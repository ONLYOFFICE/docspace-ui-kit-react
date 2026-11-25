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
- **States are derived, not stored.** The kit keeps one colour per control
  and computes its states in CSS: a primary button is the fill at opacity
  0.85 on hover and 0.6 when disabled, and `brightness(90%)` (dark theme
  82%) when pressed; a badge is `color-mix` of its colour at 85% with
  transparent on hover and at 90% with black when pressed. The
  `color-scheme-main-buttons-hover`, `-pressed` and `-disabled` tokens are
  those results for the default fill - use them as written, and for any
  other colour apply the same rule rather than picking a shade.
- **Neutrals do the work.** Surfaces step from `--background-color` through
  the greys (`gray-light` for the nav and cards, `light-gray-hover` for row
  hover, `gray-light-mid` for dividers, `gray-strong` for control borders).
  Colour comes from content - file-type icons, room logos - not chrome.
- **Type.** Open Sans. Body and table text 13px (`Text` default), secondary
  12px, captions 11px; labels and names semi-bold (600); `isBold` is 700;
  `Heading` sizes 15 / 19 / 21 / 23 / 27px at 600. The text styles in
  `tokens.json` are the size / weight / line-height combinations the kit's
  own `Text` and `Link` elements use, most used first.
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
- `SearchInput` with `showClearButton` shows a cross in an empty field; leave
  it off to get the search loupe.

### On a Design canvas

A canvas mounts each component through `<x-import>` and wraps every one in a
`<div style="display: contents">`. Most components do not notice; these do:

- **Slot components get their slots as the `children` prop, not as child
  markup.** `Article` finds `Article.Header`, `Article.MainButton` and
  `Article.Body` by `displayName`, and the wrapper hides child markup, so
  written inside the `<x-import>` they are dropped and the panel is empty.
  Build the slots in the logic class and pass them as a prop -
  `children="{{articleSlots}}"`, where `articleSlots(K)` returns
  `[h(K.Article.Header, {key: "header"}, …), h(K.Article.Body, {key:
"body"}, …)]` with `h = window.React.createElement`. `Article` then draws
  its own back button (`showBackButton`), Developer Tools bar (`isAdmin`)
  and profile block (`user`, `getActions`); set `hideAppsBlock` and
  `withCustomArticleHeader`, and put the logo `<img>` and an `IconButton`
  with `iconNode={h(K.ArticleHideMenuIcon)}`, `size: 20`, `isStroke` in the
  header slot, as the kit's Article story does. The nav items inside the body
  are markup - `ArticleItem` is not exported: items 36px, a 16px
  **Navigation** icon and a 13px semi-bold label, the active item a grey
  pill (radius 3px) in the accent colour.
- **A table needs 25px of room above it, and no scrolling box around it.**
  `TableContainer` has `margin-top: -25px` and `TableHeader` is
  `position: fixed`; without the room the header covers whatever is above
  the table, and inside an `overflow` box it is clipped. Give the header and
  the body the same `columnStorageName` and `columnInfoPanelStorageName`,
  and `withoutWideColumn` when no column should take 40% of the width.
- **A ref that ends up holding a DOM node breaks the artboard** with
  "Maximum call stack size exceeded": the runtime walks what `renderVals()`
  returns, and a DOM node leads back to itself through React's fields. Give
  `TableContainer`/`TableHeader` a ref whose `current` is a non-enumerable
  accessor (`Object.defineProperty(ref, "current", { get, set,
enumerable: false })`).
- **Fonts: copy every normal-style file, not one.** Open Sans ships split
  by script: each `memvY…` file in `tokens.json` `type.fonts` (style
  `normal`) covers one alphabet - Latin, Cyrillic, Greek, Vietnamese and
  their extensions - and `memtY…` are the italics. Copy all the normal ones
  into the canvas and declare each in its own `@font-face` (family
  `Open Sans`, weights 300-800). With only the Latin file, Russian and every
  other non-Latin text silently falls back to a system font.
- **`RoomIcon` initials are dark unless you set them.** The title reads
  `var(--room-icon-text-color, #333)`; production sets it to `#fff`. Set it on
  a wrapper (or colour the initials white), or a coloured tile gets dark
  letters.
- **`RoomIcon` draws its initials in an element with the global class
  `room-title`.** A page class of the same name restyles the initials (size,
  clamp, underline). Name your own classes differently.
- **Counters and "BETA" are `Badge`** (11px, weight 800): a hand-made pill
  with a guessed line height sets the digits below centre.

## Screens

How real ONLYOFFICE Apps screens are composed from these components - the
app shell, lists and tables, panels and dialogs, settings pages, empty
states - is in the **Screens** section, measured from 82 product
screenshots. The screenshots themselves are in the **Screenshots** asset
group; open the one closest to what you are building.

## Building a screen: rules

A design made from this system is read as a picture of the product, and is
handed on to developers and to other tools (exports, Figma). These rules keep
it truthful. They apply to every region of the screen, the background behind
a dialog included - a simplified background is still read as the product.

1. **Start from a screenshot.** Find the closest picture in the
   **Screenshots** group (index at the end of **Screens**) and open it before
   drawing anything. When the request is a screen the product already has,
   the screenshot is the reference, not your memory of the product.
   A picture of **another** product (a competitor's page, a mock-up from
   elsewhere) is a list of what the screen must do, never a layout to copy:
   take its content - the data, the columns, the actions - and build it
   from the closest ONLYOFFICE Apps screenshot and the patterns in
   **Screens**, with the kit's controls in the kit's styles. Its toolbar
   becomes `FilterInput`, its tabs `Tabs`, its table `TableContainer`; an
   action that has no place in those patterns is left out and named in the
   hand-over, not drawn in the other product's style.
2. **Match it, do not paraphrase it.** The same items, in the same order,
   with the same labels, icons positions and nesting: navigation entries and
   their sub-items, header controls, toolbar buttons, table columns, panel
   sections. Do not add an entry the screenshot lacks, drop one it has, or
   move one. The left navigation tree is written out in **Screens** - copy
   it from there.
3. **Show the state the screenshot shows** unless the request names another.
   Other states (filled, empty, error, loading) are extra artboards beside
   it, each named for its state - not a replacement for the reference.
4. **Use the kit's component for every region it has one for**: `Article`
   for the left navigation, `Navigation` for a room or folder header,
   `FilterInput` for the search toolbar, `TableContainer` / `TableHeader` /
   `TableRow` for lists, `Aside` + `Backdrop` for side panels, `ModalDialog`
   for centred dialogs, `EmptyView` for empty states. Plain markup is for
   layout glue and for the parts that are not kit components (the create
   tiles above a file list). A hand-drawn look-alike of a kit component is a
   defect, even when it looks close. Using the component is not enough:
   give it the props the product gives it. Take sizes, colours and variants
   from **Screens** and from the component's own README examples rather
   than picking a plausible `size` - a person column is a 16px `Avatar`
   with a grey 12px name, not a 32px one with initials.
5. **Take icons from the Navigation and Icons groups, and mark what you
   could not source.** Every left-navigation icon - Files, Rooms, People,
   each Settings and Developer Tools entry, the panel's back, collapse toggle and
   Developer Tools arrow - is in **Navigation**, with a table of which entry
   uses which file; action, file-type, room and template icons are in
   **Icons** (see **Iconography and assets**). An icon that is in neither,
   and any copy that is in neither the screenshot nor the kit's
   translations, is a placeholder or an assumption. Draw an icon placeholder
   at the real size, and write copy that you made up only where the screen
   cannot do without it.
6. **Look at what you made before handing it over.** Render the design, take
   a screenshot at the reference's size, and compare it with the reference
   screenshot region by region: nothing overlapping or clipped, no label
   truncated that the reference shows whole, the right font (not italic, not
   a fallback), every icon present. "It renders without errors" is not this
   check. Fix what the comparison shows, and look again.
7. **Write no value of your own.** Every colour, shadow, font size,
   spacing and radius in your markup is a token's value from `tokens.json`
   (or a `var()` the kit defines) - the tokens are exactly what the
   product's code uses, and **Token sources** says where each one comes from.
   No new greys, tints, purples or gradients; no `16px` gap because it looks
   right when the tokens have 12 and 20. If the design needs something the
   system does not have - a colour, a component, an icon - draw a labelled
   placeholder ("Not in the kit: <what>") instead of making it up, and list
   it in the hand-over. A design is checked with
   `node .design-sync/artifact/check-design.mjs <its folder>`, which lists
   every value that is not a token, every inline `<svg>` and every missing
   font file.
8. **Report the differences.** End every hand-over with four short lists:
   where the design differs from its reference screenshot, which parts are
   placeholders, what the system lacked (from rule 7), and which behaviour
   or copy you assumed. Say so even when the difference was deliberate.
   Nobody should have to compare the pictures to find out.

There is no Figma library of these components. Whatever a design is exported
to arrives as plain layers that link back to nothing here, so a deviation
from the product travels with it unnoticed - which is why rules 2, 6, 7 and 8
matter more than polish.

## Iconography and assets

- **Logos**: the ONLYOFFICE mark for light and dark surfaces
  (`lightsmall.svg`, `dark_lightsmall.svg`, `dark_leftmenu.svg`). Use them as
  given; `PortalLogo` renders the portal's own logo.
- **Icons**: the kit draws its icons inside components (16px, single ink
  following the text colour). For icons you place yourself, the **Icons**
  asset group holds every file of the kit's `assets/icons/`, named by size
  folder: `24/` and `32/` file
  types for lists and tables, `64/` and `96/` for tiles, `32/room/` and
  `32/template/` for room types. The group's README says which to use where,
  and how to colour a single-ink icon (it is an uploaded picture, so an
  `<img>` keeps its grey). In code, only the 22 icons re-exported by
  `QuickActions` and `NavMenu` are public API.
- **Navigation**: every icon the left navigation draws, taken from the
  product's own map of navigation entries to icons, plus the panel's
  controls. The kit does not ship several of them (Integration, Data import,
  Apps, every Developer Tools entry, the Upgrade gift), so they are not in
  **Icons**; take navigation icons from here. Its README is the table of
  which entry uses which file.

## Not synced

- Portal-only modules that need a live ONLYOFFICE Apps backend: AI chat and
  settings, the data-driven selectors (files, rooms, people, groups, agents,
  MCP servers), the document editor, the uploader, billing.
- Exports with no Storybook story (e.g. `ComboButton`, `HeadingWithTooltip`,
  `TooltipContainer`, `RowLoader`, `SearchLoader`, the dialog skeletons),
  icon components and `*Pure` variants.
- Component-level custom properties (`--button-*`, `--payment-*` and the
  like) are not tokens: they are each component's override knobs, in
  `components/bundle.css`. The tokens are the palette entries and values
  those properties are built from.
- Palette entries no code uses, and spacing, radius and text-style values
  used too rarely to count, are not tokens; **Token sources** lists them
  all with the rule that left them out.
- Built from `@onlyoffice/apps-ui-kit` 4.1.0 by the repository's
  design-sync; change it in code and re-run the sync, not on this page.
