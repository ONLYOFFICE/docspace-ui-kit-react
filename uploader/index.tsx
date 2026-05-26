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

import { useCallback, useState } from "react";

import UploadSvg from "../assets/upload.svg";

import type { ApiDateTime } from "@onlyoffice/docspace-api-sdk";
import type { UploaderProps } from "./Uploader.types";
import { createChunks, runWithConcurrency } from "./utils/upload";
import { parseSizeLimit } from "./utils/sizeLimit";

import { toastr } from "../components/toast";
import Dropzone from "../components/dropzone";
import {
  DEFAULT_CHUNK_UPLOAD_SIZE,
  DEFAULT_MAX_UPLOAD_THREAD_COUNT,
  DEFAULT_MAX_UPLOAD_FILES_COUNT,
} from "../constants";
import { getCommonTranslation } from "../utils";
import { prepareFolderUpload } from "./utils/folder";
import { isEmptyDirectoryFile } from "./utils/path";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useApi } from "../providers/api";

import styles from "./Uploader.module.scss";

const Uploader = ({
  width = "100%",
  height = "100%",
  accept,
  shortText,
  fullText,
  badgeValue,
  filesSettings,
  onUploadProgress,
  onUploadSuccess,
  onUploadError,
  targetId,
  linkMainText,
  secondaryText,
  extensionsText,
  isFolderUpload,
  isMultipleUpload,
  maxPerUploadSize,
  maxTotalUploadSize,
  getFolderUrl,
}: UploaderProps) => {
  const { operationsApi, foldersApi } = useApi();

  const folderTargetId: string | number = targetId ?? 0;
  const chunkUploadSize =
    filesSettings?.chunkUploadSize || DEFAULT_CHUNK_UPLOAD_SIZE;
  const maxUploadThreadCount =
    filesSettings?.maxUploadThreadCount || DEFAULT_MAX_UPLOAD_THREAD_COUNT;
  const maxUploadFilesCount =
    filesSettings?.maxUploadFilesCount || DEFAULT_MAX_UPLOAD_FILES_COUNT;

  const [isLoading, setIsLoading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const uploadFiles = useCallback(
    async (rawFiles: File[]) => {
      const { files: preparedFiles, parentFolderMap } =
        await prepareFolderUpload(rawFiles, folderTargetId, foldersApi);

      const onlyFiles = preparedFiles.filter((f) => !isEmptyDirectoryFile(f));

      const uploadedFiles: unknown[] = [];

      const totalBytes = onlyFiles.reduce((sum, f) => sum + f.size, 0);
      let uploadedBytes = 0;

      setUploadPercent(0);

      await runWithConcurrency(onlyFiles, maxUploadFilesCount, async (file) => {
        const targetFolderId = parentFolderMap.get(file) ?? folderTargetId;

        const createOn = file.lastModified
          ? new Date(file.lastModified).toISOString()
          : new Date().toISOString();

        const sessionRes = await operationsApi.createUploadSessionInFolder({
          folderId: targetFolderId as number,
          sessionRequest: {
            fileName: file.name,
            fileSize: file.size,
            relativePath: "",
            encrypted: false,
            createOn: createOn as unknown as ApiDateTime,
            createNewIfExist: true,
          },
        });

        const sessionId = sessionRes.data?.response?.id;

        if (!sessionId) {
          throw new Error("Failed to start upload session");
        }

        const chunks = createChunks(file, chunkUploadSize);
        let uploadedChunks = 0;

        onUploadProgress?.({
          sessionId,
          fileName: file.name,
          uploadedChunks: 0,
          totalChunks: chunks.length,
          percent: 0,
        });

        const isThirdPartyFolder = typeof targetFolderId === "string";

        if (isThirdPartyFolder) {
          let lastChunkResult: unknown = null;

          for (const chunk of chunks) {
            const chunkBlob = chunk.data.get("file") as Blob;

            const res = await operationsApi.uploadSession({
              folderId: targetFolderId as unknown as number,
              sessionId,
              file: chunkBlob as File,
            });

            lastChunkResult = res.data;

            uploadedChunks += 1;
            uploadedBytes += chunk.size;
            const filePercent = Math.round(
              (uploadedChunks / chunks.length) * 100,
            );
            const overallPercent = Math.round(
              (uploadedBytes / totalBytes) * 100,
            );
            setUploadPercent(overallPercent);

            onUploadProgress?.({
              sessionId,
              fileName: file.name,
              uploadedChunks,
              totalChunks: chunks.length,
              percent: filePercent,
            });
          }

          uploadedFiles.push(lastChunkResult);
        } else {
          await runWithConcurrency(
            chunks,
            maxUploadThreadCount,
            async (chunk) => {
              const chunkBlob = chunk.data.get("file") as Blob;

              await operationsApi.uploadAsyncSession({
                folderId: targetFolderId as unknown as number,
                sessionId,
                chunkNumber: chunk.index,
                file: chunkBlob as File,
              });

              uploadedChunks += 1;
              uploadedBytes += chunk.size;
              const filePercent = Math.round(
                (uploadedChunks / chunks.length) * 100,
              );
              const overallPercent = Math.round(
                (uploadedBytes / totalBytes) * 100,
              );
              setUploadPercent(overallPercent);

              onUploadProgress?.({
                sessionId,
                fileName: file.name,
                uploadedChunks,
                totalChunks: chunks.length,
                percent: filePercent,
              });
            },
          );

          const result = await operationsApi.finalizeSession({
            folderId: targetFolderId as unknown as number,
            sessionId,
          });
          uploadedFiles.push(result.data);
        }
      });

      return uploadedFiles;
    },
    [
      folderTargetId,
      chunkUploadSize,
      maxUploadFilesCount,
      maxUploadThreadCount,
      operationsApi,
      foldersApi,
      onUploadProgress,
    ],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      const maxPerUploadBytes = parseSizeLimit(maxPerUploadSize);
      const isFolderMode = isFolderUpload ?? false;
      const isMultiple = isMultipleUpload ?? false;

      let filesToUpload = [...acceptedFiles];

      if (maxPerUploadBytes) {
        const oversizedFiles = filesToUpload.filter(
          (file) => file.size > maxPerUploadBytes,
        );

        if (oversizedFiles.length > 0) {
          const maxSizeFormatted = maxPerUploadSize?.toUpperCase();

          if (isFolderMode) {
            toastr.error(
              getCommonTranslation("FolderSizeExceedsLimit", {
                maxSize: maxSizeFormatted ?? "",
              }),
            );
          } else {
            toastr.error(
              getCommonTranslation("FileSizeExceedsLimit", {
                maxSize: maxSizeFormatted ?? "",
              }),
            );
          }

          if (!isMultiple) return;

          filesToUpload = filesToUpload.filter(
            (file) => file.size <= maxPerUploadBytes,
          );
        }
      }

      if (isMultiple && maxTotalUploadSize) {
        const maxTotalBytes = parseSizeLimit(maxTotalUploadSize);

        if (maxTotalBytes) {
          const fitsInLimit: File[] = [];
          let accumulated = 0;
          let limitExceeded = false;

          for (const file of filesToUpload) {
            if (accumulated + file.size <= maxTotalBytes) {
              fitsInLimit.push(file);
              accumulated += file.size;
            } else {
              limitExceeded = true;
            }
          }

          if (limitExceeded) {
            const maxTotalFormatted = maxTotalUploadSize.toUpperCase();

            if (isFolderMode) {
              toastr.error(
                getCommonTranslation("FoldersSizeExceedsLimit", {
                  maxSize: maxTotalFormatted,
                }),
              );
            } else {
              toastr.error(
                getCommonTranslation("FilesSizeExceedsLimit", {
                  maxSize: maxTotalFormatted,
                }),
              );
            }
          }

          filesToUpload = fitsInLimit;
        }
      }

      if (!filesToUpload.length) return;

      setIsLoading(true);
      setUploadPercent(0);

      try {
        const uploadedFiles = await uploadFiles(filesToUpload);
        const folderUrl = getFolderUrl?.(folderTargetId);

        toastr.success(
          <>
            {getCommonTranslation("ItemsSuccessfullyUploaded", {
              count: filesToUpload.length,
            })}
            {folderUrl && (
              <>
                <br />
                <a
                  href={folderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.toastLink}
                >
                  {getCommonTranslation("Open")}
                </a>
              </>
            )}
          </>,
          getCommonTranslation("Done"),
        );

        onUploadSuccess?.(uploadedFiles);
      } catch (err) {
        const message =
          getErrorMessage(err) || getCommonTranslation("UnexpectedError");
        toastr.error(message);

        onUploadError?.({ error: message });
      } finally {
        setIsLoading(false);
      }
    },
    [
      uploadFiles,
      folderTargetId,
      onUploadSuccess,
      onUploadError,
      maxPerUploadSize,
      maxTotalUploadSize,
      isFolderUpload,
      isMultipleUpload,
      getFolderUrl,
    ],
  );

  const onDropRejected = useCallback(
    (
      fileRejections: {
        file: File;
        errors: { code: string; message: string }[];
      }[],
    ) => {
      if (fileRejections.length === 0) return;

      const isMultiple = isMultipleUpload ?? true;

      if (isMultiple) {
        toastr.error(
          getCommonTranslation("FilesRejectedDueToFormat", {
            count: fileRejections.length,
          }),
        );
      } else {
        toastr.error(getCommonTranslation("FileFormatNotAllowed"));
      }

      const rejectedFiles = fileRejections.map((rejection) => ({
        fileName: rejection.file.name,
        fileSize: rejection.file.size,
        fileType: rejection.file.type,
        errors: rejection.errors,
      }));

      onUploadError?.({
        error: "Files rejected due to unsupported format",
        rejectedFiles,
      });
    },
    [isMultipleUpload],
  );

  const getSecondaryText = () => {
    if (secondaryText) {
      return secondaryText;
    }

    const folderMode = isFolderUpload ?? false;
    const multipleMode = isMultipleUpload ?? true;

    if (folderMode && multipleMode) {
      return getCommonTranslation("DropzoneFoldersSecondary");
    }
    if (folderMode && !multipleMode) {
      return getCommonTranslation("DropzoneFolderSecondary");
    }
    if (!folderMode && multipleMode) {
      return getCommonTranslation("DropzoneFilesSecondary");
    }
    return getCommonTranslation("DropzoneTitleSecondary");
  };

  return (
    <div className={styles.uploaderContainer} style={{ width, height }}>
      <Dropzone
        isDisabled={isLoading}
        isLoading={isLoading}
        uploadPercent={uploadPercent}
        isFolderUpload={isFolderUpload}
        isMultipleUpload={isMultipleUpload}
        onSingleUploadError={() => {
          toastr.warning(getCommonTranslation("SingleUploadWarning"), null);
        }}
        onDrop={onDrop}
        onDropRejected={onDropRejected}
        accept={accept}
        linkMainText={linkMainText ?? getCommonTranslation("Upload")}
        linkSecondaryText={getSecondaryText()}
        exstsText={
          extensionsText ?? (shortText || getCommonTranslation("AnyFiles"))
        }
        fullExstsText={fullText}
        formatsPlusBadgeValue={badgeValue}
        dataTestId="sdk-uploader"
        className={styles.dropzoneWrapper}
        loaderClassName={styles.dropzoneLoader}
        icon={UploadSvg}
      />
    </div>
  );
};

export { Uploader };

export { createChunks, runWithConcurrency } from "./utils/upload";
