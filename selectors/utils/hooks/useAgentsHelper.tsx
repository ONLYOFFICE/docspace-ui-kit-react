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
import { convertRoomsToItems, buildSpecialFolderItems } from "..";
import { useCommonTranslation } from "../../../utils/i18n";

const useAgentsHelper = ({
  setHasNextPage,
  setTotal,
  setItems,
  setBreadCrumbs,
  setIsRoot,
  onSetBaseFolderPath,

  searchValue,

  isInit,
  setIsInit,
  excludeItems,
  subscribe,
  setSelectedItemSecurity,
  setSelectedTreeNode,
  disableBySecurity,
  setIsContentLoading,

  recentFolder,
  favoritesFolder,
  withRecentTreeFolder,
  withFavoritesTreeFolder,
}: UseAgentsHelperProps) => {
  const t = useCommonTranslation();
  const { apiClient } = useApi();
  const {
    setIsNextPageLoading,
    setIsLoading,
    setIsFirstLoad,

    isFirstLoad,
  } = use(LoadersContext);

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

      try {
        const startIndex = sIndex;

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

          onSetBaseFolderPath?.(breadCrumbs);

          setBreadCrumbs?.(breadCrumbs);

          setIsLoading("breadcrumbs", false);
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
          setTotal(total);

          if (
            startIndex === 0 &&
            !searchValue &&
            (withRecentTreeFolder || withFavoritesTreeFolder)
          ) {
            const specialItems = buildSpecialFolderItems({
              section: "agents",
              recentFolder,
              favoritesFolder,
              withRecent: withRecentTreeFolder,
              withFavorites: withFavoritesTreeFolder,
              withSeparator: itemList.length > 0,
              t,
            });

            if (specialItems.length) {
              itemList.unshift(...specialItems);
              setTotal(total + specialItems.length);
            }
          }

          setItems?.(itemList);
        } else {
          setItems?.((prevState) => {
            if (prevState) return [...prevState, ...itemList];
            return [...itemList];
          });
        }

        setIsRoot?.(false);
        setIsInit(false);
        setIsFirstLoad(false);
      } finally {
        requestRunning.current = false;
        setIsNextPageLoading(false);
        setIsContentLoading?.(false);
      }
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
      setIsLoading,
      setItems,
      setTotal,
      excludeItems,
      setSelectedTreeNode,
      disableBySecurity,
      t,
      recentFolder,
      favoritesFolder,
      withRecentTreeFolder,
      withFavoritesTreeFolder,
      setIsContentLoading,
    ],
  );

  return { getAgentList };
};

export default useAgentsHelper;
