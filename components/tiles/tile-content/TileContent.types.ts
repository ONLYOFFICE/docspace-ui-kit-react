import { CSSProperties, ReactElement } from "react";

export type TileContentProps = React.AriaAttributes & {
  /** The one element shown as the tile's name, not a string or a list. A
   * `containerWidth` prop on it becomes the width of the slot. */
  children: ReactElement<{ containerWidth?: string }>;
  /** Added after the component's own class on the outer element. */
  className?: string;
  /** Value of `id` on the outer element. */
  id?: string;
  /** Called on any click inside the slot. The type declares no parameter, but
   * the handler receives the React mouse event. */
  onClick?: () => void;
  /** Inline style of the outer element. */
  style?: CSSProperties;
};
