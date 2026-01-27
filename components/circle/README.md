# CircleSkeleton

Circular skeleton loader component for displaying loading placeholders. Ideal for avatar, icon, and circular element placeholders.

## Usage

```tsx
import { CircleSkeleton } from "@docspace/ui-kit/components/circle";

<CircleSkeleton />

<CircleSkeleton radius="24" x="24" y="24" width="48px" height="48px" />

<CircleSkeleton
  title="Loading avatar..."
  backgroundColor="#e0e0e0"
  foregroundColor="#f5f5f5"
  speed={1.5}
/>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `""` | Accessible title for screen readers |
| `x` | `string` | `"3"` | X coordinate of circle center (cx) |
| `y` | `string` | `"12"` | Y coordinate of circle center (cy) |
| `radius` | `string` | `"12"` | Circle radius |
| `width` | `string` | `"100%"` | SVG container width |
| `height` | `string` | `"100%"` | SVG container height |
| `backgroundColor` | `string` | `globalColors.darkBlack` | Background color of the skeleton |
| `foregroundColor` | `string` | `globalColors.darkBlack` | Foreground (animated) color |
| `backgroundOpacity` | `number` | `0.1` | Opacity of background |
| `foregroundOpacity` | `number` | `0.15` | Opacity of foreground animation |
| `speed` | `number` | `2` | Animation speed in seconds |
| `animate` | `boolean` | `true` | Enable/disable animation |
| `className` | `string` | - | Additional CSS class |
| `style` | `CSSProperties` | - | Inline styles |

## Examples

### Avatar Placeholder

```tsx
<CircleSkeleton
  radius="20"
  x="20"
  y="20"
  width="40px"
  height="40px"
/>
```

### Large Profile Picture

```tsx
<CircleSkeleton
  radius="48"
  x="48"
  y="48"
  width="96px"
  height="96px"
/>
```

### Disabled Animation

```tsx
<CircleSkeleton animate={false} />
```

### Custom Colors

```tsx
<CircleSkeleton
  backgroundColor="#f0f0f0"
  foregroundColor="#e0e0e0"
  backgroundOpacity={0.5}
  foregroundOpacity={0.8}
/>
```
