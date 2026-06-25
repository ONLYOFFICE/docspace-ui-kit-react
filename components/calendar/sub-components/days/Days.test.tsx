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
import { Days } from "./Days";
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
  getDayElements: vi.fn(),
  getWeekdayElements: vi.fn(),
}));

// Mock SCSS
vi.mock("../../Calendar.module.scss", () => ({
  default: {
    calendarContainer: "calendarContainer",
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

describe("Days Component", () => {
  const mockSetObservedDate = vi.fn();
  const mockSetSelectedScene = vi.fn();
  const mockHandleDateChange = vi.fn();

  const defaultProps = {
    observedDate: DateTime.fromObject({ year: 2023, month: 5, day: 15 }),
    setObservedDate: mockSetObservedDate,
    setSelectedScene: mockSetSelectedScene,
    handleDateChange: mockHandleDateChange,
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
      if (format === "MMMM") return "May";
      if (format === "yyyy") return "2023";
      return "";
    });

    vi.mocked(dateUtils.subtractFromDate).mockReturnValue(
      DateTime.fromObject({ year: 2023, month: 4, day: 15 }),
    );
    vi.mocked(dateUtils.addToDate).mockReturnValue(
      DateTime.fromObject({ year: 2023, month: 6, day: 15 }),
    );
    vi.mocked(dateUtils.startOf).mockReturnValue(
      DateTime.fromObject({ year: 2023, month: 6, day: 1 }),
    );
    vi.mocked(dateUtils.endOf).mockReturnValue(
      DateTime.fromObject({ year: 2023, month: 4, day: 30 }),
    );

    vi.mocked(calendarUtils.getDayElements).mockReturnValue([<div key="mock-days">MockDays</div>]);
    vi.mocked(calendarUtils.getWeekdayElements).mockReturnValue([
      <div key="mock-weekdays">MockWeekdays</div>,
    ]);
  });

  it("should render correctly", () => {
    render(<Days {...defaultProps} />);

    expect(screen.getByText(/May\s+2023/)).toBeDefined();
    expect(screen.getByText("MockDays")).toBeDefined();
    expect(screen.getByText("MockWeekdays")).toBeDefined();
  });

  it("should handle title click", () => {
    render(<Days {...defaultProps} />);

    const title = screen.getByText(/May\s+2023/);
    fireEvent.click(title);

    expect(mockSetSelectedScene).toHaveBeenCalled();
  });

  it("should handle previous month click", () => {
    render(<Days {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    fireEvent.click(prevButton);

    expect(mockSetObservedDate).toHaveBeenCalled();
  });

  it("should handle next month click", () => {
    render(<Days {...defaultProps} />);

    const nextButton = screen.getByLabelText("Next");
    fireEvent.click(nextButton);

    expect(mockSetObservedDate).toHaveBeenCalled();
  });

  it("should pass props to DaysBody (indirect check via getDayElements)", () => {
    render(<Days {...defaultProps} />);

    expect(calendarUtils.getDayElements).toHaveBeenCalledWith(
      defaultProps.observedDate,
      defaultProps.selectedDate,
      defaultProps.handleDateChange,
      defaultProps.minDate,
      defaultProps.maxDate,
    );
  });

  it("should disable previous button if out of range", () => {
    // Mock endOf(subtractFromDate(...)) < minDate
    const prevMonthEnd = DateTime.fromObject({ year: 2019, month: 12, day: 31 });
    vi.mocked(dateUtils.endOf).mockReturnValue(prevMonthEnd);

    render(<Days {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button if out of range", () => {
    // Mock startOf(addToDate(...)) > maxDate
    const nextMonthStart = DateTime.fromObject({ year: 2031, month: 1, day: 1 });
    vi.mocked(dateUtils.startOf).mockReturnValue(nextMonthStart);

    render(<Days {...defaultProps} />);

    const nextButton = screen.getByLabelText("Next");
    expect(nextButton).toBeDisabled();
  });
});
