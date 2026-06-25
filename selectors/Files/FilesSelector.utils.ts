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

import { ApplyFilterOption, FilterType } from "@onlyoffice/docspace-api-sdk";
import { FilesSelectorFilterTypes } from "../../enums";
import { TEMPLATE_GALLERY_FORMATS } from "../../constants";

export const getFilterParams = (
  filterParam: string | number,
  extsWebEdited: string[],
  applyFilterOption?: ApplyFilterOption,
): {
  filterType?: FilterType;
  extension?: string;
  applyFilterOption?: ApplyFilterOption;
} => {
  const result: {
    filterType?: FilterType;
    extension?: string;
    applyFilterOption?: ApplyFilterOption;
  } = {
    applyFilterOption: applyFilterOption,
  };

  switch (filterParam) {
    case FilesSelectorFilterTypes.DOCX:
      result.extension = FilesSelectorFilterTypes.DOCX;
      break;

    case FilesSelectorFilterTypes.IMG:
      result.filterType = FilterType.ImagesOnly;
      break;

    case FilesSelectorFilterTypes.BackupOnly:
      result.extension = "gz,tar";
      break;

    case FilesSelectorFilterTypes.XLSX:
      result.extension = FilesSelectorFilterTypes.XLSX;
      break;

    case FilesSelectorFilterTypes.PDF:
    case FilterType.Pdf:
      result.filterType = FilterType.Pdf;
      break;

    case FilterType.DocumentsOnly:
      result.filterType = FilterType.DocumentsOnly;
      break;

    case FilterType.DiagramsOnly:
      result.filterType = FilterType.DiagramsOnly;
      break;

    case FilesSelectorFilterTypes.PDFForm:
    case FilterType.PdfForm:
      result.filterType = FilterType.PdfForm;
      break;

    case FilesSelectorFilterTypes.PPTX:
      result.extension = FilesSelectorFilterTypes.PPTX;
      break;

    case FilterType.PresentationsOnly:
      result.filterType = FilterType.PresentationsOnly;
      break;

    case FilterType.SpreadsheetsOnly:
      result.filterType = FilterType.SpreadsheetsOnly;
      break;

    case FilterType.ImagesOnly:
      result.filterType = FilterType.ImagesOnly;
      break;

    case FilterType.MediaOnly:
      result.filterType = FilterType.MediaOnly;
      break;

    case FilterType.ArchiveOnly:
      result.filterType = FilterType.ArchiveOnly;
      break;

    case FilterType.FoldersOnly:
      result.filterType = FilterType.FoldersOnly;
      break;

    case FilterType.FilesOnly:
      result.filterType = FilterType.FilesOnly;
      break;

    case FilesSelectorFilterTypes.ALL:
      result.applyFilterOption = ApplyFilterOption.All;
      result.filterType = FilterType.None;
      break;

    case "EditorSupportedTypes":
      result.extension = extsWebEdited
        .map((extension) => extension.slice(1))
        .join(",");
      break;

    case "TemplateGalleryTypes":
      result.extension = TEMPLATE_GALLERY_FORMATS.map((extension) =>
        extension.slice(1),
      ).join(",");
      break;

    default:
      result.extension = filterParam.toString();
      break;
  }

  return result;
};

