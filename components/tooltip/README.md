# Tooltip

A customizable tooltip component built on top of [react-tooltip](https://react-tooltip.com/).

## Usage

```js
import { Tooltip, TooltipContainer, withTooltip } from "@docspace/ui-kit/components/tooltip";
```

### Basic Usage

```jsx
<div
  data-tooltip-id="my-tooltip"
  data-tooltip-content="Hello, I'm a tooltip!"
>
  Hover me
</div>
<Tooltip id="my-tooltip" />
```

### With TooltipContainer

`TooltipContainer` is a polymorphic component that automatically handles tooltip events.

```jsx
<TooltipContainer title="Tooltip text" as="button">
  Hover me
</TooltipContainer>
```

### With Dynamic Content

```jsx
<div data-tooltip-id="dynamic-tooltip">Hover for dynamic content</div>
<Tooltip
  id="dynamic-tooltip"
  getContent={({ content, activeAnchor }) => (
    <div>
      <Text isBold>Dynamic Content</Text>
      <Text>{content}</Text>
    </div>
  )}
/>
```

### Click to Open

```jsx
<div
  data-tooltip-id="click-tooltip"
  data-tooltip-content="Click-triggered tooltip"
>
  Click me
</div>
<Tooltip id="click-tooltip" openOnClick />
```

### Using withTooltip HOC

The `withTooltip` higher-order component wraps any component to add tooltip functionality.

```jsx
import { withTooltip } from "@docspace/ui-kit/components/tooltip";

const MyButton = React.forwardRef((props, ref) => (
  <button ref={ref} {...props}>
    {props.children}
  </button>
));

const ButtonWithTooltip = withTooltip(MyButton);

// Usage
<ButtonWithTooltip title="Button tooltip">Click me</ButtonWithTooltip>
```

### RootTooltip

For global tooltip support, add `RootTooltip` to your app root.

```jsx
import { RootTooltip } from "@docspace/ui-kit/components/tooltip";

function App() {
  return (
    <>
      <RootTooltip />
      {/* Your app content */}
    </>
  );
}
```

## Tooltip Properties

| Prop                        |        Type         | Required |                                     Values                                      | Default | Description                                              |
| --------------------------- | :-----------------: | :------: | :-----------------------------------------------------------------------------: | :-----: | -------------------------------------------------------- |
| `id`                        |      `string`       |    -     |                                        -                                        |    -    | Unique identifier for the tooltip                        |
| `place`                     |   `TTooltipPlace`   |    -     | `top`, `top-start`, `top-end`, `right`, `right-start`, `right-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end` | `top`   | Tooltip placement                                        |
| `getContent`                |     `function`      |    -     |                                        -                                        |    -    | Function to generate tooltip content dynamically         |
| `afterHide`                 |     `function`      |    -     |                                        -                                        |    -    | Callback after tooltip is hidden                         |
| `afterShow`                 |     `function`      |    -     |                                        -                                        |    -    | Callback after tooltip is shown                          |
| `offset`                    |      `number`       |    -     |                                        -                                        |   `4`   | Distance from anchor element                             |
| `children`                  |    `ReactNode`      |    -     |                                        -                                        |    -    | Static tooltip content                                   |
| `isOpen`                    |      `boolean`      |    -     |                                        -                                        |    -    | Control tooltip visibility programmatically              |
| `clickable`                 |      `boolean`      |    -     |                                        -                                        | `false` | Allow interaction with tooltip content                   |
| `openOnClick`               |      `boolean`      |    -     |                                        -                                        | `false` | Open on click instead of hover                           |
| `float`                     |      `boolean`      |    -     |                                        -                                        | `false` | Follow mouse position                                    |
| `anchorSelect`              |      `string`       |    -     |                                        -                                        |    -    | CSS selector to attach tooltip to multiple elements      |
| `noArrow`                   |      `boolean`      |    -     |                                        -                                        | `true`  | Hide tooltip arrow                                       |
| `opacity`                   |      `number`       |    -     |                                        -                                        |   `1`   | Tooltip opacity                                          |
| `imperativeModeOnly`        |      `boolean`      |    -     |                                        -                                        | `false` | Disable default tooltip behavior, use ref methods only   |
| `delayShow`                 |      `number`       |    -     |                                        -                                        |    -    | Delay before showing tooltip (ms)                        |
| `className`                 |      `string`       |    -     |                                        -                                        |    -    | Additional CSS class                                     |
| `style`                     |  `CSSProperties`    |    -     |                                        -                                        |    -    | Container styles                                         |
| `tooltipStyle`              |  `CSSProperties`    |    -     |                                        -                                        |    -    | Tooltip element styles                                   |
| `color`                     |      `string`       |    -     |                                        -                                        |    -    | Background color of the tooltip                          |
| `maxWidth`                  |      `string`       |    -     |                                        -                                        |    -    | Maximum width of the tooltip                             |
| `fallbackAxisSideDirection` |      `string`       |    -     |                          `none`, `start`, `end`                                 | `none`  | Fallback direction when preferred placement unavailable  |
| `noUserSelect`              |      `boolean`      |    -     |                                        -                                        | `false` | Disable text selection in tooltip                        |
| `zIndex`                    |      `number`       |    -     |                                        -                                        |    -    | CSS z-index value                                        |
| `dataTestId`                |      `string`       |    -     |                                        -                                        |    -    | Data attribute for testing                               |

## Anchor Element Data Attributes

| Attribute               |   Type   | Required | Description                          |
| ----------------------- | :------: | :------: | ------------------------------------ |
| `data-tooltip-id`       | `string` |    -     | Links element to tooltip by id       |
| `data-tooltip-content`  | `string` |    -     | Tooltip text content                 |
| `data-tooltip-place`    | `string` |    -     | Override tooltip placement           |
| `data-tooltip-offset`   | `number` |    -     | Override tooltip offset              |

## TooltipContainer Properties

| Prop       |     Type     | Required | Default | Description                           |
| ---------- | :----------: | :------: | :-----: | ------------------------------------- |
| `as`       |   `string`   |    -     | `div`   | HTML element to render                |
| `title`    |   `string`   |    -     |    -    | Tooltip content                       |
| `children` | `ReactNode`  |    -     |    -    | Container content                     |

Supports all HTML attributes for the rendered element.

## withTooltip HOC Props

Components wrapped with `withTooltip` receive these additional props:

| Prop                  |      Type       | Description                    |
| --------------------- | :-------------: | ------------------------------ |
| `title`               |    `string`     | Tooltip content                |
| `tooltipContent`      |  `ReactNode`    | Alternative to title           |
| `tooltipPlace`        | `TTooltipPlace` | Tooltip placement              |
| `tooltipFitToContent` |    `boolean`    | Fit tooltip width to content   |

## Types

```typescript
import type {
  TooltipProps,
  TTooltipPlace,
  TFallbackAxisSideDirection,
  TGetTooltipContent,
  WithTooltipProps,
} from "@docspace/ui-kit/components/tooltip";
```
