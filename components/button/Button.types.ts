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

import type { ButtonSize } from "./Button.enums";

type BaseButtonProps = {
  /** Ref to access the DOM element or React component instance */
  ref?: React.Ref<HTMLElement>;
  /** Button text */
  label: string;
  /** Optional title attribute */
  title?: string;
  /** Sets the button primary */
  primary?: boolean;
  filled?: boolean;
  filledStroke?: boolean;
  /** Sets the button accent (tinted accent background with accent border/text) */
  accent?: boolean;
  /** Size of the button.
   * The normal size equals 36px and 40px in height on the Desktop and Touchscreen devices. */
  size?: ButtonSize;
  /** Scales the width of the button to 100% */
  scale?: boolean;
  /** Icon node element */
  icon?: React.ReactNode;
  /** Button tab index */
  tabIndex?: number;
  /** Custom CSS class */
  className?: string;
  /** HTML id attribute */
  id?: string;
  /** Custom CSS styles */
  style?: React.CSSProperties;
  /** Sets the button to show a hovered state */
  isHovered?: boolean;
  /** Sets the button to show a clicked state */
  isClicked?: boolean;
  /** Sets the button to show a disabled state */
  isDisabled?: boolean;
  /** Sets a button to show a loader icon */
  isLoading?: boolean;
  /** Sets the minimal button width */
  minWidth?: string;
  /** Sets the action initiated upon clicking the button */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** HTML button type attribute */
  type?: HTMLButtonElement["type"];
  /** HTML data-testid attribute */
  testId?: string;
};

/** Props for the Button component */
export type ButtonProps = BaseButtonProps & {
  /** ARIA label for accessibility */
  "aria-label"?: string;
  /** ARIA disabled state */
  "aria-disabled"?: "true" | "false";
  /** ARIA busy state */
  "aria-busy"?: "true" | "false";
  /** Tooltip text */
  tooltipText?: string;
};
