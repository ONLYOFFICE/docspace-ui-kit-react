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

import { describe, it, expect, beforeEach } from "vitest";

import {
  parseGridTemplateColumns,
  migrateGridTemplateToSizing,
  sizingToGridTemplate,
  isLegacyFormat,
  readSizingFromStorage,
  writeSizingToStorage,
} from "./storageMigration";

describe("parseGridTemplateColumns", () => {
  it("parses space-separated px values", () => {
    expect(parseGridTemplateColumns("300px 200px 150px 24px")).toEqual([
      300, 200, 150, 24,
    ]);
  });

  it("handles decimal values", () => {
    expect(
      parseGridTemplateColumns("458.4px 305.6px 382px 24px"),
    ).toEqual([458.4, 305.6, 382, 24]);
  });

  it("handles 0px values", () => {
    expect(parseGridTemplateColumns("300px 0px 200px 24px")).toEqual([
      300, 0, 200, 24,
    ]);
  });

  it("returns empty array for empty string", () => {
    expect(parseGridTemplateColumns("")).toEqual([]);
  });
});

describe("migrateGridTemplateToSizing", () => {
  it("maps grid template values to column keys", () => {
    const result = migrateGridTemplateToSizing(
      "340px 200px 200px 24px",
      ["Name", "People", "Head of Group"],
    );

    expect(result).toEqual({
      "Name": 340,
      "People": 200,
      "Head of Group": 200,
    });
  });

  it("skips the settings column at end (legacy 24px or new 24px)", () => {
    // Legacy format with 24px settings
    const result1 = migrateGridTemplateToSizing(
      "400px 300px 24px",
      ["Name", "Type"],
    );
    expect(result1).toEqual({ Name: 400, Type: 300 });

    // New format with 24px settings
    const result2 = migrateGridTemplateToSizing(
      "400px 300px 24px",
      ["Name", "Type"],
    );
    expect(result2).toEqual({ Name: 400, Type: 300 });
  });

  it("handles 0px columns (disabled)", () => {
    const result = migrateGridTemplateToSizing(
      "400px 0px 300px 24px",
      ["Name", "Type", "Email"],
    );

    expect(result).toEqual({ Name: 400, Type: 0, Email: 300 });
  });

  it("handles more keys than values gracefully", () => {
    const result = migrateGridTemplateToSizing(
      "400px 24px",
      ["Name", "Type", "Email"],
    );

    expect(result).toEqual({ Name: 400 });
  });
});

describe("sizingToGridTemplate", () => {
  it("converts sizing state back to grid template", () => {
    const result = sizingToGridTemplate(
      { Name: 340, People: 200, "Head of Group": 200 },
      ["Name", "People", "Head of Group"],
    );

    expect(result).toBe("340px 200px 200px 24px");
  });

  it("uses default size for missing columns", () => {
    const result = sizingToGridTemplate(
      { Name: 340 },
      ["Name", "People"],
      150,
    );

    expect(result).toBe("340px 150px 24px");
  });

  it("always appends settings column", () => {
    const result = sizingToGridTemplate({ Name: 500 }, ["Name"]);

    expect(result).toBe("500px 24px");
  });
});

describe("isLegacyFormat", () => {
  it("returns true for px-based strings", () => {
    expect(isLegacyFormat("300px 200px 24px")).toBe(true);
  });

  it("returns false for JSON objects", () => {
    expect(isLegacyFormat('{"Name":300,"People":200}')).toBe(false);
  });

  it("returns false for empty strings", () => {
    expect(isLegacyFormat("")).toBe(false);
  });
});

describe("readSizingFromStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when key does not exist", () => {
    expect(readSizingFromStorage("nonexistent", ["Name"])).toBeNull();
  });

  it("reads and migrates legacy format", () => {
    localStorage.setItem("test-key", "300px 200px 24px");

    const result = readSizingFromStorage("test-key", [
      "Name",
      "People",
    ]);

    expect(result).toEqual({ Name: 300, People: 200 });
  });

  it("reads JSON format directly", () => {
    localStorage.setItem(
      "test-key",
      JSON.stringify({ Name: 400, Type: 200 }),
    );

    const result = readSizingFromStorage("test-key", ["Name", "Type"]);

    expect(result).toEqual({ Name: 400, Type: 200 });
  });

  it("returns null for invalid JSON", () => {
    localStorage.setItem("test-key", "{invalid json");

    expect(readSizingFromStorage("test-key", ["Name"])).toBeNull();
  });
});

describe("writeSizingToStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("writes legacy format when dualWrite is true", () => {
    writeSizingToStorage(
      "test-key",
      { Name: 300, People: 200 },
      ["Name", "People"],
      true,
    );

    expect(localStorage.getItem("test-key")).toBe("300px 200px 24px");
  });

  it("writes JSON format when dualWrite is false", () => {
    writeSizingToStorage(
      "test-key",
      { Name: 300, People: 200 },
      ["Name", "People"],
      false,
    );

    expect(localStorage.getItem("test-key")).toBe(
      JSON.stringify({ Name: 300, People: 200 }),
    );
  });
});
