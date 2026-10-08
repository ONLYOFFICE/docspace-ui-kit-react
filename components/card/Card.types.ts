import type React from "react";

export interface CardProps {
  /** Left side of the header row. A string renders as the card's heading, an `<h3>` unless `titleLevel` says otherwise; any other node is rendered as given inside a `<div>`. The row is dropped entirely when both this and `extra` are unset. */
  title?: React.ReactNode;
  /** Level of the heading a string `title` renders as. Ignored when `title` is not a string. */
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Right side of the header row, pushed against the trailing edge — a status, a badge, a link. */
  extra?: React.ReactNode;
  /** Body of the card. Nothing is rendered when it is empty. */
  children?: React.ReactNode;
  /** Added after the component's own class, on the outer element. */
  className?: string;
  /** Inline style of the outer element. */
  style?: React.CSSProperties;
  /** Value of `data-testid` on the outer element.
   * @default "card" */
  dataTestId?: string;
  /** Contents of a `<footer>` below the body. It gets no styling of its own beyond the card's 12px gap. */
  footer?: React.ReactNode;
}
