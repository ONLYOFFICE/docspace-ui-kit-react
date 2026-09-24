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

/**
 * Whether a host file is a form the chat can actually talk about: a DocSpace
 * PDF form (`isForm`) whose responses are collected in a table
 * (`externalDbTableName`, the form's table in the external database).
 *
 * A form without that table has no answers to discuss — the recommendation
 * about the model tested on form results would be noise on it.
 */
export const hasFormResults = (item: {
  isForm?: boolean | null;
  externalDbTableName?: string | null;
}) => !!item.isForm && !!item.externalDbTableName;

type FormRegistry = {
  /**
   * Ids of the attachment refs that came from a DocSpace PDF form whose
   * responses are collected in a table ({@link hasFormResults}) — the ones the
   * in-chat model recommendation is about.
   */
  ids: Set<string>;
  /**
   * Ids of refs attached as "the subject of this message" — today the form a
   * user picked "Analyze responses" on. While one of them is in the draft the
   * composer takes nothing else: the answer is about that form's responses,
   * and a second file would only muddy it. See `useAnalyzeLock`.
   */
  analyzeOnlyIds: Set<string>;
  /** Bumped on every change so `useSyncExternalStore` re-reads. */
  version: number;
  listeners: Set<() => void>;
};

/**
 * Which of the current draft's attachments are forms, per attachments store.
 *
 * Form-ness is a property of the host file (`isForm`, plus the results table
 * for the narrower {@link hasFormResults} sense), and the attachments store
 * keeps only `{id, title, kind, path, type}` per ref — so, like `canAnalyze`,
 * it has nowhere to live but here. Kept out of React state because every
 * attach entry point (context menu, picker, drag-and-drop) writes it from a
 * plain async function.
 */
const registries = new WeakMap<object, FormRegistry>();

export const getFormRegistry = (
  useAttachmentsStore: AttachmentsStore,
): FormRegistry => getRegistry(useAttachmentsStore);

const getRegistry = (useAttachmentsStore: AttachmentsStore): FormRegistry => {
  let registry = registries.get(useAttachmentsStore);
  if (!registry) {
    registry = {
      ids: new Set<string>(),
      analyzeOnlyIds: new Set<string>(),
      version: 0,
      listeners: new Set(),
    };
    registries.set(useAttachmentsStore, registry);
  }
  return registry;
};

/**
 * Records the freshly attached refs that are DocSpace forms.
 *
 * `withResults` are the ids the in-chat model recommendation is about (a form
 * whose responses land in a table); `analyzeOnly` the ones attached as the
 * subject of the message, which lock the composer to themselves. The second
 * set is narrower than the first, but callers pass both explicitly rather
 * than having this infer one from the other.
 */
export const rememberFormAttachments = (
  useAttachmentsStore: AttachmentsStore,
  {
    withResults,
    analyzeOnly = [],
  }: { withResults: string[]; analyzeOnly?: string[] },
) => {
  const registry = getRegistry(useAttachmentsStore);

  let changed = false;
  const add = (ids: string[], into: Set<string>) => {
    ids.forEach((id) => {
      if (into.has(id)) return;
      into.add(id);
      changed = true;
    });
  };

  add(withResults, registry.ids);
  add(analyzeOnly, registry.analyzeOnlyIds);

  if (!changed) return;

  registry.version += 1;
  registry.listeners.forEach((listener) => listener());
};

/**
 * The id of the attachment that owns the message — a form the user asked to
 * analyze — or undefined when the draft carries none.
 *
 * That id is what `attachments/save-files-many` minted for the file, and what
 * the starter-questions endpoint is keyed by. Intersected with the live refs,
 * so removing the chip (or sending the message, which clears the draft) drops
 * it on its own.
 */
export const findAnalyzeAttachmentId = (
  useAttachmentsStore: AttachmentsStore,
): string | undefined => {
  const registry = getRegistry(useAttachmentsStore);
  if (registry.analyzeOnlyIds.size === 0) return undefined;

  const { attachmentFiles, attachmentImages } = useAttachmentsStore.getState();
  return [...attachmentFiles, ...attachmentImages].find((ref) =>
    registry.analyzeOnlyIds.has(ref.id),
  )?.id;
};

/** Whether the draft carries such an attachment at all. */
export const hasAnalyzeAttachment = (
  useAttachmentsStore: AttachmentsStore,
): boolean => findAnalyzeAttachmentId(useAttachmentsStore) !== undefined;

/**
 * Takes the analyzed form off the draft, and nothing else.
 *
 * The draft outlives the panel, so without this a form attached by "Analyze
 * responses" would still sit on the composer after the chat that was about it
 * is closed — with the mode gone, as an ordinary file the user never picked.
 * Ordinary attachments stay where they are: closing the panel keeps a plain
 * draft, and only the analyze attach is undone.
 *
 * `attaching` means the form's record has not come back yet, so there is no
 * ref to delete — only its loading chip. The analyze attach emptied the draft
 * before reserving that chip and the cap admits nothing beside it, so every
 * pending file chip is the form's; revoking the lease makes the settle drop
 * the record (see `addAttachmentFile`), and an attach that settles with
 * nothing reports nothing — the mode is not started again behind a closed
 * panel.
 */
export const dropAnalyzeAttachment = (
  useAttachmentsStore: AttachmentsStore,
  { inFlight }: { inFlight: boolean },
) => {
  const state = useAttachmentsStore.getState();

  if (inFlight) {
    state.failPendingAttachments(
      state.pendingAttachments
        .filter((pending) => pending.kind === "file")
        .map((pending) => pending.id),
    );
  }

  const id = findAnalyzeAttachmentId(useAttachmentsStore);
  if (!id) return;

  // Best-effort, like the draft clear: a failed storage delete keeps the chip
  // visible, and the user can still take it off by hand.
  const remove = state.attachmentFiles.some((ref) => ref.id === id)
    ? state.deleteAttachmentFile
    : state.deleteAttachmentImage;
  remove(id).catch(() => undefined);
};
