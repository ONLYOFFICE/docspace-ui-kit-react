// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { AiExportFormat } from "../../../api/ai";

// Export format ids handed to the chat library (and back through
// `saveAsFile`). They spell the .NET `MdOutputFormat` enum members, so the id
// travels from the menu to the API untranslated.
export const EXPORT_FORMAT_IDS = {
  docx: "Docx",
  pdf: "Pdf",
  md: "Md",
} as const satisfies Record<string, AiExportFormat>;

// File extension produced by each format.
export const EXTENSION_BY_FORMAT: Record<AiExportFormat, string> = {
  Docx: "docx",
  Pdf: "pdf",
  Md: "md",
};

const isExportFormat = (value: string): value is AiExportFormat =>
  value in EXTENSION_BY_FORMAT;

export const extensionOf = (name: string) =>
  name.slice(name.lastIndexOf(".") + 1).toLowerCase();

export const stripExt = (name: string, ext: string) =>
  new RegExp(`\\.${ext}$`, "i").test(name)
    ? name.slice(0, -(ext.length + 1))
    : name;

// What the user picked in the "Export to…" submenu. `format` is absent for the
// plain save action (a single message's download button), which always asks
// for the extension in `defaultName` — so that extension is the fallback, and
// docx the last resort, matching the endpoint's own default.
export const resolveFormat = (
  format: string | undefined,
  defaultName: string,
): AiExportFormat => {
  if (format && isExportFormat(format)) return format;

  const ext = extensionOf(defaultName);
  const byExtension = (
    Object.entries(EXTENSION_BY_FORMAT) as [AiExportFormat, string][]
  ).find(([, value]) => value === ext);

  return byExtension?.[0] ?? "Docx";
};
