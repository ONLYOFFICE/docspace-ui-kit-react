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

type ServersStoreHook = {
  getState: () => ServersStoreState;
};

type ToolsRuntime = {
  servers: ServersLike;
  useServersStore: ServersStoreHook;
  eventBus: ChatEventBus;
};

// SINGLE-MOUNT ASSUMPTION: the mutable state below (toolsRuntime, the two
// callbacks, editorPanelWindow, editorReady*, nextCallId) is module-level and
// therefore a singleton shared across every import. This module assumes exactly
// one live AiAgentProviders at a time. Mounting a second instance concurrently
// (micro-frontend re-mount, etc.) would share and corrupt this state. Each
// `attach*` setter overwrites the previous handle, so a remount that re-runs
// the attach effects re-points cleanly to the latest instance — but two
// instances alive at once is not supported.

// Handlers run outside React, so a state update via `window.dispatchEvent` +
// React re-render doesn't commit before the chat lib fires the next LLM
// request. We keep a direct runtime handle to the chat's servers, store, and
// provider so a handler can synchronously rebuild the tool list and push it
// into `provider.currentProvider.tools` before returning.
let toolsRuntime: ToolsRuntime | null = null;

export const attachHostToolsRuntime = (runtime: ToolsRuntime) => {
  if (toolsRuntime && toolsRuntime !== runtime) {
    // A different runtime is already attached — either a remount (expected,
    // the old instance is gone) or two concurrent providers (unsupported,
    // see the single-mount note above). Warn so the latter is visible.
    console.warn(
      "%c[host-tool-groups] attachHostToolsRuntime called while a runtime " +
        "was already attached; overwriting. Concurrent AiAgentProviders " +
        "mounts share module state and are not supported.",
      "color: orange",
    );
  }
  toolsRuntime = runtime;
};

// Called by open_file / create_and_open to switch the client to the result
// storage tab and show the document in the inline iframe. Injected from
// Shell so it has access to React Router navigate and MobX stores.
let openResultFileCallback: ((fileId: number | string) => void) | null = null;

export const attachOpenResultFile = (cb: (fileId: number | string) => void) => {
  openResultFileCallback = cb;
};

// Called when the editor panel is closed to let the host clear any state
// tied to the open document (e.g. selectedResultFileId in AiRoomStore).
let closeEditorPanelCallback: (() => void) | null = null;

export const attachCloseEditorPanel = (cb: () => void) => {
  closeEditorPanelCallback = cb;
};

