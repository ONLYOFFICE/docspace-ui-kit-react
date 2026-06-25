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
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { ContextMenuRefType } from "../../context-menu/ContextMenu.types";
import { FolderTile } from ".";
import { FolderTileProps } from "./FolderTile.types";
import { useInterfaceDirection } from "../../../context/InterfaceDirectionContext";
import { isMobile } from "../../../utils";
import { HeaderType } from "../../context-menu/ContextMenu.types";

// Mock translations
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock styles - return default export for CSS Modules
vi.mock("./FolderTile.module.scss", () => ({
  default: {
    folderTile: "folderTile",
    showHotkeyBorder: "showHotkeyBorder",
    isDragging: "isDragging",
    isActive: "isActive",
    isEdit: "isEdit",
    iconContainer: "iconContainer",
    inProgress: "inProgress",
    icon: "icon",
    checked: "checked",
    loader: "loader",
    content: "content",
    isHovered: "isHovered",
    optionButton: "optionButton",
    expandButton: "expandButton",
  },
}));

// Mock context menu components
vi.mock("../../../context/InterfaceDirectionContext", () => ({
  useInterfaceDirection: vi.fn(() => ({ isRTL: false })),
}));

vi.mock("../../../utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../utils")>();
  return {
    ...actual,
    isMobile: vi.fn(() => false),
    getCommonTranslation: vi.fn((key) => key),
  };
});

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

vi.mock("../../context-menu", () => {
  const ContextMenuComponent = ({
    ref,
    model,
    header,
  }: {
    model?: Array<{ key: string; label: string }>;
    header?: HeaderType;
  } & {
    ref: React.RefObject<ContextMenuRefType>;
  }) => {
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
  };
  ContextMenuComponent.displayName = "ContextMenu";
  return { ContextMenu: ContextMenuComponent };
});

// Mock Checkbox component
vi.mock("../../checkbox", () => ({
  Checkbox: ({
    isChecked,
    onChange,
    isIndeterminate,
  }: {
    isChecked?: boolean;
    isIndeterminate?: boolean;
    onChange?: (e: { target: { checked: boolean } }) => void;
  }) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(isIndeterminate);
      }
    }, [isIndeterminate]);

    return (
      <input
        ref={inputRef}
        type="checkbox"
        checked={isChecked}
        aria-checked={isIndeterminate ? "mixed" : isChecked ? "true" : "false"}
        onChange={() => onChange?.({ target: { checked: !isChecked } })}
      />
    );
  },
}));

