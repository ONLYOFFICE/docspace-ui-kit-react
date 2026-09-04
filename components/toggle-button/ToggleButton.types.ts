import type { TextProps } from "../text";

type PickedTextProps = Pick<TextProps, "fontWeight" | "fontSize">;

type PickedHtmlElementProps = Pick<
  React.HTMLAttributes<HTMLElement>,
  "id" | "className" | "style"
>;

type PickedInputProps = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "onChange"
>;

/** Props for the toggle icon SVG component */
export type ToggleIconProps = Pick<
  ToggleButtonProps,
  "isChecked" | "isLoading" | "noAnimation"
>;

/** Props for the main ToggleButton component */
export type ToggleButtonProps = PickedTextProps &
  PickedHtmlElementProps &
  PickedInputProps & {
    /** Label text to display next to the toggle */
    label?: string;
    /** Whether the toggle is in checked state */
    isChecked?: boolean;
    /** Whether the toggle is disabled */
    isDisabled?: boolean;
    /** Whether the toggle is in loading state */
    isLoading?: boolean;
    /** Whether animations are disabled */
    noAnimation?: boolean;
    /** Data test id for the toggle button */
    dataTestId?: string;
    /** Data tooltip id for the toggle button */
    dataTooltipId?: string;
  };
