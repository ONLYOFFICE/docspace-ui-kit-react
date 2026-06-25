# RoomLogo

Displays a room logo icon based on room type. Supports different room types, archive and template states, and optional checkbox overlay for selection.

## Features

- **Multiple Room Types**: EditingRoom, CustomRoom, PublicRoom, VirtualDataRoom, FormRoom, AIRoom
- **Template Variants**: Different icons for template rooms
- **Archive State**: Special archive icon
- **Checkbox Overlay**: Optional checkbox for row/tile selection
- **Mobile Support**: Touch-friendly selection on mobile devices

## Installation

```tsx
import { RoomLogo } from "@docspace/ui-kit";
import { RoomsType } from "@docspace/ui-kit/enums";
```

## Usage

```tsx
// Basic room logo
<RoomLogo type={RoomsType.EditingRoom} />

// Archive room
<RoomLogo type={RoomsType.CustomRoom} isArchive />

// Template room
<RoomLogo type={RoomsType.FormRoom} isTemplateRoom />

// With checkbox
<RoomLogo
  type={RoomsType.PublicRoom}
  withCheckbox
  isChecked={isSelected}
  onChange={handleSelect}
/>

// Template (not a specific room type)
<RoomLogo isTemplate />
```

## Properties

| Prop              | Type            | Required | Default | Description                                          |
| ----------------- | --------------- | :------: | ------- | ---------------------------------------------------- |
| `type`            | `RoomsType`     |    -     | -       | Room type determining which icon to display          |
| `isArchive`       | `boolean`       |    -     | `false` | Display archive room icon                            |
| `isTemplate`      | `boolean`       |    -     | `false` | Display template icon                                |
| `isTemplateRoom`  | `boolean`       |    -     | `false` | Display template variant of room type icon           |
| `withCheckbox`    | `boolean`       |    -     | `false` | Show checkbox overlay for selection                  |
| `isChecked`       | `boolean`       |    -     | `false` | Checkbox checked state                               |
| `isIndeterminate` | `boolean`       |    -     | `false` | Checkbox indeterminate state                         |
| `onChange`        | `() => void`    |    -     | -       | Callback when checkbox state changes                 |
| `id`              | `string`        |    -     | -       | HTML id attribute                                    |
| `className`       | `string`        |    -     | -       | Additional CSS class name                            |
| `style`           | `CSSProperties` |    -     | -       | Custom inline styles                                 |

## Room Types

The `RoomsType` enum provides the following room types:

```tsx
import { RoomsType } from "@docspace/ui-kit/enums";

RoomsType.EditingRoom     // Collaboration/editing room
RoomsType.CustomRoom      // Custom room
RoomsType.PublicRoom      // Public room
RoomsType.VirtualDataRoom // Virtual data room
RoomsType.FormRoom        // Form room
RoomsType.AIRoom          // AI room
```

## Examples

### Room List with Selection

```tsx
import { RoomLogo } from "@docspace/ui-kit";
import { RoomsType } from "@docspace/ui-kit/enums";

const RoomList = ({ rooms, selectedIds, onSelect }) => (
  <ul>
    {rooms.map((room) => (
      <li key={room.id}>
        <RoomLogo
          type={room.type}
          isArchive={room.isArchived}
          isTemplateRoom={room.isTemplate}
          withCheckbox
          isChecked={selectedIds.includes(room.id)}
          onChange={() => onSelect(room.id)}
        />
        <span>{room.title}</span>
      </li>
    ))}
  </ul>
);
```

### Different Room States

```tsx
// Standard rooms
<RoomLogo type={RoomsType.EditingRoom} />
<RoomLogo type={RoomsType.CustomRoom} />
<RoomLogo type={RoomsType.PublicRoom} />

// Archived rooms
<RoomLogo type={RoomsType.EditingRoom} isArchive />

// Template rooms (show template variant icon)
<RoomLogo type={RoomsType.FormRoom} isTemplateRoom />
<RoomLogo type={RoomsType.VirtualDataRoom} isTemplateRoom />

// Template section icon
<RoomLogo isTemplate />
```

## Styling

The component uses CSS modules. Available CSS classes:

- `.container` - Main container
- `.room-logo_icon-container` - Icon wrapper
- `.room-logo_icon` - The SVG icon
- `.room-logo_checkbox` - Checkbox overlay

```tsx
<RoomLogo
  type={RoomsType.CustomRoom}
  className="my-room-logo"
  style={{ margin: "8px" }}
/>
```
