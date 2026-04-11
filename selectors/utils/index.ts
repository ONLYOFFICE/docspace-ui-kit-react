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
import { getBrandName } from "@docspace/shared/constants/brands";

export const convertRoomsToItems = (
  rooms: FolderDtoInteger[],
  t?: (key: string, interpolation?: Record<string, string | number>) => string,
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
