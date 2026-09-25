import type { ChatCallbacks, ChatMiddleware } from "@onlyoffice/ai-chat";

import type AiChatStore from "./ai-chat-store/AiChatStore";

/**
 * Marks the analyze mode as "the first message is on its way".
 *
 * Timing is the whole point. The widget empties the composer draft as soon as
 * the send is approved, and an empty draft is also what "the user removed the
 * form" looks like — the difference is only in what happened first. The
 * `beforeSend` hook runs synchronously ahead of that clear, while
 * `onMessageSent` fires several awaits after it, so this is the only place
 * that can flip the phase before anyone can misread the empty draft.
 *
 * It never blocks: it inspects nothing and returns the message untouched.
 */
export const analyzeSentMiddleware = (store: AiChatStore): ChatMiddleware => ({
  beforeSend: () => {
    store.markAnalyzeSent();
    return { action: "continue" };
  },
});

/**
 * The chat events that end the analyze mode.
 *
 * A thread the user switched to is a different conversation, so the mode does
 * not follow it. The thread our own first message creates is not a switch —
 * and the thread id changes either way, so `kind` is the only thing that tells
 * the two apart.
 *
 * Merged with the host's own callbacks by `composeCallbacks`; kept beside the
 * middleware because the two are the same concern — where the mode's life
 * meets the widget's events.
 */
export const analyzeModeCallbacks = (store: AiChatStore): ChatCallbacks => ({
  onThreadsUpdated: ({ kind }) => {
    if (kind === "switched") store.endAnalyzeMode();
  },
});
