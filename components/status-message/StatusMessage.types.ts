export type StatusMessageProps = {
  /** The text or nodes in the bar, and the switch that shows and hides it: an empty message fades the bar out and unmounts it. A new one is painted once the fade of the previous one ends. */
  message: string | React.ReactNode;
  /** Paints the bar in the warning colours instead of the error ones, and makes it a polite `status` instead of an `alert`. A change repaints at once, with or without a new `message`. */
  isWarning?: boolean;
};
