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
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as reactVirtualized from "react-virtualized";
import GridComponent from "./Grid";

interface WindowScrollerProps {
  children: (params: {
    height: number;
    width: number;
    isScrolling: boolean;
    scrollTop: number;
    scrollLeft: number;
    onChildScroll: (params: { scrollTop: number }) => void;
    registerChild: (element: unknown) => void;
  }) => React.ReactNode;
}

vi.mock("react-virtualized", async () => {
  const actual = await vi.importActual("react-virtualized");
  return {
    ...actual,
    WindowScroller: vi.fn(({ children }: WindowScrollerProps) =>
      children({
        height: 1000,
        width: 1000,
        isScrolling: false,
        scrollTop: 0,
        scrollLeft: 0,
        onChildScroll: () => {},
        registerChild: () => {},
      }),
    ),
  };
});

const defaultProps = {
  viewAs: "tile" as const,
  hasMoreFiles: false,
  filesLength: 10,
  itemCount: 10,
  loadMoreItems: vi.fn(() => Promise.resolve()),
  onScroll: vi.fn(),
  itemSize: 50,
  scroll: window,
  showSkeleton: false,
};

const defaultChildren = Array(10)
  .fill(null)
  .map((_, i) => (
    <div key={i} className="isFile">
      Item {i}
    </div>
  ));

describe("GridComponent", () => {
  let tileContainer: HTMLDivElement;

  beforeEach(() => {
    tileContainer = document.createElement("div");
    tileContainer.id = "tileContainer";
    document.body.appendChild(tileContainer);
    vi.spyOn(tileContainer, "getBoundingClientRect").mockReturnValue({
      width: 1000,
    } as DOMRect);
  });

  afterEach(() => {
    document.body.removeChild(tileContainer);
    vi.clearAllMocks();
  });

  it("renders specific skeletons based on tile type when scrolling", () => {
    vi.mocked(reactVirtualized.WindowScroller).mockImplementation(
      ({ children }: WindowScrollerProps) =>
        children({
          height: 1000,
          width: 1000,
          isScrolling: true,
          scrollTop: 0,
          scrollLeft: 0,
          onChildScroll: () => {},
          registerChild: () => {},
        }),
    );

    const children = [
      <div key="grid-child" className="isRoom">
        Room
      </div>,
    ];

    render(
      <GridComponent {...defaultProps} itemCount={1} showSkeleton={true}>
        {children}
      </GridComponent>,
    );

    expect(screen.queryByText("Room")).not.toBeInTheDocument();
    expect(screen.getByTestId("tile-skeleton-room")).toBeInTheDocument();
  });

  it("renders multiple skeletons in a row based on countTilesInRow", () => {
    vi.mocked(reactVirtualized.WindowScroller).mockImplementation(
      ({ children }: WindowScrollerProps) =>
        children({
          height: 1000,
          width: 1000,
          isScrolling: true,
          scrollTop: 0,
          scrollLeft: 0,
          onChildScroll: () => {},
          registerChild: () => {},
        }),
    );

    render(
      <GridComponent
        {...defaultProps}
        countTilesInRow={4}
        itemCount={1}
        showSkeleton={true}
      >
        {defaultChildren}
      </GridComponent>,
    );

    expect(screen.getAllByTestId("rectangle-skeleton").length).toBeGreaterThan(
      0,
    );
  });

  it("calculates height from scroll element when WindowScroller height is undefined", () => {
    vi.mocked(reactVirtualized.WindowScroller).mockImplementation(
      ({ children }: WindowScrollerProps) =>
        children({
          height: undefined as unknown as number,
          width: 1000,
          isScrolling: false,
          scrollTop: 0,
          scrollLeft: 0,
          onChildScroll: () => {},
          registerChild: () => {},
        }),
    );

    const customScroll = document.createElement("div");
    const spy = vi
      .spyOn(customScroll, "getBoundingClientRect")
      .mockReturnValue({
        height: 700,
        width: 900,
      } as DOMRect);

    render(
      <GridComponent {...defaultProps} scroll={customScroll}>
        {defaultChildren}
      </GridComponent>,
    );

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("triggers recomputeRowHeights on folder change", () => {
    const { rerender } = render(
      <GridComponent {...defaultProps} currentFolderId="1">
        {defaultChildren}
      </GridComponent>,
    );

    rerender(
      <GridComponent {...defaultProps} currentFolderId="2">
        {defaultChildren}
      </GridComponent>,
    );
    expect(
      screen.getByTestId("infinite-loader-container-grid"),
    ).toBeInTheDocument();
  });

  it("renders correct skeleton variants for different item types", () => {
    vi.mocked(reactVirtualized.WindowScroller).mockImplementation(
      ({ children }: WindowScrollerProps) =>
        children({
          height: 2000,
          width: 1000,
          isScrolling: true,
          scrollTop: 0,
          scrollLeft: 0,
          onChildScroll: () => {},
          registerChild: () => {},
        }),
    );

    render(
      <GridComponent
        {...defaultProps}
        showSkeleton={true}
        countTilesInRow={1}
        itemCount={3}
      >
        <div className="folder_header">H</div>
        <div className="isFolder">F</div>
        <div className="isRoom">R</div>
      </GridComponent>,
    );

    expect(screen.getAllByTestId("rectangle-skeleton").length).toBeGreaterThan(
      0,
    );
    expect(screen.getByTestId("tile-skeleton-folder")).toBeInTheDocument();
    expect(screen.getByTestId("tile-skeleton-room")).toBeInTheDocument();
  });

  it("handles non-element children in getItemSize", () => {
    render(
      <GridComponent {...defaultProps} itemCount={1}>
        {["string child"] as unknown as React.ReactNode[]}
      </GridComponent>,
    );
    expect(
      screen.getByTestId("infinite-loader-container-grid"),
    ).toBeInTheDocument();
  });
});
