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

import { describe, it, expect, vi } from "vitest";
import { DateTime } from "luxon";
import { getValidDates } from "./index";

describe("getValidDates", () => {
  it("should return parsed dates when valid dates are provided", () => {
    const minDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 });
    const maxDate = DateTime.fromObject({ year: 2023, month: 12, day: 31 });
    const currentMin = DateTime.fromObject({ year: 2023, month: 6, day: 1 });
    const currentMax = DateTime.fromObject({ year: 2023, month: 6, day: 30 });
    
    // Arguments: currentMinDate, currentMaxDate, minDate, maxDate
    const [resultMin, resultMax] = getValidDates(currentMin, currentMax, minDate, maxDate);
    
    expect(resultMin.toISODate()).toBe(currentMin.toISODate());
    expect(resultMax.toISODate()).toBe(currentMax.toISODate());
  });

  it("should clamp current dates to min/max", () => {
    const minDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 });
    const maxDate = DateTime.fromObject({ year: 2023, month: 12, day: 31 });
    
    // Current min before global min
    const currentMin = DateTime.fromObject({ year: 2022, month: 12, day: 1 });
    // Current max after global max
    const currentMax = DateTime.fromObject({ year: 2024, month: 1, day: 1 });
    
    const [resultMin, resultMax] = getValidDates(currentMin, currentMax, minDate, maxDate);
    
    expect(resultMin.toISODate()).toBe(minDate.toISODate());
    expect(resultMax.toISODate()).toBe(maxDate.toISODate());
  });

  it("should handle missing current dates by using min/max defaults", () => {
    const minDate = DateTime.fromObject({ year: 2023, month: 1, day: 1 });
    const maxDate = DateTime.fromObject({ year: 2023, month: 12, day: 31 });
    
    const [resultMin, resultMax] = getValidDates(undefined, undefined, minDate, maxDate);
    
    // Should default to min/max
    expect(resultMin.toISODate()).toBe(minDate.toISODate());
    expect(resultMax.toISODate()).toBe(maxDate.toISODate());
  });
  
  it("should handle invalid min >= max by resetting to defaults", () => {
      // This path triggers console.error and resets min/max to defaults (1970 and now + 10 years).
      // We can spy on console.error to avoid cluttering output.
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const minDate = DateTime.fromObject({ year: 2024, month: 1, day: 1 });
      const maxDate = DateTime.fromObject({ year: 2023, month: 12, day: 31 });
      
      const [resultMin, resultMax] = getValidDates(undefined, undefined, minDate, maxDate);
      
      // Defaults:
      // min: 1970-01-01
      // max: now() + 10 years.
      
      expect(resultMin.year).toBe(1970);
      expect(resultMax.year).toBeGreaterThan(2023); // Roughly now + 10
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
  });
});
