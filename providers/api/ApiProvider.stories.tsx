/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
