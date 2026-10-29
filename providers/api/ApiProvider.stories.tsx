import React, { type ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import type { EmployeeFullDto } from "@onlyoffice/docspace-api-sdk";

import { Avatar, AvatarRole, AvatarSize } from "../../components/avatar";
import { Text } from "../../components/text";
import {
  DEMO_API_KEY,
  DEMO_PORTAL_URL,
} from "../../.storybook/mocks/demoPortal";

import ApiProvider, { useApi } from "./ApiProvider";

const meta = {
  title: "Components/Providers/ApiProvider",
  tags: ["!autodocs"],
  component: ApiProvider,
  parameters: {
    docs: {
      description: {
        component: `Provides API client context to all child components using the ONLYOFFICE Apps API SDK.

### Features

- **API Client Instances**: Creates and manages multiple API clients (Profiles, Settings, Folders, Rooms, Files, Groups, Search)
- **Bearer Token Auth**: Configures axios instances with Bearer token authentication
- **React Context**: Exposes API clients via \`useApi()\` hook
- **Memoized Initialization**: API clients are memoized based on URL and API key changes
- **Generic Request Helper**: Includes a reusable \`apiClient.request()\` method for custom API calls

### Usage

\`\`\`tsx
import { ApiProvider, useApi } from "@onlyoffice/apps-ui-kit/providers/api";

// Wrap your app with ApiProvider
<ApiProvider url="https://docspace.example.com" apiKey="your-api-key">
  <App />
</ApiProvider>

// Access API clients in child components
const MyComponent = () => {
  const { profilesApi, foldersApi } = useApi();
  // Use API clients...
};
\`\`\``,
      },
    },
  },
  argTypes: {
    url: {
      control: "text",
      description: "Base URL of the ONLYOFFICE Apps API server",
    },
    apiKey: {
      control: "text",
      description: "API key used for Bearer token authentication",
    },
    initSocket: {
      control: "boolean",
      description:
        "Fetches the portal settings and connects the portal WebSocket on mount",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    children: {
      control: false,
      description:
        "Child components that can access API clients via useApi() hook",
    },
  },
} satisfies Meta<typeof ApiProvider>;

type Story = StoryObj<ComponentProps<typeof ApiProvider>>;

export default meta;

type SelfState =
  | { status: "loading" }
  | { status: "done"; profile?: EmployeeFullDto }
  | { status: "failed"; message: string };

const SignedInAs = () => {
  const { profilesApi, baseUrl } = useApi();
  const [state, setState] = React.useState<SelfState>({ status: "loading" });

  React.useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    profilesApi
      .getSelfProfile()
      .then(({ data }) => {
        if (!cancelled) setState({ status: "done", profile: data.response });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "failed",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [profilesApi]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
      }}
    >
      <Text fontSize="12px">
        <code>useApi().profilesApi.getSelfProfile()</code> on {baseUrl}
      </Text>

      {state.status === "loading" ? (
        <Text fontSize="13px">Asking the portal who the key belongs to...</Text>
      ) : null}

      {state.status === "failed" ? (
        <Text fontSize="13px">The portal did not answer: {state.message}</Text>
      ) : null}

      {state.status === "done" ? (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={AvatarSize.base}
            role={AvatarRole.none}
            userName={state.profile?.displayName ?? ""}
            source=""
            noClick
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text fontSize="14px" fontWeight={600}>
              {state.profile?.displayName}
            </Text>
            <Text fontSize="12px">{state.profile?.email}</Text>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <ApiProvider {...args}>
      <SignedInAs />
    </ApiProvider>
  ),
  args: {
    url: DEMO_PORTAL_URL,
    apiKey: DEMO_API_KEY,
    initSocket: false,
  },
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText("Alex Morgan")).toBeVisible());
    await expect(canvas.getByText("alex.morgan@example.com")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A child reads the clients through `useApi()` and asks the portal whose key it holds. The story talks to the demo portal; put a portal's URL and API key in the controls to ask a real one.",
      },
      source: {
        code: `const SignedInAs = () => {
  const { profilesApi } = useApi();
  const [me, setMe] = useState<EmployeeFullDto>();

  useEffect(() => {
    profilesApi.getSelfProfile().then(({ data }) => setMe(data.response));
  }, [profilesApi]);

  return <Text>{me?.displayName}</Text>;
};

<ApiProvider url="https://your-portal.example.com" apiKey="your-api-key" initSocket={false}>
  <SignedInAs />
</ApiProvider>`,
      },
    },
  },
};
