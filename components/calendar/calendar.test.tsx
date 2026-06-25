/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DateTime } from "luxon";
import { Calendar } from "./Calendar";
import * as dateUtils from "../../utils/date";

// Mock sub-components
vi.mock("./sub-components", () => ({
  Days: ({
    handleDateChange,
  }: {
    handleDateChange: (date: DateTime) => void;
  }) => (
    <div data-testid="days-component">
      <button
        type="button"
        onClick={() =>
          handleDateChange(
            DateTime.fromObject({ year: 2023, month: 6, day: 15 }),
          )
        }
      >
        Select Date
      </button>
    </div>
  ),
  Months: () => <div data-testid="months-component">Months</div>,
  Years: () => <div data-testid="years-component">Years</div>,
}));

// Mock Scrollbar
vi.mock("../scrollbar", () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scrollbar">{children}</div>
  ),
}));

// Mock SCSS
vi.mock("./Calendar.module.scss", () => ({
  default: {
    container: "container",
    isScroll: "isScroll",
  },
}));

// Mock date utils
vi.mock("../../utils/date", async (importOriginal) => {
  const actual = await importOriginal<typeof dateUtils>();
  return {
    ...actual,
    now: vi.fn(),
    parseToDateTime: vi.fn(),
    formatDate: vi.fn(),
    endOf: vi.fn(),
    startOf: vi.fn(),
    dateDiffAbs: vi.fn(),
  };
});

// Mock getValidDates
vi.mock("./utils", () => ({
  getValidDates: vi.fn(),
}));

