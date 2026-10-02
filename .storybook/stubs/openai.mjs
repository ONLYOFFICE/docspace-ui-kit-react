// Stub for `openai`, an optional peer of `@onlyoffice/ai-chat`. See
// missing-peer.mjs. The widget imports the client's default export in seven of
// its provider modules and only constructs it inside a request.
import { missingPeer } from "./missing-peer.mjs";

export default missingPeer("openai", "OpenAI");
