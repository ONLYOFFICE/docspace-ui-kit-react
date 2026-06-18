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
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { QuickActions } from "./index";
import type { QuickActionItem } from "./QuickActions.types";

// jsdom performs no layout, so every element's offsetTop is 0. The collapse
// logic measures wrapping by comparing tile offsetTop values, so these tests
// simulate row layout by overriding the offsetTop getter: each tile's row is
// derived from its index among its siblings and a configurable tiles-per-row.
// `perRow >= tile count` ⇒ single row (no overflow); a smaller value ⇒ the
// later tiles land on row 2+ (overflow ⇒ collapse).
let originalOffsetTop: PropertyDescriptor | undefined;

const ROW_HEIGHT = 172;

const simulateLayout = (perRow: number) => {
  Object.defineProperty(HTMLElement.prototype, "offsetTop", {
    configurable: true,
    get(this: HTMLElement) {
      const parent = this.parentElement;
      if (!parent) return 0;
      const index = Array.prototype.indexOf.call(parent.children, this);
      if (index < 0) return 0;
      return Math.floor(index / perRow) * ROW_HEIGHT;
    },
  });
};

beforeEach(() => {
  originalOffsetTop = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetTop",
  );
});

afterEach(() => {
  if (originalOffsetTop) {
    Object.defineProperty(HTMLElement.prototype, "offsetTop", originalOffsetTop);
  } else {
    // jsdom's default is a value of 0 on the prototype; restore that.
    Object.defineProperty(HTMLElement.prototype, "offsetTop", {
      configurable: true,
      value: 0,
    });
  }
});

const buildItems = (overrides: Partial<QuickActionItem>[] = []) => {
  const base: QuickActionItem[] = [
    { id: "doc", icon: <svg data-testid="icon-doc" />, label: "Document" },
    { id: "xls", icon: <svg data-testid="icon-xls" />, label: "Spreadsheet" },
    { id: "ppt", icon: <svg data-testid="icon-ppt" />, label: "Presentation" },
    { id: "pdf", icon: <svg data-testid="icon-pdf" />, label: "PDF" },
  ];

  return base.map((item, i) => ({ ...item, ...overrides[i] }));
};

// Five tiles — one past the collapse threshold, so the grid collapses on
// tablet/mobile but not on desktop.
const buildFiveItems = (): QuickActionItem[] => [
  { id: "vdr", icon: <svg data-testid="icon-vdr" />, label: "VDR room" },
  { id: "collab", icon: <svg data-testid="icon-collab" />, label: "Collaboration room" },
  { id: "public", icon: <svg data-testid="icon-public" />, label: "Public room" },
  { id: "custom", icon: <svg data-testid="icon-custom" />, label: "Custom room" },
  { id: "template", icon: <svg data-testid="icon-template" />, label: "Room template" },
];

describe("QuickActions", () => {
  beforeEach(() => {
    // Default every test to a layout where all tiles fit on one row, so the
    // grid does not collapse unless a test opts into a wrapped layout.
    simulateLayout(100);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders one tile per item", () => {
    render(<QuickActions items={buildItems()} dataTestId="qa" />);

    expect(screen.getByText("Document")).toBeInTheDocument();
    expect(screen.getByText("Spreadsheet")).toBeInTheDocument();
    expect(screen.getByText("Presentation")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();

    // The wrapper holds a single .grid child that contains one tile per item.
    const grid = screen.getByTestId("qa").firstChild as HTMLElement;
    expect(grid.children).toHaveLength(4);
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

  describe("collapse behavior", () => {
    const SHOW_MORE_TESTID = "quick-actions-show-more";

    // Collapse is driven by the tiles wrapping onto more than one row, not by a
    // fixed breakpoint. CSS clips the overflow, so every tile stays in the DOM;
    // these assertions check the collapsed wrapper + the "Show more" affordance.
    it("collapses with a Show more affordance when tiles wrap (3 per row)", () => {
      simulateLayout(3);
      render(<QuickActions items={buildFiveItems()} dataTestId="qa" />);

      const showMore = screen.getByTestId(SHOW_MORE_TESTID);
      expect(showMore).toHaveTextContent("Show more");
      expect(screen.getByTestId("qa")).toHaveClass("collapsed");
      // All five tiles are present (clipped, not removed).
      expect(screen.getByText("VDR room")).toBeInTheDocument();
      expect(screen.getByText("Room template")).toBeInTheDocument();
      // Wrapper holds the grid + the show-more overlay.
      expect(screen.getByTestId("qa").children).toHaveLength(2);
    });

    it("collapses with a Show more affordance when tiles wrap (2 per row)", () => {
      simulateLayout(2);
      render(<QuickActions items={buildFiveItems()} dataTestId="qa" />);

      expect(screen.getByTestId(SHOW_MORE_TESTID)).toHaveTextContent(
        "Show more",
      );
      expect(screen.getByTestId("qa")).toHaveClass("collapsed");
    });

    it("does not collapse when every tile fits on one row", () => {
      simulateLayout(100);
      render(<QuickActions items={buildFiveItems()} dataTestId="qa" />);

      expect(screen.getByText("Custom room")).toBeInTheDocument();
      expect(screen.getByText("Room template")).toBeInTheDocument();
      expect(screen.queryByTestId(SHOW_MORE_TESTID)).not.toBeInTheDocument();
      expect(screen.getByTestId("qa")).not.toHaveClass("collapsed");
    });

    it("does not collapse when few tiles wrap but still fit one row", () => {
      // 4 tiles, 4 per row → single row → no overflow even though wrapping is
      // allowed. Confirms collapse keys off actual overflow, not tile count.
      simulateLayout(4);
      render(<QuickActions items={buildItems()} dataTestId="qa" />);

      expect(screen.getByText("PDF")).toBeInTheDocument();
      expect(screen.queryByTestId(SHOW_MORE_TESTID)).not.toBeInTheDocument();
      expect(screen.getByTestId("qa")).not.toHaveClass("collapsed");
    });

    it("expands on click and stays expanded (no show less)", () => {
      simulateLayout(3);
      render(<QuickActions items={buildFiveItems()} dataTestId="qa" />);

      fireEvent.click(screen.getByTestId(SHOW_MORE_TESTID));

      // The affordance is gone, the clip is removed, and tiles remain visible.
      expect(screen.queryByTestId(SHOW_MORE_TESTID)).not.toBeInTheDocument();
      expect(screen.getByTestId("qa")).not.toHaveClass("collapsed");
      expect(screen.getByText("Room template")).toBeInTheDocument();
    });

    it("uses the provided show more label", () => {
      simulateLayout(3);
      render(
        <QuickActions items={buildFiveItems()} showMoreLabel="Развернуть" />,
      );

      expect(screen.getByTestId(SHOW_MORE_TESTID)).toHaveTextContent(
        "Развернуть",
      );
    });
  });
});
