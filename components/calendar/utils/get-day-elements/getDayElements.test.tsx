
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
import styles from "../../Calendar.module.scss";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DateTime } from "luxon";
import { getDayElements } from "./index";

describe("getDayElements", () => {
    const mockObservedDate = DateTime.fromObject({ year: 2023, month: 10, day: 1 });
    const mockSelectedDate = DateTime.fromObject({ year: 2023, month: 10, day: 15 });
    const mockMinDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 });
    const mockMaxDate = DateTime.fromObject({ year: 2023, month: 12, day: 31 });
    const handleDateChange = vi.fn();

    it("should render day elements", () => {
        const elements = getDayElements(mockObservedDate, mockSelectedDate, handleDateChange, mockMinDate, mockMaxDate);
        
        // getDayElements returns an array of React elements. To test them with RTL, we wrap them in a fragment.
        render(<>{elements}</>);
        
        // Check for specific days
        // Check for specific days. "1" appears twice (Oct 1, Nov 1). "31" appears once (Oct 31).
        expect(screen.getAllByText("1").length).toBeGreaterThan(0);
        expect(screen.getAllByText("15").length).toBeGreaterThan(0);
        expect(screen.getByText("31")).toBeDefined();
        
        // Check for correct number of buttons (should be 42)
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(42);
    });

    it("should handle date clicks for all day types", () => {
        const elements = getDayElements(mockObservedDate, mockSelectedDate, handleDateChange, mockMinDate, mockMaxDate);
        render(<>{elements}</>);
        
        const day10 = screen.getByText("10");
        fireEvent.click(day10);
        expect(handleDateChange).toHaveBeenCalledWith(expect.objectContaining({ day: 10 }));
        handleDateChange.mockClear();

        const days29 = screen.getAllByText("29");
        const prevMonthDay29 = days29[0];
        fireEvent.click(prevMonthDay29);
        expect(handleDateChange).toHaveBeenCalledWith(expect.objectContaining({ day: 29, month: 9 }));
        handleDateChange.mockClear();

        const days2 = screen.getAllByText("2");
        const nextMonthDay2 = days2[days2.length - 1]; 
        fireEvent.click(nextMonthDay2);
        expect(handleDateChange).toHaveBeenCalledWith(expect.objectContaining({ day: 2, month: 11 }));
        handleDateChange.mockClear();
        
        const day15 = screen.getAllByText("15").find(el => !el.closest('button')?.hasAttribute('disabled'));
        if (day15) {
             fireEvent.click(day15);
             expect(handleDateChange).toHaveBeenCalledWith(expect.objectContaining({ day: 15, month: 10 }));
             handleDateChange.mockClear();
        }
    });

    it("should mark disabled dates", () => {
        // Set min date to Oct 10, max to Oct 20.
        // Days before 10 and after 20 should be disabled.
        const restrictiveMin = DateTime.fromObject({ year: 2023, month: 10, day: 10 });
        const restrictiveMax = DateTime.fromObject({ year: 2023, month: 10, day: 20 });
        
        const elements = getDayElements(mockObservedDate, mockSelectedDate, handleDateChange, restrictiveMin, restrictiveMax);
        render(<>{elements}</>);
        
        // Both Oct 5 and Nov 5 should be disabled (Oct 5 < min, Nov 5 > max)
        const days5 = screen.getAllByText("5");
        expect(days5.length).toBeGreaterThan(0);
        days5.forEach(day => {
            expect(day.closest('button')).toBeDisabled();
        });
        
        // Day 15 should be enabled
        const days15 = screen.getAllByText("15").filter(el => !el.closest('button')?.classList.contains(styles.disabled) && !el.closest('button')?.disabled);
        // Wait, checking if enabled.
        // We expect at least one enabled 15 (Oct 15).
        // Since we don't know classes details easily in test (identity-obj-proxy or similar might effectively return null for styles),
        // we rely on 'disabled' attribute.
        
        const day15Buttons = screen.getAllByText("15").map(el => el.closest('button'));
        // One of them (Oct 15) should be enabled.
        const enabled15 = day15Buttons.find(b => !b?.hasAttribute('disabled'));
        expect(enabled15).toBeDefined();

        // Day 25 should be disabled (Oct 25 > Oct 20)
        const days25 = screen.getAllByText("25");
        days25.forEach(day => {
            expect(day.closest('button')).toBeDisabled();
        });
    });
});
