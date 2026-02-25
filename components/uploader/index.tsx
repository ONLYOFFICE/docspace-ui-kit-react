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

import type { TFileWithOptionalLastModifiedDate, UploaderProps } from "./Uploader.types";
import { createChunks, runWithConcurrency } from "./utils/upload";

import { toastr } from "../toast";
import { 
    DEFAULT_CHUNK_UPLOAD_SIZE, 
    DEFAULT_MAX_UPLOAD_THREAD_COUNT, 
    DEFAULT_MAX_UPLOAD_FILES_COUNT 
} from "../../constants";
import { getCommonTranslation } from "../../utils";
import { attachParentFolderId } from "./utils/folder";
import { isEmptyDirectoryFile } from "./utils/path";
import { getErrorMessage } from "utils/getErrorMessage";
import { useApi } from "providers";


const Uploader = ({
  accept,
  shortText,
  fullText,
  badgeValue,
  filesSettings,
  baseConfig,
}: UploaderProps) => {  
  const { operationsApi } = useApi();

  const folderTargetId = +(baseConfig?.targetId ?? 0);
  const chunkUploadSize =
    filesSettings?.chunkUploadSize || DEFAULT_CHUNK_UPLOAD_SIZE;
  const maxUploadThreadCount =
    filesSettings?.maxUploadThreadCount || DEFAULT_MAX_UPLOAD_THREAD_COUNT;
  const maxUploadFilesCount =
    filesSettings?.maxUploadFilesCount || DEFAULT_MAX_UPLOAD_FILES_COUNT;

  const [isLoading, setIsLoading] = useState(false);

  const uploadFiles = useCallback(async (rawFiles: File[]) => {
    const prepared = await attachParentFolderId(rawFiles, folderTargetId);

    const onlyFiles = prepared.filter((f) => !isEmptyDirectoryFile(f));

    const uploadedFiles: unknown[] = [];

    await runWithConcurrency(onlyFiles, maxUploadFilesCount, async (file) => {
      const targetFolderId = file.parentFolderId ?? folderTargetId;

      const session = await startUploadSession(
        targetFolderId,
        file.name,
        file.size,
        "",
        false,
        (file as TFileWithOptionalLastModifiedDate).lastModifiedDate ??
          file.lastModified,
        true,
      );

      const chunks = createChunks(file, chunkUploadSize);

      await runWithConcurrency(chunks, maxUploadThreadCount, async (chunk) => {
        await uploadChunkParallel(
          targetFolderId,
          session.id,
          chunk.index,
          chunk.data,
        );

      });

      const result = await finalizeUploadSession(targetFolderId, session.id);
      uploadedFiles.push(result);
    });

    return uploadedFiles;
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setIsLoading(true);

      try {
        const uploadedFiles = await uploadFiles(acceptedFiles);
        const folderUrl = `${window.location.origin}/rooms/personal/filter?folder=${folderTargetId}`;

        toastr.success(
          <>
            {getCommonTranslation("Common:ItemsSuccessfullyUploaded", {
              count: acceptedFiles.length,
            })}
            <br />
            <a
              href={folderUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              {getCommonTranslation("Open")}
            </a>
          </>,
          getCommonTranslation("Done"),
        );

      } catch (err) {
        const message = getErrorMessage(err) || getCommonTranslation("UnexpectedError");
        toastr.error(message);

      } finally {
        setIsLoading(false);
      }
    },
    [uploadFiles],
  );

  const getSecondaryText = () => {
    if (baseConfig?.secondaryText) {
      return baseConfig.secondaryText;
    }

    const isFolderUpload = baseConfig?.isFolderUpload ?? false;
    const isMultipleUpload = baseConfig?.isMultipleUpload ?? true;

    if (isFolderUpload && isMultipleUpload) {
      return getCommonTranslation("Common:DropzoneFoldersSecondary");
    }
    if (isFolderUpload && !isMultipleUpload) {
      return getCommonTranslation("Common:DropzoneFolderSecondary");
    }
    if (!isFolderUpload && isMultipleUpload) {
      return getCommonTranslation("Common:DropzoneFilesSecondary");
    }
    return getCommonTranslation("Common:DropzoneTitleSecondary");
  };


  return <div />;
};

export { Uploader };