const syncChatLibTools = async (groups: HostToolGroup[]) => {
  if (!toolsRuntime) {
    console.warn(
      "%c[host-tool-groups] syncChatLibTools: runtime not attached",
      "color: red",
    );
    return;
  }
  const { servers, useServersStore, eventBus } = toolsRuntime;
  servers.hostToolSource.setGroups(groups);
  await useServersStore.getState().getTools();
  const storeTools = useServersStore.getState().tools;
  // 0.2.5 reads tools fresh from the servers store on each send — no
  // provider singleton to push into. Just notify the chat lib's listeners
  // (ChatInput's tools settings dropdown, etc.) that the list changed.
  eventBus.emit("tools-changed");
  console.log(
    "%c[host-tool-groups] syncChatLibTools done",
    "color: green; font-weight: bold",
    {
      groups: groups.map((g) => ({
        id: g.id,
        tools: g.tools.map((t) => t.name),
      })),
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

const INIT_MESSAGE = "initedAiPlugin";
const CALL_TOOL_MESSAGE = "callEditorTool";
const TOOL_RESULT_MESSAGE = "editorToolResult";

// Reference to the currently-open editor iframe's content window.
let editorPanelWindow: Window | null = null;

// Resolves when the editor iframe's onParentMessage listener is registered.
let editorReadyPromise: Promise<void> | null = null;
let editorReadyResolve: (() => void) | null = null;

// Cleanup for the currently-open editor panel (removes its `message` listener
// and resets the editor state). Held at module scope so a subsequent
// openEditorPanel() can tear down the previous panel's listener before
// attaching a new one — otherwise each reopen would leak one listener.
let activeEditorPanelCleanup: (() => void) | null = null;

const createEditorReadyPromise = () => {
  editorReadyPromise = new Promise<void>((r) => {
    editorReadyResolve = r;
  });
};

const markEditorReady = () => {
  editorReadyResolve?.();
  editorReadyResolve = null;
};

let nextCallId = 0;
const generateCallId = () => `editor-tool-call-${Date.now()}-${nextCallId++}`;

const EDITOR_TOOL_TIMEOUT_MS = 10_000;
const EDITOR_READY_TIMEOUT_MS = 60_000;

const callEditorTool = async (
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> => {
  const target = editorPanelWindow;
  if (!target) {
    return JSON.stringify({ error: "No document is currently open" });
  }

  if (editorReadyPromise != null) {
    await Promise.race([
      editorReadyPromise,
      new Promise<void>((r) => setTimeout(r, EDITOR_READY_TIMEOUT_MS)),
    ]);
  }

  const callId = generateCallId();
  return new Promise<unknown>((resolve) => {
    const finish = (value: unknown) => {
      clearTimeout(timeoutId);
      window.removeEventListener("message", onMessage);
      resolve(value);
    };
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
      finish((payload as { result?: unknown }).result ?? "");
    };
    window.addEventListener("message", onMessage);
    const timeoutId = setTimeout(() => {
      finish(
        JSON.stringify({
          error: `Editor tool "${name}" did not respond in time`,
        }),
      );
    }, EDITOR_TOOL_TIMEOUT_MS);
    // SECURITY: targetOrigin is "*", which broadcasts the tool-call payload
    // (callId + arguments) to any frame loaded in the editor panel window,
    // including cross-origin iframes (violates postMessage same-origin guidance,
    // flagged by MDN). The editor iframe src is built from window.location.origin,
    // so it is same-origin in practice — capture that origin when the iframe
    // loads and pass it here instead of "*" to scope the message to the editor.
    target.postMessage(
      { type: CALL_TOOL_MESSAGE, callId, name, arguments: args },
      "*",
    );
  });
};

export const fileManagementTools: HostTool[] = [];

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

const isInitMessage = (data: unknown): boolean => {
  if (data === INIT_MESSAGE) return true;
  if (typeof data === "object" && data !== null) {
    const payload = data as { type?: unknown; event?: unknown };
    return payload.type === INIT_MESSAGE || payload.event === INIT_MESSAGE;
  }
  return false;
};

export const EDITOR_PANEL_ID = "ai-agent-editor-panel";

// Creates a DOM overlay containing the document editor iframe, positioned
// over the section body (.section-body has position:relative via DragAndDrop).
// Calling this also triggers navigation to the Result Storage tab via
// openResultFileCallback. The close button removes the panel and notifies
// the host app to clear related state via closeEditorPanelCallback.
export const openEditorPanel = (fileId: number | string): void => {
  // Tear down any previous panel's message listener + editor state first, so
  // reopening (new file) doesn't accumulate stale listeners. Removing the DOM
  // node below alone wouldn't detach the window `message` listener.
  activeEditorPanelCleanup?.();
  document.getElementById(EDITOR_PANEL_ID)?.remove();

  openResultFileCallback?.(fileId);
  createEditorReadyPromise();

  const panel = document.createElement("div");
  panel.id = EDITOR_PANEL_ID;
  // position: fixed; inset: 0 — full screen. The article sidebar (z-index 209)
  // is a positioned element and naturally appears above our z-index 201 overlay.
  // right: 400px leaves the info panel (400px wide) uncovered on the right.
  Object.assign(panel.style, {
    position: "fixed",
    top: "0",
    left: "0",
    right: "400px",
    bottom: "0",
    zIndex: "201",
    background: "var(--section-header-bg)",
  });

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close editor");
  closeBtn.textContent = "\u00D7";
  Object.assign(closeBtn.style, {
    position: "absolute",
    insetBlockStart: "8px",
    insetInlineEnd: "8px",
    zIndex: "1",
    width: "28px",
    height: "28px",
    border: "none",
    borderRadius: "4px",
    background: "var(--background-normal)",
    color: "var(--icon-normal)",
    fontSize: "18px",
    lineHeight: "1",
    cursor: "pointer",
  });

  const iframe = document.createElement("iframe");
  iframe.src = `${window.location.origin}/doceditor?fileId=${encodeURIComponent(fileId)}`;
  iframe.title = "Document editor";
  iframe.setAttribute("allowfullscreen", "");
  Object.assign(iframe.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    border: "none",
  });

  iframe.addEventListener(
    "load",
    () => {
      editorPanelWindow = iframe.contentWindow;
    },
    { once: true },
  );

  // Set up message listeners for editor ready + dynamic tool registration.
  let listenerActive = true;
  const onMessage = (event: MessageEvent) => {
    const sourceWindow = event.source as Window | null;
    if (sourceWindow) {
      try {
        let w: Window | null = sourceWindow;
        let isDescendant = false;
        while (w && w !== window) {
          if (w === iframe.contentWindow) {
            isDescendant = true;
            break;
          }
          w = w.parent === w ? null : w.parent;
        }
        if (!isDescendant) return;
      } catch {
        // Cross-origin: accept and rely on message type as guard.
      }
    }

    const isReady =
      typeof event.data === "object" &&
      event.data !== null &&
      (event.data as { type?: unknown }).type === "editorDocumentReady";
    if (isReady) markEditorReady();

    if (!isInitMessage(event.data)) return;
    markEditorReady();
    if (listenerActive) {
      listenerActive = false;
      window.removeEventListener("message", onMessage);
    }
    const payload =
      typeof event.data === "object" && event.data !== null
        ? (event.data as { data?: unknown }).data
        : undefined;
    void mountEditorDynamicTools(payload);
  };
  window.addEventListener("message", onMessage);

  const cleanup = () => {
    if (listenerActive) {
      listenerActive = false;
      window.removeEventListener("message", onMessage);
    }
    editorPanelWindow = null;
    editorReadyPromise = null;
    editorReadyResolve = null;
    // Only clear the module handle if it still points at this panel's cleanup
    // (a later openEditorPanel may have already replaced it).
    if (activeEditorPanelCleanup === cleanup) activeEditorPanelCleanup = null;
  };
  activeEditorPanelCleanup = cleanup;

  closeBtn.addEventListener("click", () => {
    cleanup();
    panel.remove();
    void restoreFileManagementTools();
    closeEditorPanelCallback?.();
  });

  panel.appendChild(closeBtn);
  panel.appendChild(iframe);
  document.body.appendChild(panel);
};

