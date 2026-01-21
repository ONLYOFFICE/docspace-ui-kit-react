# Text Component

A flexible and customizable text component for rendering text content with various styling options.

## Installation

```js
import { Text } from "@docspace/ui-kit";
```

## Basic Usage

```jsx
<Text as="p" title="Some title">
  Some text
</Text>
```

## Styling Override

To override styles, use styled-components with forwardedAs prop:

```js
const StyledText = styled(Text)`
  &:hover {
    border-bottom: 1px dotted;
  }
`;

<StyledText forwardedAs="span" title="Some title">
  Some text
</StyledText>;
```

## Component Properties

| Props             |              Type               | Required | Default | Description                                           |
| ----------------- | :-----------------------------: | :------: | :-----: | ----------------------------------------------------- |
| `as`              |       `React.ElementType`       |    -     |   `p`   | HTML element type to render (`p`, `span`, `h1`, etc.) |
| `tag`             |            `string`             |    -     |    -    | Alternative to `as` prop for element type             |
| `backgroundColor` |            `string`             |    -     |    -    | Background color of the text element                  |
| `color`           |            `string`             |    -     |    -    | Text color                                            |
| `display`         |            `string`             |    -     |    -    | CSS display property                                  |
| `fontSize`        |            `string`             |    -     | `13px`  | Font size                                             |
| `fontWeight`      |       `number \| string`        |    -     |  `400`  | Font weight                                           |
| `isBold`          |            `boolean`            |    -     | `false` | Sets font weight to `700` when true                   |
| `isInline`        |            `boolean`            |    -     | `false` | Sets display to `inline-block` when true              |
| `isItalic`        |            `boolean`            |    -     | `false` | Sets font style to italic                             |
| `lineHeight`      |            `string`             |    -     |    -    | Line height                                           |
| `noSelect`        |            `boolean`            |    -     | `false` | Disables text selection when true                     |
| `textAlign`       |            `string`             |    -     | `left`  | Text alignment (`left`, `center`, `right`, `justify`) |
| `title`           |            `string`             |    -     |    -    | Tooltip text on hover                                 |
| `truncate`        |            `boolean`            |    -     | `false` | Enables text truncation with ellipsis                 |
| `dir`             |   `"ltr" \| "rtl" \| "auto"`    |    -     |    -    | Text direction                                        |
| `className`       |            `string`             |    -     |    -    | Additional CSS class names                            |
| `style`           |      `React.CSSProperties`      |    -     |    -    | Additional inline styles                              |
| `onClick`         | `(e: React.MouseEvent) => void` |    -     |    -    | Click event handler                                   |
| `ref`             |      `React.Ref<HTMLElement>`   |    -     |    -    | Ref to the underlying DOM element                     |
| `view`            |            `string`             |    -     |    -    | View mode (e.g., `"tile"`)                            |
| `dataTestId`      |            `string`             |    -     | `text`  | Test ID for testing purposes                          |

## Examples

### Default Text

```jsx
<Text>Default text with standard styling</Text>
```

### Heading Text

```jsx
<Text as="h1" fontSize="24px" fontWeight="700">
  Heading Text
</Text>
```

### Inline Text

```jsx
<>
  <Text isInline>First inline text</Text>{" "}
  <Text isInline>Second inline text</Text>
</>
```

### Styled Text

```jsx
<Text
  fontSize="16px"
  fontWeight="600"
  color="white"
  backgroundColor="black"
  textAlign="center"
  isBold
  isItalic
  lineHeight="1.5"
>
  Styled text with custom properties
</Text>
```

### Interactive Text

```jsx
<Text
  isInline
  onClick={() => console.log("clicked")}
  style={{ cursor: "pointer" }}
>
  Click me!
</Text>
```

### Non-Selectable Text

```jsx
<Text noSelect>This text cannot be selected</Text>
```

### Truncated Text

```jsx
<div style={{ width: 200 }}>
  <Text truncate>
    This is a very long text that will be truncated when it exceeds the
    container width
  </Text>
</div>
```

### RTL Direction

```jsx
<Text dir="rtl" textAlign="right">
  مرحبا بالعالم - Hello World
</Text>
```

### Auto Direction

```jsx
<Text dir="auto">English text with auto direction</Text>
<Text dir="auto">نص عربي مع اتجاه تلقائي</Text>
```

### Font Sizes

```jsx
<Text fontSize="10px">Extra small text</Text>
<Text fontSize="13px">Default text</Text>
<Text fontSize="16px">Large text</Text>
<Text fontSize="24px">Display text</Text>
```

### Font Weights

```jsx
<Text fontWeight="300">Light</Text>
<Text fontWeight="400">Regular</Text>
<Text fontWeight="600">Semibold</Text>
<Text fontWeight="700">Bold</Text>
```

### All Headings

```jsx
<Text as="h1" fontSize="32px" fontWeight="700">Heading 1</Text>
<Text as="h2" fontSize="28px" fontWeight="700">Heading 2</Text>
<Text as="h3" fontSize="24px" fontWeight="600">Heading 3</Text>
<Text as="h4" fontSize="20px" fontWeight="600">Heading 4</Text>
<Text as="h5" fontSize="16px" fontWeight="600">Heading 5</Text>
<Text as="h6" fontSize="14px" fontWeight="600">Heading 6</Text>
```

### Text Alignment

```jsx
<Text textAlign="left">Left aligned</Text>
<Text textAlign="center">Center aligned</Text>
<Text textAlign="right">Right aligned</Text>
<Text textAlign="justify">Justified text</Text>
```

### With Tooltip

```jsx
<Text title="This tooltip appears on hover">Hover over this text</Text>
```

## Accessibility

The Text component supports:

- Custom HTML elements via `as` prop for semantic markup
- Text direction control via `dir` prop
- ARIA attributes through props spreading
- Keyboard interaction for clickable text

## Browser Support

The Text component is compatible with all modern browsers and includes:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

For bug reports and feature requests, please create an issue in the repository.
