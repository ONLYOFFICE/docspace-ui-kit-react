import type {
  FileDtoInteger,
  FolderDtoInteger,
} from "@onlyoffice/docspace-api-sdk";

import { isoOf, type PortalAuthor, type PortalTime } from "./matter";

/**
 * Inside a matter's room, two folders carry what the cabinet has to say:
 *
 *   From the client      the checklist. One subfolder per document the firm
 *                        asked for; empty means still needed, a file inside
 *                        means received -- on the day the file arrived, by
 *                        whoever uploaded it.
 *   From the firm        drafts and letters for the client to read.
 *
 * Folders, because a folder is what a client can be asked to put a file in,
 * what the portal already counts and dates, and what a lawyer can add from
 * ONLYOFFICE without this application. Anything else in the room is the
 * firm's working material and is left alone.
 *
 * The names are a convention, matched without regard to case or spacing so a
 * folder renamed by hand still counts.
 */
export const CLIENT_FOLDER = "From the client";
export const FIRM_FOLDER = "From the firm";

export type FolderLike = Pick<
  FolderDtoInteger,
  "id" | "title" | "filesCount" | "foldersCount"
> & {
  createdBy?: PortalAuthor;
  created?: PortalTime;
  updated?: PortalTime;
};

export type FileLike = Pick<
  FileDtoInteger,
  "id" | "title" | "fileExst" | "folderId" | "pureContentLength" | "webUrl"
> & {
  createdBy?: PortalAuthor;
  created?: PortalTime;
  updated?: PortalTime;
};

/** What one folder holds, as `getFolderByFolderId` answers. */
export type FolderContents = { folders: FolderLike[]; files: FileLike[] };

/** A file, told the way a person reads it. */
export type Document = {
  id: number;
  title: string;
  /** Extension with the dot, as the portal sends it: ".pdf". */
  ext: string;
  bytes: number;
  by: string;
  updated: string;
  /** The file's page on the portal, or "" when the portal sent none. */
  url: string;
};

/** One line of the checklist: a subfolder of "From the client". */
export type Request = {
  id: number;
  title: string;
  received: boolean;
  documents: Document[];
  /** When the firm asked: the folder's creation time. */
  asked: string;
  /** When the folder last changed, which for a received one is the upload. */
  updated: string;
};

export type MatterRoom =
  /** A room without the checklist folder: a room, not yet a matter's home. */
  | { layout: "plain"; folders: number; files: number }
  | {
      layout: "matter";
      clientFolderId: number;
      firmFolderId?: number;
      requests: Request[];
      drafts: Document[];
      /** Folders and loose files outside the two sections. */
      otherFolders: number;
      otherFiles: number;
    };

const fold = (title: string) => title.trim().replace(/\s+/g, " ").toLowerCase();

export const isSection = (folder: FolderLike, name: string) =>
  fold(folder.title ?? "") === fold(name);

const newestFirst = (a: Document, b: Document) =>
  (Date.parse(b.updated) || 0) - (Date.parse(a.updated) || 0);

export const documentFrom = (file: FileLike): Document => ({
  id: file.id ?? 0,
  title: file.title ?? "Untitled",
  ext: file.fileExst ?? "",
  bytes: file.pureContentLength ?? 0,
  by: file.createdBy?.displayName ?? "",
  updated: isoOf(file.updated) || isoOf(file.created),
  url: file.webUrl ?? "",
});

export const requestFrom = (folder: FolderLike, files: FileLike[]): Request => {
  const documents = files.map(documentFrom).sort(newestFirst);
  return {
    id: folder.id ?? 0,
    title: folder.title ?? "Untitled",
    received: documents.length > 0 || (folder.filesCount ?? 0) > 0,
    documents,
    asked: isoOf(folder.created),
    // The newest file says when the request was answered; the folder's own
    // stamp is the fallback, for a slot whose files were not fetched.
    updated: documents[0]?.updated || isoOf(folder.updated),
  };
};

export const progressOf = (requests: Request[]) => {
  const total = requests.length;
  const received = requests.filter((request) => request.received).length;
  return {
    received,
    total,
    percent: total ? Math.round((received / total) * 100) : 0,
  };
};

/** "1.2 MB", "380 KB", "" for nothing. Enough for a list; not a locale job. */
export const formatSize = (bytes: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Read a matter's room the way the portal lets it be read: one folder at a
 * time. The room's top level names the sections; the checklist folder lists
 * the requests; each request that holds something is opened for its files;
 * the firm's folder is opened for its drafts.
 *
 * `read` is whatever answers for a folder id -- the portal through the SDK,
 * or a map of demo folders -- so the walk is the same in both cases and can
 * be tested without either.
 */
export const readMatterRoom = async (
  roomId: number,
  read: (folderId: number) => Promise<FolderContents>,
): Promise<MatterRoom> => {
  const room = await read(roomId);
  const client = room.folders.find((folder) =>
    isSection(folder, CLIENT_FOLDER),
  );
  const firm = room.folders.find((folder) => isSection(folder, FIRM_FOLDER));

  if (client?.id === undefined) {
    return {
      layout: "plain",
      folders: room.folders.length,
      files: room.files.length,
    };
  }

  const [slots, sent] = await Promise.all([
    read(client.id),
    firm?.id !== undefined ? read(firm.id) : { folders: [], files: [] },
  ]);

  const requests = await Promise.all(
    slots.folders.map(async (slot) => {
      // Only a folder with something in it is worth another call.
      const files =
        slot.id !== undefined && (slot.filesCount ?? 0) > 0
          ? (await read(slot.id)).files
          : [];
      return requestFrom(slot, files);
    }),
  );

  return {
    layout: "matter",
    clientFolderId: client.id,
    firmFolderId: firm?.id,
    requests,
    drafts: sent.files.map(documentFrom).sort(newestFirst),
    otherFolders: room.folders.length - (firm ? 2 : 1),
    otherFiles: room.files.length,
  };
};
