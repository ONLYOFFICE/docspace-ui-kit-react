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
import { observer } from "mobx-react";
import classNames from "classnames";

import {
  ChatPage,
  SettingsPage,
  useStores,
  ChatList,
} from "@onlyoffice/ai-chat";

import { useIsDesktop } from "../../hooks/use-is-desktop";

import { ChatToolbar } from "../chat-toolbar";
import { ChatNoAccessScreen } from "../chat/components/chat-no-access-screen";
import { useAiChatStore } from "../providers/ai-chat-store/AiChatStoreProvider";

import styles from "./NewChat.module.scss";
import type { ChatProps } from "./chat.types";

// The in-chat AI settings section now lives in DocSpace portal settings.
const AI_SETTINGS_URL = "/portal-settings/ai-settings";

const NewChat: React.FC<ChatProps> = observer(
  ({ aiReady = true, noAccessProps, isAgents }) => {
    const isDesktop = useIsDesktop();

    const stores = useStores();
    const currentPage = stores.useRouter((s) => s.currentPage);
    const setCurrentPage = stores.useRouter((s) => s.setCurrentPage);
    const profiles = stores.useProfilesStore((s) => s.profiles);
    const hasProfiles = profiles.length > 0;
    // Empty string when no thread is selected (see ThreadsStoreState.threadId).
    const threadId = stores.useThreadsStore((s) => s.threadId);

    const aiChatStore = useAiChatStore();

    const isFullScreen = aiChatStore.effectiveFullscreen;

    const showActivationScreen = !!noAccessProps && !aiReady && !threadId;
    const showToolbar = hasProfiles || showActivationScreen;

    const chatBody = showActivationScreen ? (
      <ChatNoAccessScreen {...noAccessProps} />
    ) : (
      <ChatPage />
    );

    // Toolbar + chat body — the same pane is used both standalone and inside
    // the split-screen history layout, so it lives in one place.
    const chatPanel = (
      <>
        {showToolbar ? <ChatToolbar /> : null}
        {chatBody}
      </>
    );

    // Desktop full-screen / agent view puts the chat list beside the active
    // chat; every other case shows one surface at a time.
    const isSplitView = (isFullScreen || isAgents) && isDesktop;

    React.useEffect(() => {
      // page and reset the internal page so returning to the chat doesn't loop. // "Open settings" actions, etc.), bounce the user to the portal AI settings // Whenever the widget router tries to open the settings page (gear button,
      if (currentPage === "settings") {
        setCurrentPage("chat");
        window.DocSpace?.navigate(AI_SETTINGS_URL);
      }
    }, [currentPage, setCurrentPage]);

    switch (currentPage) {
      case "settings":
        // The effect above redirects to portal AI settings; render nothing.
        return null;

      case "initial-setup":
        return <SettingsPage />;

      case "history":
        if (!isSplitView) {
          return (
            <ChatList
              alwaysShowActions
              className={classNames(
                styles.chatListWrapper,
                styles.chatListInset,
              )}
            />
          );
        }
        return (
          <section className={styles.splitView}>
            <div className={styles.historyColumn}>
              <ChatList
                hideHeader
                alwaysShowActions
                className={styles.chatListWrapper}
              />
            </div>
            <div className={styles.chatPanel}>{chatPanel}</div>
          </section>
        );

      default:
        return <section className={styles.chatPanel}>{chatPanel}</section>;
    }
  },
);

NewChat.displayName = "NewChat";

export default NewChat;
