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
  Suggestion,
  ToolCallApproveContext,
  WebSearchProviderId,
} from "@onlyoffice/ai-chat";

import "@onlyoffice/ai-chat/styles";

// Re-exported so the host can type the `suggestions` array it builds and
// passes in (the section→chips logic lives in the host, not here).
export type { Suggestion } from "@onlyoffice/ai-chat";

import { toastr } from "../../components/toast";

import { AiChatAvailabilityContext } from "./availability";
import { ChatIntro } from "../chat-intro";
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
import { useFilesIntegration, type AttachedFileInfo } from "./files";
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
  /**
   * Whether the current session may use the AI API at all. `false` for
   * anonymous sessions (login redirect, public rooms, public preview) and
   * for users the server bars from AI (guests). The providers still mount
   * — descendants may call `useStores()` — but store hydration is skipped
   * and the availability context is forced off, so no /api/2.0/ai requests
   * fire and no chat UI is offered.
   */
  canUseAi?: boolean;
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
   * Pass `true` to hide the picker entirely (highest priority — it also
   * suppresses the read-only label). To keep the fixed model visible instead
   * of hidden — e.g. inside AI agent rooms — leave this `false` and use
   * {@link profilePickerReadOnly} / {@link isAgentRoom}.
   */
  hideProfilePicker?: boolean;
  /**
   * Renders the composer model picker as a read-only label — the current
   * profile's name as plain static text (secondary color, truncated, no
   * dropdown) instead of an interactive combo. Forwarded to
   * `WidgetConfig.profilePickerReadOnly`; it overrides the `entityId`
   * default-hide heuristic (the label is shown even in entity chats) but
   * NOT an explicit `hideProfilePicker` `true`, which still hides
   * everything. Use where the host fixes the profile but still wants to
   * surface which model answers — e.g. an AI agent room viewer who lacks
   * the right to change the assignment.
   */
  profilePickerReadOnly?: boolean;
  /**
   * Marks the current scope as an AI agent room, whose assigned profile
   * must win over a session pick carried in from another scope. On a scope
   * switch into such a room the session chat profile is reset so the room's
   * model assignment drives the chat (and the read-only label). Kept
   * separate from `hideProfilePicker`/`profilePickerReadOnly` because an
   * *editable* agent room shows the picker yet still needs this reset.
   */
  isAgentRoom?: boolean;
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
  /**
   * Welcome-screen suggestion chips. The host builds the lists for the current
   * section (room / folder context) and passes them in ready-made; which list
   * is shown depends on what the composer currently holds — see
   * {@link SuggestionSet}. A bare array is treated as `{ default: [...] }`.
   */
  suggestions?: Suggestion[] | SuggestionSet;
  children: ReactNode;
};

/**
 * Suggestion chips per composer state. The host owns the texts; picking
 * between them belongs here, because only the provider sees the attachments
 * store — files can also arrive by drag-and-drop and be removed chip by chip,
 * neither of which the host observes.
 *
 * Precedence: an analyzable form wins over the plain file lists, and those win
 * over the section default. Files and images both count — an attached image
 * is what the user is asking about just as much as a document.
 */
export type SuggestionSet = {
  /** Nothing attached: chips for the current section (room / folder). */
  default: Suggestion[];
  /** Exactly one file or image attached. */
  singleFile?: Suggestion[];
  /** Two or more files/images attached. */
  multipleFiles?: Suggestion[];
  /** At least one attached file the backend flagged as analyzable. */
  analyzableForm?: Suggestion[];
};

const resolveSuggestions = (
  suggestions: Suggestion[] | SuggestionSet | undefined,
  attachedFileIds: string[],
  analyzableIds: string[],
): Suggestion[] | undefined => {
  if (!suggestions || Array.isArray(suggestions)) return suggestions;

  if (attachedFileIds.some((id) => analyzableIds.includes(id))) {
    return suggestions.analyzableForm ?? suggestions.default;
  }
  if (attachedFileIds.length > 1) {
    return suggestions.multipleFiles ?? suggestions.default;
  }
  if (attachedFileIds.length === 1) {
    return suggestions.singleFile ?? suggestions.default;
  }
  return suggestions.default;
};

