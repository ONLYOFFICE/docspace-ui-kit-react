# Change Log

## Unreleased

Every story now has a play function, and the faults they turned up are fixed below, most of
them keyboard and screen-reader gaps. Several change element types, roles, test ids or event
timing; each such change is listed under _Changed_, so read it before upgrading.

### Changed

- **`Uploader`'s progress bar moves while a chunk is being sent.** The percentage used to grow
  only when a whole chunk (5 MB by default) had been answered, so a file under one chunk went
  from 0 to done in a single step; it now also counts the bytes of chunks still on their way,
  from axios's upload progress. `onUploadProgress` is unchanged and still reports per chunk
- **`ComboBox`'s `onToggle` may receive a keyboard event.** The keys that open and close the
  list call it too, so its first argument is typed
  `React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>`. A handler declared
  to take only a mouse event no longer compiles, and one that reads `clientX` or `button` has
  to check which event it got
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
  `Common:LoadingProcessing` ("Loading..."); the animations are `aria-hidden` and lose their
  built-in English titles ("dual ring", "oval", "track"), and the wrapper no longer sets
  `aria-busy`. A `Loader` without `type` now draws a 40px oval where it used to render an empty
  span, and `Loader.default` is `{ type: oval, size: "40px", label: "Loading..." }` instead of
  `{ type: base, label: "Loading content, please wait." }`; `LoaderTypes.base` still renders the
  label as visible text, which without a `label` is now "Loading...". Every loader without
  `isDecorative` adds that hidden text to whatever it sits in, a table cell included. A loader
  inside a control takes the new `isDecorative` prop, which leaves the animation alone and
  `aria-hidden`, so the status text does not become part of the control's name; `Button`, the
  combo box, `AddButton`, `FileInput`, `Dropzone`, rows and tiles use it, and a loader you place
  inside your own button or busy row should too.
- **`ErrorContainer` writes fewer fixed element ids.** The `button-container`, `button` and
  illustration ids (`background`, `birds`, `baloon`, ...) are gone; the parts are styled through
  module classes. `container-inner`, `header`, `text` and `customized-text` stay, because the
  portal's stylesheets select them (the preparation portal dialog sizes the illustration through
  `#container-inner`); two error pages in one document still share those four. A stylesheet or
  test that targeted one of the removed ids must select by role or by the outer element's
  `className` instead.
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
- **`Tags`' `onOptionTagClick` says which tag was clicked.** It is called with `"overflow"` or
  `"create"` (the new `TOptionTagKind` type), because the overflow tag and the create tag can now
  be on screen together. A handler that takes no argument keeps working.
- **`ColorPicker`'s `onClose` has no default, and Escape needs one.** Without `onClose` Escape is
  left to whatever listens further up, so a picker in a `ModalDialog` no longer stops Escape from
  closing the dialog; with one, Escape is consumed and calls it as before.
- **`EmptyScreenContainer` is no live region, and `ec-header` is one class.** An empty state is
  read like the rest of the page instead of being announced on every route load. The header's
  19px size and 700 weight are set through `Text`'s variables by a single class, so a rule of
  your own of two classes or more on `ec-header` wins by specificity, not by stylesheet order. It
  used to be an inline size that no stylesheet rule could beat: the portal's template gallery
  error view (`.errorView .ec-header`) now gets its own 23px (21px on mobile).
