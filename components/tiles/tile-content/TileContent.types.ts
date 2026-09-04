import { CSSProperties, ReactElement } from "react";

export type TileContentProps = {
  /** Child elements to render inside the content area */
  children: ReactElement<{ containerWidth?: string }>;
  /** Optional CSS class name */
  className?: string;
  /** Optional unique identifier */
  id?: string;
  /** Click handler for the content area */
  onClick?: () => void;
  /** Optional inline styles */
  style?: CSSProperties;
};
