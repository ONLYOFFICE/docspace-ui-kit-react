import React from "react";
import type { Decorator } from "@storybook/react-vite";

import ApiProvider from "../../providers/api/ApiProvider";
import { DEFAULT_API_URL, DEFAULT_API_KEY } from "../globals";
import { getProviderById } from "../utils/apiProviders";

const withApiProvider: Decorator = (Story, context) => {
  const apiConfig = context.globals.apiConfig || "default";

  let apiUrl = DEFAULT_API_URL;
  let apiKey = DEFAULT_API_KEY;

  if (apiConfig !== "default" && apiConfig !== "add-custom") {
    const provider = getProviderById(apiConfig);
    if (provider) {
      apiUrl = provider.url;
      apiKey = provider.apiKey;
    }
  }

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
