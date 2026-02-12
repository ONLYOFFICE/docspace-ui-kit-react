/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DateTime } from "luxon";
import { Years } from "./Years";
import * as dateUtils from "../../../../utils/date";
import * as calendarUtils from "../../utils";

// Mock date utils
vi.mock("../../../../utils/date", async (importOriginal) => {
  const actual = await importOriginal<typeof dateUtils>();
  return {
    ...actual,
    subtractFromDate: vi.fn(),
    addToDate: vi.fn(),
    endOf: vi.fn(),
    createDateTime: vi.fn(),
  };
});

// Mock calendar utils
vi.mock("../../utils", () => ({
  getCalendarYears: vi.fn(),
  getYearElements: vi.fn(),
}));

// Mock SCSS
vi.mock("../../Calendar.module.scss", () => ({
  default: {
    calendarContainer: "calendarContainer",
    big: "big",
    isScroll: "isScroll",
    headerContainer: "headerContainer",
    title: "title",
    disabled: "disabled",
    headerActionIcon: "headerActionIcon",
    buttonsContainer: "buttonsContainer",
    roundButton: "roundButton",
    arrowIcon: "arrowIcon",
    prev: "prev",
    next: "next",
  },
}));

describe("Years Component", () => {
  const mockSetObservedDate = vi.fn();
  const mockSetSelectedScene = vi.fn();

  const defaultProps = {
    observedDate: DateTime.fromObject({ year: 2023, month: 5, day: 15 }),
    setObservedDate: mockSetObservedDate,
    setSelectedScene: mockSetSelectedScene,
    selectedDate: DateTime.fromObject({ year: 2023, month: 5, day: 15 }),
    minDate: DateTime.fromObject({ year: 2000, month: 1, day: 1 }),
    maxDate: DateTime.fromObject({ year: 2050, month: 12, day: 31 }),
    isMobile: false,
    isScroll: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    vi.mocked(dateUtils.subtractFromDate).mockReturnValue(
      DateTime.fromObject({ year: 2013, month: 5, day: 15 }),
    );
    vi.mocked(dateUtils.addToDate).mockReturnValue(
      DateTime.fromObject({ year: 2033, month: 5, day: 15 }),
    );
    vi.mocked(dateUtils.endOf).mockReturnValue(
      DateTime.fromObject({ year: 2022, month: 12, day: 31 }),
    );
    vi.mocked(dateUtils.createDateTime).mockImplementation((year, month, day) =>
      DateTime.fromObject({ year, month, day }),
    );

    const mockYears = ["2023", "2024", "2025"];
    vi.mocked(calendarUtils.getCalendarYears).mockReturnValue(mockYears);
    vi.mocked(calendarUtils.getYearElements).mockReturnValue([
      <div key="mock-years">MockYears</div>,
    ]);
  });

  it("should render correctly", () => {
    render(<Years {...defaultProps} />);

    expect(screen.getByText("2023-2032")).toBeDefined();
    expect(screen.getByText("MockYears")).toBeDefined();
  });

  it("should handle previous decade click", () => {
    render(<Years {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    fireEvent.click(prevButton);

    expect(mockSetObservedDate).toHaveBeenCalled();
  });

  it("should handle next decade click", () => {
    render(<Years {...defaultProps} />);

    const nextButton = screen.getByLabelText("Next");
    fireEvent.click(nextButton);

    expect(mockSetObservedDate).toHaveBeenCalled();
  });

  it("should pass props to YearsBody (indirect check via getYearElements)", () => {
    const mockYears = ["2023", "2024", "2025"];
    vi.mocked(calendarUtils.getCalendarYears).mockReturnValue(mockYears);

    render(<Years {...defaultProps} />);

    expect(calendarUtils.getYearElements).toHaveBeenCalledWith(
      mockYears,
      defaultProps.setObservedDate,
      defaultProps.setSelectedScene,
      defaultProps.selectedDate,
      defaultProps.minDate,
      defaultProps.maxDate,
    );
  });

  it("should disable previous button if out of range", () => {
    // Mock prevYearEnd < minDate
    const prevYearEnd = DateTime.fromObject({ year: 1999, month: 12, day: 31 });
    vi.mocked(dateUtils.endOf).mockReturnValue(prevYearEnd);

    render(<Years {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button if out of range", () => {
    // Mock nextYearStart > maxDate
    vi.mocked(dateUtils.createDateTime).mockImplementation((year, month, day) => {
      if (year === 2033) {
        return DateTime.fromObject({ year: 2051, month: 1, day: 1 });
      }
      return DateTime.fromObject({ year, month, day });
    });

    render(<Years {...defaultProps} />);

    const nextButton = screen.getByLabelText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("should display year range correctly", () => {
    render(<Years {...defaultProps} />);

    // Year range should be observedDate.year to observedDate.year + 9
    expect(screen.getByText("2023-2032")).toBeDefined();
  });
});
