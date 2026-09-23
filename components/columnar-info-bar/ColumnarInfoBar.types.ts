import type React from "react";

export type ColumnarInfoBarColumn = {
  /** Caption rendered above the value, at reduced emphasis */
  label: React.ReactNode;
  /** Content of the column; any node, laid out inline with an 8px gap */
  value: React.ReactNode;
};

export type ColumnarInfoBarProps = {
  /** Heading rendered above the columns; omitted when empty */
  headerText?: string;
  /** Label and value pairs, one column each, in order */
  columns: ColumnarInfoBarColumn[];
  /** Close button click handler; the close button renders only when this is set */
  onAction?: () => void;
  /** Called once, after the component mounts */
  onLoad?: () => void;
  /** Inline styles on the root element; the way to set the `--cib-*` custom properties */
  style?: React.CSSProperties;
  /** Visual variant: warning bar with an accent border, bordered neutral card, or in-page card with a two-column grid */
  variant?: "default" | "neutral" | "page";
};
