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
  /** Used as HTML `checked` property for the `<input>` tag */
  isChecked?: boolean;

  /** Used as HTML `disabled` property for the `<input>` tag */
  isDisabled?: boolean;

  /** Label text or node to display next to the radio button.
   * If not provided, value will be used as label */
  label?: React.ReactNode | string;

  /** Callback fired when radio button is clicked */
  onClick?: (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>,
  ) => void;

  /** Sets margin between radio buttons.
   * For horizontal orientation, sets margin-inline-start.
   * For vertical orientation, sets margin-block-end.
   * @default "15px" */
  spacing?: string;

  /** Layout orientation of radio buttons when used in a group
   * @default "vertical" */
  orientation?: RadioButtonOrientation;

  /** Additional CSS class for the input element */
  classNameInput?: string;

  /** Test ID for the radio button component */
  testId?: string;
} & PickedTextProps &
  PickedInputProps &
  PickedLabelProps;
