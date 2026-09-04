import type { DateTime } from "luxon";

import type { Nullable } from "../../types";

export type DateTimePickerProps = {
  /** Date object */
  initialDate?: Nullable<DateTime | Date | string>;
  /** Select date text */
  selectDateText: string;
  /** Allows to set classname */
  className: string;
  /** Allows to set id */
  id: string;
  /** Allow you to handle changing events of component */
  onChange: (d: null | DateTime) => void;
  /** Specifies min choosable calendar date */
  minDate?: DateTime | Date;
  /** Specifies max choosable calendar date */
  maxDate?: DateTime | Date;
  /** Specifies calendar locale */
  locale: string;
  /** Indicates the input field has an error  */
  hasError: boolean;
  /** Allows to set first shown date in calendar */
  openDate: DateTime | Date;
  /** Allows to set data-testid */
  dataTestId?: string;
  hideCross?: boolean;
  useMaxTime?: boolean;
};
