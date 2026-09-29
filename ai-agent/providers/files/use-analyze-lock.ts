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

import type { useStores } from "@onlyoffice/ai-chat";

import type { getFormRegistry } from "./form-attachments";
import { useRefsInFormRegistry } from "./use-form-registry";

type AttachmentsStore = ReturnType<typeof useStores>["useAttachmentsStore"];

const pickAnalyzeOnly = (registry: ReturnType<typeof getFormRegistry>) =>
  registry.analyzeOnlyIds;

/**
 * Whether the draft is locked to a single attachment because that attachment
 * is the subject of the message — the form a user picked "Analyze responses"
 * on (see `ChatAttachableItem.analyzeOnly`).
 *
 * Derived, never stored: the lock exists exactly while the marked ref is on
 * the draft. Removing its chip, sending the message (the library empties both
 * buckets) or switching threads lifts it without anyone resetting a flag —
 * which is what makes it survive the panel being closed and reopened.
 */
export const useAnalyzeLock = (
  useAttachmentsStore: AttachmentsStore,
): boolean => useRefsInFormRegistry(useAttachmentsStore, pickAnalyzeOnly);
