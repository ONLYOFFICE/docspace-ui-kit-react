"use client";

import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { useStores } from "@onlyoffice/ai-chat";

import HistoriesIcon from "../../assets/icons/16/clock.svg";
import PlusIcon from "../../assets/icons/16/button.plus.react.svg";

import { ActionButton } from "../../components/action-button";
import { Tooltip } from "../../components/tooltip";
import { isDesktop } from "../../utils/device";

import styles from "./ChatToolbar.module.scss";

const TOOLBAR_TOOLTIP_ID = "chat-toolbar-tooltip";

export interface ChatToolbarProps {
  className?: string;
}

export const ChatToolbar: React.FC<ChatToolbarProps> = ({ className }) => {
  const { t } = useTranslation("Common");
  const stores = useStores();
  const currentPage = stores.useRouter((s) => s.currentPage);
  const setCurrentPage = stores.useRouter((s) => s.setCurrentPage);
  const startNewChat = stores.useThreadsStore((s) => s.onSwitchToNewThread);
  // Empty string while no thread is selected — i.e. an unsaved new chat.
  const threadId = stores.useThreadsStore((s) => s.threadId);
  const profiles = stores.useProfilesStore((s) => s.profiles);

  const hasProfile = profiles.length > 0;

  const isHistoryActive = currentPage === "history";
  const isNewChat = !threadId;

  const handleNavigateToHistory = () => {
    if (isHistoryActive) {
      return setCurrentPage("chat");
    }

    setCurrentPage("history");
  };

  const handleStartNewChat = () => {
    if (!hasProfile || isNewChat) return;

    startNewChat();
    setCurrentPage("chat");
  };

  return (
    <nav id="chat-toolbar" className={classNames(styles.toolbar, className)}>
      <div className={styles.leftGroup}>
        <ActionButton
          icon={<HistoriesIcon />}
          className={classNames(styles.button, {
            [styles.active]: isHistoryActive,
          })}
          aria-label={t("Common:ChatHistory")}
          data-tooltip-id={TOOLBAR_TOOLTIP_ID}
          data-tooltip-content={t("Common:ChatHistory")}
          onClick={handleNavigateToHistory}
        />
        {hasProfile ? (
          <ActionButton
            icon={<PlusIcon />}
            className={styles.button}
            aria-label={t("Common:AINewChat")}
            data-tooltip-id={TOOLBAR_TOOLTIP_ID}
            data-tooltip-content={t("Common:AINewChat")}
            onClick={handleStartNewChat}
            disabled={isNewChat}
          />
        ) : null}
      </div>
      <Tooltip float={isDesktop()} id={TOOLBAR_TOOLTIP_ID} place="bottom" />
    </nav>
  );
};