- **`SnackBar` announces through a hidden region, and `SnackBar.close()` unmounts a microtask
  later.** The visible bar is no longer `role="status"`; a visually hidden region beside it
  (`data-testid="snackbar-announcement"`) carries the header and text. `close()` clears the
  bar's bookkeeping at once but unmounts on the next microtask, so it is safe to call while React
  renders (from the countdown's `onComplete`); a test that checks the DOM right after `close()`
  has to wait for it.
- **An `ArticleItem` link reports its click before the router navigates.** The link calls
  `onClick` itself, so a `preventDefault()` there cancels the navigation again; the click is
  still reported once.
- **`Dropzone`'s format line sits beside the drop area, not inside it.** The drop area
  (`dropzone-input-area`) still covers the whole box, and clicks and drops on a plain format line
  reach it as before; with `fullExstsText` the line takes its own clicks, but a drop on it still
  reaches the area. A selector that expected `dropzone-file-types` inside the area must look
  beside it.
- **`MainButton` draws its focus ring in the accent**, through the new
  `--main-button-focus-color`, instead of in its background colour.
- **`PublicRoomBar` is announced only with the new `live` prop.** Its header and body are drawn
  at once and no longer sit in a `role="status"` region; with `live` a visually hidden status
  region beside them (`data-testid="public_room_bar_announcement"`) takes their text 100 ms
  after mount. Set it on a bar that appears in response to something; a bar that is part of a
  panel or dialog from the start is read with it.
- **`ColumnarInfoBar` announces through a hidden region.** The default and `neutral` bars' heading
  and columns are drawn at once and are no `role="status"` region any more; a visually hidden one
  beside them carries their text. A test that looked for the content inside `role="status"`
  must look for its text there instead.
- **Busy rows and tiles carry `aria-busy`.** `Row` and the base, file and folder tiles set it
  while `inProgress`, since their loader is decorative.
- **`RadioButtonGroup` is a `role="radiogroup"`.** Its wrapper `<div>` was a plain container, so
  `FieldContainer`, which describes radios through the group around them, put `aria-invalid`,
  `aria-required` and the error's `aria-describedby` on nothing. A query for the group by role now
  finds it; it still has no accessible name of its own.

### Added

- **`FormWrapper` can be the form.** A new `onSubmit` prop renders the card as a `<form>` that
  calls the handler with the browser's navigation prevented, so Enter in a field submits it;
  `aria-label` / `aria-labelledby` make it a named form landmark. Without `onSubmit` it is a
  `<div>` as before. The README now states that `--form-wrapper-min-width` /
  `--form-wrapper-max-width` size the content, so the card is that width plus twice the padding.

### Fixed

- **`FileTile`'s `--tile-height` sizes the whole tile.** The thumbnail area kept its 156px and
  the name row its 64px, so a taller tile ended in an empty band under the name row, outside the
  hover and checked background. The thumbnail area now takes whatever the name row leaves; at
  the default 222px nothing changes.
- **`PortalLogo`'s fallback follows the theme.** When `logo.ashx` fails, the bundled logo it
  draws instead was always the light one, whose dark lettering vanished on a dark page and left
  only the mark; the dark theme now gets the light-lettered version. `ErrorContainer` shows it.
- **`Article`'s logo starts at the panel's edge.** The header gives the logo a 211px box, sized
  for a white-label logo, and a narrower one such as the default ONLYOFFICE mark was centred in
  it; it now sits at the start of the row, on the right in a right-to-left interface.
- **`SnackBar` no longer calls `onAction` after it unmounts.** A click into an iframe schedules
  `onAction` half a second later, and that timer survived the bar, so a bar closed in the
  meantime reported an action anyway.
- **No `[i18n] Missing translation` error without translations.** `getCommonTranslation` logged
  it whenever `window.i18n` was absent, so an app with no `TranslationProvider` got one on every
  render of a component with a translated default (`Loader`, `Toast`, `Tags`, `SnackBar`). With
  no `window.i18n` it now returns `""` silently and the component uses its English default; a key
  missing from translations that are loaded is still logged.
- **Default accessible names are translated where the portal has a key.** The close buttons of
  `Toast`, `SnackBar`, `PublicRoomBar` and `ColumnarInfoBar` default to `Common:CloseButton` ("Close"), the `Tags`
  row to `Common:Tags` ("Tags", was the English "Tags container"), and `Loader` and `AppLoader`
  to `Common:LoadingProcessing` ("Loading...", was the English "Loading content, please wait.").
  The three keys are in `locales/en/Common.json`. Names with no key in the portal yet (the
  colour picker's, `TimePicker`'s, `FloatingButton`'s, `LoadingButton`'s "Progress" and
  `PortalLogo`'s `alt`) stay English defaults of their props.
- **Keys a component handles no longer reach the page's or a dialog's listeners.** The keyboard
  support added to `ComboBox`, `ColorPicker`, `ContextMenuButton`, `LinkWithDropdown`, `Tags`,
  `QuickActions`, `MainButtonMobile` and `Dropzone` let its keys bubble on, so Escape in a menu inside a
  `ModalDialog` (which closes on an Escape `keyup` on `window`) closed the dialog too, and in
  the portal's file list Enter on a tag or in a menu also opened the selected item, the arrows
  moved the selection and Escape cleared it. Each now stops the key it acts on and swallows the
  matching `keyup`, however long the key is held.
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
  alone, and what it added is taken off only while it still holds that value. A control that
  mounts after the container is described too, and a radio button stands for its
  `role="radiogroup"`. A bare `Label` with `isRequired` or `error` is now visual only; put `required` and
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
- **`DropDownItem`'s external-link icon is a real link when it can navigate.** With
  `onExternalLinkClick` it is `<a href={externalLinkPath}>`, focusable and named "Open <label>"
  (override with the new `externalLinkLabel`); a plain click goes to the callback and the `href`
  is not followed, so router-based handlers keep working. A middle, Ctrl-, Cmd- or Shift-click
  is left to the browser, which opens the `href` in a new tab, and does not call the callback.
  Without the callback it has no `href` and does nothing, as before.
- **`LinkWithDropdown` works from the keyboard.** The trigger is in the tab order (out of it while
  `isDisabled`), Enter and Space toggle the menu and Escape closes it; `aria-haspopup` is now
  `"listbox"`. The arrows open the menu and move focus into it, then between its items; Home and
  End jump, Enter and Space choose, and Escape returns focus to the link.
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
  mouseout rather than mousedown and mouseup. Opened from the keyboard, in either mode, `onClick`
  gets a click event at the button's lower start corner (bottom-right in RTL, where the menu's
  right edge is aligned with it), with the button as `target` and
  `currentTarget`, so `ContextMenu.show(e)` places the menu there instead of at NaN and a
  handler typed for a mouse event never receives a keyboard one. It is never dispatched, but it
  carries `isDefaultPrevented()`, `isPropagationStopped()` and `persist()`, so a handler written
  for React's event can call them. A handler that told a key from a click by `e.key` or `e.type`
  no longer can.
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
  `closeButtonLabel` prop, defaulting to the translated `Common:CloseButton` ("Close"); the
  `btnText` action and the campaign banner's cross are buttons too. The bar is `role="status"`
  with `aria-live="polite"`; its `countDownTime` counter is hidden from it, so the ticks are not
  announced.
- **`SnackBar.show`/`SnackBar.close` manage one React root.** Repeated `show` calls mount a fresh
  bar in the same root (its `onLoad` runs each time) instead of stacking new roots and new
  `#snackbar` divs, and a `show` right after `close`, even inside a commit, takes that root back; `close()` unmounts it with or
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
  `label` prop (default `Common:LoadingProcessing`, "Loading..."), and the sheet carries
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
  a plain click still runs only the handler; a modified or middle click opens `to` in a new tab
  without also running it, and an option without `onClick` now navigates to `to` instead of
  doing nothing. An option whose `to` is empty is a button instead (`role="button"`, no `href`),
  and every click on it runs `onClick`, a modified one included, since it has no address to open.
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
  `<dd>` inside a `<dl>`, so a screen reader ties each value to its label. The layout is unchanged.
- **`ColumnarInfoBar variant="neutral"` no longer cuts off long content.** The reveal animation
  kept its 150px height cap forever; the cap now lifts when the animation ends.
- **`PublicRoomBar`'s close cross is a real button.** It was an `IconButton` `div` with no role,
  focus or name; it is now a native `<button type="button">` named by a new `closeLabel` prop
  (default `"Close"`), reachable with Tab and pressed with Enter or Space. It keeps
  `data-testid="icon-button"`, and `--public-room-bar-close-icon` now paints it.
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
  already did, and a new `imgSrc` or `imgNode` is tried again after one failed. A node with a
  string `src` is remembered by it, so one rebuilt on every render does not retry, and flash,
  the same broken picture each time
- **`MainButton` can be reached and opened from the keyboard.** It is now a native `<button type="button">` (user agent styles reset, so it looks the same): Enter and Space open the menu or call `onAction`, `aria-haspopup`, `aria-expanded` and `aria-controls` follow the menu, and `isDisabled` sets `aria-disabled` while leaving the button focusable. The Enter that opens the menu no longer also picks its first item.
- **`MainButtonMobile`'s iOS scroll background works, and a page without `.section-scroll` no longer throws.** Two comparisons read ref objects instead of their values, so the sheet never darkened on scrolling up.
- **`--main-button-mobile-badge-size` scales the alert badge's icon**, not only the box around it.
- **`QuickActions` tooltips no longer collide across banners.** A tile's tooltip anchor id now comes from `useId` instead of the item's `id`, so two banners offering the same tile, or an id with a space or colon, each keep their own tooltip.
- **`ArticleItem` rows are operable from the keyboard.** Each row's control is a transparent layer over the row: without a `LinkRouter` a `role="button"` in the tab order that Enter and Space activate, with one the router link itself (no longer wrapped around the whole row), on which Enter calls `onClick` and a middle click is left to the browser. The active row's control has `aria-current="page"`, the control is named by `text` even when the label is not drawn, the badge is a named button beside the control (not inside it) when `onClickBadge` is set, and label truncation is re-measured when `text` changes.
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
- **`AIAgentSelector` keeps the `initItems` it is given.** With `withInit` the selector still fetched the first page from the portal on mount and replaced the pre-loaded list with the answer. The first page is no longer requested while `excludeItems` and `disableBySecurity` are what `initItems` were shown with; once one of them changes it is fetched as usual. A change of language alone, as hydration makes on a page served in English, keeps the items. A search, clearing one, and further pages (`initHasNextPage`) are fetched as before.
- **The system MCP server's label no longer repeats the brand.** `MCPServersSelector` labelled the portal's own server `OrganizationName ProductName`, which read "ONLYOFFICE ONLYOFFICE" where the product name is ONLYOFFICE. The organisation is now prefixed only when the product name does not already contain it: "ONLYOFFICE DocSpace" is unchanged, "ONLYOFFICE" and "ONLYOFFICE Apps" are shown as they are.
- **`PeopleSelector`'s Groups tab lists groups when there is no `roomId`.** It used to run the people search and showed every user, guests included. It now loads the portal's groups (`groupApi.getGroups`); with a `roomId` the room's sharing query is used as before.
- **`FilesSelector` calls `headerProps.onCloseClick`.** The header's close cross always called `onCancel`, ignoring the handler passed in `headerProps`. The caller's `onCloseClick` now runs, with `onCancel` as the fallback when it is absent; the footer's Cancel button still calls `onCancel`. A consumer that passed a no-op `onCloseClick` and relied on the cross cancelling should pass `onCancel` there.
- **`Uploader` accepts any file with `accept="*"`.** `accept` went to react-dropzone unchanged, where `"*"` and `"*/*"` refuse every file - including in the README's own examples. `"*"`, `"*/*"`, `""` and a missing `accept` now all mean any file, and `accept` is optional in `UploaderProps`. A list is passed on trimmed and without blank entries: `".pdf,"` used to let every file with no MIME type through.
- **The legal sample's relative dates are in English.** "updated yesterday" and "Sent 5 days ago" followed the browser's locale inside an otherwise English page; they are now formatted in English.
- **`Loader`, `SnackBar`, `ColumnarInfoBar` and a `live` `PublicRoomBar` are announced when they
  appear.** Each was a status region inserted together with its text, which screen readers mostly
  do not read; the announcing region now mounts empty and receives its text 100 ms later, while
  what is drawn appears at once. `SnackBar`, `ColumnarInfoBar` and `PublicRoomBar` read that text
  from what they draw, and read it again whenever it changes, a part that updates on its own
  included.
- **`LinkWithDropdown`'s keys skip separators and headers**, and a caller's `onKeyDown` or
  `tabIndex` no longer switches the keyboard support off: unknown props go first, and a caller's
  `onKeyDown` runs before the built-in keys and can opt out with `preventDefault()`.
- **An open `DropDown` closes on an outside click that re-renders its owner.** The listener
  ignored that click as the one that opened the menu whenever `clickOutsideAction` changed
  identity, which `ContextMenuButton` and `LinkWithDropdown` do on every render.
- **`ComboBox` leaves its optional block's keys alone**, as its click handler does -- its own
  block only, so a combo box placed in another's block keeps its keys -- and lets the arrows
  scroll an `advancedOptions` panel instead of cancelling them, still keeping them from the
  page's hotkeys.
- **The segmented `Tabs` arrows start from the focused tab**, after a click on the tab already
  selected too, and a shorter item list no longer leaves the bar without a Tab stop.
- **`Filter`'s search remembers at most 20 unreported queries**, so a host that never reports
  its value back does not grow the list without end. A report of the value the field already has
  settles the queries before it, so after "a", "ab", "a" a later "ab" of the host's own (Back, a
  saved filter) is shown instead of being dropped as a stale echo, and after `clearSearch` the
  host's previous value is shown again when it comes back.
