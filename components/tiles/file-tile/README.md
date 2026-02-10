# FileTile

File tile component for displaying file information in a tile format with thumbnail preview.

## Usage

```tsx
import { FileTile } from "@docspace/ui-kit/components/tiles/file-tile";

<FileTile
  item={{
    id: "file-1",
    title: "Document.docx",
    fileExst: ".docx",
    fileType: FileType.Document,
  }}
  contextOptions={contextOptions}
  element={<FileIcon />}
  thumbnail="/path/to/thumbnail.jpg"
  temporaryIcon={<DefaultIcon />}
  onSelect={(checked, item) => console.log(checked, item)}
/>
```

## Props

| Props                      |                       Type                       | Required | Values | Default | Description                                         |
| -------------------------- | :----------------------------------------------: | :------: | :----: | :-----: | --------------------------------------------------- |
| `item`                     |                  `FileItemType`                  |   Yes    |   -    |    -    | File item data                                      |
| `contextOptions`           |              `ContextMenuModel[]`                |   Yes    |   -    |    -    | Context menu options                                |
| `checked`                  |                    `boolean`                     |    -     |   -    | `false` | Indicates if the tile is selected                   |
| `children`                 |         `ReactElement \| ReactElement[]`         |    -     |   -    |    -    | Child components to render                          |
| `contextButtonSpacerWidth` |                     `number`                     |    -     |   -    |    -    | Width of the spacer for context menu button         |
| `inProgress`               |                    `boolean`                     |    -     |   -    | `false` | Indicates if the tile is in loading state           |
| `onSelect`                 | `(checked: boolean, item: FileItemType) => void` |    -     |   -    |    -    | Function called when tile is selected               |
| `thumbnailClick`           |          `(e: React.MouseEvent) => void`         |    -     |   -    |    -    | Function called when thumbnail is clicked           |
| `thumbnail`                |                     `string`                     |    -     |   -    |    -    | Thumbnail image URL                                 |
| `temporaryIcon`            |            `string \| ReactElement`              |    -     |   -    |    -    | Temporary icon when thumbnail is not available      |
| `withCtrlSelect`           |          `(item: FileItemType) => void`          |    -     |   -    |    -    | Function to handle selection with Ctrl key          |
| `withShiftSelect`          |          `(item: FileItemType) => void`          |    -     |   -    |    -    | Function to handle selection with Shift key         |
| `element`                  |                  `ReactElement`                  |    -     |   -    |    -    | Custom element to render                            |
| `tileContextClick`         |        `(isRightClick?: boolean) => void`        |    -     |   -    |    -    | Function called when context menu button is clicked |
| `getContextModel`          |           `() => ContextMenuModel[]`             |    -     |   -    |    -    | Function to get context menu model                  |
| `hideContextMenu`          |                  `() => void`                    |    -     |   -    |    -    | Function to hide context menu                       |
| `sideColor`                |                     `string`                     |    -     |   -    |    -    | Color for the left border                           |
| `setSelection`             |           `(items: FileItem[]) => void`          |    -     |   -    |    -    | Function to set selection state                     |
| `contentElement`           |                  `ReactElement`                  |    -     |   -    |    -    | Custom content element                              |
| `badges`                   |                  `ReactElement`                  |    -     |   -    |    -    | Custom badges to display                            |
| `isHighlight`              |                    `boolean`                     |    -     |   -    | `false` | Flag indicating if tile should be highlighted       |
| `isBlockingOperation`      |                    `boolean`                     |    -     |   -    | `false` | Indicates if file is in blocking operation state    |
| `showHotkeyBorder`         |                    `boolean`                     |    -     |   -    | `false` | Flag to show hotkey border                          |
| `isDragging`               |                    `boolean`                     |    -     |   -    | `false` | Indicates if file is being dragged                  |
| `thumbSize`                |                     `number`                     |    -     |   -    |    -    | Size of the thumbnail in pixels                     |
| `isActive`                 |                    `boolean`                     |    -     |   -    | `false` | Indicates if file is in active state                |
| `isEdit`                   |                    `boolean`                     |    -     |   -    | `false` | Flag for edit mode                                  |
| `dataTestId`               |                     `string`                     |    -     |   -    |    -    | Data test id for the tile                           |

## Features

- **Thumbnail Preview**: Displays file thumbnails with fallback icons
- **File Type Icons**: Shows appropriate icons for different file types
- **Plugin Support**: Handles plugin files with custom icons
- **Multi-Selection**: Supports Ctrl/Cmd and Shift key selection
- **Drag & Drop**: Visual feedback during drag operations
- **Context Menu**: Right-click and three-dot menu support
- **Progress State**: Shows loader during operations
- **Badges**: Supports custom badges (version, lock, etc.)
- **Mobile Optimized**: Touch-friendly interface

## File Item Structure

```tsx
{
  id: string | number;
  title: string;
  fileExst?: string;
  fileType?: FileType;
  isPlugin?: boolean;
  fileTileIcon?: string;
  logo?: {
    original?: string;
    large?: string;
    medium?: string;
    small?: string;
    color?: string;
    cover?: string;
  };
  viewAccessibility?: {
    ImageView: boolean;
    MediaView: boolean;
  };
  contextOptions?: string[];
}
```
