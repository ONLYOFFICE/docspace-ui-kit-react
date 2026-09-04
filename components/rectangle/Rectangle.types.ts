export type RectangleSkeletonProps = {
  title?: string;
  className?: string;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  backgroundOpacity?: number;
  foregroundOpacity?: number;
  speed?: number;
  animate?: boolean;
  style?: React.CSSProperties;
  /**
   * Optional stable id used as `uniqueKey` for the underlying
   * react-content-loader. When omitted, a `useId()` value is used so SSR and
   * client render the same SVG ids and no hydration mismatch is reported.
   */
  uniqueKey?: string;
};

