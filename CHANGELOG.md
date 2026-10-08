# Change Log

## Unreleased

Every fault `docs/known-defects.md` collected is fixed — the eleven it opened with and the two
the sweep turned up — and the file is gone. Four of these change what a consumer sees, so read
_Changed_ before upgrading.

A second round followed once every story had a play function: the plays turned up about a
hundred more faults, most of them keyboard and screen-reader gaps, and those are fixed below as
well. Several change element types, roles, test ids or event timing; each such change is listed
under _Changed_.

### Changed

- **`ComboBox`'s `onToggle` may receive a keyboard event.** The keys that open and close the
  list call it too, so its first argument is typed
  `React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>`. A handler declared
  to take only a mouse event no longer compiles, and one that reads `clientX` or `button` has
  to check which event it got
- **`Article` and `ArticleLiveChat` drive the Zendesk widget through the messaging API, and
  `zendeskEmail` and `chatDisplayName` are gone.** The portal's Zendesk account serves the
  messaging Web Widget, which does not answer the Web Widget (Classic) `webWidget` commands the
  live chat was sending - it throws "Method webWidget.hide does not exist" - so none of the
  settings reached the widget. Every command now goes through `messenger`: the locale follows
  `languageBaseName`, the widget opens on the left in RTL, its iframes sit at z-index 201
  instead of its 999999, and the launcher is placed through `messenger:set customization` from
  the same `FLOATING_CORNER_*` numbers as the create button, one button aside while a floating
  button is on screen and clear of the docked info panel, and its iframe is scaled down to the
  corner's 48px button size (Zendesk draws it 64px and has no setting for it). The launcher label, the colour and
  the visitor prefill have no messaging API (they are Admin Center settings), so those calls
  are gone, and with the prefill the two props that fed it; a caller still passing them gets a
  type error. `Zendesk` no longer takes `config`: `window.zESettings` is read by Classic only
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
- **The segmented `Tabs` bar is a real tab list and no longer takes the Tab key.** It used to
  listen for Tab on `window`, cancel it and pull focus onto itself, so a keyboard user could not
  leave it (WCAG 2.1.2). It is now `role="tablist"` with `role="tab"`, `aria-selected` and
  `aria-disabled`, one Tab stop (roving `tabindex`, on the selected tab), and a key handler on the
  list itself: arrows (swapped in RTL), Home and End move the focus, Enter or Space selects, Tab
  moves on. Keyboard navigation no longer needs `hotkeysId`, which now only adds its
  `secondary-tabs-scroll-<hotkeysId>` class, and no `...-undefined` class is set without it. The
  document-wide `mouseup` listener is gone, and the keyboard highlight is drawn on
  `:focus-visible` instead of the `focused` class
- **`Loader` is a `role="status"` region and draws the oval by default.** Its `label` is the
  region's visually hidden text for every animation type (`rombs` included), defaulting to
  "Loading content, please wait."; the animations are `aria-hidden` and lose their built-in
  English titles ("dual ring", "oval", "track"), and the wrapper no longer sets `aria-busy`. A
  `Loader` without `type` now draws the oval instead of rendering its label as text;
  `LoaderTypes.base` still renders the text.
- **`ErrorContainer` no longer writes fixed element ids.** The `container-inner`, `header`,
  `text`, `customized-text`, `button-container`, `button` and illustration ids (`background`,
  `birds`, `baloon`, ...) are gone; the parts are styled through module classes, so two error
  pages in one document no longer duplicate ids. A stylesheet or test that targeted those ids
  must select by role or by the outer element's `className` instead.
- **`Card`'s outer element is a `<section>`, and a string `title` is a heading.** Its `<header>`
  and `<footer>` no longer become page-level `banner` / `contentinfo` landmarks. A string `title`
  renders as an `<h3>` (new `titleLevel` prop for another level) with the same look; a node
  `title` is rendered as given. A selector written against `div` for the card or the title needs
  updating.
- **The `Tags` create tag's test id is `tag_item_create`**, not `tag_item_`, and it no longer
  renders an empty label element
