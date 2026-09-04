import type React from "react";

export interface CardProps {
  /** Left side of the card header. Hidden if both title and extra are undefined. */
  title?: React.ReactNode;
  /** Right side of the card header (e.g. a status badge). */
  extra?: React.ReactNode;
  /** Card body content. */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  dataTestId?: string;
  footer?: React.ReactNode;
}

