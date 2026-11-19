import type { DateTime } from "luxon";

import type { Nullable } from "../../types";

export type DateTimePickerTranslations = {
  /** Label of the morning option in the meridiem drop-down. */
  AM: string;
  /** Label of the afternoon option. */
  PM: string;
};

export type DateTimePickerProps = {
  /**
   * Moment shown from the first render, as the day chip and the time beside it.
   * Its hour also picks AM or PM.
   */
  initialDate?: Nullable<DateTime | Date | string>;
  /** Text of the button shown while no date is chosen. */
  selectDateText: string;
  /** Applied to the outermost element. */
  className: string;
  /** Applied to the outermost element. */
  id: string;
  /**
   * Called whenever either half changes, with the combined date and time, or
   * `null` when the date is cleared.
   */
  onChange: (d: null | DateTime) => void;
  /**
   * Earliest selectable day in the calendar; its own day stays selectable,
   * whatever its time.
   */
  minDate?: DateTime | Date;
  /** Latest selectable day in the calendar. */
  maxDate?: DateTime | Date;
  /**
   * BCP 47 tag the calendar is written in. It also decides whether the time is
   * shown as 12-hour or 24-hour.
   */
  locale: string;
  /** Whether the control is drawn in its error colours. */
  hasError: boolean;
  /** Month the calendar opens on. */
  openDate: DateTime | Date;
  /**
   * `data-testid` of the outermost element.
   * @default "date-time-picker"
   */
  dataTestId?: string;
  /** Whether the date chip's clearing cross is hidden. */
  hideCross?: boolean;
  /** Whether a picked day is reported at the end of that day rather than at midnight. */
  useMaxTime?: boolean;
  /**
   * Labels of the AM and PM options. Required: the component reads them while
   * rendering, and nothing here translates them for you.
   */
  translations: DateTimePickerTranslations;
};
