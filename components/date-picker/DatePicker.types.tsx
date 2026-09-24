import type { DateTime } from "luxon";
import type { Nullable } from "../../types";

export type DatePickerProps = {
  /**
   * Text of the button shown while no date is chosen.
   * @default "Select date"
   */
  selectDateText?: string;
  /**
   * Date the component starts with. On its own it does not survive the first
   * effect — pass `outerDate` as well, or instead.
   */
  initialDate?: Nullable<DateTime | Date | string>;
  /**
   * Called with the chosen date, and with `null` when the cross clears it.
   * Feed the value back through `outerDate` or the chip never appears.
   */
  onChange: (d: null | DateTime) => void;
  /** Applied to the outermost element. */
  className?: string;
  /** Applied to the outermost element. */
  id?: string;
  /** Earliest selectable day in the calendar. */
  minDate?: DateTime | Date;
  /** Latest selectable day in the calendar. */
  maxDate?: DateTime | Date;
  /** BCP 47 tag the calendar and the chip's date are written in. */
  locale: string;
  /**
   * Whether a calendar glyph is drawn before the date in the chip.
   * @default true
   */
  showCalendarIcon?: boolean;
  /**
   * The chosen date, held by you. This is the prop that actually controls what
   * is displayed: the component copies it into its own state on every render
   * and clears that state whenever this is empty.
   */
  outerDate?: DateTime | null;
  /** Month the calendar opens on. */
  openDate: DateTime | Date;
  /** Whether the calendar uses its larger touch layout. */
  isMobile?: boolean;
  /** Whether the chip's clearing cross is hidden. */
  hideCross?: boolean;
  /**
   * Whether the calendar flips to the right edge when there is less than 340px
   * of room to its right. Measured when it opens, not while it is open.
   */
  autoPosition?: boolean;
  /**
   * `data-testid` of the outermost element.
   * @default "date-picker"
   */
  testId?: string;
  /** Whether a picked day is reported at the end of that day rather than at midnight. */
  useMaxTime?: boolean;
};
