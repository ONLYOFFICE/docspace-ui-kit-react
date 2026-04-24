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

import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  EventsProvider,
  SettingsProvider,
  PlatformProvider,
  I18nProvider,
  ComponentsProvider,
  StoresProvider,
  ThemeProvider,
  ImagesProvider,
  ToolsProvider,
  StorageProvider,
  CallbacksManager,
  ChatEventBus,
  MiddlewareRunner,
  Servers,
  Provider,
  createStores,
  useProfiles,
  useServers,
  useThread,
} from "@onlyoffice/ai-chat";
import type {
  ChatCallbacks,
  ProviderType,
  WebSearchProviderId,
} from "@onlyoffice/ai-chat";

import "@onlyoffice/ai-chat/styles";

import { settingsAdapter } from "./settings";
import { storageAdapter } from "./storage";
import { platformAdapter, notifyEnvironmentChange } from "./platform";
import { storeKeys } from "./stores";
import { normalizeAiChatLocale } from "./locale";
import { portalThemes } from "./themes";
import {
  EDITOR_TOOLS_EVENT,
  attachHostToolsRuntime,
  buildEditorToolGroup,
  fileManagementTools,
  type EditorToolsChangedDetail,
} from "./host-tool-groups";
import type { HostTool } from "@onlyoffice/ai-chat";

type AiAgentProvidersProps = {
  locale: string;
  theme?: string;
  callbacks?: ChatCallbacks;
  isStandalone?: boolean;
  children: ReactNode;
};

// Hydrates Zustand stores (profiles, threads, prompts, servers/tools) from
// the storage adapter on mount. Lives inside StoresProvider + ToolsProvider
// so it can read the stores/servers context. Without this, persisted data
// (like AI profiles) would only appear after the first in-session write.
const StoresHydrator = () => {
  useProfiles({ isReady: true });
  useThread({ isReady: true });
  useServers({ isReady: true });
  return null;
};

const AiAgentProviders = ({
  locale,
  theme,
  callbacks,
  isStandalone,
  children,
}: AiAgentProvidersProps) => {
  const aiChatLocale = normalizeAiChatLocale(locale);

  useEffect(() => {
    notifyEnvironmentChange({ lang: aiChatLocale });
  }, [aiChatLocale]);

  useEffect(() => {
    if (theme) notifyEnvironmentChange({ theme });
  }, [theme]);

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

  const { stores, ctx } = useMemo(() => {
    const provider = new Provider();
    provider.setSettings(settingsAdapter);

    const eventBus = new ChatEventBus();
    const callbacksManager = new CallbacksManager();
    const middlewareRunner = new MiddlewareRunner([]);
    const servers = new Servers(settingsAdapter, platformAdapter, eventBus);

    const appCtx = {
      settings: settingsAdapter,
      storage: storageAdapter,
      platform: platformAdapter,
      provider,
      servers,
      eventBus,
      callbacksManager,
      middlewareRunner,
      // Standalone portals don't ship with the ONLYOFFICE AI cloud — skip
      // the auto-register, hide the built-in "onlyoffice" provider type
      // from Add/Edit model dropdowns, and hide the matching row in
      // Web Search settings.
      onlyofficeConfig: isStandalone
        ? undefined
        : { baseUrl: window.location.origin },
      hiddenProviders: isStandalone
        ? (["onlyoffice"] as ProviderType[])
        : undefined,
      hiddenWebSearchProviders: isStandalone
        ? (["ONLYOFFICE"] as WebSearchProviderId[])
        : undefined,
    };

    const appStores = createStores({ keys: storeKeys, ctx: appCtx });

    return { stores: appStores, ctx: appCtx };
  }, [isStandalone]);

  useEffect(() => {
    attachHostToolsRuntime({
      servers: ctx.servers,
      useServersStore: stores.useServersStore,
      provider: ctx.provider,
      eventBus: ctx.eventBus,
    });
  }, [ctx.servers, ctx.provider, ctx.eventBus, stores.useServersStore]);

  return (
    <EventsProvider
      callbacksManager={ctx.callbacksManager}
      callbacks={callbacks}
    >
      <SettingsProvider settings={settingsAdapter}>
        <PlatformProvider platform={platformAdapter}>
          <I18nProvider locale={aiChatLocale}>
            <ComponentsProvider>
              <StoresProvider stores={stores}>
                <ThemeProvider theme={theme} customThemes={portalThemes}>
                  <ImagesProvider>
                    <ToolsProvider
                      hostToolGroups={hostToolGroups}
                      servers={ctx.servers}
                      eventBus={ctx.eventBus}
                    >
                      <StorageProvider storage={storageAdapter}>
                        <StoresHydrator />
                        {children}
                      </StorageProvider>
                    </ToolsProvider>
                  </ImagesProvider>
                </ThemeProvider>
              </StoresProvider>
            </ComponentsProvider>
          </I18nProvider>
        </PlatformProvider>
      </SettingsProvider>
    </EventsProvider>
  );
};

export default AiAgentProviders;

export { useStores } from "@onlyoffice/ai-chat";

