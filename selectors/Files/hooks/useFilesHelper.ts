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

  disableBySecurity,
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
          const folderInfoRes = await foldersApi.getFolderInfo(
            Number(folderId),
          );
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
        const folderRes = await foldersApi.getFolderByFolderId(
          folderId as number,
          undefined,
          undefined,
          filterParams.filterType,
          undefined,
          undefined,
          filterParams.applyFilterOption,
          filterParams.extension,
          undefined,
          undefined,
          undefined,
          PAGE_COUNT,
          startIndex,
          undefined,
          undefined,
          currentSearch,
        );
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

          if (!isThirdParty && !isRoomsOnly && !isUserOnly)
            breadCrumbs.unshift({ ...getDefaultBreadCrumb(t) });

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
