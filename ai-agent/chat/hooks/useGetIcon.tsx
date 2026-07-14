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

import React from "react";

import type { FilesSettingsDto } from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../../providers/api/ApiProvider";
import { presentInArray } from "../../../utils/presentInArray";
import {
  iconSize24,
  iconSize32,
  iconSize64,
  iconSize96,
} from "../../../utils/image-helpers";
import { HTML_EXST, EBOOK_EXST } from "../../../constants";
import { toastr, type TData } from "../../../components/toast";

import type { TGetIcon } from "../../../types";

const IconSizes: Record<
  number,
  Map<string, React.FC<React.SVGProps<SVGSVGElement>>>
> = {
  24: iconSize24,
  32: iconSize32,
  64: iconSize64,
  96: iconSize96,
};

const useGetIcon = (getIconProp?: TGetIcon) => {
  const { filesSettingsApi } = useApi();
  const [filesSettings, setFilesSettings] = React.useState<
    FilesSettingsDto | undefined
  >(undefined);
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
    if (!getIconProp) {
      getFileSettings();
    }
  }, [getFileSettings, getIconProp]);

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

  const builtInGetIcon = React.useCallback(
    (size = 32, fileExst: string) => {
      if (!filesSettings) return null;

      const path = determineIconPath(fileExst);

      const iconSize = IconSizes[size] ?? iconSize32;

      return iconSize.get(path) ?? iconSize.get("file.svg") ?? null;
    },
    [filesSettings, determineIconPath],
  );

  const getIcon = React.useMemo(() => {
    if (getIconProp) return getIconProp;
    return builtInGetIcon;
  }, [getIconProp, builtInGetIcon]);

  return { getIcon, isLoading };
};

export default useGetIcon;
