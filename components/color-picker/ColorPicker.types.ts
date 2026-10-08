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
   * Text of the apply button. Left out, the kit's own translation of "Apply"
   * (`Common:ApplyButton`) is used.
   */
  applyButtonLabel?: string;

  /**
   * Text of the cancel button. Left out, the kit's own translation of "Cancel"
   * (`Common:CancelButton`) is used.
   */
  cancelButtonLabel?: string;

  /** Called on every move of the saturation square and on every hex keystroke. */
  handleChange?: (color: string) => void;

  /**
   * Caption before the hex field, and the field's accessible name. It is not
   * translated for you.
   */
  hexCodeLabel?: string;

  /** Accessible name of the picker's group. It is not translated for you. */
  ariaLabel?: string;

  /**
   * Accessible name of the closing cross drawn in `isPickerOnly` mode. It is
   * not translated for you.
   */
  closeButtonLabel?: string;

  /** Ignored. Nothing reads this prop. */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
};
