export type RectangleSkeletonProps = {
  /**
   * Accessible name of the skeleton, rendered as the SVG's `<title>`. It is
   * empty by default, which leaves the `role="img"` element unnamed.
   */
  title?: string;
  /** Applied to the `<svg>` element. */
  className?: string;
  /** Left edge of the rectangle inside the SVG, in user units. */
  x?: string;
  /** Top edge of the rectangle inside the SVG, in user units. */
  y?: string;
  /**
   * Width of the `<svg>` element and of the rectangle inside it. Any SVG length,
   * so a percentage of the parent works.
   */
  width?: string;
  /** How tall the placeholder stands, as an SVG length; it sizes both the
   * `<svg>` and the rectangle inside. */
  height?: string;
  /** Corner radius of the rectangle, in user units. */
  borderRadius?: string;
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
  style?: React.CSSProperties;
  /**
   * Stable id for the SVG's gradient and clip path. Without it a `useId()`
   * value is used, so server and client render the same ids.
   */
  uniqueKey?: string;
};
