import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import ApiProvider, { useApi } from "./ApiProvider";

const meta: Meta<typeof ApiProvider> = {
  title: "Providers/ApiProvider",
  component: ApiProvider,
  parameters: {
    docs: {
      description: {
        component: `ApiProvider creates a React context that provides API client instances to child components.

### Features

- Provides \`profilesApi\` and \`commonSettingsApi\` via context
- Memoizes API instances to prevent unnecessary re-creation
- \`useApi()\` hook for consuming the context

### Usage

\`\`\`tsx
import { ApiProvider, useApi } from "@docspace/ui-kit/providers/api";

<ApiProvider url="https://your-docspace.com" apiKey="your-api-key">
  <App />
</ApiProvider>
\`\`\``,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ApiProvider>;

const ApiConsumer = () => {
  const { profilesApi, commonSettingsApi } = useApi();

  return (
    <div style={{ padding: "16px" }}>
      <h3>API Context Available</h3>
      <p>profilesApi: {profilesApi ? "Connected" : "Not available"}</p>
      <p>
        commonSettingsApi: {commonSettingsApi ? "Connected" : "Not available"}
      </p>
    </div>
  );
};

export const Default: Story = {
  args: {
    url: "https://example.com",
    apiKey: "demo-api-key",
    children: (
      <div style={{ padding: "16px" }}>
        <p>Children are rendered inside the ApiProvider.</p>
      </div>
    ),
  },
};

export const WithHookConsumer: Story = {
  args: {
    url: "https://example.com",
    apiKey: "demo-api-key",
    children: <ApiConsumer />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates using the `useApi()` hook inside a child component to access the API context.",
      },
    },
  },
};
