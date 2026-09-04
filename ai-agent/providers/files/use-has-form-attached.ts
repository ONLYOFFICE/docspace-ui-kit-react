"use client";

import React from "react";
import { useStores } from "@onlyoffice/ai-chat";

import { getFormRegistry } from "./form-attachments";

/**
 * Whether the message being composed carries at least one form.
 *
 * Recomputed both when the draft's refs change (the store is a zustand hook)
 * and when a new form lands in the registry — the two arrive separately,
 * because the ref is added by the library and the flag by the attach helper.
 */
export const useHasFormAttached = (): boolean => {
  const { useAttachmentsStore } = useStores();

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

  return React.useMemo(
    () =>
      [...files, ...images].some((ref) => registry.ids.has(ref.id)),
    // `version` is the registry's change signal, not a value read here.
    [files, images, registry, version],
  );
};
