import { DateTime } from "luxon";

import { parseToDateTime } from "./parse";
import { getAppTimezone } from "./timezone";
import { convertMomentFormatToLuxon, formatDate } from "./formatDate";

export function getCorrectDate(
  locale: string,
  date: string | Date | DateTime | undefined,
  dateFormat = "L",
  timeFormat = "LT",
  tz?: string,
) {
  if (!date || date === "0001-01-01T00:00:00.0000000Z") return "—";

  const dt = parseToDateTime(date);
  if (!dt) return "—";

  const timezone = tz || getAppTimezone();

  const luxonDateFormat = convertMomentFormatToLuxon(dateFormat);
  const luxonTimeFormat = convertMomentFormatToLuxon(timeFormat);

  const curDate = formatDate(dt, luxonDateFormat, { locale, timezone });
  const curTime = formatDate(dt, luxonTimeFormat, { locale, timezone });

  return `${curDate} ${curTime}`;
}

