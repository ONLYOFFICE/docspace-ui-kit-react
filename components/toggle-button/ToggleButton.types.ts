import type { TextProps } from "../text";

type PickedTextProps = Pick<TextProps, "fontWeight" | "fontSize">;

// Declared here rather than picked out of React's attribute interfaces: a
// picked prop carries React's documentation, which for these is none at all,
// and each of them does something specific to this component.
type ElementProps = {
  /** Applied to the outer element **and** to the inner `<label>`, so it appears
   * twice in the document. */
  id?: string;
  /** Applied to the outer element **and** to the inner `<label>`. */
  className?: string;
  /** Applied to the outer element **and** to the inner `<label>`, so a margin
   * or a padding set here takes effect at both levels. */
  style?: React.CSSProperties;
};

type InputProps = {
  /** Name of the hidden checkbox input, for a form that reads the control by
   * name rather than by state. */
  name?: string;
  /** Called with the checkbox's change event; the new state is
   * `event.target.checked`. Required in practice, since `isChecked` makes the
   * input controlled. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

/** Props for the toggle icon SVG component */
export type ToggleIconProps = Pick<
  ToggleButtonProps,
  "isChecked" | "isLoading" | "noAnimation"
>;

/** Props for the main ToggleButton component */
export type ToggleButtonProps = PickedTextProps &
  ElementProps &
  InputProps & {
    /** Text rendered beside the switch, in a `Text` span. Omit it and the
     * component is the 28×16 switch alone. */
    label?: string;
    /** Whether the switch is on. The control is fully controlled: this is the
     * `checked` of a real checkbox input, so pass `onChange` with it or React
     * warns and the switch never moves. */
    isChecked?: boolean;
    /** Disables the underlying input and stops pointer events on the whole
     * control, and dims the switch and the label. */
    isDisabled?: boolean;
    /** Pulses the knob to show work in progress. It does **not** disable the
     * control — a click during it still reaches `onChange`. */
    isLoading?: boolean;
    /** Runs the state transitions with a duration of zero instead of animating
     * them. The animation is otherwise always on. */
    noAnimation?: boolean;
    /** Value of `data-testid` on the outer element.
     * @default "toggle-button" */
    dataTestId?: string;
    /** Value of `data-tooltip-id` on the outer element, which is how a
     * `Tooltip` elsewhere in the tree anchors itself to this control. */
    dataTooltipId?: string;
  };
