# FolderTile

Folder tile component for displaying folder information in a tile format with support for both compact and big folder views.

## Usage

```tsx
import { FolderTile } from "@docspace/shared/components/tiles/folder-tile";

<FolderTile
  item={{
    id: "folder-1",
    title: "My Folder",
    contextOptions: ["copy-to", "move-to"],
  }}
  contextOptions={contextOptions}
  element={<FolderIcon />}
  badges={<Badge label="1" />}
  onSelect={(checked, item) => console.log(checked, item)}
  setSelection={(items) => console.log(items)}
  withCtrlSelect={(item) => console.log("Ctrl+Click", item)}
  withShiftSelect={(item) => console.log("Shift+Click", item)}
>
  <TileContent>
    <Link>Folder Content</Link>
  </TileContent>
</FolderTile>
```

## Props

| Props                |                       Type                        | Required | Values | Default | Description                                            |
| -------------------- | :-----------------------------------------------: | :------: | :----: | :-----: | ------------------------------------------------------ |
| `item`               |                   `FolderItem`                    |   Yes    |   -    |    -    | Folder data object                                     |
| `contextOptions`     |               `ContextMenuModel[]`                |   Yes    |   -    |    -    | Context menu options                                   |
| `checked`            |                     `boolean`                     |    -     |   -    | `false` | Indicates if the folder is selected                    |
| `showHotkeyBorder`   |                     `boolean`                     |    -     |   -    | `false` | Flag to show hotkey border                             |
| `inProgress`         |                     `boolean`                     |    -     |   -    | `false` | Indicates if folder is in progress state               |
| `onSelect`           |  `(checked: boolean, item: FolderItem) => void`   |    -     |   -    |    -    | Callback when folder is selected                       |
| `thumbnailClick`     |          `(e: React.MouseEvent) => void`          |    -     |   -    |    -    | Callback when thumbnail is clicked                     |
| `getContextModel`    |            `() => ContextMenuModel[]`             |    -     |   -    |    -    | Function to get context menu model                     |
| `setSelection`       |          `(items: FolderItem[]) => void`          |    -     |   -    |    -    | Function to set selected items                         |
| `withCtrlSelect`     |            `(item: FolderItem) => void`           |    -     |   -    |    -    | Handler for Ctrl + Click selection                     |
| `withShiftSelect`    |            `(item: FolderItem) => void`           |    -     |   -    |    -    | Handler for Shift + Click selection                    |
| `element`            |                 `React.ReactNode`                 |    -     |   -    |    -    | Additional React element (icon)                        |
| `children`           |                 `React.ReactNode`                 |    -     |   -    |    -    | Child elements                                         |
| `hideContextMenu`    |                   `() => void`                    |    -     |   -    |    -    | Callback to hide context menu                          |
| `tileContextClick`   |        `(isRightClick?: boolean) => void`         |    -     |   -    |    -    | Callback when context menu is clicked                  |
| `badges`             |                 `React.ReactNode`                 |    -     |   -    |    -    | Folder badges                                          |
| `indeterminate`      |                     `boolean`                     |    -     |   -    | `false` | Checkbox indeterminate state flag                      |
| `isDragging`         |                     `boolean`                     |    -     |   -    | `false` | Indicates if folder is being dragged                   |
| `isActive`           |                     `boolean`                     |    -     |   -    | `false` | Indicates if folder is in active state                 |
| `isEdit`             |                     `boolean`                     |    -     |   -    | `false` | Flag for edit mode                                     |
| `temporaryIcon`      |          `string \| React.ReactElement`           |    -     |   -    |    -    | Temporary icon (SVG path or React element)             |
| `isBigFolder`        |                     `boolean`                     |    -     |   -    | `false` | Flag for big folder view                               |
| `dataTestId`         |                     `string`                      |    -     |   -    |    -    | Data test id for the tile                              |

## Folder Item Structure

```tsx
{
  id: string | number;
  title: string;
  contextOptions?: string[];
  logo?: {
    small?: string;
    color?: string;
    cover?: string;
  };
}
```

## Features

- **Compact View**: Standard folder tile with icon and content
- **Big Folder View**: Expanded view with larger icon area (set `isBigFolder={true}`)
- **Context Menu**: Integrated context menu for folder actions
- **Selection**: Checkbox-based selection with callbacks
- **Multi-Select**: Supports Ctrl+Click and Shift+Click selection
- **Drag Support**: Visual feedback for drag operations
- **Badges**: Supports custom badges
- **Flexible Icon**: Accepts both SVG path strings and React elements for `temporaryIcon`
- **Progress State**: Shows loader when in progress
- **Hotkey Border**: Visual indicator for keyboard navigation
