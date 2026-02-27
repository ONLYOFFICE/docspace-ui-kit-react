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

import EmptyScreenGroupLight from "../../assets/empty.groups.light.react.svg";
import EmptyScreenGroupDark from "../../assets/empty.groups.dark.react.svg";

import { useApi } from "../../providers/api/ApiProvider";
import { getCommonTranslation } from "../../utils/i18n";
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
  const onSearch = useCallback((value: string, callback?: () => void) => {
    isFirstLoad.current = true;
    afterSearch.current = true;
    setSearchValue(() => {
      return value;
    });
    callback?.();
  }, []);

  const onClearSearch = useCallback((callback?: () => void) => {
    isFirstLoad.current = true;
    afterSearch.current = true;
    setSearchValue(() => {
      return "";
    });
    callback?.();
  }, []);

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
        headerLabel: headerProps?.headerLabel || getCommonTranslation("Groups"),
      }}
      alwaysShowFooter={itemsList.length !== 0 || Boolean(searchValue)}
      withSearch
      searchPlaceholder={getCommonTranslation("Search")}
      onSearch={onSearch}
      searchValue={searchValue}
      onClearSearch={onClearSearch}
      isSearchLoading={false}
      disableSubmitButton={!selectedItem}
      isMultiSelect={false}
      items={itemsList}
      submitButtonLabel={getCommonTranslation("SelectAction")}
      onSubmit={onSubmitAction}
      emptyScreenImage={emptyScreenImg}
      emptyScreenHeader={getCommonTranslation("NotFoundGroups")}
      emptyScreenDescription={getCommonTranslation("GroupsNotFoundDescription")}
      searchEmptyScreenImage={emptyScreenImg}
      searchEmptyScreenHeader={getCommonTranslation("NotFoundGroups")}
      searchEmptyScreenDescription={getCommonTranslation(
        "GroupsNotFoundDescription",
      )}
      totalItems={totalRef.current}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={onLoadNextPage}
      isLoading={isFirstLoad.current}
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
