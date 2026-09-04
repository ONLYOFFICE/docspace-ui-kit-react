import type React from "react";

import type { TextProps } from "../text";

export type BadgeProps = TextProps & {
  /** Ref to access the DOM element or React component instance */
  ref?: React.RefObject<HTMLDivElement>;
  /** Content to be displayed inside the badge. Can be a number (e.g., notification count) or text */
  label?: string | number;
  /** Custom border radius to adjust badge corners. Accepts CSS size values */
  borderRadius?: string;
  /** Custom padding to adjust badge spacing. Accepts CSS padding values */
  padding?: string;
  /** Maximum width of the badge. Useful for text truncation. Accepts CSS size values */
  maxWidth?: string;
  /** Mouse leave event handler */
  onMouseLeave?: (e: React.MouseEvent) => void;
  /** Mouse over event handler */
  onMouseOver?: (e: React.MouseEvent) => void;
  /** Disable hover effect */
  noHover?: boolean;
  /** Sets badge type to high priority. Changes visual appearance */
  type?: "high";
  /** Custom border style for the badge. Accepts CSS border values */
  border?: string;
  /** Custom height for the badge. Accepts CSS size values */
  height?: string;
  /** When true, applies version badge specific styling. Used for displaying version numbers */
  isVersionBadge?: boolean;
  /** When true, applies muted styling for less prominent notifications or inactive states */
  isMutedBadge?: boolean;
  /** When true, applies special styling for paid/premium features */
  isPaidBadge?: boolean;
  /** Handler for mouse over events. Used for hover state management and interactions */
  /** When true, applies custom hover styles */
  isHovered?: boolean;
  /** Data test id for testing */
  dataTestId?: string;
};
