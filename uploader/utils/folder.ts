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

    const res = await foldersApi.createFolder({
      folderId: parentId as number,
      createFolder: { title: name },
    });
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
