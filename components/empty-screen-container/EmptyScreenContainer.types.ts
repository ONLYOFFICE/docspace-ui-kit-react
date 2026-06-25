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

import type { CSSProperties, ReactNode } from "react";

export type EmptyScreenContainerProps = {
  /** URL source for the empty state image */
  imageSrc: string;
  /** Alternative text for the image for accessibility */
  imageAlt: string;
  /** Main header text displayed below the image */
  headerText: string;
  /** Optional subheading text displayed below the header */
  subheadingText?: string;
  /** Optional description text or React node displayed below the subheading */
  descriptionText?: string | ReactNode;
  /** Optional buttons or other interactive elements */
  buttons?: ReactNode;
  /** Additional CSS class name */
  className?: string;
  /** HTML id attribute */
  id?: string;
  /** Custom CSS styles for the container */
  style?: CSSProperties;
  /** Custom CSS styles for the image */
  imageStyle?: CSSProperties;
  /** Custom CSS styles for the buttons container */
  buttonStyle?: CSSProperties;
  /** Whether to display without filter styling */
  withoutFilter?: boolean;
};
