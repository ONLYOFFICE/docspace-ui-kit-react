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

import {
  pollSuggestedQuestions,
  type PollSuggestedQuestions,
  type SuggestedQuestion,
} from "./suggested-questions";

/**
 * The starter questions of the form the composer is analyzing, fetched while
 * the user waits.
 *
 * `entryId` is the DocSpace file id of that form, or `undefined` when no form
 * owns the message — passing `undefined` is how the caller says "stop": the
 * poll in flight is aborted and its answer discarded. The same happens when
 * the id changes (another form became the subject) and on unmount.
 *
 * One poll per form, ever: a form that has answered — with questions or with
 * "there will be none" — is not asked again, and re-rendering while a poll
 * runs does not start a second one.
 *
 * `onTyping` is returned rather than watched here: the moment the user writes
 * their own question the suggestions are moot, so the caller wires it to the
 * composer and this stops waiting for them.
 */
export const useAnalyzeQuestions = (
  poll: PollSuggestedQuestions,
  entryId: string | undefined,
): {
  questions: SuggestedQuestion[] | null;
  /** Call when the user starts typing: aborts the wait for good. */
  onTyping: () => void;
} => {
  const [questions, setQuestions] = React.useState<SuggestedQuestion[] | null>(
    null,
  );

  const controllerRef = React.useRef<AbortController | null>(null);
  // The form this hook is already committed to, so a re-render cannot start a
  // second poll for it.
  const polledRef = React.useRef<string | null>(null);

  const abort = React.useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  React.useEffect(() => {
    if (!entryId) {
      // The form left the draft (chip removed, message sent, thread
      // switched): drop the questions with it, so the next form starts clean.
      abort();
      polledRef.current = null;
      setQuestions(null);
      return;
    }

    if (polledRef.current === entryId) return;

    // A different form took over mid-flight — the previous answer must not
    // land on this one.
    abort();
    polledRef.current = entryId;
    setQuestions(null);

    const controller = new AbortController();
    controllerRef.current = controller;

    pollSuggestedQuestions(poll, entryId, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      setQuestions(result);
    });
  }, [entryId, poll, abort]);

  React.useEffect(() => () => abort(), [abort]);

  return { questions, onTyping: abort };
};
