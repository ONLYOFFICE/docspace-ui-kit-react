# DateTimePicker

Date-time input

### Usage

```js
import { DateTimePicker } from "@docspace/ui-kit";
```

```jsx
<DateTimePicker
  onChange={onChange}
  selectDateText="Select date"
  className="datePicker"
  id="datePicker"
  locale="en"
  hasError={false}
  openDate={new Date()}
  translations={{ AM: "AM", PM: "PM" }}
/>
```

#### Properties

| Props            |       Type       | Required | Values |          Default          | Description                                      |
| ---------------- | :--------------: | :------: | :----: | :-----------------------: | ------------------------------------------------ |
| `className`      |     `string`     |    -     |   -    |            ''             | Allows to set classname                          |
| `id`             |     `string`     |    -     |   -    |             -             | Allows to set id                                 |
| `onChange`       |      `func`      |    -     |   -    |             -             | Allow you to handle changing events of component |
| `initialDate`    | `date`, `string` |    -     |   -    |             -             | Default date                                     |
| `selectDateText` |     `string`     |    -     |   -    |       "Select date"       | Select date text                                 |
| `locale`         |     `string`     |    -     |   -    | `User's browser settings` | Browser locale                                   |
| `maxDate`        | `date`, `string` |    -     |   -    |             -             | Maximum date that the user can select.           |
| `minDate`        | `date`, `string` |    -     |   -    |             -             | Minimum date that the user can select.           |
| `hasError`       |    `boolean`     |    -     |   -    |           false           | Indicates the input field has an error           |
| `openDate`       | `date`, `string` |    -     |   -    |             -             | Allows to set first shown date in calendar       |
| `translations`   |     `object`     |   Yes    |   -    |             -             | Object with AM/PM translations                   |
| `dataTestId`     |     `string`     |    -     |   -    |             -             | Allows to set data-testid                        |
| `hideCross`      |    `boolean`     |    -     |   -    |           false           | Hides cross button                               |
| `useMaxTime`     |    `boolean`     |    -     |   -    |           false           | Use maximum time when selecting date             |
