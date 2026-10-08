import { http, type AnyHandler } from "msw";
import { FileType, FilterType, RoomType } from "@onlyoffice/docspace-api-sdk";

import { api, fail, ok, page } from "../demoPortal";
import {
  ARCHIVE_ID,
  FAVORITES_ID,
  FILES_SETTINGS,
  MY_DOCUMENTS_ID,
  RECENT_ID,
  ROOMS_ID,
  TRASH_ID,
  addFile,
  addFolder,
  ancestry,
  extensionOf,
  fileDto,
  fileTypeOf,
  files,
  findFolder,
  folderDto,
  folders,
  pathParts,
  removeFile,
  type DemoFile,
  type DemoFolder,
} from "../fixtures/files";

type Params = Record<string, string | readonly string[] | undefined>;

const param = (params: Params, name: string) => String(params[name] ?? "");

/** A folder id from a route: a number, or `@my` for My documents. */
const folderIdOf = (raw: string) =>
  raw === "@my" ? MY_DOCUMENTS_ID : Number(raw);

const matchesText = (title: string, text: string) =>
  !text || title.toLowerCase().includes(text.toLowerCase());

const newest = (a: { updatedDays: number }, b: { updatedDays: number }) =>
  a.updatedDays - b.updatedDays;

/** `FilterType` as a number, whichever way the query spelled it. */
const filterTypeOf = (raw: string | null) => {
  if (!raw) return FilterType.None;
  const byName = (FilterType as Record<string, number>)[raw];
  return byName ?? (Number(raw) || FilterType.None);
};

const FILE_FILTERS: Partial<Record<number, (entry: DemoFile) => boolean>> = {
  [FilterType.FilesOnly]: () => true,
  [FilterType.DocumentsOnly]: (f) => fileTypeOf(f.title) === FileType.Document,
  [FilterType.SpreadsheetsOnly]: (f) =>
    fileTypeOf(f.title) === FileType.Spreadsheet,
  [FilterType.PresentationsOnly]: (f) =>
    fileTypeOf(f.title) === FileType.Presentation,
  [FilterType.ImagesOnly]: (f) => fileTypeOf(f.title) === FileType.Image,
  [FilterType.ArchiveOnly]: (f) => fileTypeOf(f.title) === FileType.Archive,
  [FilterType.MediaOnly]: (f) =>
    ([FileType.Video, FileType.Audio] as number[]).includes(
      fileTypeOf(f.title),
    ),
  [FilterType.DiagramsOnly]: (f) => fileTypeOf(f.title) === FileType.Diagram,
  [FilterType.Pdf]: (f) => extensionOf(f.title) === ".pdf" && !f.isForm,
  [FilterType.PdfForm]: (f) => !!f.isForm,
};

/**
 * One folder's content, filtered the way the portal's EntryManager does:
 * `applyFilterOption` 1 (Files) filters and searches files only, 2 (Folders)
 * folders only, 0 both.
 */
