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

import {
  ApplyFilterOption,
  FilterType,
} from "@onlyoffice/docspace-api-sdk";
import {
  FilesSelectorFilterTypes,
} from "../../enums";
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
    applyFilterOption: applyFilterOption ?? ApplyFilterOption.Files,
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
