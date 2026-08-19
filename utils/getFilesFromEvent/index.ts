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

import React from "react";

type DropEvent =
  | DragEvent
  | ClipboardEvent
  | Event
  | React.DragEvent<HTMLElement>
  | React.ClipboardEvent<HTMLElement>
  | React.ChangeEvent<HTMLInputElement>;

function toFileWithPath(file: File, path?: string): File {
  if (typeof (file as File & { path?: string })?.path === "string") return file;

  // on electron, path is already set to the absolute path
  const { webkitRelativePath } = file as File & { webkitRelativePath?: string };
  Object.defineProperty(file, "path", {
    value:
      typeof path === "string"
        ? path
        : // If <input webkitdirectory> is set,
          // the File will have a {webkitRelativePath} property
          // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory
          typeof webkitRelativePath === "string" &&
            webkitRelativePath.length > 0
          ? webkitRelativePath
          : file.name,
  });

  return file;
}

const FILES_TO_IGNORE = [
  // Thumbnail cache files for macOS and Windows
  ".DS_Store",
  "Thumbs.db", // Windows
];
/**
 * Convert a DragEvent's DataTrasfer object to a list of File objects
 * NOTE: If some of the items are folders,
 * everything will be flattened and placed in the same list but the paths will be kept as a {path} property.
 * @param evt
 */
export default async function getFilesFromEvent(
  evt: DropEvent,
): Promise<File[]> {
  const dragEvt = evt as DragEvent | React.DragEvent<HTMLElement>;
  const clipEvt = evt as ClipboardEvent | React.ClipboardEvent<HTMLElement>;
  const dataTransfer = dragEvt.dataTransfer ?? clipEvt.clipboardData;
  return (isDragEvt(evt) && dragEvt.dataTransfer) || clipEvt.clipboardData
    ? getDataTransferFiles(dataTransfer!, evt.type)
    : getInputFiles(evt);
}

function isDragEvt(
  value: DropEvent,
): value is DragEvent | React.DragEvent<HTMLElement> {
  return !!(value as DragEvent | React.DragEvent<HTMLElement>).dataTransfer;
}

function getInputFiles(evt: DropEvent): File[] {
  const files = isInput(evt.target)
    ? evt.target.files
      ? fromList<File>(evt.target.files)
      : []
    : [];
  return files.map((file) => toFileWithPath(file));
}

function isInput(value: EventTarget | null): value is HTMLInputElement {
  return value !== null && (value as HTMLInputElement).files !== undefined;
}

async function getDataTransferFiles(
  dt: DataTransfer,
  type: string,
): Promise<File[]> {
  // IE11 does not support dataTransfer.items
  // See https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/items#Browser_compatibility
  if (dt.items) {
    const items = fromList<DataTransferItem>(dt.items).filter(
      (item) => item.kind === "file",
    );
    // According to https://html.spec.whatwg.org/multipage/dnd.html#dndevents,
    // only 'dragstart' and 'drop' has access to the data (source node)
    if (type !== "drop" && type !== "paste") {
      return items as unknown as File[];
    }
    const files = await Promise.all(items.map(toFilePromises));
    return noIgnoredFiles(flatten(files));
  }
  return noIgnoredFiles(
    fromList<File>(dt.files).map((file) => toFileWithPath(file)),
  );
}

function noIgnoredFiles(files: File[]): File[] {
  return files.filter(
    (file: File) => FILES_TO_IGNORE.indexOf(file.name) === -1,
  );
}

// IE11 does not support Array.from()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Browser_compatibility
// https://developer.mozilla.org/en-US/docs/Web/API/FileList
// https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItemList
function fromList<T>(items: FileList | DataTransferItemList): T[] {
  const files: T[] = [];
  for (let i = 0; i < items.length; i++) {
    const file = items[i] as T;
    files.push(file);
  }
  return files;
}

// https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
function toFilePromises(item: DataTransferItem): Promise<File | File[]> {
  if (
    typeof (
      item as DataTransferItem & { webkitGetAsEntry?: () => FileSystemEntry }
    ).webkitGetAsEntry !== "function"
  ) {
    return fromDataTransferItem(item);
  }
  const entry = (
    item as DataTransferItem & { webkitGetAsEntry: () => FileSystemEntry }
  ).webkitGetAsEntry();
  // Safari supports dropping an image node from a different window and can be retrieved using
  // the DataTransferItem.getAsFile() API
  // NOTE: FileSystemEntry.file() throws if trying to get the file
  if (entry && entry.isDirectory) {
    return fromDirEntry(entry as FileSystemDirectoryEntry);
  }
  return fromDataTransferItem(item);
}

function flatten(items: (File | File[])[]): File[] {
  return items.reduce(
    (acc: File[], files: File | File[]) => [
      ...acc,
      ...(Array.isArray(files) ? flatten(files) : [files]),
    ],
    [],
  );
}

function fromDataTransferItem(item: DataTransferItem): Promise<File> {
  const file = item.getAsFile();
  if (!file) {
    return Promise.reject(`${item} is not a File`);
  }
  const fwp = toFileWithPath(file);
  return Promise.resolve(fwp);
}

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
async function fromEntry(entry: FileSystemEntry): Promise<File | File[]> {
  return entry.isDirectory
    ? fromDirEntry(entry as FileSystemDirectoryEntry)
    : fromFileEntry(entry as FileSystemFileEntry);
}

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry
function fromDirEntry(entry: FileSystemDirectoryEntry): Promise<File[]> {
  const reader = entry.createReader();
  return new Promise((resolve, reject) => {
    const entries: Promise<(File | File[])[]>[] = [];
    let empty = true;
    function readEntries() {
      // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry/createReader
      // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
      reader.readEntries(
        async (batch: FileSystemEntry[]) => {
          if (!batch.length) {
            // Done reading directory
            try {
              const files = await Promise.all(entries);
              const flatFiles = flatten(files.flat());
              if (empty) {
                flatFiles.push(createEmptyDirFile(entry));
              }
              resolve(flatFiles);
            } catch (err) {
              reject(err);
            }
          } else {
            const items = Promise.all(batch.map(fromEntry));
            entries.push(items);
            // Continue reading
            empty = false;
            readEntries();
          }
        },
        (err: Error) => {
          reject(err);
        },
      );
    }
    readEntries();
  });
}

function createEmptyDirFile(entry: FileSystemDirectoryEntry): File {
  const file = new File([], entry.name);
  const fwp = toFileWithPath(file, entry.fullPath + "/");

  Object.defineProperty(fwp, "isEmptyDirectory", {
    value: true,
  });
  return fwp;
}

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileEntry
async function fromFileEntry(entry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => {
    entry.file(
      (file: File) => {
        const fwp = toFileWithPath(file, entry.fullPath);
        resolve(fwp);
      },
      (err: Error) => {
        reject(err);
      },
    );
  });
}
