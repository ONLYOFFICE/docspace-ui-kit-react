# BaseTile

Base tile component that provides the foundational structure and functionality for all tile components.

## Usage

```tsx
import { BaseTile } from "@docspace/ui-kit/components/tiles/base-tile";

<BaseTile
  item={item}
  checked={false}
  contextOptions={contextOptions}
  onSelect={(checked, item) => console.log(checked, item)}
  element={<IconElement />}
  topContent={<div>Top content</div>}
  bottomContent={<div>Bottom content</div>}
/>
```

## Props

| Props                 |                     Type                     | Required | Values | Default | Description                                            |
| --------------------- | :------------------------------------------: | :------: | :----: | :-----: | ------------------------------------------------------ |
| `item`                |                  `TileItem`                  |   Yes    |   -    |    -    | Tile data object                                       |
| `contextOptions`      |             `ContextMenuModel[]`             |   Yes    |   -    |    -    | Context menu options                                   |
| `checked`             |                  `boolean`                   |    -     |   -    | `false` | Indicates if the tile is selected                      |
| `isActive`            |                  `boolean`                   |    -     |   -    | `false` | Indicates if the tile is in active state               |
| `isBlockingOperation` |                  `boolean`                   |    -     |   -    | `false` | Indicates if the tile is in a blocking operation state |
| `onSelect`            | `(checked: boolean, item: TileItem) => void` |    -     |   -    |    -    | Callback when tile is selected                         |
| `getContextModel`     |          `() => ContextMenuModel[]`          |    -     |   -    |    -    | Function to get context menu model                     |
| `indeterminate`       |                  `boolean`                   |    -     |   -    | `false` | Checkbox indeterminate state flag                      |
| `element`             |              `React.ReactNode`               |    -     |   -    |    -    | Additional React element (icon)                        |
| `tileContextClick`    |      `(isRightClick?: boolean) => void`      |    -     |   -    |    -    | Callback when context menu is clicked                  |
| `hideContextMenu`     |                 `() => void`                 |    -     |   -    |    -    | Callback to hide context menu                          |
| `inProgress`          |                  `boolean`                   |    -     |   -    | `false` | Indicates if tile is in progress state                 |
| `showHotkeyBorder`    |                  `boolean`                   |    -     |   -    | `false` | Flag to show hotkey border                             |
| `isEdit`              |                  `boolean`                   |    -     |   -    | `false` | Flag for edit mode                                     |
| `topContent`          |              `React.ReactNode`               |    -     |   -    |    -    | Content to render in the top section                   |
| `bottomContent`       |              `React.ReactNode`               |    -     |   -    |    -    | Content to render in the bottom section                |
| `isHovered`           |                  `boolean`                   |    -     |   -    | `false` | Indicates if tile is hovered                           |
| `onHover`             |                 `() => void`                 |    -     |   -    |    -    | Callback on hover                                      |
| `onLeave`             |                 `() => void`                 |    -     |   -    |    -    | Callback on mouse leave                                |
| `className`           |                   `string`                   |    -     |   -    |    -    | Additional CSS class name                              |
| `onRoomClick`         |        `(e: React.MouseEvent) => void`       |    -     |   -    |    -    | Callback when tile is clicked                          |
| `dataTestId`          |                   `string`                   |    -     |   -    |    -    | Data test id for the tile                              |
| `badgeUrl`            |                   `string`                   |    -     |   -    |    -    | Badge URL                                              |

## Features

- **Checkbox Selection**: Built-in checkbox for selecting tiles
- **Context Menu**: Integrated context menu with customizable options
- **Progress State**: Shows loader when in progress
- **Hover States**: Supports hover interactions
- **Keyboard Navigation**: Hotkey border support
- **Mobile Support**: Optimized for mobile devices

## Structure

The BaseTile component consists of:
- **Top Content**: Icon/checkbox area and main content
- **Bottom Content**: Additional content area (e.g., tags, metadata)
- **Context Menu**: Three-dot menu for actions
