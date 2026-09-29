import React from "react";
import type { Decorator } from "@storybook/react-vite";

import { DEFAULT_API_KEY, DEFAULT_API_URL } from "../../.storybook/globals";
import { resolveApiConfig } from "../../.storybook/utils/apiProviders";
import {
  PortalGateCard,
  usePortalConnection,
} from "../../.storybook/decorators/PortalGate";

import AiAgentProviders, { type AiServerApi } from "../providers";

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
// One difference, on purpose. Billing has nothing to show without a portal;
// the chat does -- `.storybook/ai-chat-mock.ts` answers `/api/2.0/ai` on the
// dev server. So with no portal configured the chat mounts with no
// `serverApi` and talks to its own origin.
//
// Only on the dev server, though. The mock is a Vite plugin with
// `apply: "serve"`, so a static build -- the published Storybook,
// `pnpm storybook-serve` -- has nothing answering that origin, and every init
// call would 404. There the story shows the no-portal card instead.
const HAS_AI_MOCK = import.meta.env.DEV;
const AiSetupGate = ({
  apiConfig,
  storyId,
  args,
  providerProps,
  children,
}: {
  apiConfig: string;
  storyId: string;
  args: AiSetupArgs;
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
  const serverApi = React.useMemo<AiServerApi | undefined>(
    () =>
      hasPortal
        ? {
            origin: url.replace(/\/+$/, ""),
            headers: { Authorization: `Bearer ${apiKey}` },
          }
        : undefined,
    [hasPortal, url, apiKey],
  );

  if (!hasPortal && !HAS_AI_MOCK) {
    return (
      <PortalGateCard
        title="AI Chat"
        state="none"
        description="The chat talks to the portal selected in the API Config. Its local mock runs only under pnpm storybook, not in a static build."
      />
    );
  }

  if (connection !== "connected") {
    return (
      <PortalGateCard
        title="AI Chat"
        state={connection}
        description="The chat talks to the portal selected in the API Config. Pick Default with an empty .env to use the local mock instead."
      />
    );
  }

  const { locale, canUseAi, isAvailable } = args;

  return (
    <AiAgentProviders
      {...providerProps}
      // AiAgentProviders hydrates its stores on mount, so a changed arg, a
      // different portal or another story has to remount the tree rather
      // than be re-rendered into it.
      key={`${apiConfig}-${storyId}-${locale}-${canUseAi}-${isAvailable}`}
      locale={locale}
      canUseAi={canUseAi}
      isAvailable={isAvailable}
      serverApi={serverApi}
    >
      {children}
    </AiAgentProviders>
  );
};

export const withAiSetup: Decorator = (Story, context) => {
  const apiConfig: string = context.globals.apiConfig || "default";

  return (
    <AiSetupGate
      apiConfig={apiConfig}
      storyId={context.id}
      args={context.args as AiSetupArgs}
      providerProps={context.parameters.aiChat as AiChatStoryProviderProps}
    >
      <Story />
    </AiSetupGate>
  );
};
