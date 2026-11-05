import { useContext, useEffect, useEffectEvent, useRef } from "react";

import { Scrollbar, type ScrollbarProps } from "../../scrollbar";
import { ASIDE_PADDING_AFTER_LAST_ITEM } from "../../../constants";
import { ListboxContext } from "../contexts/Listbox";

export const VirtualScroll = (props: ScrollbarProps) => {
  const scrollContentRef = useRef<HTMLDivElement | null>(null);
  const {
    label,
    multiselectable,
    activeOptionId,
    onKeyDown,
    onFocus,
    onBlur,
    onPointerDown,
  } = useContext(ListboxContext);

  // The scroll container is the list's one Tab stop, a listbox whose options
  // the arrows move through (aria-activedescendant); the rows themselves
  // never take the focus, as only those near the viewport exist.
  useEffect(() => {
    const list = scrollContentRef.current;
    if (!list) return;

    list.setAttribute("role", "listbox");
    if (label) list.setAttribute("aria-label", label);
    else list.removeAttribute("aria-label");
    if (multiselectable) list.setAttribute("aria-multiselectable", "true");
    else list.removeAttribute("aria-multiselectable");
  }, [label, multiselectable]);

  // The active option only while its row is drawn: Home, End or the wheel
  // take it past the rows react-window renders, and an id that names no
  // element is announced as nothing. Checked on every render - the list
  // renders again as it draws new rows - so it follows once the row is there.
  useEffect(() => {
    const list = scrollContentRef.current;
    if (!list) return;

    const option = activeOptionId
      ? document.getElementById(activeOptionId)
      : null;
    if (option && activeOptionId && list.contains(option)) {
      if (list.getAttribute("aria-activedescendant") !== activeOptionId)
        list.setAttribute("aria-activedescendant", activeOptionId);
    } else list.removeAttribute("aria-activedescendant");
  });

  // Body makes new handlers on every render, every arrow press among them:
  // the listeners call the current ones instead of being re-attached.
  const handleKeyDown = useEffectEvent((e: KeyboardEvent) => onKeyDown?.(e));

  const handleFocus = useEffectEvent(() => onFocus?.());
  const handleBlur = useEffectEvent((e: FocusEvent) => onBlur?.(e));
  const handlePointerDown = useEffectEvent((e: PointerEvent) =>
    onPointerDown?.(e),
  );

  useEffect(() => {
    const list = scrollContentRef.current;
    if (!list) return;

    list.addEventListener("keydown", handleKeyDown);
    list.addEventListener("focus", handleFocus);
    list.addEventListener("blur", handleBlur);
    list.addEventListener("pointerdown", handlePointerDown);

    return () => {
      list.removeEventListener("keydown", handleKeyDown);
      list.removeEventListener("focus", handleFocus);
      list.removeEventListener("blur", handleBlur);
      list.removeEventListener("pointerdown", handlePointerDown);
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
