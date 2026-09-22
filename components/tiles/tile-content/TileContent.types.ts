import { CSSProperties, ReactElement } from "react";

export type TileContentProps = {
  /** A single element — not a string and not a list. Its `containerWidth` prop, if it has one, becomes the width of the wrapper around it. */
  children: ReactElement<{ containerWidth?: string }>;
  /** Added after the component's own class on the outer element. */
  className?: string;
  /** Value of `id` on the outer element. */
  id?: string;
  /** Called when the content area is clicked. It receives no argument, although the DOM event is what triggers it. */
  onClick?: () => void;
  /** Inline style of the outer element. */
  style?: CSSProperties;
};
