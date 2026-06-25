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

import React from "react";
import { isTablet, isIOS } from "react-device-detect";

import { InputSize } from "../../text-input";
import { SearchInput } from "../../search-input";

import { SearchInputProps } from "../Filter.types";

const useSearch = ({
  onSearch,
  onClearFilter,
  clearSearch,
  setClearSearch,
  getSelectedInputValue,
  placeholder,
  isIndexEditingMode,

  initSearchValue,
  showMainButton,
  mainButtonProps,
  mainButtonIcon,
}: SearchInputProps) => {
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState(initSearchValue ?? "");
  const [caretPosition, setCaretPosition] = React.useState({
    start: 0,
    end: 0,
  });

  const onClearSearch = React.useCallback(() => {
    onSearch?.("");
  }, [onSearch]);

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isTablet && isIOS) {
      const scrollEvent = () => {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo(0, 0);
        window.onscroll = () => {};
      };

      window.onscroll = scrollEvent;
    }
  };

  React.useEffect(() => {
    if (clearSearch) {
      setInputValue("");
      onClearFilter?.();
      setClearSearch(false);
    }
  }, [clearSearch, onClearFilter, setClearSearch]);

  React.useEffect(() => {
    const value = getSelectedInputValue?.();
    if (value && searchRef.current) {
      searchRef.current.focus();
    }
    searchRef.current?.setSelectionRange(
      caretPosition.start,
      caretPosition.end,
    );

    setInputValue(value);
  }, [getSelectedInputValue]);

  const onChange = React.useCallback(
    (value: string) => {
      onSearch?.(value);
      setCaretPosition({
        start: searchRef.current?.selectionStart || 0,
        end: searchRef.current?.selectionEnd || 0,
      });
    },
    [onSearch],
  );

  const searchComponent = (
    <SearchInput
      forwardedRef={searchRef}
      placeholder={placeholder}
      value={inputValue}
      onChange={onChange}
      onClearSearch={onClearSearch}
      id="filter_search-input"
      size={InputSize.base}
      isDisabled={isIndexEditingMode}
      onFocus={onInputFocus}
      scale
      dataTestId="filter_search_input"
      showMainButton={showMainButton}
      mainButtonProps={mainButtonProps}
      mainButtonIcon={mainButtonIcon}
    />
  );
  return { searchComponent };
};

export default useSearch;
