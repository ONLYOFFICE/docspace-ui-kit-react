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

import type { TDirectionY } from "../../types";

export type TagProps = {
  /** Accepts the ref */
  ref?: React.RefObject<HTMLDivElement | null>;
  /** Accepts the tag id */
  tag: string;
  /** Accepts the tag label */
  label?: string;
  /** Accepts class */
  className?: string;
  /** Accepts id */
  id?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Accepts the tag styles as new and adds the delete button */
  isNewTag?: boolean;
  /** Accepts the tag styles as disabled and disables clicking */
  isDisabled?: boolean;
  /** Accepts the tag styles as deleted and disables clicking */
  isDeleted?: boolean;
  /** Accepts the function that is called when the tag is clicked */
  onClick?: (tag: TagClickEvent) => void;
  /** Accepts the function that ist called when the tag delete button is clicked */
  onDelete?: (tag?: string) => void;
  /** Accepts the max width of the tag */
  tagMaxWidth?: string;
  /** Accepts the icon associated with the tag */
  icon?: string | React.FC<React.SVGProps<SVGSVGElement>>;
  /** Accepts the icon class name */
  iconClassName?: string;
  /** Indicates if the tag is a default tag */
  isDefault?: boolean;
  /** Indicates if the tag is the last in a series */
  isLast?: boolean;
  /** Determines whether to show a remove icon for the tag */
  roomType?: number;
  /** Indicates the type of provider associated with the tag */
  providerType?: number;
  /** Data test id for the tag */
  dataTestId?: string;
  /** Mouse enter event handler */
  onMouseEnter?: () => void;
  /** Mouse leave event handler */
  onMouseLeave?: () => void;
  /** Accepts the tag label */
  withLabel?: boolean;
};

export type TagType = {
  /** Accepts a unique key for the tag. */
  key?: string;
  /** Indicates if the tag is a default tag. */
  isDefault?: boolean;
  /** Indicates if the tag is associated with a third-party provider. */
  isThirdParty?: boolean;
  /** Accepts the tag label */
  label: string;
  /** Accepts the max width of the tag */
  maxWidth?: string;
  /** Accepts the dropdown options */
  advancedOptions?: string[];
  /** Accepts the tag styles as disabled and disables clicking */
  isDisabled?: boolean;
  /** Indicates the type of room associated with the tag. */
  roomType?: number;
  /** Accepts the icon associated with the tag. */
  icon?: string | React.FC<React.SVGProps<SVGSVGElement>>;
  /** Indicates the type of provider associated with the tag. */
  providerType?: number;
  /** Accepts the function that is called when the tag is clicked */
  onClick?: () => void;
  /** Indicates if the tag is an overflow trigger */
  isOptionTag?: boolean;
};

export type TagClickEvent = {
  label: string;
  roomType?: number;
  providerType?: number;
};