- **`RoomIcon`'s hidden file input no longer has the id `customFileInput`.** The id is generated
  per instance, so two editable tiles no longer share one and the client's
  `document.getElementById("customFileInput")` lookups stop finding the logo input. Use the ref
  the upload entry of `model` is handed, or `data-testid="customFileInput"`
- **`Avatar` is a button only when a click does something.** With `onClick`, or when editable
  (`onChangeFile` without `noClick`), it carries `role="button"`, `tabindex="0"` and an
  `aria-label` from `userName`, and Enter and Space click it; otherwise it has no role at all,
  where it used to claim `role="button"` always. A picture's `alt` is `userName` (empty without
  one) instead of the literal `"avatar"`, and the hidden file input's id is generated per
  instance instead of `customAvatarInput`
- **`MCPIcon` is one image named after its server.** The tile is `role="img"` with
  `aria-label` set to `title`, with or without a picture; the `<img>` inside has `alt=""`
  instead of the fixed `"mcp icon"`, and the letter is hidden, so a screen reader no longer
  reads a bare letter. With an empty `title` the icon is `aria-hidden`
- **`MainButton.model` is optional with `isDropdown={false}`, and `opened` no longer reaches the DOM.** `opened` was never read and is now deprecated.
- **`MainButtonMobile` is operable from the keyboard and reports every open and close.** The floating button carries `aria-haspopup="menu"` and `aria-expanded`; the sheet is a `menu` of `menuitem`s that the arrow keys, Home, End, Enter and Escape operate; the alert badge is a button named "Alert" with `withAlertClick`. `onClose` now fires whenever the sheet closes (button, backdrop, item, Escape, Back) and never on opening, regardless of `isOpenButton`; the new `onOpen` reports opening. `isOpenButton` and five other ignored props are deprecated.
- **The `QuickActions` strip is a horizontal toolbar.** The arrow keys (mirrored in RTL), Home and End move focus between tiles and scroll the focused tile into view; Tab still visits every tile.
- **`TimePicker`'s fields are `type="text"` and take translated names.** They were
  `type="search"` and were announced as search fields. New `ariaLabel`, `hoursLabel` and
  `minutesLabel` props name the group and the fields (defaults "Time picker", "Hours",
  "Minutes"); `hasError` now sets `aria-invalid` on both fields; and `autoAdvance={false}` keeps
  the focus where the user put it instead of jumping between fields (default `true`, as before).
- **`ColorPicker` is a `role="group"`, not a `role="dialog"`, and Escape calls `onClose`.** It
  never trapped, moved or returned focus. A selector for `[role="dialog"]` no longer finds it. The
  group is named by the new `ariaLabel` prop and the cross by the new `closeButtonLabel` prop.
- **`ColorPicker`'s hex field is named by its caption, and the buttons are translated by
  default.** The "Hex code" caption is now a `<label>` for the field, so the field's name is
  `hexCodeLabel` ("Hex code:") rather than "Hex color value"; left out, `applyButtonLabel` and
  `cancelButtonLabel` use the kit's `Common:ApplyButton` and `Common:CancelButton` translations.
- **`InfiniteLoader` takes its scroll element as `scrollElement`.** Without it the loader still
  looks for the portal's `#sectionScroll` (`#customScrollBar` on mobile) scroller and falls back
  to the window, so the portal sees no change.
- **`SelectionArea` can start a drag outside `#sectionScroll`.** The new `startAreaSelector` prop
  names the region a drag may start in; the default stays `#sectionScroll`.
- **`hideProfilePicker` is documented as the lock it is.** `@onlyoffice/ai-chat` 0.6.0 and later lock the composer's model picker instead of removing it (its menu also carries the Effort row). The prop's JSDoc, the AiChatPanel docs page and the `WithoutModelPicker` story said it removed the picker; nothing in this package's behaviour changed.

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
- **`FormWrapper` can be the form.** A new `onSubmit` prop renders the card as a `<form>` that
  calls the handler with the browser's navigation prevented, so Enter in a field submits it;
  `aria-label` / `aria-labelledby` make it a named form landmark. Without `onSubmit` it is a
  `<div>` as before. The README now states that `--form-wrapper-min-width` /
  `--form-wrapper-max-width` size the content, so the card is that width plus twice the padding.

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

