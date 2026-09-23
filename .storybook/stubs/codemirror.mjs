// Stub for `codemirror`, an optional peer of `@onlyoffice/ai-chat`. See
// missing-peer.mjs. It backs the JSON editor on the widget's MCP servers page,
// which no story reaches -- the AI chat panel story renders the conversation,
// not the server configuration form.
import { missingPeer } from "./missing-peer.mjs";

export const basicSetup = missingPeer("codemirror", "basicSetup");
export const EditorView = missingPeer("codemirror", "EditorView");
