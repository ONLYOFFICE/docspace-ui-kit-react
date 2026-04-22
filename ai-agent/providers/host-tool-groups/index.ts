// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type {
  ChatEventBus,
  HostTool,
  HostToolGroup,
  ServersStoreState,
} from "@onlyoffice/ai-chat";

type ServersLike = {
  hostToolSource: { setGroups: (groups: HostToolGroup[]) => void };
};

type ProviderLike = {
  setCurrentProviderTools: (tools: ServersStoreState["tools"]) => void;
};

type ServersStoreHook = {
  getState: () => ServersStoreState;
};

type ToolsRuntime = {
  servers: ServersLike;
  useServersStore: ServersStoreHook;
  provider: ProviderLike;
  eventBus: ChatEventBus;
};

// Handlers run outside React, so a state update via `window.dispatchEvent` +
// React re-render doesn't commit before the chat lib fires the next LLM
// request. We keep a direct runtime handle to the chat's servers, store, and
// provider so a handler can synchronously rebuild the tool list and push it
// into `provider.currentProvider.tools` before returning.
let toolsRuntime: ToolsRuntime | null = null;

export const attachHostToolsRuntime = (runtime: ToolsRuntime) => {
  toolsRuntime = runtime;
};

const syncChatLibTools = async (groups: HostToolGroup[]) => {
  if (!toolsRuntime) {
    console.warn(
      "%c[host-tool-groups] syncChatLibTools: runtime not attached",
      "color: red",
    );
    return;
  }
  const { servers, useServersStore, provider, eventBus } = toolsRuntime;
  servers.hostToolSource.setGroups(groups);
  await useServersStore.getState().getTools();
  const storeTools = useServersStore.getState().tools;
  provider.setCurrentProviderTools(storeTools);
  // Notify the chat lib's own listeners (ChatInput's tools settings dropdown,
  // etc.) — this is the event the lib fires internally when MCP tools change.
  eventBus.emit("tools-changed");
  console.log(
    "%c[host-tool-groups] syncChatLibTools done",
    "color: green; font-weight: bold",
    {
      groups: groups.map((g) => ({ id: g.id, tools: g.tools.map((t) => t.name) })),
      storeTools: storeTools.map((t) => t.name),
    },
  );
};

export const EDITOR_GROUP_ID = "editor";
export const EDITOR_GROUP_NAME = "Editor";

// DOM custom-event name that swaps the tools in the editor group. React state
// in `AiAgentProviders` subscribes to this and rebuilds `hostToolGroups` with
// a fresh reference so `ToolsProvider` → `useServers` re-runs its sync.
// Plain module-level mutation doesn't work: React won't re-render, so the
// chat's tool list stays stale.
export const EDITOR_TOOLS_EVENT = "ai-agent:editor-tools-changed";

export type EditorToolsChangedDetail = { tools: HostTool[] };

const dispatchEditorTools = (tools: HostTool[]) => {
  window.dispatchEvent(
    new CustomEvent<EditorToolsChangedDetail>(EDITOR_TOOLS_EVENT, {
      detail: { tools },
    }),
  );
};

const EDITOR_PANEL_ID = "ai-agent-editor-panel";
const INIT_MESSAGE = "initedAiPlugin";
const CALL_TOOL_MESSAGE = "callEditorTool";
const TOOL_RESULT_MESSAGE = "editorToolResult";

// Reference to the currently-open editor iframe's content window. Dynamic
// tool handlers (mounted after the editor posts its tool list) use this to
// forward calls into the iframe. Cleared when the panel closes.
let editorPanelWindow: Window | null = null;

let nextCallId = 0;
const generateCallId = () => `editor-tool-call-${Date.now()}-${nextCallId++}`;

const callEditorTool = (
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> => {
  const target = editorPanelWindow;
  if (!target) {
    return Promise.resolve(JSON.stringify({ result: "" }));
  }
  const callId = generateCallId();
  return new Promise<unknown>((resolve) => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== target) return;
      const payload = event.data;
      if (
        !payload ||
        typeof payload !== "object" ||
        (payload as { type?: unknown }).type !== TOOL_RESULT_MESSAGE ||
        (payload as { callId?: unknown }).callId !== callId
      )
        return;
      window.removeEventListener("message", onMessage);
      resolve((payload as { result?: unknown }).result ?? "");
    };
    window.addEventListener("message", onMessage);
    target.postMessage(
      { type: CALL_TOOL_MESSAGE, callId, name, arguments: args },
      "*",
    );
  });
};

