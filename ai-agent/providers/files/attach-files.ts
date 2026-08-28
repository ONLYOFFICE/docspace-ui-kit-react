// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { useStores } from "@onlyoffice/ai-chat";

type AttachmentsStore = ReturnType<typeof useStores>["useAttachmentsStore"];

/**
 * The slice of the attachments store the duplicate check reads. Structural
 * on purpose: the real store satisfies it, and a caller (or a test) can hand
 * over anything that can list the current refs.
 */
type AttachedRefsSource = {
  getState: () => Pick<
    ReturnType<AttachmentsStore["getState"]>,
    "attachmentFiles" | "attachmentImages"
  >;
};

export type AttachFileInput = {
  // Host entryId; the AI backend resolves the record server-side.
  path: string;
  title: string;
  // ONLYOFFICE c_oAscFileType code (see getOnlyofficeFileType).
  type: number;
  content: string;
};

/**
 * What the backend reported about a freshly attached file, keyed by
 * attachment id. `addAttachmentFile` keeps only `{id, title, kind, path,
 * type}` in the store, so anything else the record carried — notably
 * `canAnalyze` for forms — is available in the attach response alone and has
 * to be remembered by the caller.
 */
export type AttachedFileInfo = {
  id: string;
  /** The backend can analyze this file's contents (an analyzable form). */
  canAnalyze?: boolean;
};

/** Reports what was attached, so the caller can keep the extra flags. */
export type OnFilesAttached = (attached: AttachedFileInfo[]) => void;

// The packaged ai-chat (`onlyoffice-ai-chat-0.5.0-docspace.2.tgz`) predates
// `canAnalyze` on its `Attachment` type, while the backend already returns it.
// Read it structurally until a build carrying the field is packed.
const readCanAnalyze = (record: unknown): boolean | undefined => {
  if (typeof record !== "object" || record === null) return undefined;
  if (!("canAnalyze" in record)) return undefined;
  const value = record.canAnalyze;
  return typeof value === "boolean" ? value : undefined;
};

/**
 * The host entry id an attached ref came from.
 *
 * We send the bare entry id as `AttachFileInput.path`, but what comes back
 * on the ref is `${entryId}/${title}` — the AI backend composes it that way
 * so the widget's history chip can render the file name via `basename(path)`.
 * Take the first segment back, exactly as the backend does when it matches a
 * response to its request.
 *
 * That composition is the backend's convention, not a contract this repo can
 * enforce, so be forgiving about the shapes around it: a bare entry id and a
 * leading slash both reduce to the same key. A wholesale change of the format
 * would still slip through — the tests below pin the shapes we know.
 */
const toEntryId = (path: string): string => {
  const trimmed = path.replace(/^\/+/, "");
  return trimmed.split("/", 1)[0] || trimmed;
};

/**
 * Host entry ids already present in the composer — files and images alike,
 * since images are re-keyed out of `attachmentFiles` once they settle.
 */
const getAttachedEntryIds = (
  useAttachmentsStore: AttachedRefsSource,
): Set<string> => {
  const { attachmentFiles, attachmentImages } = useAttachmentsStore.getState();
  return new Set(
    [...attachmentFiles, ...attachmentImages]
      .map((ref) => ref.path)
      .filter((path): path is string => !!path)
      .map(toEntryId),
  );
};

/**
 * Positions of `inputs` that are not attached yet, in input order — drops
 * host files already sitting in the composer and collapses repeats inside
 * the batch itself. Call it *before* `beginPendingAttachments` so duplicates
 * never take a cap slot and never produce a loading chip.
 *
 * Known bounded gap: a loading chip ({@link TPendingAttachment}) carries no
 * host path, so a second pick of the same file while the first one is still
 * in flight is not caught. Closing it needs a `path` on the placeholder — a
 * library follow-up.
 */
