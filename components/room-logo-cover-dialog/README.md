# RoomLogoCoverDialog

A modal for choosing a room's logo cover: a background colour from the logo palette (or a custom colour from a picker) plus an optional glyph drawn over it, with a live preview of the resulting room logo. Reach for it when a user edits how a room looks in lists; for the same picker embedded inline in another form, use `RoomLogoCover`, which the same module exports.

## Usage

```jsx
import { RoomLogoCoverDialog } from "@onlyoffice/apps-ui-kit/components/room-logo-cover-dialog";

const MyComponent = ({ t, covers }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <RoomLogoCoverDialog
      t={t}
      visible={visible}
      covers={covers}
      title="Marketing"
      onClose={() => setVisible(false)}
      onApply={(color, cover) => {
        saveCover(color, cover);
        setVisible(false);
      }}
    />
  );
};
```

The module also exports `RoomLogoCover` and the types `RoomLogoCoverDialogProps`, `RoomLogoCoverProps` and `ICover` (`{ id: string; data: string }`).

## Properties

| Name               | Type                                           | Default                | Description                                                                                                        |
| ------------------ | ---------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| t                  | TTranslation                                   | -                      | Translation function; the dialog does not translate on its own                                                     |
| visible            | boolean                                        | -                      | Whether the dialog is open; selection is reset each time it opens                                                  |
| covers             | ICover[]                                       | -                      | Cover glyphs to choose from; `data` is inline SVG markup. The icon section is hidden when empty                    |
| title              | string                                         | ""                     | Room title; its first and last characters are shown in the preview when no cover is selected                       |
| initialColor       | string                                         | first palette colour   | Hex colour selected on open                                                                                        |
| initialCover       | ICover \| null                                 | null                   | Cover selected on open; `null` or omitted means no cover                                                           |
| isBaseTheme        | boolean                                        | theme context `isBase` | Renders the preview for the light theme                                                                            |
| currentColorScheme | TColorScheme                                   | -                      | Portal colour scheme; its `main.accent` highlights the hovered and selected cover                                  |
| onClose            | () => void                                     | -                      | Called by Cancel and by the dialog closing itself (close control, Escape); ignored while the colour picker is open |
| onApply            | (color: string, cover: ICover \| null) => void | -                      | Called by Apply with the chosen colour and cover (`null` for none); does not close the dialog                      |

## Behaviour

- **Controlled.** The caller owns `visible`. `onApply` only reports the selection; close the dialog yourself, as in the example above.
- **Selection resets on open.** Every time `visible` becomes `true` the selection returns to `initialColor` / `initialCover` and the colour picker is closed. Changes made and cancelled are not kept.
- **The header is not `title`.** The heading is always `t("Common:RoomCover")`; `title` only feeds the text preview.
- **Colours are hex strings.** `initialColor` and the colour passed to `onApply` are `#`-prefixed hex; the preview derives its text colour and dark-theme background from it.
- **Cover markup is injected as HTML.** `ICover.data` is rendered with `dangerouslySetInnerHTML`, both in the preview and in the icon grid. Pass only trusted SVG, such as what the portal serves.
- **Layout by device.** On mobile the dialog renders as an aside panel and the colour picker opens in its own modal; on tablet and desktop it is a centred modal (422px wide, 464px on tablet) and the picker opens in a drop-down. The dialog height is computed from the window and recalculated on resize.

## Translation keys

`t` is a prop, not the package's `TranslationProvider`. The dialog calls it with:

- `Common:RoomCover`, `Common:ApplyButton`, `Common:CancelButton`, `Common:Color`
- `CreateEditRoomDialog:Icon` — not in this package's `locales/en`; the caller's `t` has to resolve it
- `WithoutIcon` — no namespace, so it resolves against the translator's default namespace (the key lives in `Common`)

## Theme

Dark-theme styling uses `.dark` descendant selectors, which match the class `ThemeProvider` puts on `<body>`. Without a mounted `ThemeProvider` the dialog renders in its light styles. `isBaseTheme` only matters under `.dark`: when it is `false`, the preview tile gets a translucent tint of the selected colour instead of the solid colour.

## RoomLogoCover

The dialog's body, usable on its own. It keeps its selection in local state and reports it through `onChange` (and once through `onInit` on mount). Instead of `initialColor` / `initialCover` it can derive the initial selection from raw room data.

| Name               | Type                                              | Default                | Description                                                                                   |
| ------------------ | ------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------- |
| t                  | TTranslation                                      | -                      | Translation function                                                                          |
| covers             | ICover[]                                          | -                      | Cover glyphs to choose from; the icon section is hidden when empty                            |
| title              | string                                            | ""                     | Room title used for the text preview                                                          |
| initialColor       | string                                            | -                      | Initial hex colour; takes precedence over `coverColor` and `logoColor`                        |
| initialCover       | ICover \| null                                    | -                      | Initial cover; takes precedence over `coverId` and `logoCover`                                |
| logoColor          | string                                            | -                      | Room logo colour as hex without `#`; used when neither `initialColor` nor `coverColor` is set |
| logoCover          | ICover \| null                                    | -                      | Room logo cover; used only together with `withSelection`                                      |
| coverColor         | string                                            | -                      | Cover colour as hex without `#`; used when `initialColor` is not set                          |
| coverId            | string                                            | -                      | Id of a cover in `covers` to preselect                                                        |
| withSelection      | boolean                                           | -                      | Allows `logoCover` to be used as the initial cover                                            |
| openColorPicker    | boolean                                           | -                      | Whether the colour picker is open (state owned by the caller)                                 |
| setOpenColorPicker | React.Dispatch\<React.SetStateAction\<boolean\>\> | -                      | Setter for `openColorPicker`                                                                  |
| isBaseTheme        | boolean                                           | theme context `isBase` | Renders the preview for the light theme                                                       |
| currentColorScheme | TColorScheme                                      | -                      | Portal colour scheme; its accent highlights the selected cover                                |
| forwardedRef       | React.RefObject\<HTMLDivElement \| null\>         | -                      | Ref to the root element                                                                       |
| scrollHeight       | string                                            | -                      | Height of the scroll area around the pickers (tablet and desktop only)                        |
| generalScroll      | boolean                                           | -                      | Renders the pickers without their own scroll area                                             |
| onInit             | (color: string, cover: ICover \| null) => void    | -                      | Called once on mount with the initial selection                                               |
| onChange           | (color: string, cover: ICover \| null) => void    | -                      | Called on every change of colour or cover                                                     |

When nothing sets an initial colour it falls back to the first colour of the logo palette.

## Examples

### Preselected cover and colour

```jsx
<RoomLogoCoverDialog
  t={t}
  visible={visible}
  covers={covers}
  initialCover={covers[1]}
  initialColor={savedColor}
  isBaseTheme
  onClose={close}
  onApply={apply}
/>
```
