# Common Icons Style

Styled-components CSS helper for standardizing icon sizing and styling across the UI Kit.

## Installation

```typescript
import commonIconsStyles, {
  IconSizeType,
  isIconSizeType,
} from "@docspace/ui-kit/utils/common-icons-style";
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

### `commonIconsStyles`

A styled-components CSS helper that applies standard icon styles.

**Type:** `css<{ size?: IconSizeType | number }>`

**Applied Styles:**
- `overflow: hidden` - Prevents icon overflow
- `vertical-align: middle` - Aligns icons with text
- Dynamic width/height based on size prop
- `min-width` and `min-height` to prevent icon collapse

**Example:**

```typescript
import styled from "styled-components";
import commonIconsStyles, { IconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

const Icon = styled.svg<{ size?: IconSizeType | number }>`
  ${commonIconsStyles}
`;

// Usage
<Icon size={IconSizeType.medium} />
```

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

### Basic Icon Component

```typescript
import styled from "styled-components";
import commonIconsStyles, { IconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

const StyledIcon = styled.svg<{ size?: IconSizeType | number }>`
  ${commonIconsStyles}
  fill: currentColor;
`;

function MyIcon({ size = IconSizeType.medium }: { size?: IconSizeType }) {
  return (
    <StyledIcon size={size} viewBox="0 0 24 24">
      <path d="M12 2L2 7v10l10 5 10-5V7z" />
    </StyledIcon>
  );
}

// Usage
<MyIcon size={IconSizeType.big} />
```

### Custom Size

```typescript
const CustomIcon = styled.svg<{ size?: IconSizeType | number }>`
  ${commonIconsStyles}
`;

// Use preset size
<CustomIcon size={IconSizeType.medium} />

// Use custom pixel value
<CustomIcon size={32} />
<CustomIcon size={48} />
```

### Responsive Icon (Scale)

```typescript
const ResponsiveIcon = styled.svg<{ size?: IconSizeType | number }>`
  ${commonIconsStyles}
`;

// Icon fills 100% of container
<div style={{ width: "50px", height: "50px" }}>
  <ResponsiveIcon size={IconSizeType.scale} viewBox="0 0 24 24">
    <path d="..." />
  </ResponsiveIcon>
</div>
```

### Icon Button

```typescript
import styled from "styled-components";
import commonIconsStyles, { IconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

const IconButton = styled.button`
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const ButtonIcon = styled.svg<{ size?: IconSizeType | number }>`
  ${commonIconsStyles}
  fill: currentColor;
`;

function IconActionButton() {
  return (
    <IconButton>
      <ButtonIcon size={IconSizeType.medium} viewBox="0 0 24 24">
        <path d="M19 13H5v-2h14v2z" />
      </ButtonIcon>
    </IconButton>
  );
}
```

### Icon with Text

```typescript
import styled from "styled-components";
import commonIconsStyles, { IconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Icon = styled.svg<{ size?: IconSizeType | number }>`
  ${commonIconsStyles}
  fill: #4781D1;
`;

function IconWithLabel() {
  return (
    <Container>
      <Icon size={IconSizeType.small} viewBox="0 0 24 24">
        <path d="M12 2L2 7v10l10 5 10-5V7z" />
      </Icon>
      <span>Label Text</span>
    </Container>
  );
}
```

### Dynamic Icon Size

```typescript
import { IconSizeType, isIconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

interface IconProps {
  size?: IconSizeType | number;
}

function DynamicIcon({ size = IconSizeType.medium }: IconProps) {
  // Validate size if from untrusted source
  const validSize = isIconSizeType(size) ? size : IconSizeType.medium;

  return <StyledIcon size={validSize} viewBox="0 0 24 24">...</StyledIcon>;
}
```

### Icon Grid with Different Sizes

```typescript
import styled from "styled-components";
import commonIconsStyles, { IconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 16px;
  align-items: center;
  justify-content: start;
`;

const Icon = styled.svg<{ size?: IconSizeType | number }>`
  ${commonIconsStyles}
  fill: #333;
`;

function IconSizeDemo() {
  return (
    <Grid>
      <Icon size={IconSizeType.extraSmall} viewBox="0 0 24 24">...</Icon>
      <Icon size={IconSizeType.small} viewBox="0 0 24 24">...</Icon>
      <Icon size={IconSizeType.medium} viewBox="0 0 24 24">...</Icon>
      <Icon size={IconSizeType.big} viewBox="0 0 24 24">...</Icon>
    </Grid>
  );
}
```

### Themed Icon

```typescript
import styled from "styled-components";
import commonIconsStyles, { IconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

const ThemedIcon = styled.svg<{
  size?: IconSizeType | number;
  color?: string;
}>`
  ${commonIconsStyles}
  fill: ${(props) => props.color || props.theme.iconColor || "#000"};
  transition: fill 0.2s ease;

  &:hover {
    fill: ${(props) => props.theme.iconHoverColor || "#333"};
  }
`;

// Usage with theme
<ThemedIcon size={IconSizeType.medium} color="#4781D1" viewBox="0 0 24 24">
  <path d="..." />
</ThemedIcon>
```

### Icon with Fallback Size

```typescript
import { IconSizeType, isIconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

interface IconComponentProps {
  size?: string | number;
}

function IconComponent({ size }: IconComponentProps) {
  // Convert string size to IconSizeType or use default
  const iconSize = isIconSizeType(size)
    ? size
    : typeof size === "number"
      ? size
      : IconSizeType.medium;

  return <StyledIcon size={iconSize} viewBox="0 0 24 24">...</StyledIcon>;
}
```

### List Item Icon

```typescript
import styled from "styled-components";
import commonIconsStyles, { IconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
`;

const ItemIcon = styled.svg<{ size?: IconSizeType | number }>`
  ${commonIconsStyles}
  fill: #666;
  flex-shrink: 0; // Prevent icon from shrinking
`;

function MenuItem({ children }: { children: React.ReactNode }) {
  return (
    <ListItem>
      <ItemIcon size={IconSizeType.medium} viewBox="0 0 24 24">
        <path d="..." />
      </ItemIcon>
      {children}
    </ListItem>
  );
}
```

### Avatar with Icon Badge

```typescript
import styled from "styled-components";
import commonIconsStyles, { IconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

const AvatarContainer = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
`;

const Badge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #2DB482;
  border-radius: 50%;
  padding: 4px;
  border: 2px solid white;
`;

const BadgeIcon = styled.svg<{ size?: IconSizeType | number }>`
  ${commonIconsStyles}
  fill: white;
  display: block;
`;

function AvatarWithBadge() {
  return (
    <AvatarContainer>
      <img src="avatar.jpg" alt="User" />
      <Badge>
        <BadgeIcon size={IconSizeType.extraSmall} viewBox="0 0 24 24">
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
        </BadgeIcon>
      </Badge>
    </AvatarContainer>
  );
}
```

## CSS Output

### For Named Sizes

```css
/* IconSizeType.small (12px) */
overflow: hidden;
vertical-align: middle;
width: 12px;
min-width: 12px;
height: 12px;
min-height: 12px;
```

### For Scale Size

```css
/* IconSizeType.scale */
overflow: hidden;
vertical-align: middle;

&:not(:root) {
  width: 100%;
  height: 100%;
}
```

### For Custom Numeric Size

```css
/* size={32} */
overflow: hidden;
vertical-align: middle;
width: 32px;
min-width: 32px;
height: 32px;
min-height: 32px;
```

## Best Practices

1. **Use Named Sizes** - Prefer `IconSizeType` enum values over custom numbers for consistency
2. **Scale for Containers** - Use `IconSizeType.scale` when icon should fill a container
3. **Consistent Usage** - Use the same size for icons with similar purposes
4. **Accessibility** - Ensure icons have proper ARIA labels or are decorative
5. **Color Inheritance** - Use `fill: currentColor` to inherit text color
6. **SVG viewBox** - Always include a `viewBox` attribute on SVG elements

## Common Patterns

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

### Responsive Icon Sizing

```typescript
import { mobile, tablet, desktop } from "@docspace/ui-kit/utils/device";

const ResponsiveIcon = styled.svg<{ size?: IconSizeType | number }>`
  ${commonIconsStyles}

  @media ${mobile} {
    /* Override size for mobile */
  }
`;
```

## TypeScript Support

The utility is fully typed with TypeScript:

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

## Related

- [Styled Components CSS Helper](https://styled-components.com/docs/api#css)
- [SVG Accessibility](https://www.w3.org/WAI/tutorials/images/decorative/)
- [Icon Button Best Practices](https://www.sarasoueidan.com/blog/accessible-icon-buttons/)

## Migration Guide

If you're migrating from inline styles:

```typescript
// Before
<svg width="16" height="16" style={{ overflow: 'hidden' }}>...</svg>

// After
import commonIconsStyles, { IconSizeType } from "@docspace/ui-kit/utils/common-icons-style";

const Icon = styled.svg<{ size?: IconSizeType | number }>`
  ${commonIconsStyles}
`;

<Icon size={IconSizeType.medium}>...</Icon>
```

## Testing

The utility includes comprehensive tests covering:
- All IconSizeType enum values
- Custom numeric sizes
- Type guard function
- CSS output for each size
- Edge cases (0, very large numbers)
- Integration with styled-components

Run tests:
```bash
pnpm test common-icons-style
```
