# TemplateTile

Template tile component for displaying template information in a tile format with owner and storage metadata.

## Usage

```tsx
import { TemplateTile } from "@docspace/shared/components/tiles/template-tile";

<TemplateTile
  item={{
    id: "template-1",
    title: "Sample Template",
    createdBy: {
      id: "user-1",
      displayName: "John Doe",
    },
    security: {
      EditRoom: true,
    },
  }}
  contextOptions={contextOptions}
  element={<TemplateIcon />}
  columnCount={1}
  openUser={() => console.log("Open user")}
  showStorageInfo={true}
  SpaceQuotaComponent={SpaceQuota}
  onSelect={(checked, item) => console.log(checked, item)}
>
  <TileContent>
    <Link>Template Content</Link>
  </TileContent>
</TemplateTile>
```

## Props

| Props                   |                       Type                        | Required | Values | Default | Description                                              |
| ----------------------- | :-----------------------------------------------: | :------: | :----: | :-----: | -------------------------------------------------------- |
| `item`                  |                  `TemplateItem`                   |   Yes    |   -    |    -    | Template data object                                     |
| `contextOptions`        |              `ContextMenuModel[]`                 |   Yes    |   -    |    -    | Context menu options                                     |
| `columnCount`           |                     `number`                      |   Yes    |   -    |    -    | Number of columns in the grid                            |
| `openUser`              |                   `() => void`                    |   Yes    |   -    |    -    | Callback when owner link is clicked                      |
| `checked`               |                    `boolean`                      |    -     |   -    | `false` | Indicates if the template is selected                    |
| `isActive`              |                    `boolean`                      |    -     |   -    | `false` | Indicates if the template is in active state             |
| `isBlockingOperation`   |                    `boolean`                      |    -     |   -    | `false` | Indicates if the template is in blocking operation state |
| `onSelect`              | `(checked: boolean, item: TemplateItem) => void`  |    -     |   -    |    -    | Callback when template is selected                       |
| `thumbnailClick`        |         `(e: React.MouseEvent) => void`           |    -     |   -    |    -    | Callback when thumbnail is clicked                       |
| `getContextModel`       |           `() => ContextMenuModel[]`              |    -     |   -    |    -    | Function to get context menu model                       |
| `children`              |                `React.ReactNode`                  |    -     |   -    |    -    | Child elements                                           |
| `indeterminate`         |                    `boolean`                      |    -     |   -    | `false` | Checkbox indeterminate state flag                        |
| `element`               |                `React.ReactNode`                  |    -     |   -    |    -    | Additional React element (icon)                          |
| `badges`                |                `React.ReactNode`                  |    -     |   -    |    -    | Template badges                                          |
| `inProgress`            |                    `boolean`                      |    -     |   -    | `false` | Indicates if template is in progress state               |
| `showHotkeyBorder`      |                    `boolean`                      |    -     |   -    | `false` | Flag to show hotkey border                               |
| `isEdit`                |                    `boolean`                      |    -     |   -    | `false` | Flag for edit mode                                       |
| `showStorageInfo`       |                    `boolean`                      |    -     |   -    | `false` | Flag to show storage information                         |
| `SpaceQuotaComponent`   |    `React.ComponentType<SpaceQuotaProps>`         |    -     |   -    |    -    | Component to display space quota                         |

## Template Item Structure

```tsx
{
  id: string | number;
  title: string;
  createdBy?: {
    displayName: string;
    id: string;
  };
  security?: {
    EditRoom?: boolean;
    [key: string]: boolean | undefined;
  };
  logo?: {
    small?: string;
    color?: string;
    cover?: string;
  };
}
```

## SpaceQuota Props Structure

```tsx
{
  item: TemplateItem;
  type: string;
  isReadOnly?: boolean;
  className?: string;
}
```

## Features

- **Owner Information**: Displays template owner with clickable link
- **Storage Info**: Optional storage quota display
- **Context Menu**: Integrated context menu for template actions
- **Selection**: Checkbox-based selection with callbacks
- **Badges**: Supports custom badges
- **Security**: Respects security settings for edit permissions
- **Responsive Layout**: Adapts to different column counts
