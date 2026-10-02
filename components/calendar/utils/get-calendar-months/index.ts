import type { DateTime } from "luxon";
import { getMonths, addToDate } from "../../../../utils/date";

export const getCalendarMonths = (observedDate: DateTime, locale?: string) => {
  // Get short month names and capitalize first letter
  const months = getMonths("short", locale).map(
    (month) => month[0].toUpperCase() + month.substring(1),
  );

  const currentYear = observedDate.year;
  const nextYear = addToDate(observedDate, 1, "years")!.year;

  const monthsObjs = months.map((month, index) => ({
    key: `${currentYear}-${index + 1}`,
    value: month,
  }));

  // Add first 4 months of next year
  for (let i = 0; i < 4; i += 1) {
    monthsObjs.push({
      key: `${nextYear}-${i + 1}`,
      value: monthsObjs[i].value,
    });
  }
  return monthsObjs;
};
