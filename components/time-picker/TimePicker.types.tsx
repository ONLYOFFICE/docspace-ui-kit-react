import type { DateTime } from "luxon";

export type TimePickerProps = {
  /** Initial time value */
  initialTime?: string | Date | DateTime;
  /** Callback function when time changes */
  onChange?: (date: DateTime) => void;
  /** Additional CSS class */
  className?: string;
  /** CSS class for input */
  classNameInput?: string;
  /** Whether the input has an error */
  hasError?: boolean;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Callback function when input loses focus */
  onBlur?: () => void;
  /** Whether to focus the input on render */
  focusOnRender?: boolean;
  /** Forwarded ref */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  /** Test id */
  testId?: string;
  /** Whether to use 12-hour time format (with AM/PM) instead of 24-hour format */
  isTwelveHourFormat?: boolean;
  /** The meridiem indicator (AM/PM) for 12-hour format */
  meridiem?: string;
};
