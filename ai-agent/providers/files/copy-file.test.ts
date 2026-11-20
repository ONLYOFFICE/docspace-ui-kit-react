import { describe, expect, it, vi } from "vitest";

import { CopyNotStartedError, copyFileToFolder } from "./copy-file";

type Operation = { id: string | null; finished: boolean; error: string | null };

const api = (started: Operation[], statuses: Operation[][] = []) => {
  const getOperationStatuses = vi.fn();
  for (const response of statuses)
    getOperationStatuses.mockResolvedValueOnce({ data: { response } });
  return {
    copyBatchItems: vi.fn().mockResolvedValue({ data: { response: started } }),
    getOperationStatuses,
  };
};

const NO_WAIT = { interval: 0 };

describe("copyFileToFolder", () => {
  it("copies the file next to a namesake, leaving the original where it is", async () => {
    const operations = api([{ id: "op", finished: true, error: null }]);
    await expect(
      copyFileToFolder(
        operations as unknown as Parameters<typeof copyFileToFolder>[0],
        42,
        "7",
        NO_WAIT,
      ),
    ).resolves.toBe(true);
    expect(operations.copyBatchItems).toHaveBeenCalledWith({
      batchRequestDto: {
        fileIds: [42],
        folderIds: [],
        destFolderId: "7",
        conflictResolveType: "Duplicate",
        deleteAfter: false,
      },
    });
    expect(operations.getOperationStatuses).not.toHaveBeenCalled();
  });

  it("waits for a running copy to finish", async () => {
    const operations = api(
      [{ id: "op", finished: false, error: null }],
      [
        [{ id: "op", finished: false, error: null }],
        [
          { id: "other", finished: false, error: null },
          { id: "op", finished: true, error: null },
        ],
      ],
    );
    await expect(
      copyFileToFolder(
        operations as unknown as Parameters<typeof copyFileToFolder>[0],
        42,
        7,
        NO_WAIT,
      ),
    ).resolves.toBe(true);
    expect(operations.getOperationStatuses).toHaveBeenCalledTimes(2);
    expect(operations.getOperationStatuses).toHaveBeenCalledWith({ id: "op" });
  });

  it("reports the portal's error", async () => {
    const operations = api(
      [{ id: "op", finished: false, error: null }],
      [[{ id: "op", finished: true, error: "Access denied" }]],
    );
    await expect(
      copyFileToFolder(
        operations as unknown as Parameters<typeof copyFileToFolder>[0],
        42,
        7,
        NO_WAIT,
      ),
    ).rejects.toThrow("Access denied");
  });

  it.each([
    ["an empty list", []],
    ["no list", undefined],
  ])(
    "fails when the portal starts no operation: %s",
    async (_name, started) => {
      const operations = api(
        started as unknown as Parameters<typeof api>[0],
        [],
      );
      await expect(
        copyFileToFolder(
          operations as unknown as Parameters<typeof copyFileToFolder>[0],
          42,
          7,
          NO_WAIT,
        ),
      ).rejects.toBeInstanceOf(CopyNotStartedError);
      expect(operations.getOperationStatuses).not.toHaveBeenCalled();
    },
  );

  it("stops waiting after its last attempt, the copy still running", async () => {
    const running = { id: "op", finished: false, error: null };
    const operations = api([running], [[running], [running]]);
    await expect(
      copyFileToFolder(
        operations as unknown as Parameters<typeof copyFileToFolder>[0],
        42,
        7,
        { interval: 0, attempts: 2 },
      ),
    ).resolves.toBe(false);
    expect(operations.getOperationStatuses).toHaveBeenCalledTimes(2);
  });
});
