import React from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import { ChatPage, useStores, ChatList } from "@onlyoffice/ai-chat";

import { useIsDesktop } from "../../hooks/use-is-desktop";
import { useVirtualKeyboardInset } from "../../hooks/useVirtualKeyboardInset";

import { ChatToolbar } from "../chat-toolbar";
import { ChatNoAccessScreen } from "./components/chat-no-access-screen";
import { useAiChatStore } from "../providers/ai-chat-store/AiChatStoreProvider";
import ContextRoomSync from "../providers/context-room/ContextRoomSync";

import styles from "./NewChat.module.scss";
import type { ChatProps } from "./chat.types";

// The in-chat AI settings section now lives in DocSpace portal settings.
const AI_SETTINGS_URL = "/portal-settings/ai-settings";

// The Chat bit of a profile's capability mask (ASC.AI.Integration).
const CHAT_CAPABILITY = 0x01;

// Whether a profile can drive a chat round, the way the widget's model
// pickers decide it: no mask predates capability reporting and is allowed, an
// explicit one must carry the Chat bit. Image-only gateway models (Nano
// Banana) stay in the profiles list, but the picker never offers them.
const isChatCapable = ({ capabilities }: { capabilities?: number }) =>
  !capabilities || (capabilities & CHAT_CAPABILITY) !== 0;

const NewChat: React.FC<ChatProps> = observer(
  ({ aiReady = true, noAccessProps, isAgents }) => {
    const isDesktop = useIsDesktop();

    const stores = useStores();
    const currentPage = stores.useRouter((s) => s.currentPage);
    const setCurrentPage = stores.useRouter((s) => s.setCurrentPage);
    const profiles = stores.useProfilesStore((s) => s.profiles);
    const hasProfiles = profiles.length > 0;
    const hasChatProfiles = profiles.some(isChatCapable);
    const profilesInitialized = stores.useProfilesStore((s) => s.initialized);
    // Empty string when no thread is selected (see ThreadsStoreState.threadId).
    const threadId = stores.useThreadsStore((s) => s.threadId);

    const aiChatStore = useAiChatStore();

    const isFullScreen = aiChatStore.effectiveFullscreen;

    // On mobile/tablet the virtual keyboard covers the bottom of the layout
    // viewport, hiding the composer. Reserve the covered height inside the
    // chat pane so the composer (and the thread above it) stays visible.
    const keyboardInset = useVirtualKeyboardInset(!isDesktop);
    const keyboardInsetStyle = keyboardInset
      ? { paddingBottom: keyboardInset }
      : undefined;

    // Whether the hydrated profiles list has no chat model; `null` until the
    // first one lands. The stores are rebuilt with an empty, not-yet-hydrated
    // list on every scope switch, so the last answer stands in until the new
    // list arrives rather than blinking the screen below in and out.
    const [lastNoChatProfiles, setLastNoChatProfiles] = React.useState<
      boolean | null
    >(() => (profilesInitialized ? !hasChatProfiles : null));

    React.useEffect(() => {
      if (profilesInitialized) setLastNoChatProfiles(!hasChatProfiles);
    }, [profilesInitialized, hasChatProfiles]);

    const noChatProfiles = profilesInitialized
      ? !hasChatProfiles
      : lastNoChatProfiles;

    // A cloud portal whose admin turned off every model in AI settings: AI
    // itself is on, but the model catalogue - and so the profiles list - holds
    // no chat model. With an empty list <ChatPage /> takes that for a portal
    // with no provider and shows its own "connect a provider" setup screen;
    // with only image models left it shows a chat whose model picker is empty.
    // Neither tells the user why. A standalone portal has no model switches;
    // there an empty list means AI is not set up, and the host reports that
    // through `aiReady`.
    const modelsDisabled =
      !!noAccessProps &&
      !noAccessProps.standalone &&
      aiReady &&
      noChatProfiles === true;

    const showActivationScreen =
      !!noAccessProps && (!aiReady || modelsDisabled) && !threadId;
    const showToolbar = (hasProfiles || showActivationScreen) && isAgents;

    const chatBody = showActivationScreen ? (
      <ChatNoAccessScreen
        {...noAccessProps}
        isAgents={!!isAgents}
        modelsDisabled={modelsDisabled}
      />
    ) : (
      <ChatPage />
    );

    // Toolbar + chat body — the same pane is used both standalone and inside
    // the split-screen history layout, so it lives in one place.
    const chatPanel = (
      <>
        {/* The chat is open: connect the current room as context if it
            holds a .ai folder (see ContextRoomSync). */}
        <ContextRoomSync />
        {showToolbar ? <ChatToolbar /> : null}
        {chatBody}
      </>
    );

    // Desktop full-screen / agent view puts the chat list beside the active
    // chat; every other case shows one surface at a time.
    const isSplitView = (isFullScreen || isAgents) && isDesktop;

    React.useEffect(() => {
      // Whenever the widget router tries to open the settings page (gear
      // button, "Open settings" actions, etc.), bounce the user to the portal
      // AI settings page and reset the internal page so returning to the chat
      // doesn't loop.
      if (currentPage === "settings") {
        setCurrentPage("chat");
        window.DocSpace?.navigate(AI_SETTINGS_URL);
      }
    }, [currentPage, setCurrentPage]);

    switch (currentPage) {
      case "settings":
        // The effect above redirects to the portal AI settings; render nothing.
        return null;

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

      // "chat" and "initial-setup" both render the chat pane: with no AI
      // profiles <ChatPage /> shows the widget's own setup screen, and it
      // flips the router back to "chat" once a profile appears. Short-cutting
      // "initial-setup" here would unmount that screen and strand the user on
      // an empty panel with no way back (hosts without `noAccessProps`).
      default:
        return (
          <section className={styles.chatPanel} style={keyboardInsetStyle}>
            {chatPanel}
          </section>
        );
    }
  },
);

NewChat.displayName = "NewChat";

export default NewChat;
