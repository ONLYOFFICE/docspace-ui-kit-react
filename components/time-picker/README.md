# TimePicker

Time input

### Usage

```js
import { TimePicker } from "@docspace/ui-kit";
```

```jsx
<TimePicker
  initialTime={new Date()}
  hasError={false}
  onChange={(date) => console.log(date)}
/>
```

#### Properties

| Props           |   Type   | Required | Values | Default | Description                                      |
| --------------- | :------: | :------: | :----: | :-----: | ------------------------------------------------ |
| `className`     | `string` |    -     |   -    |   ''    | Allows to set classname                          |
| `initialTime`   | `object` |    -     |   -    |    -    | Initial time value                               |
| `onChange`      |  `func`  |    -     |   -    |    -    | Allow you to handle changing events of component |
| `hasError`      |  `bool`  |    -     |   -    |  false  | Indicates error                                  |
| `onBlur`        |  `func`  |    -     |   -    |    -    | Triggers function on blur                        |
| `focusOnRender` |  `bool`  |    -     |   -    |  false  | Focus input on render                            |
| `forwardedRef`  | `object` |    -     |   -    |  null   | Passes ref to child component                    |
| `testId`        | `string` |    -     |   -    |    -    | Test id for component                            |
| `isTwelveHourFormat` | `bool` |    -     |   -    |  false  | Use 12-hour time format (AM/PM)             |
| `meridiem`      | `string` |    -     |   -    |    -    | Meridiem indicator (AM/PM) for 12-hour format    |
