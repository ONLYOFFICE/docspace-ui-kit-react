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

import type { IconButtonProps } from "../icon-button";
import type {
  TTooltipPlace,
  TooltipProps,
  TGetTooltipContent,
} from "../tooltip";

export type HelpButtonProps = Omit<IconButtonProps, "tooltipContent"> & {
  /** Displays the child elements */
  children?: React.ReactNode;
  /** Sets the unique identifier for the component. */
  id?: string;
  /** Sets the data-tip attribute for the component. */
  dataTip?: string;
  /** Function to retrieve the content of the tooltip. */
  getContent?: (params: TGetTooltipContent) => React.ReactNode;
  /** Position of the tooltip relative to the target element. */
  place?: TTooltipPlace;
  /** Offset distance for the tooltip from the target element. */
  offset?: number;
  /** Custom styles for the component. */
  style?: React.CSSProperties;
  /** Function called after the tooltip is shown. */
  afterShow?: () => void;
  /** Function called after the tooltip is hidden. */
  afterHide?: () => void;
  /** Sets the unique identifier for the tooltip. */
  tooltipId?: string;
  /** Maximum width of the tooltip. */
  tooltipMaxWidth?: string;
  /** Content of the tooltip. */
  tooltipContent?: React.ReactNode;
  /** Additional properties for the tooltip. */
  tooltipProps?: TooltipProps;
  /** Whether to open the tooltip on click. */
  openOnClick?: boolean;
  /** Top offset distance for tooltip positioning. */
  offsetTop?: number;
  /** Right offset distance for tooltip positioning. */
  offsetRight?: number;
  /** Bottom offset distance for tooltip positioning. */
  offsetBottom?: number;
  /** Left offset distance for tooltip positioning. */
  offsetLeft?: number;
  isOpen?: boolean;
  noUserSelect?: boolean;
  /** Sets the data-testid attribute for the component. */
  dataTestId?: string;
  tooltipStyle?: React.CSSProperties;
  /** Icon node */
  iconNode?: React.ReactNode;
};
