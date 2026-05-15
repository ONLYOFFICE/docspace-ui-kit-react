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

import ErrorBoundary from "./ErrorBoundary";

const meta = {
	title: "Components/Providers/ErrorProvider",
	tags: ["!autodocs"],
	component: ErrorBoundary,
	parameters: {
		docs: {
			description: {
				component: `ErrorBoundary catches JavaScript errors in its child component tree and renders a fallback UI.

### Features

- **Catches Rendering Errors**: Catches rendering errors in child components
- **Custom Fallback UI**: Supports custom fallback UI via \`fallback\` prop (ReactNode or render function)
- **Error Callback**: \`onError\` callback for error reporting/logging
- **Default Fallback**: Default fallback uses ErrorContainer

### Usage

\`\`\`tsx
import { ErrorBoundary } from "@docspace/ui-kit/providers/error-boundary";

// With default fallback
<ErrorBoundary>
  <App />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={(error) => <div>Error: {error.message}</div>}
  onError={(error, errorInfo) => logError(error, errorInfo)}
>
  <App />
</ErrorBoundary>
\`\`\``,
			},
		},
	},
	argTypes: {
		children: {
			control: false,
			description: "Child components to render inside the error boundary",
		},
		fallback: {
			control: false,
			description:
				"Custom fallback UI as a ReactNode or a render function `(error: Error) => ReactNode`",
		},
		onError: {
			control: false,
			description:
				"Callback fired when an error is caught `(error: Error, errorInfo: ErrorInfo) => void`",
		},
	},
} satisfies Meta<typeof ErrorBoundary>;

type Story = StoryObj<ComponentProps<typeof ErrorBoundary>>;

export default meta;

export const Default: Story = {
	args: {
		children: (
			<div style={{ padding: "16px" }}>
				<p>Children are rendered normally when no error occurs.</p>
			</div>
		),
	},
	parameters: {
		docs: {
			description: {
				story:
					"Default usage where children render normally without any errors.",
			},
			source: {
				code: `<ErrorBoundary>
  <div style={{ padding: "16px" }}>
    <p>Children are rendered normally when no error occurs.</p>
  </div>
</ErrorBoundary>`,
			},
		},
	},
};

const ThrowingComponent = () => {
	throw new Error("Something broke!");
};

export const WithError: Story = {
	args: {
		children: <ThrowingComponent />,
	},
	parameters: {
		docs: {
			description: {
				story:
					"When a child component throws, the default ErrorContainer fallback is rendered.",
			},
			source: {
				code: `const ThrowingComponent = () => {
  throw new Error("Something broke!");
};

<ErrorBoundary>
  <ThrowingComponent />
</ErrorBoundary>`,
			},
		},
	},
};

export const WithCustomFallback: Story = {
	args: {
		fallback: (
			<div style={{ padding: "16px", color: "red" }}>
				<h3>Custom Error UI</h3>
				<p>Something went wrong. Please try again.</p>
			</div>
		),
		children: <ThrowingComponent />,
	},
	parameters: {
		docs: {
			description: {
				story:
					"A custom ReactNode can be provided as fallback for a fully customized error UI.",
			},
			source: {
				code: `<ErrorBoundary
  fallback={
    <div style={{ padding: "16px", color: "red" }}>
      <h3>Custom Error UI</h3>
      <p>Something went wrong. Please try again.</p>
    </div>
  }
>
  <ThrowingComponent />
</ErrorBoundary>`,
			},
		},
	},
};

export const WithRenderFunctionFallback: Story = {
	args: {
		fallback: (error: Error) => (
			<div style={{ padding: "16px", color: "red" }}>
				<h3>Error Details</h3>
				<p>{error.message}</p>
			</div>
		),
		children: <ThrowingComponent />,
	},
	parameters: {
		docs: {
			description: {
				story:
					"A render function receives the caught error, enabling dynamic fallback UI based on the error.",
			},
			source: {
				code: `<ErrorBoundary
  fallback={(error) => (
    <div style={{ padding: "16px", color: "red" }}>
      <h3>Error Details</h3>
      <p>{error.message}</p>
    </div>
  )}
>
  <ThrowingComponent />
</ErrorBoundary>`,
			},
		},
	},
};
