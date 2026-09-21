import type { IncomingMessage, ServerResponse } from "http";
import type { PluginOption } from "vite";

// `@onlyoffice/ai-chat` always runs in server mode here: `AiAgentProviders`
// builds its API config from `window.location.origin` + `/api/2.0/ai`, with no
// client-side engines to fall back on (see `ai-agent/providers/index.tsx`).
// In local Storybook that origin is the Vite dev server, which serves no such
// routes -- every init call 404s, the widget's stores never initialise and
// `<ChatPage />` renders an empty `.aui-root`: no welcome screen, no composer,
// nothing. This middleware answers those routes with in-memory data so the
// panel shows a real chat.
//
// Only the dev server is mocked. Behind nginx (`STORYBOOK_PROXY=1`) the iframe
// is served from the portal's origin, so `/api/2.0/ai` goes to the real
// backend and never reaches Vite -- nothing here can shadow a portal.
// `STORYBOOK_AI_MOCK=0` turns it off for anyone who points the dev server at a
// portal by other means.
const AI_BASE = "/api/2.0/ai/";

// One profile, so the composer renders with a model in its picker instead of
// the widget's initial-setup screen. The key is deliberately not a real one:
// nothing here reaches a provider.
const MOCK_PROFILE = {
  id: "storybook-profile",
  name: "Storybook (mock)",
  providerType: "openai",
  baseUrl: "https://example.invalid/v1",
  key: "storybook-mock-key",
  modelId: "mock-model",
  // Text in / text out. Higher bits are vision, image generation and friends,
  // which this mock does not answer.
  capabilities: 0b0000_0011,
  canUseTool: false,
};

const MOCK_MODEL = { id: MOCK_PROFILE.modelId, name: "Mock model" };

type Message = {
  id: string;
  role: "user" | "assistant";
  content: { type: "text"; text: string }[];
  createdAt: number;
};

type Thread = {
  threadId: string;
  title: string;
  lastEditDate: number;
  profileId: string;
};

// Per dev-server process, not per browser tab: a reload keeps the history,
// which is what makes the chat-list and thread-switching stories worth looking
// at. Restarting Storybook clears it.
const threads: Thread[] = [];
const messages = new Map<string, Message[]>();

const newId = () => Math.random().toString(36).slice(2, 12);

const createThread = (title: string, profileId?: string): Thread => {
  const thread: Thread = {
    threadId: newId(),
    title,
    lastEditDate: Date.now(),
    profileId: profileId ?? MOCK_PROFILE.id,
  };
  threads.unshift(thread);
  messages.set(thread.threadId, []);
  return thread;
};

// The reply. Deterministic and obviously fake -- a story that looked like a
// real answer would be read as one.
const answerFor = (prompt: string) =>
  `This is a mocked reply from the Storybook AI backend. No model was called.\n\n` +
  `You said: **${prompt.trim() || "(nothing)"}**\n\n` +
  `To see real answers, run Storybook behind a portal (\`STORYBOOK_PROXY=1\`), ` +
  `where \`/api/2.0/ai\` reaches the portal's own AI service.`;

const textOf = (message: unknown): string => {
  if (typeof message === "string") return message;
  if (!message || typeof message !== "object") return "";
  const { content } = message as { content?: unknown };
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((part) =>
      part && typeof part === "object" && "text" in part
        ? String((part as { text?: unknown }).text ?? "")
        : "",
    )
    .join("");
};

const readBody = async (req: IncomingMessage): Promise<unknown> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return undefined;
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return undefined;
  }
};

const json = (res: ServerResponse, value: unknown) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(value ?? null));
};

// The widget's streaming transport reads NDJSON: one JSON `ChatEvent` per
// line (see `fetcher` in the package). Chunked deltas so the story shows the
// streaming state, not a reply that appears whole.
const streamReply = async (
  res: ServerResponse,
  body: Record<string, unknown> | undefined,
) => {
  const prompt = textOf(body?.userMessage);
  const requestedThreadId =
    typeof body?.threadId === "string" && body.threadId ? body.threadId : null;

  const thread =
    (requestedThreadId
      ? threads.find((t) => t.threadId === requestedThreadId)
      : undefined) ??
    createThread(
      prompt.slice(0, 40) || "New chat",
      typeof body?.profileId === "string" ? body.profileId : undefined,
    );

  const history = messages.get(thread.threadId) ?? [];
  messages.set(thread.threadId, history);

  const userMessage: Message = {
    id: newId(),
    role: "user",
    content: [{ type: "text", text: prompt }],
    createdAt: Date.now(),
  };
  history.push(userMessage);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/x-ndjson");
  res.setHeader("Cache-Control", "no-cache");

  const emit = (event: unknown) => res.write(`${JSON.stringify(event)}\n`);

  emit({
    type: "user-message-stored",
    message: userMessage,
    messageId: userMessage.id,
  });

  const assistant: Message = {
    id: newId(),
    role: "assistant",
    content: [{ type: "text", text: "" }],
    createdAt: Date.now(),
  };
  emit({ type: "message-start", message: assistant, messageId: assistant.id });

  const full = answerFor(prompt);
  // Split on whitespace boundaries so a delta never cuts a word in half.
  const chunks = full.match(/\s*\S+/g) ?? [full];
  for (const chunk of chunks) {
    assistant.content[0].text += chunk;
    emit({
      type: "message-delta",
      message: { ...assistant, content: [{ ...assistant.content[0] }] },
      messageId: assistant.id,
    });
    await new Promise((resolve) => {
      setTimeout(resolve, 20);
    });
  }

  history.push(assistant);
  thread.lastEditDate = Date.now();

  emit({ type: "message-end", message: assistant, messageId: assistant.id });
  emit({
    type: "thread-title",
    threadId: thread.threadId,
    title: thread.title,
    profileId: thread.profileId,
  });
  res.end();
};

