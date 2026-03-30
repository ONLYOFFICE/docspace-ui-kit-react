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
    setIsLoading,
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
      setIsLoading,
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
