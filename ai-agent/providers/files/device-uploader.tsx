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

"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useStores } from "@onlyoffice/ai-chat";

import { useApi as useFilesApi } from "../../../providers/api";

import { uploadFilesToChat } from "./upload-files";
import type { OnFilesAttached } from "./attach-files";

export type DeviceUploaderHandle = {
  // Open the hidden file picker (composer "Upload from device" action).
  open: () => void;
};

type DeviceUploaderProps = {
  // Chat scope (current room/folder id). Device files are uploaded there as
  // real portal files; when absent they land in My documents.
  entityId?: string;
  // Reports the attached files so the caller can keep the record flags the
  // attachments store drops (`canAnalyze`).
  onFilesAttached?: OnFilesAttached;
};

// Thin React wrapper around the framework-free `uploadFilesToChat` flow (see
// upload-files.ts): it owns a hidden <input type="file" multiple> and the
// imperative handle, gathers the host context (translation, API clients, chat
// scope, attachments store), and hands picked/dropped files to that shared
// flow so the picker and drag-and-drop behave identically. The parent triggers
// the picker via the `open()` handle attached through `React.forwardRef`.
const DeviceUploader = React.forwardRef<
  DeviceUploaderHandle,
  DeviceUploaderProps
>(({ entityId, onFilesAttached }, ref) => {
  const { t } = useTranslation(["Common"]);
  const { useAttachmentsStore } = useStores();
  const { foldersApi, operationsApi, filesSettingsApi } = useFilesApi();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const uploadFiles = React.useCallback(
    (files: File[]) =>
      uploadFilesToChat(files, {
        entityId,
        foldersApi,
        operationsApi,
        filesSettingsApi,
        useAttachmentsStore,
        onFilesAttached,
        t,
      }),
    [
      useAttachmentsStore,
      foldersApi,
      operationsApi,
      filesSettingsApi,
      entityId,
      onFilesAttached,
      t,
    ],
  );

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      uploadFiles(Array.from(e.target.files ?? [])),
    [uploadFiles],
  );

  React.useImperativeHandle(
    ref,
    () => ({
      open: () => {
        const el = inputRef.current;
        if (!el) return;
        // Reset so re-picking the same file fires onChange again.
        el.value = "";
        el.click();
      },
    }),
    [],
  );

  return (
    <input ref={inputRef} type="file" multiple hidden onChange={onChange} />
  );
});
DeviceUploader.displayName = "DeviceUploader";

export default DeviceUploader;

