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

import { useCallback, useRef, useState } from "react";

import EmptyScreenGroupLight from "../../assets/emptyview/empty.groups.light.svg";
import EmptyScreenGroupDark from "../../assets/emptyview/empty.groups.dark.svg";

import { useApi } from "../../providers/api/ApiProvider";
import { useCommonTranslation } from "../../utils/i18n";
import {
  RowLoader,
  SearchLoader,
  Selector,
  type TSelectorItem,
  type TSelectorWithAside,
} from "../../components/selector";
import { useTheme } from "../../context/ThemeContext";

import type { GroupsSelectorProps } from "./GroupsSelector.types";

const GroupsSelector = (props: GroupsSelectorProps) => {
  const {
    id,
    className,

    headerProps,

    useAside,
    onClose,
    withoutBackground,
    withBlur,

    onSubmit,
  } = props;

  const t = useCommonTranslation();
  const { groupApi } = useApi();
  const { isBase } = useTheme();

  const emptyScreenImg = isBase ? (
    <EmptyScreenGroupLight />
  ) : (
    <EmptyScreenGroupDark />
  );

  const [searchValue, setSearchValue] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [itemsList, setItemsList] = useState<TSelectorItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<TSelectorItem | null>(null);
  const [isContentLoading, setIsContentLoadingRaw] = useState(false);
  const [wasEmptyScreen, setWasEmptyScreen] = useState(false);

  const setIsContentLoading = useCallback((value: boolean) => {
    setIsContentLoadingRaw(value);
    if (!value) {
      setWasEmptyScreen(false);
    }
  }, []);

  const isFirstLoad = useRef(true);
  const afterSearch = useRef(false);
  const totalRef = useRef(0);

  const onSelect = (
    item: TSelectorItem,
    isDoubleClick: boolean,
    doubleClickCallback: () => void,
  ) => {
    setSelectedItem((el) => {
      if (el?.id === item.id) return null;

      return item;
    });

    if (isDoubleClick) {
      doubleClickCallback();
    }
  };
  const onSearch = useCallback(
    (value: string, callback?: () => void) => {
      afterSearch.current = true;
      if (isFirstLoad.current) {
        isFirstLoad.current = true;
      } else {
        setIsContentLoading(true);
      }
      setSearchValue(() => {
        return value;
      });
      callback?.();
    },
    [setIsContentLoading],
  );

  const onClearSearch = useCallback(
    (callback?: () => void) => {
      afterSearch.current = true;
      if (isFirstLoad.current) {
        isFirstLoad.current = true;
      } else {
        if (itemsList.length === 0) {
          setWasEmptyScreen(true);
        }
        setIsContentLoading(true);
      }
      setSearchValue(() => {
        return "";
      });
      callback?.();
    },
    [setIsContentLoading, itemsList.length],
  );

  const onSubmitAction = useCallback(
    (items: TSelectorItem[]) => {
      onSubmit?.(items);
    },
    [onSubmit],
  );

  const onLoadNextPage = useCallback(
    async (startIndex: number) => {
      const pageCount = 100;
      setIsNextPageLoading(true);

      const res = await groupApi.getGroups(
        undefined,
        undefined,
        pageCount,
        startIndex,
        undefined,
        undefined,
        searchValue,
      );

      const items = res.data.response ?? [];
      const total = res.data.count ?? 0;

      const convertedItems: TSelectorItem[] = items.map((group) => ({
        id: group.id,
        label: group.name ?? "",
        name: group.name ?? "",
        isGroup: true,
      }));

      if (isFirstLoad.current) {
        totalRef.current = total;
        setItemsList([...convertedItems]);
        setHasNextPage(convertedItems.length < total);

        isFirstLoad.current = false;
      } else {
        setItemsList((value) => {
          const arr = [...value, ...convertedItems];
          setHasNextPage(arr.length < total);
          return arr;
        });
        isFirstLoad.current = false;
      }

      setIsNextPageLoading(false);
      setIsContentLoading(false);
    },
    [searchValue, groupApi],
  );

  const withAside: TSelectorWithAside = useAside
    ? { useAside, onClose, withBlur, withoutBackground }
    : {};

  return (
    <Selector
      id={id}
      className={className}
      withHeader
      {...withAside}
      headerProps={{
        ...headerProps,
        onCloseClick: headerProps?.onCloseClick ?? onClose ?? (() => {}),
        headerLabel: headerProps?.headerLabel || t("Groups"),
      }}
      alwaysShowFooter={itemsList.length !== 0 || Boolean(searchValue)}
      withSearch
      searchPlaceholder={t("Search")}
      onSearch={onSearch}
      searchValue={searchValue}
      onClearSearch={onClearSearch}
      isSearchLoading={false}
      disableSubmitButton={!selectedItem}
      isMultiSelect={false}
      items={itemsList}
      submitButtonLabel={t("SelectAction")}
      onSubmit={onSubmitAction}
      emptyScreenImage={emptyScreenImg}
      emptyScreenHeader={t("NotFoundGroups")}
      emptyScreenDescription={t("GroupsNotFoundDescription")}
      searchEmptyScreenImage={emptyScreenImg}
      searchEmptyScreenHeader={t("NotFoundGroups")}
      searchEmptyScreenDescription={t("GroupsNotFoundDescription")}
      totalItems={totalRef.current}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={onLoadNextPage}
      isLoading={isFirstLoad.current || isContentLoading}
      isContentLoading={isContentLoading}
      wasEmptyScreen={wasEmptyScreen}
      searchLoader={<SearchLoader />}
      onSelect={onSelect}
      rowLoader={
        <RowLoader
          isMultiSelect={false}
          isContainer={isFirstLoad.current}
          isUser={false}
        />
      }
      dataTestId="groups_selector"
    />
  );
};

export default GroupsSelector;
