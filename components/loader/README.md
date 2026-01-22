# Loader

Loader component is used for displaying loading states and animations in the application. It supports multiple types of loaders and can be customized with different sizes, colors, and themes.

### Usage

```js
import { Loader, LoaderTypes } from "@docspace/ui-kit/components/loader";
```

```jsx
// Basic usage
<Loader type={LoaderTypes.base} size="18px" label="Loading..." />

// With custom color
<Loader
  type={LoaderTypes.dualRing}
  color="#2196F3"
  size="40px"
  label="Loading content..."
/>

// Track loader
<Loader
  type={LoaderTypes.track}
  size="30px"
  label="Processing..."
/>
```

### Properties

| Props       |         Type          | Required |                    Values                     | Default | Description                         |
| ----------- | :-------------------: | :------: | :-------------------------------------------: | :-----: | ----------------------------------- |
| `type`      |     `LoaderTypes`     |    -     | `base`, `oval`, `dualRing`, `rombs`, `track`  | `base`  | Type of loader animation            |
| `size`      |       `string`        |    -     |            Any valid CSS size unit            | `40px`  | Size of the loader                  |
| `color`     |       `string`        |    -     |              Any valid CSS color              |    -    | Custom color for the loader         |
| `label`     |       `string`        |    -     |                       -                       |    -    | Accessible label for screen readers |
| `className` |       `string`        |    -     |                       -                       |    -    | Custom CSS class                    |
| `id`        |       `string`        |    -     |                       -                       |    -    | Unique identifier                   |
| `style`     | `React.CSSProperties` |    -     |                       -                       |    -    | Additional inline styles            |

### Loader Types

- **base**: Text-based loading indicator
- **oval**: Oval-shaped loading animation
- **dualRing**: Two concentric rotating rings
- **rombs**: Diamond-shaped loading animation
- **track**: Circular track with rotating segment

### Accessibility

- Each loader includes an `aria-busy` attribute
- SVG loaders include a `<title>` element for screen readers
- The label prop can be used to provide descriptive text for the loading state

### Examples

```jsx
// Different types of loaders
<div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
  <Loader type={LoaderTypes.oval} size="30px" />
  <Loader type={LoaderTypes.dualRing} size="40px" />
  <Loader type={LoaderTypes.rombs} size="65px" />
  <Loader type={LoaderTypes.track} size="25px" />
</div>

// With different colors
<div style={{ display: "flex", gap: "20px" }}>
  <Loader type={LoaderTypes.dualRing} color="#2196F3" size="40px" />
  <Loader type={LoaderTypes.dualRing} color="#4CAF50" size="40px" />
  <Loader type={LoaderTypes.dualRing} color="#FFC107" size="40px" />
</div>
```
