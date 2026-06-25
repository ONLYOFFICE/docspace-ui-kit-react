# RoomTile

Room tile component for displaying room information in a tile format with tags and metadata.

## Usage

```tsx
import { RoomTile } from "@docspace/ui-kit/components/tiles/room-tile";

<RoomTile
  t={(key) => key}
  item={{
    id: "room-1",
    title: "Sample Room",
    roomType: "collaboration",
    tags: [{ label: "Tag", roomType: RoomsType.EditingRoom }],
  }}
  contextOptions={contextOptions}
  element={<RoomIcon />}
  columnCount={1}
  selectTag={(tag) => console.log(tag)}
  selectOption={(option) => console.log(option)}
  getRoomTypeName={(type, t) => type}
  onSelect={(checked, item) => console.log(checked, item)}
/>
```

## Props

| Props                 |                          Type                          | Required | Values | Default | Description                                          |
| --------------------- | :----------------------------------------------------: | :------: | :----: | :-----: | ---------------------------------------------------- |
| `t`                   |                      `TFunction`                       |   Yes    |   -    |    -    | Translation function from i18next                    |
| `item`                |                       `RoomItem`                       |   Yes    |   -    |    -    | Room data object                                     |
| `contextOptions`      |                  `ContextMenuModel[]`                  |   Yes    |   -    |    -    | Context menu options                                 |
| `columnCount`         |                        `number`                        |   Yes    |   -    |    -    | Column count for tags layout                         |
| `selectTag`           | `(tag: Array<TagType \| string> \| undefined) => void` |   Yes    |   -    |    -    | Callback for tag selection                           |
| `selectOption`        |            `(option: SelectOption) => void`            |   Yes    |   -    |    -    | Callback for option selection                        |
| `getRoomTypeName`     |        `(type: string, t: TFunction) => string`        |   Yes    |   -    |    -    | Function to get room type name                       |
| `checked`             |                       `boolean`                        |    -     |   -    | `false` | Indicates if the room is selected                    |
| `isActive`            |                       `boolean`                        |    -     |   -    | `false` | Indicates if the room is in active state             |
| `isBlockingOperation` |                       `boolean`                        |    -     |   -    | `false` | Indicates if the room is in blocking operation state |
| `onSelect`            |     `(checked: boolean, item: RoomItem) => void`       |    -     |   -    |    -    | Callback when room is selected                       |
| `thumbnailClick`      |           `(e: React.MouseEvent) => void`              |    -     |   -    |    -    | Callback when thumbnail is clicked                   |
| `getContextModel`     |              `() => ContextMenuModel[]`                |    -     |   -    |    -    | Function to get context menu model                   |
| `children`            |                   `React.ReactNode`                    |    -     |   -    |    -    | Child elements                                       |
| `indeterminate`       |                       `boolean`                        |    -     |   -    | `false` | Checkbox indeterminate state flag                    |
| `element`             |                   `React.ReactNode`                    |    -     |   -    |    -    | Additional React element                             |
| `badges`              |                   `React.ReactNode`                    |    -     |   -    |    -    | Room badges                                          |
| `inProgress`          |                       `boolean`                        |    -     |   -    | `false` | Indicates if room is in progress state               |
| `showHotkeyBorder`    |                       `boolean`                        |    -     |   -    | `false` | Flag to show hotkey border                           |
| `isEdit`              |                       `boolean`                        |    -     |   -    | `false` | Flag for edit mode                                   |
| `dataTestId`          |                        `string`                        |    -     |   -    |    -    | Data test id for the tile                            |

## Room Item Structure

```tsx
{
  id: string | number;
  title: string;
  roomType: string;
  providerType?: string;
  providerKey?: string;
  thirdPartyIcon?: string;
  tags?: Array<TagType | string>;
  contextOptions?: ContextMenuModel[];
  logo?: {
    small?: string;
    color?: string;
    cover?: string;
  };
  isAIAgent?: boolean;
}
```

## Select Option Structure

```tsx
{
  option: "typeProvider" | "defaultTypeRoom";
  value: string;
}
```

## Features

- **Tags System**: Displays and manages room tags
- **Room Types**: Shows room type with appropriate styling
- **Third-Party Integration**: Supports third-party provider icons
- **AI Agent Support**: Special handling for AI agent rooms
- **Context Menu**: Integrated context menu for room actions
- **Selection**: Checkbox-based selection with callbacks
- **Badges**: Supports custom badges (pinned, etc.)
- **Responsive Layout**: Adapts to different column counts
- **Click Handling**: Smart click detection excluding interactive elements

## Tag Types

- **Default Tags**: Room type tags (Collaboration, Custom, etc.)
- **Custom Tags**: User-defined tags
- **Provider Tags**: Third-party storage provider tags
- **AI Agent Tags**: Special "No Tags" indicator for AI agents
