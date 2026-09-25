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

import type { ChatCallbacks, ChatMiddleware } from "@onlyoffice/ai-chat";

import type AiChatStore from "./ai-chat-store/AiChatStore";

/**
 * Marks the analyze mode as "the first message is on its way".
 *
 * Timing is the whole point. The widget empties the composer draft as soon as
 * the send is approved, and an empty draft is also what "the user removed the
 * form" looks like — the difference is only in what happened first. The
 * `beforeSend` hook runs synchronously ahead of that clear, while
 * `onMessageSent` fires several awaits after it, so this is the only place
 * that can flip the phase before anyone can misread the empty draft.
 *
 * It never blocks: it inspects nothing and returns the message untouched.
 */
export const analyzeSentMiddleware = (store: AiChatStore): ChatMiddleware => ({
  beforeSend: () => {
    store.markAnalyzeSent();
    return { action: "continue" };
  },
});

/**
 * The chat events that end the analyze mode.
 *
 * A thread the user switched to is a different conversation, so the mode does
 * not follow it. The thread our own first message creates is not a switch —
 * and the thread id changes either way, so `kind` is the only thing that tells
 * the two apart.
 *
 * Merged with the host's own callbacks by `composeCallbacks`; kept beside the
 * middleware because the two are the same concern — where the mode's life
 * meets the widget's events.
 */
export const analyzeModeCallbacks = (store: AiChatStore): ChatCallbacks => ({
  onThreadsUpdated: ({ kind }) => {
    if (kind === "switched") store.endAnalyzeMode();
  },
});
