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

import React, { use } from "react";

import type { TBreadCrumb, TSelectorItem } from "../../../components/selector";
import {
  FolderType,
  type FolderDtoInteger,
  type FileDtoInteger,
  type FileEntryDtoIntegerAllOfSecurity,
  type FileType,
} from "@onlyoffice/docspace-api-sdk";
import { useCommonTranslation } from "../../../utils/i18n";

import type {
  FilesSelectorProps,
  TFilesSelectorInit,
} from "../FilesSelector.types";
import {
  convertFoldersToItems,
  convertRoomsToItems,
  convertFilesToItems,
} from "../../utils";
import { SettingsContext } from "../../utils/contexts/Settings";

type UseSelectorStateProps = Pick<
  FilesSelectorProps,
  | "checkCreating"
  | "filterParam"
  | "disabledItems"
  | "withCreate"
  | "disableBySecurity"
>;

const transformInitItems = (
  items: (FolderDtoInteger | FileDtoInteger)[],
  disabledItems: (string | number)[],
  withCreate: boolean,
  getIcon: (
    fileExst: string,
    size?: number,
  ) => React.FC<React.SVGProps<SVGSVGElement>> | string | null,
  t: (key: string) => string,
  initSelectedItemType?: string,
  filterParam?: string | number,
  disableBySecurity?: string,
) => {
  const rooms = convertRoomsToItems(
    items.filter(
      (item) => "roomType" in item && item.roomType,
    ) as FolderDtoInteger[],
    t,
  );
  const folders = convertFoldersToItems(
    items.filter(
      (item) => "parentId" in item && item.parentId && !item.roomType,
    ) as FolderDtoInteger[],
    disabledItems,
    filterParam,
  );
  const files = convertFilesToItems(
    items.filter(
      (item) => "folderId" in item && item.folderId,
    ) as FileDtoInteger[],
    getIcon,
    filterParam,
    undefined,
    disableBySecurity,
  );

  return [
    ...((withCreate && [
      {
        isCreateNewItem: true,
        label: initSelectedItemType === "files" ? t("NewFolder") : t("NewRoom"),
        id: "create-folder-item",
        key: "create-folder-item",
        hotkey: "f",
        onBackClick: () => {},
      },
    ]) ||
      []),
    ...rooms,
    ...folders,
    ...files,
  ];
};

const useSelectorState = ({
  checkCreating,
  disabledItems,
  filterParam,
  withCreate,

  withInit,
  initBreadCrumbs,
  initHasNextPage,
  initItems,
  initSearchValue,
  initSelectedItemId,
  initSelectedItemType,
  initTotal,

  disableBySecurity,
}: UseSelectorStateProps & TFilesSelectorInit) => {
  const t = useCommonTranslation();
  const { getIcon } = use(SettingsContext);

  const [breadCrumbs, setBreadCrumbs] = React.useState<TBreadCrumb[]>(
    withInit ? initBreadCrumbs : [],
  );
  const [searchValue, setSearchValue] = React.useState<string>(
    withInit && initSearchValue ? initSearchValue : "",
  );
  const [items, setItems] = React.useState<TSelectorItem[]>(
    withInit
      ? transformInitItems(
          initItems,
          disabledItems,
          withCreate,
          getIcon,
          t,
          initSelectedItemType,
          filterParam,
          disableBySecurity,
        )
      : [],
  );
  const [selectedItemType, setSelectedItemType] = React.useState<
    "rooms" | "files" | "agents" | undefined
  >(withInit ? initSelectedItemType : undefined);
  const [selectedItemId, setSelectedItemId] = React.useState<
    number | string | undefined
  >(withInit ? initSelectedItemId : undefined);
  const [selectedItemSecurity, setSelectedItemSecurity] = React.useState<
    FileEntryDtoIntegerAllOfSecurity | undefined
  >(undefined);
  const [selectedTreeNode, setSelectedTreeNode] = React.useState(
    {} as FolderDtoInteger & { path?: { folderType?: FolderType }[] },
  );
  const [selectedFileInfo, setSelectedFileInfo] = React.useState<{
    id: number | string;
    title: string;
    path?: string[];
    fileExst?: string;
    fileType?: FileType;
    viewUrl?: string;
    inPublic?: boolean;
  } | null>(null);
  const [total, setTotal] = React.useState<number>(withInit ? initTotal : 0);
  const [hasNextPage, setHasNextPage] = React.useState<boolean>(
    withInit ? initHasNextPage : false,
  );
  const [isSelectedParentFolder, setIsSelectedParentFolder] =
    React.useState<boolean>(false);
  const [isDisabledFolder, setIsDisabledFolder] = React.useState<
    boolean | undefined
  >(checkCreating);
  const [isInit, setIsInit] = React.useState<boolean>(!withInit);
  const [isInsideKnowledge, setIsInsideKnowledge] =
    React.useState<boolean>(false);
  const [isInsideResultStorage, setIsInsideResultStorage] =
    React.useState<boolean>(false);
  const [isInsidePrivateRoom, setIsInsidePrivateRoom] =
    React.useState<boolean>(false);

  const [withCreateState, setWithCreateState] =
    React.useState<boolean>(withCreate);

  React.useEffect(() => {
    const isInsideKnowledgeState = !!selectedTreeNode?.path?.find(
      (f) => f.folderType === FolderType.Knowledge,
    );
    const isInsideResultStorageState = !!selectedTreeNode?.path?.find(
      (f) => f.folderType === FolderType.ResultStorage,
    );
    setWithCreateState(
      withCreate && !isInsideKnowledgeState && !isInsideResultStorageState,
    );
    setIsInsideKnowledge(isInsideKnowledgeState);
    setIsInsideResultStorage(isInsideResultStorageState);
  }, [selectedTreeNode, withCreate]);

  return {
    breadCrumbs,
    setBreadCrumbs,
    searchValue,
    setSearchValue,
    items,
    setItems,
    selectedItemType,
    setSelectedItemType,
    selectedItemId,
    setSelectedItemId,
    selectedItemSecurity,
    setSelectedItemSecurity,
    selectedTreeNode,
    setSelectedTreeNode,
    selectedFileInfo,
    setSelectedFileInfo,
    total,
    setTotal,
    hasNextPage,
    setHasNextPage,
    isSelectedParentFolder,
    setIsSelectedParentFolder,
    isDisabledFolder,
    setIsDisabledFolder,
    isInit,
    setIsInit,
    isInsideKnowledge,
    setIsInsideKnowledge,
    isInsideResultStorage,
    setIsInsideResultStorage,
    isInsidePrivateRoom,
    setIsInsidePrivateRoom,
    withCreateState,
  };
};

export default useSelectorState;
