import { useEffect, useCallback } from "react";
import { useHotkeys, Options } from "react-hotkeys-hook";
import { isMobile } from "react-device-detect";
import { TTabsHotkey } from "../../Tabs.types";

const useTabsHotkeys = ({
  enabledHotkeys,
  setHotkeysIsActive,
  items,
  focusedTabIndex,
  setFocusedTabIndex,
  scrollToTab,
  onSelect,
  hotkeysId,
}: TTabsHotkey) => {
  const activateHotkeys = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Tab" && !isMobile) {
        e.preventDefault();

        const tabsElement = document.getElementsByClassName(
          `secondary-tabs-scroll-${hotkeysId}`,
        );

        (tabsElement[0] as HTMLElement)?.focus();
        setHotkeysIsActive(!enabledHotkeys);
      }
    },
    [enabledHotkeys, setHotkeysIsActive, hotkeysId],
  );

  const setFocusedTab = (index: number) => {
    setFocusedTabIndex(index);
    scrollToTab(index);
  };

  const focusNextTab = () => {
    if (focusedTabIndex === items.length - 1) setFocusedTab(0);
    else setFocusedTab(focusedTabIndex + 1);
  };

  const focusPrevTab = () => {
    if (focusedTabIndex === 0) setFocusedTab(items.length - 1);
    else setFocusedTab(focusedTabIndex - 1);
  };

  const onSelectTab = (e: KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect?.(items[focusedTabIndex]);
  };

  const focusFirstTab = () => {
    setFocusedTab(0);
  };
  const focusLastTab = () => {
    setFocusedTab(items.length - 1);
  };

  const hotkeysFilter = {
    filter: (ev: KeyboardEvent) => {
      const eElement = ev.target as HTMLElement;
      const eInputElement = ev.target as HTMLInputElement;
      return (
        eInputElement?.type === "checkbox" || eElement?.tagName !== "INPUT"
      );
    },
    filterPreventDefault: false,
    enableOnTags: ["INPUT"],
    enabled: enabledHotkeys,
  } as Options;

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (enabledHotkeys) {
        const isDefaultKeys =
          [
            "PageUp",
            "PageDown",
            "Home",
            "End",
            "Space",
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
          ].indexOf(e.code) > -1;

        if (isDefaultKeys) {
          e.preventDefault();
        }
      }

      activateHotkeys(e);
    },
    [activateHotkeys],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  useHotkeys(
    "*",
    (e: KeyboardEvent) => {
      if (e.shiftKey || e.ctrlKey) return;

      switch (e.key) {
        case "ArrowRight": {
          return focusNextTab();
        }

        case "ArrowLeft": {
          return focusPrevTab();
        }

        default:
          break;
      }
    },
    hotkeysFilter,
  );

  // Select focused tab
  useHotkeys("Enter, Space", onSelectTab, hotkeysFilter);

  // Focus first tab
  useHotkeys("Home", focusFirstTab, hotkeysFilter);

  // Focus last tab
  useHotkeys("End", focusLastTab, hotkeysFilter);
};

export default useTabsHotkeys;
