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

"use client";

import React from "react";

import { useAiChatStore } from "../../providers/ai-chat-store";

import AiChatTrigger from "../components/ai-chat-trigger";
import AiChatPanelHeaderContainer from "../components/ai-chat-panel-header-container";
import AiChatPanelBody from "../components/ai-chat-panel-body";

// Everything a host layout needs to mount the AI chat panel: the header trigger
// button, the panel content (header + body), and the reactive visibility/
// fullscreen state. Section-agnostic — it reads only the shared AiChatStore, so
// any product surface (Personal Files, Rooms, …) consumes the same bindings.
// Cross-panel coordination (e.g. closing a host info panel) is intentionally
// left to the host, which owns those stores.
export type AiChatPanelBindings = {
  isChatPanelVisible: boolean;
  isChatPanelFullscreen: boolean;
  chatButton: React.ReactNode;
  chatPanelContent: React.ReactNode;
  closeChatPanel: () => void;
};

// `enabled` lets a section opt out (e.g. private rooms) without a conditional
// hook call: the hook still runs but returns `undefined`, so the layout simply
// renders no AI button/panel. The overloads keep callers that always enable AI
// (default / `true`) free of an undefined check, while a dynamic boolean widens
// the result to `| undefined`. Consumers must be `observer`s so the returned
// visibility/fullscreen flags stay reactive.
export function useAiChatPanel(enabled?: true): AiChatPanelBindings;
export function useAiChatPanel(
  enabled: boolean,
): AiChatPanelBindings | undefined;
export function useAiChatPanel(
  enabled = true,
): AiChatPanelBindings | undefined {
  const aiChatStore = useAiChatStore();

  if (!enabled) return undefined;

  return {
    isChatPanelVisible: aiChatStore.isVisible,
    isChatPanelFullscreen: aiChatStore.effectiveFullscreen,
    chatButton: <AiChatTrigger />,
    chatPanelContent: (
      <>
        <AiChatPanelHeaderContainer />
        <AiChatPanelBody />
      </>
    ),
    closeChatPanel: () => aiChatStore.close(),
  };
}
