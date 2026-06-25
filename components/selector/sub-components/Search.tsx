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

import React, { use, useCallback } from "react";
import { SearchInput } from "../../search-input";
import { InputSize } from "../../text-input";

import { SearchContext, SearchDispatchContext } from "../contexts/Search";
import { BreadCrumbsContext } from "../contexts/BreadCrumbs";
import type { SearchProps } from "../Selector.types";

const Search = React.memo(({ isSearch }: SearchProps) => {
  const {
    searchPlaceholder,
    searchValue,
    isSearchLoading,
    searchLoader,
    withSearch,
    onClearSearch,
    onSearch,
  } = use(SearchContext);
  const setIsSearch = use(SearchDispatchContext);

  const { isBreadCrumbsLoading, bodyIsLoading } = use(BreadCrumbsContext);

  const onClearSearchAction = useCallback(() => {
    onClearSearch?.(() => setIsSearch(false));
  }, [onClearSearch, setIsSearch]);

  const onSearchAction = useCallback(
    (data: string) => {
      const v = data.trim();

      if (v === "") return onClearSearchAction();

      onSearch?.(v, () => setIsSearch(true));
    },
    [onClearSearchAction, onSearch, setIsSearch],
  );

  if (isBreadCrumbsLoading || isSearchLoading || (!isSearch && bodyIsLoading))
    return searchLoader;

  if (!withSearch || !isSearch) return null;

  return (
    <SearchInput
      className="search-input selector-search-input"
      placeholder={searchPlaceholder}
      value={searchValue ?? ""}
      onChange={onSearchAction}
      onClearSearch={onClearSearchAction}
      size={InputSize.base}
      dataTestId="selector_search_input"
      tabIndex={1}
    />
  );
});

Search.displayName = "Search";

export { Search };