- The AI agent's editor tool calls go to the portal's own origin only. They carry what the
  model writes into a document, and were posted to the editor panel's iframe and to the
  generated-file tab with the target origin `"*"`, so a window that had meanwhile navigated
  elsewhere — a sign-in redirect, a link followed in the tab — would have received them. Both
  windows open the portal's `/doceditor`, so the calls are now addressed to
  `window.location.origin` and the browser drops one whose window holds any other page
- `ComboBox` works from the keyboard. The button answered no key, so a list could not be opened
  without a pointer, and the ArrowDown and Enter handler on the document looked for options by a
  test id its own options never carry — so it moved nothing, and while a list was open it
  swallowed Enter for the whole page. The button now answers Enter, Space and the arrows to open
  the list, the arrows to move a highlight that skips options which cannot be picked, Enter or
  Space to pick, and Escape or Tab to close. This holds with `dropDownMaxHeight` too, where the
  virtual list used to draw its own highlight over the combo box's and to prevent every key on
  the page, Tab included; the combo box now turns that listener off and scrolls the highlighted
  row into view. Nothing listens on the document any more. The button carries
  `aria-activedescendant`, but on `role="button"` screen readers ignore it, so the highlight is
  visible and not yet announced
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
- **A disabled `Tabs` item cannot be selected.** The click handlers of both bars, the segmented
  keyboard and the overflow arrows now refuse it; before, only CSS `pointer-events: none` kept
  the pointer off it, and the arrows selected it
- **A closed `ModalDialog` is hidden from assistive technology.** With `visible={false}` it stayed
  mounted as `role="dialog"` with `aria-modal="true"`, so a screen reader was told the page behind
  an invisible dialog was unavailable, and its controls stayed in the Tab order. The outer element
  is now `aria-hidden` and `inert` while closed, and the surface drops `aria-modal`
- **`TwoStateToggle`'s default strings name the product through `getBrandName("ProductName")`.**
  `title`, `confirmBody` and `ariaLabel` said "DocSpace"; they now follow the portal's branding,
  and say "ONLYOFFICE Apps" when no brand lookup is registered. Explicit props are unaffected
- **`Label` no longer puts `aria-required` or `aria-invalid` on the `<label>`**, where ARIA does
  not allow them and nothing announced them. `FieldContainer` now puts them where they belong: the
  control in its body (the one `labelFor` names, or its first `input`, `textarea` or `select`)
  gets `aria-required` with `isRequired`, `aria-invalid` with `hasError`, and `aria-describedby`
  pointing at the error message while it shows. Attributes the control already carries are left
  alone. A bare `Label` with `isRequired` or `error` is now visual only; put `required` and
  `aria-invalid` on your input
- **`Checkbox`'s `truncate` cuts the label with an ellipsis.** The text ran out of a narrow
  container on one line instead, because its wrapper could not shrink and the span could not
  carry `text-overflow`
- **`Slider` accepts `aria-label`, `aria-labelledby`, `aria-describedby` and `aria-valuetext`**
  and passes them to the `<input>`; before, they were dropped and the slider could only be named
  by a `<label>`
- **`DropDown` renders one backdrop.** An open menu in the default mode used to paint two
  `Backdrop`s on top of each other; it now renders exactly one, beside the menu or inside the
  portal with `usePortalBackdrop`, and a `backDrop` you pass replaces it rather than adding to it.
- **`DropDown` closes on an outside tap on mobile devices.** The listener was registered for one
  event named `"click, touchend"`, which never fires; it now listens for `click` and `touchend`
  separately, and ignores the tap that opened the menu, which is still bubbling when the
  listeners are attached. A menu rendered open from the start also gets its `eventTypes`
  listeners now.
- **`DropDownItem`'s external-link icon is a real link.** It is now
  `<a href={externalLinkPath} target="_blank">`, focusable and named "Open <label>" (override with
  the new `externalLinkLabel`). With `onExternalLinkClick` a plain click still goes to the callback
  and the `href` is not followed, so router-based handlers keep working.
