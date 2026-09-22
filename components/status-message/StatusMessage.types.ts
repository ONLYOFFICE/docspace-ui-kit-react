export type StatusMessageProps = {
  /** The text or nodes in the bar, and the switch that shows and hides it: an empty message fades the bar out and unmounts it. A new one is only painted once the fade of the previous one ends. */
  message: string | React.ReactNode;
  /** Paints the bar in the warning colours instead of the error ones. It is read off the same ref as the message, so changing it alone does not repaint — change it together with `message`. */
  isWarning?: boolean;
};
