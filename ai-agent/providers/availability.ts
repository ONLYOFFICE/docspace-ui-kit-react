import { createContext, useContext } from "react";

// Carries the host-computed AI chat availability flag down to any descendant
// of AiAgentProviders. Defaults to `false` so a consumer rendered without the
// provider (e.g. before the app is loaded) treats the chat as unavailable.
export const AiChatAvailabilityContext = createContext<boolean>(false);

/** Read whether the AI chat is offered on the current view. */
export const useIsAiChatAvailable = (): boolean =>
  useContext(AiChatAvailabilityContext);