- **`LinkWithDropdown` works from the keyboard.** The trigger is in the tab order (out of it while
  `isDisabled`), Enter and Space toggle the menu and Escape closes it; `aria-haspopup` is now
  `"listbox"`.
- **`LinkWithDropdown`'s `manualWidth` can exceed 200px.** The 200px cap now applies only to a menu
  that sizes itself.
- **`Dropzone`'s full format list closes on a click outside** and is keyboard-operable: with
  `fullExstsText` the format line is `role="button"` with `aria-expanded`, Enter and Space toggle
  the list, Escape closes it.
- **`Dropzone` uploads a folder from the keyboard.** In folder mode the area stays in the tab
  order and Enter or Space opens the directory picker.
- **`FileInput` accepts any file by default.** The old default `accept` of `[""]` refused every
  file with a MIME type; a missing, empty or `[""]` `accept` now means any file.
- **`FileInput` is inert while `isDisabled` or `isLoading`.** A drop, Enter and Space no longer
  open or fill it, it leaves the tab order, and `aria-disabled` is `"true"` under `isLoading` too.
  The read-only field and the `buttonLabel` button inside it are no longer separate tab stops.
  A new `onReject` prop receives the files `accept` refused; while it is set no toast is shown.
- **`ContextMenuButton` is a keyboard-operable menu button.** The icon is `role="button"` in the
  tab order, named by `title`, with `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`;
  the menu is `role="menu"` with `menuitem` items, and Enter, Space, the arrow keys, Escape and
  Tab work as in the WAI-ARIA menu button pattern. `DropDown` gains a `role` prop and applies its
  `id`; `DropDownItem` gains a `role` prop.
- **`ContextMenuButton.onClick` fires when the menu opens**, not on the click that closes it, and
  `onClose` fires on every close, a second click on the button and a chosen item included, so
  the two pair up (a caller that locks scrolling in `onClick` and unlocks it in `onClose` is no
  longer left locked). Every prop now reaches the component (the memo compared only four). Without `getData` the
  button shows `data` instead of throwing, and `onMouseOver` / `onMouseOut` fire on mouseover and
  mouseout rather than mousedown and mouseup.
- **`ProgressBar` announces what it shows.** `percent` is clamped to 0..100 at both ends (a
  non-number counts as 0); `isInfiniteProgress` leaves `aria-valuenow` out and sets `aria-busy`,
  so the bar is no longer announced as "0 %"; the status line sits in an always-mounted polite
  live region and the error line is a `role="alert"`.
- **`PreparationPortalProgress` is a progress bar to assistive technology.** It now carries
  `role="progressbar"`, `aria-valuemin`/`aria-valuemax`, an `aria-valuenow` from a clamped
  `percent`, and `text` as its name; the `role` and `aria-*` props still override them. A
  `percent` outside 0..100 no longer overflows the track.
- **`SnackBar`'s controls are keyboard-operable buttons.** The close cross is a
  `<button type="button">` (it no longer submits a surrounding form) named by the new
  `closeButtonLabel` prop, default `"Close"`; the `btnText` action and the campaign banner's
  cross are buttons too. The bar is `role="status"` with `aria-live="polite"`.
- **`SnackBar.show`/`SnackBar.close` manage one React root.** Repeated `show` calls re-render the
  same root instead of stacking new ones and new `#snackbar` divs; `close()` unmounts it with or
  without `parentElementId` and removes the `#snackbar` node `show` created. The bar's DOM id is
  now the `id` prop (default `snackbar-container`), and `isMaintenance`, `onClose` and `skipBlur`
  no longer leak onto the DOM.
- **Every toast can be closed from the keyboard.** The cross is now a
  `<button type="button">` named by the new `Toast` prop `closeButtonLabel` (default `"Close"`)
  instead of an unnamed, unfocusable `IconButton`; a toast opened without `withCross` carries the
  same button, visually hidden until it takes focus, so a toast with `timeout` 0 can always be
  closed with Tab and Enter.
- **`Toast` follows the interface direction.** `react-toastify`'s `rtl` flag comes from
  `ThemeProvider`'s interface direction instead of being on in every language.
