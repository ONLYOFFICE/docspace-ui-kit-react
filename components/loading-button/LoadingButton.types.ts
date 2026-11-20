export interface LoadingButtonProps extends Omit<
  React.AriaAttributes,
  "aria-label"
> {
  /** Accessible name of the ring's progress bar, in place of `progressLabel`. */
  "aria-label"?: string;
  /** DOM `id` of the outer 16px square. */
  id?: string;
  /** Added to the outer 16px square, after the component's own class. */
  className?: string;
  /** Inline style of the outer 16px square. `loaderColor` is merged over it. */
  style?: React.CSSProperties;
  /** How much of the ring is filled, 0–100, clamped to that range. At `0` the ring spins instead of showing an arc, and the progress bar reports no value. */
  percent?: number;
  /** Called, with no arguments, on a click anywhere in the 16px square and on Enter or Space on the cancel control. Without it there is no cancel control. */
  onClick?: VoidFunction;
  /** Accessible name of the cancel control. Defaults to the translated "Cancel". */
  cancelLabel?: string;
  /** Accessible name of the ring's progress bar. */
  progressLabel?: string;
  /** Whether the cross in the middle is dropped, leaving the ring on its own. */
  inConversion?: boolean;
  /** CSS colour of the ring and of the cross. Overrides the accent colour. */
  loaderColor?: string;
  /** CSS colour of the disc behind the cross. */
  backgroundColor?: string;
  /** Whether the ring is drawn in the idle grey instead of the accent colour, and lightens on hover. */
  isDefaultMode?: boolean;
}
