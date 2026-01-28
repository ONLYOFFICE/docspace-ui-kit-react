# RoomIcon

Versatile room icon component for displaying room avatars with support for images, colors, badges, editing capabilities, and various states.

## Usage

```tsx
import { RoomIcon } from "@docspace/ui-kit/components/room-icon";

<RoomIcon title="My Room" color="4781D1" size="48px" showDefault />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Room title (used for generating initials) |
| `color` | `string` | - | Background color (hex without #) |
| `size` | `string` | `"32px"` | Icon size |
| `radius` | `string` | `"6px"` | Border radius |
| `logo` | `TLogo \| string` | - | Room logo (URL or logo object) |
| `showDefault` | `boolean` | - | Show default state with initials |
| `isArchive` | `boolean` | `false` | Archive state styling |
| `isTemplate` | `boolean` | `false` | Template room styling |
| `isEmptyIcon` | `boolean` | - | Show empty icon placeholder |
| `withEditing` | `boolean` | - | Enable edit mode with dropdown |
| `hoverSrc` | `string` | - | Image to show on hover |
| `badgeUrl` | `string` | - | Badge icon URL |
| `badgeIconNode` | `ReactNode` | - | Badge icon as React node |
| `onBadgeClick` | `() => void` | - | Badge click handler |
| `model` | `TModel[]` | - | Dropdown menu items for editing |
| `onChangeFile` | `(e: ChangeEvent) => void` | - | File input change handler |
| `dropDownManualX` | `string` | `"-10px"` | Dropdown X position offset |
| `tooltipContent` | `string` | - | Tooltip text for badge |
| `tooltipId` | `string` | - | Tooltip ID |
| `className` | `string` | - | Additional CSS class |
| `imgClassName` | `string` | - | Image element CSS class |
| `dataTestId` | `string` | `"room-icon"` | Test ID |

### TModel Type

```ts
type TModel = {
  label: string;
  icon: string;
  key: string;
  onClick: () => void;
};
```

### TLogo Type

```ts
type TLogo = {
  medium?: string;
  cover?: {
    data: string;
  };
  color?: string;
};
```

## CSS Variables

The component uses CSS variables for theming, defined locally within the component:

| Variable | Light | Dark | Description |
|----------|-------|------|-------------|
| `--room-icon-fill` | `#ffffff` | `#333333` | Edit button icon fill |
| `--room-icon-background-color` | `#ffffff` | `#333333` | Badge background |
| `--room-icon-link-icon-path` | `#35A5D2` | `#5DC0E8` | Link icon path fill |
| `--room-icon-link-icon-background` | `#ffffff` | `#333333` | Link icon background |
| `--room-icon-empty-border` | `2px dashed #d0d5da` | `2px dashed #474747` | Empty state border |
| `--room-icon-background-color-archive` | `#a3a9ae` | `#ffffff` | Archive background |
| `--room-icon-button-color` | `#a3a9ae` | `#858585` | Button color |
| `--room-icon-opacity` | `1` | `0.1` | Background opacity |
| `--room-icon-edit-icon-background` | `#eceef1` | `#242424` | Edit icon background |

### Inline CSS Variables (set via style prop)

| Variable | Description |
|----------|-------------|
| `--room-icon-size` | Icon dimensions |
| `--room-icon-radius` | Border radius |
| `--room-icon-color` | Background color |
| `--room-icon-text-color` | Text/initials color |
| `--room-icon-cover-size` | Cover icon scale |

## Examples

### Basic with Color

```tsx
<RoomIcon title="Project Alpha" color="4781D1" size="48px" showDefault />
```

### With Logo Image

```tsx
<RoomIcon
  title="Design Team"
  logo="https://example.com/logo.png"
  size="48px"
/>
```

### Archive State

```tsx
<RoomIcon title="Old Project" color="A3A9AE" size="48px" isArchive showDefault />
```

### With Badge

```tsx
<RoomIcon
  title="Public Room"
  color="2DB482"
  size="48px"
  badgeUrl="/icons/planet.svg"
  onBadgeClick={() => console.log("Badge clicked")}
  showDefault
/>
```

### With Editing

```tsx
const model = [
  { label: "Upload", icon: uploadIcon, key: "upload", onClick: handleUpload },
  { label: "Remove", icon: removeIcon, key: "remove", onClick: handleRemove },
];

<RoomIcon
  title="My Room"
  color="F97A0B"
  size="96px"
  withEditing
  model={model}
  onChangeFile={handleFileChange}
  showDefault
/>
```

### Empty State

```tsx
<RoomIcon
  title=""
  isEmptyIcon
  model={model}
  onChangeFile={handleFileChange}
/>
```

### Template Room

```tsx
<RoomIcon title="Template" color="533ED1" size="48px" isTemplate showDefault />
```

### With Hover Effect

```tsx
<RoomIcon
  title="Hover Me"
  color="4781D1"
  size="48px"
  hoverSrc="/images/camera-icon.svg"
  model={model}
  showDefault
/>
```

### Different Sizes

```tsx
<RoomIcon title="Small" color="4781D1" size="32px" showDefault />
<RoomIcon title="Medium" color="4781D1" size="48px" showDefault />
<RoomIcon title="Large" color="4781D1" size="96px" showDefault />
```
