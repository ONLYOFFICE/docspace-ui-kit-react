import {
  FileShare,
  type RoomInvitation,
  RoomType,
  SearchArea,
} from "@onlyoffice/docspace-api-sdk";

import type { useApi } from "../../../providers/api";
import { DEMO_FOLDERS } from "./demo-matter-contents";
import { DEMO_ROOMS } from "./demo-matters";
import { explainPortalError } from "./explain";
import type { FileLike, FolderContents, FolderLike } from "./matterRoom";

/**
 * Put the demo practice on a real portal: the rooms, tags, folders and files
 * every screen shows with no portal, created for real so the screens can be
 * tried against them with one click instead of an afternoon in ONLYOFFICE.
 *
 * It creates and never deletes, and it can be pressed again. A room whose
 * title is already on the portal is opened rather than made, and whatever
 * the demo says should be inside and is not -- a folder, a file -- is added;
 * a room that has everything is left alone. So a run that failed halfway,
 * or a folder someone deleted, is put right by the next press. Rooms are
 * opened by whoever owns the API key, so the lead of every matter is that
 * person, not the demo's names.
 *
 * The calls are behind `SeedClient`, in the seeder's own words, so the test
 * stands a recorder in for the portal and `sdkSeedClient` is the only part
 * that knows the SDK.
 */
export type SeedStep = {
  label: string;
  /** done: made from nothing; completed: was there, missing pieces added. */
  status: "done" | "completed" | "skipped" | "failed";
  detail?: string;
};

export type SeedSummary = Record<SeedStep["status"], number>;

export type SeedClient = {
  /** The rooms already on the portal, as far as this key sees. */
  rooms: () => Promise<{ id: number; title: string; tags: string[] }[]>;
  /** What a folder holds, the same shape the screens read. */
  listFolder: (folderId: number) => Promise<FolderContents>;
  createRoom: (title: string, color: string) => Promise<number>;
  tagRoom: (id: number, tags: string[]) => Promise<void>;
  createFolder: (parentId: number, title: string) => Promise<number>;
  /** An office document the document server makes: .docx, .xlsx, .pptx. */
  createDocument: (folderId: number, title: string) => Promise<void>;
  /** Any other file, uploaded as bytes. */
  uploadFile: (
    folderId: number,
    title: string,
    bytes: Uint8Array,
    type: string,
  ) => Promise<void>;
  /** Add an email to a room as a content creator, so they can upload. */
  invite: (roomId: number, email: string) => Promise<void>;
};

/** The demo rooms the client is a member of. */
export const CLIENT_ROOM_IDS = DEMO_ROOMS.client.map((room) => room.id);

const OFFICE = new Set([".docx", ".xlsx", ".pptx"]);

const extOf = (title: string) =>
  title.slice(title.lastIndexOf(".")).toLowerCase();

const fold = (title: string) => title.trim().replace(/\s+/g, " ").toLowerCase();

/**
 * A one-page PDF that says its own name, small enough to build in a string.
 * Offsets in the cross-reference table are computed, so a strict reader
 * accepts it; the body is ASCII, so character offsets are byte offsets.
 */
