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
