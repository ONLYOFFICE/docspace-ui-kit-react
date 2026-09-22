# Slider

A customizable range slider component that supports RTL direction, custom styling, and visual track filling.

## Usage

```jsx
import { Slider } from "@onlyoffice/apps-ui-kit/components/slider";

const MyComponent = () => {
  const [value, setValue] = React.useState(50);

  const handleChange = (e) => {
    setValue(parseFloat(e.target.value));
  };

  return (
    <Slider
      min={0}
      max={100}
      value={value}
      onChange={handleChange}
      withPouring
    />
  );
};
```

## Properties

| Name                | Type                                       | Default  | Description                                    |
| ------------------- | ------------------------------------------ | -------- | ---------------------------------------------- |
| id                  | string                                     | -        | Element ID                                     |
| className           | string                                     | -        | CSS class name                                 |
| style               | CSSProperties                              | -        | Inline styles                                  |
| min                 | number                                     | required | Minimum range value                            |
| max                 | number                                     | required | Maximum range value                            |
| value               | number                                     | required | Current slider value                           |
| step                | number                                     | -        | Increment/decrement step size                  |
| onChange            | (e: ChangeEvent<HTMLInputElement>) => void | -        | Change event handler                           |
| isDisabled          | boolean                                    | false    | Disabled state                                 |
| withPouring         | boolean                                    | -        | Fills the track background up to current value |
| thumbWidth          | string                                     | -        | Custom thumb width (e.g., "24px")              |
| thumbHeight         | string                                     | -        | Custom thumb height (e.g., "24px")             |
| thumbBorderWidth    | string                                     | -        | Custom thumb border width                      |
| runnableTrackHeight | string                                     | -        | Custom track height (e.g., "8px")              |
| dataTestId          | string                                     | "slider" | Test ID for the component                      |

## Styling

The component is a CSS module themed with CSS custom properties. Set any of these on
an ancestor element to override the defaults:

| Variable                    | Description                                                        | Default     |
| --------------------------- | ------------------------------------------------------------------ | ----------- |
| `--slider-handle-color`     | Thumb background color                                             | theme token |
| `--slider-pouring-image`    | Fill image for the poured portion, applied only with `withPouring` | theme token |
| `--slider-background-color` | Track (unfilled) background color                                  | theme token |
| `--slider-size`             | Track height                                                       | `8px`       |
| `--slider-handle-size`      | Thumb width and height                                             | `24px`      |
| `--slider-track-radius`     | Border radius of the track; the thumb keeps a fixed radius         | `5.6px`     |

The `thumbWidth`, `thumbHeight`, `thumbBorderWidth` and `runnableTrackHeight` props write
`--thumb-width`, `--thumb-height`, `--thumb-border-width` and `--runnable-track-height`
inline on the input, and take precedence over the variables above.

## Examples

### Basic Usage

```jsx
<Slider min={0} max={100} value={50} />
```

### With Track Filling

```jsx
<Slider min={0} max={100} value={50} withPouring />
```

### Custom Step Size

```jsx
<Slider min={0} max={10} step={5} value={5} />
```

### Custom Thumb and Track Size

```jsx
<Slider
  min={0}
  max={100}
  value={50}
  thumbWidth="24px"
  thumbHeight="24px"
  thumbBorderWidth="2px"
  runnableTrackHeight="8px"
/>
```

### Disabled State

```jsx
<Slider min={0} max={100} value={50} isDisabled />
```

### RTL Support

```jsx
<div dir="rtl">
  <Slider min={0} max={100} value={50} withPouring />
</div>
```
