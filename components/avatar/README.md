# Avatar

A component for displaying user or group avatars with support for images, initials, icons, role indicators, and editing functionality.

## Features

- **Multiple Display Modes**: Images, initials, icons, or default placeholder
- **Six Sizes**: min, small, base, medium, big, max
- **Role Indicators**: Owner, admin, guest, user badges
- **Group Avatars**: Specialized styling for group representations
- **Editing Support**: Built-in edit mode with dropdown menu
- **Tooltips**: Optional role tooltips on hover
- **RTL Support**: Full right-to-left layout support

## Installation

```tsx
import { Avatar, AvatarSize, AvatarRole } from "@docspace/ui-kit/components/avatar";
```

## Usage

```tsx
// Avatar with image
<Avatar
  size={AvatarSize.max}
  role={AvatarRole.admin}
  source="https://example.com/photo.jpg"
  userName="John Smith"
/>

// Avatar with initials
<Avatar
  size={AvatarSize.medium}
  role={AvatarRole.user}
  userName="John Doe"
/>

// Group avatar
<Avatar
  size={AvatarSize.big}
  userName="Project Team"
  isGroup
  hideRoleIcon
/>

// Avatar with editing
<Avatar
  size={AvatarSize.max}
  role={AvatarRole.owner}
  userName="Jane Smith"
  editing
  hasAvatar
  onChangeFile={handleFileChange}
  model={[
    { key: "upload", label: "Upload", icon: uploadIcon, onClick: handleUpload },
    { key: "delete", label: "Delete", icon: deleteIcon, onClick: handleDelete },
  ]}
/>

// Avatar with tooltip
<Avatar
  size={AvatarSize.base}
  role={AvatarRole.admin}
  userName="Admin User"
  withTooltip
  tooltipContent="Administrator"
/>
```

## Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `AvatarSize` | - | Size of the avatar (required) |
| `role` | `AvatarRole` | - | User role for badge display (required) |
| `source` | `string` | - | Image URL or SVG path |
| `userName` | `string` | - | User name for initials generation |
| `editing` | `boolean` | `false` | Enable edit mode (only works with `size="max"`) |
| `isDefaultSource` | `boolean` | `false` | Show default avatar when source is blank |
| `editAction` | `() => void` | - | Callback when edit button is clicked |
| `hideRoleIcon` | `boolean` | `false` | Hide the role indicator badge |
| `withTooltip` | `boolean` | `false` | Show tooltip on role icon hover |
| `tooltipContent` | `string` | - | Content for the tooltip |
| `onClick` | `(e: MouseEvent) => void` | - | Click handler |
| `isGroup` | `boolean` | `false` | Display as group avatar (uppercase initials) |
| `roleIcon` | `ReactElement` | - | Custom role icon element |
| `noClick` | `boolean` | `false` | Disable click interactions |
| `hasAvatar` | `boolean` | - | Indicates if user has an avatar (affects edit UI) |
| `onChangeFile` | `() => void` | - | File input change handler |
| `model` | `TAvatarModel[]` | - | Menu items for edit dropdown |
| `className` | `string` | - | Additional CSS classes |
| `id` | `string` | - | HTML id attribute |
| `style` | `CSSProperties` | - | Custom inline styles |
| `dataTestId` | `string` | `'avatar'` | Test ID for automated testing |

## Enums

### AvatarSize

| Value | Dimensions | Description |
|-------|------------|-------------|
| `min` | 32x32px | Smallest size |
| `small` | 36x36px | Small size |
| `base` | 40x40px | Base/default size |
| `medium` | 48x48px | Medium size |
| `big` | 80x80px | Large size |
| `max` | 124x124px | Maximum size (supports editing) |

### AvatarRole

| Value | Description |
|-------|-------------|
| `owner` | Owner badge (crown icon) |
| `admin` | Administrator badge |
| `guest` | Guest user |
| `user` | Regular user |
| `manager` | Manager role |
| `collaborator` | Collaborator role |
| `none` | No role badge |

### AvatarActionKeys

| Value | Description |
|-------|-------------|
| `PROFILE_AVATAR_UPLOAD` | Upload avatar action key |
| `PROFILE_AVATAR_DELETE` | Delete avatar action key |

## Display Priority

The avatar displays content in this priority order:

1. **Image** - If `source` contains an image URL
2. **Icon** - If `source` contains an `.svg` path
3. **Initials** - If `userName` is provided (first letter of first two words)
4. **Default** - If `isDefaultSource` is true
5. **Empty** - Camera icon placeholder

## CSS Variables

### Theme Variables

