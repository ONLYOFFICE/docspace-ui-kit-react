import type { PropsWithChildren, CSSProperties } from "react";

export type ErrorContainerProps = PropsWithChildren & {
  /** ID of the error container */
  id?: string;
  /** Additional CSS class for styling */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Main error message text */
  bodyText?: string;
  /** Header text of the error message */
  headerText?: string;
  /** Text for the action button */
  buttonText?: string;
  /** Whether to use primary button style */
  isPrimaryButton?: boolean;
  /** Custom HTML content for the error message */
  customizedBodyText?: string;
  /** Click handler for the action button */
  onClickButton?: VoidFunction;
  /** Whether the container is used in editor mode */
  isEditor?: boolean;
  /** Whether to hide the portal logo */
  hideLogo?: boolean;
};
