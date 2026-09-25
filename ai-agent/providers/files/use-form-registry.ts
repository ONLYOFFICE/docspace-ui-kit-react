"use client";

import React from "react";
import type { useStores } from "@onlyoffice/ai-chat";

import { getFormRegistry } from "./form-attachments";

type AttachmentsStore = ReturnType<typeof useStores>["useAttachmentsStore"];

/**
 * Whether any ref on the current draft is in one of the form registry's sets.
 *
 * The two signals arrive separately — the ref is added by the library's
 * zustand store, the flag by the attach helper's plain async function — so
 * both have to be watched: the store through its hook, the registry through
 * its version counter.
 *
 * The store is a parameter rather than read from context, because the chat
 * providers own the bundle they create and are themselves above that context.
 * `pick` chooses the set (forms with results, PDF forms, analyze-only) and is
 * expected to be a stable module-level function.
 */
export const useRefsInFormRegistry = (
  useAttachmentsStore: AttachmentsStore,
  pick: (registry: ReturnType<typeof getFormRegistry>) => Set<string>,
): boolean => {
  const files = useAttachmentsStore((s) => s.attachmentFiles);
  const images = useAttachmentsStore((s) => s.attachmentImages);
  const registry = getFormRegistry(useAttachmentsStore);

  const subscribe = React.useCallback(
    (onChange: () => void) => {
      registry.listeners.add(onChange);
      return () => {
        registry.listeners.delete(onChange);
      };
    },
    [registry],
  );

  const version = React.useSyncExternalStore(
    subscribe,
    () => registry.version,
    () => 0,
  );

  return React.useMemo(() => {
    const ids = pick(registry);
    if (ids.size === 0) return false;
    return [...files, ...images].some((ref) => ids.has(ref.id));
    // `version` is the registry's change signal, not a value read here.
  }, [files, images, registry, pick, version]);
};
