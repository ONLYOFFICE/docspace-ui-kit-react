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

import { BaseTile } from ".";
import { BaseTileProps, TileChildProps } from "./BaseTile.types";
import { ContextMenuButtonProps } from "../../context-menu-button/ContextMenuButton.types";
import { ContextMenuProps, ContextMenuRefType } from "../../context-menu/ContextMenu.types";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("./BaseTile.module.scss", () => ({
  default: {
    baseTile: "baseTile",
    checked: "checked",
    isActive: "isActive",
    isBlockingOperation: "isBlockingOperation",
    showHotkeyBorder: "showHotkeyBorder",
    isEdit: "isEdit",
    iconContainer: "iconContainer",
    icon: "icon",
    checkbox: "checkbox",
    content: "content",
    optionButton: "optionButton",
    expandButton: "expandButton",
    topContent: "topContent",
    bottomContent: "bottomContent",
    loader: "loader",
  },
}));

import { CheckboxProps } from "../../checkbox/Checkbox.types";

vi.mock("../../checkbox", () => ({
  Checkbox: ({ isChecked, onChange }: CheckboxProps) => (
    <input
      type="checkbox"
      checked={isChecked}
      readOnly
      onClick={() =>
        onChange?.({
          target: { checked: !isChecked },
        } as React.ChangeEvent<HTMLInputElement>)
      }
      data-testid="checkbox"
    />
  ),
}));

vi.mock("../../../utils", async () => {
  const actual = await vi.importActual("../../../utils");
  return {
    ...actual,
    isMobile: vi.fn(() => false),
    getCommonTranslation: (key: string) => key,
  };
});

vi.mock("../../context-menu-button", () => ({
  ContextMenuButton: ({ onClick, getData }: ContextMenuButtonProps) => (
    <button
      data-testid="context-menu-button"
      onClick={(e) => {
        getData?.();
        onClick?.(e);
      }}
    >
      ContextMenuButton
    </button>
  ),
  ContextMenuButtonDisplayType: { toggle: "toggle" },
}));

const mockCMShow = vi.fn();
vi.mock("../../context-menu", () => ({
  ContextMenu: React.forwardRef<ContextMenuRefType, ContextMenuProps>(
    (props, ref) => {
      React.useImperativeHandle(ref, () => ({
        show: mockCMShow,
        hide: vi.fn(),
        toggle: vi.fn(),
        menuRef: { current: null }, // Return null to trigger alternate path in onContextMenu
      }));
      return (
        <div
          data-testid="context-menu"
          data-header={JSON.stringify(props.header)}
        />
      );
    },
  ),
}));

import { isMobile } from "../../../utils";

