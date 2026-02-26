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

import { FolderContentDtoInteger } from "@onlyoffice/docspace-api-sdk";

import { BaseCustomApi } from "../base-custom-api";
import { TAIConfig, TChat, TMCPTool, TMessage, TServer } from "../../types/ai";
import { toastr } from "../../components/toast";
import { TFile } from "../../types";
import { ToolsPermission } from "../../enums";

export class AiApi extends BaseCustomApi {
  getChats(
    roomId: number | string,
    startIndex: number = 0,
    count: number = 100,
  ) {
    return this.request<{ items: TChat[]; total: number }>(
      `/ai/rooms/${roomId}/chats`,
      {
        params: { startIndex, count },
      },
    );
  }

  getChat(chatId: string) {
    return this.request<TChat>(`/ai/chats/${chatId}`);
  }

  deleteChat(chatId: string) {
    return this.request(`/ai/chats/${chatId}`, {
      method: "DELETE",
    });
  }

  renameChat(chatId: string, name: string) {
    return this.request<TChat>(`/ai/chats/${chatId}`, {
      method: "PUT",
      data: { name },
    });
  }

  async exportChat(chatId: string, folderId: string | number, title: string) {
    try {
      return await this.request<TChat>(`/ai/chats/${chatId}/messages/export`, {
        method: "POST",
        data: { folderId, title },
      });
    } catch (e) {
      console.log(e);
      toastr.error(e as string);
    }
  }

  getChatMessages(chatId: string, startIndex: number, count: number = 100) {
    return this.request<{ items: TMessage[]; total: number }>(
      `/ai/chats/${chatId}/messages`,
      {
        method: "GET",
        params: { startIndex, count },
      },
    );
  }

  async exportChatMessage(
    messageId: number,
    folderId: string | number,
    title: string,
  ) {
    try {
      return await this.request<TFile>(`/ai/messages/${messageId}/export`, {
        method: "POST",
        data: { folderId, title },
      });
    } catch (e) {
      console.log(e);
      toastr.error(e as string);
    }
  }

  async getMCPToolsForRoom(room: number, mcpId: string) {
    try {
      return await this.request<TMCPTool[]>(
        `/ai/rooms/${room}/servers/${mcpId}/tools`,
        {
          method: "GET",
        },
      );
    } catch (e) {
      console.log(e);
      toastr.error(e as string);
    }
  }

  changeMCPToolsForRoom(room: number, mcpId: string, disabledTools: string[]) {
    return this.request(`/ai/rooms/${room}/servers/${mcpId}/tools`, {
      method: "PUT",
      data: { disabledTools },
    });
  }

  async updateWebSearchInRoom(roomId: number, webSearchEnabled: boolean) {
    try {
      return await this.request(`/ai/rooms/${roomId}/chats/config`, {
        method: "PUT",
        data: { webSearchEnabled },
      });
    } catch (e) {
      console.log(e);
      toastr.error(e as string);
    }
  }

  async getServersListForRoom(roomId: number) {
    try {
      return await this.request<TServer[]>(`/ai/rooms/${roomId}/servers`, {
        method: "GET",
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getWebSearchInRoom(roomId: number) {
    try {
      return await this.request<{ webSearchEnabled: boolean }>(
        `/ai/rooms/${roomId}/chats/config`,
        {
          method: "GET",
        },
      );
    } catch (e) {
      console.log(e);
    }
  }

  async connectServer(roomId: number, serverId: string, code: string) {
    try {
      await this.request(`/ai/rooms/${roomId}/servers/${serverId}/connect`, {
        method: "POST",
        data: { code },
      });
    } catch (e) {
      console.log(e);
      toastr.error(e as string);
    }
  }

  async disconnectServer(roomId: number, serverId: string) {
    try {
      await this.request(`/ai/rooms/${roomId}/servers/${serverId}/disconnect`, {
        method: "POST",
      });
    } catch (e) {
      console.log(e);
      toastr.error(e as string);
    }
  }

  async updateToolsPermission(callId: string, decision: ToolsPermission) {
    try {
      await this.request(`/ai/chats/tool-permissions/${callId}/decision`, {
        method: "POST",
        data: { decision },
      });
    } catch (e) {
      console.log(e);
      toastr.error(e as string);
    }
  }

  startNewChat(
    roomId: number | string,
    message: string,
    files: string[],
    abortController?: AbortController,
  ) {
    return this.request<ReadableStream<Uint8Array> | null>(
      `/ai/rooms/${roomId}/chats`,
      {
        method: "POST",
        data: { message, files },
        signal: abortController?.signal,
        isStream: true,
      },
    );
  }

  sendMessageToChat(
    chatId: string,
    message: string,
    files: string[],
    abortController?: AbortController,
  ) {
    return this.request<ReadableStream<Uint8Array> | null>(
      `/ai/chats/${chatId}/messages`,
      {
        method: "POST",
        data: { message, files },
        signal: abortController?.signal,
        isStream: true,
      },
    );
  }

  async getAIConfig() {
    try {
      return await this.request<TAIConfig>("/ai/config");
    } catch (e) {
      console.log(e);
      toastr.error(e as string);
    }
  }

  async getAgentFolder(agentId: number) {
    return this.request<FolderContentDtoInteger>(`/files/${agentId}`);
  }
}
