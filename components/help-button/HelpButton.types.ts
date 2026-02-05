// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
