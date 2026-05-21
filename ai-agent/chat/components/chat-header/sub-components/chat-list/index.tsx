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

import React, { useCallback } from "react";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import type { TChat } from "../../../../../../types/ai";
import { useInterfaceDirection } from "../../../../../../context/InterfaceDirectionContext";
import { Scrollbar } from "../../../../../../components/scrollbar";
import { CHAT_LIST_WIDTH } from "../../constants";
import { getSelectChatRowHeight } from "../../utils";
import { RectangleSkeleton } from "../../../../../../components/rectangle";
import { ChatListItem } from "../chat-list-item";
import { ContextMenuModel } from "../../../../../../components/context-menu";

type TRowData = {
  chats: TChat[];
  onSelectChat: (id: TChat["id"]) => void;
  contextModel: ContextMenuModel[];
  hoveredChatId?: TChat["id"];
  setHoveredChatId: (id: TChat["id"]) => void;
  activeChatId?: TChat["id"];
};

type RowProps = {
  data: TRowData;
  index: number;
  style: React.CSSProperties;
};

const Row = ({ data, index, style }: RowProps) => {
  const chat = data.chats[index];

  return (
    <div style={style}>
      {chat ? (
        <ChatListItem
          chat={chat}
          onClick={data.onSelectChat}
          hoveredChatId={data.hoveredChatId}
          setHoveredChatId={data.setHoveredChatId}
          contextModel={data.contextModel}
          activeChatId={data.activeChatId}
        />
      ) : (
        <RectangleSkeleton height="32px" borderRadius="3px" />
      )}
    </div>
  );
};

export type ChatListProps = {
  chats: TChat[];
  onSelectChat: (id: TChat["id"]) => void;
  contextModel: ContextMenuModel[];
  hoveredChatId: TChat["id"];
  setHoveredChatId: (id: TChat["id"]) => void;
  activeChatId?: TChat["id"];
  loadNextPage: (startIndex: number) => void;
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  total: number;
};

export const ChatList = ({
  chats,
  onSelectChat,
  contextModel,
  hoveredChatId,
  setHoveredChatId,
  activeChatId,

  loadNextPage,
  hasNextPage,
  isNextPageLoading,
  total,
}: ChatListProps) => {
  const { interfaceDirection } = useInterfaceDirection();

  const itemCount = hasNextPage ? chats.length + 1 : chats.length;

  const isItemLoaded = useCallback(
    (index: number) => {
      return !hasNextPage || index < itemCount - 1;
    },
    [hasNextPage, itemCount],
  );

  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  return (
    <AutoSizer>
      {({ height }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          loadMoreItems={loadMoreItems}
          itemCount={total}
        >
          {({ onItemsRendered, ref }) => (
            <List
              className="chats-list-scroll"
              ref={ref}
              direction={interfaceDirection}
              height={height}
              width={CHAT_LIST_WIDTH}
              itemCount={itemCount}
              itemSize={getSelectChatRowHeight()}
              itemData={{
                chats,
                onSelectChat,
                contextModel,
                hoveredChatId,
                setHoveredChatId,
                activeChatId,
              }}
              outerElementType={Scrollbar}
              onItemsRendered={onItemsRendered}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};
