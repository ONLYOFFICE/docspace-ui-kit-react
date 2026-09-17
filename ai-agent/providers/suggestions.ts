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

import type { Suggestion } from "@onlyoffice/ai-chat";

import type { SuggestedQuestion } from "./files";

/**
 * Suggestion chips per composer state. The host owns the texts; picking
 * between them belongs here, because only the provider sees the attachments
 * store — files can also arrive by drag-and-drop and be removed chip by chip,
 * neither of which the host observes.
 *
 * Precedence: an analyzable form wins over the plain file lists, and those win
 * over the section default. Files and images both count — an attached image
 * is what the user is asking about just as much as a document.
 */
export type SuggestionSet = {
  /** Nothing attached: chips for the current section (room / folder). */
  default: Suggestion[];
  /** Exactly one file or image attached. */
  singleFile?: Suggestion[];
  /** Two or more files/images attached. */
  multipleFiles?: Suggestion[];
  /**
   * At least one attached file the backend flagged as analyzable. Also what
   * stands in whenever the attach response brought no per-form questions of
   * its own — see {@link SuggestedQuestion}.
   */
  analyzableForm?: Suggestion[];
};

/**
 * The form the composer is analyzing, and the questions generated for it —
 * `null` while the long poll is still waiting, or once it gave up.
 */
export type AnalyzeState = {
  active: boolean;
  questions: SuggestedQuestion[] | null;
};

/**
 * The chips to show right now.
 *
 * `attachedFileIds` are the refs the composer holds (files and images alike)
 * and `analyzableIds` those of them the backend flagged as analyzable forms.
 *
 * A bare array is the host saying "these chips, whatever is attached", so it
 * is returned untouched — the set form is what opts into the switching.
 */
export const resolveSuggestions = (
  suggestions: Suggestion[] | SuggestionSet | undefined,
  attachedFileIds: string[],
  analyzableIds: string[],
  analyze?: AnalyzeState,
): Suggestion[] | undefined => {
  if (!suggestions || Array.isArray(suggestions)) return suggestions;

  // A message about one form's responses gets that form's own questions and
  // nothing else: the static chips ask about the document, which is not what
  // was asked for. Until the generation answers (or gives up) there is simply
  // nothing to show.
  if (analyze?.active) {
    return (analyze.questions ?? []).map(({ question, prompt }) => ({
      name: question,
      prompt,
    }));
  }

  // An analyzable form attached to an ordinary chat gets the host's static
  // form chips. Its generated questions belong to the analyze mode alone:
  // they are asked for per attachment and arrive over the socket, which is a
  // wait that only that mode explains to the user.
  if (attachedFileIds.some((id) => analyzableIds.includes(id))) {
    return suggestions.analyzableForm ?? suggestions.default;
  }
  if (attachedFileIds.length > 1) {
    return suggestions.multipleFiles ?? suggestions.default;
  }
  if (attachedFileIds.length === 1) {
    return suggestions.singleFile ?? suggestions.default;
  }
  return suggestions.default;
};
