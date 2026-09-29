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
import SocketHelper, {
  getFormAnalysisRoomPart,
  SocketCommands,
  SocketEvents,
  type TFormSuggestedQuestionsData,
} from "../../../utils/socket";

/**
 * A starter question the backend generated for an analyzable form, from that
 * form's own schema and in the user's language.
 *
 * Generation is asynchronous and cached server-side against (form, version,
 * language), and the attach response does not carry the result: the chat asks
 * for it by attachment id and, while the model is still working, waits for it
 * on the socket.
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
 * The usable questions out of whatever arrived, or `null` when none are.
 *
 * Both ways they reach the chat — the request and the socket — carry a
 * model's output through the same shape, and a half-formed entry would render
 * a chip with an empty label or send an empty prompt. So both come through
 * here, and "nothing usable" is one value rather than a choice between `null`
 * and `[]`.
 */
const pickQuestions = (value: unknown): SuggestedQuestion[] | null => {
  if (!Array.isArray(value)) return null;
  const questions = value.filter(isSuggestedQuestion);
  return questions.length > 0 ? questions : null;
};

/**
 * Asks for the questions of one attachment
 * (`POST ai/attachments/suggested-questions`).
 *
 * Keyed by the attachment id the attach round trip minted, not by the host
 * file id: the questions belong to the record the form became in this chat.
 */
export type ReadSuggestedQuestions = (
  attachmentId: string,
  signal: AbortSignal,
) => Promise<TSuggestedQuestionsResponse>;

/** Hands the generated questions over, or `null` when there will be none. */
export type SuggestedQuestionsListener = (
  questions: SuggestedQuestion[] | null,
) => void;

/** Drops the socket subscription this opened. */
export type Unsubscribe = () => void;

/**
 * Listens for the questions of one attachment on the socket.
 *
 * Generation is asynchronous, so the request below answers `pending` far more
 * often than not, and this is how the answer eventually arrives: the backend
 * emits into the attachment's own room once the model is done. Subscribing
 * has to happen *before* that request goes out — the generation can finish
 * while it is in flight, and a listener attached afterwards would miss the
 * only event there will ever be.
 *
 * Events for other attachments are ignored: one socket carries every room the
 * session has joined, and a second form analyzed in another tab shares it.
 */
export const subscribeToSuggestedQuestions = (
  attachmentId: string,
  onQuestions: SuggestedQuestionsListener,
): Unsubscribe => {
  const roomParts = getFormAnalysisRoomPart(attachmentId);

  const handle = (data: TFormSuggestedQuestionsData) => {
    if (String(data?.attachmentId) !== attachmentId) return;
    onQuestions(pickQuestions(data?.questions));
  };

  SocketHelper?.emit(SocketCommands.Subscribe, { roomParts });
  SocketHelper?.on(SocketEvents.FormSuggestedQuestions, handle);

  return () => {
    SocketHelper?.off(SocketEvents.FormSuggestedQuestions, handle);
    SocketHelper?.emit(SocketCommands.Unsubscribe, { roomParts });
  };
};

/**
 * Asks once whether the questions are already there.
 *
 * The backend caches them per (form, version, language), so a form analyzed
 * before answers `ready` straight away and the chips appear without a wait.
 * Anything else — `pending` while the model works, `unavailable` when there
 * will never be any, or a failed request — resolves to `null` and leaves the
 * socket to deliver them if they do arrive.
 *
 * `null` also stands for "generated nothing", deliberately: an empty list and
 * a verdict of no-questions put the same thing on screen.
 */
export const requestSuggestedQuestions = async (
  read: ReadSuggestedQuestions,
  attachmentId: string,
  signal: AbortSignal,
): Promise<SuggestedQuestion[] | null> => {
  try {
    const answer = await read(attachmentId, signal);
    if (signal.aborted) return null;
    if (answer?.status !== "ready") return null;
    return pickQuestions(answer.questions);
  } catch {
    // An aborted fetch lands here too; either way there is nothing to show
    // from this request.
    return null;
  }
};
