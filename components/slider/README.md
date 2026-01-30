# Slider

A customizable range slider component that supports RTL direction, custom styling, and visual track filling.

## Usage

```jsx
import { Slider } from "@docspace/ui-kit/components/slider";

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

| Name               | Type                                       | Default   | Description                                      |
|--------------------|--------------------------------------------|-----------|--------------------------------------------------|
| id                 | string                                     | -         | Element ID                                       |
| className          | string                                     | -         | CSS class name                                   |
| style              | CSSProperties                              | -         | Inline styles                                    |
| min                | number                                     | required  | Minimum range value                              |
| max                | number                                     | required  | Maximum range value                              |
| value              | number                                     | required  | Current slider value                             |
| step               | number                                     | -         | Increment/decrement step size                    |
| onChange           | (e: ChangeEvent<HTMLInputElement>) => void | -         | Change event handler                             |
| isDisabled         | boolean                                    | false     | Disabled state                                   |
| withPouring        | boolean                                    | -         | Fills the track background up to current value  |
| thumbWidth         | string                                     | -         | Custom thumb width (e.g., "24px")                |
| thumbHeight        | string                                     | -         | Custom thumb height (e.g., "24px")               |
| thumbBorderWidth   | string                                     | -         | Custom thumb border width                        |
| runnableTrackHeight| string                                     | -         | Custom track height (e.g., "8px")                |
| dataTestId         | string                                     | "slider"  | Test ID for the component                        |

## Styling

The component uses CSS modules with CSS variables for theming. Key variables include:

```css
--thumb-width
--thumb-height
--thumb-border-width
--runnable-track-height
--size-prop
```

## Examples

### Basic Usage
```jsx
<Slider min={0} max={100} value={50} />
```

### With Track Filling
```jsx
<Slider
  min={0}
  max={100}
  value={50}
  withPouring
/>
```

### Custom Step Size
```jsx
<Slider
  min={0}
  max={10}
  step={5}
  value={5}
/>
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
<Slider
  min={0}
  max={100}
  value={50}
  isDisabled
/>
```

### RTL Support
```jsx
<div dir="rtl">
  <Slider
    min={0}
    max={100}
    value={50}
    withPouring
  />
</div>
```