describe("BaseTile", () => {
  const mockItem = {
    id: "1",
    title: "Test Tile",
    contextOptions: [],
  };

  const mockContextOptions = [
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
  ];

  const defaultProps: BaseTileProps = {
    item: mockItem,
    contextOptions: mockContextOptions,
    element: <div data-testid="tile-icon">Tile Icon</div>,
  };

  const TileTopContent = () => (
    <div data-testid="top-content">Top Content</div>
  );

  it("renders tile correctly", () => {
    render(
      <BaseTile {...defaultProps} topContent={<TileTopContent />} />,
    );
    expect(screen.getByTestId("tile")).toBeTruthy();
    expect(screen.getByTestId("top-content")).toBeTruthy();
  });

  it("shows checkbox when checked prop is provided", () => {
    render(
      <BaseTile {...defaultProps} checked topContent={<TileTopContent />} />,
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(true);
  });

  it("calls onSelect when checkbox is clicked", () => {
    const onSelect = vi.fn();
    render(
      <BaseTile
        {...defaultProps}
        onSelect={onSelect}
        topContent={<TileTopContent />}
      />,
    );

    const checkbox = screen.getByTestId("checkbox");
    fireEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith(true, mockItem);
  });

  it("shows loader when inProgress is true", () => {
    render(
      <BaseTile {...defaultProps} inProgress topContent={<TileTopContent />} />,
    );
    const loader = screen.getByTestId("loader");
    expect(loader).toBeTruthy();
  });

  it("renders element icon when provided", () => {
    render(
      <BaseTile {...defaultProps} topContent={<TileTopContent />} />,
    );
    expect(screen.getByTestId("tile-icon")).toBeTruthy();
  });

  it("renders bottom content when provided", () => {
    const bottomContent = <div data-testid="bottom-content">Bottom</div>;
    render(
      <BaseTile
        {...defaultProps}
        topContent={<TileTopContent />}
        bottomContent={bottomContent}
      />,
    );
    expect(screen.getByTestId("bottom-content")).toBeTruthy();
  });

  it("applies active class when isActive is true", () => {
    const { container } = render(
      <BaseTile {...defaultProps} isActive topContent={<TileTopContent />} />,
    );
    const element = container.querySelector("[class*='isActive']");
    expect(element).toBeTruthy();
  });

  it("shows hotkey border when showHotkeyBorder is true", () => {
    const { container } = render(
      <BaseTile
        {...defaultProps}
        showHotkeyBorder
        topContent={<TileTopContent />}
      />,
    );
    const element = container.querySelector("[class*='showHotkeyBorder']");
    expect(element).toBeTruthy();
  });

  it("applies checked class when checked is true", () => {
    const { container } = render(
      <BaseTile {...defaultProps} checked topContent={<TileTopContent />} />,
    );
    const element = container.querySelector("[class*='checked']");
    expect(element).toBeTruthy();
  });

  it("calls onRoomClick when tile is clicked", () => {
    const onRoomClick = vi.fn();
    render(
      <BaseTile
        {...defaultProps}
        onRoomClick={onRoomClick}
        topContent={<TileTopContent />}
      />,
    );

    const tile = screen.getByTestId("tile");
    fireEvent.click(tile);

    expect(onRoomClick).toHaveBeenCalled();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <BaseTile
        {...defaultProps}
        className="custom-class"
        topContent={<TileTopContent />}
      />,
    );
    const element = container.querySelector(".custom-class");
    expect(element).toBeTruthy();
  });

  it("applies edit mode class when isEdit is true", () => {
    const { container } = render(
      <BaseTile {...defaultProps} isEdit topContent={<TileTopContent />} />,
    );
    const element = container.querySelector("[class*='isEdit']");
    expect(element).toBeTruthy();
  });

  it("calls onSelect when icon is clicked in mobile mode", () => {
    vi.mocked(isMobile).mockReturnValue(true);
    const onSelect = vi.fn();
    render(
      <BaseTile
        {...defaultProps}
        onSelect={onSelect}
        topContent={<TileTopContent />}
      />,
    );

    const icon = screen.getByTestId("tile-icon");
    fireEvent.click(icon);

    expect(onSelect).toHaveBeenCalledWith(true, mockItem);
  });

  it("does not call onSelect when icon is clicked in desktop mode", () => {
    vi.mocked(isMobile).mockReturnValue(false);
    const onSelect = vi.fn();
    render(
      <BaseTile
        {...defaultProps}
        onSelect={onSelect}
        topContent={<TileTopContent />}
      />,
    );

    const icon = screen.getByTestId("tile-icon");
    fireEvent.click(icon);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("calls tileContextClick and show onContextMenu", () => {
    const tileContextClick = vi.fn();
    const getContextModel = vi.fn();
    render(
      <BaseTile
        {...defaultProps}
        tileContextClick={tileContextClick}
        getContextModel={getContextModel}
        topContent={<TileTopContent />}
      />,
    );

    const tile = screen.getByTestId("tile");
    fireEvent.contextMenu(tile);

    expect(tileContextClick).toHaveBeenCalled();
    expect(mockCMShow).toHaveBeenCalled();
  });

  it("calls onContextMenu from context menu button", () => {
    const tileContextClick = vi.fn();
    render(
      <BaseTile
        {...defaultProps}
        tileContextClick={tileContextClick}
        getContextModel={() => []}
        topContent={<TileTopContent />}
      />,
    );

    const button = screen.getByTestId("context-menu-button");
    fireEvent.click(button);

    expect(tileContextClick).toHaveBeenCalled();
    expect(mockCMShow).toHaveBeenCalled();
  });

  it("derives context menu header from child item if available", () => {
    const childItem = { title: "Child Title", logo: { color: "red" } };
    const ChildComponent = (props: TileChildProps) => (
      <div data-item={JSON.stringify(props.item)}>Child</div>
    );

    render(
      <BaseTile
        {...defaultProps}
        topContent={<ChildComponent item={childItem} />}
      />,
    );

    const contextMenu = screen.getByTestId("context-menu");
    const header = JSON.parse(contextMenu.getAttribute("data-header") || "{}");
    expect(header.title).toBe("Child Title");
    expect(header.color).toBe("red");
  });

  it("clicks forwardRef if context menu is not yet initialized", () => {
    const forwardRef = {
      current: { click: vi.fn() } as unknown as HTMLDivElement,
    } as React.RefObject<HTMLDivElement | null>;
    render(
      <BaseTile
        {...defaultProps}
        forwardRef={forwardRef}
        topContent={<TileTopContent />}
      />,
    );

    const tile = screen.getByTestId("tile");
    fireEvent.contextMenu(tile);

    expect(forwardRef.current!.click).toHaveBeenCalled();
  });

  it("handles complex logo cover", () => {
    const itemWithCover = {
      ...mockItem,
      logo: {
        cover: { data: "cover-data", id: "cover-id" },
      },
    };
    render(
      <BaseTile
        {...defaultProps}
        item={itemWithCover}
        topContent={<TileTopContent />}
      />,
    );

    const contextMenu = screen.getByTestId("context-menu");
    const header = JSON.parse(contextMenu.getAttribute("data-header") || "{}");
    expect(header.cover).toEqual({ data: "cover-data", id: "cover-id" });
  });

  it("handles string logo cover", () => {
    const itemWithCover = {
      ...mockItem,
      logo: {
        cover: "string-cover-data",
      },
    };
    render(
      <BaseTile
        {...defaultProps}
        item={itemWithCover}
        topContent={<TileTopContent />}
      />,
    );

    const contextMenu = screen.getByTestId("context-menu");
    const header = JSON.parse(contextMenu.getAttribute("data-header") || "{}");
    expect(header.cover).toEqual({ data: "string-cover-data", id: "" });
  });

  it("derives context menu header from displayName if title is missing", () => {
    const itemWithDisplayName = {
      id: "1",
      displayName: "Display Name",
      contextOptions: [],
    };
    render(
      <BaseTile
        {...defaultProps}
        item={itemWithDisplayName}
        topContent={<TileTopContent />}
      />,
    );

    const contextMenu = screen.getByTestId("context-menu");
    const header = JSON.parse(contextMenu.getAttribute("data-header") || "{}");
    expect(header.title).toBe("Display Name");
  });

  it("handles all logo sizes", () => {
    const itemWithLogos = {
      ...mockItem,
      logo: {
        original: "orig",
        large: "lg",
        medium: "md",
        small: "sm",
      },
    };
    render(
      <BaseTile
        {...defaultProps}
        item={itemWithLogos}
        topContent={<TileTopContent />}
      />,
    );

    const contextMenu = screen.getByTestId("context-menu");
    const header = JSON.parse(contextMenu.getAttribute("data-header") || "{}");
    expect(header.original).toBe("orig");
    expect(header.large).toBe("lg");
    expect(header.medium).toBe("md");
    expect(header.small).toBe("sm");
  });
});
