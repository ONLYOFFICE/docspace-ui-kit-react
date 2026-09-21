# Behaviour notes — seed list for the README rewrite

Working file, not documentation. It seeds the **"Behaviour the types don't state"** section
of the component READMEs being rewritten against [`README_TEMPLATE.md`](../README_TEMPLATE.md).
Each entry moves into its component's README as one bullet and is struck off here. When the
list is empty, delete this file.

## How to use an entry

**Every claim below is unverified in this repository.** They were collected while documenting
the same component library as it is consumed by DocSpace plugins, and they describe a build
that is not this one. Treat each as a lead: open the file named in the "check" column, confirm
the behaviour still holds and the numbers still match, then write it in your own words. A
claim that no longer holds is struck off with a note, not silently dropped — that it changed
is worth knowing.

The Button entries are the exception: they were verified against this tree while writing
[`components/button/README.md`](../components/button/README.md), and are listed as the worked
example of the level of detail expected.

## Verified (the pilot components)

| Claim                                                                                                                                                       | Where it was found                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `Button`: `type="reset"` is narrowed to `"button"` and never resets a form                                                                                  | `Button.tsx` — `type === "submit" ? "submit" : "button"`        |
| `Button`: `aria-label` / `aria-disabled` / `aria-busy` are computed after the rest spread and overwrite what the caller passes                              | `Button.tsx` — attribute order in the JSX                       |
| `Button`: `isLoading` also disables the element and hides content with `visibility: hidden` under an absolutely placed loader                               | `Button.tsx`, `Button.module.scss`                              |
| `Button`: the label never wraps and is clipped with an ellipsis; `scale` and `minWidth` size against the container, not the text                            | `Button.module.scss` root rule                                  |
| `Button`: two independent tooltip mechanisms — `tooltipText` (the component) and `title` / `tooltipContent` (the `withTooltip` wrapper `index.tsx` applies) | `Button.tsx`, `tooltip/sub-components/createTooltipWrapper.tsx` |
| `Button`: `ButtonProps` does not extend `ButtonHTMLAttributes`, so `name` / `form` / `autoFocus` are type errors although they reach the DOM                | `Button.types.ts`                                               |
| `Button`: heights are 24 / 32 / 40 / 44px — the JSDoc previously claimed 36px for `normal`                                                                  | `Button.module.scss`; corrected in `Button.types.ts`            |
| `Button`: the focus outline is removed with no replacement                                                                                                  | `Button.module.scss` `&:focus { outline: none }`                |
| `FieldContainer`: `labelVisible` defaults to `false`, so `labelText` alone renders no label                                                                 | `FieldContainer.tsx` destructuring                              |
| `FieldContainer`: carries its own `margin: 0 0 16px`, settable as a whole through `--field-container-margin`                                                | `FieldContainer.module.scss`                                    |
| `FieldContainer`: the error message needs **both** `hasError` and `errorMessage`, and reserves no space                                                     | `FieldContainer.tsx`                                            |
| `FieldContainer`: the horizontal arrangement collapses to vertical at tablet width and below                                                                | `FieldContainer.module.scss` `tablet-and-below`                 |
| `FieldContainer`: `style` is spread onto the container _and_ onto the error text                                                                            | `FieldContainer.tsx`                                            |
| `FieldContainer`: `icon`, `helpButtonHeaderContent` and `offsetRight` are accepted and never read                                                           | `FieldContainer.tsx` destructuring                              |
| `TextInput`: `tabIndex` defaults to `-1`, taking the field out of the tab order                                                                             | `sub-components/Input.tsx`                                      |
| `TextInput`: `maxLength` defaults to 255; `placeholder` defaults to a single space; `autoComplete` to `"off"`; `dir` to `"auto"`                            | `sub-components/Input.tsx`                                      |
| `TextInput`: widths are 173 / 300 / 550px, `scale` makes it 100%; `size` never reaches the DOM                                                              | `styles/mixins/_inputs.scss`, `index.tsx`                       |
| `TextInput`: `forwardedRef` is dropped when `mask` is set                                                                                                   | `sub-components/Input.tsx`                                      |
| `TextInput`: memoised with a deep comparison, not the default shallow one                                                                                   | `index.tsx` — `React.memo(TextInputPure, equal)`                |
| `ModalDialog`: `visible` toggles CSS classes only — the dialog and its children stay mounted                                                                | `sub-components/Modal.tsx`                                      |
| `ModalDialog`: `Header` / `Body` / `Footer` / `Container` return `null` and are matched by display name, so they must be direct children                    | `index.tsx`, `ModalDialog.utils.tsx`                            |
| `ModalDialog`: Escape and Backspace are handled on `window`; Backspace is skipped only in `<input>` and `<textarea>`                                        | `index.tsx`                                                     |
| `ModalDialog`: `role="dialog"` and `aria-modal` sit on the backdrop, and focus is neither moved nor trapped                                                 | `sub-components/Modal.tsx`                                      |

