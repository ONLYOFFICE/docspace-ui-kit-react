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

import { rememberFormAttachments } from "./form-attachments";
import {
  holdAttachPaths,
  rememberAttachedPaths,
  splitDuplicateAttachments,
} from "./duplicate-attachments";

type AttachmentsStore = ReturnType<typeof useStores>["useAttachmentsStore"];

export type AttachFileInput = {
  // Host entryId; the AI backend resolves the record server-side.
  path: string;
  title: string;
  // ONLYOFFICE c_oAscFileType code (see getOnlyofficeFileType).
  type: number;
  content: string;
  /**
   * The host file is a form with a results table (see `hasFormResults`).
   * Local metadata only: the attachments API maps the fields it sends
   * explicitly, so this never reaches the backend — it is remembered per ref
   * (see {@link rememberFormAttachments}) for the in-chat form hints.
   */
  hasFormResults?: boolean;
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
 * A file may be attached to a message only once: inputs whose `path` (the host
 * entryId) is already attached — or repeated within the batch — are dropped
 * here and their loading chips released, so every entry point gets the rule
 * without repeating it.
 *
 * Returns what stayed attached as files, so the caller can keep the record
 * flags the store drops (see {@link AttachedFileInfo}). Duplicates, records
 * past the store's cap, or those whose lease was revoked mid-flight are
 * dropped, so the result can be shorter than `inputs`.
 */
export const attachFilesToChat = async (
  useAttachmentsStore: AttachmentsStore,
  allInputs: AttachFileInput[],
  allImageIndices: Set<number>,
  allPendingIds?: string[],
): Promise<AttachedFileInfo[]> => {
  if (allInputs.length === 0) return [];

  // One file, one chip: drop the inputs whose entryId is already on the
  // message (or repeated inside this very batch) and hand their loading chips
  // back, then re-index the parallel arrays onto what is left.
  const { keep, duplicates } = splitDuplicateAttachments(
    useAttachmentsStore,
    allInputs.map((input) => input.path),
  );

  if (duplicates.length > 0 && allPendingIds) {
    useAttachmentsStore
      .getState()
      .failPendingAttachments(
        duplicates
          .map((index) => allPendingIds[index])
          .filter((id): id is string => Boolean(id)),
      );
  }

  const inputs = keep.map((index) => allInputs[index]);
  const imageIndices = new Set(
    keep
      .map((index, position) => (allImageIndices.has(index) ? position : -1))
      .filter((position) => position >= 0),
  );
  const pendingIds = allPendingIds
    ? keep
        .map((index) => allPendingIds[index])
        .filter((id): id is string => Boolean(id))
    : undefined;

  if (inputs.length === 0) return [];

  // Identify the freshly added refs by id, not by a pre-await length: the
  // upload window is long and user-visible now, and deleting an existing
  // chip meanwhile would shift a positional slice.
  const beforeIds = new Set(
    useAttachmentsStore.getState().attachmentFiles.map((f) => f.id),
  );

  // Claim the paths for the whole round trip, so a second attach started
  // before the refs land sees them as taken.
  const releasePaths = holdAttachPaths(
    useAttachmentsStore,
    inputs.map((input) => input.path),
  );

  const records =
    (await useAttachmentsStore
      .getState()
      .addAttachmentFile(inputs, { pendingIds })
      .finally(releasePaths)) ?? [];

  // Remember which host file each ref came from: `path` is optional on the
  // attachment record, so the duplicate check must not depend on the backend
  // echoing it back. Records line up with `inputs` — the same assumption the
  // image re-keying below already makes.
  rememberAttachedPaths(
    useAttachmentsStore,
    records
      .map((record, i) => ({ id: record.id, path: inputs[i]?.path }))
      .filter((entry): entry is { id: string; path: string } =>
        Boolean(entry.path),
      ),
  );

  rememberFormAttachments(
    useAttachmentsStore,
    records
      .filter((_record, i) => inputs[i]?.hasFormResults)
      .map((record) => record.id),
  );

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
