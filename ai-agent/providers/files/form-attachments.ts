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

import type { useStores } from "@onlyoffice/ai-chat";

type AttachmentsStore = ReturnType<typeof useStores>["useAttachmentsStore"];

type FormRegistry = {
  /** Ids of the attachment refs that came from a DocSpace PDF form. */
  ids: Set<string>;
  /** Bumped on every change so `useSyncExternalStore` re-reads. */
  version: number;
  listeners: Set<() => void>;
};

/**
 * Which of the current draft's attachments are forms, per attachments store.
 *
 * Form-ness is a property of the host file (`isForm` on the DocSpace file
 * row), and the attachments store keeps only `{id, title, kind, path, type}`
 * per ref — so, like `canAnalyze`, it has nowhere to live but here. Kept out
 * of React state because every attach entry point (context menu, picker,
 * drag-and-drop) writes it from a plain async function.
 */
const registries = new WeakMap<object, FormRegistry>();

export const getFormRegistry = (
  useAttachmentsStore: AttachmentsStore,
): FormRegistry => getRegistry(useAttachmentsStore);

const getRegistry = (useAttachmentsStore: AttachmentsStore): FormRegistry => {
  let registry = registries.get(useAttachmentsStore);
  if (!registry) {
    registry = { ids: new Set<string>(), version: 0, listeners: new Set() };
    registries.set(useAttachmentsStore, registry);
  }
  return registry;
};

/** Records the freshly attached refs that are DocSpace forms. */
export const rememberFormAttachments = (
  useAttachmentsStore: AttachmentsStore,
  ids: string[],
) => {
  if (ids.length === 0) return;

  const registry = getRegistry(useAttachmentsStore);
  const added = ids.filter((id) => !registry.ids.has(id));
  if (added.length === 0) return;

  added.forEach((id) => registry.ids.add(id));
  registry.version += 1;
  registry.listeners.forEach((listener) => listener());
};
