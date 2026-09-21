import type { PropsWithChildren } from "react";
import type { ButtonSize } from "./Button.enums";

type BaseButtonProps = PropsWithChildren<{
  /** Ref to access the DOM element or React component instance */
  ref?: React.Ref<HTMLElement>;
  /** Button text */
  label?: string;
  /** Tooltip text. Consumed by the `withTooltip` wrapper the folder exports, so it
   * becomes the tooltip's content and never reaches the DOM as a `title` attribute. */
  title?: string;
  /** Sets the button primary */
  primary?: boolean;
  /** Renders on a neutral grey surface with no border, for toolbar-style actions. */
  filled?: boolean;
  /** Used together with `filled`: strokes the icon's path instead of filling it, for
   * outline-style icons. */
  filledStroke?: boolean;
  /** Sets the button accent (tinted accent background with accent border/text) */
  accent?: boolean;
  /** Height of the button: `extraSmall` 24px, `small` 32px, `normal` 40px, `medium` 44px.
   * Each is a `--button-height-*` custom property the consumer can override. */
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
