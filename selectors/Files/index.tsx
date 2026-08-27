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

import {
  FolderType,
  RoomType,
  type FolderDtoInteger,
} from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../providers/api/ApiProvider";
import { DeviceType } from "../../enums";

import type {
  TSelectorItem,
  TBreadCrumb,
  SpecialFolderScope,
} from "../../components/selector";
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
import {
  FORMS_ROOT_FOLDER_TYPE,
  FORMS_SECTION_ID,
} from "../utils/constants";

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
    withFormsTreeFolder = true,

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
    disabledCreatePublicRoom,

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
  const {
    isFullLoadActive,
    isContentLoading,
    startFullLoad,
    finishFullLoad,
    startContentLoading,
    showBodyLoader,
  } = use(LoadersContext);

  const navigatingRef = React.useRef(false);
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

  // When the selector opens directly on the room list (isRoomsOnly), the root
  // tree is skipped, so the Forms section can never be entered by a click.
  // Seed it from the caller's root instead, otherwise a form opened from the
  // Forms section would search the Rooms section and find nothing.
  const [isFormsSection, setIsFormsSection] = React.useState(
    () =>
      Number(rootFolderType) === FORMS_ROOT_FOLDER_TYPE ||
      createDefineRoomType === RoomType.FillingFormsRoom,
  );

  const [recentFolder, setRecentFolder] = React.useState<
    FolderDtoInteger | undefined
  >(undefined);
  const [favoritesFolder, setFavoritesFolder] = React.useState<
    FolderDtoInteger | undefined
  >(undefined);
  const [activeSpecialScope, setActiveSpecialScope] =
    React.useState<SpecialFolderScope | null>(null);

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
    withAIAgentsTreeFolder,
    withFormsTreeFolder,
    setRecentFolder,
    setFavoritesFolder,
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

    recentFolder,
    favoritesFolder,
    withRecentTreeFolder,
    withFavoritesTreeFolder,

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
    formsSection: withFormsTreeFolder ? isFormsSection : undefined,
    isRoomsOnly,
    isInit,
    withCreate: withCreateState,
    createDefineRoomLabel,
    createDefineRoomType,
    disabledCreatePublicRoom,
    searchArea,
    isRoomDisabled,

    recentFolder,
    favoritesFolder,
    withRecentTreeFolder,
    withFavoritesTreeFolder,
    roomsFolderId,

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

    recentFolder,
    favoritesFolder,
    withRecentTreeFolder,
    withFavoritesTreeFolder,
    activeSpecialScope,
    formsSection: withFormsTreeFolder ? isFormsSection : undefined,
  });

  const onClickBreadCrumb = React.useCallback(
    (item: TBreadCrumb) => {
      if (!isFullLoadActive) {
        afterSearch.current = false;
        setSearchValue("");
        startFullLoad();
        if (+item.id === 0) {
          if (pinnedRootId != null) {
            finishFullLoad();
            return;
          }
          setActiveSpecialScope(null);
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
          setActiveSpecialScope(null);
          if (item.isAgent) {
            setSelectedItemType("agents");
          } else if (item.isRoom) {
            setIsFormsSection(
              Number(item.rootFolderType) === FORMS_ROOT_FOLDER_TYPE,
            );
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
      isFullLoadActive,
      isSelectedParentFolder,
      pinnedRootId,
      setBreadCrumbs,
      startFullLoad,
      finishFullLoad,
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
        if (navigatingRef.current) return;

        const specialScope = item.specialFolderScope;
        if (specialScope) {
          navigatingRef.current = true;
          startFullLoad();
          setActiveSpecialScope(specialScope);
          setBreadCrumbs((value) => [
            ...value,
            {
              label: item.label,
              id: item.id,
              rootFolderType:
                specialScope.kind === "recent"
                  ? FolderType.Recent
                  : FolderType.Favorites,
            } as TBreadCrumb,
          ]);
          setSelectedItemId(specialScope.folderId);
          setSearchValue("");
          selectedFileInfoRef.current = null;
          setSelectedFileInfo(null);
          setSelectedItemType("files");
          setIsFormsSection(false);
          return;
        }

        const isFormRoom = item.roomType === RoomType.FillingFormsRoom;

        if (isFormRoom && formProps?.isRoomFormAccessible === false)
          return toastr.warning(formProps.message);

        const isAgent =
          item.parentId === 0 && item.rootFolderType === FolderType.AiAgents;

        navigatingRef.current = true;

        startFullLoad();
        setActiveSpecialScope(null);

        setBreadCrumbs((value) => [
          ...value,
          {
            label: item.label,
            id: item.id,
            isRoom:
              !isAgent &&
              item.parentId === 0 &&
              (item.rootFolderType === FolderType.VirtualRooms ||
                Number(item.rootFolderType) === FORMS_ROOT_FOLDER_TYPE),
            isAgent: isAgent,
            roomType: item.roomType,
            shared: item.shared,
            rootFolderType: item.rootFolderType,
          } as TBreadCrumb,
        ]);
        setSelectedItemId(item.id);
        setSearchValue("");
        selectedFileInfoRef.current = null;
        setSelectedFileInfo(null);

        if (
          item.parentId === 0 &&
          (item.rootFolderType === FolderType.VirtualRooms ||
            Number(item.rootFolderType) === FORMS_ROOT_FOLDER_TYPE ||
            item.rootFolderType === FolderType.AiAgents)
        ) {
          setIsFormsSection(
            Number(item.rootFolderType) === FORMS_ROOT_FOLDER_TYPE,
          );
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
      startFullLoad,
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
    if (!isFullLoadActive) {
      navigatingRef.current = false;
    }
  }, [isFullLoadActive]);

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

    startFullLoad({ dim: false });

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
    startFullLoad,
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
      // Only dim content, don't show skeleton
      startContentLoading();
    }
  }, [searchValue, selectedItemType, startContentLoading]);

  const onClearSearchAction = React.useCallback(
    (callback?: VoidFunction) => {
      if (!searchValue) return;

      startContentLoading();

      setSearchValue("");

      afterSearch.current = true;

      if (callback) {
        clearSearchCallback.current = callback;
      }
    },
    [searchValue, setSearchValue, startContentLoading],
  );

  React.useEffect(() => {
    if (setIsDataReady) setIsDataReady(!showBodyLoader);
  }, [setIsDataReady, showBodyLoader]);

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
        isInsidePrivateRoom,
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
      isInsidePrivateRoom,
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
      // `isRoot` gates the refetch: getRootData itself invalidates deps of
      // this effect (it resets the recent/favorites folders from every
      // fresh response, which recreates getRoomList), so an unguarded
      // call would re-request the root in an endless loop. Navigating
      // into a folder/room sets isRoot back to false, so returning to
      // the root still reloads it.
      if (!isRoot) getRootData();
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
    isRoot,
    isUserOnly,
    withInit,
  ]);

  React.useEffect(() => {
    if (
      clearSearchCallback.current &&
      !isFullLoadActive &&
      !isContentLoading &&
      !searchValue
    ) {
      clearSearchCallback.current();
      clearSearchCallback.current = null;
    }
  }, [isFullLoadActive, isContentLoading, searchValue]);

  const withSearch = withSearchProp
    ? isRoot
      ? false
      : searchValue
        ? true
        : isFullLoadActive
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
      isFullLoadActive && showBodyLoader,
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
