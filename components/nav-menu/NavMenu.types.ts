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

import React from "react";

import type { LinkRouterProps } from "../../types";

export type NavMenuLinkData = {
  path: string;
  state?: unknown;
};

export type NavSubItem = {
  id: string;
  label: string;
  icon?: string;
  iconNode?: React.ReactNode;
  onClick?: (item: NavSubItem) => void;
  linkData?: NavMenuLinkData;
  /**
   * Render a thin separator line above this sub-item. Used to group related
   * children (e.g., put Trash visually apart from Favorites without
   * splitting the sub-menu into multiple groups).
   */
  withTopSeparator?: boolean;
  showBadge?: boolean;
  labelBadge?: string | number;
  badgeComponent?: React.ReactNode;
  onClickBadge?: (id: string) => void;
};

export type NavMenuItem = {
  id: string;
  label: string;
  icon?: string;
  iconNode?: React.ReactNode;
  onClick?: (item: NavMenuItem) => void;
  children?: NavSubItem[];
  showBadge?: boolean;
  labelBadge?: string | number;
  badgeComponent?: React.ReactNode;
  onClickBadge?: (id: string) => void;
  linkData?: NavMenuLinkData;
};

export type NavMenuGroup = {
  id: string;
  label?: string;
  items: NavMenuItem[];
};

export type NavMenuProps = {
  groups: NavMenuGroup[];
  activeItemId?: string;
  defaultExpandedId?: string;
  withAnimation?: boolean;
  className?: string;
  LinkRouter?: React.ComponentType<LinkRouterProps>;
  iconOnly?: boolean;
};
