# AddButton

Button component for adding items with optional label, loading state, and accent styling.

## Usage

```tsx
import { AddButton } from "@docspace/ui-kit/components/add-button";

<AddButton title="Add item" onClick={() => console.log("clicked")} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Tooltip text |
| `label` | `string` | - | Text label next to the button |
| `onClick` | `(e: MouseEvent) => void` | - | Click handler |
| `isDisabled` | `boolean` | `false` | Disabled state |
| `isAction` | `boolean` | `false` | Use accent colors |
| `isLoading` | `boolean` | `false` | Show loading spinner |
| `iconName` | `string` | - | Custom icon URL |
| `iconSize` | `number` | `12` | Icon size in pixels |
| `size` | `string` | - | Button container size |
| `fontSize` | `string` | `"13px"` | Label font size |
| `lineHeight` | `string` | `"20px"` | Label line height |
| `truncate` | `boolean` | `false` | Truncate label text |
| `noSelect` | `boolean` | `false` | Disable text selection |
| `dir` | `"ltr" \| "rtl" \| "auto"` | - | Text direction |
| `className` | `string` | - | Additional CSS class |
| `id` | `string` | - | HTML id attribute |
| `style` | `CSSProperties` | - | Inline styles |
| `testId` | `string` | `"selector-add-button"` | Test id |

## CSS Variables

The component uses CSS variables for theming, defined locally within the component:

### Container (`.container`)

| Variable | Light | Dark | Description |
|----------|-------|------|-------------|
| `--selector-add-button-text-disabled` | `#d0d5da` | `#5c5c5c` | Disabled label color |

### Button (`.selectorButton`)

| Variable | Light | Dark | Description |
|----------|-------|------|-------------|
| `--selector-add-button-background` | `#eceef1` | `#242424` | Background color |
| `--selector-add-button-hover-background` | `#dfe2e3` | `#474747` | Hover background |
| `--selector-add-button-active-background` | `#d0d5da` | `#242424` | Active background |
| `--selector-add-button-disabled-background` | `#f3f4f4` | `#3d3d3d` | Disabled background |
| `--selector-add-button-icon-color` | `#657077` | `#adadad` | Icon color |
| `--selector-add-button-icon-color-hover` | `#657077` | `#ffffff` | Icon hover color |
| `--selector-add-button-icon-color-active` | `#657077` | `#cccccc` | Icon active color |
| `--selector-add-button-icon-color-disabled` | `#a3a9ae` | `#858585` | Icon disabled color |
| `--selector-add-button-border` | `none` | `none` | Border style |
| `--selector-add-button-border-radius` | `3px` | `3px` | Border radius |
| `--selector-add-button-height` | `32px` | `32px` | Button height |
| `--selector-add-button-width` | `32px` | `32px` | Button width |
| `--selector-add-button-padding` | `10px` | `10px` | Button padding |

## Examples

### With Label

```tsx
<AddButton title="Add new user" label="Add user" onClick={handleAddUser} />
```

### Disabled

```tsx
<AddButton title="Add item" isDisabled onClick={handleClick} />
```

### Accent Style

```tsx
<AddButton title="Create new" isAction onClick={handleCreate} />
```

### Loading State

```tsx
<AddButton title="Adding..." isLoading onClick={handleClick} />
```

### Custom Icon

```tsx
<AddButton
  title="Upload file"
  iconName="/icons/upload.svg"
  iconSize={16}
  onClick={handleUpload}
/>
```