- **`toastr.*` no longer shows an empty toast for a number** (numbers, booleans and objects with
  their own `toString()` are shown as text), and the default titles fall back to the English
  `Done`/`Warning`/`Alert`/`Info` when no `TranslationProvider` is mounted.
- **`AppLoader` announces the wait.** The loader inside it is a status region reading the new
  `label` prop (default "Loading content, please wait."), and the sheet carries
  `aria-busy="true"`.
- **`LoadingButton` can be cancelled from the keyboard and reports its progress.** With
  `onClick`, the disc in the middle is a `role="button"` in the tab order, pressed with Enter or
  Space and named by the new `cancelLabel` prop (default: the translated "Cancel"). The ring is a
  `role="progressbar"` named by the new `progressLabel` prop, reporting the clamped `percent`
  (no value while it spins at 0). `id`, `className` and `style`, previously ignored, now land on
  the outer square.
- **`StatusMessage` no longer stays behind invisible.** The swap or removal that waited only for
  `transitionend` now also happens on a 0.4s fallback, so a message changed again before the fade
  started (a new text, then `""` in the next frame) is removed instead of sitting in the DOM at
  zero opacity. Returning to the text on screen calls the fade off.
- **`StatusMessage` announces itself and repaints on `isWarning`.** An error bar is
  `role="alert"`, a warning bar `role="status"`, both `aria-atomic`; changing `isWarning` alone
  now repaints the bar at once. The bar carries `data-testid="status-message"`.
- **`FloatingButton` is operable and readable without a mouse.** With `onClick` the circle is a
  `role="button"` in the tab order, activated by Enter and Space, and named by the new `label`
  prop (the old `"<icon> button"` string remains the fallback). Its progress is a visually hidden
  `role="progressbar"`; the cancel cross is a `<button type="button">` named by the new
  `cancelLabel` prop (default: the translated "Cancel") that also appears on keyboard focus; an
  `iconUrl` image is decorative (`alt=""`).
- **A click on an `OperationsProgressButton` row's icon opens its panel once.** The icon carried
  the row's `onOpenPanel` handler as well, so the click called `showPanel(true)` twice. The
  row label's `progressHeader` class, lost to a stray comma operator, is now applied (without
  changing the layout).
- **`ErrorContainer`'s illustration is hidden from screen readers and follows the dark theme.**
  Its thirteen SVGs sit under an `aria-hidden` wrapper, and their colours come from private
  custom properties with a dark-theme variant instead of literal fills.
- **`PortalLogo` can be named.** A new `alt` prop (default `"portal logo"`) sets the image's
  `alt` and the `aria-label` of the bundled fallback mark, which previously had no name; pass
  `alt=""` to make both decorative.
- **`EmptyView` suggestion cards and `action` options work from the keyboard.** Enter and Space
  activate them as a click does; a card with a `model` opens its context menu under the card.
- **`EmptyView` link options without `LinkRouter` (or with `isNext`) are real links.** They carry
  `to` as their `href`, so they are in the Tab order and announced as links. With an `onClick`,
  a plain click still runs only the handler; a modified or middle click opens `to` in a new tab,
  and an option without `onClick` now navigates to `to` instead of doing nothing.
- **`EmptyScreenContainer` has a heading and announces itself.** `headerText` renders as an
  `<h3>` (a new `headingLevel` prop picks another level), the subheading as a `<p>` and the
  description as a block, inside a `role="status"` wrapper that takes no layout space. The
  header's 19px bold size now comes from the stylesheet rather than an inline style.
- **`EmptyScreenContainer` forwards `id` and `style`** to the outer element; both were typed
  but dropped.
- **`FormWrapper`'s README sign-in example names its field.** The example, and the story
  sources, now pass `labelFor` with a matching control `id`, so the Email caption is the
  field's accessible name.
- **`ColumnarInfoBar`'s pairs are a description list.** Labels and values render as `<dt>` and
  `<dd>` inside a `<dl>`, so a screen reader ties each value to its label; the default and
  `neutral` bars carry `role="status"`. The layout is unchanged.
