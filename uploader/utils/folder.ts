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

import type { FoldersApi } from "@onlyoffice/docspace-api-sdk";

import {
  getFilePath,
  getDirPathFromFilePath,
  getPathSegments,
  isHiddenFilePath,
  isEmptyDirectoryFile,
} from "./path";

export const buildParentFolderMap = async (
  files: File[],
  rootFolderId: string | number,
  foldersApi: FoldersApi,
) => {
  const dirSet = new Set<string>();

  files.forEach((f) => {
    const p = getFilePath(f);
    if (!p) return;

    const dirPath = getDirPathFromFilePath(p);
    if (!dirPath) return;

    const segs = getPathSegments(dirPath);
    for (let i = 1; i <= segs.length; i++) {
      dirSet.add(segs.slice(0, i).join("/"));
    }
  });

  const dirs = Array.from(dirSet).sort(
    (a, b) => getPathSegments(a).length - getPathSegments(b).length,
  );

  const dirToId = new Map<string, string | number>();

  for (const dir of dirs) {
    const segs = getPathSegments(dir);
    const name = segs[segs.length - 1];
    const parentPath = segs.slice(0, -1).join("/");
    const parentId = parentPath ? dirToId.get(parentPath) : rootFolderId;

    if (!parentId) {
      throw new Error("Failed to resolve parent folder");
    }

    const res = await foldersApi.createFolder(
      parentId as unknown as number,
      { title: name },
    );
    const created = res.data?.response;
    if (!created?.id) {
      throw new Error("Failed to create folder");
    }
    dirToId.set(dir, created.id);
  }

  return dirToId;
};

export const prepareFolderUpload = async (
  files: File[],
  rootFolderId: string | number,
  foldersApi: FoldersApi,
): Promise<{ files: File[]; parentFolderMap: Map<File, string | number> }> => {
  const normalizedFiles = files.filter((f) => {
    const p = getFilePath(f);
    if (!p) return true;
    return !isHiddenFilePath(p);
  });

  const dirToId = await buildParentFolderMap(
    normalizedFiles,
    rootFolderId,
    foldersApi,
  );

  const parentFolderMap = new Map<File, string | number>();

  normalizedFiles.forEach((f) => {
    if (isEmptyDirectoryFile(f)) return;

    const p = getFilePath(f);
    const dirPath = getDirPathFromFilePath(p);
    const parentFolderId = dirPath ? dirToId.get(dirPath) : rootFolderId;
    if (parentFolderId) {
      parentFolderMap.set(f, parentFolderId);
    }
  });

  return { files: normalizedFiles, parentFolderMap };
};