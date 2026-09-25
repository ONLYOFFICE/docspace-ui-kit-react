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

// The chat widget's own root element. Everything the user can type into
// inside it is the composer or one of its dialogs; anything outside is the
// host app and none of our business.
const CHAT_ROOT_SELECTOR = ".aui-root";

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (!target.closest(CHAT_ROOT_SELECTOR)) return false;
  return (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLInputElement ||
    target.isContentEditable
  );
};

/**
 * Calls `onTyping` the first time the user writes anything into the chat's
 * composer while `enabled`.
 *
 * Read off the DOM on purpose: the chat library exposes `setComposerText` but
 * no change callback and no composer text on its stores, so there is nothing
 * to subscribe to (checked against @onlyoffice/ai-chat 0.5.108). A
 * capture-phase `beforeinput` listener is the narrowest read that still
 * catches every way text arrives — typing, paste, dictation — and it is
 * scoped to the widget's root so the host's own inputs never trigger it.
 *
 * Replace this with a library callback as soon as one exists.
 */
export const useComposerTyping = (
  enabled: boolean,
  onTyping: () => void,
): void => {
  React.useEffect(() => {
    if (!enabled) return;

    const handle = (event: Event) => {
      if (!isTypingTarget(event.target)) return;
      onTyping();
    };

    document.addEventListener("beforeinput", handle, true);
    return () => document.removeEventListener("beforeinput", handle, true);
  }, [enabled, onTyping]);
};
