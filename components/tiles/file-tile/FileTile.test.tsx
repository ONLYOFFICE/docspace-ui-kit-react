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
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";

import { FileType } from "../../../enums";
import { isMobile, isTablet } from "../../../utils";

import { FileTile } from ".";
import { FileItemType } from "./FileTile.types";
import { ContextMenuRefType, HeaderType } from "../../context-menu/ContextMenu.types";

// Mock translations
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock ReactSVG component
vi.mock("react-svg", () => ({
  ReactSVG: (props: Record<string, unknown>) => <div {...props} />,
}));

// Mock styles - return default export for CSS Modules
vi.mock("./FileTile.module.scss", () => ({
  default: {
    fileTile: "fileTile",
    isBlocked: "isBlocked",
    showHotkeyBorder: "showHotkeyBorder",
    isDragging: "isDragging",
    isActive: "isActive",
    checked: "checked",
    isEdit: "isEdit",
    isTouchDevice: "isTouchDevice",
    isHighlight: "isHighlight",
    isImageOrMedia: "isImageOrMedia",
    icon: "icon",
    iconContainer: "iconContainer",
    checkbox: "checkbox",
    fileTileTop: "fileTileTop",
    fileTileBottom: "fileTileBottom",
    content: "content",
    isHovered: "isHovered",
    optionButton: "optionButton",
    expandButton: "expandButton",
    loader: "loader",
    thumbnailImage: "thumbnailImage",
    temporaryIcon: "temporaryIcon",
  },
}));

vi.mock("../../../utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../utils")>();
  return {
    ...actual,
    isMobile: vi.fn(() => false),
    isTablet: vi.fn(() => false),
    getCommonTranslation: vi.fn((key) => key),
  };
});

// Mock ContextMenuButton component
vi.mock("../../context-menu-button", () => ({
  ContextMenuButton: ({
    title,
    onClick,
    getData,
  }: {
    title: string;
    onClick: (e: React.MouseEvent) => void;
    getData?: () => void;
  }) => (
    <button
      type="button"
      data-testid="context-menu-button"
      title={title}
      onClick={(e) => {
        getData?.();
        onClick(e);
      }}
    >
      Actions
    </button>
  ),
  ContextMenuButtonDisplayType: {
    toggle: "toggle",
  },
}));

// Mock ContextMenu component
vi.mock("../../context-menu", () => {
  const ContextMenuComponent = React.forwardRef(({
    model,
    header,
  }: {
    model?: Array<{ key: string; label: string }>;
    header?: HeaderType;
  }, ref: React.ForwardedRef<ContextMenuRefType>) => {
    React.useImperativeHandle(ref, () => ({
      show: vi.fn(),
      hide: vi.fn(),
      toggle: vi.fn(),
      menuRef: { current: null },
    }));

    return (
      <div data-testid="context-menu">
        {header && (
          <div data-testid="context-menu-header">{header.title}</div>
        )}
        {model?.map((item) => (
          <div key={item.key}>{item.label}</div>
        ))}
      </div>
    );
  });
  ContextMenuComponent.displayName = "ContextMenu";
  return { ContextMenu: ContextMenuComponent };
});

// Mock Checkbox component
vi.mock("../../checkbox", () => ({
  Checkbox: ({
    isChecked,
    onChange,
  }: {
    isChecked?: boolean;
    onChange?: (e: { target: { checked: boolean } }) => void;
  }) => (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={(e) => {
        onChange?.({ target: { checked: !isChecked } });
      }}
      data-testid="checkbox"
    />
  ),
}));

