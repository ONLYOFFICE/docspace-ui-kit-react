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
import { getMonthElements } from "./index";
import * as dateUtils from "../../../../utils/date";

vi.mock("../../../../utils/date", async (importOriginal) => {
  const actual = await importOriginal<typeof dateUtils>();
  return {
    ...actual,
    now: vi.fn(),
  };
});

describe("getMonthElements", () => {
    // Mock now to be 2023-05-15 (May 2023 is current)
    const mockNow = DateTime.fromObject({ year: 2023, month: 5, day: 15 });

    beforeEach(() => {
        vi.mocked(dateUtils.now).mockReturnValue(mockNow);
    });
    // 2023-01-01
    const mockSelectedDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 });
    const mockMinDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 });
    const mockMaxDate = DateTime.fromObject({ year: 2025, month: 12, day: 31 });
    const setObservedDate = vi.fn();
    const setSelectedScene = vi.fn();

    const months = [
        { key: "2023-1", value: "Jan" },
        { key: "2023-2", value: "Feb" },
        { key: "2023-3", value: "Mar" },
        { key: "2023-4", value: "Apr" },
        { key: "2023-5", value: "May" },
        { key: "2023-6", value: "Jun" },
        { key: "2023-7", value: "Jul" },
        { key: "2023-8", value: "Aug" },
        { key: "2023-9", value: "Sep" },
        { key: "2023-10", value: "Oct" },
        { key: "2023-11", value: "Nov" },
        { key: "2023-12", value: "Dec" },
        { key: "2024-1", value: "Jan" },
        { key: "2024-2", value: "Feb" },
        { key: "2024-3", value: "Mar" },
        { key: "2024-4", value: "Apr" },
    ];

    it("should render month elements", () => {
        const elements = getMonthElements(months, setObservedDate, setSelectedScene, mockSelectedDate, mockMinDate, mockMaxDate);
        render(<>{elements}</>);

        expect(screen.getAllByText("Jan")).toHaveLength(2); // One effectively for 2023, one for 2024
        expect(screen.getByText("Dec")).toBeDefined();

        // 16 months total
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(16);
    });

    it("should handle month clicks for various types", () => {
        const elements = getMonthElements(months, setObservedDate, setSelectedScene, mockSelectedDate, mockMinDate, mockMaxDate);
        render(<>{elements}</>);

        const janButtons = screen.getAllByText("Jan");
        const jan2023 = janButtons[0];
        fireEvent.click(jan2023);
        expect(setObservedDate).toHaveBeenCalled();
        setObservedDate.mockClear();

        const jan2024 = janButtons[1];
        fireEvent.click(jan2024);
        expect(setObservedDate).toHaveBeenCalled();
        setObservedDate.mockClear();

        const mayButton = screen.getByText("May").closest('button');
        if (mayButton) {
            fireEvent.click(mayButton);
            expect(setObservedDate).toHaveBeenCalled();
            setObservedDate.mockClear();
        } else {
            throw new Error("May button not found");
        }
    });

    it("should disable months outside min/max range", () => {
       // Min date is mid-2023
       const restrictiveMin = DateTime.fromObject({ year: 2023, month: 6, day: 1 });
       const elements = getMonthElements(months, setObservedDate, setSelectedScene, mockSelectedDate, restrictiveMin, mockMaxDate);
       render(<>{elements}</>);

       // Jan 2023 (index 0) should be disabled
       const janButton = screen.getAllByText("Jan")[0].closest('button');
       expect(janButton).toBeDisabled();

       // Jul 2023 (index 6) should be enabled
       const julButton = screen.getByText("Jul").closest('button');
       expect(julButton).not.toBeDisabled();
    });
});
