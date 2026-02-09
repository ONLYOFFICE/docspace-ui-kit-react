# TileContent

Content wrapper component for tile children with consistent styling and layout.

## Usage

```tsx
import { TileContent } from "@docspace/shared/components/tiles/tile-content";

<TileContent>
  <Link>File name or content</Link>
</TileContent>
```

## Props

| Props       |              Type               | Required | Values | Default | Description                       |
| ----------- | :-----------------------------: | :------: | :----: | :-----: | --------------------------------- |
| `children`  |        `React.ReactNode`        |   Yes    |   -    |    -    | Content to render inside the tile |
| `id`        |            `string`             |    -     |   -    |    -    | Element ID                        |
| `className` |            `string`             |    -     |   -    |    -    | Additional CSS class name         |
| `style`     |      `React.CSSProperties`      |    -     |   -    |    -    | Inline styles                     |
| `onClick`   | `(e: React.MouseEvent) => void` |    -     |   -    |    -    | Click handler                     |

## Features

- **Consistent Layout**: Provides standardized content wrapper for tiles
- **Width Management**: Automatically handles container width based on child props
- **Styling**: Applies consistent styling across all tile content
- **Click Handling**: Optional click handler support

## Structure

The component creates a nested structure:

```
TileContent
└── mainContainerWrapper (row-main-wrapper)
    └── mainContainer (row-main-container)
        └── children
```

## Usage in Tiles

TileContent is typically used inside FileTile or RoomTile components:

```tsx
<FileTile {...props}>
  <TileContent>
    <Link type={LinkType.page}>
      Document.docx
    </Link>
  </TileContent>
</FileTile>
```

```tsx
<RoomTile {...props}>
  <TileContent>
    <Link>
      Room Content
    </Link>
  </TileContent>
</RoomTile>
```

## Container Width

The component automatically adjusts width if the child component provides a `containerWidth` prop:

```tsx
<TileContent>
  <CustomComponent containerWidth="200px" />
</TileContent>
```

## CSS Classes

- `.tileContent` - Main wrapper class
- `.mainContainerWrapper` / `row-main-wrapper` - Middle wrapper
- `.mainContainer` / `row-main-container` - Inner container
