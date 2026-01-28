# getTextColor

Utility function that determines the optimal text color (black or white) for a given background color based on perceived brightness.

## Usage

```ts
import { getTextColor } from "@docspace/ui-kit/utils/get-text-color";

// Returns "#333333" (black) for light backgrounds
const textOnWhite = getTextColor("#ffffff");

// Returns "#ffffff" (white) for dark backgrounds
const textOnBlack = getTextColor("#000000");

// Custom brightness threshold
const textColor = getTextColor("#888888", 100);
```

## API

```ts
getTextColor(color: string, brightnessDiff?: number): string
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `string` | - | Hex color string (e.g., `"#ffffff"`) |
| `brightnessDiff` | `number` | `128` | Brightness threshold (0-255) |

### Returns

Returns a hex color string:
- `"#333333"` (black) - for light backgrounds
- `"#ffffff"` (white) - for dark backgrounds

## How It Works

The function calculates perceived brightness using the luminosity formula:

```
brightness = (R * 299 + G * 587 + B * 114) / 1000
```

This formula weights RGB values based on human perception:
- Green contributes most (58.7%)
- Red contributes second (29.9%)
- Blue contributes least (11.4%)

If the calculated brightness exceeds the threshold, black text is returned; otherwise, white text is returned.

## Examples

### Dynamic Badge Text

```tsx
const Badge = ({ backgroundColor, label }) => {
  const textColor = getTextColor(backgroundColor);

  return (
    <span style={{ backgroundColor, color: textColor }}>
      {label}
    </span>
  );
};
```

### Room Icon Text

```tsx
const RoomIcon = ({ color, title }) => {
  const textColor = getTextColor(color);

  return (
    <div style={{ backgroundColor: color }}>
      <span style={{ color: textColor }}>{title}</span>
    </div>
  );
};
```

### Custom Threshold

```tsx
// More aggressive - prefer white text
const preferWhite = getTextColor("#808080", 180);

// More aggressive - prefer black text
const preferBlack = getTextColor("#808080", 80);
```