- **`ColumnarInfoBar variant="neutral"` no longer cuts off long content.** The reveal animation
  kept its 150px height cap forever; the cap now lifts when the animation ends.
- **`PublicRoomBar`'s close cross is a real button.** It was an `IconButton` `div` with no role,
  focus or name; it is now a native `<button type="button">` named by a new `closeLabel` prop
  (default `"Close"`), reachable with Tab and pressed with Enter or Space. It keeps
  `data-testid="icon-button"`, and `--public-room-bar-close-icon` now paints it. The header and
  body sit in a `role="status"` region.
- **`CircleSkeleton` server-renders without a hydration mismatch.** It takes a `uniqueKey` prop
  and falls back to `useId()`, as `RectangleSkeleton` does.
- **`CircleSkeleton`'s default circle is whole, and an untitled one is hidden.** The default `x`
  is now `12` (it was `3`, which clipped the circle); without a `title` the SVG is `aria-hidden`
  instead of an unnamed image. Callers that pass `x`, `y` and `radius` render as before.
- **A disabled `CategoryItem` stays reachable and looks disabled.** Its title keeps
  `role="link"`, `tabIndex={0}` and `aria-disabled="true"` (still no `href` or handler), and the
  title, subtitle and arrow take `--category-item-disabled-color`, now a lighter grey than the
  subtitle in the light theme.
- **`Tags` can be used from the keyboard.** Every tag in the row, the overflow and create tags
  included, is now `role="button"` with `tabindex="0"` and answers Enter and Space. The built-in
  `...` tag carries `aria-haspopup="listbox"` and `aria-expanded`, moves the focus into its menu,
  and the menu takes the arrow keys, Enter, Space and Escape. The row is a `role="group"` named
  by a new `ariaLabel` prop (still `"Tags container"` by default)
- **`Tags` gives the create tag a name, keeps it on overflow and honours `TagType.onClick`.**
  The plus tag of `showCreateTag` is named by a new `createTagLabel` prop (the translated "Add"
  by default) instead of an empty `aria-label`; it now stays, after the overflow tag, when the
  tags overflow, and `optionTagRef` points at the overflow tag when both are drawn. A tag with
  its own `onClick` calls it instead of `onSelectTag`. Two tags with the same label no longer
  collide on the React key, and a `ResizeObserver` re-measures the row when it is resized
- **A click on a `RoomTile` tag no longer opens the room, and the generated tags reach
  `selectOption`.** The tile's open handler now ignores clicks inside the tag row (`.room-tags`)
  and on any `.tag`, overflow-menu entries included, so `thumbnailClick` stops firing alongside
  `selectTag`. The third-party and room-type tags the tile generates call `selectOption` with
  `typeProvider` / `defaultTypeRoom` as documented; until now every click went to `selectTag`
- **`RoomIcon`'s logo menu toggles once per click and only when there is a menu.** The pencil,
  the plus and the hover overlay no longer toggle it alongside the tile, picking an entry no
  longer reaches the tile's toggle, and a tile with no `model` entries (or nothing that draws
  the menu) ignores clicks. A colourless logo object whose image fails to load now gets black
  initials in the light theme and `data-is-wrong-image` on the tile; that state was unreachable
- **`RoomType` rows can be chosen from the keyboard.** The `listItem`, `dropdownButton` and
  `dropdownItem` layouts are now `role="button"` with `tabindex="0"`; Enter and Space click them,
  so `onClick` still receives a mouse event, and a focus ring in the accent colour shows.
  `dropdownButton` carries `aria-expanded`. A disabled row stays focusable with `aria-disabled`
  and refuses the keys as it refuses the click
- **`Avatar`'s tooltip id is stable, its pencil toggles the menu once, and `.svg` detection reads
  the URL path.** The role tooltip's anchor id comes from `useId` instead of `Math.random()` on
  every render. The pencil and the menu entries keep their clicks from reaching the avatar, so
  the menu no longer depends on two toggles cancelling out. A source is drawn as an icon only
  when its URL path ends in `.svg` - `photo.svg.png` and `?file=x.svg` are pictures now - and a
  `data:` URL, an inline SVG included, is always a picture
