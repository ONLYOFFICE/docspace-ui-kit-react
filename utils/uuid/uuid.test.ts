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

import { describe, expect, it } from "vitest";

import { uuid } from ".";

describe("uuid", () => {
  describe("format", () => {
    it("returns a string", () => {
      const result = uuid();

      expect(typeof result).toBe("string");
    });

    it("returns a string with 36 characters", () => {
      const result = uuid();

      expect(result.length).toBe(36);
    });

    it("returns a string with hyphens at correct positions", () => {
      const result = uuid();

      expect(result[8]).toBe("-");
      expect(result[13]).toBe("-");
      expect(result[18]).toBe("-");
      expect(result[23]).toBe("-");
    });

    it("matches UUID v4 format pattern", () => {
      const result = uuid();
      const uuidV4Pattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;

      expect(result).toMatch(uuidV4Pattern);
    });

    it("has version 4 identifier at position 14", () => {
      const result = uuid();

      expect(result[14]).toBe("4");
    });

    it("contains only valid hexadecimal characters and hyphens", () => {
      const result = uuid();
      const validChars = /^[0-9a-f-]+$/;

      expect(result).toMatch(validChars);
    });
  });

  describe("uniqueness", () => {
    it("generates unique values on each call", () => {
      const uuid1 = uuid();
      const uuid2 = uuid();

      expect(uuid1).not.toBe(uuid2);
    });

    it("generates unique values across multiple calls", () => {
      const uuids = new Set<string>();
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        uuids.add(uuid());
      }

      expect(uuids.size).toBe(iterations);
    });
  });

  describe("structure", () => {
    it("has five groups separated by hyphens", () => {
      const result = uuid();
      const groups = result.split("-");

      expect(groups.length).toBe(5);
    });

    it("has correct length for each group", () => {
      const result = uuid();
      const groups = result.split("-");

      expect(groups[0].length).toBe(8);
      expect(groups[1].length).toBe(4);
      expect(groups[2].length).toBe(4);
      expect(groups[3].length).toBe(4);
      expect(groups[4].length).toBe(12);
    });
  });
});
