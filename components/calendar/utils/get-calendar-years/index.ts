import type { DateTime } from "luxon";

export const getCalendarYears = (observedDate: DateTime) => {
  const years: string[] = [];
  const selectedYear = observedDate.year;
  const firstYear = selectedYear - 1;

  for (let i = firstYear; i <= firstYear + 15; i += 1) {
    years.push(String(i));
  }

  return years;
};
