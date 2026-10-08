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
  // The host's value as last taken into the field. A getter of a new identity
  // that returns the same value brings nothing new and must not overwrite an
  // edit the user has made since.
  const lastAppliedRef = React.useRef<string | undefined>(undefined);
  // Every query sent to `onSearch` that the host has not reported back yet, in
  // order. When the host reports an older one of them, that is a stale echo of
  // a query the user has already replaced, and it is not pushed into the field.
  const sentRef = React.useRef<string[]>([]);

  const send = React.useCallback(
    (value: string) => {
      sentRef.current.push(value);
      // Keep the field's value in step with what the user typed, so that a
      // later push of a host value is a real change and not a stale one.
      setInputValue(value);
      onSearch?.(value);
    },
    [onSearch],
  );

  const onClearSearch = React.useCallback(() => {
    send("");
  }, [send]);

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
      sentRef.current = [];
      setInputValue("");
      onClearFilter?.();
      setClearSearch(false);
    }
  }, [clearSearch, onClearFilter, setClearSearch]);

  React.useEffect(() => {
    const value = getSelectedInputValue?.() ?? "";

    if (value === lastAppliedRef.current) return;
    lastAppliedRef.current = value;

    const sent = sentRef.current;
    const sentIndex = sent.lastIndexOf(value);
    if (sentIndex !== -1 && sentIndex < sent.length - 1) {
      // The host applied a query the user has since replaced: drop it and
      // everything sent before it, and leave the field as the user left it.
      sentRef.current = sent.slice(sentIndex + 1);
      return;
    }
    sentRef.current = [];

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
      send(value);
      setCaretPosition({
        start: searchRef.current?.selectionStart || 0,
        end: searchRef.current?.selectionEnd || 0,
      });
    },
    [send],
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
