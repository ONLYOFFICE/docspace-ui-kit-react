# RectangleSkeleton

Rectangular skeleton loader component for displaying loading placeholders. Ideal for text, buttons, cards, and content block placeholders.

## Usage

```tsx
import { RectangleSkeleton } from "@docspace/ui-kit/components/rectangle";

<RectangleSkeleton />

<RectangleSkeleton width="200px" height="20px" borderRadius="4" />

<RectangleSkeleton
  title="Loading content..."
  backgroundColor="#e0e0e0"
  foregroundColor="#f5f5f5"
  speed={1.5}
/>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `""` | Accessible title for screen readers |
| `x` | `string` | `"0"` | X position of rectangle |
| `y` | `string` | `"0"` | Y position of rectangle |
| `width` | `string` | `"100%"` | Rectangle and SVG container width |
| `height` | `string` | `"32px"` | Rectangle and SVG container height |
| `borderRadius` | `string` | `"3"` | Corner radius (rx and ry) |
| `backgroundColor` | `string` | `globalColors.darkBlack` | Background color of the skeleton |
| `foregroundColor` | `string` | `globalColors.darkBlack` | Foreground (animated) color |
| `backgroundOpacity` | `number` | `0.1` | Opacity of background |
| `foregroundOpacity` | `number` | `0.15` | Opacity of foreground animation |
| `speed` | `number` | `2` | Animation speed in seconds |
| `animate` | `boolean` | `true` | Enable/disable animation |
| `className` | `string` | - | Additional CSS class |
| `style` | `CSSProperties` | - | Inline styles |

## Examples

### Text Line Placeholder

```tsx
<RectangleSkeleton width="100%" height="16px" borderRadius="2" />
```

### Button Placeholder

```tsx
<RectangleSkeleton width="120px" height="40px" borderRadius="8" />
```

### Card Placeholder

```tsx
<RectangleSkeleton width="300px" height="200px" borderRadius="12" />
```

### Multiple Lines

```tsx
<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
  <RectangleSkeleton width="100%" height="16px" />
  <RectangleSkeleton width="80%" height="16px" />
  <RectangleSkeleton width="60%" height="16px" />
</div>
```

### Disabled Animation

```tsx
<RectangleSkeleton animate={false} />
```

### Custom Colors

```tsx
<RectangleSkeleton
  backgroundColor="#f0f0f0"
  foregroundColor="#e0e0e0"
  backgroundOpacity={0.5}
  foregroundOpacity={0.8}
/>
```
