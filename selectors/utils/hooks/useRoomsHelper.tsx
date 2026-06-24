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
  RoomType as ApiRoomType,
  StorageFilter,
  FolderType,
  type RoomType as RoomTypeEnum,
  type FolderDtoInteger,
  type SearchArea,
} from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../../providers/api";
import { RoomsTypeValues } from "../../../utils/common";
import RoomType from "../../../components/room-type";
import type { TSelectorItem, TBreadCrumb } from "../../../components/selector";

import { LoadersContext } from "../contexts/Loaders";

import { PAGE_COUNT } from "../constants";
import type { UseRoomsHelperProps } from "../types";
import { useCommonTranslation } from "../../../utils/i18n";
import {
  convertRoomsToItems,
  getDefaultBreadCrumb,
  buildSpecialFolderItems,
} from "..";

import useInputItemHelper from "./useInputItemHelper";

const useRoomsHelper = ({
  setHasNextPage,
  setTotal,
  setItems,
  setBreadCrumbs,
  setIsRoot,
  onSetBaseFolderPath,

  searchValue,
  searchArea,
  roomType,
  formsSection,
  isRoomsOnly,

  isInit,
  setIsInit,
  withCreate,
  disableThirdParty,
  excludeItems,
  createDefineRoomLabel,
  createDefineRoomType,
  getRootData,
  setSelectedItemType,
  subscribe,
  setSelectedItemSecurity,
  setSelectedTreeNode,
  isRoomDisabled,

  recentFolder,
  favoritesFolder,
  withRecentTreeFolder,
  withFavoritesTreeFolder,
  roomsFolderId,
}: UseRoomsHelperProps) => {
  const t = useCommonTranslation();
  const {
    setIsNextPageLoading,
    setIsBreadCrumbsLoading,
    setIsFirstLoad,

    isFirstLoad,
  } = use(LoadersContext);

  const { roomsApi } = useApi();

  const { addInputItem } = useInputItemHelper({ withCreate, setItems });

  const requestRunning = React.useRef(false);
  const initRef = React.useRef(isInit);
  const firstLoadRef = React.useRef(isFirstLoad);

  React.useEffect(() => {
    firstLoadRef.current = isFirstLoad;
  }, [isFirstLoad]);

  React.useEffect(() => {
    initRef.current = isInit;
  }, [isInit]);

  const createDropDownItems = React.useMemo(() => {
    return RoomsTypeValues.map((value) => {
      const onClick = () => {
        addInputItem("", "", value as RoomTypeEnum, t("EnterName"));
      };

      return (
        <RoomType
          key={value}
          roomType={value}
          selectedId={value}
          type="dropdownItem"
          isOpen={false}
          onClick={onClick}
        />
      );
    });
  }, [addInputItem, t]);

  const getRoomList = React.useCallback(
    async (sIndex: number) => {
      if (requestRunning.current) return;

      requestRunning.current = true;
      setIsNextPageLoading(true);

      let startIndex = sIndex;

      if (withCreate) {
        startIndex -= startIndex % 100;
      }

      const filterValue = searchValue || "";

      let typeFilter: RoomTypeEnum[] | undefined;

      if (roomType || createDefineRoomType) {
        const types: RoomTypeEnum[] = roomType
          ? Array.isArray(roomType)
            ? [...roomType]
            : [roomType]
          : [];
        if (createDefineRoomType && !types.includes(createDefineRoomType)) {
          types.push(createDefineRoomType);
        }
        typeFilter = types.length > 0 ? types : undefined;
      }

      if (!typeFilter && formsSection !== undefined) {
        typeFilter = formsSection
          ? [ApiRoomType.FillingFormsRoom]
          : Object.values(ApiRoomType).filter(
              (value) =>
                value !== ApiRoomType.FillingFormsRoom &&
                value !== ApiRoomType.AiRoom,
            );
      }

      const res = await roomsApi.getRoomsFolder({
        type: typeFilter,
        searchArea: searchArea as SearchArea,
        storageFilter: disableThirdParty ? StorageFilter.Internal : undefined,
        count: PAGE_COUNT,
        startIndex,
        filterValue,
      });
      const roomsFromApi = res.data.response!;

      const { folders, total, count, current } = roomsFromApi;

      if (initRef.current) {
        const { title, id } = current!;

        if (isRoomsOnly) subscribe(id!);

        const breadCrumbs: TBreadCrumb[] = [
          { label: title!, id: id!, isRoom: true },
        ];

        if (!isRoomsOnly) breadCrumbs.unshift({ ...getDefaultBreadCrumb(t) });

        onSetBaseFolderPath?.(breadCrumbs);

        setBreadCrumbs?.(breadCrumbs);

        setIsBreadCrumbsLoading(false);
      }

      const itemList: TSelectorItem[] = convertRoomsToItems(
        folders ?? [],
        t,
        isRoomDisabled,
      ).filter((x) => (excludeItems ? !excludeItems.includes(x.id) : true));

      setHasNextPage(count === PAGE_COUNT);

      setSelectedItemSecurity?.(current!.security!);

      setSelectedTreeNode?.({
        ...current!,
        path: roomsFromApi.pathParts,
      } as FolderDtoInteger);

      if (firstLoadRef.current || startIndex === 0) {
        const { security } = current!;

        if (withCreate && security?.Create) {
          setTotal(total + 1);
          const createRoomType =
            createDefineRoomType ??
            (formsSection ? ApiRoomType.FillingFormsRoom : undefined);
          const createItem: TSelectorItem = {
            isCreateNewItem: true,
            label: createDefineRoomLabel ?? t("NewRoom"),
            id: "create-room-item",
            key: "create-room-item",
            hotkey: "r",
            isRoomsOnly,
            createDefineRoomType: createRoomType,
            dropDownItems: createRoomType ? undefined : createDropDownItems,

            onBackClick: () => {
              setIsRoot?.(true);
              setSelectedItemType?.(undefined);
              setBreadCrumbs?.((val) => {
                const newVal = [...val];

                newVal.pop();

                return newVal;
              });
              getRootData?.();
            },
          };

          if (createRoomType) {
            createItem.onCreateClick = () =>
              addInputItem("", "", createRoomType, createDefineRoomLabel);
          }

          itemList.unshift(createItem);
        } else {
          setTotal(total);
        }

        if (
          startIndex === 0 &&
          !searchValue &&
          (withRecentTreeFolder || withFavoritesTreeFolder)
        ) {
          const specialItems = buildSpecialFolderItems({
            section: formsSection ? "forms" : "rooms",
            recentFolder,
            favoritesFolder,
            withRecent: withRecentTreeFolder,
            withFavorites: withFavoritesTreeFolder,
            parentId: formsSection ? undefined : roomsFolderId,
            folderType: formsSection ? FolderType.FillingFormsRoom : undefined,
            withSeparator: itemList.length > 0,
            t,
          });

          if (specialItems.length) {
            itemList.unshift(...specialItems);
            const base = withCreate && security?.Create ? total + 1 : total;
            setTotal(base + specialItems.length);
          }
        }

        setItems?.(itemList);
      } else {
        setItems?.((prevState) => {
          if (prevState) return [...prevState, ...itemList];
          return [...itemList];
        });
      }

      requestRunning.current = false;
      setIsNextPageLoading(false);
      setIsRoot?.(false);
      setIsInit(false);
      setIsFirstLoad(false);
    },
    [
      roomsApi,
      searchValue,
      createDefineRoomType,
      setHasNextPage,
      setSelectedItemSecurity,
      setIsRoot,
      setIsInit,
      setIsFirstLoad,
      setIsNextPageLoading,
      roomType,
      formsSection,
      isRoomsOnly,
      subscribe,
      onSetBaseFolderPath,
      setBreadCrumbs,
      setIsBreadCrumbsLoading,
      withCreate,
      setItems,
      setTotal,
      createDefineRoomLabel,
      createDropDownItems,
      setSelectedItemType,
      getRootData,
      addInputItem,
      searchArea,
      disableThirdParty,
      excludeItems,
      setSelectedTreeNode,
      t,
      recentFolder,
      favoritesFolder,
      withRecentTreeFolder,
      withFavoritesTreeFolder,
      roomsFolderId,
    ],
  );

  return { getRoomList };
};

export default useRoomsHelper;
