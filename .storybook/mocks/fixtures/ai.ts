// The demo portal's AI: its agents (rooms of the AI type), the models and
// assignments the AI service keeps, and the MCP servers the chat may call.
// Every name is made up, no key is real, and every provider address points
// at the demo origin, so nothing here could reach a real model.

import { DEMO_PORTAL_URL, daysAgo } from "../demoPortal";
import { DEMO_PEOPLE, DEMO_SELF, authorOf } from "./people";

// `FolderType` in the SDK: the "AI agents" section and one agent inside it.
const FOLDER_TYPE_AI_AGENTS = 34;
const FOLDER_TYPE_AI_ROOM = 31;
// `RoomType.AiRoom`.
const ROOM_TYPE_AI = 9;

/** The "AI agents" section every agent sits in; the selector's breadcrumb. */
export const DEMO_AGENTS_ROOT = {
  id: 7000,
  title: "AI agents",
  folderType: FOLDER_TYPE_AI_AGENTS,
  rootFolderType: FOLDER_TYPE_AI_AGENTS,
  parentId: 0,
  filesCount: 0,
  foldersCount: 0,
  security: { Read: true, Create: true, UseChat: true },
  createdBy: authorOf(DEMO_SELF),
  created: daysAgo(400),
  updated: daysAgo(1),
};

type DemoAgent = {
  title: string;
  /** The room logo's colour, as the portal sends it: six hex digits, no `#`. */
  color: string;
  filesCount: number;
  /** Whether the viewer may chat with it; `false` shows it disabled. */
  canChat?: boolean;
  shared?: boolean;
  ownerIndex: number;
  updatedDaysAgo: number;
};

const AGENTS: DemoAgent[] = [
  {
    title: "Contract reviewer",
    color: "5299E0",
    filesCount: 12,
    shared: true,
    ownerIndex: 2,
    updatedDaysAgo: 1,
  },
  {
    title: "Marketing copywriter",
    color: "2DB482",
    filesCount: 7,
    ownerIndex: 3,
    updatedDaysAgo: 2,
  },
  {
    title: "Sales assistant",
    color: "F97A0B",
    filesCount: 4,
    shared: true,
    ownerIndex: 4,
    updatedDaysAgo: 3,
  },
  {
    title: "Finance analyst",
    color: "8F4DDA",
    filesCount: 18,
    ownerIndex: 5,
    updatedDaysAgo: 5,
  },
  {
    title: "IT helpdesk",
    color: "1B9AAA",
    filesCount: 23,
    ownerIndex: 1,
    updatedDaysAgo: 8,
  },
  {
    title: "Onboarding guide",
    color: "E34A74",
    filesCount: 9,
    ownerIndex: 0,
    updatedDaysAgo: 12,
  },
  {
    title: "Board minutes (restricted)",
    color: "6C757D",
    filesCount: 31,
    canChat: false,
    ownerIndex: 0,
    updatedDaysAgo: 20,
  },
];

export const DEMO_AGENTS = AGENTS.map((agent, index) => {
  const owner = DEMO_PEOPLE[agent.ownerIndex] ?? DEMO_SELF;
  const canChat = agent.canChat ?? true;
  return {
    id: 7101 + index,
    title: agent.title,
    roomType: ROOM_TYPE_AI,
    folderType: FOLDER_TYPE_AI_ROOM,
    rootFolderType: FOLDER_TYPE_AI_AGENTS,
    parentId: DEMO_AGENTS_ROOT.id,
    filesCount: agent.filesCount,
    foldersCount: 0,
    shared: agent.shared ?? false,
    private: false,
    pinned: false,
    isFavorite: false,
    new: 0,
    // No picture, so the room icon draws the initials on this colour.
    logo: {
      original: "",
      large: "",
      medium: "",
      small: "",
      color: agent.color,
    },
    tags: [],
    security: {
      Read: true,
      UseChat: canChat,
      Create: canChat,
      EditRoom: owner.id === DEMO_SELF.id,
    },
    createdBy: authorOf(owner),
    updatedBy: authorOf(owner),
    created: daysAgo(agent.updatedDaysAgo + 60),
    updated: daysAgo(agent.updatedDaysAgo),
  };
});

// ---------------------------------------------------------------------------
// The AI service: models, assignments, MCP servers, web search.

/** `CapabilitiesUI` bits of `@onlyoffice/ai-chat`. */
const CAPABILITY = { Chat: 1, Image: 2, Vision: 128, Tools: 256 } as const;

export type DemoProfile = {
  id: string;
  name: string;
  providerType: string;
  baseUrl: string;
  key: string;
  modelId: string;
  capabilities: number;
  canUseTool: boolean;
  createdAt: number;
};

export type DemoModel = {
  id: string;
  name: string;
  provider: string;
  capabilities: number;
};

// A provider address on the demo origin: nothing answers it, and no request
// to it leaves the browser.
const DEMO_PROVIDER_URL = `${DEMO_PORTAL_URL}/demo-ai-provider/v1`;

const createdDaysAgo = (days: number) => new Date(daysAgo(days)).getTime();

/** The models the demo portal has connected, newest first. */
export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    name: "Demo assistant",
    providerType: "openai",
    baseUrl: DEMO_PROVIDER_URL,
    key: "demo-key-not-real",
    modelId: "demo-chat-large",
    capabilities: CAPABILITY.Chat | CAPABILITY.Vision,
    canUseTool: false,
    createdAt: createdDaysAgo(30),
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    name: "Demo writer",
    providerType: "anthropic",
    baseUrl: DEMO_PROVIDER_URL,
    key: "demo-key-not-real",
    modelId: "demo-writer-1",
    capabilities: CAPABILITY.Chat,
    canUseTool: false,
    createdAt: createdDaysAgo(60),
  },
  {
    id: "a1000000-0000-4000-8000-000000000003",
    name: "Demo illustrator",
    providerType: "openai",
    baseUrl: DEMO_PROVIDER_URL,
    key: "demo-key-not-real",
    modelId: "demo-image-1",
    capabilities: CAPABILITY.Image,
    canUseTool: false,
    createdAt: createdDaysAgo(90),
  },
];

