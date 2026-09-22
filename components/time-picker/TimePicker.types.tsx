import type { DateTime } from "luxon";

export type TimePickerProps = {
  /**
   * Time the fields start on. It is read once, on mount; changing it afterwards
   * does nothing. Its **date** part is carried into every value `onChange`
   * reports, so pass a full date-time if that matters. Midnight today is used
   * when it is left out.
   */
  initialTime?: string | Date | DateTime;
  /**
   * Called on every accepted keystroke with a full `DateTime` — the date from
   * `initialTime` combined with the typed time.
   */
  onChange?: (date: DateTime) => void;
  /** Applied to the outermost element. */
  className?: string;
  /**
   * Prefix for the two fields' class names: they become
   * `<classNameInput>-hours-input` and `-minutes-input`.
   */
  classNameInput?: string;
  /**
   * Whether the group is drawn in its error colours.
   * @default false
   */
  hasError?: boolean;
  /** Position of the hours field in the tab order. */
  tabIndex?: number;
  /**
   * Called when the minutes field is left, and also when a rejected minute is
   * typed.
   */
  onBlur?: () => void;
  /**
   * Whether the hours field is selected on mount.
   * @default false
   */
  focusOnRender?: boolean;
  /** Ref to the outermost element. */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  /**
   * `data-testid` of the outermost element.
   * @default "time-picker"
   */
  testId?: string;
  /**
   * Whether hours run 1–12 rather than 0–23. It changes the fields only — no
   * AM/PM control is rendered, and `meridiem` is what decides which half of the
   * day the value lands in.
   */
  isTwelveHourFormat?: boolean;
  /**
   * `"AM"` or `"PM"`, used when parsing the typed time in 12-hour mode. You own
   * this value and the control that changes it.
   */
  meridiem?: string;
};
