# Tiles

A set of tile components for displaying files, folders, rooms, and templates in a grid layout. Each tile type provides a specialized card view with thumbnails, icons, context menus, and badges.

## Usage

```tsx
import {
  TileContainer,
  FileTile,
  FolderTile,
  RoomTile,
} from "@docspace/ui-kit/components/tiles";

<TileContainer>
  <RoomTile item={room} />
  <FolderTile item={folder} />
  <FileTile item={file} />
</TileContainer>
```

## Exports

- **`BaseTile`** — Base tile component with shared layout and behavior
- **`FileTile`** — Tile for file items with thumbnail preview
- **`FolderTile`** — Tile for folder items
- **`RoomTile`** — Tile for room items with room-specific badges and logos
- **`TemplateTile`** — Tile for template items
- **`TileContainer`** — Grid container that arranges tiles responsively
- **`TileContent`** — Content layout within a tile (title, metadata)

## Features

- **Grid layout**: Responsive tile grid managed by `TileContainer`
- **Thumbnail previews**: File tiles display image thumbnails when available
- **Context menus**: Right-click or button-triggered context menus per tile
- **Selection**: Checkbox-based selection with visual feedback
- **Drag and drop**: Tiles support drag-and-drop interactions
- **Badges**: Room tiles display tags, logos, and status badges
- **Skeleton loading**: Placeholder tiles during data loading
