import type React from "react";

import type { TextProps } from "../text";

type PickedTextProps = Pick<TextProps, "title" | "truncate">;

// Declared here rather than picked out of React's attribute interfaces, which
// document none of them and would leave the table's most important rows blank.
type InputProps = {
  /** Name of the input, under which a form submits `value` while it is checked. */
  name?: string;
  /** `id` of the underlying checkbox input, unlike `id`, which lands on the
   * wrapping `<label>`. A `<label htmlFor={inputId}>` anywhere on the page
   * then works as the checkbox's caption: a click on it toggles the box
   * through `onChange`, does nothing while `isDisabled`, and names the
   * checkbox for assistive technology. Use it when the caption is laid out
   * apart from the box rather than passed as `label`. */
  inputId?: string;
  // React's own type for `<input value>`, kept wide on purpose: narrowing it to
  // `string` would reject `value={1}` in code that compiled before.
  /** Value the form submits under `name` while the box is checked. */
  value?: string | number | readonly string[];
  /** Applied to the input, which is the focusable element. Pass `-1` for a
   * checkbox the keyboard should skip.
   * @default 0 */
  tabIndex?: number;
  /** Called with the input's change event; the new state is
   * `event.target.checked`. The component stops the event's propagation. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

type LabelProps = {
  /** Applied to the `<label>` that wraps the whole control. */
  id?: string;
  /** Applied to the `<label>` that wraps the whole control. */
  style?: React.CSSProperties;
  /** Applied to the `<label>` that wraps the whole control. */
  className?: string;
};

export type CheckboxProps = PickedTextProps &
  InputProps &
  LabelProps & {
    /** Text beside the box, and the control's accessible name. A long one
     * wraps unless `truncate` is set. */
    label?: string;
    /** The state the checkbox starts in, and is reset to whenever this prop
     * changes. It is **not** a controlled value: a click flips the box whether
     * or not the parent agrees.
     * @default false */
    isChecked?: boolean;
    /** Draws a filled square inside the box in place of the tick, and sets the
     * input's `indeterminate` property. For a parent whose children are partly
     * selected.
     * @default false */
    isIndeterminate?: boolean;
    /** Disables the input and greys the box and the label; a click does
     * nothing. */
    isDisabled?: boolean;
    /** Node rendered after the label, usually a `HelpButton`. Clicking it does
     * not toggle the checkbox. */
    helpButton?: React.ReactNode;
    /** Draws the box and the label in the error colour. It renders no message —
     * pair it with `FieldContainer` for that.
     * @default false */
    hasError?: boolean;
    /** Value of `data-testid` on the `<label>`.
     * @default "checkbox" */
    dataTestId?: string;
  };
