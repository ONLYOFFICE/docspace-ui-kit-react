# Checkbox

A customizable checkbox input component with support for checked, indeterminate, disabled, and error states.

### Usage

```js
import { Checkbox } from "@docspace/ui-kit/components/checkbox";
```

Basic usage:

```jsx
<Checkbox
  id="basic-checkbox"
  name="basic"
  value="value"
  label="Basic Checkbox"
  isChecked={false}
  onChange={(e) => console.log(e.target.checked)}
/>
```

With indeterminate state:

```jsx
<Checkbox
  label="Indeterminate Checkbox"
  isIndeterminate
  onChange={handleChange}
/>
```

With error state:

```jsx
<Checkbox
  label="Checkbox with Error"
  hasError
  onChange={handleChange}
/>
```

With help button:

```jsx
<Checkbox
  label="Checkbox with Help"
  helpButton={<InfoIcon />}
  onChange={handleChange}
/>
```

Disabled states:

```jsx
<Checkbox
  label="Disabled Checkbox"
  isDisabled
/>

<Checkbox
  label="Disabled Checked"
  isDisabled
  isChecked
/>

<Checkbox
  label="Disabled Indeterminate"
  isDisabled
  isIndeterminate
/>
```

### Properties

| Props             |              Type              | Required | Default | Description                                                |
| ----------------- | :----------------------------: | :------: | :-----: | ---------------------------------------------------------- |
| `id`              |            `string`            |    -     |    -    | HTML id attribute for the label element                    |
| `className`       |            `string`            |    -     |    -    | Additional CSS class for styling                           |
| `style`           |       `CSSProperties`          |    -     |    -    | Additional inline styles                                   |
| `name`            |            `string`            |    -     |    -    | HTML name attribute for the input element                  |
| `value`           | `string \| number \| string[]` |    -     |    -    | Value associated with the checkbox                         |
| `label`           |            `string`            |    -     |    -    | Text label displayed next to the checkbox                  |
| `title`           |            `string`            |    -     |    -    | Tooltip text shown on hover                                |
| `truncate`        |           `boolean`            |    -     | `false` | Whether to truncate the label text if it overflows         |
| `tabIndex`        |            `number`            |    -     |   `-1`  | Tab order of the checkbox                                  |
| `isChecked`       |           `boolean`            |    -     | `false` | Controls the checked state of the checkbox                 |
| `isIndeterminate` |           `boolean`            |    -     | `false` | Shows a rectangle instead of a checkmark when true         |
| `isDisabled`      |           `boolean`            |    -     | `false` | Disables the checkbox input                                |
| `hasError`        |           `boolean`            |    -     | `false` | Displays the checkbox in an error state                    |
| `helpButton`      |          `ReactNode`           |    -     |    -    | Custom help button element to display next to the checkbox |
| `onChange`        |           `function`           |    -     |    -    | Callback fired when the checkbox state changes             |
| `dataTestId`      |            `string`            |    -     |    -    | Test id for the checkbox                                   |
