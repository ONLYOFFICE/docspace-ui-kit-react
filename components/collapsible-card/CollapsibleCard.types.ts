import type React from "react";

export interface CollapsibleCardProps {
  /** Header title shown next to the chevron. */
  title: React.ReactNode;
  /** Optional secondary line under the title. */
  description?: React.ReactNode;
  /** Body content rendered when expanded. */
  children?: React.ReactNode;
  /**
   * Controlled open state. When provided, the parent owns state and must
   * update it via `onToggle`. When undefined, the component is uncontrolled
   * and uses `defaultOpen` as the initial value.
   */
  isOpen?: boolean;
  /** Initial open state in uncontrolled mode. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called with the next open value when the header is activated. */
  onToggle?: (nextOpen: boolean) => void;
  /** Additional CSS class name applied to the root element. */
  className?: string;
  /** Inline styles applied to the root element. */
  style?: React.CSSProperties;
  /**
   * Value of the root element's `data-testid`. Defaults to
   * `"collapsible-card"`.
   */
  dataTestId?: string;
}
