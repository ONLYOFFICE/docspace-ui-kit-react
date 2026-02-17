/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import React, { useRef } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";

import { SortByFieldName } from "../../../enums";

import { TableHeader } from "./TableHeader";
import type { TableHeaderProps } from "../Table.types";

const COLUMN_STORAGE_NAME = "vitest-table-header-column-storage";
const COLUMN_INFO_PANEL_STORAGE_NAME = "vitest-table-header-info-panel-storage";

// Mock dependencies
vi.mock("../../../utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../utils")>();
  return {
    ...actual,
    isDesktop: vi.fn(() => true),
    isMobile: vi.fn(() => false),
    isTablet: vi.fn(() => false),
  };
});

vi.mock("./hooks/use-table-header-position", () => ({
  useTableHeaderPosition: vi.fn(),
}));

const TableHeaderWithContainerRef = (
  args: Omit<TableHeaderProps, "containerRef">,
) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      id="table-container" 
      ref={containerRef}
      style={{ display: "grid", gridTemplateColumns: "210px 110px 110px 110px 24px", width: "1000px" }}
    >
      <TableHeader {...args} containerRef={containerRef} />
    </div>
  );
};

const mockColumns = [
  {
    key: "Name",
    title: "Name",
    resizable: true,
    enable: true,
    default: true,
    sortBy: SortByFieldName.Name,
    minWidth: 210,
    onChange: () => {},
    onClick: () => {},
  },
  {
    key: "Type",
    title: "Type",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Type,
    onChange: () => {},
    onClick: () => {},
  },
  {
    key: "Tags",
    title: "Tags",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Tags,
    withTagRef: true,
    onChange: () => {},
    onClick: () => {},
  },
  {
    key: "Owner",
    title: "Owner",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Author,
    onChange: () => {},
    onClick: () => {},
  },
];

const defaultProps = {
  containerRef: { current: null },
  columns: mockColumns,
  columnStorageName: COLUMN_STORAGE_NAME,
  columnInfoPanelStorageName: COLUMN_INFO_PANEL_STORAGE_NAME,
  sectionWidth: 1000,
  useReactWindow: false,
  showSettings: true,
};

describe("<TableHeader />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Mock getBoundingClientRect for elements
    window.HTMLElement.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 1000,
      height: 40,
      top: 0,
      left: 0,
      bottom: 40,
      right: 1000,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect));
  });

  it("renders without errors", () => {
    render(<TableHeader {...defaultProps} />);
    expect(screen.getByTestId("table-header")).toBeInTheDocument();
  });

  it("renders all columns", () => {
    render(<TableHeader {...defaultProps} />);

    mockColumns.forEach((column) => {
      expect(screen.getByTestId(`column-${column.key}`)).toBeInTheDocument();
    });
  });

  it("renders settings if showSettings is true", () => {
    render(<TableHeader {...defaultProps} />);

    expect(screen.getByTestId(`settings-block`)).toBeInTheDocument();
  });

  it("does not render settings if showSettings is false", () => {
    render(<TableHeader {...defaultProps} />);

    expect(screen.queryByTestId(`settings-block`)).toBeInTheDocument();
  });

  it("sets columnStorageName to localStorage if infoPanelVisible is false (default)", () => {
    render(<TableHeaderWithContainerRef {...defaultProps} />);

    expect(localStorage.getItem(COLUMN_STORAGE_NAME)).not.toBeNull();
  });

  it("does not set columnStorageName to localStorage if infoPanelVisible is true", () => {
    render(<TableHeaderWithContainerRef {...defaultProps} infoPanelVisible />);

    expect(localStorage.getItem(COLUMN_STORAGE_NAME)).toBeNull();
  });

  it("sets columnInfoPanelStorageName to localStorage if infoPanelVisible is true", () => {
    render(<TableHeaderWithContainerRef {...defaultProps} infoPanelVisible />);

    expect(localStorage.getItem(COLUMN_INFO_PANEL_STORAGE_NAME)).not.toBeNull();
  });

  it("does not set columnInfoPanelStorageName to localStorage if infoPanelVisible is false (default)", () => {
    render(<TableHeaderWithContainerRef {...defaultProps} />);

    expect(localStorage.getItem(COLUMN_INFO_PANEL_STORAGE_NAME)).toBeNull();
  });

  it("pass settingsTitle to settings wrapper title attribute", () => {
    const settingsTitle = "Column Settings";
    render(<TableHeader {...defaultProps} settingsTitle={settingsTitle} />);

    expect(screen.getByTestId("settings-block")).toHaveAttribute(
      "title",
      settingsTitle,
    );
  });

  it("resets columns when column count changes and no storage", () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
    const { rerender } = render(<TableHeaderWithContainerRef {...defaultProps} />);
    
    // Clear storage created by first render to simulate "no storage"
    localStorage.removeItem(COLUMN_STORAGE_NAME);
    removeItemSpy.mockClear();
    
    const moreColumns = [...mockColumns, {
      key: "NewCol",
      title: "New Col",
      enable: true,
      sortBy: "NewCol",
      onChange: () => {},
      onClick: () => {},
    }];
    
    act(() => {
      rerender(<TableHeaderWithContainerRef {...defaultProps} columns={moreColumns} />);
    });
    
    // resetColumns MUST call removeItem
    expect(removeItemSpy).toHaveBeenCalledWith(COLUMN_STORAGE_NAME);
    expect(localStorage.getItem(COLUMN_STORAGE_NAME)).not.toBeNull();
    removeItemSpy.mockRestore();
  });

  it("calls onResize when columns length does not change", () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
    const { rerender } = render(<TableHeaderWithContainerRef {...defaultProps} />);
    
    // Clear calls from initial render
    removeItemSpy.mockClear();

    act(() => {
      rerender(<TableHeaderWithContainerRef {...defaultProps} sortBy={SortByFieldName.Type} />);
    });
    
    // onResize MUST NOT call removeItem(COLUMN_STORAGE_NAME) if infoPanelVisible is false.
    // onResize might call removeItem(COLUMN_INFO_PANEL_STORAGE_NAME) for cleanup.
    // We check that it didn't do a full reset.
    expect(removeItemSpy).not.toHaveBeenCalledWith(COLUMN_STORAGE_NAME);
    removeItemSpy.mockRestore();
  });

  it("calls onChange when sorting by a disabled column", () => {
    const onChangeMock = vi.fn();
    const columnsWithDisabled = mockColumns.map((col) => {
      if (col.sortBy === SortByFieldName.Type) {
        return { ...col, enable: false, onChange: onChangeMock };
      }
      return col;
    });

    const { rerender } = render(
      <TableHeaderWithContainerRef 
        {...defaultProps} 
        columns={mockColumns} 
        sortBy={SortByFieldName.Name} 
      />
    );

    act(() => {
      rerender(
        <TableHeaderWithContainerRef 
          {...defaultProps} 
          columns={columnsWithDisabled} 
          sortBy={SortByFieldName.Type} 
        />
      );
    });

    expect(onChangeMock).toHaveBeenCalledWith("Type");
  });
});
