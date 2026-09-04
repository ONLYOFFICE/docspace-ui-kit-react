import type React from "react";

export type LabelProps = {
  /** Indicates if the field associated with this label is required */
  isRequired?: boolean;

  /** Indicates if the field associated with this label has an error state */
  error?: boolean;

  /** When true, sets the label to display inline */
  isInline?: boolean;

  /** Tooltip text shown on hover. Also used for accessibility */
  title?: string;

  /** When true, truncates text that overflows with an ellipsis */
  truncate?: boolean;

  /** HTML 'for' attribute that associates the label with a form control */
  htmlFor?: string;

  /** The label's text content. Can be a string or a React node */
  text?: string | React.ReactNode;

  /** CSS display property value */
  display?: string;

  /** Additional CSS class names */
  className?: string;

  /** HTML id attribute */
  id?: string;

  /** Custom CSS styles */
  style?: React.CSSProperties;

  /** Child elements to render inside the label */
  children?: React.ReactNode;

  /** Maximum width for the tooltip */
  tooltipMaxWidth?: string;
};
