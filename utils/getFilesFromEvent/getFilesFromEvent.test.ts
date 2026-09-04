import type React from "react";
import { describe, it, expect } from "vitest";

import getFilesFromEvent from ".";

type MutableFileList = {
  length: number;
  item: (index: number) => File | null;
} & { [index: number]: File };

type MutableDataTransferItemList = {
  length: number;
  item: (index: number) => DataTransferItem | null;
} & { [index: number]: DataTransferItem };

const createFileList = (files: File[]): FileList => {
  const list: MutableFileList = {
    length: files.length,
    item: (index: number) => files[index] ?? null,
  };

  files.forEach((file, index) => {
    list[index] = file;
  });

  return list as unknown as FileList;
};

const createDataTransferItemList = (
  items: DataTransferItem[],
): DataTransferItemList => {
  const list: MutableDataTransferItemList = {
    length: items.length,
    item: (index: number) => items[index] ?? null,
  };

  items.forEach((item, index) => {
    list[index] = item;
  });

  return list as unknown as DataTransferItemList;
};

type ReaderCallback = (entries: FileSystemEntry[]) => void;

const createDirectoryEntry = (
  name: string,
  fullPath: string,
  batches: FileSystemEntry[][],
): FileSystemDirectoryEntry => {
  let callIndex = 0;
  return {
    isDirectory: true,
    isFile: false,
    name,
    fullPath,
    filesystem: {} as FileSystem,
    createReader: () => ({
      readEntries: (success: ReaderCallback) => {
        const batch = batches[callIndex] ?? [];
        callIndex += 1;
        success(batch);
      },
    }),
  } as unknown as FileSystemDirectoryEntry;
};

const createFileEntry = (
  file: File,
  fullPath: string,
): FileSystemFileEntry =>
  ({
    isDirectory: false,
    isFile: true,
    name: file.name,
    fullPath,
    filesystem: {} as FileSystem,
    file: (success: (f: File) => void) => success(file),
  }) as unknown as FileSystemFileEntry;

const createDirectoryDataTransferItem = (
  entry: FileSystemDirectoryEntry,
): DataTransferItem & { webkitGetAsEntry: () => FileSystemEntry } =>
  ({
    kind: "file",
    type: "application/dir",
    getAsFile: () => null,
    getAsString: () => undefined,
    webkitGetAsEntry: () => entry,
  }) as unknown as DataTransferItem & {
    webkitGetAsEntry: () => FileSystemEntry;
  };

describe("getFilesFromEvent", () => {
  it("returns files from input change events", async () => {
    const file = new File(["hello"], "document.txt", { type: "text/plain" });
    const event = {
      target: { files: createFileList([file]) },
      type: "change",
    } as React.ChangeEvent<HTMLInputElement>;

    const files = await getFilesFromEvent(event);

    expect(files).toHaveLength(1);
    expect(files[0].name).toBe("document.txt");
    expect((files[0] as File & { path?: string }).path).toBe("document.txt");
  });

  it("filters ignored files when reading from dataTransfer.files", async () => {
    const valid = new File(["data"], "keep-me.txt", { type: "text/plain" });
    const ignored = new File(["cache"], ".DS_Store", { type: "text/plain" });

    const dataTransfer = {
      files: createFileList([valid, ignored]),
    } as unknown as DataTransfer;

    const event = {
      dataTransfer,
      type: "drop",
    } as DragEvent;

    const files = await getFilesFromEvent(event);

    expect(files).toHaveLength(1);
    expect(files[0].name).toBe("keep-me.txt");
  });

  it("converts DataTransfer items to files for drop events", async () => {
    const file = new File(["content"], "from-item.txt", {
      type: "text/plain",
    });
    const item = {
      kind: "file",
      type: "text/plain",
      getAsFile: () => file,
    } as DataTransferItem;

    const dataTransfer = {
      items: createDataTransferItemList([item]),
    } as unknown as DataTransfer;

    const event = {
      dataTransfer,
      type: "drop",
    } as DragEvent;

    const files = await getFilesFromEvent(event);

    expect(files).toHaveLength(1);
    expect(files[0]).toBe(file);
    expect((files[0] as File & { path?: string }).path).toBe("from-item.txt");
  });

  it("returns raw items when drag type is not drop or paste", async () => {
    const file = new File(["content"], "pending.txt", { type: "text/plain" });
    const item = {
      kind: "file",
      type: "text/plain",
      getAsFile: () => file,
    } as DataTransferItem;

    const dataTransfer = {
      items: createDataTransferItemList([item]),
    } as unknown as DataTransfer;

    const event = {
      dataTransfer,
      type: "dragover",
    } as DragEvent;

    const files = await getFilesFromEvent(event);

    expect(files).toEqual([item]);
  });

  it("rejects when a DataTransferItem cannot produce a File", async () => {
    const item = {
      kind: "file",
      type: "text/plain",
      getAsFile: () => null,
    } as DataTransferItem;

    const dataTransfer = {
      items: createDataTransferItemList([item]),
    } as unknown as DataTransfer;

    const event = {
      dataTransfer,
      type: "drop",
    } as DragEvent;

    await expect(getFilesFromEvent(event)).rejects.toMatch("is not a File");
  });

  it("creates placeholder files for empty directories", async () => {
    const directoryEntry = createDirectoryEntry("empty", "/empty", [[]]);

    const item = createDirectoryDataTransferItem(directoryEntry);

    const dataTransfer = {
      items: createDataTransferItemList([item]),
    } as unknown as DataTransfer;

    const event = {
      dataTransfer,
      type: "drop",
    } as DragEvent;

    const files = await getFilesFromEvent(event);

    expect(files).toHaveLength(1);
    const [dirFile] = files as (File & {
      path?: string;
      isEmptyDirectory?: boolean;
    })[];
    expect(dirFile.path).toBe("/empty/");
    expect(dirFile.isEmptyDirectory).toBe(true);
  });

  it("reads nested directory entries returned from DataTransfer items", async () => {
    const nestedFile = new File(["nested"], "nested.txt", {
      type: "text/plain",
    });
    const fileEntry = createFileEntry(nestedFile, "/dir/nested.txt");
    const directoryEntry = createDirectoryEntry("dir", "/dir", [
      [fileEntry],
      [],
    ]);

    const item = createDirectoryDataTransferItem(directoryEntry);

    const dataTransfer = {
      items: createDataTransferItemList([item]),
    } as unknown as DataTransfer;

    const event = {
      dataTransfer,
      type: "drop",
    } as DragEvent;

    const files = await getFilesFromEvent(event);

    expect(files).toHaveLength(1);
    expect(files[0].name).toBe("nested.txt");
    expect((files[0] as File & { path?: string }).path).toBe("/dir/nested.txt");
  });
});