export const fileManagementTools: HostTool[] = [
  {
    name: "create_file",
    description:
      "Creates a new empty document inside the specified DocSpace folder. " +
      "The caller must provide the target folder_id where the file will be placed. " +
      "Use this tool when the user asks to create a new document without opening it immediately.",
    inputSchema: {
      type: "object",
      properties: {
        folder_id: {
          type: "string",
          description:
            "Identifier of the DocSpace folder in which the new file will be created.",
        },
      },
      required: ["folder_id"],
    },
    handler: async (args) => {
      console.log("[editor.create_file] called with args:", args);
      return JSON.stringify({ result: "" });
    },
  },
  {
    name: "open_file",
    description:
      "Opens an existing file in the DocSpace editor by its identifier. " +
      "The caller must provide the id of the file to open. " +
      "Use this tool when the user asks to open a specific document they already have.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Identifier of the file to open in the editor.",
        },
      },
      required: ["id"],
    },
    handler: async (args) => {
      console.log(
        "%c[editor.open_file] HANDLER INVOKED",
        "color: blue; font-weight: bold",
        args,
      );
      const fileId = (args as { id?: string | number }).id;
      if (fileId === undefined) return JSON.stringify({ result: "" });

      const data = await openEditorPanel(fileId, () => {
        void restoreFileManagementTools();
      });
      console.log(
        "%c[editor.open_file] initedAiPlugin payload received",
        "color: blue",
        data,
      );
      await mountEditorDynamicTools(data);
      console.log(
        "%c[editor.open_file] returning to chat lib",
        "color: blue; font-weight: bold",
      );
      return JSON.stringify({ result: "" });
    },
  },
  {
    name: "create_and_open",
    description:
      "Creates a new document inside the specified DocSpace folder and immediately " +
      "opens it in the editor. The caller must provide the target folder_id. " +
      "Use this tool when the user wants to start editing a brand-new document right away.",
    inputSchema: {
      type: "object",
      properties: {
        folder_id: {
          type: "string",
          description:
            "Identifier of the DocSpace folder in which the new file will be created " +
            "and then opened.",
        },
      },
      required: ["folder_id"],
    },
    handler: async (args) => {
      console.log("[editor.create_and_open] called with args:", args);
      return JSON.stringify({ result: "" });
    },
  },
];

export const buildEditorToolGroup = (tools: HostTool[]): HostToolGroup => ({
  id: EDITOR_GROUP_ID,
  name: EDITOR_GROUP_NAME,
  tools,
});

// Initial group, used on first mount before any file has been opened.
export const initialHostToolGroups: HostToolGroup[] = [
  buildEditorToolGroup(fileManagementTools),
];

// Shape the editor iframe posts for each registered tool. `parameters` is a
// JSON-Schema-compatible object that we can feed straight into `inputSchema`.
type EditorTool = {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
};

const isEditorToolArray = (value: unknown): value is EditorTool[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as { name?: unknown }).name === "string",
  );

const mapEditorToolToHostTool = (tool: EditorTool): HostTool => ({
  name: tool.name,
  description: tool.description ?? "",
  inputSchema: tool.parameters ?? { type: "object", properties: {} },
  handler: async (args) => {
    console.log(`[editor.${tool.name}] called with args:`, args);
    const result = await callEditorTool(tool.name, args);
    return typeof result === "string" ? result : JSON.stringify({ result });
  },
});

const extractEditorToolArray = (raw: unknown): EditorTool[] | null => {
  if (isEditorToolArray(raw)) return raw;
  // The editor posts `{ Tools: [...] }`, so unwrap when needed.
  if (typeof raw === "object" && raw !== null) {
    const candidate = (raw as { Tools?: unknown }).Tools;
    if (isEditorToolArray(candidate)) return candidate;
  }
  return null;
};

