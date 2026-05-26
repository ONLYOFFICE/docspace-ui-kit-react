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

export type FileWithPath = File & { path?: string };

export const getFileRelativePath = (file: File): string => {
  const rawPath = file.webkitRelativePath || (file as FileWithPath).path || "";
  return rawPath.replace(/^\/+/, "");
};

export const filterFiles = (files: File[], isFolderUpload: boolean): File[] => {
  return files.filter((file) => {
    const hasPath = getFileRelativePath(file).includes("/");
    if (isFolderUpload) {
      return hasPath;
    }
    return !hasPath;
  });
};

export const getRootFolderCount = (files: File[]): number => {
  const roots = new Set(
    files.map((file) => {
      const p = getFileRelativePath(file);
      return p.split("/")[0];
    }),
  );
  return roots.size;
};

export const hasDirectoryInItems = (items: DataTransferItemList): boolean => {
  return Array.from(items).some((item) => {
    const entry = item.webkitGetAsEntry?.();
    return entry?.isDirectory;
  });
};

export const countDirectories = (items: DataTransferItemList): number => {
  return Array.from(items).filter((item) => {
    const entry = item.webkitGetAsEntry?.();
    return entry?.isDirectory;
  }).length;
};

export const countFiles = (items: DataTransferItemList): number => {
  return Array.from(items).filter((item) => {
    const entry = item.webkitGetAsEntry?.();
    return entry?.isFile;
  }).length;
};

export const getEntriesFromItems = (
  items: DataTransferItemList,
): FileSystemEntry[] => {
  const entries: FileSystemEntry[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const entry = item.webkitGetAsEntry?.();
    if (entry) {
      entries.push(entry);
    }
  }
  return entries;
};

export const processEntry = async (
  entry: FileSystemEntry,
  files: File[],
  path = "",
): Promise<void> => {
  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry;
    const file = await new Promise<File>((resolve) => {
      fileEntry.file((f) => {
        Object.defineProperty(f, "webkitRelativePath", {
          value: path + f.name,
          writable: false,
        });
        resolve(f);
      });
    });
    files.push(file);
  } else if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry;
    const reader = dirEntry.createReader();
    const subEntries = await new Promise<FileSystemEntry[]>((resolve) => {
      reader.readEntries((entries) => resolve(entries));
    });
    for (const subEntry of subEntries) {
      await processEntry(subEntry, files, path + entry.name + "/");
    }
  }
};

export const addPathToFiles = (files: File[]): File[] => {
  return files.map((file) => {
    if (file.webkitRelativePath && !(file as FileWithPath).path) {
      Object.defineProperty(file, "path", {
        value: file.webkitRelativePath,
        writable: false,
      });
    }
    return file;
  });
};

export type GetFilesFromEventFn = (
  event: Event,
) => Promise<(File | DataTransferItem)[]> | (File | DataTransferItem)[];

export type CreateCustomGetFilesFromEventOptions = {
  isFolderUpload: boolean;
  isMultipleUpload: boolean;
  onSingleUploadError?: () => void;
  getFilesFromEvent?: GetFilesFromEventFn;
};

export const createCustomGetFilesFromEvent = (
  options: CreateCustomGetFilesFromEventOptions,
) => {
  const {
    isFolderUpload,
    isMultipleUpload,
    onSingleUploadError,
    getFilesFromEvent,
  } = options;

  return async (event: Event): Promise<File[]> => {
    const items = (event as DragEvent).dataTransfer?.items;
    if (!items) {
      if (getFilesFromEvent) {
        const files = await Promise.resolve(getFilesFromEvent(event));
        return filterFiles(files as File[], isFolderUpload);
      }

      const inputEl = event.target as HTMLInputElement;
      if (inputEl?.files?.length) {
        return Array.from(inputEl.files);
      }

      return [];
    }

    const hasDirectory = hasDirectoryInItems(items);

    if (!isFolderUpload && hasDirectory) {
      return [];
    }

    if (isFolderUpload && !hasDirectory) {
      return [];
    }

    if (!isMultipleUpload) {
      if (isFolderUpload) {
        if (countDirectories(items) > 1) {
          onSingleUploadError?.();
          return [];
        }
      } else {
        if (countFiles(items) > 1) {
          onSingleUploadError?.();
          return [];
        }
      }
    }

    if (getFilesFromEvent) {
      const files = await Promise.resolve(getFilesFromEvent(event));
      return files as File[];
    }

    const files: File[] = [];
    const entries = getEntriesFromItems(items);

    for (const entry of entries) {
      const isDirectory = entry.isDirectory;

      if (!isFolderUpload) {
        if (isDirectory) {
          continue;
        }
        await processEntry(entry, files, "");
      } else {
        if (!isDirectory) {
          continue;
        }
        await processEntry(entry, files, "");
      }
    }

    return files;
  };
};
