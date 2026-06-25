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

import * as React from "react";

export enum AxisDirection {
  X = "x",
  Y = "y",
}

export enum TrackClickBehavior {
  JUMP = "jump",
  STEP = "step",
}

export type ElementRef<T = HTMLDivElement> = (element: T | null) => void;

export type ElementPropsWithElementRef<T = HTMLDivElement> =
  React.HTMLProps<T> & {
    elementRef?: ElementRef<T>;
  };

export type ElementRenderer<T = HTMLDivElement> = React.FC<
  React.PropsWithChildren<ElementPropsWithElementRef<T>>
>;

export type ElementPropsWithElementRefAndRenderer<T = HTMLDivElement> =
  React.HTMLProps<T> & {
    elementRef?: ElementRef<T>;
    renderer?: ElementRenderer<T>;
  };

/**
 * @description Contains all scroll-related values
 */
export type ScrollState = {
  /**
   * @description Scroller's native clientHeight parameter
   */
  clientHeight: number;
  /**
   * @description Scroller's native clientWidth parameter
   */
  clientWidth: number;

  /**
   * @description Content's scroll height
   */
  contentScrollHeight: number;
  /**
   * @description Content's scroll width
   */
  contentScrollWidth: number;

  /**
   * @description Scroller's native scrollHeight parameter
   */
  scrollHeight: number;
  /**
   * @description Scroller's native scrollWidth parameter
   */
  scrollWidth: number;

  /**
   * @description Scroller's native scrollTop parameter
   */
  scrollTop: number;
  /**
   * @description Scroller's native scrollLeft parameter
   */
  scrollLeft: number;

  /**
   * @description Indicates whether vertical scroll blocked via properties
   */
  scrollYBlocked: boolean;
  /**
   * @description Indicates whether horizontal scroll blocked via properties
   */
  scrollXBlocked: boolean;

  /**
   * @description Indicates whether the content overflows vertically and scrolling not blocked
   */
  scrollYPossible: boolean;
  /**
   * @description Indicates whether the content overflows horizontally and scrolling not blocked
   */
  scrollXPossible: boolean;

  /**
   * @description Indicates whether vertical track is visible
   */
  trackYVisible: boolean;
  /**
   * @description Indicates whether horizontal track is visible
   */
  trackXVisible: boolean;

  /**
   * @description Indicates whether display direction is right-to-left
   */
  isRTL?: boolean;

  /**
   * @description Pages zoom level - it affects scrollbars
   */
  zoomLevel: number;
};