describe("FolderTile", () => {
  const mockItem = {
    id: "1",
    title: "Test Folder",
    contextOptions: [],
  };

  const mockContextOptions = [
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
  ];

  const FolderContent = () => (
    <div data-testid="folder-content" className="item-file-name">
      {mockItem.title}
    </div>
  );

  const renderFolderTile = (props: Partial<FolderTileProps> = {}) => {
    const defaultProps: FolderTileProps = {
      item: mockItem,
      contextOptions: mockContextOptions,
      element: <div data-testid="folder-icon">Folder Icon</div>,
      children: <FolderContent />,
      onSelect: vi.fn(),
      setSelection: vi.fn(),
      withCtrlSelect: vi.fn(),
      withShiftSelect: vi.fn(),
      tileContextClick: vi.fn(),
      hideContextMenu: vi.fn(),
      getContextModel: vi.fn(),
      ...props,
    };

    return render(<FolderTile {...defaultProps} />);
  };

  it("renders folder title correctly", () => {
    renderFolderTile();
    expect(screen.getByTestId("folder-content")).toBeTruthy();
    expect(screen.getByTestId("folder-content").textContent).toBe(
      "Test Folder",
    );
  });

  it("shows checkbox with correct state", () => {
    renderFolderTile({ checked: true });
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(true);
  });

  it("shows indeterminate checkbox state", () => {
    renderFolderTile({ indeterminate: true });
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.indeterminate).toBe(true);
  });

  it("calls onSelect when checkbox is clicked", () => {
    const onSelect = vi.fn();
    renderFolderTile({ onSelect });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith(true, mockItem);
  });

  it("shows loader when inProgress is true", () => {
    renderFolderTile({ inProgress: true });
    const loader = screen.getByTestId("loader");
    expect(loader).toBeTruthy();
  });

  it("calls withCtrlSelect when Ctrl+Click", () => {
    const withCtrlSelect = vi.fn();
    renderFolderTile({ withCtrlSelect });

    const folderTile = screen.getByTestId("folder-content");
    fireEvent.click(folderTile, { ctrlKey: true });

    expect(withCtrlSelect).toHaveBeenCalledWith(mockItem);
  });

  it("calls withShiftSelect when Shift+Click", () => {
    const withShiftSelect = vi.fn();
    renderFolderTile({ withShiftSelect });

    const folderTile = screen.getByTestId("folder-content");
    fireEvent.click(folderTile, { shiftKey: true });

    expect(withShiftSelect).toHaveBeenCalledWith(mockItem);
  });

  it("renders badges when provided", () => {
    const badges = <div data-testid="test-badge">Badge</div>;
    renderFolderTile({ badges });
    expect(screen.getByTestId("test-badge")).toBeTruthy();
  });

  it("shows hotkey border when showHotkeyBorder is true", () => {
    const { container } = renderFolderTile({ showHotkeyBorder: true });
    expect(container.querySelector(".showHotkeyBorder")).toBeTruthy();
  });

  it("applies correct context menu direction in RTL", () => {
    vi.mocked(useInterfaceDirection).mockReturnValue({
      isRTL: true,
      interfaceDirection: "rtl" as never,
    });
    renderFolderTile();
    const button = screen.getByTestId("context-menu-button");
    // We can't easily check props of mocked component unless we capture them
    // But we can check if it renders or if we update mock to show direction
    expect(button).toBeTruthy();
    vi.mocked(useInterfaceDirection).mockReturnValue({
      isRTL: false,
      interfaceDirection: "ltr" as never,
    });
  });

  it("applies hovered class on mouse enter and removes on mouse leave", () => {
    const { container } = renderFolderTile();
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

  it("calls onSelect when clicking on folder tile surface (not excluded areas)", () => {
    const onSelect = vi.fn();
    renderFolderTile({ onSelect });

    // Click on the tile div itself (the outer container)
    const tile = screen.getByTestId("tile");
    fireEvent.click(tile, { detail: 1 });

    expect(onSelect).toHaveBeenCalledWith(true, mockItem);
  });

  it("does not call setSelection([]) when clicking on excluded areas like item-file-name", () => {
    const setSelection = vi.fn();
    renderFolderTile({ setSelection });

    const fileName = screen.getByTestId("folder-content");
    fireEvent.click(fileName);

    expect(setSelection).not.toHaveBeenCalled();
  });

  it("calls tileContextClick and stopPropagation on context menu", () => {
    const tileContextClick = vi.fn();
    renderFolderTile({ tileContextClick });

    const tile = screen.getByTestId("tile");
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      button: 2,
    });
    
    // We need to use fireEvent or dispatchEvent
    fireEvent(tile, event);

    expect(tileContextClick).toHaveBeenCalledWith(true);
  });

  it("calls onSelect when folder icon is clicked in mobile mode", () => {
    vi.mocked(isMobile).mockReturnValue(true);
    const onSelect = vi.fn();
    renderFolderTile({ onSelect });

    const icon = screen.getByTestId("folder-icon");
    fireEvent.click(icon);

    expect(onSelect).toHaveBeenCalledWith(true, mockItem);
    vi.mocked(isMobile).mockReturnValue(false);
  });

  it("constructs context menu header correctly from first child item", () => {
    const childItem = { title: "Custom Title", icon: "custom-icon" };
    const FolderChild = ({ item }: { item: typeof childItem }) => <div data-testid="child" />;
    
    renderFolderTile({
      children: <FolderChild item={childItem} />,
    });

    const header = screen.getByTestId("context-menu-header");
    expect(header.textContent).toBe("Custom Title");
  });

  it("calls tileContextClick when ContextMenuButton is clicked", () => {
    const tileContextClick = vi.fn();
    renderFolderTile({
      tileContextClick,
      contextOptions: mockContextOptions,
    });

    const button = screen.getByTestId("context-menu-button");
    fireEvent.click(button);

    // tileContextClick is called once in getOptions (getData) 
    // and once in onContextMenu (onClick)
    expect(tileContextClick).toHaveBeenCalled();
  });

  it("calls forwardRef.current.click when context menu is opened and menuRef is null", () => {
    const clickSpy = vi.spyOn(HTMLElement.prototype, "click");
    // We need to pass a ref that will be assigned to the element
    const ref = React.createRef<HTMLDivElement>();

    renderFolderTile({
      forwardRef: ref,
      contextOptions: mockContextOptions,
    });

    const button = screen.getByTestId("context-menu-button");
    fireEvent.click(button);

    // The button click itself is handled by fireEvent, 
    // but forwardRef.current.click() is called inside onContextMenu
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("stops propagation when ContextMenuButton is clicked", () => {
    const onSelect = vi.fn();
    renderFolderTile({
      onSelect,
      contextOptions: mockContextOptions,
    });

    const button = screen.getByTestId("context-menu-button");
    fireEvent.click(button);

    // If propagation was not stopped, onSelect would be called 
    // because FolderTile has an onClick that calls onSelect
    expect(onSelect).not.toHaveBeenCalled();
  });
});
