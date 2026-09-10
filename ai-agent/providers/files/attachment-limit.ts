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
