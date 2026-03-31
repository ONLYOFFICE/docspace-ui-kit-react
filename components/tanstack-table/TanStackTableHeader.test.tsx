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

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { ColumnDef } from "@tanstack/react-table";

import { TanStackTableContainer } from "./TanStackTableContainer";
import { TanStackTableHeader } from "./TanStackTableHeader";

type TestData = { id: string; name: string; count: number; manager: string };

const testData: TestData[] = [
  { id: "1", name: "Group A", count: 5, manager: "Alice" },
];

const onClickMock = vi.fn();

const testColumns: ColumnDef<TestData, unknown>[] = [
  {
    id: "Name",
    accessorKey: "name",
    header: "Name",
    minSize: 210,
    enableResizing: true,
    meta: { legacyKey: "Name", sortBy: "title", isDefault: true, onClick: onClickMock },
  },
  {
    id: "People",
    accessorKey: "count",
    header: "Members",
    enableResizing: true,
    meta: { legacyKey: "People", sortBy: "membersCount", isDefault: false },
  },
  {
    id: "Manager",
    accessorKey: "manager",
    header: "Head of Group",
    enableResizing: true,
    meta: { legacyKey: "Manager", sortBy: "manager", isDefault: false },
  },
];

const columnKeys = ["Name", "People", "Manager"];
const persistenceConfig = {
  columnStorageName: "test-header-columns",
};

function renderHeader(props?: Partial<React.ComponentProps<typeof TanStackTableHeader>>) {
  return render(
    <TanStackTableContainer
      data={testData}
      columns={testColumns}
      columnKeys={columnKeys}
      persistenceConfig={persistenceConfig}
    >
      <TanStackTableHeader {...props} />
    </TanStackTableContainer>,
  );
}

describe("<TanStackTableHeader />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders header with correct test id", () => {
    renderHeader();
    expect(screen.getByTestId("table-header")).toBeInTheDocument();
  });

  it("renders all column headers", () => {
    renderHeader();

    expect(screen.getByTestId("column-Name")).toBeInTheDocument();
    expect(screen.getByTestId("column-People")).toBeInTheDocument();
    expect(screen.getByTestId("column-Manager")).toBeInTheDocument();
  });

  it("renders column header text", () => {
    renderHeader();

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Members")).toBeInTheDocument();
    expect(screen.getByText("Head of Group")).toBeInTheDocument();
  });

  it("renders settings block when showSettings is true", () => {
    renderHeader({ showSettings: true });
    expect(screen.getByTestId("settings-block")).toBeInTheDocument();
  });

  it("does not render settings block when showSettings is false", () => {
    renderHeader({ showSettings: false });
    expect(screen.queryByTestId("settings-block")).not.toBeInTheDocument();
  });

  it("applies settingsTitle to settings block", () => {
    renderHeader({ showSettings: true, settingsTitle: "Column Settings" });
    expect(screen.getByTestId("settings-block")).toHaveAttribute(
      "title",
      "Column Settings",
    );
  });

  it("renders resize handles on resizable columns", () => {
    renderHeader();
    const handles = screen.getAllByTestId("resize-handle");
    expect(handles.length).toBeGreaterThan(0);
  });

  it("calls column onClick when header text is clicked", async () => {
    renderHeader();

    const nameColumn = screen.getByTestId("column-Name");
    const textWrapper = nameColumn.querySelector(".header-container-text")?.parentElement;
    expect(textWrapper).toBeTruthy();

    await userEvent.click(textWrapper!);
    expect(onClickMock).toHaveBeenCalledWith("title", expect.any(Object));
  });

  it("applies gridTemplateColumns style", () => {
    renderHeader();
    const header = screen.getByTestId("table-header");
    const grid = header.style.gridTemplateColumns;
    expect(grid).toContain("px");
    // Should have 3 columns + settings
    const parts = grid.split(" ").filter(Boolean);
    expect(parts).toHaveLength(4);
    expect(parts[3]).toBe("24px");
  });
});
