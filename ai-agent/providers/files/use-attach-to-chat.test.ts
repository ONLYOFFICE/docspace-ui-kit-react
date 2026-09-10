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

import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

// The hook resolves the attachments store through the widget context; give it
// a fake so the accounting can be driven from the test.
type FakeRef = { id: string; title: string; kind: string; path?: string };

// An analyze attach empties the draft first, so the fake clears mirror the
// store's own: they drop the refs and resolve.
const clearAttachmentFiles = vi.fn(async () => {
  storeState.attachmentFiles = [];
});
const clearAttachmentImages = vi.fn(async () => {
  storeState.attachmentImages = [];
});

const storeState = {
  attachmentFiles: [] as FakeRef[],
  attachmentImages: [] as FakeRef[],
  pendingAttachments: [] as { kind: "file" | "image" }[],
  beginPendingAttachments: vi.fn(),
  failPendingAttachments: vi.fn(),
  clearAttachmentFiles,
  clearAttachmentImages,
};
const useAttachmentsStore = { getState: () => storeState };
vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({ useAttachmentsStore }),
}));

const attachFilesToChat = vi.fn(
  async (): Promise<{ id: string; canAnalyze?: boolean }[]> => [],
);
vi.mock("./attach-files", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./attach-files")>()),
  attachFilesToChat: () => attachFilesToChat(),
}));

import { OnFilesAttachedContext } from "./attached-report";
import { AttachmentLimitContext } from "./attachment-limit";
import { rememberFormAttachments } from "./form-attachments";
import { useAttachHostFilesToChat } from "./use-attach-to-chat";

// Refs carry `${entryId}/${title}`, the shape the AI backend composes.
const attachedRef = (entryId: string) => ({
  id: `att-${entryId}`,
  title: `file-${entryId}.docx`,
  kind: "file",
  path: `${entryId}/file-${entryId}.docx`,
});

const file = (id: number) => ({ id, title: `file-${id}.docx` });

// Cap the leases at `free` slots, mirroring the store's own truncation —
// placeholders included, since the enforced cap is read back off them.
const leases = (free: number) =>
  vi.fn((inputs: unknown[]) => {
    const accepted = inputs.slice(0, free);
    accepted.forEach(() =>
      storeState.pendingAttachments.push({ kind: "file" }),
    );
    return accepted.map((_, i) => `pnd-${i + 1}`);
  });

type AttachItems = Parameters<
  ReturnType<typeof useAttachHostFilesToChat>
>[0];

const attach = async (items: AttachItems) => {
  const { result } = renderHook(() => useAttachHostFilesToChat());
  return result.current(items);
};

// Same call, but under a per-section attachment cap — what the Forms section
// puts around the host subtree.
const attachUnderLimit = async (items: AttachItems, limit: number) => {
  const { result } = renderHook(() => useAttachHostFilesToChat(), {
    wrapper: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        AttachmentLimitContext.Provider,
        { value: { limit, reason: "section" as const } },
        children,
      ),
  });
  return result.current(items);
};

// Same call, but under the provider's attach reporter — the context the chat
// providers put around the host subtree.
const attachUnderReporter = async (
  items: AttachItems,
  onFilesAttached: (attached: { id: string; canAnalyze?: boolean }[]) => void,
) => {
  const { result } = renderHook(() => useAttachHostFilesToChat(), {
    wrapper: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        OnFilesAttachedContext.Provider,
        { value: onFilesAttached },
        children,
      ),
  });
  return result.current(items);
};

