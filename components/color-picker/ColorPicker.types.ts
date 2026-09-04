export type ColorPickerProps = {
  /** Optional CSS class name for custom styling */
  className?: string;

  /** HTML id attribute for the component */
  id?: string;

  /** Callback function triggered when the color picker is closed
   * @returns void
   */
  onClose?: () => void;

  /** If true, displays only the color picker without hex input and control buttons
   * @default false
   */
  isPickerOnly: boolean;

  /** Callback function triggered when the color is applied
   * @param color - The selected color in hex format
   * @returns void
   */
  onApply?: (color: string) => void;

  /** The currently selected color in hex format */
  appliedColor: string;

  /** Custom label for the apply button
   * @default "Apply"
   */
  applyButtonLabel?: string;

  /** Custom label for the cancel button
   * @default "Cancel"
   */
  cancelButtonLabel?: string;

  /** Callback function triggered on every color change
   * @param color - The current color in hex format
   * @returns void
   */
  handleChange?: (color: string) => void;

  /** Custom label for the hex code input field
   * @default "Hex code"
   */
  hexCodeLabel?: string;

  /** React ref object for the component's root div element */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
};
