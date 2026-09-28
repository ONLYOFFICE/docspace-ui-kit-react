import { createContext, useContext } from "react";

import type { OnFilesAttached } from "./attach-files";

/**
 * Carries AiAgentProviders' own attach reporter down the tree, so the attach
 * entry points a host triggers from outside the chat — the "Ask AI" context
 * action and the drag-and-drop drop zone, both going through
 * `useAttachHostFilesToChat` — report what they attached exactly like the
 * picker dialog and the device upload do (those get the callback as a prop).
 *
 * The provider owns the reporter (it remembers the record flags the
 * attachments store drops, `canAnalyze`), so the callers must not have to know
 * about it: undefined outside the provider makes the report a no-op.
 */
export const OnFilesAttachedContext = createContext<
  OnFilesAttached | undefined
>(undefined);

/** The provider's attach reporter, or undefined when rendered without it. */
export const useOnFilesAttached = (): OnFilesAttached | undefined =>
  useContext(OnFilesAttachedContext);