## To verify, then write

| Component            | Claim to check                                                                                                                                                                                                                     | Check in                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `toggle-button`      | No intrinsic size in either axis; the label is absolutely positioned, so it contributes nothing to width or height                                                                                                                 | `ToggleButton.module.scss`                                          |
| `textarea`           | Has a `max-width` but no `width`; as a flex item it collapses to about 1px while staying focusable                                                                                                                                 | `Textarea.module.scss`                                              |
| `search-input`       | `onChange` receives the string, unlike every other input in the kit, which pass the event                                                                                                                                          | `SearchInput.tsx`                                                   |
| `combobox`           | Matches the selected row by **label**, not by key, so duplicate labels collide                                                                                                                                                     | `ComboBox.tsx`                                                      |
| `combobox`           | The dropdown is `manualWidth` (200px) unless `scaledOptions`; `dropDownMaxHeight` is needed past roughly six options                                                                                                               | `ComboBox.tsx`, `ComboBox.module.scss`                              |
| `link`               | Ellipsis comes from `truncate`, not from `isTextOverflow`                                                                                                                                                                          | `Link.types.ts`                                                     |
| `icon-button`        | `iconName` is a URL, not an asset name; `iconNode` takes inline JSX                                                                                                                                                                | `IconButton.tsx`                                                    |
| `loader`             | The default `LoaderTypes.base` renders the `label` as text and shows no spinner; a spinner needs an explicit `type`                                                                                                                | `Loader.tsx`                                                        |
| `loader`             | Default size is 40px and the stroke is the pale `--loader-color`                                                                                                                                                                   | `Loader.module.scss`                                                |
| `rows/row-content`   | Takes an **array** of children read by index: `[0]` main cell, `[1]` badges, `[2…]` hidden and reprinted as one right-hand line; a fragment or single child throws                                                                 | `RowContent.tsx`                                                    |
| `rows/row`           | Builds its context-menu header from `children.props.item`, a portal entity; shows a checkbox only when the `checked` prop is present at all                                                                                        | `Row.tsx`                                                           |
| `rows/row-container` | Virtualises through the portal's `#sectionScroll`, measuring width off the literal element id `rowContainer`; an `id` of your own makes it 0px wide                                                                                | `RowContainer.tsx`                                                  |
| `empty-view`         | Places itself: `margin-inline: auto`, a 480px cap and 61px of top padding, overridable through `--empty-view-width` and `--empty-view-padding-top`                                                                                 | `EmptyView.module.scss`                                             |
| _(kit-wide)_         | Markup handed to a component as `children` or as a `content` / `body` prop lands in a wrapper of the component's own making, and most are flex boxes centred on the cross axis — so hand over one element carrying your own layout | To be stated in `docs/getting-started.md` rather than per component |
| _(kit-wide)_         | Several components bring their own outer margin, which adds to a parent's `gap` instead of replacing it                                                                                                                            | Same                                                                |

