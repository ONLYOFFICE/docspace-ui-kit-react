import { useContext, useEffect, useEffectEvent, useRef } from "react";

import { Scrollbar, type ScrollbarProps } from "../../scrollbar";
import { ASIDE_PADDING_AFTER_LAST_ITEM } from "../../../constants";
import { ListboxContext } from "../contexts/Listbox";

export const VirtualScroll = (props: ScrollbarProps) => {
  const scrollContentRef = useRef<HTMLDivElement | null>(null);
  const { activeOptionId, onKeyDown, onFocus, onBlur } =
    useContext(ListboxContext);

  // The scroll container is the list's one Tab stop, a listbox whose options
  // the arrows move through (aria-activedescendant); the rows themselves
  // never take the focus, as only those near the viewport exist.
  useEffect(() => {
    const list = scrollContentRef.current;
    if (!list) return;

    list.setAttribute("role", "listbox");
    if (activeOptionId)
      list.setAttribute("aria-activedescendant", activeOptionId);
    else list.removeAttribute("aria-activedescendant");
  }, [activeOptionId]);

  // Body makes new handlers on every render, every arrow press among them:
  // the listeners call the current ones instead of being re-attached.
  const handleKeyDown = useEffectEvent((e: KeyboardEvent) => onKeyDown?.(e));
  const handleFocus = useEffectEvent(() => onFocus?.());
  const handleBlur = useEffectEvent((e: FocusEvent) => onBlur?.(e));

  useEffect(() => {
    const list = scrollContentRef.current;
    if (!list) return;

    list.addEventListener("keydown", handleKeyDown);
    list.addEventListener("focus", handleFocus);
    list.addEventListener("blur", handleBlur);

    return () => {
      list.removeEventListener("keydown", handleKeyDown);
      list.removeEventListener("focus", handleFocus);
      list.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const isSearchInputFocused = document.activeElement?.closest(
      ".search-input-block",
    );

    // After the listeners above, so the list's own focus handler sees this
    // focus and puts the keyboard on a row at once.
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
