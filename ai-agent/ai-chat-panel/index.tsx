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

// Pieces of the AI Chat Panel, designed to be composed by the host:
//   - <AiChatPanelHeader/> — for Section.InfoPanelHeader slot
//   - <AiChatPanelBody/>   — for Section.InfoPanelBody slot (renders <NewChat />)
//
// Fullscreen is achieved by the consumer via CSS — override the
// `--info-panel-width` variable on a higher DOM ancestor to expand the
// InfoPanel from its default width to `100vw`. The chat DOM never moves,
// so scroll position, input focus and in-flight HTTP all survive.
//
// Plus a headless state hook (`useAiChatPanelState`) and two helpers
// (`useFullscreen`, `useEscapeKey`) for non-MobX consumers / tests.

export { default as AiChatPanelHeader } from "./components/ai-chat-panel-header";
export type { AiChatPanelHeaderProps } from "./components/ai-chat-panel-header/AiChatPanelHeader.types";

export { default as AiChatPanelBody } from "./components/ai-chat-panel-body";

export { useAiChatPanelState } from "./hooks/useAiChatPanelState";
export type {
  UseAiChatPanelStateOptions,
  UseAiChatPanelStateResult,
} from "./hooks/useAiChatPanelState";

export { useFullscreen } from "./hooks/useFullscreen";
export type {
  UseFullscreenOptions,
  UseFullscreenResult,
} from "./hooks/useFullscreen";

export { useEscapeKey } from "./hooks/useEscapeKey";