## Upstream defects found while writing the pilot

Not README material — these need a fix or a decision of their own.

- **`ModalDialog` adds a `touchend` listener on cleanup.** In `index.tsx` the effect's
  teardown calls `window.addEventListener("touchend", onSwipeEnd)` where every sibling line
  calls `removeEventListener`. Each re-run of the effect leaves another listener behind, and
  the effect depends on `visible`, `onClose`, `onBackClick` and both display-type props.
- **`FieldContainer` renders its label with an empty `htmlFor`**, so no label in any form
  built from it is associated with its control.
- **`TextInput` defaults `tabIndex` to `-1`**, taking every field out of the tab order unless
  the caller passes `0`. This is a keyboard-accessibility defect across every form in the kit,
  not a documentation problem.
- **Three `FieldContainer` props are dead**: `icon`, `helpButtonHeaderContent`, `offsetRight`
  are accepted by the type and never read. They are now documented as ignored; removing them
  is a breaking change someone should schedule.
- **`ModalDialog` cannot be given an accessible name.** `role="dialog"` and `aria-modal` sit on
  the click-to-close element, and unknown props — an `aria-label` among them — are spread onto
  the internal `AsideHeader`, and only when a header is rendered. So the advice "label it
  yourself" cannot be followed from outside the component. Needs a fix in `Modal.tsx`: move the
  role onto the content element and let it take the caller's `aria-*`.
- **Two `ModalDialog` prop descriptions were wrong, not merely thin.** `isCloseable` carried
  `visible`'s description, and `closeOnBackdropClick` said it _disables_ what its name enables.
  Both are corrected; both had been copied into readers' mental models for as long as they
  existed.
- **Two `WithTooltipProps` props are dead**: `tooltipPlace` and `tooltipFitToContent` are
  declared, stripped from the forwarded props by `omitTooltipProps`, and read nowhere.

## Found while writing the template, not yet placed

These are about the tooling rather than one component; they belong in the props generator's
design (phase A2), not in a README.

- `PropsWithChildren<…>` puts `children` in the props with no JSDoc of its own. The generator
  must treat it as an own prop and describe it, or every wrapped component reports an
  undocumented prop.
- A component whose `index` exports a wrapper (`withTooltip(Button)`) has a props type wider
  than its `<Name>.types.ts`. The generator has to resolve the exported symbol, not the file,
  and render the wrapper's contribution as its own group.
- `WithTooltipProps` in `components/tooltip/Tooltip.types.ts` carries no JSDoc at all, so any
  component wrapped in `withTooltip` will report undocumented props until that interface is
  documented.
- The `--compile` pass must **keep `tsconfig.json`'s own `include` list** and add the scratch
  directory to it, not replace it. Compiling the extracted blocks alone loses the ambient
  environment the sources rely on (`*.react.svg` module declarations, `process`, `Buffer`) and
  produces a wall of false errors from `components/avatar`, `components/context-menu`,
  `components/room-icon` and `components/tooltip` that have nothing to do with the README.
- It also needs stub declarations for module specifiers that only a consumer's bundler
  resolves — `*.svg?react` is the one the pilot needed. Verified: with those two things in
  place all 18 `tsx` blocks of the four pilot READMEs type-check clean.
- **Assets ship, but only the ones a component imports.** `assets/` is not one of the build's
  entry directories, yet `preserveModules` emits every asset reachable from a shipped
  component — 312 modules under `dist/esm/assets/` — and the `./*` exports wildcard makes
  `@onlyoffice/apps-ui-kit/assets/icons/16/download.react.svg` resolve. What does not exist is
  a per-asset declaration: `dist/types/assets/` is empty and typing rests on the ambient
  `*.svg` in `dist/types/globals.d.ts`. An earlier draft of the template claimed assets were
  not published at all; that was wrong, and `docs/public-api.md` and `.claude/rules/plugin-api.md`
  were right.