/** What each provider offers, keyed by `providerType`. */
export const DEMO_MODELS: Record<string, DemoModel[]> = {
  openai: [
    {
      id: "demo-chat-large",
      name: "Demo Chat Large",
      provider: "openai",
      capabilities: CAPABILITY.Chat | CAPABILITY.Vision,
    },
    {
      id: "demo-chat-small",
      name: "Demo Chat Small",
      provider: "openai",
      capabilities: CAPABILITY.Chat,
    },
    {
      id: "demo-image-1",
      name: "Demo Image 1",
      provider: "openai",
      capabilities: CAPABILITY.Image,
    },
  ],
  anthropic: [
    {
      id: "demo-writer-1",
      name: "Demo Writer 1",
      provider: "anthropic",
      capabilities: CAPABILITY.Chat,
    },
    {
      id: "demo-writer-mini",
      name: "Demo Writer Mini",
      provider: "anthropic",
      capabilities: CAPABILITY.Chat,
    },
  ],
};

const [ASSISTANT, WRITER, ILLUSTRATOR] = DEMO_PROFILES.map(
  (profile) => profile.id,
);

/** `ActionType` -> profile id, as `assignments/get-all-assignments` answers. */
export const DEMO_ASSIGNMENTS: Record<string, string> = {
  Default: ASSISTANT,
  Chat: ASSISTANT,
  Summarization: WRITER,
  Translation: WRITER,
  Vision: ASSISTANT,
  OCR: ASSISTANT,
  ImageGeneration: ILLUSTRATOR,
};

type DemoTool = { name: string; description: string };

const tools = (list: DemoTool[]) =>
  list.map((tool) => ({
    ...tool,
    inputSchema: { type: "object", properties: {} },
    enabled: true,
  }));

/**
 * The host-configured server, keyed "portal" like the one a real portal
 * lists -- the selector's pre-selection story names it.
 */
export const DEMO_SYSTEM_SERVER = "portal";

export const DEMO_SYSTEM_TOOLS = tools([
  { name: "list_rooms", description: "List the rooms the user can open." },
  {
    name: "search_files",
    description: "Find files by name or content across the portal.",
  },
  {
    name: "create_document",
    description: "Create a text document in a folder.",
  },
  {
    name: "read_file",
    description: "Read the text of a document the user has access to.",
  },
]);

/** Custom servers, keyed by name, each with its (fake) transport config. */
export const DEMO_CUSTOM_SERVERS: Record<string, Record<string, unknown>> = {
  "Demo CRM": {
    url: `${DEMO_PORTAL_URL}/demo-mcp/crm`,
    headers: { Authorization: "Bearer demo-key-not-real" },
  },
  "Demo knowledge base": {
    url: `${DEMO_PORTAL_URL}/demo-mcp/knowledge`,
  },
};

/** What each custom server's tools would be, once registered. */
export const DEMO_CUSTOM_TOOLS: Record<string, ReturnType<typeof tools>> = {
  "Demo CRM": tools([
    { name: "find_customer", description: "Look up a customer record." },
    { name: "list_deals", description: "List the open deals of a customer." },
  ]),
  "Demo knowledge base": tools([
    { name: "search_articles", description: "Search the knowledge base." },
  ]),
};

/** A generic tool list for a custom server added in the story. */
export const DEMO_NEW_SERVER_TOOLS = tools([
  { name: "ping", description: "Check that the server answers." },
]);

// ---------------------------------------------------------------------------
// Chat history, so the chat list has something in it.

export type DemoMessage = {
  id: string;
  role: "user" | "assistant";
  content: { type: "text"; text: string }[];
  createdAt: number;
};

export type DemoThread = {
  threadId: string;
  title: string;
  lastEditDate: number;
  profileId: string;
};

const text = (value: string) => [{ type: "text" as const, text: value }];

type SeedThread = {
  title: string;
  days: number;
  question: string;
  answer: string;
};

const SEED_THREADS: SeedThread[] = [
  {
    title: "Summarize the Q3 client brief",
    days: 1,
    question: "Summarize the Q3 client brief in three bullet points.",
    answer:
      "This is a demo reply. No model was called.\n\n" +
      "- A made-up first point\n- A made-up second point\n- A made-up third point",
  },
  {
    title: "Draft a welcome email",
    days: 4,
    question: "Draft a short welcome email for a new team member.",
    answer:
      "This is a demo reply. No model was called.\n\n" +
      "Connect a real portal in the toolbar above to see a real answer.",
  },
];

/** Fresh copies each time, so a story that deletes a thread keeps the seed. */
export const seedChatHistory = () => {
  const threads: DemoThread[] = [];
  const messages = new Map<string, DemoMessage[]>();

  SEED_THREADS.forEach((seed, index) => {
    const threadId = `demo-thread-${index + 1}`;
    const at = createdDaysAgo(seed.days);
    threads.push({
      threadId,
      title: seed.title,
      lastEditDate: at,
      profileId: ASSISTANT,
    });
    messages.set(threadId, [
      {
        id: `${threadId}-q`,
        role: "user",
        content: text(seed.question),
        createdAt: at,
      },
      {
        id: `${threadId}-a`,
        role: "assistant",
        content: text(seed.answer),
        createdAt: at + 5000,
      },
    ]);
  });

  return { threads, messages };
};