| Variable | Description |
|----------|-------------|
| `--avatar-image-container-background` | Default container background |
| `--avatar-image-container-background-image` | Background for initials avatar |
| `--avatar-image-container-group-background` | Background for group avatars |
| `--avatar-icon-background` | Background when showing icon |
| `--avatar-icon-color` | Icon fill color |
| `--avatar-image-border-radius` | Border radius for images |
| `--avatar-default-image` | Default avatar image |
| `--avatar-initials-color` | Text color for initials |
| `--avatar-initials-group-color` | Text color for group initials |

### Role Icon Variables

| Variable | Description |
|----------|-------------|
| `--avatar-administrator-fill` | Admin badge background |
| `--avatar-administrator-stroke` | Admin badge border |
| `--avatar-administrator-color` | Admin badge icon color |
| `--avatar-owner-fill` | Owner badge background |
| `--avatar-owner-stroke` | Owner badge border |
| `--avatar-owner-color` | Owner badge icon color |
| `--avatar-guest-fill` | Guest badge background |
| `--avatar-guest-stroke` | Guest badge border |
| `--avatar-guest-color` | Guest badge icon color |

### Edit Container Variables

| Variable | Description |
|----------|-------------|
| `--avatar-edit-container-fill` | Edit button icon color |
| `--avatar-edit-container-fill-hover` | Edit button hover background |
| `--avatar-edit-container-fill-press` | Edit button active background |
| `--color-scheme-main-accent` | Edit button background |

## CSS Classes

### Base Classes

| Class | Description |
|-------|-------------|
| `.avatar` | Main container with size variants via `data-size` |
| `.avatarWrapper` | Inner wrapper with background styling |
| `.image` | Image element styling |
| `.namedAvatar` | Initials display container |
| `.iconWrapper` | SVG icon container |
| `.emptyIcon` | Empty state camera icon |

### Modifier Classes

| Class | Description |
|-------|-------------|
| `.isGroup` | Applied to initials for group styling |
| `.editContainer` | Edit button container (max size only) |
| `.roleWrapper` | Role badge positioning container |
| `.adminIcon` | Admin role icon styling |
| `.ownerIcon` | Owner role icon styling |

### Global Classes

| Class | Description |
|-------|-------------|
| `.admin_icon` | Admin badge SVG styling |
| `.owner_icon` | Owner badge SVG styling |
| `.guest_icon` | Guest badge SVG styling |
| `.edit_icon` | Edit button icon styling |
| `.avatar_role-wrapper` | External access to role wrapper |

## Examples

### User Profile Avatar

```tsx
<Avatar
  size={AvatarSize.max}
  role={AvatarRole.admin}
  source={user.avatarUrl}
  userName={user.fullName}
  withTooltip
  tooltipContent={`${user.fullName} - ${user.role}`}
/>
```

### Editable Profile Avatar

```tsx
const avatarModel = [
  {
    key: AvatarActionKeys.PROFILE_AVATAR_UPLOAD,
    label: "Upload photo",
    icon: uploadIcon,
    onClick: (ref) => ref?.current?.click(),
  },
  {
    key: AvatarActionKeys.PROFILE_AVATAR_DELETE,
    label: "Remove photo",
    icon: deleteIcon,
    onClick: handleDeleteAvatar,
  },
];

<Avatar
  size={AvatarSize.max}
  role={AvatarRole.owner}
  source={user.avatarUrl}
  userName={user.fullName}
  editing
  hasAvatar={!!user.avatarUrl}
  onChangeFile={handleFileChange}
  model={avatarModel}
/>
```

### Avatar List

```tsx
<div style={{ display: "flex", gap: "8px" }}>
  {users.map((user) => (
    <Avatar
      key={user.id}
      size={AvatarSize.small}
      role={user.role}
      source={user.avatar}
      userName={user.name}
      hideRoleIcon
    />
  ))}
</div>
```

### Group Avatar

```tsx
<Avatar
  size={AvatarSize.medium}
  role={AvatarRole.none}
  userName="Development Team"
  isGroup
  hideRoleIcon
/>
```

## Accessibility

- Uses semantic HTML with proper ARIA attributes
- Tooltip support for role information
- Keyboard accessible edit functionality
- Alt text on images

## Best Practices

1. **Always provide userName**: Even with images, provide `userName` as fallback
2. **Use appropriate sizes**: Match avatar size to context (lists use smaller, profiles use larger)
3. **Hide role icons in lists**: Use `hideRoleIcon` in compact layouts
4. **Provide tooltips**: Use `withTooltip` to show role information on hover
5. **Handle loading states**: Show default avatar while images load

## Related Components

- [DropDown](../drop-down/README.md) - Used for edit menu
- [DropDownItem](../drop-down-item/README.md) - Menu items in edit dropdown
- [Tooltip](../tooltip/README.md) - Role tooltips
- [IconButton](../icon-button/README.md) - Edit button
