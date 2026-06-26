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
import { useAiChatStore } from "../providers/ai-chat-store/AiChatStoreProvider";

import styles from "./NewChat.module.scss";

// The in-chat AI settings section now lives in DocSpace portal settings.
const AI_SETTINGS_URL = "/portal-settings/ai-settings";

const NewChat: React.FC = observer(() => {
  const isDesktop = useIsDesktop();

  const stores = useStores();
  const currentPage = stores.useRouter((s) => s.currentPage);
  const setCurrentPage = stores.useRouter((s) => s.setCurrentPage);
  const profiles = stores.useProfilesStore((s) => s.profiles);
  const hasProfiles = profiles.length > 0;

  const aiChatStore = useAiChatStore();

  const isFullScreen = aiChatStore.effectiveFullscreen;

  React.useEffect(() => {
    // page and reset the internal page so returning to the chat doesn't loop. // "Open settings" actions, etc.), bounce the user to the portal AI settings // Whenever the widget router tries to open the settings page (gear button,
    if (currentPage === "settings") {
      setCurrentPage("chat");
      window.DocSpace?.navigate(AI_SETTINGS_URL);
    }
  }, [currentPage, setCurrentPage]);

  switch (currentPage) {
    case "settings":
      return null;
    case "initial-setup":
      return <SettingsPage />;
    case "history":
      if (isFullScreen && isDesktop) {
        return (
          <section className={styles.container}>
            <div className={styles.chatList}>
              <ChatList hideHeader />
            </div>
            <div className={styles.chat}>
              {hasProfiles ? <ChatToolbar /> : null}
              <ChatPage />
            </div>
          </section>
        );
      }

      return <ChatList />;
    default: {
      return (
        <section className={styles.chat}>
          {hasProfiles ? <ChatToolbar /> : null}
          <ChatPage />
        </section>
      );
    }
  }
});

NewChat.displayName = "NewChat";

export default NewChat;
