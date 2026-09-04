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

