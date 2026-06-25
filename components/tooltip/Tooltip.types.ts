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

import type { ITooltip, TooltipRefProps } from "react-tooltip";

export type TTooltipPlace =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

export type TFallbackAxisSideDirection = "none" | "start" | "end";

export type TGetTooltipContent = {
  content: string | null;
  activeAnchor: HTMLElement | null;
};

export type TooltipProps = Pick<
  ITooltip,
  | "id"
  | "place"
  | "afterHide"
  | "afterShow"
  | "offset"
  | "children"
  | "isOpen"
  | "clickable"
  | "openOnClick"
  | "float"
  | "anchorSelect"
  | "noArrow"
  | "opacity"
  | "imperativeModeOnly"
  | "delayShow"
> & {
  /** Sets a callback function that generates the tip content dynamically */
  getContent?: ({
    content,
    activeAnchor,
  }: TGetTooltipContent) => React.ReactNode | string;
  /** Accepts class */
  className?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Background color of the tooltip  */
  color?: string;
  /** Maximum width of the tooltip */
  maxWidth?: string;
  /** Whether to allow fallback to the perpendicular axis of the preferred placement */
  fallbackAxisSideDirection?: TFallbackAxisSideDirection;
  noUserSelect?: boolean;
  ref?: React.RefObject<TooltipRefProps | null>;
  dataTestId?: string;
  zIndex?: number;
  tooltipStyle?: React.CSSProperties;
};

export type MouseEventHandler = (e: React.MouseEvent<HTMLElement>) => void;

export type TooltipHandlers = {
  anchorId: string;
  handleMouseEnter: MouseEventHandler;
  handleMouseLeave: MouseEventHandler;
  handleClick: MouseEventHandler;
};

export interface WithTooltipProps {
  title?: string;
  tooltipContent?: React.ReactNode;
  tooltipPlace?: TTooltipPlace;
  tooltipFitToContent?: boolean;
}

export type OmitTooltipProps<T> = Omit<
  T,
  "title" | "tooltipContent" | "tooltipPlace" | "tooltipFitToContent"
>;

const tooltipPropsToOmit = new Set([
  "title",
  "tooltipContent",
  "tooltipPlace",
  "tooltipFitToContent",
]);

export function omitTooltipProps<T extends Record<string, unknown>>(
  props: T & Partial<WithTooltipProps>,
): OmitTooltipProps<T> {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !tooltipPropsToOmit.has(key)),
  ) as OmitTooltipProps<T>;
}

export type ComponentProps = OmitTooltipProps<
  React.HTMLAttributes<HTMLElement> & {
    onClick?: MouseEventHandler;
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
  }
>;

