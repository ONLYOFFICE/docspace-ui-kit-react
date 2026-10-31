import { useContext, useEffect, useEffectEvent, useRef } from "react";

import { Scrollbar, type ScrollbarProps } from "../../scrollbar";
import { ASIDE_PADDING_AFTER_LAST_ITEM } from "../../../constants";
import { ListboxContext } from "../contexts/Listbox";

export const VirtualScroll = (props: ScrollbarProps) => {
  const scrollContentRef = useRef<HTMLDivElement | null>(null);
  const { label, activeOptionId, onKeyDown, onBlur } =
    useContext(ListboxContext);

  // The scroll container is the list's one Tab stop, a listbox whose options
  // the arrows move through (aria-activedescendant); the rows themselves
  // never take the focus, as only those near the viewport exist.
  useEffect(() => {
    const list = scrollContentRef.current;
    if (!list) return;

    list.setAttribute("role", "listbox");
    if (label) list.setAttribute("aria-label", label);
    else list.removeAttribute("aria-label");
    if (activeOptionId)
      list.setAttribute("aria-activedescendant", activeOptionId);
    else list.removeAttribute("aria-activedescendant");
  }, [label, activeOptionId]);

  // Body makes new handlers on every render, every arrow press among them:
  // the listeners call the current ones instead of being re-attached.
  const handleKeyDown = useEffectEvent((e: KeyboardEvent) => onKeyDown?.(e));

  const handleBlur = useEffectEvent((e: FocusEvent) => onBlur?.(e));

  useEffect(() => {
    const list = scrollContentRef.current;
    if (!list) return;

    list.addEventListener("keydown", handleKeyDown);
    list.addEventListener("blur", handleBlur);

    return () => {
      list.removeEventListener("keydown", handleKeyDown);
      list.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const isSearchInputFocused = document.activeElement?.closest(
      ".search-input-block",
    );

    // The list takes the focus on mount, putting the keyboard on no row yet:
    // Enter still submits, and the first arrow picks a row.
    // `preventScroll`: the list takes focus for the keyboard, not the page's
    // scroll position. Without it every selector that mounts scrolls the
    // page to itself -- on a Docs page with a dozen of them, to the bottom.
    if (!isSearchInputFocused) {
      scrollContentRef.current?.focus({ preventScroll: true });
    }
  }, []);

  return (
    <Scrollbar
      {...props}
      scrollClass="selector-body-scroll"
      paddingAfterLastItem={ASIDE_PADDING_AFTER_LAST_ITEM}
      contentRef={scrollContentRef}
      tabIndex={0}
    />
  );
};

VirtualScroll.displayName = "VirtualScroll";
