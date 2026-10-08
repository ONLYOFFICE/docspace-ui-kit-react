import type { CSSProperties, ReactNode } from "react";

export type EmptyScreenContainerProps = {
  /** Source of the illustration. The stylesheet pins the image to 200×140, and to 150×105 below 600px, so supply artwork of that shape. */
  imageSrc: string;
  /** Alternative text for the illustration. Pass an empty string when the artwork repeats what the text below already says. */
  imageAlt: string;
  /** The heading under the image, 19px and bold, rendered as an `<h3>` unless `headingLevel` says otherwise. */
  headerText: string;
  /** Optional 600-weight line between the header and the description. It has no styling of its own beyond that weight. */
  subheadingText?: string;
  /** Optional explanatory line at 12px, in the muted colour. */
  descriptionText?: string | ReactNode;
  /** Actions under the text, stacked in a 16px column and centred. */
  buttons?: ReactNode;
  /** Added after the component's own classes on the outer element. */
  className?: string;
  /** Value of `id` on the outer element. */
  id?: string;
  /** Inline style of the outer element. */
  style?: CSSProperties;
  /** Level of the heading element `headerText` renders as: `3` gives an `<h3>`. Pick the level that fits the outline of the page around it. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Inline style of the `<img>`, and the only way past its fixed size. It is dropped between 601px and 1023px, where the component passes an empty object instead. */
  imageStyle?: CSSProperties;
  /** Inline style of the row that holds `buttons`. */
  buttonStyle?: CSSProperties;
  /** Adds the height of the filter bar to the top padding — 91px in place of 52px — for a screen that has no filter above it. It removes nothing. */
  withoutFilter?: boolean;
};
