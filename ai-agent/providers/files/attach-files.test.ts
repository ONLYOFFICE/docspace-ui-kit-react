import { beforeEach, describe, expect, it, vi } from "vitest";

import { attachFilesToChat } from "./attach-files";
import { getFormRegistry, hasFormResults } from "./form-attachments";

// ---------------------------------------------------------------------------
// Fake attachments store: the refs the dedupe reads, plus the lease surface.
// A ref lands in `attachmentFiles` the moment `addAttachmentFile` resolves,
// exactly as the real store does.
// ---------------------------------------------------------------------------

type Ref = { id: string; title: string; kind: "file"; path?: string };

const makeStore = (attachmentFiles: Ref[] = []) => {
  const failPendingAttachments = vi.fn();
  let nextId = 0;
  const addAttachmentFile = vi.fn(
    async (
      inputs: { path: string; title: string }[],
      _options?: { pendingIds?: string[] },
    ) => {
      const records = inputs.map((input) => ({
        id: `att-${++nextId}`,
        title: input.title,
        kind: "file" as const,
        path: input.path,
      }));
      attachmentFiles.push(...records);
      return records;
    },
  );

  const store = {
    getState: () => ({
      attachmentFiles,
      attachmentImages: [] as Ref[],
      addAttachmentFile,
      failPendingAttachments,
    }),
    setState: vi.fn(),
  };

  return { store, addAttachmentFile, failPendingAttachments, attachmentFiles };
};

const input = (path: string, hasFormResults = false) => ({
  path,
  title: hasFormResults ? `${path}.pdf` : `${path}.docx`,
  type: 7,
  content: "",
  hasFormResults,
});

// The helper is typed against the widget's store; the fake carries only the
// slice it touches.
const asStore = (store: unknown) =>
  store as Parameters<typeof attachFilesToChat>[0];

