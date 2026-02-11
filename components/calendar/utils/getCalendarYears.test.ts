import { describe, it, expect } from "vitest";
import { DateTime } from "luxon";
import { getCalendarYears } from "./getCalendarYears";

describe("getCalendarYears", () => {
  // Mock date: 2023-05-15
  const mockDate = DateTime.fromObject({ year: 2023, month: 5, day: 15 });

  it("should return a range of 16 years (current year - 1 to + 15)", () => {
    const result = getCalendarYears(mockDate);
    
    expect(result).toHaveLength(16);
    expect(result[0]).toBe("2022");
    expect(result[15]).toBe("2037");
  });
});
