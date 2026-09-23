# QuickActions

A banner of large illustrated tiles offering the first things to do in a section — create a document, a room, a form, an agent. Reach for it at the top of a view where a few one-click entry points matter more than a menu. The tiles sit on one row that scrolls horizontally once they no longer fit, with floating arrows to page through it and an optional control to dismiss the whole banner.

## Usage

```jsx
import {
  QuickActions,
  CreateDocumentIcon,
  CreateSpreadsheetIcon,
} from "@onlyoffice/apps-ui-kit/components/quick-actions";

const MyComponent = () => {
  return (
    <QuickActions
      prevLabel={t("Common:Previous")}
      nextLabel={t("Common:Next")}
      items={[
        {
          id: "document",
          icon: <CreateDocumentIcon />,
          label: "Document",
          onClick: handleNewDocument,
        },
        {
          id: "spreadsheet",
          icon: <CreateSpreadsheetIcon />,
          label: "Spreadsheet",
          href: "/new/xlsx",
        },
      ]}
    />
  );
};
```

The barrel exports `QuickActions` (named), the `QuickActionItem` and `QuickActionsProps` types, and the tile icons listed below.

## Properties

| Name       | Type              | Default | Description                                                                        |
| ---------- | ----------------- | ------- | ---------------------------------------------------------------------------------- |
| items      | QuickActionItem[] | -       | Tiles to render; an empty array renders nothing unless loading                     |
| prevLabel  | string            | -       | Accessible name of the scroll-back arrow. Required unless `isLoading` is `true`    |
| nextLabel  | string            | -       | Accessible name of the scroll-forward arrow. Required unless `isLoading` is `true` |
| isLoading  | boolean           | false   | Renders skeleton tiles instead of the items                                        |
| onClose    | () => void        | -       | Hides the whole banner. Without it no close control is rendered                    |
| closeLabel | string            | -       | Tooltip and accessible name of the close control. Required with `onClose`          |
| className  | string            | -       | Class name of the outer banner element                                             |
| dataTestId | string            | -       | `data-testid` of the outer banner element                                          |

The types enforce the pairings: `onClose` and `closeLabel` come together or not at all, and `prevLabel` / `nextLabel` may be omitted only when `isLoading` is the literal `true`. There are no built-in English fallbacks for any label.

### QuickActionItem

| Name           | Type                                           | Default | Description                                                             |
| -------------- | ---------------------------------------------- | ------- | ----------------------------------------------------------------------- |
| id             | string                                         | -       | Unique key of the tile; the set of ids also identifies the section      |
| icon           | ReactNode                                      | -       | Tile illustration, rendered `aria-hidden`                               |
| label          | string                                         | -       | Visible caption and accessible name of the tile                         |
| onClick        | (e: MouseEvent\<HTMLElement\>) => void         | -       | Click handler of the tile, on the button or the link alike              |
| href           | string                                         | -       | Renders the tile as a link instead of a button (ignored while disabled) |
| target         | "\_blank" \| "\_self" \| "\_parent" \| "\_top" | -       | Link target; `_blank` adds `rel="noopener noreferrer"`                  |
| disabled       | boolean                                        | -       | Dims the tile and blocks interaction                                    |
| tooltipContent | ReactNode                                      | -       | Tooltip shown below the tile                                            |
| dataTestId     | string                                         | -       | `data-testid` of the tile element                                       |

## Behaviour

- **Button or link.** A tile with `href` (and not `disabled`) renders as `<a>`; otherwise as `<button type="button">`. A disabled tile is always a button.
- **Scrolling.** The arrows appear only at an end the strip can still scroll towards, so at the start only the forward arrow shows and no arrow shows when every tile fits. An arrow scrolls by the visible width minus 64px, smoothly. Wheel, trackpad and touch-swipe scroll the same strip natively; the scrollbar is hidden.
- **Section changes.** When the set of item `id`s changes the strip jumps back to the start. Rebuilding `items` with the same ids on every render does not move it.
- **Controls visibility.** On devices with hover and a fine pointer the controls fade in only while the banner is hovered or contains focus; elsewhere they stay visible whenever rendered.
- **Loading.** With `isLoading` the banner renders `items.length` skeleton tiles (four when `items` is empty) and no controls.
- **Test ids.** Besides `dataTestId`, the strip carries `quick-actions-track` and the controls `quick-actions-prev`, `quick-actions-next` and `quick-actions-close`.

## Layout

The banner takes the full width of its container and centres the tile row inside it. Tiles keep a fixed size and do not shrink: 184px wide by 147px high on desktop, 120px high on tablet and below, and 152px wide on mobile. Labels wrap to at most two lines and are ellipsized after that. The arrows and the close control are absolutely positioned over the strip and take no space in layout.

## RTL

Paging follows the direction resolved on the strip itself, so a subtree with its own `dir` pages correctly. The arrow glyphs and the edge fades are mirrored under `[data-dir="rtl"]`, which `ThemeProvider` sets on `<html>`.

## Styling

Component-level CSS variables, set on the banner or any ancestor:

| Variable                         | Fallback                 | Description                                                                |
| -------------------------------- | ------------------------ | -------------------------------------------------------------------------- |
| `--quick-actions-tile-bg`        | `colors.$gray-light`     | Tile background (`colors.$dark-gray-light` in dark theme)                  |
| `--quick-actions-tile-bg-hover`  | `colors.$gray-light-mid` | Tile background on hover and keyboard focus (`colors.$gray-dark-mid` dark) |
| `--quick-actions-tile-color`     | `colors.$black`          | Tile text colour (`colors.$white` in dark theme)                           |
| `--quick-actions-tile-max-width` | `184px`                  | Cap on one tile's width; `none` lets the tiles grow to fill the banner     |
| `--quick-actions-row-max-width`  | `100%`                   | Cap on the width of the tile row                                           |
| `--quick-actions-edge-inset`     | `0px`                    | Distance from the banner edge to the first tile, applied as inline padding |

The dark-theme values apply under a `.dark` ancestor class, which `ThemeProvider` puts on `<body>`. The fade, arrow and close-control colours are not configurable.

## Icons

`components/quick-actions/icons.ts` re-exports 20 tile illustrations as React components. They are exported from the component barrel and, through it, from the package root:

`BlankPdfIcon`, `CreateAgentIcon`, `CreateDocumentIcon`, `CreateFormIcon`, `CreateFromTemplateIcon`, `CreateFromTextIcon`, `CreatePresentationIcon`, `CreateRoomIcon`, `CreateCustomRoomIllustrationIcon`, `UseRoomTemplateIllustrationIcon`, `QuickVdrRoomIcon`, `QuickCollaborationRoomIcon`, `QuickPublicRoomIcon`, `QuickCustomRoomIcon`, `QuickFormRoomIcon`, `CreateSpreadsheetIcon`, `GeneratePdfAiIcon`, `GenerateWithAiIcon`, `UseTemplateIcon`, `AIChatIcon`.

## Examples

### Dismissible

```jsx
<QuickActions
  onClose={hideQuickActions}
  closeLabel={t("Common:DisableQuickActionsOnAllPages")}
  prevLabel={t("Common:Previous")}
  nextLabel={t("Common:Next")}
  items={roomItems}
/>
```

Persisting and reversing the dismissal is up to the host; the component only calls `onClose`.

### Loading

```jsx
<QuickActions isLoading items={[]} />
```
