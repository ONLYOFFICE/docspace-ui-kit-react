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

      const res = await groupApi.getGroups({
        count: pageCount,
        startIndex,
        filterValue: searchValue,
      });

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
