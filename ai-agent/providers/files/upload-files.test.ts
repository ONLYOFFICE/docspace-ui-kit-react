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

const mockToastError = vi.fn();
const mockToastWarning = vi.fn();
vi.mock("../../../components/toast", () => ({
  toastr: {
    error: (...args: unknown[]) => mockToastError(...args),
    warning: (...args: unknown[]) => mockToastWarning(...args),
  },
}));

const mockAttachFilesToChat = vi.fn(async (..._args: unknown[]) => undefined);
vi.mock("./attach-files", () => ({
  attachFilesToChat: (...args: unknown[]) => mockAttachFilesToChat(...args),
}));

import { uploadFilesToChat, type UploadFilesToChatDeps } from "./upload-files";

// ---------------------------------------------------------------------------
// Fake attachments store — just the lease surface the uploader touches.
// ---------------------------------------------------------------------------

let nextLease = 0;
const beginPendingAttachments = vi.fn((inputs: { title: string }[]): string[] =>
  inputs.map(() => `pnd-${++nextLease}`),
);
const failPendingAttachments = vi.fn();

const makeStore = () => ({
  getState: () => ({
    beginPendingAttachments,
    failPendingAttachments,
    attachmentFiles: [],
  }),
});

// ---------------------------------------------------------------------------
// Stub API clients. Uploads resolve through the chunked-session flow; a test
// overrides individual mocks to simulate failures.
// ---------------------------------------------------------------------------

let nextFileId = 0;
const createUploadSessionInFolder = vi.fn(async () => ({
  data: { response: { id: "session-1" } },
}));
const uploadSession = vi.fn(async (args: { file: File }) => ({
  data: {
    response: { file: { id: ++nextFileId, title: args.file.name } },
  },
}));
const insertFileToMyFromBody = vi.fn(async (args: { title: string }) => ({
  data: { response: { id: ++nextFileId, title: args.title } },
}));
const getFilesSettings = vi.fn(async () => ({
  data: { response: { chunkUploadSize: 1024 * 1024 } },
}));

const makeDeps = (): UploadFilesToChatDeps => {
  const deps = {
    entityId: "42",
    foldersApi: { insertFileToMyFromBody },
    operationsApi: { createUploadSessionInFolder, uploadSession },
    filesSettingsApi: { getFilesSettings },
    useAttachmentsStore: makeStore(),
    t: (key: string, opts?: { defaultValue?: string }) =>
      opts?.defaultValue ?? key,
  };
  // The stubs cover the exact call surface uploadFilesToChat touches; the
  // generated API clients' full shapes are irrelevant to these tests.
  return deps as unknown as UploadFilesToChatDeps;
};

const makeFile = (name: string, content = "data", type = "text/plain") =>
  new File([content], name, { type });

beforeEach(() => {
  vi.clearAllMocks();
  mockToastWarning.mockClear();
  nextLease = 0;
  nextFileId = 0;
});

describe("uploadFilesToChat", () => {
  it("rejects archives before any reservation — no chip flash", async () => {
    await uploadFilesToChat([makeFile("bundle.zip")], makeDeps());
    expect(beginPendingAttachments).not.toHaveBeenCalled();
    expect(mockAttachFilesToChat).not.toHaveBeenCalled();
    expect(mockToastError).toHaveBeenCalledTimes(1);
  });

  it("reserves chips up front and hands the leases to attachFilesToChat", async () => {
    await uploadFilesToChat(
      [makeFile("a.docx"), makeFile("b.docx")],
      makeDeps(),
    );
    expect(beginPendingAttachments).toHaveBeenCalledTimes(1);
    expect(mockAttachFilesToChat).toHaveBeenCalledTimes(1);
    const [, inputs, , settledIds] = mockAttachFilesToChat.mock
      .calls[0] as unknown[];
    expect(inputs).toHaveLength(2);
    expect(settledIds).toEqual(["pnd-1", "pnd-2"]);
    expect(failPendingAttachments).not.toHaveBeenCalled();
  });

  it("truncates the batch to what the reservation accepted", async () => {
    beginPendingAttachments.mockReturnValueOnce(["pnd-1"]);
    await uploadFilesToChat(
      [makeFile("a.docx"), makeFile("b.docx")],
      makeDeps(),
    );
    // Only the accepted file was uploaded and attached.
    expect(createUploadSessionInFolder).toHaveBeenCalledTimes(1);
    const [, inputs] = mockAttachFilesToChat.mock.calls[0] as unknown[];
    expect(inputs).toHaveLength(1);
    // The refused tail was reported through the shared limit notice.
    expect(mockToastWarning).toHaveBeenCalledTimes(1);
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it("fails exactly the lease of a file whose upload threw", async () => {
    createUploadSessionInFolder
      .mockRejectedValueOnce(
        Object.assign(new Error("boom"), { response: { status: 500 } }),
      )
      .mockImplementationOnce(async () => ({
        data: { response: { id: "session-2" } },
      }));
    await uploadFilesToChat(
      [makeFile("bad.docx"), makeFile("good.docx")],
      makeDeps(),
    );
    expect(failPendingAttachments).toHaveBeenCalledWith(["pnd-1"]);
    const [, inputs, , settledIds] = mockAttachFilesToChat.mock
      .calls[0] as unknown[];
    expect(inputs).toHaveLength(1);
    expect(settledIds).toEqual(["pnd-2"]);
    expect(mockToastError).toHaveBeenCalledTimes(1); // upload-failure toast
  });

  it("falls back to My documents on 403 without touching leases", async () => {
    createUploadSessionInFolder.mockRejectedValueOnce(
      Object.assign(new Error("forbidden"), { response: { status: 403 } }),
    );
    await uploadFilesToChat([makeFile("a.docx")], makeDeps());
    expect(insertFileToMyFromBody).toHaveBeenCalledTimes(1);
    expect(failPendingAttachments).not.toHaveBeenCalled();
    const [, , , settledIds] = mockAttachFilesToChat.mock.calls[0] as unknown[];
    expect(settledIds).toEqual(["pnd-1"]);
  });

  it("fails the settled leases when the final attach throws", async () => {
    mockAttachFilesToChat.mockRejectedValueOnce(new Error("attach failed"));
    await uploadFilesToChat([makeFile("a.docx")], makeDeps());
    expect(failPendingAttachments).toHaveBeenCalledWith(["pnd-1"]);
    expect(mockToastError).toHaveBeenCalledTimes(1);
  });
});

