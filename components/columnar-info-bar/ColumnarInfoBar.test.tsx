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
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { ColumnarInfoBar } from "./ColumnarInfoBar";

const columns = [
  { label: "Name", value: "John Smith" },
  { label: "Email", value: "john@example.com" },
  { label: "Status", value: "Active" },
];

describe("ColumnarInfoBar", () => {
  it("renders all column labels and values", () => {
    render(<ColumnarInfoBar columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders headerText when provided", () => {
    render(<ColumnarInfoBar columns={columns} headerText="Your profile details" />);
    expect(screen.getByText("Your profile details")).toBeInTheDocument();
  });

  it("does not render a header when headerText is omitted", () => {
    render(<ColumnarInfoBar columns={columns} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders close button when onAction is provided", () => {
    render(<ColumnarInfoBar columns={columns} onAction={vi.fn()} />);
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("does not render close button when onAction is omitted", () => {
    render(<ColumnarInfoBar columns={columns} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onAction when close button is clicked", () => {
    const onAction = vi.fn();
    render(<ColumnarInfoBar columns={columns} onAction={onAction} />);

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(onAction).toHaveBeenCalledOnce();
  });

  it("calls onLoad on mount", () => {
    const onLoad = vi.fn();
    render(<ColumnarInfoBar columns={columns} onLoad={onLoad} />);
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("renders ReactNode values inside columns", () => {
    const columnsWithNode = [
      { label: "Status", value: <span data-testid="status-badge">200 OK</span> },
    ];
    render(<ColumnarInfoBar columns={columnsWithNode} />);
    expect(screen.getByTestId("status-badge")).toBeInTheDocument();
  });
});
