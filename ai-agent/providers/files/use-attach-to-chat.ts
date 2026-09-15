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

import { useAiChatStoreOptional } from "../ai-chat-store/AiChatStoreProvider";

import { getOnlyofficeFileType } from "./file-type";
import { attachFilesToChat } from "./attach-files";
import { useOnFilesAttached } from "./attached-report";
import {
  useAttachmentLimit,
  type AttachmentCap,
} from "./attachment-limit";
import { splitDuplicateAttachments } from "./duplicate-attachments";
import { reserveAttachmentChips } from "./limits";
import {
  findAnalyzeAttachmentId,
  hasAnalyzeAttachment,
  hasFormResults,
} from "./form-attachments";

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
  // The row is a DocSpace PDF form, and the table its responses are collected
  // in. Together they decide whether the chat offers the form-specific hints
  // (see `hasFormResults` / `useHasFormAttached`).
  isForm?: boolean;
  externalDbTableName?: string | null;
  /**
   * Attach this file as the subject of the message: the draft is emptied
   * first and, while the file is on it, the composer takes nothing else (see
   * `useAnalyzeLock`). Used by "Analyze responses", whose answer is about
   * this one form's responses.
   */
  analyzeOnly?: boolean;
};


/**
 * Why each item did not end up on the message. Every reason is counted
 * apart: they read differently to the user, and a caller that lumps them
 * together ends up telling someone who dropped a folder that the attachment
 * limit is full. The four counts always add up to the number of items handed
 * in: `attached`, `duplicates`, `skippedFolders`, `skippedOverLimit`.
 */
export type AttachToChatResult = {
  attached: number;
  /** Folders — the composer takes files only. */
  skippedFolders: number;
  /** Files past `CHAT_ATTACHMENT_LIMIT`: the composer had no room left. */
  skippedOverLimit: number;
  /** Files already attached to the message — one chip per entryId. */
  duplicates: number;
  /**
   * The cap that applied and what put it there, so the caller's toast can
   * explain the refusal rather than just quote a number (see
   * `AttachmentLimitContext`).
   */
  cap: AttachmentCap;
};

/**
 * Attaches host files (portal entries, referenced by id) to the composer of
 * the currently open chat — the same "Add files from DocSpace" chip the attach
 * dialog produces. Use it for the shortcuts that bypass the picker: the
 * "Ask AI" context action and the drag-and-drop drop zone.
 *
 * Folders are ignored, and so are files already attached to the message — one
 * chip per entryId. The cap is applied here rather than left to the store so
 * the caller learns what was dropped and why: the result counts each reason
 * separately (see {@link AttachToChatResult}), so a caller can hand a raw
 * selection over and still say the right thing. The promise resolves once the
 * AI backend has echoed the attachment records back (rejects if that
 * round-trip fails, so callers own the error toast).
 *
 * What the backend reported about those records is passed on to the provider's
 * reporter (see {@link useOnFilesAttached}) — the same one the picker dialog
 * and the device upload call — so the flags the attachments store drops
 * (`canAnalyze`) are kept no matter which entry point attached the file.
 */
