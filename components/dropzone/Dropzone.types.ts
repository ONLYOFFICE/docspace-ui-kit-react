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

import type { DropEvent, FileRejection } from "react-dropzone";
import type { FC, SVGProps } from "react";

export type SvgIconComponent = FC<SVGProps<SVGSVGElement>>;

type BaseDropzoneProps = {
  /** Shows loading state of the dropzone */
  isLoading: boolean;
  /** Upload progress percentage (0-100) shown when isLoading is true */
  uploadPercent?: number;
  /** Disables the dropzone */
  isDisabled?: boolean;
  /** Enables folder upload mode instead of file upload */
  isFolderUpload?: boolean;
  /** Allows multiple files/folders upload. When false, only one item is accepted (default: true) */
  isMultipleUpload?: boolean;
  /** Called when user tries to upload multiple items in single upload mode */
  onSingleUploadError?: () => void;
  /** Main text displayed in the dropzone */
  linkMainText: string;
  /** Secondary text displayed in the dropzone */
  linkSecondaryText: string;
  /** Text displaying supported file types (short version) */
  exstsText: string;
  /** Full text displaying all supported file types (shown in dropdown) */
  fullExstsText?: string;
  /** Value for plus badge showing additional formats count */
  formatsPlusBadgeValue?: number;
  /** Maximum number of files allowed (0 for unlimited) */
  maxFiles?: number;
  /** Optional icon URL (string) or SVG component to display */
  icon?: string | SvgIconComponent;
  /** Optional className for the icon */
  iconClassName?: string;
  /** Optional className for the dropzone container */
  className?: string;
  /** Optional className for the loader */
  loaderClassName?: string;
};

type FileDropHandler<T extends File = File> = (acceptedFiles: T[]) => void;

export type DropzoneProps = BaseDropzoneProps & {
  /** Accepted file types (string[]) */
  accept: string | string[];
  /** Custom function to get files from drop event */
  getFilesFromEvent?: (
    event: DropEvent,
  ) => Promise<(File | DataTransferItem)[]> | (File | DataTransferItem)[];
  /** Callback when files are dropped */
  onDrop?: FileDropHandler;
  /** Callback when files are rejected (e.g., wrong file type) */
  onDropRejected?: (fileRejections: FileRejection[]) => void;
  /** Data test id */
  dataTestId?: string;
};
