import type { DateTime } from "luxon";

import type { TUsagePeriodKey } from "../types";
import { getAppTimezone, now } from "../../utils/date";

export const USAGE_PERIODS: TUsagePeriodKey[] = [
  "thisMonth",
  "lastMonth",
  "last3Months",
  "last6Months",
  "last12Months",
  "thisYear",
  "lastYear",
];

export const getUsageRange = (
  period: TUsagePeriodKey,
): { from: DateTime; to: DateTime } => {
  const current = now().setZone(getAppTimezone());

  switch (period) {
    case "lastMonth": {
      const lastMonth = current.minus({ months: 1 });
      return { from: lastMonth.startOf("month"), to: lastMonth.endOf("month") };
    }
    case "last3Months":
      return {
        from: current.minus({ months: 2 }).startOf("month"),
        to: current,
      };
    case "last6Months":
      return {
        from: current.minus({ months: 5 }).startOf("month"),
        to: current,
      };
    case "last12Months":
      return {
        from: current.minus({ months: 11 }).startOf("month"),
        to: current,
      };
    case "thisYear":
      return { from: current.startOf("year"), to: current };
    case "lastYear": {
      const lastYear = current.minus({ years: 1 });
      return { from: lastYear.startOf("year"), to: lastYear.endOf("year") };
    }
    default:
      return { from: current.startOf("month"), to: current };
  }
};

