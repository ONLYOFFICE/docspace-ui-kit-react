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

import { FolderType } from "@onlyoffice/docspace-api-sdk";
import { EmployeeType, RoomsType } from "../../enums";
import { AvatarRole } from "../../components/avatar/Avatar.enums";
import { getCommonTranslation } from "../i18n";
import { getBrandName } from "../../constants/brands";

export type TTranslation = (
  key: string,
  params?: Record<string, unknown>,
) => string;

const defaultTranslation: TTranslation = (key, params) => {
  const keyParts = key.split(":");
  const translationKey = keyParts.length > 1 ? keyParts[1] : key;

  let result = getCommonTranslation(translationKey);

  if (!result) return key;

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      result = result.replace(
        new RegExp(`{{${paramKey}}}`, "g"),
        String(paramValue),
      );
    }
  }

  return result;
};

export const getUserTypeTranslation = (
  type: EmployeeType,
  t?: TTranslation,
) => {
  const translate = t ?? defaultTranslation;

  switch (type) {
    case EmployeeType.Owner:
      return translate("Common:Owner");
    case EmployeeType.Admin:
      return translate("Common:PortalAdmin", {
        productName: getBrandName("ProductName"),
      });
    case EmployeeType.RoomAdmin:
      return translate("Common:RoomAdmin");
    case EmployeeType.User:
      return translate("Common:User");
    case EmployeeType.Guest:
    default:
      return translate("Common:Guest");
  }
};

export const RoomsTypeValues = Object.values(RoomsType).filter(
  (item): item is number =>
    typeof item === "number" && item !== RoomsType.AIRoom,
);

export const RoomsTypes = RoomsTypeValues.reduce<Record<number, number>>(
  (acc, current) => {
    if (typeof current === "string") return { ...acc };
    return { ...acc, [current]: current };
  },
  {},
);

export const isManagement = () => {
  return window.location.pathname.includes("management");
};

export const getUserAvatarRoleByType = (type: EmployeeType) => {
  switch (type) {
    case EmployeeType.Owner:
      return AvatarRole.owner;
    case EmployeeType.Admin:
      return AvatarRole.admin;
    case EmployeeType.RoomAdmin:
      return AvatarRole.manager;
    default:
      return AvatarRole.user;
  }
};

type TUserLike = {
  isOwner?: boolean;
  isAdmin?: boolean;
  isRoomAdmin?: boolean;
  isCollaborator?: boolean;
  isVisitor?: boolean;
  listAdminModules?: string[] | null;
};

export const getUserType = (user: TUserLike) => {
  if (user.isOwner) return EmployeeType.Owner;
  if (
    user.isAdmin ||
    (user.listAdminModules && user.listAdminModules.length > 0)
  )
    return EmployeeType.Admin;
  if (user.isRoomAdmin) return EmployeeType.RoomAdmin;
  if (user.isCollaborator) return EmployeeType.User;
  if (user.isVisitor) return EmployeeType.Guest;
  return EmployeeType.Guest;
};

export const getLifetimePeriodTranslation = (
  period: number,
  t?: (key: string, interpolation?: Record<string, string | number>) => string,
) => {
  const translate = t ?? getCommonTranslation;
  switch (period) {
    case 0:
      return translate("Common:Days").toLowerCase();
    case 1:
      return translate("Common:Months").toLowerCase();
    case 2:
      return translate("Common:Years").toLowerCase();
    default:
      return translate("Common:Days").toLowerCase();
  }
};

type FolderTypeValueOf = (typeof FolderType)[keyof typeof FolderType];

export const getIconPathByFolderType = (
  folderType?: FolderTypeValueOf,
): string => {
  const defaultPath = "folder.svg";

  const folderIconPath: Partial<Record<FolderTypeValueOf, string>> = {
    [FolderType.ReadyFormFolder]: "folderComplete.svg",
    [FolderType.InProcessFormFolder]: "folderInProgress.svg",
    [FolderType.DEFAULT]: defaultPath,
  };

  return folderIconPath[folderType ?? FolderType.DEFAULT] ?? defaultPath;
};
