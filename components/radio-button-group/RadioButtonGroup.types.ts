import { RadioButtonProps } from "../radio-button/RadioButton.types";

type PicketRadioButtonPropsForOption = Pick<
  RadioButtonProps,
  "id" | "label" | "autoFocus"
>;

export type TRadioButtonOption = {
  value: string | number;
  disabled?: boolean;
  type?: "text" | "radio";
  autoFocus?: boolean;
  dataTestId?: string;
} & PicketRadioButtonPropsForOption;

type PickedDivProps = Pick<
  React.ComponentProps<"div">,
  "className" | "style" | "id"
>;

type PicketRadioButtonProps = Pick<
  RadioButtonProps,
  "isDisabled" | "fontWeight" | "fontSize" | "name" | "spacing" | "orientation"
>;

export type RadioButtonGroupProps = {
  /** Allows handling clicking events on `<RadioButton />` component */
  onClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Array of objects, contains props for each `<RadioButton />` component */
  options: TRadioButtonOption[];
  /** Value of the selected radio button */
  selected?: string | number;
  /** Position of radio buttons  */
  width?: string;
  /** Data test id for the radio button group */
  dataTestId?: string;
} & PickedDivProps &
  PicketRadioButtonProps;
