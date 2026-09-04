import { BaseCustomApi } from "../base-custom-api";

// The legacy chat REST surface (/ai/chats/*, /ai/rooms/*/servers/*) was
// removed together with the C# AI service; the AI chat now talks to the
// Node AI service through the @onlyoffice/ai-chat engines. Only the
// endpoints that are still served remain here.
export class AiApi extends BaseCustomApi {
  // Async markdown → docx export via the Node AI service
  // (`POST /ai/text-to-docx` → the .NET text-to-docx start endpoint).
  // Fire-and-forget: the AI Worker converts the markdown and saves the
  // .docx into the folder; completion arrives as the `s:modify-folder`
  // create-file socket event. Errors propagate to the caller — the save
  // dialog falls back to the legacy plain-text file creation.
  startTextToDocx(folderId: number | string, title: string, content: string) {
    return this.request(`/ai/text-to-docx`, {
      method: "POST",
      data: { folderId, title, content },
    });
  }
}
