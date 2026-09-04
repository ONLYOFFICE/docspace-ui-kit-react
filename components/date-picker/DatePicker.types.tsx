import type { DateTime } from "luxon";
import type { Nullable } from "../../types";

export type DatePickerProps = {
  /** Allows to change select date text */
  selectDateText?: string;
  /** Selected date */
  initialDate?: Nullable<DateTime | Date | string>;
  /** Allow you to handle changing events of component */
  onChange: (d: null | DateTime) => void;
  /** Allows to set classname */
  className?: string;
  /** Allows to set id */
  id?: string;
  /** Specifies min choosable calendar date */
  minDate?: DateTime | Date;
  /** Specifies max choosable calendar date */
  maxDate?: DateTime | Date;
  /** Specifies calendar locale */
  locale: string;
  /** Shows calendar icon in selected item */
  showCalendarIcon?: boolean;
  /** Allows to track date outside the component */
  outerDate?: DateTime | null;
  /** Allows to set first shown date in calendar */
  openDate: DateTime | Date;
  isMobile?: boolean;
  hideCross?: boolean;
  /** Automatically positions the calendar based on available space */
  autoPosition?: boolean;
  testId?: string;
  useMaxTime?: boolean;
};