- **A broken `<img>` inside `MCPIcon`'s `imgNode` falls back to the letter**, as a broken `imgSrc`
  already did
- **`MainButton` can be reached and opened from the keyboard.** It is now a native `<button type="button">` (user agent styles reset, so it looks the same): Enter and Space open the menu or call `onAction`, `aria-haspopup`, `aria-expanded` and `aria-controls` follow the menu, and `isDisabled` sets `aria-disabled` while leaving the button focusable. The Enter that opens the menu no longer also picks its first item.
- **`MainButtonMobile`'s iOS scroll background works, and a page without `.section-scroll` no longer throws.** Two comparisons read ref objects instead of their values, so the sheet never darkened on scrolling up.
- **`--main-button-mobile-badge-size` scales the alert badge's icon**, not only the box around it.
- **`QuickActions` tooltips no longer collide across banners.** A tile's tooltip anchor id now comes from `useId` instead of the item's `id`, so two banners offering the same tile, or an id with a space or colon, each keep their own tooltip.
- **`ArticleItem` rows are operable from the keyboard.** Without a `LinkRouter` a row is a `role="button"` in the tab order that Enter and Space activate; inside a `LinkRouter` the link is the control, Enter on it calls `onClick`, and a middle click is left to the browser. The active row has `aria-current="page"`, an icon-only row is named by `text`, the badge is a named button when `onClickBadge` is set, and label truncation is re-measured when `text` changes.
- **`Calendar` names each day by its full date and marks the selected day and today.** A day
  button's accessible name is now its full date in `locale` ("October 15, 2023") while its text
  stays the number, the selected day has `aria-pressed="true"` (every other day `"false"`) and
  today `aria-current="date"`. A test that found a day with `getByRole("button", { name: "15" })`
  must use the full date or `getByText("15")`.
- **`Calendar` keeps the selection visible when the selected day is today.** It used to draw
  only today's fill; it now draws the selection ring around the fill as well.
- **`DatePicker`'s "Select date" control is one button that opens from the keyboard.** The
  `AddButton` inside it is now `aria-hidden`, so screen readers and `getAllByRole("button")` meet
  one button named `selectDateText` instead of two, and Enter and Space toggle the calendar as a
  click does.
- **`DateTimePicker`'s time opens from the keyboard and is spoken as shown.** Enter and Space on
  the time display open the editor, and its `aria-label` uses the displayed clock
  (`Current time: 02:30 PM` on a 12-hour locale) instead of always the 24-hour one.
- **`DateTimePicker`'s AM/PM drop-down sets the half of the day instead of shifting by twelve
  hours.** Choosing the half the time is already in no longer moves the value into the next or
  previous day; it changes nothing and does not call `onChange`.
- **`ColorInput`'s picker opens on the colour the field holds.** It used to keep the colour it
  first mounted with, so after typing a code the first move in the picker brought back the old
  colour's saturation and brightness and overwrote the typed one.
