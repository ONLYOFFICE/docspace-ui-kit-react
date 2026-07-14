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

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TableRow } from "./TableRow";

const contextOptions = [
  {
    key: "edit",
    label: "Edit",
    onClick: () => console.log("Edit clicked"),
  },
  {
    key: "delete",
    label: "Delete",
    onClick: () => console.log("Delete clicked"),
  },
];

const mockFileContextClick = vi.fn();

vi.mock("@docspace/ui-kit/components/context-menu", () => ({
  __esModule: true,
  ContextMenu: () => <div />,
}));

vi.mock("classnames", () => ({
  default: (...args: string[]) => args.join(" "),
}));

describe("<TableRow />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without errors", () => {
    render(<TableRow>Table row</TableRow>);

    expect(screen.getByTestId("table-row")).toBeInTheDocument();
  });

  it("renders context menu button if there are contextOptions", () => {
    render(<TableRow contextOptions={contextOptions}>Table row</TableRow>);

    expect(screen.getByTestId("context-menu-button")).toBeInTheDocument();
  });

  it("doesn't render context menu button if contextOptions are empty", () => {
    render(<TableRow contextOptions={[]}>Table row</TableRow>);

    expect(screen.queryByTestId("context-menu-button")).not.toBeInTheDocument();
  });

  it("calls fileContextClick with false when context menu button is clicked", async () => {
    render(
      <TableRow
        contextOptions={contextOptions}
        fileContextClick={mockFileContextClick}
      >
        Table row
      </TableRow>,
    );

    const contextButton = screen.getByTestId("context-menu-button");
    await userEvent.click(contextButton);

    expect(mockFileContextClick).toHaveBeenCalledWith(false);
  });

  it("calls fileContextClick with true when right mouse button on table row clicked", async () => {
    render(
      <TableRow
        contextOptions={contextOptions}
        fileContextClick={mockFileContextClick}
      >
        Table row
      </TableRow>,
    );

    const tableRow = screen.getByTestId("table-row");
    await userEvent.pointer({ keys: "[MouseRight]", target: tableRow });

    expect(mockFileContextClick).toHaveBeenCalledWith(true);
  });

  it("calls onDoubleClick when double-click on table row", async () => {
    const onDoubleClick = vi.fn();

    render(<TableRow onDoubleClick={onDoubleClick}>Table row</TableRow>);

    const tableRow = screen.getByTestId("table-row");

    await userEvent.dblClick(tableRow);

    expect(onDoubleClick).toHaveBeenCalled();
  });

  it("calls onClick when click on table row", async () => {
    const onClick = vi.fn();

    render(<TableRow onClick={onClick}>Table row</TableRow>);

    const tableRow = screen.getByTestId("table-row");

    await userEvent.click(tableRow);

    expect(onClick).toHaveBeenCalled();
  });

  it("applies style prop to table row", () => {
    const style = { backgroundColor: "red" };

    render(<TableRow style={style}>Table row</TableRow>);

    const tableRow = screen.getByTestId("table-row");

    expect(tableRow.style.backgroundColor).toBe("red");
  });

  it("passes contextMenuCellStyle as style to TableCell", () => {
    const contextMenuCellStyle = { backgroundColor: "blue" };

    render(
      <TableRow contextMenuCellStyle={contextMenuCellStyle}>
        Table row
      </TableRow>,
    );

    const cell = screen.getByTestId("table-cell");

    expect(cell.style.backgroundColor).toBe("blue");
  });

  it("spreads selectionProp to TableCell", () => {
    const selectionProp = { className: "selected", value: "123" };

    render(<TableRow selectionProp={selectionProp}>Table row</TableRow>);

    const cell = screen.getByTestId("table-cell");

    expect(cell).toHaveClass("selected");
    expect(cell).toHaveAttribute("value", "123");
  });
});