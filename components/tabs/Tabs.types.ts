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

import { TabsTypes } from "./Tabs.enums";

export type TTabItem = {
  /** Element id. */
  id: string;
  /** Tab text. */
  name: string | React.ReactNode;
  /** Content that is shown when you click on the tab. */
  content: React.ReactNode;
  /** State of tab inclusion. State only works for tabs with a secondary theme. */
  isDisabled?: boolean;
  /** Sets a callback function that is triggered when the tab is selected */
  onClick?: () => void | Promise<void>;
  /** Badge shown after tab. Only for primary tabs type */
  badge?: React.ReactNode;

  value?: number;
  /** Icon name. Only for secondary tabs type */
  iconName?: string;
};

export type TabsProps = {
  /** Child elements. */
  items: TTabItem[];
  /** Selected item of tabs. */
  selectedItemId: number | string;
  /** Theme for displaying tabs. */
  type?: TabsTypes;
  /** Tab indentation for sticky positioning. */
  stickyTop?: string;
  /** Sets a tab class name */
  className?: string;
  /** Sets a callback function that is triggered when the tab is selected. */
  onSelect?: (element: TTabItem) => void;
  /** Disables sticky indent */
  withoutStickyIntend?: boolean;
  /** Accepts css style  */
  style?: React.CSSProperties;
  /** If set, this component will animate changes to its layout. Additionally, when a new element enters the DOM and an element already exists with a matching layoutId, it will animate out from the previous element's size/position. */
  layoutId?: string;
  /** Is loading */
  isLoading?: boolean;
  /** Scales tabs to container width */
  scaled?: boolean;
  /** Unique identifier for hotkey functionality */
  hotkeysId?: string;
  /** Element id */
  id?: string;
  /** Enables animation for tab transitions */
  withAnimation?: boolean;
  /** Content rendered sticky above the tab bar */
  stickyHeader?: React.ReactNode;
};

export type TTabsHotkey = {
  /** Determines whether keyboard hotkeys are enabled for tab navigation */
  enabledHotkeys: boolean;
  /** Sets the active state of hotkeys */
  setHotkeysIsActive: (focusedTabIndex: boolean) => void;
  /** Tab items to be rendered */
  items: TTabItem[];
  /** Index of the currently focused tab */
  focusedTabIndex: number;
  /** Sets the index of the focused tab */
  setFocusedTabIndex: (focusedTabIndex: number) => void;
  /**  Scrolls to bring a specific tab into view */
  scrollToTab: (index: number) => void;
  /** Sets a callback function that is triggered when the tab is selected */
  onSelect?: (element: TTabItem) => void;
  /** Unique identifier for hotkey functionality */
  hotkeysId?: string;
};