const folderContent = (target: DemoFolder, url: URL) => {
  const q = url.searchParams;
  const text = q.get("filterValue") ?? "";
  const filterType = filterTypeOf(q.get("filterType"));
  const applyTo = Number(q.get("applyFilterOption") ?? 0) || 0;
  const extensions = (q.get("extension") ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .map((e) => (e.startsWith(".") ? e : `.${e}`));
  // `applyFilterOption` 1 keeps the filters off the folders, 2 off the files.
  const folderText = applyTo === 1 ? "" : text;
  const folderType = applyTo === 1 ? FilterType.None : filterType;
  const fileText = applyTo === 2 ? "" : text;
  const fileType = applyTo === 2 ? FilterType.None : filterType;
  const fileExts = applyTo === 2 ? [] : extensions;

  // A narrowed request descends through the whole subtree unless
  // `withSubFolders=false`; an unfiltered one lists the top level only.
  const subtree = q.get("withSubFolders") !== "false";
  const foldersDeep =
    subtree && (!!folderText || folderType !== FilterType.None);
  const filesDeep =
    subtree &&
    (!!fileText || fileType !== FilterType.None || !!fileExts.length);

  const under = (parentId: number, deep: boolean) => {
    if (!deep) return parentId === target.id;
    const parent = findFolder(parentId);
    return !!parent && ancestry(parent).includes(target);
  };

  let childFolders: DemoFolder[];
  let childFiles: DemoFile[];

  if (target.id === RECENT_ID || target.id === FAVORITES_ID) {
    // The aggregates: files only, from wherever they live.
    childFolders = [];
    childFiles =
      target.id === RECENT_ID
        ? [...files].sort(newest).slice(0, 8)
        : files.filter((f) => f.isFavorite);
  } else {
    childFolders = folders.filter(
      (f) => under(f.parentId, foldersDeep) && f.roomType === undefined,
    );
    childFiles = files.filter((f) => under(f.folderId, filesDeep));
  }

  childFolders = childFolders.filter(
    (f) =>
      (folderType === FilterType.None ||
        folderType === FilterType.FoldersOnly) &&
      matchesText(f.title, folderText),
  );

  childFiles = childFiles.filter((f) => {
    if (fileType === FilterType.FoldersOnly) return false;
    const test = FILE_FILTERS[fileType];
    if (fileType !== FilterType.None && test && !test(f)) return false;
    if (fileExts.length && !fileExts.includes(extensionOf(f.title)))
      return false;
    return matchesText(f.title, fileText);
  });

  childFolders.sort(newest);
  childFiles.sort(newest);

  const entries = [
    ...childFolders.map((f) => ({ kind: "folder" as const, folder: f })),
    ...childFiles.map((f) => ({ kind: "file" as const, file: f })),
  ];
  const { slice, total } = page(entries, url);
  const startIndex = Number(q.get("startIndex") ?? 0) || 0;

  return {
    files: slice.flatMap((e) => (e.kind === "file" ? [fileDto(e.file)] : [])),
    folders: slice.flatMap((e) =>
      e.kind === "folder" ? [folderDto(e.folder)] : [],
    ),
    current: folderDto(target),
    pathParts: pathParts(target),
    startIndex,
    count: slice.length,
    total,
    new: 0,
  };
};

// --- Rooms ---------------------------------------------------------------

/** `RoomType` as a number, whichever way the query spelled it. */
const roomTypeOf = (raw: string) =>
  (RoomType as Record<string, number>)[raw] ?? Number(raw);

const roomsList = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const q = url.searchParams;
  const text = q.get("filterValue") ?? "";
  const types = q.getAll("type").filter(Boolean).map(roomTypeOf);
  const area = q.get("searchArea") ?? "";
  // SearchArea: 0 Active, 1 Archive, 2 Any; "Forms" is the Forms section.
  const isArchive = area === "1" || area === "Archive";
  const isAny = area === "2" || area === "Any";
  const isForms = area === "Forms";
  const storage = q.get("storageFilter");

  const rooms = folders
    .filter((f) => f.roomType !== undefined)
    .filter((f) => {
      if (isAny) return true;
      return isArchive ? f.parentId === ARCHIVE_ID : f.parentId === ROOMS_ID;
    })
    .filter((f) => (isForms ? f.roomType === RoomType.FillingFormsRoom : true))
    .filter((f) => !types.length || types.includes(f.roomType as number))
    .filter((f) => matchesText(f.title, text))
    // Third-party rooms: the demo portal has none, so "internal" is all.
    .filter(() => storage !== "2" && storage !== "ThirdParty")
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || newest(a, b));

  const { slice, total } = page(rooms, url);
  const current = findFolder(isArchive ? ARCHIVE_ID : ROOMS_ID) as DemoFolder;

  return ok(
    {
      files: [],
      folders: slice.map(folderDto),
      current: folderDto(current),
      pathParts: pathParts(current),
      startIndex: Number(q.get("startIndex") ?? 0) || 0,
      count: slice.length,
      total,
      new: 0,
    },
    { count: slice.length, total },
  );
};

const readJson = async (request: Request) => {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
};

// --- Uploads -------------------------------------------------------------

type UploadSession = {
  id: string;
  folderId: number;
  fileName: string;
  fileSize: number;
  received: number;
};

const sessions = new Map<string, UploadSession>();
let nextSession = 1;

/** The multipart `File` part a chunk request carries, as bytes. */
const chunkSize = async (request: Request) => {
  try {
    const form = await request.formData();
    const part = form.get("File") ?? form.get("file");
    return part instanceof Blob ? part.size : 0;
  } catch {
    return 0;
  }
};

const uploadResult = (session: UploadSession) => {
  const created = addFile(session.fileName, session.folderId, session.fileSize);
  sessions.delete(session.id);
  const dto = fileDto(created);
  return {
    id: created.id,
    folderId: created.folderId,
    version: 1,
    title: created.title,
    providerKey: null,
    uploaded: true,
    file: dto,
  };
};

// --- Handlers ------------------------------------------------------------

