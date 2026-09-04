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
