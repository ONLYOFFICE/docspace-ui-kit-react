import type React from "react";

export type LabelProps = {
  /**
   * Appends a red asterisk to the text and sets `aria-required` on the label.
   * It does not mark the field itself — put `required` on your input too.
   * @default false
   */
  isRequired?: boolean;

  /**
   * Turns the text red and sets `aria-invalid` on the label. The error message
   * is not part of this component.
   * @default false
   */
  error?: boolean;

  /**
   * Renders the label inline instead of on its own line.
   * @default false
   */
  isInline?: boolean;

  /** Native `title`, shown as the browser's own tooltip on hover. */
  title?: string;

  /**
   * Cuts text that does not fit with an ellipsis. It needs a width to cut
   * against, so give the label one or a parent that constrains it.
   * @default false
   */
  truncate?: boolean;

  /** `for` attribute, which points at the `id` of the field this labels. */
  htmlFor?: string;

  /** The label's text. */
  text?: string | React.ReactNode;

  /** CSS `display` of the label, passed through to `Text`. */
  display?: string;

  /** Applied to the label. */
  className?: string;

  /** Applied to the label. */
  id?: string;

  /** Applied to the label. */
  style?: React.CSSProperties;

  /** Rendered after the text and the asterisk, inside the same label. */
  children?: React.ReactNode;

  /** Ignored. Nothing reads this prop; `title` is a native browser tooltip. */
  tooltipMaxWidth?: string;
};
