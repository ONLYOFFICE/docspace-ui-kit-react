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
  type FolderDtoInteger,
  type FileEntryDtoIntegerAllOfSecurity,
  FolderType,
} from "@onlyoffice/docspace-api-sdk";

import type { TSelectorItem } from "../../components/selector";

export const convertToItems = (
  folders: FolderDtoInteger[],
  disableBySecurity?: string,
) => {
  const items: TSelectorItem[] = folders.map((folder) => {
    const {
      id,
      title,
      roomType,
      logo,
      shared,
      parentId,
      filesCount,
      foldersCount,
      rootFolderType,
      security,

      denyDownload,
      indexing,
      lifetime,
      watermark,
      tags,
      quotaLimit,
    } = folder;

    const logoProps = { icon: "", color: "", iconOriginal: "" };

    if (logo) {
      logoProps.icon = logo.medium ?? "";
      logoProps.color = logo.color ?? "";
      logoProps.iconOriginal = logo.original ?? "";
    }

    const logoCover = logo?.cover;
    const cover = logoCover
      ? { data: logoCover.data ?? "", id: logoCover.id ?? "" }
      : undefined;
    const isTemplate = rootFolderType === FolderType.RoomTemplates;

    const isDisabledBySecurity = disableBySecurity
      ? !security?.[disableBySecurity as keyof FileEntryDtoIntegerAllOfSecurity]
      : false;

    return {
      id,
      label: title ?? "",
      ...logoProps,
      roomType: roomType as NonNullable<typeof roomType>,
      shared: shared ?? false,
      isFolder: true as const,
      parentId: parentId as NonNullable<typeof parentId>,
      filesCount: filesCount ?? 0,
      foldersCount: foldersCount ?? 0,
      rootFolderType: rootFolderType as NonNullable<typeof rootFolderType>,
      security: security as NonNullable<typeof security>,
      cover,
      isTemplate,
      logo,

      title: title ?? undefined,
      denyDownload,
      indexing,
      lifetime,
      watermark,
      tags: tags ?? undefined,
      quotaLimit,
      isDisabled: isDisabledBySecurity,
    };
  });

  return items;
};
