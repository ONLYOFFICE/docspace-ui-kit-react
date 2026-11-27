export type SliderProps = Omit<
  React.AriaAttributes,
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-valuetext"
  | "aria-valuenow"
  | "aria-valuemin"
  | "aria-valuemax"
> & {
  /** Applied to the input. */
  id?: string;

  /** Applied to the input. */
  className?: string;
  /** Width of the drag handle, as a CSS length. */
  thumbWidth?: string;
  /** Height of the drag handle, as a CSS length. */
  thumbHeight?: string;
  /** Border width of the drag handle, as a CSS length. */
  thumbBorderWidth?: string;
  /** Height of the track the handle runs along, as a CSS length. */
  runnableTrackHeight?: string;
  /**
   * Called on every move of the handle, with the input's change event;
   * `event.target.value` is a string. Without it the handle cannot move.
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Lowest value of the range. */
  min: number;
  /** Highest value of the range. */
  max: number;
  /** How far one arrow key moves the handle; a value between steps snaps to
   * the nearest one.
   * @default 1 */
  step?: number;
  /** The current value. This is a controlled input; it does not keep its own. */
  value: number;
  /**
   * Fills the track to the left of the handle. The fill is computed from
   * `value`, `min` and `max`, and flipped for a right-to-left interface.
   */
  withPouring?: boolean;
  /**
   * Disables the input and pales the handle and the fill; neither the pointer
   * nor the keyboard moves it.
   * @default false
   */
  isDisabled?: boolean;
  /** Applied to the input. */
  style?: React.CSSProperties;
  /** Accessible name of the slider, for one with no visible label. */
  "aria-label"?: string;
  /** `id` of the element whose text names the slider. */
  "aria-labelledby"?: string;
  /** `id` of the element whose text describes the slider. */
  "aria-describedby"?: string;
  /**
   * What the value means, read instead of the bare number: `"40 percent"`,
   * `"2 minutes"`. Keep it in step with `value`.
   */
  "aria-valuetext"?: string;
  /**
   * `data-testid` of the input.
   * @default "slider"
   */
  dataTestId?: string;
};
