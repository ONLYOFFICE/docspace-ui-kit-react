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

import { describe, it, expect } from "vitest";
import { DateTime } from "luxon";
import { getCalendarMonths } from "./index";

describe("getCalendarMonths", () => {
  // Mock date: 2023-05-15
  const mockDate = DateTime.fromObject({ year: 2023, month: 5, day: 15 });

  it("should return 12 months for current year and 4 months from next year", () => {
    const result = getCalendarMonths(mockDate);
    
    // Total 16 months
    expect(result).toHaveLength(16);
    
    // Check first month (Jan 2023)
    expect(result[0].key).toBe("2023-1");
    
    // Check last month of current year (Dec 2023)
    expect(result[11].key).toBe("2023-12");
    
    // Check first month of next year (Jan 2024)
    expect(result[12].key).toBe("2024-1");
    
    // Check last month of next year subset (Apr 2024)
    expect(result[15].key).toBe("2024-4");
  });

  it("should capitalize month names", () => {
    const result = getCalendarMonths(mockDate);
    // Utility does: month[0].toUpperCase() + month.substring(1)
    
    const firstMonthName = result[0].value;
    expect(firstMonthName[0]).toBe(firstMonthName[0].toUpperCase());
  });
});