// Server-mode API config: backend is mounted at the same origin as the
// client under /api/2.0/ai. Engines are intentionally not constructed
// — every method call goes over HTTP via createServerAPI / ApiProvider.
const SERVER_API_BASE_URL = "/api/2.0/ai";

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
// `enabled: false` (anonymous session) keeps the stores empty instead of
// firing fetches that would all come back 401.
const StoresHydrator = ({ enabled }: { enabled: boolean }) => {
  useProfiles({ isReady: enabled });
  useThread({ isReady: enabled });
  useServers({ isReady: enabled });
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

/**
 * Reports a failure from one of the scope-switch reloads below. Those are
 * deliberately not awaited (navigation must not wait on them), so their
 * rejections have nowhere else to go: the step name is logged for support,
 * and the user is told that the chat is showing stale data for this room —
 * on screen it still holds the previous scope's model assignment and tools.
 *
 * Not a hook, so the string comes from `getCommonTranslation` (reads
 * `window.i18n`) rather than `useCommonTranslation`.
 */
const logRescopeFailure = (step: string, reload: Promise<unknown>): void => {
  void reload.catch((error: unknown) => {
    console.error(`[ai-agent] scope switch: ${step} failed`, error);
    toastr.error(error as Error);
  });
};

// Illustration + tagline above the suggestion chips of an empty chat. Static
// (it reads its own string through window.i18n), so one element is created
// once and reused instead of being rebuilt per render.
const chatIntro = <ChatIntro />;

const AiAgentProviders = ({
  locale,
  theme,
  callbacks,
  isStandalone,
  isAvailable = false,
  canUseAi = true,
  getAgentRoomId,
  openResultFile,
  closeEditorPanel,
  entityId,
  contextEntityId,
  hideProfilePicker = false,
  profilePickerReadOnly,
  isAgentRoom = false,
  profilePickerActions,
  profilePickerAlias,
  onProfilePickerSelect,
  onThreadContextChange,
  composerHeader,
  composerDisabled,
  suggestions,
  children,
}: AiAgentProvidersProps) => {
  const { t } = useTranslation("Common");
  const aiChatLocale = normalizeAiChatLocale(locale);
  const { foldersApi, operationsApi, filesSettingsApi } = useFilesApi();

  // Ids of attached files the backend flagged as analyzable. The attachments
  // store keeps only `{id, title, kind, path, type}` per ref, so `canAnalyze`
  // exists in the attach response alone and is remembered here. Ids of removed
  // attachments are harmless — the lookup always intersects with the current
  // refs.
  const [analyzableIds, setAnalyzableIds] = useState<string[]>([]);

  const onFilesAttached = useCallback((attached: AttachedFileInfo[]) => {
    const ids = attached.filter((f) => f.canAnalyze).map((f) => f.id);
    if (ids.length === 0) return;
    setAnalyzableIds((prev) => [...prev, ...ids]);
  }, []);

  // File-attachment integration: the composer "attach" actions, the message
  // "Save as file" handler, and the supporting dialogs/device-upload input.
  // Device uploads are stored as portal files in the chat's entity scope.
  const { composerActions, onSaveAsFile, overlay } = useFilesIntegration({
    entityId,
    onFilesAttached,
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

  // Whether the PREVIOUS scope was an agent room — needed to tell a real
  // thread-scope change from plain folder navigation (see the effect below).
  // Updated only by that effect, so between entityId changes it holds the
  // agent-ness of the scope the chat currently shows.
  const wasAgentRoomRef = useRef(isAgentRoom);

  // Live re-scope on entityId changes (room navigation, agent pick): the
  // bundle — and everything not scope-bound (profiles list, servers UI,
  // router page) — stays intact; only what the scope owns is reloaded.
  // Threads re-init themselves through `WidgetConfig.entityId` (the
  // useThread hydration effect), so they are not touched here.
  useEffect(() => {
    if (stores.getEntityId() === entityId) {
      // Same scope, but the host may have (re)resolved its agent-ness after
      // the id (folder data loads progressively) — keep the ref in sync so
      // the NEXT navigation compares against the correct previous state.
      wasAgentRoomRef.current = isAgentRoom;
      return;
    }
    stores.setEntityId(entityId);

    const wasAgentRoom = wasAgentRoomRef.current;
    wasAgentRoomRef.current = isAgentRoom;

    const profiles = stores.useProfilesStore.getState();
    const threads = stores.useThreadsStore.getState();
    const servers = stores.useServersStore.getState();
    const attachments = stores.useAttachmentsStore.getState();

    // Thread storage knows only two scopes — an agent room or the global
    // area (the backend folds every non-agent entityId to global). So plain
    // navigation between folders/rooms never changes which threads the chat
    // shows, and the open conversation (including a streaming session in the
    // side panel) must survive it: keep the thread and the composer
    // attachments, only the send scope (`setEntityId` above) follows the
    // location. Crossing an agent-room boundary in either direction — or
    // between two agent rooms — is a real scope change and resets as before.
    // `hideProfilePicker` hosts predate `isAgentRoom` and treat every
    // entityId as an agent scope, so they keep the reset unconditionally.
    const threadScopeChanged = wasAgentRoom || isAgentRoom || hideProfilePicker;

    if (threadScopeChanged) {
      // A scope switch right after an explicit picker selection (agent pick
      // sets the aliased profile, plain pick sets the profile itself) must
      // not wipe that selection — the default reset runs AFTER the alias
      // bridge and would drop it. Reset the session so the room's own
      // assignment wins whenever the host fixes the model for the scope:
      // either an agent room (`isAgentRoom` — its picker may still be shown as
      // a read-only label or an editable combo) or a fully hidden picker
      // (`hideProfilePicker`, kept as a fallback so callers that hide the
      // picker keep the pre-`isAgentRoom` reset behavior).
      threads.onSwitchToNewThread({
        keepSessionProfile: !(isAgentRoom || hideProfilePicker),
      });
    }
    // Sessions barred from AI (anonymous public room / public preview,
    // guests) must not fire the reloads below: every request would answer
    // 401 (hydration is off for them too — see `StoresHydrator enabled`).
    // The local scope sync above still runs so the stores are consistent
    // if the ability ever flips on.
    if (!canUseAi) return;

    // Fire-and-forget by design — navigation must not wait on these. Each
    // one is a store action that rejects on a failed read, so they get an
    // explicit handler: an unhandled rejection on every failed room switch
    // is noise nobody can act on, and the previous scope's data staying on
    // screen is a milder failure than the chat refusing to open.
    logRescopeFailure(
      "profiles:modelAssignment",
      profiles.reloadModelAssignment(),
    );
    logRescopeFailure(
      "profiles:extendedThinking",
      profiles.reloadExtendedThinking(),
    );
    logRescopeFailure("servers:reload", servers.reload());
    if (threadScopeChanged) {
      logRescopeFailure(
        "attachments:clearFiles",
        attachments.clearAttachmentFiles(),
      );
      logRescopeFailure(
        "attachments:clearImages",
        attachments.clearAttachmentImages(),
      );
    }
  }, [entityId, isAgentRoom, hideProfilePicker, stores, canUseAi]);

  const onDropFiles = useCallback(
    (files: File[]) =>
      uploadFilesToChat(files, {
        entityId,
        foldersApi,
        operationsApi,
        filesSettingsApi,
        useAttachmentsStore: stores.useAttachmentsStore,
        onFilesAttached,
        t,
      }),
    [
      entityId,
      foldersApi,
      operationsApi,
      filesSettingsApi,
      stores,
      onFilesAttached,
      t,
    ],
  );

  // Which chips to show depends on what the composer holds right now, so the
  // attachment refs are read straight from the store the widget writes to —
  // that covers drag-and-drop and chip removal, not just the attach dialog.
  // Images live in their own bucket (attachFilesToChat re-keys them), so
  // both lists are counted.
  const attachedFileIds = stores.useAttachmentsStore((s) =>
    [...s.attachmentFiles, ...s.attachmentImages].map((f) => f.id).join(","),
  );

  const resolvedSuggestions = useMemo(
    () =>
      resolveSuggestions(
        suggestions,
        attachedFileIds === "" ? [] : attachedFileIds.split(","),
        analyzableIds,
      ),
    [suggestions, attachedFileIds, analyzableIds],
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
      // Read-only label instead of an interactive picker (overrides the
      // entityId hide-heuristic, deferring to an explicit hideProfilePicker).
      profilePickerReadOnly,
      profilePickerActions,
      onProfilePickerSelect,
      // Hide "Always allow" only for generate tools (matched by full name).
      hideToolAllowAlways: GENERATE_TOOL_NAMES,
      onToolCallApproveResult,
      composerActionSendSize: 32,
      composerPlaceholder: t("AskAnyQuestion"),
      webSearchSaveMode: "button",
      welcomeDescription: t("Common:WelcomeAiChatDescription"),
      // Context-specific chips: the host builds the lists for the current
      // section, and the set is narrowed above by what is attached.
      suggestions: resolvedSuggestions,
      // Rendered by the library above the chips, under the same "empty chat"
      // gate — no chips, no intro.
      suggestionsHeader: chatIntro,

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
      profilePickerReadOnly,
      profilePickerActions,
      onProfilePickerSelect,
      onToolCallApproveResult,
      onDropFiles,
      resolvedSuggestions,
      t,
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
    <AiChatAvailabilityContext.Provider value={isAvailable && canUseAi}>
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
                          <StoresHydrator enabled={canUseAi} />
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
