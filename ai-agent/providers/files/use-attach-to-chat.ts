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

"use client";

import React from "react";
import { useStores } from "@onlyoffice/ai-chat";

import { FileType } from "../../../enums";

import { getOnlyofficeFileType } from "./file-type";
import { attachFilesToChat } from "./attach-files";

// The subset of a host file/folder view-model the composer needs. Folders are
// accepted (and skipped) so callers can hand over a raw selection without
// pre-filtering it.
export type ChatAttachableItem = {
  id: number | string;
  // Includes the extension — the host list item title, not a selector label.
  title: string;
  fileExst?: string | null;
  // Host `FileType` category. Typed as `number` because the callers' enums come
  // from different generations of the API models (nominal enum vs. literal
  // union) — only the numeric value matters here.
  fileType?: number;
  isFolder?: boolean;
};

/**
 * Composer attachment cap. Mirrors `ATTACHMENT_LIMIT` in the widget's
 * attachments store. The store's `beginPendingAttachments` is the actual
 * enforcement point (it also counts uploads still in flight); this constant
 * exists for user-facing copy that quotes the number.
 */
export const CHAT_ATTACHMENT_LIMIT = 5;

export type AttachToChatResult = {
  attached: number;
  /** Files left out: folders, or everything past `CHAT_ATTACHMENT_LIMIT`. */
  skipped: number;
};

/**
 * Attaches host files (portal entries, referenced by id) to the composer of
 * the currently open chat — the same "Add files from DocSpace" chip the attach
 * dialog produces. Use it for the shortcuts that bypass the picker: the
 * "Ask AI" context action and the drag-and-drop drop zone.
 *
 * Folders are ignored. The cap is applied here rather than left to the store so
 * the caller learns how many files were dropped and can say so. The promise
 * resolves once the AI backend has echoed the attachment records back (rejects
 * if that round-trip fails, so callers own the error toast).
 */
export const useAttachHostFilesToChat = () => {
  const { useAttachmentsStore } = useStores();

  return React.useCallback(
    async (items: ChatAttachableItem[]): Promise<AttachToChatResult> => {
      const files = items.filter((item) => !item.isFolder);

      const inputsAll = files.map((file) => ({
        path: String(file.id),
        title: file.title,
        type: getOnlyofficeFileType(file.fileExst || file.title),
        content: "",
      }));

      // The store owns the cap: the reservation counts the refs already
      // attached *and* the loading chips of uploads still in flight, which
      // a local free-slot computation could not see. Everything reserves
      // `kind: "file"` because images are re-keyed out of `attachmentFiles`
      // only after the attach (see attachFilesToChat).
      const pendingIds = useAttachmentsStore
        .getState()
        .beginPendingAttachments(
          inputsAll.map((input) => ({
            title: input.title,
            kind: "file" as const,
            type: input.type,
          })),
        );
      const inputs = inputsAll.slice(0, pendingIds.length);
      const skipped = items.length - inputs.length;

      if (inputs.length === 0) return { attached: 0, skipped };

      const imageIndices = new Set<number>();
      files.slice(0, inputs.length).forEach((file, i) => {
        if (file.fileType === FileType.Image) imageIndices.add(i);
      });

      try {
        await attachFilesToChat(
          useAttachmentsStore,
          inputs,
          imageIndices,
          pendingIds,
        );
      } catch (err) {
        // Callers own the toast (documented); the leases must not outlive
        // the failure or Send stays blocked.
        useAttachmentsStore.getState().failPendingAttachments(pendingIds);
        throw err;
      }

      return { attached: inputs.length, skipped };
    },
    [useAttachmentsStore],
  );
};
