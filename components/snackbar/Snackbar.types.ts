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

export type TextAlignValue =
  | "start"
  | "end"
  | "left"
  | "right"
  | "center"
  | "justify";

/**
 * Snackbar properties.
 *
 * @typedef {Object} SnackbarProps
 */
export type SnackbarProps = {
  /**
   * Specifies the Snackbar text.
   */
  text?: string | React.ReactNode;
  /**
   * Specifies the header text.
   */
  headerText?: string;
  /**
   * Specifies the button text.
   */
  btnText?: string;
  /**
   * Specifies the source of the image used as the Snackbar background.
   */
  backgroundImg?: string;
  /**
   * Displays the icon.
   */
  showIcon?: boolean;
  /**
   * Sets a callback function that is triggered when the Snackbar is clicked.
   */
  onAction?: (e?: React.MouseEvent) => void;
  /**
   * Sets the font size.
   */
  fontSize?: string;
  /**
   * Sets the font weight.
   */
  fontWeight?: number;
  /**
   * Specifies the text alignment.
   */
  textAlign?: TextAlignValue | "match-parent";
  /**
   * Allows displaying content in HTML format.
   */
  htmlContent?: string;
  /**
   * Accepts css.
   */
  style?: React.CSSProperties;
  /**
   * Sets the countdown time.
   */
  countDownTime: number;
  /**
   * Sets the section width.
   */
  sectionWidth: number;
  /**
   * Required in case the snackbar is a campaign banner.
   */
  isCampaigns?: boolean;
  /**
   * Used as an indicator that a web page has fully loaded, including its content, images, style files, and external scripts.
   */
  onLoad?: () => void;
  /**
   * Required in case the snackbar is a notification banner.
   */
  isMaintenance?: boolean;
  /**
   * Sets opacity.
   */
  opacity?: number;
  /**
   * Callback when close button is clicked.
   */
  onClose?: () => void;

  skipBlur?: boolean;
   /**
   * Specifies additional information text next to the header.
   */
  additionalHeaderText?: string;
};

/**
 * Bar configuration.
 *
 * @typedef {Object} BarConfig
 */
export type BarConfig = SnackbarProps & {
  /**
   * Parent element ID.
   */
  parentElementId: string;
};
