export type ColorPickerProps = {
  /** Applied to the outermost element. */
  className?: string;

  /** Applied to the outermost element. */
  id?: string;

  /**
   * Called by the cancel button, and by the closing cross in `isPickerOnly`
   * mode. Nothing here unmounts the picker; that is the caller's job.
   */
  onClose?: () => void;

  /**
   * Swaps which parts are drawn. `true` adds a header with a title and a
   * closing cross and drops the hex field and both buttons — the shape used
   * inside a drop-down. `false` keeps the hex field and the apply/cancel pair
   * and draws no header.
   * @default false
   */
  isPickerOnly: boolean;

  /** Called with the chosen colour when the apply button is clicked. */
  onApply?: (color: string) => void;

  /**
   * Colour the picker starts on, as a hex string. It is read once, on mount —
   * changing it afterwards does not move the picker.
   */
  appliedColor: string;

  /**
   * Text of the apply button. It is not translated for you.
   * @default "Apply"
   */
  applyButtonLabel?: string;

  /**
   * Text of the cancel button. It is not translated for you.
   * @default "Cancel"
   */
  cancelButtonLabel?: string;

  /** Called on every move of the saturation square and on every hex keystroke. */
  handleChange?: (color: string) => void;

  /**
   * Caption before the hex field. It is not translated for you.
   * @default "Hex code"
   */
  hexCodeLabel?: string;

  /** Ignored. Nothing reads this prop. */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
};
