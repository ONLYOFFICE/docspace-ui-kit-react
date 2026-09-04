import type { DateTime } from "luxon";
import {
  now,
  addToDate,
  parseToDateTime,
  createDateTime,
} from "../../../../utils/date";

export const getValidDates = (
  currentMinDate?: DateTime | Date,
  currentMaxDate?: DateTime | Date,
  minDate?: DateTime | Date,
  maxDate?: DateTime | Date,
): [DateTime, DateTime] => {
  let minDt: DateTime | null = minDate ? parseToDateTime(minDate) : null;
  let maxDt: DateTime | null = maxDate ? parseToDateTime(maxDate) : null;

  if (!minDt) {
    minDt = createDateTime(1970, 1, 1);
  }
  if (!maxDt) {
    maxDt = addToDate(now(), 10, "years")!;
  }

  if (minDt >= maxDt) {
    minDt = createDateTime(1970, 1, 1);
    maxDt = addToDate(now(), 10, "years")!;
    console.error(
      "The minimum date is farther than or same as the maximum date. minDate and maxDate are set to default",
    );
  }

  let currentMinDt: DateTime | null = currentMinDate
    ? parseToDateTime(currentMinDate)
    : null;
  let currentMaxDt: DateTime | null = currentMaxDate
    ? parseToDateTime(currentMaxDate)
    : null;

  if (!currentMinDt) {
    currentMinDt = minDt;
  }
  if (!currentMaxDt) {
    currentMaxDt = maxDt;
  }

  let resultMinDate = currentMinDt < minDt ? minDt : currentMinDt;
  let resultMaxDate = currentMaxDt > maxDt ? maxDt : currentMaxDt;

  if (resultMinDate >= resultMaxDate) {
    resultMinDate = minDt;
    resultMaxDate = maxDt;
  }

  return [resultMinDate, resultMaxDate];
};
