import type { DateTime } from "luxon";

export interface CalendarProps {
  /** Applied to the outermost element. */
  className?: string;
  /** Applied to the outermost element. */
  id?: string;
  /**
   * BCP 47 tag the month and weekday names are written in.
   * @default "en"
   */
  locale: string;
  /**
   * The highlighted day, as a Luxon `DateTime`. Its **time** is kept when
   * another day is picked — only the date part is replaced.
   */
  selectedDate: DateTime;
  /**
   * Called with the newly picked day, after `setSelectedDate`. Both receive the
   * same value; there is no separate "confirm" step.
   */
  onChange?: (formattedDate: DateTime) => void;
  /** Called with the newly picked day, before `onChange`. */
  setSelectedDate?: (formattedDate: DateTime) => void;
  /**
   * Earliest selectable day. Days before it are greyed and the header arrows
   * stop at its month.
   */
  minDate?: DateTime | Date;
  /** Latest selectable day, with the same effect at the other end. */
  maxDate?: DateTime | Date;
  /** Applied to the outermost element. */
  style?: React.CSSProperties;
  /**
   * Month the calendar opens on. Out-of-range values are moved to the nearer of
   * `minDate` and `maxDate`, with a warning on the console.
   */
  initialDate?: DateTime | Date;
  /** Whether the larger touch layout is used. */
  isMobile?: boolean;
  /** Ref to the outermost element. */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  /** Whether the grid is wrapped in a `Scrollbar` instead of sizing to its content. */
  isScroll?: boolean;
  /**
   * `data-testid` of the outermost element.
   * @default "calendar"
   */
  dataTestId?: string;
  /** Whether a picked day is reported at 23:59:59.999 rather than keeping the old time. */
  useMaxTime?: boolean;
}

export interface DaysProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  handleDateChange: (date: DateTime) => void;
  selectedDate: DateTime;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  isScroll?: boolean;
  locale?: string;
}

export interface DaysHeaderProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  locale?: string;
}

export interface DaysBodyProps {
  observedDate: DateTime;
  handleDateChange: (date: DateTime) => void;
  selectedDate: DateTime;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  isScroll?: boolean;
  locale?: string;
}

export interface HeaderButtonsProps {
  onLeftClick: React.MouseEventHandler<HTMLButtonElement>;
  onRightClick: React.MouseEventHandler<HTMLButtonElement>;
  isLeftDisabled: boolean;
  isRightDisabled: boolean;
  isMobile: boolean;
}

export interface MonthsProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  selectedDate: DateTime;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  isScroll?: boolean;
  locale?: string;
}

export interface MonthsBodyProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  selectedDate: DateTime;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  isScroll?: boolean;
  locale?: string;
}

export interface MonthsHeaderProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
}

export interface YearsProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  selectedDate: DateTime;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  isScroll?: boolean;
}

export interface YearsHeaderProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
}
