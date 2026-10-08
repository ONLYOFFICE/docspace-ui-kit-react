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
  /** Height of the `<svg>` element and of the rectangle inside it. */
  height?: string;
  /** Corner radius of the rectangle, in user units. */
  borderRadius?: string;
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
  style?: React.CSSProperties;
  /**
   * Optional stable id used as `uniqueKey` for the underlying
   * react-content-loader. When omitted, a `useId()` value is used so SSR and
   * client render the same SVG ids and no hydration mismatch is reported.
   */
  uniqueKey?: string;
};
