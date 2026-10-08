import type React from "react";
import { TTabsHotkey } from "../../Tabs.types";

/**
 * Keyboard model of the segmented bar, scoped to its own tab list: the
 * returned handler goes on the `role="tablist"` element, so it only sees keys
 * pressed while focus is on one of this bar's tabs. Nothing is registered on
 * `window`, so Tab is never taken and two bars never react to each other.
 *
 * Left and Right move the focus (swapped in a right-to-left layout) and wrap
 * at either end, Home and End jump to the first and last tab, Enter and Space
 * select the focused one.
 */
const useTabsHotkeys = ({
  items,
  focusedTabIndex,
  focusTab,
  selectTab,
}: TTabsHotkey) => {
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

    const count = items.length;
    if (!count) return;

    const isRtl =
      typeof window !== "undefined" &&
      window.getComputedStyle(e.currentTarget).direction === "rtl";

    const next = focusedTabIndex >= count - 1 ? 0 : focusedTabIndex + 1;
    const prev = focusedTabIndex <= 0 ? count - 1 : focusedTabIndex - 1;

    switch (e.key) {
      case "ArrowRight":
        focusTab(isRtl ? prev : next);
        break;
      case "ArrowLeft":
        focusTab(isRtl ? next : prev);
        break;
      case "Home":
        focusTab(0);
        break;
      case "End":
        focusTab(count - 1);
        break;
      case "Enter":
      case " ":
        selectTab(focusedTabIndex);
        break;
      default:
        return;
    }

    e.preventDefault();
    e.stopPropagation();
  };

  return { onKeyDown };
};

export default useTabsHotkeys;
