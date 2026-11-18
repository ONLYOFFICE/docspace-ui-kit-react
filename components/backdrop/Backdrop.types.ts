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

  /** Extra class name, or an array of them, for the layer. */
  className?: string | string[];

  /** HTML id of the layer. */
  id?: string;

  /** Inline styles for the layer. A `zIndex` here wins over the prop. */
  style?: React.CSSProperties;

  /**
   * Dims the page. Without it the layer is transparent and only catches
   * clicks — except on a viewport of 600px or less, where it dims anyway.
   * @default false
   */
  withBackground?: boolean;

  /**
   * Marks the layer as a side panel's. It dims the page and renders whatever
   * other backdrops are already on screen.
   * @default false
   */
  isAside?: boolean;

  /**
   * Keeps the layer transparent on every screen size, even when
   * `withBackground` or `isAside` is set.
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
