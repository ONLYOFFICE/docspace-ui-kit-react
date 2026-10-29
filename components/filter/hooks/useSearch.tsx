import React from "react";
import { isTablet, isIOS } from "react-device-detect";

import { InputSize } from "../../text-input";
import { SearchInput } from "../../search-input";

import { SearchInputProps } from "../Filter.types";

// How many unreported queries are remembered. A host that never reports its
// value back would otherwise grow the list for as long as the user types.
const MAX_PENDING_QUERIES = 20;

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
  hideSearch,
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
  // order, oldest first and capped at MAX_PENDING_QUERIES. When the host
  // reports one of them other than the newest, that is a stale echo of a
  // query the user has already replaced, and it is not pushed into the field.
  const sentRef = React.useRef<string[]>([]);

  const send = React.useCallback(
    (value: string) => {
      sentRef.current.push(value);
      if (sentRef.current.length > MAX_PENDING_QUERIES)
        sentRef.current = sentRef.current.slice(-MAX_PENDING_QUERIES);
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
      // The field is empty now: a host that puts back the value it had
      // before the clear is a change again, not a repeat.
      lastAppliedRef.current = "";
      setInputValue("");
      onClearFilter?.();
      setClearSearch(false);
    }
  }, [clearSearch, onClearFilter, setClearSearch]);

  React.useEffect(() => {
    const value = getSelectedInputValue?.() ?? "";

    // Match the newest pending query of that value. The portal aborts a
    // search the user has replaced, so it often reports only the last of
    // them: with "a", "ab", "a" sent, a lone "a" is that last query, and
    // everything before it is settled. The cost falls on a host that reports
    // every query in order: its late "ab" then reads as a value of its own.
    const sent = sentRef.current;
    const sentIndex = sent.lastIndexOf(value);

    // The value the field already took brings nothing new to the field, but
    // it still settles the queries up to it: a burst that ends where it
    // started ("a", then "ab", "a") is reported as that same "a", and an
    // "ab" left pending would hide the host's own "ab" later on. The getter
    // also changes for reasons of its own (another filter), and that repeat
    // cannot be told from the echo: it settles the queries too, so a late
    // "ab" the host applied before aborting it shows for a moment, until the
    // "a" that follows it. Briefly wrong beats an "ab" refused for good.
    if (value === lastAppliedRef.current) {
      if (sentIndex !== -1) sentRef.current = sent.slice(sentIndex + 1);
      return;
    }
    lastAppliedRef.current = value;
    if (sentIndex !== -1 && sentIndex < sent.length - 1) {
      // The host applied a query the user has since replaced: drop it and
      // everything sent before it, and leave the field as the user left it.
      sentRef.current = sent.slice(sentIndex + 1);
      return;
    }
    // The newest query reported back, or a value of the host's own.
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
      hideField={hideSearch}
    />
  );
  return { searchComponent };
};

export default useSearch;