export const filesHandlers: AnyHandler[] = [
  http.get(api("files/settings"), () => ok(FILES_SETTINGS)),

  http.get(api("files/@root"), () => {
    const roots = [
      MY_DOCUMENTS_ID,
      ROOMS_ID,
      ARCHIVE_ID,
      RECENT_ID,
      FAVORITES_ID,
      TRASH_ID,
    ];
    const response = roots.map((id) => {
      const target = findFolder(id) as DemoFolder;
      return {
        files: [],
        folders: [],
        current: folderDto(target),
        pathParts: pathParts(target),
        startIndex: 0,
        count: 0,
        total: 0,
        new: 0,
      };
    });
    return ok(response);
  }),

  // Rooms: the list, one room, and creating one.
  http.get(api("files/rooms"), roomsList),
  http.post(api("files/rooms"), async ({ request }) => {
    const body = await readJson(request);
    const title = String(body.title ?? "").trim();
    if (!title) return fail(400, "The room needs a title");
    const roomType = roomTypeOf(String(body.roomType ?? RoomType.CustomRoom));
    return ok(folderDto(addFolder(title, ROOMS_ID, roomType)));
  }),
  http.get(api("files/rooms/:id"), ({ params }) => {
    const target = findFolder(Number(param(params, "id")));
    if (!target?.roomType) return fail(404, "The room does not exist");
    return ok(folderDto(target));
  }),

  // Folder info, and creating a folder inside one.
  http.get(api("files/folder/:folderId"), ({ params }) => {
    const target = findFolder(folderIdOf(param(params, "folderId")));
    return target
      ? ok(folderDto(target))
      : fail(404, "The folder does not exist");
  }),
  http.get(api("files/folder/:folderId/path"), ({ params }) => {
    const target = findFolder(folderIdOf(param(params, "folderId")));
    return target
      ? ok(ancestry(target).map(folderDto))
      : fail(404, "The folder does not exist");
  }),
  http.post(api("files/folder/:folderId"), async ({ params, request }) => {
    const parent = findFolder(folderIdOf(param(params, "folderId")));
    if (!parent) return fail(404, "The folder does not exist");
    if (!parent.security.Create)
      return fail(403, "You do not have permission to create folders here");
    const body = await readJson(request);
    const title = String(body.title ?? "").trim() || "New folder";
    return ok(folderDto(addFolder(title, parent.id)));
  }),

  // One file: info, the FilesSelector's write check (create, then delete).
  http.get(api("files/file/:fileId"), ({ params }) => {
    const entry = files.find((f) => f.id === Number(param(params, "fileId")));
    return entry ? ok(fileDto(entry)) : fail(404, "The file does not exist");
  }),
  http.delete(api("files/file/:fileId"), ({ params }) => {
    removeFile(Number(param(params, "fileId")));
    return ok([]);
  }),
  http.post(api("files/:folderId/file"), async ({ params, request }) => {
    const parent = findFolder(folderIdOf(param(params, "folderId")));
    if (!parent) return fail(404, "The folder does not exist");
    if (!parent.security.Create)
      return fail(403, "You do not have permission to create files here");
    const body = await readJson(request);
    const raw = String(body.title ?? "").trim() || "New document";
    const title = extensionOf(raw) ? raw : `${raw}.docx`;
    return ok(fileDto(addFile(title, parent.id, 6 * 1024)));
  }),

  // Uploads. `files/{folderId}/session` opens a session; chunks go either to
  // `.../session/{id}/upload` (async, then `.../finalize`) or, for a string
  // folder id, to `.../session/{id}` itself, whose last chunk makes the file.
  http.post(api("files/:folderId/session"), async ({ params, request }) => {
    const target = findFolder(folderIdOf(param(params, "folderId")));
    if (!target) return fail(404, "The folder does not exist");
    if (!target.security.Create || target.id === ROOMS_ID)
      return fail(403, "You do not have permission to upload here");
    const body = await readJson(request);
    const session: UploadSession = {
      id: `demo-upload-${nextSession++}`,
      folderId: target.id,
      fileName: String(body.fileName ?? "Untitled"),
      fileSize: Number(body.fileSize ?? 0) || 0,
      received: 0,
    };
    sessions.set(session.id, session);
    const created = new Date();
    const expired = new Date(created.getTime() + 12 * 60 * 60 * 1000);
    return ok({
      id: session.id,
      path: ancestry(target).map((f) => f.id),
      created: created.toISOString(),
      expired: expired.toISOString(),
      location: "",
      bytes_uploaded: 0,
      bytes_total: session.fileSize,
    });
  }),
  http.post(
    api("files/:folderId/session/:sessionId/upload"),
    async ({ params, request }) => {
      const session = sessions.get(param(params, "sessionId"));
      if (!session) return fail(404, "The upload session has expired");
      session.received += await chunkSize(request);
      return ok({ success: true, data: null, message: null });
    },
  ),
  http.put(api("files/:folderId/session/:sessionId/finalize"), ({ params }) => {
    const session = sessions.get(param(params, "sessionId"));
    if (!session) return fail(404, "The upload session has expired");
    return ok(uploadResult(session));
  }),
  http.post(
    api("files/:folderId/session/:sessionId"),
    async ({ params, request }) => {
      const session = sessions.get(param(params, "sessionId"));
      if (!session) return fail(404, "The upload session has expired");
      session.received += await chunkSize(request);
      if (session.received < session.fileSize) {
        return ok({
          success: true,
          data: {
            id: session.id,
            bytes_uploaded: session.received,
            bytes_total: session.fileSize,
          },
          message: null,
        });
      }
      return ok({ success: true, data: uploadResult(session), message: null });
    },
  ),

  // Folder content: last, since `files/:folderId` also matches the fixed
  // routes above (`files/rooms`, `files/settings`, `files/@root`).
  http.get(api("files/:folderId"), ({ params, request }) => {
    const target = findFolder(folderIdOf(param(params, "folderId")));
    if (!target) return fail(404, "The folder does not exist");
    const url = new URL(request.url);
    const content = folderContent(target, url);
    return ok(content, { count: content.count, total: content.total });
  }),
];
