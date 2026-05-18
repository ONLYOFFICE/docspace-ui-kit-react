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

import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

import type { TChat } from "../../../../../../types/ai";
import { ChatList, type ChatListProps } from "./index";

// Mock virtualization components to just render children
vi.mock("react-virtualized-auto-sizer", () => ({
  default: ({
    children,
  }: {
    children: (size: { height: number; width: number }) => React.ReactNode;
  }) => children({ height: 500, width: 300 }),
}));

vi.mock("react-window-infinite-loader", () => ({
  default: ({
    children,
    isItemLoaded,
  }: {
    children: (props: {
      onItemsRendered: Mock;
      ref: React.Ref<unknown> | null;
    }) => React.ReactNode;
    itemCount: number;
    isItemLoaded: (index: number) => boolean;
    loadMoreItems: () => void;
  }) => {
    // We can call isItemLoaded to test it
    isItemLoaded(0);
    return children({ onItemsRendered: vi.fn(), ref: null });
  },
}));

vi.mock("react-window", () => ({
  FixedSizeList: ({
    children,
    itemCount,
    itemData,
  }: {
    children: (props: {
      index: number;
      style: React.CSSProperties;
      data: unknown;
    }) => React.ReactNode;
    itemCount: number;
    itemData: unknown;
  }) => (
    <div data-testid="virtual-list" data-itemcount={itemCount}>
      {/* Render only first item for testing */}
      {children({ index: 0, style: {}, data: itemData })}
    </div>
  ),
}));

// Mock child component
vi.mock("../chat-list-item", () => ({
  ChatListItem: () => <div data-testid="chat-list-item" />,
}));

// Mock Scrollbar
vi.mock("../../../../../../components/scrollbar", () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scrollbar">{children}</div>
  ),
}));

describe("<ChatList />", () => {
  const defaultProps: ChatListProps = {
    chats: [{ id: "1", title: "Chat 1" } as TChat],
    onSelectChat: vi.fn(),
    contextModel: [],
    hoveredChatId: "",
    setHoveredChatId: vi.fn(),
    loadNextPage: vi.fn(),
    hasNextPage: false,
    isNextPageLoading: false,
    total: 10,
  };

  it("calculates correct itemCount and renders list", () => {
    const { rerender } = render(
      <ChatList {...defaultProps} hasNextPage={false} />,
    );
    let list = screen.getByTestId("virtual-list");
    expect(list.getAttribute("data-itemcount")).toBe("1"); // chats.length

    rerender(<ChatList {...defaultProps} hasNextPage={true} />);
    list = screen.getByTestId("virtual-list");
    expect(list.getAttribute("data-itemcount")).toBe("2"); // chats.length + 1
  });

  it("renders ChatListItem for loaded items", () => {
    render(<ChatList {...defaultProps} />);
    expect(screen.getByTestId("chat-list-item")).toBeInTheDocument();
  });
});
