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

import React from "react";

import type { FilesSettingsDto } from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../../providers/api/ApiProvider";
import { presentInArray } from "../../../utils/presentInArray";
import {
  iconSize32,
  iconSize64,
  iconSize96,
} from "../../../utils/image-helpers";
import { HTML_EXST, EBOOK_EXST } from "../../../constants";
import { toastr, type TData } from "../../../components/toast";

import type { TGetIcon } from "../types";

const IconSizes: Record<
  number,
  Map<string, React.FC<React.SVGProps<SVGSVGElement>>>
> = {
  32: iconSize32,
  64: iconSize64,
  96: iconSize96,
};

const useFilesSettings = (
  getIconProp?: TGetIcon,
  settings?: FilesSettingsDto,
) => {
  const { filesSettingsApi } = useApi();
  const [filesSettings, setFilesSettings] = React.useState<
    FilesSettingsDto | undefined
  >(settings);
  const [isLoading, setIsLoading] = React.useState(false);

  const getFileSettings = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await filesSettingsApi.getFilesSettings();

      setFilesSettings(res.data.response);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      toastr.error(e as TData);
    }
  }, [filesSettingsApi]);

  React.useEffect(() => {
    if (!settings) getFileSettings();
  }, [getFileSettings, settings]);

  const isArchive = React.useCallback(
    (extension: string) =>
      presentInArray(filesSettings?.extsArchive ?? [], extension),
    [filesSettings?.extsArchive],
  );

  const isImage = React.useCallback(
    (extension: string) =>
      presentInArray(filesSettings?.extsImage ?? [], extension),
    [filesSettings?.extsImage],
  );

  const isSound = React.useCallback(
    (extension: string) =>
      presentInArray(filesSettings?.extsAudio ?? [], extension),
    [filesSettings?.extsAudio],
  );

  const isHtml = React.useCallback(
    (extension: string) => presentInArray(HTML_EXST, extension),
    [],
  );

  const isEbook = React.useCallback(
    (extension: string) => presentInArray(EBOOK_EXST, extension),
    [],
  );

  const determineIconPath = React.useCallback(
    (fileExst: string): string => {
      if (isArchive(fileExst)) return "archive.svg";
      if (isImage(fileExst)) return "image.svg";
      if (isSound(fileExst)) return "sound.svg";
      if (isHtml(fileExst)) return "html.svg";
      if (isEbook(fileExst)) return "ebook.svg";
      return `${fileExst.replace(/^\./, "")}.svg`;
    },
    [isArchive, isImage, isSound, isHtml, isEbook],
  );

  const getIcon = React.useCallback(
    (
      fileExst: string,
      size = 32,
    ): React.FC<React.SVGProps<SVGSVGElement>> | null => {
      if (getIconProp) return getIconProp(size, fileExst) ?? null;
      if (!filesSettings) return null;

      const path = determineIconPath(fileExst);

      const iconSize = IconSizes[size] ?? iconSize32;

      return iconSize.get(path) ?? iconSize.get("file.svg") ?? null;
    },
    [filesSettings, getIconProp, determineIconPath],
  );

  return {
    getIcon,
    extsWebEdited: filesSettings?.extsWebEdited,
    isLoading,
    displayFileExtension: filesSettings?.displayFileExtension,
  };
};

export default useFilesSettings;
