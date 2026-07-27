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

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import i18nextSingleton from "i18next";
import {
  I18nextProvider as ReactI18nextProvider,
  useTranslation,
} from "react-i18next";

import {
  ApiProvider,
  CallbacksManager,
  ChatEventBus,
  ComponentsProvider,
  DEFAULT_SERVER_API_ROUTES,
  EventsProvider,
  I18nProvider,
  ImagesProvider,
  MiddlewareRunner,
  PlatformProvider,
  Servers,
  StoresProvider,
  ThemeProvider,
  ToolsProvider,
  WidgetConfigProvider,
  createServerAPI,
  createStores,
  useProfiles,
  useServers,
  useStores,
  useThread,
  type WidgetConfig,
} from "@onlyoffice/ai-chat";
import type {
  ChatCallbacks,
  HostTool,
  Profile,
  ProfilePickerAction,
  ProviderType,
  ServerAPIConfig,
  ToolCallApproveContext,
  WebSearchProviderId,
} from "@onlyoffice/ai-chat";

import "@onlyoffice/ai-chat/styles";

import { AiChatAvailabilityContext } from "./availability";
import { storageAdapter } from "./storage";
import { usePlatformAdapter } from "./platform";
import { componentOverrides } from "./components-overrides";
import { imageOverrides } from "./images-overrides";
import { storeKeys } from "./stores";
import { normalizeAiChatLocale } from "./locale";
import { portalThemes } from "./themes";
import {
  AgentRoomIdSync,
  AiChatStoreProvider,
  AiChatStoresBridge,
} from "./ai-chat-store";
import {
  EDITOR_TOOLS_EVENT,
  attachHostToolsRuntime,
  attachOpenResultFile,
  attachCloseEditorPanel,
  buildEditorToolGroup,
  fileManagementTools,
  openGeneratedFileWithToolCall,
  type EditorToolsChangedDetail,
} from "./host-tool-groups";
import { useApi as useFilesApi } from "../../providers/api";
import { useFilesIntegration } from "./files";
import { uploadFilesToChat } from "./files/upload-files";
import { openAttachedFile } from "./files/open-file";