describe("FileTile", () => {
  const mockItem: FileItemType = {
    id: "1",
    title: "Test File",
    fileExst: ".docx",
    fileType: FileType.Document,
    contextOptions: [],
  };

  const mockContextOptions = [
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
  ];

  const defaultProps = {
    item: mockItem,
    contextOptions: mockContextOptions,
    element: <div data-testid="file-icon">File Icon</div>,
  };

  const FileContent = () => (
    <div data-testid="file-content" className="item-file-name">
      {mockItem.title}
    </div>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders file title correctly", () => {
    render(
      <FileTile {...defaultProps}>
        <FileContent />
      </FileTile>,
    );
    expect(screen.getByTestId("file-content")).toBeTruthy();
    expect(screen.getByTestId("file-content").textContent).toBe("Test File");
  });

  it("shows checkbox when checked prop is provided", () => {
    render(
      <FileTile {...defaultProps} checked={true}>
        <FileContent />
      </FileTile>,
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(true);
  });

  it("calls onSelect when checkbox is clicked", () => {
    const onSelect = vi.fn();
    render(
      <FileTile {...defaultProps} onSelect={onSelect} checked={false}>
        <FileContent />
      </FileTile>,
    );

    const checkbox = screen.getByTestId("checkbox");
    fireEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith(true, mockItem);
  });

  it("shows loader when inProgress is true", () => {
    render(
      <FileTile {...defaultProps} inProgress>
        <FileContent />
      </FileTile>,
    );
    const loader = screen.getByTestId("loader");
    expect(loader).toBeTruthy();
  });

  it("calls thumbnailClick when thumbnail is clicked", () => {
    const thumbnailClick = vi.fn();
    render(
      <FileTile
        {...defaultProps}
        thumbnailClick={thumbnailClick}
        thumbnail="test.png"
        thumbSize={96}
      >
        <FileContent />
      </FileTile>,
    );

    const thumbnail = screen.getByTestId("file-thumbnail");
    fireEvent.click(thumbnail);

    expect(thumbnailClick).toHaveBeenCalled();
  });

  it("renders badges when provided", () => {
    const badges = <div data-testid="test-badge">Badge</div>;
    render(
      <FileTile {...defaultProps} badges={badges}>
        <FileContent />
      </FileTile>,
    );
    expect(screen.getByTestId("test-badge")).toBeTruthy();
  });

  it("shows hotkey border when showHotkeyBorder is true", () => {
    const { container } = render(
      <FileTile {...defaultProps} showHotkeyBorder>
        <FileContent />
      </FileTile>,
    );
    expect(container.querySelector(".showHotkeyBorder")).toBeTruthy();
  });

  it("calls tileContextClick when ContextMenuButton is clicked", () => {
    const tileContextClick = vi.fn();
    render(
      <FileTile {...defaultProps} tileContextClick={tileContextClick}>
        <FileContent />
      </FileTile>,
    );

    const button = screen.getByTestId("context-menu-button");
    fireEvent.click(button);

    expect(tileContextClick).toHaveBeenCalled();
  });

  it("calls withCtrlSelect when Ctrl+Click", () => {
    const withCtrlSelect = vi.fn();
    render(
      <FileTile {...defaultProps} withCtrlSelect={withCtrlSelect}>
        <FileContent />
      </FileTile>,
    );

    const tile = screen.getByTestId("tile");
    fireEvent.click(tile, { ctrlKey: true });

    expect(withCtrlSelect).toHaveBeenCalledWith(mockItem);
  });

  it("calls withShiftSelect when Shift+Click", () => {
    const withShiftSelect = vi.fn();
    render(
      <FileTile {...defaultProps} withShiftSelect={withShiftSelect}>
        <FileContent />
      </FileTile>,
    );

    const tile = screen.getByTestId("tile");
    fireEvent.click(tile, { shiftKey: true });

    expect(withShiftSelect).toHaveBeenCalledWith(mockItem);
  });

  it("calls onSelect when clicking on tile surface (detail=1)", () => {
    const onSelect = vi.fn();
    render(
      <FileTile {...defaultProps} onSelect={onSelect} checked={false}>
        <FileContent />
      </FileTile>,
    );

    const tile = screen.getByTestId("tile");
    fireEvent.click(tile, { detail: 1 });

    expect(onSelect).toHaveBeenCalledWith(true, mockItem);
  });

  it("calls forwardRef.current.click when context menu is opened and mock menu ref is null", () => {
    const clickSpy = vi.spyOn(HTMLElement.prototype, "click");
    const ref = React.createRef<HTMLDivElement>();

    render(
      <FileTile {...defaultProps} forwardRef={ref}>
        <FileContent />
      </FileTile>,
    );

    const tile = screen.getByTestId("tile");
    fireEvent.contextMenu(tile);

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("calls onSelect when file icon is clicked in mobile mode", () => {
    vi.mocked(isMobile).mockReturnValue(true);
    const onSelect = vi.fn();
    render(
      <FileTile {...defaultProps} onSelect={onSelect}>
        <FileContent />
      </FileTile>,
    );

    const icon = screen.getByTestId("file-icon");
    fireEvent.click(icon);

    expect(onSelect).toHaveBeenCalledWith(true, mockItem);
    vi.mocked(isMobile).mockReturnValue(false);
  });

  it("handles thumbnail load error", () => {
    render(
      <FileTile {...defaultProps} thumbnail="invalid.png" thumbSize={96} temporaryIcon={<div data-testid='temp-icon' />}>
        <FileContent />
      </FileTile>,
    );

    const img = screen.getByTestId("file-thumbnail");
    fireEvent.error(img);

    expect(screen.getByTestId("temp-icon")).toBeTruthy();
  });

  it("renders ReactSVG for thumbnail when thumbSize is undefined", () => {
    render(
      <FileTile {...defaultProps} thumbnail="test.svg" thumbSize={undefined}>
        <FileContent />
      </FileTile>,
    );

    expect(screen.getByTestId("file-thumbnail")).toBeTruthy();
  });

  it("renders plugin icon when item.isPlugin is true", () => {
    const pluginItem = { ...mockItem, isPlugin: true, fileTileIcon: "plugin.png" };
    render(
      <FileTile {...defaultProps} item={pluginItem}>
        <FileContent />
      </FileTile>,
    );

    const svgMock = screen.getByTestId("file-thumbnail");
    expect(svgMock.getAttribute("src")).toBe("plugin.png");
  });

  it("constructs context menu header correctly from first child item", () => {
    const childItem = { title: "Custom Title", icon: "custom-icon" };
    const FileChild = ({ item }: { item: typeof childItem }) => <div data-testid="child" />;

    render(
      <FileTile {...defaultProps}>
        <FileChild item={childItem} />
      </FileTile>,
    );

    const header = screen.getByTestId("context-menu-header");
    expect(header.textContent).toBe("Custom Title");
  });

  it("applies hovered class on mouse enter and removes on mouse leave", () => {
    const { container } = render(
      <FileTile {...defaultProps}>
        <FileContent />
      </FileTile>,
    );

    const content = container.querySelector(".content");
    expect(content?.classList.contains("isHovered")).toBe(false);

    const interactiveArea = container.querySelector(".iconContainer");
    if (interactiveArea) {
      fireEvent.mouseEnter(interactiveArea);
      expect(content?.classList.contains("isHovered")).toBe(true);

      fireEvent.mouseLeave(interactiveArea);
      expect(content?.classList.contains("isHovered")).toBe(false);
    }
  });

  it("applies isTouchDevice class when on mobile", () => {
    vi.mocked(isMobile).mockReturnValue(true);
    const { container } = render(
      <FileTile {...defaultProps}>
        <FileContent />
      </FileTile>
    );
    expect(container.firstChild).toHaveClass("isTouchDevice");
    vi.mocked(isMobile).mockReturnValue(false);
  });

  it("does not call setSelection when clicking on an image", () => {
    const setSelection = vi.fn();
    render(
      <FileTile {...defaultProps} setSelection={setSelection} thumbnail="test.png" thumbSize={96}>
        <FileContent />
      </FileTile>
    );

    const img = screen.getByTestId("file-thumbnail");
    fireEvent.click(img, { detail: 1 });

    expect(setSelection).not.toHaveBeenCalled();
  });

  it("calls setSelection([]) when clicking on tile surface", () => {
    const setSelection = vi.fn();
    render(
      <FileTile {...defaultProps} setSelection={setSelection}>
        <FileContent />
      </FileTile>
    );

    const tile = screen.getByTestId("tile");
    fireEvent.click(tile, { detail: 1 });

    expect(setSelection).toHaveBeenCalledWith([]);
  });

  it("applies isHighlight class when isHighlight is true", () => {
    const { container } = render(
      <FileTile {...defaultProps} isHighlight={true}>
        <FileContent />
      </FileTile>
    );
    expect(container.querySelector(".isHighlight")).toBeTruthy();
  });

  it("applies isImageOrMedia class when ImageView is true", () => {
    const mediaItem = {
      ...mockItem,
      viewAccessibility: { ImageView: true, MediaView: false }
    };
    const { container } = render(
      <FileTile {...defaultProps} item={mediaItem}>
        <FileContent />
      </FileTile>
    );
    expect(container.querySelector(".isImageOrMedia")).toBeTruthy();
  });

  it("does not call onSelect if detail is not 1", () => {
    const onSelect = vi.fn();
    render(
      <FileTile {...defaultProps} onSelect={onSelect}>
        <FileContent />
      </FileTile>
    );

    const tile = screen.getByTestId("tile");
    fireEvent.click(tile, { detail: 2 });

    expect(onSelect).not.toHaveBeenCalled();
  });
});

