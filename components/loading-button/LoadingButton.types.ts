export interface LoadingButtonProps {
  /** Ignored. Nothing reads this prop; the element carries no `id`. */
  id?: string;
  /** Ignored. Nothing reads this prop; style the ring through the custom properties. */
  className?: string;
  /** Ignored. Nothing reads this prop either. */
  style?: React.CSSProperties;
  /** How much of the ring is filled, 0–100. At `0` the ring spins instead of showing an arc. */
  percent?: number;
  /** Called when anything inside the 16px square is clicked, including the cross. */
  onClick?: VoidFunction;
  /** Whether the cross in the middle is dropped, leaving the ring on its own. */
  inConversion?: boolean;
  /** CSS colour of the ring and of the cross. Overrides the accent colour. */
  loaderColor?: string;
  /** CSS colour of the disc behind the cross. */
  backgroundColor?: string;
  /** Whether the ring is drawn in the idle grey instead of the accent colour, and lightens on hover. */
  isDefaultMode?: boolean;
}
