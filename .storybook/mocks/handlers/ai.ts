import { http, HttpResponse, type AnyHandler } from "msw";

import { api, ok, page } from "../demoPortal";
import {
  DEMO_AGENTS,
  DEMO_AGENTS_ROOT,
  DEMO_ASSIGNMENTS,
  DEMO_CUSTOM_SERVERS,
  DEMO_CUSTOM_TOOLS,
  DEMO_MODELS,
  DEMO_NEW_SERVER_TOOLS,
  DEMO_PROFILES,
  DEMO_SYSTEM_SERVER,
  DEMO_SYSTEM_TOOLS,
  type DemoMessage,
  type DemoProfile,
  type DemoThread,
  seedChatHistory,
} from "../fixtures/ai";

// Two services answer under `/api/2.0/ai`, in two formats.
//
// - `ai/agents`, which the agent selector reads through the portal's own
//   client, comes in the portal envelope (`{ response }`).
// - Everything else is the Node AI service `@onlyoffice/ai-chat` talks to
//   in server mode (see `fetcher` in the package): bare JSON, a GET's
//   arguments as query parameters (non-strings JSON-encoded), a write's
//   arguments as the JSON body -- the one argument itself, or an array of
//   them when the engine method takes several. The route names are the
//   package's `"area/action"` list.
//
// State lives in this module, so it lasts as long as the preview page: a
// change made in AI Settings shows up in the chat's model picker, and a
// reload starts over from the fixtures.

// ---------------------------------------------------------------------------
// AI agents

const agentsList = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const needle = (url.searchParams.get("filterValue") ?? "").toLowerCase();
  const matching = DEMO_AGENTS.filter((agent) =>
    agent.title.toLowerCase().includes(needle),
  );
  // `page` is a page index, not an offset.
  const count = Number(url.searchParams.get("count") ?? 100) || 100;
  const pageIndex = Number(url.searchParams.get("page") ?? 0) || 0;
  url.searchParams.set("startIndex", String(pageIndex * count));
  const { slice, total } = page(matching, url);
  return ok({
    folders: slice,
    files: [],
    current: DEMO_AGENTS_ROOT,
    pathParts: [
      {
        id: DEMO_AGENTS_ROOT.id,
        title: DEMO_AGENTS_ROOT.title,
        folderType: 34,
      },
    ],
    startIndex: pageIndex * count,
    count: slice.length,
    total,
  });
};

// ---------------------------------------------------------------------------
// The AI service's state

const clone = <T>(value: T): T => structuredClone(value);

const profiles: DemoProfile[] = clone(DEMO_PROFILES);
const assignments: Record<string, string> = { ...DEMO_ASSIGNMENTS };
const customServers: Record<string, Record<string, unknown>> = clone(
  DEMO_CUSTOM_SERVERS,
);
const disabledTools: Record<string, string[]> = {};
const allowAlways: string[] = [];
const preferences: { deepMode: boolean | null; reasoningLevel: string } = {
  deepMode: null,
  reasoningLevel: "off",
};
let webSearch: Record<string, unknown> | null = null;

const { threads, messages } = seedChatHistory();

const newId = () => Math.random().toString(36).slice(2, 12);

const profileById = (id: unknown) =>
  profiles.find((profile) => profile.id === id);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

