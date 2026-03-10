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

  const folderTargetId = +(targetId ?? 0);
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

        const sessionRes = await operationsApi.createUploadSessionInFolder(
          targetFolderId,
          {
            fileName: file.name,
            fileSize: file.size,
            relativePath: "",
            encrypted: false,
            createOn: createOn as unknown as ApiDateTime,
            createNewIfExist: true,
          },
        );

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

        await runWithConcurrency(
          chunks,
          maxUploadThreadCount,
          async (chunk) => {
            const chunkFile = new File(
              [chunk.data.get("file") as Blob],
              file.name,
            );

            await operationsApi.uploadAsyncSession(
              targetFolderId,
              sessionId,
              chunk.index,
              chunkFile,
            );

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

        const result = await operationsApi.finalizeSession(
          targetFolderId,
          sessionId,
        );
        uploadedFiles.push(result.data);
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

      if (maxPerUploadBytes) {
        const oversizedFiles = acceptedFiles.filter(
          (file) => file.size > maxPerUploadBytes,
        );

        if (oversizedFiles.length > 0) {
          const maxSizeFormatted = maxPerUploadSize?.toUpperCase();
          const isFolderMode = isFolderUpload ?? false;

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
          return;
        }
      }

      if (isMultipleUpload && maxTotalUploadSize) {
        const maxTotalBytes = parseSizeLimit(maxTotalUploadSize);

        if (maxTotalBytes) {
          const totalSize = acceptedFiles.reduce(
            (sum, file) => sum + file.size,
            0,
          );

          if (totalSize > maxTotalBytes) {
            const maxTotalFormatted = maxTotalUploadSize.toUpperCase();
            const isFolderMode = isFolderUpload ?? false;

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
            return;
          }
        }
      }

      setIsLoading(true);
      setUploadPercent(0);

      try {
        const uploadedFiles = await uploadFiles(acceptedFiles);
        const folderUrl = getFolderUrl?.(folderTargetId);

        toastr.success(
          <>
            {getCommonTranslation("ItemsSuccessfullyUploaded", {
              count: acceptedFiles.length,
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
          toastr.warning(getCommonTranslation("SingleUploadWarning"));
        }}
        onDrop={onDrop}
        accept={accept}
        linkMainText={linkMainText ?? getCommonTranslation("Upload")}
        linkSecondaryText={getSecondaryText()}
        exstsText={
          extensionsText ?? shortText ?? getCommonTranslation("AnyFiles")
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
