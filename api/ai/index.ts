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

import { BaseCustomApi } from "../base-custom-api";

// Output formats the md export pipeline understands, mirroring the .NET
// `MdOutputFormat` enum (ASC.AI.Core.MdTextToDocx).
export type AiExportFormat = "Docx" | "Pdf" | "Md";

// The legacy chat REST surface (/ai/chats/*, /ai/rooms/*/servers/*) was
// removed together with the C# AI service; the AI chat now talks to the
// Node AI service through the @onlyoffice/ai-chat engines. Only the
// endpoints that are still served remain here.
export class AiApi extends BaseCustomApi {
  // Async markdown export via the Node AI service
  // (`POST /ai/text-to-docx` → the .NET text-to-docx start endpoint).
  // Fire-and-forget: the AI Worker renders the markdown into `format` and
  // saves the file into the folder; completion arrives as the
  // `s:modify-folder` create-file socket event for every format (`Md` is
  // stored verbatim, without a DocumentService round-trip, but still
  // announces itself the same way). Errors propagate to the caller.
  //
  // `format` spells the .NET `MdOutputFormat` enum members exactly — its
  // JsonStringEnumConverter also accepts other casings, but there is no
  // reason to rely on that. Omitting it keeps the endpoint's own default
  // (`Docx`).
  startTextToDocx(
    folderId: number | string,
    title: string,
    content: string,
    format?: AiExportFormat,
  ) {
    return this.request(`/ai/text-to-docx`, {
      method: "POST",
      data: { folderId, title, content, ...(format ? { format } : {}) },
    });
  }
}
