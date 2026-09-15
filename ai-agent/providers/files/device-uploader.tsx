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

