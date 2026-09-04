import type { DateTime } from "luxon";
import {
  startOf,
  formatDate,
  subtractFromDate,
  addToDate,
  daysInMonth,
} from "../../../../utils/date";

export const getCalendarDays = (date: DateTime) => {
  const observedDate = date;

  const prevMonthDays: { key: string; value: string }[] = [];
  const currentMonthDays: { key: string; value: string }[] = [];
  const nextMonthDays: { key: string; value: string }[] = [];
  const maxCalendarDays = 42;

  // Get first day of month, then start of that week (Monday)
  const firstOfMonth = startOf(observedDate, "month")!;
  const firstCalendarMonday = startOf(firstOfMonth, "week")!.day;

  let yearMonthDate = formatDate(observedDate, "yyyy-MM-");

  const currentMonthDaysCount = daysInMonth(observedDate);
  for (let i = 1; i <= currentMonthDaysCount; i += 1) {
    currentMonthDays.push({
      key: yearMonthDate + String(i),
      value: String(i),
    });
  }

  if (firstCalendarMonday !== 1) {
    const prevMonth = subtractFromDate(observedDate, 1, "months")!;
    const prevMonthLength = daysInMonth(prevMonth);

    yearMonthDate = formatDate(prevMonth, "yyyy-MM-");

    for (let i = firstCalendarMonday; i <= prevMonthLength; i += 1) {
      prevMonthDays.push({
        key: yearMonthDate + String(i),
        value: String(i),
      });
    }
  }

  const nextMonth = addToDate(observedDate, 1, "months")!;
  yearMonthDate = formatDate(nextMonth, "yyyy-MM-");

  for (
    let i = 1;
    i <= maxCalendarDays - currentMonthDays.length - prevMonthDays.length;
    i += 1
  ) {
    nextMonthDays.push({
      key: yearMonthDate + String(i),
      value: String(i),
    });
  }

  return { prevMonthDays, currentMonthDays, nextMonthDays };
};
