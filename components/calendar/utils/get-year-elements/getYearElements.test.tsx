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
import { getYearElements } from "./index";
import * as dateUtils from "../../../../utils/date";

vi.mock("../../../../utils/date", async (importOriginal) => {
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
