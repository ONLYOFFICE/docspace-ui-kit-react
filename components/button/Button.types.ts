import type { PropsWithChildren } from "react";
import type { ButtonSize } from "./Button.enums";

type BaseButtonProps = PropsWithChildren<{
  /** Ref to access the DOM element or React component instance */
  ref?: React.Ref<HTMLElement>;
  /** Button text */
  label?: string;
  /** Optional title attribute */
  title?: string;
  /** Sets the button primary */
  primary?: boolean;
  filled?: boolean;
  filledStroke?: boolean;
  /** Sets the button accent (tinted accent background with accent border/text) */
  accent?: boolean;
  /** Size of the button.
   * The normal size equals 36px and 40px in height on the Desktop and Touchscreen devices. */
  size?: ButtonSize;
  /** Scales the width of the button to 100% */
  scale?: boolean;
  /** Icon node element */
  icon?: React.ReactNode;
  /** Button tab index */
  tabIndex?: number;
  /** Custom CSS class */
  className?: string;
  /** HTML id attribute */
  id?: string;
  /** Custom CSS styles */
  style?: React.CSSProperties;
  /** Sets the button to show a hovered state */
  isHovered?: boolean;
  /** Sets the button to show a clicked state */
  isClicked?: boolean;
  /** Sets the button to show a disabled state */
  isDisabled?: boolean;
  /** Sets a button to show a loader icon */
  isLoading?: boolean;
  /** Sets the minimal button width */
  minWidth?: string;
  /** Sets the action initiated upon clicking the button */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** HTML button type attribute */
  type?: HTMLButtonElement["type"];
  /** HTML data-testid attribute */
  testId?: string;
}>;

/** Props for the Button component */
export type ButtonProps = BaseButtonProps & {
  /** ARIA label for accessibility */
  "aria-label"?: string;
  /** ARIA disabled state */
  "aria-disabled"?: "true" | "false";
  /** ARIA busy state */
  "aria-busy"?: "true" | "false";
  /** Tooltip text */
  tooltipText?: string;
};
