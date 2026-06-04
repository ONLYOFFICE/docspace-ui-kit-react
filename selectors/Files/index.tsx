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

"use client";

import React, { use } from "react";

import { Portal } from "../../components/portal";

import { FolderType, RoomType } from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../providers/api/ApiProvider";
import { DeviceType } from "../../enums";

import type { TSelectorItem, TBreadCrumb } from "../../components/selector";
import { Aside } from "../../components/aside";
import { Backdrop } from "../../components/backdrop";
import { toastr } from "../../components/toast";

import useRoomsHelper from "../utils/hooks/useRoomsHelper";
import useSocketHelper from "../utils/hooks/useSocketHelper";
import useAgentsHelper from "../utils/hooks/useAgentsHelper";

import useFilesHelper from "./hooks/useFilesHelper";
import useRootHelper from "./hooks/useRootHelper";
import useSelectorBody from "./hooks/useSelectorBody";
import useSelectorState from "./hooks/useSelectorState";

import { useCommonTranslation } from "../../utils/i18n";
import type { FilesSelectorProps, TSelectedFileInfo } from "./FilesSelector.types";
import { SettingsContextProvider } from "../utils/contexts/Settings";
import {
  LoadersContext,
  LoadersContextProvider,
} from "../utils/contexts/Loaders";
import { getDefaultBreadCrumb } from "../utils";

