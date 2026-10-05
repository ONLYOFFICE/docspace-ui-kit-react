import React from "react";
import type { Decorator } from "@storybook/react-vite";
import { useDarkMode } from "@vueless/storybook-dark-mode";

import { DEFAULT_API_KEY, DEFAULT_API_URL } from "../../.storybook/globals";
import { resolveApiConfig } from "../../.storybook/utils/apiProviders";
import {
  DemoPortal,
  PortalGateCard,
  usePortalConnection,
} from "../../.storybook/decorators/PortalGate";
import {
  DEMO_API_KEY,
  DEMO_PORTAL_URL,
} from "../../.storybook/mocks/demoPortal";

import AiAgentProviders, { type AiServerApi } from "../providers";
import {
  PORTAL_BASE_THEME_ID,
  PORTAL_DARK_THEME_ID,
} from "../providers/themes";

type AiSetupArgs = {
  locale: string;
  canUseAi: boolean;
  isAvailable: boolean;
};

type ProvidersProps = React.ComponentProps<typeof AiAgentProviders>;

/**
 * What a story adds to `AiAgentProviders` on top of the three args: the
 * scenario props -- suggestion chips, the model picker's modes, a disabled
 * composer. Set as `parameters.aiChat`, since several are elements or arrays
 * that make poor controls.
 */
export type AiChatStoryProviderProps = Omit<
  ProvidersProps,
  "children" | "locale" | "canUseAi" | "isAvailable" | "serverApi"
>;

// Same shape as billing's `withPaymentsSetup`: the portal comes from the
// `apiConfig` toolbar global, the same one `withApiProvider` hands every
// other module, and the story waits for `getSelfProfile()` before mounting.
//
// With no portal selected the chat talks to the demo portal instead, which
// the mock service worker plays (`.storybook/mocks/handlers/ai.ts`), under
// the same "Demo data" banner `PortalGate` puts above every other module.
// The worker runs in the static build too, so the published Storybook shows
// a working chat rather than a card.
const AiSetupGate = ({
  title,
  apiConfig,
  storyId,
  args,
  theme,
  providerProps,
  children,
}: {
  // What the gate card names while no portal is connected: the story's own
  // sidebar entry, so the settings stories do not read "AI Chat".
  title: string;
  apiConfig: string;
  storyId: string;
  args: AiSetupArgs;
  // The chat library's theme id, following the Storybook theme toggle.
  theme: string;
  providerProps?: AiChatStoryProviderProps;
  children: React.ReactNode;
}) => {
  const { url, apiKey } = resolveApiConfig(apiConfig, {
    url: DEFAULT_API_URL,
    apiKey: DEFAULT_API_KEY,
  });
  const hasPortal = Boolean(url && apiKey);

  const connection = usePortalConnection(hasPortal);

  // `useMemo` only to keep the identity stable across renders;
  // AiAgentProviders compares the fields, not the object.
  const serverApi = React.useMemo<AiServerApi>(
    () =>
      hasPortal
        ? {
            origin: url.replace(/\/+$/, ""),
            headers: { Authorization: `Bearer ${apiKey}` },
          }
        : {
            origin: DEMO_PORTAL_URL,
            headers: { Authorization: `Bearer ${DEMO_API_KEY}` },
          },
    [hasPortal, url, apiKey],
  );

  if (connection !== "connected") {
    return (
      <PortalGateCard
        title={title}
        state={connection}
        description={`${title} talks to the portal selected in the API Config. Pick Default with an empty .env to use the demo portal instead.`}
      />
    );
  }

  const { locale, canUseAi, isAvailable } = args;

  const chat = (
    <AiAgentProviders
      {...providerProps}
      // AiAgentProviders hydrates its stores on mount, so a changed arg, a
      // different portal or another story has to remount the tree rather
      // than be re-rendered into it.
      key={`${apiConfig}-${storyId}-${locale}-${canUseAi}-${isAvailable}`}
      locale={locale}
      theme={providerProps?.theme ?? theme}
      canUseAi={canUseAi}
      isAvailable={isAvailable}
      serverApi={serverApi}
    >
      {children}
    </AiAgentProviders>
  );

  if (hasPortal) return chat;

  // `DemoPortal` also points `useApi()` at the demo portal, for the parts of
  // the chat that reach the portal's own API rather than its AI service.
  return <DemoPortal storyId={storyId}>{chat}</DemoPortal>;
};

export const withAiSetup: Decorator = (Story, context) => {
  const apiConfig: string = context.globals.apiConfig || "default";
  // The host passes the theme, as the DocSpace client does from `isBase`.
  // Left out, the chat library falls back to the OS colour scheme, so a dark
  // OS drew a dark chat inside a light Storybook.
  const isDark = useDarkMode();

  return (
    <AiSetupGate
      title={context.title.split("/").pop() ?? context.title}
      apiConfig={apiConfig}
      storyId={context.id}
      args={context.args as AiSetupArgs}
      theme={isDark ? PORTAL_DARK_THEME_ID : PORTAL_BASE_THEME_ID}
      providerProps={context.parameters.aiChat as AiChatStoryProviderProps}
    >
      <Story />
    </AiSetupGate>
  );
};