describe("useAttachHostFilesToChat accounting", () => {
  beforeEach(() => {
    storeState.attachmentFiles = [];
    storeState.attachmentImages = [];
    storeState.pendingAttachments = [];
    storeState.beginPendingAttachments = leases(5);
    attachFilesToChat.mockClear();
    clearAttachmentFiles.mockClear();
    clearAttachmentImages.mockClear();
  });

  it("counts nothing when every file is new", async () => {
    expect(await attach([file(1), file(2)])).toEqual({
      attached: 2,
      skippedFolders: 0,
      skippedOverLimit: 0,
      cap: { limit: 5, reason: "widget" },
      duplicates: 0,
    });
  });

  it("counts a folder as a folder, not as a duplicate or a cap skip", async () => {
    const result = await attach([
      { id: 1, title: "folder", isFolder: true },
      file(2),
    ]);
    expect(result).toEqual({
      attached: 1,
      skippedFolders: 1,
      skippedOverLimit: 0,
      cap: { limit: 5, reason: "widget" },
      duplicates: 0,
    });
  });

  it("counts an already-attached file as a duplicate", async () => {
    storeState.attachmentFiles = [attachedRef("2")];
    const result = await attach([file(2)]);
    expect(result).toEqual({
      attached: 0,
      skippedFolders: 0,
      skippedOverLimit: 0,
      cap: { limit: 5, reason: "widget" },
      duplicates: 1,
    });
    // Nothing to attach: the round trip must not run at all.
    expect(attachFilesToChat).not.toHaveBeenCalled();
  });

  it("keeps every reason apart in one batch", async () => {
    // 1 folder + 1 duplicate + 3 new, but the composer holds 3 of the 5
    // slots already (one of them the duplicate), so only 2 get through.
    storeState.attachmentFiles = [
      attachedRef("2"),
      attachedRef("90"),
      attachedRef("91"),
    ];
    storeState.beginPendingAttachments = leases(2);
    const result = await attach([
      { id: 9, title: "folder", isFolder: true },
      file(2),
      file(3),
      file(4),
      file(5),
    ]);
    expect(result).toEqual({
      attached: 2,
      skippedFolders: 1,
      skippedOverLimit: 1,
      cap: { limit: 5, reason: "widget" },
      duplicates: 1,
    });
  });

  // "Analyze responses" owns the message: whatever the user had picked before
  // is dropped, so the form does not end up competing for the single slot.
  it("empties the draft before attaching an analyze subject", async () => {
    storeState.attachmentFiles = [attachedRef("90")];
    storeState.attachmentImages = [{ ...attachedRef("91"), kind: "image" }];

    const result = await attach([{ ...file(1), analyzeOnly: true }]);

    expect(clearAttachmentFiles).toHaveBeenCalledTimes(1);
    expect(clearAttachmentImages).toHaveBeenCalledTimes(1);
    expect(result.attached).toBe(1);
  });

  // Clicking "Analyze responses" again on the form the message already
  // carries changes nothing, so it must say "already attached" rather than
  // silently mint a second record — the clear would otherwise hide the
  // duplicate from the filter.
  it("reports the subject as a duplicate instead of re-attaching it", async () => {
    storeState.attachmentFiles = [attachedRef("1")];
    rememberFormAttachments(useAttachmentsStore as never, {
      withResults: [],
      analyzeOnly: ["att-1"],
    });

    const result = await attach([{ ...file(1), analyzeOnly: true }]);

    expect(result).toEqual({
      attached: 0,
      skippedFolders: 0,
      skippedOverLimit: 0,
      duplicates: 1,
      cap: { limit: 5, reason: "widget" },
    });
    expect(clearAttachmentFiles).not.toHaveBeenCalled();
    expect(attachFilesToChat).not.toHaveBeenCalled();
  });

  // The same form attached as an ordinary file is not the subject yet, so
  // the analyze request has to go through and make it one.
  it("re-attaches a form that is attached but not the subject", async () => {
    storeState.attachmentFiles = [attachedRef("2")];

    const result = await attach([{ ...file(2), analyzeOnly: true }]);

    expect(clearAttachmentFiles).toHaveBeenCalledTimes(1);
    expect(result.attached).toBe(1);
    expect(result.duplicates).toBe(0);
  });

  it("leaves the draft alone for an ordinary attach", async () => {
    storeState.attachmentFiles = [attachedRef("90")];

    await attach([file(1)]);

    expect(clearAttachmentFiles).not.toHaveBeenCalled();
    expect(clearAttachmentImages).not.toHaveBeenCalled();
  });

  // The Forms section allows a single attachment, and the widget's store
  // knows nothing about that — so the cap has to be applied before the
  // reservation, or a lease we then dropped would strand a loading chip.
  it("applies the section cap of one and reports it", async () => {
    const result = await attachUnderLimit([file(1), file(2)], 1);

    expect(result).toEqual({
      attached: 1,
      skippedFolders: 0,
      skippedOverLimit: 1,
      cap: { limit: 1, reason: "section" },
      duplicates: 0,
    });
    // One lease asked for, so no chip is left without a payload.
    expect(storeState.beginPendingAttachments).toHaveBeenCalledWith([
      expect.objectContaining({ title: "file-1.docx" }),
    ]);
  });

  it("refuses everything when the single slot is taken", async () => {
    storeState.attachmentFiles = [attachedRef("90")];

    const result = await attachUnderLimit([file(1)], 1);

    expect(result).toEqual({
      attached: 0,
      skippedFolders: 0,
      skippedOverLimit: 1,
      cap: { limit: 1, reason: "section" },
      duplicates: 0,
    });
    expect(storeState.beginPendingAttachments).not.toHaveBeenCalled();
    expect(attachFilesToChat).not.toHaveBeenCalled();
  });

  // `CHAT_ATTACHMENT_LIMIT` is a hand-kept copy of a cap that lives inside
  // `@onlyoffice/ai-chat` and is not exported, while the toast quotes it to
  // the user. A truncated reservation reveals the real cap, so drift has to
  // surface there instead of silently showing a wrong number.
  it("shouts when the widget enforces a different cap", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    // The composer holds one file and the store refuses the second — an
    // enforced cap of 2, not the 5 the copy promises.
    storeState.attachmentFiles = [attachedRef("90")];
    storeState.beginPendingAttachments = leases(1);
    await attach([file(1), file(2)]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("attachment cap drift");
    warn.mockRestore();
  });

  // The drop zone and the "Ask AI" action attach through this hook, and
  // `canAnalyze` lives in the attach response alone — unreported, the chat
  // would offer the analyze suggestions only for files picked in the dialog.
  it("reports what the backend echoed back to the provider's reporter", async () => {
    const records = [
      { id: "att-1", canAnalyze: true },
      { id: "att-2", canAnalyze: false },
    ];
    attachFilesToChat.mockResolvedValueOnce(records);
    const onFilesAttached = vi.fn();

    await attachUnderReporter([file(1), file(2)], onFilesAttached);

    expect(onFilesAttached).toHaveBeenCalledTimes(1);
    expect(onFilesAttached).toHaveBeenCalledWith(records);
  });

  it("reports nothing when the round trip fails", async () => {
    attachFilesToChat.mockRejectedValueOnce(new Error("boom"));
    const onFilesAttached = vi.fn();

    await expect(
      attachUnderReporter([file(1)], onFilesAttached),
    ).rejects.toThrow("boom");
    expect(onFilesAttached).not.toHaveBeenCalled();
  });

  it("matches duplicates against the image bucket too", async () => {
    storeState.attachmentImages = [{ ...attachedRef("7"), kind: "image" }];
    expect(await attach([file(7)])).toEqual({
      attached: 0,
      skippedFolders: 0,
      skippedOverLimit: 0,
      cap: { limit: 5, reason: "widget" },
      duplicates: 1,
    });
  });
});
