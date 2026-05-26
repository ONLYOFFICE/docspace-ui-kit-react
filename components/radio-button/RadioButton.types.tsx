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
import { TextProps } from "../text/Text.types";

export type RadioButtonOrientation = "horizontal" | "vertical";

type PickedTextProps = Pick<TextProps, "fontSize" | "fontWeight">;
type PickedInputProps = Pick<
  React.ComponentProps<"input">,
  "name" | "value" | "autoFocus" | "onChange"
>;
type PickedLabelProps = Pick<
  React.ComponentProps<"label">,
  "id" | "className" | "style"
>;

export type RadioButtonProps = {
  /** Used as HTML `checked` property for the `<input>` tag */
  isChecked?: boolean;

  /** Used as HTML `disabled` property for the `<input>` tag */
  isDisabled?: boolean;

  /** Label text or node to display next to the radio button.
   * If not provided, value will be used as label */
  label?: React.ReactNode | string;

  /** Callback fired when radio button is clicked */
  onClick?: (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>,
  ) => void;

  /** Sets margin between radio buttons.
   * For horizontal orientation, sets margin-inline-start.
   * For vertical orientation, sets margin-block-end.
   * @default "15px" */
  spacing?: string;

  /** Layout orientation of radio buttons when used in a group
   * @default "vertical" */
  orientation?: RadioButtonOrientation;

  /** Additional CSS class for the input element */
  classNameInput?: string;

  /** Test ID for the radio button component */
  testId?: string;
} & PickedTextProps &
  PickedInputProps &
  PickedLabelProps;
