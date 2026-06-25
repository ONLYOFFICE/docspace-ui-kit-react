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

export type TArticleLinkDataState =
  | {
      title: string;
      isRoot: boolean;
      isPublicRoomType: boolean;
      rootFolderType: number;
      canCreate: boolean;
    }
  | object;

export type TArticleLinkData = {
  path: string;
  state: TArticleLinkDataState;
};

type PickedDivProps = Pick<
  React.ComponentProps<"div">,
  "id" | "className" | "style"
>;

export interface ArticleItemType {
  isRoom?: boolean;
  rootFolderType?: string;
  id?: string;
  roomType?: string;
  title?: string;
  shared?: boolean;
  external?: boolean;
  security?: {
    canCreate: boolean;
  };
}

export type ArticleItemProps = PickedDivProps & {
  /** Catalog item icon */
  icon?: string;
  /** Catalog item text */
  text: string;
  /** Sets the catalog item to display text */
  showText?: boolean;
  /** Invokes a function upon clicking on a catalog item */
  onClick?: (e: React.MouseEvent, id?: string) => void;
  /** Invokes a function upon dragging and dropping a catalog item */
  onDrop?: (id?: string, text?: string, item?: ArticleItemType) => void;
  /** Tells when the catalog item should display initial on icon, text should be hidden */
  showInitial?: boolean;
  /** Sets the catalog item as end of block */
  isEndOfBlock?: boolean;
  /** Sets catalog item active */
  isActive?: boolean;
  /** Sets the catalog item available for drag`n`drop */
  isDragging?: boolean;
  /** Sets the catalog item active for drag`n`drop */
  isDragActive?: boolean;
  /** Sets the catalog item to display badge */
  showBadge?: boolean;
  /** Label in catalog item badge */
  labelBadge?: string | number;
  /** Sets custom badge icon */
  iconBadge?: string;
  /** Invokes a function upon clicking on the catalog item badge */
  onClickBadge?: (id?: string) => void;
  /** Sets the catalog item to be displayed as a header */
  isHeader?: boolean;
  /** Disables margin top for catalog item header */
  isFirstHeader?: boolean;
  /** Accepts folder id */
  folderId?: string;
  /** Title for the badge tooltip */
  badgeTitle?: string;
  /** Custom badge component */
  badgeComponent?: React.ReactNode;
  /** Title for the item tooltip */
  title?: string;
  /** Link data for routing */
  linkData: TArticleLinkData;
  /** Item data */
  item?: ArticleItemType;
  /** Catalog item icon for SSR */
  iconNode?: React.ReactNode;
  withAnimation?: boolean;
  dataTooltipId?: string;
  isDisabled?: boolean;
};