// Every route the widget calls while mounting, plus the writes the composer
// and the chat list perform. Anything not listed keeps 404ing on purpose: a
// silent `{}` for a route this mock has never seen would hide a real
// integration gap behind a story that looks fine.
const GET_ROUTES: Record<
  string,
  (params: URLSearchParams) => unknown
> = {
  "profiles/list": () => [MOCK_PROFILE],
  "profiles/get-by-id": () => MOCK_PROFILE,
  "profiles/list-models": () => [MOCK_MODEL],
  "assignments/get-all-assignments": () => ({
    Default: MOCK_PROFILE.id,
    Chat: MOCK_PROFILE.id,
  }),
  "assignments/get-assignment": () => MOCK_PROFILE.id,
  "preferences/get-deep-mode": () => false,
  "preferences/is-deep-mode-set": () => false,
  "preferences/get-reasoning-level": () => "off",
  "prompts/list": () => [],
  "prompts/list-folders": () => [],
  "threads/list": (params) => {
    const query = params.get("query");
    const list = query
      ? threads.filter((t) =>
          t.title.toLowerCase().includes(query.toLowerCase()),
        )
      : threads;
    const count = Number(params.get("count"));
    return Number.isFinite(count) && count > 0 ? list.slice(0, count) : list;
  },
  "threads/get-by-id": (params) =>
    threads.find((t) => t.threadId === params.get("threadId")) ?? null,
  "threads/read-messages": (params) =>
    messages.get(params.get("threadId") ?? "") ?? [],
  "tools/list-custom-servers": () => ({}),
  "tools/list-system-tools": () => ({ groups: {}, errors: {} }),
  "tools/get-disabled": () => ({}),
  "tools/get-allow-always": () => ({}),
  "web-search/get-active-config": () => null,
  "web-search/is-configured": () => false,
};

const WRITE_ROUTES: Record<
  string,
  (body: Record<string, unknown> | undefined) => unknown
> = {
  "threads/create": (body) => createThread(String(body?.title ?? "New chat")),
  "threads/open-or-create": (body) => {
    const id = typeof body?.threadId === "string" ? body.threadId : "";
    return (
      threads.find((t) => t.threadId === id) ??
      createThread(String(body?.title ?? "New chat"))
    );
  },
  "threads/touch": () => ({ success: true }),
  "threads/rename": (body) => {
    const thread = threads.find((t) => t.threadId === body?.threadId);
    if (thread && typeof body?.title === "string") thread.title = body.title;
    return { success: true };
  },
  "threads/delete": (body) => {
    const index = threads.findIndex((t) => t.threadId === body?.threadId);
    if (index >= 0) {
      messages.delete(threads[index].threadId);
      threads.splice(index, 1);
    }
    return { success: true };
  },
  "threads/clear-messages": (body) => {
    messages.set(String(body?.threadId ?? ""), []);
    return { success: true };
  },
  "preferences/set-deep-mode": () => ({ success: true }),
  "preferences/clear-deep-mode": () => ({ success: true }),
  "preferences/set-reasoning-level": () => ({ success: true }),
  "tools/set-disabled": () => ({ success: true }),
  "tools/set-allow-always": () => ({ success: true }),
};

export const aiChatMock = (): PluginOption => ({
  name: "apps-ui-kit:ai-chat-mock",
  apply: "serve",
  configureServer(server) {
    if (process.env.STORYBOOK_AI_MOCK === "0" || process.env.STORYBOOK_PROXY) {
      return;
    }

    server.middlewares.use((req, res, next) => {
      const url = req.url ?? "";
      if (!url.startsWith(AI_BASE)) {
        next();
        return;
      }

      const [path, search] = url.slice(AI_BASE.length).split("?");
      const params = new URLSearchParams(search ?? "");

      if (req.method === "GET") {
        const handler = GET_ROUTES[path];
        if (!handler) {
          next();
          return;
        }
        json(res, handler(params));
        return;
      }

      if (path === "ai/send-with-stream") {
        readBody(req).then(
          (body) => streamReply(res, body as Record<string, unknown>),
          next,
        );
        return;
      }

      const write = WRITE_ROUTES[path];
      if (!write) {
        next();
        return;
      }
      readBody(req).then((body) => {
        json(res, write(body as Record<string, unknown>));
      }, next);
    });
  },
});
