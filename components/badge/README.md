# Badge

A versatile badge component used for displaying notifications, status markers, or interactive elements. Supports accessibility features and various display modes.

## Usage

```jsx
import { Badge } from "@docspace/ui-kit/components/badge";

const MyComponent = () => {
  return (
    <Badge
      label={24}
      onClick={() => console.log("clicked")}
    />
  );
};
```

## Properties

| Name            | Type                          | Default | Description                                           |
|-----------------|-------------------------------|---------|-------------------------------------------------------|
| label           | string \| number              | 0       | Content to display in the badge                       |
| type            | "high"                        | -       | Sets badge type to high priority                      |
| backgroundColor | string                        | -       | Custom background color                               |
| color           | string                        | -       | Custom text color                                     |
| fontSize        | string                        | "11px"  | Custom font size                                      |
| fontWeight      | number                        | 800     | Custom font weight                                    |
| borderRadius    | string                        | "11px"  | Custom border radius                                  |
| padding         | string                        | "0 5px" | Custom padding                                        |
| maxWidth        | string                        | "50px"  | Maximum width of the badge                            |
| height          | string                        | -       | Custom height                                         |
| border          | string                        | -       | Custom border style                                   |
| noHover         | boolean                       | false   | Disables hover effects                                |
| isHovered       | boolean                       | false   | Applies custom hover styles                           |
| isVersionBadge  | boolean                       | false   | Applies version badge specific styling                |
| isPaidBadge     | boolean                       | false   | Applies styling for paid/premium features             |
| isMutedBadge    | boolean                       | false   | Applies muted styling for less prominent display      |
| onClick         | (e: MouseEvent) => void       | -       | Click event handler                                   |
| onMouseOver     | (e: MouseEvent) => void       | -       | Mouse over event handler                              |
| onMouseLeave    | (e: MouseEvent) => void       | -       | Mouse leave event handler                             |
| className       | string                        | -       | CSS class name                                        |
| ref             | RefObject\<HTMLDivElement\>   | -       | Ref to access the DOM element                         |
| dataTestId      | string                        | "badge" | Test ID for the component                             |

## Styling

The component uses CSS modules with CSS variables for theming. Key variables include:

```css
--badge-background-color
--badge-disable-background-color
```

## Examples

### Basic Usage
```jsx
<Badge label={3} />
```

### Text Badge
```jsx
<Badge label="New" />
```

### Interactive Badge
```jsx
<Badge
  label="Click me"
  onClick={() => alert("clicked")}
/>
```

### High Priority Badge
```jsx
<Badge
  type="high"
  label="High"
  backgroundColor="#F21C0D"
/>
```

### Custom Styled Badge
```jsx
<Badge
  label="Custom"
  backgroundColor="#335EA3"
  color="#FFFFFF"
  fontSize="14px"
  fontWeight={600}
  borderRadius="8px"
  padding="4px 12px"
/>
```

### Muted Badge
```jsx
<Badge
  label="Muted"
  isMutedBadge={true}
/>
```

### Static Badge (No Hover)
```jsx
<Badge
  label="Static"
  noHover={true}
/>
```