export const selectNewAttachmentIndices = (
  useAttachmentsStore: AttachedRefsSource,
  inputs: AttachFileInput[],
): number[] => {
  const seen = getAttachedEntryIds(useAttachmentsStore);
  const kept: number[] = [];
  inputs.forEach((input, index) => {
    const entryId = toEntryId(input.path);
    if (seen.has(entryId)) return;
    seen.add(entryId);
    kept.push(index);
  });
  return kept;
};

/**
 * Attaches host files to the AI chat composer through the attachments
 * store, then re-keys the refs flagged in `imageIndices` to
 * `attachmentImages`. The library hardcodes `kind: "file"` for refs produced
 * by `addAttachmentFile` even when the backend resolved an image, so without
 * this the chip would show the unknown-format icon instead of a preview.
 *
 * `imageIndices` are positions into `inputs`; the matching freshly-added refs
 * are moved (added refs preserve input order).
 *
 * `pendingIds` are loading-chip leases from `beginPendingAttachments`, one
 * per input in the same order — passing them swaps each placeholder for its
 * real chip atomically and keeps the reservation from being counted twice
 * against the attachment cap. Known bounded gap: cancelling a single loading
 * chip mid-batch shifts the positions the store settles, so `imageIndices`
 * can tag a neighbouring ref (wrong icon, nothing worse); the proper fix is
 * a per-input `kind` in `addAttachmentFile` — a library follow-up.
 *
 * Callers that did not reserve leases get the duplicate filter applied here
 * (see {@link selectNewAttachmentIndices}); the reserve-first ones must run
 * it themselves before `beginPendingAttachments`, so the reservation matches
 * what is actually going to be attached.
 *
 * Returns what stayed attached as files, so the caller can keep the record
 * flags the store drops (see {@link AttachedFileInfo}). Records past the
 * store's cap, or whose lease was revoked mid-flight, are dropped by the
 * library, so the result can be shorter than `inputs`.
 */
export const attachFilesToChat = async (
  useAttachmentsStore: AttachmentsStore,
  rawInputs: AttachFileInput[],
  rawImageIndices: Set<number>,
  pendingIds?: string[],
): Promise<AttachedFileInfo[]> => {
  // With leases the caller has already filtered (it had to, to reserve the
  // right number of chips). Without them nobody has, so drop the duplicates
  // here: a direct caller must not be able to put a second chip on a host
  // file the composer already holds.
  const kept = pendingIds
    ? null
    : selectNewAttachmentIndices(useAttachmentsStore, rawInputs);
  const inputs = kept ? kept.map((i) => rawInputs[i]) : rawInputs;
  // `imageIndices` are positions into the inputs, so they move with them.
  const imageIndices = kept
    ? new Set(
        kept.flatMap((source, i) => (rawImageIndices.has(source) ? [i] : [])),
      )
    : rawImageIndices;

  if (inputs.length === 0) return [];

  // Identify the freshly added refs by id, not by a pre-await length: the
  // upload window is long and user-visible now, and deleting an existing
  // chip meanwhile would shift a positional slice.
  const beforeIds = new Set(
    useAttachmentsStore.getState().attachmentFiles.map((f) => f.id),
  );

  const records =
    (await useAttachmentsStore.getState().addAttachmentFile(inputs, {
      pendingIds,
    })) ?? [];

  const attached = records
    .filter((_, i) => !imageIndices.has(i))
    .map((record) => ({ id: record.id, canAnalyze: readCanAnalyze(record) }));

  if (imageIndices.size === 0) return attached;

  useAttachmentsStore.setState((s) => {
    const added = s.attachmentFiles.filter((ref) => !beforeIds.has(ref.id));
    const stayingFiles = s.attachmentFiles.filter((ref) =>
      beforeIds.has(ref.id),
    );
    const movedImages: typeof s.attachmentImages = [];
    added.forEach((ref, i) => {
      if (imageIndices.has(i)) {
        movedImages.push({ ...ref, kind: "image" });
      } else {
        stayingFiles.push(ref);
      }
    });
    return {
      attachmentFiles: stayingFiles,
      attachmentImages: [...s.attachmentImages, ...movedImages],
    };
  });

  return attached;
};
