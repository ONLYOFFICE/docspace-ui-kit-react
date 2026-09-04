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
