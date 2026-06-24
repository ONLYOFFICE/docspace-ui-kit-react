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
import type {
  FolderType,
  RoomType,
  FolderDtoInteger,
  FileEntryDtoIntegerAllOfSecurity,
  SearchArea,
} from "@onlyoffice/docspace-api-sdk";

import type { TSelectorItem, TBreadCrumb } from "../../../components/selector";

export type TUseInputItemHelper = {
  withCreate?: boolean;
  selectedItemId?: string | number | undefined;
  setItems?: React.Dispatch<React.SetStateAction<TSelectorItem[]>>;
};

export type TGetIcon = (
  size: number,
  fileExst: string,
) => React.FC<React.SVGProps<SVGSVGElement>> | string | null;

export type UseRoomsHelperProps = TUseInputItemHelper & {
  isAgent?: boolean;
  searchValue?: string;
  searchArea?: SearchArea | string;
  disableThirdParty?: boolean;
  isRoomsOnly: boolean;
  roomType?: RoomType | RoomType[];
  formsSection?: boolean;
  excludeItems?: (number | string | undefined)[];
  isInit: boolean;
  createDefineRoomLabel?: string;
  createDefineRoomType?: RoomType;
  onSetBaseFolderPath?: (
    value: number | string | undefined | TBreadCrumb[],
  ) => void;
  getRootData?: () => Promise<void>;
  subscribe: (id: number) => void;
  withInit?: boolean;
  setIsInit: (value: boolean) => void;
  setBreadCrumbs?: React.Dispatch<React.SetStateAction<TBreadCrumb[]>>;
  setHasNextPage: (value: boolean) => void;
  setTotal: (value: number) => void;
  setIsRoot?: (value: boolean) => void;
  setSelectedItemType?: React.Dispatch<
    React.SetStateAction<"rooms" | "files" | "agents" | undefined>
  >;
  setSelectedItemSecurity?: React.Dispatch<
    React.SetStateAction<FileEntryDtoIntegerAllOfSecurity | undefined>
  >;
  setSelectedTreeNode?: React.Dispatch<React.SetStateAction<FolderDtoInteger>>;
  isRoomDisabled?: (room: FolderDtoInteger) => boolean;
  recentFolder?: FolderDtoInteger | null;
  favoritesFolder?: FolderDtoInteger | null;
  withRecentTreeFolder?: boolean;
  withFavoritesTreeFolder?: boolean;
  roomsFolderId?: number;
};

export type UseAgentsHelperProps = TUseInputItemHelper & {
  searchValue?: string;
  // isRoomsOnly: boolean;
  excludeItems?: (number | string | undefined)[];
  isInit: boolean;
  createDefineLabel?: string;
  onSetBaseFolderPath?: (
    value: number | string | undefined | TBreadCrumb[],
  ) => void;
  getRootData?: () => Promise<void>;
  subscribe: (id: number) => void;
  withInit?: boolean;
  setIsInit: (value: boolean) => void;
  setBreadCrumbs?: React.Dispatch<React.SetStateAction<TBreadCrumb[]>>;
  setHasNextPage: (value: boolean) => void;
  setTotal: (value: number) => void;
  setIsRoot?: (value: boolean) => void;
  setSelectedItemType?: React.Dispatch<
    React.SetStateAction<"rooms" | "files" | "agents" | undefined>
  >;
  setSelectedItemSecurity?: React.Dispatch<
    React.SetStateAction<FileEntryDtoIntegerAllOfSecurity | undefined>
  >;
  setSelectedTreeNode?: React.Dispatch<React.SetStateAction<FolderDtoInteger>>;
  disableBySecurity?: string;
  recentFolder?: FolderDtoInteger | null;
  favoritesFolder?: FolderDtoInteger | null;
  withRecentTreeFolder?: boolean;
  withFavoritesTreeFolder?: boolean;
};

export type UseSocketHelperProps = {
  setItems: React.Dispatch<React.SetStateAction<TSelectorItem[]>>;
  setBreadCrumbs?: React.Dispatch<React.SetStateAction<TBreadCrumb[]>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  disabledItems: (string | number)[];
  disabledFolderType?: FolderType;
  filterParam?: string | number;
  withCreate?: boolean;
  disableBySecurity?: string;
  isRoomDisabled?: (room: FolderDtoInteger) => boolean;
};
