import { describe, expect, it, vi } from "vitest";
import type { FileDtoInteger } from "@onlyoffice/docspace-api-sdk";

import type { TSelectorItem } from "../../components/selector";
import { convertFilesToItems } from "../utils";
import { applyResolvedTitles, toSelectorFile } from "./FilesSelector.utils";

const encryptedDto = {
  id: 7,
  title: "5b802921-dfc8-4007-9619-e604c0be4972.docx",
  fileExst: ".docx",
  encrypted: true,
  viewUrl: "https://portal/file/7",
  security: {},
} as unknown as FileDtoInteger;

const plainDto = {
  id: 8,
  title: "Budget.xlsx",
  fileExst: ".xlsx",
  viewUrl: "https://portal/file/8",
  security: {},
} as unknown as FileDtoInteger;

const toItems = (files: FileDtoInteger[]) =>
  convertFilesToItems(files, () => "icon.svg", "filter");

const folderItem = {
  id: 3,
  label: "Drafts",
  isFolder: true,
} as unknown as TSelectorItem;

describe("convertFilesToItems", () => {
  it("marks an end-to-end encrypted file", () => {
    const [encrypted, plain] = toItems([encryptedDto, plainDto]);

    expect(encrypted.encrypted).toBe(true);
    expect(plain.encrypted).toBeUndefined();
  });
});

describe("toSelectorFile", () => {
  it("hands the host the file's id, server title, extension, encryption and URL", () => {
    expect(toSelectorFile(encryptedDto)).toEqual({
      id: 7,
      title: "5b802921-dfc8-4007-9619-e604c0be4972.docx",
      fileExst: ".docx",
      encrypted: true,
      viewUrl: "https://portal/file/7",
    });
  });
});

describe("applyResolvedTitles", () => {
  it("returns the rows as they are without a resolver", () => {
    const items = [...toItems([encryptedDto]), folderItem];

    expect(applyResolvedTitles(items)).toBe(items);
  });

  it("shows the resolved title of a file, without its extension in the label", () => {
    const resolve = vi.fn((file: { id: number | string }) =>
      file.id === 7 ? "Quarterly report.docx" : undefined,
    );

    const [encrypted, plain, folder] = applyResolvedTitles(
      [...toItems([encryptedDto, plainDto]), folderItem],
      resolve,
    );

    expect(encrypted).toMatchObject({
      id: 7,
      label: "Quarterly report",
      title: "Quarterly report.docx",
      fileExst: ".docx",
      encrypted: true,
    });
    expect(plain).toMatchObject({ id: 8, label: "Budget" });
    expect(folder).toBe(folderItem);
    expect(resolve.mock.calls.map(([file]) => file)).toEqual([
      {
        id: 7,
        title: "5b802921-dfc8-4007-9619-e604c0be4972.docx",
        fileExst: ".docx",
        encrypted: true,
        viewUrl: "https://portal/file/7",
      },
      {
        id: 8,
        title: "Budget.xlsx",
        fileExst: ".xlsx",
        encrypted: undefined,
        viewUrl: "https://portal/file/8",
      },
    ]);
  });

  it("keeps a row whose resolved title is the server's own", () => {
    const [item] = toItems([plainDto]);

    const [resolved] = applyResolvedTitles([item], (file) => file.title);

    expect(resolved).toBe(item);
  });
});
