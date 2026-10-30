import { useEffect, useRef } from "react";

import { Scrollbar, type ScrollbarProps } from "../../scrollbar";
import { ASIDE_PADDING_AFTER_LAST_ITEM } from "../../../constants";

export const VirtualScroll = (props: ScrollbarProps) => {
  const scrollContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isSearchInputFocused = document.activeElement?.closest(
      ".search-input-block",
    );

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
    />
  );
};

VirtualScroll.displayName = "VirtualScroll";
