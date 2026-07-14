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
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "./index";
import {
  now,
  createDateTime,
  addToDate,
  startOf,
} from "../../utils/date";

// Mock selector-add-button
vi.mock("../add-button", () => ({
  AddButton: ({
    children,
    // ...props
  }: {
    children: React.ReactNode;
  }) => <div data-testid="mock-selector-add-button">{children}</div>,
}));

describe("DatePicker tests", () => {
  const defaultProps = {
    maxDate: startOf(addToDate(now(), 10, "years")!, "year")!.toJSDate(),
    minDate: new Date("1970-01-01"),
    openDate: now(),
    locale: "en",
    selectDateText: "Select date",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without selected date", () => {
    render(<DatePicker {...defaultProps} />);

    const datePicker = screen.getByTestId("date-picker");
    const dateSelector = screen.getByTestId("date-selector");

    expect(datePicker).toBeInTheDocument();
    expect(dateSelector).toHaveAttribute("role", "button");
    expect(dateSelector).toHaveAttribute("aria-label", "Select date");
    expect(dateSelector).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("selected-item")).not.toBeInTheDocument();
  });

  it("renders with initial date", () => {
    const initialDate = createDateTime(2024, 1, 15);
    render(
      <DatePicker
        initialDate={initialDate}
        outerDate={initialDate}
        showCalendarIcon={false}
        {...defaultProps}
      />,
    );

    const selectedItem = screen.getByTestId("selected-item");
    expect(selectedItem).toBeInTheDocument();
    expect(selectedItem).toHaveTextContent("15 Jan 2024");
  });

  it("shows calendar icon when enabled", () => {
    const initialDate = createDateTime(2024, 1, 15);
    render(
      <DatePicker
        initialDate={initialDate}
        outerDate={initialDate}
        showCalendarIcon
        {...defaultProps}
      />,
    );

    const calendarIcon = screen.getByTestId("calendar-icon");
    const selectedLabel = screen.getByTestId("selected-label");

    expect(calendarIcon).toBeInTheDocument();
    expect(selectedLabel).toContainElement(calendarIcon);
  });

  it("opens calendar on click and handles date selection", async () => {
    const onChange = vi.fn();
    render(<DatePicker {...defaultProps} onChange={onChange} />);

    const dateSelector = screen.getByTestId("date-selector");
    expect(dateSelector).toHaveAttribute("aria-expanded", "false");

    // Open calendar
    await userEvent.click(dateSelector);

    // Check if calendar is open
    const calendar = screen.getByTestId("calendar");
    expect(calendar).toBeInTheDocument();
    expect(dateSelector).toHaveAttribute("aria-expanded", "true");

    // Close by clicking outside
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByTestId("calendar")).not.toBeInTheDocument();
      expect(dateSelector).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("handles date deletion", async () => {
    const onChange = vi.fn();
    const initialDate = createDateTime(2024, 1, 15);
    const { rerender } = render(
      <DatePicker
        {...defaultProps}
        initialDate={initialDate}
        outerDate={initialDate}
        onChange={onChange}
      />,
    );

    const selectedItem = screen.getByTestId("selected-item");
    const closeButton = selectedItem.querySelector(".selected-tag-removed");
    expect(closeButton).toBeInTheDocument();

    await userEvent.click(closeButton!);

    expect(onChange).toHaveBeenCalledWith(null);

    rerender(
      <DatePicker
        {...defaultProps}
        initialDate={initialDate}
        onChange={onChange}
      />,
    );

    expect(screen.queryByTestId("selected-item")).not.toBeInTheDocument();
    expect(screen.getByTestId("date-selector")).toBeInTheDocument();
  });

  it("updates date when outerDate prop changes", async () => {
    const initialDate = createDateTime(2024, 1, 15);
    const { rerender } = render(
      <DatePicker
        {...defaultProps}
        initialDate={initialDate}
        outerDate={initialDate}
        showCalendarIcon={false}
      />,
    );

    expect(screen.getByTestId("selected-item")).toHaveTextContent(
      "15 Jan 2024",
    );

    const newInitialDate = createDateTime(2024, 2, 1);

    rerender(
      <DatePicker
        {...defaultProps}
        initialDate={newInitialDate}
        outerDate={newInitialDate}
        showCalendarIcon={false}
      />,
    );

    await waitFor(() => {
      const selectedItem = screen.getByTestId("selected-item");
      expect(selectedItem).toHaveTextContent("01 Feb 2024");
    });
  });

  it("applies custom className and id", () => {
    const customClass = "custom-date-picker";
    const customId = "custom-date-picker-id";

    render(
      <DatePicker {...defaultProps} className={customClass} id={customId} />,
    );

    const datePicker = screen.getByTestId("date-picker");
    expect(datePicker).toHaveClass(customClass);
    expect(datePicker).toHaveAttribute("id", customId);
  });
});
