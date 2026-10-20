import React, { use } from "react";

import {
  FolderType,
  type FolderDtoInteger,
  type FileEntryDtoIntegerAllOfSecurity,
} from "@onlyoffice/docspace-api-sdk";
import type { TSelectorItem, TBreadCrumb } from "../../../components/selector";
import { toastr, type TData } from "../../../components/toast";

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
  setSelectedItemType,
  getRootData,
  onSetBaseFolderPath,

  searchValue,
  onCreateAIAgent,

  isInit,
  setIsInit,
  excludeItems,
  subscribe,
  setSelectedItemSecurity,
  setSelectedTreeNode,
  disableBySecurity,

  recentFolder,
  favoritesFolder,
  withRecentTreeFolder,
  withFavoritesTreeFolder,
}: UseAgentsHelperProps) => {
  const t = useCommonTranslation();
  const { apiClient } = useApi();
  const {
    setIsNextPageLoading,
    hideSectionLoader,
    finishFullLoad,

    isFullLoadActive,
  } = use(LoadersContext);

  const requestRunning = React.useRef(false);
  const initRef = React.useRef(isInit);
  const firstLoadRef = React.useRef(isFullLoadActive);
  const specialItemsCountRef = React.useRef(0);

  React.useEffect(() => {
    firstLoadRef.current = isFullLoadActive;
  }, [isFullLoadActive]);

  React.useEffect(() => {
    initRef.current = isInit;
  }, [isInit]);

  const getAgentList = React.useCallback(
    async (sIndex: number) => {
      if (requestRunning.current) return;

      requestRunning.current = true;
      setIsNextPageLoading(true);

      try {
        const startIndex =
          sIndex > 0 ? Math.max(0, sIndex - specialItemsCountRef.current) : 0;

        const filterValue = searchValue || "";

        const page = startIndex / PAGE_COUNT;

        const params = new URLSearchParams({
          page: String(page),
          count: String(PAGE_COUNT),
          // The Node AI service expects the .NET enum name (the same string
          // RoomsFilter sends), not the numeric SearchArea value.
          searchArea: "AiAgents",
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

          hideSectionLoader("breadcrumbs");
        }

        const itemList: TSelectorItem[] = convertRoomsToItems(folders, t)
          .filter((x) => (excludeItems ? !excludeItems.includes(x.id) : true))
          .map((item) => {
            const security = item.security as
              FileEntryDtoIntegerAllOfSecurity | undefined;
            // The Files selector passes one right for both files and agents.
            // A file-only right (AskAi in the chat attach picker) is never
            // on a folder's security, so it must not gate the agent itself —
            // otherwise every agent is disabled and cannot be opened.
            const key =
              disableBySecurity as keyof FileEntryDtoIntegerAllOfSecurity;
            const isDisabledBySecurity = disableBySecurity
              ? !security || (key in security && !security[key])
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

          if (startIndex === 0) specialItemsCountRef.current = 0;

          // Counted with the special items: none of them is a server row, so
          // the next page's offset must leave all of them out.
          if (startIndex === 0 && onCreateAIAgent && current.security?.Create) {
            itemList.unshift({
              isCreateNewItem: true,
              label: t("NewAgent"),
              id: "create-agent-item",
              key: "create-agent-item",
              onCreateClick: onCreateAIAgent,
              onBackClick: () => {
                setIsRoot?.(true);
                setSelectedItemType?.(undefined);
                setBreadCrumbs?.((val) => val.slice(0, -1));
                getRootData?.();
              },
            });
            specialItemsCountRef.current = 1;
            setTotal(total + 1);
          }

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
              folderType: FolderType.AiRoom,
              withSeparator: itemList.length > 0,
              t,
            });

            if (specialItems.length) {
              itemList.unshift(...specialItems);
              specialItemsCountRef.current += specialItems.length;
              setTotal(total + specialItemsCountRef.current);
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
      } catch (error) {
        toastr.error(error as TData);
      } finally {
        requestRunning.current = false;
        setIsNextPageLoading(false);
        // Also ends the content refresh; skipping it on the error path would
        // leave the skeleton on screen and hideSectionLoader a permanent no-op
        finishFullLoad();
      }
    },
    [
      apiClient,
      searchValue,
      setHasNextPage,
      setSelectedItemSecurity,
      setIsRoot,
      setIsInit,
      setIsNextPageLoading,
      subscribe,
      onSetBaseFolderPath,
      setBreadCrumbs,
      hideSectionLoader,
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
      finishFullLoad,
      onCreateAIAgent,
      setSelectedItemType,
      getRootData,
    ],
  );

  return { getAgentList };
};

export default useAgentsHelper;
