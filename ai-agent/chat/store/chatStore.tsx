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

import { makeAutoObservable } from "mobx";
import React from "react";
import type { Nullable } from "../../../types";
import type { TChat } from "../../../types/ai";
import socket, { SocketEvents } from "../../../utils/socket";
import { toastr } from "../../../components/toast";
import type { TChatStoreProps } from "../Chat.types";
import type { AiApi } from "../../../api/ai";
import { useApi } from "../../../providers";

export default class ChatStore {
  private aiApi: AiApi;

  currentChat: Nullable<TChat> = null;

  chats: TChat[] = [];

  totalChats: number = 0;

  agentId: TChatStoreProps["agentId"] = "";

  isLoading: boolean = false;

  isRequestRunning: boolean = false;

  constructor(aiApi: AiApi) {
    this.aiApi = aiApi;
    makeAutoObservable(this);
  }

  setAgentId = (value: TChatStoreProps["agentId"]) => {
    this.agentId = value;
  };

  setTotalChats = (value: number) => {
    this.totalChats = value;
  };

  setChats = (value: TChat[]) => {
    this.chats = value;
  };

  updateUrlChatId = (chatId: string) => {
    const currentSearch = new URLSearchParams(window.location.search);

    if (currentSearch.get("chat") !== chatId) {
      if (chatId) {
        currentSearch.set("chat", chatId);
      } else {
        currentSearch.delete("chat");
      }
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${currentSearch.toString()}`,
      );
    }
  };

  setCurrentChat = (chat: TChat | null) => {
    this.updateUrlChatId(chat?.id ?? "");

    this.currentChat = chat;
  };

  setIsRequestRunning = (value: boolean) => {
    this.isRequestRunning = value;
  };

  setIsLoading = (value: boolean) => {
    this.isLoading = value;
  };

  fetchChat = async (id: string) => {
    try {
      const chat = await this.aiApi.getChat(id);

      this.setCurrentChat(chat);

      if (!this.chats.some((c) => c.id === chat.id)) {
        this.chats = [chat, ...this.chats];
        this.setTotalChats(this.totalChats + 1);
      }
    } catch (error) {
      console.error(error);
      toastr.error(error as string);
    }
  };

  addChats = (chats: TChat[]) => {
    this.chats.push(...chats);
  };

  fetchNextChats = async (startIndex: number) => {
    if (this.isRequestRunning) return;

    this.setIsRequestRunning(true);
    this.setIsLoading(true);

    try {
      const { items, total } = await this.aiApi.getChats(
        this.agentId,
        startIndex,
      );

      this.addChats(items);
      this.setTotalChats(total);
    } catch (error) {
      console.error(error);
      toastr.error(error as string);
    } finally {
      this.setIsRequestRunning(false);
      this.setIsLoading(false);
    }
  };

  renameChat = async (id: string, title: string) => {
    await this.aiApi.renameChat(id, title);

    this.chats = this.chats.map((c) => (c.id === id ? { ...c, title } : c));
  };

  deleteChat = async (id: string) => {
    await this.aiApi.deleteChat(id);

    if (this.currentChat?.id === id) {
      this.setCurrentChat(null);
    }
    this.chats = this.chats.filter((chat) => chat.id !== id);

    this.setTotalChats(this.totalChats - 1);
  };

  updateChatTitle = (chatId: string, chatTitle: string) => {
    const foundChatIndex = this.chats.findIndex((chat) => chat.id === chatId);
    if (foundChatIndex > -1) {
      this.chats[foundChatIndex].title = chatTitle;
    }
  };

  get hasNextChats() {
    return this.totalChats > this.chats.length;
  }
}

export const ChatStoreContext = React.createContext<ChatStore>({} as ChatStore);

export const ChatStoreContextProvider = ({
  agentId,

  chats,
  totalChats,
  children,
}: TChatStoreProps) => {
  const { aiApi } = useApi();
  const store = React.useMemo(() => new ChatStore(aiApi), [aiApi]);

  React.useEffect(() => {
    store.setAgentId(agentId);
  }, [store, agentId]);

  React.useEffect(() => {
    store.setChats(chats);
  }, [store, chats]);

  React.useEffect(() => {
    store.setTotalChats(totalChats);
  }, [store, totalChats]);

  React.useEffect(() => {
    const callback = ({
      chatId,
      chatTitle,
    }: {
      chatId: string;
      chatTitle: string;
    }) => {
      store.updateChatTitle(chatId, chatTitle);
    };

    socket?.on(SocketEvents.UpdateChat, callback);

    return () => {
      socket?.off(SocketEvents.UpdateChat, callback);
    };
  }, [store]);

  return (
    <ChatStoreContext.Provider value={store}>
      {children}
    </ChatStoreContext.Provider>
  );
};

export const useChatStore = () => {
  return React.useContext(ChatStoreContext);
};
