import React from "react";
import type { Decorator } from "@storybook/react-vite";

import ApiProvider from "../../providers/api/ApiProvider";
import { DEFAULT_API_URL, DEFAULT_API_KEY } from "../globals";
import { resolveApiConfig } from "../utils/apiProviders";

const withApiProvider: Decorator = (Story, context) => {
  const apiConfig = context.globals.apiConfig || "default";

  const { url: apiUrl, apiKey } = resolveApiConfig(apiConfig, {
    url: DEFAULT_API_URL,
    apiKey: DEFAULT_API_KEY,
  });

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
