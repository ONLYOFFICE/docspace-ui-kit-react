import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DateTime } from "luxon";
import { getYearElements } from "./getYearElements";
import * as dateUtils from "../../../utils/date";

vi.mock("../../../utils/date", async (importOriginal) => {
  const actual = await importOriginal<typeof dateUtils>();
  return {
    ...actual,
    now: vi.fn(),
  };
});

describe("getYearElements", () => {
    beforeEach(() => {
        // Default now to 2023-01-01
        vi.mocked(dateUtils.now).mockReturnValue(DateTime.fromObject({ year: 2023, month: 1, day: 1 }));
    });
    // 2023-01-01
    const mockSelectedDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 });
    const mockMinDate = DateTime.fromObject({ year: 2020, month: 1, day: 1 });
    const mockMaxDate = DateTime.fromObject({ year: 2030, month: 12, day: 31 });
    const setObservedDate = vi.fn();
    const setSelectedScene = vi.fn();
    
    // Provide a list of years. getCalendarYears(2023) -> 2022..2037
    const years = [
        "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", 
        "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037"
    ];

    it("should render year elements", () => {
        const elements = getYearElements(years, setObservedDate, setSelectedScene, mockSelectedDate, mockMinDate, mockMaxDate);
        render(<>{elements}</>);
        
        expect(screen.getByText("2023")).toBeDefined();
        expect(screen.getByText("2037")).toBeDefined();
        
        const buttons = screen.getAllByRole("button");
        // Should be same length as years input (16)
        expect(buttons).toHaveLength(16);
    });

    it("should handle year clicks for different types", () => {
        vi.mocked(dateUtils.now).mockReturnValue(DateTime.fromObject({ year: 2024, month: 5, day: 10 }));
        
        const elements = getYearElements(years, setObservedDate, setSelectedScene, mockSelectedDate, mockMinDate, mockMaxDate);
        render(<>{elements}</>);
        
        const year2023 = screen.getByText("2023");
        fireEvent.click(year2023);
        expect(setObservedDate).toHaveBeenCalled();
        setObservedDate.mockClear();
        
        const year2024 = screen.getByText("2024");
        fireEvent.click(year2024);
        expect(setObservedDate).toHaveBeenCalled();
        setObservedDate.mockClear();
        
        const year2022 = screen.getByText("2022");
        fireEvent.click(year2022);
        expect(setObservedDate).toHaveBeenCalled();
        setObservedDate.mockClear();
        
        const year2025 = screen.getByText("2025");
        fireEvent.click(year2025);
        expect(setObservedDate).toHaveBeenCalled();
        setObservedDate.mockClear();
    });

    it("should disable years outside min/max range", () => {
        // Min year 2023. Max year 2025.
        // 2022 should be disabled.
        // 2026 should be disabled.
        const restrictiveMin = DateTime.fromObject({ year: 2023, month: 1, day: 1 });
        const restrictiveMax = DateTime.fromObject({ year: 2025, month: 12, day: 31 });
        
        const elements = getYearElements(years, setObservedDate, setSelectedScene, mockSelectedDate, restrictiveMin, restrictiveMax);
        render(<>{elements}</>);
        
        const year2022 = screen.getByText("2022").closest('button');
        expect(year2022).toBeDisabled();
        
        const year2023 = screen.getByText("2023").closest('button');
        expect(year2023).not.toBeDisabled();
        
        const year2026 = screen.getByText("2026").closest('button');
        expect(year2026).toBeDisabled();
    });
});
