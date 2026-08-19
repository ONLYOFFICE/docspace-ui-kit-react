# Common Icons Style

Utilities for standardizing icon sizing across the UI Kit.

## Installation

```typescript
import { IconSizeType, isIconSizeType } from "@docspace/ui-kit/utils/common-icons-style";
```

## IconSizeType Enum

Predefined icon sizes for consistent sizing across the application.

```typescript
enum IconSizeType {
  extraSmall = "extraSmall", // 8px
  small = "small",           // 12px
  medium = "medium",         // 16px
  big = "big",               // 24px
  scale = "scale",           // 100% of container
}
```

### Size Mapping

| Size Type | Pixel Value | Use Case |
|-----------|-------------|----------|
| `extraSmall` | 8px | Tiny indicators, badges |
| `small` | 12px | Compact UI, inline icons |
| `medium` | 16px | Default icon size, most common |
| `big` | 24px | Large buttons, emphasis |
| `scale` | 100% | Responsive icons that fill container |

## API

### `isIconSizeType(value)`

Type guard function to check if a value is a valid IconSizeType.

**Parameters:**
- `value` (unknown) - Value to check

**Returns:** `boolean` - `true` if value is a valid IconSizeType

**Example:**

```typescript
import { isIconSizeType, IconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

const size = "medium";
if (isIconSizeType(size)) {
  // TypeScript knows size is IconSizeType here
  const iconSize: IconSizeType = size;
}

isIconSizeType("medium");  // true
isIconSizeType("large");   // false
isIconSizeType(16);        // false
```

## Usage Examples

### Dynamic Icon Size

```typescript
import { IconSizeType, isIconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

interface IconProps {
  size?: IconSizeType | number;
}

function DynamicIcon({ size = IconSizeType.medium }: IconProps) {
  const validSize = isIconSizeType(size) ? size : IconSizeType.medium;
  return <StyledIcon size={validSize} viewBox="0 0 24 24">...</StyledIcon>;
}
```

### Icon with Fallback Size

```typescript
import { IconSizeType, isIconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

interface IconComponentProps {
  size?: string | number;
}

function IconComponent({ size }: IconComponentProps) {
  const iconSize = isIconSizeType(size)
    ? size
    : typeof size === "number"
      ? size
      : IconSizeType.medium;

  return <StyledIcon size={iconSize} viewBox="0 0 24 24">...</StyledIcon>;
}
```

### Icon Size by Context

```typescript
// Inline with text - use small
<Icon size={IconSizeType.small} />

// Default UI elements - use medium
<Icon size={IconSizeType.medium} />

// Prominent actions - use big
<Icon size={IconSizeType.big} />

// Badges/indicators - use extraSmall
<Icon size={IconSizeType.extraSmall} />

// Flexible containers - use scale
<Icon size={IconSizeType.scale} />
```

## TypeScript Support

```typescript
// Type for size prop
type IconSize = IconSizeType | number;

// Type guard for runtime validation
const isIconSizeType: (size: unknown) => size is IconSizeType;

// Component props
interface IconProps {
  size?: IconSizeType | number;
}
```

## Testing

Run tests:
```bash
pnpm test common-icons-style
```
