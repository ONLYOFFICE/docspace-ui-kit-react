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

import type { TMessage } from "../../../types/ai";
import { useApi } from "../../../providers";

const cacheChatId = new Map<string, string>();

const useInitMessages = (agentId: string | number) => {
  const [messages, setMessages] = React.useState<TMessage[]>([]);
  const [chatId, setChatId] = React.useState("");
  const [total, setTotal] = React.useState(0);
  const { aiApi } = useApi();

  const resetChat = useCallback(() => {
    setMessages([]);
    setTotal(0);
    setChatId("");
    cacheChatId.delete("chat");
  }, []);

  React.useEffect(() => {
    resetChat();
  }, [agentId, resetChat]);

  React.useEffect(() => {
    const onCacheChat = (e: Event) => {
      const chatId = (e as CustomEvent<{ chatId: string }>).detail.chatId;

      if (chatId) {
        cacheChatId.set("chat", chatId);
      } else {
        resetChat();
      }
    };

    window.addEventListener("select-chat", onCacheChat);

    return () => {
      window.removeEventListener("select-chat", onCacheChat);
    };
  }, [resetChat]);

  const initMessages = React.useCallback(async () => {
    try {
      const currChatId =
        new URLSearchParams(window.location.search).get("chat") ??
        cacheChatId.get("chat");

      if (!currChatId) {
        resetChat();
        return;
      }

      cacheChatId.set("chat", currChatId);

      const { items, total } = await aiApi.getChatMessages(currChatId, 0);

      const reversedItems = items.reverse();

      setMessages(reversedItems);
      setTotal(total);
      setChatId(currChatId);
    } catch (error) {
      console.error(error);
      const currentSearch = new URLSearchParams(window.location.search);
      currentSearch.delete("chat");
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${currentSearch.toString()}`,
      );
      resetChat();
    }
  }, [resetChat]);

  return {
    messages,
    chatId,
    total,
    initMessages,
  };
};

export default useInitMessages;
