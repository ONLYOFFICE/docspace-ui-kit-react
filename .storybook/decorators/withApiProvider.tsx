import React from "react";
import type { Decorator } from "@storybook/react-vite";

import ApiProvider from "../../providers/api/ApiProvider";
import { DEFAULT_API_URL, DEFAULT_API_KEY } from "../globals";
import { resolveApiConfig } from "../utils/apiProviders";
import { DEMO_API_KEY, DEMO_PORTAL_URL } from "../mocks/demoPortal";

const withApiProvider: Decorator = (Story, context) => {
  const apiConfig = context.globals.apiConfig || "default";

  const resolved = resolveApiConfig(apiConfig, {
    url: DEFAULT_API_URL,
    apiKey: DEFAULT_API_KEY,
  });
  // No portal selected: the demo portal, which the mock service worker
  // plays. Every story that calls `useApi()` then renders made-up data
  // instead of sending its calls to Storybook's own origin for a 404.
  const isDemo = !(resolved.url && resolved.apiKey);
  const apiUrl = isDemo ? DEMO_PORTAL_URL : resolved.url;
  const apiKey = isDemo ? DEMO_API_KEY : resolved.apiKey;

  return (
    <ApiProvider
      key={apiConfig}
      url={apiUrl}
      apiKey={apiKey}
      initSocket={false}
      useBearerForRawClient
    >
      <Story key={apiConfig} />
    </ApiProvider>
  );
};

export default withApiProvider;
