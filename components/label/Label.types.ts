import type React from "react";

export type LabelProps = {
  /**
   * Appends a red asterisk, hidden from assistive technology, to the text. It
   * does not mark the field itself — put `required` on your input too.
   * @default false
   */
  isRequired?: boolean;

  /**
   * Turns the text red. It does not mark the field itself — put `aria-invalid`
   * on your input. The error message is not part of this component.
   * @default false
   */
  error?: boolean;

  /**
   * Makes the label an inline block, so it keeps its own width and padding on
   * the line beside the field. Without it the label is a plain inline element.
   * @default false
   */
  isInline?: boolean;

  /**
   * Text of the kit's shared tooltip, opened when the pointer rests on the
   * label. It shows only while `RootTooltip` is mounted.
   */
  title?: string;

  /**
   * Cuts text that does not fit on one line with an ellipsis. The label is
   * inline, so it also needs `display: block` (through `style`) and a width to
   * cut against.
   * @default false
   */
  truncate?: boolean;

  /** `for` attribute, which points at the `id` of the field this labels. */
  htmlFor?: string;

  /** The label's text. */
  text?: string | React.ReactNode;

  /**
   * Written onto the label as an HTML `display` attribute, which changes
   * nothing about its layout. Set `display` through `style` instead.
   */
  display?: string;

  /** Applied to the label. */
  className?: string;

  /** Applied to the label. */
  id?: string;

  /** Applied to the label. */
  style?: React.CSSProperties;

  /** Rendered after the text and the asterisk, inside the same label. */
  children?: React.ReactNode;

  /** Ignored. Nothing reads this prop; the shared tooltip sizes itself. */
  tooltipMaxWidth?: string;
};
