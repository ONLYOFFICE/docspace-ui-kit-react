import type React from "react";

export type LabelProps = React.AriaAttributes & {
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
   * Makes the label an inline block, which keeps its own width and padding
   * beside the field. Without it the label is a plain inline element.
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
   * inline, so it also needs `display: block` in `style`, and a width.
   * @default false
   */
  truncate?: boolean;

  /** `for` attribute, which points at the `id` of the field this labels. */
  htmlFor?: string;

  /** Caption shown in semibold, as text or an element, before the asterisk and the children. */
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