const FilesSelectorComponent = (props: FilesSelectorProps) => {
  const {
    disabledItems,
    disabledFolderType,
    isRoomDisabled,
    pinnedRootId,
    includedItems,
    filterParam,

    treeFolders,
    withRecentTreeFolder,
    withFavoritesTreeFolder,
    withAIAgentsTreeFolder,

    onSetBaseFolderPath,
    roomType,
    isUserOnly,
    isRoomsOnly,
    openRoot,
    isThirdParty,
    rootThirdPartyId,
    roomsFolderId,
    currentFolderId,
    // parentId,
    rootFolderType,
    onSubmit,
    onCancel,
    getIsDisabled,

    embedded,
    isPanelVisible,
    currentDeviceType,
    getFilesArchiveError,
    setIsDataReady,
    withSearch: withSearchProp,

    withCreate,
    createDefineRoomLabel,
    createDefineRoomType,

    shareKey,
    formProps,

    folderIsShared,
    checkCreating,

    withInit,
    initItems,
    initBreadCrumbs,
    initSelectedItemType,
    initSelectedItemId,
    initSearchValue,
    initTotal,
    initHasNextPage,

    applyFilterOption,
    onSelectItem,
    isPortalView,

    renderInPortal,
    disableBySecurity,
    withSubFolders,
  } = props;

  const t = useCommonTranslation();
  const { filesApi } = useApi();
  const { isFirstLoad, setIsFirstLoad, showLoader } = use(LoadersContext);

  const currentSelectedItemId = React.useRef<undefined | number | string>(
    undefined,
  );
  const afterSearch = React.useRef(false);
  const selectedFileInfoRef = React.useRef<TSelectedFileInfo | null>(null);
  const ssrRendered = React.useRef(false);
  const ssrTypeRendered = React.useRef(false);
  const clearSearchCallback = React.useRef<null | VoidFunction>(null);

  const withInitProps = withInit
    ? {
        withInit,
        initItems,
        initBreadCrumbs: [getDefaultBreadCrumb(t), ...initBreadCrumbs],
        initSelectedItemType,
        initSelectedItemId,
        initSearchValue,
        initTotal,
        initHasNextPage,
      }
    : {};

  const {
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
    withCreateState,
    setIsInsideKnowledge,
    setIsInsideResultStorage,
    isInsideKnowledge,
    isInsideResultStorage,
    setIsInsidePrivateRoom,
    isInsidePrivateRoom,
  } = useSelectorState({
    checkCreating,
    disabledItems,
    filterParam,
    withCreate,
    disableBySecurity,
    ...withInitProps,
  });

  const { subscribe, unsubscribe } = useSocketHelper({
    disabledItems,
    disabledFolderType,
    filterParam,
    withCreate: withCreateState,
    disableBySecurity,
    isRoomDisabled,
    setItems,
    setBreadCrumbs,
    setTotal,
  });

  const { isRoot, setIsRoot, getRootData } = useRootHelper({
    treeFolders,
    isUserOnly,

    setBreadCrumbs,
    setTotal,
    setItems,
    setHasNextPage,
    setIsInit,
    withRecentTreeFolder,
    withFavoritesTreeFolder,
    withAIAgentsTreeFolder,
  });

  let rootFolderTypeItem = undefined;
  const rootFolderTypeIndex = breadCrumbs.findIndex((tp) => tp.rootFolderType);
  if (rootFolderTypeIndex > -1) {
    rootFolderTypeItem = breadCrumbs[rootFolderTypeIndex].rootFolderType;
  }

  let searchArea = undefined;
  if ((rootFolderType ?? rootFolderTypeItem) === FolderType.RoomTemplates) {
    searchArea = "Templates";
  }

  const { getAgentList } = useAgentsHelper({
    isInit,
    setIsInit,
    setBreadCrumbs,
    setHasNextPage,
    setTotal,
    setItems,
    setIsRoot,
    onSetBaseFolderPath,
    setSelectedItemType,
    subscribe,
    setSelectedItemSecurity,
    setSelectedTreeNode,
    searchValue,
    withCreate: withCreateState,
    disableBySecurity,

    withInit,
  });

  const { getRoomList } = useRoomsHelper({
    setBreadCrumbs,
    setHasNextPage,
    setTotal,
    setItems,
    setIsRoot,
    onSetBaseFolderPath,
    setIsInit,
    getRootData,
    setSelectedItemType,
    subscribe,
    setSelectedItemSecurity,
    setSelectedTreeNode,

    searchValue,
    roomType,
    isRoomsOnly,
    isInit,
    withCreate: withCreateState,
    createDefineRoomLabel,
    createDefineRoomType,
    searchArea,
    isRoomDisabled,

    withInit,
  });

  const { getFileList } = useFilesHelper({
    setBreadCrumbs,
    setHasNextPage,
    setTotal,
    setItems,
    setIsRoot,
    setSelectedItemSecurity,
    setSelectedTreeNode,
    getRootData,
    onSetBaseFolderPath,
    getRoomList,
    setIsSelectedParentFolder,
    getFilesArchiveError,
    setIsInit,
    setSelectedItemId,
    setSelectedItemType,
    setIsInsideKnowledge,
    setIsInsideResultStorage,
    setIsInsidePrivateRoom,

    selectedItemId,
    searchValue,
    disabledItems,
    disabledFolderType,
    pinnedRootId,
    includedItems,
    isThirdParty,
    filterParam,
    isRoomsOnly,
    isUserOnly,
    rootThirdPartyId,
    roomsFolderId,
    isInit,
    withCreate: withCreateState,
    shareKey,

    withInit,
    applyFilterOption,
    disableBySecurity,
    withSubFolders,
  });

  const onClickBreadCrumb = React.useCallback(
    (item: TBreadCrumb) => {
      if (!isFirstLoad) {
        afterSearch.current = false;
        setSearchValue("");
        setIsFirstLoad(true);
        if (+item.id === 0) {
          if (pinnedRootId != null) {
            setIsFirstLoad(false);
            return;
          }
          setSelectedItemSecurity(undefined);
          setSelectedItemType(undefined);
          getRootData();
        } else {
          setBreadCrumbs((bc) => {
            const idx = bc.findIndex(
              (value) => value.id.toString() === item.id.toString(),
            );

            const maxLength = bc.length - 1;
            let foundParentId = false;
            let currentFolderIndex = -1;

            const newBreadCrumbs = bc.map((i, index) => {
              if (!foundParentId) {
                currentFolderIndex = disabledItems.findIndex(
                  (id) => id === i?.id,
                );
              }

              if (index !== maxLength && currentFolderIndex !== -1) {
                foundParentId = true;
                if (!isSelectedParentFolder) setIsSelectedParentFolder(true);
              }

              if (
                index === maxLength &&
                !foundParentId &&
                isSelectedParentFolder
              )
                setIsSelectedParentFolder(false);

              return { ...i };
            });

            newBreadCrumbs.splice(idx + 1, newBreadCrumbs.length - idx - 1);
            return newBreadCrumbs;
          });

          setSelectedItemId(item.id);
          selectedFileInfoRef.current = null;
          setSelectedFileInfo(null);
          if (item.isAgent) {
            setSelectedItemType("agents");
          } else if (item.isRoom) {
            setSelectedItemType("rooms");
          } else {
            setSelectedItemType("files");
          }
        }
      }
    },
    [
      disabledItems,
      getRootData,
      isFirstLoad,
      isSelectedParentFolder,
      pinnedRootId,
      setBreadCrumbs,
      setIsFirstLoad,
      setIsSelectedParentFolder,
      setSearchValue,
      setSelectedFileInfo,
      setSelectedItemId,
      setSelectedItemSecurity,
      setSelectedItemType,
    ],
  );

  const onSelectAction = React.useCallback(
    async (
      item: TSelectorItem,
      isDoubleClick: boolean,
      doubleClickCallback: () => Promise<void>,
    ) => {
      onSelectItem?.(item);
      if (item.isFolder) {
        if (isDoubleClick) return;

        const isFormRoom = item.roomType === RoomType.FillingFormsRoom;

        if (isFormRoom && formProps?.isRoomFormAccessible === false)
          return toastr.warning(formProps.message);

        setIsFirstLoad(true);

        const isAgent =
          item.parentId === 0 && item.rootFolderType === FolderType.AiAgents;

        setBreadCrumbs((value) => [
          ...value,
          {
            label: item.label,
            id: item.id,
            isRoom:
              !isAgent &&
              item.parentId === 0 &&
              item.rootFolderType === FolderType.VirtualRooms,
            isAgent: isAgent,
            roomType: item.roomType,
            shared: item.shared,
          } as TBreadCrumb,
        ]);
        setSelectedItemId(item.id);
        setSearchValue("");
        selectedFileInfoRef.current = null;
        setSelectedFileInfo(null);

        if (
          item.parentId === 0 &&
          (item.rootFolderType === FolderType.VirtualRooms ||
            item.rootFolderType === FolderType.AiAgents)
        ) {
          setSelectedItemType(
            item.rootFolderType === FolderType.AiAgents ? "agents" : "rooms",
          );
        } else {
          setSelectedItemType("files");
        }

        if (checkCreating && item.id) {
          try {
            const res = await filesApi.createFile({
              folderId: Number(item.id),
              createFileJsonElement: {
                title: t("NewDocument"),
              },
            });
            const fileId = res.data.response?.id;
            if (fileId != null) {
              await filesApi.deleteFile({
                fileId,
                _delete: {
                  deleteAfter: true,
                  immediately: true,
                },
              });
            }
            setIsDisabledFolder(false);
          } catch (e) {
            console.log(e);
            setIsDisabledFolder(true);
          }
        }
      } else if (item.id && item.label) {
        const inPublic =
          breadCrumbs.findIndex(
            (f) =>
              f.roomType === RoomType.PublicRoom ||
              f.roomType === RoomType.FillingFormsRoom ||
              (f.roomType === RoomType.CustomRoom && f.shared),
          ) > -1;

        const newFileInfo = {
          id: item.id,
          title: item.label,
          fileExst: item.fileExst,
          fileType: item.fileType,
          viewUrl: item.viewUrl,
          inPublic,
        };
        selectedFileInfoRef.current = newFileInfo as TSelectedFileInfo;
        setSelectedFileInfo(newFileInfo);

        if (isDoubleClick) {
          doubleClickCallback();
        }
      }
    },
    [
      formProps?.isRoomFormAccessible,
      formProps?.message,
      setIsFirstLoad,
      setBreadCrumbs,
      setSelectedItemId,
      setSearchValue,
      setSelectedFileInfo,
      checkCreating,
      breadCrumbs,
      setSelectedItemType,
      setIsDisabledFolder,
      onSelectItem,
      filesApi,
      t,
    ],
  );

  React.useEffect(() => {
    if (!selectedItemId) return;
    if (selectedItemId && isRoot) return unsubscribe();

    subscribe(selectedItemId);
  }, [selectedItemId, isRoot, unsubscribe, subscribe]);

  React.useEffect(() => {
    if (initSelectedItemId === currentFolderId) return;

    setSelectedItemId(currentFolderId);
  }, [currentFolderId, initSelectedItemId, setSelectedItemId]);

  React.useEffect(() => {
    if (withInit && !ssrTypeRendered.current) {
      ssrTypeRendered.current = true;
      return;
    }

    setIsFirstLoad(true);

    const needRoomList = isRoomsOnly && !currentFolderId;

    if (needRoomList) {
      setSelectedItemType("rooms");
      return;
    }

    if (!currentFolderId && !isUserOnly && !openRoot) {
      setSelectedItemType("rooms");
      return;
    }

    if (
      needRoomList ||
      (+currentFolderId === roomsFolderId &&
        rootFolderType === FolderType.VirtualRooms)
    ) {
      setSelectedItemType("rooms");

      return;
    }

    setSelectedItemType("files");
  }, [
    currentFolderId,
    isRoomsOnly,
    isUserOnly,
    roomsFolderId,
    rootFolderType,
    openRoot,
    setIsFirstLoad,
    setSelectedItemType,
    withInit,
  ]);

  React.useEffect(() => {
    currentSelectedItemId.current = selectedItemId;
  }, [selectedItemId]);

  const onSearchAction = (value: string, callback?: VoidFunction) => {
    if (selectedItemId !== currentSelectedItemId.current) {
      setSearchValue("");
      return;
    }
    setSearchValue(value);

    callback?.();
    afterSearch.current = true;
  };

  React.useEffect(() => {
    if (!selectedItemType) return;

    if (searchValue) {
      setIsFirstLoad(true);
    }
  }, [searchValue, selectedItemType, setIsFirstLoad]);

  const onClearSearchAction = React.useCallback(
    (callback?: VoidFunction) => {
      if (!searchValue) return;
      setIsFirstLoad(true);

      setSearchValue("");

      afterSearch.current = true;

      if (callback) {
        clearSearchCallback.current = callback;
      }
    },
    [searchValue, setIsFirstLoad, setSearchValue],
  );

  React.useEffect(() => {
    if (setIsDataReady) setIsDataReady(!showLoader);
  }, [setIsDataReady, showLoader]);

  const onSubmitAction = React.useCallback(
    async (
      i: unknown,
      accessRights: unknown,
      fileName: string,
      isChecked: boolean,
    ) => {
      const inPublicRoom = breadCrumbs.findIndex((f) => f.shared) > -1;
      const showMoveToPublicDialog = inPublicRoom && !folderIsShared;

      const folderTitle = breadCrumbs[breadCrumbs.length - 1].label;

      await onSubmit(
        selectedItemId,
        folderTitle,
        showMoveToPublicDialog,
        breadCrumbs,
        fileName,
        isChecked,
        selectedTreeNode,
        selectedFileInfoRef.current,
        isInsideKnowledge,
        isInsideResultStorage,
      );
    },
    [
      breadCrumbs,
      onSubmit,
      selectedItemId,
      selectedTreeNode,
      selectedFileInfoRef,
      folderIsShared,
      isInsideKnowledge,
      isInsideResultStorage,
    ],
  );

  React.useEffect(() => {
    if (withInit && !ssrRendered.current) {
      ssrRendered.current = true;
      return;
    }

    if (selectedItemType === "agents") {
      getAgentList(0);
      return;
    }

    if (selectedItemType === "rooms") {
      getRoomList(0);
      return;
    }
    if (openRoot && !selectedItemId) {
      getRootData();
      return;
    }

    if (selectedItemType === "files" && (selectedItemId || isUserOnly))
      getFileList(0);
  }, [
    getAgentList,
    getFileList,
    getRoomList,
    selectedItemType,
    selectedItemId,
    getRootData,
    openRoot,
    isUserOnly,
    withInit,
  ]);

  React.useEffect(() => {
    if (clearSearchCallback.current && !isFirstLoad && !searchValue) {
      clearSearchCallback.current();
      clearSearchCallback.current = null;
    }
  }, [isFirstLoad, searchValue]);

  const withSearch = withSearchProp
    ? isRoot
      ? false
      : searchValue
        ? true
        : isFirstLoad
          ? true
          : afterSearch.current || !!items.length
    : false;

  const SelectorBody = useSelectorBody({
    ...props,

    withSearch,
    searchValue,
    onSearch: onSearchAction,
    onClearSearch: onClearSearchAction,

    onSubmit: onSubmitAction,
    disableSubmitButton: getIsDisabled(
      isFirstLoad && showLoader,
      isSelectedParentFolder,
      selectedItemId,
      selectedItemType,
      isRoot,
      selectedItemSecurity,
      selectedFileInfo,
      isDisabledFolder,
      isInsideKnowledge,
      isInsideResultStorage,
      isInsidePrivateRoom,
    ),

    selectedTreeNode,

    breadCrumbs,
    onSelectBreadCrumb: onClickBreadCrumb,

    loadNextPage: isRoot
      ? async () => {}
      : selectedItemType === "agents"
        ? getAgentList
        : selectedItemType === "rooms"
          ? getRoomList
          : getFileList,

    items,
    onSelect: onSelectAction,

    hasNextPage,
    totalItems: total,

    isRoot,

    selectedItemType,
  });

  const selectorComponent = embedded ? (
    SelectorBody
  ) : (
    <>
      <Backdrop
        visible={isPanelVisible}
        isAside
        withBackground
        zIndex={309}
        onClick={onCancel}
      />
      <Aside
        visible={isPanelVisible}
        withoutBodyScroll
        zIndex={310}
        onClose={onCancel}
        withoutHeader
      >
        {SelectorBody}
      </Aside>
    </>
  );

  return ((renderInPortal ??
    (currentDeviceType === DeviceType.mobile ||
      currentDeviceType === DeviceType.tablet)) &&
    !embedded) ||
    isPortalView ? (
    <Portal visible={isPanelVisible} element={<div>{selectorComponent}</div>} />
  ) : (
    selectorComponent
  );
};

const FilesSelector = (props: FilesSelectorProps) => {
  const { filesSettings, getIcon, withInit } = props;

  return (
    <LoadersContextProvider withInit={withInit}>
      <SettingsContextProvider settings={filesSettings} getIcon={getIcon}>
        <FilesSelectorComponent {...props} />
      </SettingsContextProvider>
    </LoadersContextProvider>
  );
};

export default FilesSelector;
