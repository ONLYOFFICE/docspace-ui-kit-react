# SelectionArea

A component that enables mouse-driven rectangular selection of items within a container. Tracks selected and deselected elements as the user drags to create a selection rectangle, supporting both row and tile view layouts.

## Usage

```tsx
import { SelectionArea } from "@docspace/ui-kit/components/selection-area";

<SelectionArea
  containerClass="files-container"
  selectableClass="file-item"
  scrollClass="scroll-wrapper"
  itemsContainerClass="items-wrapper"
  itemClass="item"
  viewAs="row"
  onMove={({ added, removed, clear }) => {
    // Update selection state
  }}
/>
```

## Features

- **Rectangular selection**: Click-and-drag to select multiple items
- **Add/remove tracking**: Reports newly added and removed elements on each move
- **View-aware**: Adapts selection logic for row and tile layouts
- **Scroll support**: Works within scrollable containers
- **Configurable geometry**: Supports custom item heights, row gaps, and tile counts

## Properties

| Prop                   | Type                                      | Default | Description                                          |
|------------------------|-------------------------------------------|---------|------------------------------------------------------|
| `containerClass`       | `string`                                  | —       | CSS class of the outer container element             |
| `selectableClass`      | `string`                                  | —       | CSS class of selectable child elements               |
| `onMove`               | `({ added, removed, clear }) => void`     | —       | Callback fired as the selection rectangle changes    |
| `scrollClass`          | `string`                                  | —       | CSS class of the scrollable container                |
| `viewAs`               | `TViewAs`                                 | —       | Current view mode (`"row"` or `"tile"`)              |
| `itemsContainerClass`  | `string`                                  | —       | CSS class of the items wrapper element               |
| `itemClass`            | `string`                                  | —       | CSS class of individual item elements                |
| `isRooms`              | `boolean`                                 | —       | Whether the selection area is used for rooms         |
| `folderHeaderHeight`   | `number`                                  | —       | Height of the folder header in pixels                |
| `arrayTypes`           | `TArrayTypes[]`                           | —       | Item type configuration (height, row gap, etc.)      |
| `countTilesInRow`      | `number`                                  | —       | Number of tiles per row in tile view                 |
| `defaultHeaderHeight`  | `number`                                  | —       | Default header height in pixels                      |
| `onMouseDown`          | `(event: MouseEvent) => void`             | —       | Optional mouse down event callback                   |
