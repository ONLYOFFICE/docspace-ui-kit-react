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

import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { useIsDesktop } from "../../../../hooks/use-is-desktop";

import { useStores } from "../../../providers";
import { useAiChatStore } from "../../../providers/ai-chat-store";

import AiChatPanelHeader from "../ai-chat-panel-header";

// Store-connected AI chat panel header: wires the shared AiChatStore to the
// presentational AiChatPanelHeader (title, close, fullscreen). Host-agnostic, so
// every product section renders the identical panel header.
const AiChatPanelHeaderContainer: React.FC = observer(() => {
  const { t } = useTranslation(["Common"]);
  const store = useAiChatStore();
  const stores = useStores();
  const goToChat = stores.useRouter((s) => s.goToChat);

  // On tablet/mobile the chat panel always occupies the full screen, so the
  // fullscreen toggle is redundant — omitting the handler hides the button.
  const isDesktop = useIsDesktop();

  // On settings/initial-setup pages with profiles configured: drop back
  // to chat but keep the panel open. Without profiles: close the panel
  // (the setup CTA had nowhere left to send the user). On any other page
  // (chat/history/…): reset upstream router AND close the panel.
  const handleClose = () => {
    if (store.isOnSettingsPage) {
      if (store.hasProfiles) goToChat();
      else store.close();
      return;
    }
    goToChat();
    store.close();
  };

  return (
    <AiChatPanelHeader
      title={t("Common:AIChatButton")}
      onClose={handleClose}
      isFullscreen={store.effectiveFullscreen}
      onToggleFullscreen={isDesktop ? store.toggleFullscreen : undefined}
      isFullscreenToggleDisabled={store.isFullscreenToggleDisabled}
    />
  );
});

AiChatPanelHeaderContainer.displayName = "AiChatPanelHeaderContainer";

export default AiChatPanelHeaderContainer;
