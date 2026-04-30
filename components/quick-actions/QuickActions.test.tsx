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
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { QuickActions } from "./index";
import type { QuickActionItem } from "./QuickActions.types";

const buildItems = (overrides: Partial<QuickActionItem>[] = []) => {
  const base: QuickActionItem[] = [
    { icon: <svg data-testid="icon-doc" />, label: "Document" },
    { icon: <svg data-testid="icon-xls" />, label: "Spreadsheet" },
    { icon: <svg data-testid="icon-ppt" />, label: "Presentation" },
    { icon: <svg data-testid="icon-pdf" />, label: "PDF" },
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
      { icon: <svg />, label: "Action", onClick },
    ];

    render(<QuickActions items={items} />);

    fireEvent.click(screen.getByRole("button", { name: "Action" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders an anchor when href is provided", () => {
    const items: QuickActionItem[] = [
      {
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
    const items: QuickActionItem[] = [{ icon: <svg />, label: "Run" }];

    render(<QuickActions items={items} />);

    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });

  it("forwards dataTestId to individual tiles", () => {
    const items: QuickActionItem[] = [
      { icon: <svg />, label: "Tile A", dataTestId: "tile-a" },
      { icon: <svg />, label: "Tile B", dataTestId: "tile-b" },
    ];

    render(<QuickActions items={items} />);

    expect(screen.getByTestId("tile-a")).toBeInTheDocument();
    expect(screen.getByTestId("tile-b")).toBeInTheDocument();
  });
});
