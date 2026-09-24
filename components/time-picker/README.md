# TimePicker

Two-field time input, hours and minutes, typed as digits. Two digits in the hours field move the caret to minutes, two digits in minutes complete the entry and call `onBlur`; a digit that cannot start a valid value is zero-padded. Hours are capped at 23, or at 12 with `isTwelveHourFormat`, minutes at 59. Tab skips the picker unless `tabIndex` is set.

### Usage

```js
import { TimePicker } from "@onlyoffice/apps-ui-kit";
```

```jsx
<TimePicker
  initialTime={new Date()}
  tabIndex={0}
  onChange={(date) => console.log(date.toFormat("HH:mm"))}
/>
```

#### 12-hour format

Nothing on screen marks AM or PM; `meridiem` is required with `isTwelveHourFormat` and decides the half of the day in the value passed to `onChange`.

```jsx
<TimePicker
  initialTime="2025-01-27T14:30:00"
  isTwelveHourFormat
  meridiem="PM"
  onChange={(date) => console.log(date.toFormat("hh:mm a"))}
/>
```

#### Properties

| Props                |             Type             |         Required          |   Values   |         Default          | Description                                                                                |
| -------------------- | :--------------------------: | :-----------------------: | :--------: | :----------------------: | ------------------------------------------------------------------------------------------ |
| `initialTime`        | `string`, `Date`, `DateTime` |             -             |     -      | 00:00 of the current day | Time shown on mount; read once                                                             |
| `onChange`           |            `func`            |             -             |     -      |            -             | Called with a Luxon `DateTime` after every accepted keystroke                              |
| `onBlur`             |            `func`            |             -             |     -      |            -             | Called when typing completes the minutes field; not on a native blur                       |
| `hasError`           |            `bool`            |             -             |     -      |         `false`          | Paints the border in the error colour, kept while focused                                  |
| `tabIndex`           |           `number`           |             -             |     -      |            -             | Tab order of both fields; unset, Tab skips the picker                                      |
| `focusOnRender`      |            `bool`            |             -             |     -      |         `false`          | Selects the hours field on mount                                                           |
| `isTwelveHourFormat` |            `bool`            |             -             |     -      |         `false`          | Caps the hours field at 12 instead of 23; requires `meridiem`                              |
| `meridiem`           |           `string`           | with `isTwelveHourFormat` | `AM`, `PM` |            -             | Half of the day folded into the reported value in the 12-hour mode; never displayed        |
| `className`          |           `string`           |             -             |     -      |            -             | Additional CSS class on the outer box                                                      |
| `classNameInput`     |           `string`           |             -             |     -      |            -             | Prefix for the inner fields' class names: `<prefix>-hours-input`, `<prefix>-minutes-input` |
| `forwardedRef`       |           `object`           |             -             |     -      |            -             | Ref to the outer box, a `<div>`                                                            |
| `testId`             |           `string`           |             -             |     -      |      `time-picker`       | `data-testid` of the outer box                                                             |
