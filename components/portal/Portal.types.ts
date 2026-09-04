import type { ReactNode } from "react";

export type PortalProps = {
  /** The React node to be rendered inside the portal */
  element: ReactNode;

  /** Whether the portal content should be visible. Defaults to true */
  visible?: boolean;

  /** The DOM element to append the portal to. Defaults to document.body */
  appendTo?: HTMLElement | null;
};
