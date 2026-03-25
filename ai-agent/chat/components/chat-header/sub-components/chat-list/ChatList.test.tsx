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