/** A write's positional arguments, however many it had. */
const argsOf = async (request: Request): Promise<unknown[]> => {
  const body = await request.text();
  if (!body) return [];
  try {
    const parsed: unknown = JSON.parse(body);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
};

/** A GET argument, which the transport JSON-encodes unless it is a string. */
const queryOf = (url: URL, name: string): unknown => {
  const raw = url.searchParams.get(name);
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const success = { success: true } as const;

// ---------------------------------------------------------------------------
// Tools

// A server's tools, with `enabled` following the disabled map the way the
// service fills it in -- the permission switches read it from here.
const toolsOf = (name: string) =>
  (name === DEMO_SYSTEM_SERVER
    ? DEMO_SYSTEM_TOOLS
    : (DEMO_CUSTOM_TOOLS[name] ?? DEMO_NEW_SERVER_TOOLS)
  ).map((tool) => ({
    ...tool,
    serverType: name,
    enabled: !(disabledTools[name] ?? []).includes(tool.name),
  }));

// `{ groups, errors, system }`: `groups` also carries the custom servers'
// tools, and `system` says which names are host-configured.
const systemTools = () => ({
  groups: Object.fromEntries(
    [DEMO_SYSTEM_SERVER, ...Object.keys(customServers)].map((name) => [
      name,
      toolsOf(name),
    ]),
  ),
  errors: {},
  system: [DEMO_SYSTEM_SERVER],
});

// ---------------------------------------------------------------------------
// Threads

const createThread = (title: string, profileId?: string): DemoThread => {
  const thread: DemoThread = {
    threadId: newId(),
    title,
    lastEditDate: Date.now(),
    profileId: profileId ?? assignments.Chat ?? profiles[0]?.id ?? "",
  };
  threads.unshift(thread);
  messages.set(thread.threadId, []);
  return thread;
};

const threadById = (id: unknown) =>
  threads.find((thread) => thread.threadId === id);

const byLastEdit = () =>
  [...threads].sort((a, b) => b.lastEditDate - a.lastEditDate);

/** The page after a keyset cursor: everything past the item it names. */
const after = <T>(list: T[], cursor: unknown, idOf: (item: T) => string) => {
  if (!isRecord(cursor)) return list;
  const key = String(cursor.threadId ?? cursor.id ?? "");
  const index = list.findIndex((item) => idOf(item) === key);
  return index >= 0 ? list.slice(index + 1) : list;
};

const limit = <T>(list: T[], count: unknown) => {
  const n = Number(count);
  return Number.isFinite(n) && n > 0 ? list.slice(0, n) : list;
};

const textOf = (message: unknown): string => {
  if (typeof message === "string") return message;
  if (!isRecord(message)) return "";
  const { content } = message;
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => (isRecord(part) ? String(part.text ?? "") : ""))
    .join("");
};

// The reply. Deterministic and obviously fake -- a story that looked like a
// real answer would be read as one.
const answerFor = (prompt: string) =>
  "This is a demo reply from the Storybook demo portal. No model was called.\n\n" +
  `You said: **${prompt.trim() || "(nothing)"}**\n\n` +
  "To see real answers, connect a portal in the toolbar above: the API " +
  "Config menu, which reads **Default**.";

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * The chat's streaming transport reads NDJSON: one JSON `ChatEvent` per
 * line. The reply goes out a word at a time so the story shows the
 * streaming state rather than an answer that appears whole.
 */
const streamReply = (
  request: Request,
  thread: DemoThread,
  prompt: string,
  userMessage: DemoMessage | null,
) => {
  const history = messages.get(thread.threadId) ?? [];
  messages.set(thread.threadId, history);
  const encoder = new TextEncoder();
  let cancelled = false;

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: unknown) => {
        if (!cancelled) {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        }
      };

      if (userMessage) {
        history.push(userMessage);
        emit({
          type: "user-message-stored",
          message: userMessage,
          messageId: userMessage.id,
        });
      }

      const assistant: DemoMessage = {
        id: newId(),
        role: "assistant",
        content: [{ type: "text", text: "" }],
        createdAt: Date.now(),
      };
      emit({
        type: "message-start",
        message: assistant,
        messageId: assistant.id,
      });

      const full = answerFor(prompt);
      // Split on whitespace boundaries so a delta never cuts a word in half.
      for (const chunk of full.match(/\s*\S+/g) ?? [full]) {
        if (cancelled || request.signal.aborted) break;
        assistant.content[0].text += chunk;
        emit({
          type: "message-delta",
          message: { ...assistant, content: [{ ...assistant.content[0] }] },
          messageId: assistant.id,
        });
        await wait(20);
      }

      history.push(assistant);
      thread.lastEditDate = Date.now();

      emit({
        type: "message-end",
        message: assistant,
        messageId: assistant.id,
      });
      emit({
        type: "thread-title",
        threadId: thread.threadId,
        title: thread.title,
        profileId: thread.profileId,
      });
      if (!cancelled) controller.close();
    },
    cancel() {
      cancelled = true;
    },
  });

  return new HttpResponse(body, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
    },
  });
};