describe("attachFilesToChat duplicates", () => {
  beforeEach(() => vi.clearAllMocks());

  it("drops a file already attached to the message", async () => {
    const { store, addAttachmentFile } = makeStore([
      { id: "att-0", title: "a.docx", kind: "file", path: "11" },
    ]);

    const attached = await attachFilesToChat(
      asStore(store),
      [input("11"), input("22")],
      new Set(),
    );

    expect(addAttachmentFile).toHaveBeenCalledTimes(1);
    expect(addAttachmentFile.mock.calls[0][0]).toEqual([input("22")]);
    expect(attached).toHaveLength(1);
  });

  it("matches the `entryId/title` path the backend echoes back", async () => {
    // dtoToAttachment composes path as `${entryId}/${title}`, while the host
    // sends the bare entry id.
    const { store, addAttachmentFile } = makeStore([
      {
        id: "att-0",
        title: "New document.docx",
        kind: "file",
        path: "11/New document.docx",
      },
    ]);

    await attachFilesToChat(asStore(store), [input("11")], new Set());

    expect(addAttachmentFile).not.toHaveBeenCalled();
  });

  it("matches a path that picked up a leading slash", async () => {
    // The composition is the backend's convention, not a contract this repo
    // enforces — a stray leading slash must not reduce to an empty key.
    const { store, addAttachmentFile } = makeStore([
      {
        id: "att-0",
        title: "New document.docx",
        kind: "file",
        path: "/11/New document.docx",
      },
    ]);

    await attachFilesToChat(asStore(store), [input("11")], new Set());

    expect(addAttachmentFile).not.toHaveBeenCalled();
  });

  it("falls back to the remembered path when the record echoes none", async () => {
    const attachmentFiles: Ref[] = [];
    const { store, addAttachmentFile } = makeStore(attachmentFiles);
    // The first attach lands a ref the backend returned without a path.
    await attachFilesToChat(asStore(store), [input("11")], new Set());
    attachmentFiles.forEach((ref) => {
      ref.path = undefined;
    });

    await attachFilesToChat(asStore(store), [input("11")], new Set());

    expect(addAttachmentFile).toHaveBeenCalledTimes(1);
  });

  it("attaches a file repeated inside one batch only once", async () => {
    const { store, addAttachmentFile } = makeStore();

    await attachFilesToChat(
      asStore(store),
      [input("11"), input("11"), input("22")],
      new Set(),
    );

    expect(addAttachmentFile.mock.calls[0][0]).toEqual([
      input("11"),
      input("22"),
    ]);
  });

  it("releases the loading chips of the dropped duplicates", async () => {
    const { store, failPendingAttachments, addAttachmentFile } = makeStore([
      { id: "att-0", title: "a.docx", kind: "file", path: "11" },
    ]);

    await attachFilesToChat(
      asStore(store),
      [input("11"), input("22")],
      new Set(),
      ["pnd-1", "pnd-2"],
    );

    expect(failPendingAttachments).toHaveBeenCalledWith(["pnd-1"]);
    // The surviving input keeps its own lease, not the duplicate's.
    expect(addAttachmentFile.mock.calls[0][1]).toEqual({
      pendingIds: ["pnd-2"],
    });
  });

  it("keeps the image flags aligned after dropping a duplicate", async () => {
    const { store } = makeStore([
      { id: "att-0", title: "a.docx", kind: "file", path: "11" },
    ]);

    // Inputs: [11 (duplicate), 22, 33 (image)] -> after the drop the image
    // sits at index 1, so only the second record must be re-keyed.
    const attached = await attachFilesToChat(
      asStore(store),
      [input("11"), input("22"), input("33")],
      new Set([2]),
    );

    expect(attached.map((a) => a.id)).toEqual(["att-1"]);
    expect(store.setState).toHaveBeenCalledTimes(1);
  });

  it("does not attach the same file twice while the first attach is in flight", async () => {
    const { store, addAttachmentFile } = makeStore();

    const first = attachFilesToChat(asStore(store), [input("11")], new Set());
    const second = attachFilesToChat(asStore(store), [input("11")], new Set());

    await Promise.all([first, second]);

    expect(addAttachmentFile).toHaveBeenCalledTimes(1);
  });

  it("frees the path again when the attach fails", async () => {
    const attachmentFiles: Ref[] = [];
    const { store } = makeStore(attachmentFiles);
    const failing = {
      ...store,
      getState: () => ({
        ...store.getState(),
        addAttachmentFile: vi.fn(async () => {
          throw new Error("network");
        }),
      }),
    };

    await expect(
      attachFilesToChat(asStore(failing), [input("11")], new Set()),
    ).rejects.toThrow("network");

    // A retry of the same file must not be mistaken for a duplicate.
    await attachFilesToChat(asStore(store), [input("11")], new Set());
    expect(attachmentFiles.map((f) => f.path)).toEqual(["11"]);
  });
});

describe("attachFilesToChat form flags", () => {
  beforeEach(() => vi.clearAllMocks());

  it("remembers which refs came from a form with a results table", async () => {
    const { store } = makeStore();

    await attachFilesToChat(
      asStore(store),
      [input("11"), input("22", true)],
      new Set(),
    );

    // Ids are assigned in input order by the fake store.
    const registry = getFormRegistry(asStore(store));
    expect(registry.ids.has("att-2")).toBe(true);
    expect(registry.ids.has("att-1")).toBe(false);
  });
});

describe("hasFormResults", () => {
  it("takes a form whose responses are collected in a table", () => {
    expect(
      hasFormResults({ isForm: true, externalDbTableName: "form_42" }),
    ).toBe(true);
  });

  it("leaves out a form with no results table", () => {
    expect(hasFormResults({ isForm: true })).toBe(false);
    expect(hasFormResults({ isForm: true, externalDbTableName: "" })).toBe(
      false,
    );
    expect(hasFormResults({ isForm: true, externalDbTableName: null })).toBe(
      false,
    );
  });

  it("leaves out an ordinary file", () => {
    expect(
      hasFormResults({ isForm: false, externalDbTableName: "form_42" }),
    ).toBe(false);
    expect(hasFormResults({})).toBe(false);
  });
});
