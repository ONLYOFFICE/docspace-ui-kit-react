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
  useThread,
} from "@onlyoffice/ai-chat";
import type {
  ChatCallbacks,
  ComposerAction,
  HostTool,
  ProviderType,
  ServerAPIConfig,
  ToolCallApproveContext,
  WebSearchProviderId,
} from "@onlyoffice/ai-chat";

import "@onlyoffice/ai-chat/styles";

import { storageAdapter } from "./storage";
import { usePlatformAdapter, type SaveAsFileHandler } from "./platform";
import { componentOverrides } from "./components-overrides";
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
  getAgentRoomId?: () => number | null;
  openResultFile?: (fileId: number | string) => void;
  closeEditorPanel?: () => void;
  composerActions?: ComposerAction[];
  entityId?: string;
  // Handles the message "Save" action: shows a folder selector and saves the
  // message (markdown `content`, `defaultName` like "<title>.docx") as a file.
  // Wired into platform.file.saveAsFile.
  onSaveAsFile?: SaveAsFileHandler;
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
  getAgentRoomId,
  openResultFile,
  closeEditorPanel,
  composerActions,
  entityId,
  onSaveAsFile,
  children,
}: AiAgentProvidersProps) => {
  const aiChatLocale = normalizeAiChatLocale(locale);

  // Platform adapter passed downstream. Its `file` adapter is wired to the
  // host's save handler, and it tracks the host locale/theme internally (the
  // adapter identity stays stable, so chat stores aren't rebuilt).
  const platform = usePlatformAdapter({
    locale: aiChatLocale,
    theme,
    onSaveAsFile,
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
      const payload = result as {
        id?: unknown;
        data?: { id?: unknown };
      } | null;
      const rawId = payload?.data?.id ?? payload?.id;
      if (typeof rawId !== "number" && typeof rawId !== "string") return;
      if (openedGenerateFilesRef.current.has(rawId)) return;

      openedGenerateFilesRef.current.add(rawId);

      // Map the chat tool name to the name the editor's AI plugin expects.
      // Fall back to the raw name if it's not a known generate tool.
      const editorToolName =
        EDITOR_TOOL_NAME_BY_CHAT_TOOL[ctx.toolName] ?? ctx.toolName;

      openGeneratedFileWithToolCall(rawId, editorToolName, ctx.toolArgs);
    },
    [],
  );

  const widgetConfig = useMemo(
    () => ({
      composerActions,
      entityId,
      // Hide "Always allow" only for generate tools (matched by full name).
      hideToolAllowAlways: GENERATE_TOOL_NAMES,
      onToolCallApproveResult,
    }),
    [composerActions, entityId, onToolCallApproveResult],
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
      entityId,
    });

    return { stores: appStores, ctx: appCtx, serverApiConfig: config };
  }, [isStandalone, entityId, platform]);

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
                    <ImagesProvider>
                      <ToolsProvider
                        hostToolGroups={hostToolGroups}
                        servers={ctx.servers}
                        eventBus={ctx.eventBus}
                      >
                        <StoresHydrator />
                        <AiChatStoreProvider>
                          <AiChatStoresBridge />
                          {getAgentRoomId ? null : <AgentRoomIdSync />}
                          {children}
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
  );
};

export default AiAgentProviders;

export { useApi, useI18n, useStores } from "@onlyoffice/ai-chat";
export { DEFAULT_SERVER_API_ROUTES } from "@onlyoffice/ai-chat";
export type {
  ComposerAction,
  Profile,
  ServerAPIConfig,
} from "@onlyoffice/ai-chat";
export type { SaveAsFileHandler } from "./platform";

export {
  AiChatStore,
  AiChatStoreProvider,
  useAiChatStore,
} from "./ai-chat-store";
export type { AiChatRouterPage } from "./ai-chat-store";
