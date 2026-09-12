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

import type { TSuggestedQuestionsResponse } from "../../../api/ai";

/**
 * A starter question the backend generated for an analyzable form, from that
 * form's own schema and in the user's language.
 *
 * Generation is asynchronous and cached server-side against (form, version,
 * language), so an attach response carries the questions only on a cache hit
 * — the very first attach of a form comes back without them and the static
 * chips stand in. Deliberately not chased with a follow-up read.
 */
export type SuggestedQuestion = {
  /** Chip label, up to 60 characters. */
  question: string;
  /** What goes into the chat when the chip is clicked. */
  prompt: string;
};

const isSuggestedQuestion = (value: unknown): value is SuggestedQuestion =>
  typeof value === "object" &&
  value !== null &&
  "question" in value &&
  typeof value.question === "string" &&
  "prompt" in value &&
  typeof value.prompt === "string";

/**
 * `suggestedQuestions` off an attachment record, ignoring malformed entries.
 *
 * Read structurally because the packaged ai-chat's `Attachment` type may not
 * carry the field yet while the backend already returns it — in
 * `attachments/save-files-many`. Drop this once a build declaring it is
 * packed.
 */
export const readSuggestedQuestions = (
  record: unknown,
): SuggestedQuestion[] | undefined => {
  if (typeof record !== "object" || record === null) return undefined;
  if (!("suggestedQuestions" in record)) return undefined;
  const value = record.suggestedQuestions;
  if (!Array.isArray(value)) return undefined;
  return value.filter(isSuggestedQuestion);
};

/** Reads one long-poll answer (`POST ai/attachments/suggested-questions`). */
export type PollSuggestedQuestions = (
  entryId: string,
  signal: AbortSignal,
) => Promise<TSuggestedQuestionsResponse>;

/**
 * Breather between two polls.
 *
 * The endpoint normally holds the request open while the model works, so this
 * pause is invisible — but a `pending` that comes back at once (the wait
 * already spent upstream, a proxy cutting the connection short) would
 * otherwise spin into a request flood.
 */
export const SUGGESTED_QUESTIONS_RETRY_DELAY_MS = 2000;

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const done = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", done);
      resolve();
    };
    const timer = setTimeout(done, ms);
    signal.addEventListener("abort", done, { once: true });
  });

/**
 * Waits for the questions of one form, re-asking while the server says it is
 * still working.
 *
 * The endpoint is itself a long poll — it holds each request for up to 25
 * seconds — so `pending` means that wait elapsed while the generation is
 * still running, and the next call simply waits again, after a
 * {@link SUGGESTED_QUESTIONS_RETRY_DELAY_MS} breather.
 *
 * It ends on `ready` (the questions), on `unavailable` (there will never be
 * any), on a failed request, or when `signal` is aborted — the caller aborts
 * on typing, on the form leaving the draft, and on unmount. The wait between
 * polls is aborted too, so none of those has to sit through it.
 *
 * Resolves to `null` whenever no questions arrived, so a caller cannot mistake
 * "gave up" for "generated nothing".
 */
export const pollSuggestedQuestions = async (
  poll: PollSuggestedQuestions,
  entryId: string,
  signal: AbortSignal,
): Promise<SuggestedQuestion[] | null> => {
  while (!signal.aborted) {
    let answer: TSuggestedQuestionsResponse;
    try {
      answer = await poll(entryId, signal);
    } catch {
      // An aborted fetch lands here too; either way there is nothing to wait
      // for any more.
      return null;
    }

    if (signal.aborted) return null;

    if (answer?.status === "ready") {
      const questions = Array.isArray(answer.questions)
        ? answer.questions.filter(isSuggestedQuestion)
        : [];
      return questions.length > 0 ? questions : null;
    }

    // Anything that is not an explicit "still working" is final: an
    // `unavailable` verdict, or a body we cannot read.
    if (answer?.status !== "pending") return null;

    await wait(SUGGESTED_QUESTIONS_RETRY_DELAY_MS, signal);
  }

  return null;
};
