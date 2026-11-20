import { RadioButtonProps } from "../radio-button/RadioButton.types";

type PicketRadioButtonPropsForOption = Pick<
  RadioButtonProps,
  "id" | "label" | "autoFocus"
>;

export type TRadioButtonOption = {
  /**
   * Value of this option, and what `onClick` reads off the event. It is also
   * the React key, so two options may not share one.
   */
  value: string | number;
  /** Whether this one option is disabled while the rest stay live. */
  disabled?: boolean;
  /**
   * `"text"` renders a caption inside the group instead of a button, as a
   * heading above the options or between two runs of them.
   */
  type?: "text" | "radio";
  /** Whether this option's input takes focus on mount. */
  autoFocus?: boolean;
  /** `data-testid` of this option's button, or of the caption. */
  dataTestId?: string;
  /** Applied to this option's label element. */
  id?: PicketRadioButtonPropsForOption["id"];
  /** What is written beside this option. `value` is used when it is left out. */
  label?: PicketRadioButtonPropsForOption["label"];
} & PicketRadioButtonPropsForOption;

type PickedDivProps = Pick<
  React.ComponentProps<"div">,
  "className" | "style" | "id"
>;

type PicketRadioButtonProps = Pick<
  RadioButtonProps,
  "isDisabled" | "fontWeight" | "fontSize" | "name" | "spacing" | "orientation"
>;

export type RadioButtonGroupProps = React.AriaAttributes & {
  /**
   * Called when the choice changes, with the input's change event despite the
   * name. The new value is `event.target.value`, always a string.
   */
  onClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** The options, in order. An entry with `type: "text"` is a caption, not a button. */
  options: TRadioButtonOption[];
  /**
   * Value of the chosen option, compared as a string. It seeds the group's own
   * state and is re-applied whenever it changes.
   */
  selected?: string | number;
  /** Width of the group, as a CSS length. */
  width?: string;
  /**
   * `data-testid` of the group.
   * @default "radio-button-group"
   */
  dataTestId?: string;
  /**
   * Which way the options run: a row, or a column only as wide as its longest
   * label. A lone `RadioButton` defaults to vertical instead.
   */
  orientation?: PicketRadioButtonProps["orientation"];

  /** Applied to the group. */
  id?: PickedDivProps["id"];
  /** Applied to the group. */
  className?: PickedDivProps["className"];
  /** Applied to the group. */
  style?: PickedDivProps["style"];
} & PickedDivProps &
  PicketRadioButtonProps;
