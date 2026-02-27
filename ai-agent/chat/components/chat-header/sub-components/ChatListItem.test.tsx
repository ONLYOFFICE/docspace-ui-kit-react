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

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import { ChatListItem } from "./ChatListItem";
import * as utils from "../../../../../utils";
import { ContextMenuModel } from "../../../../../components/context-menu";

import type { TChat } from "../../../../../types/ai";

// Mock components
vi.mock("../../../../../components/drop-down-item", () => ({
  DropDownItem: ({ children, onClick, isActive }: { children: React.ReactNode; onClick: () => void; isActive?: boolean }) => (
    <div data-testid="drop-down-item" data-active={isActive} onClick={onClick}>
      {children}
    </div>
  ),
}));

vi.mock("../../../../../components/text", () => ({
  Text: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className} data-testid="chat-title">{children}</div>,
}));

vi.mock("../../../../../components/icon-button", () => ({
  IconButton: ({ onClick, dataTestId }: { onClick: (e: React.MouseEvent) => void; dataTestId?: string }) => (
    <button data-testid={dataTestId} onClick={onClick}>icon</button>
  ),
}));

vi.mock("../../../../../components/context-menu", () => ({
  ContextMenu: React.forwardRef<unknown, { model: unknown[] }>((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      show: vi.fn(),
    }));
    return <div data-testid="context-menu" />;
  }),
}));

// Mock SVG
vi.mock("../../../../../assets/icons/16/vertical-dots.react.svg", () => ({
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
    const { rerender } = render(<ChatListItem {...defaultProps} hoveredChatId="" />);
    expect(screen.queryByTestId("chat-list-item-context-menu-button")).not.toBeInTheDocument();

    rerender(<ChatListItem {...defaultProps} hoveredChatId="chat-123" />);
    expect(screen.getByTestId("chat-list-item-context-menu-button")).toBeInTheDocument();
  });

  it("always shows menu button on mobile/tablet", () => {
    vi.spyOn(utils, "isDesktop").mockReturnValue(false);
    render(<ChatListItem {...defaultProps} hoveredChatId="" />);
    expect(screen.getByTestId("chat-list-item-context-menu-button")).toBeInTheDocument();
  });
});
