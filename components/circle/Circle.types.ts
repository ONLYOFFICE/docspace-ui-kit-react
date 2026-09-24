import type React from "react";

export type CircleSkeletonProps = {
  /**
   * Accessible name of the skeleton, rendered as the SVG's `<title>`. It is
   * empty by default, which leaves the `role="img"` element unnamed.
   */
  title?: string;
  /**
   * Centre of the circle on the horizontal axis, in user units — the SVG's `cx`.
   * It is not an offset: a value below `radius` cuts the circle off at the left
   * edge, which the defaults do.
   */
  x?: string;
  /** Centre of the circle on the vertical axis, in user units — the SVG's `cy`. */
  y?: string;
  /** Width of the `<svg>` element. The circle's own size comes from `radius`. */
  width?: string;
  /** Height of the `<svg>` element. The circle's own size comes from `radius`. */
  height?: string;
  /** Radius of the circle, in user units. */
  radius?: string;
  /** Colour of the skeleton at rest. Fixed black, not a theme colour. */
  backgroundColor?: string;
  /** Colour of the band that sweeps across the skeleton. */
  foregroundColor?: string;
  /** Opacity of `backgroundColor`. */
  backgroundOpacity?: number;
  /** Opacity of `foregroundColor`. */
  foregroundOpacity?: number;
  /** Duration of one sweep, in seconds. */
  speed?: number;
  /** Whether the band sweeps at all. Turn it off for a static placeholder. */
  animate?: boolean;
  /** Applied to the `<svg>` element. */
  className?: string;
  /** Applied to the `<svg>` element. */
  style?: React.CSSProperties;
};
