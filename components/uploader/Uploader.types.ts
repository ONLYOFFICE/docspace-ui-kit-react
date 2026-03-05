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
  onUploadError?: (data: { error: string }) => void;
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
  getFolderUrl?: (folderId: number) => string;
};

export type TFileWithOptionalPath = File & { path?: string };
export type TFileWithOptionalEmptyDir = File & { isEmptyDirectory?: boolean };
export type TFileWithOptionalLastModifiedDate = File & {
  lastModifiedDate?: unknown;
};
