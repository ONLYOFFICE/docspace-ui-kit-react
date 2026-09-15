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
    />
  );
});

AiChatPanelHeaderContainer.displayName = "AiChatPanelHeaderContainer";

export default AiChatPanelHeaderContainer;
