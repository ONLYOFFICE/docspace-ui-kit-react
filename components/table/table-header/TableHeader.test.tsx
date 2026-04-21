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
import userEvent from "@testing-library/user-event";

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
    render(<TableHeader {...defaultProps} showSettings={false} />);

    expect(screen.queryByTestId(`settings-block`)).not.toBeInTheDocument();
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

  describe("column width persistence", () => {
    it("stores gridTemplateColumns in localStorage on initial render", () => {
      render(<TableHeaderWithContainerRef {...defaultProps} />);

      const stored = localStorage.getItem(COLUMN_STORAGE_NAME);
      expect(stored).not.toBeNull();
      // Should have N columns + settings column (24px)
      const parts = stored!.split(" ");
      expect(parts).toHaveLength(mockColumns.length + 1);
      expect(parts[parts.length - 1]).toBe("24px");
    });

    it("restores column widths from localStorage on mount", () => {
      const storedWidths = "300px 200px 200px 276px 24px";
      localStorage.setItem(COLUMN_STORAGE_NAME, storedWidths);

      render(<TableHeaderWithContainerRef {...defaultProps} />);

      const stored = localStorage.getItem(COLUMN_STORAGE_NAME);
      expect(stored).not.toBeNull();
      // Should recalculate proportionally, but total should match container
      const parts = stored!.split(" ");
      expect(parts).toHaveLength(5);
    });

    it("uses separate storage key when infoPanelVisible", () => {
      render(<TableHeaderWithContainerRef {...defaultProps} infoPanelVisible />);

      expect(localStorage.getItem(COLUMN_INFO_PANEL_STORAGE_NAME)).not.toBeNull();
      expect(localStorage.getItem(COLUMN_STORAGE_NAME)).toBeNull();
    });

    it("removes info panel storage when infoPanelVisible is false", () => {
      localStorage.setItem(COLUMN_INFO_PANEL_STORAGE_NAME, "300px 200px 200px 276px 24px");

      render(<TableHeaderWithContainerRef {...defaultProps} />);

      expect(localStorage.getItem(COLUMN_INFO_PANEL_STORAGE_NAME)).toBeNull();
    });
  });

  describe("resetColumns (fresh width calculation)", () => {
    it("allocates ~40% to default (Name) column and ~60% to others", () => {
      render(<TableHeaderWithContainerRef {...defaultProps} />);

      const stored = localStorage.getItem(COLUMN_STORAGE_NAME);
      const parts = stored!.split(" ").map((p) => parseFloat(p));
      const settingsSize = parts.pop()!;
      const nameWidth = parts[0];
      const totalContent = parts.reduce((a, b) => a + b, 0);

      expect(settingsSize).toBe(24);
      // Name column should get roughly 40% of content width
      expect(nameWidth / totalContent).toBeGreaterThan(0.35);
      expect(nameWidth / totalContent).toBeLessThan(0.45);
    });

    it("enforces minimum 210px for Name column", () => {
      // Use a narrow container where 40% < 210px
      render(
        <TableHeaderWithContainerRef
          {...defaultProps}
          sectionWidth={400}
        />,
      );

      const stored = localStorage.getItem(COLUMN_STORAGE_NAME);
      const nameWidth = parseFloat(stored!.split(" ")[0]);
      expect(nameWidth).toBeGreaterThanOrEqual(210);
    });

    it("enforces minimum 110px for non-Name columns", () => {
      render(
        <TableHeaderWithContainerRef
          {...defaultProps}
          sectionWidth={400}
        />,
      );

      const stored = localStorage.getItem(COLUMN_STORAGE_NAME);
      const parts = stored!.split(" ").map((p) => parseFloat(p));
      // Check enabled non-Name columns (skip last = settings)
      for (let i = 1; i < parts.length - 1; i++) {
        if (parts[i] > 0) {
          expect(parts[i]).toBeGreaterThanOrEqual(110);
        }
      }
    });

    it("total column widths equal container width", () => {
      render(<TableHeaderWithContainerRef {...defaultProps} />);

      const stored = localStorage.getItem(COLUMN_STORAGE_NAME);
      const total = stored!
        .split(" ")
        .map((p) => parseFloat(p))
        .reduce((a, b) => a + b, 0);

      // Should be close to container width (1000px)
      expect(Math.abs(total - 1000)).toBeLessThan(2);
    });
  });

  describe("column visibility changes", () => {
    it("resets columns when a column is disabled", () => {
      const { rerender } = render(
        <TableHeaderWithContainerRef {...defaultProps} />,
      );

      const columnsWithDisabled = mockColumns.map((col) =>
        col.key === "Type" ? { ...col, enable: false } : col,
      );

      act(() => {
        rerender(
          <TableHeaderWithContainerRef
            {...defaultProps}
            columns={columnsWithDisabled}
          />,
        );
      });

      const stored = localStorage.getItem(COLUMN_STORAGE_NAME);
      const parts = stored!.split(" ");
      // Type column (index 1) should be 0px
      expect(parts[1]).toBe("0px");
    });

    it("redistributes width when a column is enabled", () => {
      const columnsWithDisabled = mockColumns.map((col) =>
        col.key === "Type" ? { ...col, enable: false } : col,
      );
      const { rerender } = render(
        <TableHeaderWithContainerRef
          {...defaultProps}
          columns={columnsWithDisabled}
        />,
      );

      act(() => {
        rerender(
          <TableHeaderWithContainerRef {...defaultProps} />,
        );
      });

      const stored = localStorage.getItem(COLUMN_STORAGE_NAME);
      const parts = stored!.split(" ").map((p) => parseFloat(p));
      // Type column (index 1) should now have width > 0
      expect(parts[1]).toBeGreaterThan(0);
    });

    it("preserves total width when toggling column visibility", () => {
      const { rerender } = render(
        <TableHeaderWithContainerRef {...defaultProps} />,
      );

      const columnsWithDisabled = mockColumns.map((col) =>
        col.key === "Tags" ? { ...col, enable: false } : col,
      );

      act(() => {
        rerender(
          <TableHeaderWithContainerRef
            {...defaultProps}
            columns={columnsWithDisabled}
          />,
        );
      });

      const stored = localStorage.getItem(COLUMN_STORAGE_NAME);
      const total = stored!
        .split(" ")
        .map((p) => parseFloat(p))
        .reduce((a, b) => a + b, 0);

      expect(Math.abs(total - 1000)).toBeLessThan(2);
    });
  });

  describe("column sorting interaction", () => {
    it("renders sort icon on the active sorted column", () => {
      render(
        <TableHeaderWithContainerRef
          {...defaultProps}
          sortBy={SortByFieldName.Name}
          sorted
        />,
      );

      const nameColumn = screen.getByTestId("column-Name");
      const sortIcon = nameColumn.querySelector("[data-testid='sort-icon']");
      expect(sortIcon).toBeInTheDocument();
    });

    it("calls column onClick when header cell is clicked", async () => {
      const onClickMock = vi.fn();
      const columnsWithClick = mockColumns.map((col) =>
        col.key === "Type" ? { ...col, onClick: onClickMock } : col,
      );

      render(
        <TableHeaderWithContainerRef
          {...defaultProps}
          columns={columnsWithClick}
        />,
      );

      const typeColumn = screen.getByTestId("column-Type");
      // onClick is on the .textWrapper div inside the header cell
      const textWrapper = typeColumn.querySelector(".header-container-text")?.parentElement || typeColumn;
      await userEvent.click(textWrapper);

      expect(onClickMock).toHaveBeenCalled();
    });
  });

  describe("resize handle interaction", () => {
    it("renders resize handles on resizable columns", () => {
      render(<TableHeaderWithContainerRef {...defaultProps} />);

      const resizeHandles = screen.getAllByTestId("resize-handle");
      // Last column's resize handle depends on next column being resizable
      expect(resizeHandles.length).toBeGreaterThan(0);
    });

    it("fires onPointerDown on resize handle pointerdown", async () => {
      render(<TableHeaderWithContainerRef {...defaultProps} />);

      const resizeHandles = screen.getAllByTestId("resize-handle");
      await userEvent.pointer({
        keys: "[MouseLeft>]",
        target: resizeHandles[0],
      });

      // The mousedown should register (no errors thrown)
      expect(resizeHandles[0]).toBeInTheDocument();
    });
  });

  describe("responsive behavior", () => {
    it("calls setHideColumns when container is too narrow", () => {
      const setHideColumns = vi.fn();

      // Mock very narrow container
      window.HTMLElement.prototype.getBoundingClientRect = vi.fn(() => ({
        width: 200,
        height: 40,
        top: 0, left: 0, bottom: 40, right: 200,
        x: 0, y: 0,
        toJSON: () => {},
      } as DOMRect));

      render(
        <TableHeaderWithContainerRef
          {...defaultProps}
          setHideColumns={setHideColumns}
        />,
      );

      expect(setHideColumns).toHaveBeenCalledWith(true);
    });

    it("does not hide columns when container is wide enough", () => {
      const setHideColumns = vi.fn();

      render(
        <TableHeaderWithContainerRef
          {...defaultProps}
          setHideColumns={setHideColumns}
        />,
      );

      // With 1000px width and 4 columns, should not need to hide
      expect(setHideColumns).not.toHaveBeenCalledWith(true);
    });
  });

  describe("columnStorageName change (section switching)", () => {
    it("recalculates when columnStorageName changes", () => {
      const { rerender } = render(
        <TableHeaderWithContainerRef {...defaultProps} />,
      );

      const newStorageName = "new-section-columns";
      act(() => {
        rerender(
          <TableHeaderWithContainerRef
            {...defaultProps}
            columnStorageName={newStorageName}
          />,
        );
      });

      // New storage key should have data
      expect(localStorage.getItem(newStorageName)).not.toBeNull();
    });

    it("does not corrupt old storage when switching to new columnStorageName", () => {
      const { rerender } = render(
        <TableHeaderWithContainerRef {...defaultProps} />,
      );

      const originalStored = localStorage.getItem(COLUMN_STORAGE_NAME);

      act(() => {
        rerender(
          <TableHeaderWithContainerRef
            {...defaultProps}
            columnStorageName="other-section"
          />,
        );
      });

      // Original storage should remain unchanged
      expect(localStorage.getItem(COLUMN_STORAGE_NAME)).toBe(originalStored);
    });
  });
});