export const minimalPdf = (text: string) => {
  const safe = text.replace(/[\\()]/g, "");
  const content = `BT /F1 18 Tf 72 770 Td (${safe}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let out = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(out.length);
    out += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = out.length;
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    out += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

  return new TextEncoder().encode(out);
};

/** One grey pixel. */
export const pixelPng = () =>
  Uint8Array.from(
    atob(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    ),
    (char) => char.charCodeAt(0),
  );

const placeFile = (client: SeedClient, folderId: number, title: string) => {
  const ext = extOf(title);
  if (OFFICE.has(ext)) return client.createDocument(folderId, title);
  if (ext === ".pdf") {
    return client.uploadFile(
      folderId,
      title,
      minimalPdf(title),
      "application/pdf",
    );
  }
  if (ext === ".png") {
    return client.uploadFile(folderId, title, pixelPng(), "image/png");
  }
  return client.uploadFile(
    folderId,
    title,
    new TextEncoder().encode(title),
    "text/plain",
  );
};

type Added = { tags: number; folders: number; files: number };

const NOTHING: Added = { tags: 0, folders: 0, files: 0 };

const titleOf = (entry: FolderLike | FileLike) => entry.title ?? "Untitled";

/**
 * Make a folder hold what the demo says it holds. A folder or file already
 * there by title is kept; the rest is created. `fresh` says the folder was
 * made a moment ago, so there is nothing to list.
 */
const ensureContents = async (
  client: SeedClient,
  folderId: number,
  contents: FolderContents,
  fresh: boolean,
  added: Added,
) => {
  const present = fresh
    ? { folders: [], files: [] }
    : await client.listFolder(folderId);
  const folderIds = new Map(
    present.folders.map((folder) => [fold(titleOf(folder)), folder.id]),
  );
  const fileTitles = new Set(present.files.map((file) => fold(titleOf(file))));

  for (const folder of contents.folders) {
    const title = titleOf(folder);
    let id = folderIds.get(fold(title));
    let made = false;
    if (id === undefined) {
      id = await client.createFolder(folderId, title);
      added.folders += 1;
      made = true;
    }
    const inside =
      folder.id === undefined ? undefined : DEMO_FOLDERS[folder.id];
    if (inside) await ensureContents(client, id, inside, made, added);
  }

  for (const file of contents.files) {
    const title = titleOf(file);
    if (fileTitles.has(fold(title))) continue;
    await placeFile(client, folderId, title);
    added.files += 1;
  }
};

const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? "" : "s"}`;

const describe = (added: Added) =>
  [
    added.tags ? plural(added.tags, "tag") : "",
    added.folders ? plural(added.folders, "folder") : "",
    added.files ? plural(added.files, "file") : "",
  ].filter(Boolean);

const nothingAdded = (added: Added) =>
  !added.tags && !added.folders && !added.files;

export const seedPortal = async (
  client: SeedClient,
  options: { clientEmail?: string; onStep?: (step: SeedStep) => void } = {},
): Promise<SeedSummary> => {
  const summary: SeedSummary = { done: 0, completed: 0, skipped: 0, failed: 0 };
  const report = (step: SeedStep) => {
    summary[step.status] += 1;
    options.onStep?.(step);
  };
  const email = options.clientEmail?.trim() ?? "";
  const existing = new Map(
    (await client.rooms()).map((room) => [fold(room.title), room]),
  );

  for (const room of DEMO_ROOMS.lawyer) {
    const title = room.title ?? "Untitled";
    const contents = room.id === undefined ? undefined : DEMO_FOLDERS[room.id];
    const forClient =
      Boolean(email) &&
      room.id !== undefined &&
      CLIENT_ROOM_IDS.includes(room.id);
    const tags = (room.tags ?? []).filter(Boolean);
    const found = existing.get(fold(title));

    try {
      if (found) {
        const added: Added = { ...NOTHING };
        // Tags first, as for a new room: without the Practice tag the
        // screens do not count the room as a matter at all.
        const has = new Set(found.tags.map(fold));
        const missing = tags.filter((tag) => !has.has(fold(tag)));
        if (missing.length) {
          await client.tagRoom(found.id, missing);
          added.tags = missing.length;
        }
        if (contents) {
          await ensureContents(client, found.id, contents, false, added);
        }
        if (nothingAdded(added)) {
          report({
            label: title,
            status: "skipped",
            detail: "Already there, with everything the demo puts in it.",
          });
          continue;
        }
        // A room that was short of something most likely came from a run
        // that stopped before it got to sharing, so share it now.
        const parts = describe(added);
        if (forClient) {
          await client.invite(found.id, email);
          parts.push(`shared with ${email}`);
        }
        report({
          label: title,
          status: "completed",
          detail: `Already there; added ${parts.join(", ")}.`,
        });
        continue;
      }

      const id = await client.createRoom(title, room.logo?.color ?? "");
      if (tags.length) await client.tagRoom(id, tags);

      const added: Added = { ...NOTHING, tags: tags.length };
      if (contents) await ensureContents(client, id, contents, true, added);

      const parts = describe(added);
      if (forClient) {
        await client.invite(id, email);
        parts.push(`shared with ${email}`);
      }
      report({
        label: title,
        status: "done",
        detail: parts.length ? parts.join(", ") : "an empty room",
      });
    } catch (error) {
      report({
        label: title,
        status: "failed",
        detail: explainPortalError(error, "write to this portal"),
      });
    }
  }

  return summary;
};

const PAGE = 100;
const MAX_ROOMS = 500;

/** The seeder's calls, made with the clients `useApi()` hands out. */
export const sdkSeedClient = (
  api: Pick<
    ReturnType<typeof useApi>,
    "roomsApi" | "foldersApi" | "filesApi" | "apiClient" | "baseUrl"
  >,
): SeedClient => ({
  rooms: async () => {
    const rooms: { id: number; title: string; tags: string[] }[] = [];
    let total = Infinity;
    while (rooms.length < Math.min(total, MAX_ROOMS)) {
      const page = (
        await api.roomsApi.getRoomsFolder({
          searchArea: SearchArea.Active,
          count: PAGE,
          startIndex: rooms.length,
        })
      ).data.response;
      const folders = (page?.folders ?? []) as (FolderLike & {
        tags?: string[] | null;
      })[];
      for (const folder of folders) {
        if (folder.id !== undefined) {
          rooms.push({
            id: folder.id,
            title: folder.title ?? "",
            tags: (folder.tags ?? []).filter(Boolean),
          });
        }
      }
      total = page?.total ?? rooms.length;
      if (!folders.length) break;
    }
    return rooms;
  },

  listFolder: async (folderId) => {
    const page = (
      await api.foldersApi.getFolderByFolderId({ folderId, count: PAGE })
    ).data.response;
    return {
      folders: (page?.folders ?? []) as FolderLike[],
      files: (page?.files ?? []) as FileLike[],
    };
  },

  createRoom: async (title, color) => {
    const room = (
      await api.roomsApi.createRoom({
        createRoomRequestDto: {
          title,
          roomType: RoomType.CustomRoom,
          color: color || undefined,
        },
      })
    ).data.response;
    if (room?.id === undefined) {
      throw new Error("The portal created the room but sent no id back.");
    }
    return room.id;
  },

  tagRoom: async (id, tags) => {
    // A tag has to exist on the portal before a room can carry it. One that
    // already does answers with an error, which is the answer wanted.
    for (const name of tags) {
      try {
        await api.roomsApi.createRoomTag({ createTagRequestDto: { name } });
      } catch {
        // Already there.
      }
    }
    await api.roomsApi.addRoomTags({
      id,
      batchTagsRequestDto: { names: tags },
    });
  },

  createFolder: async (parentId, title) => {
    const folder = (
      await api.foldersApi.createFolder({
        folderId: parentId,
        createFolder: { title },
      })
    ).data.response;
    if (folder?.id === undefined) {
      throw new Error("The portal created the folder but sent no id back.");
    }
    return folder.id;
  },

  createDocument: async (folderId, title) => {
    await api.filesApi.createFile({
      folderId,
      createFileJsonElement: { title },
    });
  },

  uploadFile: async (folderId, title, bytes, type) => {
    // Not the SDK's insertFile. It sends the form fields as
    // `InsertFile.Title` and `InsertFile.File`, the names the reference
    // pages show, and the portal's binder reads `title` with no prefix and
    // takes the first file part whatever it is called -- so the SDK's call
    // ends in 400, "Value cannot be null. (Parameter 'title')". The form
    // the portal binds is three plain fields.
    const form = new FormData();
    form.append("file", new File([bytes as BlobPart], title, { type }));
    form.append("title", title);
    form.append("createNewIfExist", "true");
    await api.apiClient.instance.post(
      new URL(`/api/2.0/files/${folderId}/insert`, api.baseUrl).toString(),
      form,
    );
  },

  invite: async (roomId, email) => {
    // The SDK's RoomInvitation names only `id`; the portal also takes an
    // `email`, which is how a person not yet on the portal is invited.
    const invitation = {
      email,
      access: FileShare.ContentCreator,
    } as unknown as RoomInvitation;
    await api.roomsApi.setRoomSecurity({
      id: roomId,
      roomInvitationRequest: {
        invitations: [invitation],
        notify: true,
        message: "Your matter's documents live here. Sign in to see them.",
      },
    });
  },
});