- **`SearchInput` takes a value set after its cross was used**, even one equal to the last value
  it reported.
- **`MainButton` leaves the keys of its menu alone.** Its Enter handling also caught keys
  bubbling from the open menu, so Enter on a link in it lost its native activation.
- **`StatusMessage` no longer sticks mid-fade** after its effects are replayed (StrictMode, a
  re-shown `Activity`).
- **`toastr` shows nothing instead of throwing** for an object with no prototype.
- **`EmptyView`'s keyboard-opened context menu opens at the item's start corner in RTL.**
- **A held Space toggles `Checkbox` once.**
- **`FieldContainer` keeps its error in the control's description** when the control rewrites its
  own `aria-describedby`.
- **`DateTimePicker`'s AM/PM sets the hour** instead of shifting by 12 hours, which was an hour off
  on a day the clocks change.
- **The samples' declarations are no longer published.** `dist/types/docs` is gone.
- **A key pressed during a `QuickActions` arrow's scroll still brings its tile into view.** The
  key stops the arrow's smooth scroll where it has got to, and in Chromium on Linux the tile's
  own scroll was lost with it, leaving the first tile clipped after Home.
- **`PeopleSelector` loads every group with `withOutCurrentAuthorizedUser`.** It took one off the
  total of a list of groups too, where the current user never is, so the last group of a
  paginated list was never requested.
- **The segmented `Tabs` arrows run the tab's own `onClick`**, as a click on the tab does, and
  scroll the tab they select into view. They used to call `onSelect` alone.
- **`ArticleItem`'s badge passes Enter and Space to a `badgeComponent`'s own click.** The keys
  clicked the wrapper, so a badge that opens something in its own click handler (the portal's
  new-files badge) did nothing from the keyboard.
- **`MainButtonMobile`'s alert badge is named without an `I18nextProvider`.** It read
  "Common:Alert" outside the portal; it now uses the kit's translation lookup with "Alert" as the
  fallback.

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
