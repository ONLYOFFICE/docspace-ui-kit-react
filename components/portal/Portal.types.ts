import type { ReactNode } from "react";

export type PortalProps = {
  /**
   * What to render in the container. It is a node, not children: the component
   * renders nothing of its own around it.
   */
  element: ReactNode;

  /**
   * Whether the content is rendered. Turning it off unmounts the content, so
   * anything it held is lost.
   * @default true
   */
  visible?: boolean;

  /**
   * Element to append the content to. While it is null the content goes to
   * `document.body`, so hold the container in state, not in a ref.
   */
  appendTo?: HTMLElement | null;
};
