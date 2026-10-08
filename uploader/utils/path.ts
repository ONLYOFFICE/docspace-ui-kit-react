import type {
  TFileWithOptionalPath,
  TFileWithOptionalEmptyDir,
} from "../Uploader.types";

export const normalizePath = (path: string) => path.replace(/^\/+/, "").trim();

export const isHiddenFilePath = (path: string) => /(^|\/)\.[^\/\.]/g.test(path);

export const getDirPathFromFilePath = (filePath: string) => {
  const normalized = normalizePath(filePath);

  if (!normalized) return "";

  if (normalized.endsWith("/")) {
    return normalized.replace(/\/+$/, "");
  }

  const parts = normalized.split("/");
  if (parts.length <= 1) return "";

  return parts.slice(0, -1).join("/");
};

export const getPathSegments = (dirPath: string) =>
  normalizePath(dirPath).split("/").filter(Boolean);

export const getFilePath = (file: File) => {
  const f = file as TFileWithOptionalPath;
  if (typeof f.path === "string" && f.path.length > 0) return f.path;
  if (file.webkitRelativePath && file.webkitRelativePath.length > 0)
    return file.webkitRelativePath;
  return file.name;
};

export const isEmptyDirectoryFile = (file: File) => {
  const f = file as TFileWithOptionalEmptyDir;
  return f.isEmptyDirectory === true;
};
