"use client";

import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { ContextMenuButton } from "../../../../components/context-menu-button";
import type { ContextMenuModel } from "../../../../components/context-menu";

import { useAiChatStore } from "../../../providers/ai-chat-store";
import { useSaveChatAsAgent } from "../ai-chat-panel-save";

import ExpandIcon from "../../../../assets/icons/17/expand.svg";
import SaveIcon from "../../../../assets/icons/17/save.react.svg";

import styles from "./AiChatAgentActions.module.scss";

type AiChatAgentActionsProps = {
  /**
   * Expands the panel to fullscreen. Omitted where there is nothing to
   * expand (tablet, mobile, a panel already fullscreen): no Expand item.
   */
  onExpand?: () => void;
};

// The menu item takes a URL or an element as its icon; the menu model types
// the URL only.
const asIcon = (node: React.ReactElement) => node as unknown as string;

/**
 * The "Agent actions" menu of the panel header, shown while the chat runs on
 * an agent picked in the title: the host's actions for that agent
 * (`AiChatStore.agentActions` - it knows the user's rights and owns the
 * dialogs), then what the panel owns - Expand and "Save as new agent" - and,
 * after a separator, the host's dangerous ones. Renders nothing on the
 * default agent, or when there is nothing to offer.
 */
const AiChatAgentActions = observer(({ onExpand }: AiChatAgentActionsProps) => {
  const { t } = useTranslation(["Common"]);
  const store = useAiChatStore();
  const saveAsAgent = useSaveChatAsAgent();

  const hostActions = store.agentActions ?? [];
  const isAgentPicked = store.isAgentPicked;

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
    if (onExpand) {
      items.push({
        key: "agent-action-expand",
        dataTestId: "ai-chat-agent-action-expand",
        label: t("Common:ArbiterExpandPanel", { defaultValue: "Expand" }),
        icon: asIcon(<ExpandIcon />),
        onClick: onExpand,
      });
    }
    if (saveAsAgent) {
      items.push({
        key: "agent-action-save",
        dataTestId: "ai-chat-agent-action-save",
        label: t("Common:SaveAsNewAgent", {
          defaultValue: "Save as new agent",
        }),
        icon: asIcon(<SaveIcon />),
        onClick: saveAsAgent,
      });
    }
    const danger = fromHost(true);
    if (items.length > 0 && danger.length > 0) {
      items.push({ key: "agent-action-separator", isSeparator: true });
    }
    return [...items, ...danger];
  };

  if (!isAgentPicked) return null;
  if (hostActions.length === 0 && !onExpand && !saveAsAgent) return null;

  return (
    <ContextMenuButton
      className={styles.button}
      getData={getData}
      title={t("Common:AgentActions", { defaultValue: "Agent actions" })}
      directionX="right"
      displayIconBorder
      testId="ai-chat-agent-actions"
    />
  );
});

export default AiChatAgentActions;
