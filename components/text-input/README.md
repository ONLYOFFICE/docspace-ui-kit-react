# TextInput

Input field for single-line strings with various styling options and features including masking, scaling, and different states.

### Usage

```js
import { TextInput, InputSize, InputType } from "@docspace/ui-kit/components/text-input";
```

```jsx
<TextInput
  type={InputType.text}
  size={InputSize.base}
  value="text"
  onChange={(event) => console.log(event.target.value)}
/>
```

#### With Mask

```js
const mask = [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
```

```jsx
<TextInput
  type={InputType.text}
  mask={mask}
  placeholder="DD/MM/YYYY"
  guide
  keepCharPositions
  value=""
  onChange={(event) => console.log(event.target.value)}
/>
```

### Properties

| Props               |        Type        | Required |                      Values                       | Default | Description                                                                     |
| ------------------- | :----------------: | :------: | :-----------------------------------------------: | :-----: | ------------------------------------------------------------------------------- |
| `type`              |    `InputType`     |    ✅    | `text`, `password`, `email`, `tel`, `search`, `number` | - | Supported type of the input fields                                              |
| `value`             |      `string`      |    ✅    |                         -                         |    -    | Value of the input                                                              |
| `size`              |    `InputSize`     |    -     |              `base`, `middle`, `large`            | `base`  | Supported size of the input fields                                              |
| `onChange`          |     `function`     |    -     |                         -                         |    -    | Called with the new value. Required when input is not read only                 |
| `onBlur`            |     `function`     |    -     |                         -                         |    -    | Called when field is blurred                                                    |
| `onFocus`           |     `function`     |    -     |                         -                         |    -    | Called when field is focused                                                    |
| `onKeyDown`         |     `function`     |    -     |                         -                         |    -    | Called when a key is pressed                                                    |
| `onClick`           |     `function`     |    -     |                         -                         |    -    | Called when clicked                                                             |
| `onContextMenu`     |     `function`     |    -     |                         -                         |    -    | Called when context menu is triggered                                           |
| `id`                |      `string`      |    -     |                         -                         |    -    | Used as HTML `id` property                                                      |
| `name`              |      `string`      |    -     |                         -                         |    -    | Used as HTML `name` property                                                    |
| `className`         |      `string`      |    -     |                         -                         |    -    | CSS class name                                                                  |
| `style`             |  `CSSProperties`   |    -     |                         -                         |    -    | Inline CSS styles                                                               |
| `placeholder`       |      `string`      |    -     |                         -                         |    -    | Placeholder text for the input                                                  |
| `maxLength`         |      `number`      |    -     |                         -                         |  `255`  | Maximum length of the input value                                               |
| `tabIndex`          |      `number`      |    -     |                         -                         |    -    | Used as HTML `tabindex` property                                                |
| `autoComplete`      |      `string`      |    -     |                         -                         | `"off"` | Used as HTML `autocomplete` property                                            |
| `isAutoFocussed`    |     `boolean`      |    -     |                         -                         | `false` | Focus the input field on initial render                                         |
| `isDisabled`        |     `boolean`      |    -     |                         -                         | `false` | Indicates that the field cannot be used                                         |
| `isReadOnly`        |     `boolean`      |    -     |                         -                         | `false` | Indicates that the field is displaying read-only content                        |
| `hasError`          |     `boolean`      |    -     |                         -                         | `false` | Indicates the input field has an error                                          |
| `hasWarning`        |     `boolean`      |    -     |                         -                         | `false` | Indicates the input field has a warning                                         |
| `scale`             |     `boolean`      |    -     |                         -                         | `false` | Indicates the input field has scale (100% width)                                |
| `withBorder`        |     `boolean`      |    -     |                         -                         | `true`  | Indicates that component contains border                                        |
| `isBold`            |     `boolean`      |    -     |                         -                         | `false` | When true, sets font weight to 600                                              |
| `fontWeight`        | `number`, `string` |    -     |                         -                         |    -    | Sets the font weight of the input text                                          |
| `dir`               |      `string`      |    -     |                  `ltr`, `rtl`                     |    -    | Text direction                                                                  |
| `inputMode`         |      `string`      |    -     | `none`, `text`, `decimal`, `numeric`, `tel`, `search`, `email`, `url` |    -    | Input mode for virtual keyboard                                                 |
| `mask`              |      `array`       |    -     |                         -                         |    -    | Input text mask                                                                 |
| `guide`             |     `boolean`      |    -     |                         -                         | `false` | When true, Text Mask shows both placeholder and non-placeholder mask characters |
| `keepCharPositions` |     `boolean`      |    -     |                         -                         | `false` | Allows adding/deleting characters without changing positions of existing ones   |
| `forwardedRef`      | `Ref<HTMLElement>` |    -     |                         -                         |    -    | Forwarded ref                                                                   |
| `testId`            |      `string`      |    -     |                         -                         |    -    | HTML data-testid attribute                                                      |
