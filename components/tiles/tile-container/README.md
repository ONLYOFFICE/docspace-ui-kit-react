# TileContainer

Container component for organizing and displaying tiles in a grid layout with automatic categorization.

## Usage

```tsx
import { TileContainer } from "@docspace/shared/components/tiles/tile-container";

<TileContainer
  headingFolders="Folders"
  headingFiles="Files"
  isDesc={false}
>
  <FileTile item={fileItem} {...props} />
  <RoomTile item={roomItem} {...props} />
  <FileTile item={folderItem} {...props} />
</TileContainer>
```

## Props

| Props            |         Type          | Required | Values |     Default       | Description                                |
| ---------------- | :-------------------: | :------: | :----: | :---------------: | ------------------------------------------ |
| `children`       |   `React.ReactNode`   |   Yes    |   -    |         -         | Tile components to render                  |
| `headingFolders` |       `string`        |    -     |   -    |         -         | Heading text for folders section           |
| `headingFiles`   |       `string`        |    -     |   -    |         -         | Heading text for files section             |
| `useReactWindow` |       `boolean`       |    -     |   -    |      `false`      | Enable virtualization with react-window    |
| `id`             |       `string`        |    -     |   -    | `"tileContainer"` | Container ID                               |
| `className`      |       `string`        |    -     |   -    |         -         | Additional CSS class name                  |
| `infiniteGrid`   | `React.ComponentType` |    -     |   -    |         -         | Infinite grid component for virtualization |
| `isDesc`         |       `boolean`       |    -     |   -    |      `false`      | Descending order flag for styling          |
| `style`          | `React.CSSProperties` |    -     |   -    |         -         | Inline styles                              |
| `noSelect`       |       `boolean`       |    -     |   -    |      `false`      | Disable selection styling                  |

## Features

- **Automatic Categorization**: Automatically groups items into:
  - Rooms
  - Templates
  - Folders
  - Files
- **Section Headings**: Displays headings for folders and files sections
- **Grid Layout**: Responsive grid layout for tiles
- **Virtualization Support**: Optional react-window integration for large lists
- **Flexible Rendering**: Supports both regular and virtualized rendering modes

## Item Categorization

The container automatically categorizes children based on item properties:

- **Rooms**: Items with `isRoom: true`
- **Templates**: Items with `isTemplate: true`
- **Folders**: Items with `isFolder: true` and no `fileExst`
- **Files**: All other items

## Layout Structure

```
TileContainer
├── Rooms (no heading)
├── Templates (no heading)
├── Folders
│   ├── Heading: "Folders"
│   └── Grid of folder tiles
└── Files
    ├── Heading: "Files"
    └── Grid of file tiles
```

## Tile Item Interface

```tsx
interface TileItem {
  id: string | number;
  isFolder?: boolean;
  isRoom?: boolean;
  isTemplate?: boolean;
  fileExst?: string;
  // ... other properties
}
```

## Virtualization

When `useReactWindow` is enabled and `infiniteGrid` component is provided:

```tsx
<TileContainer
  useReactWindow
  infiniteGrid={InfiniteGridComponent}
>
  {tiles}
</TileContainer>
```

The container will pass `isRooms` and `isTemplates` flags to the infinite grid component for proper rendering.
