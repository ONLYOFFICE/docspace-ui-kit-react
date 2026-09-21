import type { TColorScheme } from "../../context/ThemeContext";

export type SliderProps = {
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
   * Called on every move of the handle, with the range input's change event —
   * `event.target.value` is a string. Required in practice: the input is
   * controlled, so without this the handle cannot move.
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Lowest value of the range. */
  min: number;
  /** Highest value of the range. */
  max: number;
  /** How far one step of the handle moves. */
  step?: number;
  /** The current value. This is a controlled input; it does not keep its own. */
  value: number;
  /**
   * Fills the track to the left of the handle. The fill is computed from
   * `value`, `min` and `max`, and flipped for a right-to-left interface.
   */
  withPouring?: boolean;
  /**
   * Whether the input is disabled, which also greys the handle.
   * @default false
   */
  isDisabled?: boolean;
  /** Applied to the input. */
  style?: React.CSSProperties;
  /**
   * `data-testid` of the input.
   * @default "slider"
   */
  dataTestId?: string;
};

export type SliderThemeProps = SliderProps & {
  $currentColorScheme?: TColorScheme;
  sizeProp?: string;
};
