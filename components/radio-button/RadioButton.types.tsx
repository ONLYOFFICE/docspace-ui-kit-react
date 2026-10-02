import { TextProps } from "../text/Text.types";

export type RadioButtonOrientation = "horizontal" | "vertical";

type PickedTextProps = Pick<TextProps, "fontSize" | "fontWeight">;
type PickedInputProps = Pick<
  React.ComponentProps<"input">,
  "name" | "value" | "autoFocus" | "onChange"
>;
type PickedLabelProps = Pick<
  React.ComponentProps<"label">,
  "id" | "className" | "style"
>;

export type RadioButtonProps = {
  /** `name` of the input. Buttons sharing one behave as a single choice. */
  name?: React.ComponentProps<"input">["name"];

  /**
   * `value` of the input, and the label when `label` is left out. It is what a
   * group's `onClick` reads back off the event.
   */
  value?: React.ComponentProps<"input">["value"];

  /** Whether the input takes focus on mount. */
  autoFocus?: React.ComponentProps<"input">["autoFocus"];

  /**
   * Called on every change of the input. Giving it takes the component's own
   * state handling out of the loop, so `isChecked` becomes the only thing that
   * moves the dot — and `onClick` stops firing.
   */
  onChange?: React.ComponentProps<"input">["onChange"];

  /** Applied to the label, not to the input. */
  id?: React.ComponentProps<"label">["id"];

  /** Applied to the label. */
  className?: React.ComponentProps<"label">["className"];

  /** Applied to the label. */
  style?: React.ComponentProps<"label">["style"];

  /** Font size of the text beside the button. */
  fontSize?: TextProps["fontSize"];

  /** Font weight of that text. */
  fontWeight?: TextProps["fontWeight"];

  /**
   * Whether the button is filled in. It seeds the component's own state and is
   * re-applied whenever it changes, so it works as a controlled value.
   */
  isChecked?: boolean;

  /** Whether the input is disabled and the label greyed out. */
  isDisabled?: boolean;

  /** What is written beside the button. `value` is used when this is left out. */
  label?: React.ReactNode | string;

  /**
   * Called when the button is clicked — but only while `onChange` is not given.
   * Passing `onChange` replaces the internal handler and this never fires.
   */
  onClick?: (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>,
  ) => void;

  /**
   * Gap to the neighbouring button, as a CSS length: `margin-inline-start` when
   * horizontal, `margin-block-end` when vertical. There is no gap at all
   * without it — the buttons touch.
   */
  spacing?: string;

  /**
   * Which side the gap is put on. It only moves `spacing`; it does not lay
   * anything out on its own.
   * @default "vertical"
   */
  orientation?: RadioButtonOrientation;

  /** Applied to the visually hidden `<input>`. */
  classNameInput?: string;

  /**
   * `data-testid` of the label.
   * @default "radio-button"
   */
  testId?: string;
} & PickedTextProps &
  PickedInputProps &
  PickedLabelProps;
