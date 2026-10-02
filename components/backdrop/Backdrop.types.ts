import type React from "react";

export interface BackdropProps {
  /**
   * Whether the layer is rendered at all. It is not a CSS switch: a backdrop
   * that is not visible renders nothing.
   */
  visible: boolean;

  /**
   * Stacking order of the layer. The component it covers needs a higher one.
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

  /** Custom inline styles to apply to the backdrop. `zIndex` is merged in first. */
  style?: React.CSSProperties;

  /**
   * Dims the page. Without it the layer is transparent and only catches
   * clicks — except on a viewport of 600px or less, where it dims anyway.
   * @default false
   */
  withBackground?: boolean;

  /**
   * Marks the backdrop as belonging to a side panel: it then dims the page, and
   * it is allowed to render even when two backdrops are already on screen.
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
   * Lets touch scrolling through the backdrop go on as usual. Without it a
   * touch move over the layer has its default action prevented.
   * @default false
   */
  isModalDialog?: boolean;

  /**
   * Called on a click, and on a touch move or touch end, which pass a touch
   * event cast to a mouse event.
   */
  onClick?: (e: React.MouseEvent) => void;

  /**
   * Renders the layer even when another backdrop is already on screen, which
   * would otherwise suppress it.
   * @default false
   */
  shouldShowBackdrop?: boolean;
}
