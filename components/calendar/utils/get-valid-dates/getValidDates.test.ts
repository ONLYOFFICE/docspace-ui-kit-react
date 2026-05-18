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
