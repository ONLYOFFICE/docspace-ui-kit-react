import React, { use, useCallback } from "react";
import { SearchInput } from "../../search-input";
import { InputSize } from "../../text-input";

import { SearchContext, SearchDispatchContext } from "../contexts/Search";
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

  if (isSearchLoading)
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
