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
import {
  FolderType,
  RoomType,
  type FolderDtoInteger,
  type FileDtoInteger,
} from "@onlyoffice/docspace-api-sdk";

import FolderSvg from "../../../assets/icons/32/folder.svg";

import { useCommonTranslation } from "../../../utils/i18n";

import { useApi } from "../../../providers/api";

import { toastr, type TData } from "../../../components/toast";
import type { TSelectorItem, TBreadCrumb } from "../../../components/selector";

import useInputItemHelper from "../../utils/hooks/useInputItemHelper";
import { SettingsContext } from "../../utils/contexts/Settings";
import { LoadersContext } from "../../utils/contexts/Loaders";

import { PAGE_COUNT } from "../../utils/constants";
import type { UseFilesHelpersProps } from "../FilesSelector.types";
import {
  convertFilesToItems,
  convertFoldersToItems,
  getDefaultBreadCrumb,
} from "../../utils";

import { getFilterParams } from "../FilesSelector.utils";

const useFilesHelper = ({
  setHasNextPage,
  setTotal,
  setItems,
  setBreadCrumbs,

  selectedItemId,
  setIsRoot,
  searchValue,
  disabledItems,
  disabledFolderType,
  pinnedRootId,
  includedItems,
  setSelectedItemSecurity,
  isThirdParty,
  setSelectedTreeNode,
  filterParam,
  getRootData,
  onSetBaseFolderPath,
  isRoomsOnly,
  isUserOnly,
  rootThirdPartyId,
  getRoomList,

  setIsSelectedParentFolder,
  roomsFolderId,
  getFilesArchiveError,
  isInit,
  setIsInit,

  withCreate,
  setSelectedItemId,
  setSelectedItemType,
  shareKey: _shareKey,

  applyFilterOption,

  setIsInsideKnowledge,
  setIsInsideResultStorage,
  setIsInsidePrivateRoom,

  disableBySecurity,
  withSubFolders,
}: UseFilesHelpersProps) => {
  const t = useCommonTranslation();
  const {
    isFirstLoad,
    setIsFirstLoad,
    setIsNextPageLoading,
    setIsBreadCrumbsLoading,
  } = use(LoadersContext);

  const { getIcon, extsWebEdited, filesSettingsLoading } = use(SettingsContext);

  const { foldersApi } = useApi();

  const { addInputItem } = useInputItemHelper({
    withCreate,
    selectedItemId,
    setItems,
  });

  const requestRunning = React.useRef(false);
  const initRef = React.useRef(isInit);
  const firstLoadRef = React.useRef(isFirstLoad);
  const disabledItemsRef = React.useRef(disabledItems);
  const privateRoomCacheRef = React.useRef<Map<number | string, boolean>>(
    new Map(),
  );

  React.useEffect(() => {
    disabledItemsRef.current = disabledItems;
  }, [disabledItems]);

  React.useEffect(() => {
    firstLoadRef.current = isFirstLoad;
  }, [isFirstLoad]);

  React.useEffect(() => {
    initRef.current = isInit;
  }, [isInit]);

  const getFileList = React.useCallback(
    async (sIndex: number) => {
      if (requestRunning.current || filesSettingsLoading) return;

      requestRunning.current = true;
      setIsNextPageLoading(true);

      let startIndex = sIndex;

      if (withCreate) {
        startIndex -= startIndex % 100;
      }

      const filterParams = filterParam
        ? getFilterParams(filterParam, extsWebEdited, applyFilterOption)
        : {};

      const id = selectedItemId ?? (isUserOnly ? "@my" : "");

      const setSettings = async (
        folderId: string | number,
        isErrorPath = false,
      ) => {
        if (initRef.current && getRootData && folderId !== "@my") {
          // NOTE: folderId can be string but types cannot be fixed right now, using type assertion
          const folderInfoRes = await foldersApi.getFolderInfo({
            folderId: folderId as number,
          });
          const folder = folderInfoRes.data.response!;

          const isArchive = folder.rootFolderType === FolderType.Archive;

          if (folder.rootFolderType === FolderType.TRASH || isArchive) {
            if (isRoomsOnly && getRoomList) {
              await getRoomList(0);
              onSetBaseFolderPath?.([]);
              const error = getFilesArchiveError(folder.title ?? "");
              toastr.error(error);

              requestRunning.current = false;
              return;
            }

            await getRootData();

            if (onSetBaseFolderPath && isArchive) {
              onSetBaseFolderPath?.([]);
              const error = getFilesArchiveError(folder.title ?? "");
              toastr.error(error);
            }
            requestRunning.current = false;
            return;
          }
        }

        const currentSearch = searchValue || "";

        // NOTE: folderId can be string but types cannot be fixed right now, using type assertion
        const folderRes = await foldersApi.getFolderByFolderId({
          folderId: folderId as number,
          filterType: filterParams.filterType,
          applyFilterOption: filterParams.applyFilterOption,
          extension: filterParams.extension,
          count: PAGE_COUNT,
          startIndex,
          filterValue: currentSearch,
          withSubFolders,
        });
        const currentFolder = folderRes.data.response!;

        const { folders, files, total, count, pathParts, current } =
          currentFolder;

        setSelectedItemSecurity(current!.security!);

        const foldersList: TSelectorItem[] = convertFoldersToItems(
          (folders ?? []) as FolderDtoInteger[],
          disabledItemsRef.current,
          filterParam,
          disabledFolderType,
        );

        const filesList: TSelectorItem[] = convertFilesToItems(
          (files ?? []) as FileDtoInteger[],
          getIcon,
          filterParam,
          includedItems,
          disableBySecurity,
        );

        const itemList = [...foldersList, ...filesList];

        setHasNextPage(count === PAGE_COUNT);

        setSelectedTreeNode?.({
          ...current!,
          path: pathParts,
        } as FolderDtoInteger);

        const isInsideKnowledge = pathParts.some(
          (x: { folderType?: FolderType }) =>
            x.folderType === FolderType.Knowledge,
        );
        const isInsideResultStorage = pathParts.some(
          (x: { folderType?: FolderType }) =>
            x.folderType === FolderType.ResultStorage,
        );

        setIsInsideKnowledge(isInsideKnowledge);
        setIsInsideResultStorage(isInsideResultStorage);

        const roomPart = (
          pathParts as { id: number | string; roomType?: number }[]
        ).find((p) => typeof p.roomType !== "undefined");

        let isInsidePrivateRoom = false;
        if (roomPart) {
          if (current?.id === roomPart.id) {
            isInsidePrivateRoom = current?.private === true;
            privateRoomCacheRef.current.set(roomPart.id, isInsidePrivateRoom);
          } else if (privateRoomCacheRef.current.has(roomPart.id)) {
            isInsidePrivateRoom =
              privateRoomCacheRef.current.get(roomPart.id) ?? false;
          } else {
            try {
              const roomInfoRes = await foldersApi.getFolderInfo({
                folderId: roomPart.id as number,
              });
              isInsidePrivateRoom =
                roomInfoRes.data.response?.private === true;
              privateRoomCacheRef.current.set(roomPart.id, isInsidePrivateRoom);
            } catch {
              isInsidePrivateRoom = false;
            }
          }
        }

        setIsInsidePrivateRoom(isInsidePrivateRoom);

        if (initRef.current) {
          let foundParentId = false;
          let currentFolderIndex = -1;

          const breadCrumbs: TBreadCrumb[] = pathParts.map(
            (
              {
                id: breadCrumbId,
                title,
                roomType,
              }: {
                id: number | string;
                title: string;
                roomType?: number;
              },
              index: number,
            ) => {
              if (!foundParentId && disabledItemsRef.current) {
                currentFolderIndex = disabledItemsRef.current.findIndex(
                  (x) => x === id,
                );
              }

              if (!foundParentId && currentFolderIndex !== -1) {
                foundParentId = true;
                setIsSelectedParentFolder(true);
              }

              const nextItem = pathParts[index + 1];

              return {
                label: title,
                id: breadCrumbId,
                isRoom:
                  roomsFolderId === id ||
                  (index === 0 && typeof nextItem?.roomType !== "undefined"),
                isAgent:
                  index === 0 &&
                  typeof nextItem?.roomType !== "undefined" &&
                  nextItem.roomType === RoomType.AiRoom,
                roomType,
                rootFolderType: current!.rootFolderType,
              };
            },
          );

          // breadCrumbs.forEach((item, idx) => {
          //   if (item.roomType) breadCrumbs[idx].isRoom = true;
          // });

          if (pinnedRootId != null) {
            const pinIndex = breadCrumbs.findIndex(
              (bc) => bc.id.toString() === pinnedRootId.toString(),
            );
            if (pinIndex > 0) breadCrumbs.splice(0, pinIndex);
          } else if (!isThirdParty && !isRoomsOnly && !isUserOnly) {
            breadCrumbs.unshift({ ...getDefaultBreadCrumb(t) });
          }

          onSetBaseFolderPath?.(isErrorPath ? [] : breadCrumbs);

          setBreadCrumbs(breadCrumbs);
          setIsBreadCrumbsLoading(false);
        }

        if (firstLoadRef.current || startIndex === 0) {
          const { security } = current!;

          if (withCreate && security?.Create) {
            setTotal(total + 1);
            itemList.unshift({
              isCreateNewItem: true,
              label: t("NewFolder"),
              id: "create-folder-item",
              key: "create-folder-item",
              hotkey: "f",
              onCreateClick: () =>
                addInputItem(t("NewFolder"), React.createElement(FolderSvg)),
              onBackClick: () => {
                let isRooms = false;
                setBreadCrumbs((val) => {
                  const newVal = [...val];

                  const item = newVal.pop();

                  isRooms = !!item?.roomType;

                  return newVal;
                });

                if (isRooms) setSelectedItemType("rooms");

                setSelectedItemId(current!.parentId!);
              },
            });
          } else {
            setTotal(total);
          }
          setItems(itemList);
        } else {
          setItems((prevState) => {
            if (prevState) return [...prevState, ...itemList];
            return [...itemList];
          });
        }
        setIsRoot(false);
        setIsInit(false);
        setIsNextPageLoading(false);
        setIsFirstLoad(false);
      };

      try {
        await setSettings(id);

        requestRunning.current = false;
      } catch (e) {
        sessionStorage.removeItem("filesSelectorPath");
        if (isThirdParty && rootThirdPartyId) {
          await setSettings(rootThirdPartyId, true);

          toastr.error(e as TData);
          requestRunning.current = false;
          return;
        }

        if (isRoomsOnly && getRoomList) {
          await getRoomList(0, null, true, true);

          toastr.error(e as TData);
          requestRunning.current = false;
          return;
        }

        requestRunning.current = false;

        getRootData?.();
        if (selectedItemId) setSelectedItemId("");

        if (onSetBaseFolderPath) {
          onSetBaseFolderPath([]);
        }
        setIsFirstLoad(false);
        toastr.error(e as TData);
      }
    },
    [
      foldersApi,
      filesSettingsLoading,
      setIsNextPageLoading,
      withCreate,
      searchValue,
      filterParam,
      selectedItemId,
      isUserOnly,
      extsWebEdited,
      getRootData,
      setSelectedItemSecurity,
      getIcon,
      setHasNextPage,
      setSelectedTreeNode,
      setIsRoot,
      setIsInit,
      setIsFirstLoad,
      isRoomsOnly,
      getRoomList,
      onSetBaseFolderPath,
      getFilesArchiveError,
      isThirdParty,
      setBreadCrumbs,
      setIsBreadCrumbsLoading,
      roomsFolderId,
      setIsSelectedParentFolder,
      setItems,
      setTotal,
      addInputItem,
      setSelectedItemType,
      setSelectedItemId,
      setIsInsideKnowledge,
      setIsInsideResultStorage,
      rootThirdPartyId,
      applyFilterOption,
      includedItems,
      disabledFolderType,
      disableBySecurity,
      t,
    ],
  );

  return { getFileList };
};

export default useFilesHelper;