export const useAttachHostFilesToChat = () => {
  const { useAttachmentsStore, useMessageStore } = useStores();
  // Reported to the provider, not to the caller: `canAnalyze` is a chat-side
  // flag, and a host triggering this from a row action has no use for it.
  const onFilesAttached = useOnFilesAttached();
  // What the composer accepts here, and why: the caller quotes the reason
  // back to the user when something is refused.
  const cap = useAttachmentLimit();
  // Null outside the chat providers (a host subtree rendered without them),
  // where there is no mode to enter.
  const aiChatStore = useAiChatStoreOptional();

  return React.useCallback(
    async (items: ChatAttachableItem[]): Promise<AttachToChatResult> => {
      const notFolders = items.filter((item) => !item.isFolder);
      const skippedFolders = items.length - notFolders.length;

      const subject = notFolders.find((item) => item.analyzeOnly);

      // An analyze attach is about one form, so it takes that form and
      // nothing else — the rest of the batch is refused rather than riding
      // along on the cap that the subject itself is exempt from. No caller
      // mixes them today (every analyze entry point hands over a single row),
      // which is exactly why this has to be stated here instead of relied on.
      const candidates = subject ? [subject] : notFolders;
      const skippedBesideSubject = notFolders.length - candidates.length;

      if (subject) {
        const subjectId = String(subject.id);

        // Clicking "Analyze responses" on the form this chat is already
        // analyzing asks for the state it is in, so it changes nothing and
        // refuses nothing: the answer is "that one is already here", the same
        // one a second pick of an attached file gets. Saying "this chat works
        // with X only" instead would name the very file the user just clicked
        // and send them to a new chat for no reason.
        //
        // It cannot re-attach either, not even once the message has taken the
        // chip: the mode outlives it, and minting a second record for the
        // same form mid-conversation is the thing the subject rule exists to
        // prevent.
        if (aiChatStore?.isAnalyzeMode && aiChatStore.analyzeEntryId === subjectId) {
          // The chip is on the draft whenever the message has not gone out,
          // so this is also the moment a mode still stuck in `attaching` (its
          // records reported to nobody) can be promoted — and the attachment
          // id the starter questions are asked for picked up with it.
          aiChatStore.markAnalyzeAttached(
            subjectId,
            findAnalyzeAttachmentId(useAttachmentsStore),
          );

          return {
            attached: 0,
            skippedFolders,
            skippedOverLimit: skippedBesideSubject,
            duplicates: candidates.length,
            cap,
          };
        }

        // Not while the analyzing chat is waiting on its answer. Taking on
        // another subject empties the draft and re-points the whole chat —
        // panel title, chips, the poll for the new form's questions — at a
        // moment when a reply about the previous form is still arriving, and
        // that reply would land in a chat that no longer says what it is
        // about. Read at click time rather than subscribed to: this hook
        // would otherwise re-render on every token of every stream.
        if (
          aiChatStore?.isAnalyzeMode &&
          useMessageStore.getState().isRequestRunning
        ) {
          return {
            attached: 0,
            skippedFolders,
            skippedOverLimit: notFolders.length,
            duplicates: 0,
            // Built here rather than spread from the ambient cap: that one
            // carries an `analyze` fileName which means nothing under this
            // reason, and a cap that reports a file it is not about is a trap
            // for the next reader of the toast code.
            cap: { limit: 0, reason: "busy" },
          };
        }

        // An analyzing chat keeps the form it was opened on. Another form is
        // another subject, and this chat only has one — so the request is
        // refused outright: nothing is attached, the form on the draft stays
        // where it is, and the mode keeps pointing at it. The toast names
        // that form and offers the way out (a new chat), exactly as the cap
        // refusal does for an ordinary file.
        //
        // The same holds once the message is sent: the mode outlives the
        // chip, so a second form is refused then too.
        if (aiChatStore?.isAnalyzeMode) {
          return {
            attached: 0,
            skippedFolders,
            skippedOverLimit: notFolders.length,
            duplicates: 0,
            // Described from the store, not from the cap in context: the mode
            // is what refuses this, and it is the mode that knows which form
            // the toast has to name. The context cap says the same thing
            // while the providers are wired, but that is a second source of
            // truth for one fact — and the wrong one to trust here.
            cap: {
              limit: 0,
              reason: "analyze",
              fileName: aiChatStore.analyzeFormTitle,
            },
          };
        }

        // Enter the mode now, not when the round trip below comes back with
        // the records: the cap and the composer's attach actions are derived
        // from it, and until it is set they still advertise the ordinary
        // chat. The reservation further down then fills the single slot, so a
        // file dropped on the panel while this attach is in flight is refused
        // instead of landing beside the form. The provider starts the mode
        // again from the attach report — same subject, same phase.
        //
        // It has to happen before the duplicate check below, not after: every
        // entry point raises the panel first, and raising it ends the mode
        // (`openNewChat`). A repeat click on the form the chat is already
        // analyzing would otherwise take that exit and then return early as a
        // duplicate, leaving the chat with no mode, no title and no chips —
        // the very state the user asked to be in.
        aiChatStore?.startAnalyzeMode({
          entryId: subjectId,
          title: subject.title,
        });

        // The mode was off, yet this form may still be on the draft from one
        // that ended without clearing it. Re-attaching would mint a second
        // record for a chip that is already there, so the check has to run
        // before the clear below — which would otherwise hide the duplicate
        // from the filter.
        const { duplicates: subjectDuplicate } = splitDuplicateAttachments(
          useAttachmentsStore,
          [subjectId],
        );

        if (
          subjectDuplicate.length > 0 &&
          hasAnalyzeAttachment(useAttachmentsStore)
        ) {
          // Nothing is attached here, but the check above just proved the
          // chip is on the draft — so the mode entered a moment ago is past
          // its attaching phase already. Without this it would stay there for
          // good (only an attach report promotes it), and a mode that never
          // reaches `pending` cannot be left by taking the chip off. The
          // attachment id comes off that existing chip, which is also what
          // the starter questions are asked for.
          aiChatStore?.markAnalyzeAttached(
            subjectId,
            findAnalyzeAttachmentId(useAttachmentsStore),
          );

          return {
            attached: 0,
            skippedFolders,
            // Anything handed in beside the subject had no room either, and
            // the counts have to keep adding up to what the caller passed.
            skippedOverLimit: skippedBesideSubject,
            duplicates: candidates.length,
            cap,
          };
        }

        // An analyze attach owns the message, so it starts from an empty
        // draft: whatever the user had picked before is dropped (chips and
        // storage records alike) rather than silently competing with the
        // form for the single slot. That includes the same form attached as
        // an ordinary file — re-attaching is what turns it into the subject.
        const store = useAttachmentsStore.getState();
        await Promise.all([
          store.clearAttachmentFiles(),
          store.clearAttachmentImages(),
        ]);
      }

      // A file goes on a message once. Drop the repeats before reserving
      // chips, so a duplicate never flashes a loading chip and the counts
      // below tell the caller what really happened.
      const { keep } = splitDuplicateAttachments(
        useAttachmentsStore,
        candidates.map((file) => String(file.id)),
      );
      const files = keep.map((index) => candidates[index]);
      const duplicates = candidates.length - files.length;

      // A subject that got this far is entering a chat with no mode on, so
      // the analyze cap left over from a previous one is not what should
      // judge it — that cap is zero once a message has been sent, and would
      // refuse the very first form of the next mode. Exactly one slot: the
      // draft was just emptied above, so it is genuinely free, and the batch
      // is the subject alone.
      const effectiveLimit = subject ? 1 : cap.limit;

      const inputsAll = files.map((file) => ({
        path: String(file.id),
        title: file.title,
        type: getOnlyofficeFileType(file.fileExst || file.title),
        content: "",
        hasFormResults: hasFormResults(file),
        analyzeOnly: Boolean(file.analyzeOnly),
      }));

      // The store owns the cap: the reservation counts the refs already
      // attached *and* the loading chips of uploads still in flight, which
      // a local free-slot computation could not see. Everything reserves
      // `kind: "file"` because images are re-keyed out of `attachmentFiles`
      // only after the attach (see attachFilesToChat).
      const pendingIds = reserveAttachmentChips(
        useAttachmentsStore,
        inputsAll.map((input) => ({
          title: input.title,
          kind: "file" as const,
          type: input.type,
        })),
        effectiveLimit,
      );
      const inputs = inputsAll.slice(0, pendingIds.length);
      // The reservation is the cap: whatever it refused had no room. So were
      // the files handed in beside an analyze subject — the message has room
      // for the form only, which is the same answer from the user's side.
      const skippedOverLimit =
        inputsAll.length - inputs.length + skippedBesideSubject;
      const counts = {
        skippedFolders,
        skippedOverLimit,
        duplicates,
        cap,
      };

      if (inputs.length === 0) return { attached: 0, ...counts };

      const imageIndices = new Set<number>();
      files.slice(0, inputs.length).forEach((file, i) => {
        if (file.fileType === FileType.Image) imageIndices.add(i);
      });

      try {
        const attached = await attachFilesToChat(
          useAttachmentsStore,
          inputs,
          imageIndices,
          pendingIds,
        );
        onFilesAttached?.(attached);
      } catch (err) {
        // Callers own the toast (documented); the leases must not outlive
        // the failure or Send stays blocked.
        useAttachmentsStore.getState().failPendingAttachments(pendingIds);
        // Neither may the mode entered a moment ago: the form never made it
        // onto the message, so a chat locked to it would be locked to
        // nothing. A mode that was running for another form is gone too — it
        // lost its draft to the clear above either way.
        if (subject) aiChatStore?.endAnalyzeMode();
        throw err;
      }

      return { attached: inputs.length, ...counts };
    },
    [useAttachmentsStore, useMessageStore, onFilesAttached, cap, aiChatStore],
  );
};
