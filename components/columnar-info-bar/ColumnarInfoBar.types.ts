import type React from "react";

export type ColumnarInfoBarColumn = {
  /** Caption above the value, at 12px. A node, so an icon or a link works here too. */
  label: React.ReactNode;
  /** The value itself. It is a flex row with an 8px gap, so an icon placed beside the text lines up with it. */
  value: React.ReactNode;
};

export type ColumnarInfoBarProps = {
  /** Bold caption above the columns, rendered as an `<h3>` and omitted entirely when empty. */
  headerText?: string;
  /** The label and value pairs, in order. An empty array renders the bar with nothing inside it. */
  columns: ColumnarInfoBarColumn[];
  /** Called when the close button is clicked. The button exists only while this is set, and the bar does not hide itself — take it out of the tree yourself. */
  onAction?: () => void;
  /** Called once after mount, and never again: the effect that calls it has an empty dependency list, so a new function on a later render is ignored. */
  onLoad?: () => void;
  /** Inline style of the bar. There is no `className` prop, so this is also where the `--cib-*` custom properties go. */
  style?: React.CSSProperties;
  /** Which of the three looks to render: the warning bar with an accent edge, the bordered `neutral` card that slides open, or the padded `page` block whose columns are a two-column grid.
   * @default "default" */
  variant?: "default" | "neutral" | "page";
  /**
   * Accessible name of the close button (its `aria-label`). Defaults to the
   * English `"Close"`; pass a translated string. Ignored without `onAction`.
   */
  closeLabel?: string;
};
