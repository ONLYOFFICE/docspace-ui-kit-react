import type React from "react";

import { iconsMap as iconsStaticMap } from "./icons-map";

enum IconNames {
  Word = "word.svg",
  WordCommon = "wordCommon.svg",
  Cell = "cell.svg",
  CellCommon = "cellCommon.svg",
  Diagram = "diagram.svg",
  Slide = "slide.svg",
  SlideCommon = "slideCommon.svg",
  Pdf = "pdf.svg",
  Form = "form.svg",
  Archive = "archive.svg",
  Calendar = "calendar.svg",
  Ebook = "ebook.svg",
  Html = "html.svg",
  Image = "image.svg",
  Letter = "letter.svg",
  Sound = "sound.svg",
  Text = "text.svg",
  Video = "video.svg",
  File = "file.svg",
  Folder = "folder.svg",
  FolderComplete = "folderComplete.svg",
  FolderInProgress = "folderInProgress.svg",
  CustomRoom = "room/custom.svg",
  EditingRoom = "room/editing.svg",
  FormRoom = "room/form.svg",
  PublicRoom = "room/public.svg",
  VirtualRoom = "room/virtual-data.svg",
  ArchiveRoom = "room/archive.svg",
  AIRoom = "room/ai.svg",
}

const iconsMap: Record<IconNames, string[]> = {
  [IconNames.Word]: [".docx", ".dotx", ".docm", ".dotm"],
  [IconNames.WordCommon]: [
    ".fodt",
    ".doc",
    ".ott",
    ".odt",
    ".rtf",
    ".stw",
    ".sxw",
    ".wps",
    ".wpt",
    ".pages",
    ".hwp",
    ".hwpx",
  ],
  [IconNames.Cell]: [".xlsx", ".xltx", ".xlsb", ".xltm", ".xlsm"],
  [IconNames.CellCommon]: [
    ".xls",
    ".ods",
    ".csv",
    ".fods",
    ".et",
    ".ett",
    ".ots",
    ".sxc",
    ".numbers",
  ],
  [IconNames.Diagram]: [".vsdx", ".vssx", ".vstx", ".vsdm", ".vssm", ".vstm"],
  [IconNames.Slide]: [".pptx", ".potx", ".ppsx", ".pptm", ".ppsm", ".potm"],
  [IconNames.SlideCommon]: [
    ".ppt",
    ".odp",
    ".otp",
    ".pps",
    ".fodp",
    ".dps",
    ".dpt",
    ".sxi",
    ".pot",
    ".key",
    ".odg",
  ],
  [IconNames.Pdf]: [".pdf"],
  [IconNames.Form]: [".docxf", ".oform"],
  [IconNames.Archive]: ["archive"],
  [IconNames.Calendar]: [".ics"],
  [IconNames.Ebook]: ["ebook"],
  [IconNames.Html]: ["html", ".xps", ".md", ".xml", ".oxps"],
  [IconNames.Letter]: [".iaf"],
  [IconNames.Text]: [".txt"],
  [IconNames.Video]: [
    ".3gp",
    ".asf",
    ".avi",
    ".f4v",
    ".fla",
    ".flv",
    ".m2ts",
    ".m4v",
    ".mkv",
    ".mov",
    ".mp4",
    ".mpeg",
    ".mpg",
    ".mts",
    ".ogv",
    ".svi",
    ".vob",
    ".webm",
    ".wmv",
  ],
  [IconNames.Image]: ["image"],
  [IconNames.Sound]: ["sound"],
  [IconNames.File]: ["file"],
  [IconNames.Folder]: ["folder"],
  [IconNames.FolderComplete]: ["folderComplete"],
  [IconNames.FolderInProgress]: ["folderInProgress"],
  [IconNames.CustomRoom]: ["customRoom"],
  [IconNames.AIRoom]: ["aiRoom"],
  [IconNames.EditingRoom]: ["editingRoom"],
  [IconNames.FormRoom]: ["formRoom"],
  [IconNames.PublicRoom]: ["publicRoom"],
  [IconNames.VirtualRoom]: ["virtualRoom"],
  [IconNames.ArchiveRoom]: ["archiveRoom"],
};

const createIconEntries = (icons: Record<string, string[]>) => {
  const all = Object.entries(icons).flatMap(([iconName, formats]) =>
    formats.map((format): [string, string] => [format, iconName]),
  );
  const nonRoom = all.filter(([, iconName]) => !iconName.startsWith("room/"));

  return { all, nonRoom };
};

const { all, nonRoom } = createIconEntries(iconsMap);

const generateMapForSize = (
  size: number,
  entries: [string, string][],
): Map<string, React.FC<React.SVGProps<SVGSVGElement>>> =>
  new Map(
    entries.flatMap(([format, iconName]) => {
      const svg = `${format.replace(/^\./, "")}.svg`;
      const component = iconsStaticMap[size]?.[iconName];

      if (!component) return [];

      return [[svg, component]];
    }),
  );

export const iconSize24 = generateMapForSize(24, nonRoom);
export const iconSize32 = generateMapForSize(32, all);
export const iconSize64 = generateMapForSize(64, nonRoom);
export const iconSize96 = generateMapForSize(96, nonRoom);
