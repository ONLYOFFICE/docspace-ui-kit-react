import type { DateTime } from "luxon";

type TimePickerBase = {
  /** Time shown when the picker mounts, as an ISO string, a Date or a Luxon DateTime; read once, defaults to 00:00 of the current day */
  initialTime?: string | Date | DateTime;
  /** Callback function when time changes */
  onChange?: (date: DateTime) => void;
  /** Additional CSS class */
  className?: string;
  /** Prefix for the inner fields' class names: `<prefix>-hours-input` and `<prefix>-minutes-input` */
  classNameInput?: string;
  /** Whether the input has an error */
  hasError?: boolean;
  /** Tab order of both fields; unset, Tab skips the picker */
  tabIndex?: number;
  /** Called when typing completes the minutes field (two digits, a digit above 5, a third digit or a value above 59), not on a native blur */
  onBlur?: () => void;
  /** Whether to focus the input on render */
  focusOnRender?: boolean;
  /** Ref to the outer box, a div */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  /** Test id */
  testId?: string;
};

type TimePickerHourFormat =
  | {
      /** Caps the hours field at 12 instead of 23; requires `meridiem` */
      isTwelveHourFormat: true;
      /** "AM" or "PM", folded into the value reported by onChange; never displayed */
      meridiem: string;
    }
  | {
      /** Caps the hours field at 12 instead of 23; requires `meridiem` */
      isTwelveHourFormat?: false;
      /** Ignored in the 24-hour mode */
      meridiem?: string;
    };

export type TimePickerProps = TimePickerBase & TimePickerHourFormat;