const sendWithStream = async ({ request }: { request: Request }) => {
  const [input] = await argsOf(request);
  const body = isRecord(input) ? input : {};
  const prompt = textOf(body.userMessage);
  const profileId =
    typeof body.profileId === "string" ? body.profileId : undefined;

  const thread =
    threadById(body.threadId) ??
    createThread(prompt.slice(0, 40) || "New chat", profileId);

  const userMessage: DemoMessage = {
    id: newId(),
    role: "user",
    content: [{ type: "text", text: prompt }],
    createdAt: Date.now(),
  };
  return streamReply(request, thread, prompt, userMessage);
};

const regenerateStream = async ({ request }: { request: Request }) => {
  const [input] = await argsOf(request);
  const body = isRecord(input) ? input : {};
  const thread = threadById(body.threadId);
  if (!thread) {
    return HttpResponse.json({ error: "No such thread" }, { status: 404 });
  }
  const history = messages.get(thread.threadId) ?? [];
  // Rewind to the user turn being re-rolled -- the named one, else the one
  // at `keepCount - 1`, else the last -- and drop everything after it.
  const lastUser = history.map((m) => m.role).lastIndexOf("user");
  const named = history.findIndex((m) => m.id === body.messageId);
  const kept = Number(body.keepCount) - 1;
  const turn =
    named >= 0 && history[named].role === "user"
      ? named
      : history[kept]?.role === "user"
        ? kept
        : lastUser;
  if (turn < 0) {
    return HttpResponse.json(
      { error: "Nothing to regenerate" },
      { status: 400 },
    );
  }
  const prompt = history[turn];
  history.splice(turn + 1);
  return streamReply(request, thread, textOf(prompt), null);
};

// ---------------------------------------------------------------------------
// Routes

type Read = (url: URL) => unknown;
type Write = (args: unknown[]) => unknown;

const READS: Record<string, Read> = {
  "profiles/list": () => profiles,
  "profiles/get-by-id": (url) => profileById(queryOf(url, "id")) ?? null,
  "profiles/list-models": (url) => {
    const profile = profileById(queryOf(url, "profileId"));
    return profile ? (DEMO_MODELS[profile.providerType] ?? []) : [];
  },

  "assignments/get-all-assignments": () => assignments,
  "assignments/get-assignment": (url) =>
    assignments[String(queryOf(url, "actionType"))] ?? null,
  "assignments/resolve-for-action": (url) => {
    const id =
      assignments[String(queryOf(url, "actionType"))] ?? assignments.Default;
    const profile = profileById(id);
    return profile ? { profileId: profile.id, profile } : null;
  },
  "assignments/try-resolve-for-action": (url) => {
    const id =
      assignments[String(queryOf(url, "actionType"))] ?? assignments.Default;
    const profile = profileById(id);
    return profile ? { profileId: profile.id, profile } : null;
  },

  "preferences/get-deep-mode": () => preferences.deepMode ?? false,
  "preferences/is-deep-mode-set": () => preferences.deepMode !== null,
  "preferences/get-reasoning-level": () => preferences.reasoningLevel,

  "prompts/list": () => [],
  "prompts/list-folders": () => [],

  "threads/list": (url) => {
    const query = String(queryOf(url, "query") ?? "").toLowerCase();
    const list = byLastEdit().filter((thread) =>
      thread.title.toLowerCase().includes(query),
    );
    const rest = after(list, queryOf(url, "cursor"), (t) => t.threadId);
    return limit(rest, queryOf(url, "count"));
  },
  "threads/get-by-id": (url) => threadById(queryOf(url, "threadId")) ?? null,
  "threads/read-messages": (url) => {
    const history = messages.get(String(queryOf(url, "threadId"))) ?? [];
    const ordered =
      queryOf(url, "direction") === "desc" ? [...history].reverse() : history;
    const rest = after(ordered, queryOf(url, "cursor"), (m) => m.id);
    return limit(rest, queryOf(url, "count"));
  },
  "threads/get-message-by-id": (url) => {
    const id = queryOf(url, "messageId");
    for (const history of messages.values()) {
      const found = history.find((message) => message.id === id);
      if (found) return found;
    }
    return null;
  },

  "tools/list-custom-servers": () => customServers,
  "tools/get-custom-server": (url) =>
    customServers[String(queryOf(url, "name"))] ?? null,
  "tools/list-system-tools": () => systemTools(),
  "tools/get-disabled": () => disabledTools,
  "tools/is-tool-disabled": (url) =>
    (disabledTools[String(queryOf(url, "serverType"))] ?? []).includes(
      String(queryOf(url, "toolName")),
    ),
  "tools/get-allow-always": () => allowAlways,
  "tools/is-allow-always": (url) =>
    allowAlways.includes(
      `${queryOf(url, "serverType")}:${queryOf(url, "toolName")}`,
    ),

  "web-search/get-active-config": () => webSearch,
  "web-search/is-configured": () => webSearch !== null,
};

