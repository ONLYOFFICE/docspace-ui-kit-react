"use client";

import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { Button, ButtonSize } from "../../../../components/button";

import AiAgentsReactSvg from "../../../../assets/icons/16/catalog.ai-agents.react.svg";

import { useAiChatStore } from "../../../providers/ai-chat-store";

import { useOpenAiChat } from "../../hooks/useOpenAiChat";
import styles from "./AiChatTrigger.module.scss";

// Header-mounted button that opens the AI chat panel. Host-agnostic: it reads
// only the shared AiChatStore and the panel-open helper, so any product section
// (Personal Files, Rooms, …) can drop it into its header.
const AiChatTrigger: React.FC = observer(() => {
  const { t } = useTranslation(["Common"]);
  const store = useAiChatStore();
  const openChat = useOpenAiChat();

  // Hide the trigger while the AI Chat panel is already open — the
  // panel has its own close control, and the inline header position
  // would otherwise compete with that.
  if (store.isVisible) return null;

  return (
    <Button
      accent
      onClick={openChat}
      size={ButtonSize.small}
      label={t("Common:AIChatButton")}
      icon={<AiAgentsReactSvg />}
      aria-label={t("Common:AIChatButton")}
      className={styles.trigger}
    />
  );
});

AiChatTrigger.displayName = "AiChatTrigger";

export default AiChatTrigger;
