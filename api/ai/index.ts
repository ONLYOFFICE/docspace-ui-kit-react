import { BaseCustomApi } from "../base-custom-api";

/**
 * State of the starter-question generation for a form.
 *
 * - `pending` — still working, poll again;
 * - `ready` — `questions` carries the result;
 * - `unavailable` — nothing to wait for: not an analyzable form, no external
 *   database, no access, or the generation failed.
 */
export type TSuggestedQuestionsStatus = "pending" | "ready" | "unavailable";

export type TSuggestedQuestionsResponse = {
  status: TSuggestedQuestionsStatus;
  questions: { question: string; prompt: string }[];
};

// Output formats the md export pipeline understands, mirroring the .NET
// `MdOutputFormat` enum (ASC.AI.Core.MdTextToDocx).
export type AiExportFormat = "Docx" | "Pdf" | "Md";

// The legacy chat REST surface (/ai/chats/*, /ai/rooms/*/servers/*) was
// removed together with the C# AI service; the AI chat now talks to the
// Node AI service through the @onlyoffice/ai-chat engines. Only the
// endpoints that are still served remain here.
/** The skills folder of an Instructions room (its own root) and the folders around it, as socket-room ids. */
export type TRoomSkillsFolder = {
  /** The skills folder: the room's root, whose Markdown files are the skills. Equals `roomId`. */
  id: string;
  /** The room: changes to its files are announced here. */
  roomId: string;
  /** The room's parent (the rooms root), where the room's own rename and removal are announced. */
  roomsRootId?: string;
  /** Whether the room holds at least one Markdown file — a room without one has nothing to connect. */
  hasSkills: boolean;
};

/** `FilterType.FilesOnly` on the server: the listing skips subfolders. */
const FILTER_FILES_ONLY = 1;

/** Files of the room root looked at for a skill; a real skills room holds a handful. */
const SKILLS_SAMPLE = 100;

const isMarkdown = (file: { title?: string; fileExst?: string }): boolean =>
  (
    file.fileExst ??
    file.title?.slice(file.title.lastIndexOf(".")) ??
    ""
  ).toLowerCase() === ".md";

export class AiApi extends BaseCustomApi {
  // Async markdown export via the Node AI service
  // (`POST /ai/text-to-docx` → the .NET text-to-docx start endpoint).
  // Fire-and-forget: the AI Worker renders the markdown into `format` and
  // saves the file into the folder; completion arrives as the
  // `s:modify-folder` create-file socket event for every format (`Md` is
  // stored verbatim, without a DocumentService round-trip, but still
  // announces itself the same way). Errors propagate to the caller.
  //
  // `format` spells the .NET `MdOutputFormat` enum members exactly — its
  // JsonStringEnumConverter also accepts other casings, but there is no
  // reason to rely on that. Omitting it keeps the endpoint's own default
  // (`Docx`).
  // The skills folder of an Instructions room (`GET /files/rooms/{id}/ai`:
  // the room's own root), as the ids the chat needs to follow it on the
  // socket — the room, and the room's parent (the rooms root), where the
  // room's own rename and removal are announced — and whether it holds a
  // skill at all. The skills themselves are read by the AI service; here
  // the files are only looked at for a Markdown one. 404 is "not an
  // Instructions room" (or no such room), a plain `null`; a refusal or a
  // failure propagates.
  async getRoomSkillsFolder(
    roomId: number | string,
  ): Promise<TRoomSkillsFolder | null> {
    try {
      const res = await this.request<{
        current?: { id?: number | string };
        pathParts?: { id?: number | string }[];
        files?: { title?: string; fileExst?: string }[];
      }>(`/files/rooms/${encodeURIComponent(String(roomId))}/ai`, {
        method: "GET",
        params: { filterType: FILTER_FILES_ONLY, count: SKILLS_SAMPLE },
      });
      const id = res?.current?.id;
      if (id === undefined || id === null) return null;
      // pathParts runs from the root: [..., rooms root, room].
      const parts = res.pathParts ?? [];
      const roomIndex = parts.findIndex(
        (part) => String(part.id) === String(roomId),
      );
      const roomsRoot = roomIndex > 0 ? parts[roomIndex - 1]?.id : undefined;
      return {
        id: String(id),
        roomId: String(roomId),
        roomsRootId:
          roomsRoot === undefined || roomsRoot === null
            ? undefined
            : String(roomsRoot),
        hasSkills: (res.files ?? []).some(isMarkdown),
      };
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Whether the room is an Instructions room with at least one skill in it —
  // what the chat connects; see getRoomSkillsFolder.
  async hasRoomSkills(roomId: number | string): Promise<boolean> {
    const folder = await this.getRoomSkillsFolder(roomId);
    return folder !== null && folder.hasSkills;
  }

  startTextToDocx(
    folderId: number | string,
    title: string,
    content: string,
    format?: AiExportFormat,
  ) {
    return this.request(`/ai/text-to-docx`, {
      method: "POST",
      data: { folderId, title, content, ...(format ? { format } : {}) },
    });
  }

  /**
   * Starter questions generated from a PDF form's own schema and responses.
   *
   * A long poll: the request is held open for up to 25 seconds while the
   * model works, then answers `pending` if it is still going, `ready` with
   * the questions, or `unavailable` when there will never be any (the file is
   * not an analyzable form, the external database is off, or the generation
   * failed). Keep calling while `pending`; `signal` aborts the wait.
   *
   * `attachmentId` is the id `attachments/save-files-many` minted when the
   * form was attached to the chat — not the DocSpace file id. The questions
   * are generated per attachment, so only that id identifies the record they
   * belong to. The public route is the AI service's POST with the id in the
   * body, like its other attachment routes
   * (`common/ASC.NewAi/app/apiCatalog.ts`); the
   * `GET .../{id}/suggested-questions` it forwards to is internal.
   */
  getSuggestedQuestions(attachmentId: string | number, signal?: AbortSignal) {
    return this.request<TSuggestedQuestionsResponse>(
      `/ai/attachments/suggested-questions`,
      { method: "POST", data: { id: String(attachmentId) }, signal },
    );
  }
}
