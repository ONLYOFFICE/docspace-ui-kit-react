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