- **`ColorInput`'s swatch is a real button and the hex field has a name.** The swatch was a
  `<span>` that could not be reached from the keyboard; it is now a `<button type="button">`
  named by the new `pickerButtonLabel` prop, with `aria-expanded`, disabled with the field, and
  the focus returns to it when the picker closes from its cross or Escape. The field is named by
  the new `inputLabel` prop (the kit's "Color" by default) and gets `aria-invalid` under
  `hasError`.
- **`InfiniteLoader` keeps its own skeleton flag.** A `showSkeleton` passed in props used to
  override the flag the loader sets after a scroll jump of more than 800px; it is now ignored, as
  its documentation always said. The long-jump skeletons also work when the loader falls back to
  the window.
- **`SelectionArea` reports `clear` and works without a `scrollClass` match.** `onMove` now gets
  one call with `clear: true` and empty `added`/`removed` when a drag passes 10px; it was never
  sent before. When nothing carries `scrollClass`, the page's own scroller is used instead of none,
  so items are covered at all.
- **The `Section` chat panel resizer no longer grows the panel by 1px per grab.** It measured the
  panel with its border and wrote that to `--chat-panel-width`, which sets the content box: a click
  on the edge committed 401 for a 400px panel. `setChatPanelWidth` now receives the content width,
  and a grab released without moving commits the width unchanged.
- **A late search result no longer overwrites a newer edit in `Filter`'s search box.** A query the
  host applied after the user had already changed or cleared the box came back into it and was
  searched again. Such a stale value, or a new `getSelectedInputValue` returning the value already
  shown, now leaves the field alone; any other value is still shown, and focused when not empty.
- **`SearchInput` no longer puts back the term it has just reported.** A parent that stores the
  `onChange` value and passes it back as `value` could re-render after the user had already
  typed on or cleared the field; the field took the old term back and searched it again. That
  echo is now ignored; any other change of `value` still re-seeds the field.
- **The errors story helper is no longer published.** `dist/types/errors/stories.utils`, a
  Storybook-only i18n stand-in, was reachable as `./errors/stories.utils`; the declaration build
  now excludes it.
- **`AIAgentSelector` keeps the `initItems` it is given.** With `withInit` the selector still fetched the first page from the portal on mount and replaced the pre-loaded list with the answer. The first page is no longer requested; a search, clearing one, and further pages (`initHasNextPage`) are fetched as before.
- **The system MCP server's label no longer repeats the brand.** `MCPServersSelector` labelled the portal's own server `OrganizationName ProductName`, which read "ONLYOFFICE ONLYOFFICE" where the product name is ONLYOFFICE. The organisation is now prefixed only when the product name does not already contain it: "ONLYOFFICE DocSpace" is unchanged, "ONLYOFFICE" and "ONLYOFFICE Apps" are shown as they are.
- **`PeopleSelector`'s Groups tab lists groups when there is no `roomId`.** It used to run the people search and showed every user, guests included. It now loads the portal's groups (`groupApi.getGroups`); with a `roomId` the room's sharing query is used as before.
- **`FilesSelector` calls `headerProps.onCloseClick`.** The header's close cross always called `onCancel`, ignoring the handler passed in `headerProps`. The caller's `onCloseClick` now runs, with `onCancel` as the fallback when it is absent; the footer's Cancel button still calls `onCancel`. A consumer that passed a no-op `onCloseClick` and relied on the cross cancelling should pass `onCancel` there.
- **`Uploader` accepts any file with `accept="*"`.** `accept` went to react-dropzone unchanged, where `"*"` and `"*/*"` refuse every file - including in the README's own examples. `"*"`, `"*/*"`, `""` and a missing `accept` now all mean any file, and `accept` is optional in `UploaderProps`.
- **The legal sample's relative dates are in English.** "updated yesterday" and "Sent 5 days ago" followed the browser's locale inside an otherwise English page; they are now formatted in English.

### Documentation

Two sentences that were false the day they were written, each found by an agent disagreeing
with the page in front of it. No code changed for either.

- `providers/theme` said `initialTheme` "is read once" and that a new value needs a remount.
  It is re-resolved by an effect keyed on that prop, so the theme changes in place and nothing
  below the provider loses its state
- `components/textarea` said `aria-label` and `aria-labelledby` were "the only two ways" to
  name the field. A `FieldContainer`'s `labelFor` reaches it as well, since its `id` lands on
  the `<textarea>` element
- **`InputBlock` still defaults `tabIndex` to `-1`**, and its prop table said the opposite: it
  showed `TextInput`'s description, which stopped being true of `InputBlock` when the default was
  removed from `TextInput` alone. The table now says `-1`, and so do `SearchInput` and
  `PasswordInput`, which pass their `tabIndex` through and are out of the tab order unless the
  caller passes `0`. `SearchInput` also puts one `id` on its wrapper and its input, so a
  `labelFor` captions the wrapper. Both are recorded on the components' pages; neither is fixed
- `components/rectangle` and `components/circle` said a CSS variable "never reaches" the
  skeleton's colours. Passed as `backgroundColor="var(--x)"`, it does — the props become the
  gradient stops' `stop-color` attribute, where `var()` resolves — so a pair declared under
  `.light` / `.dark` makes a skeleton follow the theme
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
