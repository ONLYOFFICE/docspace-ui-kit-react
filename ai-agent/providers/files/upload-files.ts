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

import type { TFunction } from "i18next";
import { useStores } from "@onlyoffice/ai-chat";

import type { TApiContext } from "../../../providers/api";
import { toastr, type TData } from "../../../components/toast";

import { getOnlyofficeFileType } from "./file-type";
import { attachFilesToChat, type AttachFileInput } from "./attach-files";

type AttachmentsStore = ReturnType<typeof useStores>["useAttachmentsStore"];

// Archives make no sense as chat attachments: the AI backend cannot extract
// text from them, so they are rejected up front with the same "unsupported
// file type" toast the uploader always showed. Extension-based on purpose —
// browsers report unreliable (often empty) mime types for archives.
const ARCHIVE_EXTENSION =
  /\.(zip|rar|7z|tar|gz|tgz|bz2|tbz2?|xz|txz|zst|lz|lzma|cab|iso)$/i;

// Mirrors the server-side default (SetupInfo.ChunkUploadSize); used only
// when the portal files settings cannot be fetched.
const DEFAULT_CHUNK_UPLOAD_SIZE = 10 * 1024 * 1024;

// Normalized result of a portal upload, whichever endpoint produced it.
type UploadedPortalFile = { id?: number; title?: string | null };

// HTTP status off a thrown API error, if it carries one. Type-guarded rather
// than asserted so an unexpected error shape simply yields `undefined`.
const getHttpStatus = (err: unknown): number | undefined => {
  if (typeof err !== "object" || err === null || !("response" in err)) {
    return undefined;
  }
  const { response } = err;
  if (typeof response !== "object" || response === null) return undefined;
  const status = "status" in response ? response.status : undefined;
  return typeof status === "number" ? status : undefined;
};

// Narrow an unknown thrown value to the loose shape `toastr` reads its
// details from (response.data.error.message / message / statusText). Non-object
// throws collapse to an empty object so the toast falls back to its default.
const toToastData = (err: unknown): TData =>
  typeof err === "object" && err !== null ? err : {};

// Everything the upload flow needs from its React host. The component owns the
// lifecycle (translation, API clients, chat scope, attachments store) and
// passes it in, keeping this module framework-free and unit-testable.
export type UploadFilesToChatDeps = {
  // Chat scope (current room/folder id). Files are uploaded there as real
  // portal files; when absent they land in My documents.
  entityId?: string;
  foldersApi: TApiContext["foldersApi"];
  operationsApi: TApiContext["operationsApi"];
  filesSettingsApi: TApiContext["filesSettingsApi"];
  useAttachmentsStore: AttachmentsStore;
  t: TFunction;
};

/**
 * Device upload = portal upload + regular DocSpace attach. Every file (any
 * type — DOCX/PDF/XLSX/images included) is first uploaded into the chat's
 * entity folder through a chunked upload session (the same flow the portal's
 * own uploader uses), then attached by its file id, so the AI backend works
 * with a stored portal file instead of a raw in-memory draft.
 *
 * Shared by the device picker (`<input onChange>`) and drag-and-drop, so both
 * routes behave identically. Archives are rejected up front; per-file failures
 * are collected and surfaced in a single toast without sinking the batch.
 */
export const uploadFilesToChat = async (
  allPicked: File[],
  {
    entityId,
    foldersApi,
    operationsApi,
    filesSettingsApi,
    useAttachmentsStore,
    t,
  }: UploadFilesToChatDeps,
): Promise<void> => {
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

  // Where to store the uploads. The chat scope is only a candidate: the user
  // may lack Create rights there (e.g. chat-only access to an AI agent room),
  // which surfaces as a 403 when the upload session is created — then the
  // whole batch falls back to the My documents section (404 too: a scope
  // folder that disappeared mid-flight).
  let targetFolderId = entityId ? Number(entityId) : undefined;

  // The server rejects chunks above its configured limit, so the chunk size
  // comes from the portal files settings.
  let chunkSize = DEFAULT_CHUNK_UPLOAD_SIZE;
  try {
    const settingsRes = await filesSettingsApi.getFilesSettings();
    chunkSize =
      settingsRes.data.response?.chunkUploadSize ?? DEFAULT_CHUNK_UPLOAD_SIZE;
  } catch {
    // Keep the default; worst case an oversized chunk is rejected and the
    // file is reported as failed.
  }

  // Folder uploads go through the chunked upload session — the same flow the
  // portal's own uploader uses. The simpler `foldersApi.insertFile` cannot be
  // used here: its generated form fields ("InsertFile.Title", …) don't match
  // the flat names the server model binder reads, so the folder variant of
  // /insert always fails with 400.
  const uploadToFolder = async (
    file: File,
    folderId: number,
  ): Promise<UploadedPortalFile> => {
    const sessionRes = await operationsApi.createUploadSessionInFolder({
      folderId,
      sessionRequest: {
        fileName: file.name,
        fileSize: file.size,
        relativePath: "",
        createNewIfExist: true,
      },
    });
    const sessionId = sessionRes.data.response?.id;
    if (!sessionId) return {};

    // Chunks go strictly in order: the server finalizes the session with the
    // last chunk and returns the created file in that response.
    const chunkCount = file.size === 0 ? 1 : Math.ceil(file.size / chunkSize);
    let lastChunkRes;
    for (let i = 0; i < chunkCount; i += 1) {
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      lastChunkRes = await operationsApi.uploadSession({
        folderId,
        sessionId,
        file: new File([chunk], file.name, { type: file.type }),
      });
    }

    const uploaded = lastChunkRes?.data.response;
    return {
      id: uploaded?.file?.id ?? uploaded?.id,
      title: uploaded?.file?.title ?? uploaded?.title,
    };
  };

  const uploadOne = async (file: File): Promise<UploadedPortalFile> => {
    if (targetFolderId !== undefined) {
      try {
        return await uploadToFolder(file, targetFolderId);
      } catch (err) {
        const status = getHttpStatus(err);
        if (status !== 403 && status !== 404) throw err;
        targetFolderId = undefined;
      }
    }
    const res = await foldersApi.insertFileToMyFromBody({
      file,
      title: file.name,
      createNewIfExist: true,
    });
    return {
      id: res.data.response?.id,
      title: res.data.response?.title,
    };
  };

  // Sequential on purpose: parallel multi-file uploads of large documents gain
  // little while making partial-failure reporting messier.
  for (const file of picked) {
    try {
      const created = await uploadOne(file);

      if (created.id === undefined) {
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
    toastr.error(toToastData(err));
  }
};
