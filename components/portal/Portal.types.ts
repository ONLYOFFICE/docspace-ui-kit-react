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
   * Element to append the content to. It is read on every render, so a value
   * that is null on the first render — a ref — falls back to `document.body`;
   * hold the container in state instead.
   */
  appendTo?: HTMLElement | null;
};
