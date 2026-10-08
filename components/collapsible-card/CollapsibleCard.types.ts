import type React from "react";

export interface CollapsibleCardProps {
  /** First line of the header, next to the chevron. The whole header is the button, so this is part of its accessible name. */
  title: React.ReactNode;
  /** Second line of the header, under the title. Also inside the button, and so also part of its accessible name. */
  description?: React.ReactNode;
  /** Body, rendered only while the card is open. Without it the card opens to nothing. */
  children?: React.ReactNode;
  /**
   * Whether the card is open. Passing it — even as `false` — takes control away
   * from the component for good: it then opens and closes only when you change
   * this value from `onToggle`.
   */
  isOpen?: boolean;
  /** Whether the card starts open. Read once, on the first render, and only while `isOpen` is unset.
   * @default false */
  defaultOpen?: boolean;
  /** Called with the state the card is moving to whenever the header is activated, in both the controlled and the uncontrolled case. */
  onToggle?: (nextOpen: boolean) => void;
  /** Added after the component's own class, on the outer element. */
  className?: string;
  /** Inline style of the outer element. */
  style?: React.CSSProperties;
  /** Value of `data-testid` on the outer element.
   * @default "collapsible-card" */
  dataTestId?: string;
}
