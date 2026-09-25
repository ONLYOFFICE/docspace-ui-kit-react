"use client";

import type { useStores } from "@onlyoffice/ai-chat";

import type { getFormRegistry } from "./form-attachments";
import { useRefsInFormRegistry } from "./use-form-registry";

type AttachmentsStore = ReturnType<typeof useStores>["useAttachmentsStore"];

const pickAnalyzeOnly = (registry: ReturnType<typeof getFormRegistry>) =>
  registry.analyzeOnlyIds;

/**
 * Whether the draft is locked to a single attachment because that attachment
 * is the subject of the message — the form a user picked "Analyze responses"
 * on (see `ChatAttachableItem.analyzeOnly`).
 *
 * Derived, never stored: the lock exists exactly while the marked ref is on
 * the draft. Removing its chip, sending the message (the library empties both
 * buckets) or switching threads lifts it without anyone resetting a flag —
 * which is what makes it survive the panel being closed and reopened.
 */
export const useAnalyzeLock = (
  useAttachmentsStore: AttachmentsStore,
): boolean => useRefsInFormRegistry(useAttachmentsStore, pickAnalyzeOnly);
