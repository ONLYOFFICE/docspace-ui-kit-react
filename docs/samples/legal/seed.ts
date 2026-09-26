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
import type { FileLike, FolderContents } from "./matterRoom";

/**
 * Put the demo practice on a real portal: the rooms, tags, folders and files
 * every screen shows with no portal, created for real so the screens can be
 * tried against them with one click instead of an afternoon in ONLYOFFICE.
 *
 * It creates and never deletes. A room whose title is already on the portal
 * is skipped, so running it twice adds nothing; what it made is removed from
 * the portal like any other room. Rooms are opened by whoever owns the API
 * key, so the lead of every matter is that person, not the demo's names.
 *
 * The calls are behind `SeedClient`, in the seeder's own words, so the test
 * stands a recorder in for the portal and `sdkSeedClient` is the only part
 * that knows the SDK.
 */
export type SeedStep = {
  label: string;
  status: "done" | "skipped" | "failed";
  detail?: string;
};

export type SeedSummary = Record<SeedStep["status"], number>;

export type SeedClient = {
  /** Titles of the rooms already on the portal, as far as this key sees. */
  roomTitles: () => Promise<string[]>;
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

const placeFile = (client: SeedClient, folderId: number, file: FileLike) => {
  const title = file.title ?? "Untitled";
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

const placeContents = async (
  client: SeedClient,
  folderId: number,
  contents: FolderContents,
) => {
  for (const folder of contents.folders) {
    const id = await client.createFolder(folderId, folder.title ?? "Untitled");
    const inside =
      folder.id === undefined ? undefined : DEMO_FOLDERS[folder.id];
    if (inside) await placeContents(client, id, inside);
  }
  for (const file of contents.files) await placeFile(client, folderId, file);
};

const count = (contents: FolderContents | undefined) => {
  let folders = 0;
  let files = 0;
  const walk = (node: FolderContents) => {
    files += node.files.length;
    for (const folder of node.folders) {
      folders += 1;
      const inside =
        folder.id === undefined ? undefined : DEMO_FOLDERS[folder.id];
      if (inside) walk(inside);
    }
  };
  if (contents) walk(contents);
  return { folders, files };
};

const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? "" : "s"}`;

export const seedPortal = async (
  client: SeedClient,
  options: { clientEmail?: string; onStep?: (step: SeedStep) => void } = {},
): Promise<SeedSummary> => {
  const summary: SeedSummary = { done: 0, skipped: 0, failed: 0 };
  const report = (step: SeedStep) => {
    summary[step.status] += 1;
    options.onStep?.(step);
  };
  const email = options.clientEmail?.trim() ?? "";
  const existing = new Set((await client.roomTitles()).map(fold));

  for (const room of DEMO_ROOMS.lawyer) {
    const title = room.title ?? "Untitled";
    if (existing.has(fold(title))) {
      report({
        label: title,
        status: "skipped",
        detail: "A room with this name is already there.",
      });
      continue;
    }

    try {
      const id = await client.createRoom(title, room.logo?.color ?? "");
      const tags = (room.tags ?? []).filter(Boolean);
      if (tags.length) await client.tagRoom(id, tags);

      const contents =
        room.id === undefined ? undefined : DEMO_FOLDERS[room.id];
      if (contents) await placeContents(client, id, contents);

      const made = count(contents);
      const parts = [
        tags.length ? plural(tags.length, "tag") : "",
        made.folders ? plural(made.folders, "folder") : "",
        made.files ? plural(made.files, "file") : "",
      ].filter(Boolean);

      if (email && room.id !== undefined && CLIENT_ROOM_IDS.includes(room.id)) {
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
        detail: explainPortalError(error, "create rooms here"),
      });
    }
  }

  return summary;
};

const PAGE = 100;
const MAX_ROOMS = 500;

/** The seeder's calls, made with the SDK clients `useApi()` hands out. */
export const sdkSeedClient = (
  api: Pick<ReturnType<typeof useApi>, "roomsApi" | "foldersApi" | "filesApi">,
): SeedClient => ({
  roomTitles: async () => {
    const titles: string[] = [];
    let total = Infinity;
    while (titles.length < Math.min(total, MAX_ROOMS)) {
      const page = (
        await api.roomsApi.getRoomsFolder({
          searchArea: SearchArea.Active,
          count: PAGE,
          startIndex: titles.length,
        })
      ).data.response;
      const folders = page?.folders ?? [];
      titles.push(...folders.map((folder) => folder.title ?? ""));
      total = page?.total ?? titles.length;
      if (!folders.length) break;
    }
    return titles;
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
    await api.foldersApi.insertFile({
      folderId,
      insertFileFile: new File([bytes as BlobPart], title, { type }),
      insertFileTitle: title,
      insertFileCreateNewIfExist: true,
    });
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
