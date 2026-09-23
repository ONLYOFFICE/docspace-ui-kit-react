# QuantityPicker

A large numeric input flanked by minus and plus controls, with an optional slider and optional preset tabs underneath. Reach for it where the user chooses a countable amount to buy or allocate — seats, managers, gigabytes of storage — and the number itself should be the centre of the screen; for an ordinary form field, use a text input instead.

## Usage

The folder exports the component as its **default** export; there is no named export.

```jsx
import QuantityPicker from "@onlyoffice/apps-ui-kit/components/quantity-picker";

const MyComponent = () => {
  const [value, setValue] = useState(5);

  return (
    <QuantityPicker
      value={value}
      minValue={1}
      maxValue={100}
      step={1}
      title="Managers"
      subtitle="Choose how many managers to add"
      decreaseLabel="Decrease"
      increaseLabel="Increase"
      onChange={setValue}
    />
  );
};
```

The component is controlled: it shows `value` and reports changes through `onChange`, so the parent has to store the new value.

## Properties

| Name               | Type                             | Default | Description                                                                                               |
| ------------------ | -------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| value              | number                           | -       | Current value (required)                                                                                  |
| minValue           | number                           | -       | Lower bound for the controls, typed input and slider (required)                                           |
| maxValue           | number                           | -       | Upper bound; nothing goes past it except the one overflow step `showPlusSign` allows (required)           |
| step               | number                           | -       | Amount the controls and the slider move by; the last step up is shortened to stop at the bound (required) |
| onChange           | (value: number) => void          | -       | Called with the new value (required)                                                                      |
| title              | string \| null                   | -       | Heading above the controls; omitted when empty                                                            |
| subtitle           | string                           | -       | Secondary line under the title; omitted when empty                                                        |
| showPlusSign       | boolean                          | -       | Lets the value go exactly one past `maxValue` (to `maxValue + 1`), shown as `maxValue+`                   |
| isDisabled         | boolean                          | -       | Disables every control and replaces the input with static text                                            |
| showSlider         | boolean                          | -       | Renders a slider bound to the value, from `minValue` to `maxValue` (`maxValue + 1` with `showPlusSign`)   |
| className          | string                           | -       | Class name on the root element                                                                            |
| items              | Array\<number \| TabItemObject\> | -       | Preset tabs; selecting one adds its amount to the current value, capped like the plus control             |
| isLarge            | boolean                          | -       | Widens the value field from 101px to 140px                                                                |
| withoutControls    | boolean                          | -       | Hides the plus and minus controls                                                                         |
| disableValue       | string                           | -       | Text shown in place of the value while `isDisabled` is set; the field then sizes to its content           |
| underControlsTitle | string \| ReactNode              | -       | Text under the controls; turns to the warning colour while an invalid value is entered with `enableZero`  |
| isZeroAllowed      | boolean                          | -       | Deprecated former name of `enableZero`, kept as an alias; `enableZero` wins when both are set             |
| enableZero         | boolean                          | false   | Allows zero as a value below `minValue`; other values below it are flagged                                |
| minusTooltipId     | string                           | -       | Tooltip id set as `data-tooltip-id` on the minus control                                                  |
| minusDisabled      | boolean                          | -       | Disables only the minus control; it stays focusable (`aria-disabled`) so the tooltip can explain why      |
| decreaseLabel      | string                           | -       | Accessible name of the minus control; no `aria-label` is rendered without it                              |
| increaseLabel      | string                           | -       | Accessible name of the plus control; no `aria-label` is rendered without it                               |

`TabItemObject` is `{ name: string; value: number }`. It is not exported.

## Behaviour

- **Typing.** Non-digit characters are dropped. While the field is being edited it may hold an empty or below-minimum draft without calling `onChange`; the draft is committed on blur or Enter, where an empty field or a value below `minValue` is clamped to `minValue` (or kept at zero with `enableZero`). A typed value above `maxValue` is replaced at once by `maxValue`, or by `maxValue + 1` — displayed `maxValue+` — with `showPlusSign`.
- **Upper bound.** The highest value the component produces is `maxValue`, or `maxValue + 1` with `showPlusSign` — a single overflow state displayed as `maxValue+`, not a range. Plus, the preset tabs, typing and the slider all stop there; a step that would overshoot is shortened to land on it.
- **Controls.** The minus and plus controls are native buttons, so they are in the tab order (with the value field between them) and respond to Enter and Space. Minus steps down and stops at `minValue` (at zero with `enableZero`); from above `maxValue` it drops back to `maxValue`. Plus from below `minValue` jumps to `minValue`. Using a control discards an uncommitted draft. The controls contain only an icon, so pass translated `decreaseLabel` and `increaseLabel` to give them accessible names.
- **Presets.** Each tab is labelled with a leading plus sign (`+10`) and **adds** its amount to `value` rather than setting it.
- **Disabled.** With `isDisabled` the input is replaced by static text (`disableValue`, else the value), the title and subtitle turn to the disabled colour, and the controls (disabled buttons), slider and tabs stop responding. `disableValue` applies only then, and the field sizes to its content. `minusDisabled` makes the minus control inert through `aria-disabled` rather than `disabled`, so it stays hoverable and focusable for the `minusTooltipId` tooltip.

## Styling

The colours come from portal theme tokens — `--quantity-picker-rectangle-color`, `--quantity-picker-disable-color`, `--quantity-picker-additional-title`, `--quantity-picker-track-number`, `--quantity-picker-warning-color`, plus `--text-color` and `--text-disable-color`. None has a fallback, and this package does not define them: they come from the DocSpace portal's theme stylesheet, so outside the portal the host has to supply them.

The root takes the full width and centres itself with `margin: 0 auto`. The minus and plus controls are 38px circles and the value is set at 44px bold. The slider's end labels use logical positions, so they swap sides under RTL.

## Examples

### With a slider

```jsx
<QuantityPicker
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  showSlider
  title="Storage"
  subtitle="GB of additional storage"
  onChange={setValue}
/>
```

### With presets

```jsx
<QuantityPicker
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  items={[
    { name: "10", value: 10 },
    { name: "50", value: 50 },
    { name: "100", value: 100 },
  ]}
  onChange={setValue}
/>
```

### Disabled

```jsx
<QuantityPicker
  value={5}
  minValue={1}
  maxValue={100}
  step={1}
  isDisabled
  disableValue="Unlimited"
  title="Managers"
  onChange={() => {}}
/>
```