describe("Calendar tests:", () => {
  const mockSetSelectedDate = vi.fn();
  const mockOnChange = vi.fn();

  const defaultProps = {
    locale: "en",
    selectedDate: DateTime.fromObject({
      year: 2023,
      month: 5,
      day: 15,
      hour: 10,
      minute: 30,
    }),
    setSelectedDate: mockSetSelectedDate,
    minDate: DateTime.fromObject({ year: 2020, month: 1, day: 1 }),
    maxDate: DateTime.fromObject({ year: 2030, month: 12, day: 31 }),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Setup default mocks
    const mockNow = DateTime.fromObject({ year: 2023, month: 5, day: 15 });
    vi.mocked(dateUtils.now).mockReturnValue(mockNow);
    vi.mocked(dateUtils.parseToDateTime).mockImplementation((str) => {
      if (typeof str === "string") {
        if (str.includes("T")) {
          const [datePart, timePart] = str.split("T");
          const [year, month, day] = datePart.split("-").map(Number);
          const [hour, minute] = timePart.split(":").map(Number);
          return DateTime.fromObject({ year, month, day, hour, minute });
        }
        const [year, month, day] = str.split("-").map(Number);
        return DateTime.fromObject({ year, month, day });
      }
      return null;
    });
    vi.mocked(dateUtils.formatDate).mockImplementation(
      (date, format: string) => {
        const d = date as DateTime;
        if (format === "yyyy-MM-dd") {
          return `${d.year}-${String(d.month).padStart(2, "0")}-${String(
            d.day,
          ).padStart(2, "0")}`;
        }
        if (format === "HH:mm") {
          return `${String(d.hour).padStart(2, "0")}:${String(
            d.minute,
          ).padStart(2, "0")}`;
        }
        return "";
      },
    );
    vi.mocked(dateUtils.endOf).mockImplementation((date, unit) => {
      const d = date as DateTime;
      if (unit === "day") {
        return d.set({
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
        });
      }
      return d;
    });
    vi.mocked(dateUtils.startOf).mockImplementation((date, unit) => {
      const d = date as DateTime;
      if (unit === "day") {
        return d.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      }
      return d;
    });
    vi.mocked(dateUtils.dateDiffAbs).mockReturnValue(5);

    const { getValidDates } = await import("./utils");
    vi.mocked(getValidDates).mockReturnValue([
      DateTime.fromObject({ year: 2020, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2030, month: 12, day: 31 }),
    ]);
  });

  it("Calendar renders without error", () => {
    render(<Calendar {...defaultProps} />);
    expect(screen.getByTestId("calendar")).toBeDefined();
  });

  it("should render Days component by default (selectedScene = 0)", () => {
    render(<Calendar {...defaultProps} />);
    expect(screen.getByTestId("days-component")).toBeDefined();
  });

  it("should handle date change with useMaxTime", () => {
    render(
      <Calendar {...defaultProps} useMaxTime={true} onChange={mockOnChange} />,
    );

    const selectButton = screen.getByText("Select Date");
    fireEvent.click(selectButton);

    expect(mockSetSelectedDate).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalled();

    // Verify endOf was called for useMaxTime
    expect(dateUtils.endOf).toHaveBeenCalledWith(expect.any(Object), "day");
  });

  it("should handle date change without useMaxTime", () => {
    render(
      <Calendar {...defaultProps} useMaxTime={false} onChange={mockOnChange} />,
    );

    const selectButton = screen.getByText("Select Date");
    fireEvent.click(selectButton);

    expect(mockSetSelectedDate).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("should preserve time when changing date", () => {
    render(<Calendar {...defaultProps} onChange={mockOnChange} />);

    const selectButton = screen.getByText("Select Date");
    fireEvent.click(selectButton);

    // Verify formatDate was called to extract time from selectedDate
    expect(dateUtils.formatDate).toHaveBeenCalledWith(
      expect.objectContaining({ hour: 10, minute: 30 }),
      "HH:mm",
    );
  });

  it("should use today when initialDate is not provided and today is within range", async () => {
    const mockToday = DateTime.fromObject({ year: 2023, month: 5, day: 15 });
    vi.mocked(dateUtils.now).mockReturnValue(mockToday);
    vi.mocked(dateUtils.dateDiffAbs).mockReturnValue(5);

    const { getValidDates } = await import("./utils");
    vi.mocked(getValidDates).mockReturnValue([
      DateTime.fromObject({ year: 2020, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2030, month: 12, day: 31 }),
    ]);

    render(<Calendar {...defaultProps} initialDate={undefined} />);

    // Verify now() was called to get today's date
    expect(dateUtils.now).toHaveBeenCalled();
  });

  it("should use closest boundary when initialDate is not provided and today is out of range", async () => {
    const mockToday = DateTime.fromObject({ year: 2035, month: 5, day: 15 });
    vi.mocked(dateUtils.now).mockReturnValue(mockToday);

    // Mock dateDiffAbs to return larger value for max (meaning max is closer)
    vi.mocked(dateUtils.dateDiffAbs).mockImplementation((_date1, date2) => {
      if ((date2 as DateTime).year === 2030) return 5; // distance to max
      if ((date2 as DateTime).year === 2020) return 15; // distance to min
      return 0;
    });

    const { getValidDates } = await import("./utils");
    vi.mocked(getValidDates).mockReturnValue([
      DateTime.fromObject({ year: 2020, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2030, month: 12, day: 31 }),
    ]);

    render(<Calendar {...defaultProps} initialDate={undefined} />);

    expect(dateUtils.dateDiffAbs).toHaveBeenCalled();
  });

  it("should warn and use closest boundary when initialDate is out of range (above max)", async () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    vi.mocked(dateUtils.parseToDateTime).mockReturnValue(
      DateTime.fromObject({ year: 2035, month: 1, day: 1 }),
    );

    // Mock dateDiffAbs to return larger value for max (meaning max is closer)
    vi.mocked(dateUtils.dateDiffAbs).mockImplementation((_date1, date2) => {
      if ((date2 as DateTime).year === 2030) return 5; // distance to max
      if ((date2 as DateTime).year === 2020) return 15; // distance to min
      return 0;
    });

    const { getValidDates } = await import("./utils");
    vi.mocked(getValidDates).mockReturnValue([
      DateTime.fromObject({ year: 2020, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2030, month: 12, day: 31 }),
    ]);

    render(
      <Calendar
        {...defaultProps}
        initialDate={DateTime.fromObject({ year: 2035, month: 1, day: 1 })}
      />,
    );

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Initial date is out of min/max dates boundaries. Initial date will be set as closest boundary value",
    );
    expect(dateUtils.startOf).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it("should warn and use closest boundary when initialDate is out of range (below min)", async () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    vi.mocked(dateUtils.parseToDateTime).mockReturnValue(
      DateTime.fromObject({ year: 2015, month: 1, day: 1 }),
    );

    // Mock dateDiffAbs to return larger value for min (meaning min is closer)
    vi.mocked(dateUtils.dateDiffAbs).mockImplementation((_date1, date2) => {
      if ((date2 as DateTime).year === 2020) return 5; // distance to min
      if ((date2 as DateTime).year === 2030) return 15; // distance to max
      return 0;
    });

    const { getValidDates } = await import("./utils");
    vi.mocked(getValidDates).mockReturnValue([
      DateTime.fromObject({ year: 2020, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2030, month: 12, day: 31 }),
    ]);

    render(
      <Calendar
        {...defaultProps}
        initialDate={DateTime.fromObject({ year: 2015, month: 1, day: 1 })}
      />,
    );

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Initial date is out of min/max dates boundaries. Initial date will be set as closest boundary value",
    );

    consoleWarnSpy.mockRestore();
  });

  it("should render with Scrollbar when isScroll is true", () => {
    render(<Calendar {...defaultProps} isScroll={true} />);
    expect(screen.getByTestId("scrollbar")).toBeDefined();
  });

  it("should render without Scrollbar when isScroll is false", () => {
    render(<Calendar {...defaultProps} isScroll={false} />);
    expect(screen.queryByTestId("scrollbar")).toBeNull();
  });
});
