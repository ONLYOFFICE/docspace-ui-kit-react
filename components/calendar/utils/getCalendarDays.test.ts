import { describe, it, expect } from "vitest";
import { DateTime } from "luxon";
import { getCalendarDays } from "./getCalendarDays";

describe("getCalendarDays", () => {
  // Mock current date to be 2023-10-15
  const mockDate = DateTime.fromObject({ year: 2023, month: 10, day: 15 });

  it("should return correct structure provided a date", () => {
    const result = getCalendarDays(mockDate);
    
    expect(result).toHaveProperty("prevMonthDays");
    expect(result).toHaveProperty("currentMonthDays");
    expect(result).toHaveProperty("nextMonthDays");
  });

  it("should generate correct days for October 2023", () => {
    // October 2023 starts on Sunday (October 1st)
    const result = getCalendarDays(mockDate);

    // Prev month (September)
    // 25, 26, 27, 28, 29, 30
    expect(result.prevMonthDays).toHaveLength(6);
    expect(result.prevMonthDays[0].value).toBe("25");
    expect(result.prevMonthDays[5].value).toBe("30");
    expect(result.prevMonthDays[0].key).toBe("2023-09-25");

    // Current month (October)
    // 1..31
    expect(result.currentMonthDays).toHaveLength(31);
    expect(result.currentMonthDays[0].value).toBe("1");
    expect(result.currentMonthDays[30].value).toBe("31");
    expect(result.currentMonthDays[0].key).toBe("2023-10-1");

    // Next month (November)
    // 1..5
    expect(result.nextMonthDays).toHaveLength(5);
    expect(result.nextMonthDays[0].value).toBe("1");
    expect(result.nextMonthDays[4].value).toBe("5");
    expect(result.nextMonthDays[0].key).toBe("2023-11-1");
  });

  it("should handle a month starting on Monday correctly (e.g. May 2023)", () => {
    // May 1, 2023 is a Monday.
    const mayDate = DateTime.fromObject({ year: 2023, month: 5, day: 15 });
    
    const result = getCalendarDays(mayDate);
    
    // Current month (May) has 31 days.
    // 0 prev days is correct for a Monday start.
    expect(result.prevMonthDays).toHaveLength(0);
    expect(result.currentMonthDays).toHaveLength(31);
    
    // Next month days:
    // 42 - 31 = 11 days from June.
    expect(result.nextMonthDays).toHaveLength(11);
    expect(result.nextMonthDays[0].value).toBe("1");
    expect(result.nextMonthDays[0].key).toBe("2023-06-1");
  });
});
