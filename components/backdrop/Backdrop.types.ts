import type React from "react";

export interface BackdropProps {
  /** Sets visible or hidden */
  visible: boolean;

  /**
   * Sets the z-index CSS property for stacking context
   * @default 203
   */
  zIndex?: number;

  /**
   * Custom CSS class name(s) to apply to the backdrop
   * Can be a single string or an array of strings
   */
  className?: string | string[];

  /** HTML id attribute for the backdrop element */
  id?: string;

  /** Custom inline styles to apply to the backdrop */
  style?: React.CSSProperties;

  /**
   * Enables background visibility for the backdrop
   * Note: Background is not displayed if viewport width > 1024px
   * @default false
   */
  withBackground?: boolean;

  /**
   * Indicates if the backdrop is being used with an Aside component
   * Affects backdrop stacking and background behavior
   * @default false
   */
  isAside?: boolean;

  /**
   * Forces the backdrop to render without a background
   * Takes precedence over withBackground
   * @default false
   */
  withoutBackground?: boolean;

  /**
   * Indicates if the backdrop is being used with a modal dialog
   * Affects touch event handling
   * @default false
   */
  isModalDialog?: boolean;

  /**
   * Click event handler for the backdrop
   * @param e - React mouse event
   */
  onClick?: (e: React.MouseEvent) => void;

  /**
   * Indicates if the backdrop should be shown
   * @default false
   */
  shouldShowBackdrop?: boolean;
}