const mountEditorDynamicTools = async (data: unknown) => {
  console.log("[host-tool-groups] mountEditorDynamicTools input:", data);
  const editorTools = extractEditorToolArray(data);
  if (!editorTools) {
    console.warn(
      "[host-tool-groups] mountEditorDynamicTools: could not extract EditorTool[] from payload",
    );
    return;
  }
  const dynamicTools = editorTools.map(mapEditorToolToHostTool);
  console.log(
    "[host-tool-groups] swapping editor tools:",
    dynamicTools.map((t) => t.name),
  );
  // React state update (keeps UI — tools settings list, etc. — in sync).
  dispatchEditorTools(dynamicTools);
  // Direct synchronous refresh of the chat lib's tool list + provider, so
  // the next LLM request made right after our handler returns sees the
  // new tools instead of waiting for React to commit.
  await syncChatLibTools([buildEditorToolGroup(dynamicTools)]);
};

const restoreFileManagementTools = async () => {
  dispatchEditorTools(fileManagementTools);
  await syncChatLibTools([buildEditorToolGroup(fileManagementTools)]);
};

// Opens a fixed panel on the left side of the viewport (full height,
// `calc(100dvw - 400px)` wide) containing an iframe pointing at the DocSpace
// editor for `fileId`. Resolves once the iframe posts an `initedAiPlugin`
// message back to this window, so callers can wait for the editor's AI
// plugin to finish initializing before returning a tool result. `onClose`
// fires once when the panel is dismissed (close button or external remove),
// so callers can tear down any state they registered while the panel was up.
const openEditorPanel = (
  fileId: string | number,
  onClose?: () => void,
): Promise<unknown> =>
  new Promise<unknown>((resolve) => {
    document.getElementById(EDITOR_PANEL_ID)?.remove();

    const panel = document.createElement("div");
    panel.id = EDITOR_PANEL_ID;
    Object.assign(panel.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "calc(100dvw - 400px)",
      height: "100vh",
      background: "#fff",
      boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
      zIndex: "9999",
      display: "flex",
      flexDirection: "column",
    } satisfies Partial<CSSStyleDeclaration>);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.textContent = "×";
    closeBtn.setAttribute("aria-label", "Close editor panel");
    Object.assign(closeBtn.style, {
      position: "absolute",
      top: "8px",
      right: "8px",
      width: "32px",
      height: "32px",
      border: "none",
      background: "transparent",
      fontSize: "20px",
      lineHeight: "1",
      cursor: "pointer",
      zIndex: "1",
    } satisfies Partial<CSSStyleDeclaration>);

    const iframe = document.createElement("iframe");
    iframe.src = `${window.location.origin}/doceditor?fileId=${encodeURIComponent(String(fileId))}`;
    Object.assign(iframe.style, {
      flex: "1",
      width: "100%",
      height: "100%",
      border: "none",
    } satisfies Partial<CSSStyleDeclaration>);
    iframe.addEventListener(
      "load",
      () => {
        editorPanelWindow = iframe.contentWindow;
      },
      { once: true },
    );

    const isInitMessage = (data: unknown): boolean => {
      if (data === INIT_MESSAGE) return true;
      if (typeof data === "object" && data !== null) {
        const payload = data as { type?: unknown; event?: unknown };
        return payload.type === INIT_MESSAGE || payload.event === INIT_MESSAGE;
      }
      return false;
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      if (!isInitMessage(event.data)) return;
      console.log(
        "[host-tool-groups] initedAiPlugin received, raw event.data:",
        event.data,
      );
      window.removeEventListener("message", onMessage);
      const payload =
        typeof event.data === "object" && event.data !== null
          ? (event.data as { data?: unknown }).data
          : undefined;
      resolve(payload);
    };
    window.addEventListener("message", onMessage);

    let closed = false;
    const handleClose = () => {
      if (closed) return;
      closed = true;
      window.removeEventListener("message", onMessage);
      editorPanelWindow = null;
      panel.remove();
      onClose?.();
    };
    closeBtn.addEventListener("click", handleClose);

    panel.appendChild(closeBtn);
    panel.appendChild(iframe);
    document.body.appendChild(panel);
  });
