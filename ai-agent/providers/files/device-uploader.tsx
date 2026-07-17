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
import { toastr, type TData } from "../../../components/toast";

import { getOnlyofficeFileType } from "./file-type";
import { attachFilesToChat, type AttachFileInput } from "./attach-files";

export type DeviceUploaderHandle = { open: () => void };

// Archives make no sense as chat attachments: the AI backend cannot extract
// text from them, so they are rejected up front with the same "unsupported
// file type" toast the uploader always showed. Extension-based on purpose —
// browsers report unreliable (often empty) mime types for archives.
const ARCHIVE_EXTENSION =
  /\.(zip|rar|7z|tar|gz|tgz|bz2|tbz2?|xz|txz|zst|lz|lzma|cab|iso)$/i;

type DeviceUploaderProps = {
  // Chat scope (current room/folder id). Device files are uploaded there as
  // real portal files; when absent they land in My documents.
  entityId?: string;
};

// Device upload = portal upload + regular DocSpace attach. Every picked file
// (any type — DOCX/PDF/XLSX/images included) is first inserted into the
// chat's entity folder via the files API, then attached by its file id, so
// the AI backend works with a stored portal file instead of a raw in-memory
// draft. Owns a hidden <input type="file" multiple>; the parent triggers the
// picker via the imperative `open()` handle attached through
// `React.forwardRef`.
const DeviceUploader = React.forwardRef<DeviceUploaderHandle, DeviceUploaderProps>(
  ({ entityId }, ref) => {
    const { t } = useTranslation(["Common"]);
    const { useAttachmentsStore } = useStores();
    const { foldersApi } = useFilesApi();
    const inputRef = React.useRef<HTMLInputElement>(null);

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

    const onChange = React.useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const allPicked = Array.from(e.target.files ?? []);
        if (allPicked.length === 0) return;

        const unsupported = allPicked
          .filter((f) => ARCHIVE_EXTENSION.test(f.name))
          .map((f) => f.name);
        if (unsupported.length > 0) {
          toastr.error(
            t("Common:UnsupportedFileType", {
              files: unsupported.join(", "),
              defaultValue: "Unsupported file type: {{files}}",
            }),
          );
        }

        const picked = allPicked.filter((f) => !ARCHIVE_EXTENSION.test(f.name));
        if (picked.length === 0) return;

        const inputs: AttachFileInput[] = [];
        const imageIndices = new Set<number>();
        const failed: string[] = [];

        // Where to store the uploads. The chat scope is only a candidate:
        // the user may lack Create rights there (e.g. chat-only access to
        // an AI agent room), which surfaces as a 403 on the first insert —
        // then the whole batch falls back to the My documents section
        // (404 too: a scope folder that disappeared mid-flight).
        let targetFolderId = entityId ? Number(entityId) : undefined;

        const uploadOne = async (file: File) => {
          if (targetFolderId !== undefined) {
            try {
              return await foldersApi.insertFile({
                folderId: targetFolderId,
                insertFileFile: file,
                insertFileTitle: file.name,
                insertFileCreateNewIfExist: true,
              });
            } catch (err) {
              const status = (err as { response?: { status?: number } })
                .response?.status;
              if (status !== 403 && status !== 404) throw err;
              targetFolderId = undefined;
            }
          }
          return foldersApi.insertFileToMyFromBody({
            file,
            title: file.name,
            createNewIfExist: true,
          });
        };

        // Sequential on purpose: `insertFile` streams the whole file body,
        // and parallel multi-file uploads of large documents gain little
        // while making partial-failure reporting messier.
        for (const file of picked) {
          try {
            const res = await uploadOne(file);

            const created = res.data.response;
            if (created?.id === undefined) {
              failed.push(file.name);
              continue;
            }

            if (file.type.startsWith("image/")) {
              imageIndices.add(inputs.length);
            }
            inputs.push({
              path: String(created.id),
              title: created.title ?? file.name,
              type: getOnlyofficeFileType(file.name),
              content: "",
            });
          } catch {
            failed.push(file.name);
          }
        }

        if (failed.length > 0) {
          toastr.error(
            t("Common:ErrorUploadingFiles", {
              count: failed.length,
              defaultValue: "Error uploading files: {{count}}",
            }),
          );
        }

        if (inputs.length === 0) return;

        try {
          await attachFilesToChat(useAttachmentsStore, inputs, imageIndices);
        } catch (err) {
          toastr.error(err as TData);
        }
      },
      [useAttachmentsStore, foldersApi, entityId, t],
    );

    return (
      <input ref={inputRef} type="file" multiple hidden onChange={onChange} />
    );
  },
);
DeviceUploader.displayName = "DeviceUploader";

export default DeviceUploader;