const saveProfile = (input: unknown, id: string) => {
  if (!isRecord(input)) return { success: false, error: { message: "Empty" } };
  const existing = profileById(id);
  const profile = {
    ...(existing ?? {}),
    ...input,
    id,
    createdAt: existing?.createdAt ?? Date.now(),
    // Nothing probes a demo provider, so trust whatever the form sent.
    canUseTool: false,
  } as DemoProfile;
  if (existing) profiles.splice(profiles.indexOf(existing), 1, profile);
  else profiles.unshift(profile);
  return { success: true, profile };
};

const setServer = ([name, config]: unknown[]) => {
  if (typeof name !== "string" || !isRecord(config)) {
    return { success: false, error: { message: "A name and a config" } };
  }
  customServers[name] = config;
  return success;
};

const WRITES: Record<string, Write> = {
  "profiles/create": ([input]) => saveProfile(input, crypto.randomUUID()),
  "profiles/update": ([input]) =>
    saveProfile(input, isRecord(input) ? String(input.id) : ""),
  "profiles/delete": ([id]) => {
    const index = profiles.findIndex((profile) => profile.id === id);
    if (index >= 0) profiles.splice(index, 1);
    for (const [action, profileId] of Object.entries(assignments)) {
      if (profileId === id) delete assignments[action];
    }
    return success;
  },
  "profiles/test-connection": () => true,
  "profiles/list-provider-models": ([input]) =>
    DEMO_MODELS[isRecord(input) ? String(input.providerType) : ""] ??
    DEMO_MODELS.openai,

  "assignments/assign": ([actionType, profileId]) => {
    if (!profileById(profileId)) {
      return { success: false, error: { message: "No such model" } };
    }
    assignments[String(actionType)] = String(profileId);
    return success;
  },
  "assignments/unassign": ([actionType]) => {
    delete assignments[String(actionType)];
    return success;
  },
  "assignments/bulk-assign": ([map]) => {
    if (isRecord(map)) {
      for (const [action, profileId] of Object.entries(map)) {
        if (profileId) assignments[action] = String(profileId);
        else delete assignments[action];
      }
    }
    return success;
  },
  "assignments/cascade-profile-delete": ([id]) => {
    for (const [action, profileId] of Object.entries(assignments)) {
      if (profileId === id) delete assignments[action];
    }
    return success;
  },

  "preferences/set-deep-mode": ([value]) => {
    preferences.deepMode = Boolean(value);
    return success;
  },
  "preferences/clear-deep-mode": () => {
    preferences.deepMode = null;
    return success;
  },
  "preferences/set-reasoning-level": ([value]) => {
    preferences.reasoningLevel = String(value ?? "off");
    return success;
  },

  "threads/create": ([input]) =>
    createThread(
      isRecord(input) ? String(input.title ?? "New chat") : "New chat",
    ),
  "threads/open-or-create": ([input]) => {
    const body = isRecord(input) ? input : {};
    const existing = threadById(body.threadId);
    if (existing) {
      return { threadId: existing.threadId, title: "", priorMessages: [] };
    }
    const thread = createThread(
      textOf(body.firstMessage).slice(0, 40) || "New chat",
      typeof body.profileId === "string" ? body.profileId : undefined,
    );
    return {
      threadId: thread.threadId,
      title: thread.title,
      priorMessages: [],
    };
  },
  "threads/touch": ([threadId]) => {
    const thread = threadById(threadId);
    if (thread) thread.lastEditDate = Date.now();
    return success;
  },
  "threads/rename": ([threadId, title]) => {
    const thread = threadById(threadId);
    if (thread && typeof title === "string") thread.title = title;
    return success;
  },
  "threads/delete": ([threadId]) => {
    const index = threads.findIndex((thread) => thread.threadId === threadId);
    if (index >= 0) {
      messages.delete(threads[index].threadId);
      threads.splice(index, 1);
    }
    return success;
  },
  "threads/clear-messages": ([threadId]) => {
    messages.set(String(threadId), []);
    return success;
  },
  "threads/regenerate-title": ([threadId]) =>
    threadById(threadId)?.title ?? "New chat",

  "tools/add-custom-server": setServer,
  "tools/update-custom-server": setServer,
  "tools/remove-custom-server": ([name]) => {
    delete customServers[String(name)];
    return success;
  },
  "tools/replace-all-custom-servers": ([map]) => {
    for (const name of Object.keys(customServers)) delete customServers[name];
    if (isRecord(map)) {
      for (const [name, config] of Object.entries(map)) {
        if (isRecord(config)) customServers[name] = config;
      }
    }
    return success;
  },
  "tools/set-disabled": ([serverType, toolNames]) => {
    disabledTools[String(serverType)] = Array.isArray(toolNames)
      ? toolNames.map(String)
      : [];
    return success;
  },
  "tools/set-allow-always": ([serverType, toolName, value]) => {
    const key = `${serverType}:${toolName}`;
    const index = allowAlways.indexOf(key);
    if (value && index < 0) allowAlways.push(key);
    if (!value && index >= 0) allowAlways.splice(index, 1);
    return success;
  },

  // No search engine is asked: every key "works".
  "web-search/test-connection": () => true,
  "web-search/configure": ([config]) => {
    webSearch = isRecord(config) ? config : null;
    return { success: true, config: webSearch };
  },
  "web-search/set-active-config": ([config]) => {
    webSearch = isRecord(config) ? config : null;
    return success;
  },
  "web-search/clear": () => {
    webSearch = null;
    return success;
  },
};

const route = (url: URL) =>
  url.pathname.replace(/^\/api\/2\.0\/ai\//, "").replace(/\/+$/, "");

// Unknown routes fall through to the worker's 404 and its warning, so a
// route the fixtures do not cover shows up in the console.
const aiService = http.all(api("ai/:area/:action"), async ({ request }) => {
  const url = new URL(request.url);
  const path = route(url);

  if (request.method === "GET") {
    const read = READS[path];
    return read ? HttpResponse.json(read(url) ?? null) : undefined;
  }

  const write = WRITES[path];
  if (!write) return undefined;
  return HttpResponse.json(write(await argsOf(request)) ?? null);
});

export const aiHandlers: AnyHandler[] = [
  http.get(api("ai/agents"), agentsList),
  http.post(api("ai/ai/send-with-stream"), sendWithStream),
  http.post(api("ai/ai/regenerate-stream"), regenerateStream),
  aiService,
];
