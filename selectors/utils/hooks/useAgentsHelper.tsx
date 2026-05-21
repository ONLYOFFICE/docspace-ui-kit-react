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

import { SearchArea } from "@onlyoffice/docspace-api-sdk";
import type {
  FolderDtoInteger,
  FileEntryDtoIntegerAllOfSecurity,
} from "@onlyoffice/docspace-api-sdk";
import type { TSelectorItem, TBreadCrumb } from "../../../components/selector";

import { useApi } from "../../../providers/api/ApiProvider";
import { LoadersContext } from "../contexts/Loaders";

import { PAGE_COUNT } from "../constants";
import type { UseAgentsHelperProps } from "../types";
import { convertRoomsToItems } from "..";
import { useCommonTranslation } from "../../../utils/i18n";

// import useInputItemHelper from "./useInputItemHelper";

const useAgentsHelper = ({
  setHasNextPage,
  setTotal,
  setItems,
  setBreadCrumbs,
  setIsRoot,
  onSetBaseFolderPath,
  // createDefineLabel,

  searchValue,
  // isRoomsOnly,

  isInit,
  setIsInit,
  // withCreate all time false for agent without billing
  // withCreate = false,
  excludeItems,
  // getRootData,
  // setSelectedItemType,
  subscribe,
  setSelectedItemSecurity,
  setSelectedTreeNode,
  disableBySecurity,
}: UseAgentsHelperProps) => {
  const t = useCommonTranslation();
  const { apiClient } = useApi();
  const {
    setIsNextPageLoading,
    setIsBreadCrumbsLoading,
    setIsFirstLoad,

    isFirstLoad,
  } = use(LoadersContext);

  // const { addInputItem } = useInputItemHelper({ withCreate, setItems });

  const requestRunning = React.useRef(false);
  const initRef = React.useRef(isInit);
  const firstLoadRef = React.useRef(isFirstLoad);

  React.useEffect(() => {
    firstLoadRef.current = isFirstLoad;
  }, [isFirstLoad]);

  React.useEffect(() => {
    initRef.current = isInit;
  }, [isInit]);

  const getAgentList = React.useCallback(
    async (sIndex: number) => {
      if (requestRunning.current) return;

      requestRunning.current = true;
      setIsNextPageLoading(true);

      const startIndex = sIndex;

      // if (withCreate) {
      //   startIndex -= startIndex % 100;
      // }

      const filterValue = searchValue || "";

      const page = startIndex / PAGE_COUNT;

      const params = new URLSearchParams({
        page: String(page),
        count: String(PAGE_COUNT),
        searchArea: String(SearchArea.AiAgents),
      });

      if (filterValue) {
        params.set("filterValue", filterValue);
      }

      const { response } = await apiClient.request<{
        response: {
          folders: FolderDtoInteger[];
          current: FolderDtoInteger;
          pathParts: { folderType?: number }[];
          total: number;
          count: number;
        };
      }>(`/api/2.0/ai/agents?${params.toString()}`);

      const { folders, total, count, current } = response;

      if (initRef.current) {
        const { title, id } = current;

        subscribe(id!);

        const breadCrumbs: TBreadCrumb[] = [
          { label: title ?? "", id: id!, isRoom: false, isAgent: true },
        ];

        // if (!isRoomsOnly) breadCrumbs.unshift({ ...getDefaultBreadCrumb() });

        onSetBaseFolderPath?.(breadCrumbs);

        setBreadCrumbs?.(breadCrumbs);

        setIsBreadCrumbsLoading(false);
      }

      const itemList: TSelectorItem[] = convertRoomsToItems(folders, t)
        .filter((x) => (excludeItems ? !excludeItems.includes(x.id) : true))
        .map((item) => {
          const security = item.security as
            | FileEntryDtoIntegerAllOfSecurity
            | undefined;
          const isDisabledBySecurity = disableBySecurity
            ? !security?.[
                disableBySecurity as keyof FileEntryDtoIntegerAllOfSecurity
              ]
            : false;
          return {
            ...item,
            isDisabled: item.isDisabled || isDisabledBySecurity,
          };
        });

      setHasNextPage(count === PAGE_COUNT);

      setSelectedItemSecurity?.(current.security ?? undefined);

      setSelectedTreeNode?.({
        ...current,
        path: response.pathParts,
      } as typeof current & { path: typeof response.pathParts });

      if (firstLoadRef.current || startIndex === 0) {
        // const { security } = current;

        // if (withCreate && security.Create) {
        //   setTotal(total + 1);
        //   const createItem: TSelectorItem = {
        //     isCreateNewItem: true,
        //     label: createDefineLabel ?? t("NewAgent"),
        //     id: "create-room-item",
        //     key: "create-room-item",
        //     hotkey: "r",
        //     // isRoomsOnly,

        //     onBackClick: () => {
        //       setIsRoot?.(true);
        //       setSelectedItemType?.(undefined);
        //       setBreadCrumbs?.((val) => {
        //         const newVal = [...val];

        //         newVal.pop();

        //         return newVal;
        //       });
        //       getRootData?.();
        //     },
        //   };

        //   createItem.onCreateClick = () =>
        //     addInputItem("", "", undefined, createDefineLabel, true);

        //   itemList.unshift(createItem);
        // } else {
        setTotal(total);
        // }
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
      apiClient,
      searchValue,
      setHasNextPage,
      setSelectedItemSecurity,
      setIsRoot,
      setIsInit,
      setIsFirstLoad,
      setIsNextPageLoading,
      subscribe,
      onSetBaseFolderPath,
      setBreadCrumbs,
      setIsBreadCrumbsLoading,
      setItems,
      setTotal,
      excludeItems,
      setSelectedTreeNode,
      disableBySecurity,
      t,
    ],
  );

  return { getAgentList };
};

export default useAgentsHelper;
