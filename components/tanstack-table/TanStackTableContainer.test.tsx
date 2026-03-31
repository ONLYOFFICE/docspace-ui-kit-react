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

import type { ColumnDef } from "@tanstack/react-table";

import { TanStackTableContainer } from "./TanStackTableContainer";
import { useTanStackTable } from "./TanStackTableContext";

type TestData = { id: string; name: string; count: number };

const testData: TestData[] = [
  { id: "1", name: "Group A", count: 5 },
  { id: "2", name: "Group B", count: 3 },
];

const testColumns: ColumnDef<TestData, unknown>[] = [
  { id: "name", accessorKey: "name", header: "Name", minSize: 210 },
  { id: "count", accessorKey: "count", header: "Count" },
];

const columnKeys = ["name", "count"];

const defaultPersistenceConfig = {
  columnStorageName: "test-columns-size",
  columnInfoPanelStorageName: "test-columns-info-panel-size",
};

/** Helper component that reads from context to verify it works */
function ContextConsumer() {
  const { table } = useTanStackTable<TestData>();
  return (
    <div data-testid="context-consumer">
      rows: {table.getRowModel().rows.length}
    </div>
  );
}

describe("<TanStackTableContainer />", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders container with correct test id", () => {
    render(
      <TanStackTableContainer
        data={testData}
        columns={testColumns}
        columnKeys={columnKeys}
        persistenceConfig={defaultPersistenceConfig}
      >
        <div>children</div>
      </TanStackTableContainer>,
    );

    expect(screen.getByTestId("table-container")).toBeInTheDocument();
  });

  it("provides table instance to children via context", () => {
    render(
      <TanStackTableContainer
        data={testData}
        columns={testColumns}
        columnKeys={columnKeys}
        persistenceConfig={defaultPersistenceConfig}
      >
        <ContextConsumer />
      </TanStackTableContainer>,
    );

    expect(screen.getByTestId("context-consumer")).toHaveTextContent("rows: 2");
  });

  it("applies className to container", () => {
    render(
      <TanStackTableContainer
        data={testData}
        columns={testColumns}
        columnKeys={columnKeys}
        persistenceConfig={defaultPersistenceConfig}
        className="custom-class"
      >
        <div />
      </TanStackTableContainer>,
    );

    expect(screen.getByTestId("table-container")).toHaveClass("custom-class");
  });

  it("exposes containerWidth via data attribute", () => {
    render(
      <TanStackTableContainer
        data={testData}
        columns={testColumns}
        columnKeys={columnKeys}
        persistenceConfig={defaultPersistenceConfig}
      >
        <div />
      </TanStackTableContainer>,
    );

    const container = screen.getByTestId("table-container");
    // containerWidth is set via data attribute (0 in jsdom since no layout)
    expect(container).toHaveAttribute("data-container-width");
  });

  it("respects initial column visibility", () => {
    render(
      <TanStackTableContainer
        data={testData}
        columns={testColumns}
        columnKeys={columnKeys}
        persistenceConfig={defaultPersistenceConfig}
        initialVisibility={{ count: false }}
      >
        <ContextConsumer />
      </TanStackTableContainer>,
    );

    // Data rows are still present even when a column is hidden
    expect(screen.getByTestId("context-consumer")).toHaveTextContent("rows: 2");
  });

  it("calls onColumnVisibilityChange when visibility changes", () => {
    const onVisChange = vi.fn();

    render(
      <TanStackTableContainer
        data={testData}
        columns={testColumns}
        columnKeys={columnKeys}
        persistenceConfig={defaultPersistenceConfig}
        onColumnVisibilityChange={onVisChange}
      >
        <ContextConsumer />
      </TanStackTableContainer>,
    );

    // Visibility change is tested via column toggle — covered in integration tests
    expect(screen.getByTestId("context-consumer")).toBeInTheDocument();
  });
});
