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

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import ApiProvider from "./ApiProvider";

const meta = {
	title: "Providers/ApiProvider",
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
