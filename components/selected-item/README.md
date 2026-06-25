# SelectedItem

### Usage

```js
import { SelectedItem } from "@docspace/ui-kit/components/selected-item";
```

```jsx
<SelectedItem
  label="sample text"
  onClose={() => console.log("onClose")}
  propKey="item-1"
/>
```

### Properties

| Props          |      Type      | Required | Values | Default | Description                                           |
| -------------- | :------------: | :------: | :----: | :-----: | ----------------------------------------------------- |
| `className`    |    `string`    |    -     |   -    |    -    | Accepts class                                         |
| `id`           |    `string`    |    -     |   -    |    -    | Accepts id                                            |
| `isDisabled`   |     `bool`     |    -     |   -    | `false` | Tells when the button should present a disabled state |
| `isInline`     |     `bool`     |    -     |   -    | `true`  | Sets the 'display: inline-block' property             |
| `label`        |    `string`    |    ✓     |   -    |    -    | Selected item text                                    |
| `onClose`      |     `func`     |    ✓     |   -    |    -    | What the selected item will trigger when clicked      |
| `propKey`      |    `string`    |    ✓     |   -    |    -    | Unique key for the selected item                      |
| `style`        | `obj`, `array` |    -     |   -    |    -    | Accepts css style                                     |
| `forwardedRef` |     `obj`      |    -     |   -    |    -    | Passes ref to component                               |
