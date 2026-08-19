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

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DateTime } from "luxon";
import { Months } from "./Months";
import * as dateUtils from "../../../../utils/date";
import * as calendarUtils from "../../utils";

// Mock date utils
vi.mock("../../../../utils/date", async (importOriginal) => {
  const actual = await importOriginal<typeof dateUtils>();
  return {
    ...actual,
    formatDate: vi.fn(),
    subtractFromDate: vi.fn(),
    addToDate: vi.fn(),
    endOf: vi.fn(),
    startOf: vi.fn(),
  };
});

// Mock calendar utils
vi.mock("../../utils", () => ({
  getCalendarMonths: vi.fn(),
  getMonthElements: vi.fn(),
}));

// Mock SCSS
vi.mock("../../Calendar.module.scss", () => ({
  default: {
    calendarContainer: "calendarContainer",
    big: "big",
    isScroll: "isScroll",
    headerContainer: "headerContainer",
    title: "title",
    headerActionIcon: "headerActionIcon",
    buttonsContainer: "buttonsContainer",
    roundButton: "roundButton",
    disabled: "disabled",
    arrowIcon: "arrowIcon",
    prev: "prev",
    next: "next",
  },
}));

describe("Months Component", () => {
  const mockSetObservedDate = vi.fn();
  const mockSetSelectedScene = vi.fn();

  const defaultProps = {
    observedDate: DateTime.fromObject({ year: 2023, month: 5, day: 15 }),
    setObservedDate: mockSetObservedDate,
    setSelectedScene: mockSetSelectedScene,
    selectedDate: DateTime.fromObject({ year: 2023, month: 5, day: 15 }),
    minDate: DateTime.fromObject({ year: 2020, month: 1, day: 1 }),
    maxDate: DateTime.fromObject({ year: 2030, month: 12, day: 31 }),
    isMobile: false,
    isScroll: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    vi.mocked(dateUtils.formatDate).mockImplementation((date, format) => {
      if (format === "yyyy") return "2023";
      return "";
    });

    vi.mocked(dateUtils.subtractFromDate).mockReturnValue(
      DateTime.fromObject({ year: 2022, month: 5, day: 15 }),
    );
    vi.mocked(dateUtils.addToDate).mockReturnValue(
      DateTime.fromObject({ year: 2024, month: 5, day: 15 }),
    );
    vi.mocked(dateUtils.startOf).mockReturnValue(
      DateTime.fromObject({ year: 2024, month: 1, day: 1 }),
    );
    vi.mocked(dateUtils.endOf).mockReturnValue(
      DateTime.fromObject({ year: 2022, month: 12, day: 31 }),
    );

    const mockMonths = [
      { key: "2023-1", value: "Jan" },
      { key: "2023-2", value: "Feb" },
    ];
    vi.mocked(calendarUtils.getCalendarMonths).mockReturnValue(mockMonths);
    vi.mocked(calendarUtils.getMonthElements).mockReturnValue([
      <div key="mock-months">MockMonths</div>,
    ]);
  });

  it("should render correctly", () => {
    render(<Months {...defaultProps} />);

    expect(screen.getByText("2023")).toBeDefined();
    expect(screen.getByText("MockMonths")).toBeDefined();
  });

  it("should handle title click", () => {
    render(<Months {...defaultProps} />);

    const title = screen.getByText("2023");
    fireEvent.click(title);

    expect(mockSetSelectedScene).toHaveBeenCalled();
  });

  it("should handle previous year click", () => {
    render(<Months {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    fireEvent.click(prevButton);

    expect(mockSetObservedDate).toHaveBeenCalled();
  });

  it("should handle next year click", () => {
    render(<Months {...defaultProps} />);

    const nextButton = screen.getByLabelText("Next");
    fireEvent.click(nextButton);

    expect(mockSetObservedDate).toHaveBeenCalled();
  });

  it("should pass props to MonthsBody (indirect check via getMonthElements)", () => {
    const mockMonths = [
      { key: "2023-1", value: "Jan" },
      { key: "2023-2", value: "Feb" },
    ];
    vi.mocked(calendarUtils.getCalendarMonths).mockReturnValue(mockMonths);

    render(<Months {...defaultProps} />);

    expect(calendarUtils.getMonthElements).toHaveBeenCalledWith(
      mockMonths,
      defaultProps.setObservedDate,
      defaultProps.setSelectedScene,
      defaultProps.selectedDate,
      defaultProps.minDate,
      defaultProps.maxDate,
    );
  });

  it("should disable previous button if out of range", () => {
    // Mock endOf(endOf(prevYear, "year"), "month") < minDate
    const prevYearEnd = DateTime.fromObject({ year: 2019, month: 12, day: 31 });
    vi.mocked(dateUtils.endOf).mockReturnValue(prevYearEnd);

    render(<Months {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button if out of range", () => {
    // Mock startOf(startOf(nextYear, "year"), "month") > maxDate
    const nextYearStart = DateTime.fromObject({ year: 2031, month: 1, day: 1 });
    vi.mocked(dateUtils.startOf).mockReturnValue(nextYearStart);

    render(<Months {...defaultProps} />);

    const nextButton = screen.getByLabelText("Next");
    expect(nextButton).toBeDisabled();
  });
});
