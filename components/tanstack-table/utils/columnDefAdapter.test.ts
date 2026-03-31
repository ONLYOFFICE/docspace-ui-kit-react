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

import { describe, it, expect, vi } from "vitest";

import type { TTableColumn } from "../../table/Table.types";

import {
  adaptLegacyColumns,
  extractVisibility,
  findDefaultColumnKey,
} from "./columnDefAdapter";

const mockColumns: TTableColumn[] = [
  {
    key: "Name",
    title: "Name",
    resizable: true,
    enable: true,
    default: true,
    sortBy: "title",
    minWidth: 210,
    onClick: vi.fn(),
  },
  {
    key: "People",
    title: "Members",
    enable: true,
    sortBy: "membersCount",
    resizable: true,
    onChange: vi.fn(),
  },
  {
    key: "Head of Group",
    title: "Head of Group",
    enable: false,
    sortBy: "manager",
    resizable: true,
    onChange: vi.fn(),
  },
];

describe("adaptLegacyColumns", () => {
  it("converts legacy columns to TanStack ColumnDef format", () => {
    const result = adaptLegacyColumns(mockColumns);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("Name");
    expect(result[1].id).toBe("People");
    expect(result[2].id).toBe("Head of Group");
  });

  it("maps header title", () => {
    const result = adaptLegacyColumns(mockColumns);

    expect(result[0].header).toBe("Name");
    expect(result[1].header).toBe("Members");
  });

  it("maps resizable flag", () => {
    const result = adaptLegacyColumns(mockColumns);

    expect(result[0].enableResizing).toBe(true);
  });

  it("maps enableSorting from sortBy presence", () => {
    const result = adaptLegacyColumns(mockColumns);

    expect(result[0].enableSorting).toBe(true);
  });

  it("sets enableSorting false when no sortBy", () => {
    const cols: TTableColumn[] = [
      { key: "X", title: "X", enable: true },
    ];
    const result = adaptLegacyColumns(cols);

    expect(result[0].enableSorting).toBe(false);
  });

  it("maps minWidth from column definition", () => {
    const result = adaptLegacyColumns(mockColumns);

    expect(result[0].minSize).toBe(210);
  });

  it("uses DEFAULT_MIN_COLUMN_SIZE when no minWidth specified", () => {
    const result = adaptLegacyColumns(mockColumns);

    expect(result[1].minSize).toBe(110);
  });

  it("preserves legacy callbacks in meta", () => {
    const result = adaptLegacyColumns(mockColumns);
    const meta = result[0].meta as Record<string, unknown>;

    expect(meta.legacyKey).toBe("Name");
    expect(meta.sortBy).toBe("title");
    expect(meta.isDefault).toBe(true);
    expect(typeof meta.onClick).toBe("function");
  });

  it("marks non-default columns correctly in meta", () => {
    const result = adaptLegacyColumns(mockColumns);
    const meta = result[1].meta as Record<string, unknown>;

    expect(meta.isDefault).toBe(false);
  });
});

describe("extractVisibility", () => {
  it("returns visibility state from legacy columns", () => {
    const result = extractVisibility(mockColumns);

    expect(result).toEqual({
      "Name": true,
      "People": true,
      "Head of Group": false,
    });
  });

  it("treats undefined enable as true", () => {
    const cols: TTableColumn[] = [
      { key: "X", title: "X" },
    ];
    const result = extractVisibility(cols);

    expect(result.X).toBe(true);
  });
});

describe("findDefaultColumnKey", () => {
  it("finds the column with default: true", () => {
    expect(findDefaultColumnKey(mockColumns)).toBe("Name");
  });

  it("returns undefined when no default column exists", () => {
    const cols: TTableColumn[] = [
      { key: "A", title: "A", enable: true },
    ];
    expect(findDefaultColumnKey(cols)).toBeUndefined();
  });
});
