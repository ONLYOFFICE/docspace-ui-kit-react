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
    toolCallingSupported: chatSettings?.capabilities?.toolCalling ?? true,
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
    thinkingSupported: chatSettings?.capabilities?.thinking || false,
    thinkingEnabled,
    setThinkingEnabled,
  };
};

export default useToolsSettings;

