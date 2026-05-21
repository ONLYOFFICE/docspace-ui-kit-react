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

import type React from "react";

// --- size 24 ---
import Archive24 from "../../assets/icons/24/archive.svg";
import Calendar24 from "../../assets/icons/24/calendar.svg";
import Cell24 from "../../assets/icons/24/cell.svg";
import CellCommon24 from "../../assets/icons/24/cellCommon.svg";
import Diagram24 from "../../assets/icons/24/diagram.svg";
import Ebook24 from "../../assets/icons/24/ebook.svg";
import File24 from "../../assets/icons/24/file.svg";
import Folder24 from "../../assets/icons/24/folder.svg";
import FolderComplete24 from "../../assets/icons/24/folderComplete.svg";
import FolderInProgress24 from "../../assets/icons/24/folderInProgress.svg";
import Form24 from "../../assets/icons/24/form.svg";
import Html24 from "../../assets/icons/24/html.svg";
import Image24 from "../../assets/icons/24/image.svg";
import Letter24 from "../../assets/icons/24/letter.svg";
import Pdf24 from "../../assets/icons/24/pdf.svg";
import Slide24 from "../../assets/icons/24/slide.svg";
import SlideCommon24 from "../../assets/icons/24/slideCommon.svg";
import Sound24 from "../../assets/icons/24/sound.svg";
import Text24 from "../../assets/icons/24/text.svg";
import Video24 from "../../assets/icons/24/video.svg";
import Word24 from "../../assets/icons/24/word.svg";
import WordCommon24 from "../../assets/icons/24/wordCommon.svg";

// --- size 32 ---
import Archive32 from "../../assets/icons/32/archive.svg";
import Calendar32 from "../../assets/icons/32/calendar.svg";
import Cell32 from "../../assets/icons/32/cell.svg";
import CellCommon32 from "../../assets/icons/32/cellCommon.svg";
import Diagram32 from "../../assets/icons/32/diagram.svg";
import Ebook32 from "../../assets/icons/32/ebook.svg";
import File32 from "../../assets/icons/32/file.svg";
import Folder32 from "../../assets/icons/32/folder.svg";
import FolderComplete32 from "../../assets/icons/32/folderComplete.svg";
import FolderInProgress32 from "../../assets/icons/32/folderInProgress.svg";
import Form32 from "../../assets/icons/32/form.svg";
import Html32 from "../../assets/icons/32/html.svg";
import Image32 from "../../assets/icons/32/image.svg";
import Letter32 from "../../assets/icons/32/letter.svg";
import Pdf32 from "../../assets/icons/32/pdf.svg";
import Slide32 from "../../assets/icons/32/slide.svg";
import SlideCommon32 from "../../assets/icons/32/slideCommon.svg";
import Sound32 from "../../assets/icons/32/sound.svg";
import Text32 from "../../assets/icons/32/text.svg";
import Video32 from "../../assets/icons/32/video.svg";
import Word32 from "../../assets/icons/32/word.svg";
import WordCommon32 from "../../assets/icons/32/wordCommon.svg";
import RoomAi32 from "../../assets/icons/32/room/ai.svg";
import RoomArchive32 from "../../assets/icons/32/room/archive.svg";
import RoomCustom32 from "../../assets/icons/32/room/custom.svg";
import RoomEditing32 from "../../assets/icons/32/room/editing.svg";
import RoomForm32 from "../../assets/icons/32/room/form.svg";
import RoomPublic32 from "../../assets/icons/32/room/public.svg";
import RoomVirtualData32 from "../../assets/icons/32/room/virtual-data.svg";

// --- size 64 ---
import Archive64 from "../../assets/icons/64/archive.svg";
import Calendar64 from "../../assets/icons/64/calendar.svg";
import Cell64 from "../../assets/icons/64/cell.svg";
import CellCommon64 from "../../assets/icons/64/cellCommon.svg";
import Diagram64 from "../../assets/icons/64/diagram.svg";
import Ebook64 from "../../assets/icons/64/ebook.svg";
import File64 from "../../assets/icons/64/file.svg";
import Folder64 from "../../assets/icons/64/folder.svg";
import FolderComplete64 from "../../assets/icons/64/folderComplete.svg";
import FolderInProgress64 from "../../assets/icons/64/folderInProgress.svg";
import Form64 from "../../assets/icons/64/form.svg";
import Html64 from "../../assets/icons/64/html.svg";
import Image64 from "../../assets/icons/64/image.svg";
import Letter64 from "../../assets/icons/64/letter.svg";
import Pdf64 from "../../assets/icons/64/pdf.svg";
import Slide64 from "../../assets/icons/64/slide.svg";
import SlideCommon64 from "../../assets/icons/64/slideCommon.svg";
import Sound64 from "../../assets/icons/64/sound.svg";
import Text64 from "../../assets/icons/64/text.svg";
import Video64 from "../../assets/icons/64/video.svg";
import Word64 from "../../assets/icons/64/word.svg";
import WordCommon64 from "../../assets/icons/64/wordCommon.svg";

