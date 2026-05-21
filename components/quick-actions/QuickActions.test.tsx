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
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { QuickActions } from "./index";
import type { QuickActionItem } from "./QuickActions.types";

const buildItems = (overrides: Partial<QuickActionItem>[] = []) => {
  const base: QuickActionItem[] = [
    { id: "doc", icon: <svg data-testid="icon-doc" />, label: "Document" },
    { id: "xls", icon: <svg data-testid="icon-xls" />, label: "Spreadsheet" },
    { id: "ppt", icon: <svg data-testid="icon-ppt" />, label: "Presentation" },
    { id: "pdf", icon: <svg data-testid="icon-pdf" />, label: "PDF" },
  ];

  return base.map((item, i) => ({ ...item, ...overrides[i] }));
};

describe("QuickActions", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders one tile per item", () => {
    render(<QuickActions items={buildItems()} dataTestId="qa" />);

    expect(screen.getByText("Document")).toBeInTheDocument();
    expect(screen.getByText("Spreadsheet")).toBeInTheDocument();
    expect(screen.getByText("Presentation")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();

    expect(screen.getByTestId("qa").children).toHaveLength(4);
  });

  it("renders the provided icon for each tile", () => {
    render(<QuickActions items={buildItems()} />);

    expect(screen.getByTestId("icon-doc")).toBeInTheDocument();
    expect(screen.getByTestId("icon-xls")).toBeInTheDocument();
    expect(screen.getByTestId("icon-ppt")).toBeInTheDocument();
    expect(screen.getByTestId("icon-pdf")).toBeInTheDocument();
  });

  it("renders nothing when items array is empty", () => {
    const { container } = render(<QuickActions items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("invokes onClick when a tile is clicked", () => {
    const onClick = vi.fn();
    const items: QuickActionItem[] = [
      { id: "action", icon: <svg />, label: "Action", onClick },
    ];

    render(<QuickActions items={items} />);

    fireEvent.click(screen.getByRole("button", { name: "Action" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders an anchor when href is provided", () => {
    const items: QuickActionItem[] = [
      {
        id: "open",
        icon: <svg />,
        label: "Open",
        href: "https://example.com",
        target: "_blank",
      },
    ];

    render(<QuickActions items={items} />);

    const link = screen.getByRole("link", { name: "Open" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a button when no href is provided", () => {
    const items: QuickActionItem[] = [{ id: "run", icon: <svg />, label: "Run" }];

    render(<QuickActions items={items} />);

    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });

  it("forwards dataTestId to individual tiles", () => {
    const items: QuickActionItem[] = [
      { id: "tile-a", icon: <svg />, label: "Tile A", dataTestId: "tile-a" },
      { id: "tile-b", icon: <svg />, label: "Tile B", dataTestId: "tile-b" },
    ];

    render(<QuickActions items={items} />);

    expect(screen.getByTestId("tile-a")).toBeInTheDocument();
    expect(screen.getByTestId("tile-b")).toBeInTheDocument();
  });
});
