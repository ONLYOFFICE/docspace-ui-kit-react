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

import type { FilesSettingsDto } from "@onlyoffice/docspace-api-sdk";

export type UploaderFilesSettings = FilesSettingsDto & {
  maxUploadFilesCount?: number;
};

export type UploadProgressData = {
  sessionId: string;
  fileName: string;
  uploadedChunks: number;
  totalChunks: number;
  percent: number;
};

export type RejectedFile = {
  fileName: string;
  fileSize: number;
  fileType: string;
  errors: Array<{ code: string; message: string }>;
};

export type UploaderProps = {
  /** Width of the uploader container */
  width?: string;
  /** Height of the uploader container */
  height?: string;
  filesSettings?: UploaderFilesSettings;
  accept: string;
  shortText: string;
  fullText?: string;
  badgeValue?: number;
  /** Called on each upload progress update per file */
  onUploadProgress?: (data: UploadProgressData) => void;
  /** Called when all files are uploaded successfully */
  onUploadSuccess?: (data: unknown[]) => void;
  /** Called when upload fails */
  onUploadError?: (data: {
    error: string;
    rejectedFiles?: RejectedFile[];
  }) => void;
  /** Target folder ID for uploads */
  targetId?: string;
  /** Main text displayed in the dropzone */
  linkMainText?: string;
  /** Secondary text displayed in the dropzone */
  secondaryText?: string;
  /** Text displaying supported file extensions */
  extensionsText?: string;
  /** Enables folder upload mode */
  isFolderUpload?: boolean;
  /** Allows multiple files/folders upload */
  isMultipleUpload?: boolean;
  /** Maximum size per single upload (e.g. "10MB") */
  maxPerUploadSize?: string;
  /** Maximum total upload size (e.g. "100MB") */
  maxTotalUploadSize?: string;
  /** Callback to generate folder URL for success toast link. If not provided, no link is shown. */
  getFolderUrl?: (folderId: string | number) => string;
};

export type TFileWithOptionalPath = File & { path?: string };
export type TFileWithOptionalEmptyDir = File & { isEmptyDirectory?: boolean };
export type TFileWithOptionalLastModifiedDate = File & {
  lastModifiedDate?: unknown;
};

