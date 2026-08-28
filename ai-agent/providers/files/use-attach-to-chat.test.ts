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

import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

// The hook resolves the attachments store through the widget context; give it
// a fake so the accounting can be driven from the test.
const storeState = {
  attachmentFiles: [] as { id: string; title: string; kind: string; path?: string }[],
  attachmentImages: [] as { id: string; title: string; kind: string; path?: string }[],
  beginPendingAttachments: vi.fn(),
  failPendingAttachments: vi.fn(),
};
const useAttachmentsStore = { getState: () => storeState };
vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({ useAttachmentsStore }),
}));

const attachFilesToChat = vi.fn(async () => []);
vi.mock("./attach-files", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./attach-files")>()),
  attachFilesToChat: () => attachFilesToChat(),
}));

import { useAttachHostFilesToChat } from "./use-attach-to-chat";

// Refs carry `${entryId}/${title}`, the shape the AI backend composes.
const attachedRef = (entryId: string) => ({
  id: `att-${entryId}`,
  title: `file-${entryId}.docx`,
  kind: "file",
  path: `${entryId}/file-${entryId}.docx`,
});

const file = (id: number) => ({ id, title: `file-${id}.docx` });

// Cap the leases at `free` slots, mirroring the store's own truncation.
const leases = (free: number) =>
  vi.fn((inputs: unknown[]) =>
    inputs.slice(0, free).map((_, i) => `pnd-${i + 1}`),
  );

const attach = async (items: Parameters<ReturnType<typeof useAttachHostFilesToChat>>[0]) => {
  const { result } = renderHook(() => useAttachHostFilesToChat());
  return result.current(items);
};

describe("useAttachHostFilesToChat accounting", () => {
  beforeEach(() => {
    storeState.attachmentFiles = [];
    storeState.attachmentImages = [];
    storeState.beginPendingAttachments = leases(5);
    attachFilesToChat.mockClear();
  });

  it("counts nothing when every file is new", async () => {
    expect(await attach([file(1), file(2)])).toEqual({
      attached: 2,
      skipped: 0,
      duplicates: 0,
    });
  });

  it("reports folders as skipped, not as duplicates", async () => {
    const result = await attach([
      { id: 1, title: "folder", isFolder: true },
      file(2),
    ]);
    expect(result).toEqual({ attached: 1, skipped: 1, duplicates: 0 });
  });

  it("reports an already-attached file as a duplicate, not as skipped", async () => {
    storeState.attachmentFiles = [attachedRef("2")];
    const result = await attach([file(2)]);
    expect(result).toEqual({ attached: 0, skipped: 0, duplicates: 1 });
    // Nothing to attach: the round trip must not run at all.
    expect(attachFilesToChat).not.toHaveBeenCalled();
  });

  it("keeps the two reasons apart in one batch", async () => {
    // 1 folder + 1 duplicate + 3 new, but only 2 slots are free.
    storeState.attachmentFiles = [attachedRef("2")];
    storeState.beginPendingAttachments = leases(2);
    const result = await attach([
      { id: 9, title: "folder", isFolder: true },
      file(2),
      file(3),
      file(4),
      file(5),
    ]);
    expect(result).toEqual({ attached: 2, skipped: 2, duplicates: 1 });
  });

  it("matches duplicates against the image bucket too", async () => {
    storeState.attachmentImages = [{ ...attachedRef("7"), kind: "image" }];
    expect(await attach([file(7)])).toEqual({
      attached: 0,
      skipped: 0,
      duplicates: 1,
    });
  });
});
