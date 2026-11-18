import type React from "react";

export type CircleSkeletonProps = {
  /**
   * Accessible name of the skeleton, rendered as the SVG's `<title>`. It is
   * empty by default, and an untitled skeleton is `aria-hidden` as decoration.
   */
  title?: string;
  /**
   * Centre of the circle on the horizontal axis, in user units: the SVG's `cx`.
   * A value below `radius` cuts the circle off at the left edge.
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
  /** How strongly the resting colour shows, from 0 to 1. */
  backgroundOpacity?: number;
  /** How strongly the sweeping band shows, from 0 to 1. */
  foregroundOpacity?: number;
  /** Duration of one sweep, in seconds. */
  speed?: number;
  /** Whether the band sweeps at all. Turn it off for a static placeholder. */
  animate?: boolean;
  /** Applied to the `<svg>` element. */
  className?: string;
  /** Applied to the `<svg>` element. */
  style?: React.CSSProperties;
  /**
   * Stable id the underlying react-content-loader builds its gradient and
   * clip-path ids from. When omitted, a `useId()` value is used, so the server
   * and the client render the same SVG ids and no hydration mismatch occurs.
   */
  uniqueKey?: string;
};
