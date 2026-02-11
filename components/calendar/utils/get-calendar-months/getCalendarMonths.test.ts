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
