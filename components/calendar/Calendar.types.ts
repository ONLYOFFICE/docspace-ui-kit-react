import type { DateTime } from "luxon";

export interface CalendarProps {
  /** Class name */
  className?: string;
  /** Used as HTML `id` property  */
  id?: string;
  /** Specifies the calendar locale */
  locale: string;
  /** Value of selected date (DateTime object) */
  selectedDate: DateTime;
  /** Allows handling the changing events of the component */
  onChange?: (formattedDate: DateTime) => void;
  /** Changes the selected date state */
  setSelectedDate?: (formattedDate: DateTime) => void;
  /** Specifies the minimum selectable date */
  minDate?: DateTime | Date;
  /** Specifies the maximum selectable date */
  maxDate?: DateTime | Date;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** First shown date */
  initialDate?: DateTime | Date;
  isMobile?: boolean;
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  isScroll?: boolean;
  /** Data test id for testing */
  dataTestId?: string;
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
