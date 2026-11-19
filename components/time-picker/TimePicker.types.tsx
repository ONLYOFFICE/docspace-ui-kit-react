import type { DateTime } from "luxon";

type TimePickerBase = {
  /**
   * Time the fields start on, read once on mount; midnight today without it.
   * Its day, seconds and time zone are carried into every value `onChange`
   * reports.
   */
  initialTime?: string | Date | DateTime;
  /**
   * Called on every accepted keystroke, and on a change of `meridiem`, with
   * `initialTime` carrying the typed time.
   */
  onChange?: (date: DateTime) => void;
  /** Applied to the outermost element. */
  className?: string;
  /**
   * Prefix for the two fields' class names: they become
   * `<classNameInput>-hours-input` and `-minutes-input`. Left out, the fields
   * get no extra class.
   */
  classNameInput?: string;
  /**
   * Whether the group is drawn in its error colours; they stay while a field is
   * focused.
   * @default false
   */
  hasError?: boolean;
  /** Position of both fields in the tab order. Left out, both take their natural place in it. */
  tabIndex?: number;
  /**
   * Called when typing completes the minutes field, not when it loses focus.
   * Two digits, one digit above 5, a third digit or a value above 59 complete it.
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
  /** Accessible name of the group that holds the two fields. Pass a translated string. */
  ariaLabel?: string;
  /** Accessible name of the hours field. Pass a translated string. */
  hoursLabel?: string;
  /** Accessible name of the minutes field. Pass a translated string. */
  minutesLabel?: string;
  /**
   * Whether typing moves the focus for you: a complete hour jumps to minutes,
   * and a complete minute blurs the field and calls `onBlur`. Turn it off to
   * keep the focus where the user put it; `onBlur` is then never called.
   */
  autoAdvance?: boolean;
};

// The 12-hour mode cannot tell 03:30 from 15:30 on its own, so it takes the
// half of the day with it.
type TimePickerHourFormat =
  | {
      /**
       * Whether hours run 1 to 12 rather than 0 to 23. It changes the fields
       * only — no AM/PM control is rendered — and requires `meridiem`.
       */
      isTwelveHourFormat: true;
      /**
       * `"AM"` or `"PM"`: the half of the day the typed time is in. You own
       * this value and the control that changes it; a change reports the time.
       */
      meridiem: string;
    }
  | {
      /** Whether hours run 1 to 12 rather than 0 to 23; requires `meridiem`. */
      isTwelveHourFormat?: false;
      /** Ignored in the 24-hour mode. */
      meridiem?: string;
    };

export type TimePickerProps = TimePickerBase & TimePickerHourFormat;