// The host app (DocSpace) uses `i18n.createInstance()` and provides that
// instance via `<I18nextProvider>` at the app root. ai-chat, however, calls
// `i18n.use(initReactI18next).init(...)` on the default i18next singleton.
// Result: ai-chat's resources land in the singleton, but its `useI18n` hook
// resolves through `useTranslation()` which reads the host's instance from
// React context — so all ai-chat keys come back as raw keys.
//
// We bracket ai-chat's `<I18nProvider>` with two `<I18nextProvider>`s: the
// outer one swaps the singleton in so ai-chat's internal `I18nBridge`
// (which calls `useTranslation()`) sees its own resources, and the inner
// one restores the host's instance for `children`, so the rest of the app
// keeps using DocSpace translations.
const AiChatI18nIsolator = ({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) => {
  const { i18n: hostI18n } = useTranslation();
  return (
    <ReactI18nextProvider i18n={i18nextSingleton}>
      <I18nProvider locale={locale}>
        <ReactI18nextProvider i18n={hostI18n}>{children}</ReactI18nextProvider>
      </I18nProvider>
    </ReactI18nextProvider>
  );
};

type AiAgentProvidersProps = {
  locale: string;
  theme?: string;
  callbacks?: ChatCallbacks;
  isStandalone?: boolean;
  /**
   * Whether the AI chat is offered on the current view. Computed by the host
   * and shared with descendants via context / `useIsAiChatAvailable()`.
   */
  isAvailable?: boolean;
  getAgentRoomId?: () => number | null;
  openResultFile?: (fileId: number | string) => void;
  closeEditorPanel?: () => void;
  entityId?: string;
  /**
   * Secondary scope for the request context (agent tools, workspace
   * steering, profile fallback) when talking to an AI agent from outside
   * its room: threads/history and uploads keep following `entityId`,
   * only sends carry this value — see `WidgetConfig.contextEntityId`.
   */
  contextEntityId?: string;
  /**
   * Explicitly controls the composer model picker. The chat lib hides the
   * picker whenever `entityId` is set, but DocSpace scopes the chat by the
   * current folder/room, so `entityId` alone no longer means "agent chat".
   * Pass `true` only where the model is fixed (AI agent rooms).
   */
  hideProfilePicker?: boolean;
  /**
   * Extra items appended to the composer's model picker dropdown after a
   * separator below the profile list. Entries with `items` open a nested
   * submenu. No effect when the picker is hidden.
   */
  profilePickerActions?: ProfilePickerAction[];
  /**
   * Displays `label` as the picker value while the aliased profile drives
   * every request — see {@link ProfilePickerAlias}. The alias survives
   * store rebuilds (entity switches) and thread switches; pass `null` to
   * drop it.
   */
  profilePickerAlias?: ProfilePickerAlias | null;
  /**
   * Fired on explicit user picks in the model picker: a plain profile row
   * (`actionId` undefined) or a profilePickerActions row with `profileId`
   * (`actionId` = that action's id). Not fired by programmatic changes.
   */
  onProfilePickerSelect?: (profile: Profile, actionId?: string) => void;
  /**
   * Fired when an opened thread's persisted context settles: the agent
   * entity the conversation last ran against, or `null` for a plain
   * conversation. Not fired while the value is unknown (fetch in flight,
   * local echo of a just-created thread) — the host keeps its own state
   * then. Use it to restore/drop the picked agent per thread.
   */
  onThreadContextChange?: (
    contextEntityId: string | null,
    threadId: string,
  ) => void;
  composerHeader?: ReactNode;
  composerDisabled?: boolean;
  children: ReactNode;
};

// Server-mode API config: backend is mounted at the same origin as the
// client under /api/2.0/new-ai. Engines are intentionally not constructed
// — every method call goes over HTTP via createServerAPI / ApiProvider.
const SERVER_API_BASE_URL = "/api/2.0/new-ai";

// Next.js evaluates this useMemo during SSR for "use client" components,
// where `window` is undefined. Fall back to an empty origin — the actual
// API calls only fire from useEffect-driven code that runs after hydration.
const getOrigin = () =>
  typeof window === "undefined" ? "" : window.location.origin;

const buildServerApiConfig = (): ServerAPIConfig => ({
  origin: getOrigin(),
  baseUrl: SERVER_API_BASE_URL,
  routes: DEFAULT_SERVER_API_ROUTES,
});

// Hydrates Zustand stores (profiles, threads, prompts, servers/tools) from
// the server on mount. Lives inside StoresProvider + ToolsProvider so it
// can read the stores/servers context. Without this, persisted data
// (like AI profiles) would only appear after the first in-session write.
const StoresHydrator = () => {
  useProfiles({ isReady: true });
  useThread({ isReady: true });
  useServers({ isReady: true });
  return null;
};

/**
 * Host-driven alias for the composer model picker: the profile is selected
 * as the session chat profile while the picker displays `label` (e.g. an AI
 * agent name) instead of the profile's own name.
 */
export type ProfilePickerAlias = {
  profileId: string;
  label: string;
};

// Applies the alias whenever the host's pick changes (and once profiles
// hydrate). Deliberately NOT keyed on the thread: a thread switch restores
// the thread's own profile, and the host re-drives the alias per thread
// through onThreadContextChange — see ThreadContextBridge.
const ProfilePickerAliasBridge = ({
  alias,
}: {
  alias?: ProfilePickerAlias | null;
}) => {
  const { useProfilesStore } = useStores();
  const initialized = useProfilesStore((s) => s.initialized);
  const getProfileById = useProfilesStore((s) => s.getProfileById);
  const setSessionChatProfile = useProfilesStore(
    (s) => s.setSessionChatProfile,
  );

  useEffect(() => {
    if (!alias || !initialized) return;
    const profile = getProfileById(alias.profileId);
    if (!profile) return;
    setSessionChatProfile({ ...profile, name: alias.label });
  }, [alias, initialized, getProfileById, setSessionChatProfile]);

  return null;
};

// Hands the opened thread's persisted context back to the host: the engine
// stamps contextEntityId into stored user messages, the message store
// derives the thread's value on load (`undefined` = not settled — a fetch
// in flight or the local echo of a just-created thread — never reported;
// the host's own state is the truth then), and this bridge reports the
// settled value so the host can restore or drop its per-thread agent state.
const ThreadContextBridge = ({
  onThreadContextChange,
}: {
  onThreadContextChange?: (
    contextEntityId: string | null,
    threadId: string,
  ) => void;
}) => {
  const { useMessageStore, useThreadsStore } = useStores();
  const threadId = useThreadsStore((s) => s.threadId);
  const threadContext = useMessageStore((s) => s.threadContextEntityId);

  useEffect(() => {
    if (!onThreadContextChange || !threadId) return;
    if (threadContext === undefined) return;
    onThreadContextChange(threadContext, threadId);
  }, [onThreadContextChange, threadId, threadContext]);

  return null;
};

// Server-side document generation tools. The backend creates the file and
// returns it in the tool result. We hide the "Always allow" checkbox for them
// (one-off confirmation only) and open the generated file once approved.
const GENERATE_TOOL_NAMES = [
  "docspace_generate_docx",
  "docspace_generate_presentation",
  "docspace_generate_form",
];

// The chat-facing tool name (what the LLM calls, e.g. `docspace_generate_docx`)
// differs from the name the editor's AI plugin expects in `ai_onCallTool`.
// The backend used to bridge this via `generationToolCallState.toolName`
// (server: ASC.AI/Core/Tools/Editor/*.cs). Now that we drive the call from the
// host, we map it here. The model's tool arguments (description / topic /
// slideCount / style) are forwarded as-is; the plugin reads what it needs.
const EDITOR_TOOL_NAME_BY_CHAT_TOOL: Record<string, string> = {
  docspace_generate_docx: "generateDocx",
  docspace_generate_form: "generateForm",
  docspace_generate_presentation: "generatePresentationWithTheme",
};

const AiAgentProviders = ({
  locale,
  theme,
  callbacks,
  isStandalone,
  isAvailable = false,
  getAgentRoomId,
  openResultFile,
  closeEditorPanel,
  entityId,
  contextEntityId,
  hideProfilePicker = false,
  profilePickerActions,
  profilePickerAlias,
  onProfilePickerSelect,
  onThreadContextChange,
  composerHeader,
  composerDisabled,
  children,
}: AiAgentProvidersProps) => {
  const { t } = useTranslation("Common");
  const aiChatLocale = normalizeAiChatLocale(locale);
  const { foldersApi, operationsApi, filesSettingsApi } = useFilesApi();

  // File-attachment integration: the composer "attach" actions, the message
  // "Save as file" handler, and the supporting dialogs/device-upload input.
  // Device uploads are stored as portal files in the chat's entity scope.
  const { composerActions, onSaveAsFile, overlay } = useFilesIntegration({
    entityId,
  });

  // Platform adapter passed downstream. Its `file` adapter is wired to the
  // host's save handler, and it tracks the host locale/theme internally (the
  // adapter identity stays stable, so chat stores aren't rebuilt).
  const platform = usePlatformAdapter({
    locale: aiChatLocale,
    theme,
    onSaveAsFile,
    onOpenFile: openAttachedFile,
  });

  // Tools that occupy the "editor" host group. `open_file` swaps this to the
  // editor's native tool list (addImage, checkSpelling, ...) once the panel
  // is up, and restores it back on close. A DOM CustomEvent drives the swap
  // so handlers (which run outside React) can trigger a re-render.
  const [editorTools, setEditorTools] =
    useState<HostTool[]>(fileManagementTools);

  useEffect(() => {
    const handler = (e: Event) => {
      const { detail } = e as CustomEvent<EditorToolsChangedDetail>;
      setEditorTools(detail.tools);
    };
    window.addEventListener(EDITOR_TOOLS_EVENT, handler);
    return () => window.removeEventListener(EDITOR_TOOLS_EVENT, handler);
  }, []);

  const hostToolGroups = useMemo(
    () => [buildEditorToolGroup(editorTools)],
    [editorTools],
  );

  // After the user approves a generate tool, the lib resolves its result and
  // calls this before closing the dialog / resuming the stream. The result
  // carries the created file (`data.id`) and the second arg carries the
  // tool-call context (`toolName` + `toolArgs`). We open the file in a new tab
  // and re-run the same tool inside the editor with the model's original
  // arguments via postMessage (replacing the old `?withTool=true` URL flag).
  // Dedupe by file id so a re-emitted result doesn't reopen.
  const openedGenerateFilesRef = useRef<Set<number | string>>(new Set());

  const onToolCallApproveResult = useCallback(
    (result: unknown, ctx: ToolCallApproveContext) => {
      // Trace the flow only — never dump tool args or the result payload
      // (they may carry user content).
      console.log(`[ai-agent] onToolCallApproveResult: ${ctx.toolName}`);
      // The tool result arrives as a JSON string (the backend serializes it
      // for the LLM); parse it before reading the created file id, but keep
      // accepting a ready object in case the lib changes the contract.
      type GenerateResult = { id?: unknown; data?: { id?: unknown } } | null;
      let payload: GenerateResult = null;
      if (typeof result === "string") {
        try {
          payload = JSON.parse(result) as GenerateResult;
        } catch {
          payload = null;
        }
      } else {
        payload = result as GenerateResult;
      }
      const rawId = payload?.data?.id ?? payload?.id;
      if (typeof rawId !== "number" && typeof rawId !== "string") {
        console.warn(
          `[ai-agent] onToolCallApproveResult: no file id in the "${ctx.toolName}" result — skip`,
        );
        return;
      }
      if (openedGenerateFilesRef.current.has(rawId)) {
        console.log(
          `[ai-agent] onToolCallApproveResult: file ${rawId} already opened — skip`,
        );
        return;
      }

      openedGenerateFilesRef.current.add(rawId);

      // Map the chat tool name to the name the editor's AI plugin expects.
      // Fall back to the raw name if it's not a known generate tool.
      const editorToolName =
        EDITOR_TOOL_NAME_BY_CHAT_TOOL[ctx.toolName] ?? ctx.toolName;

      console.log(
        `[ai-agent] opening generated file ${rawId} with editor tool "${editorToolName}"`,
      );
      openGeneratedFileWithToolCall(rawId, editorToolName, ctx.toolArgs);
    },
    [],
  );

  const { stores, ctx, serverApiConfig } = useMemo(() => {
    const eventBus = new ChatEventBus();
    const callbacksManager = new CallbacksManager();
    const middlewareRunner = new MiddlewareRunner([]);
    const servers = new Servers(platform, eventBus);

    const appCtx = {
      storage: storageAdapter,
      platform,
      servers,
      eventBus,
      callbacksManager,
      middlewareRunner,
      // Standalone portals don't ship with the ONLYOFFICE AI cloud — skip
      // the auto-register, hide the built-in "onlyoffice" provider type
      // from Add/Edit model dropdowns, and hide the matching row in
      // Web Search settings.
      onlyofficeConfig: isStandalone ? undefined : { baseUrl: getOrigin() },
      hiddenProviders: isStandalone
        ? (["onlyoffice"] as ProviderType[])
        : undefined,
      hiddenWebSearchProviders: isStandalone
        ? (["ONLYOFFICE"] as WebSearchProviderId[])
        : undefined,
    };

    const config = buildServerApiConfig();
    // No `engines` argument → every method call routes over HTTP to the
    // backend mounted at `${origin}${baseUrl}`.
    const api = createServerAPI(config);
    const appStores = createStores({
      keys: storeKeys,
      ctx: appCtx,
      api,
      // Initial scope only — deliberately not a dependency. Scope changes
      // re-scope the live bundle below instead of re-creating it, which
      // would blink the whole chat (and every profiles-gated UI).
      entityId,
    });

    return { stores: appStores, ctx: appCtx, serverApiConfig: config };
  }, [isStandalone, platform]);

  // Live re-scope on entityId changes (room navigation, agent pick): the
  // bundle — and everything not scope-bound (profiles list, servers UI,
  // router page) — stays intact; only what the scope owns is reloaded.
  // Threads re-init themselves through `WidgetConfig.entityId` (the
  // useThread hydration effect), so they are not touched here.
  useEffect(() => {
    if (stores.getEntityId() === entityId) return;
    stores.setEntityId(entityId);

    const profiles = stores.useProfilesStore.getState();
    const threads = stores.useThreadsStore.getState();
    const servers = stores.useServersStore.getState();
    const attachments = stores.useAttachmentsStore.getState();

    // A scope switch right after an explicit picker selection (agent pick
    // sets the aliased profile, plain pick sets the profile itself) must
    // not wipe that selection — the default reset runs AFTER the alias
    // bridge and would drop it. Only agent rooms (hideProfilePicker) reset
    // the session so the room's own assignment wins.
    threads.onSwitchToNewThread({ keepSessionProfile: !hideProfilePicker });
    void profiles.reloadModelAssignment();
    void profiles.reloadExtendedThinking();
    void servers.reload();
    void attachments.clearAttachmentFiles();
    void attachments.clearAttachmentImages();
  }, [entityId, hideProfilePicker, stores]);

  const onDropFiles = useCallback(
    (files: File[]) =>
      uploadFilesToChat(files, {
        entityId,
        foldersApi,
        operationsApi,
        filesSettingsApi,
        useAttachmentsStore: stores.useAttachmentsStore,
        t,
      }),
    [entityId, foldersApi, operationsApi, filesSettingsApi, stores, t],
  );

  const widgetConfig = useMemo<WidgetConfig>(
    () => ({
      composerActions,
      composerHeader,
      composerDisabled,
      entityId,
      contextEntityId,
      // Host-driven model-picker visibility: the lib falls back to hiding
      // whenever entityId is set, but here entityId means "current
      // folder/room scope", not "agent chat" — only agents fix the model.
      hideProfilePicker,
      profilePickerActions,
      onProfilePickerSelect,
      // Hide "Always allow" only for generate tools (matched by full name).
      hideToolAllowAlways: GENERATE_TOOL_NAMES,
      onToolCallApproveResult,
      composerActionSendSize: 32,
      composerPlaceholder: t("AskAnyQuestion"),
      webSearchSaveMode: "button",
      // Route drag-and-drop through the portal-upload + attach flow (same as
      // the "Upload from device" button) instead of the library's in-memory
      // default, so dropped DOCX/PDF/XLSX are supported too.
      onDropFiles,
    }),
    [
      composerActions,
      composerHeader,
      composerDisabled,
      entityId,
      contextEntityId,
      hideProfilePicker,
      profilePickerActions,
      onProfilePickerSelect,
      onToolCallApproveResult,
      onDropFiles,
    ],
  );

  useEffect(() => {
    attachHostToolsRuntime({
      servers: ctx.servers,
      useServersStore: stores.useServersStore,
      eventBus: ctx.eventBus,
    });
  }, [ctx.servers, ctx.eventBus, stores.useServersStore]);

  useEffect(() => {
    if (openResultFile) attachOpenResultFile(openResultFile);
  }, [openResultFile]);

  useEffect(() => {
    if (closeEditorPanel) attachCloseEditorPanel(closeEditorPanel);
  }, [closeEditorPanel]);

  return (
    <AiChatAvailabilityContext.Provider value={isAvailable}>
      <EventsProvider
        callbacksManager={ctx.callbacksManager}
        callbacks={callbacks}
      >
        <PlatformProvider platform={platform}>
          <AiChatI18nIsolator locale={aiChatLocale}>
            <ComponentsProvider overrides={componentOverrides}>
              <WidgetConfigProvider config={widgetConfig}>
                <ApiProvider config={serverApiConfig}>
                  <StoresProvider stores={stores}>
                    <ThemeProvider theme={theme} customThemes={portalThemes}>
                      <ImagesProvider overrides={imageOverrides}>
                        <ToolsProvider
                          hostToolGroups={hostToolGroups}
                          servers={ctx.servers}
                          eventBus={ctx.eventBus}
                        >
                          <StoresHydrator />
                          <ProfilePickerAliasBridge
                            alias={profilePickerAlias}
                          />
                          <ThreadContextBridge
                            onThreadContextChange={onThreadContextChange}
                          />
                          <AiChatStoreProvider>
                            <AiChatStoresBridge />
                            {getAgentRoomId ? null : <AgentRoomIdSync />}
                            {children}
                            {overlay}
                          </AiChatStoreProvider>
                        </ToolsProvider>
                      </ImagesProvider>
                    </ThemeProvider>
                  </StoresProvider>
                </ApiProvider>
              </WidgetConfigProvider>
            </ComponentsProvider>
          </AiChatI18nIsolator>
        </PlatformProvider>
      </EventsProvider>
    </AiChatAvailabilityContext.Provider>
  );
};

export default AiAgentProviders;

export { useIsAiChatAvailable } from "./availability";
export { useApi, useI18n, useStores } from "@onlyoffice/ai-chat";
export { DEFAULT_SERVER_API_ROUTES } from "@onlyoffice/ai-chat";
export type {
  ComposerAction,
  Profile,
  ProfilePickerAction,
  ServerAPIConfig,
} from "@onlyoffice/ai-chat";
export type { SaveAsFileHandler } from "./platform";

export {
  AiChatStore,
  AiChatStoreProvider,
  useAiChatStore,
} from "./ai-chat-store";
export type { AiChatRouterPage } from "./ai-chat-store";
