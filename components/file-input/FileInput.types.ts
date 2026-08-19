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

import { InputSize } from "../text-input";

export type FileInputProps = {
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Supported size of the input fields */
  size: InputSize;
  /** Indicates that the input field has scale */
  scale?: boolean;
  /** Accepts class */
  className?: string;
  /** Indicates that the input field has an error */
  hasError?: boolean;
  /** Indicates that the input field has a warning */
  hasWarning?: boolean;
  /** Used as HTML `id` property */
  id?: string;
  /** Indicates that the field cannot be used (e.g not authorised, or changes not saved) */
  isDisabled?: boolean;
  /** Tells when the button should show loader icon */
  isLoading?: boolean;
  /** Used as HTML `name` property */
  name?: string;
  /** Called when a file is selected */
  onInput?: (file: File | File[]) => void;
  /** Specifies the files visible for upload */
  accept?: string[];
  /** Specifies the label for the upload button */
  buttonLabel?: string;
  /** Indicates that icon is document. Otherwise, it is folder icon */
  isDocumentIcon?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  idButton?: string;
  path?: string;
  fromStorage?: boolean;
  /** Indicates that the input may contain multiple files. */
  isMultiple?: boolean;
  /** ARIA label for the file input button */
  "aria-label"?: string;
  /** ARIA description for the file input */
  "aria-description"?: string;
  /** Data attributes for testing */
  "data-test-id"?: string;
};
