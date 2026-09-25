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

import { createContext, useContext } from "react";

import type { OnFilesAttached } from "./attach-files";

/**
 * Carries AiAgentProviders' own attach reporter down the tree, so the attach
 * entry points a host triggers from outside the chat — the "Ask AI" context
 * action and the drag-and-drop drop zone, both going through
 * `useAttachHostFilesToChat` — report what they attached exactly like the
 * picker dialog and the device upload do (those get the callback as a prop).
 *
 * The provider owns the reporter (it remembers the record flags the
 * attachments store drops, `canAnalyze`), so the callers must not have to know
 * about it: undefined outside the provider makes the report a no-op.
 */
export const OnFilesAttachedContext = createContext<
  OnFilesAttached | undefined
>(undefined);

/** The provider's attach reporter, or undefined when rendered without it. */
export const useOnFilesAttached = (): OnFilesAttached | undefined =>
  useContext(OnFilesAttachedContext);
