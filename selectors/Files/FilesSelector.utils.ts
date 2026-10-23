import { ApplyFilterOption, FilterType } from "@onlyoffice/docspace-api-sdk";
import type { FileDtoInteger } from "@onlyoffice/docspace-api-sdk";
import { FilesSelectorFilterTypes } from "../../enums";
import { TEMPLATE_GALLERY_FORMATS } from "../../constants";
import type { TSelectorItem } from "../../components/selector";
import { getTitleWithoutExtension } from "../../utils/getTitleWithoutExtension";
import type { TFilesSelectorFile } from "./FilesSelector.types";

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

/** A file of the server's folder listing, as the host callbacks see it. */
export const toSelectorFile = (file: FileDtoInteger): TFilesSelectorFile => ({
  id: file.id!,
  title: file.title ?? "",
  fileExst: file.fileExst ?? undefined,
  encrypted: file.encrypted ?? undefined,
  viewUrl: file.viewUrl ?? undefined,
});

/**
 * The rows with the titles `resolveItemTitle` supplies for files. Folders,
 * rooms and files it leaves undefined keep their own titles.
 */
export const applyResolvedTitles = (
  items: TSelectorItem[],
  resolveItemTitle?: (file: TFilesSelectorFile) => string | undefined,
): TSelectorItem[] => {
  if (!resolveItemTitle) return items;

  return items.map((item) => {
    if (item.isFolder || item.fileExst === undefined) return item;

    const title = (item as { title?: string }).title ?? item.label;
    const resolved = resolveItemTitle({
      id: item.id!,
      title,
      fileExst: item.fileExst,
      encrypted: item.encrypted,
      viewUrl: item.viewUrl,
    });
    if (!resolved || resolved === title) return item;

    return {
      ...item,
      title: resolved,
      label: getTitleWithoutExtension(
        { title: resolved, fileExst: item.fileExst },
        false,
      ),
    } as TSelectorItem;
  });
};
