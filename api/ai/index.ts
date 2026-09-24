import { BaseCustomApi } from "../base-custom-api";

// Output formats the md export pipeline understands, mirroring the .NET
// `MdOutputFormat` enum (ASC.AI.Core.MdTextToDocx).
export type AiExportFormat = "Docx" | "Pdf" | "Md";

// The legacy chat REST surface (/ai/chats/*, /ai/rooms/*/servers/*) was
// removed together with the C# AI service; the AI chat now talks to the
// Node AI service through the @onlyoffice/ai-chat engines. Only the
// endpoints that are still served remain here.
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
}
