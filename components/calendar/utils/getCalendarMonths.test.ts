import { describe, it, expect } from "vitest";
import { DateTime } from "luxon";
import { getCalendarMonths } from "./getCalendarMonths";

describe("getCalendarMonths", () => {
  // Mock date: 2023-05-15
  const mockDate = DateTime.fromObject({ year: 2023, month: 5, day: 15 });

  it("should return 12 months for current year and 4 months from next year", () => {
    const result = getCalendarMonths(mockDate);
    
    // Total 16 months
    expect(result).toHaveLength(16);
    
    // Check first month (Jan 2023)
    expect(result[0].key).toBe("2023-1");
    
    // Check last month of current year (Dec 2023)
    expect(result[11].key).toBe("2023-12");
    
    // Check first month of next year (Jan 2024)
    expect(result[12].key).toBe("2024-1");
    
    // Check last month of next year subset (Apr 2024)
    expect(result[15].key).toBe("2024-4");
  });

  it("should capitalize month names", () => {
    const result = getCalendarMonths(mockDate);
    // Utility does: month[0].toUpperCase() + month.substring(1)
    
    const firstMonthName = result[0].value;
    expect(firstMonthName[0]).toBe(firstMonthName[0].toUpperCase());
  });
});
