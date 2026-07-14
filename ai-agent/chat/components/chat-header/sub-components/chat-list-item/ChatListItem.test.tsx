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

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import { ChatListItem } from "./index";
import * as utils from "../../../../../../utils";
import { ContextMenuModel } from "../../../../../../components/context-menu";

import type { TChat } from "../../../../../../types/ai";

// Mock components
vi.mock("../../../../../../components/drop-down-item", () => ({
  DropDownItem: ({
    children,
    onClick,
    isActive,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    isActive?: boolean;
  }) => (
    <div data-testid="drop-down-item" data-active={isActive} onClick={onClick}>
      {children}
    </div>
  ),
}));

vi.mock("../../../../../../components/text", () => ({
  Text: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid="chat-title">
      {children}
    </div>
  ),
}));

vi.mock("../../../../../../components/icon-button", () => ({
  IconButton: ({
    onClick,
    dataTestId,
  }: {
    onClick: (e: React.MouseEvent) => void;
    dataTestId?: string;
  }) => (
    <button data-testid={dataTestId} onClick={onClick}>
      icon
    </button>
  ),
}));

vi.mock("../../../../../../components/context-menu", () => ({
  ContextMenu: React.forwardRef<unknown, { model: unknown[] }>((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      show: vi.fn(),
    }));
    return <div data-testid="context-menu" />;
  }),
}));

// Mock SVG
vi.mock("../../../../../../assets/icons/16/vertical-dots.react.svg", () => ({
  default: () => <svg />,
}));

describe("<ChatListItem />", () => {
  const mockChat = {
    id: "chat-123",
    title: "Test Chat",
    lastMessage: "hello",
    updated: "2023-01-01",
  };
  const mockOnClick = vi.fn();
  const mockSetHoveredChatId = vi.fn();
  const mockContextModel: ContextMenuModel[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    chat: mockChat as unknown as TChat,
    onClick: mockOnClick,
    contextModel: mockContextModel,
    setHoveredChatId: mockSetHoveredChatId,
  };

  it("calls onClick when clicking on the item", () => {
    vi.spyOn(utils, "isDesktop").mockReturnValue(true);
    render(<ChatListItem {...defaultProps} />);

    const item = screen.getByTestId("drop-down-item");
    fireEvent.click(item);

    expect(mockOnClick).toHaveBeenCalledWith("chat-123");
  });

  it("does not call onClick when clicking on the icon wrapper", () => {
    vi.spyOn(utils, "isDesktop").mockReturnValue(true);
    render(<ChatListItem {...defaultProps} hoveredChatId="chat-123" />);

    const menuButton = screen.getByTestId("chat-list-item-context-menu-button");
    fireEvent.click(menuButton);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("calls setHoveredChatId on mouse enter", () => {
    render(<ChatListItem {...defaultProps} />);
    const wrapper = screen.getByText("Test Chat").closest("div");
    if (wrapper) fireEvent.mouseEnter(wrapper);
    expect(mockSetHoveredChatId).toHaveBeenCalledWith("chat-123");
  });

  it("shows menu button if hovered on desktop", () => {
    vi.spyOn(utils, "isDesktop").mockReturnValue(true);
    const { rerender } = render(
      <ChatListItem {...defaultProps} hoveredChatId="" />,
    );
    expect(
      screen.queryByTestId("chat-list-item-context-menu-button"),
    ).not.toBeInTheDocument();

    rerender(<ChatListItem {...defaultProps} hoveredChatId="chat-123" />);
    expect(
      screen.getByTestId("chat-list-item-context-menu-button"),
    ).toBeInTheDocument();
  });

  it("always shows menu button on mobile/tablet", () => {
    vi.spyOn(utils, "isDesktop").mockReturnValue(false);
    render(<ChatListItem {...defaultProps} hoveredChatId="" />);
    expect(
      screen.getByTestId("chat-list-item-context-menu-button"),
    ).toBeInTheDocument();
  });
});
