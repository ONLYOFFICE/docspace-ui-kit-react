import type React from "react";

export interface CardProps {
  /** Start of the card header. Hidden if both title and extra are undefined. */
  title?: React.ReactNode;
  /** End of the card header (e.g. a status badge). */
  extra?: React.ReactNode;
  /** Card body content. */
  children?: React.ReactNode;
  /** Additional CSS class name applied to the root element. */
  className?: string;
  /** Inline styles applied to the root element. */
  style?: React.CSSProperties;
  /** Value of the root element's `data-testid`. Defaults to `"card"`. */
  dataTestId?: string;
  /** Content rendered in an unstyled `<footer>` after the body. */
  footer?: React.ReactNode;
}
