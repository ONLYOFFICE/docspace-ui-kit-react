"use client";

import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { useIsDesktop } from "../../../../hooks/use-is-desktop";

import { useStores } from "../../../providers";
import { useAiChatStore } from "../../../providers/ai-chat-store";

import AiChatAgentPicker from "../ai-chat-agent-picker";
import AiChatAgentActions from "../ai-chat-agent-actions";
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

  // The title opens the host's agents as a menu while it offers any; the
  // analyze mode and a project's own chat keep their plain titles.
  const renderTitle = () => {
    if (store.isAnalyzeMode) return t("Common:AnalyzeResponsesMode");
    if (store.projectTitle) return store.projectTitle;
    if (store.hasAgentPicker) {
      return <AiChatAgentPicker title={t("Common:AIChatButton")} />;
    }
    return t("Common:AIChatButton");
  };

  // The agent's actions belong to the agent menu's title: not in the analyze
  // mode nor in a project's own chat, which keep their plain titles.
  const showAgentActions =
    !store.isAnalyzeMode && !store.projectTitle && store.isAgentPicked;

  return (
    <AiChatPanelHeader
      title={renderTitle()}
      onClose={handleClose}
      // With an agent picked, its actions menu follows the toolbar.
      extras={showAgentActions ? <AiChatAgentActions /> : undefined}
      isFullscreen={store.effectiveFullscreen}
      onToggleFullscreen={isDesktop ? store.toggleFullscreen : undefined}
    />
  );
});

AiChatPanelHeaderContainer.displayName = "AiChatPanelHeaderContainer";

export default AiChatPanelHeaderContainer;
