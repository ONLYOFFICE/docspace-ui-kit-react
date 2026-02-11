# LoadingButton

A circular progress button that displays upload/conversion progress as an animated ring. Includes a close icon that can be clicked to cancel the operation.

## Usage

```tsx
import { LoadingButton } from "@docspace/ui-kit/components/loading-button";

<LoadingButton
  percent={45}
  onClick={handleCancel}
/>
```

## Features

- **Circular progress**: Animated ring that fills based on the `percent` value
- **Entry animation**: Plays a brief animation on mount (auto-stops after 5 seconds)
- **Conversion mode**: Hides the close icon when `inConversion` is true
- **Customizable colors**: Override loader and background colors via props
- **Default mode**: Alternative styling via `isDefaultMode`

## Properties

| Prop              | Type                          | Default | Description                                        |
|-------------------|-------------------------------|---------|----------------------------------------------------|
| `percent`         | `number`                      | `0`     | Progress value from 0 to 100                       |
| `onClick`         | `() => void`                  | —       | Click handler (typically used to cancel)           |
| `inConversion`    | `boolean`                     | `false` | Hides the close icon during file conversion        |
| `loaderColor`     | `string`                      | —       | Custom color for the progress ring                 |
| `backgroundColor` | `string`                      | —       | Custom background color for the inner circle       |
| `isDefaultMode`   | `boolean`                     | —       | Applies default mode styling                       |
| `id`              | `string`                      | —       | HTML id attribute                                  |
| `className`       | `string`                      | —       | Additional CSS class name                          |
| `style`           | `React.CSSProperties`         | —       | Custom inline styles                               |

## Examples

### Upload Progress

```tsx
<LoadingButton percent={75} onClick={cancelUpload} />
```

### Conversion in Progress

```tsx
<LoadingButton percent={30} inConversion />
```

### Custom Colors

```tsx
<LoadingButton
  percent={50}
  loaderColor="#4CAF50"
  backgroundColor="#E8F5E9"
  onClick={handleCancel}
/>
```
