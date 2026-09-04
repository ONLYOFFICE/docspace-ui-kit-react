import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import ApiProvider from "./ApiProvider";

const meta = {
	title: "Components/Providers/ApiProvider",
	tags: ["!autodocs"],
	component: ApiProvider,
	parameters: {
		docs: {
			description: {
				component: `Provides API client context to all child components using the DocSpace API SDK.

### Features

- **API Client Instances**: Creates and manages multiple API clients (Profiles, Settings, Folders, Rooms, Files, Groups, Search)
- **Bearer Token Auth**: Configures axios instances with Bearer token authentication
- **React Context**: Exposes API clients via \`useApi()\` hook
- **Memoized Initialization**: API clients are memoized based on URL and API key changes
- **Generic Request Helper**: Includes a reusable \`apiClient.request()\` method for custom API calls

### Usage

\`\`\`tsx
import { ApiProvider, useApi } from "@docspace/ui-kit/providers/api";

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
			description: "Base URL of the DocSpace API server",
		},
		apiKey: {
			control: "text",
			description: "API key used for Bearer token authentication",
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

export const Default: Story = {
	render: (args) => (
		<ApiProvider {...args}>
			<div style={{ padding: "16px" }}>
				<p>
					Children are rendered with access to API clients via the{" "}
					<code>useApi()</code> hook.
				</p>
			</div>
		</ApiProvider>
	),
	args: {
		url: "https://docspace.example.com",
		apiKey: "example-api-key",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Default ApiProvider wrapping child content. Children can access API clients via the useApi() hook.",
			},
			source: {
				code: `<ApiProvider url="https://docspace.example.com" apiKey="your-api-key">
  <App />
</ApiProvider>`,
			},
		},
	},
};
