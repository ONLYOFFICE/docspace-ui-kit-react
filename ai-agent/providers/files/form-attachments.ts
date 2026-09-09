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
   * Ids of every ref that came from a DocSpace PDF form, results table or
   * not. This is what the one-form-per-message cap counts: a form the user
   * has not wired to an external database is still a form, and the two chips
   * would still put two schemas into one question.
   */
  pdfFormIds: Set<string>;
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
      pdfFormIds: new Set<string>(),
      version: 0,
      listeners: new Set(),
    };
    registries.set(useAttachmentsStore, registry);
  }
  return registry;
};

/**
 * Form attaches whose round trip is still in flight, per attachments store.
 *
 * A form is only visible to {@link countAttachedForms} once its ref is in the
 * store and its id in the registry. Until then two attaches started from two
 * entry points (a pick in the dialog while a drop is uploading) would both see
 * a free slot and land two forms — the same window `holdAttachPaths` closes
 * for duplicate paths.
 */
const inFlightForms = new WeakMap<object, number>();

/**
 * Claims the form slot for a round trip and returns its release. Hold it until
 * the refs are in the store (or the attach failed) — releasing earlier reopens
 * the window a second form could slip through.
 */
export const holdFormSlot = (
  useAttachmentsStore: AttachmentsStore,
): (() => void) => {
  inFlightForms.set(
    useAttachmentsStore,
    (inFlightForms.get(useAttachmentsStore) ?? 0) + 1,
  );

  let released = false;
  return () => {
    if (released) return;
    released = true;
    const count = (inFlightForms.get(useAttachmentsStore) ?? 0) - 1;
    if (count > 0) inFlightForms.set(useAttachmentsStore, count);
    else inFlightForms.delete(useAttachmentsStore);
  };
};

/**
 * How many PDF forms the current draft is spoken for: the refs standing in it
 * plus the attaches still in flight.
 *
 * The registry side is intersected with the live refs on purpose — it keeps
 * the ids of every form ever attached to this store, and a form whose chip the
 * user removed must stop counting.
 */
export const countAttachedForms = (
  useAttachmentsStore: AttachmentsStore,
): number => {
  const inFlight = inFlightForms.get(useAttachmentsStore) ?? 0;
  const registry = getRegistry(useAttachmentsStore);
  if (registry.pdfFormIds.size === 0) return inFlight;

  const { attachmentFiles, attachmentImages } = useAttachmentsStore.getState();
  const attached = [...attachmentFiles, ...attachmentImages].filter((ref) =>
    registry.pdfFormIds.has(ref.id),
  ).length;

  return attached + inFlight;
};

/**
 * Splits a batch into what may be attached and the form picks that must be
 * refused, because a message carries **one** form at most.
 *
 * `isForm` flags the inputs that are DocSpace PDF forms, positionally — the
 * host row's own `isForm`, not the narrower {@link hasFormResults}: a form
 * with no results table yet is still one form's worth of schema. A form is
 * refused when the draft already holds one, or when an earlier input in the
 * same batch is a form — the first occurrence claims the slot. Non-form
 * inputs are never refused here; they have their own cap.
 *
 * One form per message because the analysis is about that form's own fields
 * and responses: two forms in one question produce answers that silently mix
 * two schemas, and the per-form starter questions could only describe one of
 * them anyway.
 *
 * Both results are positions into `isForm`, in input order, so callers can
 * carry their parallel arrays (inputs, leases, image flags) along — same
 * contract as `splitDuplicateAttachments`.
 */
export const splitExtraFormAttachments = (
  useAttachmentsStore: AttachmentsStore,
  isForm: boolean[],
): { keep: number[]; extraForms: number[] } => {
  const keep: number[] = [];
  const extraForms: number[] = [];
  let formsTaken = countAttachedForms(useAttachmentsStore);

  isForm.forEach((flag, index) => {
    if (flag && formsTaken > 0) {
      extraForms.push(index);
      return;
    }
    if (flag) formsTaken += 1;
    keep.push(index);
  });

  return { keep, extraForms };
};

/**
 * Records the freshly attached refs that are DocSpace forms.
 *
 * `withResults` are the ids the in-chat model recommendation is about (a form
 * whose responses land in a table); `pdfForms` every id that came from a PDF
 * form, which is what the one-form cap counts. The narrower set is a subset of
 * the wider one, but callers pass both explicitly rather than having this
 * infer it.
 */
export const rememberFormAttachments = (
  useAttachmentsStore: AttachmentsStore,
  { withResults, pdfForms }: { withResults: string[]; pdfForms: string[] },
) => {
  if (withResults.length === 0 && pdfForms.length === 0) return;

  const registry = getRegistry(useAttachmentsStore);
  const addedResults = withResults.filter((id) => !registry.ids.has(id));
  const addedForms = pdfForms.filter((id) => !registry.pdfFormIds.has(id));
  if (addedResults.length === 0 && addedForms.length === 0) return;

  addedResults.forEach((id) => registry.ids.add(id));
  addedForms.forEach((id) => registry.pdfFormIds.add(id));
  registry.version += 1;
  registry.listeners.forEach((listener) => listener());
};
