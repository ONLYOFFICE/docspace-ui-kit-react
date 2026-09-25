/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
