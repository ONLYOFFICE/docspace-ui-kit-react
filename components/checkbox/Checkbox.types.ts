import type React from "react";

import type { TextProps } from "../text";

type PickedTextProps = Pick<TextProps, "title" | "truncate">;

// Declared here rather than picked out of React's attribute interfaces, which
// document none of them and would leave the table's most important rows blank.
type InputProps = {
  /** Name of the underlying checkbox input. */
  name?: string;
  /** Value of the underlying checkbox input, for a form read by name. */
  value?: string;
  /** Applied to the checkbox's **icon**, not to the input, which is always
   * `-1`. The default takes the control out of the tab order; pass `0` for a
   * checkbox the user is meant to reach with the keyboard.
   * @default -1 */
  tabIndex?: number;
  /** Called with the input's change event; the new state is
   * `event.target.checked`. The event does not bubble further — the component
   * stops its propagation. */
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
    /** Text beside the box. It sits in the flow beside the icon, so a long one
     * wraps unless `truncate` is set. */
    label?: string;
    /** The state the checkbox starts in, and the one it is reset to whenever
     * this prop changes. It is **not** a controlled value: a click flips the
     * component's own state whether or not the parent agrees.
     * @default false */
    isChecked?: boolean;
    /** Draws a dash instead of a tick and sets the input's DOM `indeterminate`
     * property, for a parent whose children are partly selected.
     * @default false */
    isIndeterminate?: boolean;
    /** Disables the input, dims the box and the label, and stops the control
     * responding to a click. */
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
