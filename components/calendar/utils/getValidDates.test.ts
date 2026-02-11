import { describe, it, expect, vi } from "vitest";
import { DateTime } from "luxon";
import { getValidDates } from "./getValidDates";

describe("getValidDates", () => {
  it("should return parsed dates when valid dates are provided", () => {
    const minDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 });
    const maxDate = DateTime.fromObject({ year: 2023, month: 12, day: 31 });
    const currentMin = DateTime.fromObject({ year: 2023, month: 6, day: 1 });
    const currentMax = DateTime.fromObject({ year: 2023, month: 6, day: 30 });
    
    // Arguments: currentMinDate, currentMaxDate, minDate, maxDate
    const [resultMin, resultMax] = getValidDates(currentMin, currentMax, minDate, maxDate);
    
    expect(resultMin.toISODate()).toBe(currentMin.toISODate());
    expect(resultMax.toISODate()).toBe(currentMax.toISODate());
  });

  it("should clamp current dates to min/max", () => {
    const minDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 });
    const maxDate = DateTime.fromObject({ year: 2023, month: 12, day: 31 });
    
    // Current min before global min
    const currentMin = DateTime.fromObject({ year: 2022, month: 12, day: 1 });
    // Current max after global max
    const currentMax = DateTime.fromObject({ year: 2024, month: 1, day: 1 });
    
    const [resultMin, resultMax] = getValidDates(currentMin, currentMax, minDate, maxDate);
    
    expect(resultMin.toISODate()).toBe(minDate.toISODate());
    expect(resultMax.toISODate()).toBe(maxDate.toISODate());
  });

  it("should handle missing current dates by using min/max defaults", () => {
    const minDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 });
    const maxDate = DateTime.fromObject({ year: 2023, month: 12, day: 31 });
    
    const [resultMin, resultMax] = getValidDates(undefined, undefined, minDate, maxDate);
    
    // Should default to min/max
    expect(resultMin.toISODate()).toBe(minDate.toISODate());
    expect(resultMax.toISODate()).toBe(maxDate.toISODate());
  });
  
  it("should handle invalid min >= max by resetting to defaults", () => {
      // This path triggers console.error and resets min/max to defaults (1970 and now + 10 years).
      // We can spy on console.error to avoid cluttering output.
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const minDate = DateTime.fromObject({ year: 2024, month: 1, day: 1 });
      const maxDate = DateTime.fromObject({ year: 2023, month: 12, day: 31 });
      
      const [resultMin, resultMax] = getValidDates(undefined, undefined, minDate, maxDate);
      
      // Defaults:
      // min: 1970-01-01
      // max: now() + 10 years.
      
      expect(resultMin.year).toBe(1970);
      expect(resultMax.year).toBeGreaterThan(2023); // Roughly now + 10
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
  });
});
