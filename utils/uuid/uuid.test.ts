// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
