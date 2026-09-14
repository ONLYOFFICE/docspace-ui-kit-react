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

import { createContext, useContext } from "react";

import { CHAT_ATTACHMENT_LIMIT } from "./limits";

/**
 * The cap in force, and what put it there.
 *
 * The reason is carried alongside the number because it is the only thing
 * that makes the refusal explainable: "one file" reads as an arbitrary rule
 * unless the message can say the composer is analyzing a form's responses,
 * or that this section works a file at a time.
 */
export type AttachmentCap = {
  limit: number;
  /**
   * The form the chat is analyzing, when that is what narrowed the cap. The
   * refusal names it, because "one file only" without the name reads as an
   * arbitrary rule.
   */
  fileName?: string;
  reason:
    | /** The widget's own cap — nothing narrower applies. */ "widget"
    | /** The section the chat is rendered in takes fewer. */ "section"
    | /** The draft carries the form a message is about. */ "analyze";
};

export const DEFAULT_ATTACHMENT_CAP: AttachmentCap = {
  limit: CHAT_ATTACHMENT_LIMIT,
  reason: "widget",
};

/**
 * How many attachments the composer accepts here, carried down so the attach
 * entry points outside the chat — the "Ask AI" action and the drop zone, both
 * going through `useAttachHostFilesToChat` — apply the same cap as the picker
 * dialog and the device upload (those get it as a prop).
 *
 * Two things narrow it: the host's section (the Forms section takes a single
 * attachment, because a question there is about one form and its responses)
 * and an analyze subject on the draft. The default is the widget's own cap,
 * so a subtree rendered without the provider behaves exactly as before.
 */
export const AttachmentLimitContext = createContext<AttachmentCap>(
  DEFAULT_ATTACHMENT_CAP,
);

/** The cap in force here — never above the widget's own. */
export const useAttachmentLimit = (): AttachmentCap =>
  useContext(AttachmentLimitContext);

/** What the chat's state says the composer may take right now. */
export type AttachmentCapInput = {
  /** The chat is in "Analyze responses". */
  analyzeActive: boolean;
  /** ...and its first message has not gone out yet. */
  analyzePending: boolean;
  /** Name of the analyzed form, for the refusal. */
  analyzeFileName?: string;
  /** What the host's section allows, already clamped to the widget's cap. */
  sectionLimit: number;
};

/**
 * The cap and what put it there: an analyze subject beats the section, which
 * beats the widget's own limit.
 *
 * The analyze mode gets one slot before the first message and none after it.
 * The single slot is the form's own — it is already on the draft, so nothing
 * else fits anyway — and the send empties the draft without ending the mode,
 * which would hand that slot to the next file dropped on the panel. Hiding the
 * "+" menu does not cover it: drag-and-drop and the host's "Ask AI" row action
 * attach through this cap, so this is what has to say no. Attaching another
 * form as the new subject goes around it — see `useAttachHostFilesToChat`.
 */
export const resolveAttachmentCap = ({
  analyzeActive,
  analyzePending,
  analyzeFileName,
  sectionLimit,
}: AttachmentCapInput): AttachmentCap => {
  if (analyzeActive) {
    return {
      limit: analyzePending ? 1 : 0,
      reason: "analyze",
      fileName: analyzeFileName,
    };
  }
  return sectionLimit < CHAT_ATTACHMENT_LIMIT
    ? { limit: sectionLimit, reason: "section" }
    : { limit: sectionLimit, reason: "widget" };
};
