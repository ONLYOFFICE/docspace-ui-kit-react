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

// ONLYOFFICE c_oAscFileType codes — the scheme the AI chat widget's
// `FileItem` uses to pick an icon (see `getFileIconName` in the library:
// isDocument/isPresentation/isSpreadsheet check category bits 6/7/8; PDF /
// DjVu / XPS / PdfForm are exact constants; Visio uses bit 14).
//
// The widget reads `attachment.type` returned by the server. Until the C#
// `AttachmentDto` echoes a real `Type`, we backfill from the value the
// caller supplied on input (see `HttpAttachmentsStorage.createMany`). So
// what we send here lands directly on the chip.
//
// The host's own `FileType` enum (Unknown=0…Diagram=11) is a category-only
// scheme and is not compatible with this map — never pass it through as
// `type`.
const EXT_TO_CODE: Record<string, number> = {
  // Documents (category bit 6 = 64)
  doc: 66,
  docx: 65,
  docm: 75,
  dotx: 76,
  dotm: 77,
  odt: 67,
  ott: 79,
  fodt: 78,
  rtf: 68,
  txt: 69,
  mht: 71,
  html: 70,
  htm: 70,
  xml: 70,
  epub: 72,
  fb2: 73,
  mobi: 74,
  docxf: 83,
  oform: 84,
  md: 69,
  // Presentations (bit 7 = 128)
  ppt: 130,
  pptx: 129,
  pptm: 134,
  ppsx: 132,
  ppsm: 133,
  potx: 135,
  potm: 136,
  odp: 131,
  otp: 138,
  fodp: 137,
  // Spreadsheets (bit 8 = 256)
  xls: 258,
  xlsx: 257,
  xlsm: 261,
  xltx: 262,
  xltm: 263,
  ods: 259,
  ots: 265,
  fods: 264,
  csv: 260,
  // PDF family (exact codes — predicates compare to literals)
  pdf: 513,
  djvu: 515,
  djv: 515,
  xps: 516,
  oxps: 516,
  // Visio (bit 14 = 16384)
  vsd: 16385,
  vsdx: 16385,
  vsdm: 16391,
  vss: 16387,
  vssx: 16387,
  vssm: 16393,
  vst: 16389,
  vstx: 16389,
  vstm: 16395,
};

const extOf = (titleOrExt: string): string => {
  const dot = titleOrExt.lastIndexOf(".");
  return (dot >= 0 ? titleOrExt.slice(dot + 1) : titleOrExt).toLowerCase();
};

export const getOnlyofficeFileType = (titleOrExt: string): number =>
  EXT_TO_CODE[extOf(titleOrExt)] ?? 0;
