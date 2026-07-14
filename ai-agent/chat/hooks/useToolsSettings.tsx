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

import socket, { SocketEvents, TOptSocket } from "../../../utils/socket";

import {
  TAIConfig,
  TMCPTool,
  TServer,
  TAIRoomChatSettings,
} from "../../../types/ai";
import { Nullable } from "../../../types";
import { RoomsType, ChatReasoningEffort } from "../../../enums";
import { useApi } from "../../../providers";

type Props = {
  agentId: string | number;
  aiConfig?: Nullable<TAIConfig>;
  chatSettings?: Nullable<TAIRoomChatSettings>;
};

const useToolsSettings = ({ agentId, aiConfig, chatSettings }: Props) => {
  const [servers, setServers] = React.useState<TServer[]>([]);
  const [MCPTools, setMCPTools] = React.useState<Map<string, TMCPTool[]>>(
    new Map(),
  );
  const [webSearchEnabled, setWebSearchEnabled] = React.useState(false);
  const [thinkingEnabled, setThinkingEnabled] = React.useState(false);
  const [isFetched, setIsFetched] = React.useState(false);
  const { aiApi } = useApi();

  const fetchServerTools = React.useCallback(
    async (res: TServer[], agentId: string | number) => {
      const enabledServers = res.filter(
        (server) => server.connected && !server.needReset,
      );

      const actions = await Promise.all(
        enabledServers.map((server) =>
          aiApi.getMCPToolsForRoom(Number(agentId), server.id),
        ),
      );

      const serverTools: [string, TMCPTool[]][] = enabledServers.map(
        (item, index) => [item.id, actions[index] ?? []],
      );

      setMCPTools(new Map(serverTools));
      setIsFetched(true);
    },
    [],
  );

  const fetchTools = React.useCallback(async () => {
    setIsFetched(false);
    const res = await aiApi.getServersListForRoom(Number(agentId));

    if (!res) return;

    setServers(res);
    fetchServerTools(res, agentId);
  }, [agentId, fetchServerTools]);

  const initTools = React.useCallback(async () => {
    if (!agentId) return;

    const promises: Promise<unknown>[] = [
      aiApi.getUserChatSettings(Number(agentId)).then((res) => {
        setWebSearchEnabled(res?.webSearchEnabled ?? false);

        const isThinkingEnabled =
          res?.reasoningEffort !== undefined &&
          res?.reasoningEffort !== null &&
          res?.reasoningEffort !== ChatReasoningEffort.None;
        setThinkingEnabled(isThinkingEnabled);
      }),
      fetchTools(),
    ];

    await Promise.all(promises);
  }, [fetchTools, agentId, aiApi]);

  const onModifyFolder = React.useCallback(
    (data?: TOptSocket) => {
      if (!data) return;

      if (
        data.type === "folder" &&
        data.id &&
        Number(data.id) === Number(agentId) &&
        data.cmd !== "delete" &&
        data.data
      ) {
        const parsedData = JSON.parse(data.data);

        if (
          "roomType" in parsedData &&
          parsedData.roomType === RoomsType.AIRoom
        ) {
          fetchTools();
        }
      }
    },
    [fetchTools, agentId],
  );

  React.useEffect(() => {
    socket?.on(SocketEvents.ModifyFolder, onModifyFolder);

    return () => {
      socket?.off(SocketEvents.ModifyFolder, onModifyFolder);
    };
  }, [onModifyFolder]);

  return {
    servers,
    MCPTools,
    webSearchAvailable:
      (aiConfig?.webSearchEnabled || false) &&
      (chatSettings?.capabilities?.toolCalling ?? true),
    webSearchEnabled,
    isFetched,
    knowledgeSearchToolName: aiConfig?.knowledgeSearchToolName || "",
    webSearchToolName: aiConfig?.webSearchToolName || "",
    webCrawlingToolName: aiConfig?.webCrawlingToolName || "",
    generateDocxToolName: aiConfig?.generateDocxToolName || "",
    generatePresentationToolName: aiConfig?.generatePresentationToolName || "",
    generateFormToolName: aiConfig?.generateFormToolName || "",
    setServers,
    setMCPTools,
    setWebSearchEnabled,
    setIsFetched,
    fetchTools,
    initTools,
    toolCallingSupported: chatSettings?.capabilities?.toolCalling ?? true,
    thinkingSupported: chatSettings?.capabilities?.thinking || false,
    thinkingEnabled,
    setThinkingEnabled,
  };
};

export default useToolsSettings;

