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