// --- size 96 ---
import Archive96 from "../../assets/icons/96/archive.svg";
import Calendar96 from "../../assets/icons/96/calendar.svg";
import Cell96 from "../../assets/icons/96/cell.svg";
import CellCommon96 from "../../assets/icons/96/cellCommon.svg";
import Diagram96 from "../../assets/icons/96/diagram.svg";
import Ebook96 from "../../assets/icons/96/ebook.svg";
import File96 from "../../assets/icons/96/file.svg";
import Folder96 from "../../assets/icons/96/folder.svg";
import FolderComplete96 from "../../assets/icons/96/folderComplete.svg";
import FolderInProgress96 from "../../assets/icons/96/folderInProgress.svg";
import Form96 from "../../assets/icons/96/form.svg";
import Html96 from "../../assets/icons/96/html.svg";
import Image96 from "../../assets/icons/96/image.svg";
import Letter96 from "../../assets/icons/96/letter.svg";
import Pdf96 from "../../assets/icons/96/pdf.svg";
import Slide96 from "../../assets/icons/96/slide.svg";
import SlideCommon96 from "../../assets/icons/96/slideCommon.svg";
import Sound96 from "../../assets/icons/96/sound.svg";
import Text96 from "../../assets/icons/96/text.svg";
import Video96 from "../../assets/icons/96/video.svg";
import Word96 from "../../assets/icons/96/word.svg";
import WordCommon96 from "../../assets/icons/96/wordCommon.svg";

export type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>;

const nonRoom24: Record<string, SvgComponent> = {
  "archive.svg": Archive24,
  "calendar.svg": Calendar24,
  "cell.svg": Cell24,
  "cellCommon.svg": CellCommon24,
  "diagram.svg": Diagram24,
  "ebook.svg": Ebook24,
  "file.svg": File24,
  "folder.svg": Folder24,
  "folderComplete.svg": FolderComplete24,
  "folderInProgress.svg": FolderInProgress24,
  "form.svg": Form24,
  "html.svg": Html24,
  "image.svg": Image24,
  "letter.svg": Letter24,
  "pdf.svg": Pdf24,
  "slide.svg": Slide24,
  "slideCommon.svg": SlideCommon24,
  "sound.svg": Sound24,
  "text.svg": Text24,
  "video.svg": Video24,
  "word.svg": Word24,
  "wordCommon.svg": WordCommon24,
};

const nonRoom32: Record<string, SvgComponent> = {
  "archive.svg": Archive32,
  "calendar.svg": Calendar32,
  "cell.svg": Cell32,
  "cellCommon.svg": CellCommon32,
  "diagram.svg": Diagram32,
  "ebook.svg": Ebook32,
  "file.svg": File32,
  "folder.svg": Folder32,
  "folderComplete.svg": FolderComplete32,
  "folderInProgress.svg": FolderInProgress32,
  "form.svg": Form32,
  "html.svg": Html32,
  "image.svg": Image32,
  "letter.svg": Letter32,
  "pdf.svg": Pdf32,
  "slide.svg": Slide32,
  "slideCommon.svg": SlideCommon32,
  "sound.svg": Sound32,
  "text.svg": Text32,
  "video.svg": Video32,
  "word.svg": Word32,
  "wordCommon.svg": WordCommon32,
};

const nonRoom64: Record<string, SvgComponent> = {
  "archive.svg": Archive64,
  "calendar.svg": Calendar64,
  "cell.svg": Cell64,
  "cellCommon.svg": CellCommon64,
  "diagram.svg": Diagram64,
  "ebook.svg": Ebook64,
  "file.svg": File64,
  "folder.svg": Folder64,
  "folderComplete.svg": FolderComplete64,
  "folderInProgress.svg": FolderInProgress64,
  "form.svg": Form64,
  "html.svg": Html64,
  "image.svg": Image64,
  "letter.svg": Letter64,
  "pdf.svg": Pdf64,
  "slide.svg": Slide64,
  "slideCommon.svg": SlideCommon64,
  "sound.svg": Sound64,
  "text.svg": Text64,
  "video.svg": Video64,
  "word.svg": Word64,
  "wordCommon.svg": WordCommon64,
};

const nonRoom96: Record<string, SvgComponent> = {
  "archive.svg": Archive96,
  "calendar.svg": Calendar96,
  "cell.svg": Cell96,
  "cellCommon.svg": CellCommon96,
  "diagram.svg": Diagram96,
  "ebook.svg": Ebook96,
  "file.svg": File96,
  "folder.svg": Folder96,
  "folderComplete.svg": FolderComplete96,
  "folderInProgress.svg": FolderInProgress96,
  "form.svg": Form96,
  "html.svg": Html96,
  "image.svg": Image96,
  "letter.svg": Letter96,
  "pdf.svg": Pdf96,
  "slide.svg": Slide96,
  "slideCommon.svg": SlideCommon96,
  "sound.svg": Sound96,
  "text.svg": Text96,
  "video.svg": Video96,
  "word.svg": Word96,
  "wordCommon.svg": WordCommon96,
};

export const iconsMap: Record<number, Record<string, SvgComponent>> = {
  24: nonRoom24,
  32: {
    ...nonRoom32,
    "room/ai.svg": RoomAi32,
    "room/archive.svg": RoomArchive32,
    "room/custom.svg": RoomCustom32,
    "room/editing.svg": RoomEditing32,
    "room/form.svg": RoomForm32,
    "room/public.svg": RoomPublic32,
    "room/virtual-data.svg": RoomVirtualData32,
  },
  64: nonRoom64,
  96: nonRoom96,
};
