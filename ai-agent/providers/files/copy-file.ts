import {
  FileConflictResolveType,
  type FileOperationDto,
  type OperationsApi,
} from "@onlyoffice/docspace-api-sdk";

/** How often, and how many times, a running copy is asked for its state. */
const POLL_INTERVAL_MS = 500;
const POLL_ATTEMPTS = 120;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Puts a copy of a portal file into a folder or room with the Files copy
 * operation, leaving the file where it is. A file of the same name there is
 * kept and the copy is numbered, as the product's own "Copy" does on "Keep
 * both". The copy runs in the background on the portal, so its state is
 * read until it finishes.
 *
 * Resolves `true` once the copy is done, `false` when it is still running
 * after the wait (it may yet land); rejects with the portal's error.
 */
/**
 * The portal answered the copy request without an operation to follow, so
 * nothing says a copy is under way.
 */
export class CopyNotStartedError extends Error {
  constructor() {
    super("The portal started no copy operation");
    this.name = "CopyNotStartedError";
  }
}

export const copyFileToFolder = async (
  operationsApi: Pick<OperationsApi, "copyBatchItems" | "getOperationStatuses">,
  fileId: number | string,
  folderId: number | string,
  { interval = POLL_INTERVAL_MS, attempts = POLL_ATTEMPTS } = {},
): Promise<boolean> => {
  const started = await operationsApi.copyBatchItems({
    batchRequestDto: {
      fileIds: [fileId],
      folderIds: [],
      destFolderId: folderId,
      conflictResolveType: FileConflictResolveType.Duplicate,
      deleteAfter: false,
    },
  });
  let operation: FileOperationDto | undefined = started.data.response?.[0];
  // No operation is no copy: reporting it done would name a file that is
  // not in the folder.
  if (!operation) throw new CopyNotStartedError();
  for (let attempt = 0; !operation.finished; attempt += 1) {
    if (attempt >= attempts) return false;
    await wait(interval);
    const id: string | null = operation.id;
    const statuses = await operationsApi.getOperationStatuses(
      id ? { id } : undefined,
    );
    operation =
      statuses.data.response?.find((item) => item.id === id) ?? operation;
  }
  if (operation.error) throw new Error(operation.error);
  return true;
};
