"use client";

import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { ContextMenuButton } from "../../../../components/context-menu-button";
import type { ContextMenuModel } from "../../../../components/context-menu";

import { useAiChatStore } from "../../../providers/ai-chat-store";

import styles from "./AiChatAgentActions.module.scss";

/**
 * The "Agent actions" menu of the panel header, shown while the chat runs on
 * an agent picked in the title: the host's actions for that agent
 * (`AiChatStore.agentActions` - it knows the user's rights and owns the
 * dialogs) and, after a separator, its dangerous ones. Expanding the panel
 * and "Save as new agent" are not here: the header's button and the title's
 * menu have them. Renders nothing on the default agent, or when the host
 * offers nothing.
 */
const AiChatAgentActions = observer(() => {
  const { t } = useTranslation(["Common"]);
  const store = useAiChatStore();

  const hostActions = store.agentActions ?? [];

  const fromHost = (isDanger: boolean): ContextMenuModel[] =>
    hostActions
      .filter((action) => !!action.isDanger === isDanger)
      .map((action) => ({
        key: `agent-action-${action.id}`,
        dataTestId: `ai-chat-agent-action-${action.id}`,
        label: action.label,
        icon: action.icon,
        onClick: action.onClick,
      }));

  const getData = (): ContextMenuModel[] => {
    const items = fromHost(false);
    const danger = fromHost(true);
    if (items.length > 0 && danger.length > 0) {
      items.push({ key: "agent-action-separator", isSeparator: true });
    }
    return [...items, ...danger];
  };

  if (!store.isAgentPicked || hostActions.length === 0) return null;

  return (
    <ContextMenuButton
      className={styles.button}
      getData={getData}
      title={t("Common:AgentActions", { defaultValue: "Agent actions" })}
      directionX="right"
      testId="ai-chat-agent-actions"
    />
  );
});

export default AiChatAgentActions;
