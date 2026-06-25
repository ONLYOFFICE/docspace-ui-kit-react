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
import { render, fireEvent, screen, within } from "@testing-library/react";
import { ContextMenuModel } from "../../context-menu/ContextMenu.types";
import { RoomTile } from ".";
import { RoomTileProps } from "./RoomTile.types";

// Mock translations
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock styles - return default export for CSS Modules
vi.mock("./RoomTile.module.scss", () => ({
  default: {
    roomTile: "roomTile",
  },
}));

interface TagProps {
  label: string;
  onClick?: () => void;
  isDefault?: boolean;
  isThirdParty?: boolean;
  icon?: string;
  roomType?: number | string;
  providerType?: number | string;
}

// Mock Tags component to mimic key behaviour
vi.mock("../../tags", () => ({
  Tags: ({
    tags,
    onSelectTag,
  }: {
    tags: TagProps[];
    onSelectTag?: (tag: TagProps) => void;
  }) => (
    <div data-testid="tags" className="tags">
      {tags.map((tag) => {
        const normalized =
          typeof tag === "string"
            ? ({ label: tag } as TagProps)
            : (tag as TagProps);
        const label = normalized.label;
        const handleClick = () => {
          normalized.onClick?.();
          onSelectTag?.(normalized);
        };

        return (
          <div
            key={label}
            data-testid="tag_item"
            data-tag={label}
            aria-label={label}
            className="tag"
            onClick={handleClick}
          >
            {normalized.isThirdParty ? (
              <svg data-testid="mocked-react-svg" />
            ) : (
              <p data-testid="text">{label}</p>
            )}
          </div>
        );
      })}
    </div>
  ),
}));

interface BaseTileProps {
  onHover?: () => void;
  onLeave?: () => void;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  className?: string;
  onRoomClick?: () => void;
}

// Mock BaseTile component
vi.mock("../base-tile/BaseTile", () => ({
  BaseTile: ({
    onHover,
    onLeave,
    topContent,
    bottomContent,
    className,
    onRoomClick,
  }: BaseTileProps) => (
    <div
      data-testid="tile"
      className={className}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onRoomClick}
    >
      {topContent}
      {bottomContent}
    </div>
  ),
}));

describe("RoomTile", () => {
  const mockRoomType = "collaborative";
  const mockProviderType = "personal";

  const mockItem = {
    id: "1",
    title: "Test Room",
    roomType: mockRoomType,
    providerType: mockProviderType,
    providerKey: "provider-key",
    thirdPartyIcon: "icon-url",
    tags: [{ label: "Custom Tag" }],
  };

  const mockContextOptions: ContextMenuModel[] = [
    { key: "edit", label: "Edit", onClick: vi.fn() },
    { key: "delete", label: "Delete", onClick: vi.fn() },
  ];

  const RoomContent = () => (
    <div data-testid="room-content">{mockItem.title}</div>
  );

  const renderRoomTile = (props: Partial<RoomTileProps> = {}) => {
    const defaultProps: RoomTileProps = {
      item: mockItem,
      children: <RoomContent />,
      columnCount: 3,
      selectTag: vi.fn(),
      selectOption: vi.fn(),
      getRoomTypeName: vi.fn().mockReturnValue("Room Type Name"),
      thumbnailClick: vi.fn(),
      contextOptions: mockContextOptions,
      onSelect: vi.fn(),
      checked: false,
      isActive: false,
      isBlockingOperation: false,
      inProgress: false,
      isEdit: false,
      showHotkeyBorder: false,
      ...props,
    };

    return render(<RoomTile {...defaultProps} />);
  };

  it("renders room title correctly", () => {
    renderRoomTile();
    expect(screen.getByTestId("room-content")).toBeTruthy();
    expect(screen.getByTestId("room-content").textContent).toBe("Test Room");
  });

  it("renders provider tag when providerType exists", () => {
    renderRoomTile();
    const tag = screen.getByLabelText("provider-key");
    expect(tag).toBeTruthy();
    expect(tag.getAttribute("data-tag")).toBe("provider-key");
  });

  it("renders custom tags when provided", () => {
    renderRoomTile();
    const tag = screen.getByLabelText("Custom Tag");
    expect(tag).toBeTruthy();
    expect(within(tag).getByText("Custom Tag")).toBeTruthy();
  });

  it("renders default room type tag when no custom tags", () => {
    const itemWithoutTags = {
      ...mockItem,
      tags: [],
      providerType: undefined,
      providerKey: undefined,
    };
    const getRoomTypeName = vi.fn().mockReturnValue("Collaborative Room");

    renderRoomTile({
      item: itemWithoutTags,
      getRoomTypeName,
    });

    const tag = screen.getByLabelText("Collaborative Room");
    expect(tag).toBeTruthy();
    expect(within(tag).getByText("Collaborative Room")).toBeTruthy();
    expect(getRoomTypeName).toHaveBeenCalledWith(
      mockRoomType,
      expect.any(Function),
    );
  });

  it("calls thumbnailClick when room is clicked", () => {
    const thumbnailClick = vi.fn();
    renderRoomTile({ thumbnailClick });

    const baseTile = screen.getByTestId("tile");
    fireEvent.click(baseTile);

    expect(thumbnailClick).toHaveBeenCalled();
  });

  it("calls selectOption with provider type when provider tag is clicked", () => {
    const selectOption = vi.fn();
    renderRoomTile({ selectOption });

    const providerTag = screen.getByLabelText("provider-key");
    fireEvent.click(providerTag);

    expect(selectOption).toHaveBeenCalledWith({
      option: "typeProvider",
      value: mockProviderType,
    });
  });

  it("calls selectOption with room type when default tag is clicked", () => {
    const selectOption = vi.fn();
    const getRoomTypeName = vi.fn().mockReturnValue("Collaborative Room");
    const itemWithoutTags = {
      ...mockItem,
      tags: [],
      providerType: undefined,
      providerKey: undefined,
    };

    renderRoomTile({
      item: itemWithoutTags,
      selectOption,
      getRoomTypeName,
    });

    const roomTypeTag = screen.getByLabelText("Collaborative Room");
    fireEvent.click(roomTypeTag);

    expect(selectOption).toHaveBeenCalledWith({
      option: "defaultTypeRoom",
      value: mockRoomType,
    });
  });

  it("renders badges when provided", () => {
    const badges = <div data-testid="test-badge">Badge</div>;
    renderRoomTile({ badges });
    expect(screen.getByTestId("test-badge")).toBeTruthy();
  });

  it("handles hover states correctly", () => {
    renderRoomTile();
    const baseTile = screen.getByTestId("tile");

    fireEvent.mouseEnter(baseTile);
    // Here we could check for hover styles or states if needed

    fireEvent.mouseLeave(baseTile);
    // Here we could check that hover styles or states are removed
  });
});
