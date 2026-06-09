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
import type {
  FileDtoInteger,
  FolderDtoInteger,
  FolderType,
  FileEntryDtoIntegerAllOfSecurity,
} from "@onlyoffice/docspace-api-sdk";
import { RoomType } from "@onlyoffice/docspace-api-sdk";

import { getCommonTranslation } from "../../utils/i18n";
import {
  getIconPathByFolderType,
  getLifetimePeriodTranslation,
} from "../../utils/common";
import { iconSize32 } from "../../utils/image-helpers";
import { getTitleWithoutExtension } from "../../utils/getTitleWithoutExtension";

import type { TSelectorItem } from "../../components/selector";

import { DEFAULT_FILE_EXTS } from "./constants";
import { getBrandName } from "../../constants/brands";

export const convertRoomsToItems = (
  rooms: FolderDtoInteger[],
  t?: (key: string, interpolation?: Record<string, string | number>) => string,
  isRoomDisabled?: (room: FolderDtoInteger) => boolean,
): TSelectorItem[] => {
  const translate = t ?? getCommonTranslation;
  const items = rooms.map((room) => {
    const {
      id,
      title,
      roomType,
      logo,
      filesCount,
      foldersCount,
      security,
      parentId,
      rootFolderType,
      shared,
      lifetime,
      quotaLimit,
      private: isPrivate,
    } = room;

    const icon = logo?.medium || "";
    const cover = logo?.cover;

    const iconProp = icon ? { icon } : { color: logo?.color as string };

    const lifetimeTooltip = lifetime
      ? translate("RoomFilesLifetime", {
          days: String(lifetime.value),
          period: getLifetimePeriodTranslation(lifetime.period!, t),
        })
      : null;

    return {
      id,
      label: title ?? "",
      title,
      filesCount: filesCount ?? 0,
      foldersCount: foldersCount ?? 0,
      security: security!,
      parentId: parentId ?? 0,
      rootFolderType: rootFolderType ?? 0,
      isFolder: true as const,
      roomType: roomType as RoomType,
      shared: shared ?? false,
      lifetimeTooltip,
      cover,
      disableMultiSelect: true,
      isDisabled: isRoomDisabled ? isRoomDisabled(room) : false,
      private: isPrivate ?? false,

      quotaLimit,
      ...iconProp,
    } as unknown as TSelectorItem;
  });

  return items;
};

export const convertFilesToItems: (
  files: FileDtoInteger[],
  getIcon: (
    fileExst: string,
  ) => React.FC<React.SVGProps<SVGSVGElement>> | string | null,
  filterParam?: string | number,
  includedItems?: (number | string)[],
  disableBySecurity?: string,
) => TSelectorItem[] = (
  files: FileDtoInteger[],
  getIcon: (
    fileExst: string,
  ) => React.FC<React.SVGProps<SVGSVGElement>> | string | null,
  filterParam?: string | number,
  includedItems?: (number | string)[],
  disableBySecurity?: string,
) => {
  const items = files.map((file) => {
    const {
      id,
      title,
      security,
      folderId,
      rootFolderType,
      fileExst,
      fileType,
      viewUrl,
    } = file;

    const icon = getIcon(fileExst || DEFAULT_FILE_EXTS);
    const label = getTitleWithoutExtension(
      { title: title ?? undefined, fileExst: fileExst ?? "" },
      false,
    );

    const isDisabled = includedItems?.length
      ? !includedItems.includes(id!)
      : false;

    const isDisabledBySecurity = disableBySecurity
      ? !security?.[disableBySecurity as keyof FileEntryDtoIntegerAllOfSecurity]
      : false;

    return {
      id,
      label,
      title,
      icon,
      security,
      parentId: folderId,
      rootFolderType,
      isDisabled: !filterParam || isDisabled || isDisabledBySecurity,
      fileExst,
      fileType,
      // isForm isn't declared on the SDK file DTO yet, but the backend returns
      // it for PDF forms — surface it so consumers (e.g. chat) can detect forms.
      isForm: (file as { isForm?: boolean }).isForm,
      viewUrl,
    } as TSelectorItem;
  });
  return items;
};

const isDisableFolder = (
  folder: FolderDtoInteger,
  disabledItems: (number | string)[],
  filterParam?: string | number,
) => {
  return filterParam ? false : disabledItems?.includes(folder.id!);
};

export const convertFoldersToItems: (
  folders: FolderDtoInteger[],
  disabledItems: (number | string)[],
  filterParam?: string | number,
  disabledFolderType?: FolderType,
) => TSelectorItem[] = (
  folders: FolderDtoInteger[],
  disabledItems: (number | string)[],
  filterParam?: string | number,
  disabledFolderType?: FolderType,
) => {
  const items = folders.map((folder: FolderDtoInteger) => {
    const {
      id,
      title,
      filesCount,
      foldersCount,
      security,
      parentId,
      type,
      rootFolderType,
    } = folder;

    const folderIconPath = getIconPathByFolderType(type);
    const icon = iconSize32.get(folderIconPath);

    const isDisabled =
      isDisableFolder(folder, disabledItems, filterParam) ||
      (disabledFolderType ? type === disabledFolderType : false);

    return {
      id,
      label: title ?? "",
      title,
      icon,
      filesCount: filesCount ?? 0,
      foldersCount: foldersCount ?? 0,
      security: security!,
      parentId: parentId ?? 0,
      rootFolderType: rootFolderType ?? 0,
      isFolder: true,
      isDisabled,
      disableMultiSelect: true,
    } as TSelectorItem;
  });

  return items;
};

export const getDefaultBreadCrumb = (t: (key: string) => string) => {
  return {
    label: getBrandName("ProductName"),
    id: 0,
    isRoom: false,
  };
};
